// src/services/skillNeed.service.js

import apiClient from "../api/apiClient.js";
import { ENDPOINTS } from "../api/endpoints.js";

export const skillNeedService = {
  /**
   * ایجاد نیاز مهارتی جدید
   */
  async create(data) {
    const response = await apiClient.post(ENDPOINTS.skillNeeds.create, data);
    return response.data;
  },

  /**
   * لیست نیازهای مهارتی موسسه
   */
  async list(params = {}) {
    const response = await apiClient.get(ENDPOINTS.skillNeeds.list, { params });
    return response.data;
  },

  /**
   * دریافت جزئیات یک نیاز مهارتی
   */
  async getById(needId) {
    const response = await apiClient.get(ENDPOINTS.skillNeeds.getById(needId));
    return response.data;
  },

  /**
   * ویرایش نیاز مهارتی
   */
  async update(needId, data) {
    const response = await apiClient.put(
      ENDPOINTS.skillNeeds.update(needId),
      data
    );
    return response.data;
  },

  /**
   * حذف نیاز مهارتی
   */
  async delete(needId) {
    await apiClient.delete(ENDPOINTS.skillNeeds.delete(needId));
  },

  /**
   * انتشار نیاز مهارتی
   */
  async publish(needId) {
    const response = await apiClient.post(
      ENDPOINTS.skillNeeds.publish(needId)
    );
    return response.data;
  },

  /**
   * لیست درخواست‌های دریافتی برای یک نیاز
   */
  async getContributions(needId, params = {}) {
    const response = await apiClient.get(
      ENDPOINTS.skillNeeds.contributions(needId),
      { params }
    );
    return response.data;
  },
};
