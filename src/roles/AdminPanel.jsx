import React from 'react';
import './PanelStyles.css';

const AdminPanel = () => {
    return (
        <div className="panel-container">
            <h2>Admin Panel</h2>
            <p>Welcome to the Admin Panel. Manage system configurations and users here.</p>
            <ul>
                <li>Add/Remove Users</li>
                <li>Configure Settings</li>
                <li>Audit Logs</li>
            </ul>
        </div>
    );
};

export default AdminPanel;