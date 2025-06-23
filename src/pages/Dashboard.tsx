import React, { useEffect } from 'react';
import { Row, Col, Card, Statistic, Progress, List, Badge, Button, Space, Typography, Alert, Spin } from 'antd';
import { 
  ArrowUpOutlined, 
  ArrowDownOutlined, 
  UserOutlined, 
  HomeOutlined,
  DollarOutlined,
  ProjectOutlined,
  AlertOutlined,
  TrophyOutlined,
  CalendarOutlined,
  TeamOutlined
} from '@ant-design/icons';
import { useAuth, useAppStore } from '../store';
import { getDashboardConfig, roleNames } from '../utils/permissions';
import { UserRole } from '../types';
import StatisticCard from '../components/StatisticCard';

const { Title, Text } = Typography;

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { 
    kpiData, 
    fetchKpiData, 
    todoItems, 
    globalLoading 
  } = useAppStore();

  useEffect(() => {
    fetchKpiData();
  }, [fetchKpiData]);

  if (!user) {
    return <div>用户未登录</div>;
  }

  const dashboardConfig = getDashboardConfig(user.role);
  const userTodos = todoItems.filter(todo => todo.assignedTo === user.id);
  const urgentTodos = userTodos.filter(todo => todo.priority === 'high' && todo.status === 'pending');

  // 根据用户角色显示不同的欢迎信息
  const getWelcomeMessage = () => {
    const time = new Date().getHours();
    let greeting = '早上好';
    if (time >= 12 && time < 18) greeting = '下午好';
    if (time >= 18) greeting = '晚上好';
    
    const roleSpecificMessage = {
      [UserRole.ADMIN]: '让我们看看整体运营状况',
      [UserRole.SALES_MANAGER]: '今天又有新的机会等着你',
      [UserRole.PROJECT_DEV]: '有新的项目机会需要跟进',
      [UserRole.ENGINEER]: '施工进度和质量是我们的重点',
      [UserRole.SERVICE_STAFF]: '客户服务是我们的核心竞争力',
      [UserRole.FINANCE]: '财务数据为决策提供支撑',
      [UserRole.OPERATOR]: '运营数据反映业务健康度'
    };

    return `${greeting}，${user.name}！${roleSpecificMessage[user.role]}`;
  };

  // 管理员视图
  const renderAdminDashboard = () => (
    <>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <StatisticCard
            title="园区入住率"
            value={kpiData?.asset.occupancyRate || 0}
            precision={1}
            suffix="%"
            prefix={<HomeOutlined />}
            valueStyle={{ color: '#3f8600' }}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatisticCard
            title="本月净利润"
            value={kpiData?.finance.netProfit || 0}
            precision={0}
            prefix="¥"
            valueStyle={{ color: '#cf1322' }}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatisticCard
            title="在建项目"
            value={kpiData?.project.inProgressProjects || 0}
            prefix={<ProjectOutlined />}
            valueStyle={{ color: '#1890ff' }}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatisticCard
            title="活跃客户"
            value={kpiData?.client.activeClients || 0}
            prefix={<UserOutlined />}
            valueStyle={{ color: '#722ed1' }}
          />
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={12}>
          <Card title="财务概览" extra={<Button type="link">查看详细报表</Button>}>
            <Row gutter={16}>
              <Col span={8}>
                <Statistic
                  title="总收入"
                  value={kpiData?.finance.totalRevenue || 0}
                  precision={0}
                  prefix="¥"
                  valueStyle={{ fontSize: 16 }}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="总支出"
                  value={kpiData?.finance.totalExpense || 0}
                  precision={0}
                  prefix="¥"
                  valueStyle={{ fontSize: 16 }}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="回款率"
                  value={kpiData?.finance.collectionRate || 0}
                  precision={1}
                  suffix="%"
                  valueStyle={{ fontSize: 16 }}
                />
              </Col>
            </Row>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="重要待办" extra={<Badge count={urgentTodos.length} />}>
            <List
              dataSource={urgentTodos.slice(0, 5)}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<AlertOutlined style={{ color: '#ff4d4f' }} />}
                    title={item.title}
                    description={item.description}
                  />
                  <Button size="small" type="primary">处理</Button>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </>
  );

  // 销售经理视图
  const renderSalesManagerDashboard = () => (
    <>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <StatisticCard
            title="本月签约"
            value={kpiData?.client.contractsThisMonth || 0}
            prefix={<TrophyOutlined />}
            valueStyle={{ color: '#3f8600' }}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatisticCard
            title="我的客户"
            value={42} // 这里应该从实际数据获取
            prefix={<UserOutlined />}
            valueStyle={{ color: '#1890ff' }}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatisticCard
            title="待跟进"
            value={userTodos.length}
            prefix={<CalendarOutlined />}
            valueStyle={{ color: '#faad14' }}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatisticCard
            title="本月佣金"
            value={25600}
            prefix="¥"
            valueStyle={{ color: '#52c41a' }}
          />
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={16}>
          <Card title="我的任务" extra={<Button type="primary">查看全部</Button>}>
            <List
              dataSource={userTodos.slice(0, 6)}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <Button key="action" size="small" type="link">
                      处理
                    </Button>
                  ]}
                >
                  <List.Item.Meta
                    title={item.title}
                    description={item.description}
                  />
                  <Badge status={item.priority === 'high' ? 'error' : 'processing'} text={item.priority} />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title="销售排行榜">
            <List
              dataSource={[
                { name: '张三', amount: 156000, rank: 1 },
                { name: '李四', amount: 142000, rank: 2 },
                { name: user.name, amount: 138000, rank: 3 },
              ]}
              renderItem={(item, index) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Badge count={item.rank} style={{ backgroundColor: index === 2 ? '#52c41a' : '#999' }} />}
                    title={item.name}
                    description={`¥${item.amount.toLocaleString()}`}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </>
  );

  // 工程负责人视图
  const renderEngineerDashboard = () => (
    <>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <StatisticCard
            title="在建项目"
            value={kpiData?.project.inProgressProjects || 0}
            prefix={<ProjectOutlined />}
            valueStyle={{ color: '#1890ff' }}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatisticCard
            title="延期项目"
            value={kpiData?.project.delayedProjects || 0}
            prefix={<AlertOutlined />}
            valueStyle={{ color: '#ff4d4f' }}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatisticCard
            title="平均进度"
            value={kpiData?.project.averageProgress || 0}
            precision={1}
            suffix="%"
            valueStyle={{ color: '#52c41a' }}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatisticCard
            title="已完成项目"
            value={kpiData?.project.completedProjects || 0}
            prefix={<TrophyOutlined />}
            valueStyle={{ color: '#722ed1' }}
          />
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24}>
          <Card title="项目进度总览">
            <Row gutter={16}>
              <Col xs={24} md={8}>
                <Card size="small" title="A栋装修项目">
                  <Progress percent={85} status="active" />
                  <Text type="secondary">预计完工：2024年2月15日</Text>
                </Card>
              </Col>
              <Col xs={24} md={8}>
                <Card size="small" title="B栋设计项目">
                  <Progress percent={60} />
                  <Text type="secondary">预计完工：2024年3月10日</Text>
                </Card>
              </Col>
              <Col xs={24} md={8}>
                <Card size="small" title="C栋改造项目">
                  <Progress percent={30} status="exception" />
                  <Text type="danger">延期风险：需要关注</Text>
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </>
  );

  // 财务人员视图
  const renderFinanceDashboard = () => (
    <>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <StatisticCard
            title="应收账款"
            value={kpiData?.finance.receivableAmount || 0}
            prefix="¥"
            valueStyle={{ color: '#faad14' }}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatisticCard
            title="逾期金额"
            value={kpiData?.finance.overdueAmount || 0}
            prefix="¥"
            valueStyle={{ color: '#ff4d4f' }}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatisticCard
            title="本月收入"
            value={kpiData?.finance.receivedAmount || 0}
            prefix="¥"
            valueStyle={{ color: '#52c41a' }}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatisticCard
            title="回款率"
            value={kpiData?.finance.collectionRate || 0}
            precision={1}
            suffix="%"
            valueStyle={{ color: '#1890ff' }}
          />
        </Col>
      </Row>
    </>
  );

  // 通用的简化视图
  const renderBasicDashboard = () => (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={12} lg={8}>
        <StatisticCard
          title="我的待办"
          value={userTodos.length}
          prefix={<CalendarOutlined />}
          valueStyle={{ color: '#1890ff' }}
        />
      </Col>
      <Col xs={24} sm={12} lg={8}>
        <StatisticCard
          title="紧急任务"
          value={urgentTodos.length}
          prefix={<AlertOutlined />}
          valueStyle={{ color: '#ff4d4f' }}
        />
      </Col>
      <Col xs={24} sm={12} lg={8}>
        <StatisticCard
          title="活跃客户"
          value={kpiData?.client.activeClients || 0}
          prefix={<UserOutlined />}
          valueStyle={{ color: '#52c41a' }}
        />
      </Col>
    </Row>
  );

  const renderDashboardContent = () => {
    if (dashboardConfig.showCompanyKPIs) {
      return renderAdminDashboard();
    } else if (dashboardConfig.showPersonalKPIs) {
      return renderSalesManagerDashboard();
    } else if (dashboardConfig.showEngineeringKPIs) {
      return renderEngineerDashboard();
    } else if (dashboardConfig.showFinancialKPIs) {
      return renderFinanceDashboard();
    } else {
      return renderBasicDashboard();
    }
  };

  return (
    <div>
      {/* 欢迎信息 */}
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0 }}>
          {getWelcomeMessage()}
        </Title>
        <Text type="secondary">
          当前身份：{roleNames[user.role]} | 今天是 {new Date().toLocaleDateString('zh-CN', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            weekday: 'long'
          })}
        </Text>
        
        {urgentTodos.length > 0 && (
          <Alert
            message={`您有 ${urgentTodos.length} 个紧急待办事项需要处理`}
            type="warning"
            showIcon
            style={{ marginTop: 16 }}
            action={
              <Button size="small" type="primary">
                立即查看
              </Button>
            }
          />
        )}
      </div>

      {/* 主要内容 */}
      <Spin spinning={globalLoading}>
        {renderDashboardContent()}
      </Spin>

      {/* 快速操作 */}
      <Card 
        title="快速操作" 
        style={{ marginTop: 24 }}
        extra={<Button type="link">更多功能</Button>}
      >
        <Space wrap>
          <Button type="primary" icon={<UserOutlined />}>
            新建客户
          </Button>
          <Button icon={<ProjectOutlined />}>
            创建项目
          </Button>
          <Button icon={<DollarOutlined />}>
            记录收款
          </Button>
          <Button icon={<CalendarOutlined />}>
            添加待办
          </Button>
          <Button icon={<TeamOutlined />}>
            客户跟进
          </Button>
        </Space>
      </Card>
    </div>
  );
};

export default Dashboard; 