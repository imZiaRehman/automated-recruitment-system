import React, { useState } from 'react';
import { Container, Form, Button, Toast } from 'react-bootstrap';
import { BsEye, BsEyeSlash } from 'react-icons/bs';
import axios from 'axios';

const ChangePasswordPage = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);
    const [showPassword3, setShowPassword3] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [isError, setIsError] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if new password and confirm password match
        if (newPassword !== confirmPassword) {
            setIsError(true);
            setToastMessage("New password and confirm password don't match.");
            setShowToast(true);
            return;
        }

        try {
            const email = localStorage.getItem('email');
            const response = await axios.post('http://localhost:5000/api/Candidate/Changepassword', {
                email,
                currentPassword,
                newPassword,
            });
            if (response.status === 200) {
                setToastMessage('Password updated successfully.');
                setShowToast(true);
                setIsError(false);
            } else {
                setIsError(true);
                setToastMessage('Error updating password.');
                setShowToast(true);
            }
        } catch (error) {
            setIsError(true);
            setToastMessage('Error updating password.');
            setShowToast(true);
        }

        // Reset error state and hide toast after 3 seconds
        setTimeout(() => {
            setIsError(false);
            setShowToast(false);
        }, 3000);
    };

    const toggleShowPassword = () => {
        setShowPassword((prevState) => !prevState);
    };

    const toggleShowPassword2 = () => {
        setShowPassword2((prevState) => !prevState);
    };

    const toggleShowPassword3 = () => {
        setShowPassword3((prevState) => !prevState);
    };

    return (
        <Container className="d-flex align-items-center justify-content-center vh-100">
            <Form className="w-50" onSubmit={handleSubmit}>
                <h2 className="text-center mb-4">Change Password</h2>

                <Form.Group controlId="currentPassword">
                    <Form.Label>Current Password:</Form.Label>
                    <div className="password-input-container">
                        <Form.Control
                            type={showPassword ? 'text' : 'password'}
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            required
                        />
                        <div className="password-toggle" onClick={toggleShowPassword}>
                            {showPassword ? <BsEyeSlash /> : <BsEye />}
                        </div>
                    </div>
                </Form.Group>

                <Form.Group controlId="newPassword">
                    <Form.Label>New Password:</Form.Label>
                    <div className="password-input-container">
                        <Form.Control
                            type={showPassword2 ? 'text' : 'password'}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                        <div className="password-toggle" onClick={toggleShowPassword2}>
                            {showPassword2 ? <BsEyeSlash /> : <BsEye />}
                        </div>
                    </div>
                </Form.Group>

                <Form.Group controlId="confirmPassword">
                    <Form.Label>Confirm Password:</Form.Label>
                    <div className="password-input-container">
                        <Form.Control
                            type={showPassword3 ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                        <div className="password-toggle" onClick={toggleShowPassword3}>
                            {showPassword3 ? <BsEyeSlash /> : <BsEye />}
                        </div>
                    </div>
                </Form.Group>

                <div className='SubmitButton'>
                    <Button variant="primary" type="submit" className="w-100">
                        {isError ? 'Error' : 'Submit'}
                        {isError && <div className="spinner-border spinner-border-sm ml-2" role="status"></div>}
                    </Button>
                </div>
            </Form>
            <Toast
                show={showToast}
                onClose={() => {
                    setShowToast(false);
                    setIsError(false);
                }}
                className={isError ? 'bg-danger' : 'bg-success'}
                delay={3000}
                autohide
                style={{
                    position: 'absolute',
                }}
            >
                <Toast.Body>{toastMessage}</Toast.Body>
            </Toast>
        </Container>
    );
};

export default ChangePasswordPage;
