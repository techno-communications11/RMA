import React from "react";
import { Card, Row, Col } from "react-bootstrap";
import { FaStore, FaCamera, FaTimesCircle } from "react-icons/fa";

export const StoreCard = ({ 
  store_name, 
  uploadedCount, 
  notUploadedCount, 
  onClick 
}) => {
  return (
    <Card
      className="store-card hover-scale mb-1 border-0 shadow-sm"
      onClick={onClick}
    >
      <Card.Body className="p-4">
        <Row className="align-items-center">
          <Col>
            <div className="d-flex align-items-center">
              <FaStore className="text-pink-400 me-2 store-icon" />
              <h6 className="mb-0 text-pink-600">
                {store_name}
              </h6>
            </div>
          </Col>
          <Col xs="auto">
            <div className="d-flex gap-3">
              <span className="text-success">
                <FaCamera className="me-1" />
                {uploadedCount}
              </span>
              <span className="text-danger">
                <FaTimesCircle className="me-1" />
                {notUploadedCount}
              </span>
            </div>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};