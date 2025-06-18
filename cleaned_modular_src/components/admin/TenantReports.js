// src/components/admin/TenetReports.js
import React, { useEffect, useState } from 'react';
import { getTenetReports } from '../../services/TenantService';
import TenetSidebar from './TenantSidebar';
import './TenantReports.css';

const TenetReports = () => {
  const [reports, setReports] = useState([]);
  const [activeItem, setActiveItem] = useState('Reports');

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await getTenetReports();
        setReports(data);
      } catch (error) {
        console.error('Error fetching reports:', error);
      }
    };
    fetchReports();
  }, []);

  return (
    <div className="tenet-reports-container">
      <TenetSidebar
        activeItem={activeItem}
        onMenuClick={setActiveItem}
        onLogout={() => {}}
      />
      <main className="content">
        <header className="header">
          <h1>Tenet Reports</h1>
        </header>
        <section className="reports-list-container">
          {reports.length > 0 ? (
            <div className="reports-grid">
              {reports.map((report) => (
                <div key={report.id} className="report-card">
                  <h3>{report.title}</h3>
                  <p>{report.summary}</p>
                  <button className="primary-button">View Details</button>
                </div>
              ))}
            </div>
          ) : (
            <p>No reports available.</p>
          )}
        </section>
      </main>
    </div>
  );
};

export default TenetReports;