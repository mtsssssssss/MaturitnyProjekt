// https://axios-http.com/docs/instance

import axios from "axios";

const BACKEND_ADRESS = 'https://localhost:7215/api';

const api = axios.create({
  baseURL: BACKEND_ADRESS,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login') && !window.location.pathname.includes('/signup')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
