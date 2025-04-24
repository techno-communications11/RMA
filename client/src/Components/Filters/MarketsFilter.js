import React, { useState } from "react";
import { Row, Col } from "react-bootstrap";
import { FaRegBuilding } from "react-icons/fa";
import Button from "../Events/Button";
import SelectInput from "../Events/SelectInput";
import PropTypes from "prop-types";

const MarketsFilter = ({ onFilter, marketsData }) => {
  const [selectedMarket, setSelectedMarket] = useState("");

  const handleFilter = () => {
    if (onFilter) {
      onFilter(selectedMarket);
    }
  };

  // Transform markets data for SelectInput
  const marketOptions = marketsData?.map((market) => ({
    value: market.market ||market.marketName, // Use normalized 'market' field
    label: market.label || market.market ||market.marketName, // Fallback to market if label is missing
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
            defaultOption="No options available" // Match UI text
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

MarketsFilter.propTypes = {
  onFilter: PropTypes.func.isRequired,
  marketsData: PropTypes.arrayOf(
    PropTypes.shape({
      market: PropTypes.string,
      label: PropTypes.string,
      uploaded: PropTypes.number,
      notUploaded: PropTypes.number,
    })
  ).isRequired,
};

export default MarketsFilter;