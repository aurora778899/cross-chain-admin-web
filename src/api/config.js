import http from './http';
export const fetchAffiliateFees = () => http.get('/config/affiliate-fees');
export const createAffiliateFee = (data) => http.post('/config/affiliate-fees', data);
export const updateAffiliateFee = (id, data) => http.put(`/config/affiliate-fees/${id}`, data);
export const deleteAffiliateFee = (id) => http.delete(`/config/affiliate-fees/${id}`);
export const fetchRoutingConfig = () => http.get('/config/routing');
export const updateRoutingConfig = (enforceThorchainOnly) => http.put('/config/routing', { enforceThorchainOnly });
export const fetchThornameConfig = () => http.get('/config/thorname');
export const updateThornameConfig = (data) => http.put('/config/thorname', data);
