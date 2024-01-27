import React from 'react';
import './test.css'

function SideNavbar({ questions, selectedQuestion, onQuestionClick }) {
  return (
    <div className="side-navbar">
      {questions.map((question, index) => (
        <div
          key={index}
          className={`question-box ${selectedQuestion === index ? 'selected' : ''}`}
          onClick={() => onQuestionClick(index)}
        >
          {index + 1}
        </div>
      ))}
    </div>
  );
}

export default SideNavbar;
