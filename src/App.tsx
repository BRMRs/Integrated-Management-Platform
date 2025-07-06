import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout, ConfigProvider, message } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import MainLayout from './layouts/MainLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProjectCost from './pages/ProjectCost';
import ClientContract from './pages/ClientContract';
import FinanceRevenue from './pages/FinanceRevenue';
import Reporting from './pages/Reporting';
import PotentialProjects from './pages/PotentialProjects';
import SignedProjects from './pages/SignedProjects';
import { useAuth } from './store';

const { Content } = Layout;

// 受保护的路由组件
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const App: React.FC = () => {
  const { setUser, isAuthenticated } = useAuth();

  // 应用启动时检查本地存储中的用户信息
  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setUser(user);
        message.success(`欢迎回来，${user.name}！`);
      } catch (error) {
        console.error('Failed to parse saved user:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, [setUser]);

  return (
    <ConfigProvider locale={zhCN}>
      <Router>
        <Routes>
          {/* 登录页面 */}
          <Route 
            path="/login" 
            element={
              isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
            } 
          />
          
          {/* 受保护的路由 */}
          <Route 
            path="/*" 
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Content style={{ padding: '24px', background: '#f0f2f5', minHeight: 'calc(100vh - 64px)' }}>
                    <Routes>
                      {/* 默认重定向到Dashboard */}
                      <Route path="/" element={<Navigate to="/dashboard" replace />} />
                      
                      {/* 主控台 */}
                      <Route path="/dashboard" element={<Dashboard />} />
                      
                      {/* 采购与项目开发 */}
                      <Route path="/procurement/potential-projects" element={<PotentialProjects />} />
                      <Route path="/procurement/signed-projects" element={<SignedProjects />} />
                      <Route path="/procurement/suppliers" element={<div>供应商管理</div>} />
                      
                      {/* 工程管理 */}
                      <Route path="/engineering/contracts" element={<div>工程合同管理</div>} />
                      <Route path="/engineering/documents" element={<div>设计图纸库</div>} />
                      <Route path="/engineering/progress" element={<div>施工进度跟踪</div>} />
                      <Route path="/engineering/acceptance" element={<div>工程验收</div>} />
                      
                      {/* 客户与销售 */}
                      <Route path="/sales/my-clients" element={<div>我的客户</div>} />
                      <Route path="/sales/contracts" element={<ClientContract />} />
                      <Route path="/sales/units" element={<div>房号信息库</div>} />
                      
                      {/* 客户服务 */}
                      <Route path="/service/registration" element={<div>公司注册跟进</div>} />
                      <Route path="/service/contract-changes" element={<div>签约变更管理</div>} />
                      <Route path="/service/payment-notices" element={<div>缴款通知</div>} />
                      
                      {/* 财务中心 */}
                      <Route path="/finance/project-expenses" element={<ProjectCost />} />
                      <Route path="/finance/rent-collection" element={<FinanceRevenue />} />
                      <Route path="/finance/commission" element={<div>佣金结算</div>} />
                      <Route path="/finance/invoices" element={<div>票据管理</div>} />
                      <Route path="/finance/reports" element={<div>财务报表</div>} />
                      
                      {/* 数据驾驶舱 */}
                      <Route path="/reporting/sales-chart" element={<div>销控图</div>} />
                      <Route path="/reporting/dashboard" element={<div>业务数据大屏</div>} />
                      <Route path="/reporting/project-overview" element={<Reporting />} />
                      
                      {/* 兼容旧路由 */}
                      <Route path="/project-cost" element={<Navigate to="/finance/project-expenses" replace />} />
                      <Route path="/client-contract" element={<Navigate to="/sales/contracts" replace />} />
                      <Route path="/finance-revenue" element={<Navigate to="/finance/rent-collection" replace />} />
                      <Route path="/reporting" element={<Navigate to="/reporting/project-overview" replace />} />
                      
                      {/* 404页面 */}
                      <Route path="*" element={<div style={{ padding: '50px', textAlign: 'center' }}>
                        <h2>页面不存在</h2>
                        <p>请检查URL或联系管理员</p>
                      </div>} />
                    </Routes>
                  </Content>
                </MainLayout>
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </ConfigProvider>
  );
};

export default App; 