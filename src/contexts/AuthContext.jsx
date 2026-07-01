// src/contexts/AuthContext.jsx
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { authService } from "../services/auth.service";
import { charityProfileService } from "../services/charityProfile.service";
import { tokenStorage } from "../api/tokenStorage";

const AuthContext = createContext(null);

const APPROVED_CHARITY_STATUS = "APPROVED";

function normalizeCharityProfileResponse(response) {
  /**
   * این تابع عمداً defensive نوشته شده چون ممکن است بک‌اند یکی از شکل‌های زیر را برگرداند:
   *
   * 1) profile object مستقیم
   * 2) { profile: {...} }
   * 3) { data: {...} }
   * 4) { has_profile: false, profile: null }
   * 5) null
   */

  if (!response) return null;

  if (response.profile) return response.profile;

  if (response.data?.profile) return response.data.profile;

  if (response.data && typeof response.data === "object") return response.data;

  if (response.has_profile === false) return null;

  return response;
}

function isApprovedCharityProfile(profile) {
  if (!profile) return false;

  const status = String(profile.status ?? "").toUpperCase();

  return status === APPROVED_CHARITY_STATUS && profile.is_published === true;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [charityProfile, setCharityProfile] = useState(null);
  const [charityProfileLoading, setCharityProfileLoading] = useState(false);

  const loadMyCharityProfile = async () => {
    /**
     * این تابع برای user لاگین‌شده profile موسسه را می‌گیرد.
     * اگر کاربر موسسه نداشته باشد، نباید کل auth خراب شود.
     */

    if (!tokenStorage.hasToken()) {
      setCharityProfile(null);
      return null;
    }

    setCharityProfileLoading(true);

    try {
      const response = await charityProfileService.getMyProfile();
      const normalizedProfile = normalizeCharityProfileResponse(response);

      setCharityProfile(normalizedProfile);
      return normalizedProfile;
    } catch (error) {
      const status = error?.response?.status;

      /**
       * اگر کاربر profile ندارد، ممکن است بک‌اند 404 بدهد.
       * این خطا برای ما خطای واقعی نیست؛ فقط یعنی دکمه داشبورد موسسه نمایش داده نشود.
       */
      if (status === 404 || status === 400) {
        setCharityProfile(null);
        return null;
      }

      console.error("Failed to load my charity profile:", error);
      setCharityProfile(null);
      return null;
    } finally {
      setCharityProfileLoading(false);
    }
  };

  useEffect(() => {
    const bootstrap = async () => {
      if (!tokenStorage.hasToken()) {
        setUser(null);
        setCharityProfile(null);
        setLoading(false);
        return;
      }

      try {
        const me = await authService.me();
        setUser(me);

        /**
         * بعد از گرفتن user، وضعیت charity profile هم گرفته می‌شود.
         * role کاربر DONOR می‌ماند، پس این اطلاعات برای دکمه و guard ضروری است.
         */
        await loadMyCharityProfile();
      } catch (error) {
        console.error("Auth bootstrap failed:", error);
        tokenStorage.clear();
        setUser(null);
        setCharityProfile(null);
      } finally {
        setLoading(false);
      }
    };

    bootstrap();
  }, []);

  const login = async (credentials) => {
    const loginData = await authService.login(credentials);
    const me = await authService.me();

    /**
     * اگر پروفایل نقش نداشت، از پاسخ لاگین پر می‌کنیم.
     */
    const merged = { ...me, role: me.role ?? loginData.role ?? null };

    setUser(merged);

    /**
     * بلافاصله بعد از login وضعیت موسسه را هم sync می‌کنیم.
     * اگر user قبلاً موسسه approved داشته باشد، بدون refresh دکمه نمایش داده می‌شود.
     */
    await loadMyCharityProfile();

    return merged;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
      setCharityProfile(null);
      tokenStorage.clear();
    }
  };

  const hasApprovedCharityProfile = useMemo(
    () => isApprovedCharityProfile(charityProfile),
    [charityProfile]
  );

  const value = {
    user,
    role: user?.role ?? null,

    loading,
    isAuthenticated: !!user,

    charityProfile,
    charityProfileLoading,
    hasApprovedCharityProfile,

    login,
    logout,

    /**
     * این را برای بعد از approve، submit، edit یا برگشت از صفحات دیگر لازم داریم.
     */
    refreshCharityProfile: loadMyCharityProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
