// src/components/roles/PositionCard.jsx

import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  TextField, 
  Tooltip,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  InputAdornment,
  Collapse,
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SearchIcon from '@mui/icons-material/Search';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import PropTypes from 'prop-types';
import { sourceCandidate, getCandidatesByPosition, searchCandidates } from '../services/candidateService';
import AddCandidate from './AddCandidate';

const PositionCard = ({ jobId, position, jobTitle }) => {
  const [candidateName, setCandidateName] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [sourcing, setSourcing] = useState(false);
  const [loadingCandidates, setLoadingCandidates] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [openAddCandidate, setOpenAddCandidate] = useState(false);
  const [openCandidates, setOpenCandidates] = useState(false); // State to control candidates section

  const fetchCandidates = async (query = '') => {
    setLoadingCandidates(true);
    try {
      const fetchedCandidates = await getCandidatesByPosition(jobId, position.positionId, query);
      setCandidates(fetchedCandidates);
    } catch (err) {
      setError(err.message || 'Failed to fetch candidates');
    } finally {
      setLoadingCandidates(false);
    }
  };

  const handleSourceCandidate = async () => {
    if (candidateName.trim()) {
      setSourcing(true);
      setError(null);
      try {
        const newCandidate = await sourceCandidate(jobId, position.positionId, candidateName.trim());
        setCandidates((prev) => [...prev, newCandidate]);
        setCandidateName('');
      } catch (err) {
        setError(err.message || 'Failed to source candidate');
      } finally {
        setSourcing(false);
      }
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearching(true);
    try {
      const searchedCandidates = await searchCandidates(jobId, position.positionId, searchQuery.trim());
      setCandidates(searchedCandidates);
    } catch (err) {
      setError(err.message || 'Failed to search candidates');
    } finally {
      setSearching(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    fetchCandidates();
  };

  const handleOpenAddCandidate = () => {
    setOpenAddCandidate(true);
  };

  const handleCloseAddCandidate = (createdCandidate) => {
    setOpenAddCandidate(false);
    if (createdCandidate) {
      setCandidates((prev) => [...prev, createdCandidate]);
    }
  };

  const toggleCandidates = () => {
    if (!openCandidates) {
      // Fetch candidates only when expanding
      fetchCandidates();
    }
    setOpenCandidates(!openCandidates);
  };

  return (
    <Box
      sx={{
        p: 2,
        border: '1px solid #ddd',
        borderRadius: 2,
        backgroundColor: '#fff',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header with Position Code and Toggle Button */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          {position.positionCode}
        </Typography>
        <Button
          size="small"
          onClick={toggleCandidates}
          startIcon={openCandidates ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        >
          {openCandidates ? 'Hide Candidates' : 'View Candidates'}
        </Button>
      </Box>
      <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
        Status: {position.status}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 1 }}>
          {error}
        </Alert>
      )}

      {/* Sourcing Section */}
      <Box sx={{ mt: 1 }}>
        <TextField
          label="Candidate Name"
          variant="outlined"
          value={candidateName}
          onChange={(e) => setCandidateName(e.target.value)}
          fullWidth
          placeholder="e.g., Jane Doe"
          size="small"
          InputProps={{
            endAdornment: (
              <Tooltip title="Enter the candidate’s full name.">
                <PersonAddIcon color="action" />
              </Tooltip>
            ),
          }}
        />
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleSourceCandidate}
          sx={{ mt: 1, fontWeight: 'bold', whiteSpace: 'nowrap' }}
          disabled={sourcing}
          fullWidth
        >
          {sourcing ? <CircularProgress size={24} /> : 'Source Candidate'}
        </Button>
        <Button 
          variant="outlined" 
          color="secondary" 
          onClick={handleOpenAddCandidate}
          sx={{ mt: 1, fontWeight: 'bold', whiteSpace: 'nowrap' }}
          fullWidth
        >
          Add Candidate
        </Button>
      </Box>

      {/* Search Section */}
      <Box component="form" onSubmit={handleSearch} sx={{ mt: 2 }}>
        <TextField
          label="Search Candidates"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          fullWidth
          placeholder="Search by name..."
          size="small"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Tooltip title="Search candidates by name">
                  <SearchIcon />
                </Tooltip>
              </InputAdornment>
            ),
          }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
          <Button 
            variant="contained" 
            color="secondary" 
            onClick={handleClearSearch}
            disabled={!searchQuery}
            sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}
          >
            Clear
          </Button>
          <Button 
            type="submit"
            variant="contained" 
            color="primary" 
            disabled={searching}
            sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}
          >
            {searching ? <CircularProgress size={24} /> : 'Search'}
          </Button>
        </Box>
      </Box>

      {/* Candidates List */}
      <Collapse in={openCandidates} timeout="auto" unmountOnExit>
        <Box sx={{ mt: 2, flexGrow: 1, overflowY: 'auto' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
            Sourced Candidates
          </Typography>
          {loadingCandidates ? (
            <CircularProgress size={24} />
          ) : candidates.length > 0 ? (
            <List dense>
              {candidates.map((candidate) => (
                <ListItem key={candidate.id}>
                  <ListItemText 
                    primary={candidate.firstName + ' ' + candidate.lastName} 
                    secondary={`Email: ${candidate.email} | Phone: ${candidate.phoneNumber}`}
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No candidates sourced yet.
            </Typography>
          )}
        </Box>
      </Collapse>

      {/* AddCandidate Component */}
      <AddCandidate 
        open={openAddCandidate} 
        handleClose={handleCloseAddCandidate} 
        jobId={jobId} 
        positionId={position.positionId} 
      />
    </Box>
  ); // End of return

}; // End of PositionCard component

PositionCard.propTypes = {
  jobId: PropTypes.string.isRequired,
  position: PropTypes.shape({
    positionId: PropTypes.string.isRequired,
    positionCode: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
  }).isRequired,
  jobTitle: PropTypes.string, // Optional prop
};

export default PositionCard;