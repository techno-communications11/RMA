import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Table } from "react-bootstrap";
import { MarketImageStatsHeader } from "./MarketImageStatsHeader";
import { MarketCard } from "../Components/Cards/MarketCard";
import StoresList from "../Components/Misc/StoresList";
import LoadingSpinner from "../Components/Messages/LoadingSpinner";
import fetchMarketData from "../Components/Apis/GetMarketsImageCountsData";
import GetStoresBymarket from "../Components/Apis/GetStoresBymarket";
import PropTypes from "prop-types";

const MarketImageStats = ({ TableName }) => {
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
      const data = await GetStoresBymarket(market, setLoading, TableName);
      if (Array.isArray(data) && data.length > 0) {
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
      }
    } catch (err) {
      handleError(err.message || "Failed to fetch store data");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!TableName) {
        handleError("TableName is not provided");
        return;
      }
      try {
        setLoading(true);
        const data = await fetchMarketData(setLoading, TableName);
        if (Array.isArray(data) && data.length > 0) {
          const normalizedMarkets = data.map((market) => {
            const normalized = {
              market: market.value || market.Market || "Unknown Market",
              label: market.label || market.Market || "Unknown Market",
              uploaded: market.uploaded || 0,
              notUploaded: market.notUploaded || 0,
              createdAt: market.createdAt || new Date(),
            };
            console.log("Normalized market:", normalized);
            return normalized;
          });
          setMarketsData(normalizedMarkets);
          setFilteredMarkets(normalizedMarkets);
        } else {
          handleError("No markets found");
        }
      } catch (err) {
        handleError(err.message || "Failed to fetch market data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [TableName]);

  const handleStoreClick = (paramed_store_name) => {
    if (TableName === "trade_in") {
      navigate(`/tradeinpage/${paramed_store_name}`);
    }
    if (TableName === "rma_data") {
      navigate(`/rmapage/${paramed_store_name}`);
    }
    if (TableName === "xbm_data") {
      navigate(`/xbmpage/${paramed_store_name}`);
    }
  };

  const normalizeDate = (date) => {
    return new Date(date).toISOString().split("T")[0];
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
          TableName={TableName}
        />
        {loading ? (
          <LoadingSpinner className="loading-indicator" />
        ) : (
          <Table striped bordered hover responsive className="market-table mt-4">
            <thead>
              <tr>
                <th>Expand</th>
                <th>Market Name</th>
                <th>Uploaded</th>
                <th>Not Uploaded</th>
                <th>Progress</th>
              </tr>
            </thead>
            <tbody>
              {filteredMarkets.map((market, index) => (
                <React.Fragment key={index}>
                  <MarketCard
                    market={market.label || market.market}
                    isSelected={selectedMarket === market.market}
                    onClick={() => fetchStoresData(market.market)}
                    uploadedCount={market.uploaded}
                    notUploadedCount={market.notUploaded}
                  />
                  {selectedMarket === market.market && (
                    <tr>
                      <td colSpan="5">
                        <StoresList
                          marketName={market.label || market.market}
                          stores={storesData}
                          onStoreClick={handleStoreClick}
                          TableName={TableName}
                        />
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </Table>
        )}
        {error && <div className="text-danger">{error}</div>}
      </div>
    </div>
  );
};

MarketImageStats.propTypes = {
  TableName: PropTypes.string.isRequired,
};

export default MarketImageStats;