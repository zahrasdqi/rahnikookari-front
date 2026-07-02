// src/pages/CharityDashboard.jsx
import { useEffect, useMemo, useState } from "react";
import { charityProfileService } from "../../services/charityProfile.service.js";
import { campaignService } from "../../services/campaign.service.js";

import CharityHero from "../../components/features/CharityDashboard/CharityHero/CharityHero";
import CharityTabs from "../../components/features/CharityDashboard/CharityTabs/CharityTabs";
import CharityStats from "../../components/features/CharityDashboard/CharityStats/CharityStats";
import CharityCampaignFilters from "../../components/features/CharityDashboard/CharityCampaignFilters/CharityCampaignFilters";
import CharityCampaignGrid from "../../components/features/CharityDashboard/CharityCampaignGrid/CharityCampaignGrid";
import CampaignManagement from "../../components/features/CharityDashboard/CampaignManagement/CampaignManagement";
import SkillNeedManagement from "../../components/features/CharityDashboard/SkillNeedManagement/SkillNeedManagement";
import ReportManagement from "../../components/features/CharityDashboard/ReportManagement/ReportManagement";
import InstitutionProfileTab from "../../components/features/CharityDashboard/InstitutionProfileTab/InstitutionProfileTab";

import "./CharityDashboard.scss";

const DASHBOARD_TABS = [
  { key: "dashboard", label: "داشبورد" },
  { key: "campaigns", label: " پویش های مالی" },
  { key: "non-financial", label: "پویش های غیرمالی" },
  { key: "suggestions", label: "پیشنهادها" },
  { key: "profile", label: "نمایه" },
  { key: "transactions", label: "تراکنش‌ها" },
  { key: "reports", label: "گزارش‌ها" },
];

const CAMPAIGN_FILTERS = [
  { key: "all", label: "همه پویش‌ها" },
  { key: "active", label: "فعال" },
  { key: "completed", label: "تکمیل شده" },
];

function isCompletedCampaign(status) {
  return ["completed", "complete", "done", "finished", "closed"].includes(status);
}

function isActiveCampaign(status) {
  return ["active", "published", "ongoing", "open"].includes(status);
}

/** تبدیل یک آیتم خام API به فرمت مورد انتظار CharityCampaignCard */
function mapCampaign(c) {
  const target = Number(c.target_amount ?? c.goal_amount ?? c.goalAmount ?? 0);
  const collected = Number(c.collected_amount ?? c.raised_amount ?? c.raisedAmount ?? 0);
  const progress = target > 0 ? Math.min((collected / target) * 100, 100) : 0;

  return {
    id: c.id,
    title: c.title ?? "بدون عنوان",
    description: c.description ?? "",
    category: c.category ?? "عمومی",
    status: c.status ?? "pending",
    imageUrl: c.image_url ?? c.cover_image ?? c.imageUrl ?? "",
    goalAmount: target,
    raisedAmount: collected,
    progress,
  };
}

