import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button, Form, Input, Modal, Select, Space, Switch, Table, message } from 'antd';
import { useEffect, useState } from 'react';
import { createToken, fetchTokens, updateToken, updateTokenStatus } from '@/api/token';
import { fetchEnabledChains } from '@/api/chain';
import PageHeader from '@/components/PageHeader';
const TokenPage = () => {
    const [form] = Form.useForm();
    const [tokens, setTokens] = useState([]);
    const [chains, setChains] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
    const [modal, setModal] = useState({ visible: false });
    const loadChains = async () => {
        const data = await fetchEnabledChains();
        setChains(data);
    };
    const loadData = async (page = pagination.current, pageSize = pagination.pageSize) => {
        setLoading(true);
        try {
            const params = { ...form.getFieldsValue(), page, pageSize };
            const data = await fetchTokens(params);
            setTokens(data.list);
            setPagination({ current: page, pageSize, total: data.total });
        }
        catch (err) {
            message.error(err.message || '加载失败');
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        loadChains();
        loadData();
    }, []);
    const onSubmit = async (values) => {
        try {
            if (modal.record) {
                await updateToken(modal.record.id, values);
                message.success('更新成功');
            }
            else {
                await createToken(values);
                message.success('新增成功');
            }
            setModal({ visible: false });
            loadData();
        }
        catch (err) {
            message.error(err.message || '保存失败');
        }
    };
    const onStatusChange = async (record, status) => {
        await updateTokenStatus(record.id, status ? 1 : 0);
        message.success('状态已更新');
        loadData();
    };
    return (_jsxs(Space, { direction: "vertical", style: { width: '100%' }, children: [_jsx(PageHeader, { title: "\u5E01\u79CD\u7BA1\u7406", extra: _jsx(Button, { type: "primary", onClick: () => setModal({ visible: true }), children: "\u65B0\u589E\u5E01\u79CD" }) }), _jsxs(Form, { form: form, layout: "inline", onFinish: () => loadData(1, pagination.pageSize), children: [_jsx(Form.Item, { name: "chain", label: "\u94FE", children: _jsx(Select, { allowClear: true, style: { width: 160 }, children: chains.map((chain) => (_jsx(Select.Option, { value: chain.name, children: chain.name }, chain.id))) }) }), _jsx(Form.Item, { name: "ticker", label: "Ticker", children: _jsx(Input, { allowClear: true }) }), _jsx(Form.Item, { name: "status", label: "\u72B6\u6001", children: _jsxs(Select, { allowClear: true, style: { width: 120 }, children: [_jsx(Select.Option, { value: 1, children: "\u542F\u7528" }), _jsx(Select.Option, { value: 0, children: "\u7981\u7528" })] }) }), _jsx(Form.Item, { children: _jsxs(Space, { children: [_jsx(Button, { type: "primary", htmlType: "submit", children: "\u67E5\u8BE2" }), _jsx(Button, { onClick: () => form.resetFields(), children: "\u91CD\u7F6E" })] }) })] }), _jsx(Table, { rowKey: "id", loading: loading, dataSource: tokens, pagination: {
                    ...pagination,
                    showTotal: (total) => `共 ${total} 条`,
                    onChange: (page, size) => loadData(page, size)
                }, columns: [
                    { title: '链', dataIndex: 'chain' },
                    { title: 'Ticker', dataIndex: 'ticker' },
                    { title: '合约地址', dataIndex: 'address', ellipsis: true },
                    { title: '名称', dataIndex: 'name' },
                    { title: '精度', dataIndex: 'decimals' },
                    {
                        title: '状态',
                        dataIndex: 'status',
                        render: (_, record) => (_jsx(Switch, { checked: record.status === 1, onChange: (checked) => onStatusChange(record, checked) }))
                    },
                    {
                        title: '操作',
                        render: (_, record) => (_jsx(Button, { type: "link", onClick: () => setModal({ visible: true, record }), children: "\u7F16\u8F91" }))
                    }
                ] }), _jsx(Modal, { title: modal.record ? '编辑币种' : '新增币种', open: modal.visible, onCancel: () => setModal({ visible: false }), footer: null, destroyOnClose: true, children: _jsxs(Form, { layout: "vertical", initialValues: modal.record, onFinish: onSubmit, preserve: false, children: [_jsx(Form.Item, { name: "chain", label: "\u94FE", rules: [{ required: true }], children: _jsx(Select, { children: chains.map((chain) => (_jsx(Select.Option, { value: chain.name, children: chain.name }, chain.name))) }) }), _jsx(Form.Item, { name: "chainId", label: "\u94FEID", children: _jsx(Input, {}) }), _jsx(Form.Item, { name: "ticker", label: "Ticker", rules: [{ required: true }], children: _jsx(Input, {}) }), _jsx(Form.Item, { name: "symbol", label: "Symbol", children: _jsx(Input, {}) }), _jsx(Form.Item, { name: "address", label: "\u5408\u7EA6\u5730\u5740", children: _jsx(Input, {}) }), _jsx(Form.Item, { name: "name", label: "\u540D\u79F0", children: _jsx(Input, {}) }), _jsx(Form.Item, { name: "decimals", label: "\u7CBE\u5EA6", children: _jsx(Input, { type: "number" }) }), _jsx(Form.Item, { name: "logoUri", label: "Logo \u5730\u5740", children: _jsx(Input, {}) }), _jsx(Form.Item, { name: "status", label: "\u72B6\u6001", initialValue: 1, rules: [{ required: true }], children: _jsxs(Select, { children: [_jsx(Select.Option, { value: 1, children: "\u542F\u7528" }), _jsx(Select.Option, { value: 0, children: "\u7981\u7528" })] }) }), _jsx(Form.Item, { children: _jsx(Button, { type: "primary", htmlType: "submit", block: true, children: "\u4FDD\u5B58" }) })] }) })] }));
};
export default TokenPage;
