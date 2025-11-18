import { Button, Card, Form, Input, Typography, message } from 'antd';
import { login, verifyTotp } from '@/api/auth';
import { useTokenStore } from '@/store/token';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const setToken = useTokenStore((state) => state.setToken);

  const onFinish = async (values: { username: string; password: string; code: string }) => {
    setLoading(true);
    try {
      const loginResp = await login({ username: values.username, password: values.password });
      const totpResp = await verifyTotp(loginResp.pendingToken, values.code);
      setToken(totpResp.token, totpResp.expiresIn);
      message.success('登录成功');
      navigate('/dashboard');
    } catch (err: any) {
      message.error(err.message || '登录失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Card title="跨链桥后台登录" style={{ width: 360 }}>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item name="username" label="账号" rules={[{ required: true, message: '请输入账号' }]}>
            <Input placeholder="用户名" autoComplete="username" />
          </Form.Item>
          <Form.Item name="password" label="密码" rules={[{ required: true, message: '请输入密码' }]}>
            <Input.Password placeholder="密码" autoComplete="current-password" />
          </Form.Item>
          <Form.Item name="code" label="动态验证码" rules={[{ required: true, message: '请输入 Google 验证码' }]}>
            <Input placeholder="6 位验证码" maxLength={6} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              登录
            </Button>
          </Form.Item>
          <Typography.Paragraph type="secondary" style={{ fontSize: 12 }}>
            请确保已绑定 Google Authenticator，否则无法完成登录。
          </Typography.Paragraph>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;
