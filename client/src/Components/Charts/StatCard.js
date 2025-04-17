import React from 'react';
import '../../Styles/StatCard.css';

const StatCard = ({ icon: Icon, title, value, colorClass, animate }) => {
  return (
    <div className={`stat-card ${animate ? 'animate-in' : ''}`}>
      <Icon className={`mb-2 ${colorClass}`} size={24} />
      <h3 className="h5 mb-2">{title}</h3>
      <p className={`h3 fw-bold ${colorClass} mb-0`}>{value}</p>
    </div>
  );
};

export default StatCard;