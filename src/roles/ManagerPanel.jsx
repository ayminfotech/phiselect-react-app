import React, { useContext, useState } from 'react';
import { fetchAllJobs } from '../services/jobService';
import JobForm from '../components/job/JobForm';
import JobList from '../components/job/JobList';
import { AuthContext } from '../components/auth/AuthContext';

const ManagerPanel = () => {
  const { auth } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);
  const [currentJob, setCurrentJob] = useState(null);
  const [jobsLoaded, setJobsLoaded] = useState(false);

  const handleFetchJobs = async () => {
    try {
      const { data } = await fetchAllJobs(auth.token);
      setJobs(data);
      setJobsLoaded(true);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      alert('Failed to load jobs. Please try again.');
    }
  };

  return (
    <div className="panel-container">
      <h2>Manager Panel</h2>
      {!jobsLoaded ? (
        <button className="primary-button" onClick={handleFetchJobs}>
          Load Jobs
        </button>
      ) : (
        <>
          <JobForm
            token={auth.token}
            setJobs={setJobs}
            currentJob={currentJob}
            setCurrentJob={setCurrentJob}
          />
          <JobList
            jobs={jobs}
            setJobs={setJobs}
            token={auth.token}
            setCurrentJob={setCurrentJob}
          />
        </>
      )}
    </div>
  );
};

export default ManagerPanel;