import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button, Form, Input, Modal, Select, Space, Switch, Table, message } from 'antd';
import { useEffect, useState } from 'react';
import { createChain, deleteChain, fetchChains, updateChain, updateChainStatus } from '@/api/chain';
import PageHeader from '@/components/PageHeader';
const ChainPage = () => {
    const [form] = Form.useForm();
    const [chains, setChains] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
    const [modal, setModal] = useState({ visible: false });
    const loadData = async (page = pagination.current, pageSize = pagination.pageSize) => {
        setLoading(true);
        try {
            const params = { ...form.getFieldsValue(), page, pageSize };
            const data = await fetchChains(params);
            setChains(data.list);
            setPagination({ current: page, pageSize, total: data.total });
        }
        catch (err) {
            message.error(err.message || '加载列表失败');
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        loadData();
    }, []);
    const onSubmit = async (values) => {
        try {
            if (modal.record) {
                await updateChain(modal.record.id, values);
                message.success('更新成功');
            }
            else {
                await createChain(values);
                message.success('新增成功');
            }
            setModal({ visible: false });
            loadData();
        }
        catch (err) {
            message.error(err.message || '保存失败');
        }
    };
    const onStatusChange = async (record, checked) => {
        await updateChainStatus(record.id, checked ? 1 : 0);
        message.success('状态更新成功');
        loadData();
    };
    const onDelete = (record) => {
        Modal.confirm({
            title: '确认删除该链吗?',
            onOk: async () => {
                await deleteChain(record.id);
                message.success('已删除');
                loadData();
            }
        });
    };
    return (_jsxs(Space, { direction: "vertical", style: { width: '100%' }, children: [_jsx(PageHeader, { title: "\u94FE\u7BA1\u7406", extra: _jsx(Button, { type: "primary", onClick: () => setModal({ visible: true }), children: "\u65B0\u589E\u94FE" }) }), _jsxs(Form, { form: form, layout: "inline", onFinish: () => loadData(1, pagination.pageSize), children: [_jsx(Form.Item, { name: "keyword", label: "\u5173\u952E\u8BCD", children: _jsx(Input, { placeholder: "\u540D\u79F0/\u522B\u540D", allowClear: true }) }), _jsx(Form.Item, { name: "status", label: "\u72B6\u6001", children: _jsxs(Select, { allowClear: true, style: { width: 120 }, children: [_jsx(Select.Option, { value: 1, children: "\u542F\u7528" }), _jsx(Select.Option, { value: 0, children: "\u7981\u7528" })] }) }), _jsx(Form.Item, { children: _jsxs(Space, { children: [_jsx(Button, { type: "primary", htmlType: "submit", children: "\u67E5\u8BE2" }), _jsx(Button, { onClick: () => form.resetFields(), children: "\u91CD\u7F6E" })] }) })] }), _jsx(Table, { rowKey: "id", loading: loading, dataSource: chains, pagination: {
                    ...pagination,
                    showTotal: (total) => `共 ${total} 条`,
                    onChange: (page, size) => loadData(page, size)
                }, columns: [
                    { title: '名称', dataIndex: 'name' },
                    { title: '别名', dataIndex: 'aliasName' },
                    { title: '链ID', dataIndex: 'chainId' },
                    { title: 'Explorer', dataIndex: 'explorer' },
                    {
                        title: '状态',
                        dataIndex: 'status',
                        render: (_, record) => (_jsx(Switch, { checked: record.status === 1, onChange: (checked) => onStatusChange(record, checked) }))
                    },
                    {
                        title: '操作',
                        render: (_, record) => (_jsxs(Space, { children: [_jsx(Button, { type: "link", onClick: () => setModal({ visible: true, record }), children: "\u7F16\u8F91" }), _jsx(Button, { type: "link", danger: true, onClick: () => onDelete(record), children: "\u5220\u9664" })] }))
                    }
                ] }), _jsx(Modal, { title: modal.record ? '编辑链' : '新增链', open: modal.visible, onCancel: () => setModal({ visible: false }), footer: null, destroyOnClose: true, children: _jsxs(Form, { layout: "vertical", initialValues: modal.record, onFinish: onSubmit, preserve: false, children: [_jsx(Form.Item, { name: "name", label: "\u540D\u79F0", rules: [{ required: true }], children: _jsx(Input, {}) }), _jsx(Form.Item, { name: "aliasName", label: "\u522B\u540D", rules: [{ required: true }], children: _jsx(Input, {}) }), _jsx(Form.Item, { name: "chainId", label: "\u94FEID", rules: [{ required: true }], children: _jsx(Input, {}) }), _jsx(Form.Item, { name: "logoUri", label: "Logo \u94FE\u63A5", rules: [{ required: true }], children: _jsx(Input, {}) }), _jsx(Form.Item, { name: "explorer", label: "\u533A\u5757\u6D4F\u89C8\u5668", rules: [{ required: true }], children: _jsx(Input, {}) }), _jsx(Form.Item, { name: "depositContract", label: "\u5145\u503C\u5730\u5740", children: _jsx(Input, {}) }), _jsx(Form.Item, { name: "status", label: "\u72B6\u6001", rules: [{ required: true }], initialValue: 1, children: _jsxs(Select, { children: [_jsx(Select.Option, { value: 1, children: "\u542F\u7528" }), _jsx(Select.Option, { value: 0, children: "\u7981\u7528" })] }) }), _jsx(Form.Item, { children: _jsx(Button, { type: "primary", htmlType: "submit", block: true, children: "\u4FDD\u5B58" }) })] }) })] }));
};
export default ChainPage;
