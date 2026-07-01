// src/pages/Dashboard/VerifierDashboard.jsx

import React, { useEffect, useMemo, useState } from "react";
import VerifierHero from "../../components/features/VerifierDashboard/VerifierHero/VerifierHero";
import { verifierService } from "../../services/verifier.service";
import ReviewDetails from "../../components/features/VerifierDashboard/ReviewDetails/ReviewDetails";
import ProfileReviewDetails from "../../components/features/VerifierDashboard/ReviewDetails/ProfileReviewDetails";
import CampaignReviewDetails from "../../components/features/VerifierDashboard/ReviewDetails/CampaignReviewDetails";
import "./VerifierDashboard.scss";

const STATUS_LABELS = {
  pending: "در انتظار بررسی",
  approved: "تأیید شده",
  rejected: "رد شده",
  draft: "پیش‌نویس",
  active: "فعال",
  suspended: "معلق",
  completed: "تکمیل شده",
};

const STATUS_CLASSES = {
  pending: "pending",
  approved: "approved",
  rejected: "rejected",
  draft: "pending",
  active: "approved",
  suspended: "rejected",
  completed: "approved",
};

const VerifierDashboard = () => {
  const [activeTab, setActiveTab] = useState("summary");

  const [dashboardData, setDashboardData] = useState({
    stats: {
      total: 0,
      pending: 0,
      approved: 0,
      rejected: 0,
    },
    items: [],
  });

  const [pendingProfiles, setPendingProfiles] = useState([]);
  const [pendingCampaigns, setPendingCampaigns] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isProfilesLoading, setIsProfilesLoading] = useState(false);
  const [isCampaignsLoading, setIsCampaignsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);

  const fetchDashboard = async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const data = await verifierService.getDashboard();
      setDashboardData({
        stats: data?.stats || dashboardData.stats,
        items: data?.items || [],
      });
    } catch (error) {
      setErrorMessage("بارگذاری داشبورد با خطا مواجه شد.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPendingProfiles = async () => {
    try {
      setIsProfilesLoading(true);
      setErrorMessage("");

      const data = await verifierService.getPendingProfiles();
      setPendingProfiles(Array.isArray(data) ? data : data?.items || []);
    } catch (error) {
      setErrorMessage("بارگذاری نمایه‌های در انتظار با خطا مواجه شد.");
    } finally {
      setIsProfilesLoading(false);
    }
  };

  const fetchPendingCampaigns = async () => {
    try {
      setIsCampaignsLoading(true);
      setErrorMessage("");

      const data = await verifierService.getPendingCampaigns();
      setPendingCampaigns(Array.isArray(data) ? data : data?.items || []);
    } catch (error) {
      setErrorMessage("بارگذاری کمپین‌های در انتظار با خطا مواجه شد.");
    } finally {
      setIsCampaignsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  useEffect(() => {
    if (activeTab === "review-profiles" && pendingProfiles.length === 0) {
      fetchPendingProfiles();
    }
    if (activeTab === "review-campaigns" && pendingCampaigns.length === 0) {
      fetchPendingCampaigns();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const stats = useMemo(() => {
    return dashboardData.stats || {
      total: 0,
      pending: 0,
      approved: 0,
      rejected: 0,
    };
  }, [dashboardData.stats]);

  const handleOpenReview = async (id) => {
    try {
      setIsDetailLoading(true);
      const detail = await verifierService.getRequestDetail(id);
      setSelectedRequest(detail);
    } finally {
      setIsDetailLoading(false);
    }
  };

  const handleRejectRequest = async (reason) => {
    if (!selectedRequest?.id) return;

    try {
      setIsActionLoading(true);
      await verifierService.rejectRequest(selectedRequest.id, reason);
      setSelectedRequest(null);
      await fetchDashboard();
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleApproveRequest = async () => {
    if (!selectedRequest?.id) return;

    try {
      setIsActionLoading(true);
      await verifierService.approveRequest(selectedRequest.id);
      setSelectedRequest(null);
      await fetchDashboard();
    } catch (error) {
      console.error("Approve request failed:", error);
      alert("خطا در تایید پرونده. لطفاً دوباره تلاش کنید.");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleOpenProfileReview = (profile) => {
    setSelectedProfile(profile);
  };

  const handleApproveProfile = async () => {
    if (!selectedProfile?.id) {
      console.error("No selected profile id found:", selectedProfile);
      return;
    }

    try {
      setIsActionLoading(true);

      console.log("Approving charity profile:", {
        id: selectedProfile.id,
        profile: selectedProfile,
      });

      await verifierService.approveProfile(selectedProfile.id);

      setSelectedProfile(null);
      await fetchPendingProfiles();
      await fetchDashboard();
    } catch (error) {
      console.error("Approve profile failed:", {
        status: error?.response?.status,
        data: error?.response?.data,
        message: error?.message,
        selectedProfile,
      });

      alert(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          "خطا در تأیید نمایه. لطفاً لاگ سرور را بررسی کنید."
      );
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleRejectProfile = async (reason) => {
    if (!selectedProfile?.id) return;

    try {
      setIsActionLoading(true);
      await verifierService.rejectProfile(selectedProfile.id, reason);
      setSelectedProfile(null);
      await fetchPendingProfiles();
      await fetchDashboard();
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleOpenCampaignReview = (campaign) => {
    setSelectedCampaign(campaign);
  };

  const handleApproveCampaign = async () => {
    if (!selectedCampaign?.id) return;

    try {
      setIsActionLoading(true);
      await verifierService.approveCampaign(selectedCampaign.id);
      setSelectedCampaign(null);
      await fetchPendingCampaigns();
      await fetchDashboard();
    } catch (error) {
      console.error("Approve campaign failed:", error);
      alert("خطا در تأیید کمپین. لطفاً دوباره تلاش کنید.");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleRejectCampaign = async (reason) => {
    if (!selectedCampaign?.id) return;

    try {
      setIsActionLoading(true);
      await verifierService.rejectCampaign(selectedCampaign.id, reason);
      setSelectedCampaign(null);
      await fetchPendingCampaigns();
      await fetchDashboard();
    } finally {
      setIsActionLoading(false);
    }
  };

  return (
    <div className="verifier-main-page">
      <VerifierHero />

      <div className="dashboard-content-container">
        <div className="tab-navigation-bar">
          <div className="pill-container">
            <button
              type="button"
              className={activeTab === "summary" ? "active" : ""}
              onClick={() => setActiveTab("summary")}
            >
              خلاصه کارها
            </button>

            <button
              type="button"
              className={activeTab === "my-cases" ? "active" : ""}
              onClick={() => setActiveTab("my-cases")}
            >
              پرونده‌های من
            </button>

            <button
              type="button"
              className={activeTab === "review-profiles" ? "active" : ""}
              onClick={() => setActiveTab("review-profiles")}
            >
              بررسی نمایه‌ها
            </button>

            <button
              type="button"
              className={activeTab === "review-campaigns" ? "active" : ""}
              onClick={() => setActiveTab("review-campaigns")}
            >
              بررسی کمپین‌ها
            </button>

            <button
              type="button"
              className={activeTab === "history" ? "active" : ""}
              onClick={() => setActiveTab("history")}
            >
              تاریخچه بررسی
            </button>
          </div>
        </div>

        {errorMessage && <div className="verifier-dashboard-state">{errorMessage}</div>}

        {activeTab === "summary" && (
          <div className="view-fade-in summary-tab-layout">
            <div className="stats-row-grid">
              <div className="mini-stat-card">
                <div className="card-dot light-blue"></div>
                <div className="stat-value">{stats.totalCount ?? stats.total ?? 0}</div>
                <div className="stat-label">کل پرونده‌ها</div>
              </div>

              <div className="mini-stat-card">
                <div className="card-dot orange"></div>
                <div className="stat-value">{stats.pendingCount ?? stats.pending ?? 0}</div>
                <div className="stat-label">پرونده‌ها در انتظار</div>
              </div>

              <div className="mini-stat-card">
                <div className="card-dot green"></div>
                <div className="stat-value">{stats.approvedCount ?? stats.approved ?? 0}</div>
                <div className="stat-label">تأیید شده</div>
              </div>

              <div className="mini-stat-card">
                <div className="card-dot red"></div>
                <div className="stat-value">{stats.rejectedCount ?? stats.rejected ?? 0}</div>
                <div className="stat-label">رد شده</div>
              </div>

              <div className="mini-stat-card">
                <div className="card-dot purple"></div>
                <div className="stat-value">{pendingProfiles.length}</div>
                <div className="stat-label">نمایه‌های در انتظار</div>
              </div>

              <div className="mini-stat-card">
                <div className="card-dot blue"></div>
                <div className="stat-value">{pendingCampaigns.length}</div>
                <div className="stat-label">کمپین‌های در انتظار</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "my-cases" && (
          <div className="view-fade-in my-cases-tab-layout">
            {isLoading ? (
              <div className="verifier-dashboard-state">در حال بارگذاری...</div>
            ) : dashboardData.items.length === 0 ? (
              <div className="verifier-dashboard-state">پرونده‌ای برای نمایش وجود ندارد.</div>
            ) : (
              <div className="cases-cards-grid">
                {dashboardData.items.map((item) => (
                  <div
                    key={item.id}
                    className="case-item-card"
                    onClick={() => handleOpenReview(item.id)}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="card-gradient-top">
                      <div className="floating-white-square"></div>
                    </div>

                    <div className="card-main-body">
                      <div className="body-header">
                        <span className={`badge-status ${STATUS_CLASSES[item.status] || "pending"}`}>
                          {STATUS_LABELS[item.status] || item.status}
                        </span>

                        <h3>{item.charity_name || "بدون نام"}</h3>
                      </div>

                      <div className="case-meta-list">
                        <div className="meta-row">
                          <span className="meta-label">شناسه پرونده:</span>
                          <span className="meta-value">{String(item.id).slice(0, 8)}</span>
                        </div>

                        <div className="meta-row">
                          <span className="meta-label">تعداد مدارک:</span>
                          <span className="meta-value">{item.documents_count ?? 0}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "review-profiles" && (
          <div className="view-fade-in my-cases-tab-layout">
            {isProfilesLoading ? (
              <div className="verifier-dashboard-state">در حال بارگذاری نمایه‌ها...</div>
            ) : pendingProfiles.length === 0 ? (
              <div className="verifier-dashboard-state">نمایه‌ای برای بررسی وجود ندارد.</div>
            ) : (
              <div className="cases-cards-grid">
                {pendingProfiles.map((profile) => (
                  <div
                    key={profile.id}
                    className="case-item-card"
                    onClick={() => handleOpenProfileReview(profile)}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="card-gradient-top">
                      <div className="floating-white-square"></div>
                    </div>

                    <div className="card-main-body">
                      <div className="body-header">
                        <span className="badge-status pending">در انتظار بررسی</span>
                        <h3>{profile.charity_name || profile.name || "بدون نام"}</h3>
                      </div>

                      <div className="case-meta-list">
                        <div className="meta-row">
                          <span className="meta-label">شماره تماس:</span>
                          <span className="meta-value">{profile.phone || profile.phone_number || "-"}</span>
                        </div>

                        <div className="meta-row">
                          <span className="meta-label">موقعیت:</span>
                          <span className="meta-value">{profile.city || profile.province || "-"}</span>
                        </div>

                        <div className="meta-row">
                          <span className="meta-label">توضیح کوتاه:</span>
                          <span className="meta-value">{profile.short_description || profile.description || "-"}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "review-campaigns" && (
          <div className="view-fade-in my-cases-tab-layout">
            {isCampaignsLoading ? (
              <div className="verifier-dashboard-state">در حال بارگذاری کمپین‌ها...</div>
            ) : pendingCampaigns.length === 0 ? (
              <div className="verifier-dashboard-state">کمپینی برای بررسی وجود ندارد.</div>
            ) : (
              <div className="cases-cards-grid">
                {pendingCampaigns.map((campaign) => (
                  <div
                    key={campaign.id}
                    className="case-item-card"
                    onClick={() => handleOpenCampaignReview(campaign)}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="card-gradient-top">
                      <div className="floating-white-square"></div>
                    </div>

                    <div className="card-main-body">
                      <div className="body-header">
                        <span className={`badge-status ${STATUS_CLASSES[campaign.status] || "pending"}`}>
                          {STATUS_LABELS[campaign.status] || campaign.status}
                        </span>
                        <h3>{campaign.title || "بدون عنوان"}</h3>
                      </div>

                      <div className="case-meta-list">
                        <div className="meta-row">
                          <span className="meta-label">دسته‌بندی:</span>
                          <span className="meta-value">{campaign.category || "-"}</span>
                        </div>

                        <div className="meta-row">
                          <span className="meta-label">مبلغ هدف:</span>
                          <span className="meta-value">
                            {campaign.target_amount ? `${campaign.target_amount.toLocaleString()} تومان` : "-"}
                          </span>
                        </div>

                        <div className="meta-row">
                          <span className="meta-label">تاریخ پایان:</span>
                          <span className="meta-value">{campaign.end_date || "-"}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "history" && (
          <div className="view-fade-in">
            <div className="verifier-dashboard-state">
              تاریخچه بررسی هنوز پیاده‌سازی نشده یا از API جداگانه می‌آید.
            </div>
          </div>
        )}
      </div>

      {selectedRequest && (
        <ReviewDetails
          data={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onApprove={handleApproveRequest}
          onReject={handleRejectRequest}
          isSubmitting={isActionLoading}
        />
      )}

      {selectedProfile && (
        <ProfileReviewDetails
          data={selectedProfile}
          onClose={() => setSelectedProfile(null)}
          onApprove={handleApproveProfile}
          onReject={handleRejectProfile}
          isSubmitting={isActionLoading}
        />
      )}

      {selectedCampaign && (
        <CampaignReviewDetails
          data={selectedCampaign}
          onClose={() => setSelectedCampaign(null)}
          onApprove={handleApproveCampaign}
          onReject={handleRejectCampaign}
          isSubmitting={isActionLoading}
        />
      )}
    </div>
  );
};

export default VerifierDashboard;
