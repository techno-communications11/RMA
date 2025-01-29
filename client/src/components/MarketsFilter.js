import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import axios from "axios";
import { FaFilter } from "react-icons/fa6";
import { FaRegBuilding } from "react-icons/fa";

const MarketsFilter = ({ onFilter }) => {
  const [markets, setMarkets] = useState([]);
  const [selectedMarket, setSelectedMarket] = useState("");

  useEffect(() => {
    // Fetch the list of markets from the server
    const fetchMarkets = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/get-markets-data`
        );
        setMarkets(response.data);
        // console.log("Markets:", response.data);
      } catch (error) {
        console.error("Error fetching markets:", error);
      }
    };

    fetchMarkets();
  }, []);

  const handleFilter = () => {
    // console.log("Selected market:", selectedMarket);
    if (onFilter) {
      onFilter(selectedMarket);
    }
  };

  return (
    <div className="markets-filter-container   rounded ">
      <Form>
        <Row className="align-items-end">
          <Col md={8}>
            <Form.Group controlId="marketSelect ">
              <Form.Label className="fw-bold text-pink-600">
                <FaRegBuilding className="text-pink-500 me-2 bounce-icon" />
                Select Market
              </Form.Label>
              <Form.Control
                as="select"
                value={selectedMarket || ""} // Default to empty string if selectedMarket is null or undefined
                onChange={(e) => setSelectedMarket(e.target.value)}
                className="form-select text-success fw-bold text-capitalize shadow-lg"
                style={{
                  height: "48px",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", // Custom shadow for better visibility
                  border: "2px solid #db2777", // Optional border for better aesthetics
                }}
              >
                <option value="" className="text-danger fw-bold">
                  Select a market
                </option>
                {markets?.map((market, index) => (
                  <option
                    key={index}
                    value={market.marketName}
                    className="text-warning fw-bold shadow-none text-capitalize"
                  >
                    {market.marketName?.toLowerCase()}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Col>
          <Col md={4} sm={12}>
            <Button
              onClick={handleFilter}
              className="w-100 mt-1 btn-pink d-flex justify-content-center align-items-center"
              style={{
                backgroundColor: "#ec4899",
                border: "none",
                height: "45px",
                borderRadius: "8px",
              }}
            >
              <FaFilter className="me-2  fs-1" />
              Filter
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default MarketsFilter;
