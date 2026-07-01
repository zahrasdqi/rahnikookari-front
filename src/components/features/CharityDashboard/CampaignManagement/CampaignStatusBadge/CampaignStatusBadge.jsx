// src/components/features/CharityDashboard/CampaignManagement/CampaignStatusBadge/CampaignStatusBadge.jsx
import "./CampaignStatusBadge.scss";

const STATUS_CONFIG = {
  active: {
    label: "فعال",
    className: "active",
    icon: "●",
  },
  completed: {
    label: "تکمیل شده",
    className: "completed",
    icon: "✓",
  },
  pending: {
    label: "در انتظار",
    className: "pending",
    icon: "○",
  },
  rejected: {
    label: "رد شده",
    className: "rejected",
    icon: "✕",
  },
  cancelled: {
    label: "لغو شده",
    className: "cancelled",
    icon: "✕",
  },
};

export default function CampaignStatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending;

  return (
    <span className={`campaign-status-badge campaign-status-badge--${config.className}`}>
      <span className="campaign-status-badge__icon">{config.icon}</span>
      {config.label}
    </span>
  );
}
