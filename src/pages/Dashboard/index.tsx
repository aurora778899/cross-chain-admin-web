import { Card, Col, DatePicker, Row, Space, Statistic, message } from 'antd';
import { Line } from '@ant-design/plots';
import dayjs, { Dayjs } from 'dayjs';
import { useEffect, useState } from 'react';
import { fetchSummary, fetchTrend, type DashboardSummary, type TrendResponse, type TrendPoint } from '@/api/dashboard';

const { RangePicker } = DatePicker;

const DashboardPage = () => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [range, setRange] = useState<[Dayjs, Dayjs]>([dayjs().subtract(6, 'day'), dayjs()]);
  const [trendData, setTrendData] = useState<TrendResponse>({ views: [], swapCount: [], swapAmount: [] });

  const loadSummary = async () => {
    try {
      const data = await fetchSummary(dayjs().format('YYYY-MM-DD'));
      setSummary(data);
    } catch (err: any) {
      message.error(err.message || '加载统计失败');
    }
  };

  const loadTrend = async (start: Dayjs, end: Dayjs) => {
    try {
      const data = await fetchTrend({
        startDate: start.format('YYYY-MM-DD'),
        endDate: end.format('YYYY-MM-DD')
      });
      setTrendData(data);
    } catch (err: any) {
      message.error(err.message || '加载折线数据失败');
    }
  };

  useEffect(() => {
    loadSummary();
    loadTrend(range[0], range[1]);
  }, []);

  const onRangeChange = (values: null | [Dayjs, Dayjs]) => {
    if (values) {
      setRange(values);
      loadTrend(values[0], values[1]);
    }
  };

  const renderLine = (data: TrendPoint[], title: string, field: 'count' | 'amount') => (
    <Card title={title} style={{ marginTop: 16 }}>
      <Line
        data={data.map((item) => ({ ...item, value: item[field] ?? 0 }))}
        xField="date"
        yField="value"
        smooth
        height={280}
        yAxis={{ label: { formatter: (v) => Number(v).toLocaleString() } }}
        tooltip={{ formatter: (datum) => ({ name: title, value: datum.value }) }}
      />
    </Card>
  );

  return (
    <Space direction="vertical" style={{ width: '100%' }} size={16}>
      <Row gutter={16}>
        <Col span={8}>
          <Card>
            <Statistic title="今日浏览" value={summary?.todayViews ?? 0} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="今日兑换次数" value={summary?.todaySwapCount ?? 0} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="今日兑换金额" precision={2} value={summary?.todaySwapAmount ?? 0} suffix="USD" />
          </Card>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={8}>
          <Card>
            <Statistic title="总浏览" value={summary?.totalViews ?? 0} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="总兑换次数" value={summary?.totalSwapCount ?? 0} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="总兑换金额" precision={2} value={summary?.totalSwapAmount ?? 0} suffix="USD" />
          </Card>
        </Col>
      </Row>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <RangePicker value={range} onChange={onRangeChange} allowClear={false} />
      </div>
      {renderLine(trendData.views || [], '每日浏览人数', 'count')}
      {renderLine(trendData.swapCount || [], '每日兑换次数', 'count')}
      {renderLine(trendData.swapAmount || [], '每日兑换金额', 'amount')}
    </Space>
  );
};

export default DashboardPage;
