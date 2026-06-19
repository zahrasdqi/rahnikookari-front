// src/services/auth.service.js
import apiClient from "../api/apiClient";
import { ENDPOINTS } from "../api/endpoints";
import { tokenStorage } from "../api/tokenStorage";
import { profileService } from "./profile.service";
import { decodeJwt } from "../api/jwt";

export const authService = {
  // Step 1: ثبت‌نام → دریافت OTP
  register: async ({ fullName, email, password }) => {
    const { data } = await apiClient.post(ENDPOINTS.auth.register, {
      full_name: fullName,
      email,
      password,
    });
    return data; // { success, message }
  },

  // Step 2: تأیید OTP → ساخت کاربر در DB
  verifyOtp: async ({ email, otp }) => {
    const { data } = await apiClient.post(ENDPOINTS.auth.verifyOtp, {
      email,
      otp,
    });
    return data; // { success, verified, message, user }
  },

  resendOtp: async ({ email }) => {
    const { data } = await apiClient.post(ENDPOINTS.auth.resendOtp, { email });
    return data;
  },

  // Step 3: ورود → توکن‌ها + نقش
  login: async ({ email, password }) => {
    const { data } = await apiClient.post(ENDPOINTS.auth.login, {
      email,
      password,
    });

    // { access_token, refresh_token, token_type, user_id, email, role }
    tokenStorage.set(data.access_token, data.refresh_token);

    return data;
  },

  // تکمیل onboarding برای verifier
  // لینک ایمیل: /onboarding?token=...
  // body مورد نیاز بک‌اند:
  // {
  //   token: "string",
  //   new_password: "string"
  // }
  completeVerifierOnboarding: async ({ token, newPassword }) => {
    const { data } = await apiClient.post(
      ENDPOINTS.auth.verifier.completeOnboarding,
      {
        token,
        new_password: newPassword,
      }
    );

    return data;
  },

  // دیگر /auth/me نداریم → کاربر را از JWT (نقش/شناسه) + پروفایل می‌سازیم
  me: async () => {
    const token = tokenStorage.getAccess();
    const claims = decodeJwt(token) || {};
    const role = claims.role ?? null;
    const userId = claims.user_id ?? claims.sub ?? null;

    let profile = {};
    try {
      profile = await profileService.me(); // { email, full_name, last_login }
    } catch {
      profile = {};
    }

    return {
      user_id: userId,
      role,
      email: profile.email ?? claims.email ?? null,
      full_name: profile.full_name ?? null,
      last_login: profile.last_login ?? null,
    };
  },

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
