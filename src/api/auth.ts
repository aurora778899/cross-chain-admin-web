import http from './http';
import type { UserProfile } from '@/store/token';

export interface LoginParams {
  username: string;
  password: string;
}

export interface LoginResponse {
  pendingToken: string;
  totpBound: boolean;
}

export interface TotpSetupResponse {
  secret: string;
  qrCode: string;
  issuer: string;
  account: string;
}

export const login = (data: LoginParams) => http.post<LoginResponse>('/auth/login', data);

export const verifyTotp = (pendingToken: string, code: string) =>
  http.post<{ token: string; expiresIn: number }>(
    '/auth/totp/verify',
    { code },
    { headers: { 'X-Auth-Pending': pendingToken } }
  );

export const fetchProfile = () => http.get<UserProfile>('/auth/profile');

export const logout = () => http.post<void>('/auth/logout');

export const setupTotp = (password: string) => http.post<TotpSetupResponse>('/auth/totp/setup', { password });

export const confirmTotp = (secret: string, code: string) => http.post<void>('/auth/totp/confirm', { secret, code });

export const resetTotp = (password: string) => http.post<void>('/auth/totp/reset', { password });
