import { jsx as _jsx } from "react/jsx-runtime";
import { Navigate, useRoutes } from 'react-router-dom';
import AdminLayout from '@/layout/AdminLayout';
import LoginPage from '@/pages/Login';
import DashboardPage from '@/pages/Dashboard';
import SwapRecordPage from '@/pages/SwapRecord';
import ChainPage from '@/pages/Chain';
import TokenPage from '@/pages/Token';
import ConfigPage from '@/pages/Config';
import OperateLogPage from '@/pages/OperateLog';
import { useTokenStore } from '@/store/token';
const RequireAuth = () => {
    const token = useTokenStore((state) => state.token);
    if (!token) {
        return _jsx(Navigate, { to: "/login", replace: true });
    }
    return _jsx(AdminLayout, {});
};
const Router = () => {
    const element = useRoutes([
        {
            path: '/login',
            element: _jsx(LoginPage, {})
        },
        {
            path: '/',
            element: _jsx(RequireAuth, {}),
            children: [
                { index: true, element: _jsx(Navigate, { to: "/dashboard", replace: true }) },
                { path: 'dashboard', element: _jsx(DashboardPage, {}) },
                { path: 'swap-record', element: _jsx(SwapRecordPage, {}) },
                { path: 'chain', element: _jsx(ChainPage, {}) },
                { path: 'token', element: _jsx(TokenPage, {}) },
                { path: 'config', element: _jsx(ConfigPage, {}) },
                { path: 'operate-log', element: _jsx(OperateLogPage, {}) }
            ]
        },
        { path: '*', element: _jsx(Navigate, { to: "/dashboard", replace: true }) }
    ]);
    return element;
};
export default Router;
