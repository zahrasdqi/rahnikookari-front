// src/components/features/DonorDashboard/HistoryTab/HistoryTab.jsx
import "./HistoryTab.scss";

export default function HistoryTab() {
  return (
    <div className="history-tab">
      <div className="card-header">
        <h3>تاریخچه نیکوکاری</h3>
      </div>

      <div className="empty-state">
        <p>هنوز فعالیتی ثبت نشده است.</p>
      </div>
    </div>
  );
}
