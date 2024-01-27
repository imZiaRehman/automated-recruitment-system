import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./Instructions.css"; // Import the external CSS file for custom styling


export default function Instructions() {
  const navigate = useNavigate();
  const [isChecked, setIsChecked] = useState(false);
  const [isTokenVerified, setIsTokenVerified] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      verifyToken(storedToken);
    } else {
      navigate("/");
    }
  }, []);

  const verifyToken = async (token) => {
    try {
      const response = await axios.post('http://localhost:5000/api/verifyToken', {
        token: token,
      });
      // Handle the response and set isTokenVerified state
      setIsTokenVerified(true);
    } catch (error) {
      console.error(error);
      navigate("/");
      // Handle the error
    }
  };

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const handleStartButtonClick = () => {
    if (isChecked && isTokenVerified) {
      navigate('/test');
    } else {
      alert('Please read and agree to the instructions first, and make sure your token is verified.');
    }
  };
  
  return (
    <div className="centered-container">
      {isTokenVerified ? (
        <>
          <h1>Instructions</h1>
          <div className="instructions-container">
            <p>Here are the instructions for the test:</p>
            <ul>
              <li>Read each question carefully before answering.</li>
              <li>You can only Submit one question once.</li>
              <li>Answer as many questions as you can within the time limit.</li>
              <li>Do not switch tab and window of Broswer you are actively monitered.</li>
              <li>You have 20 Multiple Choice Questions to attempt.</li>
              <li>You have 20 minute to do this test.</li>
              <li>In case of Internet disconnectivity do not get panic, You progress is saved.</li>
            </ul>
          </div>
          <div className="checkbox-container">
            <input type="checkbox" checked={isChecked} onChange={handleCheckboxChange} />
            <label htmlFor="checkbox">I have read and agree to the instructions.</label>
          </div>
          <div className="start-button-container">
            <button onClick={handleStartButtonClick}>Start Test</button>
          </div>
        </>
      ) : (
        <p>Verifying request...</p>
      )}
    </div>
  );
}
