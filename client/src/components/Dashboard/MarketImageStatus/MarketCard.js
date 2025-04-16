import React from "react";
import { Card, Row, Col } from "react-bootstrap";
import { FaChevronRight, FaChevronDown, FaRegBuilding, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

export const MarketCard = ({ 
  market, 
  isSelected, 
  onClick, 
  uploadedCount, 
  notUploadedCount 
}) => {
  const calculateProgress = (uploaded, notUploaded) => {
    const total = uploaded + notUploaded;
    return total > 0 ? (uploaded / total) * 100 : 0;
  };

  return (
    <Card
      className={`market-card hover-lift border-0 ${
        isSelected ? "selected bg-pink-50" : ""
      }`}
      onClick={onClick}
    >
      <Card.Body className="p-4">
        <Row className="align-items-center">
          <Col>
            <div className="transition-icon">
              {isSelected ? (
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
                {market}
              </h5>
            </div>
          </Col>
          <Col xs={12} md="auto">
            <div className="stats-grid mt-3 mt-md-0">
              <div className="stat-item text-success">
                <FaCheckCircle className="me-2 pulse-icon" />
                <span className="fw-semibold">
                  {uploadedCount}
                </span>
              </div>
              <div className="stat-item text-danger">
                <FaTimesCircle className="me-2 shake-icon" />
                <span className="fw-semibold">
                  {notUploadedCount}
                </span>
              </div>
            </div>
          </Col>
          <Col xs={12} className="mt-3">
            <div className="progress" style={{ height: "8px" }}>
              <div
                className="progress-bar bg-pink-400"
                style={{
                  width: `${calculateProgress(uploadedCount, notUploadedCount)}%`,
                  transition: "width 1s ease-in-out",
                }}
              />
            </div>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};