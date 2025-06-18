import React from 'react';
import { deleteJob } from '../../services/jobService';

const JobList = ({ jobs, setJobs, token, setCurrentJob }) => {
  const handleDelete = async (jobId) => {
    await deleteJob(jobId, token);
    setJobs((prevJobs) => prevJobs.filter((job) => job.id !== jobId));
  };

  return (
    <div>
      <h3>Job List</h3>
      {jobs.length ? (
        jobs.map((job) => (
          <div key={job.id} className="job-item">
            <h4>{job.jobTitle}</h4>
            <p>{job.jobDescription}</p>
            <button onClick={() => setCurrentJob(job)}>Edit</button>
            <button onClick={() => handleDelete(job.id)}>Delete</button>
          </div>
        ))
      ) : (
        <p>No jobs available.</p>
      )}
    </div>
  );
};

export default JobList;