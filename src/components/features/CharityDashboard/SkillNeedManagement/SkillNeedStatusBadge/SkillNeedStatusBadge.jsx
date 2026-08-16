// src/components/features/CharityDashboard/SkillNeedManagement/SkillNeedStatusBadge/SkillNeedStatusBadge.jsx

import "./SkillNeedStatusBadge.scss";

const STATUS_CONFIG = {
  draft: { label: "پیش‌نویس", className: "draft" },
  published: { label: "منتشر شده", className: "published" },
  active: { label: "فعال", className: "active" },
  closed: { label: "بسته شده", className: "closed" },
  completed: { label: "تکمیل شده", className: "completed" },
};

export default function SkillNeedStatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.draft;

  return (
    <span className={`skill-need-status-badge skill-need-status-badge--${config.className}`}>
      {config.label}
    </span>
  );
}
