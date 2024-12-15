// src/components/auth/Login.js
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import PhiSelect from '../../assets/PhiSelect.png'; // Import the logo image
import styles from './Login.module.css'; // Import the CSS Module

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
        
            // Define roles that should navigate to the Tenant Dashboard
            const dashboardRoles = ['ADMIN', 'MANAGER', 'INTERVIEWER', 'RECRUITER'];
        
            // Redirect based on roles
            if (roles.includes('SUPER_ADMIN')) {
                console.log('Navigating to /onboard');
                navigate('/onboard'); // Redirect to onboard page for SUPER_ADMIN
            } else if (dashboardRoles.some(role => roles.includes(role))) {
                if (tenantId) {
                    console.log(`Navigating to /tenant/${tenantId}/dashboard`);
                    navigate(`/tenant/${tenantId}/dashboard`); // Redirect to tenant dashboard
                } else {
                    alert('Tenant ID is missing. Please contact support.');
                }
            } else {
                alert('Unauthorized Role'); // Fallback for unsupported roles
            }
        } else {
            alert('Invalid credentials'); // Handle invalid login
        }
    };

    return (
        <div className={styles.loginContainer}>
            {/* Left section for highlighting features */}
            <div
                className={styles.loginHighlight}
                style={{ backgroundImage: `url(${PhiSelect})` }} // Set background image via inline style
            >
                <img src={PhiSelect} alt="Company Logo" className={styles.logo} />
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
            <div className={styles.loginForm}>
                <div className={styles.formWrapper}>
                    <h1>Login</h1>
                    <form onSubmit={handleSubmit}>
                        <div className={styles.formGroup}>
                            <label htmlFor="email">Email:</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={credentials.email}
                                onChange={(e) =>
                                    setCredentials({ ...credentials, email: e.target.value })
                                }
                                placeholder="Enter your email"
                                required
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="password">Password:</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={credentials.password}
                                onChange={(e) =>
                                    setCredentials({ ...credentials, password: e.target.value })
                                }
                                placeholder="Enter your password"
                                required
                            />
                        </div>
                        <button type="submit" className={styles.primaryButton}>Login</button>
                    </form>
                    <p className={styles.loginFooter}>Don’t have an account? <a href="/register">Register</a></p>
                </div>
            </div>
        </div>
    );
};

export default Login;