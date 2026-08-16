// src/components/features/CharityDashboard/CharityCampaignFilters/CharityCampaignFilters.jsx
import "./CharityCampaignFilters.scss";

export default function CharityCampaignFilters({ filters, activeFilter, onChange }) {
  return (
    <div className="charity-campaign-filters">
      {filters.map((filter) => (
        <button
          key={filter.key}
          type="button"
          className={`charity-campaign-filters__item ${
            activeFilter === filter.key ? "is-active" : ""
          }`}
          onClick={() => onChange(filter.key)}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}
