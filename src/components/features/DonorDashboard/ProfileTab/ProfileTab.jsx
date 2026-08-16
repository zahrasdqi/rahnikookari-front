// src/components/features/DonorDashboard/ProfileTab/ProfileTab.jsx

import { useEffect, useState } from "react";
import { profileService } from "../../../../services/profile.service";
import { tokenStorage } from "../../../../api/tokenStorage";
import "./ProfileTab.scss";

export default function ProfileTab({ setActiveTab }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    profileService
      .getMe()
      .then((res) => setUser(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    tokenStorage.clear();
    window.location.href = "/login";
  };

  const formatLastLogin = (value) => {
    if (!value) return "مشخص نیست";

    try {
      return new Intl.DateTimeFormat("fa-IR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(value));
    } catch {
      return value;
    }
  };

  const getUserName = () => user?.username || user?.name || user?.full_name || "ثبت نشده";

  if (loading) {
    return (
      <div className="profile-loading">
        <span className="loader-dot" />
        <p>در حال دریافت اطلاعات حساب...</p>
      </div>
    );
  }

  return (
    <section className="profile-tab">
      <div className="profile-tab__header">
        <div>
          <span className="profile-tab__eyebrow">حساب کاربری</span>
          <h3>{getUserName()}</h3>
          <p>اطلاعات اصلی حساب شما در این بخش قابل مشاهده است.</p>
        </div>
      </div>

      <div className="profile-info-grid">
        <div className="profile-info-card profile-info-card--wide">
          <span className="profile-info-card__label">ایمیل</span>
          <strong className="profile-info-card__value profile-info-card__value--ltr">
            {user?.email || "ثبت نشده"}
          </strong>
        </div>

        <div className="profile-info-card profile-info-card--wide">
          <span className="profile-info-card__label">آخرین بازدید</span>
          <strong className="profile-info-card__value">
            {formatLastLogin(user?.last_login || user?.lastLogin)}
          </strong>
        </div>
      </div>

      <div className="profile-tab__actions">
        <button
          type="button"
          className="profile-tab__security-btn"
          onClick={() => setActiveTab("security")}
        >
          تغییر رمز عبور
        </button>

        <button type="button" className="profile-tab__logout" onClick={handleLogout}>
          خروج از حساب کاربری
        </button>
      </div>
    </section>
  );
}
