import React from 'react';

const StatCard = ({ title, value, subValue, icon, isPositive }) => {
  return (
    <div className="stat-card">
      <div className="stat-header">
        <h3 className="stat-title">{title}</h3>
        <div className="stat-icon-wrapper">
          {icon}
        </div>
      </div>
      <div className="stat-body">
        <span className="stat-value">{value}</span>
        {subValue && (
          <span className={`stat-subvalue ${isPositive ? 'text-success' : 'text-muted'}`}>
            {subValue}
          </span>
        )}
      </div>
    </div>
  );
};

export default StatCard;