import React from "react";
import "./ReportList.scss";

const ReportList = ({ reports }) => {
  if (!reports?.length) {
    return <div className="empty">گزارشی ثبت نشده است.</div>;
  }

  return (
    <div className="report-list">
      {reports.map((report) => (
        <div className="report-card" key={report.id}>
          <div className="report-header">
            <h3>{report.title}</h3>

            <span
              className={`visibility ${
                report.is_public ? "public" : "private"
              }`}
            >
              {report.is_public ? "عمومی" : "خصوصی"}
            </span>
          </div>

          <div className="report-meta">
            <span>نوع گزارش: {report.report_type}</span>

            <span>
              تاریخ:
              {new Date(report.created_at).toLocaleDateString("fa-IR")}
            </span>
          </div>

          <p className="report-content">{report.content}</p>

          {report.image_file_ids?.length > 0 && (
            <div className="report-files">
              🖼 {report.image_file_ids.length} تصویر
            </div>
          )}

          {report.attachment_file_ids?.length > 0 && (
            <div className="report-files">
              📎 {report.attachment_file_ids.length} فایل ضمیمه
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ReportList;
