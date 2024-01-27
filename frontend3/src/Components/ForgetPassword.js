import React, { useState } from 'react';
import { Container, Form, Button, Alert, Spinner } from 'react-bootstrap';
import Logo from './litmus.png';
import { Row, Col } from "react-bootstrap";
import './ForgotPassword.css';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [otp, setOTP] = useState('');
  const [step, setStep] = useState(1); // Track the step: 1 for email input, 2 for OTP verification
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Show loading icon

    try {
      // Send the email to the backend to initiate the password reset process
      const response = await axios.post('http://localhost:5000/api/Candidate/ForgotPassword', { email });

      if (response.status === 200) {
        // Email sent successfully, update the step to 2
        setStep(2);
      }
    } catch (error) {
        console.log(error);
      setError(error.response.message);
    }

    setLoading(false); // Hide loading icon
  };

  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Show loading icon

    try {
      // Send the OTP to the backend for verification
      const response = await axios.post('http://localhost:5000/api/Candidate/VerifyOTP', { email, otp });

      if (response.status === 200) {
        // OTP verified successfully, show success message
        setError('');
        localStorage.setItem('email', email);

        setSuccessMessage('OTP verified successfully. Please reset your password.');
        window.location.href = '/reset-password';

      }
    } catch (error) {
      setError('Invalid OTP.');
    }

    setLoading(false); // Hide loading icon
  };

  return (
    <>
      <div className="header fixed-top">
        <Container>
          <Row>
            <Col xs={6} className="d-flex align-items-center">
              <img src={Logo} alt="Logo" className="logo" />
            </Col>
          </Row>
        </Container>
      </div>

      <Container className="forgot-password-container d-flex align-items-center justify-content-center">
        <div className="forgot-password-box">
          <h2>Forgot Password</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          {successMessage && <Alert variant="success">{successMessage}</Alert>}
          {step === 1 ? (
            <Form onSubmit={handleEmailSubmit}>
              <Form.Group controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Group>
              <Button variant="primary" type="submit" className="submit-button" disabled={loading}>
                {loading ? (
                  <>
                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                    <span className="sr-only">Loading...</span>
                  </>
                ) : (
                  'Send OTP'
                )}
              </Button>
            </Form>
          ) : (
            <Form onSubmit={handleOTPSubmit}>
              <Form.Group controlId="otp">
                <Form.Label>OTP</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter the OTP"
                  value={otp}
                  onChange={(e) => setOTP(e.target.value)}
                />
              </Form.Group>
              <Button variant="primary" type="submit" className="submit-button" disabled={loading}>
                {loading ? (
                  <>
                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                    <span className="sr-only">Loading...</span>
                  </>
                ) : (
                  'Verify OTP'
                )}
              </Button>
            </Form>
          )}
        </div>
      </Container>
    </>
  );
};

export default ForgotPassword;
