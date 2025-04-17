import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUserContext } from '../Context/MyContext';
import LoadingSpinner from '../Messages/LoadingSpinner';

const ProtectedRoute = ({ children, isAuthenticated,  }) => {
  const {  loading } = useUserContext();

  if (loading) {
    return (
     <LoadingSpinner/>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // if (isAdmin && userData.role !== 'admin') {
  //   return <Navigate to="/userDashboard" replace />;
  // }

  return children;
};

export default ProtectedRoute;