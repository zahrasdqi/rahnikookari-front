// src/components/features/VerifierDashboard/ReviewDetails/ProfileReviewDetails.jsx

import React, { useMemo, useState } from "react";
import apiClient from "../../../../api/apiClient";
import "./ReviewDetails.scss";

function getValue(...values) {
  for (const value of values) {
    if (value !== undefined && value !== null && String(value).trim() !== "") {
      return value;
    }
  }
  return "-";
}

function normalizeFileUrl(fileIdOrUrl) {
  if (!fileIdOrUrl) return "";
  if (typeof fileIdOrUrl !== "string") return "";

  if (
    fileIdOrUrl.startsWith("http://") ||
    fileIdOrUrl.startsWith("https://")
  ) {
    return fileIdOrUrl;
  }

  return `/api/v1/media/files/${fileIdOrUrl}/download`;
}

function getFilenameFromContentDisposition(header) {
  if (!header) return null;

  const utf8Match = header.match(/filename\*=UTF-8''([^;]+)/i);
  if (utf8Match?.[1]) {
    return decodeURIComponent(utf8Match[1]);
  }

  const asciiMatch = header.match(/filename="?([^"]+)"?/i);
  if (asciiMatch?.[1]) {
    return asciiMatch[1];
  }

  return null;
}

function InfoItem({ label, value, children }) {
  return (
    <div className="review-info-item">
      <span className="review-info-item__label">{label}</span>
      <div className="review-info-item__value">{children ?? value}</div>
    </div>
  );
}

