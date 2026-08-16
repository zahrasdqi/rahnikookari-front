// src/components/features/CharityDashboard/CampaignManagement/CampaignManagement.jsx
import { useState, useEffect } from "react";
import { campaignService } from "../../../../services/campaign.service.js";
import CreateCampaignModal from "./CreateCampaignModal/CreateCampaignModal";
import CampaignTable from "./CampaignTable/CampaignTable";
import "./CampaignManagement.scss";

export default function CampaignManagement() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCampaigns();
  }, []);

  async function fetchCampaigns() {
    try {
      setLoading(true);
      const data = await campaignService.list();
      setCampaigns(data);
    } catch (err) {
      console.error("Failed to fetch campaigns:", err);
      setError("دریافت پویش‌ها با خطا مواجه شد");
    } finally {
      setLoading(false);
    }
  }

  function handleCreateNew() {
    setEditingCampaign(null);
    setShowModal(true);
  }

  function handleEdit(campaign) {
    setEditingCampaign(campaign);
    setShowModal(true);
  }

  function handleModalSuccess(savedCampaign) {
    if (editingCampaign) {
      // ویرایش
      setCampaigns((prev) =>
        prev.map((c) => (c.id === savedCampaign.id ? savedCampaign : c))
      );
    } else {
      // ایجاد
      setCampaigns((prev) => [savedCampaign, ...prev]);
    }
    setShowModal(false);
    setEditingCampaign(null);
  }

  function handleModalClose() {
    setShowModal(false);
    setEditingCampaign(null);
  }

  async function handleDelete(campaignId) {
    if (!confirm("آیا از حذف این پویش اطمینان دارید؟")) return;

    try {
      await campaignService.delete(campaignId);
      setCampaigns((prev) => prev.filter((c) => c.id !== campaignId));
    } catch (err) {
      console.error("Failed to delete campaign:", err);
      alert("حذف پویش با خطا مواجه شد");
    }
  }

  if (loading) {
    return (
      <div className="campaign-management campaign-management--loading">
        <span className="campaign-management__spinner" />
        <p>در حال بارگذاری پویش‌ها...</p>
      </div>
    );
  }

  return (
    <div className="campaign-management">
      <div className="campaign-management__header">
        <div>
          <h2>مدیریت پویش‌ها</h2>
          <p>ایجاد و مدیریت پویش‌های خیریه</p>
        </div>
        <button
          className="campaign-management__create-btn"
          onClick={handleCreateNew}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M10 4v12m-6-6h12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          ایجاد پویش جدید
        </button>
      </div>

      {error && (
        <div className="campaign-management__error">
          <p>{error}</p>
        </div>
      )}

      <CampaignTable
        campaigns={campaigns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onRefresh={fetchCampaigns}
      />

      {showModal && (
        <CreateCampaignModal
          campaign={editingCampaign}
          onClose={handleModalClose}
          onSuccess={handleModalSuccess}
        />
      )}
    </div>
  );
}
