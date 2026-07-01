// src/components/features/CharityDashboard/SkillNeedManagement/SkillNeedManagement.jsx

import { useState, useEffect } from "react";
import { skillNeedService } from "../../../../services/skillNeed.service.js";
import SkillNeedTable from "./SkillNeedTable/SkillNeedTable.jsx";
import CreateSkillNeedModal from "./CreateSkillNeedModal/CreateSkillNeedModal.jsx";
import "./SkillNeedManagement.scss";

export default function SkillNeedManagement() {
  const [skillNeeds, setSkillNeeds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNeed, setEditingNeed] = useState(null);
  const [error, setError] = useState("");

  const fetchSkillNeeds = async () => {
    try {
      setIsLoading(true);
      setError("");
      const data = await skillNeedService.list();
      setSkillNeeds(Array.isArray(data) ? data : data?.items || []);
    } catch (err) {
      console.error("Failed to fetch skill needs:", err);
      setError("دریافت نیازهای مهارتی با خطا مواجه شد.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSkillNeeds();
  }, []);

  const handleCreate = () => {
    setEditingNeed(null);
    setIsModalOpen(true);
  };

  const handleEdit = (need) => {
    setEditingNeed(need);
    setIsModalOpen(true);
  };

  const handleDelete = async (needId) => {
    if (!window.confirm("آیا از حذف این نیاز مطمئن هستید؟")) return;

    try {
      await skillNeedService.delete(needId);
      await fetchSkillNeeds();
    } catch (err) {
      console.error("Failed to delete skill need:", err);
      alert("حذف نیاز با خطا مواجه شد.");
    }
  };

  const handlePublish = async (needId) => {
    try {
      await skillNeedService.publish(needId);
      await fetchSkillNeeds();
    } catch (err) {
      console.error("Failed to publish skill need:", err);
      alert("انتشار نیاز با خطا مواجه شد.");
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingNeed(null);
  };

  const handleModalSuccess = async () => {
    setIsModalOpen(false);
    setEditingNeed(null);
    await fetchSkillNeeds();
  };

  if (error) {
    return (
      <div className="skill-need-management">
        <div className="skill-need-management__error">{error}</div>
      </div>
    );
  }

  return (
    <div className="skill-need-management">
      <div className="skill-need-management__header">
        <div className="skill-need-management__title-section">
          <h2 className="skill-need-management__title">مدیریت نیازهای غیرمالی</h2>
          <p className="skill-need-management__subtitle">
            درخواست‌های کمک مهارتی خود را ایجاد و مدیریت کنید
          </p>
        </div>
        <button
          type="button"
          className="skill-need-management__create-btn"
          onClick={handleCreate}
        >
          <span className="skill-need-management__create-icon">+</span>
          ایجاد نیاز جدید
        </button>
      </div>

      <SkillNeedTable
        needs={skillNeeds}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onPublish={handlePublish}
      />

      {isModalOpen && (
        <CreateSkillNeedModal
          need={editingNeed}
          onClose={handleModalClose}
          onSuccess={handleModalSuccess}
        />
      )}
    </div>
  );
}
