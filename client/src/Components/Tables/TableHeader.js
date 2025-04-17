// src/components/TableHeader.jsx
import React from 'react';
import * as S from './TableBody.styles'; // Make sure TableHeader is a styled component

const TableHeader = ({ role }) => {
  const columns = [
    { label: 'SINO' },
    { label: 'Market' },
    { label: 'storeid' },
    { label: 'StoreName' },
    { label: 'EmployeeID' },
    { label: 'Invoice' },
    { label: 'Serial' },
    { label: 'ModelName' },
    { label: 'Value' },
    { label: 'RMADate' },
    { label: 'RMANumber' },
    { label: 'UPSTrackingNo' },
    { label: 'Ntid', roles: ['user'] },
    { label: 'Image' },
    { label: 'Actions', roles: ['manager', 'admin'] },
  ];

  return (
    <S.TableHeader>
      <tr className="text-center">
        {columns.map((col, index) => {
          if (col.roles && !col.roles.includes(role)) return null;
          return (
            <th
              className="text-nowrap"
              style={{ backgroundColor: '#E01074', color: 'white' }}
              key={index}
            >
              {col.label}
            </th>
          );
        })}
      </tr>
    </S.TableHeader>
  );
};

export default TableHeader;
