//src\components\features\CharityDashboard\CharityTabs\CharityTabs.jsx
import "./CharityTabs.scss";

export default function CharityTabs({ tabs, activeTab, onChange }) {
  return (
    <nav className="charity-tabs" aria-label="بخش‌های داشبورد مؤسسه">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          type="button"
          className={`charity-tabs__item ${activeTab === tab.key ? "is-active" : ""}`}
          onClick={() => onChange(tab.key)}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
