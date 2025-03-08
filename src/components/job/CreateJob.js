import React, { useState } from 'react';
import { createJob } from '../../services/jobService';

const CreateJob = () => {
  const [jobData, setJobData] = useState({ title: '', description: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newJob = await createJob(jobData);
      alert('Job created successfully!');
      setJobData({ title: '', description: '' });
    } catch (err) {
      alert('Failed to create job.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Job</h2>
      <input
        type="text"
        value={jobData.title}
        onChange={(e) => setJobData({ ...jobData, title: e.target.value })}
        placeholder="Job Title"
        required
      />
      <textarea
        value={jobData.description}
        onChange={(e) => setJobData({ ...jobData, description: e.target.value })}
        placeholder="Job Description"
        required
      />
      <button type="submit">Create Job</button>
    </form>
  );
};

export default CreateJob;