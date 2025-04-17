import React from 'react';
import { BarChart3 } from 'lucide-react';
import '../../Styles/DashboardHeader.css';

const DashboardHeader = ({ store,name}) => {
  return (
    <div className="header-section-1">
      <div className="image-container-1">
        <div className="content-overlay-1">
          <BarChart3 className="text-white" size={32} />
          <h2 className=" fw-bold text-white mb-2">{name}</h2>
          {store && (
            <p className="lead fw-bold text-white mb-0 small fs-6">
              Current Store: {store}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;