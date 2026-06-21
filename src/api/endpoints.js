// src/api/endpoints.js
export const ENDPOINTS = {
  auth: {
    register: "/api/v1/auth/register",
    verifyOtp: "/api/v1/auth/verify-otp",
    resendOtp: "/api/v1/auth/resend-otp",
    login: "/api/v1/auth/login",
    refresh: "/api/v1/auth/refresh",
    meToken: "/api/v1/auth/me-token",

    verifier: {
      completeOnboarding: "/api/v1/auth/verifier/complete-onboarding",
    },

    passwordReset: {
      start: "/api/v1/auth/password-reset/start",
      verify: "/api/v1/auth/password-reset/verify",
      complete: "/api/v1/auth/password-reset/complete",
      resendOtp: "/api/v1/auth/password-reset/resend_otp",
    },
  },

  profile: {
    me: "/api/v1/profile/me",
    changePassword: "/api/v1/profile/change-password",
    logout: "/api/v1/profile/logout",
  },

  admin: {
    users: "/api/v1/admin/users",
    userById: (id) => `/api/v1/admin/users/${id}`,
    suspend: (id) => `/api/v1/admin/users/${id}/suspend`,
    activate: (id) => `/api/v1/admin/users/${id}/activate`,
    changeRole: (id) => `/api/v1/admin/users/${id}/role`,
    roles: "/api/v1/admin/roles",
    verifiers: "/api/v1/admin/verifiers",
  },

  notifications: {
  list: "/api/v1/notifications",
  readAll: "/api/v1/notifications/read-all",
  markAsRead: (id) => `/api/v1/notifications/${id}/read`,
  },


  verifier: {
  dashboard: "/api/v1/verifier/dashboard",
  requestDetail: (requestId) =>
    `/api/v1/verifier/requests/${requestId}`,
  approveRequest: (requestId) =>
    `/api/v1/verifier/requests/${requestId}/approve`,
  rejectRequest: (requestId) =>
    `/api/v1/verifier/requests/${requestId}/reject`,
},
  /*charityVerification: {
    create: "/api/v1/charity-verification-requests",
    latest: "/api/v1/charity-verification-requests/me/latest",
  },*/

  charityVerification: {
  create: "/api/v1/charity-verification-requests",
  list: "/api/v1/charity-verification-requests",
  getById: (id) => `/api/v1/charity-verification-requests/${id}/`,
  update: (id) => `/api/v1/charity-verification-requests/${id}/`,
  delete: (id) => `/api/v1/charity-verification-requests/${id}/`,
},

charityProfile: {
  me: "/api/v1/charity/profile/me",
  update: (profileId) => `/api/v1/charity/profile/${profileId}`,
  submit: (profileId) => `/api/v1/charity/profile/${profileId}/submit`,
},

  media: {
    upload: "/api/v1/media/upload",
    fileMetadata: (fileId) => `/api/v1/media/files/${fileId}`,
    download: (fileId) => `/api/v1/media/files/${fileId}/download`,
    delete: (fileId) => `/api/v1/media/files/${fileId}`,
  },
};
