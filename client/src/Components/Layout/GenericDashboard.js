import React from 'react';
import { Tabs, Tab, Container } from 'react-bootstrap';
import Markets from '../../Pages/Markets';
import MarketImageStats from '../../Pages/MarketImageStats';
import '../../Styles/AdminDashboard.css';

function GenericDashboard({ tableName, dashboardName }) {
  if (!tableName) {
    console.warn(`Missing tableName for dashboard: ${dashboardName}`);
    return <div>Error: No table name provided for this dashboard.</div>;
  }

  return (
    <Container fluid className="admin-dashboard p-3">
      <Tabs
        defaultActiveKey="Markets"
        id={`${dashboardName}-tabs`}
        className="mb-3 dashboard-tabs"
      >
        <Tab 
          eventKey="Markets" 
          title="MarketWise Stats"
          className="p-3 dashboard-tab-content"
        >
          <Markets TableName={tableName} />
        </Tab>
        <Tab 
          eventKey="Images" 
          title="Images Stats"
          className="p-3 dashboard-tab-content"
        >
          <MarketImageStats TableName={tableName} />
        </Tab>
      </Tabs>
    </Container>
  );
}

export const RMADashboard = () => (
  <GenericDashboard tableName="rma_data" dashboardName="rma" />
);

export const TradeInDashboard = () => (
  <GenericDashboard tableName="trade_in" dashboardName="tradein" />
);

export const XbmDashboard = () => (
  <GenericDashboard tableName="xbm_data" dashboardName="xbm" />
);

export default GenericDashboard;