export default function CharityDashboard() {
  const [dashboardData, setDashboardData] = useState({
    charity: null,
    stats: null,
    campaigns: [],
  });
  const [activeTab, setActiveTab] = useState("dashboard");
  const [activeFilter, setActiveFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function fetchDashboard() {
      try {
        setLoading(true);
        setErrorMessage("");

        // هر دو درخواست رو موازی می‌زنیم تا سرعت بهتر باشه
        const [profile, campaignsResponse] = await Promise.all([
          charityProfileService.getMyProfile(),
          campaignService.list(),
        ]);

        // ── دیباگ: ساختار خام response رو ببین ──
        console.log("[CharityDashboard] profile:", profile);
        console.log("[CharityDashboard] campaignsResponse (raw):", campaignsResponse);

        // بک‌اند ممکنه آرایه مستقیم بفرسته یا { results: [...] }
        const rawList = Array.isArray(campaignsResponse)
          ? campaignsResponse
          : (campaignsResponse?.results ?? campaignsResponse?.data ?? []);

        console.log("[CharityDashboard] rawList:", rawList);

        const mappedCampaigns = rawList.map(mapCampaign);

        console.log("[CharityDashboard] mappedCampaigns:", mappedCampaigns);

        // محاسبه stats از روی کمپین‌های دریافتی
        const stats = {
          active: mappedCampaigns.filter(c => isActiveCampaign(c.status)).length,
          completed: mappedCampaigns.filter(c => isCompletedCampaign(c.status)).length,
          donation_total: mappedCampaigns.reduce((sum, c) => sum + c.raisedAmount, 0),
          supporters: 0, // اگه بک‌اند این رو داشت اضافه کن
        };

        console.log("[CharityDashboard] computed stats:", stats);

        if (!isMounted) return;

        setDashboardData({
          charity: profile,
          stats,
          campaigns: mappedCampaigns,
        });
      } catch (error) {
        console.error("[CharityDashboard] fetchDashboard error:", error);
        if (isMounted) setErrorMessage("دریافت اطلاعات داشبورد مؤسسه با خطا مواجه شد.");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchDashboard();
    return () => { isMounted = false; };
  }, []);

  const filteredCampaigns = useMemo(() => {
    const campaigns = dashboardData.campaigns ?? [];
    console.log("[CharityDashboard] filteredCampaigns — filter:", activeFilter, "| total:", campaigns.length);
    if (activeFilter === "active") return campaigns.filter(c => isActiveCampaign(c.status));
    if (activeFilter === "completed") return campaigns.filter(c => isCompletedCampaign(c.status));
    return campaigns;
  }, [dashboardData.campaigns, activeFilter]);

  if (loading) {
    return (
      <main className="charity-dashboard charity-dashboard--center">
        <div className="charity-dashboard__state-card">
          <span className="charity-dashboard__spinner" />
          <p>در حال بارگذاری داشبورد مؤسسه...</p>
        </div>
      </main>
    );
  }

  if (errorMessage) {
    return (
      <main className="charity-dashboard charity-dashboard--center">
        <div className="charity-dashboard__state-card charity-dashboard__state-card--error">
          <h2>خطا در بارگذاری</h2>
          <p>{errorMessage}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="charity-dashboard">
      <CharityHero charity={dashboardData.charity} />

      <div className="charity-dashboard__container">

        <div className="charity-dashboard__tabs">
          <CharityTabs
            tabs={DASHBOARD_TABS}
            activeTab={activeTab}
            onChange={setActiveTab}
          />
        </div>

        {/* ── تب داشبورد (پیش‌فرض) ── */}
        {activeTab === "dashboard" && (
          <>
            <CharityStats stats={dashboardData.stats} />

            <section className="charity-dashboard__campaigns">
              <div className="charity-dashboard__section-header">
                <h2>پویش‌های مؤسسه</h2>
                <CharityCampaignFilters
                  filters={CAMPAIGN_FILTERS}
                  activeFilter={activeFilter}
                  onChange={setActiveFilter}
                />
              </div>
              <CharityCampaignGrid campaigns={filteredCampaigns} />
            </section>
          </>
        )}

        {/* ── تب مدیریت پویش ── */}
        {activeTab === "campaigns" && (
          <CampaignManagement />
        )}

        {/* ── تب نیازهای غیرمالی ── */}
        {activeTab === "non-financial" && (
          <SkillNeedManagement />
        )}

        {/* ── تب‌های دیگه (placeholder فعلاً) ── */}
        {activeTab === "suggestions" && (
          <div className="charity-dashboard__placeholder">
            <p>بخش پیشنهادها به زودی اضافه می‌شود.</p>
          </div>
        )}
        {activeTab === "profile" && (
  <InstitutionProfileTab charity={dashboardData.charity} />
)}
        

        {activeTab === "reports" && (
          <ReportManagement />
        )}

      </div>
    </main>
  );
}
