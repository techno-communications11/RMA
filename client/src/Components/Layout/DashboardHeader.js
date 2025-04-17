import React from 'react';
import { BarChart3 } from 'lucide-react';
import '../../Styles/DashboardHeader.css';

const DashboardHeader = ({ store,name}) => {
  return (
    <div className="header-section">
      <div className="image-container">
        <div className="content-overlay">
          <BarChart3 className="text-white" size={32} />
          <h2 className="display-6 fw-bold text-white mb-2">{name}</h2>
          {store && (
            <p className="lead fw-bold text-white mb-0 small">
              Current Store: {store}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;