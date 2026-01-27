import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { refreshToken } from "./auth";

/**
 * PRO TIP: Na maturite vyzerá lepšie, ak nemáš hardkódovanú URL.
 * Ak v .env súbore nemáš NEXT_PUBLIC_API_URL, použije sa localhost.
 */
const BACKEND_ADDRESS = process.env.NEXT_PUBLIC_API_URL || 'https://localhost:7215/api';

/**
 * Premenné pre správu fronty požiadaviek počas refreshu
 */
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (error?: any) => void;
}> = [];

/**
 * Spracuje čakajúce požiadavky v rade
 */
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

/**
 * Vytvorenie Axios inštancie
 */
const api = axios.create({
  baseURL: BACKEND_ADDRESS,
  timeout: 8000, // Zvýšil som na 8s, ak by mal backend pomalší štart
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // KRITICKÉ: Posiela cookies (Refresh Token) na backend
});

/**
 * Pomocná funkcia na presmerovanie na Login
 */
const handleUnauthorized = () => {
  if (typeof window !== 'undefined') {
    const currentPath = window.location.pathname;
    
    // Ak už sme na logine, nerobíme nič
    if (currentPath.includes('/login') || currentPath.includes('/signup')) {
      return;
    }

    // Presmerovanie s návratovou URL adresou
    // window.location.href = `/login?returnUrl=${encodeURIComponent(currentPath)}`;
    window.location.href = '/login';
  }
};

/**
 * RESPONSE INTERCEPTOR
 */
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // --- 1. ŠPECIÁLNY PRÍPAD: ZLYHAL SAMOTNÝ REFRESH ---
    // Ak požiadavka na refresh-token vráti 401, refresh token je neplatný/expirovaný.
    if (error.config?.url?.includes('/auth/refresh-token')) {
      isRefreshing = false;
      processQueue(error, null);
      handleUnauthorized();
      return Promise.reject(error);
    }

    // --- 2. ŠTANDARDNÁ 401 CHYBA (EXPIROVANÝ ACCESS TOKEN) ---
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      
      // Ak už refresh prebieha, pridáme požiadavku do fronty
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => api(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Pokus o obnovenie tokenu cez tvoju auth funkciu
        await refreshToken();
        
        // Ak úspešne, spracujeme frontu a zopakujeme pôvodný request
        processQueue(null, null);
        return api(originalRequest);
      } catch (refreshError) {
        // Ak refresh zlyhal (napr. 400, 401, 500)
        processQueue(refreshError as AxiosError, null);
        handleUnauthorized();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // --- 3. OSTATNÉ CHYBY (403, 404, 500 atď.) ---
    // Ak dostaneme 401 a už je to druhý pokus (_retry: true), vykopneme používateľa
    if (error.response?.status === 401 && originalRequest._retry) {
        handleUnauthorized();
    }

    return Promise.reject(error);
  }
);

export default api;