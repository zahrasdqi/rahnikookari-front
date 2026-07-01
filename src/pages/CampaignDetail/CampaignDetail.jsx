// src/pages/CampaignDetail/CampaignDetail.jsx
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import Container from "../../components/ui/Container/Container";
import { campaignService } from "../../services/campaign.service";
import CampaignReports from "../../components/features/Reports/CampaignReports";
import "./CampaignDetail.scss";

const MIN_DONATION_AMOUNT = 1000;
const QUICK_AMOUNTS = [10000, 50000, 100000, 250000];

function formatNumber(value) {
  return Number(value || 0).toLocaleString("fa-IR");
}

function formatMoney(value) {
  return `${formatNumber(value)} تومان`;
}

function formatDate(value) {
  if (!value) return "ثبت نشده";
  return new Date(value).toLocaleDateString("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function getDaysLeft(endDate) {
  if (!endDate) return null;
  const today = new Date();
  const end = new Date(endDate);
  today.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  const diff = Math.ceil((end - today) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 0;
}

export default function CampaignDetail() {
  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState("50000");
  const [donating, setDonating] = useState(false);

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const data = await campaignService.getPublicCampaignById(id);
        setCampaign(data);
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaign();
  }, [id]);

  const stats = useMemo(() => {
    const raised = Number(campaign?.collected_amount ?? 0);
    const goal = Number(campaign?.target_amount ?? 0);
    const progress = goal > 0 ? Math.min((raised / goal) * 100, 100) : 0;
    const daysLeft = getDaysLeft(campaign?.end_date);
    return { raised, goal, progress, daysLeft, remaining: goal - raised };
  }, [campaign]);

  if (loading) return <div className="campaign-detail--loading">در حال بارگذاری...</div>;
  if (!campaign) return <div className="campaign-detail--empty">پویش یافت نشد.</div>;

  const handleDonation = async () => {
    if (Number(amount) < MIN_DONATION_AMOUNT) return;
    try {
      setDonating(true);
      const result = await campaignService.startDonation(id, amount);
      if (result.payment_url) window.location.href = result.payment_url;
    } catch (err) {
      alert("خطا در اتصال به درگاه.");
    } finally {
      setDonating(false);
    }
  };

  return (
    <div className="campaign-detail">
      <Container>
        {/* Header Section */}
        <header className="campaign-detail__hero">
          <div className="hero-content">
            <div className="hero-tags">
              <span className="tag-category">{campaign.category || "پویش عمومی"}</span>
              <span className={`tag-status status-${campaign.status}`}>فعال</span>
            </div>
            <h1 className="hero-title">{campaign.title}</h1>
            <p className="hero-subtitle">{campaign.short_description}</p>
            <div className="hero-dates">
              <span>تقویم پویش: {formatDate(campaign.start_date)} تا {formatDate(campaign.end_date)}</span>
            </div>
          </div>
          
          <div className="hero-raised-card">
            <span className="label">مبلغ جمع‌آوری شده</span>
            <div className="value-box">
               <strong className="amount">{formatNumber(stats.raised)}</strong>
               <span className="currency">تومان</span>
            </div>
            <span className="goal-info">از هدف {formatMoney(stats.goal)}</span>
          </div>
        </header>

        <div className="campaign-layout">
          <div className="layout-main">
            {/* About Section */}
            <section className="detail-section card-style">
              <h2 className="section-title">درباره این پویش</h2>
              <div className="description-text">{campaign.description}</div>
            </section>

            {/* Reports Section */}
            <section className="detail-section card-style">
              <h2 className="section-title">گزارش‌های پویش</h2>
              <CampaignReports campaignId={campaign.id} />
            </section>

            {/* Stats Row */}
            <div className="stats-grid">
              <div className="stat-box card-style">
                <span className="stat-label">هدف کل</span>
                <strong className="stat-value">{formatMoney(stats.goal)}</strong>
              </div>
              <div className="stat-box card-style">
                <span className="stat-label">باقی‌مانده</span>
                <strong className="stat-value">{formatMoney(stats.remaining)}</strong>
              </div>
              <div className="stat-box card-style">
                <span className="stat-label">زمان باقی‌مانده</span>
                <strong className="stat-value">{stats.daysLeft} روز</strong>
              </div>
            </div>
          </div>

          <aside className="layout-sidebar">
            <div className="donation-card card-style">
              <div className="donation-card__header">
                <span className="title">حمایت از پویش</span>
                <span className="percent">{stats.progress.toFixed(2)}%</span>
              </div>

              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${stats.progress}%` }} />
              </div>

              <div className="donation-input-group">
                <label>مبلغ دلخواه (تومان)</label>
                <div className="input-wrapper">
                  <input 
                    type="number" 
                    value={amount} 
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
                <div className="quick-select">
                  {QUICK_AMOUNTS.map(val => (
                    <button 
                      key={val} 
                      className={Number(amount) === val ? 'active' : ''}
                      onClick={() => setAmount(String(val))}
                    >
                      {formatNumber(val)}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                className={`btn-donate ${donating ? 'loading' : ''}`}
                onClick={handleDonation}
                disabled={donating || Number(amount) < MIN_DONATION_AMOUNT}
              >
                {donating ? 'در حال انتقال...' : 'پرداخت آنلاین'}
              </button>
            </div>
          </aside>
        </div>
      </Container>
    </div>
  );
}
