import React from 'react';
import { Package, Clock, CheckCircle } from 'lucide-react';
import StatCard from '../Charts/StatCard';
import '../../Styles/StatsGrid.css';

const StatsGrid = ({ stats, animate }) => {
  return (
    <div className="stats-grid">
      <StatCard
        icon={Package}
        title="Total RMAs"
        value={stats.total}
        colorClass="text-primary"
        animate={animate}
      />
      <StatCard
        icon={Clock}
        title="Pending RMAs"
        value={stats.pending}
        colorClass="text-warning"
        animate={animate}
      />
      <StatCard
        icon={CheckCircle}
        title="Completed RMAs"
        value={stats.completed}
        colorClass="text-success"
        animate={animate}
      />
    </div>
  );
};

export default StatsGrid;