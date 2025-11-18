import { ReactNode } from 'react';
import { Space, Typography } from 'antd';

interface Props {
  title: string;
  extra?: ReactNode;
}

const PageHeader = ({ title, extra }: Props) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
    <Typography.Title level={4} style={{ margin: 0 }}>
      {title}
    </Typography.Title>
    <Space>{extra}</Space>
  </div>
);

export default PageHeader;
