import React, { useContext, useState } from 'react';
import { AuthContext } from '../auth/AuthContext';
import ManagerPanel from '../../roles/ManagerPanel';
import RecruiterPanel from '../../roles/RecruiterPanel';
import AdminPanel from '../../roles/AdminPanel';
import InterviewerPanel from '../../roles/InterviewerPanel';
import './TenantDashboard.css';

const TenantDashboard = () => {
    const { auth } = useContext(AuthContext);
    const { roles, permissions, tenantId } = auth || {};
    const [activePanel, setActivePanel] = useState(null); // Track the selected panel

    if (!auth) {
        return <div>Loading... Please log in.</div>;
    }

    const renderPanel = () => {
        switch (activePanel) {
            case 'MANAGER':
                return <ManagerPanel permissions={permissions} />;
            case 'RECRUITER':
                return <RecruiterPanel permissions={permissions} />;
            case 'ADMIN':
                return <AdminPanel permissions={permissions} />;
            case 'INTERVIEWER':
                return <InterviewerPanel permissions={permissions} />;
            default:
                return <div>Select a panel to view details.</div>;
        }
    };

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h1>{tenantId ? `${tenantId} Dashboard` : 'Tenant Dashboard'}</h1>
                <p>Welcome, Tenant: <strong>{tenantId}</strong></p>
            </header>
            <div className="dashboard-content">
                <aside className="dashboard-sidebar">
                    <h2>Navigation</h2>
                    <ul>
                        {roles.includes('MANAGER') && (
                            <li onClick={() => setActivePanel('MANAGER')}>Manager Panel</li>
                        )}
                        {roles.includes('RECRUITER') && (
                            <li onClick={() => setActivePanel('RECRUITER')}>Recruiter Panel</li>
                        )}
                        {roles.includes('ADMIN') && (
                            <li onClick={() => setActivePanel('ADMIN')}>Admin Panel</li>
                        )}
                        {roles.includes('INTERVIEWER') && (
                            <li onClick={() => setActivePanel('INTERVIEWER')}>Interviewer Panel</li>
                        )}
                    </ul>
                </aside>
                <main className="dashboard-main">
                    {renderPanel()}
                </main>
            </div>
        </div>
    );
};

export default TenantDashboard;