//src\pages\Dashboard\VerifierDashboard.jsx
import React, { useEffect, useMemo, useState } from "react";
import VerifierHero from "../../components/features/VerifierDashboard/VerifierHero/VerifierHero";
import { verifierService } from "../../services/verifier.service";
import ReviewDetails from "../../components/features/VerifierDashboard/ReviewDetails/ReviewDetails";
import "./VerifierDashboard.scss";

const STATUS_LABELS = {
  pending: "در انتظار بررسی",
  approved: "تأیید شده",
  rejected: "رد شده",
};

const STATUS_CLASSES = {
  pending: "pending",
  approved: "approved",
  rejected: "rejected",
};

const formatDate = (dateValue) => {
  if (!dateValue) return "-";

  return new Intl.DateTimeFormat("fa-IR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(dateValue));
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

  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);

  const fetchDashboard = async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const data = await verifierService.getDashboard({
        limit: 100,
        offset: 0,
      });

      setDashboardData({
        stats: data?.stats || {
          total: 0,
          pending: 0,
          approved: 0,
          rejected: 0,
        },
        items: Array.isArray(data?.items) ? data.items : [],
      });
    } catch (error) {
      setErrorMessage("دریافت اطلاعات داشبورد اعتبارسنج با خطا مواجه شد.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleOpenReview = async (id) => {
    try {
      setIsDetailLoading(true);

      const detail = await verifierService.getRequestDetail(id);

      setSelectedRequest(detail);
    } catch {
      alert("دریافت جزئیات پرونده با خطا مواجه شد.");
    } finally {
      setIsDetailLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!selectedRequest) return;

    const confirm = window.confirm(
      "آیا از تأیید و فعال‌سازی این موسسه اطمینان دارید؟"
    );

    if (!confirm) return;

    try {
      setIsActionLoading(true);

      await verifierService.approveRequest(selectedRequest.id);

      alert("پرونده با موفقیت تأیید شد.");

      setSelectedRequest(null);
      fetchDashboard();
    } catch {
      alert("خطا در تأیید پرونده.");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleReject = async (reason) => {
    if (!selectedRequest) return;

    const confirm = window.confirm("آیا از رد این پرونده مطمئن هستید؟");

    if (!confirm) return;

    try {
      setIsActionLoading(true);

      await verifierService.rejectRequest(selectedRequest.id, reason);

      alert("پرونده رد شد.");

      setSelectedRequest(null);
      fetchDashboard();
    } catch {
      alert("خطا در رد پرونده.");
    } finally {
      setIsActionLoading(false);
    }
  };

  const stats = useMemo(() => {
    const apiStats = dashboardData.stats || {};

    return {
      totalCount: apiStats.total || 0,
      pendingCount: apiStats.pending || 0,
      rejectedCount: apiStats.rejected || 0,
      approvedCount: apiStats.approved || 0,
    };
  }, [dashboardData.stats]);

  const historyItems = useMemo(
    () =>
      dashboardData.items.filter((item) =>
        ["approved", "rejected"].includes(item.status)
      ),
    [dashboardData.items]
  );

  const heroContent = useMemo(() => {
    switch (activeTab) {
      case "summary":
        return {
          title: "بررسی و اعتبارسنجی موسسات خیریه",
          description:
            "در این صفحه فقط پرونده‌هایی نمایش داده می‌شوند که ادمین برای بررسی به شما اختصاص داده است.",
        };

      case "my-cases":
        return {
          title: "پرونده‌های من",
          description:
            "در این صفحه پرونده‌های مؤسسه‌هایی که به شما اختصاص داده شده نمایش داده می‌شود.",
        };

      case "history":
        return {
          title: "تاریخچه تصمیم‌های اعتبارسنج",
          description:
            "اینجا نتیجه بررسی پرونده‌ها و اقدام‌های قبلی نمایش داده می‌شود.",
        };

      default:
        return {
          title: "داشبورد اعتبارسنج",
          description: "",
        };
    }
  }, [activeTab]);

  return (
    <div className="verifier-main-page">
      <VerifierHero
        title={heroContent.title}
        description={heroContent.description}
      />

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
              className={activeTab === "history" ? "active" : ""}
              onClick={() => setActiveTab("history")}
            >
              تاریخچه بررسی
            </button>
          </div>
        </div>

        {errorMessage && (
          <div className="verifier-dashboard-alert">{errorMessage}</div>
        )}

        {isLoading ? (
          <div className="cases-cards-grid">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="case-item-card skeleton-card"></div>
            ))}
          </div>
        ) : (
          <>
            {activeTab === "summary" && (
              <div className="view-fade-in summary-tab-layout">
                <div className="stats-row-grid">
                  <div className="mini-stat-card">
                    <div className="card-dot light-blue"></div>
                    <div className="stat-value">{stats.totalCount}</div>
                    <div className="stat-label">کل پرونده‌ها</div>
                  </div>

                  <div className="mini-stat-card">
                    <div className="card-dot blue"></div>
                    <div className="stat-value">{stats.pendingCount}</div>
                    <div className="stat-label">در انتظار بررسی</div>
                  </div>

                  <div className="mini-stat-card">
                    <div className="card-dot orange"></div>
                    <div className="stat-value">{stats.rejectedCount}</div>
                    <div className="stat-label">رد شده</div>
                  </div>

                  <div className="mini-stat-card">
                    <div className="card-dot green"></div>
                    <div className="stat-value">{stats.approvedCount}</div>
                    <div className="stat-label">تأیید شده</div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "my-cases" && (
              <div className="view-fade-in my-cases-tab-layout">
                {dashboardData.items.length === 0 ? (
                  <div className="verifier-dashboard-state">
                    پرونده‌ای برای نمایش وجود ندارد.
                  </div>
                ) : (
                  <div className="cases-cards-grid">
                    {dashboardData.items.map((item) => (
                      <div key={item.id} className="case-item-card">
                        <div className="card-gradient-top">
                          <div className="floating-white-square"></div>
                        </div>

                        <div className="card-main-body">
                          <div className="body-header">
                            <span
                              className={`badge-status ${
                                STATUS_CLASSES[item.status] || "pending"
                              }`}
                            >
                              {STATUS_LABELS[item.status] || item.status}
                            </span>

                            <h3>{item.charity_name || "بدون نام"}</h3>
                          </div>

                          <div className="case-meta-list">
                            <div className="meta-row">
                              <span className="meta-label">شناسه پرونده:</span>
                              <span className="meta-value">
                                {String(item.id).slice(0, 8)}
                              </span>
                            </div>

                            <div className="meta-row">
                              <span className="meta-label">تعداد مدارک:</span>
                              <span className="meta-value">
                                {item.documents_count ?? 0}
                              </span>
                            </div>

                            <div className="meta-row">
                              <span className="meta-label">درصد تکمیل:</span>
                              <span className="meta-value">
                                {item.checklist_percent ?? 0}٪
                              </span>
                            </div>

                            <div className="meta-row">
                              <span className="meta-label">تاریخ ثبت:</span>
                              <span className="meta-value">
                                {formatDate(item.created_at)}
                              </span>
                            </div>
                          </div>

                          <div className="body-buttons">
                            <button type="button" className="btn-view">
                              مشاهده
                            </button>

                            <button
                              type="button"
                              className="btn-check"
                              onClick={() => handleOpenReview(item.id)}
                              disabled={isDetailLoading}
                            >
                              {isDetailLoading
                                ? "در حال دریافت..."
                                : "بررسی پرونده"}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "history" && (
              <div className="view-fade-in history-tab-layout">
                <div className="history-white-container">
                  {historyItems.length === 0 ? (
                    <div className="verifier-dashboard-state">
                      هنوز تاریخچه‌ای برای نمایش وجود ندارد.
                    </div>
                  ) : (
                    <div className="history-list">
                      {historyItems.map((item) => (
                        <div key={item.id} className="history-row-card">
                          <div className="history-content">
                            <h5>
                              {item.status === "approved"
                                ? "پرونده تأیید شد"
                                : "پرونده رد شد"}
                            </h5>
                            <p>
                              پرونده {item.charity_name || "بدون نام"} با وضعیت{" "}
                              {STATUS_LABELS[item.status] || item.status} ثبت
                              شده است.
                            </p>
                          </div>

                          <div className="history-date-tag">
                            <span>{formatDate(item.updated_at)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {selectedRequest && (
        <ReviewDetails
          data={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onApprove={handleApprove}
          onReject={handleReject}
          isSubmitting={isActionLoading}
        />
      )}
    </div>
  );
};

export default VerifierDashboard;
