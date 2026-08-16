// src/components/features/CharityDashboard/CharityCampaignCard/CharityCampaignCard.jsx
import {
  GraduationCap,
  HeartPulse,
  Leaf,
  Baby,
  Users,
  AlertTriangle,
  Palette,
  Sparkles,
  ChevronLeft,
  Building2,
} from "lucide-react";
import { Link } from "react-router-dom";
import "./CharityCampaignCard.scss";

const CATEGORY_ICONS = {
  آموزش: <GraduationCap size={16} />,
  "بهداشت و درمان": <HeartPulse size={16} />,
  "محیط زیست": <Leaf size={16} />,
  کودکان: <Baby size={16} />,
  سالمندان: <Users size={16} />,
  "فقر و محرومیت": <Sparkles size={16} />,
  "بلایا و حوادث": <AlertTriangle size={16} />,
  "فرهنگ و هنر": <Palette size={16} />,
};

function formatFaNumber(value) {
  if (value === null || value === undefined || value === "") return "۰";
  return Number(value).toLocaleString("fa-IR");
}

function getCharityName(campaign) {
  return (
    campaign?.charity_name ||
    campaign?.charity?.name ||
    campaign?.charity?.title ||
    "موسسه خیریه"
  );
}

export default function CharityCampaignCard({ campaign }) {
  const title = campaign?.title ?? "بدون عنوان";
  const description = campaign?.short_description || campaign?.description || "";
  const category = campaign?.category ?? "عمومی";

  const charityName = getCharityName(campaign);
  const goalAmount = Number(campaign?.target_amount || 0);
  const raisedAmount = Number(campaign?.collected_amount ?? campaign?.current_amount ?? 0);
  const progress =
    goalAmount > 0 ? Math.min(Math.round((raisedAmount / goalAmount) * 100), 100) : 0;

  const CategoryIcon = CATEGORY_ICONS[category] || <Sparkles size={16} />;

  return (
    <article className="charity-campaign-card">
      <div className="charity-campaign-card__top">
        <div className="charity-campaign-card__category-label">
          {CategoryIcon}
          <span>{category}</span>
        </div>
      </div>

      <div className="charity-campaign-card__body">
        <div className="charity-campaign-card__charity-info">
          <Building2 size={13} />
          <span className="charity-campaign-card__charity-name">{charityName}</span>
        </div>

        <h3 className="charity-campaign-card__title">{title}</h3>
        <p className="charity-campaign-card__desc">{description}</p>

        <div className="charity-campaign-card__progress">
          <div className="charity-campaign-card__progress-meta">
            <span className="progress-percent">{formatFaNumber(progress)}٪</span>
            <span className="progress-amounts">
              {formatFaNumber(raisedAmount)} / {formatFaNumber(goalAmount)} ریال
            </span>
          </div>
          <div className="charity-campaign-card__bar">
            <span style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="charity-campaign-card__actions">
          <Link to={`/campaigns/${campaign.id}`} className="btn-details">
            <span>مشاهده جزئیات پویش</span>
            <ChevronLeft size={16} />
          </Link>
        </div>
      </div>
    </article>
  );
}
