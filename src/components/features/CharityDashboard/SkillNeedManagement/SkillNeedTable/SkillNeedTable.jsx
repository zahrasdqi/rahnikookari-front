// src/components/features/CharityDashboard/SkillNeedManagement/SkillNeedTable/SkillNeedTable.jsx

import SkillNeedStatusBadge from "../SkillNeedStatusBadge/SkillNeedStatusBadge.jsx";
import "./SkillNeedTable.scss";

export default function SkillNeedTable({
  needs,
  isLoading,
  onEdit,
  onDelete,
  onPublish,
}) {
  if (isLoading) {
    return (
      <div className="skill-need-table">
        <div className="skill-need-table__loading">در حال بارگذاری...</div>
      </div>
    );
  }

  if (needs.length === 0) {
    return (
      <div className="skill-need-table">
        <div className="skill-need-table__empty">
          <p>هنوز نیاز مهارتی ایجاد نکرده‌اید.</p>
          <p className="skill-need-table__empty-hint">
            با کلیک بر روی دکمه "ایجاد نیاز جدید" شروع کنید.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="skill-need-table">
      <table className="skill-need-table__table">
        <thead>
          <tr>
            <th>عنوان</th>
            <th>مهارت مورد نیاز</th>
            <th>تعداد نفرات</th>
            <th>تاریخ پایان</th>
            <th>وضعیت</th>
            <th>عملیات</th>
          </tr>
        </thead>
        <tbody>
          {needs.map((need) => (
            <tr key={need.id}>
              <td className="skill-need-table__title">{need.title}</td>
              <td>{need.skill_category || "-"}</td>
              <td className="skill-need-table__center">
                {need.needed_volunteers || "-"}
              </td>
              <td className="skill-need-table__center">
                {need.end_date
                  ? new Date(need.end_date).toLocaleDateString("fa-IR")
                  : "-"}
              </td>
              <td>
                <SkillNeedStatusBadge status={need.status} />
              </td>
              <td>
                <div className="skill-need-table__actions">
                  {need.status === "draft" && (
                    <button
                      type="button"
                      className="skill-need-table__action-btn skill-need-table__action-btn--publish"
                      onClick={() => onPublish(need.id)}
                      title="انتشار"
                    >
                      📢
                    </button>
                  )}
                  <button
                    type="button"
                    className="skill-need-table__action-btn skill-need-table__action-btn--edit"
                    onClick={() => onEdit(need)}
                    title="ویرایش"
                  >
                    ✏️
                  </button>
                  <button
                    type="button"
                    className="skill-need-table__action-btn skill-need-table__action-btn--delete"
                    onClick={() => onDelete(need.id)}
                    title="حذف"
                  >
                    🗑️
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
