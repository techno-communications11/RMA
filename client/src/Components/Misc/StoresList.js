import React from "react";
import { Row, Col, Card } from "react-bootstrap";
import { FaStore } from "react-icons/fa";
import { BsArrowRepeat } from "react-icons/bs";

const StoresList = ({ marketName, stores, onStoreClick }) => {
  if (!stores || stores.length === 0) {
    return <p>No stores found for {marketName}.</p>;
  }

  return (
    <Card className="stores-card mt-3 border-0 shadow-sm">
      <Card.Body className="bg-pink-50 rounded p-4">
        <h5 className="mb-4 pb-2 border-bottom border-pink-200 d-flex align-items-center text-capitalize">
          <FaStore className="text-pink-600 me-2" />
          Stores in {marketName.toLowerCase()}
        </h5>
        <Row className="g-4" style={{ cursor: "pointer" }}>
          {stores.map((store, index) => (
            <Col
              key={index}
              md={6}
              className="clickable-column"
              onClick={() => onStoreClick(store.store_name)} // Use store_name for navigation
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
                      <small className="text-muted d-block">Total RMA</small>
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
      </Card.Body>
    </Card>
  );
};

export default StoresList;