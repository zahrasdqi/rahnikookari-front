// src/services/admin.service.js
import apiClient from "../api/apiClient";
import { ENDPOINTS } from "../api/endpoints";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function extractList(data, keys = []) {
  if (Array.isArray(data)) return data;

  for (const key of keys) {
    if (Array.isArray(data?.[key])) return data[key];
  }

  return [];
}

function normalizeUserId(userId) {
  const value = String(userId || "").trim();

  if (!UUID_PATTERN.test(value)) {
    throw new Error("شناسه کاربر معتبر نیست. مقدار user_id باید UUID کامل باشد.");
  }

  return encodeURIComponent(value);
}

export const adminService = {
  listUsers: async () => {
    const { data } = await apiClient.get(ENDPOINTS.admin.users);
    return extractList(data, ["users", "items", "results", "data"]);
  },

  getUser: async (userId) => {
    const normalizedUserId = normalizeUserId(userId);
    const { data } = await apiClient.get(ENDPOINTS.admin.userById(normalizedUserId));
    return data;
  },

  suspendUser: async (userId) => {
    const normalizedUserId = normalizeUserId(userId);
    const { data } = await apiClient.patch(ENDPOINTS.admin.suspend(normalizedUserId));
    return data;
  },

  activateUser: async (userId) => {
    const normalizedUserId = normalizeUserId(userId);
    const { data } = await apiClient.patch(ENDPOINTS.admin.activate(normalizedUserId));
    return data;
  },

  changeRole: async (userId, role) => {
    const normalizedUserId = normalizeUserId(userId);
    const { data } = await apiClient.patch(
      ENDPOINTS.admin.changeRole(normalizedUserId),
      { role }
    );
    return data;
  },

  listRoles: async () => {
    const { data } = await apiClient.get(ENDPOINTS.admin.roles);
    return extractList(data, ["roles", "items", "results", "data"]);
  },

  createVerifier: async ({ full_name, fullName, email }) => {
    const { data } = await apiClient.post(ENDPOINTS.admin.verifiers, {
      full_name: full_name || fullName,
      email,
    });
    return data;
  },
};
