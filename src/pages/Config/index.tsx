import { Button, Card, Form, Input, Modal, Space, Switch, Table, Tabs, message } from 'antd';
import { useEffect, useState } from 'react';
import {
  createAffiliateFee,
  deleteAffiliateFee,
  fetchAffiliateFees,
  fetchRoutingConfig,
  fetchThornameConfig,
  updateAffiliateFee,
  updateRoutingConfig,
  updateThornameConfig,
  type AffiliateFeeTier,
  type RoutingConfig,
  type ThornameConfig
} from '@/api/config';

const ConfigPage = () => {
  const [tiers, setTiers] = useState<AffiliateFeeTier[]>([]);
  const [routing, setRouting] = useState<boolean>(true);
  const [thorname, setThorname] = useState<ThornameConfig | null>(null);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState<{ visible: boolean; record?: AffiliateFeeTier }>({ visible: false });

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
    } catch (err: any) {
      message.error(err.message || '加载配置失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const onTierSubmit = async (values: AffiliateFeeTier) => {
    try {
      if (modal.record) {
        await updateAffiliateFee(modal.record.id, values);
      } else {
        await createAffiliateFee(values);
      }
      message.success('保存成功');
      setModal({ visible: false });
      loadAll();
    } catch (err: any) {
      message.error(err.message || '保存失败');
    }
  };

  const onDeleteTier = (record: AffiliateFeeTier) => {
    Modal.confirm({
      title: '删除该层级?',
      onOk: async () => {
        await deleteAffiliateFee(record.id);
        message.success('已删除');
        loadAll();
      }
    });
  };

  const onRoutingChange = async (checked: boolean) => {
    await updateRoutingConfig(checked);
    message.success('已更新');
    setRouting(checked);
  };

  const onThornameSubmit = async (values: ThornameConfig) => {
    try {
      await updateThornameConfig(values);
      message.success('Thorname 已更新');
      loadAll();
    } catch (err: any) {
      message.error(err.message || '更新失败');
    }
  };

  const thornameInitial = thorname ?? { thornodeBase: '', affiliate: '', affiliateBps: 0 };

  return (
    <Tabs
      defaultActiveKey="tiers"
      items={[
        {
          key: 'tiers',
          label: '联盟费分层',
          children: (
            <Card loading={loading} extra={<Button onClick={() => setModal({ visible: true })}>新增层级</Button>}>
              <Table
                rowKey="id"
                dataSource={tiers}
                pagination={false}
                columns={[
                  { title: '最小金额', dataIndex: 'minAmount' },
                  { title: '最大金额', dataIndex: 'maxAmount' },
                  { title: 'bps', dataIndex: 'bps' },
                  { title: '排序', dataIndex: 'sortOrder' },
                  {
                    title: '操作',
                    render: (_: unknown, record: AffiliateFeeTier) => (
                      <Space>
                        <Button type="link" onClick={() => setModal({ visible: true, record })}>
                          编辑
                        </Button>
                        <Button type="link" danger onClick={() => onDeleteTier(record)}>
                          删除
                        </Button>
                      </Space>
                    )
                  }
                ]}
              />
              <Modal
                open={modal.visible}
                title={modal.record ? '编辑层级' : '新增层级'}
                onCancel={() => setModal({ visible: false })}
                footer={null}
                destroyOnClose
              >
                <Form layout="vertical" initialValues={modal.record} onFinish={onTierSubmit} preserve={false}>
                  <Form.Item name="minAmount" label="最小金额" rules={[{ required: true }]}>
                    <Input type="number" />
                  </Form.Item>
                  <Form.Item name="maxAmount" label="最大金额" rules={[{ required: true }]}>
                    <Input type="number" />
                  </Form.Item>
                  <Form.Item name="bps" label="费率(bps)" rules={[{ required: true }]}>
                    <Input type="number" />
                  </Form.Item>
                  <Form.Item name="sortOrder" label="排序" rules={[{ required: true }]} initialValue={tiers.length + 1}>
                    <Input type="number" />
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" htmlType="submit" block>
                      保存
                    </Button>
                  </Form.Item>
                </Form>
              </Modal>
            </Card>
          )
        },
        {
          key: 'routing',
          label: '兑换路由限制',
          children: (
            <Card loading={loading}>
              <Space size="large">
                <span>仅允许 THORCHAIN 路由</span>
                <Switch checked={routing} onChange={onRoutingChange} />
              </Space>
            </Card>
          )
        },
        {
          key: 'thorname',
          label: 'Thorname 配置',
          children: (
            <Card loading={loading}>
              <Form
                layout="vertical"
                initialValues={thornameInitial}
                onFinish={onThornameSubmit}
                key={JSON.stringify(thornameInitial)}
              >
                <Form.Item name="thornodeBase" label="Thornode Base" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
                <Form.Item name="affiliate" label="Affiliate" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
                <Form.Item name="affiliateBps" label="Affiliate Bps" rules={[{ required: true }]}>
                  <Input type="number" />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    保存
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          )
        }
      ]}
    />
  );
};

export default ConfigPage;
