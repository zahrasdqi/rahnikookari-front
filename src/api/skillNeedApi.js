//src\api\skillNeedApi.jssrc\api\skillNeedApi.js
import api from './axiosConfig';
import { API_ENDPOINTS } from './endpoints';

export const skillNeedApi = {
  // دریافت لیست نیازهای مهارتی
  getSkillNeeds: (charityId) => 
    api.get(API_ENDPOINTS.CHARITY.SKILL_NEEDS.LIST(charityId)),

  // ایجاد نیاز مهارتی جدید
  createSkillNeed: (charityId, data) => 
    api.post(API_ENDPOINTS.CHARITY.SKILL_NEEDS.CREATE(charityId), data),

  // ویرایش نیاز مهارتی
  updateSkillNeed: (charityId, skillNeedId, data) => 
    api.put(API_ENDPOINTS.CHARITY.SKILL_NEEDS.UPDATE(charityId, skillNeedId), data),

  // حذف نیاز مهارتی
  deleteSkillNeed: (charityId, skillNeedId) => 
    api.delete(API_ENDPOINTS.CHARITY.SKILL_NEEDS.DELETE(charityId, skillNeedId)),

  // دریافت جزئیات یک نیاز مهارتی
  getSkillNeedDetails: (charityId, skillNeedId) => 
    api.get(API_ENDPOINTS.CHARITY.SKILL_NEEDS.DETAILS(charityId, skillNeedId))
};
