import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';
import './EditInformationPage.css';

const EditInformationPage = ({ onSubmit }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const { data, jobId } = location.state || {};
  const [info, setInfo] = useState(data || {});
  const [isLoading, setIsLoading] = useState(false);
  const [isEmptyFields, setIsEmptyFields] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInfo((prevInfo) => ({ ...prevInfo, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid()) {
      setIsEmptyFields(true);
      return;
    }
    setIsLoading(true);
    setIsEmptyFields(false);
    try {
      const response = await axios.post(
        `http://localhost:5000/api/Candidate/${jobId}/UpdateInformation`,
        info
      );
      // Handle the response as needed
      console.log(response.data);
      navigate('/success');
    } catch (error) {
      // Handle any errors
      console.error(error);
    }
    setIsLoading(false);
  };

  const isFormValid = () => {
    console.log("Phone Number Currently is:",  info['phone']);
    return (
      info.cgpa !== undefined &&
      info.university !== undefined &&
      info['phone'] !== undefined &&
      info.skills !== undefined
    );
  };

  return (
    <div className="center-container">
      <h3 className="page-heading">Your Information From Resume</h3>
      <div className="instruction">
        <p>Please check if every information is relevant and correct to your knowledge.</p>
        <p>If any information is missing, enter it before submitting.</p>
      </div>
      {isEmptyFields && (
        <Alert variant="danger" className="alert-message">
          Please fill in all the fields before submitting.
        </Alert>
      )}
      <Form className="form-container" onSubmit={handleSubmit}>
        <Form.Group controlId="gpa">
          <Form.Label>GPA</Form.Label>
          <Form.Control
            type="text"
            name="cgpa"
            value={info.cgpa || ''}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group controlId="university">
          <Form.Label>University</Form.Label>
          <Form.Control
            type="text"
            name="university"
            value={info.university || ''}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group controlId="phone">
          <Form.Label>Phone Number</Form.Label>
          <Form.Control
            type="text"
            name="phone"
            value={info['phone'] || ''}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group controlId="skills">
          <Form.Label>Skills</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="skills"
            value={info.skills || ''}
            onChange={handleChange}
          />
        </Form.Group>
        <div className="button-container">
          <Button variant="primary" type="submit" disabled={isLoading}>
            {isLoading ? (
              <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
            ) : (
              'Submit'
            )}
          </Button>
        </div>
      </Form>
     
    </div>
  );
};

export default EditInformationPage;
