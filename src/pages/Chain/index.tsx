import { Button, Form, Input, Modal, Select, Space, Switch, Table, message } from 'antd';
import { useEffect, useState } from 'react';
import {
  createChain,
  deleteChain,
  fetchChains,
  updateChain,
  updateChainStatus,
  type ChainItem,
  type ChainPayload
} from '@/api/chain';
import PageHeader from '@/components/PageHeader';

const ChainPage = () => {
  const [form] = Form.useForm();
  const [chains, setChains] = useState<ChainItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [modal, setModal] = useState<{ visible: boolean; record?: ChainItem }>({ visible: false });

  const loadData = async (page = pagination.current, pageSize = pagination.pageSize) => {
    setLoading(true);
    try {
      const params = { ...form.getFieldsValue(), page, pageSize };
      const data = await fetchChains(params);
      setChains(data.list);
      setPagination({ current: page, pageSize, total: data.total });
    } catch (err: any) {
      message.error(err.message || '加载列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onSubmit = async (values: ChainPayload) => {
    try {
      if (modal.record) {
        await updateChain(modal.record.id, values);
        message.success('更新成功');
      } else {
        await createChain(values);
        message.success('新增成功');
      }
      setModal({ visible: false });
      loadData();
    } catch (err: any) {
      message.error(err.message || '保存失败');
    }
  };

  const onStatusChange = async (record: ChainItem, checked: boolean) => {
    await updateChainStatus(record.id, checked ? 1 : 0);
    message.success('状态更新成功');
    loadData();
  };

  const onDelete = (record: ChainItem) => {
    Modal.confirm({
      title: '确认删除该链吗?',
      onOk: async () => {
        await deleteChain(record.id);
        message.success('已删除');
        loadData();
      }
    });
  };

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <PageHeader title="链管理" extra={<Button type="primary" onClick={() => setModal({ visible: true })}>新增链</Button>} />
      <Form form={form} layout="inline" onFinish={() => loadData(1, pagination.pageSize)}>
        <Form.Item name="keyword" label="关键词">
          <Input placeholder="名称/别名" allowClear />
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
      <Table<ChainItem>
        rowKey="id"
        loading={loading}
        dataSource={chains}
        pagination={{
          ...pagination,
          showTotal: (total: number) => `共 ${total} 条`,
          onChange: (page: number, size: number) => loadData(page, size)
        }}
        columns={[
          { title: '名称', dataIndex: 'name' },
          { title: '别名', dataIndex: 'aliasName' },
          { title: '链ID', dataIndex: 'chainId' },
          { title: 'Explorer', dataIndex: 'explorer' },
          {
            title: '状态',
            dataIndex: 'status',
            render: (_: unknown, record: ChainItem) => (
              <Switch checked={record.status === 1} onChange={(checked: boolean) => onStatusChange(record, checked)} />
            )
          },
          {
            title: '操作',
            render: (_: unknown, record: ChainItem) => (
              <Space>
                <Button type="link" onClick={() => setModal({ visible: true, record })}>
                  编辑
                </Button>
                <Button type="link" danger onClick={() => onDelete(record)}>
                  删除
                </Button>
              </Space>
            )
          }
        ]}
      />
      <Modal
        title={modal.record ? '编辑链' : '新增链'}
        open={modal.visible}
        onCancel={() => setModal({ visible: false })}
        footer={null}
        destroyOnClose
      >
        <Form layout="vertical" initialValues={modal.record} onFinish={onSubmit} preserve={false}>
          <Form.Item name="name" label="名称" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="aliasName" label="别名" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="chainId" label="链ID" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="logoUri" label="Logo 链接" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="explorer" label="区块浏览器" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="depositContract" label="充值地址">
            <Input />
          </Form.Item>
          <Form.Item name="status" label="状态" rules={[{ required: true }]} initialValue={1}>
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

export default ChainPage;
