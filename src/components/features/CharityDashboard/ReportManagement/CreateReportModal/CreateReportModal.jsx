// src/components/features/CharityDashboard/ReportManagement/CreateReportModal/CreateReportModal.jsx
import React, { useState } from "react";
import { mediaService } from "../../../../../services/media.service";
import { reportService } from "../../../../../services/report.service";
import "./CreateReportModal.scss";

const CreateReportModal = ({ campaign, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    report_type: "general",
    is_public: true,
  });
  const [imageFiles, setImageFiles] = useState([]); // برای پیش‌نمایش
  const [attachmentFiles, setAttachmentFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileUpload = async (e, type) => {
    const files = Array.from(e.target.files);
    const uploadedIds = [];

    for (const file of files) {
      try {
        // فیلد file_usage رو بر اساس نوع گزارش می‌فرستیم
        const result = await mediaService.upload(file, "campaign_report");
        uploadedIds.push(result.id);
        
        if (type === "image") {
          setImageFiles(prev => [...prev, { id: result.id, name: file.name }]);
        } else {
          setAttachmentFiles(prev => [...prev, { id: result.id, name: file.name }]);
        }
      } catch (err) {
        alert(`خطا در آپلود ${file.name}`);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      ...formData,
      image_file_ids: imageFiles.map(f => f.id),
      attachment_file_ids: attachmentFiles.map(f => f.id),
    };

    try {
      const result = await reportService.createReport(campaign.id, payload);
      onSuccess(result);
    } catch (err) {
      console.error(err);
      alert("خطا در ثبت گزارش");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="report-modal">
        <div className="report-modal__header">
          <h3>ثبت گزارش شفافیت: {campaign.title}</h3>
          <button onClick={onClose} className="close-btn">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="report-modal__form">
          <div className="form-group">
            <label>عنوان گزارش</label>
            <input 
              type="text" 
              required 
              placeholder="مثلاً: فاکتورهای خرید مرحله دوم"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>نوع گزارش</label>
              <select value={formData.report_type} onChange={(e) => setFormData({...formData, report_type: e.target.value})}>
                <option value="general">عمومی</option>
                <option value="financial">مالی (فاکتورها)</option>
                <option value="progress">پیشرفت پروژه</option>
              </select>
            </div>
            <div className="form-group form-group--checkbox">
              <label>
                <input 
                  type="checkbox" 
                  checked={formData.is_public}
                  onChange={(e) => setFormData({...formData, is_public: e.target.checked})}
                /> نمایش عمومی برای نیکوکاران
              </label>
            </div>
          </div>

          <div className="form-group">
            <label>شرح گزارش</label>
            <textarea 
              required 
              rows="5"
              placeholder="توضیحات کامل در مورد هزینه‌کرد مبالغ..."
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
            ></textarea>
          </div>

          <div className="upload-section">
            <div className="upload-box">
              <label><i className="fas fa-camera"></i> آپلود تصاویر (JPG, PNG)</label>
              <input type="file" multiple accept="image/*" onChange={(e) => handleFileUpload(e, "image")} />
              <div className="file-previews">
                {imageFiles.map(f => <span key={f.id} className="file-tag">{f.name}</span>)}
              </div>
            </div>

            <div className="upload-box">
              <label><i className="fas fa-paperclip"></i> آپلود مستندات و PDF</label>
              <input type="file" multiple accept=".pdf,.doc,.docx" onChange={(e) => handleFileUpload(e, "attachment")} />
              <div className="file-previews">
                {attachmentFiles.map(f => <span key={f.id} className="file-tag">{f.name}</span>)}
              </div>
            </div>
          </div>

          <div className="report-modal__actions">
            <button type="button" onClick={onClose} className="btn btn--secondary">انصراف</button>
            <button type="submit" disabled={isSubmitting} className="btn btn--primary">
              {isSubmitting ? "در حال ثبت..." : "تایید و انتشار گزارش"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateReportModal;
