import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import './Login.css'; // Import styles for the page

const Login = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await login(credentials);
        
        if (success) {
            // Retrieve the entire auth object from localStorage
            const authData = JSON.parse(localStorage.getItem('auth')) || {}; // Ensure authData is always an object
            const roles = authData.roles || []; // Safely retrieve roles array
            const tenantId = authData.tenantId || ''; // Safely retrieve tenantId
        
            console.log('Auth Data:', authData); // Debugging: Log the entire auth object
            console.log('Roles:', roles); // Debugging: Log roles
            console.log('Tenant ID:', tenantId); // Debugging: Log tenant ID
        
            // Redirect based on roles
            if (roles.includes('SUPER_ADMIN')) {
                navigate('/onboard'); // Redirect to onboard page for SUPER_ADMIN
            } else if (roles.includes('MANAGER')) {
                navigate(`/tenant/${tenantId}/dashboard`); // Redirect to tenant dashboard
            } else {
                alert('Unauthorized Role'); // Fallback for unsupported roles
            }
        } else {
            alert('Invalid credentials'); // Handle invalid login
        }
    };

    return (
        <div className="login-container">
            {/* Left section for highlighting features */}
            <div className="login-highlight">
                <img src="/logo.png" alt="Company Logo" className="logo" /> {/* Logo */}
                <h2>Welcome to Your ATS</h2>
                <p>Streamline your recruitment process with AI-powered solutions:</p>
                <ul>
                    <li><strong>AI Resume Parsing:</strong> Extract key insights effortlessly.</li>
                    <li><strong>Job Management:</strong> Manage postings and track candidates easily.</li>
                    <li><strong>Interview Scheduling:</strong> Save time with automated scheduling.</li>
                    <li><strong>Analytics:</strong> Gain actionable insights into your hiring pipeline.</li>
                </ul>
            </div>

            {/* Right section for login */}
            <div className="login-form">
                <h1>Login</h1>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={credentials.email}
                            onChange={(e) =>
                                setCredentials({ ...credentials, email: e.target.value })
                            }
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                    <div>
                        <label>Password:</label>
                        <input
                            type="password"
                            name="password"
                            value={credentials.password}
                            onChange={(e) =>
                                setCredentials({ ...credentials, password: e.target.value })
                            }
                            placeholder="Enter your password"
                            required
                        />
                    </div>
                    <button type="submit">Login</button>
                </form>
                <p className="login-footer">Don’t have an account? <a href="/register">Register</a></p>
            </div>
        </div>
    );
};

export default Login;