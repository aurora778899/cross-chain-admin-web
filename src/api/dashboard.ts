import http from './http';

export interface DashboardSummary {
  todayViews: number;
  todaySwapCount: number;
  todaySwapAmount: number;
  totalViews: number;
  totalSwapCount: number;
  totalSwapAmount: number;
}

export interface TrendPoint {
  date: string;
  count?: number;
  amount?: number;
}

export interface TrendResponse {
  views: TrendPoint[];
  swapCount: TrendPoint[];
  swapAmount: TrendPoint[];
}

export const fetchSummary = (date?: string) => http.get<DashboardSummary>('/dashboard/summary', { params: { date } });

export const fetchTrend = (params: { startDate?: string; endDate?: string }) =>
  http.get<TrendResponse>('/dashboard/trend', { params });
