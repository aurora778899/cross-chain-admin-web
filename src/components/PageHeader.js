import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Space, Typography } from 'antd';
const PageHeader = ({ title, extra }) => (_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }, children: [_jsx(Typography.Title, { level: 4, style: { margin: 0 }, children: title }), _jsx(Space, { children: extra })] }));
export default PageHeader;
