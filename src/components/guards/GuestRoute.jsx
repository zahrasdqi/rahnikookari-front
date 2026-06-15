//src/components/guards/GuestRoute.jsx

import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function GuestRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div className="auth-loading">در حال بارگذاری...</div>;

  // کاربر لاگین‌کرده نباید صفحه‌ی login/register را ببیند
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  return children;
}
