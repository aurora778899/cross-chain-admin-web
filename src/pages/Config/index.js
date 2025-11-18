import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button, Card, Form, Input, Modal, Space, Switch, Table, Tabs, message } from 'antd';
import { useEffect, useState } from 'react';
import { createAffiliateFee, deleteAffiliateFee, fetchAffiliateFees, fetchRoutingConfig, fetchThornameConfig, updateAffiliateFee, updateRoutingConfig, updateThornameConfig } from '@/api/config';
const ConfigPage = () => {
    const [tiers, setTiers] = useState([]);
    const [routing, setRouting] = useState(true);
    const [thorname, setThorname] = useState(null);
    const [loading, setLoading] = useState(false);
    const [modal, setModal] = useState({ visible: false });
    const loadAll = async () => {
        setLoading(true);
        try {
            const [tierData, routingData, thornameData] = await Promise.all([
                fetchAffiliateFees(),
                fetchRoutingConfig(),
                fetchThornameConfig()
            ]);
            setTiers(tierData);
            setRouting(!!routingData?.enforceThorchainOnly);
            setThorname(thornameData);
        }
        catch (err) {
            message.error(err.message || '加载配置失败');
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        loadAll();
    }, []);
    const onTierSubmit = async (values) => {
        try {
            if (modal.record) {
                await updateAffiliateFee(modal.record.id, values);
            }
            else {
                await createAffiliateFee(values);
            }
            message.success('保存成功');
            setModal({ visible: false });
            loadAll();
        }
        catch (err) {
            message.error(err.message || '保存失败');
        }
    };
    const onDeleteTier = (record) => {
        Modal.confirm({
            title: '删除该层级?',
            onOk: async () => {
                await deleteAffiliateFee(record.id);
                message.success('已删除');
                loadAll();
            }
        });
    };
    const onRoutingChange = async (checked) => {
        await updateRoutingConfig(checked);
        message.success('已更新');
        setRouting(checked);
    };
    const onThornameSubmit = async (values) => {
        try {
            await updateThornameConfig(values);
            message.success('Thorname 已更新');
            loadAll();
        }
        catch (err) {
            message.error(err.message || '更新失败');
        }
    };
    const thornameInitial = thorname ?? { thornodeBase: '', affiliate: '', affiliateBps: 0 };
    return (_jsx(Tabs, { defaultActiveKey: "tiers", items: [
            {
                key: 'tiers',
                label: '联盟费分层',
                children: (_jsxs(Card, { loading: loading, extra: _jsx(Button, { onClick: () => setModal({ visible: true }), children: "\u65B0\u589E\u5C42\u7EA7" }), children: [_jsx(Table, { rowKey: "id", dataSource: tiers, pagination: false, columns: [
                                { title: '最小金额', dataIndex: 'minAmount' },
                                { title: '最大金额', dataIndex: 'maxAmount' },
                                { title: 'bps', dataIndex: 'bps' },
                                { title: '排序', dataIndex: 'sortOrder' },
                                {
                                    title: '操作',
                                    render: (_, record) => (_jsxs(Space, { children: [_jsx(Button, { type: "link", onClick: () => setModal({ visible: true, record }), children: "\u7F16\u8F91" }), _jsx(Button, { type: "link", danger: true, onClick: () => onDeleteTier(record), children: "\u5220\u9664" })] }))
                                }
                            ] }), _jsx(Modal, { open: modal.visible, title: modal.record ? '编辑层级' : '新增层级', onCancel: () => setModal({ visible: false }), footer: null, destroyOnClose: true, children: _jsxs(Form, { layout: "vertical", initialValues: modal.record, onFinish: onTierSubmit, preserve: false, children: [_jsx(Form.Item, { name: "minAmount", label: "\u6700\u5C0F\u91D1\u989D", rules: [{ required: true }], children: _jsx(Input, { type: "number" }) }), _jsx(Form.Item, { name: "maxAmount", label: "\u6700\u5927\u91D1\u989D", rules: [{ required: true }], children: _jsx(Input, { type: "number" }) }), _jsx(Form.Item, { name: "bps", label: "\u8D39\u7387(bps)", rules: [{ required: true }], children: _jsx(Input, { type: "number" }) }), _jsx(Form.Item, { name: "sortOrder", label: "\u6392\u5E8F", rules: [{ required: true }], initialValue: tiers.length + 1, children: _jsx(Input, { type: "number" }) }), _jsx(Form.Item, { children: _jsx(Button, { type: "primary", htmlType: "submit", block: true, children: "\u4FDD\u5B58" }) })] }) })] }))
            },
            {
                key: 'routing',
                label: '兑换路由限制',
                children: (_jsx(Card, { loading: loading, children: _jsxs(Space, { size: "large", children: [_jsx("span", { children: "\u4EC5\u5141\u8BB8 THORCHAIN \u8DEF\u7531" }), _jsx(Switch, { checked: routing, onChange: onRoutingChange })] }) }))
            },
            {
                key: 'thorname',
                label: 'Thorname 配置',
                children: (_jsx(Card, { loading: loading, children: _jsxs(Form, { layout: "vertical", initialValues: thornameInitial, onFinish: onThornameSubmit, children: [_jsx(Form.Item, { name: "thornodeBase", label: "Thornode Base", rules: [{ required: true }], children: _jsx(Input, {}) }), _jsx(Form.Item, { name: "affiliate", label: "Affiliate", rules: [{ required: true }], children: _jsx(Input, {}) }), _jsx(Form.Item, { name: "affiliateBps", label: "Affiliate Bps", rules: [{ required: true }], children: _jsx(Input, { type: "number" }) }), _jsx(Form.Item, { children: _jsx(Button, { type: "primary", htmlType: "submit", children: "\u4FDD\u5B58" }) })] }, JSON.stringify(thornameInitial)) }))
            }
        ] }));
};
export default ConfigPage;
