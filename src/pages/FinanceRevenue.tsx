import React, { useState } from 'react';
import { Card, Table, Button, Tag, Space, Tabs, Statistic, Row, Col } from 'antd';
import { DollarOutlined, SendOutlined, CheckOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

interface Payment {
  id: string;
  clientName: string;
  roomNumber: string;
  amount: number;
  dueDate: string;
  status: 'pending' | 'paid' | 'overdue';
  type: 'rent' | 'deposit' | 'commission';
}

const FinanceRevenue: React.FC = () => {
  const [activeTab, setActiveTab] = useState('pending');

  // 模拟收款数据
  const payments: Payment[] = [
    {
      id: '1',
      clientName: '科技有限公司',
      roomNumber: 'A-101',
      amount: 50000,
      dueDate: '2024-01-15',
      status: 'pending',
      type: 'rent',
    },
    {
      id: '2',
      clientName: '贸易公司',
      roomNumber: 'B-203',
      amount: 30000,
      dueDate: '2024-01-10',
      status: 'overdue',
      type: 'rent',
    },
    {
      id: '3',
      clientName: '李四',
      roomNumber: 'C-105',
      amount: 20000,
      dueDate: '2024-01-20',
      status: 'paid',
      type: 'deposit',
    },
  ];

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'processing',
      paid: 'success',
      overdue: 'error',
    };
    return colors[status as keyof typeof colors] || 'default';
  };

  const getStatusText = (status: string) => {
    const texts = {
      pending: '待收款',
      paid: '已收款',
      overdue: '逾期',
    };
    return texts[status as keyof typeof texts] || status;
  };

  const getTypeText = (type: string) => {
    const texts = {
      rent: '租金',
      deposit: '押金',
      commission: '佣金',
    };
    return texts[type as keyof typeof texts] || type;
  };

  const columns = [
    {
      title: '客户名称',
      dataIndex: 'clientName',
      key: 'clientName',
    },
    {
      title: '房号',
      dataIndex: 'roomNumber',
      key: 'roomNumber',
    },
    {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => `¥${amount.toLocaleString()}`,
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => getTypeText(type),
    },
    {
      title: '到期日',
      dataIndex: 'dueDate',
      key: 'dueDate',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (record: Payment) => (
        <Space size="middle">
          {record.status === 'pending' && (
            <Button type="link" icon={<SendOutlined />}>
              发送缴费单
            </Button>
          )}
          {record.status === 'pending' && (
            <Button type="link" icon={<CheckOutlined />}>
              确认收款
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const pendingPayments = payments.filter(p => p.status === 'pending');
  const overduePayments = payments.filter(p => p.status === 'overdue');
  const paidPayments = payments.filter(p => p.status === 'paid');

  const totalReceivable = payments
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalOverdue = payments
    .filter(p => p.status === 'overdue')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalReceived = payments
    .filter(p => p.status === 'paid')
    .reduce((sum, p) => sum + p.amount, 0);

  const tabItems = [
    {
      key: 'pending',
      label: `待收款 (${pendingPayments.length})`,
      children: (
        <Table
          columns={columns}
          dataSource={pendingPayments}
          rowKey="id"
          pagination={false}
        />
      ),
    },
    {
      key: 'overdue',
      label: `逾期 (${overduePayments.length})`,
      children: (
        <Table
          columns={columns}
          dataSource={overduePayments}
          rowKey="id"
          pagination={false}
        />
      ),
    },
    {
      key: 'history',
      label: '收款历史',
      children: (
        <Table
          columns={columns}
          dataSource={paidPayments}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
        />
      ),
    },
  ];

  return (
    <div>
      <h1 style={{ marginBottom: 24 }}>项目收入管理</h1>

      {/* 财务看板 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="本月应收"
              value={totalReceivable}
              precision={0}
              valueStyle={{ color: '#3f8600' }}
              prefix={<DollarOutlined />}
              suffix="元"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="逾期金额"
              value={totalOverdue}
              precision={0}
              valueStyle={{ color: '#cf1322' }}
              prefix={<ExclamationCircleOutlined />}
              suffix="元"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="本月实收"
              value={totalReceived}
              precision={0}
              valueStyle={{ color: '#1890ff' }}
              prefix={<DollarOutlined />}
              suffix="元"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="收款率"
              value={((totalReceived / (totalReceivable + totalReceived)) * 100).toFixed(1)}
              precision={1}
              valueStyle={{ color: '#722ed1' }}
              suffix="%"
            />
          </Card>
        </Col>
      </Row>

      {/* 收款管理 */}
      <Card title="收款管理">
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
        />
      </Card>
    </div>
  );
};

export default FinanceRevenue; 