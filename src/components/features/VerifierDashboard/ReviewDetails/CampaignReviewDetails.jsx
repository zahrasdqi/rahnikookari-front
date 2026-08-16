// src/components/features/VerifierDashboard/ReviewDetails/CampaignReviewDetails.jsx

import React, { useMemo, useState } from "react";
import { mediaService } from "../../../../services/media.service";
import { downloadFile } from "../../../../utils/downloadFile";
import "./ReviewDetails.scss";

function getValue(...values) {
  for (const value of values) {
    if (value !== undefined && value !== null && String(value).trim() !== "") {
      return value;
    }
  }
  return "-";
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

export default function CampaignReviewDetails({
  data,
  onClose,
  onApprove,
  onReject,
  isSubmitting = false,
}) {
  const [isRejectMode, setIsRejectMode] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [downloadingFileKey, setDownloadingFileKey] = useState(null);

  const campaign = useMemo(() => {
    if (!data) return null;
    return data.campaign || data;
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

      const response = await mediaService.download(fileId);

      const blob = new Blob([response.data], {
        type: response.headers["content-type"] || "application/octet-stream",
      });

      const contentDisposition = response.headers["content-disposition"];
      const filename =
        getFilenameFromContentDisposition(contentDisposition) ||
        `${title || "file"}`;

      downloadFile(blob, filename);
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

  if (!campaign) return null;

  const bannerFileId =
    campaign.banner_file_id ||
    campaign.bannerFileId ||
    campaign.banner;

  return (
    <div className="review-details-overlay" role="dialog" aria-modal="true">
      <div
        className="review-details-backdrop"
        onClick={!isSubmitting ? onClose : undefined}
      />

      <aside className="review-details-panel">
        <header className="review-details-header">
          <div className="review-details-header__content">
            <span className="review-details-eyebrow">بررسی کمپین</span>
            <h2 className="review-details-title">
              {getValue(campaign.title, "بدون عنوان")}
            </h2>
            <p className="review-details-subtitle">
              اطلاعات کمپین ثبت‌شده برای بررسی و تأیید/رد
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
              <InfoItem label="عنوان" value={getValue(campaign.title)} />
              <InfoItem label="دسته‌بندی" value={getValue(campaign.category)} />
              <InfoItem label="وضعیت" value={getValue(campaign.status)} />
              <InfoItem
                label="مبلغ هدف"
                value={
                  campaign.target_amount
                    ? `${Number(campaign.target_amount).toLocaleString("fa-IR")} تومان`
                    : "-"
                }
              />
              <InfoItem
                label="تاریخ شروع"
                value={
                  campaign.start_date
                    ? new Date(campaign.start_date).toLocaleDateString("fa-IR")
                    : "-"
                }
              />
              <InfoItem
                label="تاریخ پایان"
                value={
                  campaign.end_date
                    ? new Date(campaign.end_date).toLocaleDateString("fa-IR")
                    : "-"
                }
              />
            </div>
          </section>

          <section className="review-section">
            <div className="review-section__head">
              <h3>فایل‌ها</h3>
            </div>

            <div className="review-documents-list">
              {bannerFileId && (
                <div className="review-document-item">
                  <div>
                    <strong>بنر</strong>
                    <p>{`شناسه فایل: ${bannerFileId}`}</p>
                  </div>
                  <button
                    type="button"
                    className="review-document-download-btn"
                    disabled={!bannerFileId || isSubmitting}
                    onClick={() =>
                      handleDownload({
                        fileId: bannerFileId,
                        title: "banner",
                        key: "banner",
                      })
                    }
                  >
                    {downloadingFileKey === "banner" ? "در حال دانلود..." : "دانلود"}
                  </button>
                </div>
              )}
            </div>
          </section>

          <section className="review-section">
            <div className="review-section__head">
              <h3>توضیحات</h3>
            </div>

            <div className="review-text-block">
              <div className="review-text-block__item">
                <span>توضیح کوتاه</span>
                <p>{getValue(campaign.short_description)}</p>
              </div>

              <div className="review-text-block__item">
                <span>توضیح کامل</span>
                <p>{getValue(campaign.description)}</p>
              </div>
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
                placeholder="دلیل رد این کمپین را بنویسید..."
                disabled={isSubmitting}
              />
            </section>
          )}
        </main>

        <footer className="review-details-footer">
          <div className="review-main-actions">
            {!isRejectMode ? (
              <>
                <button
                  type="button"
                  className="review-btn review-btn--ghost"
                  onClick={onClose}
                >
                  بستن
                </button>
                <button
                  type="button"
                  className="review-btn review-btn--danger-outline"
                  onClick={() => setIsRejectMode(true)}
                >
                  رد کمپین
                </button>
                <button
                  type="button"
                  className="review-btn review-btn--success"
                  onClick={onApprove}
                >
                  تأیید کمپین
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  className="review-btn review-btn--ghost"
                  onClick={() => setIsRejectMode(false)}
                >
                  بازگشت
                </button>
                <button
                  type="button"
                  className="review-btn review-btn--danger"
                  onClick={handleRejectSubmit}
                >
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
