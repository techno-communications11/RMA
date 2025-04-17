import React from "react";
import { Row, Col } from "react-bootstrap";
import { FaStore } from "react-icons/fa";
import { StoreCard } from "../Cards/StoreCard";

export const StoresList = ({ 
  marketName, 
  stores, 
  onStoreClick 
}) => {
  return (
    <div className="stores-wrapper slide-down mt-3 bg-pink-50 p-2">
      <div className="stores-container ps-4">
        <h5 className="mb-4 pb-2 border-bottom border-pink-200 d-flex align-items-center text-capitalize">
          <FaStore className="text-pink-500 me-2 " />
          Stores in {marketName?.toLowerCase()}
        </h5>
        <Row xs={1} sm={2} md={2} lg={2} className="g-1 text-start" style={{cursor:'pointer'}}>
          {stores.map((store, idx) => (
            <Col key={idx}>
              <StoreCard
                storeName={store.storeName}
                uploadedCount={store.uploaded}
                notUploadedCount={store.notUploaded}
                onClick={() => onStoreClick(store.storeName)}
              />
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};