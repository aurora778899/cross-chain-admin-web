import http from './http';
export const fetchSwapRecords = (params) => http.get('/swap-records', { params });
export const fetchSwapDetail = (id) => http.get(`/swap-records/${id}`);
