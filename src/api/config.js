// src/api/config.js
const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

export const API_CONFIG = {
  GATEWAY_URL: BASE_URL,
  AUTH_BASE_URL: BASE_URL, // سازگاری عقب‌رو
  TIMEOUT: 15000,
  HEADERS: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
};
