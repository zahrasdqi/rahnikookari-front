//front\rahnikookari-front\src\contexts\AuthContext.jsx

import { createContext, useContext, useEffect, useState } from "react";
import { authService } from "../services/auth.service";
import { tokenStorage } from "../api/tokenStorage";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // در شروع، اگر توکن داریم کاربر را می‌گیریم
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
    await authService.login(credentials); // توکن‌ها داخل سرویس ذخیره می‌شوند
    const me = await authService.me();
    setUser(me);
    return me;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user, // ← guardها به این نیاز دارند
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
