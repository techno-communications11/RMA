import React, { useEffect, useState } from "react";
import {  Alert, Table } from "react-bootstrap";
import {
 
  FaExclamationTriangle,
  FaChevronDown,
  FaChevronUp,
  FaMapMarkerAlt,
  FaHeart,
  FaStar,
  
} from "react-icons/fa";
import "../Styles/Markets.css";
import DateFilter from "../Components/Filters/DateFilter";
import MarketsFilter from "../Components/Filters/MarketsFilter";
import LoadingSpinner from "../Components/Messages/LoadingSpinner";
import GetMarkets from "../Components/Apis/GetMarkets";
import GetStoresBymarket from "../Components/Apis/GetStoresBymarket";
import { useNavigate } from "react-router-dom";

import Button from "../Components/Events/Button";

const Markets = ({ TableName }) => {
  const [marketsData, setMarketsData] = useState([]);
  const [selectedMarket, setSelectedMarket] = useState("");
  const [selectedMarketStores, setSelectedMarketStores] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [storeLoading, setStoreLoading] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const navigate = useNavigate();

  const getMarketsData = async () => {
    try {
      const data = await GetMarkets(setLoading, TableName); // Expecting array of markets
      if (Array.isArray(data) && data.length > 0) {
        setMarketsData(data);
        setFilteredData(data); // Initialize filtered data
      } else {
        setError("No markets found");
      }
    } catch (err) {
      setError(err.message || "Failed to fetch markets");
    }
  };

  const getStoresForMarket = async (marketName) => {
    if (marketName === selectedMarket) {
      setSelectedMarket("");
      setSelectedMarketStores([]);
      return;
    }

    setStoreLoading(true);
    setSelectedMarket(marketName);
    try {
      const data = await GetStoresBymarket(marketName, setStoreLoading, TableName);


      // Normalize data to ensure consistent structure
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
      setSelectedMarketStores(normalizedStores);
    } catch (err) {
      setError(err.message || "Failed to fetch stores");
      setSelectedMarketStores([]);
    }
  };

  useEffect(() => {
    getMarketsData();
  }, []);

  const normalizeDate = (date) => {
    return new Date(date).toISOString().split("T")[0]; // YYYY-MM-DD
  };

  const handleFilter = ({ startDate, endDate }) => {
    const normalizedStartDate = normalizeDate(startDate);
    const normalizedEndDate = normalizeDate(endDate);

    const filtered = marketsData.filter((market) => {
      const marketDate = normalizeDate(market.createdAt);
      return marketDate >= normalizedStartDate && marketDate <= normalizedEndDate;
    });

    setFilteredData(filtered);
  };

  const handleMarketFilter = (selectedMarket) => {
    setSelectedMarket(selectedMarket);
    if (selectedMarket) {
      const filtered = marketsData.filter(
        (market) => market.marketName === selectedMarket
      );
      setFilteredData(filtered);
      getStoresForMarket(selectedMarket);
    } else {
      setFilteredData(marketsData);
      setSelectedMarketStores([]);
    }
  };

  const handleClickNetPage = (paramed_store_name) => {
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

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div
      className="py-1 container-fluid"
      style={{
        background:
          "linear-gradient(135deg, rgb(229, 237, 248) 0%, rgba(213, 245, 246, 0.32) 50%, rgba(248, 223, 241, 0.83) 100%)",
      }}
    >
      <div className="row text-start mb-1">
        <div className="col-12 col-md-auto d-flex justify-content-center align-items-center mb-1 mb-md-0">
          <DateFilter onFilter={handleFilter} />
        </div>
        <div className="col-12 col-md text-center me-5">
          <h3 className="  mb-1 d-flex align-items-center justify-content-center text-pink-600">
            <FaMapMarkerAlt className="bounce-icon text-pink-600" />
            Market Overview
            <FaStar className="text-warning shimmer" />
          </h3>
          <p className="lead text-muted">
            <FaHeart className=" me-1 pulse-icon text-pink-600" />
            Explore our vibrant marketplace
          </p>
        </div>
        <div className="col-12 col-md-auto d-flex justify-content-center align-items-center mt-3 mt-md-0">
          <MarketsFilter onFilter={handleMarketFilter} marketsData={marketsData} />
        </div>
      </div>
      {error && (
        <Alert
          variant="danger"
          className="d-flex align-items-center animate__animated animate__shakeX"
        >
          <FaExclamationTriangle className="me-2 shake-icon" /> {error}
        </Alert>
      )}
      <Table striped bordered hover responsive className="market-table mt-4">
        <thead style={{backgroundColor:'#E10174'}}>
          <tr >
            <th className="text-center ">Market Name</th>
            <th className="text-center ">Total {TableName.split("_").join(" ")}</th>
            <th className="text-center  ">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((market, index) => (
            <React.Fragment key={index}>
              <tr
                onClick={() => getStoresForMarket(market.marketName)}
                className={`market-row ${
                  selectedMarket === market.marketName ? "selected " : ""
                }`}
              >
                <td className="align-middle">
                  <div className="d-flex align-items-center  justify-content-center">
                    <p className=" mb-0   text-capitalize">
                      {market.marketName?.toLowerCase() || "Unknown Market"}
                    </p>
                   
                  </div>
                </td>
                <td className="align-middle text-end">
                  <div className="d-flex align-items-center justify-content-center">
                    <p className=" mb-0  text-capitalize">
                      {market.totalRma || 0}
                    </p>
                    
                  </div>
                </td>
                <td className="align-middle text-center" style={{cursor:'pointer'}}>
                <span className="ms-3 transition-icon">
                      {selectedMarket === market.marketName ? (
                        <FaChevronUp className="" />
                      ) : (
                        <FaChevronDown className="" />
                      )}
                    </span>
                  
                </td>
              </tr>
              {selectedMarket === market.marketName && (
                <tr>
                  <td colSpan="3">
                    <div className="store-section bg-pink-50 rounded p-4">
                      {storeLoading ? (
                        <LoadingSpinner />
                      ) : selectedMarketStores.length > 0 ? (
                        <Table striped bordered hover responsive className="store-table">
                          <thead>
                            <tr >
                              <th className="text-center">Store Name</th>
                              <th className="text-center">Total {TableName.split("_").join(" ")}</th>
                              <th className="text-center">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedMarketStores.map((store, storeIndex) => (
                              <tr
                                key={storeIndex}
                                onClick={() => handleClickNetPage(store.store_name)}
                                className="clickable-row"
                              >
                                <td className="align-middle">
                                  <div className="d-flex align-items-center justify-content-center ">
                                    <h6 className="mb-0  text-capitalize ">
                                      {store.label?.toLowerCase() || store.store_name?.toLowerCase() || "Unknown Store"}
                                    </h6>
                                  </div>
                                </td>
                                <td className="align-middle text-end">
                                  <div className="d-flex align-items-center justify-content-center">
                                    <span className="h6 mb-0 text-success">
                                      {store.totalRma || 0}
                                    </span>
                                  </div>
                                </td>
                                <td className="align-middle text-center">
                                  <Button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleClickNetPage(store.store_name);
                                    }}
                                    variant="btn-primary"
                                    label="View Details"
                                  />
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      ) : (
                        <p className="text-center">No stores found for this market.</p>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Markets;