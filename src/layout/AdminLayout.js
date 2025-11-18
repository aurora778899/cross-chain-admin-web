import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Layout, Menu, Dropdown, Space, Typography, theme, Modal, Input, Form, Button, message } from 'antd';
import { DashboardOutlined, SwapOutlined, ShareAltOutlined, AppstoreOutlined, SettingOutlined, FileTextOutlined, LogoutOutlined } from '@ant-design/icons';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { confirmTotp, fetchProfile, logout, resetTotp, setupTotp } from '@/api/auth';
import { useTokenStore } from '@/store/token';
const { Header, Content, Sider } = Layout;
const menuItems = [
    { key: '/dashboard', icon: _jsx(DashboardOutlined, {}), label: '首页' },
    { key: '/swap-record', icon: _jsx(SwapOutlined, {}), label: '兑换记录' },
    { key: '/chain', icon: _jsx(ShareAltOutlined, {}), label: '链管理' },
    { key: '/token', icon: _jsx(AppstoreOutlined, {}), label: '币种管理' },
    { key: '/config', icon: _jsx(SettingOutlined, {}), label: '配置管理' },
    { key: '/operate-log', icon: _jsx(FileTextOutlined, {}), label: '操作日志' }
];
const AdminLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const tokenStore = useTokenStore();
    const { token, user, setUser, clearToken } = tokenStore;
    const [totpModalOpen, setTotpModalOpen] = useState(false);
    const [totpInfo, setTotpInfo] = useState(null);
    const [totpLoading, setTotpLoading] = useState(false);
    const [totpForm] = Form.useForm();
    const { token: { colorBgContainer } } = theme.useToken();
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
        }
        catch (err) {
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
                    content: (_jsx(Input.Password, { placeholder: "\u8BF7\u8F93\u5165\u5F53\u524D\u5BC6\u7801", onChange: (e) => (password = e.target.value) })),
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
            icon: _jsx(LogoutOutlined, {}),
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
        }
        catch (err) {
            message.error(err.message || '生成失败');
        }
        finally {
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
        }
        catch (err) {
            message.error(err.message || '绑定失败');
        }
    };
    const activeKey = menuItems.find((item) => location.pathname.startsWith(item.key))?.key ?? '/dashboard';
    const handleMenuClick = (info) => {
        navigate(info.key);
    };
    return (_jsxs(Layout, { style: { minHeight: '100vh' }, children: [_jsxs(Sider, { breakpoint: "lg", collapsedWidth: "0", children: [_jsx("div", { style: { color: '#fff', padding: 16, fontWeight: 600 }, children: "\u8DE8\u94FE\u6865\u540E\u53F0" }), _jsx(Menu, { theme: "dark", mode: "inline", selectedKeys: [activeKey], items: menuItems, onClick: handleMenuClick })] }), _jsxs(Layout, { children: [_jsx(Header, { style: { background: colorBgContainer, paddingInline: 24, display: 'flex', justifyContent: 'flex-end' }, children: _jsx(Dropdown, { menu: { items: dropdownItems }, placement: "bottomRight", children: _jsx(Space, { style: { cursor: 'pointer' }, children: _jsx(Typography.Text, { children: user?.username ?? '管理员' }) }) }) }), _jsx(Content, { style: { margin: 16 }, children: _jsx("div", { style: { padding: 16, background: colorBgContainer, minHeight: 'calc(100vh - 160px)' }, children: _jsx(Outlet, {}) }) })] }), _jsx(Modal, { open: totpModalOpen, title: "\u7ED1\u5B9A Google \u9A8C\u8BC1\u5668", onCancel: () => {
                    setTotpModalOpen(false);
                    setTotpInfo(null);
                    totpForm.resetFields();
                }, footer: null, children: _jsxs(Form, { form: totpForm, layout: "vertical", children: [_jsx(Form.Item, { name: "password", label: "\u8D26\u6237\u5BC6\u7801", rules: [{ required: true, message: '请输入密码' }], children: _jsx(Input.Password, { placeholder: "\u8BF7\u8F93\u5165\u5F53\u524D\u5BC6\u7801" }) }), _jsx(Button, { type: "primary", block: true, onClick: handleGenerateTotp, loading: totpLoading, children: "\u83B7\u53D6\u4E8C\u7EF4\u7801" }), totpInfo && (_jsxs("div", { style: { marginTop: 16, textAlign: 'center' }, children: [_jsx("img", { src: totpInfo.qrCode, alt: "totp", style: { width: 200, height: 200 } }), _jsx(Typography.Paragraph, { copyable: true, children: totpInfo.secret })] })), _jsx(Form.Item, { name: "code", label: "\u9A8C\u8BC1\u7801", rules: [{ required: true, message: '请输入 6 位验证码' }], children: _jsx(Input, { placeholder: "\u8BF7\u8F93\u5165\u9A8C\u8BC1\u7801", maxLength: 6 }) }), _jsx(Button, { type: "primary", block: true, onClick: handleConfirmTotp, children: "\u786E\u8BA4\u7ED1\u5B9A" })] }) })] }));
};
export default AdminLayout;
