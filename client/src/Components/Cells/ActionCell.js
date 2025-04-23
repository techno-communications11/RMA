import React from 'react';
import PropTypes from 'prop-types';
import { MdError } from 'react-icons/md';

const ActionCell = ({ row, setModalData, setOld_imei }) => {
  return (
    <td>
      {row.image_url && row.image_url.trim() !== '' ? (
        <button
          className="btn btn-primary btn-sm"
          onClick={() => {
            setModalData(row);
            setOld_imei(row.old_imei);
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

ActionCell.propTypes = {
  row: PropTypes.object.isRequired,
  setModalData: PropTypes.func.isRequired,
  setOld_imei: PropTypes.func.isRequired,
};

export default ActionCell;