// src/components/Register.jsx
import React, { useState, useEffect } from 'react';

import { RegisterHeader } from '../Components/RegisterAssets/RegisterHeader';
import AlertMessage from '../Components/Messages/AlertMessage';
import { RegisterForm } from '../Components/Forms/RegisterForm';

import { Container, Row, Col } from 'react-bootstrap';
import LoadingSpinner from '../Components/Messages/LoadingSpinner';

const Register = () => {
  const [userData, setUserData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',
    store: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [storeData, setStoreData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [storesLoading, setStoresLoading] = useState(true);

  const handleChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (userData.password !== userData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.status === 201) {
        setSuccess('Registration successful! Please login.');
        setUserData({
          email: '',
          password: '',
          confirmPassword: '',
          role: 'user',
          store: '',
        });
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStores = async () => {
    setStoresLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/getStores`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (response.status === 200) {
        setStoreData(data);
      } else {
        setError('Failed to fetch stores.');
      }
    } catch (err) {
      setError('Network error while fetching stores.');
    } finally {
      setStoresLoading(false);
    }
  };

  useEffect(() => {
    getStores();
  }, []);

  return (
    <Container fluid className="d-flex flex-column justify-content-center align-items-center max-vh-100">
      <AlertMessage
        message={success || error}
        type={success ? 'success' : 'danger'}
        onClose={() => {
          setSuccess('');
          setError('');
        }}
      />
      <RegisterHeader />
      <Row className="w-100 justify-content-center">
       
        <Col md={6}>
          {storesLoading ? (
            <LoadingSpinner/>
          ) : (
            <RegisterForm
              userData={userData}
              error={error}
              storeData={storeData}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
              loading={loading}
            />
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Register;