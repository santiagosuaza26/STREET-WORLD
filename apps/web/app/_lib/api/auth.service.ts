import { apiClient } from './client';

export interface AuthResponse {
  id: string;
  email: string;
  token: string;
  expiresIn: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

class AuthService {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    if (response.data.token) {
      apiClient.setAuthHeader(response.data.token);
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', response.data.token);
        localStorage.setItem('user_id', response.data.id);
        localStorage.setItem('user_email', response.data.email);
      }
    }
    return response.data;
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/register', data);
    if (response.data.token) {
      apiClient.setAuthHeader(response.data.token);
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', response.data.token);
        localStorage.setItem('user_id', response.data.id);
        localStorage.setItem('user_email', response.data.email);
      }
    }
    return response.data;
  }

  logout() {
    apiClient.clearAuth();
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user_id');
      localStorage.removeItem('user_email');
    }
  }

  getCurrentUser() {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      const userId = localStorage.getItem('user_id');
      const email = localStorage.getItem('user_email');
      
      if (token && userId && email) {
        return { id: userId, email, token };
      }
    }
    return null;
  }

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }
}

export const authService = new AuthService();
