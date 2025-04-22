import React, { useEffect, useState } from "react";
import { Row, Col, Card, Alert } from "react-bootstrap";
import {
  FaStore,
  FaExclamationTriangle,
  FaChevronDown,
  FaChevronUp,
  FaMapMarkerAlt,
  FaChartLine,
  FaHeart,
  FaStar,
  FaRegBuilding,
  FaRegClock,
} from "react-icons/fa";
import { BsFillPatchCheckFill, BsArrowRepeat } from "react-icons/bs";
import "../Styles/Markets.css";
import DateFilter from "../Components/Filters/DateFilter";
import MarketsFilter from "../Components/Filters/MarketsFilter";
import LoadingSpinner from "../Components/Messages/LoadingSpinner";
import GetMarkets from "../Components/Apis/GetMarkets";
import GetStoresBymarket from "../Components/Apis/GetStoresBymarket"; // Import your API
import { useNavigate } from "react-router-dom";

const Markets = () => {
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
      const data = await GetMarkets(setLoading); // Expecting array of markets
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
      const data = await GetStoresBymarket(marketName, setStoreLoading);

       console.log("Stores data response:", data); // Log for debugging
      // Normalize data to ensure consistent structure
      const normalizedStores = Array.isArray(data)
        ? data.map((store) => ({
            store_name: store.value || store.store_name || "Unknown",
            totalRma: store.totalRma || 0,
            label: store.label || store.store_name || "Unknown",
          }))
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
    console.log("Navigating to store:", paramed_store_name);
    navigate(`/rmapage/${paramed_store_name}`);
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
          <h3 className="fw-bold text-pink-600 mb-1 d-flex align-items-center justify-content-center">
            <FaMapMarkerAlt className="bounce-icon" />
            Market Overview
            <FaStar className="text-warning shimmer" />
          </h3>
          <p className="lead text-muted">
            <FaHeart className="text-pink-600 me-1 pulse-icon" />
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
      <Row className="g-2 justify-content-center">
        {filteredData.map((market, index) => (
          <Col
            key={index}
            md={selectedMarket ? 12 : 6}
            className="animate__animated animate__fadeInUp"
          >
            <Card
              onClick={() => getStoresForMarket(market.marketName)}
              className={`market-card hover-lift border-0 ${
                selectedMarket === market.marketName ? "selected bg-pink-50" : ""
              }`}
            >
              <Card.Body className="p-4">
                <Row className="align-items-center">
                  <Col xs={12} sm={6} md={7}>
                    <Card.Title className="d-flex align-items-center mb-2">
                      <FaRegBuilding className="text-pink-600 me-2 bounce-icon" />
                      <span className="h4 mb-0 fw-bold text-pink-600 text-capitalize">
                        {market.marketName?.toLowerCase() || "Unknown Market"}
                      </span>
                      <BsFillPatchCheckFill className="ms-2 text-pink-600" />
                    </Card.Title>
                    <div className="text-success small fw-medium">
                      <FaRegClock className="me-1" /> Updated recently
                    </div>
                  </Col>
                  <Col
                    xs={12}
                    sm={6}
                    md={5}
                    className="text-md-end mt-3 mt-sm-0"
                  >
                    <div className="d-flex align-items-center justify-content-md-end">
                      <FaChartLine className="text-success me-2 pulse-icon" />
                      <span className="h5 mb-0 text-pink-600">
                        RMA: {market.totalRma || 0}
                      </span>
                      <span className="ms-3 transition-icon">
                        {selectedMarket === market.marketName ? (
                          <FaChevronUp className="text-pink-600" />
                        ) : (
                          <FaChevronDown className="text-pink-600" />
                        )}
                      </span>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
            {selectedMarket === market.marketName && (
              <Card className="container-fluid stores-card mt-3 border-0 shadow-sm slide-down">
                <Card.Body className="bg-pink-50 rounded p-4">
                  {storeLoading ? (
                    <LoadingSpinner />
                  ) : selectedMarketStores.length > 0 ? (
                    <div className="w-100">
                      <h5 className="mb-4 pb-2 border-bottom border-pink-200 d-flex align-items-center text-capitalize">
                        <FaStore className="text-pink-600 me-2" />
                        Stores in {market.marketName?.toLowerCase()}
                      </h5>
                      <Row className="g-4" style={{ cursor: "pointer" }}>
                        {selectedMarketStores.map((store, storeIndex) => (
                          <Col
                            key={storeIndex}
                            md={6}
                            className="clickable-column"
                            onClick={() => handleClickNetPage(store.store_name)}
                          >
                            <Card className="store-item h-100 border-0 bg-white hover-scale">
                              <Card.Body className="p-3">
                                <div className="d-flex justify-content-between align-items-center">
                                  <div>
                                    <FaStore className="text-pink-600 mb-2 store-icon" />
                                    <h6 className="mb-1 text-pink-600 text-capitalize">
                                      {store.label?.toLowerCase() || store.store_name?.toLowerCase() || "Unknown Store"}
                                    </h6>
                                  </div>
                                  <div className="text-end">
                                    <small className="text-muted d-block">
                                      Total RMA
                                    </small>
                                    <span className="h6 mb-0 text-success d-flex align-items-center">
                                      <BsArrowRepeat className="me-1" />
                                      {store.totalRma || 0}
                                    </span>
                                  </div>
                                </div>
                              </Card.Body>
                            </Card>
                          </Col>
                        ))}
                      </Row>
                    </div>
                  ) : (
                    <p>No stores found for this market.</p>
                  )}
                </Card.Body>
              </Card>
            )}
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Markets;