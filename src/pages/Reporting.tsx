import React, { useState } from 'react';
import { Card, Row, Col, Tabs, Button, Space } from 'antd';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { EyeOutlined, DownloadOutlined } from '@ant-design/icons';

const Reporting: React.FC = () => {
  const [activeTab, setActiveTab] = useState('occupancy');

  // 模拟数据
  const occupancyData = [
    { name: 'A栋', total: 40, rented: 35, vacant: 5 },
    { name: 'B栋', total: 35, rented: 28, vacant: 7 },
    { name: 'C栋', total: 45, rented: 35, vacant: 10 },
  ];

  const revenueData = [
    { month: '1月', revenue: 1200000, cost: 800000, profit: 400000 },
    { month: '2月', revenue: 1350000, cost: 850000, profit: 500000 },
    { month: '3月', revenue: 1100000, cost: 750000, profit: 350000 },
    { month: '4月', revenue: 1400000, cost: 900000, profit: 500000 },
    { month: '5月', revenue: 1250000, cost: 820000, profit: 430000 },
    { month: '6月', revenue: 1500000, cost: 950000, profit: 550000 },
  ];

  const roomStatusData = [
    { name: '已租', value: 98, color: '#52c41a' },
    { name: '空置', value: 22, color: '#faad14' },
    { name: '装修中', value: 8, color: '#1890ff' },
  ];

  const COLORS = ['#52c41a', '#faad14', '#1890ff'];

  const tabItems = [
    {
      key: 'occupancy',
      label: '销控图',
      children: (
        <div>
          <div style={{ marginBottom: 16 }}>
            <Space>
              <Button type="primary" icon={<EyeOutlined />}>
                查看平面图
              </Button>
              <Button icon={<DownloadOutlined />}>
                导出数据
              </Button>
            </Space>
          </div>
          
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Card title="各栋楼出租情况" size="small">
                <BarChart width={400} height={300} data={occupancyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="rented" fill="#52c41a" name="已租" />
                  <Bar dataKey="vacant" fill="#faad14" name="空置" />
                </BarChart>
              </Card>
            </Col>
            <Col span={12}>
              <Card title="房间状态分布" size="small">
                <PieChart width={400} height={300}>
                  <Pie
                    data={roomStatusData}
                    cx={200}
                    cy={150}
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {roomStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </Card>
            </Col>
          </Row>
        </div>
      ),
    },
    {
      key: 'business',
      label: '业务数据大屏',
      children: (
        <div>
          <Card title="收入成本利润趋势" size="small">
            <LineChart width={800} height={400} data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#52c41a" name="收入" />
              <Line type="monotone" dataKey="cost" stroke="#faad14" name="成本" />
              <Line type="monotone" dataKey="profit" stroke="#1890ff" name="利润" />
            </LineChart>
          </Card>
        </div>
      ),
    },
    {
      key: 'gantt',
      label: '甘特图中心',
      children: (
        <div>
          <Card title="项目进度甘特图" size="small">
            <div style={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5' }}>
              <p>甘特图组件将在这里显示项目进度</p>
            </div>
          </Card>
        </div>
      ),
    },
    {
      key: 'custom',
      label: '自定义报表',
      children: (
        <div>
          <Card title="自定义报表" size="small">
            <div style={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5' }}>
              <p>自定义报表功能将在这里实现</p>
            </div>
          </Card>
        </div>
      ),
    },
  ];

  return (
    <div>
      <h1 style={{ marginBottom: 24 }}>数据可视化中心</h1>
      
      <Card>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
        />
      </Card>
    </div>
  );
};

export default Reporting; 