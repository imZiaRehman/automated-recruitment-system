import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'
import axios from 'axios';
import { Form, Button, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BsEye, BsEyeSlash } from 'react-icons/bs';


function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false); // Add a loading state
    const [dob, setDOB] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isSignup, setIsSignup] = useState(false);
    const navigate = useNavigate();
    const [showInvalidEmailAlert, setShowInvalidEmailAlert] = useState(false);

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };


    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        setShowInvalidEmailAlert(false); // Reset the alert when the user starts typing again
    };


    const handleSubmit = async (event) => {
        event.preventDefault();
        let response; // Declare response variable

        try {
            if (!email.includes('@')) {
                setShowInvalidEmailAlert(true);
                setErrorMessage('Invalid username or password');
                toast.error('Invlaid Email Entered', { position: toast.POSITION.TOP_RIGHT });
                return;
            } else {
                setLoading(true);

                if (isSignup) {
                    // Handle signup logic
                    try {
                        response = await axios.post('http://localhost:5000/api/Candidate/signup', {
                            email,
                            password,
                            name,
                            dob,
                        });
                        console.log(response.data);
                        toast.success('Account created! SignIn now using email and password.', {
                            position: toast.POSITION.TOP_RIGHT,
                        });
                    } catch (error) {
                        console.log(error.response.data.message);
                        toast.error(error.response.data.message, {
                            position: toast.POSITION.TOP_RIGHT,
                        });
                    }

                } else {
                    // Handle signin logic
                    try {
                        response = await axios.post('http://localhost:5000/api/Candidate/SignIn', {
                            email,
                            password,
                        });
                        console.log(response.data);
                        localStorage.setItem('token', response.data.token);
                        navigate('/home');
                    } catch (error) {
                        // Invalid username or password error
                        setErrorMessage('Invalid email or password');
                        toast.error(error.response.data.message, {
                            position: toast.POSITION.TOP_RIGHT,
                        });
                    }
                }
            }

            if (!response) {
                throw new Error('Server error');
            }
        } catch (error) {
            if (error.response) {
                // Server error
                setErrorMessage('Server error');
                toast.error('Server error', {
                    position: toast.POSITION.TOP_RIGHT,
                });
            }
            console.error(error);
        } finally {
            setLoading(false);
          }
      
    };


    return (
        <div className="login-container">
            <div className="form-container">
                <h2 className="login-heading">{isSignup ? 'Sign Up' : 'Sign In'}</h2>
                <Form onSubmit={handleSubmit}>
                    {isSignup && (
                        <Form.Group controlId="name">
                            <Form.Label>Name:</Form.Label>
                            <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                        </Form.Group>
                    )}
                    <Form.Group controlId="email">
                        <Form.Label>Email:</Form.Label>
                        <Form.Control type="text" value={email} onChange={handleEmailChange} required />
                    </Form.Group>
                    <Form.Group controlId="password">
                        <Form.Label>Password:</Form.Label>
                        <div className="password-input-container">
                            <Form.Control
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={handlePasswordChange}
                                required
                            />
                            <div className="password-toggle" onClick={toggleShowPassword}>
                                {showPassword ? <BsEyeSlash /> : <BsEye />}
                            </div>
                        </div>
                    </Form.Group>

                    {isSignup && (
                        <Form.Group controlId="dob">
                            <Form.Label>Date of Birth:</Form.Label>
                            <Form.Control type="date" value={dob} onChange={(e) => setDOB(e.target.value)} required />
                        </Form.Group>
                    )}
                    {/* {errorMessage && <Alert variant="danger">{errorMessage}</Alert>} */}
                    <Button variant="primary" type="submit" className="submit-button">
                        {loading ? (
                            <Spinner animation="border" role="status" size="sm">
                                <span className="visually-hidden">Loading...</span>
                            </Spinner>
                        ) : (
                            isSignup ? 'Sign Up' : 'Sign In'
                        )}                    </Button>
                </Form>
                <div className="switch-container">
                    {isSignup ? (
                        <>
                        </>
                    ) : (
                        <>
                            <Button variant="link" onClick={() => navigate('/forget-password')}>
                                Forget Password?
                            </Button>
                        </>
                    )}
                </div>
                <div className="switch-container">
                    {isSignup ? (
                        <>
                            <p>Already have an account? </p>
                            <Button variant="link" onClick={() => setIsSignup(false)}>
                                Sign In
                            </Button>
                        </>
                    ) : (
                        <>
                            <p>Don't have an account? </p>
                            <Button variant="link" onClick={() => setIsSignup(true)}>
                                Sign Up
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Login;
