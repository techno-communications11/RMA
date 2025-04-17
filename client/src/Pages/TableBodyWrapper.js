// src/components/TableBodyWrapper.jsx
import React from 'react';
import { Table } from 'react-bootstrap';
import { useUserContext } from '../Components/Context/MyContext';
import LoadingSpinner from '../Components/Messages/LoadingSpinner';
import TableHeader from '../Components/Tables/TableHeader';
import TableRow from '../Components/Tables/TableRow';
import * as S from '../Components/Tables/TableBody.styles';

const TableBody = ({
  filteredData,
  handleNtidChange,
  handleFileUpload,
  ntid,
  setModalData,
  setSerial,
  loading,
}) => {
  const { userData } = useUserContext();
  const role = userData.role;
   

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className={S.TableContainer} style={{ maxHeight: '400px', overflowX: 'auto' }}>
      <Table className="table table-hover table-striped ">
        <TableHeader role={role} /> 
        
        <tbody className="text-center">
          {filteredData.map((row, index) => (
            <TableRow
              key={index}
              row={row}
              index={index}
              role={role}
              ntid={ntid}
              handleNtidChange={handleNtidChange}
              handleFileUpload={handleFileUpload}
              setModalData={setModalData}
              setSerial={setSerial}
            />
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default TableBody;