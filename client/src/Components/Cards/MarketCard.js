import React from "react";
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
    <tr
      className={`market-row ${isSelected ? "selected bg-pink-50" : ""}`}
      onClick={onClick}
      style={{ cursor: "pointer" }}
    >
      <td className="align-middle">
        <div className="transition-icon">
          {isSelected ? (
            <FaChevronDown className="text-pink-600" />
          ) : (
            <FaChevronRight className="text-pink-600" />
          )}
        </div>
      </td>
      <td className="align-middle">
        <div className="d-flex align-items-center">
          <FaRegBuilding className="text-pink-600 me-2 bounce-icon" />
          <p className="mb-0  text-pink-600">{market}</p>
        </div>
      </td>
      <td className="align-middle text-success">
        <div className="stat-item">
          <FaCheckCircle className="me-2 pulse-icon" />
          <span>{uploadedCount}</span>
        </div>
      </td>
      <td className="align-middle text-danger">
        <div className="stat-item">
          <FaTimesCircle className="me-2 shake-icon" />
          <span >{notUploadedCount}</span>
        </div>
      </td>
      <td className="align-middle">
        <div className="progress" style={{ height: "8px", width: "100%" }}>
          <div
            className="progress-bar bg-pink-400"
            style={{
              width: `${calculateProgress(uploadedCount, notUploadedCount)}%`,
              transition: "width 1s ease-in-out",
            }}
          />
        </div>
      </td>
    </tr>
  );
};