import React, { useState } from "react";
import { Form, Card } from "react-bootstrap";
import { FaShoppingCart } from "react-icons/fa";
import Button from "../Components/Events/Button"; // Your custom Button component
import AlertMessage from "../Components/Messages/AlertMessage"; // Your custom Alert
import LoadingSpinner from "../Components/Messages/LoadingSpinner"; // Your custom Spinner
import RegisterMarketApi from "../Components/Apis/RegisterMarketApi"; // New API service

function RegisterMarket() {
  const [marketData, setMarketData] = useState({ marketname: "" });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [validated, setValidated] = useState(false);

  const handleMarketRegistration = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (!form.checkValidity()) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    const trimmedMarketName = marketData.marketname.trim();
    if (trimmedMarketName.length < 3) {
      setError("Market name must be at least 3 characters long");
      setValidated(true);
      return;
    }

    setError("");
    setSuccess("");

    const result = await RegisterMarketApi(
      { marketname: trimmedMarketName },
      setIsLoading
    );

    if (result.success) {
      setSuccess("Market registered successfully");
      setMarketData({ marketname: "" });
      setValidated(false);
    } else {
      setError(result.error || "Market registration failed");
    }
  };

  return (
    <div className="container-fluid">
      <div className="container-fluid">
        <div
          className="dashboard-header1 mb-1"
          style={{
            backgroundImage: "url(/market.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <h4 className="text-white mb-1 fs-1 text-center animate__animated animate__fadeIn">
            Register Market
          </h4>
        </div>
      </div>
      {isLoading && <LoadingSpinner />}
      <Card
        className="shadow-lg border-0 mx-auto"
        style={{ maxWidth: "30rem", marginTop: "70px" }}
      >
        <Card.Body className="p-4 p-md-5">
          <div className="text-center mb-4">
            <div className="bg-pink-100 rounded-circle p-3 d-inline-flex mb-3">
              <FaShoppingCart className="text-pink-600" size={30} />
            </div>
            <h1 className="h2 fw-bold mb-3 text-pink-600">Register Market</h1>
            <p className="text-muted">Create your market profile to get started</p>
          </div>

          <AlertMessage
            message={success || error}
            type={success ? "success" : "danger"}
            onClose={() => {
              setSuccess("");
              setError("");
            }}
          />

          <Form
            noValidate
            validated={validated}
            onSubmit={handleMarketRegistration}
            className="max-w-md mx-auto"
          >
            <Form.Group className="mb-4" controlId="marketname">
              <Form.Label className="fw-medium text-pink-600">
                Market Name
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter market name"
                value={marketData.marketname}
                onChange={(e) =>
                  setMarketData({ ...marketData, marketname: e.target.value })
                }
                required
                minLength="3"
                className="form-control-lg shadow-none border"
                disabled={isLoading}
              />
              <Form.Control.Feedback type="invalid">
                Please enter a valid market name (minimum 3 characters).
              </Form.Control.Feedback>
              <Form.Text className="text-muted">
                Choose a unique name for your market.
              </Form.Text>
            </Form.Group>

            <div className="d-grid gap-2">
              <Button
                type="submit"
                variant="btn-primary w-100 text-white"
                label={isLoading ? "Registering..." : "Register Market"}
                disabled={isLoading}
              />
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}

export default RegisterMarket;