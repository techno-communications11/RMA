import React, { useEffect, useState } from "react";
import { Container, Card, Row, Col, Alert } from "react-bootstrap";
import {
  FaChevronRight,
  FaChevronDown,
  FaStore,
  FaImages,
  FaExclamationCircle,
  FaCheckCircle,
  FaTimesCircle,
  FaHeart,
  FaStar,
  FaRegBuilding,
  FaCamera,
} from "react-icons/fa";
import MarketsFilter from "./MarketsFilter";
import DateFilter from "./DateFilter";
import "./imagestatus.css";
import { useMyContext } from "../MyContext";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import Animation from "./timeloading.json";

const MarketImageStats = () => {
  const [marketsData, setMarketsData] = useState([]);
  const [storesData, setStoresData] = useState([]);
  const [selectedMarket, setSelectedMarket] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [filteredMarkets, setFilteredMarkets] = useState([]);
  const { setStore } = useMyContext();
  const navigate = useNavigate();

  // Fetch market image counts
  const fetchMarketData = async () => {
      setLoading(true);
   
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/get-market-image-counts`
      );
      const data = await response.json();

      if (response.ok) {
        setMarketsData(data);
        setFilteredMarkets(data);
      } else {
        setError(data.message || "Failed to fetch market data");
      }
    } catch (err) {
      setError("Error fetching market data");
    }
    setLoading(false);
  };

  // Fetch stores for a specific market
  const fetchStoresData = async (market) => {
    if (selectedMarket === market) {
      setSelectedMarket("");
      setStoresData([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/get-stores-by-market?market=${market}`
      );
      const data = await response.json();

      if (response.ok) {
        setStoresData(data);
        setSelectedMarket(market);
      } else {
        setError(data.message || "Failed to fetch store data");
      }
    } catch (err) {
      setError("Error fetching store data");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMarketData();
  }, []);

  const calculateProgress = (uploaded, notUploaded) => {
    const total = uploaded + notUploaded;
    return total > 0 ? (uploaded / total) * 100 : 0;
  };

  const handleStoreClick = (storeName) => {
    navigate("/home");
    setStore(storeName);
  };

  // Enhanced filter functions
  const normalizeDate = (date) => {
    // Normalize date to UTC (this will help with timezone differences)
    return new Date(date).toISOString().split('T')[0]; // Get only the date part (YYYY-MM-DD)
  };
  
  // Function to filter data based on the date range
  const handleDateFilter = ({ startDate, endDate }) => {
    const normalizedStartDate = normalizeDate(startDate);
    const normalizedEndDate = normalizeDate(endDate);
  
    const filtered = marketsData.filter((market) => {
      const marketDate = normalizeDate(market.createdat);
  
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
    <Container
      fluid
      className="py-1 bg-light"
      style={{
        background:
          "linear-gradient(135deg,rgb(229, 237, 248) 0%,rgba(213, 245, 246, 0.32) 50%,rgba(248, 223, 241, 0.83) 100%)",
      }}
    >
      <div className="container-fluid">
        {/* Header Section */}
        <div className="d-flex align-items-center mb-2 flex-column flex-md-row">
          {/* Date Filter Section */}
          <div className="col-12 col-md-auto d-flex justify-content-center mb-3 mb-md-0 ">
            <DateFilter onFilter={handleDateFilter} />
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
            <MarketsFilter onFilter={handleMarketFilter} />
          </div>
        </div>

        {error && (
          <Alert variant="danger" className="animate__animated animate__shakeX">
            <FaExclamationCircle className="shake-icon me-2" /> {error}
          </Alert>
        )}

        {loading ? (
          <div className="d-flex justify-content-center align-items-center">
            <Lottie
              animationData={Animation}
              style={{
                maxWidth: "30%",
                display: "flex",
              }}
            />
          </div>
        ) : (
          <Row className="g-2 justify-content-center">
            {filteredMarkets.map((market, index) => (
              <Col
                key={index}
                md={selectedMarket === market.market ? 12 : 6}
                className="animate__animated animate__fadeInUp"
              >
                <Card
                  className={`market-card hover-lift border-0 ${
                    selectedMarket === market.marketName ? "selected bg-pink-50" : ""
                  }`}
                  onClick={() => fetchStoresData(market.market)}
                >
                  <Card.Body className="p-4">
                    <Row className="align-items-center">
                      <Col>
                        <div className="transition-icon">
                          {selectedMarket === market.market ? (
                            <FaChevronDown className="text-pink-500" />
                          ) : (
                            <FaChevronRight className="text-pink-400" />
                          )}
                        </div>
                      </Col>
                      <Col>
                        <div className="d-flex align-items-center">
                          <FaRegBuilding className="text-pink-500 me-2 bounce-icon" />
                          <h5 className="mb-0 fw-bold text-pink-600">
                            {market.market}
                          </h5>
                        </div>
                      </Col>
                      <Col xs={12} md="auto">
                        <div className="stats-grid mt-3 mt-md-0">
                          <div className="stat-item text-success">
                            <FaCheckCircle className="me-2 pulse-icon" />
                            <span className="fw-semibold">
                              {market.uploaded}
                            </span>
                          </div>
                          <div className="stat-item text-danger">
                            <FaTimesCircle className="me-2 shake-icon" />
                            <span className="fw-semibold">
                              {market.notUploaded}
                            </span>
                          </div>
                        </div>
                      </Col>
                      <Col xs={12} className="mt-3">
                        <div className="progress" style={{ height: "8px" }}>
                          <div
                            className="progress-bar bg-pink-400"
                            style={{
                              width: `${calculateProgress(
                                market.uploaded,
                                market.notUploaded
                              )}%`,
                              transition: "width 1s ease-in-out",
                            }}
                          />
                        </div>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>

                {/* Stores Data: Show only if the market is selected */}
                {selectedMarket === market.market && (
                  <div className="stores-wrapper slide-down mt-3 bg-pink-50 p-2">
                    <div className="stores-container ps-4">
                       <h5 className="mb-4 pb-2 border-bottom border-pink-200 d-flex align-items-center text-capitalize">
                                                <FaStore className="text-pink-500 me-2 " />
                                                Stores in {market.market?.toLowerCase()}
                                              </h5>
                      <Row xs={1} sm={2} md={2} lg={2} className="g-1 text-start">
                        {storesData.map((store, idx) => (
                          <Col key={idx} >
                            <Card
                              className="store-card hover-scale mb-1 border-0 shadow-sm"
                              onClick={() => handleStoreClick(store.storeName)}
                            >
                              <Card.Body className="p-4">
                                <Row className="align-items-center">
                                  <Col>
                                    <div className="d-flex align-items-center">
                                      <FaStore className="text-pink-400 me-2 store-icon" />
                                      <h6 className="mb-0 text-pink-600">
                                        {store.storeName}
                                      </h6>
                                    </div>
                                  </Col>
                                  <Col xs="auto">
                                    <div className="d-flex gap-3">
                                      <span className="text-success">
                                        <FaCamera className="me-1" />
                                        {store.uploaded}
                                      </span>
                                      <span className="text-danger">
                                        <FaTimesCircle className="me-1" />
                                        {store.notUploaded}
                                      </span>
                                    </div>
                                  </Col>
                                </Row>
                              </Card.Body>
                            </Card>
                          </Col>
                        ))}
                      </Row>
                    </div>
                  </div>
                )}
              </Col>
            ))}
          </Row>
        )}
      </div>
    </Container>
  );
};

export default MarketImageStats;
