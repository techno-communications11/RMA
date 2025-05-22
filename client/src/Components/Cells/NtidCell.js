import React from 'react';
import PropTypes from 'prop-types';

const NtidCell = ({ row, ntid, handleNtidChange }) => {
  return (

    <td className=" py-2">
      {row.ntid ? (
        <p className="small text-secondary mb-0">{row.ntid}</p>
      ) : (
        <input
         style={{ width: '100px' }}
          type="text"
          value={ntid[row.old_imei] || ''}
          className="form-control form-control-sm  border shadow-none"
          onChange={(e) => handleNtidChange(e, row.old_imei)}
          placeholder="Enter NTID"
          aria-label="NTID input"
        />
      )}
    </td>
  );
};

NtidCell.propTypes = {
  row: PropTypes.object.isRequired,
  ntid: PropTypes.object,
  handleNtidChange: PropTypes.func.isRequired,
};

export default NtidCell;