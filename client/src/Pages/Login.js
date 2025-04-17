import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LoginHeader } from '../Components/Layout/LoginHeader';
import { LoginShapes } from '../Components/LoginAssets/LoginShapes';
import { LoginForm } from '../Components/Forms/LoginForm';
import * as S from '../Components/LoginAssets/Login.styles';
import { useUserContext } from '../Components/Context/MyContext';
const BASE_URL = process.env.REACT_APP_BASE_URL;

const Login = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { setUserData, setIsAuthenticated } = useUserContext();

  const handleChange = (e) => {
    setCredentials((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const loginResponse = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
        credentials: 'include',
      });

      if (!loginResponse.ok) {
        const errorData = await loginResponse.json();
        if (loginResponse.status === 401) {
          throw new Error('Invalid email or password');
        } else if (loginResponse.status === 500) {
          throw new Error('Server error. Please try again later.');
        }
        throw new Error(errorData.message || 'Login failed');
      }

      let retries = 2;
      let fetchedUserData = null;
      while (retries >= 0) {
        try {
          const userResponse = await fetch(`${BASE_URL}/user/me`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
          });

          if (!userResponse.ok) {
            throw new Error(`HTTP error ${userResponse.status}`);
          }

          fetchedUserData = await userResponse.json();
          if (!fetchedUserData?.id || !fetchedUserData?.role) {
            throw new Error('Invalid user data');
          }

          break;
        } catch (err) {
          if (retries === 0) {
            throw new Error('Failed to fetch user data after login. Please try again.');
          }
          await new Promise((resolve) => setTimeout(resolve, 500));
          retries--;
        }
      }

      setUserData({
        id: fetchedUserData.id,
        role: fetchedUserData.role,
        storeid:fetchedUserData.storeid,
        email: fetchedUserData.email,
        market: fetchedUserData.market,
        name: fetchedUserData.name,
      });
      setIsAuthenticated(true);

      const targetRoute = fetchedUserData.role === 'user' ? '/userDashboard' : '/adminDashboard';
      navigate(targetRoute, { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials and try again.');
      setUserData(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setError('');
  }, [credentials.email, credentials.password]);

  return (
    <motion.div
      initial={S.container.initial}
      animate={S.container.animate}
      exit={{ opacity: 0 }}
      transition={S.container.transition}
      style={S.container.style}
      className="container-fluid min-vh-100 d-flex flex-column justify-content-center position-relative"
    >
      <LoginShapes />
      <LoginHeader />
      <div className="row w-100 m-0">
        <motion.div
          initial={S.logoContainer.initial}
          animate={S.logoContainer.animate}
          exit={{ opacity: 0 }}
          transition={S.logoContainer.transition}
          className="col-md-6 d-flex justify-content-center align-items-center"
        >
          <motion.img
            transition={S.logo.transition}
            src="/logoT.webp"
            alt="Logo"
            className="img-fluid w-100"
          />
        </motion.div>
        <LoginForm
          credentials={credentials}
          error={error}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          loading={loading}
        />
      </div>
    </motion.div>
  );
};

export default Login;