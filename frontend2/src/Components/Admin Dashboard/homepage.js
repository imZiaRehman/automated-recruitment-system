import React from 'react';
import { Card, Container } from 'react-bootstrap';

const HomePage = () => {
  return (
    <Container>
      <Card>
        <Card.Body>
          <Card.Title>Welcome, Admin!</Card.Title>
          <Card.Text>
            Thank you for being an admin on our job portal. This is your dashboard
            where you can manage job listings, applicant profiles, and more.
          </Card.Text>
          <Card.Text>
            Please use the navigation menu on the left to access different sections
            of the admin panel.
          </Card.Text>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default HomePage;
