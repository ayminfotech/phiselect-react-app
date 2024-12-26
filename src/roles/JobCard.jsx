// src/components/JobCard.jsx
import React from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Avatar,
  Divider,
} from '@mui/material';
import PositionCard from './PositionCard';
import commonStyles from '../styles/commonStyles';

const JobCard = ({ job }) => {
  const {
    jobId, // Ensure jobId is included
    organizationName,
    companyLogoUrl,
    jobTitle,
    jobRefId,
    jobDescription,
    salaryRange,
    requiredSkills,
    benefits,
    numberOfOpenings,
    positions,
  } = job;

  const openPositions = positions?.filter((position) => position.status === 'Open') || [];

  return (
    <Card sx={commonStyles.card}>
      <CardContent>
        {/* Header */}
        <Box display="flex" alignItems="center" mb={2}>
          {companyLogoUrl ? (
            <Avatar
              src={companyLogoUrl}
              alt={`${organizationName} Logo`}
              sx={{ width: 60, height: 60, mr: 2 }}
            />
          ) : (
            <Avatar sx={{ width: 60, height: 60, mr: 2 }}>
              {organizationName?.charAt(0) || 'N/A'}
            </Avatar>
          )}
          <Box>
            <Typography variant="h6" sx={commonStyles.header}>
              {jobTitle} <Typography component="span" color="text.secondary">({jobRefId})</Typography>
            </Typography>
            <Typography sx={commonStyles.subtitle}>
              {organizationName || 'N/A'}
            </Typography>
          </Box>
        </Box>

        {/* Job Description */}
        <Divider sx={{ my: 2 }} />
        <Typography variant="body2" color="text.secondary" paragraph>
          <strong>Description:</strong> {jobDescription || 'No description provided.'}
        </Typography>

        {/* Job Details */}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2">
              <strong>Salary:</strong> {salaryRange || 'N/A'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2">
              <strong>Openings:</strong> {numberOfOpenings || 'N/A'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2">
              <strong>Required Skills:</strong> {requiredSkills || 'N/A'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2">
              <strong>Benefits:</strong> {benefits?.join(', ') || 'N/A'}
            </Typography>
          </Grid>
        </Grid>

        {/* Open Positions */}
        <Box mt={3}>
          <Typography sx={commonStyles.sectionTitle}>
            Open Positions ({openPositions.length})
          </Typography>
          {openPositions.length > 0 ? (
            <Grid container spacing={2} mt={1}>
              {openPositions.map((position) => (
                <Grid item xs={12} sm={6} key={position.positionId}>
                  <PositionCard jobId={jobId} position={position} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography sx={commonStyles.subtitle} mt={1}>
              No open positions available.
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

JobCard.propTypes = {
  job: PropTypes.shape({
    jobId: PropTypes.string.isRequired, // Ensure jobId is present
    organizationName: PropTypes.string,
    companyLogoUrl: PropTypes.string,
    jobTitle: PropTypes.string.isRequired,
    jobRefId: PropTypes.string.isRequired,
    jobDescription: PropTypes.string,
    salaryRange: PropTypes.string,
    requiredSkills: PropTypes.string,
    benefits: PropTypes.arrayOf(PropTypes.string),
    numberOfOpenings: PropTypes.number,
    positions: PropTypes.arrayOf(
      PropTypes.shape({
        positionId: PropTypes.string.isRequired,
        positionCode: PropTypes.string.isRequired,
        status: PropTypes.string.isRequired,
        // Add other position fields as necessary
      })
    ),
  }).isRequired,
};

export default JobCard;