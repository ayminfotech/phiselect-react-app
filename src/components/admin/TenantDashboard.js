import React, { useState } from 'react';
import './TenantDashboard.css';

const stats = [
    { title: 'Active Jobs', value: 8, icon: '📋', prediction: 'Stable trend, no immediate changes predicted' },
    { title: 'Applications Received', value: 250, icon: '📨', prediction: 'Expected 15% increase in next quarter based on past trends' },
    { title: 'Interviews Scheduled', value: 20, icon: '🕒', prediction: '95% likely to proceed with interviews based on candidate profile' },
    { title: 'Offers Made', value: 15, icon: '💼', prediction: 'Offers expected to decrease by 5% due to salary mismatch insights' },
    { title: 'Hires Made', value: 10, icon: '🎯', prediction: 'Hiring pace expected to maintain with no significant changes' },
    { title: 'Unjoined Candidates', value: 3, icon: '🚷', rejectionReasons: ['Salary Expectation', 'Unwilling to Relocate'], prediction: 'Likely to increase if salary expectations remain the same' },
    { title: 'Positions Rejected', value: 5, icon: '❌', rejectionReasons: ['Skills Mismatch', 'Location Issues'], prediction: 'Rejection rate expected to stabilize if new training programs are implemented' },
    { title: 'Skills Mismatch', value: 8, icon: '🔧', prediction: 'Candidate rejection rate predicted to decrease with improved screening' },
    { title: 'Candidates Awaiting Feedback', value: 10, icon: '⏳', prediction: 'Feedback backlog expected to reduce with automated analysis' },
    { title: 'Rejected Candidates', value: 7, icon: '🚫', rejectionReasons: ['Skills Mismatch', 'Cultural Fit'], prediction: 'Rejections may increase as new job requirements are rolled out' },

    // New Metrics
    { title: 'Time to Hire (Avg)', value: 30, icon: '⏱️', prediction: 'Time to hire expected to decrease by 10% with improved screening processes' },
    { title: 'Salary Expectations Met', value: 18, icon: '💰', prediction: 'Salary expectations met for 60% of candidates, expected to increase with flexible compensation packages' },
    { title: 'Job Satisfaction', value: 85, icon: '😊', prediction: 'Job satisfaction rate expected to remain high, driven by improved work-life balance initiatives' },
    { title: 'Pipeline Progression Rate', value: 65, icon: '📈', prediction: 'Progression rate expected to increase by 10% with refined candidate nurturing strategies' },

    // AI Predictions & Analytics
    { title: 'Candidate Fit Score', value: 75, icon: '🔍', prediction: 'AI-driven candidate fit score suggests improved hiring accuracy with higher precision in job-fit matching' },
    { title: 'Cultural Fit Analysis', value: 80, icon: '🌐', prediction: 'Cultural fit percentage expected to improve with more diverse candidate sourcing and hiring practices' },
    { title: 'Offer Rejections Due to Salary', value: 5, icon: '📉', prediction: 'Offer rejections due to salary expectations are predicted to increase unless salary adjustments are made' },

    // Domain-specific Metrics
    { title: 'Contractor Positions', value: 3, icon: '📑', prediction: 'Contractor positions will likely rise due to increasing demand for flexible roles in tech' },
    { title: 'Internships', value: 4, icon: '🎓', prediction: 'Internship opportunities are likely to grow by 25% in the next quarter based on company initiatives' },
    { title: 'Remote Work Opportunities', value: 10, icon: '💻', prediction: 'Remote work opportunities expected to continue rising, predicted increase of 20% next quarter' },
    { title: 'Leadership Hires', value: 2, icon: '🧑‍💼', prediction: 'Leadership hires to increase by 10% in the coming quarter due to leadership development programs' },

    // Advanced Metrics and Predictions
    { title: 'Candidate Engagement Rate', value: 80, icon: '💬', prediction: 'Engagement rate predicted to improve with AI-driven communication and personalized candidate outreach' },
    { title: 'Referral Hires', value: 6, icon: '🤝', prediction: 'Referral hires expected to increase with enhanced employee referral programs' },
    { title: 'Diversity Hiring Progress', value: 40, icon: '🌈', prediction: 'Diversity hiring expected to increase by 15% next quarter with new initiatives and targets' }
];

// Role Colors
const roleColors = {
    Admin: '#3498db', // Blue
    Manager: '#27ae60', // Green
    Recruiter: '#f39c12', // Gold
    Interviewer: '#e74c3c', // Coral
};

