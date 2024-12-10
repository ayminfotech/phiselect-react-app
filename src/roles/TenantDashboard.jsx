// src/components/admin/TenantDashboard.jsx

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './TenantDashboard.css';
import { useAuth } from '../../auth/AuthContext'; // Adjust the import path as necessary

// Import Panel Components
import AdminPanel from './AdminPanel';
import ManagerPanel from './ManagerPanel';
import RecruiterPanel from './RecruiterPanel';
import InterviewerPanel from './InterviewerPanel';

const roleColors = {
    Admin: '#3498db', // Blue
    Manager: '#27ae60', // Green
    Recruiter: '#f39c12', // Gold
    Interviewer: '#e74c3c', // Coral
};

// Main TenantDashboard Component
const TenantDashboard = () => {
    const { user, loading } = useAuth(); // Destructure user and loading from context
    const userRole = user?.role || 'Guest'; // Default to 'Guest' if no user is authenticated

    const [activeNav, setActiveNav] = useState('Dashboard');
    const [users, setUsers] = useState([]);
    const [reportsData, setReportsData] = useState([]);
    const [analyticsData, setAnalyticsData] = useState([]);
    const [jobPosts, setJobPosts] = useState([]);
    const [candidates, setCandidates] = useState([]);
    const [feedback, setFeedback] = useState([]);
    const [stats, setStats] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Memoize fetchAllData to prevent unnecessary re-creations
    const fetchAllData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            // Fetch stats
            const statsResponse = await axios.get('/api/stats');
            setStats(statsResponse.data);

            // Fetch job posts
            const jobsResponse = await axios.get('/api/job-posts');
            setJobPosts(jobsResponse.data);

            // Fetch users
            const usersResponse = await axios.get('/api/users');
            setUsers(usersResponse.data);

            // Fetch candidates
            const candidatesResponse = await axios.get('/api/candidates');
            setCandidates(candidatesResponse.data);

            // Fetch feedback
            const feedbackResponse = await axios.get('/api/feedback');
            setFeedback(feedbackResponse.data);

            // Fetch reports
            const reportsResponse = await axios.get('/api/reports');
            setReportsData(reportsResponse.data);

            // Fetch analytics
            const analyticsResponse = await axios.get('/api/analytics');
            setAnalyticsData(analyticsResponse.data);
        } catch (err) {
            console.error(err);
            setError('Failed to fetch data. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    }, []); // Add dependencies if necessary

    // Fetch data when component mounts or userRole changes
    useEffect(() => {
        if (!loading) { // Ensure user data is loaded
            fetchAllData();
        }
    }, [fetchAllData, userRole, loading]);

    // Create a new user
    const createUser = async (name, role) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.post('/api/users', {
                name,
                role,
                status: 'Active',
            });
            setUsers([...users, response.data]);
        } catch (err) {
            console.error(err);
            setError('Failed to create user. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // Toggle user status
    const toggleUserStatus = async (name) => {
        const userToUpdate = users.find((u) => u.name === name);
        if (!userToUpdate) return;
        const updatedStatus = userToUpdate.status === 'Active' ? 'Inactive' : 'Active';
        setIsLoading(true);
        setError(null);
        try {
            await axios.patch(`/api/users/${userToUpdate.id}`, { status: updatedStatus });
            setUsers(
                users.map((u) =>
                    u.name === name ? { ...u, status: updatedStatus } : u
                )
            );
        } catch (err) {
            console.error(err);
            setError('Failed to update user status. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // Create a new job post
    const createJobPostHandler = async (jobTitle) => {
        if (jobTitle.trim() === '') {
            alert('Job title cannot be empty.');
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.post('/api/job-posts', {
                jobTitle,
                status: 'Open',
                assignedTo: '', // Initially unassigned
            });
            setJobPosts([...jobPosts, response.data]);
        } catch (err) {
            console.error(err);
            setError('Failed to create job post. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // Assign a job to a recruiter
    const assignJobHandler = async (jobId, recruiterId) => {
        setIsLoading(true);
        setError(null);
        try {
            await axios.patch(`/api/job-posts/${jobId}`, { assignedTo: recruiterId });
            setJobPosts(
                jobPosts.map((job) =>
                    job.id === jobId ? { ...job, assignedTo: recruiterId } : job
                )
            );
        } catch (err) {
            console.error(err);
            setError('Failed to assign job. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // Render ATS stages
    const renderStages = () => {
        return stats.map((stat, index) => (
            <div key={index} className="stat-card">
                <div className="icon">{stat.icon}</div>
                <div className="details">
                    <h3>{stat.value}</h3>
                    <p>{stat.title}</p>
                </div>
            </div>
        ));
    };

    // Determine which panel to display based on userRole
    const renderRoleContent = () => {
        switch (userRole) {
            case 'Admin':
                return (
                    <AdminPanel
                        users={users}
                        createUser={createUser}
                        toggleUserStatus={toggleUserStatus}
                        reportsData={reportsData}
                        analyticsData={analyticsData}
                        jobPosts={jobPosts}
                        isLoading={isLoading}
                    />
                );
            case 'Manager':
                return (
                    <ManagerPanel
                        jobPosts={jobPosts}
                        createJobPost={createJobPostHandler}
                        assignJob={assignJobHandler}
                        recruiters={users.filter((user) => user.role === 'Recruiter')}
                        isLoading={isLoading}
                    />
                );
            case 'Recruiter':
                return (
                    <RecruiterPanel
                        candidates={candidates}
                        isLoading={isLoading}
                    />
                );
            case 'Interviewer':
                return (
                    <InterviewerPanel
                        feedback={feedback}
                        isLoading={isLoading}
                    />
                );
            default:
                return <div className="no-role">Select a role to view its dashboard.</div>;
        }
    };

    return (
        <div className={`tenant-dashboard ${userRole.toLowerCase()}`}>
            {/* Navigation */}
            <nav className="main-navigation">
                <ul>
                    {['Dashboard', 'Jobs', 'Candidates', 'Reports', 'Settings'].map((item) => (
                        <li
                            key={item}
                            className={activeNav === item ? 'active' : ''}
                            onClick={() => setActiveNav(item)}
                        >
                            {item}
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Header */}
            <header className="dashboard-header">
                <h1>Welcome to Your ATS Dashboard</h1>
                <p>Streamline your recruitment process with ease.</p>
            </header>

            {/* Stats Section */}
            <section className="stats-section">
                {isLoading ? <p className="loading">Loading stats...</p> : renderStages()}
            </section>

            {/* Role-Specific Content */}
            <section className="role-content">
                {renderRoleContent()}
            </section>

            {/* Error Message */}
            {error && <div className="error-message">{error}</div>}
        </div>
    );
};

export default TenantDashboard;