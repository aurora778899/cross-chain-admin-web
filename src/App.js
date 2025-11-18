import { jsx as _jsx } from "react/jsx-runtime";
import { App as AntApp, ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import Router from './router';
const App = () => (_jsx(ConfigProvider, { locale: zhCN, theme: { token: { colorPrimary: '#1677ff' } }, children: _jsx(AntApp, { children: _jsx(Router, {}) }) }));
export default App;
