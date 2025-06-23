import React, { useState } from 'react';
import { Card, Table, Button, Tag, Space, Modal, Form, Input, Select, DatePicker, Upload } from 'antd';
import { PlusOutlined, EyeOutlined, FileTextOutlined } from '@ant-design/icons';

const { Option } = Select;
const { RangePicker } = DatePicker;

interface Client {
  id: string;
  name: string;
  type: 'company' | 'individual';
  contact: string;
  phone: string;
  status: 'following' | 'pending' | 'signed' | 'terminated';
  followUpDate: string;
  contractCount: number;
}

const ClientContract: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  // 模拟客户数据
  const clients: Client[] = [
    {
      id: '1',
      name: '科技有限公司',
      type: 'company',
      contact: '张经理',
      phone: '13800138000',
      status: 'signed',
      followUpDate: '2024-01-15',
      contractCount: 2,
    },
    {
      id: '2',
      name: '李四',
      type: 'individual',
      contact: '李四',
      phone: '13900139000',
      status: 'pending',
      followUpDate: '2024-01-20',
      contractCount: 0,
    },
    {
      id: '3',
      name: '贸易公司',
      type: 'company',
      contact: '王总',
      phone: '13700137000',
      status: 'following',
      followUpDate: '2024-01-25',
      contractCount: 1,
    },
  ];

  const getStatusColor = (status: string) => {
    const colors = {
      following: 'processing',
      pending: 'warning',
      signed: 'success',
      terminated: 'error',
    };
    return colors[status as keyof typeof colors] || 'default';
  };

  const getStatusText = (status: string) => {
    const texts = {
      following: '跟进中',
      pending: '待签约',
      signed: '已签约',
      terminated: '已解约',
    };
    return texts[status as keyof typeof texts] || status;
  };

  const columns = [
    {
      title: '客户名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '客户类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Tag color={type === 'company' ? 'blue' : 'green'}>
          {type === 'company' ? '企业' : '个人'}
        </Tag>
      ),
    },
    {
      title: '联系人',
      dataIndex: 'contact',
      key: 'contact',
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
      key: 'phone',
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
      title: '下次跟进',
      dataIndex: 'followUpDate',
      key: 'followUpDate',
    },
    {
      title: '合同数量',
      dataIndex: 'contractCount',
      key: 'contractCount',
    },
    {
      title: '操作',
      key: 'action',
      render: (record: Client) => (
        <Space size="middle">
          <Button type="link" icon={<EyeOutlined />}>
            查看档案
          </Button>
          <Button type="link" icon={<FileTextOutlined />}>
            合同管理
          </Button>
        </Space>
      ),
    },
  ];

  const handleCreateClient = () => {
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    form.validateFields().then((values) => {
      console.log('新建客户:', values);
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
        <h1>客户签约管理</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateClient}>
          新增客户
        </Button>
      </div>

      <Card>
        <Table
          columns={columns}
          dataSource={clients}
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
        title="新增客户"
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="type"
            label="客户类型"
            rules={[{ required: true, message: '请选择客户类型' }]}
          >
            <Select placeholder="请选择客户类型">
              <Option value="company">企业</Option>
              <Option value="individual">个人</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="name"
            label="客户名称"
            rules={[{ required: true, message: '请输入客户名称' }]}
          >
            <Input placeholder="请输入客户名称" />
          </Form.Item>
          
          <Form.Item
            name="contact"
            label="联系人"
            rules={[{ required: true, message: '请输入联系人' }]}
          >
            <Input placeholder="请输入联系人" />
          </Form.Item>
          
          <Form.Item
            name="phone"
            label="联系电话"
            rules={[{ required: true, message: '请输入联系电话' }]}
          >
            <Input placeholder="请输入联系电话" />
          </Form.Item>
          
          <Form.Item
            name="followUpDate"
            label="下次跟进时间"
            rules={[{ required: true, message: '请选择跟进时间' }]}
          >
            <DatePicker style={{ width: '100%' }} placeholder="请选择跟进时间" />
          </Form.Item>
          
          <Form.Item
            name="status"
            label="客户状态"
            rules={[{ required: true, message: '请选择客户状态' }]}
          >
            <Select placeholder="请选择客户状态">
              <Option value="following">跟进中</Option>
              <Option value="pending">待签约</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ClientContract; 