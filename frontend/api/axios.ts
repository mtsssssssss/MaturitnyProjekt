import axios, { AxiosError, InternalAxiosRequestConfig, AxiosInstance } from "axios";
import { refreshToken } from "./auth";

const BACKEND_ADDRESS = "https://localhost:7215/api";

// Premenná na uloženie prebiehajúceho refreshu - rieši race conditions bez failedQueue polí
let refreshPromise: Promise<void> | null = null;

const api: AxiosInstance = axios.create({
  baseURL: BACKEND_ADDRESS,
  timeout: 8000,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

/**
 * Presmerovanie na login a vyčistenie lokálnych dát.
 * Používame window.location.href na tvrdý reset stavu aplikácie.
 */
const handleUnauthorized = (): void => {
  if (typeof window === "undefined") return;
  
  // Ak už sme na logine, nerobíme nič, aby sme sa nezacyklili
  if (window.location.pathname.includes("/login") || window.location.pathname.includes("/signup")) {
    return;
  }
  
  // Tu môžeš pridať localStorage.clear() ak tam niečo ukladáš
  window.location.href = "/login";
};

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // 1. Ošetrenie špeciálnych prípadov, kedy sa NESMIE skúšať retry
    const isRefreshRequest = originalRequest.url?.includes("/auth/refresh-token");
    const isLogoutRequest = originalRequest.url?.includes("/auth/logout");

    // Ak vráti 401 samotný refresh alebo logout, okamžite končíme a ideme na login
    if (error.response?.status === 401 && (isRefreshRequest || isLogoutRequest)) {
      refreshPromise = null;
      handleUnauthorized();
      return Promise.reject(error);
    }

    // 2. Ak je to bežná 401 a request sme ešte neopakovali
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Ak už refresh prebieha, čakáme na ten istý promise
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
        // Počkáme na úspešné dokončenie refreshu (či už nášho alebo toho, čo začal skôr)
        await refreshPromise;
        
        // Zopakujeme pôvodný request s novými cookies/tokenom
        return api(originalRequest);
      } catch (retryError) {
        // Ak refresh zlyhal, pošleme error ďalej
        return Promise.reject(retryError);
      }
    }

    // 3. Všetky ostatné chyby (404, 500, atď.) idú sem
    return Promise.reject(error);
  }
);

export default api;