import http from './http';
export const login = (data) => http.post('/auth/login', data);
export const verifyTotp = (pendingToken, code) => http.post('/auth/totp/verify', { code }, { headers: { 'X-Auth-Pending': pendingToken } });
export const fetchProfile = () => http.get('/auth/profile');
export const logout = () => http.post('/auth/logout');
export const setupTotp = (password) => http.post('/auth/totp/setup', { password });
export const confirmTotp = (secret, code) => http.post('/auth/totp/confirm', { secret, code });
export const resetTotp = (password) => http.post('/auth/totp/reset', { password });
