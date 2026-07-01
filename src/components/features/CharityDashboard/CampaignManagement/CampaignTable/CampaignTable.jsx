// src/components/features/CharityDashboard/CampaignManagement/CampaignTable/CampaignTable.jsx
import CampaignStatusBadge from "../CampaignStatusBadge/CampaignStatusBadge";
import "./CampaignTable.scss";

function formatDate(isoDate) {
  if (!isoDate) return "—";
  return new Date(isoDate).toLocaleDateString("fa-IR");
}

function formatCurrency(value) {
  if (!value) return "۰";
  return Number(value).toLocaleString("fa-IR");
}

export default function CampaignTable({ campaigns, onEdit, onDelete, onRefresh }) {
  if (!campaigns || campaigns.length === 0) {
    return (
      <div className="campaign-table campaign-table--empty">
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="32" r="32" fill="#F1F5F9" />
          <path
            d="M32 20v24M20 32h24"
            stroke="#94A3B8"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
        <h3>هنوز پویشی ایجاد نشده</h3>
        <p>با کلیک روی دکمه "ایجاد پویش جدید" شروع کنید</p>
      </div>
    );
  }

  return (
    <div className="campaign-table">
      <table>
        <thead>
          <tr>
            <th>عنوان</th>
            <th>دسته‌بندی</th>
            <th>مبلغ هدف</th>
            <th>جمع‌آوری شده</th>
            <th>وضعیت</th>
            <th>تاریخ پایان</th>
            <th>عملیات</th>
          </tr>
        </thead>
        <tbody>
          {campaigns.map((campaign) => (
            <tr key={campaign.id}>
              <td className="campaign-table__title">{campaign.title}</td>
              <td>
                <span className="campaign-table__category">
                  {campaign.category}
                </span>
              </td>
              <td className="campaign-table__amount">
                {formatCurrency(campaign.target_amount)} ریال
              </td>
              <td className="campaign-table__amount campaign-table__amount--collected">
                {formatCurrency(campaign.collected_amount || 0)} ریال
              </td>
              <td>
                <CampaignStatusBadge status={campaign.status} />
              </td>
              <td className="campaign-table__date">
                {formatDate(campaign.end_date)}
              </td>
              <td>
                <div className="campaign-table__actions">
                  <button
                    className="action-btn action-btn--edit"
                    title="ویرایش"
                    onClick={() => onEdit(campaign)}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M11.333 2L14 4.667 5.333 13.333H2.667V10.667L11.333 2z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  <button
                    className="action-btn action-btn--delete"
                    title="حذف"
                    onClick={() => onDelete(campaign.id)}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M13.333 4L12.667 13.333H3.333L2.667 4M6 7.333v4M10 7.333v4M10.667 4V2H5.333v2M1.333 4h13.334"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
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
