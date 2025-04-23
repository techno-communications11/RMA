import React, { useEffect, useState } from 'react';
import RMA_Columns from '../Constants/RMA_Columns';
import GetData from '../Components/Apis/GetRmaData';
import Table from '../Components/Tables/Table';
import Home from './Home';

function Rma() {
  const [rmaData, setRmaData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRmaData = async () => {
    try {
      setLoading(true);
      const response = await GetData();
      console.log('RMA response:', response);
      setRmaData(response);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRmaData();
  }, []);

  console.log('rmaData:', rmaData);

  return (
    <div>
      <Home label="RMA Report" />
      <Table Columns={RMA_Columns} getdata={rmaData} loading={loading} error={error} />
    </div>
  );
}

export default Rma;