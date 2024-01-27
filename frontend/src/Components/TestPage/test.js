import React, { useState, useEffect } from 'react';
import { Container, Button } from 'react-bootstrap';
import axios from 'axios';
import Header from './header';
import { useNavigate } from 'react-router-dom';
import QuestionComponent from './QuestionComponent';
import './test.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';


const TestPage = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [userResponses, setUserResponses] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isTokenVerified, setIsTokenVerified] = useState(false);
  const [isWindowActive, setIsWindowActive] = useState(true);
  const [showWarning, setShowWarning] = useState(false);



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

  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'visible') {
        setIsWindowActive(true);
        const testId = localStorage.getItem('test_id');
        const candidateId = localStorage.getItem('candidate_id');
        try {
          const response = await axios.post('http://localhost:5000/api/incrementCount', {
            test_id: testId,
            candidate_id: candidateId,
          });
          console.log(response.data);
        } catch (error) {
          console.error(error);
        }
      } else {
        setIsWindowActive(false);
        setShowWarning(true); // Show the warning message
        setTimeout(() => {
          setShowWarning(false); // Hide the warning message after 3 seconds
        }, 3000);
      }
    };



    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);


  useEffect(() => {
    const testId = localStorage.getItem('test_id');
    const storedQuestions = localStorage.getItem('questions');
    const storedResponses = localStorage.getItem('responses');

    if (storedQuestions) {
      // If questions are available in local storage, retrieve them
      setQuestions(JSON.parse(storedQuestions));
    } else {
      // Fetch questions from the backend
      const fetchQuestions = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/api/getQuestions/${testId}`);
          const fetchedQuestions = response.data.questions;
          setQuestions(fetchedQuestions);
          localStorage.setItem('questions', JSON.stringify(fetchedQuestions));
        } catch (error) {
          console.error(error);
        }
      };

      fetchQuestions();
    }

    if (storedResponses) {
      // If user responses are available in local storage, retrieve them
      setUserResponses(JSON.parse(storedResponses));
    }
  }, []);

  const handleResponse = (questionIndex, optionIndex) => {
    const updatedResponses = {
      ...userResponses,
      [questionIndex]: optionIndex,
    };
    setUserResponses(updatedResponses);
    localStorage.setItem('responses', JSON.stringify(updatedResponses));
  };
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
      navigate('/finish');
    } catch (error) {
      console.error(error);
      // Handle the error
    }
  }

  const handleSubmit = () => {
    setIsLoading(true);
    const testId = localStorage.getItem('test_id');
    const candidateId = localStorage.getItem('candidate_id');
    submitTest(testId, candidateId);
  };


  return (
    <Container>
      {isTokenVerified ? (
        <>

          <Header />
          {showWarning && (
            <div className="floating-message">
              Warning: You have switched to another tab or window.
            </div>
          )}

          <div className="content">
            {questions.map((question, index) => (
              <QuestionComponent
                key={index}
                question={question}
                questionIndex={index}
                userResponse={userResponses[index]}
                handleResponse={handleResponse}
              />
            ))}
            <div className="submit-button-container">
              <Button
                variant="primary"
                className={`submit-button ${isLoading ? 'loading' : ''}`}
                onClick={handleSubmit}
                disabled={isLoading} // Disable the button while the request is in progress
              >
                {isLoading ? (
                  <FontAwesomeIcon icon={faSpinner} spin />
                ) : (
                  'Submit Test'
                )}
              </Button>

            </div>

          </div>
        </>
      ) : (
        <p>Verifying request...</p>
      )
      }
    </Container>
  );
};


export default TestPage;
