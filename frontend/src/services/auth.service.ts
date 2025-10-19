import apiClient from '@/lib/api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      account_id: number;
      email: string;
      role: 'employee' | 'customer';
      first_name: string;
      last_name: string;
      job_role?: string;
    };
  };
}

export interface User {
  account_id: number;
  email: string;
  role: 'employee' | 'customer';
  first_name: string;
  last_name: string;
  job_role?: string;
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);

    if (response.data.success) {
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }

    return response.data;
  }

  async getProfile(userId: number) {
    const response = await apiClient.get(`/auth/profile?userId=${userId}`);
    return response.data;
  }

  logout() {
    localStorage.removeItem('user');
    window.location.href = '/login';
  }

  getCurrentUser(): User | null {
    if (typeof window === 'undefined') return null;

    const userStr = localStorage.getItem('user');
    if (!userStr) return null;

    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('user');
  }
}

export const authService = new AuthService();
export default authService;
