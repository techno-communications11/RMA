// src/components/TableHeader.jsx
import React from 'react';


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
    { label: 'Verify', roles:['user'] },
    { label: 'Actions', roles: ['manager', 'admin'] },
  ];

  return (
    <thead>
      <tr className=" text-center">
        {columns.map((col, index) => {
          if (col.roles && !col.roles.includes(role)) return null;
          return (
            <th
             className='small'
              style={{backgroundColor:'#E10174',color:'#fff'}}
              key={index}
            >
              {col.label}
            </th>
          );
        })}
      </tr>
    </thead>
  );
};

export default TableHeader;


