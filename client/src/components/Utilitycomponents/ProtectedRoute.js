import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUserContext } from './MyContext';
import LoadingSpinner from '../../utils/LoadingSpinner';

const ProtectedRoute = ({ children, isAuthenticated, isAdmin = false }) => {
  const { userData, loading } = useUserContext();

  if (loading) {
    return (
     <LoadingSpinner/>
    );
  }

  if (!isAuthenticated || !userData || !userData.role) {
    return <Navigate to="/" replace />;
  }

  if (isAdmin && userData.role !== 'admin') {
    return <Navigate to="/userDashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;