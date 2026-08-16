// src/components/features/DonorDashboard/HistoryTab/HistoryTab.jsx
import React, { useState, useEffect } from "react";
import { profileService } from "../../../../services/profile.service";
import "./HistoryTab.scss";

const HistoryTab = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    hasMore: false,
  });

  useEffect(() => {
    fetchDonations();
  }, [pagination.page]);

  const fetchDonations = async () => {
    try {
      setLoading(true);
      const response = await profileService.getMyDonations();
      // Ensure response is an array, handle potential non-array responses gracefully
      setDonations(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error("Error fetching donations:", error);
      setError("خطا در دریافت تاریخچه. لطفاً دقایقی دیگر امتحان کنید.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Safe Date Formatter with Persian locale
  const formatDate = (dateString) => {
    if (!dateString) return "تاریخ نامشخص";

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return "تاریخ نامعتبر"; // Handles 'Invalid Date' cases
    }

    return new Intl.DateTimeFormat("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  // ✅ Currency Formatter for Toman
  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return "0"; // Handle null/undefined amounts
    return new Intl.NumberFormat("fa-IR").format(Number(amount));
  };

  // ✅ Status Badge Logic (with 'paid' status added)
  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: { label: "تکمیل شده", className: "success" },
      pending: { label: "در انتظار", className: "warning" },
      failed: { label: "ناموفق", className: "danger" },
      paid: { label: "پرداخت شده", className: "success" }, // Added 'paid' status
      // You can add more statuses here if your backend returns them
    };

    const config =
      statusConfig[status] || { label: status || "نامشخص", className: "default" };

    return (
      <span className={`status-badge status-badge--${config.className}`}>
        {config.label}
      </span>
    );
  };

  const handleLoadMore = () => {
    setPagination({ ...pagination, page: pagination.page + 1 });
  };

  // --- Render Logic based on State ---

  // Loading State
  if (loading && donations.length === 0) {
    return (
      <div className="history-tab">
        <div className="history-tab__header">
          <h2 className="history-tab__title">تاریخچه نیکوکاری</h2>
        </div>
        <div className="history-tab__loading">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="donation-card donation-card--skeleton">
              <div className="skeleton skeleton--title"></div>
              <div className="skeleton skeleton--text"></div>
              <div className="skeleton skeleton--text"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="history-tab">
        <div className="history-tab__header">
          <h2 className="history-tab__title">تاریخچه نیکوکاری</h2>
        </div>
        <div className="history-tab__error">
          <div className="error-message">
            <i className="fas fa-exclamation-circle"></i>
            <p>{error}</p>
            <button onClick={fetchDonations} className="btn btn--primary">
              تلاش مجدد
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Empty State
  if (donations.length === 0) {
    return (
      <div className="history-tab">
        <div className="history-tab__header">
          <h2 className="history-tab__title">تاریخچه نیکوکاری</h2>
        </div>
        <div className="history-tab__empty">
          <div className="empty-state">
            <i className="fas fa-heart"></i>
            <h3>هنوز فعالیتی ثبت نشده است.</h3>
            <p>اولین کمک خود را برای کمپین‌های نیازمند انجام دهید.</p>
          </div>
        </div>
      </div>
    );
  }

  // Main Content
  return (
    <div className="history-tab">
      <div className="history-tab__header">
        <h2 className="history-tab__title">تاریخچه نیکوکاری</h2>
        <div className="history-tab__stats">
          <span className="stat-item">
            <i className="fas fa-hand-holding-heart"></i>
            <span>مجموع کمک‌ها: {donations.length}</span>
          </span>
        </div>
      </div>

      <div className="history-tab__list">
        {donations.map((donation) => (
          <div key={donation.id} className="donation-card">
            <div className="donation-card__header">
              <div className="donation-card__campaign">
                <h3 className="donation-card__title">
                  {/* Will display actual campaign title if fetched from backend, otherwise "کمپین حذف شده" */}
                  {donation.campaign?.title || "کمپین حذف شده"}
                </h3>
                <p className="donation-card__charity">
                  {donation.campaign?.charity?.name || "نامشخص"}
                </p>
              </div>
              <div className="donation-card__status">
                {getStatusBadge(donation.status)}
              </div>
            </div>

            <div className="donation-card__body">
              <div className="donation-card__info">
                <div className="info-item">
                  <i className="fas fa-coins"></i>
                  <span>
                    مبلغ: <strong>{formatCurrency(donation.amount)}</strong> تومان
                  </span>
                </div>

                <div className="info-item">
                  <i className="fas fa-calendar-alt"></i>
                  <span>
                    {/* Use paid_at first, fallback to created_at */}
                    {formatDate(donation.paid_at || donation.created_at)}
                  </span>
                </div>

                {donation.payment_ref && (
                  <div className="info-item">
                    <i className="fas fa-receipt"></i>
                    <span>کد تراکنش: {donation.payment_ref}</span>
                  </div>
                )}

                {donation.message && (
                  <div className="info-item info-item--message">
                    <i className="fas fa-comment"></i>
                    <span>{donation.message}</span>
                  </div>
                )}
              </div>

              {donation.campaign && (
                <div className="donation-card__actions">
                  <a
                    href={`/campaigns/${donation.campaign.id}`}
                    className="btn btn--sm btn--outline"
                  >
                    <i className="fas fa-eye"></i>
                    مشاهده کمپین
                  </a>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination (if you implement actual pagination in the backend) */}
      {pagination.hasMore && (
        <div className="history-tab__load-more">
          <button
            onClick={handleLoadMore}
            className="btn btn--secondary"
            disabled={loading}
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                در حال بارگذاری...
              </>
            ) : (
              <>
                <i className="fas fa-arrow-down"></i>
                نمایش بیشتر
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default HistoryTab;
