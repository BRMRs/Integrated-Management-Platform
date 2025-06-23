import React, { useState, useEffect } from 'react';
import { Layout, Menu, Avatar, Dropdown, Space, Badge, Button, message } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  BellOutlined
} from '@ant-design/icons';
import { useAuth, useTodoItems } from '../store';
import { getMenuForRole, roleNames, getRoleColor } from '../utils/permissions';
import { UserRole } from '../types';

const { Header, Sider } = Layout;

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  const { user, logout, isAuthenticated } = useAuth();
  const todoItems = useTodoItems();
  
  // 如果未认证，不渲染布局
  if (!isAuthenticated || !user) {
    return null;
  }

  // 根据用户角色获取菜单
  const menuItems = getMenuForRole(user.role).map(item => ({
    key: item.key,
    icon: item.icon ? React.createElement(item.icon) : null,
    label: item.label,
    children: item.children?.map(child => ({
      key: child.key,
      icon: child.icon ? React.createElement(child.icon) : null,
      label: child.label,
      onClick: child.path ? () => navigate(child.path!) : undefined
    }))
  }));

  // 用户菜单项
  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人资料',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '系统设置',
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      danger: true,
    },
  ];

  const handleMenuClick = ({ key, keyPath }: { key: string; keyPath: string[] }) => {
    // 查找对应的菜单项路径
    const findPath = (items: any[], targetKey: string): string | null => {
      for (const item of items) {
        if (item.key === targetKey && item.path) {
          return item.path;
        }
        if (item.children) {
          const childPath = findPath(item.children, targetKey);
          if (childPath) return childPath;
        }
      }
      return null;
    };

    const menuConfig = getMenuForRole(user.role);
    const path = findPath(menuConfig, key);
    if (path) {
      navigate(path);
    }
  };

  const handleUserMenuClick = ({ key }: { key: string }) => {
    switch (key) {
      case 'logout':
        logout();
        navigate('/login');
        message.success('已成功退出登录');
        break;
      case 'profile':
        // 打开个人资料编辑
        message.info('个人资料功能正在开发中');
        break;
      case 'settings':
        // 打开系统设置
        message.info('系统设置功能正在开发中');
        break;
    }
  };

  // 计算未读通知数量
  const unreadNotifications = todoItems.filter(item => item.status === 'pending').length;

  // 获取当前选中的菜单项
  const getSelectedKeys = () => {
    const path = location.pathname;
    
    // 简化路径匹配逻辑
    if (path === '/' || path === '/dashboard') {
      return ['dashboard'];
    }
    
    // 根据路径匹配菜单项
    const pathMapping: Record<string, string> = {
      '/procurement/potential-projects': 'potential-projects',
      '/procurement/signed-projects': 'signed-projects', 
      '/procurement/suppliers': 'suppliers',
      '/engineering/contracts': 'engineering-contracts',
      '/engineering/documents': 'design-documents',
      '/engineering/progress': 'construction-progress',
      '/engineering/acceptance': 'engineering-acceptance',
      '/sales/my-clients': 'my-clients',
      '/sales/contracts': 'contract-management',
      '/sales/units': 'unit-info',
      '/service/registration': 'company-registration',
      '/service/contract-changes': 'contract-changes',
      '/service/payment-notices': 'payment-notices',
      '/finance/project-expenses': 'project-expenses',
      '/finance/rent-collection': 'rent-collection',
      '/finance/commission': 'commission-settlement',
      '/finance/invoices': 'invoice-management',
      '/finance/reports': 'financial-reports',
      '/reporting/sales-chart': 'sales-chart',
      '/reporting/dashboard': 'business-dashboard',
      '/reporting/project-overview': 'project-overview'
    };

    return [pathMapping[path] || 'dashboard'];
  };

  // 获取打开的菜单项
  const getOpenKeys = () => {
    const path = location.pathname;
    
    if (path.startsWith('/procurement')) return ['procurement'];
    if (path.startsWith('/engineering')) return ['engineering'];
    if (path.startsWith('/sales')) return ['sales'];
    if (path.startsWith('/service')) return ['service'];
    if (path.startsWith('/finance')) return ['finance'];
    if (path.startsWith('/reporting')) return ['reporting'];
    
    return [];
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed} 
        width={220}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <div style={{ 
          height: 64, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          color: 'white',
          fontSize: collapsed ? 14 : 16,
          fontWeight: 'bold',
          borderBottom: '1px solid #1e1e1e',
          padding: '0 16px'
        }}>
          {collapsed ? 'LMS' : '益企云一体化管理平台'}
        </div>
        
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={getSelectedKeys()}
          defaultOpenKeys={getOpenKeys()}
          items={menuItems}
          onClick={handleMenuClick}
          style={{ borderRight: 0 }}
        />
      </Sider>
      
      <Layout style={{ marginLeft: collapsed ? 80 : 220, transition: 'margin-left 0.2s' }}>
        <Header style={{ 
          padding: '0 24px', 
          background: '#fff', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          position: 'sticky',
          top: 0,
          zIndex: 1
        }}>
          <Space>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{ fontSize: 16, width: 40, height: 40 }}
            />
            
            {/* 面包屑导航或页面标题可以在这里添加 */}
          </Space>
          
          <Space size="large">
            {/* 通知铃铛 */}
            <Badge count={unreadNotifications} size="small">
              <Button 
                type="text" 
                icon={<BellOutlined />} 
                style={{ fontSize: 16, width: 40, height: 40 }}
                onClick={() => message.info('通知中心功能正在开发中')}
              />
            </Badge>
            
            {/* 用户信息下拉菜单 */}
            <Dropdown
              menu={{
                items: userMenuItems,
                onClick: handleUserMenuClick,
              }}
              placement="bottomRight"
              trigger={['click']}
            >
              <Space style={{ cursor: 'pointer', padding: '8px 12px', borderRadius: 6 }} className="user-dropdown">
                <Avatar 
                  style={{ 
                    backgroundColor: getRoleColor(user.role),
                    verticalAlign: 'middle' 
                  }} 
                  size="small"
                >
                  {user.name.charAt(0)}
                </Avatar>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 14, fontWeight: 500, lineHeight: 1 }}>
                    {user.name}
                  </span>
                  <span style={{ 
                    fontSize: 12, 
                    color: '#666', 
                    lineHeight: 1,
                    marginTop: 2
                  }}>
                    {roleNames[user.role]}
                  </span>
                </div>
              </Space>
            </Dropdown>
          </Space>
        </Header>
        
        {children}
      </Layout>
      

    </Layout>
  );
};

export default MainLayout; 