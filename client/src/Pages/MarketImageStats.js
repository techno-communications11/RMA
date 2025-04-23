import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MarketImageStatsHeader } from "./MarketImageStatsHeader";
import { MarketCard } from "../Components/Cards/MarketCard";
import StoresList from "../Components/Misc/StoresList";
import LoadingSpinner from "../Components/Messages/LoadingSpinner";
import fetchMarketData from "../Components/Apis/GetMarketsImageCountsData";
import GetStoresBymarket from "../Components/Apis/GetStoresBymarket";


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

  const fetchStoresData = async (market) => {
    if (selectedMarket === market) {
      setSelectedMarket("");
      setStoresData([]);
      return;
    }

    try {
      const data = await GetStoresBymarket(market, setLoading); // GetStoresBymarket returns response.data
      if (Array.isArray(data) && data.length > 0) {
        // Normalize stores data to ensure consistent structure
        const normalizedStores = Array.isArray(data)
        ? Object.values(
            data.reduce((acc, store) => {
              const storeName = store.value || store.store_name || "Unknown";
              const totalRma = (store.notUploaded || 0) + (store.uploaded || 0);
              const label = store.label || store.store_name || "Unknown";
      
              if (!acc[storeName]) {
                acc[storeName] = {
                  store_name: storeName,
                  totalRma: 0,
                  label,
                };
              }
      
              acc[storeName].totalRma += totalRma;
              return acc;
            }, {})
          )
        : [];
        setStoresData(normalizedStores);
        setSelectedMarket(market);
      } else {
        handleError("No stores found for this market");
        setStoresData([]);
      }
    } catch (err) {
      handleError(err.message || "Failed to fetch store data");
      setStoresData([]);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchMarketData(setLoading);
        if (Array.isArray(data) && data.length > 0) {
          // Normalize markets data
           console.log("Market data:", data); // Log for debugging
          const normalizedMarkets = data.map((market) => ({
            market: market.value || market.Market || "Unknown Market",
            label: market.label || market.Market || "Unknown Market",
            uploaded: market.uploaded || 0,
            notUploaded: market.notUploaded || 0,
            createdAt: market.createdAt || new Date(),
          }));
          setMarketsData(normalizedMarkets);
          setFilteredMarkets(normalizedMarkets);
        } else {
          handleError("No markets found");
        }
      } catch (err) {
        handleError(err.message || "Failed to fetch market data");
      }
    };

    fetchData();
  }, []);

  const handleStoreClick = (paramed_store_name) => {
    navigate(`/rmapage/${paramed_store_name}`);
  };

  const normalizeDate = (date) => {
    return new Date(date).toISOString().split("T")[0]; // YYYY-MM-DD
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


   console.log("Filtered markets:", marketsData); // Log for debugging

  const handleMarketFilter = (selectedMarket) => {
    if (!selectedMarket) {
      setFilteredMarkets(marketsData);
    } else {
      const filtered = marketsData.filter((market) =>
        (market.market || market.label || "").toLowerCase().includes(selectedMarket.toLowerCase())
      );
      setFilteredMarkets(filtered);
    }
  };
  return (
    <div
      className="py-1 bg-light"
      style={{
        background:
          "linear-gradient(135deg, rgb(229, 237, 248) 0%, rgba(213, 245, 246, 0.32) 50%, rgba(248, 223, 241, 0.83) 100%)",
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
                  market={market.label || market.market} // Use label for display
                  isSelected={selectedMarket === market.market}
                  onClick={() => fetchStoresData(market.market)}
                  uploadedCount={market.uploaded}
                  notUploadedCount={market.notUploaded}
                  role="button"
                  tabIndex={0}
                />
                {selectedMarket === market.market && (
                  <StoresList
                    marketName={market.label || market.market}
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