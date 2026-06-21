//src\services\media.service.js
import apiClient from "../api/apiClient";
import { ENDPOINTS } from "../api/endpoints";

export const mediaService = {
  async upload(file, fileUsage) {
    const formData = new FormData();

    formData.append("source_service", "core_service");
    formData.append("file_usage", fileUsage);
    formData.append("is_public", "false");
    formData.append("file", file);

    const { data } = await apiClient.post(ENDPOINTS.media.upload, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return data;
  },
};
