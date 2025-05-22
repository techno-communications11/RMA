import React from "react";
import { Table } from "react-bootstrap";
import { useUserContext } from "../Components/Context/MyContext";
import LoadingSpinner from "../Components/Messages/LoadingSpinner";
import TableHeader from "../Components/Tables/TableHeader";
import TableRow from "../Components/Tables/TableRow";


const TableBodyWrapper = ({
  filteredData,
  handleNtidChange,
  ntid,
  setModalData,
  setOld_imei,
  Columns,
  loading,
}) => {
  const { userData } = useUserContext();
  const role = userData.role;


  if (loading) {
    return <LoadingSpinner />;


  }


   console.log("Filtered Data:", filteredData);


  return (
    <div style={{ maxHeight: "400px", overflowX: "auto" }}>
      <Table className="table table-hover table-striped">
        <TableHeader role={role} Columns={Columns} />
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
              Columns={Columns}
            />
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default TableBodyWrapper;
