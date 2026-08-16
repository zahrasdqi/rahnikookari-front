// src/components/guards/RoleRoute.jsx
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { dashboardPathForRole } from "../../constants/roles";

export default function RoleRoute({ allow = [], children }) {
  const { isAuthenticated, loading, role } = useAuth();
  const location = useLocation();

  if (loading) return <div className="auth-loading">در حال بارگذاری...</div>;

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // نقش مجاز نیست → به داشبورد خودش برگردد
  if (allow.length > 0 && !allow.includes(role)) {
    return <Navigate to={dashboardPathForRole(role)} replace />;
  }

  return children;
}
