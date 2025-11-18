import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Form, Input, DatePicker, Select, Space, Button, Table, message } from 'antd';
import { useEffect, useState } from 'react';
import { fetchOperateLogs } from '@/api/log';
import dayjs from 'dayjs';
const { RangePicker } = DatePicker;
const actionOptions = [
    { label: '新增', value: 'CREATE' },
    { label: '修改', value: 'UPDATE' },
    { label: '删除', value: 'DELETE' },
    { label: '登录', value: 'LOGIN' }
];
const OperateLogPage = () => {
    const [form] = Form.useForm();
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
    const loadData = async (page = pagination.current, pageSize = pagination.pageSize) => {
        setLoading(true);
        try {
            const values = form.getFieldsValue();
            const range = values.timeRange || [];
            const params = {
                page,
                pageSize,
                module: values.module,
                actionType: values.actionType,
                operator: values.operator,
                startTime: range[0] ? range[0].format('YYYY-MM-DD HH:mm:ss') : undefined,
                endTime: range[1] ? range[1].format('YYYY-MM-DD HH:mm:ss') : undefined
            };
            const data = await fetchOperateLogs(params);
            setLogs(data.list);
            setPagination({ current: page, pageSize, total: data.total });
        }
        catch (err) {
            message.error(err.message || '加载日志失败');
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        loadData();
    }, []);
    return (_jsxs(Space, { direction: "vertical", style: { width: '100%' }, children: [_jsxs(Form, { form: form, layout: "inline", onFinish: () => loadData(1, pagination.pageSize), children: [_jsx(Form.Item, { name: "module", label: "\u6A21\u5757", children: _jsx(Input, { allowClear: true }) }), _jsx(Form.Item, { name: "actionType", label: "\u64CD\u4F5C\u7C7B\u578B", children: _jsx(Select, { allowClear: true, style: { width: 160 }, options: actionOptions }) }), _jsx(Form.Item, { name: "operator", label: "\u64CD\u4F5C\u4EBA", children: _jsx(Input, { allowClear: true }) }), _jsx(Form.Item, { name: "timeRange", label: "\u65F6\u95F4", children: _jsx(RangePicker, { showTime: true }) }), _jsx(Form.Item, { children: _jsxs(Space, { children: [_jsx(Button, { type: "primary", htmlType: "submit", children: "\u67E5\u8BE2" }), _jsx(Button, { onClick: () => form.resetFields(), children: "\u91CD\u7F6E" })] }) })] }), _jsx(Table, { rowKey: "id", loading: loading, dataSource: logs, pagination: {
                    ...pagination,
                    showTotal: (total) => `共 ${total} 条`,
                    onChange: (page, size) => loadData(page, size)
                }, columns: [
                    { title: '时间', dataIndex: 'createdAt', render: (val) => (val ? dayjs(val).format('YYYY-MM-DD HH:mm:ss') : '-') },
                    { title: '模块', dataIndex: 'module' },
                    { title: '操作类型', dataIndex: 'actionType' },
                    { title: '内容', dataIndex: 'content' },
                    { title: '操作人', dataIndex: 'operator' },
                    { title: 'IP', dataIndex: 'operatorIp' }
                ] })] }));
};
export default OperateLogPage;
