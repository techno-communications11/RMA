import React from 'react';

const NtidCell = ({ row, ntid, handleNtidChange }) => {
  return (
    <td className="px-2 py-2">
      {row.ntid ? (
        <p className="small text-secondary mb-0">{row.ntid}</p>
      ) : (
        <input
          type="text"
          value={ntid[row.serial] || ''}
          class="form-control form-control-sm"
          onChange={(e) => handleNtidChange(e, row.serial)}
          placeholder="Enter NTID"
          aria-label="NTID input"
        />

        // <input  type="text" placeholder=".form-control-sm"></input>
      )}
    </td>
  );
};

export default NtidCell;