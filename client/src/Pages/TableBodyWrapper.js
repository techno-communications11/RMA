import React from "react";
import { Table } from "react-bootstrap";
import { useUserContext } from "../Components/Context/MyContext";
import LoadingSpinner from "../Components/Messages/LoadingSpinner";
import TableHeader from "../Components/Tables/TableHeader";
import TableRow from "../Components/Tables/TableRow";
import RMA_Columns from "../Constants/RMA_Columns.js";
import XBM_Columns from "../Constants/XBM_Columns.js";

const TableBodyWrapper = ({
  filteredData,
  handleNtidChange,
  ntid,
  setModalData,
  setOld_imei,
  loading,
}) => {
  const { userData } = useUserContext();
  const role = userData.role;
  const path = window.location.pathname;

  const getColumns = () => {
    if (path.includes("xbmpage")) return XBM_Columns;
    if (path.includes("tradeinpage")) return XBM_Columns;
    return RMA_Columns;
  };

  if (loading) {
    return <LoadingSpinner />;
  }


  return (
    <div style={{ maxHeight: "400px", overflowX: "auto" }}>
      <Table className="table table-hover table-striped">
        <TableHeader role={role} columns={getColumns()} />
        <tbody className="text-center">
          {filteredData.map((row) => (
            <TableRow
              key={row.id} // Use row.id as the key
              row={row}
              index={row.id} // Pass row.id as the index (if needed)
              role={role}
              ntid={ntid}
              handleNtidChange={handleNtidChange}
              setModalData={setModalData}
              setOld_imei={setOld_imei}
              columns={getColumns()}
            />
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default TableBodyWrapper;
