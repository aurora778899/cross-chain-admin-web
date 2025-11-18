import { Layout, Menu, Dropdown, Space, Typography, theme, Modal, Input, Form, Button, message } from 'antd';
import {
  DashboardOutlined,
  SwapOutlined,
  ShareAltOutlined,
  AppstoreOutlined,
  SettingOutlined,
  FileTextOutlined,
  LogoutOutlined
} from '@ant-design/icons';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState, ChangeEvent } from 'react';
import { confirmTotp, fetchProfile, logout, resetTotp, setupTotp } from '@/api/auth';
import { useTokenStore } from '@/store/token';

const { Header, Content, Sider } = Layout;

const menuItems = [
  { key: '/dashboard', icon: <DashboardOutlined />, label: '首页' },
  { key: '/swap-record', icon: <SwapOutlined />, label: '兑换记录' },
  { key: '/chain', icon: <ShareAltOutlined />, label: '链管理' },
  { key: '/token', icon: <AppstoreOutlined />, label: '币种管理' },
  { key: '/config', icon: <SettingOutlined />, label: '配置管理' },
  { key: '/operate-log', icon: <FileTextOutlined />, label: '操作日志' }
];

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const tokenStore = useTokenStore();
  const { token, user, setUser, clearToken } = tokenStore;
  const [totpModalOpen, setTotpModalOpen] = useState(false);
  const [totpInfo, setTotpInfo] = useState<{ secret: string; qrCode: string } | null>(null);
  const [totpLoading, setTotpLoading] = useState(false);
  const [totpForm] = Form.useForm();
  const {
    token: { colorBgContainer }
  } = theme.useToken();

  useEffect(() => {
    if (!user && token) {
      fetchProfile()
        .then((data) => setUser(data))
        .catch(() => undefined);
    }
  }, [token, user, setUser]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      // ignore
    }
    clearToken();
    navigate('/login');
  };

  const dropdownItems = [
    {
      key: 'totp',
      label: '绑定 Google 验证器',
      onClick: () => setTotpModalOpen(true)
    },
    {
      key: 'totp-reset',
      label: '重置验证器',
      onClick: () => {
        let password = '';
        Modal.confirm({
          title: '重置验证器',
          content: (
            <Input.Password
              placeholder="请输入当前密码"
              onChange={(e: ChangeEvent<HTMLInputElement>) => (password = e.target.value)}
            />
          ),
          onOk: async () => {
            if (!password) {
              message.error('请输入密码');
              return Promise.reject();
            }
            await resetTotp(password);
            message.success('已重置');
          }
        });
      }
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: handleLogout
    }
  ];

  const handleGenerateTotp = async () => {
    try {
      setTotpLoading(true);
      const password = totpForm.getFieldValue('password');
      if (!password) {
        message.warning('请输入密码');
        return;
      }
      const info = await setupTotp(password);
      setTotpInfo(info);
      message.success('已生成密钥');
    } catch (err: any) {
      message.error(err.message || '生成失败');
    } finally {
      setTotpLoading(false);
    }
  };

  const handleConfirmTotp = async () => {
    try {
      const code = totpForm.getFieldValue('code');
      if (!totpInfo) {
        message.warning('请先生成二维码');
        return;
      }
      await confirmTotp(totpInfo.secret, code);
      message.success('绑定成功');
      setTotpModalOpen(false);
      setTotpInfo(null);
      totpForm.resetFields();
    } catch (err: any) {
      message.error(err.message || '绑定失败');
    }
  };

  const activeKey = menuItems.find((item) => location.pathname.startsWith(item.key))?.key ?? '/dashboard';

  const handleMenuClick = (info: { key: string }) => {
    navigate(info.key);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider breakpoint="lg" collapsedWidth="0">
        <div style={{ color: '#fff', padding: 16, fontWeight: 600 }}>跨链桥后台</div>
        <Menu theme="dark" mode="inline" selectedKeys={[activeKey]} items={menuItems} onClick={handleMenuClick} />
      </Sider>
      <Layout>
        <Header style={{ background: colorBgContainer, paddingInline: 24, display: 'flex', justifyContent: 'flex-end' }}>
          <Dropdown menu={{ items: dropdownItems }} placement="bottomRight">
            <Space style={{ cursor: 'pointer' }}>
              <Typography.Text>{user?.username ?? '管理员'}</Typography.Text>
            </Space>
          </Dropdown>
        </Header>
        <Content style={{ margin: 16 }}>
          <div style={{ padding: 16, background: colorBgContainer, minHeight: 'calc(100vh - 160px)' }}>
            <Outlet />
          </div>
        </Content>
      </Layout>
      <Modal
        open={totpModalOpen}
        title="绑定 Google 验证器"
        onCancel={() => {
          setTotpModalOpen(false);
          setTotpInfo(null);
          totpForm.resetFields();
        }}
        footer={null}
      >
        <Form form={totpForm} layout="vertical">
          <Form.Item name="password" label="账户密码" rules={[{ required: true, message: '请输入密码' }]}>
            <Input.Password placeholder="请输入当前密码" />
          </Form.Item>
          <Button type="primary" block onClick={handleGenerateTotp} loading={totpLoading}>
            获取二维码
          </Button>
          {totpInfo && (
            <div style={{ marginTop: 16, textAlign: 'center' }}>
              <img src={totpInfo.qrCode} alt="totp" style={{ width: 200, height: 200 }} />
              <Typography.Paragraph copyable>{totpInfo.secret}</Typography.Paragraph>
            </div>
          )}
          <Form.Item name="code" label="验证码" rules={[{ required: true, message: '请输入 6 位验证码' }]}>
            <Input placeholder="请输入验证码" maxLength={6} />
          </Form.Item>
          <Button type="primary" block onClick={handleConfirmTotp}>
            确认绑定
          </Button>
        </Form>
      </Modal>
    </Layout>
  );
};

export default AdminLayout;
