//src\components\features\CharityDashboard\CharityStats\CharityStats.jsx
import "./CharityStats.scss";

function formatFaNumber(value) {
  if (value === null || value === undefined) return "۰";
  return Number(value).toLocaleString("fa-IR");
}

const STATS_CONFIG = [
  { key: "active", label: "پویش فعال", icon: "📌" },
  { key: "completed", label: "پویش تکمیل شده", icon: "✅" },
  { key: "donation_total", label: "مجموع کمک‌های دریافتی", icon: "💳" },
  { key: "supporters", label: "نیکوکار مشارکت‌کننده", icon: "👥" },
];

export default function CharityStats({ stats }) {
  return (
    <section className="charity-stats">
      {STATS_CONFIG.map((item) => (
        <article key={item.key} className="charity-stats__card">
          {/* باکس آیکون ۴۴*۴۴ با تغییر رنگ در هاور */}
          <div className="charity-stats__icon-box">
            <span className="charity-stats__icon">{item.icon}</span>
          </div>

          {/* محتوا: کاملاً راست‌چین و تفکیک‌شده */}
          <div className="charity-stats__content">
            <strong className="charity-stats__value">
              {formatFaNumber(stats?.[item.key])}
            </strong>
            <span className="charity-stats__label">{item.label}</span>
          </div>
        </article>
      ))}
    </section>
  );
}
