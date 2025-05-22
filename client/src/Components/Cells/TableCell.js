import React from 'react';
import PropTypes from 'prop-types';

const TableCell = ({ value }) => {
  const displayValue = value === undefined || value === null ? 'N/A' : value;
  return (
    <td className="small text-dark text-capitalize text-muted ">
      {displayValue}
    </td>
  );
};

TableCell.propTypes = {
  value: PropTypes.any,
};

export default TableCell;