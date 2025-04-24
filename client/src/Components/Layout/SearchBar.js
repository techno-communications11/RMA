// src/components/SearchBar.jsx
import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { CiSearch } from 'react-icons/ci';
import Input from '../Events/Input';

const SearchBar = ({ search, handleSearch }) => {
  return (
    <Row className="justify-content-center">
      <Col md={6} sm={8} className="mb-2 mt-2">
        <div className="d-flex justify-content-center border border-2 rounded-pill px-2">
          <Input
            varient="form-control shadow-none border-0 bg-transparent"
            placeholder="Search using old Imei..."
            value={search}
            onChange={handleSearch}
          />
          <CiSearch
            style={{
              marginTop: '0.6rem',
              color: 'orange',
              fontWeight: 'bolder',
              fontSize: '1.6rem',
            }}
          />
        </div>
      </Col>
    </Row>
  );
};

export default SearchBar;