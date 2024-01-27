import React, { useEffect } from 'react';
import Sidebar from './SideNavBar';
import axios from 'axios';
import './Layout.css';


const Layout = ({ children }) => {

    const handleLogout = () => {
        // Handle logout logic
        localStorage.removeItem('token');
        window.location.href = '/';
    };


    return (
        <>
            <div className="layout">
                <Sidebar />
                <div className="content">{children}</div>
            </div>
        </>
    );
};

export default Layout;
