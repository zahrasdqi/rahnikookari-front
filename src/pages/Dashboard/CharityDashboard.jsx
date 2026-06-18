// src/pages/Dashboard/CharityDashboard.jsx
import { useAuth } from "../../contexts/AuthContext";

export default function CharityDashboard() {
  const { user } = useAuth();
  return (
    <div className="dashboard">
      <h1>داشبورد سازمان خیریه</h1>
      <p>خوش آمدید {user?.full_name || user?.email}</p>
    </div>
  );
}
