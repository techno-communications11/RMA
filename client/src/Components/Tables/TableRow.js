import React from 'react';
import PropTypes from 'prop-types';
import TableCell from '../Cells/TableCell';
import NtidCell from '../Cells/NtidCell';
import ActionCell from '../Cells/ActionCell';
import VerifyNtid from '../Cells/VerifyNtid';

const TableRow = ({
  row,
  index,
  role,
  ntid,
  handleNtidChange,
  setModalData,
  setOld_imei,
  columns,
}) => {
  const renderCell = (column) => {
    if (column.roles && !column.roles.includes(role)) return null;

    switch (column.label) {
      case 'Ntid':
        return (
          <NtidCell
            key={column.field || column.label} // Use column.field or label as key
            row={row}
            ntid={ntid}
            handleNtidChange={handleNtidChange}
          />
        );
      case 'Verify':
        return <VerifyNtid key={column.field || column.label} ntid={ntid} />;
      case 'Actions':
        return (
          <ActionCell
            key={column.field || column.label}
            row={row}
            setModalData={setModalData}
            setOld_imei={setOld_imei}
          />
        );
      default:
        return (
          <TableCell
            key={column.field || column.label} // Use column.field or label as key
            value={column.field ? row[column.field] : index + 1}
          />
        );
    }
  };

  return (
    <tr key={index} className="animate__animated animate__fadeIn text-nowrap">
      {columns.map((column) => {
        const cell = renderCell(column);
        return cell ? React.cloneElement(cell, { key: column.field || column.label }) : null;
      })}
    </tr>
  );
};

TableRow.propTypes = {
  row: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  role: PropTypes.string.isRequired,
  ntid: PropTypes.object,
  handleNtidChange: PropTypes.func.isRequired,
  setModalData: PropTypes.func.isRequired,
  setOld_imei: PropTypes.func.isRequired,
  columns: PropTypes.array.isRequired,
};

export default TableRow;