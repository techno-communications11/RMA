import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Button, Form, Row, Col, Alert } from "react-bootstrap";
import { FaCalendarAlt, FaFilter } from "react-icons/fa";

const DateFilter = ({ onFilter }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [error, setError] = useState("");

  const handleFilter = () => {
    // Validation: Ensure both dates are selected
    if (!startDate || !endDate) {
      setError("Please select both start and end dates.");
      return;
    }
    setError(""); // Clear error message if dates are valid
    if (onFilter) {
      onFilter({ startDate, endDate });
    }
  };

  return (
    <div className="rounded-3">
      <Form className="date-filter">
        <Row className="g-1">
          {/* Start Date Picker */}
          <Col md={5}>
            <Form.Group controlId="startDate">
              <Form.Label className="text-pink-600 fw-semibold">
                <FaCalendarAlt className="me-2" />
                Start Date
              </Form.Label>
              <div className="date-picker-wrapper">
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  className="form-control"
                  placeholderText="Select start date"
                  dateFormat="MMMM d, yyyy"
                  popperProps={{
                    modifiers: [
                      { name: "offset", options: { offset: [0, -10] } },
                      { name: "flip", options: { enabled: false } },
                    ],
                  }}
                />
              </div>
            </Form.Group>
          </Col>

          {/* End Date Picker */}
          <Col md={5}>
            <Form.Group controlId="endDate">
              <Form.Label className="text-pink-600 fw-semibold">
                <FaCalendarAlt className="me-2" />
                End Date
              </Form.Label>
              <div className="date-picker-wrapper">
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  minDate={startDate} // Prevent selecting a date before the start date
                  className="form-control"
                  placeholderText="Select end date"
                  dateFormat="MMMM d, yyyy"
                  popperProps={{
                    modifiers: [
                      { name: "offset", options: { offset: [0, -10] } },
                      { name: "flip", options: { enabled: false } },
                    ],
                  }}
                />
              </div>
            </Form.Group>
          </Col>

          {/* Filter Button */}
          <Col md={2} className="d-flex align-items-end">
            <div className="d-flex gap-1 w-100">
              <Button
                variant="primary"
                onClick={handleFilter}
                className="btn-pink flex-grow-1 hover-lift"
              >
                <FaFilter className="me-2" /> Filter
              </Button>
            </div>
          </Col>
        </Row>
      </Form>

      {/* Error Message */}
      {error && (
        <Alert variant="danger" className="mt-3">
          {error}
        </Alert>
      )}

      {/* Styles */}
      <style jsx>{`
        .form-control {
          height: 45px;
          border-radius: 8px;
          border: 2px solid #f472b6;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .form-control:focus {
          border-color: #db2777;
          box-shadow: 0 0 0 0.2rem rgba(219, 39, 119, 0.25);
        }

        .text-pink-600 {
          color: #db2777;
        }

        .btn-pink {
          background-color: #ec4899;
          border: none;
          height: 45px;
          border-radius: 8px;
        }

        .btn-pink:hover {
          background-color: #db2777;
        }

        .hover-lift {
          transition: transform 0.2s;
        }

        .hover-lift:hover {
          transform: translateY(-2px);
        }

        .react-datepicker-wrapper {
          width: 100%;
        }

        .react-datepicker__input-container input {
          padding-right: 35px;
        }
      `}</style>
    </div>
  );
};

export default DateFilter;
