// src/components/ActionCell.jsx
import React from 'react';
import { MdError } from 'react-icons/md';


const ActionCell = ({ row, setModalData, setSerial }) => {
  return (
    <td className="">
      {row.imageurl && row.imageurl.trim() !== '' ? (
        <button
          className="btn  btn-primary btn-sm"
          onClick={() => {
            setModalData(row);
            setSerial(row.serial);
          }}
          aria-label="Update row"
        >
          Update
        </button>
      ) : (
        <span className="fs-5 text-warning" aria-label="No image available">
          <MdError />
        </span>
      )}
    </td>
  );
};

export default ActionCell;