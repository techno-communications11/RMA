import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import * as S from './Register.styles';

const RegisterForm = ({ userData, error, storeData, handleChange, handleSubmit }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [confirmShowPassword, setConfirmShowPassword] = useState(false);

  return (
    <div className="col-md-5 p-5"> {/* Added p-0 to remove padding */}
      <div className="card shadow-lg border-0 rounded-lg" style={S.card.style}>
        <div className="card-body p-3"> {/* Reduced padding */}
          {error && <div className="alert alert-danger mb-2">{error}</div>}

          <form onSubmit={handleSubmit}>
            <h4 className="mb-3 text-center text-dark">Create Account</h4>

            <div className="mb-2">
              <input
                type="email"
                className="form-control shadow-none border"
                id="email"
                name="email"
                value={userData.email}
                onChange={handleChange}
                placeholder="Enter email"
                required
                style={S.input}
              />
            </div>

            <div className="mb-2">
              <select
                className="form-select shadow-none border"
                id="role"
                name="role"
                value={userData.role}
                onChange={handleChange}
                required
                style={S.input}
              >
                {["Select Role","user","manager","admin"].map((item, index) => (
                  <option key={index} value={item === "Select Role" ? "" : item} className='text-capitalize'>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-2">
              <select
                className="form-select shadow-none border"
                id="store"
                name="store"
                value={userData.store}
                onChange={handleChange}
                required
                style={S.input}
              >
                <option value="">Select Store</option>
                {storeData.map((store) => (
                  <option key={store.id} value={store.id}>
                    {store.Store}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-2 position-relative">
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-control shadow-none border pe-5" // Added pe-5 for icon spacing
                id="password"
                name="password"
                value={userData.password}
                onChange={handleChange}
                placeholder="Enter password"
                required
                style={S.input}
              />
              <button
                type="button"
                className="btn btn-link position-absolute end-0 top-0 h-100 d-flex align-items-center justify-content-center"
                onClick={() => setShowPassword(!showPassword)}
                style={{...S.passwordToggle, border: 'none', background: 'transparent'}}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <div className="mb-2 position-relative"> {/* Changed to mb-3 for bottom spacing */}
              <input
                type={confirmShowPassword ? 'text' : 'password'}
                className="form-control shadow-none border pe-5" // Added pe-5 for icon spacing
                id="confirmPassword"
                name="confirmPassword"
                value={userData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm password"
                required
                style={S.input}
              />
              <button
                type="button"
                className="btn btn-link position-absolute end-0 top-0 h-100 d-flex align-items-center justify-content-center"
                onClick={() => setConfirmShowPassword(!confirmShowPassword)}
                style={{...S.passwordToggle, border: 'none', background: 'transparent'}}
              >
                {confirmShowPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary w-100 text-white mt-1" // Reduced mt
              style={S.button}
            >
              Register
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export { RegisterForm };