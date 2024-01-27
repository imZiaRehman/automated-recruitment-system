import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Logo from './litmus.png';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();
  const [remainingTime, setRemainingTime] = useState(() => {
    const storedTime = localStorage.getItem('remainingTime');
    
    return storedTime ? parseInt(storedTime, 10) : 20 * 60; // Set the initial remaining time to 30 minutes in seconds if no stored time is found
  });
  async function submitTest(testId, candidateId) {
    try {
      const response = await axios.post('http://localhost:5000/api/submitTest', {
        test_id: testId,
        candidate_id: candidateId,
      });
      // Handle the response and navigate to the home page
      console.log(response.data);
      //  code to navigate to the home page here
      localStorage.clear();
      navigate('/');
    } catch (error) {
      console.error(error);
      // Handle the error
    }
  }
  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingTime((prevTime) => {
        if (prevTime > 0) {
          const updatedTime = prevTime - 1;
          localStorage.setItem('remainingTime', updatedTime.toString());
          return updatedTime;
        } 
        if (prevTime === 0){
          const testId = localStorage.getItem('test_id');
          const candidateId = localStorage.getItem('candidate_id');
          submitTest(testId, candidateId)
        }
        return prevTime;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = seconds.toString().padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
  };

  return (
    <div className="header fixed-top">
      <Container>
        <Row>
          <Col xs={6} className="d-flex align-items-center">
            <img src={Logo} alt="Logo" className="logo" />
          </Col>
          <Col xs={6} className="d-flex align-items-center justify-content-end">
            <div className="time-left">
              Time left: {formatTime(remainingTime)}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Header;
