import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { RiLogoutBoxRLine } from "react-icons/ri";
import {jwtDecode} from "jwt-decode";
import { Navbar, Nav, Container, Button } from "react-bootstrap";

const CustomNavbar = () => {
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setRole(decodedToken.role);
      } catch (error) {
        console.error("Invalid token:", error);
      }
    } else {
      navigate("/"); // Redirect to login page if no token
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    
      navigate("/");
     
  };

  const handleNavLinkClick = () => {
    // Close the navbar with smooth animation by toggling the collapse class
    const navbar = document.querySelector(".navbar-collapse");
    if (navbar) {
      navbar.classList.remove("show");
    }
  };

  return (
    <Navbar expand="lg" bg="light" variant="light" className="shadow-sm">
      <Container fluid>
        {/* Logo and Brand Name */}
        <Navbar.Brand
          as={Link}
          to={
            role === "admin" || role === "manager" ? "/adminDashboard" : "/userDashboard"
          }
          className="d-flex align-items-center"
        >
          <img src="logo.webp" height={40} alt="Logo" />
          <h3 className="ms-2 fs-6 mb-0 text-truncate">
            Techno Communications LLC
          </h3>
        </Navbar.Brand>

        {/* Toggle for mobile view */}
        <Navbar.Toggle aria-controls="navbarNav" />

        {/* Collapsible menu */}
        <Navbar.Collapse id="navbarNav" className="fs-6">
          <Nav className="ms-auto d-flex align-items-start">
            {/* Shared Link */}
            {/* {(role === "admin" || role === "manager") && ( */}
              <Nav.Link
                as={Link}
                to="/home"
                className="fw-bold mx-1"
                onClick={handleNavLinkClick}
              >
                RMA Data
              </Nav.Link>
            {/* )} */}

            {/* Admin-only Links */}
            {role === "admin" && (
              <>
                <Nav.Link
                  as={Link}
                  to="/register"
                  className="fw-bold mx-1"
                  onClick={handleNavLinkClick}
                >
                  Register
                </Nav.Link>
                {/* <Nav.Link
                  as={Link}
                  to="/registermarket"
                  className="fw-bold mx-1"
                  onClick={handleNavLinkClick}
                >
                  Register Market
                </Nav.Link> */}
                <Nav.Link
                  as={Link}
                  to="/registerstore"
                  className="fw-bold mx-1"
                  onClick={handleNavLinkClick}
                >
                  Register Store
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/resetpassword"
                  className="fw-bold mx-1"
                  onClick={handleNavLinkClick}
                >
                  Reset Password
                </Nav.Link>
              </>
            )}

            {/* Logout Button */}
            <Button
              variant="danger"
              className="fw-bold mx-1"
              onClick={handleLogout}
            >
              <RiLogoutBoxRLine className="fw-bold" /> Logout
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;
