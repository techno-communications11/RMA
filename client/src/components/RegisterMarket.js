import React, { useState } from 'react';
import { Container, Form, Button, Alert, Card } from 'react-bootstrap';
import { FaStore, FaSpinner, FaShoppingCart } from 'react-icons/fa';

function RegisterMarket() {
  const [marketData, setMarketData] = useState({ marketname: '' });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
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

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/register-market`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ market: marketData.marketname }),
      });

      const data = await response.json();

      if (response.status===201) {
        setSuccess('Market registered successfully');
        setMarketData({ marketname: '' });
        setValidated(false);
      } else {
        setError(data.message || 'Market registration failed');
      }
    } catch (err) {
      setError('Market registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className=" constiner-fluid">
       <div className='container-fluid'>
            <div
        className="dashboard-header1 mb-1"
        style={{
          backgroundImage: "url(/market.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          // opacity: "0.9",
        }}
      >
        <h4 className="text-white mb-1 fs-1 text-center animate__animated animate__fadeIn">
          Register Market
        </h4>
      </div>
      </div>
      <Card className="shadow-lg border-0  mx-auto" style={{ maxWidth: '30rem',marginTop: '70px' }}>
        <Card.Body className="p-4 p-md-5">
          <div className="text-center mb-4">
            <div className="bg-primary bg-opacity-10 rounded-circle p-3 d-inline-flex mb-3">
              <FaShoppingCart className="text-primary" size={30} />
            </div>
            <h1 className="h2 fw-bold mb-3">Register Market</h1>
            <p className="text-muted">Create your market profile to get started</p>
          </div>

          {success && (
            <Alert 
              variant="success" 
              className="mb-4 d-flex align-items-center justify-content-center"
            >
              <FaStore className="me-2" />
              {success}
            </Alert>
          )}

          {error && (
            <Alert 
              variant="danger" 
              className="mb-4 d-flex align-items-center justify-content-center"
            >
              <i className="bi bi-exclamation-circle me-2"></i>
              {error}
            </Alert>
          )}

          <Form 
            noValidate 
            validated={validated} 
            onSubmit={handleMarketRegistration}
            className="max-w-md mx-auto"
          >
            <Form.Group className="mb-4" controlId="marketname">
              <Form.Label className="fw-medium">Market Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter market name"
                value={marketData.marketname}
                onChange={(e) => setMarketData({ ...marketData, marketname: e.target.value })}
                required
                minLength="3"
                className="form-control-lg"
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
                variant="primary" 
                type="submit" 
                size="lg"
                disabled={isLoading}
                className="position-relative"
              >
                {isLoading ? (
                  <>
                    <FaSpinner className="spinner-border spinner-border-sm me-2" />
                    Registering...
                  </>
                ) : (
                  'Register Market'
                )}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}

export default RegisterMarket;