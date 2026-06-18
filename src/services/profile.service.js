import { apiClient } from "../api/apiClient";
import { ENDPOINTS } from "../api/endpoints";

export const profileService = {
  // دریافت اطلاعات کامل کاربر
  getMe: () => apiClient.get(ENDPOINTS.profile.me),
  
  // تغییر رمز عبور
  changePassword: (data) => apiClient.post(ENDPOINTS.profile.changePassword, data),
  
  // خروج از حساب 
  logout: () => apiClient.post(ENDPOINTS.profile.logout),
};
