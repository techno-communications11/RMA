import React, { Suspense, lazy } from 'react';
import { Tabs, Tab, Container, Spinner, Alert } from 'react-bootstrap';
import { useUserContext } from '../Components/Context/MyContext';
import '../Styles/AdminDashboard.css';

// Lazy load dashboard components
const RMADashboard = lazy(() => import('../Components/Layout/GenericDashboard').then(module => ({ default: module.RMADashboard })));
const TradeInDashboard = lazy(() => import('../Components/Layout/GenericDashboard').then(module => ({ default: module.TradeInDashboard })));
const XbmDashboard = lazy(() => import('../Components/Layout/GenericDashboard').then(module => ({ default: module.XbmDashboard })));

const DASHBOARD_CONFIG = [
  {
    key: "rma",
    title: "RMA Stats",
    component: RMADashboard,
    requiredRoles: ["admin", "inventry"],
    icon: "📊"
  },
  {
    key: "tradein",
    title: "Trade-In Stats",
    component: TradeInDashboard,
    requiredRoles: ["admin", "inventry"],
    icon: "💱"
  },
  {
    key: "xbm",
    title: "XBM Stats",
    component: XbmDashboard,
    requiredRoles: ["admin", "inventry"],
    icon: "📦"
  }
];

function AdminDashboard() {
  const { userData, isLoading, error } = useUserContext();

  if (isLoading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="mt-3">
        <Alert.Heading>Dashboard Error</Alert.Heading>
        <p>{error.message || "Failed to load dashboard data"}</p>
      </Alert>
    );
  }

  const availableDashboards = DASHBOARD_CONFIG.filter(dashboard =>
    dashboard.requiredRoles.includes(userData?.role)
  );

  if (availableDashboards.length === 0) {
    return (
      <Alert variant="warning" className="mt-3">
        <Alert.Heading>Access Restricted</Alert.Heading>
        <p>Your account doesn't have access to any dashboards.</p>
      </Alert>
    );
  }

  return (
    <Container fluid className="admin-dashboard-container">
      <div 
        className="dashboard-header"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(/ship.jpg)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '150px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '8px',
          marginBottom: '20px'
        }}
      >
        <h2 className="text-white fw-bold text-capitalize">
          {userData?.role || 'Admin'} Dashboard
        </h2>
      </div>

      <Tabs
        defaultActiveKey={availableDashboards[0]?.key}
        id="admin-dashboard-tabs"
        className="mb-3 dashboard-tabs"
        fill
      >
        {availableDashboards.map((dashboard) => (
          <Tab
            key={dashboard.key}
            eventKey={dashboard.key}
            title={
              <span>
                {dashboard.icon} {dashboard.title}
              </span>
            }
            className="p-4 dashboard-tab-content"
          >
            <Suspense fallback={
              <div className="text-center mt-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2">Loading {dashboard.title}...</p>
              </div>
            }>
              <dashboard.component />
            </Suspense>
          </Tab>
        ))}
      </Tabs>
    </Container>
  );
}

export default AdminDashboard;