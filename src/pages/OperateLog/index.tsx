import { Form, Input, DatePicker, Select, Space, Button, Table, message } from 'antd';
import { useEffect, useState } from 'react';
import { fetchOperateLogs, type OperateLogItem } from '@/api/log';
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
  const [logs, setLogs] = useState<OperateLogItem[]>([]);
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
    } catch (err: any) {
      message.error(err.message || '加载日志失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Form form={form} layout="inline" onFinish={() => loadData(1, pagination.pageSize)}>
        <Form.Item name="module" label="模块">
          <Input allowClear />
        </Form.Item>
        <Form.Item name="actionType" label="操作类型">
          <Select allowClear style={{ width: 160 }} options={actionOptions} />
        </Form.Item>
        <Form.Item name="operator" label="操作人">
          <Input allowClear />
        </Form.Item>
        <Form.Item name="timeRange" label="时间">
          <RangePicker showTime />
        </Form.Item>
        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button onClick={() => form.resetFields()}>重置</Button>
          </Space>
        </Form.Item>
      </Form>
      <Table<OperateLogItem>
        rowKey="id"
        loading={loading}
        dataSource={logs}
        pagination={{
          ...pagination,
          showTotal: (total: number) => `共 ${total} 条`,
          onChange: (page: number, size: number) => loadData(page, size)
        }}
        columns={[
          { title: '时间', dataIndex: 'createdAt', render: (val: string) => (val ? dayjs(val).format('YYYY-MM-DD HH:mm:ss') : '-') },
          { title: '模块', dataIndex: 'module' },
          { title: '操作类型', dataIndex: 'actionType' },
          { title: '内容', dataIndex: 'content' },
          { title: '操作人', dataIndex: 'operator' },
          { title: 'IP', dataIndex: 'operatorIp' }
        ]}
      />
    </Space>
  );
};

export default OperateLogPage;
