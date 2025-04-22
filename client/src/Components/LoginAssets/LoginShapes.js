import React from "react";

export const LoginShapes = () => (
  <>
    <div 
      className="position-absolute"
      style={{
        top: '-10%',
        left: '-10%',
        width: '300px',
        height: '300px',
        background: 'rgba(225, 1, 116, 0.1)',
        borderRadius: '50%',
        transform: 'rotate(45deg)'
      }}
    />
    <div 
      className="position-absolute"
      style={{
        bottom: '-10%',
        right: '-10%',
        width: '400px',
        height: '400px',
        background: 'rgba(225, 1, 116, 0.05)',
        borderRadius: '50%',
        transform: 'rotate(-45deg)'
      }}
    />
  </>
);