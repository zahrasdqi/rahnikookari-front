//برای نشان دادن موسسات به کاربر
//src/services/charity.service.js
import apiClient from '../api/apiClient';
import { ENDPOINTS } from '../api/endpoints';

export const charityService = {
  /**
   * دریافت لیست عمومی موسسات خیریه
   * @param {Object} params - فیلترها و پارامترها
   * @param {string} params.search - جستجو در نام موسسه
   * @param {string} params.province - فیلتر استان
   * @param {string} params.city - فیلتر شهر
   * @param {string} params.activity_field - فیلتر حوزه فعالیت
   * @param {number} params.limit - تعداد نتایج
   * @param {number} params.offset - آفست برای صفحه‌بندی
   * @returns {Promise} لیست موسسات
   */
  async getPublicCharities(params = {}) {
    const { search, province, city, activity_field, limit = 20, offset = 0 } = params;
    
    const queryParams = new URLSearchParams();
    
    if (search) queryParams.append('search', search);
    if (province) queryParams.append('province', province);
    if (city) queryParams.append('city', city);
    if (activity_field) queryParams.append('activity_field', activity_field);
    queryParams.append('limit', limit);
    queryParams.append('offset', offset);

    const url = `${ENDPOINTS.charities.list}?${queryParams.toString()}`;
    const response = await apiClient.get(url);
    
    return response.data;
  },

  /**
   * دریافت جزئیات یک موسسه با slug
   * @param {string} slug - slug موسسه
   * @returns {Promise} اطلاعات کامل موسسه
   */
  async getCharityBySlug(slug) {
    const response = await apiClient.get(ENDPOINTS.charities.detail(slug));
    return response.data;
  },

  /**
   * دریافت پروفایل موسسه خودم (برای charity که لاگین کرده)
   * @returns {Promise} پروفایل موسسه
   */
  async getMyProfile() {
    const response = await apiClient.get(ENDPOINTS.charityProfile.me);
    return response.data;
  },

  /**
   * به‌روزرسانی پروفایل موسسه
   * @param {string} profileId - شناسه پروفایل
   * @param {Object} data - داده‌های به‌روزرسانی
   * @returns {Promise}
   */
  async updateProfile(profileId, data) {
    const response = await apiClient.put(
      ENDPOINTS.charityProfile.update(profileId),
      data
    );
    return response.data;
  },

  /**
   * ارسال پروفایل برای تایید
   * @param {string} profileId - شناسه پروفایل
   * @returns {Promise}
   */
  async submitProfile(profileId) {
    const response = await apiClient.post(
      ENDPOINTS.charityProfile.submit(profileId)
    );
    return response.data;
  },
};
