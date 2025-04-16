import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './components/Auth/Login/Login.js';
import { Register } from './components/Auth/Register/Register.js';
import Navbar from './components/Utilitycomponents/CustomNavbar.js';
import Home from './components/Home';
import Updatepassword from './components/Auth/Updatepassword';
import RegisterMarket from './components/Auth/RegisterMarket';
import RegisterStore from './components/Auth/RegisterStore';
import AdminDashboard from './components/Dashboard/AdminDashboard.js';
import ProtectedRoute from './components/Utilitycomponents/ProtectedRoute.js';
import { UserProvider, useUserContext } from './components/Utilitycomponents/MyContext.js';
import UserDashboard from './components/Dashboard/UserDashboard/UserDashboard.js';

const AppContent = () => {
  const { isAuthenticated, userData, loading } = useUserContext();
  const location = useLocation();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      {isAuthenticated && location.pathname !== '/' && <Navbar />}
      <Routes>
        {/* Public routes */}
        <Route
          path="/"
          element={
            isAuthenticated && userData && userData.role ? (
              <Navigate
                to={userData.role === 'admin' ? '/adminDashboard' : '/userDashboard'}
                replace
              />
            ) : (
              <Login />
            )
          }
        />
        <Route path="/register" element={<Register />} />
        <Route path="/resetpassword" element={<Updatepassword />} />

        {/* Private routes */}
        <Route
          path="/userDashboard"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/home"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/registerstore"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <RegisterStore />
            </ProtectedRoute>
          }
        />
        <Route
          path="/registermarket"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <RegisterMarket />
            </ProtectedRoute>
          }
        />
        <Route
          path="/adminDashboard"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} isAdmin>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        {/* Catch-all route */}
        <Route
          path="*"
          element={
            <Navigate to={isAuthenticated ? '/userDashboard' : '/'} replace />
          }
        />
      </Routes>
    </>
  );
};

const App = () => (
  <BrowserRouter>
    <UserProvider>
      <AppContent />
    </UserProvider>
  </BrowserRouter>
);

export default App;