import axios, { AxiosInstance, AxiosError } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const API_TIMEOUT = parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '10000');

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      timeout: API_TIMEOUT,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as (typeof error.config & { _retry?: boolean }) | undefined;
        const requestUrl = originalRequest?.url ?? '';
        const isAuthRoute = requestUrl.startsWith('/auth/login')
          || requestUrl.startsWith('/auth/register')
          || requestUrl.startsWith('/auth/me')
          || requestUrl.startsWith('/auth/refresh')
          || requestUrl.startsWith('/auth/logout');

        if (error.response?.status === 401 && originalRequest && !originalRequest._retry && !isAuthRoute) {
          originalRequest._retry = true;
          try {
            await this.client.post('/auth/refresh');
            return this.client(originalRequest);
          } catch {
            this.clearAuth();
          }
        }

        return Promise.reject(error);
      }
    );
  }

  setAuthHeader(_token: string) {}

  clearAuth() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user_id');
      localStorage.removeItem('user_email');
    }
  }

  get<T>(url: string) {
    return this.client.get<T>(url);
  }

  post<T>(url: string, data?: any) {
    return this.client.post<T>(url, data);
  }

  put<T>(url: string, data?: any) {
    return this.client.put<T>(url, data);
  }

  delete<T>(url: string) {
    return this.client.delete<T>(url);
  }

  patch<T>(url: string, data?: any) {
    return this.client.patch<T>(url, data);
  }
}

export const apiClient = new ApiClient();
