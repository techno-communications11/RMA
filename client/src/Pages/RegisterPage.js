import React, { useState, useEffect } from "react";
import { RegisterHeader } from "../Components/RegisterAssets/RegisterHeader";
import AlertMessage from "../Components/Messages/AlertMessage";
import { RegisterForm } from "../Components/Forms/RegisterForm";
import { Container, Row, Col } from "react-bootstrap";
import LoadingSpinner from "../Components/Messages/LoadingSpinner";
import GetStores from "../Components/Apis/GetStores";
import RegisterApi from "../Components/Apis/RegisterApi";

const RegisterPage = () => {
  const [userData, setUserData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
    store: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [storeData, setStoreData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (userData.password !== userData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const result = await RegisterApi(userData, setLoading);
    if (result.success) {
      setSuccess("Registration successful!");
      setUserData({
        email: "",
        password: "",
        confirmPassword: "",
        role: "user",
        store: "",
      });
    } else {
      setError(result.error || "Registration failed");
    }
  };

  const getStores = async () => {
    try {
      const data = await GetStores(setLoading, setError);
      if (Array.isArray(data) && data.length > 0) {
        // Normalize store data to ensure consistent structure
        const normalizedStores = data.map((store, index) => ({
          id: store.id || index, // Fallback ID if not provided
          value: store.value || store.id || store.store_name || "",
          label: store.label || store.store_name || "Unknown Store",
        }));
        setStoreData(normalizedStores);
      } else {
        setError("No stores found");
      }
    } catch (err) {
      setError(err.message || "Failed to fetch stores data");
    }
  };

  useEffect(() => {
    getStores();
  }, []);

  return (
    <Container fluid className="d-flex flex-column justify-content-center align-items-center max-vh-100">
      <AlertMessage
        message={success || error}
        type={success ? "success" : "danger"}
        onClose={() => {
          setSuccess("");
          setError("");
        }}
      />
      <RegisterHeader />
      <Row className="w-100 justify-content-center">
        <Col md={6}>
          {loading ? (
            <LoadingSpinner />
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

export default RegisterPage;