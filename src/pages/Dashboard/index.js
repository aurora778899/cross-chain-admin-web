import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card, Col, DatePicker, Row, Space, Statistic, message } from 'antd';
import { Line } from '@ant-design/plots';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { fetchSummary, fetchTrend } from '@/api/dashboard';
const { RangePicker } = DatePicker;
const DashboardPage = () => {
    const [summary, setSummary] = useState(null);
    const [range, setRange] = useState([dayjs().subtract(6, 'day'), dayjs()]);
    const [trendData, setTrendData] = useState({ views: [], swapCount: [], swapAmount: [] });
    const loadSummary = async () => {
        try {
            const data = await fetchSummary(dayjs().format('YYYY-MM-DD'));
            setSummary(data);
        }
        catch (err) {
            message.error(err.message || '加载统计失败');
        }
    };
    const loadTrend = async (start, end) => {
        try {
            const data = await fetchTrend({
                startDate: start.format('YYYY-MM-DD'),
                endDate: end.format('YYYY-MM-DD')
            });
            setTrendData(data);
        }
        catch (err) {
            message.error(err.message || '加载折线数据失败');
        }
    };
    useEffect(() => {
        loadSummary();
        loadTrend(range[0], range[1]);
    }, []);
    const onRangeChange = (values) => {
        if (values) {
            setRange(values);
            loadTrend(values[0], values[1]);
        }
    };
    const renderLine = (data, title, field) => (_jsx(Card, { title: title, style: { marginTop: 16 }, children: _jsx(Line, { data: data.map((item) => ({ ...item, value: item[field] ?? 0 })), xField: "date", yField: "value", smooth: true, height: 280, yAxis: { label: { formatter: (v) => Number(v).toLocaleString() } }, tooltip: { formatter: (datum) => ({ name: title, value: datum.value }) } }) }));
    return (_jsxs(Space, { direction: "vertical", style: { width: '100%' }, size: 16, children: [_jsxs(Row, { gutter: 16, children: [_jsx(Col, { span: 8, children: _jsx(Card, { children: _jsx(Statistic, { title: "\u4ECA\u65E5\u6D4F\u89C8", value: summary?.todayViews ?? 0 }) }) }), _jsx(Col, { span: 8, children: _jsx(Card, { children: _jsx(Statistic, { title: "\u4ECA\u65E5\u5151\u6362\u6B21\u6570", value: summary?.todaySwapCount ?? 0 }) }) }), _jsx(Col, { span: 8, children: _jsx(Card, { children: _jsx(Statistic, { title: "\u4ECA\u65E5\u5151\u6362\u91D1\u989D", precision: 2, value: summary?.todaySwapAmount ?? 0, suffix: "USD" }) }) })] }), _jsxs(Row, { gutter: 16, children: [_jsx(Col, { span: 8, children: _jsx(Card, { children: _jsx(Statistic, { title: "\u603B\u6D4F\u89C8", value: summary?.totalViews ?? 0 }) }) }), _jsx(Col, { span: 8, children: _jsx(Card, { children: _jsx(Statistic, { title: "\u603B\u5151\u6362\u6B21\u6570", value: summary?.totalSwapCount ?? 0 }) }) }), _jsx(Col, { span: 8, children: _jsx(Card, { children: _jsx(Statistic, { title: "\u603B\u5151\u6362\u91D1\u989D", precision: 2, value: summary?.totalSwapAmount ?? 0, suffix: "USD" }) }) })] }), _jsx("div", { style: { display: 'flex', justifyContent: 'flex-end' }, children: _jsx(RangePicker, { value: range, onChange: onRangeChange, allowClear: false }) }), renderLine(trendData.views || [], '每日浏览人数', 'count'), renderLine(trendData.swapCount || [], '每日兑换次数', 'count'), renderLine(trendData.swapAmount || [], '每日兑换金额', 'amount')] }));
};
export default DashboardPage;
