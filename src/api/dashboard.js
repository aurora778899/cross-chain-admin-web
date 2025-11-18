import http from './http';
export const fetchSummary = (date) => http.get('/dashboard/summary', { params: { date } });
export const fetchTrend = (params) => http.get('/dashboard/trend', { params });
