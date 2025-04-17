import React from "react";
import { Form } from "react-bootstrap";
import PropTypes from "prop-types";

const SelectInput = ({
  label = "", // Provide default empty string
  icon,
  options,
  value,
  onChange,
  defaultOption = "Select an option",
  className = "",
  optionClassName = "",
  disabledOptions = [],
  id,
  name,
  placeholder,
  required,
  disableFirst,
  capitalize
}) => {
  // Generate a safe ID for Form.Group
  const safeId = id || (label ? `select-${label.replace(/\s+/g, '-').toLowerCase()}` : `select-${Math.random().toString(36).substr(2, 9)}`);

  // Enhance options with default option
  const enhancedOptions = [
    ...(disableFirst ? [{ 
      id: "default", 
      value: "", 
      label: placeholder || defaultOption, 
      disabled: true 
    }] : []),
    ...(options || []).map((option, index) => ({
      id: option.id || index,
      value: option.value || option.marketName || option.role || option,
      label: option.label || option.marketName || option.role || option,
      disabled: disabledOptions.includes(option.value || option.marketName || option.role || option)
    }))
  ];

  return (
    <Form.Group controlId={safeId}>
      {label && (
        <Form.Label className="fw-bold text-pink-600">
          {icon && <span className="text-pink-500 me-2">{icon}</span>}
          {label}
        </Form.Label>
      )}
      <Form.Control
        as="select"
        name={name}
        value={value}
        onChange={onChange}
        className={`form-select text-muted  ${capitalize ? 'text-capitalize' : ''} shadow-none border ${className}`}
       
        required={required}
      >
        {enhancedOptions.map((option) => (
          <option
            key={option.id}
            value={option.value}
            className={`${optionClassName} ${
              option.disabled ? "text-muted" : "text-muted"
            }`}
            disabled={option.disabled}
          >
            {capitalize && typeof option.label === 'string' 
              ? option.label.toLowerCase() 
              : option.label}
          </option>
        ))}
      </Form.Control>
    </Form.Group>
  );
};

SelectInput.propTypes = {
  label: PropTypes.string,
  icon: PropTypes.node,
  options: PropTypes.array.isRequired,
  value: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  defaultOption: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  optionClassName: PropTypes.string,
  disabledOptions: PropTypes.array,
  id: PropTypes.string,
  name: PropTypes.string,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  disableFirst: PropTypes.bool,
  capitalize: PropTypes.bool
};

export default SelectInput;