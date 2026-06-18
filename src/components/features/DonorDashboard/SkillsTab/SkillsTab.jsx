// src/components/features/DonorDashboard/SkillsTab/SkillsTab.jsx
import "./SkillsTab.scss";

export default function SkillsTab() {
  return (
    <div className="skills-tab">
      <div className="card-header">
        <h3>پیشنهادهای مهارتی</h3>
      </div>

      <div className="empty-state">
        <p>در حال حاضر پیشنهادی برای شما وجود ندارد.</p>
      </div>
    </div>
  );
}
