import { Button, Form, Input, Modal, Space, Table, DatePicker, Typography, message, Select, Tag } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { fetchSwapRecords, fetchSwapDetail, type SwapRecordItem } from '@/api/swap';
import dayjs from 'dayjs';
import type { ColumnsType } from 'antd/es/table';

const { RangePicker } = DatePicker;

const statusColors: Record<string, string> = {
  PROCESSING: 'blue',
  SUCCESS: 'green',
  FAILED: 'red',
  CANCELLED: 'orange'
};

const SwapRecordPage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [records, setRecords] = useState<SwapRecordItem[]>([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [detail, setDetail] = useState<SwapRecordItem | null>(null);
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
    } catch (err: any) {
      message.error(err.message || '加载失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onDetail = async (record: SwapRecordItem) => {
    try {
      const data = await fetchSwapDetail(record.id);
      setDetail(data);
    } catch (err: any) {
      message.error(err.message || '获取详情失败');
    }
  };

  const maskMiddle = (value?: string, maskLength = 8) => {
    if (!value) return '-';
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
    if (!detail) return [];
    const labels: Record<string, string> = {
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

  const detailColumns: ColumnsType<{ key: string; label: string; value: unknown }> = [
    { title: '字段', dataIndex: 'label', width: 160 },
    {
      title: '值',
      dataIndex: 'value',
      render: (val: unknown) => {
        if (val === null || typeof val === 'undefined' || val === '') {
          return <span>-</span>;
        }
        if (typeof val === 'object') {
          return (
            <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
              {JSON.stringify(val, null, 2)}
            </pre>
          );
        }
        return String(val);
      }
    }
  ];

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Form form={form} onFinish={() => loadData(1, pagination.pageSize)}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          <div style={{ textAlign: 'left', fontWeight: 600 }}>交易地址</div>
          <div style={{ textAlign: 'left', fontWeight: 600 }}>状态</div>
          <div style={{ textAlign: 'left', fontWeight: 600 }}>时间</div>

          <Form.Item name="address" style={{ marginBottom: 8 }}>
            <Input
              allowClear
              placeholder="交易地址"
              onPressEnter={() => loadData(1, pagination.pageSize)}
              onBlur={() => loadData(1, pagination.pageSize)}
            />
          </Form.Item>
          <Form.Item name="status" style={{ marginBottom: 8 }}>
            <Select
              allowClear
              placeholder="全部状态"
              onChange={() => loadData(1, pagination.pageSize)}
            >
              <Select.Option value="PROCESSING">处理中</Select.Option>
              <Select.Option value="SUCCESS">成功</Select.Option>
              <Select.Option value="FAILED">失败</Select.Option>
              <Select.Option value="CANCELLED">已取消</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="timeRange" style={{ marginBottom: 8 }}>
            <RangePicker
              showTime
              style={{ width: '100%' }}
              onChange={() => loadData(1, pagination.pageSize)}
            />
          </Form.Item>
        </div>

        {advanced && (
          <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
            <div style={{ textAlign: 'left', fontWeight: 600 }}>目标地址</div>
            <div style={{ textAlign: 'left', fontWeight: 600 }}>TxHash</div>
            <Form.Item name="destination" style={{ marginBottom: 8 }}>
              <Input
                allowClear
                placeholder="目标地址"
                onPressEnter={() => loadData(1, pagination.pageSize)}
                onBlur={() => loadData(1, pagination.pageSize)}
              />
            </Form.Item>
            <Form.Item name="txHash" style={{ marginBottom: 8 }}>
              <Input
                allowClear
                placeholder="交易哈希"
                onPressEnter={() => loadData(1, pagination.pageSize)}
                onBlur={() => loadData(1, pagination.pageSize)}
              />
            </Form.Item>
          </div>
        )}

        <Space style={{ marginTop: 12 }}>
          <Button
            onClick={() => {
              form.resetFields();
              loadData(1, pagination.pageSize);
            }}
          >
            重置
          </Button>
          <Button type="link" onClick={() => setAdvanced((prev) => !prev)}>
            {advanced ? '收起筛选' : '展开更多筛选'}
          </Button>
        </Space>
      </Form>
      <Table<SwapRecordItem>
        rowKey="id"
        loading={loading}
        dataSource={records}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showTotal: (total: number) => `共 ${total} 条`,
          onChange: (page: number, size: number) => loadData(page, size)
        }}
        columns={[
          {
            title: '交易地址',
            dataIndex: 'address',
            render: (val?: string) =>
              val ? (
                <Typography.Text copyable={{ text: val }}>
                  {maskMiddle(val)}
                </Typography.Text>
              ) : (
                '-'
              )
          },
          { title: '币对', render: (_: unknown, r: SwapRecordItem) => `${r.sellSymbol} → ${r.buySymbol}` },
          {
            title: '状态',
            dataIndex: 'status',
            render: (status: string) => <Tag color={statusColors[status] || 'default'}>{status}</Tag>
          },
          {
            title: '数量 / 目标地址',
            render: (_: unknown, record: SwapRecordItem) => (
              <div>
                <div>{record.amount ?? '-'}</div>
                {record.destination ? (
                  <Typography.Text
                    type="secondary"
                    style={{ fontSize: 12 }}
                    copyable={{ text: record.destination }}
                  >
                    目标地址：{maskMiddle(record.destination)}
                  </Typography.Text>
                ) : null}
              </div>
            )
          },
          {
            title: '交易金额 ($)',
            render: (_: unknown, record: SwapRecordItem) => {
              const amount = Number(record.amount);
              if (!Number.isFinite(amount)) return '-';
              const sellSymbol = record.sellSymbol?.toUpperCase();
              const isStable = sellSymbol === 'USDT' || sellSymbol === 'USDC';
              const price = Number(record.sellPriceUsd);
              if (!isStable && !Number.isFinite(price)) return '-';
              const total = isStable ? amount : amount * price;
              return `$ ${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
            }
          },
          { title: '创建时间', dataIndex: 'createdAt', render: (val?: string) => (val ? dayjs(val).format('YYYY-MM-DD HH:mm') : '-') },
          {
            title: '操作',
            render: (_: unknown, record: SwapRecordItem) => (
              <Button type="link" onClick={() => onDetail(record)}>
                详情
              </Button>
            )
          }
        ]}
      />
      <Modal open={!!detail} title="兑换详情" onCancel={() => setDetail(null)} footer={null} width={720}>
        <Table
          size="small"
          bordered
          rowKey="key"
          columns={detailColumns}
          dataSource={detailRows}
          pagination={false}
          scroll={{ y: 360 }}
        />
      </Modal>
    </Space>
  );
};

export default SwapRecordPage;
