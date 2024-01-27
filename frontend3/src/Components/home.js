import React, { useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { RiFileSearchLine, RiUserSearchLine, RiComputerLine, RiCheckboxCircleLine } from 'react-icons/ri';
import axios from 'axios';
import { toast } from 'react-toastify';
import Sidebar from './Sidebar/Sidebar';
import './home.css';

const HomePage = () => {
  const handleLogout = () => {
    // Handle logout logic
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('username');
    window.location.href = '/';
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      getUserData(token);
    } else {
      // Redirect to login page if token is not present
      // Replace '/login' with the appropriate login page URL
      toast.error('Session expired, Login again!', {
        position: toast.POSITION.TOP_RIGHT,
      });
      window.location.href = '/';
    }
  }, []);

  const getUserData = async (token) => {
    try {
      const response = await axios.get('http://localhost:5000/api/Candidate/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const { username, email } = response.data;
      // Store email and username in local storage for future use
      localStorage.setItem('email', email);
      localStorage.setItem('username', username);
    } catch (error) {
      console.error(error);
      // Handle error retrieving user data
      // Redirect to login page or display an error message
      toast.error('Session expired, Login again!', {
        position: toast.POSITION.TOP_RIGHT,
      });
      window.location.href = '/';
    }
  };

  const userName = localStorage.getItem('username');

  return (
    <>
      <Sidebar />
      <div className="homepage-container">
        <Container>
          {/* <h1 className="text-center mt-5">Welcome</h1> */}
          <div className="process-container my-5">
            <h2 className="text-center mb-4">How Our System Works</h2>
            <Row>
              <Col md={6} className="mb-4">
                <div className="step">
                  <div className="step-icon">
                    <RiFileSearchLine size={48} />
                  </div>
                  <h3>Apply to Job</h3>
                </div>
                <div className="step-content">

                  <p>
                    Search for relevant job openings and submit your application for the desired positions. Use our user-friendly search bar to find jobs based on keywords, location, or other criteria.
                  </p>
                </div>

              </Col>
              <Col md={6} className="mb-4">
                <div className="step">
                  <div className="step-icon">
                    <RiUserSearchLine size={48} />
                  </div>
                  <h3>Get Shortlisted</h3>
                </div>
                <div className="step-content">
                  <p>
                    If your application meets the initial criteria, you will be shortlisted for further consideration. You will receive a notification or email with a link to proceed to the next step.
                  </p>
                </div>
              </Col>

              <Col md={6} className="mb-4">
                <div className="step">
                  <div className="step-icon">
                    <RiComputerLine size={48} />
                  </div>
                  <h3>Perform Test</h3>
                </div>
                <div className="step-content">
                  <p>
                    Follow the provided link to access the test or assessment related to the job position. Complete the test to showcase your skills and suitability for the role. Make sure to read the instructions carefully and submit your responses within the specified timeframe.
                  </p>
                </div>

              </Col>
              <Col md={6} className="mb-4">
                <div className="step">
                  <div className="step-icon">
                    <RiCheckboxCircleLine size={48} />
                  </div>
                  <h3>Check Final Status</h3>
                </div>
                <div className="step-content">

                  <p>
                    After the evaluation process, you can check the final status of your application. If you are selected, you will receive a notification with further instructions regarding the hiring process. If not selected, you can continue exploring other job opportunities on our portal.
                  </p>
                </div>

              </Col>
            </Row>
          </div>
        </Container>
      </div>
    </>
  );
};

export default HomePage;
