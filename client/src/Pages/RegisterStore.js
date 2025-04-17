import React, { useState } from "react";
import { Form, Button, Alert, Row, Col } from "react-bootstrap";
import { FaStore, FaSpinner } from "react-icons/fa";



function RegisterStore() {
  const [storeData, setStoreData] = useState({ store: "" });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [validated, setValidated] = useState(false);


  const handleStoreRegistration = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (!form.checkValidity()) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/register-store`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials:'include',
          body: JSON.stringify({ store: storeData.store }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setStoreData(data);
        setSuccess("Store registered successfully!");
        setStoreData({ store: "" });
      } else {
        setError(data.message || "Store registration failed");
      }
    } catch (err) {
      setError("Store registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container-fluid">
      <div
        className="dashboard-header1 mb-1"
        style={{
          backgroundImage: "url(/store.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <h4 className="text-white  fs-1 text-center animate__animated animate__fadeIn">
          Register Store
        </h4>
      </div>

      <div className=" mx-auto mt-1" style={{ maxWidth: "100%" }}>
        <div
          style={{
            height: "32rem",
            background:
              "linear-gradient(135deg,rgb(229, 237, 248) 0%,rgba(213, 245, 246, 0.32) 50%,rgba(248, 223, 241, 0.83) 100%)",
          }}
          className="p-5 text-center"
        >
          <Row className="justify-content-center  ">
            <Col md={6} lg={4}>
              <div className="bg-white p-4 rounded shadow-lg p-4">
                <div className="text-center mb-4">
                  <div className="bg-primary bg-opacity-10 rounded-circle p-3 d-inline-flex mb-3">
                    <FaStore className="text-primary" size={24} />
                  </div>
                  <h2 className="fw-bold">Register Store</h2>
                </div>
                <Form
                  noValidate
                  validated={validated}
                  onSubmit={handleStoreRegistration}
                >
                  <Form.Group controlId="store" className="mb-3">
                    <Form.Label>Store Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter store name"
                      value={storeData.store}
                      onChange={(e) => setStoreData({ store: e.target.value })}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Please provide a store name.
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Button
                    variant="primary"
                    type="submit"
                    className="w-100"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <FaSpinner className="spinner-border spinner-border-sm" />
                    ) : (
                      "Register"
                    )}
                  </Button>
                </Form>
                {success && (
                  <Alert variant="success" className="mt-3">
                    {success}
                  </Alert>
                )}
                {error && (
                  <Alert variant="danger" className="mt-3">
                    {error}
                  </Alert>
                )}
              </div>
            </Col>
           
          </Row>
        </div>
      </div>
    </div>
  );
}

export default RegisterStore;
