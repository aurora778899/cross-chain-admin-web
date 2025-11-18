import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button, Form, Input, Modal, Space, Table, DatePicker, Typography, message, Select, Tag } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { fetchSwapRecords, fetchSwapDetail } from '@/api/swap';
import dayjs from 'dayjs';
const { RangePicker } = DatePicker;
const statusColors = {
    PROCESSING: 'blue',
    SUCCESS: 'green',
    FAILED: 'red',
    CANCELLED: 'orange'
};
const SwapRecordPage = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [records, setRecords] = useState([]);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
    const [detail, setDetail] = useState(null);
    const [advanced, setAdvanced] = useState(false);
    const loadData = async (page = pagination.current, pageSize = pagination.pageSize) => {
        setLoading(true);
        try {
            const values = form.getFieldsValue();
            const range = values.timeRange || [];
            const params = {
                page,
                pageSize,
                txHash: values.txHash,
                address: values.address,
                destination: values.destination,
                status: values.status,
                startTime: range[0] ? range[0].format('YYYY-MM-DD HH:mm:ss') : undefined,
                endTime: range[1] ? range[1].format('YYYY-MM-DD HH:mm:ss') : undefined
            };
            const data = await fetchSwapRecords(params);
            setRecords(data.list);
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
        loadData();
    }, []);
    const onDetail = async (record) => {
        try {
            const data = await fetchSwapDetail(record.id);
            setDetail(data);
        }
        catch (err) {
            message.error(err.message || '获取详情失败');
        }
    };
    const maskMiddle = (value, maskLength = 8) => {
        if (!value)
            return '-';
        if (value.length <= maskLength + 4) {
            const head = value.slice(0, 2);
            const tail = value.slice(-2);
            return `${head}${'*'.repeat(Math.max(0, value.length - 4))}${tail}`;
        }
        const head = value.slice(0, 6);
        const tail = value.slice(-6);
        return `${head}${'*'.repeat(maskLength)}${tail}`;
    };
    const detailRows = useMemo(() => {
        if (!detail)
            return [];
        const labels = {
            requestId: '请求ID',
            txHash: '交易哈希',
            address: '交易地址',
            destination: '目标地址',
            provider: '服务商',
            sellChain: '卖出链',
            sellSymbol: '卖出币种',
            buyChain: '买入链',
            buySymbol: '买入币种',
            amount: '卖出数量',
            expectedBuyAmount: '预计买入数量',
            status: '状态',
            referrer: '来源',
            geoCountryName: '国家/地区',
            geoIp: 'IP',
            createdAt: '创建时间',
            updatedAt: '更新时间',
            slippage: '滑点',
            affiliate: '联盟账号',
            sellPriceUsd: '卖出参考价 (USD)',
            buyPriceUsd: '买入参考价 (USD)',
            quoteId: '报价 ID'
        };
        return Object.entries(detail).map(([key, value]) => ({
            key,
            label: labels[key] ?? key,
            value
        }));
    }, [detail]);
    const detailColumns = [
        { title: '字段', dataIndex: 'label', width: 160 },
        {
            title: '值',
            dataIndex: 'value',
            render: (val) => {
                if (val === null || typeof val === 'undefined' || val === '') {
                    return _jsx("span", { children: "-" });
                }
                if (typeof val === 'object') {
                    return (_jsx("pre", { style: { margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }, children: JSON.stringify(val, null, 2) }));
                }
                return String(val);
            }
        }
    ];
    return (_jsxs(Space, { direction: "vertical", style: { width: '100%' }, children: [_jsxs(Form, { form: form, onFinish: () => loadData(1, pagination.pageSize), children: [_jsxs("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }, children: [_jsx("div", { style: { textAlign: 'left', fontWeight: 600 }, children: "\u4EA4\u6613\u5730\u5740" }), _jsx("div", { style: { textAlign: 'left', fontWeight: 600 }, children: "\u72B6\u6001" }), _jsx("div", { style: { textAlign: 'left', fontWeight: 600 }, children: "\u65F6\u95F4" }), _jsx(Form.Item, { name: "address", style: { marginBottom: 8 }, children: _jsx(Input, { allowClear: true, placeholder: "\u4EA4\u6613\u5730\u5740", onPressEnter: () => loadData(1, pagination.pageSize), onBlur: () => loadData(1, pagination.pageSize) }) }), _jsx(Form.Item, { name: "status", style: { marginBottom: 8 }, children: _jsxs(Select, { allowClear: true, placeholder: "\u5168\u90E8\u72B6\u6001", onChange: () => loadData(1, pagination.pageSize), children: [_jsx(Select.Option, { value: "PROCESSING", children: "\u5904\u7406\u4E2D" }), _jsx(Select.Option, { value: "SUCCESS", children: "\u6210\u529F" }), _jsx(Select.Option, { value: "FAILED", children: "\u5931\u8D25" }), _jsx(Select.Option, { value: "CANCELLED", children: "\u5DF2\u53D6\u6D88" })] }) }), _jsx(Form.Item, { name: "timeRange", style: { marginBottom: 8 }, children: _jsx(RangePicker, { showTime: true, style: { width: '100%' }, onChange: () => loadData(1, pagination.pageSize) }) })] }), advanced && (_jsxs("div", { style: { marginTop: 12, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }, children: [_jsx("div", { style: { textAlign: 'left', fontWeight: 600 }, children: "\u76EE\u6807\u5730\u5740" }), _jsx("div", { style: { textAlign: 'left', fontWeight: 600 }, children: "TxHash" }), _jsx(Form.Item, { name: "destination", style: { marginBottom: 8 }, children: _jsx(Input, { allowClear: true, placeholder: "\u76EE\u6807\u5730\u5740", onPressEnter: () => loadData(1, pagination.pageSize), onBlur: () => loadData(1, pagination.pageSize) }) }), _jsx(Form.Item, { name: "txHash", style: { marginBottom: 8 }, children: _jsx(Input, { allowClear: true, placeholder: "\u4EA4\u6613\u54C8\u5E0C", onPressEnter: () => loadData(1, pagination.pageSize), onBlur: () => loadData(1, pagination.pageSize) }) })] })), _jsxs(Space, { style: { marginTop: 12 }, children: [_jsx(Button, { onClick: () => {
                                    form.resetFields();
                                    loadData(1, pagination.pageSize);
                                }, children: "\u91CD\u7F6E" }), _jsx(Button, { type: "link", onClick: () => setAdvanced((prev) => !prev), children: advanced ? '收起筛选' : '展开更多筛选' })] })] }), _jsx(Table, { rowKey: "id", loading: loading, dataSource: records, pagination: {
                    current: pagination.current,
                    pageSize: pagination.pageSize,
                    total: pagination.total,
                    showTotal: (total) => `共 ${total} 条`,
                    onChange: (page, size) => loadData(page, size)
                }, columns: [
                    {
                        title: '交易地址',
                        dataIndex: 'address',
                        render: (val) => val ? (_jsx(Typography.Text, { copyable: { text: val }, children: maskMiddle(val) })) : ('-')
                    },
                    { title: '币对', render: (_, r) => `${r.sellSymbol} → ${r.buySymbol}` },
                    {
                        title: '状态',
                        dataIndex: 'status',
                        render: (status) => _jsx(Tag, { color: statusColors[status] || 'default', children: status })
                    },
                    {
                        title: '数量 / 目标地址',
                        render: (_, record) => (_jsxs("div", { children: [_jsx("div", { children: record.amount ?? '-' }), record.destination ? (_jsxs(Typography.Text, { type: "secondary", style: { fontSize: 12 }, copyable: { text: record.destination }, children: ["\u76EE\u6807\u5730\u5740\uFF1A", maskMiddle(record.destination)] })) : null] }))
                    },
                    {
                        title: '交易金额 ($)',
                        render: (_, record) => {
                            const amount = Number(record.amount);
                            const price = Number(record.sellPriceUsd);
                            if (!Number.isFinite(amount) || !Number.isFinite(price))
                                return '-';
                            const total = amount * price;
                            return `$ ${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
                        }
                    },
                    { title: '创建时间', dataIndex: 'createdAt', render: (val) => (val ? dayjs(val).format('YYYY-MM-DD HH:mm') : '-') },
                    {
                        title: '操作',
                        render: (_, record) => (_jsx(Button, { type: "link", onClick: () => onDetail(record), children: "\u8BE6\u60C5" }))
                    }
                ] }), _jsx(Modal, { open: !!detail, title: "\u5151\u6362\u8BE6\u60C5", onCancel: () => setDetail(null), footer: null, width: 720, children: _jsx(Table, { size: "small", bordered: true, rowKey: "key", columns: detailColumns, dataSource: detailRows, pagination: false, scroll: { y: 360 } }) })] }));
};
export default SwapRecordPage;
