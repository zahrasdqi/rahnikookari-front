// src/components/features/VerifierDashboard/ReviewDetails/ReviewDetails.jsx


import { useMemo, useState } from "react";
import apiClient from "../../../../api/apiClient";
import "./ReviewDetails.scss";

const EMPTY_VALUE = "ثبت نشده";

function normalizeDocuments(documents) {
  if (!documents) return [];

  if (Array.isArray(documents)) {
    return documents;
  }

  if (typeof documents === "object") {
    return Object.entries(documents).map(([key, value]) => ({
      key,
      title: value?.title || value?.name || key,
      download_url: value?.download_url || value?.url || value?.file_url || "",
      ...value,
    }));
  }

  return [];
}

function getValue(...values) {
  const found = values.find(
    (value) => value !== undefined && value !== null && value !== ""
  );

  return found || EMPTY_VALUE;
}

function formatDocumentTitle(title) {
  if (!title) return "مدرک";

  const dictionary = {
    registration_certificate: "گواهی ثبت",
    statute: "اساسنامه",
    national_id_certificate: "شناسه ملی",
    license: "مجوز فعالیت",
    board_members: "اعضای هیئت مدیره",
    bank_document: "مدرک بانکی",
  };

  return dictionary[title] || String(title).replaceAll("_", " ");
}

function normalizeDownloadUrl(url) {
  if (!url) return "";

  try {
    const parsed = new URL(url, window.location.origin);
    return `${parsed.pathname}${parsed.search}`;
  } catch {
    return url;
  }
}

function getFilenameFromContentDisposition(header) {
  if (!header) return null;

  const utf8Match = header.match(/filename\*=UTF-8''([^;]+)/i);
  if (utf8Match?.[1]) {
    return decodeURIComponent(utf8Match[1]);
  }

  const normalMatch = header.match(/filename="?([^"]+)"?/i);
  if (normalMatch?.[1]) {
    return normalMatch[1];
  }

  return null;
}

