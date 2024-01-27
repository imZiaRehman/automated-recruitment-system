import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { CheckCircleFill } from 'react-bootstrap-icons';

const ApplicationSubmitted = () => {
  return (
    <Container className="d-flex align-items-center justify-content-center application-submitted">
      <Row>
        <Col className="text-center">
          <CheckCircleFill className="tick-icon" />
          <h2>Application Submitted</h2>
          <p>Your application has been successfully submitted.</p>
          <p>Please check your email and the application status section of the website for further updates.</p>
        </Col>
      </Row>
    </Container>
  );
};

export default ApplicationSubmitted;
