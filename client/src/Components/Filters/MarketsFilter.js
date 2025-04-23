import React, { useState } from "react";
import { Row, Col } from "react-bootstrap";
import { FaRegBuilding } from "react-icons/fa";
import Button from "../Events/Button";
import SelectInput from "../Events/SelectInput";

const MarketsFilter = ({ onFilter, marketsData }) => {
  const [selectedMarket, setSelectedMarket] = useState("");

  const handleFilter = () => {
    if (onFilter) {
      onFilter(selectedMarket);
    }
  };

   console.log("Selected Market:", marketsData); // Debugging line

  // Transform markets data for SelectInput
  const marketOptions = marketsData?.map(market => ({
    value: market.Market || market.marketName,
    label: market.Market || market.marketName,
  })) || [];

  return (
    <div className="markets-filter-container rounded">
      <Row className="align-items-end">
        <Col md={8}>
          <SelectInput
            label="Select Market"
            icon={<FaRegBuilding className="bounce-icon" />}
            options={marketOptions}
            value={selectedMarket}
            onChange={(e) => setSelectedMarket(e.target.value)}
            defaultOption="Select a market"
          />
        </Col>
        <Col md={4} sm={12}>
          <Button
            onClick={handleFilter}
            variant="btn-primary"
            label="Filter"
            disabled={!selectedMarket}
          />
        </Col>
      </Row>
    </div>
  );
};

export default MarketsFilter;