import http from './http';

export interface AffiliateFeeTier {
  id: number;
  minAmount: number;
  maxAmount: number;
  bps: number;
  sortOrder: number;
}

export interface RoutingConfig {
  enforceThorchainOnly: boolean;
}

export interface ThornameConfig {
  thornodeBase: string;
  affiliate: string;
  affiliateBps: number;
}

export const fetchAffiliateFees = () => http.get<AffiliateFeeTier[]>('/config/affiliate-fees');

type AffiliateFeePayload = Omit<AffiliateFeeTier, 'id'>;

export const createAffiliateFee = (data: AffiliateFeePayload) => http.post<void>('/config/affiliate-fees', data);

export const updateAffiliateFee = (id: number, data: AffiliateFeePayload) => http.put<void>(`/config/affiliate-fees/${id}`, data);

export const deleteAffiliateFee = (id: number) => http.delete<void>(`/config/affiliate-fees/${id}`);

export const fetchRoutingConfig = () => http.get<RoutingConfig>('/config/routing');

export const updateRoutingConfig = (enforceThorchainOnly: boolean) =>
  http.put<void>('/config/routing', { enforceThorchainOnly });

export const fetchThornameConfig = () => http.get<ThornameConfig>('/config/thorname');

export const updateThornameConfig = (data: ThornameConfig) => http.put<void>('/config/thorname', data);
