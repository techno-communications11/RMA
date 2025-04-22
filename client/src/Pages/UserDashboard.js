import React, { useState, useEffect } from "react";
import { useUserContext } from "../Components/Context/MyContext";
import DashboardHeader from "../Components/Layout/DashboardHeader";
import StatsGrid from "../Components/Cards/StatsGrid";
import LoadingSpinner from "../Components/Messages/LoadingSpinner";
import ErrorMessage from "../Components/Messages/ErrorMessage";
import "../Styles/UserDashboard.css";
import GetStores from "../Components/Apis/GetStores";
import GetData from "../Components/Apis/GetRmaData";

const UserDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stores, setStores] = useState([]);
  const [store, setCurrentStore] = useState(null);
  const [stats, setStats] = useState(null);
  const [animate, setAnimate] = useState(false);
  const { userData } = useUserContext();

  useEffect(() => {
    const getStores = async () => {
      try {
        const data = await GetStores(setLoading, setError);
        if (Array.isArray(data) && data.length > 0) {
          // Normalize stores to ensure consistent structure
          const normalizedStores = data.map((store, index) => ({
            id: store.id || store.value || index,
            label: store.label || store.store_name || store.store || "Unknown Store",
            value: store.value || store.store_name || store.Store || "",
          }));
           console.log("Normalized Stores:", normalizedStores); // Debugging line
          setStores(normalizedStores);
        } else {
          setError("No stores found");
        }
      } catch (err) {
        setError(err.message || "Failed to fetch stores");
      }
    };
    getStores();
  }, []);

  useEffect(() => {
    if (stores.length > 0 && userData?.storeid) {
      const currentStore = stores.find((s) => s.id === userData.storeid);
      setCurrentStore(currentStore ? currentStore.label : null);
    }
  }, [stores, userData?.storeid]);

  useEffect(() => {
    if (store !== null) {
      const fetchData = async () => {
        try {
          setAnimate(false);
          const data = await GetData();
          if (Array.isArray(data) && data.length > 0) {
            const filtered = data.filter((row) => row.store_name === store);
            const total = filtered.length;
            const pending = filtered.filter((row) => !row.UPSTrackingNumber)
              .length;
            const completed = total - pending;

            setStats({ total, pending, completed });
            setAnimate(true);
          } else {
            setError("No data found for the selected store");
          }
        } catch (err) {
          setError(err.message || "Failed to fetch data");
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [store]);

  if (loading || store === null) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!stats) return <LoadingSpinner />;

  return (
    <div className="dashboard-container container-fluid py-4">
      <DashboardHeader store={store} name="Dashboard" />
      <div className="dashboard-grid">
        {/* RMA Dashboard */}
        <div className="dashboard-card">
          <h2 className="dashboard-title text-muted">RMA Dashboard</h2>
          <StatsGrid stats={stats} animate={animate} />
        </div>
        {/* XBM Dashboard */}
        <div className="dashboard-card">
          <h2 className="dashboard-title text-muted">XBM Dashboard</h2>
          <StatsGrid stats={stats} animate={animate} />
        </div>
        {/* Trade-In Dashboard */}
        <div className="dashboard-card">
          <h2 className="dashboard-title text-muted">Trade-In Dashboard</h2>
          <StatsGrid stats={stats} animate={animate} />
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;