// src/services/media.service.js
import apiClient from "../api/apiClient";
import { ENDPOINTS } from "../api/endpoints";

export const mediaService = {
  /**
   * آپلود فایل به مدیا سرویس
   */
  upload: async (
    file,
    fileUsage = "other",
    relatedEntityType = null,
    relatedEntityId = null,
    isPublic = false,
    sourceService = "frontend"
  ) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("file_usage", fileUsage);
    formData.append("is_public", String(isPublic));
    formData.append("source_service", sourceService);
    
    if (relatedEntityType) {
      formData.append("related_entity_type", relatedEntityType);
    }
    if (relatedEntityId) {
      formData.append("related_entity_id", String(relatedEntityId));
    }

    const response = await apiClient.post(ENDPOINTS.media.upload, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  /**
   * دریافت اطلاعات متا فایلی که قبلاً آپلود شده است
   */
  getFileMetadata: async (fileId) => {
    const response = await apiClient.get(ENDPOINTS.media.fileMetadata(fileId));
    return response.data;
  },

  /**
   * دریافت مستقیم فایل به صورت Blob جهت دانلود یا پیش‌نمایش امن
   */
  download: async (fileId) => {
    const response = await apiClient.get(ENDPOINTS.media.download(fileId), {
      responseType: "blob",
      headers: { Accept: "*/*" },
    });
    return response;
  },

  /**
   * حذف فایل از سرور
   */
  delete: async (fileId) => {
    const response = await apiClient.delete(ENDPOINTS.media.delete(fileId));
    return response.data;
  },
};
