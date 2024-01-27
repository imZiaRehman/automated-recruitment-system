import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button, Spinner } from 'react-bootstrap';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true); // Set loading state to true during API request

    try {
      const response = await axios.post('http://localhost:5000/api/signin', { email, password });
      console.log(response.data);
      localStorage.setItem('token', response.data.token);

      navigate('/instructions');
    } catch (error) {
      console.error(error);
      console.log(error.response.data.message);
      toast.error(error.response.data.message, { position: toast.POSITION.TOP_CENTER });
    }

    setIsLoading(false); // Set loading state to false after API request is completed
  };

  return (
    <div className="login-container">
      <div className="form-container">
        <h2 className="loginHeadinig">Sign In</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email" className="Headings">
              Email:
            </label>
            <input type="text" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="form-group">
            <label htmlFor="password" className="Headings">
              Password:
            </label>
            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div className="button-container">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Spinner animation="border" size="sm" /> Loading...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
