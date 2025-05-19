import axiosInstance from './axios';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    return await axiosInstance.post('/auth/login', credentials);
  },
  
  register: async (userData: RegisterData): Promise<AuthResponse> => {
    return await axiosInstance.post('/auth/register', userData);
  },
  
  getCurrentUser: async (): Promise<any> => {
    return await axiosInstance.get('/auth/me');
  },
  
  resetPassword: async (email: string): Promise<any> => {
    return await axiosInstance.post('/auth/reset-password', { email });
  },
  
  updatePassword: async (token: string, newPassword: string): Promise<any> => {
    return await axiosInstance.post('/auth/update-password', { token, newPassword });
  }
}; 