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
  Columns,
}) => {
  const renderCell = (Columns) => {
    if (Columns.roles && !Columns.roles.includes(role)) return null;
    

    switch (Columns.label) {
      case 'Ntid':
        return (
          <NtidCell
            key={Columns.field || Columns.label} // Use Columns.field or label as key
            row={row}
            ntid={ntid}
            handleNtidChange={handleNtidChange}
          />
        );
      case 'Verify':
        return <VerifyNtid key={Columns.field || Columns.label} ntid={ntid} rowntid={row.ntid} rowold_imei={row.old_imei} />;
      case 'Actions':
        return (
          <ActionCell
            key={Columns.field || Columns.label}
            row={row}
            setModalData={setModalData}
            setOld_imei={setOld_imei}
          />
        );
      default:
        return (
          <TableCell
            key={Columns.field || Columns.label} // Use Columns.field or label as key
            value={Columns.field ? row[Columns.field] : index + 1}
          />
        );
    }
  };

  return (
    <tr key={index} className="animate__animated animate__fadeIn text-nowrap">
      {Columns.map((Columns) => {
        const cell = renderCell(Columns);
        return cell ? React.cloneElement(cell, { key: Columns.field || Columns.label }) : null;
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
  Columns: PropTypes.array.isRequired,
};

export default TableRow;