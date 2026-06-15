//src/services/profile.service.js

import apiClient from "../api/apiClient";
import { ENDPOINTS } from "../api/endpoints";

export const profileService = {
  me: async () => {
    const { data } = await apiClient.get(ENDPOINTS.profile.me);
    return data; // { email, full_name, last_login }
  },

  changePassword: async ({ currentPassword, newPassword, confirmPassword }) => {
    const { data } = await apiClient.post(ENDPOINTS.profile.changePassword, {
      current_password: currentPassword,
      new_password: newPassword,
      confirm_password: confirmPassword,
    });
    return data;
  },
};
