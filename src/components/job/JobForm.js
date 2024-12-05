import React, { useState, useEffect } from 'react';
import { createJob, updateJob } from '../../services/jobService';
import './JobForm.css';

const JobForm = ({ token, setJobs, currentJob, setCurrentJob }) => {
  const [jobData, setJobData] = useState({
    organizationName: '',
    jobTitle: '',
    jobDescription: '',
    jobLocation: '',
    jobType: '',
    department: '',
    jobSummary: '',
    responsibilities: '',
    qualification: '',
    requiredSkills: '',
    experienceLevel: '',
    salaryRange: '',
    postingDate: '',
    closingDate: '',
    createdBy: '',
    ...currentJob, // Prepopulate form fields when editing
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJobData({ ...jobData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentJob?.id) {
        const { data } = await updateJob(currentJob.id, jobData, token);
        setJobs((jobs) => jobs.map((job) => (job.id === data.id ? data : job)));
      } else {
        const { data } = await createJob(jobData, token);
        setJobs((jobs) => [...jobs, data]);
      }
      setCurrentJob(null);
      setJobData({
        organizationName: '',
        jobTitle: '',
        jobDescription: '',
        jobLocation: '',
        jobType: '',
        department: '',
        jobSummary: '',
        responsibilities: '',
        qualification: '',
        requiredSkills: '',
        experienceLevel: '',
        salaryRange: '',
        postingDate: '',
        closingDate: '',
        createdBy: '',
      });
    } catch (error) {
      console.error('Error submitting job:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="job-form">
  <h2>{currentJob?.id ? 'Edit Job' : 'Create Job'}</h2>



  <div className="flex-group">
    <div className="form-group">
      <label>Job Title</label>
      <input
        type="text"
        name="jobTitle"
        value={jobData.jobTitle}
        onChange={handleChange}
        placeholder="Job Title"
        required
      />
    </div>
    <div className="form-group">
      <label>Job Location</label>
      <input
        type="text"
        name="jobLocation"
        value={jobData.jobLocation}
        onChange={handleChange}
        placeholder="Job Location"
      />
    </div>
  </div>

  <div className="flex-group">
    <div className="form-group">
      <label>Job Type</label>
      <input
        type="text"
        name="jobType"
        value={jobData.jobType}
        onChange={handleChange}
        placeholder="Job Type"
      />
    </div>
    <div className="form-group">
      <label>Department</label>
      <input
        type="text"
        name="department"
        value={jobData.department}
        onChange={handleChange}
        placeholder="Department"
      />
    </div>
  </div>

  <div className="form-group">
    <label>Job Description</label>
    <textarea
      name="jobDescription"
      value={jobData.jobDescription}
      onChange={handleChange}
      placeholder="Job Description"
      required
    />
  </div>

  <div className="form-group">
    <label>Responsibilities</label>
    <textarea
      name="responsibilities"
      value={jobData.responsibilities}
      onChange={handleChange}
      placeholder="Responsibilities"
    />
  </div>

  <div className="flex-group">
    <div className="form-group">
      <label>Posting Date</label>
      <input
        type="date"
        name="postingDate"
        value={jobData.postingDate}
        onChange={handleChange}
      />
    </div>
    <div className="form-group">
      <label>Closing Date</label>
      <input
        type="date"
        name="closingDate"
        value={jobData.closingDate}
        onChange={handleChange}
      />
    </div>
  </div>

  <button type="submit">{currentJob?.id ? 'Update Job' : 'Create Job'}</button>
</form>
  );
};

export default JobForm;