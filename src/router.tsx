import { Navigate, Outlet, useRoutes } from 'react-router-dom';
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
    return <Navigate to="/login" replace />;
  }
  return <AdminLayout />;
};

const Router = () => {
  const element = useRoutes([
    {
      path: '/login',
      element: <LoginPage />
    },
    {
      path: '/',
      element: <RequireAuth />,
      children: [
        { index: true, element: <Navigate to="/dashboard" replace /> },
        { path: 'dashboard', element: <DashboardPage /> },
        { path: 'swap-record', element: <SwapRecordPage /> },
        { path: 'chain', element: <ChainPage /> },
        { path: 'token', element: <TokenPage /> },
        { path: 'config', element: <ConfigPage /> },
        { path: 'operate-log', element: <OperateLogPage /> }
      ]
    },
    { path: '*', element: <Navigate to="/dashboard" replace /> }
  ]);
  return element;
};

export default Router;
