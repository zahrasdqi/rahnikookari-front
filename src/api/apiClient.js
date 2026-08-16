//src/api/apiClient.js

import axios from "axios";
import { API_CONFIG } from "./config";
import { ENDPOINTS } from "./endpoints";
import { tokenStorage } from "./tokenStorage";

export const apiClient = axios.create({
  baseURL: API_CONFIG.GATEWAY_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use((config) => {
  const token = tokenStorage.getAccess();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  console.log("[apiClient request]", {
    method: config.method,
    baseURL: config.baseURL,
    url: config.url,
    hasAccessToken: Boolean(token),
    hasAuthorization: Boolean(config.headers.Authorization),
  });

  return config;
});


apiClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    if (error.response?.status !== 401 || original._retry) {
      return Promise.reject(error);
    }

    if (original.url?.includes(ENDPOINTS.auth.refresh)) {
      tokenStorage.clear();
      window.dispatchEvent(new Event("auth:logout"));
      return Promise.reject(error);
    }

    original._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        queue.push({ resolve, reject });
      }).then((token) => {
        original.headers.Authorization = `Bearer ${token}`;
        return apiClient(original);
      });
    }

    isRefreshing = true;
    const refreshToken = tokenStorage.getRefresh();

    if (!refreshToken) {
      isRefreshing = false;
      tokenStorage.clear();
      window.dispatchEvent(new Event("auth:logout"));
      return Promise.reject(error);
    }

    try {
      const { data } = await axios.post(
        `${API_CONFIG.GATEWAY_URL}${ENDPOINTS.auth.refresh}`,
        { refresh_token: refreshToken }
      );

      // ⚠️ مطابق Swagger: response یک رشته‌ی خام access_token است
      const newAccess =
        typeof data === "string" ? data : data.access_token;

      // refresh_token جدیدی نمی‌آید → همان قبلی را نگه می‌داریم
      tokenStorage.set(newAccess, refreshToken);
      apiClient.defaults.headers.common.Authorization = `Bearer ${newAccess}`;
      processQueue(null, newAccess);

      original.headers.Authorization = `Bearer ${newAccess}`;
      return apiClient(original);
    } catch (err) {
      processQueue(err, null);
      tokenStorage.clear();
      window.dispatchEvent(new Event("auth:logout"));
      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  }
);

export default apiClient;
