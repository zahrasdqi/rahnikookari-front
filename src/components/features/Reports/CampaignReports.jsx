import React, { useEffect, useMemo, useState } from "react";
import { campaignService } from "../../../services/campaign.service";
import { mediaService } from "../../../services/media.service";
import { downloadFile } from "../../../utils/downloadFile";
import "./CampaignReports.scss";

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

function normalizeAttachmentFileIds(report) {
  if (Array.isArray(report?.attachment_file_ids)) {
    return report.attachment_file_ids.filter(Boolean);
  }

  return [report?.attachment_file_id || report?.file_id].filter(Boolean);
}

function getAttachmentFilename(fileId, attachmentMetaById, fallbackIndex) {
  const metadata = attachmentMetaById[String(fileId)];

  return (
    metadata?.original_filename ||
    metadata?.stored_filename ||
    metadata?.filename ||
    `فایل ضمیمه ${fallbackIndex + 1}`
  );
}

function formatFileSize(sizeBytes) {
  if (!sizeBytes) return "";

  const units = ["بایت", "کیلوبایت", "مگابایت", "گیگابایت"];
  let size = Number(sizeBytes);
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex += 1;
  }

  return `${size.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}

export default function CampaignReports({ campaignId }) {
  const [reports, setReports] = useState([]);
  const [attachmentMetaById, setAttachmentMetaById] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);

  useEffect(() => {
    if (!campaignId) return;

    let isMounted = true;

    const fetchReports = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await campaignService.getCampaignReports(campaignId);
        const normalizedReports = Array.isArray(data)
          ? data
          : data?.results || data?.items || [];

        if (!isMounted) return;

        setReports(normalizedReports);

        const attachmentFileIds = [
          ...new Set(
            normalizedReports
              .flatMap((report) => normalizeAttachmentFileIds(report))
              .map(String)
          ),
        ];

        if (!attachmentFileIds.length) {
          setAttachmentMetaById({});
          return;
        }

        const metadataResults = await Promise.allSettled(
          attachmentFileIds.map(async (fileId) => {
            const metadata = await mediaService.getFileMetadata(fileId);
            return [String(fileId), metadata];
          })
        );

        if (!isMounted) return;

        const metadataMap = metadataResults.reduce((acc, result) => {
          if (result.status === "fulfilled") {
            const [fileId, metadata] = result.value;
            acc[fileId] = metadata;
          }

          return acc;
        }, {});

        setAttachmentMetaById(metadataMap);
      } catch (err) {
        if (isMounted) {
          setError("خطا در بارگذاری گزارش‌ها");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchReports();

    return () => {
      isMounted = false;
    };
  }, [campaignId]);

  const handleDownloadAttachment = async (report, fileId, index) => {
    if (!fileId) return;

    const downloadKey = `${report.id}-${fileId}`;

    try {
      setDownloadingId(downloadKey);

      const response = await mediaService.download(fileId);

      const blob = new Blob([response.data], {
        type: response.headers["content-type"] || "application/octet-stream",
      });

      const contentDisposition = response.headers["content-disposition"];
      const metadata = attachmentMetaById[String(fileId)];

      const filename =
        getFilenameFromContentDisposition(contentDisposition) ||
        metadata?.original_filename ||
        metadata?.stored_filename ||
        report.attachment_filename ||
        `report-attachment-${fileId}`;

      downloadFile(blob, filename);
    } catch (err) {
      const status = err?.response?.status;

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
      setDownloadingId(null);
    }
  };

  const hasReports = useMemo(() => reports.length > 0, [reports]);

  if (loading) return <div className="campaign-reports__loading">در حال بارگذاری گزارش‌ها...</div>;
  if (error) return <div className="campaign-reports__error">{error}</div>;
  if (!hasReports)
    return <div className="campaign-reports__empty">گزارشی برای این پویش ثبت نشده است.</div>;

  return (
    <div className="campaign-reports">
      {reports.map((report) => {
        const attachmentFileIds = normalizeAttachmentFileIds(report);

        return (
          <div key={report.id} className="campaign-report-card">
            <div className="campaign-report-card__header">
              <h3 className="report-title">{report.title}</h3>
              <span className="report-date">
                {report.created_at
                  ? new Date(report.created_at).toLocaleDateString("fa-IR")
                  : ""}
              </span>
            </div>

            <p className="report-content">{report.content || report.description}</p>

            {!!attachmentFileIds.length && (
              <div className="campaign-report-card__attachments">
                <h4 className="campaign-report-card__attachments-title">فایل‌های پیوست</h4>

                <div className="campaign-report-card__attachments-list">
                  {attachmentFileIds.map((fileId, index) => {
                    const metadata = attachmentMetaById[String(fileId)];
                    const downloadKey = `${report.id}-${fileId}`;
                    const isDownloading = downloadingId === downloadKey;
                    const filename = getAttachmentFilename(fileId, attachmentMetaById, index);
                    const fileSize = formatFileSize(metadata?.size_bytes);

                    return (
                      <button
                        key={`${report.id}-${fileId}`}
                        type="button"
                        className="campaign-report-card__attachment-item"
                        onClick={() => handleDownloadAttachment(report, fileId, index)}
                        disabled={isDownloading}
                        title={filename}
                      >
                        <span className="campaign-report-card__attachment-icon">📎</span>

                        <span className="campaign-report-card__attachment-info">
                          <span className="campaig-report-card__attachment-name">
                            {filename}
                          </span>

                          {!!fileSize && (
                            <span className="campaign-report-card__attachment-size">
                              {fileSize}
                            </span>
                          )}
                        </span>

                        <span className="campaign-report-card__download-text">
                          {isDownloading ? "در حال دانلود..." : "دانلود"}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
