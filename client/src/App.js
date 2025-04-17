import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './Pages/Login.js';
import Register from './Pages/Register.js';
import Navbar from './Components/Layout/CustomNavbar.js'
import Home from './Pages/Home.js';
import UpdatePassword from './Pages/Updatepassword.js';
import RegisterMarket from './Pages/RegisterMarket.js';
import RegisterStore from './Pages/RegisterStore.js';
import AdminDashboard from './Pages/AdminDashboard.js';
import ProtectedRoute from './Components/Misc/ProtectedRoute.js';
import { UserProvider, useUserContext } from './Components/Context/MyContext.js';
import UserDashboard from './Pages/UserDashboard.js';
import UserImageUploads from './Pages/UserImageUploads.js';
import Tracking from './Pages/Tracking.js';
import Uploads from './Pages/Uploads.js';
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
                to={userData.role === 'user' ? '/userDashboard' : '/adminDashboard'}
                replace
              />
            ) : (
              <Login />
            )
          }
        />
        <Route path="/register" element={<Register />} />
        <Route path="/resetpassword" element={<UpdatePassword />} />
        <Route path="/userimageupload/:key/:value" element={<ProtectedRoute isAuthenticated={isAuthenticated}>
          <UserImageUploads/>
        </ProtectedRoute>}/>

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
          path="/tracking"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Tracking />
            </ProtectedRoute>
          }
        />

<Route
          path="/uploads"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Uploads />
            </ProtectedRoute>
          }
        />

        <Route
          path="/home/:storename"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Home />
            </ProtectedRoute>
          }
        />
         <Route
          path="/homedata"
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