import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Button from "../Events/Button";
import roles from "../../Constants/Roles";
import SelectInput from "../Events/SelectInput";

const RegisterForm = ({ userData, error, storeData, handleChange, handleSubmit, loading }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [confirmShowPassword, setConfirmShowPassword] = useState(false);

  return (
    <div className="col-md-5 w-75 mt-4">
      <div className="card shadow-lg border-0 rounded-lg">
        <div className="card-body p-3">
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
                disabled={loading}
              />
            </div>

            <div className="mb-2">
              <SelectInput
                id="role"
                name="role"
                value={userData.role}
                onChange={handleChange}
                options={roles
                  .filter((r) => r.role !== "Select Role")
                  .map((item) => ({
                    id: item.id,
                    value: item.role,
                    label: item.role,
                  }))}
                placeholder="Select Role"
                required
                disableFirst
                capitalize
                disabled={loading}
              />
            </div>

            <div className="mb-2">
              <SelectInput
                id="store"
                name="store"
                value={userData.store}
                onChange={handleChange}
                options={storeData}
                placeholder="Select Store"
                required
                capitalize
                disabled={loading}
              />
            </div>

            <div className="mb-2 position-relative">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control shadow-none border pe-5"
                id="password"
                name="password"
                value={userData.password}
                onChange={handleChange}
                placeholder="Enter password"
                required
                disabled={loading}
              />
              <button
                type="button"
                className="btn btn-link position-absolute end-0 top-0 h-100 d-flex align-items-center justify-content-center"
                onClick={() => setShowPassword(!showPassword)}
                style={{ border: "none", background: "transparent" }}
                disabled={loading}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <div className="mb-2 position-relative">
              <input
                type={confirmShowPassword ? "text" : "password"}
                className="form-control shadow-none border pe-5"
                id="confirmPassword"
                name="confirmPassword"
                value={userData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm password"
                required
                disabled={loading}
              />
              <button
                type="button"
                className="btn btn-link position-absolute end-0 top-0 h-100 d-flex align-items-center justify-content-center"
                onClick={() => setConfirmShowPassword(!confirmShowPassword)}
                style={{ border: "none", background: "transparent" }}
                disabled={loading}
              >
                {confirmShowPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <Button
              type="submit"
              variant="btn-primary w-100 text-white mt-1"
              label="Submit"
              disabled={loading}
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export { RegisterForm };