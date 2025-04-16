import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUserContext } from '../../Utilitycomponents/MyContext';
import DashboardHeader from './DashboardHeader';
import StatsGrid from './StatsGrid';
import PieChartCard from './PieChartCard';
import LoadingSpinner from '../../../utils/LoadingSpinner';
import ErrorMessage from '../../../utils/ErrorMessage';
import './Styles/UserDashboard.css';

const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:5000/api';

const UserDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stores, setStores] = useState([]);
  const [store, setCurrentStore] = useState(null);
  const [stats, setStats] = useState({ total: 0, pending: 0, completed: 0 });
  const [animate, setAnimate] = useState(false);
  const { userData } = useUserContext();

  useEffect(() => {
    const getStores = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/getstores`, {
          withCredentials: true,
        });
        setStores(response.data);
      } catch (err) {
        console.error('Failed to fetch stores:', err);
        setError('Failed to fetch stores.');
      }
    };
    getStores();
  }, []);

  useEffect(() => {
    if (stores.length > 0) {
      const currentStore = stores.find((s) => s.id === userData.storeid);
      setCurrentStore(currentStore ? currentStore.Store : null);
    } else {
      setCurrentStore(null);
    }
  }, [stores, userData.storeid]);

  useEffect(() => {
    setAnimate(false); // Reset animation when store changes
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/getdata`, {
          withCredentials: true,
        });

        let filtered = response.data;
        if (store) {
          filtered = filtered.filter((row) => row.storename === store);
        }

        const total = filtered.length;
        const pending = filtered.filter((row) => !row.UPSTrackingNumber).length;
        const completed = total - pending;

        setStats({ total, pending, completed });
        setAnimate(true);
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError('Failed to fetch data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [store]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-container">
        <DashboardHeader store={store} />
        <div className="content-section">
          <StatsGrid stats={stats} animate={animate} />
          <PieChartCard stats={stats} animate={animate} />
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;