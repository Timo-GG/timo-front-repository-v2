// src/apis/axiosInstance.js
import axios from 'axios';
import useAuthStore from '../storage/useAuthStore';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(config => {
    if (config.withAuth) {
      const token = useAuthStore.getState().accessToken;
      if (token) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${token}`,
        };
      }
    }
    return config;
  });
  
export default axiosInstance;

