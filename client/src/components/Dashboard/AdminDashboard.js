import React from 'react';
import { Tabs, Tab, Container } from 'react-bootstrap';
import Markets from '../Utilitycomponents/Markets';
import ImageStatus from './MarketImageStatus/MarketImageStats';
import ShippingStatus from './ShippingStatus';
import './Styles/AdminDashboard.css'; // Import custom CSS for additional styling
function AdminDashboard() {
  return (
    <Container fluid className="admin-dashboard">
      <div className="dashboard-header" style={{ backgroundImage: `url(/ship.jpg)` }}>
      
        <h4 className='fw-bold text-pink-400 my-4 text-center'>RMA Dashboard</h4>
      </div>
      
      <Tabs defaultActiveKey="markets" id="admin-dashboard-tabs">
        <Tab eventKey="markets" title="Markets">
          <Markets />
        </Tab>
        <Tab eventKey="imageStatus" title="Image Status">
          <ImageStatus />
        </Tab>
        <Tab eventKey="shippingStatus" title="Shipping Status">
          <ShippingStatus />
        </Tab>
      </Tabs>
    </Container>
  );
}

export default AdminDashboard;