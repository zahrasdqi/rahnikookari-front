//src/api/endpoints.js

export const ENDPOINTS = {
  auth: {
    register:   "/api/v1/auth/register",
    verifyOtp:  "/api/v1/auth/verify-otp",
    resendOtp:  "/api/v1/auth/resend-otp",
    login:      "/api/v1/auth/login",
    me:         "/api/v1/auth/me",
    refresh:    "/api/v1/auth/refresh",
    passwordReset: {
      start:     "/api/v1/auth/password-reset/start",
      verify:    "/api/v1/auth/password-reset/verify",
      complete:  "/api/v1/auth/password-reset/complete",
      resendOtp: "/api/v1/auth/password-reset/resend_otp",
    },
  },
  profile: {
    me:             "/api/v1/profile/me",
    changePassword: "/api/v1/profile/change-password",
    logout:         "/api/v1/profile/logout",
  },
  admin: {
    users:        "/api/v1/admin/users",
    userById:     (id) => `/api/v1/admin/users/${id}`,
    suspend:      (id) => `/api/v1/admin/users/${id}/suspend`,
    activate:     (id) => `/api/v1/admin/users/${id}/activate`,
    roles:        "/api/v1/admin/roles",
    changeRole:   (id) => `/api/v1/admin/users/${id}/role`,
  },
};
