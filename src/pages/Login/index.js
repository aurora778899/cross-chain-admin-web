import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button, Card, Form, Input, Typography, message } from 'antd';
import { login, verifyTotp } from '@/api/auth';
import { useTokenStore } from '@/store/token';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
const LoginPage = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const setToken = useTokenStore((state) => state.setToken);
    const onFinish = async (values) => {
        setLoading(true);
        try {
            const loginResp = await login({ username: values.username, password: values.password });
            const totpResp = await verifyTotp(loginResp.pendingToken, values.code);
            setToken(totpResp.token, totpResp.expiresIn);
            message.success('登录成功');
            navigate('/dashboard');
        }
        catch (err) {
            message.error(err.message || '登录失败');
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsx("div", { style: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }, children: _jsx(Card, { title: "\u8DE8\u94FE\u6865\u540E\u53F0\u767B\u5F55", style: { width: 360 }, children: _jsxs(Form, { layout: "vertical", onFinish: onFinish, children: [_jsx(Form.Item, { name: "username", label: "\u8D26\u53F7", rules: [{ required: true, message: '请输入账号' }], children: _jsx(Input, { placeholder: "\u7528\u6237\u540D", autoComplete: "username" }) }), _jsx(Form.Item, { name: "password", label: "\u5BC6\u7801", rules: [{ required: true, message: '请输入密码' }], children: _jsx(Input.Password, { placeholder: "\u5BC6\u7801", autoComplete: "current-password" }) }), _jsx(Form.Item, { name: "code", label: "\u52A8\u6001\u9A8C\u8BC1\u7801", rules: [{ required: true, message: '请输入 Google 验证码' }], children: _jsx(Input, { placeholder: "6 \u4F4D\u9A8C\u8BC1\u7801", maxLength: 6 }) }), _jsx(Form.Item, { children: _jsx(Button, { type: "primary", htmlType: "submit", block: true, loading: loading, children: "\u767B\u5F55" }) }), _jsx(Typography.Paragraph, { type: "secondary", style: { fontSize: 12 }, children: "\u8BF7\u786E\u4FDD\u5DF2\u7ED1\u5B9A Google Authenticator\uFF0C\u5426\u5219\u65E0\u6CD5\u5B8C\u6210\u767B\u5F55\u3002" })] }) }) }));
};
export default LoginPage;
