import React from 'react';
import './PanelStyles.css';

const RecruiterPanel = () => {
    return (
        <div className="panel-container">
            <h2>Recruiter Panel</h2>
            <p>Welcome to the Recruiter Panel. Manage job postings and candidates here.</p>
            <ul>
                <li>Create Job Postings</li>
                <li>Track Candidates</li>
                <li>Schedule Interviews</li>
            </ul>
        </div>
    );
};

export default RecruiterPanel;