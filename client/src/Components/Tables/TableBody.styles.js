// src/components/TableBody.styles.js
import styled from 'styled-components';

export const TableContainer = styled.div`
  max-height: 800px;
  overflow-y: auto;
  overflow-x: auto;
  width: 100%;
`;

export const TableHeader = styled.thead`
  position: sticky;
  top: 0;
  z-index: 1000;
  th {
    background-color: #e10174;
    color: white;
  }
`;

export const TableCell = styled.td`
  padding: 2px;
  font-size: 0.8rem;
  vertical-align: middle;
  
`;




