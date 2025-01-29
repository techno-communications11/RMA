import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { BarChart3, Package, CheckCircle, Clock } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { FaChartPie } from "react-icons/fa6";

const UserDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stores, setStores] = useState("");
  const [store, setCurrentStore] = useState("");
  const [stats, setStats] = useState({ total: 0, pending: 0, completed: 0 ,imageUpload:0,imageNotUploaded:0});
  const [animate, setAnimate] = useState(false);

  const token = localStorage.getItem("token");
  const storeid = jwtDecode(token).storeid;

  const COLORS = ['#0088FE', '#ff9800', '#00C49F'];

  const getPieData = () => [
    { name: 'Total', value: stats.total },
    { name: 'Pending', value: stats.pending },
    { name: 'Completed', value: stats.completed },
    // {
    //  name:"image uploaded",value:stats.imageUpload
    // },{
    //     name:"image not uploaded",value:stats.imageNotUploaded
    //    }
  ];

  useEffect(() => {
    const getStores = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/getstores`
        );
        setStores(response.data);
      } catch (err) {
        console.error("Failed to fetch stores:", err);
      }
    };
    getStores();
  }, []);

  useEffect(() => {
    if (stores.length > 0) {
      const currentStore = stores.find((s) => s.id === storeid);
      if (currentStore) {
        setCurrentStore(currentStore.Store);
      } else {
        setCurrentStore(null);
      }
    } else {
      setCurrentStore(null);
    }
  }, [stores, storeid]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/getdata`
        );

        let filtered = response.data;
        if (store !== null) {
          filtered = filtered.filter((row) => row.storename === store);
        }

        const total = filtered.length;
        const pending = filtered.filter((row) => !row.UPSTrackingNumber).length;
        //  const imageNotUploaded=filtered.filter((row)=>!row.imageurl).length;
        //  const imageUpload=total-imageNotUploaded
        const completed = total - pending;

        setStats({ total, pending, completed});
        setAnimate(true);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError("Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [store]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-container">
        <div className="header-section">
          <div className="image-container">
            <div className="content-overlay">
              <BarChart3 className="text-white" size={32} />
              <h2 className="display-6 fw-bold text-white mb-2">RMA Dashboard</h2>
              {store && (
                <p className="lead fw-bold text-white mb-0 small">
                  Current Store: {store}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="content-section">
          <div className="stats-grid">
            <div className={`stat-card ${animate ? "animate-in" : ""}`}>
              <Package className="text-primary mb-2" size={24} />
              <h3 className="h5 mb-2">Total RMAs</h3>
              <p className="h3 fw-bold text-primary mb-0">{stats.total}</p>
            </div>

            <div className={`stat-card ${animate ? "animate-in" : ""}`}>
              <Clock className="text-warning mb-2" size={24} />
              <h3 className="h5 mb-2">Pending RMAs</h3>
              <p className="h3 fw-bold text-warning mb-0">{stats.pending}</p>
            </div>

            <div className={`stat-card ${animate ? "animate-in" : ""}`}>
              <CheckCircle className="text-success mb-2" size={24} />
              <h3 className="h5 mb-2">Completed RMAs</h3>
              <p className="h3 fw-bold text-success mb-0">{stats.completed}</p>
            </div>
            
           
          </div>

          <div className="chart-section">
            <div className={`chart-card ${animate ? "animate-in" : ""}`}>
                <h4 className="text-center fw-bolder"> <FaChartPie className="text-primary"/> Pie Chart View</h4>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={getPieData()}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                  >
                    {getPieData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .dashboard-wrapper {
          height: 90vh;
          background: linear-gradient(
            135deg,
            rgba(246, 193, 229, 0.43) 0%,
            rgba(199, 219, 251, 0.35) 100%
          );
          overflow: hidden;
        }

        .dashboard-container {
          height: 100%;
          display: grid;
          grid-template-rows: auto 1fr;
          padding: 1rem;
          gap: 1rem;
        }

        .header-section {
          height: 20vh;
        }

        .image-container {
          height: 100%;
          border-radius: 12px;
          position: relative;
          background-image: url('/ship.jpg');
          background-size: cover;
          background-position: center;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .content-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(2px);
          border-radius: 12px;
        }

        .content-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          height: 100%;
        }

        .stats-grid {
          display: grid;
          grid-template-rows: repeat(3, 1fr);
          gap: 1rem;
        }

        .stat-card {
          background: white;
          border-radius: 12px;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          transition: transform 0.2s ease;
        }

        .chart-section {
          height: 80%;
        }

        .chart-card {
          height: 100%;
          background: white;
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .stat-card:hover {
          transform: translateY(-2px);
        }

        .animate-in {
          animation: fadeInUp 0.4s ease-out forwards;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          .content-section {
            grid-template-columns: 1fr;
          }

          .stats-grid {
            grid-template-rows: repeat(3, 80px);
          }

          .chart-section {
            min-height: 300px;
          }
        }
      `}</style>
    </div>
  );
};

export default UserDashboard;