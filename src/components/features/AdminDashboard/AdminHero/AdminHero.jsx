//src/components/features/AdminDashboard/AdminHero/AdminHero.jsx

import "./AdminHero.scss";

export default function AdminHero() {
  return (
    <section className="admin-hero">
      <div className="admin-hero__pattern" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </div>

      <div className="admin-hero__content">
        <span className="admin-hero__badge">
          <i />
          پنل مدیریت سامانه
        </span>

        <h1>مدیریت کاربران</h1>
        <p>
          کاربران، نقش‌ها، وضعیت حساب، تاییدشدگی، آخرین ورود و لینک‌های onboarding را
          از همین بخش مدیریت کنید.
        </p>
      </div>
    </section>
  );
}
