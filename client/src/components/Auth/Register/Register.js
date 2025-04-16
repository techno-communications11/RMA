import React, { useState, useEffect } from 'react';
import { RegisterHeader } from './RegisterHeader';
import { RegisterForm } from './RegisterForm';

import * as S from './Register.styles';
import RegisterAnimation from "../../../Jsons/RegisterAnimation.json";

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

  const handleChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (userData.password !== userData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials:'include',
        body: JSON.stringify(userData)
      });

      const data = await response.json();

      if (response.status === 201) {
        setSuccess('Registration successful! Please login.');
        setError('');
        setUserData({ 
          email: '', 
          password: '', 
          confirmPassword: '', 
          role: 'user', 
          store: '' 
        });
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('Registration failed. Please try again.');
    }
  };

  const getStores = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/getStores`, {
        method: 'GET',
        credentials:'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (response.status === 200) {
        setStoreData(data);
      }
    } catch (err) {
      setError('Failed to fetch stores. Please try again.');
    }
  };

  useEffect(() => {
    getStores();
  }, []);

  return (
    <div className='d-flex flex-column justify-content-center align-items-center'>
      {success && (
        <div className="alert alert-success alert-dismissible mt-5">
          <strong>{success}</strong>
        </div>
      )}

      <RegisterHeader />

      <div className="container-fluid d-flex gap-1 justify-content-around align-items-center">
        <div className="row w-100 justify-content-center p-1" style={S.container.style}>
          <RegisterAnimation  />
          
          <RegisterForm 
            userData={userData}
            error={error}
            storeData={storeData}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
};

export { Register };