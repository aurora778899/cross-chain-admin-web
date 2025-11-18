import { App as AntApp, ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import Router from './router';

const App = () => (
  <ConfigProvider locale={zhCN} theme={{ token: { colorPrimary: '#1677ff' } }}>
    <AntApp>
      <Router />
    </AntApp>
  </ConfigProvider>
);

export default App;
