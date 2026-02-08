import axios, { AxiosError, InternalAxiosRequestConfig, AxiosInstance } from "axios";
import { refreshToken } from "./auth";

const BACKEND_ADDRESS = `https://localhost:7215/api`;


const api: AxiosInstance = axios.create({
  baseURL: BACKEND_ADDRESS,
  timeout: 8000,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});


let refreshPromise: Promise<void> | null = null;

const handleUnauthorized = (): void => {
  if (typeof window === "undefined") return;
  
  if (window.location.pathname.includes("/login") || window.location.pathname.includes("/signup")) {
    return;
  }
  
  window.location.href = "/login";
};

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    const isRefreshRequest = originalRequest.url?.includes("/auth/refresh-token");
    const isLogoutRequest = originalRequest.url?.includes("/auth/logout");

    if (error.response?.status === 401 && (isRefreshRequest || isLogoutRequest)) {
      refreshPromise = null;
      handleUnauthorized();
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!refreshPromise) {
        refreshPromise = refreshToken()
          .then(() => {
            refreshPromise = null;
          })
          .catch((err) => {
            refreshPromise = null;
            handleUnauthorized();
            return Promise.reject(err);
          });
      }

      try {
        await refreshPromise;
        return api(originalRequest);
      } catch (retryError) {
        return Promise.reject(retryError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;