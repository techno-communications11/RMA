import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { MarketImageStatsHeader } from "./MarketImageStatsHeader";
import { MarketCard } from "./MarketCard";
import { StoresList } from "./StoresList";

import axios from "axios";
import LoadingSpinner from "../../../utils/LoadingSpinner";

const MarketImageStats = () => {
  const [marketsData, setMarketsData] = useState([]);
  const [storesData, setStoresData] = useState([]);
  const [selectedMarket, setSelectedMarket] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [filteredMarkets, setFilteredMarkets] = useState([]);
  const navigate = useNavigate();

  const handleError = (message) => {
    setError(message);
    setLoading(false);
  };

  const fetchMarketData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/get-market-image-counts`,
        { withCredentials: true }
      );
      const data = response.data;

      if (response.status === 200) {
        setMarketsData(data);
        setFilteredMarkets(data); // Set initial filtered data to all markets
      } else {
        handleError(data.message || "Failed to fetch market data");
      }
    } catch (err) {
      handleError("Error fetching market data");
    } finally {
      setLoading(false);
    }
  };

  const fetchStoresData = async (market) => {
    if (selectedMarket === market) {
      setSelectedMarket("");
      setStoresData([]);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/get-stores-by-market?market=${market}`,
        { withCredentials: true }
      );
      const data = response.data;

      if (response.status === 200) {
        setStoresData(data);
        setSelectedMarket(market);
      } else {
        handleError(data.message || "Failed to fetch store data");
      }
    } catch (err) {
      handleError("Error fetching store data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketData();
  }, []);

  const handleStoreClick = (storeName) => {
    navigate(`/home`);
  };

  const normalizeDate = (date) => {
    return new Date(date).toISOString().split("T")[0]; // Get only the date part (YYYY-MM-DD)
  };

  const handleDateFilter = ({ startDate, endDate }) => {
    const normalizedStartDate = normalizeDate(startDate);
    const normalizedEndDate = normalizeDate(endDate);

    const filtered = marketsData.filter((market) => {
      const marketDate = normalizeDate(market.createdAt);
      return marketDate >= normalizedStartDate && marketDate <= normalizedEndDate;
    });

    setFilteredMarkets(filtered);
  };

  const handleMarketFilter = (selectedMarket) => {
    if (!selectedMarket) {
      setFilteredMarkets(marketsData);
    } else {
      const filtered = marketsData.filter((market) =>
        market.market.toLowerCase().includes(selectedMarket.toLowerCase())
      );
      setFilteredMarkets(filtered);
    }
  };

  return (
    <div
      className="py-1 bg-light"
      style={{
        background:
          "linear-gradient(135deg,rgb(229, 237, 248) 0%,rgba(213, 245, 246, 0.32) 50%,rgba(248, 223, 241, 0.83) 100%)",
      }}
    >
      <div className="container-fluid">
        <MarketImageStatsHeader
          error={error}
          onDateFilter={handleDateFilter}
          onMarketFilter={handleMarketFilter}
        />

        {loading ? (
          <LoadingSpinner className="loading-indicator" />
        ) : (
          <div className="row g-2 justify-content-center">
            {filteredMarkets.map((market, index) => (
              <div
                key={index}
                className={`col-md-${selectedMarket === market.market ? 12 : 6} animate__animated animate__fadeInUp`}
              >
                <MarketCard
                  market={market.market}
                  isSelected={selectedMarket === market.market}
                  onClick={() => fetchStoresData(market.market)}
                  uploadedCount={market.uploaded}
                  notUploadedCount={market.notUploaded}
                  role="button"
                  tabIndex={0}
                />

                {selectedMarket === market.market && (
                  <StoresList
                    marketName={market.market}
                    stores={storesData}
                    onStoreClick={handleStoreClick}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketImageStats;