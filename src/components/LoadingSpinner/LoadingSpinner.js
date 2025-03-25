import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = () => {
  return (
    <div className="loading-container" aria-label="Loading...">
      <div className="loading-spinner"></div>
      <p className="loading-text">Loading weather data...</p>
    </div>
  );
};

export default LoadingSpinner;