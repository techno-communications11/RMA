// src/components/TableCell.jsx
import React from 'react';
import * as S from '../Tables/TableBody.styles';

const TableCell = ({ value }) => {
  return <td className={S.TableCell}>{value}</td>;
};

export default TableCell;