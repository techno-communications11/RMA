import React from 'react';
import PropTypes from 'prop-types';

const TableHeader = ({ role, columns }) => {
  return (
    <thead>
      <tr className="text-center">
        {columns.map((col, index) => {
          if (col.roles && !col.roles.includes(role)) return null;
          return (
            <th
              className='small text-nowrap'
              style={{ backgroundColor: '#E10174', color: '#fff' }}
              key={col.field || index}
            >
              {col.label}
            </th>
          );
        })}
      </tr>
    </thead>
  );
};

TableHeader.propTypes = {
  role: PropTypes.string.isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      field: PropTypes.string,
      roles: PropTypes.arrayOf(PropTypes.string),
    })
  ).isRequired,
};

export default TableHeader;