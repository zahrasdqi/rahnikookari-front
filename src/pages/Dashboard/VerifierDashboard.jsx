import React, { useMemo, useState } from "react";
import VerifierHero from "../../components/features/VerifierDashboard/VerifierHero/VerifierHero";
import "./VerifierDashboard.scss";

const MOCK_DATA = {
  cases: [
    {
      id: 1,
      title: "مؤسسه خیریه امید فردا",
      location: "تهران، تهران",
      category: "درمان و سلامت",
      regNo: "۱۰۳۴۵",
      docs: 3,
      status: "در انتظار",
      statusClass: "pending",
    },
    {
      id: 2,
      title: "جمعیت نیک‌اندیشان مهر",
      location: "اصفهان، کاشان",
      category: "آموزش و پرورش",
      regNo: "۳۳۱۹",
      docs: 3,
      status: "رد شده",
      statusClass: "rejected",
    },
    {
      id: 3,
      title: "گروه امداد نیک‌یاران",
      location: "کرمان، جیرفت",
      category: "بلایای طبیعی و امداد",
      regNo: "۵۲۰۱۲",
      docs: 3,
      status: "در حال بررسی",
      statusClass: "processing",
    },
    {
      id: 4,
      title: "مؤسسه آفتاب مهربانی",
      location: "فارس، شیراز",
      category: "امنیت غذایی",
      regNo: "۳۲۸۸۱",
      docs: 3,
      status: "تأیید شده",
      statusClass: "approved",
    },
  ],
  history: [
    {
      id: 1,
      title: "درخواست اصلاح ثبت شد",
      desc: "برای جمعیت نیک‌اندیشان مهر، ارسال مجدد مجوز فعالیت درخواست شد.",
      date: "۱۴۰۳/۰۹/۱۲",
    },
    {
      id: 2,
      title: "مؤسسه تأیید شد",
      desc: "پرونده مؤسسه آفتاب مهربانی پس از تکمیل چک‌لیست تأیید شد.",
      date: "۱۴۰۳/۰۹/۱۱",
    },
    {
      id: 3,
      title: "پرونده دریافت شد",
      desc: "پرونده گروه امداد نیک‌یاران برای بررسی به شما اختصاص داده شد.",
      date: "۱۴۰۳/۰۹/۱۰",
    },
  ],
};

const VerifierDashboard = () => {
  const [activeTab, setActiveTab] = useState("summary");

  const stats = useMemo(() => {
    const pendingCount = MOCK_DATA.cases.filter(
      (item) => item.statusClass === "pending"
    ).length;

    const rejectedCount = MOCK_DATA.cases.filter(
      (item) => item.statusClass === "rejected"
    ).length;

    const approvedCount = MOCK_DATA.cases.filter(
      (item) => item.statusClass === "approved"
    ).length;

    const todayCount = 1;

    return {
      pendingCount,
      rejectedCount,
      approvedCount,
      todayCount,
    };
  }, []);

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

        {activeTab === "summary" && (
          <div className="view-fade-in summary-tab-layout">
            <div className="stats-row-grid">
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

              <div className="mini-stat-card">
                <div className="card-dot light-blue"></div>
                <div className="stat-value">{stats.todayCount}</div>
                <div className="stat-label">پرونده امروز</div>
              </div>
            </div>

            <div className="summary-bottom-grid">
              <div className="white-panel-card">
                <div className="panel-header">
                  <div className="header-top-flex">
                    <h4>پرونده‌های اولویت‌دار</h4>
                    <button type="button" className="seeall-btn">
                      مشاهده همه
                    </button>
                  </div>
                  <p>این موارد بهتر است زودتر بررسی شوند.</p>
                </div>

                <div className="panel-list">
                  {MOCK_DATA.cases.slice(0, 3).map((item) => (
                    <div key={item.id} className="panel-item">
                      <span>{item.title}</span>
                      <button type="button" className="mini-btn">
                        بررسی
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="white-panel-card">
                <div className="panel-header">
                  <h4>راهنمای بررسی</h4>
                  <p>مراحل گام‌به‌گام برای نتیجه اعتبارسنجی:</p>
                </div>

                <div className="guide-list">
                  <div className="guide-step">
                    <div className="step-dot"></div>
                    <span>اطلاعات هویتی را بررسی کنید</span>
                  </div>

                  <div className="guide-step">
                    <div className="step-dot"></div>
                    <span>مدارک را با اساسنامه تطبیق دهید</span>
                  </div>

                  <div className="guide-step">
                    <div className="step-dot"></div>
                    <span>نسخه نهایی را ثبت کنید</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "my-cases" && (
          <div className="view-fade-in my-cases-tab-layout">
            <div className="cases-cards-grid">
              {MOCK_DATA.cases.map((item) => (
                <div key={item.id} className="case-item-card">
                  <div className="card-gradient-top">
                    <div className="floating-white-square"></div>
                  </div>

                  <div className="card-main-body">
                    <div className="body-header">
                      <span className={`badge-status ${item.statusClass}`}>
                        {item.status}
                      </span>

                      <h3>{item.title}</h3>
                    </div>

                    <div className="case-meta-list">
                      <div className="meta-row">
                        <span className="meta-label">موقعیت:</span>
                        <span className="meta-value">{item.location}</span>
                      </div>

                      <div className="meta-row">
                        <span className="meta-label">حوزه فعالیت:</span>
                        <span className="meta-value">{item.category}</span>
                      </div>

                      <div className="meta-row">
                        <span className="meta-label">شماره ثبت:</span>
                        <span className="meta-value">{item.regNo}</span>
                      </div>

                      <div className="meta-row">
                        <span className="meta-label">تعداد مدارک:</span>
                        <span className="meta-value">{item.docs}</span>
                      </div>
                    </div>

                    <div className="body-buttons">
                      <button type="button" className="btn-view">
                        مشاهده
                      </button>
                      <button type="button" className="btn-check">
                        بررسی پرونده
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "history" && (
          <div className="view-fade-in history-tab-layout">
            <div className="history-white-container">
              <div className="history-list">
                {MOCK_DATA.history.map((item) => (
                  <div key={item.id} className="history-row-card">
                    <div className="history-content">
                      <h5>{item.title}</h5>
                      <p>{item.desc}</p>
                    </div>

                    <div className="history-date-tag">
                      <span>{item.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifierDashboard;
