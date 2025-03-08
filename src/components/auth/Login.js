import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import PhiSelect from '../../assets/PhiSelect.png';
import styles from './Login.module.css';

const Login = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [errorMessage, setErrorMessage] = useState('');
    const [isPasswordVisible, setPasswordVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setIsLoading(true);

        try {
            const success = await login(credentials);
            if (success) {
                const authData = JSON.parse(localStorage.getItem('auth')) || {};
                const { roles = [], tenantId = '' } = authData;

                if (roles.includes('SUPER_ADMIN')) {
                    navigate('/onboard');
                } else if (['ADMIN', 'MANAGER', 'INTERVIEWER', 'RECRUITER'].some((role) => roles.includes(role))) {
                    if (tenantId) {
                        navigate(`/tenant/${tenantId}/dashboard`);
                    } else {
                        setErrorMessage('Tenant ID is missing. Please contact support.');
                    }
                } else {
                    setErrorMessage('Unauthorized role. Access denied.');
                }
            } else {
                setErrorMessage('Invalid email or password. Please try again.');
            }
        } catch (error) {
            setErrorMessage('An unexpected error occurred. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setPasswordVisible((prev) => !prev);
    };

    return (
        <div className={styles.loginContainer}>
            {/* Left Section */}
            <div className={styles.loginHighlight}>
                <img src={PhiSelect} alt="PhiSelect Logo" className={styles.logo} />
                <h2>Why Choose PhiSelect?</h2>
                <ul>
                    <li><strong>AI-Powered Efficiency:</strong> Save time with smart hiring tools.</li>
                    <li><strong>Streamlined Collaboration:</strong> Work smarter, not harder.</li>
                    <li><strong>End-to-End Platform:</strong> Manage every step of hiring effortlessly.</li>
                    <li><strong>Data-Driven Insights:</strong> Make decisions with confidence.</li>
                    <li><strong>Customizable Workflows:</strong> Tailor solutions to your needs.</li>
                    <li><strong>Secure and Reliable:</strong> Your data, protected at all times.</li>
                </ul>
            </div>

            {/* Right Section */}
            <div className={styles.loginForm}>
                <div className={styles.formWrapper}>
                    <h1>Login</h1>
                    {errorMessage && <div className={styles.error}>{errorMessage}</div>}
                    <form onSubmit={handleSubmit} noValidate>
                        <div className={styles.formGroup}>
                            <label htmlFor="email">Email Address</label>
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
                                aria-label="Email Address"
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="password">Password</label>
                            <div className={styles.passwordContainer}>
                                <input
                                    type={isPasswordVisible ? 'text' : 'password'}
                                    id="password"
                                    name="password"
                                    value={credentials.password}
                                    onChange={(e) =>
                                        setCredentials({ ...credentials, password: e.target.value })
                                    }
                                    placeholder="Enter your password"
                                    required
                                    aria-label="Password"
                                />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className={styles.toggleButton}
                                    aria-label={isPasswordVisible ? 'Hide Password' : 'Show Password'}
                                >
                                    {isPasswordVisible ? '🙈' : '👁️'}
                                </button>
                            </div>
                        </div>
                        <button
                            type="submit"
                            className={styles.primaryButton}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>
                    <p className={styles.footerText}>
                        "The journey to building great teams begins with a single step. Let PhiSelect guide the way."
                    </p>
                    <p className={styles.copyright}>
                        &copy; {new Date().getFullYear()} AYM Infotech. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;