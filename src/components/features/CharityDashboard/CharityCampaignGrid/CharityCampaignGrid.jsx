// src/components/features/CharityDashboard/CharityCampaignGrid/CharityCampaignGrid.jsx
import CharityCampaignCard from "../CharityCampaignCard/CharityCampaignCard";
import "./CharityCampaignGrid.scss";

export default function CharityCampaignGrid({ campaigns }) {
  if (!campaigns?.length) {
    return <div className="charity-campaign-grid__empty">پویشی برای نمایش وجود ندارد.</div>;
  }

  return (
    <div className="charity-campaign-grid">
      {campaigns.map((campaign) => (
        <CharityCampaignCard key={campaign.id} campaign={campaign} />
      ))}
    </div>
  );
}
