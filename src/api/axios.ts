import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const axiosInstance: AxiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor to include auth token
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle errors
axiosInstance.interceptors.response.use(
  (response: AxiosResponse): any => response.data,
  (error) => {
    // Handle token expiration
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/auth';
    }
    return Promise.reject(error.response ? error.response.data : error);
  }
);

export default axiosInstance; 