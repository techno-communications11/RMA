// src/components/TableRow.jsx
import React, { useState } from 'react';
import TableCell from '../Cells/TableCell';
import NtidCell from '../Cells/NtidCell';
import ActionCell from '../Cells/ActionCell';
import AlertMessage from '../Messages/AlertMessage';
import VerifyNtid from '../Cells/VerifyNtid';

const TableRow = ({
  row,
  index,
  role,
  ntid,
  handleNtidChange,
 
  setModalData,
  setSerial,
}) => {
  const [alert, setAlert] = useState({ message: '', type: '' });

  

   console.log(ntid,"nnnn");

  return (
    <>
      <AlertMessage
        message={alert.message}
        type={alert.type}
        onClose={() => setAlert({ message: '', type: '' })}
      />
      <tr className="animate__animated animate__fadeIn text-nowrap">
        <TableCell value={index + 1} />
        <TableCell value={row.market} />
        <TableCell value={row.storeid} />
        <TableCell value={row.storename} />
        <TableCell value={row.empid} />
        <TableCell value={row.invoice} />
        <TableCell value={row.serial} />
        <TableCell value={row.modelname} />
        <TableCell value={`$${row.Value}`} />
        <TableCell value={row.RMADate?.slice(0, 10) || 'N/A'} />
        <TableCell value={row.RMANumber || 'N/A'} />
        <TableCell value={row.UPSTrackingNumber || 'N/A'} />
        {role === 'user' && (
          <NtidCell
            row={row}
            ntid={ntid}
            handleNtidChange={handleNtidChange}
          />
        )}
        {
          role==='user' && <VerifyNtid ntid={ntid}/>
          
          // <Upload />
        }

       
        {(role === 'manager' || role === 'admin') && (
          <ActionCell
            row={row}
            setModalData={setModalData}
            setSerial={setSerial}
          />
        )}
      </tr>
    </>
  );
};

export default TableRow;