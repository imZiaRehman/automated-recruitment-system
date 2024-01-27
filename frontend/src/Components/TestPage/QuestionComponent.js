import React, { useState } from "react";
import { Card, Form, Button } from "react-bootstrap";
import "./QuestionComponent.css"; // Import the external CSS file for custom styling
import axios from 'axios';

const QuestionComponent = ({ question, questionIndex, handleResponse, userResponse }) => {
  const [selectedOption, setSelectedOption] = useState(userResponse);
  const [isSubmitted, setIsSubmitted] = useState(userResponse !== undefined);

  const handleOptionChange = (optionIndex) => {
    setSelectedOption(optionIndex);
  };

  const handleSubmit = () => {
    handleResponse(questionIndex, selectedOption);
    setIsSubmitted(true);
  
    const testId = localStorage.getItem('test_id');
    const candidateId = localStorage.getItem('candidate_id');
    const questionTitle = question.question;
    const answer = selectedOption;
  
    // Create the payload object
    const payload = {
      test_id: testId,
      candidate_id: candidateId,
      question_title: questionTitle,
      answer: answer,
    };
  
    // Send the answer to the backend
    axios.post('http://localhost:5000/api/submitQuestion', payload)
      .then(response => {
        // Handle the response from the backend if needed
        console.log(response.data);
      })
      .catch(error => {
        // Handle any errors that occurred during the request
        console.error(error);
      });
  };

  const handleCopy = (event) => {
    event.preventDefault();
  };
  
  return (
    <Card className="question-card">
      <Card.Body>
        <Card.Title className="question-title" onCopy={handleCopy}>{question.question}</Card.Title>
        <Form>
          {question.options.map((option, optionIndex) => (
            <Form.Check
              key={optionIndex}
              type="radio"
              id={`option-${optionIndex}`}
              label={option}
              className="question-option"
              name={`question-${questionIndex}`}
              value={optionIndex}
              onChange={() => handleOptionChange(optionIndex)}
              disabled={isSubmitted}
              checked={selectedOption === optionIndex}
            />
          ))}
        </Form>
        <Button
          variant="primary"
          className="submit-button"
          onClick={handleSubmit}
          disabled={isSubmitted}
        >
          Submit
        </Button>
      </Card.Body>
    </Card>
  );
};

export default QuestionComponent;
