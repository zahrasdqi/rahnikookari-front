// src/components/guards/GuestRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { dashboardPathForRole } from "../../constants/roles";

export default function GuestRoute({ children }) {
  const { isAuthenticated, loading, role } = useAuth();

  if (loading) return <div className="auth-loading">در حال بارگذاری...</div>;

  if (isAuthenticated) {
    return <Navigate to={dashboardPathForRole(role)} replace />;
  }

  return children;
}
