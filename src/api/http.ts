import axios, { AxiosRequestConfig } from 'axios';
import { API_BASE } from '@/config';
import { useTokenStore } from '@/store/token';

const instance = axios.create({
  baseURL: API_BASE,
  timeout: 15000
});

instance.interceptors.request.use((config) => {
  const token = useTokenStore.getState().token;
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

instance.interceptors.response.use(
  (response) => {
    const payload = response.data;
    if (payload && typeof payload.code !== 'undefined') {
      if (payload.code !== 0) {
        return Promise.reject(new Error(payload.message || '请求失败'));
      }
      return payload.data;
    }
    return payload;
  },
  (error) => {
    if (error.response?.status === 401) {
      useTokenStore.getState().clearToken();
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

const request = {
  get<T>(url: string, config?: AxiosRequestConfig) {
    return instance.get<any, T>(url, config);
  },
  post<T>(url: string, data?: any, config?: AxiosRequestConfig) {
    return instance.post<any, T>(url, data, config);
  },
  put<T>(url: string, data?: any, config?: AxiosRequestConfig) {
    return instance.put<any, T>(url, data, config);
  },
  delete<T>(url: string, config?: AxiosRequestConfig) {
    return instance.delete<any, T>(url, config);
  }
};

export default request;
