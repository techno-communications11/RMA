import React from 'react';
import PropTypes from 'prop-types'; // Add prop-type validation

function Button({ 
  label, 
  variant = '', 
  onClick, 
  type = 'button',
  disabled = false,
  
  ...props 
}) {
  return (
    <button
      type={type}
      className={`btn ${variant}`.trim()}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {label}
    </button>
  );
}

Button.propTypes = {
  label: PropTypes.string.isRequired,
  variant: PropTypes.string,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  disabled: PropTypes.bool
};

export default Button;