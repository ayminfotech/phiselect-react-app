import React, { useState } from 'react';
import './TenantDashboard.css';

// Dummy Data
const stats = [
    { title: 'Active Jobs', value: 8, icon: '📋' },
    { title: 'Applications Received', value: 250, icon: '📨' },
    { title: 'Hires Made', value: 15, icon: '🎯' },
    { title: 'Pending Interviews', value: 12, icon: '🕒' },
];

const roleColors = {
    Admin: '#3498db', // Blue
    Manager: '#27ae60', // Green
    Recruiter: '#f39c12', // Gold
    Interviewer: '#e74c3c', // Coral
};

const jobPosts = [
    { jobTitle: 'Software Developer', status: 'Open', assignedTo: 'John Doe' },
    { jobTitle: 'Product Manager', status: 'Filled', assignedTo: 'Jane Smith' },
];

const candidates = [
    { name: 'John Doe', position: 'Software Developer', status: 'Interview Scheduled' },
    { name: 'Jane Smith', position: 'Product Manager', status: 'Pending' },
    { name: 'Sam Brown', position: 'HR Specialist', status: 'Applied' },
];

const feedback = [
    { candidate: 'John Doe', interviewDate: '2023-11-12', feedback: 'Strong technical skills.' },
    { candidate: 'Jane Smith', interviewDate: '2023-11-13', feedback: 'Good leadership, needs tech improvement.' },
];

// Users Data (for admin to manage)
const usersData = [
    { name: 'Admin User', role: 'Admin', status: 'Active' },
    { name: 'John Doe', role: 'Manager', status: 'Active' },
    { name: 'Jane Smith', role: 'Recruiter', status: 'Active' },
    { name: 'Sam Brown', role: 'Interviewer', status: 'Inactive' },
];

const TenantDashboard = () => {
    const [activeNav, setActiveNav] = useState('Dashboard');
    const [activeRole, setActiveRole] = useState('Admin');
    const [users, setUsers] = useState(usersData); // User data state
    const [newUserName, setNewUserName] = useState('');
    const [newUserRole, setNewUserRole] = useState('Manager');

    // Add a new user to the users array
    const createUser = () => {
        const newUser = {
            name: newUserName,
            role: newUserRole,
            status: 'Active',
        };
        setUsers([...users, newUser]);
        setNewUserName('');
    };

    // Toggle user status (Active/Inactive)
    const toggleUserStatus = (name) => {
        const updatedUsers = users.map((user) =>
            user.name === name ? { ...user, status: user.status === 'Active' ? 'Inactive' : 'Active' } : user
        );
        setUsers(updatedUsers);
    };

    const renderRoleContent = () => {
        switch (activeRole) {
            case 'Admin':
                return (
                    <div>
                        <h3 style={{ color: roleColors.Admin }}>Admin Panel</h3>
                        <h4>Users Management</h4>
                        <div className="user-management">
                            <div>
                                <h4>Create User</h4>
                                <input
                                    type="text"
                                    value={newUserName}
                                    onChange={(e) => setNewUserName(e.target.value)}
                                    placeholder="Enter new user name"
                                />
                                <select
                                    value={newUserRole}
                                    onChange={(e) => setNewUserRole(e.target.value)}
                                >
                                    <option value="Manager">Manager</option>
                                    <option value="Recruiter">Recruiter</option>
                                    <option value="Interviewer">Interviewer</option>
                                    <option value="Admin">Admin</option>
                                </select>
                                <button className="action-btn" onClick={createUser}>Create User</button>
                            </div>

                            <h4>All Users</h4>
                            <ul>
                                {users.map((user, index) => (
                                    <li key={index}>
                                        {user.name} - {user.role} - {user.status}
                                        <button className="action-btn" onClick={() => toggleUserStatus(user.name)}>
                                            {user.status === 'Active' ? 'Deactivate' : 'Activate'}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <h4>Job Posts</h4>
                        <ul>
                            {jobPosts.map((job, index) => (
                                <li key={index}>
                                    {job.jobTitle} - {job.status} (Assigned to: {job.assignedTo || 'Unassigned'})
                                </li>
                            ))}
                        </ul>
                    </div>
                );
            case 'Manager':
                return (
                    <div>
                        <h3 style={{ color: roleColors.Manager }}>Manager Panel</h3>
                        <button className="create-job-btn">Create Job Post</button>
                        <h4>Job Posts</h4>
                        <ul>
                            {jobPosts.map((job, index) => (
                                <li key={index}>
                                    {job.jobTitle} - {job.status}
                                </li>
                            ))}
                        </ul>
                    </div>
                );
            case 'Recruiter':
                return (
                    <div>
                        <h3 style={{ color: roleColors.Recruiter }}>Recruiter Panel</h3>
                        <button className="action-btn">Source Candidates</button>
                        <h4>Candidates</h4>
                        <ul>
                            {candidates.map((candidate, index) => (
                                <li key={index}>
                                    {candidate.name} - {candidate.position} - {candidate.status}
                                </li>
                            ))}
                        </ul>
                    </div>
                );
            case 'Interviewer':
                return (
                    <div>
                        <h3 style={{ color: roleColors.Interviewer }}>Interviewer Panel</h3>
                        <button className="action-btn">Provide Feedback</button>
                        <h4>Feedback</h4>
                        <ul>
                            {feedback.map((fb, index) => (
                                <li key={index}>
                                    {fb.candidate} - {fb.interviewDate} - {fb.feedback}
                                </li>
                            ))}
                        </ul>
                    </div>
                );
            default:
                return <div>Select a role to view its dashboard.</div>;
        }
    };

    return (
        <div className="tenant-dashboard">
            {/* Navigation */}
            <nav className="main-navigation">
                <ul>
                    {['Dashboard', 'Jobs', 'Candidates', 'Settings'].map((item) => (
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
                {stats.map((stat, index) => (
                    <div key={index} className="stat-card">
                        <div className="icon">{stat.icon}</div>
                        <div className="details">
                            <h3>{stat.value}</h3>
                            <p>{stat.title}</p>
                        </div>
                    </div>
                ))}
            </section>

            {/* Role Tabs */}
            <div className="role-tabs">
                {['Admin', 'Manager', 'Recruiter', 'Interviewer'].map((role) => (
                    <button
                        key={role}
                        className={activeRole === role ? 'active' : ''}
                        style={{
                            borderColor: roleColors[role],
                            color: activeRole === role ? '#fff' : roleColors[role],
                            backgroundColor: activeRole === role ? roleColors[role] : 'transparent',
                        }}
                        onClick={() => setActiveRole(role)}
                    >
                        {role}
                    </button>
                ))}
            </div>

            {/* Role-Specific Content */}
            <section className="role-content">{renderRoleContent()}</section>
        </div>
    );
};

export default TenantDashboard;