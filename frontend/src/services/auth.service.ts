import apiClient from '@/lib/api';
import { LoginCredentials, AuthResponse, User } from '@/types';

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);

    if (response.data.success && response.data.data.token && response.data.data.user) {
      this.setAuthData(response.data.data.token, response.data.data.user);
    }

    return response.data;
  }

  async register(data: any): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/register', data);

    if (response.data.success && response.data.data.token && response.data.data.user) {
      this.setAuthData(response.data.data.token, response.data.data.user);
    }

    return response.data;
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await apiClient.get<{ success: boolean; user: User }>('/auth/me');
      return response.data.user;
    } catch (error) {
      return null;
    }
  }

  async getProfile(userId: number) {
    const response = await apiClient.get(`/auth/profile?userId=${userId}`);
    return response.data;
  }

  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }

  setAuthData(token: string, user: User): void {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  }

  getStoredUser(): User | null {
    if (typeof window === 'undefined') return null;

    const userStr = localStorage.getItem('user');
    if (!userStr) return null;

    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  getStoredToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('token') && !!localStorage.getItem('user');
  }
}

export const authService = new AuthService();
export default authService;
