// src/components/features/CharityDashboard/ReportManagement/ReportManagement.jsx
import React, { useState, useEffect } from "react";
import { campaignService } from "../../../../services/campaign.service";
import { reportService } from "../../../../services/report.service";
import CreateReportModal from "./CreateReportModal/CreateReportModal";
import ReportList from "./ReportList/ReportList";
import "./ReportManagement.scss";

const ReportManagement = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const data = await campaignService.list();
      setCampaigns(data);
      if (data.length > 0) {
        handleSelectCampaign(data[0]); // انتخاب اولین کمپین به صورت پیش‌فرض
      }
    } catch (err) {
      console.error("خطا در بارگذاری کمپین‌ها", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCampaign = async (campaign) => {
    setSelectedCampaign(campaign);
    setLoading(true);
    try {
      const data = await reportService.getReports(campaign.id);
      setReports(data);
    } catch (err) {
      console.error("خطا در بارگذاری گزارش‌ها", err);
    } finally {
      setLoading(false);
    }
  };

  const handleReportCreated = (newReport) => {
    setReports([newReport, ...reports]);
    setShowModal(false);
  };

  return (
    <div className="report-management">
      <div className="report-management__header">
        <div className="report-management__selector">
          <label>انتخاب کمپین جهت گزارش‌دهی:</label>
          <select 
            onChange={(e) => handleSelectCampaign(campaigns.find(c => c.id === e.target.value))}
            value={selectedCampaign?.id || ""}
          >
            {campaigns.map(c => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select>
        </div>
        
        {selectedCampaign && (
          <button className="btn btn--primary" onClick={() => setShowModal(true)}>
            <i className="fas fa-plus"></i> ثبت گزارش شفافیت جدید
          </button>
        )}
      </div>

      {loading ? (
        <div className="report-management__loading">در حال بارگذاری اطلاعات...</div>
      ) : (
        <ReportList reports={reports} campaignId={selectedCampaign?.id} onUpdate={handleSelectCampaign} />
      )}

      {showModal && (
        <CreateReportModal 
          campaign={selectedCampaign} 
          onClose={() => setShowModal(false)} 
          onSuccess={handleReportCreated}
        />
      )}
    </div>
  );
};

export default ReportManagement;
