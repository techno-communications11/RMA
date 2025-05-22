import React, { useEffect, useState } from "react";
import { Alert } from "react-bootstrap";
import {
  FaImages,
  FaStar,
  FaHeart,
  FaExclamationCircle,
} from "react-icons/fa";
import MarketsFilter from "../Components/Filters/MarketsFilter";
import DateFilter from "../Components/Filters/DateFilter";
import GetMarketsData from "../Components/Apis/GetMarketsImageCountsData";
import LoadingSpinner from "../Components/Messages/LoadingSpinner";
import PropTypes from 'prop-types';

export const MarketImageStatsHeader = ({ error, onDateFilter, onMarketFilter, TableName }) => {
  const [marketData, setMarketsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState("");

  useEffect(() => {
    const handleFetchData = async () => {
      if (!TableName) {
        setFetchError("TableName is not provided");
        return;
      }
      try {
        setLoading(true);
        setFetchError("");
        const data = await GetMarketsData(setLoading, TableName);
        if (Array.isArray(data) && data.length > 0) {
          const normalizedMarkets = data.map((market) => ({
            market: market.Market || "Unknown Market",
            label: market.Market || "Unknown Market",
            uploaded: market.uploaded || 0,
            notUploaded: market.notUploaded || 0,
          }));
          console.log("Market Data in MarketImageStatsHeader:", normalizedMarkets);
          setMarketsData(normalizedMarkets);
        } else {
          setFetchError("No markets found");
        }
      } catch (err) {
        setFetchError(err.message || "Failed to fetch market data");
        console.error("Fetch error in MarketImageStatsHeader:", err.message, err.stack);
      }
    };

    handleFetchData();
  }, [TableName]);

  return (
    <div className="d-flex align-items-center mb-2 flex-column flex-md-row">
      {loading && <LoadingSpinner />}
      <div className="col-12 col-md-auto d-flex justify-content-center mb-3 mb-md-0">
        <DateFilter onFilter={onDateFilter} />
      </div>
      <div className="col-12 col-md text-center mb-1 mb-md-0 me-5">
        <h3 className="fw-bold text-pink-600 d-flex align-items-center justify-content-center">
          <FaImages className="bounce-icon" />
          Market Image Analytics
          <FaStar className="text-warning shimmer" />
        </h3>
        <p className="text-muted d-flex align-items-center justify-content-center">
          <FaHeart className="text-pink-400 pulse-icon" />
          Visual insights across markets and stores
        </p>
      </div>
      <div className="col-12 col-md-auto d-flex justify-content-center">
        <MarketsFilter onFilter={onMarketFilter} marketsData={marketData} />
      </div>
      {(error || fetchError) && (
        <Alert variant="danger" className="animate__animated animate__shakeX">
          <FaExclamationCircle className="shake-icon me-2" />
          {error || fetchError}
        </Alert>
      )}
    </div>
  );
};

MarketImageStatsHeader.propTypes = {
  error: PropTypes.string,
  onDateFilter: PropTypes.func.isRequired,
  onMarketFilter: PropTypes.func.isRequired,
  TableName: PropTypes.string.isRequired,
};

export default MarketImageStatsHeader;