import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Collapse,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Alert,
  CircularProgress,
  Divider,
} from '@mui/material';
import { ExpandMore, ExpandLess, Delete } from '@mui/icons-material';
import AddCandidate from './AddCandidate';
import PropTypes from 'prop-types';
import commonStyles from '../styles/commonStyles';

const PositionCard = ({ jobId, position, jobTitle }) => {
  const [openCandidates, setOpenCandidates] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [openAddCandidate, setOpenAddCandidate] = useState(false);

  const handleToggleCandidates = () => setOpenCandidates(!openCandidates);

  const handleAddCandidatesClose = (newCandidates) => {
    setOpenAddCandidate(false);
    if (newCandidates && newCandidates.length > 0) {
      setCandidates((prev) => [...prev, ...newCandidates]);
      setSuccessMessage(`${newCandidates.length} candidate(s) added successfully!`);
    }
  };

  const handleDeleteCandidate = (candidateId) => {
    setCandidates((prev) => prev.filter((candidate) => candidate.id !== candidateId));
    setSuccessMessage('Candidate removed successfully!');
  };

  return (
    <Box sx={{ ...commonStyles.card, p: 2, mb: 2 }}>
      {/* Position Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography sx={commonStyles.header}>{position.positionCode}</Typography>
        <IconButton onClick={handleToggleCandidates}>
          {openCandidates ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
      </Box>
      <Typography sx={commonStyles.subtitle} mb={1}>
        Status: {position.status}
      </Typography>
      <Divider />

      {/* Success Message */}
      {successMessage && (
        <Alert severity="success" sx={{ mt: 2 }}>
          {successMessage}
        </Alert>
      )}

      {/* Add Candidates Button */}
      <Box mt={2}>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={() => setOpenAddCandidate(true)}
          sx={commonStyles.button}
        >
          Add Candidates
        </Button>
      </Box>

      {/* Candidates Section */}
      <Collapse in={openCandidates} timeout="auto" unmountOnExit>
        <Box mt={2}>
          <Typography sx={commonStyles.sectionTitle}>Sourced Candidates</Typography>
          {loading ? (
            <CircularProgress size={24} sx={{ mt: 2 }} />
          ) : candidates.length > 0 ? (
            <List>
              {candidates.map((candidate) => (
                <ListItem key={candidate.id} divider>
                  <ListItemText
                    primary={candidate.name}
                    secondary={`Email: ${candidate.email}`}
                  />
                  <IconButton edge="end" color="error" onClick={() => handleDeleteCandidate(candidate.id)}>
                    <Delete />
                  </IconButton>
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography sx={commonStyles.subtitle}>No candidates sourced yet.</Typography>
          )}
        </Box>
      </Collapse>

      {/* Add Candidate Modal */}
      <AddCandidate
        open={openAddCandidate}
        handleClose={handleAddCandidatesClose}
        jobId={jobId}
        positionId={position.positionId}
      />
    </Box>
  );
};

PositionCard.propTypes = {
  jobId: PropTypes.string.isRequired,
  position: PropTypes.shape({
    positionId: PropTypes.string.isRequired,
    positionCode: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
  }).isRequired,
  jobTitle: PropTypes.string,
};

export default PositionCard;