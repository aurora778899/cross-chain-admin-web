import http from './http';
import type { PageResult } from './types';

export interface TokenItem {
  id: number;
  chain: string;
  chainId?: string;
  ticker: string;
  symbol?: string;
  address?: string;
  name?: string;
  decimals?: number;
  logoUri?: string;
  status: number;
}

export type TokenPayload = Omit<TokenItem, 'id'>;

export const fetchTokens = (params: Record<string, unknown>) => http.get<PageResult<TokenItem>>('/tokens', { params });

export const createToken = (data: TokenPayload) => http.post<void>('/tokens', data);

export const updateToken = (id: number, data: TokenPayload) => http.put<void>(`/tokens/${id}`, data);

export const updateTokenStatus = (id: number, status: number) => http.put<void>(`/tokens/${id}/status`, { status });
