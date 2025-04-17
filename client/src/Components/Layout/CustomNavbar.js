import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { RiLogoutBoxRLine } from 'react-icons/ri';
import { Navbar, Nav, Container } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { useUserContext } from '../Context/MyContext';
import Button from '../Events/Button';

const BASE_URL = process.env.REACT_APP_BASE_URL;

// Define navigation links with roles that can access them
const navLinks = [
  {
    to: '/homedata',
    label: 'RMA',
    roles: ['user'],
  },
{
  to: '/uploads',
  label: 'Uploads',
  roles: ['manager'],

},
 
  {
    to: '/homedata1',
    label: 'XBM',
    roles: ['user'],
  },
  {
    to: '/homedata2',
    label: 'Trade-IN',
    roles: ['user'],
  },
  {
    to: '/tracking',
    label: 'Tracking',
    roles: ['user','admin','manager'],
  },
  {
    to: '/register',
    label: 'Register',
    roles: ['admin'],
  },
  {
    to: '/registerstore',
    label: 'Register Store',
    roles: ['admin'],
  },
  {
    to: '/resetpassword',
    label: 'Reset Password',
    roles: ['admin'],
  },
];

const CustomNavbar = ({ logoSrc = '/logo.webp', brandName = 'Techno Communications LLC' }) => {
  const { userData, setUserData, setIsAuthenticated } = useUserContext();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  const handleLogout = async () => {
    try {
      // Call backend logout endpoint
      await fetch(`${BASE_URL}/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      // Clear specific auth-related localStorage keys (if any)
      localStorage.removeItem('authToken'); // Adjust based on your app's keys
      // Reset context
      setUserData(null);
      setIsAuthenticated(false);
      navigate('/', { replace: true });
    }
  };

  const handleNavToggle = () => {
    setExpanded(!expanded);
  };

  const handleNavLinkClick = () => {
    setExpanded(false); // Close navbar on link click
  };

  // Determine home route based on role
  const homeRoute =
    userData?.role === 'user'
      ? '/userDashboard'
      : '/adminDashboard';

  return (
    <Navbar
      expand="lg"
      bg="light"
      variant="light"
      className="shadow-sm"
      expanded={expanded}
      onToggle={handleNavToggle}
    >
      <Container fluid>
        {/* Logo and Brand Name */}
        <Navbar.Brand as={Link} to={homeRoute} className="d-flex align-items-center">
          <img src={logoSrc} height={40} alt="Logo" className="me-2" />
          <h3 className="fs-6 mb-0 text-truncate">{brandName}</h3>
        </Navbar.Brand>

        {/* Toggle for mobile view */}
        <Navbar.Toggle aria-controls="navbarNav" />

        {/* Collapsible menu */}
        <Navbar.Collapse id="navbarNav" className="fs-6">
          <Nav className="ms-auto d-flex align-items-start">
            {/* Render links based on user role */}
            {navLinks.map(
              (link) =>
                userData?.role &&
                link.roles.includes(userData.role) && (
                  <Nav.Link
                    key={link.to}
                    as={Link}
                    to={link.to}
                    className="fw-bold mx-1 text-muted"
                    onClick={handleNavLinkClick}
                  >
                    {link.label}
                  </Nav.Link>
                )
            )}

            {/* Logout Button */}
            {userData && (
              <Button
                variant="btn-danger btn-sm"

                
                onClick={handleLogout}
                label="Logout"
              />
                 
              
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

CustomNavbar.propTypes = {
  logoSrc: PropTypes.string,
  brandName: PropTypes.string,
};

export default CustomNavbar;