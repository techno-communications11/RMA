import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { motion } from "framer-motion";
import * as S from "../LoginAssets/Login.styles";


const LoginForm = ({loading, credentials, error, handleChange, handleSubmit }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <motion.div 
      initial={S.formContainer.initial}
      animate={S.formContainer.animate}
      transition={S.formContainer.transition}
      className="col-md-6 d-flex justify-content-center align-items-center p-5"
    >
      <div className="card shadow-lg w-75 border-0 rounded-3" style={S.card.style}>
        <div className="card-body p-5">
          {error && (
            <motion.div 
              initial={S.error.initial}
              animate={S.error.animate}
              className="alert alert-danger"
            >
              {error}
            </motion.div>
          )}
          <form onSubmit={handleSubmit}>
            <h4 className="mb-4 text-center text-dark" style={S.formTitle}>
              Login to Your Account
            </h4>
            <div className="mb-3">
              <input
                type="email"
                className="form-control shadow-none"
                id="email"
                name="email"
                value={credentials.email}
                onChange={handleChange}
                placeholder="Enter email"
                required
                style={S.input}
              />
            </div>
            <div className="mb-1 position-relative">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control shadow-none"
                id="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                placeholder="Enter password"
                required
                style={{ ...S.input, padding: '12px 45px 12px 15px' }}
              />
              <motion.span
                className="position-absolute end-0 me-3"
                style={S.passwordToggle}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </motion.span>
            </div>
            <motion.button
              whileHover={S.button.hover}
              whileTap={S.button.tap}
              type="submit"
              className="btn text-white w-100 mt-3 mb-3"
              style={S.button.style}
            >
              {loading?<div class="spinner-border"></div>:"Login"}
            </motion.button>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export { LoginForm };