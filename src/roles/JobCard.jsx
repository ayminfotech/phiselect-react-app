// src/components/jobs/JobCard.jsx

import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, Typography, Divider, Grid, Box } from '@mui/material';
import PositionCard from '../roles/PositionCard';

const JobCard = ({ job }) => {
  const { 
    id, 
    organizationName, 
    companyLogoUrl, 
    jobTitle, 
    jobRefId, 
    jobDescription, 
    salaryRange, 
    experienceLevel, 
    requiredSkills, 
    preferredSkills, 
    benefits, 
    workSchedule, 
    employmentStatus, 
    numberOfOpenings, 
    applicationInstructions, 
    contactEmail, 
    positions,
    department
  } = job;

  const openPositions = positions.filter(position => position.status === 'Open');

  return (
    <Card>
      <CardContent>
        {/* Organization Details */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          {companyLogoUrl && (
            <Box sx={{ mr: 2 }}>
              <img src={companyLogoUrl} alt={`${organizationName} Logo`} width={50} height={50} />
            </Box>
          )}
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {jobTitle} ({jobRefId})
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {organizationName || 'N/A'} - {department || 'N/A'} Department
            </Typography>
          </Box>
        </Box>

        {/* Job Description and Details */}
        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
          {jobDescription || 'N/A'}
        </Typography>
        <Typography variant="body2">
          <strong>Salary Range:</strong> {salaryRange || 'N/A'}
        </Typography>
        <Typography variant="body2">
          <strong>Experience Level:</strong> {experienceLevel ? `${experienceLevel} years` : 'N/A'}
        </Typography>
        <Typography variant="body2">
          <strong>Skills Required:</strong> {requiredSkills || 'N/A'}
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          <strong>Preferred Skills:</strong> {preferredSkills || 'N/A'}
        </Typography>
        <Typography variant="body2">
          <strong>Benefits:</strong> {benefits?.join(', ') || 'N/A'}
        </Typography>
        <Typography variant="body2">
          <strong>Work Schedule:</strong> {workSchedule || 'N/A'}
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          <strong>Employment Status:</strong> {employmentStatus || 'N/A'}
        </Typography>
        <Typography variant="body2">
          <strong>Number of Openings:</strong> {numberOfOpenings || 'N/A'}
        </Typography>
        <Divider sx={{ my: 2 }} />

        {/* Application Instructions */}
        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
          Application Instructions:
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
          {applicationInstructions || 'N/A'}
        </Typography>

        {/* Contact Information */}
        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
          Contact:
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
          Email: {contactEmail ? <a href={`mailto:${contactEmail}`}>{contactEmail}</a> : 'N/A'}
        </Typography>

        {/* Open Positions */}
        <Typography variant="subtitle1" gutterBottom>
          Open Positions ({openPositions.length})
        </Typography>
        <Grid container spacing={2}>
          {openPositions.length > 0 ? (
            openPositions.map((position) => (
              <Grid item xs={12} sm={6} md={4} key={position.positionId}>
                <PositionCard 
                  jobId={id}
                  position={position}
                  jobTitle={jobTitle} // Pass job title if needed
                />
              </Grid>
            ))
          ) : (
            <Typography variant="body1" color="text.secondary">
              No open positions.
            </Typography>
          )}
        </Grid>
      </CardContent>
    </Card>
  );
};

JobCard.propTypes = {
  job: PropTypes.shape({
    id: PropTypes.string.isRequired,
    organizationName: PropTypes.string,
    companyLogoUrl: PropTypes.string,
    jobTitle: PropTypes.string.isRequired,
    jobRefId: PropTypes.string.isRequired,
    jobDescription: PropTypes.string.isRequired,
    salaryRange: PropTypes.string,
    experienceLevel: PropTypes.string,
    requiredSkills: PropTypes.string,
    preferredSkills: PropTypes.string,
    benefits: PropTypes.arrayOf(PropTypes.string),
    workSchedule: PropTypes.string,
    employmentStatus: PropTypes.string,
    numberOfOpenings: PropTypes.number,
    applicationInstructions: PropTypes.string,
    contactEmail: PropTypes.string,
    positions: PropTypes.arrayOf(
      PropTypes.shape({
        positionId: PropTypes.string.isRequired,
        positionCode: PropTypes.string.isRequired,
        status: PropTypes.string.isRequired,
      })
    ).isRequired,
    department: PropTypes.string.isRequired,
  }).isRequired,
};

export default JobCard;