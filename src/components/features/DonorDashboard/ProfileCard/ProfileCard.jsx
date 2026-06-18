// src/components/features/DonorDashboard/ProfileCard/ProfileCard.jsx
import { useEffect, useRef, useState } from "react";
import { profileService } from "../../../../services/profile.service";
import "./ProfileCard.scss";

export default function ProfileCard() {
  const [user, setUser] = useState(null);
  const [avatarError, setAvatarError] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    profileService
      .getMe()
      .then((res) => setUser(res.data))
      .catch((err) => console.error(err));
  }, []);

  const formatToman = (amount) => {
    if (amount === null || amount === undefined) return "—";
    return Number(amount).toLocaleString("fa-IR");
  };

  const getUserName = () => {
    const firstName = user?.first_name || user?.firstName || "";
    const lastName = user?.last_name || user?.lastName || "";
    const fullName = `${firstName} ${lastName}`.trim();

    return (
      user?.full_name ||
      user?.fullName ||
      fullName ||
      user?.name ||
      user?.username ||
      "نام و نام خانوادگی"
    );
  };

  const getMembershipYear = () => {
    const directYear = user?.membership_year || user?.member_since_year || user?.joined_year;

    if (directYear) return directYear;

    const dateValue = user?.created_at || user?.date_joined || user?.joined_at;

    if (!dateValue) return "—";

    try {
      return new Intl.DateTimeFormat("fa-IR-u-nu-latn", {
        year: "numeric",
      }).format(new Date(dateValue));
    } catch {
      return "—";
    }
  };

  const getAvatarSource = () => {
    return user?.avatar_url || user?.avatar || user?.profile_image || user?.image || "";
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (file.size > 1024 * 1024) {
      setAvatarError("حجم عکس باید کمتر از ۱ مگابایت باشد.");
      event.target.value = "";
      return;
    }

    setAvatarError("");

    const imageUrl = URL.createObjectURL(file);

    setUser((prev) => ({
      ...prev,
      avatar_url: imageUrl,
    }));
  };

  return (
    <header className="profile-hero">
      <div className="stats-badge">
        <span className="stats-label">کمک‌های شما تا امروز</span>
        <strong className="stats-value">{formatToman(user?.total_donation)}</strong>
        <span className="stats-unit">تومان</span>
      </div>

      <div className="hero-user">
        <div className="user-text">
          <h2>{getUserName()}</h2>
          <p>عضو راه نیک از سال {getMembershipYear()}</p>

          {avatarError && <span className="avatar-error">{avatarError}</span>}
        </div>

        <div className="avatar-wrap">
          <div className="avatar">
            {getAvatarSource() ? (
              <img src={getAvatarSource()} alt="عکس پروفایل" />
            ) : (
              <div className="avatar-empty" />
            )}
          </div>

          <button
            type="button"
            className="edit-avatar"
            title="تغییر عکس"
            aria-label="تغییر عکس پروفایل"
            onClick={handleAvatarClick}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="avatar-input"
            onChange={handleAvatarChange}
          />
        </div>
      </div>
    </header>
  );
}
