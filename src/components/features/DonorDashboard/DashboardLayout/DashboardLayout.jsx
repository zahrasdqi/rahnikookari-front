// src/components/features/DonorDashboard/DashboardLayout/DashboardLayout.jsx

import React, { useState } from 'react';
import ProfileCard from '../ProfileCard/ProfileCard';
import ProfileTab from '../ProfileTab/ProfileTab';
import SecurityTab from '../SecurityTab/SecurityTab';
import HistoryTab from '../HistoryTab/HistoryTab';
import SkillsTab from '../SkillsTab/SkillsTab';
import './DashboardLayout.scss';

const TABS = [
  { id: 'profile', label: 'اطلاعات پروفایل' },
  { id: 'history', label: 'تاریخچه نیکوکاری' },
  { id: 'skills', label: 'پیشنهاد های مهارتی' },
  { id: 'security', label: 'امنیت حساب' },
];

const DashboardLayout = () => {
  const [activeTab, setActiveTab] = useState('profile');

  const renderTab = () => {
    switch (activeTab) {
      case 'profile':  return <ProfileTab setActiveTab={setActiveTab} />;
      case 'security': return <SecurityTab />;
      case 'history':  return <HistoryTab />;
      case 'skills':   return <SkillsTab />;
      default:         return <ProfileTab setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="dashboard-container">
      {/* کارت معرفی کاربر */}
      <ProfileCard />

      {/* تب‌های قرصی */}
      <nav className="dashboard-tabs">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`tab-pill ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* محتوای متغیر */}
      <div className="dashboard-tab-content">
        {renderTab()}
      </div>
    </div>
  );
};

export default DashboardLayout;
