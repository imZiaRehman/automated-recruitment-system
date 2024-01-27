import React, { useState, useEffect } from "react";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import { AnimatePresence } from "framer-motion";
import Logo from './TestPage/litmus.png';
const HomePage = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

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
      <Container fluid className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
        <Row className="text-center">
          <Col>
              <>
                <Spinner animation="border" variant="primary" size="xl" />
                <h1>Welcome to the Test Website</h1>
                <p>
                  This is the home page for the Test Website. To take the test, please follow the link that was sent to you in your email.
                </p>
              </>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default HomePage;
