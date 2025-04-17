import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUserContext } from '../Components/Context/MyContext';
import DashboardHeader from '../Components/Layout/DashboardHeader';
import StatsGrid from '../Components/Cards/StatsGrid';
import PieChartCard from '../Components/Charts/PieChartCard';
import LoadingSpinner from '../Components/Messages/LoadingSpinner';
import ErrorMessage from '../Components/Messages/ErrorMessage';
import '../Styles/UserDashboard.css';

const BASE_URL = process.env.REACT_APP_BASE_URL;

const UserDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const [error, setError] = useState(null);
  const [stores, setStores] = useState([]);
  const [store, setCurrentStore] = useState(null);
  const [stats, setStats] = useState(null);
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
        setLoading(false);
      }
    };
    getStores();
  }, []);

  useEffect(() => {
    if (stores.length > 0 && userData?.storeid) {
      const currentStore = stores.find((s) => s.id === userData.storeid);
      setCurrentStore(currentStore ? currentStore.Store : null);
      setInitialLoad(false);
    }
  }, [stores, userData?.storeid]);

  useEffect(() => {
    if (!initialLoad && store !== null) {
      setAnimate(false);
      const fetchData = async () => {
        try {
          setLoading(true);
          const response = await axios.get(`${BASE_URL}/getdata`, {
            withCredentials: true,
          });

          const filtered = response.data.filter((row) => row.storename === store);
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
    }
  }, [store, initialLoad]);

  if (initialLoad || loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!stats) return <LoadingSpinner />;

  return (
    <div className="dashboard-wrapper">
      {/* RMA Dashboard - Vertical Stack */}
      <div className="dashboard-vertical-stack">
        
        {/* RMA Section */}
        <div className="dashboard-section">
          <DashboardHeader store={store} name="RMA Dashboard" />
          <div className="horizontal-metrics">
            <StatsGrid stats={stats} animate={animate} />
            <div className="graph-wrapper">
              <PieChartCard stats={stats} animate={animate} />
            </div>
          </div>
        </div>
        
        {/* XBM Section */}
        <div className="dashboard-section">
          <DashboardHeader store={store} name="XBM Dashboard" />
          <div className="horizontal-metrics">
            <StatsGrid stats={stats} animate={animate} />
            <div className="graph-wrapper">
              <PieChartCard stats={stats} animate={animate} />
            </div>
          </div>
        </div>
        
        {/* p... Section */}
        <div className="dashboard-section">
          <DashboardHeader store={store} name="Trade-IN Dashboard" />
          <div className="horizontal-metrics">
            <StatsGrid stats={stats} animate={animate} />
            <div className="graph-wrapper">
              <PieChartCard stats={stats} animate={animate} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;