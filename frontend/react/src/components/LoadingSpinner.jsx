import React from 'react';

export const LoadingSpinner = ({ text = 'Loading...' }) => {
  return (
    <div className="spinner-container">
      <div className="spinner" role="status" aria-label="Loading"></div>
      <p className="text-muted text-sm">{text}</p>
    </div>
  );
};

export default LoadingSpinner;
