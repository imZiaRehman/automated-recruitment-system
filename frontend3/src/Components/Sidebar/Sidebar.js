import React from 'react';
import { Link } from 'react-router-dom';
import { Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Sidebar.css';

const Sidebar = () => {
  const handleLogout = () => {
    // Handle logout logic
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('username');
    window.location.href = '/';
  };

  return (
    <div className="sidebar">
      <Nav className="flex-column">
        <Nav.Link as={Link} to="/home">Home</Nav.Link>
        <Nav.Link as={Link} to="/applytojob">Apply to Job</Nav.Link>
        <Nav.Link as={Link} to="/applicationstatus">Application Status</Nav.Link>
        <Nav.Link as={Link} to="/change-password">Change Password</Nav.Link>
        <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
      </Nav>
    </div>
  );
};

export default Sidebar;
