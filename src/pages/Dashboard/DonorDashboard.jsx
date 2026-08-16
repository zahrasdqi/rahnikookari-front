// src/pages/Dashboard/DonorDashboard.jsx

import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/features/DonorDashboard/DashboardLayout/DashboardLayout";
import Footer from "../../components/layout/Footer/Footer";
import "./DonorDashboard.scss";

export default function DonorDashboard() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const message = location.state?.accessDeniedMessage;

    if (!message) return;

    /**
     * فعلاً ساده‌ترین حالت: alert
     * بعداً اگر سیستم Toast داشتیم می‌توانیم جایگزین کنیم
     */
    console.log("Access Denied Message:", message);
console.log("Location State:", location.state);

    /**
     * state را پاک می‌کنیم تا اگر کاربر refresh کرد
     * دوباره alert نمایش داده نشود
     */
    navigate(location.pathname, {
      replace: true,
      state: {},
    });
  }, [location, navigate]);

  return (
    <div className="donor-dashboard-page">
      <main className="donor-dashboard-page__main">
        <DashboardLayout />
      </main>

      <Footer />
    </div>
  );
}
