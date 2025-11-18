import http from './http';
import type { PageResult } from './types';

export interface ChainItem {
  id: number;
  name: string;
  aliasName: string;
  chainId: string;
  explorer: string;
  logoUri?: string;
  depositContract?: string;
  status: number;
}

export type ChainPayload = Omit<ChainItem, 'id'>;

export const fetchChains = (params: Record<string, unknown>) => http.get<PageResult<ChainItem>>('/chains', { params });

export const fetchEnabledChains = () => http.get<ChainItem[]>('/chains/enabled');

export const createChain = (data: ChainPayload) => http.post<void>('/chains', data);

export const updateChain = (id: number, data: ChainPayload) => http.put<void>(`/chains/${id}`, data);

export const updateChainStatus = (id: number, status: number) => http.put<void>(`/chains/${id}/status`, { status });

export const deleteChain = (id: number) => http.delete<void>(`/chains/${id}`);
