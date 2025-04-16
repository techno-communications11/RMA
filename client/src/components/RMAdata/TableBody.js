import React from "react";
import { FaEye } from "react-icons/fa6";
import { FaCloudUploadAlt } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { MdError } from "react-icons/md";
import { RxValueNone } from "react-icons/rx";
import { Table } from "react-bootstrap";
import { useUserContext } from "../Utilitycomponents/MyContext";

const SkeletonRow = () => (
  <tr>
    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((col) => (
      <td key={col} className="p-3">
        <div
          className="skeleton-loader"
          style={{
            height: "20px",
            backgroundColor: "#e0e0e0",
            borderRadius: "4px",
            animation: "pulse 1.5s infinite",
          }}
        ></div>
      </td>
    ))}
  </tr>
);

function TableBody({
  filteredData,
  handleNtidChange,
  handleFileUpload,
  ntid,
  setModalData,
  setSerial,
  loading,
}) {
   const {userData}=useUserContext();
  let role = userData.role;

  const skeletonStyles = `
      @keyframes pulse {
        0% { background-color: #e0e0e0; }
        50% { background-color: #f0f0f0; }
        100% { background-color: #e0e0e0; }
      }
    `;

  //  console.log(filteredData,"filtered")
  const handleImageClick = (imageurl) => {
    if (imageurl) {
      //  console.log(imageurl," image url")
      window.open(imageurl, "_blank");
    } else {
      console.error("Image URL is invalid");
    }
  };
  // If loading, render skeleton rows
  if (loading) {
    return (
      <div>
        <style>{skeletonStyles}</style>
        <Table className="table table-hover table-striped">
          <thead style={{ position: "sticky", top: "0", zIndex: 1000 }}>
            <tr className="text-center">
              {[
                "SINO",
                "Market",
                "storeid",
                "StoreName",
                "EmployeeID",
                "Invoice",
                "Serial",
                "ModelName",
                "Value",
                "RMADate",
                "RMANumber",
                "UPSTrackingNo",
                "Ntid",
                "Image",
                "Actions",
              ].map((header) => (
                <th
                  key={header}
                  style={{ backgroundColor: "#E10174", color: "white" }}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-center">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((row) => (
              <SkeletonRow key={row} />
            ))}
          </tbody>
        </Table>
      </div>
    );
  }

  return (
    <div>
      <Table key={role} className="table table-hover table-striped">
        <thead style={{ position: "sticky", top: "0", zIndex: 1000 }}>
          <tr className="text-center">
            <th style={{ backgroundColor: "#E10174", color: "white" }}>SINO</th>
            <th style={{ backgroundColor: "#E10174", color: "white" }}>
              Market
            </th>
            <th style={{ backgroundColor: "#E10174", color: "white" }}>
              storeid
            </th>
            <th style={{ backgroundColor: "#E10174", color: "white" }}>
              StoreName
            </th>
            <th style={{ backgroundColor: "#E10174", color: "white" }}>
              EmployeeID
            </th>
            <th style={{ backgroundColor: "#E10174", color: "white" }}>
              Invoice
            </th>
            <th style={{ backgroundColor: "#E10174", color: "white" }}>
              Serial
            </th>
            <th style={{ backgroundColor: "#E10174", color: "white" }}>
              ModelName
            </th>
            <th style={{ backgroundColor: "#E10174", color: "white" }}>
              Value
            </th>
            <th style={{ backgroundColor: "#E10174", color: "white" }}>
              RMADate
            </th>
            <th style={{ backgroundColor: "#E10174", color: "white" }}>
              RMANumber
            </th>
            <th style={{ backgroundColor: "#E10174", color: "white" }}>
              UPSTrackingNo
            </th>
            {role === "user" && (
              <th style={{ backgroundColor: "#E10174", color: "white" }}>
                Ntid
              </th>
            )}
            <th style={{ backgroundColor: "#E10174", color: "white" }}>
              Image
            </th>
            {(role === "manager" || role === "admin") && (
              <th style={{ backgroundColor: "#E10174", color: "white" }}>
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody className="text-center">
          {filteredData.map((row, index) => (
            <tr key={index} className="animate__animated animate__fadeIn">
              <td>{index + 1}</td>
              <td style={{ padding: "2px", fontSize: "0.8rem" }}>
                {row.market}
              </td>
              <td style={{ padding: "2px", fontSize: "0.8rem" }}>
                {row.storeid}
              </td>
              <td style={{ padding: "2px", fontSize: "0.8rem" }}>
                {row.storename}
              </td>
              <td style={{ padding: "2px", fontSize: "0.8rem" }}>
                {row.empid}
              </td>
              <td style={{ padding: "2px", fontSize: "0.8rem" }}>
                {row.invoice}
              </td>
              <td style={{ padding: "2px", fontSize: "0.8rem" }}>
                {row.serial}
              </td>
              <td style={{ padding: "2px", fontSize: "0.8rem" }}>
                {row.modelname}
              </td>
              <td style={{ padding: "2px", fontSize: "0.8rem" }}>
                ${row.Value}
              </td>
              <td style={{ padding: "2px", fontSize: "0.8rem" }}>
                {row.RMADate?.slice(0, 10) || "N/A"}
              </td>
              <td style={{ padding: "2px", fontSize: "0.8rem" }}>
                {row.RMANumber || "N/A"}
              </td>
              <td style={{ padding: "2px", fontSize: "0.8rem" }}>
                {row.UPSTrackingNumber || "N/A"}
              </td>
              {role === "user" && (
                <td>
                  {row.ntid ? (
                    <p>{row.ntid}</p>
                  ) : (
                    <input
                      type="text"
                      value={ntid[row.serial] || ""}
                      className="form-control"
                      onChange={(e) => handleNtidChange(e, row.serial)}
                      placeholder="Enter NTID"
                    />
                  )}
                </td>
              )}
              {row.imageurl ? (
  role === "manager" || role === "admin" ? (
    <td style={{ padding: "2px", fontSize: "0.8rem" }}>
      <FaEye
        className="btn bg-transparent text-success fs-4 btn-sm w-100 text-center"
        onClick={() => handleImageClick(row.signedImageUrl)}
      />
    </td>
  ) : (
    role === "user" && (
      <td style={{ padding: "2px", fontSize: "0.8rem" }}>
        <FaEye
          className="btn bg-transparent text-success fs-4 btn-sm w-100 text-center"
          onClick={() => handleImageClick(row.signedImageUrl)}
        />
      </td>
    )
  )
) : (
  <td style={{ padding: "2px", fontSize: "0.8rem" }}>
    <div className="badge">
      {role === "user" && ntid[row.serial] && (
        <>
          <input
            type="file"
            id={`file-input-${row.serial}`}
            accept="image/*"
            className="form-control form-control-sm d-none"
            onChange={(e) => handleFileUpload(e, row)}
          />
          <label
            htmlFor={`file-input-${row.serial}`}
            className="btn bg-transparent text-danger fs-6 btn-sm w-100 text-center"
          >
            <FaCloudUploadAlt />
          </label>
        </>
      )}

      {role === "user" && !row.ntid && (
        <label>
          <RxValueNone className="text-dark fs-5" />
        </label>
      )}
      {(role === "manager" || role === "admin") && (
        <label
          htmlFor={`file-input-${row.EmpId}`}
          className="btn bg-transparent text-danger fs-6 btn-sm w-100 text-center"
        >
          <FaEyeSlash />
        </label>
      )}
    </div>
  </td>
)}


              {(role === "manager" || role === "admin") && (
                <td style={{ padding: "2px", fontSize: "0.8rem" }}>
                  {row.imageurl && row.imageurl.trim() !== "" ? (
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={(e) => {
                        setModalData(true);
                        setSerial(row.serial);
                      }}
                    >
                      Update
                    </button>
                  ) : (
                    <span className=" fs-5 text-warning ">
                      <MdError />
                    </span>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default TableBody;
