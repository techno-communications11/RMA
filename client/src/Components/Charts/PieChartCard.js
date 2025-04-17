import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { FaChartPie } from 'react-icons/fa6';
import '../../Styles/PieChartCard.css';

const COLORS = ['#0088FE', '#ff9800', '#00C49F'];

const PieChartCard = ({ stats, animate }) => {
  const pieData = [
    { name: 'Total', value: stats.total },
    { name: 'Pending', value: stats.pending },
    { name: 'Completed', value: stats.completed },
  ].filter((entry) => entry.value > 0); // Filter out zero values

  return (
    <div className="chart-section">
      <div className={`chart-card ${animate ? 'animate-in' : ''}`}>
        <h4 className="text-center fw-bolder">
          <FaChartPie className="text-primary" /> Pie Chart View
        </h4>
        {pieData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-center text-muted">No data available for the pie chart.</p>
        )}
      </div>
    </div>
  );
};

export default PieChartCard;