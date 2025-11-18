import http from './http';
import type { PageResult } from './types';

export interface SwapRecordItem {
  id: number;
  requestId: string;
  address: string;
  destination?: string;
  sellSymbol: string;
  buySymbol: string;
  status: string;
  amount: string;
  sellPriceUsd?: string;
  createdAt?: string;
}

export const fetchSwapRecords = (params: Record<string, unknown>) =>
  http.get<PageResult<SwapRecordItem>>('/swap-records', { params });

export const fetchSwapDetail = (id: number) => http.get<SwapRecordItem>(`/swap-records/${id}`);
