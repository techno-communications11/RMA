import React from "react";
import { FaStore } from "react-icons/fa";

const DashboardHeader = ({ store, name }) => {
  return (
    <div className="dashboard-header mb-4">
      <h1 className="text-pink-600 fw-bold d-flex align-items-center">
        <FaStore className="me-2" />
        {name} 
      </h1>
      <h2 className="fw-bold text-primary"> Store: {store || "No Store Selected"}</h2>
      <p className="text-muted fs-3">Welcome to your dashboard</p>
    </div>
  );
};

export default DashboardHeader;