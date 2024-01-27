import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import'./Login.css'
import axios from 'axios';

function Login() {
    const [email, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/Admin/SignIn', { email, password });
            console.log(response.data);
            localStorage.setItem('token', response.data.token);
            navigate('/adminDashboard');
        } catch (error) {
            setErrorMessage('Invalid username or password');
            console.error(error);
        }
    };

    return (

        <div className="login-container">
            <div className="form-container">
                <h2 className='loginHeadinig'>Admin Sign In</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username" className="Headings">Email:</label>
                        <input type="text" id="username" value={email} onChange={(e) => setUsername(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password" className="Headings">Password:</label>
                        <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                    <div className="button-container">
                        <button type="submit">Sign In</button>
                    </div>

                </form>
            </div>
        </div>
    );
}

export default Login;
