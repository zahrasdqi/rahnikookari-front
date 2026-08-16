// src/services/campaign.service.js
import apiClient from "../api/apiClient.js";
import { ENDPOINTS } from "../api/endpoints.js";

export const campaignService = {
  async create(data) {
    const response = await apiClient.post(ENDPOINTS.campaigns.create, data);
    return response.data;
  },

  async getPublicCampaigns(params = {}) {
    const response = await apiClient.get(ENDPOINTS.publicCampaigns.list, {
      params: {
        skip: params.skip ?? 0,
        limit: params.limit ?? 12,
      },
    });
    return response.data;
  },

  async getPublicCampaignById(campaignId) {
    const response = await apiClient.get(
      ENDPOINTS.publicCampaigns.detail(campaignId)
    );
    return response.data;
  },

  async list(params = {}) {
    const response = await apiClient.get(ENDPOINTS.campaigns.list, { params });
    return response.data;
  },

  async getById(campaignId) {
    const response = await apiClient.get(
      ENDPOINTS.campaigns.getById(campaignId)
    );
    return response.data;
  },

  async update(campaignId, data) {
    const response = await apiClient.put(
      ENDPOINTS.campaigns.update(campaignId),
      data
    );
    return response.data;
  },

  async delete(campaignId) {
    await apiClient.delete(ENDPOINTS.campaigns.delete(campaignId));
  },

  async startDonation(campaignId, amount) {
    const response = await apiClient.post(
      ENDPOINTS.campaigns.donations.create(campaignId),
      { amount: Number(amount) }
    );
    return response.data;
  },

  async getCampaignDonations(campaignId) {
    const response = await apiClient.get(
      ENDPOINTS.campaigns.donations.list(campaignId)
    );
    return response.data;
  },

  async getCampaignReports(campaignId) {
    const response = await apiClient.get(
      ENDPOINTS.campaignReports.list(campaignId)
    );
    return response.data;
  },

};
