//src/components/features/AdminDashboard/AdminDashboardLayout/AdminDashboardLayout.jsx
import { useState } from "react";
import AdminHero from "../AdminHero/AdminHero";
import AdminTabs from "../AdminTabs/AdminTabs";
import UsersManagement from "../UsersManagement/UsersManagement";
import "./AdminDashboardLayout.scss";

const ADMIN_TABS = [
  { value: "users", label: "کاربران" },
  { value: "reports", label: "گزارش‌ها" },
];

export default function AdminDashboardLayout() {
  const [activeTab, setActiveTab] = useState("users");

  return (
    <main className="admin-dashboard">
      <AdminHero />

      <div className="admin-dashboard__tabs">
        <AdminTabs
          tabs={ADMIN_TABS}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>

      {activeTab === "users" && <UsersManagement />}

      {activeTab === "reports" && (
        <section className="admin-dashboard__empty">
          <h3>گزارش‌ها در حال آماده‌سازی است</h3>
          <p>فعلاً تمرکز روی مدیریت کاربران و ساخت نماینده بررسی است.</p>
        </section>
      )}
    </main>
  );
}
