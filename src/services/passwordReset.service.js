//front\rahnikookari-front\src\services\passwordReset.service.js
import apiClient from "../api/apiClient";
import { ENDPOINTS } from "../api/endpoints";

export const passwordResetService = {
  start: async ({ email }) => {
    const { data } = await apiClient.post(
      ENDPOINTS.auth.passwordReset.start, { email }
    );
    return data;
  },

  verify: async ({ email, otp }) => {
    const { data } = await apiClient.post(
      ENDPOINTS.auth.passwordReset.verify, { email, otp }
    );
    return data;
  },

  complete: async ({ email, newPassword }) => {
    const { data } = await apiClient.post(
      ENDPOINTS.auth.passwordReset.complete,
      { email, new_password: newPassword }
    );
    return data;
  },

  resendOtp: async ({ email }) => {
    const { data } = await apiClient.post(
      ENDPOINTS.auth.passwordReset.resendOtp, { email }
    );
    return data;
  },
};