function ReviewDetails({
  data,
  onClose,
  onApprove,
  onReject,
  isSubmitting = false,
}) {
  const [isRejectMode, setIsRejectMode] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [downloadingDocKey, setDownloadingDocKey] = useState(null);

  const documents = useMemo(
    () => normalizeDocuments(data?.documents),
    [data?.documents]
  );

  if (!data) return null;

  const requestId = getValue(data.id, data.request_id);
  const charityName = getValue(
    data.charity_name,
    data.organization_name,
    data.name
  );

  const handleRejectSubmit = () => {
    const reason = rejectionReason.trim();

    if (reason.length < 5) {
      alert("لطفاً دلیل رد پرونده را با جزئیات بیشتری وارد کنید.");
      return;
    }

    onReject(reason);
  };

  const handleDownload = async ({ url, title, key }) => {
    if (!url) {
      alert("لینک فایل موجود نیست.");
      return;
    }

    const finalUrl = normalizeDownloadUrl(url);

    try {
      setDownloadingDocKey(key);

      const response = await apiClient.get(finalUrl, {
        responseType: "blob",
        headers: {
          Accept: "*/*",
        },
      });

      const contentDisposition = response.headers["content-disposition"];

      const filenameFromHeader =
        getFilenameFromContentDisposition(contentDisposition);

      const filename = filenameFromHeader || title || "document";

      const contentType =
        response.headers["content-type"] || "application/octet-stream";

      const blob = new Blob([response.data], {
        type: contentType,
      });

      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename;

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download error:", error);

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
      setDownloadingDocKey(null);
    }
  };

  return (
    <div className="review-details-overlay" role="dialog" aria-modal="true">
      <div
        className="review-details-backdrop"
        onClick={!isSubmitting ? onClose : undefined}
      />

      <aside className="review-details-panel">
        <header className="review-details-header">
          <div className="review-details-header__content">
            <span className="review-details-eyebrow">بررسی پرونده خیریه</span>

            <h2>{charityName}</h2>

            <div className="review-details-meta">
              <span>شناسه درخواست: {requestId}</span>
              <span>
                وضعیت:{" "}
                <strong>
                  {getValue(data.status, data.request_status, "در انتظار بررسی")}
                </strong>
              </span>
            </div>
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
              <span className="review-section__icon">🏛️</span>
              <h3>اطلاعات موسسه</h3>
            </div>

            <div className="review-info-grid">
              <InfoItem label="نام موسسه" value={charityName} />

              <InfoItem
                label="شماره ثبت"
                value={getValue(data.registration_number)}
                ltr
              />

              <InfoItem
                label="شناسه ملی"
                value={getValue(data.national_id)}
                ltr
              />

              <InfoItem
                label="تاریخ تاسیس"
                value={getValue(data.establishment_date, data.founded_at)}
              />

              <InfoItem
                label="حوزه فعالیت"
                value={getValue(data.activity_field, data.category)}
              />

              <InfoItem
                label="توضیح کوتاه"
                value={getValue(data.short_description)}
              />
            </div>
          </section>

          <section className="review-section">
            <div className="review-section__head">
              <span className="review-section__icon">📍</span>
              <h3>اطلاعات تماس و آدرس</h3>
            </div>

            <div className="review-info-grid">
              <InfoItem label="استان" value={getValue(data.province)} />

              <InfoItem label="شهر" value={getValue(data.city)} />

              <InfoItem
                label="شماره تماس"
                value={getValue(data.phone, data.phone_number)}
                ltr
              />

              <InfoItem label="ایمیل" value={getValue(data.email)} ltr />

              <InfoItem
                label="آدرس کامل"
                value={getValue(data.full_address, data.address)}
                wide
              />
            </div>
          </section>

          <section className="review-section">
            <div className="review-section__head">
              <span className="review-section__icon">💳</span>
              <h3>اطلاعات بانکی</h3>
            </div>

            <div className="review-info-grid">
              <InfoItem label="نام بانک" value={getValue(data.bank_name)} />

              <InfoItem
                label="صاحب حساب"
                value={getValue(data.account_owner, data.account_holder)}
              />

              <InfoItem
                label="شماره حساب"
                value={getValue(data.account_number)}
                ltr
              />

              <InfoItem
                label="شماره شبا"
                value={getValue(data.shaba_number, data.iban)}
                ltr
                wide
              />
            </div>
          </section>

          <section className="review-section">
            <div className="review-section__head">
              <span className="review-section__icon">📎</span>
              <h3>مدارک و مستندات</h3>
            </div>

            {documents.length > 0 ? (
              <div className="review-documents">
                {documents.map((doc, index) => {
                  const docTitle = formatDocumentTitle(
                    doc.title || doc.name || doc.key || `مدرک ${index + 1}`
                  );

                  const downloadUrl =
                    doc.download_url || doc.url || doc.file_url || "";

                  const docKey = doc.id || doc.key || index;

                  return (
                    <article
                      className="review-document-card"
                      key={docKey}
                    >
                      <div className="review-document-card__icon">📄</div>

                      <div className="review-document-card__content">
                        <h4>{docTitle}</h4>

                        {downloadUrl ? (
                          <button
                            type="button"
                            className="review-document-download"
                            onClick={() =>
                              handleDownload({
                                url: downloadUrl,
                                title: docTitle,
                                key: docKey,
                              })
                            }
                            disabled={downloadingDocKey === docKey}
                          >
                            {downloadingDocKey === docKey
                              ? "در حال دانلود..."
                              : "مشاهده / دانلود فایل"}
                          </button>
                        ) : (
                          <span>لینک فایل موجود نیست</span>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="review-empty-state">
                مدرکی برای این درخواست ثبت نشده است.
              </div>
            )}
          </section>

          {getValue(data.description, data.full_description) !== EMPTY_VALUE && (
            <section className="review-section">
              <div className="review-section__head">
                <span className="review-section__icon">📝</span>
                <h3>توضیحات تکمیلی</h3>
              </div>

              <p className="review-long-text">
                {getValue(data.description, data.full_description)}
              </p>
            </section>
          )}
        </main>

        <footer className="review-details-footer">
          {isRejectMode ? (
            <div className="review-reject-box">
              <label htmlFor="rejectionReason">دلیل رد پرونده</label>

              <textarea
                id="rejectionReason"
                value={rejectionReason}
                onChange={(event) => setRejectionReason(event.target.value)}
                placeholder="مثلاً: تصویر مجوز فعالیت واضح نیست یا اطلاعات بانکی با نام موسسه تطابق ندارد..."
                disabled={isSubmitting}
              />

              <div className="review-reject-actions">
                <button
                  type="button"
                  className="review-btn review-btn--danger"
                  onClick={handleRejectSubmit}
                  disabled={isSubmitting || rejectionReason.trim().length < 5}
                >
                  {isSubmitting ? "در حال ثبت..." : "ثبت رد پرونده"}
                </button>

                <button
                  type="button"
                  className="review-btn review-btn--ghost"
                  onClick={() => {
                    setIsRejectMode(false);
                    setRejectionReason("");
                  }}
                  disabled={isSubmitting}
                >
                  انصراف
                </button>
              </div>
            </div>
          ) : (
            <div className="review-main-actions">
              <button
                type="button"
                className="review-btn review-btn--success"
                onClick={onApprove}
                disabled={isSubmitting}
              >
                {isSubmitting ? "در حال تایید..." : "تایید و فعال‌سازی موسسه"}
              </button>

              <button
                type="button"
                className="review-btn review-btn--danger-outline"
                onClick={() => setIsRejectMode(true)}
                disabled={isSubmitting}
              >
                رد پرونده
              </button>
            </div>
          )}
        </footer>
      </aside>
    </div>
  );
}

function InfoItem({ label, value, wide = false, ltr = false }) {
  return (
    <div className={`review-info-item ${wide ? "review-info-item--wide" : ""}`}>
      <span>{label}</span>
      <strong className={ltr ? "review-ltr" : ""}>{value}</strong>
    </div>
  );
}

export default ReviewDetails;
