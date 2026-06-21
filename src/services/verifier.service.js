//src/services/verifier.service.js

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
    const response = await apiClient.get(
      ENDPOINTS.verifier.requestDetail(requestId)
    );

    return response.data;
  },

  approveRequest: async (requestId) => {
    const response = await apiClient.post(
      ENDPOINTS.verifier.approveRequest(requestId)
    );

    return response.data;
  },

  rejectRequest: async (requestId, reason) => {
    const response = await apiClient.post(
      ENDPOINTS.verifier.rejectRequest(requestId),
      { reason }
    );

    return response.data;
  },
};
