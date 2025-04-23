import React, { useEffect, useState } from 'react';
import Trade_IN_Columns from '../Constants/Trade_IN_Columns';
import  GetTradeINData from '../Components/Apis/GetTradeINData';
import Table from '../Components/Tables/Table';
import Home from './Home';

function Tradein() {
  const [TradeInData, setTradeInData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRmaData = async () => {
    try {
      setLoading(true);
      const response = await GetTradeINData();
      // console.log('RMA response:', response);
      setTradeInData(response);
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
      <Home label="Trade-IN Report" />
      <Table Columns={Trade_IN_Columns} getdata={TradeInData} loading={loading} error={error} />
    </div>
  );
}

export default Tradein;