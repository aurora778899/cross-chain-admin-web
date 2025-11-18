import http from './http';
import type { PageResult } from './types';

export interface OperateLogItem {
  id: number;
  module: string;
  actionType: string;
  content: string;
  operator: string;
  operatorIp?: string;
  createdAt: string;
}

export const fetchOperateLogs = (params: Record<string, unknown>) =>
  http.get<PageResult<OperateLogItem>>('/operate-logs', { params });
