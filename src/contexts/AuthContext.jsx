// src/contexts/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { authService } from "../services/auth.service";
import { tokenStorage } from "../api/tokenStorage";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      if (!tokenStorage.hasToken()) {
        setLoading(false);
        return;
      }
      try {
        const me = await authService.me();
        setUser(me);
      } catch {
        tokenStorage.clear();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    bootstrap();
  }, []);

  const login = async (credentials) => {
    const loginData = await authService.login(credentials); // شامل role
    const me = await authService.me();
    // اگر پروفایل نقش نداشت، از پاسخ لاگین پر می‌کنیم
    const merged = { ...me, role: me.role ?? loginData.role ?? null };
    setUser(merged);
    return merged; // صفحه‌ی Login برای مسیردهی به آن نیاز دارد
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const value = {
    user,
    role: user?.role ?? null,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
