import { useEffect, useMemo, useState } from "react";
import { mediaService } from "../../../services/media.service";
import { downloadFile } from "../../../utils/downloadFile";
import "./ReportDetailModal.scss";

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

export default function ReportDetailModal({ report, onClose }) {
  const [downloadingId, setDownloadingId] = useState(null);
  const [attachmentMetaById, setAttachmentMetaById] = useState({});

  const attachmentFileIds = useMemo(
    () => normalizeAttachmentFileIds(report),
    [report]
  );

  useEffect(() => {
    let isMounted = true;

    const fetchAttachmentMetadata = async () => {
      try {
        const uniqueFileIds = [...new Set(attachmentFileIds.map(String))];

        if (!uniqueFileIds.length) {
          if (isMounted) {
            setAttachmentMetaById({});
          }
          return;
        }

        const metadataResults = await Promise.allSettled(
          uniqueFileIds.map(async (fileId) => {
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
      } catch (error) {
        if (isMounted) {
          setAttachmentMetaById({});
        }
      }
    };

    fetchAttachmentMetadata();

    return () => {
      isMounted = false;
    };
  }, [attachmentFileIds]);

  const handleDownload = async (fileId, fallbackIndex) => {
    if (!fileId) return;

    try {
      setDownloadingId(fileId);

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
        `report-attachment-${fallbackIndex + 1}`;

      downloadFile(blob, filename);
    } catch (error) {
      console.error("Download failed:", error);

      const status = error?.response?.status;

      if (status === 401) {
        alert("نشست شما منقضی شده است. لطفاً دوباره وارد شوید.");
      } else if (status === 403) {
        alert("شما اجازه دانلود این فایل را ندارید.");
      } else if (status === 404) {
        alert("فایل مورد نظر پیدا نشد.");
      } else {
        alert("خطا در دانلود فایل. لطفاً دسترسی خود را بررسی کنید.");
      }
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="report-modal" onClick={(e) => e.stopPropagation()}>
        <div className="report-modal__header">
          <h3>{report.title}</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="report-modal__form">
          <div className="report-meta-info">
            <span className="badge">{report.report_type}</span>
            <span className="date">
              {new Date(report.created_at).toLocaleDateString("fa-IR")}
            </span>
          </div>

          <p className="report-content-full">
            {report.content || report.description}
          </p>

          {!!attachmentFileIds.length && (
            <div className="report-attachments">
              <h4 className="attachments-title">فایل‌های ضمیمه</h4>

              <div className="attachments-list">
                {attachmentFileIds.map((fileId, index) => {
                  const metadata = attachmentMetaById[String(fileId)];
                  const filename =
                    metadata?.original_filename ||
                    metadata?.stored_filename ||
                    `فایل ضمیمه ${index + 1}`;
                  const fileSize = formatFileSize(metadata?.size_bytes);
                  const isDownloading = downloadingId === fileId;

                  return (
                    <div key={fileId} className="attachment-item">
                      <div className="attachment-main">
                        <span className="attachment-name" title={filename}>
                          {filename}
                        </span>
                        {!!fileSize && (
                          <span className="attachment-size">{fileSize}</span>
                        )}
                      </div>

                      <button
                        type="button"
                        className="attachment-download-btn"
                        onClick={() => handleDownload(fileId, index)}
                        disabled={isDownloading}
                      >
                        {isDownloading ? "در حال دریافت..." : "دانلود فایل"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
