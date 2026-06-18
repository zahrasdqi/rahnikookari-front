// src/constants/roles.js
export const ROLES = {
  DONOR: "donor",       // کاربر عادی
  ADMIN: "admin",
  VERIFIER: "verifier",
  CHARITY: "charity",   // ⚠️ اگر نام واقعی نقش خیریه فرق دارد همین مقدار را عوض کن
};

export const ROLE_DASHBOARD = {
  [ROLES.DONOR]: "/dashboard",
  [ROLES.ADMIN]: "/admin",
  [ROLES.VERIFIER]: "/verifier",
  [ROLES.CHARITY]: "/charity",
};

export function dashboardPathForRole(role) {
  return ROLE_DASHBOARD[role] ?? "/dashboard";
}
