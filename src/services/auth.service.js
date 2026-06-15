//src/services/auth.service.js

import apiClient from "../api/apiClient";
import { ENDPOINTS } from "../api/endpoints";
import { tokenStorage } from "../api/tokenStorage";

export const authService = {
  // Step 1: ثبت‌نام → دریافت OTP (هنوز توکن نمی‌دهد)
  register: async ({ fullName, email, password }) => {
    const { data } = await apiClient.post(ENDPOINTS.auth.register, {
      full_name: fullName,
      email,
      password,
    });
    return data; // { success, message }
  },

  // Step 2: تأیید OTP → ساخت کاربر در DB (باز هم توکن نمی‌دهد)
  verifyOtp: async ({ email, otp }) => {
    const { data } = await apiClient.post(ENDPOINTS.auth.verifyOtp, {
      email,
      otp,
    });
    return data; // { success, verified, message, user }
  },

  resendOtp: async ({ email }) => {
    const { data } = await apiClient.post(ENDPOINTS.auth.resendOtp, { email });
    return data; // { success, message }
  },

  // Step 3: ورود → دریافت توکن‌ها
  login: async ({ email, password }) => {
    const { data } = await apiClient.post(ENDPOINTS.auth.login, {
      email,
      password,
    });
    // { access_token, refresh_token, token_type }
    tokenStorage.set(data.access_token, data.refresh_token);
    return data;
  },

  me: async () => {
    const { data } = await apiClient.get(ENDPOINTS.auth.me);
    return data; // user object کامل
  },

  // خروج → باید refresh_token را در body بفرستد
  logout: async () => {
    const refreshToken = tokenStorage.getRefresh();
    try {
      if (refreshToken) {
        await apiClient.post(ENDPOINTS.profile.logout, {
          refresh_token: refreshToken,
        });
      }
    } finally {
      tokenStorage.clear();
    }
  },
};
