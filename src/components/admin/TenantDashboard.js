import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../auth/AuthContext';
import { getOrganizationsByTenantId } from '../../services/TenantService';
import './TenantDashboard.css';

// Reusable Component for Stats Card
const StatCard = ({ title, value, icon }) => (
    <div className="stat-card">
        <div className="icon">{icon}</div>
        <div className="details">
            <h3>{value}</h3>
            <p>{title}</p>
        </div>
    </div>
);

// Role-Specific Panels
const ManagerPanel = () => (
    <div>
        <h3>Manager Overview</h3>
        <p>Total Team Members: 12</p>
        <p>Active Job Posts: 8</p>
        <p>Pending Approvals: 2</p>
    </div>
);

const RecruiterPanel = () => (
    <div>
        <h3>Recruiter Dashboard</h3>
        <p>Jobs Posted: 5</p>
        <p>Applications Received: 150</p>
        <p>Interviews Scheduled: 10</p>
    </div>
);

const InterviewerPanel = () => (
    <div>
        <h3>Interviewer Tasks</h3>
        <p>Assigned Interviews: 4</p>
        <p>Pending Feedback: 2</p>
        <p>Completed Interviews: 6</p>
    </div>
);

const TenantDashboard = () => {
    const { auth } = useContext(AuthContext);
    const { tenantId, roles } = auth || {};
    const [tenantData, setTenantData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTenantData = async () => {
            setLoading(true);
            try {
                if (tenantId) {
                    const data = await getOrganizationsByTenantId(tenantId);
                    setTenantData(Array.isArray(data) ? data[0] : data);
                } else {
                    setError('No tenant ID found.');
                }
            } catch (err) {
                setError('Failed to fetch tenant data.');
            } finally {
                setLoading(false);
            }
        };

        fetchTenantData();
    }, [tenantId]);

    if (loading) return <div className="loader">Loading tenant data...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="tenant-dashboard">
            {/* Header Section */}
            <header className="dashboard-header">
                <h1>Welcome to {tenantData?.name || 'Tenant Dashboard'}</h1>
                <p>Your tenant ID: <strong>{tenantData?.tenantId || 'N/A'}</strong></p>
            </header>

            {/* Quick Stats */}
            <section className="stats-section">
                <StatCard title="Active Jobs" value={tenantData?.activeJobs || 5} icon="📋" />
                <StatCard title="Applications Received" value={tenantData?.applications || 250} icon="📨" />
                <StatCard title="Hires Made" value={tenantData?.hires || 10} icon="🎯" />
                <StatCard title="Pending Interviews" value={tenantData?.interviews || 8} icon="🕒" />
            </section>

            {/* Role-Specific Data */}
            <section className="role-specific-section">
                {roles.includes('MANAGER') && <ManagerPanel />}
                {roles.includes('RECRUITER') && <RecruiterPanel />}
                {roles.includes('INTERVIEWER') && <InterviewerPanel />}
            </section>

            {/* Tenant Information */}
            <section className="tenant-info-section">
                <h2>Tenant Information</h2>
                <p><strong>Name:</strong> {tenantData?.name}</p>
                <p><strong>Industry:</strong> {tenantData?.industryType}</p>
                <p><strong>Contact Email:</strong> {tenantData?.contactDetails?.email}</p>
                <p><strong>Phone:</strong> {tenantData?.contactDetails?.phone}</p>
            </section>

            {/* Activity Logs */}
            <section className="logs-section">
                <h2>Recent Activity</h2>
                {tenantData?.activityLogs?.length ? (
                    <ul>
                        {tenantData.activityLogs.map((log, index) => (
                            <li key={index}>{log}</li>
                        ))}
                    </ul>
                ) : (
                    <p>No recent activity found.</p>
                )}
            </section>
        </div>
    );
};

export default TenantDashboard;