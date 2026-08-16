// src/components/features/CampaignCard/CampaignCard.jsx
import { Link } from "react-router-dom";
import "./CampaignCard.scss";

function formatNumber(value) {
  const number = Number(value || 0);
  return number.toLocaleString("fa-IR");
}

export default function CampaignCard({ campaign, isCenter = false }) {
  if (!campaign) return null;

  const title = campaign.title || "بدون عنوان";

  const category =
    campaign.category_name ||
    campaign.category ||
    "پویش";

  const org =
    campaign.org ||
    campaign.institution_name ||
    campaign.institution?.name ||
    "نام موسسه";

  const description =
    campaign.short_description ||
    campaign.description ||
    "توضیحاتی برای این پویش ثبت نشده است.";

  const image =
    campaign.image ||
    campaign.cover_image ||
    campaign.thumbnail ||
    null;

  const raised = Number(
    campaign.raised ??
    campaign.raised_amount ??
    0
  );

  const goal = Number(
    campaign.goal ??
    campaign.goal_amount ??
    0
  );

  const daysLeft =
    campaign.daysLeft ??
    campaign.days_left ??
    0;

  const progress =
    goal > 0
      ? Math.min((raised / goal) * 100, 100)
      : 0;

  return (
    <div className={`campaign-card${isCenter ? " campaign-card--active" : ""}`}>
      
      <div className="campaign-card__image">
        {image ? (
          <img src={image} alt={title} />
        ) : (
          <div className="campaign-card__image-placeholder" />
        )}

        <span className="campaign-card__badge">{category}</span>
      </div>

      <div className="campaign-card__body">

        <div className="campaign-card__meta">
          <span className="campaign-card__title">{title}</span>
          <span className="campaign-card__org">{org}</span>
        </div>

        <p className="campaign-card__desc">{description}</p>

        <div className="campaign-card__amounts">
          <span className="campaign-card__raised">
            {formatNumber(raised)}
          </span>

          <span className="campaign-card__goal">
            از {formatNumber(goal)}
          </span>
        </div>

        <div className="campaign-card__progress-track">
          <div
            className="campaign-card__progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>

        <span className="campaign-card__days">
          {daysLeft} روز مانده
        </span>

        <div className="campaign-card__actions">
          
          <button
            type="button"
            className="campaign-card__btn campaign-card__btn--donate"
          >
            کمک مالی
          </button>

          <Link
            to={`/campaigns/${campaign.id}`}
            className="campaign-card__btn campaign-card__btn--details"
          >
            مشاهده جزئیات
          </Link>

        </div>
      </div>
    </div>
  );
}
