import axios, { AxiosInstance, AxiosError, AxiosHeaders } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const API_TIMEOUT = parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '10000');
const CSRF_COOKIE_NAME = process.env.NEXT_PUBLIC_CSRF_COOKIE_NAME || 'csrf_token';
const CSRF_HEADER_NAME = process.env.NEXT_PUBLIC_CSRF_HEADER_NAME || 'x-csrf-token';

function getBrowserCookie(name: string): string {
  if (typeof document === 'undefined') {
    return '';
  }

  const raw = document.cookie || '';
  const prefix = `${name}=`;
  const match = raw
    .split(';')
    .map((entry) => entry.trim())
    .find((entry) => entry.startsWith(prefix));

  if (!match) {
    return '';
  }

  return decodeURIComponent(match.slice(prefix.length));
}

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

    this.client.interceptors.request.use((config) => {
      const method = String(config.method || 'get').toLowerCase();
      const isMutation = ['post', 'put', 'patch', 'delete'].includes(method);

      if (isMutation) {
        const csrfToken = getBrowserCookie(CSRF_COOKIE_NAME);
        if (csrfToken) {
          const nextHeaders = AxiosHeaders.from(config.headers ?? {});
          nextHeaders.set(CSRF_HEADER_NAME, csrfToken);
          config.headers = nextHeaders;
        }
      }

      return config;
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
