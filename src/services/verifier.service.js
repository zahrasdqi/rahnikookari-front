// src/services/verifier.service.js

import apiClient from "../api/apiClient";
import { ENDPOINTS } from "../api/endpoints";

export const verifierService = {
  getDashboard: async ({
    status,
    activityField,
    search,
    limit = 20,
    offset = 0,
  } = {}) => {
    const response = await apiClient.get(ENDPOINTS.verifier.dashboard, {
      params: {
        status: status || undefined,
        activity_field: activityField || undefined,
        search: search || undefined,
        limit,
        offset,
      },
    });
    return response.data;
  },

  getRequestDetail: async (requestId) => {
    const response = await apiClient.get(ENDPOINTS.verifier.requestDetail(requestId));
    return response.data;
  },

  approveRequest: async (requestId) => {
    const response = await apiClient.post(ENDPOINTS.verifier.approveRequest(requestId));
    return response.data;
  },

  rejectRequest: async (requestId, reason) => {
    const response = await apiClient.post(ENDPOINTS.verifier.rejectRequest(requestId), { reason });
    return response.data;
  },

  // Charity Profiles
  getPendingProfiles: async () => {
    const response = await apiClient.get(ENDPOINTS.verifier.pendingProfiles);
    return response.data;
  },
  
  approveProfile: async (profileId) => {
    const response = await apiClient.post(ENDPOINTS.verifier.approveProfile(profileId), {});
    return response.data;
  },
  
  rejectProfile: async (profileId, reason) => {
    const response = await apiClient.post(ENDPOINTS.verifier.rejectProfile(profileId), { reason });
    return response.data;
  },

  // Campaigns
  getPendingCampaigns: async ({ limit = 20, offset = 0 } = {}) => {
  const response = await apiClient.get(ENDPOINTS.verifier.campaigns, {
    params: { limit, offset },
  });
  return response.data;
},

  approveCampaign: async (campaignId) => {
    const response = await apiClient.patch(ENDPOINTS.verifier.approveCampaign(campaignId));
    return response.data;
  },

  rejectCampaign: async (campaignId, reason) => {
    const response = await apiClient.patch(ENDPOINTS.verifier.rejectCampaign(campaignId), { reason });
    return response.data;
  },

  suspendCampaign: async (campaignId, reason) => {
    const response = await apiClient.patch(ENDPOINTS.verifier.suspendCampaign(campaignId), { reason });
    return response.data;
  },

  resumeCampaign: async (campaignId) => {
    const response = await apiClient.patch(ENDPOINTS.verifier.resumeCampaign(campaignId));
    return response.data;
  },
};
