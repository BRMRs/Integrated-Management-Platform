import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, message, Select, Space, Typography, Divider } from 'antd';
import { UserOutlined, LockOutlined, LoginOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../store';
import { mockApi } from '../utils/api';
import { roleNames } from '../utils/permissions';
import { UserRole } from '../types';

const { Title, Text } = Typography;
const { Option } = Select;

const Login: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  // 如果已经登录，跳转到主页
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (values: { username: string; password: string }) => {
    setLoading(true);
    try {
      const success = await login(values.username, values.password);
      if (success) {
        message.success('登录成功！');
        navigate('/dashboard');
      } else {
        message.error('登录失败，请检查用户名和密码');
      }
    } catch (error) {
      message.error('登录过程中发生错误');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  // 快速登录选项
  const quickLoginOptions = [
    { username: 'admin', password: 'admin', role: UserRole.ADMIN, name: '系统管理员' },
    { username: 'sales', password: 'sales', role: UserRole.SALES_MANAGER, name: '销售经理' },
    { username: 'finance', password: 'finance', role: UserRole.FINANCE, name: '财务人员' },
    { username: 'engineer', password: 'engineer', role: UserRole.ENGINEER, name: '工程负责人' },
    { username: 'service', password: 'service', role: UserRole.SERVICE_STAFF, name: '企服专员' },
    { username: 'project', password: 'project', role: UserRole.PROJECT_DEV, name: '项目开发员' },
    { username: 'operator', password: 'operator', role: UserRole.OPERATOR, name: '运营人员' }
  ];

  const handleQuickLogin = (option: typeof quickLoginOptions[0]) => {
    form.setFieldsValue({
      username: option.username,
      password: option.password
    });
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <Card
        style={{
          width: '100%',
          maxWidth: 480,
          borderRadius: 16,
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          border: 'none'
        }}
        bodyStyle={{ padding: 40 }}
      >
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            fontSize: 32,
            color: 'white'
          }}>
            <LoginOutlined />
          </div>
          <Title level={2} style={{ margin: 0, color: '#1a1a1a' }}>
            双重生命周期管理系统
          </Title>
          <Text type="secondary" style={{ fontSize: 16 }}>
            Dual Lifecycle Management System
          </Text>
        </div>

        <Form
          form={form}
          name="login"
          onFinish={handleLogin}
          autoComplete="off"
          size="large"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名!' }]}
          >
            <Input
              prefix={<UserOutlined style={{ color: '#999' }} />}
              placeholder="用户名"
              style={{ borderRadius: 8 }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码!' }]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#999' }} />}
              placeholder="密码"
              style={{ borderRadius: 8 }}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              style={{
                width: '100%',
                height: 48,
                borderRadius: 8,
                fontSize: 16,
                fontWeight: 500,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none'
              }}
            >
              登录
            </Button>
          </Form.Item>
        </Form>

        <Divider>快速登录测试</Divider>

        <div style={{ marginTop: 24 }}>
          <Text type="secondary" style={{ display: 'block', marginBottom: 12 }}>
            选择角色快速登录：
          </Text>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', 
            gap: 8 
          }}>
            {quickLoginOptions.map((option) => (
              <Button
                key={option.username}
                size="small"
                                 type="default"
                onClick={() => handleQuickLogin(option)}
                style={{
                  borderRadius: 6,
                  height: 32,
                  fontSize: 12,
                  borderColor: '#d9d9d9'
                }}
              >
                {option.name}
              </Button>
            ))}
          </div>
          
          <div style={{ marginTop: 16, padding: 12, background: '#f9f9f9', borderRadius: 6 }}>
            <Text type="secondary" style={{ fontSize: 12 }}>
              <strong>提示：</strong>这是演示环境，各角色的用户名和密码相同（如：admin/admin）。
              不同角色将看到不同的菜单和功能权限。
            </Text>
          </div>
        </div>

        <div style={{ 
          marginTop: 32, 
          textAlign: 'center', 
          paddingTop: 16, 
          borderTop: '1px solid #f0f0f0' 
        }}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            © 2025 益企云一体化管理平台
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default Login; 