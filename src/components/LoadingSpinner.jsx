//src/components/LoadingSpinner.jsx

import React from 'react';
import './LoadingSpinner.scss';

const LoadingSpinner = ({ size = 'medium', fullScreen = true }) => {
  if (fullScreen) {
    return (
      <div className="loading-spinner-container">
        <div className={`spinner ${size}`}>
          <div className="spinner-circle"></div>
          <div className="spinner-circle"></div>
          <div className="spinner-circle"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`spinner ${size}`}>
      <div className="spinner-circle"></div>
      <div className="spinner-circle"></div>
      <div className="spinner-circle"></div>
    </div>
  );
};

export default LoadingSpinner;
