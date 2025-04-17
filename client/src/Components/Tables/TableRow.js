// src/components/TableRow.jsx
import React, { useState } from 'react';
import TableCell from '../Cells/TableCell';
import NtidCell from '../Cells/NtidCell';
import ImageCell from '../Cells/ImageCell';
import ActionCell from '../Cells/ActionCell';
import AlertMessage from '../Messages/AlertMessage';

const TableRow = ({
  row,
  index,
  role,
  ntid,
  handleNtidChange,
  handleFileUpload,
  setModalData,
  setSerial,
}) => {
  const [alert, setAlert] = useState({ message: '', type: '' });

  const handleImageClick = (imageurl) => {
    if (imageurl && typeof imageurl === 'string' && imageurl.trim() !== '') {
      window.open(imageurl, '_blank');
    } else {
      setAlert({ message: 'Invalid image URL', type: 'danger' });
    }
  };

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
        <ImageCell
          row={row}
          role={role}
          ntid={ntid}
          handleFileUpload={handleFileUpload}
          handleImageClick={handleImageClick}
        />
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