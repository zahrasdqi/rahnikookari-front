//src/components/guards/ProtectedRoute.jsx

import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div className="auth-loading">در حال بارگذاری...</div>;

  if (!isAuthenticated) {
    // مسیر فعلی را نگه می‌داریم تا بعد از لاگین برگردیم
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
