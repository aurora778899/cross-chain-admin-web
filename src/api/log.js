import http from './http';
export const fetchOperateLogs = (params) => http.get('/operate-logs', { params });
