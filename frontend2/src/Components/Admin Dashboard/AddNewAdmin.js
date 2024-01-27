import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const AddNewAdmin = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:5000/api/Admin/addAdmin', {
                name,
                email,
                password,
            });

            // Show success toast
            toast.success('Admin added successfully!', { autoClose: 3000 });

            console.log(response.data); // Handle the response as needed
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Form onSubmit={handleSubmit}>
            <h1>Admin Details</h1>
            <Form.Group controlId="name">
                <Form.Label>Name:</Form.Label>
                <Form.Control
                    type="text"
                    size="sm"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    style={{ width: '400px' }}
                />
            </Form.Group>

            <Form.Group controlId="email">
                <Form.Label>Email:</Form.Label>
                <Form.Control
                    type="email"
                    size="sm"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{ width: '400px' }}
                />
            </Form.Group>

            <Form.Group controlId="password">
                <Form.Label>Password:</Form.Label>
                <Form.Control
                    type="password"
                    size="sm"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{ width: '400px' }}
                />
            </Form.Group>

            <Button variant="primary" type="submit" style={{ margin: '10px 0' }}>
                Create Admin
            </Button>
        </Form>
    );
};

export default AddNewAdmin;
