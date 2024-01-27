import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

const InvalidLinkPage = () => {
  return (
    <Container>
      <Row className="justify-content-center mt-5">
        <Col xs={12} md={8} lg={6}>
          <div className="text-center">
            <h1 className="mb-4">Invalid Link</h1>
            <p>The link you have used is not valid.</p>
            <p>Please check the link or contact the administrator for assistance.</p>
            <Link to="/" className="btn btn-primary mt-4">
              Go to Home Page
            </Link>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default InvalidLinkPage;
