import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddNewMCQ = () => {
    const [question, setQuestion] = useState('');
    const [options, setOptions] = useState(['', '', '', '']);
    const [correctAnswer, setCorrectAnswer] = useState('');
    const [subject, setSubject] = useState('');

    const handleOptionChange = (index, value) => {
        const updatedOptions = [...options];
        updatedOptions[index] = value;
        setOptions(updatedOptions);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:5000/api/Admin/addMCQs', {
                question,
                options,
                correctAnswer: parseInt(correctAnswer),
                subject,
            });
            console.log(response.data); // Handle the response as needed

            toast.success('MCQ added successfully'); // Display success toast

            // Clear the fields
            setQuestion('');
            setOptions(['', '', '', '']);
            setCorrectAnswer('');
            setSubject('');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="question">
                    <h1>MCQ Details</h1>
                    <Form.Label>Question:</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        required
                        style={{ width: '400px' }}
                    />
                </Form.Group>

                <Form.Group controlId="options">
                    <Form.Label>Options:</Form.Label>
                    {options.map((option, index) => (
                        <Form.Control
                            key={index}
                            type="text"
                            value={option}
                            onChange={(e) => handleOptionChange(index, e.target.value)}
                            required
                            style={{ width: '400px' }}
                        />
                    ))}
                </Form.Group>

                <Form.Group controlId="correctAnswer">
                    <Form.Label>Correct Answer:</Form.Label>
                    <Form.Control
                        type="number"
                        value={correctAnswer}
                        onChange={(e) => setCorrectAnswer(e.target.value)}
                        required
                        style={{ width: '400px' }}
                    />
                </Form.Group>

                <Form.Group controlId="subject">
                    <Form.Label>Subject:</Form.Label>
                    <Form.Control
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        required
                        style={{ width: '400px' }}
                    />
                </Form.Group>

                <Button variant="primary" type="submit" style={{ marginTop: '10px' }}>
                    Create MCQ
                </Button>
            </Form>

            <ToastContainer /> {/* Initialize the ToastContainer */}
        </>
    );
};

export default AddNewMCQ;
