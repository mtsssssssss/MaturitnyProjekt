import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { refreshToken } from "./auth";

const BACKEND_ADDRESS = process.env.NEXT_PUBLIC_API_URL || "https://localhost:7215/api";

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (error?: unknown) => void;
}> = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

const api = axios.create({
  baseURL: BACKEND_ADDRESS,
  timeout: 8000,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

const handleUnauthorized = () => {
  if (typeof window === "undefined") return;
  const path = window.location.pathname;
  if (path.includes("/login") || path.includes("/signup")) return;
  // window.location.href = `/login?returnUrl=${encodeURIComponent(path)}`;
  window.location.href = "/login";
};

api.interceptors.response.use(
  (r) => r,
  async (error: AxiosError) => {
    const req = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.config?.url?.includes("/auth/refresh-token")) {
      isRefreshing = false;
      processQueue(error, null);
      handleUnauthorized();
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && req && !req._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => api(req))
          .catch((e) => Promise.reject(e));
      }
      req._retry = true;
      isRefreshing = true;
      try {
        await refreshToken();
        processQueue(null, null);
        return api(req);
      } catch (e) {
        processQueue(e as AxiosError, null);
        handleUnauthorized();
        return Promise.reject(e);
      } finally {
        isRefreshing = false;
      }
    }

    if (error.response?.status === 401 && req?._retry) handleUnauthorized();
    return Promise.reject(error);
  }
);

export default api;