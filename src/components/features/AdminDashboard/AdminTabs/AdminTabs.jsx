import "./AdminTabs.scss";

export default function AdminTabs({
  activeTab,
  onTabChange,
  tabs = [],
}) {
  return (
    <div className="admin-tabs" role="tablist" aria-label="Admin sections">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          type="button"
          role="tab"
          aria-selected={activeTab === tab.value}
          className={`admin-tabs__item ${
            activeTab === tab.value ? "admin-tabs__item--active" : ""
          }`}
          onClick={() => onTabChange(tab.value)}
        >
          <span className="admin-tabs__label">{tab.label}</span>
          {typeof tab.count === "number" && (
            <span className="admin-tabs__count">{tab.count}</span>
          )}
        </button>
      ))}
    </div>
  );
}
