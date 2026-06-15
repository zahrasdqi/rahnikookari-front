// src/api/tokenStorage.js
const ACCESS_KEY = "rn_access_token";
const REFRESH_KEY = "rn_refresh_token";

export const tokenStorage = {
  getAccess: () => localStorage.getItem(ACCESS_KEY),
  getRefresh: () => localStorage.getItem(REFRESH_KEY),

  // امضای دو‌آرگومانی که apiClient استفاده می‌کند
  set: (access, refresh) => {
    if (access) localStorage.setItem(ACCESS_KEY, access);
    if (refresh) localStorage.setItem(REFRESH_KEY, refresh);
  },

  // امضای آبجکتی برای راحتی در سرویس‌ها
  setTokens: ({ access, refresh }) => {
    if (access) localStorage.setItem(ACCESS_KEY, access);
    if (refresh) localStorage.setItem(REFRESH_KEY, refresh);
  },

  clear: () => {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
  },

  hasToken: () => !!localStorage.getItem(ACCESS_KEY),
};

