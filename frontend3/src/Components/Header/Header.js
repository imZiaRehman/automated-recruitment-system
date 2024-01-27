import React from 'react';
import { Navbar, Button } from 'react-bootstrap';
import { RiLogoutBoxLine } from 'react-icons/ri';
import './Header.css'

const Header = ({ userName, onLogout }) => {
  return (
    <Navbar className='header' bg="dark" variant="dark" fixed="top">
      <Navbar.Brand>Candidate Portal</Navbar.Brand>
      <Navbar.Toggle aria-controls="navbar-nav" />
      <Navbar.Collapse id="navbar-nav" className="justify-content-end">
        <Navbar.Brand >
          Signed in as: {userName}
        </Navbar.Brand>
        <Button variant="outline-light" onClick={onLogout}>
          <RiLogoutBoxLine size={20} className="mr-2" />
          Logout
        </Button>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;
