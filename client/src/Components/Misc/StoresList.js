import React from "react";
import { Table } from "react-bootstrap";
import { FaStore } from "react-icons/fa";
import { BsArrowRepeat } from "react-icons/bs";

const StoresList = ({ marketName, stores, onStoreClick, TableName }) => {
  if (!stores || stores.length === 0) {
    return <p>No stores found for {marketName}.</p>;
  }

  return (
    <Table striped bordered hover responsive className="stores-table mt-3">
      <thead>
        <tr>
          <th colSpan="3" className="bg-pink-50 p-2">
            <h5 className="mb-0 d-flex align-items-center text-capitalize">
              <FaStore className="text-pink-600 me-2" />
              Stores in {marketName.toLowerCase()}
            </h5>
          </th>
        </tr>
      </thead>
      <tbody>
        {stores.map((store, index) => (
          <tr
            key={index}
            className="clickable-row"
            onClick={() => onStoreClick(store.store_name)}
            style={{ cursor: "pointer" }}
          >
            <td className="align-middle">
              <div className="d-flex align-items-center">
                <FaStore className="text-pink-600 me-2 store-icon" />
                <h6 className="mb-0 text-pink-600 text-capitalize">
                  {store.label?.toLowerCase() || store.store_name?.toLowerCase() || "Unknown Store"}
                </h6>
              </div>
            </td>
            <td className="align-middle text-end">
              <div className="d-flex align-items-center justify-content-end">
                <small className="text-muted d-block">{`Total ${TableName.split("_").join(" ")}`}</small>
                <span className="h6 mb-0 text-success d-flex align-items-center">
                  <BsArrowRepeat className="me-1" />
                  {store.totalRma || 0}
                </span>
              </div>
            </td>
            <td className="align-middle text-center">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onStoreClick(store.store_name);
                }}
                className="btn btn-primary"
              >
                View Details
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default StoresList;