import http from './http';
export const fetchTokens = (params) => http.get('/tokens', { params });
export const createToken = (data) => http.post('/tokens', data);
export const updateToken = (id, data) => http.put(`/tokens/${id}`, data);
export const updateTokenStatus = (id, status) => http.put(`/tokens/${id}/status`, { status });