export default function ProfileReviewDetails({
  data,
  onClose,
  onApprove,
  onReject,
  isSubmitting = false,
}) {
  const [isRejectMode, setIsRejectMode] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [downloadingFileKey, setDownloadingFileKey] = useState(null);

  const profile = useMemo(() => {
    if (!data) return null;
    return data.profile || data;
  }, [data]);

  const handleRejectSubmit = () => {
    const reason = rejectionReason.trim();
    if (!reason) {
      alert("لطفاً دلیل رد را وارد کنید.");
      return;
    }
    onReject?.(reason);
  };

  const handleDownload = async ({ fileId, title, key }) => {
    if (!fileId) return;

    try {
      setDownloadingFileKey(key);

      const downloadUrl = `/api/v1/media/files/${fileId}/download`;
      const response = await apiClient.get(downloadUrl, {
        responseType: "blob",
        headers: {
          Accept: "*/*",
        },
      });

      const blob = new Blob([response.data], {
        type: response.headers["content-type"] || "application/octet-stream",
      });

      const objectUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = objectUrl;

      const contentDisposition = response.headers["content-disposition"];
      const filenameFromHeader = getFilenameFromContentDisposition(
        contentDisposition
      );
      a.download = filenameFromHeader || `${title || "file"}`;

      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(objectUrl);
    } catch (error) {
      const status = error?.response?.status;

      if (status === 401) {
        alert("نشست شما منقضی شده است. لطفاً دوباره وارد شوید.");
      } else if (status === 403) {
        alert("شما اجازه دانلود این فایل را ندارید.");
      } else if (status === 404) {
        alert("فایل مورد نظر پیدا نشد.");
      } else {
        alert("دانلود فایل با خطا مواجه شد.");
      }
    } finally {
      setDownloadingFileKey(null);
    }
  };

  if (!profile) return null;

  const logoFileId = profile.logo_file_id || profile.logoFileId || profile.logo;
  const coverFileId =
    profile.cover_file_id || profile.coverFileId || profile.cover;

  return (
    <div className="review-details-overlay" role="dialog" aria-modal="true">
      <div
        className="review-details-backdrop"
        onClick={!isSubmitting ? onClose : undefined}
      />

      <aside className="review-details-panel">
        <header className="review-details-header">
          <div className="review-details-header__content">
            <span className="review-details-eyebrow">بررسی نمایه خیریه</span>
            <h2 className="review-details-title">
              {getValue(profile.charity_name, profile.name, "بدون نام")}
            </h2>
            <p className="review-details-subtitle">
              اطلاعات نمایه ثبت‌شده برای بررسی و تأیید/رد
            </p>
          </div>

          <button
            type="button"
            className="review-details-close"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="بستن"
          >
            ×
          </button>
        </header>

        <main className="review-details-body">
          <section className="review-section">
            <div className="review-section__head">
              <h3>اطلاعات اصلی</h3>
            </div>

            <div className="review-info-grid">
              <InfoItem label="نام خیریه" value={getValue(profile.charity_name, profile.name)} />
              <InfoItem label="شماره تماس" value={getValue(profile.phone, profile.phone_number)} />
              <InfoItem label="وب‌سایت" value={getValue(profile.website, profile.web_site)} />
              <InfoItem label="استان" value={getValue(profile.province, profile.state)} />
              <InfoItem label="شهر" value={getValue(profile.city)} />
              <InfoItem label="آدرس کامل" value={getValue(profile.full_address, profile.address)} />
            </div>
          </section>

          <section className="review-section">
            <div className="review-section__head">
              <h3>توضیحات نمایه</h3>
            </div>

            <div className="review-text-block">
              <div className="review-text-block__item">
                <span>توضیح کوتاه</span>
                <p>{getValue(profile.short_description, profile.description)}</p>
              </div>

              <div className="review-text-block__item">
                <span>درباره ما</span>
                <p>{getValue(profile.about)}</p>
              </div>

              <div className="review-text-block__item">
                <span>چشم‌انداز</span>
                <p>{getValue(profile.vision)}</p>
              </div>
            </div>
          </section>

          <section className="review-section">
            <div className="review-section__head">
              <h3>فایل‌ها</h3>
            </div>

            <div className="review-documents-list">
              <div className="review-document-item">
                <div>
                  <strong>لوگو</strong>
                  <p>{logoFileId ? `شناسه فایل: ${logoFileId}` : "فایلی ثبت نشده"}</p>
                </div>
                <button
                  type="button"
                  className="review-document-download-btn"
                  disabled={!logoFileId || isSubmitting}
                  onClick={() =>
                    handleDownload({
                      fileId: logoFileId,
                      title: "logo",
                      key: "logo",
                    })
                  }
                >
                  {downloadingFileKey === "logo" ? "در حال دانلود..." : "دانلود"}
                </button>
              </div>

              <div className="review-document-item">
                <div>
                  <strong>کاور</strong>
                  <p>{coverFileId ? `شناسه فایل: ${coverFileId}` : "فایلی ثبت نشده"}</p>
                </div>
                <button
                  type="button"
                  className="review-document-download-btn"
                  disabled={!coverFileId || isSubmitting}
                  onClick={() =>
                    handleDownload({
                      fileId: coverFileId,
                      title: "cover",
                      key: "cover",
                    })
                  }
                >
                  {downloadingFileKey === "cover" ? "در حال دانلود..." : "دانلود"}
                </button>
              </div>
            </div>
          </section>

          <section className="review-section">
            <div className="review-section__head">
              <h3>شبکه‌های اجتماعی</h3>
            </div>

            <div className="review-info-grid">
              <InfoItem label="اینستاگرام" value={getValue(profile.instagram)} />
              <InfoItem label="تلگرام" value={getValue(profile.telegram)} />
              <InfoItem label="توییتر / X" value={getValue(profile.twitter)} />
              <InfoItem label="لینکدین" value={getValue(profile.linkedin)} />
            </div>
          </section>

          {isRejectMode && (
            <section className="review-section">
              <div className="review-section__head">
                <h3>دلیل رد</h3>
              </div>

              <textarea
                className="review-reject-textarea"
                rows={4}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="دلیل رد این نمایه را بنویسید..."
                disabled={isSubmitting}
              />
            </section>
          )}
        </main>


        <footer className="review-details-footer">
        <div className="review-main-actions">
            {!isRejectMode ? (
            <>
                <button type="button" className="review-btn review-btn--ghost" onClick={onClose}>
                بستن
                </button>
                <button type="button" className="review-btn review-btn--danger-outline" onClick={() => setIsRejectMode(true)}>
                رد نمایه
                </button>
                <button type="button" className="review-btn review-btn--success" onClick={onApprove}>
                تأیید نمایه
                </button>
            </>
            ) : (
            <>
                <button type="button" className="review-btn review-btn--ghost" onClick={() => setIsRejectMode(false)}>
                بازگشت
                </button>
                <button type="button" className="review-btn review-btn--danger" onClick={handleRejectSubmit}>
                ثبت نهایی رد
                </button>
            </>
            )}
        </div>
        </footer>

      </aside>
    </div>
  );
}
