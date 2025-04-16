import React from 'react';
import './Styles/ErrorMessage.css';

const ErrorMessage = ({ message }) => {
  return (
    <div className="error-container">
      <div className="alert alert-danger" role="alert">
        {message}
      </div>
    </div>
  );
};

export default ErrorMessage;