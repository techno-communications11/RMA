import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Login } from './components/Login';
import { Register } from './components/Register';
import Navbar from './components/CustomNavbar.js';
import Home from './components/Home';
import Updatepassword from './components/Updatepassword';
import RegisterMarket from './components/RegisterMarket';
import RegisterStore from './components/RegisterStore';
import AdminDashboard from './components/AdminDashboard';
import PrivateRoute from './components/PrivateRoute.js';
import { useLocation } from 'react-router-dom';
import UserDashboard from './components/UserDashboard.js';

const AppContent = () => {
  const location = useLocation();
  const isAuthenticated = Boolean(localStorage.getItem('token'));
  return (
    <>
      {isAuthenticated && location.pathname !== '/' && <Navbar />}
      <Routes>
        {/* Public routes */}
        <Route path="/"  element={<Login />} />
        <Route path="/register" element={<PrivateRoute element={<Register />} />}/>
        <Route path="/resetpassword" element={<PrivateRoute element={<Updatepassword />} />}/>

        {/* Private routes */}
        <Route path="/userDashboard" element={<PrivateRoute element={<UserDashboard />} />} />
        <Route path="/home" element={<PrivateRoute element={<Home />} />} />
        <Route path="/registerstore" element={<PrivateRoute element={<RegisterStore />} />} />
        <Route path="/registermarket" element={<PrivateRoute element={<RegisterMarket />} />} />
        <Route path="/adminDashboard" element={<PrivateRoute element={<AdminDashboard />} />} />
      </Routes>
    </>
  );
};

const App = () => (
  <BrowserRouter>
    <AppContent />
  </BrowserRouter>
);

export default App;
