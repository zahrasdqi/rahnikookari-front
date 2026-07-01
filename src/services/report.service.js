// src/services/report.service.js

import apiClient from "../api/apiClient";
import { ENDPOINTS } from "../api/endpoints";

export const reportService = {
  // لیست گزارش‌های کمپین
  async getReports(campaignId) {
    const response = await apiClient.get(
      ENDPOINTS.campaignReports.list(campaignId)
    );
    return response.data;
  },

  // ایجاد گزارش
  async createReport(campaignId, data) {
    const response = await apiClient.post(
      ENDPOINTS.campaignReports.create(campaignId),
      data
    );
    return response.data;
  },

  // دریافت یک گزارش
  async getReport(campaignId, reportId) {
    const response = await apiClient.get(
      ENDPOINTS.campaignReports.getById(campaignId, reportId)
    );
    return response.data;
  },

  // آپدیت گزارش
  async updateReport(campaignId, reportId, data) {
    const response = await apiClient.patch(
      ENDPOINTS.campaignReports.update(campaignId, reportId),
      data
    );
    return response.data;
  },

  // حذف گزارش
  async deleteReport(campaignId, reportId) {
    const response = await apiClient.delete(
      ENDPOINTS.campaignReports.delete(campaignId, reportId)
    );
    return response.data;
  },
};
