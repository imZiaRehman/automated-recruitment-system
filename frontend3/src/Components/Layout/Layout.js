import React, { useEffect, useState } from 'react';
import Sidebar from '../Sidebar/Sidebar';
import Header from '../Header/Header'
import axios from 'axios';
import './Layout.css';

const Layout = ({ children }) => {

    const [userName, setUserName] = useState('');

    const handleLogout = () => {
        // Handle logout logic
        localStorage.removeItem('token');
        localStorage.removeItem('email');
        localStorage.removeItem('username');
        window.location.href = '/';
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            getUserData(token);
        } else {
            window.location.href = '/';
        }
    }, []);


    const getUserData = async (token) => {
        try {
            const response = await axios.get('http://localhost:5000/api/Candidate/profile', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const { username, email } = response.data;
            // Store email and username in local storage for future use
            localStorage.setItem('email', email);
            localStorage.setItem('username', username);
            setUserName(username);

        } catch (error) {
            console.error(error);
            // Handle error retrieving user data
            // Redirect to login page or display an error message
            window.location.href = '/';
        }
    };
    return (
        <>
            <div className="Header">
                <Header userName={userName} onLogout={handleLogout} />
            </div>

            <div className="layout">
                <div className='Navbar'>
                    <Sidebar />
                </div>
                <div className="content">{children}</div>
            </div>
        </>
    );
};

export default Layout;
