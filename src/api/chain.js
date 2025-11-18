import http from './http';
export const fetchChains = (params) => http.get('/chains', { params });
export const fetchEnabledChains = () => http.get('/chains/enabled');
export const createChain = (data) => http.post('/chains', data);
export const updateChain = (id, data) => http.put(`/chains/${id}`, data);
export const updateChainStatus = (id, status) => http.put(`/chains/${id}/status`, { status });
export const deleteChain = (id) => http.delete(`/chains/${id}`);
