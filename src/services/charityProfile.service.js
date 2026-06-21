//src/services/charityProfile.service.js

import apiClient from "../api/apiClient";
import { ENDPOINTS } from "../api/endpoints";

const extractData = (response) => response?.data ?? response;

export const charityProfileService = {
  async getMyProfile() {
    const response = await apiClient.get(ENDPOINTS.charityProfile.me);
    return extractData(response);
  },

  async updateProfile(profileId, payload) {
    const response = await apiClient.patch(
      ENDPOINTS.charityProfile.update(profileId),
      payload
    );
    return extractData(response);
  },

  async submitProfile(profileId) {
    const response = await apiClient.post(
      ENDPOINTS.charityProfile.submit(profileId)
    );
    return extractData(response);
  },
};
