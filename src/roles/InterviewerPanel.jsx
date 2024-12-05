import React from 'react';
import './PanelStyles.css';

const InterviewerPanel = () => {
    return (
        <div className="panel-container">
            <h2>Interviewer Panel</h2>
            <p>Welcome to the Interviewer Panel. Manage interviews and provide feedback here.</p>
            <ul>
                <li>View Scheduled Interviews</li>
                <li>Provide Feedback</li>
                <li>Access Candidate Details</li>
            </ul>
        </div>
    );
};

export default InterviewerPanel;