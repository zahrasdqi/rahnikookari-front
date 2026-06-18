// src/pages/Dashboard/VerifierDashboard.jsx
import { useAuth } from "../../contexts/AuthContext";

export default function VerifierDashboard() {
  const { user } = useAuth();
  return (
    <div className="dashboard">
      <h1>داشبورد تأییدکننده</h1>
      <p>خوش آمدید {user?.full_name || user?.email}</p>
    </div>
  );
}
