import React from "react";
import { Alert } from "react-bootstrap";
import { 
  FaImages, 
  FaStar, 
  FaHeart, 
  FaExclamationCircle 
} from "react-icons/fa";
import MarketsFilter from "../../Utilitycomponents/MarketsFilter";
import DateFilter from "../../Utilitycomponents/DateFilter";

export const MarketImageStatsHeader = ({ 
  error, 
  onDateFilter, 
  onMarketFilter 
}) => {
  return (
    <div className="d-flex align-items-center mb-2 flex-column flex-md-row">
      {/* Date Filter Section */}
      <div className="col-12 col-md-auto d-flex justify-content-center mb-3 mb-md-0 ">
        <DateFilter onFilter={onDateFilter} />
      </div>

      {/* Market Image Analytics Section */}
      <div className="col-12 col-md text-center mb-1 mb-md-0 me-5 ">
        <h3 className="fw-bold text-pink-600 d-flex align-items-center justify-content-center">
          <FaImages className=" bounce-icon" />
          Market Image Analytics
          <FaStar className="text-warning shimmer" />
        </h3>
        <p className="text-muted d-flex align-items-center justify-content-center">
          <FaHeart className="text-pink-400  pulse-icon" />
          Visual insights across markets and stores
        </p>
      </div>

      {/* Markets Filter Section */}
      <div className="col-12 col-md-auto d-flex justify-content-center">
        <MarketsFilter onFilter={onMarketFilter} />
      </div>

      {error && (
        <Alert variant="danger" className="animate__animated animate__shakeX">
          <FaExclamationCircle className="shake-icon me-2" /> {error}
        </Alert>
      )}
    </div>
  );
};