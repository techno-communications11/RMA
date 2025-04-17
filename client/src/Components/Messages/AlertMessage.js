import React, { useEffect } from 'react';
import Button from '../Events/Button';

const AlertMessage = ({ message, type, onClose }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div
      className={`alert alert-${type} alert-dismissible fade show`}
      role="alert"
      style={{
        position: 'fixed',
        top: '10px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        width: 'fit-content',
        maxWidth: '90%',
      }}
    >
      {message}
      
    </div>
  );
};

export default AlertMessage;
