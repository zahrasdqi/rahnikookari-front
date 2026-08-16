//src\components\features\VerifierDashboard\VerifierStats\VerifierStats.jsx
import React from 'react';
import './VerifierStats.scss';

const VerifierStats = ({ stats }) => (
  <div className="verifier-stats">
    <div className="stat-card stat-card--waiting">
       <span className="stat-card__number">{stats?.waiting || 0}</span>
       <span className="stat-card__label">در انتظار بررسی</span>
    </div>
    <div className="stat-card stat-card--pending">
       <span className="stat-card__number">{stats?.pending || 0}</span>
       <span className="stat-card__label">رد شده</span>
    </div>
    <div className="stat-card stat-card--success">
       <span className="stat-card__number">{stats?.approved || 0}</span>
       <span className="stat-card__label">تأیید شده</span>
    </div>
  </div>
);

export default VerifierStats;