// Dummy Data for Job Posts, Candidates, Feedback, and Users
const jobPosts = [
    { jobTitle: 'Software Developer', status: 'Open', assignedTo: 'John Doe' },
    { jobTitle: 'Product Manager', status: 'Filled', assignedTo: 'Jane Smith' },
];

const candidates = [
    { name: 'John Doe', position: 'Software Developer', status: 'Interview Scheduled', rejectionReason: '' },
    { name: 'Jane Smith', position: 'Product Manager', status: 'Pending', rejectionReason: 'Skills Mismatch' },
    { name: 'Sam Brown', position: 'HR Specialist', status: 'Applied', rejectionReason: '' },
];

const feedback = [
    { candidate: 'John Doe', interviewDate: '2023-11-12', feedback: 'Strong technical skills.' },
    { candidate: 'Jane Smith', interviewDate: '2023-11-13', feedback: 'Good leadership, needs tech improvement.' },
];

const usersData = [
    { name: 'Admin User', role: 'Admin', status: 'Active' },
    { name: 'John Doe', role: 'Manager', status: 'Active' },
    { name: 'Jane Smith', role: 'Recruiter', status: 'Active' },
    { name: 'Sam Brown', role: 'Interviewer', status: 'Inactive' },
];

// Reports and Analytics Data
const reports = [
    { reportTitle: 'Recruitment Report', date: '2023-12-01', status: 'Completed' },
    { reportTitle: 'Job Postings Analysis', date: '2023-11-15', status: 'Pending' },
    { reportTitle: 'Candidate Sourcing Report', date: '2023-10-28', status: 'Completed' },
];

const analytics = [
    { metric: 'Total Candidates Interviewed', value: 120 },
    { metric: 'Job Postings in Last Month', value: 35 },
    { metric: 'Average Time to Hire', value: '12 days' },
    { metric: 'Candidates Accepted Offers', value: 75 },
    { metric: 'Positions Rejected', value: 5 },
    { metric: 'Unjoined Candidates', value: 3 },
    { metric: 'Skills Mismatch', value: 8 },
    { metric: 'Candidates Awaiting Feedback', value: 10 },
    { metric: 'Rejected Candidates', value: 7 },
];

const TenantDashboard = () => {
    const [activeNav, setActiveNav] = useState('Dashboard');
    const [activeRole, setActiveRole] = useState('Admin');
    const [users, setUsers] = useState(usersData); // User data state
    const [newUserName, setNewUserName] = useState('');
    const [newUserRole, setNewUserRole] = useState('Manager');
    const [reportsData, setReportsData] = useState([]);
    const [analyticsData, setAnalyticsData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Simulate backend call to add user
    const createUser = () => {
        setIsLoading(true);
        setTimeout(() => {
            const newUser = {
                name: newUserName,
                role: newUserRole,
                status: 'Active',
            };
            setUsers([...users, newUser]);
            setNewUserName('');
            setIsLoading(false);
        }, 1000); // Simulate async backend delay
    };

    // Simulate backend call to fetch reports
    const fetchReports = () => {
        setIsLoading(true);
        setTimeout(() => {
            setReportsData(reports);
            setIsLoading(false);
        }, 1000);
    };

    // Simulate backend call to fetch analytics
    const fetchAnalytics = () => {
        setIsLoading(true);
        setTimeout(() => {
            setAnalyticsData(analytics);
            setIsLoading(false);
        }, 1000);
    };

    // Toggle user status (Active/Inactive)
    const toggleUserStatus = (name) => {
        const updatedUsers = users.map((user) =>
            user.name === name ? { ...user, status: user.status === 'Active' ? 'Inactive' : 'Active' } : user
        );
        setUsers(updatedUsers);
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
                                <button className="action-btn" onClick={createUser} disabled={isLoading}>
                                    {isLoading ? 'Creating...' : 'Create User'}
                                </button>
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

                        <h4>Reports</h4>
                        <button onClick={fetchReports}>Load Reports</button>
                        <ul>
                            {reportsData.map((report, index) => (
                                <li key={index}>
                                    {report.reportTitle} - {report.date} - {report.status}
                                </li>
                            ))}
                        </ul>

                        <h4>Analytics</h4>
                        <button onClick={fetchAnalytics}>Load Analytics</button>
                        <ul>
                            {analyticsData.map((item, index) => (
                                <li key={index}>
                                    {item.metric}: {item.value}
                                </li>
                            ))}
                        </ul>

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
                {renderStages()}
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