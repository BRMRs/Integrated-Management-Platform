import React, { useState } from 'react';
import { Card, Table, Button, Tag, Space, Modal, Form, Input, Select, Upload, Progress } from 'antd';
import { PlusOutlined, EyeOutlined, UploadOutlined } from '@ant-design/icons';

const { Option } = Select;

interface Project {
  id: string;
  name: string;
  roomNumber: string;
  status: 'planning' | 'designing' | 'construction' | 'completed';
  manager: string;
  progress: number;
  budget: number;
  spent: number;
}

const ProjectCost: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  // 模拟项目数据
  const projects: Project[] = [
    {
      id: '1',
      name: 'A栋101室装修项目',
      roomNumber: 'A-101',
      status: 'construction',
      manager: '张三',
      progress: 65,
      budget: 500000,
      spent: 325000,
    },
    {
      id: '2',
      name: 'B栋203室装修项目',
      roomNumber: 'B-203',
      status: 'designing',
      manager: '李四',
      progress: 30,
      budget: 300000,
      spent: 90000,
    },
    {
      id: '3',
      name: 'C栋105室装修项目',
      roomNumber: 'C-105',
      status: 'completed',
      manager: '王五',
      progress: 100,
      budget: 400000,
      spent: 400000,
    },
  ];

  const getStatusColor = (status: string) => {
    const colors = {
      planning: 'default',
      designing: 'processing',
      construction: 'warning',
      completed: 'success',
    };
    return colors[status as keyof typeof colors] || 'default';
  };

  const getStatusText = (status: string) => {
    const texts = {
      planning: '规划中',
      designing: '设计中',
      construction: '施工中',
      completed: '已完工',
    };
    return texts[status as keyof typeof texts] || status;
  };

  const columns = [
    {
      title: '项目名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '房号',
      dataIndex: 'roomNumber',
      key: 'roomNumber',
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
      title: '负责人',
      dataIndex: 'manager',
      key: 'manager',
    },
    {
      title: '进度',
      dataIndex: 'progress',
      key: 'progress',
      render: (progress: number) => (
        <Progress percent={progress} size="small" />
      ),
    },
    {
      title: '预算/已花费',
      key: 'budget',
      render: (record: Project) => (
        <span>
          {record.spent.toLocaleString()} / {record.budget.toLocaleString()} 元
        </span>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (record: Project) => (
        <Space size="middle">
          <Button type="link" icon={<EyeOutlined />}>
            查看详情
          </Button>
        </Space>
      ),
    },
  ];

  const handleCreateProject = () => {
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    form.validateFields().then((values) => {
      console.log('新建项目:', values);
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h1>项目成本管理</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateProject}>
          新建项目
        </Button>
      </div>

      <Card>
        <Table
          columns={columns}
          dataSource={projects}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
        />
      </Card>

      <Modal
        title="新建项目"
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="项目名称"
            rules={[{ required: true, message: '请输入项目名称' }]}
          >
            <Input placeholder="请输入项目名称" />
          </Form.Item>
          
          <Form.Item
            name="roomNumber"
            label="关联房号"
            rules={[{ required: true, message: '请输入关联房号' }]}
          >
            <Input placeholder="请输入关联房号" />
          </Form.Item>
          
          <Form.Item
            name="manager"
            label="负责人"
            rules={[{ required: true, message: '请选择负责人' }]}
          >
            <Select placeholder="请选择负责人">
              <Option value="张三">张三</Option>
              <Option value="李四">李四</Option>
              <Option value="王五">王五</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="budget"
            label="预算金额"
            rules={[{ required: true, message: '请输入预算金额' }]}
          >
            <Input type="number" placeholder="请输入预算金额" suffix="元" />
          </Form.Item>
          
          <Form.Item
            name="status"
            label="项目状态"
            rules={[{ required: true, message: '请选择项目状态' }]}
          >
            <Select placeholder="请选择项目状态">
              <Option value="planning">规划中</Option>
              <Option value="designing">设计中</Option>
              <Option value="construction">施工中</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProjectCost; 