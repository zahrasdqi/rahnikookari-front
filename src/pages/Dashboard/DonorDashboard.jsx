// src/pages/Dashboard/DonorDashboard.jsx

import DashboardLayout from "../../components/features/DonorDashboard/DashboardLayout/DashboardLayout";
import Footer from "../../components/layout/Footer/Footer";
import "./DonorDashboard.scss";

export default function DonorDashboard() {
  return (
    <div className="donor-dashboard-page">

      <main className="donor-dashboard-page__main">
        <DashboardLayout />
      </main>

      <Footer />
    </div>
  );
}
