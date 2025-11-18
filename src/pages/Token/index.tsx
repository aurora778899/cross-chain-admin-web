import { Button, Form, Input, Modal, Select, Space, Switch, Table, message } from 'antd';
import { useEffect, useState } from 'react';
import {
  createToken,
  fetchTokens,
  updateToken,
  updateTokenStatus,
  type TokenItem,
  type TokenPayload
} from '@/api/token';
import { fetchEnabledChains, type ChainItem } from '@/api/chain';
import PageHeader from '@/components/PageHeader';

const TokenPage = () => {
  const [form] = Form.useForm();
  const [tokens, setTokens] = useState<TokenItem[]>([]);
  const [chains, setChains] = useState<ChainItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [modal, setModal] = useState<{ visible: boolean; record?: TokenItem }>({ visible: false });

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
    } catch (err: any) {
      message.error(err.message || '加载失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChains();
    loadData();
  }, []);

  const onSubmit = async (values: TokenPayload) => {
    try {
      if (modal.record) {
        await updateToken(modal.record.id, values);
        message.success('更新成功');
      } else {
        await createToken(values);
        message.success('新增成功');
      }
      setModal({ visible: false });
      loadData();
    } catch (err: any) {
      message.error(err.message || '保存失败');
    }
  };

  const onStatusChange = async (record: TokenItem, status: boolean) => {
    await updateTokenStatus(record.id, status ? 1 : 0);
    message.success('状态已更新');
    loadData();
  };

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <PageHeader title="币种管理" extra={<Button type="primary" onClick={() => setModal({ visible: true })}>新增币种</Button>} />
      <Form form={form} layout="inline" onFinish={() => loadData(1, pagination.pageSize)}>
        <Form.Item name="chain" label="链">
          <Select allowClear style={{ width: 160 }}>
            {chains.map((chain) => (
              <Select.Option key={chain.id} value={chain.name}>
                {chain.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="ticker" label="Ticker">
          <Input allowClear />
        </Form.Item>
        <Form.Item name="status" label="状态">
          <Select allowClear style={{ width: 120 }}>
            <Select.Option value={1}>启用</Select.Option>
            <Select.Option value={0}>禁用</Select.Option>
          </Select>
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
      <Table<TokenItem>
        rowKey="id"
        loading={loading}
        dataSource={tokens}
        pagination={{
          ...pagination,
          showTotal: (total: number) => `共 ${total} 条`,
          onChange: (page: number, size: number) => loadData(page, size)
        }}
        columns={[
          { title: '链', dataIndex: 'chain' },
          { title: 'Ticker', dataIndex: 'ticker' },
          { title: '合约地址', dataIndex: 'address', ellipsis: true },
          { title: '名称', dataIndex: 'name' },
          { title: '精度', dataIndex: 'decimals' },
          {
            title: '状态',
            dataIndex: 'status',
            render: (_: unknown, record: TokenItem) => (
              <Switch checked={record.status === 1} onChange={(checked: boolean) => onStatusChange(record, checked)} />
            )
          },
          {
            title: '操作',
            render: (_: unknown, record: TokenItem) => (
              <Button type="link" onClick={() => setModal({ visible: true, record })}>
                编辑
              </Button>
            )
          }
        ]}
      />
      <Modal
        title={modal.record ? '编辑币种' : '新增币种'}
        open={modal.visible}
        onCancel={() => setModal({ visible: false })}
        footer={null}
        destroyOnClose
      >
        <Form layout="vertical" initialValues={modal.record} onFinish={onSubmit} preserve={false}>
          <Form.Item name="chain" label="链" rules={[{ required: true }]}>
            <Select>
              {chains.map((chain) => (
                <Select.Option key={chain.name} value={chain.name}>
                  {chain.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="chainId" label="链ID">
            <Input />
          </Form.Item>
          <Form.Item name="ticker" label="Ticker" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="symbol" label="Symbol">
            <Input />
          </Form.Item>
          <Form.Item name="address" label="合约地址">
            <Input />
          </Form.Item>
          <Form.Item name="name" label="名称">
            <Input />
          </Form.Item>
          <Form.Item name="decimals" label="精度">
            <Input type="number" />
          </Form.Item>
          <Form.Item name="logoUri" label="Logo 地址">
            <Input />
          </Form.Item>
          <Form.Item name="status" label="状态" initialValue={1} rules={[{ required: true }]}>
            <Select>
              <Select.Option value={1}>启用</Select.Option>
              <Select.Option value={0}>禁用</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              保存
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Space>
  );
};

export default TokenPage;
