// src/components/features/CharityDashboard/CampaignManagement/CreateCampaignModal/CreateCampaignModal.jsx
import { useState, useEffect } from "react";
import { campaignService } from "../../../../../services/campaign.service.js";
import "./CreateCampaignModal.scss";

const CATEGORIES = [
  "آموزش",
  "بهداشت و درمان",
  "محیط زیست",
  "کودکان",
  "سالمندان",
  "فقر و محرومیت",
  "بلایا و حوادث",
  "فرهنگ و هنر",
];

export default function CreateCampaignModal({ onClose, onSuccess, campaign = null }) {
  const isEditMode = Boolean(campaign);
  
  const [formData, setFormData] = useState({
    title: "",
    short_description: "",
    description: "",
    category: "",
    target_amount: "",
    start_date: "",
    end_date: "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);

  // پر کردن فرم در حالت ویرایش
  useEffect(() => {
    if (campaign) {
      setFormData({
        title: campaign.title || "",
        short_description: campaign.short_description || "",
        description: campaign.description || "",
        category: campaign.category || "",
        target_amount: campaign.target_amount || "",
        start_date: campaign.start_date?.split('T')[0] || "",
        end_date: campaign.end_date?.split('T')[0] || "",
      });
    }
  }, [campaign]);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  }

  function validate() {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "عنوان پویش الزامی است";
    if (!formData.short_description.trim())
      newErrors.short_description = "توضیح کوتاه الزامی است";
    if (!formData.description.trim())
      newErrors.description = "توضیحات کامل الزامی است";
    if (!formData.category) newErrors.category = "دسته‌بندی الزامی است";
    if (!formData.target_amount || formData.target_amount <= 0)
      newErrors.target_amount = "مبلغ هدف باید بیشتر از صفر باشد";
    if (!formData.start_date) newErrors.start_date = "تاریخ شروع الزامی است";
    if (!formData.end_date) newErrors.end_date = "تاریخ پایان الزامی است";

    if (formData.start_date && formData.end_date) {
      if (new Date(formData.end_date) <= new Date(formData.start_date)) {
        newErrors.end_date = "تاریخ پایان باید بعد از تاریخ شروع باشد";
      }
    }

    return newErrors;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        ...formData,
        target_amount: Number(formData.target_amount),
        start_date: new Date(formData.start_date).toISOString(),
        end_date: new Date(formData.end_date).toISOString(),
      };

      let result;
      if (isEditMode) {
        result = await campaignService.update(campaign.id, payload);
      } else {
        result = await campaignService.create(payload);
      }
      
      onSuccess(result);
    } catch (err) {
      console.error(`Failed to ${isEditMode ? 'update' : 'create'} campaign:`, err);
      setErrors({
        submit: err.response?.data?.detail || 
          `${isEditMode ? 'ویرایش' : 'ایجاد'} پویش با خطا مواجه شد`,
      });
    } finally {
      setSubmitting(false);
    }
  }

  function handleClear() {
    setFormData({
      title: "",
      short_description: "",
      description: "",
      category: "",
      target_amount: "",
      start_date: "",
      end_date: "",
    });
    setErrors({});
  }

  return (
    <div className="create-campaign-modal" onClick={onClose}>
      <div
        className="create-campaign-modal__content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="create-campaign-modal__header">
          <div>
            <h3>{isEditMode ? 'ویرایش پویش' : 'ساخت پویش جدید'}</h3>
            <p className="create-campaign-modal__api-hint">
              {isEditMode ? `PUT /api/v1/campaigns/${campaign.id}` : 'POST /api/v1/campaigns/'}
            </p>
          </div>
          <button
            className="create-campaign-modal__close"
            onClick={onClose}
            type="button"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M18 6L6 18M6 6l12 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <form className="create-campaign-modal__form" onSubmit={handleSubmit}>
          {/* عنوان پویش */}
          <div className="form-field">
            <label htmlFor="title">
              عنوان پویش <span className="required">*</span>
            </label>
            <input
              id="title"
              name="title"
              type="text"
              placeholder="مثلاً کمک برای ساخت مدرسه"
              value={formData.title}
              onChange={handleChange}
              className={errors.title ? "error" : ""}
            />
            {errors.title && <span className="error-text">{errors.title}</span>}
          </div>

          {/* توضیح کوتاه */}
          <div className="form-field">
            <label htmlFor="short_description">
              توضیح کوتاه <span className="required">*</span>
            </label>
            <input
              id="short_description"
              name="short_description"
              type="text"
              placeholder="خلاصه‌ای برای کارت پویش"
              value={formData.short_description}
              onChange={handleChange}
              className={errors.short_description ? "error" : ""}
            />
            {errors.short_description && (
              <span className="error-text">{errors.short_description}</span>
            )}
          </div>

          {/* توضیحات کامل */}
          <div className="form-field">
            <label htmlFor="description">
              توضیحات کامل <span className="required">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              rows="4"
              placeholder="هدف پویش، گروه هدف و نحوه مصرف کمک‌ها را بنویسید..."
              value={formData.description}
              onChange={handleChange}
              className={errors.description ? "error" : ""}
            />
            {errors.description && (
              <span className="error-text">{errors.description}</span>
            )}
          </div>

          {/* دسته‌بندی و مبلغ هدف */}
          <div className="form-row">
            <div className="form-field">
              <label htmlFor="category">
                دسته‌بندی <span className="required">*</span>
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={errors.category ? "error" : ""}
              >
                <option value="">انتخاب کنید</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {errors.category && (
                <span className="error-text">{errors.category}</span>
              )}
            </div>

            <div className="form-field">
              <label htmlFor="target_amount">
                مبلغ هدف (ریال) <span className="required">*</span>
              </label>
              <input
                id="target_amount"
                name="target_amount"
                type="number"
                placeholder="100000000"
                value={formData.target_amount}
                onChange={handleChange}
                className={errors.target_amount ? "error" : ""}
              />
              {errors.target_amount && (
                <span className="error-text">{errors.target_amount}</span>
              )}
            </div>
          </div>

          {/* تاریخ شروع و پایان */}
          <div className="form-row">
            <div className="form-field">
              <label htmlFor="start_date">
                تاریخ شروع <span className="required">*</span>
              </label>
              <input
                id="start_date"
                name="start_date"
                type="date"
                value={formData.start_date}
                onChange={handleChange}
                className={errors.start_date ? "error" : ""}
              />
              {errors.start_date && (
                <span className="error-text">{errors.start_date}</span>
              )}
            </div>

            <div className="form-field">
              <label htmlFor="end_date">
                تاریخ پایان <span className="required">*</span>
              </label>
              <input
                id="end_date"
                name="end_date"
                type="date"
                value={formData.end_date}
                onChange={handleChange}
                className={errors.end_date ? "error" : ""}
              />
              {errors.end_date && (
                <span className="error-text">{errors.end_date}</span>
              )}
            </div>
          </div>

          {errors.submit && (
            <div className="form-error-box">{errors.submit}</div>
          )}

          <div className="create-campaign-modal__actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={isEditMode ? onClose : handleClear}
              disabled={submitting}
            >
              {isEditMode ? 'انصراف' : 'پاک کردن فرم'}
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={submitting}
            >
              {submitting ? "در حال ثبت..." : (isEditMode ? 'ذخیره تغییرات' : 'ثبت پویش')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
