// src/components/features/CharityDashboard/SkillNeedManagement/CreateSkillNeedModal/CreateSkillNeedModal.jsx

import { useState, useEffect } from "react";
import { skillNeedService } from "../../../../../services/skillNeed.service.js";
import "./CreateSkillNeedModal.scss";

const SKILL_CATEGORIES = [
  "طراحی گرافیک",
  "برنامه‌نویسی",
  "مشاوره حقوقی",
  "مشاوره مالی",
  "تدریس",
  "تعمیرات",
  "پزشکی",
  "روانشناسی",
  "سایر",
];

export default function CreateSkillNeedModal({ need, onClose, onSuccess }) {
  const isEditMode = Boolean(need);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    skill_category: "",
    needed_volunteers: 1,
    end_date: "",
    is_remote: false,
    location: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (need) {
      setFormData({
        title: need.title || "",
        description: need.description || "",
        skill_category: need.skill_category || "",
        needed_volunteers: need.needed_volunteers || 1,
        end_date: need.end_date ? need.end_date.split("T")[0] : "",
        is_remote: need.is_remote || false,
        location: need.location || "",
      });
    }
  }, [need]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.title.trim()) {
      setError("عنوان الزامی است.");
      return;
    }
    if (!formData.skill_category) {
      setError("انتخاب دسته مهارت الزامی است.");
      return;
    }

    try {
      setIsSubmitting(true);

      const payload = {
        ...formData,
        needed_volunteers: Number(formData.needed_volunteers),
      };

      if (isEditMode) {
        await skillNeedService.update(need.id, payload);
      } else {
        await skillNeedService.create(payload);
      }

      onSuccess();
    } catch (err) {
      console.error("Failed to save skill need:", err);
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "ذخیره نیاز با خطا مواجه شد."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClear = () => {
    setFormData({
      title: "",
      description: "",
      skill_category: "",
      needed_volunteers: 1,
      end_date: "",
      is_remote: false,
      location: "",
    });
    setError("");
  };

  return (
    <div className="create-skill-need-modal" onClick={onClose}>
      <div
        className="create-skill-need-modal__content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="create-skill-need-modal__header">
          <h2 className="create-skill-need-modal__title">
            {isEditMode ? "ویرایش نیاز مهارتی" : "ایجاد نیاز مهارتی جدید"}
          </h2>
          <button
            type="button"
            className="create-skill-need-modal__close"
            onClick={onClose}
            disabled={isSubmitting}
          >
            ✕
          </button>
        </div>

        {error && <div className="create-skill-need-modal__error">{error}</div>}

        <form className="create-skill-need-modal__form" onSubmit={handleSubmit}>
          <div className="create-skill-need-modal__field">
            <label htmlFor="title">عنوان نیاز *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="مثلاً: طراح گرافیک برای طراحی پوستر"
              required
            />
          </div>

          <div className="create-skill-need-modal__field">
            <label htmlFor="skill_category">دسته مهارت *</label>
            <select
              id="skill_category"
              name="skill_category"
              value={formData.skill_category}
              onChange={handleChange}
              required
            >
              <option value="">انتخاب کنید</option>
              {SKILL_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="create-skill-need-modal__field">
            <label htmlFor="description">توضیحات</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              placeholder="جزئیات کامل درخواست را شرح دهید..."
            />
          </div>

          <div className="create-skill-need-modal__row">
            <div className="create-skill-need-modal__field">
              <label htmlFor="needed_volunteers">تعداد نفرات مورد نیاز</label>
              <input
                type="number"
                id="needed_volunteers"
                name="needed_volunteers"
                value={formData.needed_volunteers}
                onChange={handleChange}
                min="1"
              />
            </div>

            <div className="create-skill-need-modal__field">
              <label htmlFor="end_date">تاریخ پایان</label>
              <input
                type="date"
                id="end_date"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="create-skill-need-modal__field">
            <label className="create-skill-need-modal__checkbox-label">
              <input
                type="checkbox"
                name="is_remote"
                checked={formData.is_remote}
                onChange={handleChange}
              />
              <span>امکان انجام از راه دور</span>
            </label>
          </div>

          {!formData.is_remote && (
            <div className="create-skill-need-modal__field">
              <label htmlFor="location">محل انجام کار</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="مثلاً: تهران، میدان آزادی"
              />
            </div>
          )}

          <div className="create-skill-need-modal__actions">
            {!isEditMode && (
              <button
                type="button"
                className="create-skill-need-modal__btn create-skill-need-modal__btn--secondary"
                onClick={handleClear}
                disabled={isSubmitting}
              >
                پاک کردن فرم
              </button>
            )}
            <button
              type="button"
              className="create-skill-need-modal__btn create-skill-need-modal__btn--secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              انصراف
            </button>
            <button
              type="submit"
              className="create-skill-need-modal__btn create-skill-need-modal__btn--primary"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "در حال ذخیره..."
                : isEditMode
                ? "به‌روزرسانی"
                : "ایجاد نیاز"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
