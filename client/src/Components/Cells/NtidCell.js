// src/components/NtidCell.jsx
import React from 'react';
import * as S from '../Tables/TableBody.styles';

const NtidCell = ({ row, ntid, handleNtidChange }) => {
  return (
    <td className={S.TableCell}>
      {row.ntid ? (
        <p>{row.ntid}</p>
      ) : (
        <input
          type="text"
          value={ntid[row.serial] || ''}
          className="form-control"
          onChange={(e) => handleNtidChange(e, row.serial)}
          placeholder="Enter NTID"
          aria-label="NTID input"
        />
      )}
    </td>
  );
};

export default NtidCell;