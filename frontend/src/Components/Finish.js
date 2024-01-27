import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './FinishPage.css'; // Import the external CSS file for custom styling

const FinishPage = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <Container>
      <div className="finish-container">
        <div className="finish-box">
          <h2>Test Submitted!</h2>
          <p>Your test has been submitted. Please stay active and await further instructions via email.</p>
          <Button variant="primary" onClick={handleGoHome}>Go to Home</Button>
        </div>
      </div>
    </Container>
  );
};

export default FinishPage;
