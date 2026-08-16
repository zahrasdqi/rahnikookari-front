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
    requestDetail: (requestId) => `/api/v1/verifier/requests/${requestId}`,
    approveRequest: (requestId) =>
      `/api/v1/verifier/requests/${requestId}/approve`,
    rejectRequest: (requestId) =>
      `/api/v1/verifier/requests/${requestId}/reject`,

    pendingProfiles: "/api/v1/verifier/charity-profiles/pending",
    approveProfile: (profileId) =>
      `/api/v1/verifier/charity-profiles/${profileId}/approve`,
    rejectProfile: (profileId) =>
      `/api/v1/verifier/charity-profiles/${profileId}/reject`,

    campaigns: "/api/v1/verifier/campaigns/dashboard",
    approveCampaign: (campaignId) => `/api/v1/verifier/${campaignId}/approve`,
    rejectCampaign: (campaignId) => `/api/v1/verifier/${campaignId}/reject`,
    suspendCampaign: (campaignId) => `/api/v1/verifier/${campaignId}/suspend`,
    resumeCampaign: (campaignId) => `/api/v1/verifier/${campaignId}/resume`,
  },

  charityVerification: {
    create: "/api/v1/charity-verification-requests",
    myLatest: "/api/v1/charity-verification-requests/me/latest",
    deleteMyPending: "/api/v1/charity-verification-requests/me/pending",
  },

  charityProfile: {
    me: "/api/v1/charity/profile/me",
    update: (profileId) => `/api/v1/charity/profile/${profileId}`,
    submit: (profileId) => `/api/v1/charity/profile/${profileId}/submit`,
  },

  charities: {
    list: "/api/v1/charities",
    detail: (slug) => `/api/v1/charities/${slug}`,
  },

  publicCampaigns: {
    list: "/api/v1/public/campaigns",
    detail: (campaignId) => `/api/v1/public/campaigns/${campaignId}`,
  },

  campaigns: {
    create: "/api/v1/campaigns/",
    list: "/api/v1/campaigns/",
    getById: (campaignId) => `/api/v1/campaigns/${campaignId}`,
    update: (campaignId) => `/api/v1/campaigns/${campaignId}`,
    delete: (campaignId) => `/api/v1/campaigns/${campaignId}`,

    donations: {
      myList: "/api/v1/me/donations", // لیست کمک‌های مالی کاربر
      create: (campaignId) => `/api/v1/campaigns/${campaignId}/donations`,
      list: (campaignId) => `/api/v1/campaigns/${campaignId}/donations`,
    },
  },
 
  campaignReports: {
  list: (campaignId) => `/api/v1/campaigns/${campaignId}/reports`,
  create: (campaignId) => `/api/v1/campaigns/${campaignId}/reports`,
  getById: (campaignId, reportId) =>
    `/api/v1/campaigns/${campaignId}/reports/${reportId}`,
  update: (campaignId, reportId) =>
    `/api/v1/campaigns/${campaignId}/reports/${reportId}`,
  delete: (campaignId, reportId) =>
    `/api/v1/campaigns/${campaignId}/reports/${reportId}`,
},

  payments: {
    callback: "/api/v1/payments/callback",
  },

  skillNeeds: {
    create: "/api/v1/skill-needs",
    list: "/api/v1/skill-needs",
    getById: (needId) => `/api/v1/skill-needs/${needId}`,
    update: (needId) => `/api/v1/skill-needs/${needId}`,
    delete: (needId) => `/api/v1/skill-needs/${needId}`,
    publish: (needId) => `/api/v1/skill-needs/${needId}/publish`,
    contributions: (needId) => `/api/v1/skill-needs/${needId}/contributions`,
  },

  skillDocuments: {
    list: "/api/v1/me/skill-documents",
    create: "/api/v1/me/skill-documents",
    getById: (documentId) => `/api/v1/skill-documents/${documentId}`,
    update: (documentId) => `/api/v1/me/skill-documents/${documentId}`,
    delete: (documentId) => `/api/v1/me/skill-documents/${documentId}`,
    review: (documentId) => `/api/v1/skill-documents/${documentId}/review`,
    byContribution: (contributionId) =>
      `/api/v1/skill-contributions/${contributionId}/documents`,
  },

  media: {
    upload: "/api/v1/media/upload",
    fileMetadata: (fileId) => `/api/v1/media/files/${fileId}`,
    download: (fileId) => `/api/v1/media/files/${fileId}/download`,
    delete: (fileId) => `/api/v1/media/files/${fileId}`,
  },
};
