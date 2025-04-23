import React, { useEffect, useState } from 'react';
import XBM_Columns from '../Constants/XBM_Columns';
import GetXbmData from '../Components/Apis/GetXbmData';
import Table from '../Components/Tables/Table';
import Home from './Home';

function Xbm() {
  const [xbmData, setXbmData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRmaData = async () => {
    try {
      setLoading(true);
      const response = await GetXbmData();
       
      console.log('RMA response:', response);
      setXbmData(response);
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


  return (
    <div>
      <Home label="XBM Report" />
      <Table Columns={XBM_Columns} getdata={xbmData} loading={loading} error={error} />
    </div>
  );
}

export default Xbm;