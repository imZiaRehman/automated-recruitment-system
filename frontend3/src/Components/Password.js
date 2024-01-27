import React, { useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import './ResetPassword.css';
import axios from 'axios';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    // Validate password and confirm password
    if (password === '' || confirmPassword === '') {
      setError('Please enter both password and confirm password.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      // Send the request to change the password
      const email = localStorage.getItem('email');
      const response = await axios.post('http://localhost:5000/api/Candidate/reset-password', {
        email,
        password
      });

      if (response.status === 200) {
        // Password changed successfully
        setSuccessMessage('Password changed successfully. You can now log in with your new password.');
        window.location.href = '/';
      }
    } catch (error) {
      setError('Failed to change password. Please try again.');
    }
  };

  return (
    <Container className="reset-password-container d-flex align-items-center justify-content-center">
      <div className="reset-password-box">
        <h2>Reset Password</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        {successMessage && <Alert variant="success">{successMessage}</Alert>}
        <Form onSubmit={handlePasswordSubmit}>
          <Form.Group controlId="password">
            <Form.Label>New Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter your new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="confirmPassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirm your new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </Form.Group>
          <Button variant="primary" type="submit" className="submit-button">
            Change Password
          </Button>
        </Form>
      </div>
    </Container>
  );
};

export default ResetPassword;
