import { apiClient } from './client';

export interface AuthResponse {
  id: string;
  email: string;
  expiresIn: string;
}

export interface AuthMeResponse {
  id: string;
  email: string;
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
    this.setCurrentUser({ id: response.data.id, email: response.data.email });
    return response.data;
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/register', data);
    this.setCurrentUser({ id: response.data.id, email: response.data.email });
    return response.data;
  }

  async refresh(): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/refresh');
    this.setCurrentUser({ id: response.data.id, email: response.data.email });
    return response.data;
  }

  async me(): Promise<AuthMeResponse> {
    const response = await apiClient.get<AuthMeResponse>('/auth/me');
    return response.data;
  }

  async logout() {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      apiClient.clearAuth();
      this.setCurrentUser(null);
    }
  }

  getCurrentUser(): AuthMeResponse | null {
    if (typeof window !== 'undefined') {
      const userId = localStorage.getItem('user_id');
      const email = localStorage.getItem('user_email');

      if (userId && email) {
        return { id: userId, email };
      }
    }
    return null;
  }

  setCurrentUser(user: AuthMeResponse | null) {
    if (typeof window !== 'undefined') {
      if (!user) {
        localStorage.removeItem('user_id');
        localStorage.removeItem('user_email');
        return;
      }

      localStorage.setItem('user_id', user.id);
      localStorage.setItem('user_email', user.email);
    }
  }

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }
}

export const authService = new AuthService();
