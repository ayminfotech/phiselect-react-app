import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Divider,
  TextField,
  MenuItem,
  Button,
  IconButton,
  Tooltip,
  Grid,
  Avatar,
  InputAdornment,
  CircularProgress,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Pagination from '@mui/material/Pagination';
import Rating from '@mui/material/Rating';

const dummyCandidates = Array.from({ length: 100 }, (_, index) => ({
  id: `${index + 1}`,
  name: `Candidate ${index + 1}`,
  email: `candidate${index + 1}@example.com`,
  interviewDate: `2024-12-${Math.floor(Math.random() * 30) + 1}`,
  round: '',
  feedback: '',
  notes: '',
  skills: [
    { name: 'JavaScript', rating: Math.floor(Math.random() * 5) + 1 },
    { name: 'React', rating: Math.floor(Math.random() * 5) + 1 },
    { name: 'Problem Solving', rating: Math.floor(Math.random() * 5) + 1 },
  ],
}));

const PAGE_SIZE = 10;

const InterviewerPanel = () => {
  const [candidates, setCandidates] = useState(dummyCandidates);
  const [filteredCandidates, setFilteredCandidates] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [view, setView] = useState('list'); // 'list' or 'details'
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    filterCandidates();
  }, [searchQuery, candidates]);

  const filterCandidates = () => {
    const filtered = candidates.filter(
      (candidate) =>
        candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        candidate.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCandidates(filtered);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleViewCandidate = (candidate) => {
    setSelectedCandidate(candidate);
    setView('details');
  };

  const handleBackToList = () => {
    setView('list');
    setSelectedCandidate(null);
  };

  const renderCandidateList = () => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const paginatedCandidates = filteredCandidates.slice(
      startIndex,
      startIndex + PAGE_SIZE
    );

    return (
      <Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
          }}
        >
          <TextField
            placeholder="Search by name or email"
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <Typography variant="body2">
            Showing {filteredCandidates.length} candidates
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {paginatedCandidates.map((candidate) => (
            <Grid item xs={12} sm={6} md={4} key={candidate.id}>
              <Paper
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  transition: 'all 0.3s ease',
                  '&:hover': { boxShadow: 4, backgroundColor: '#fafafa' },
                }}
              >
                <Avatar sx={{ mb: 2 }}>
                  <PersonIcon />
                </Avatar>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                  {candidate.name}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {candidate.email}
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                  Interview Date: {candidate.interviewDate}
                </Typography>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => handleViewCandidate(candidate)}
                  sx={{ textTransform: 'none' }}
                >
                  View Details
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Box display="flex" justifyContent="center" mt={3}>
          <Pagination
            count={Math.ceil(filteredCandidates.length / PAGE_SIZE)}
            page={currentPage}
            onChange={handlePageChange}
          />
        </Box>
      </Box>
    );
  };

  const renderCandidateDetails = () => (
    <Box>
      <Box display="flex" alignItems="center" mb={2}>
        <IconButton onClick={handleBackToList}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" sx={{ fontWeight: 'bold', ml: 1 }}>
          {selectedCandidate.name}
        </Typography>
      </Box>
      <Divider sx={{ mb: 3 }} />
      <Typography variant="body1" sx={{ mb: 2 }}>
        <strong>Email:</strong> {selectedCandidate.email}
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        <strong>Interview Date:</strong> {selectedCandidate.interviewDate}
      </Typography>
      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
        Skill Set
      </Typography>
      {selectedCandidate.skills.map((skill) => (
        <Box
          key={skill.name}
          display="flex"
          alignItems="center"
          sx={{ mb: 1 }}
        >
          <Typography sx={{ flex: 1 }}>{skill.name}</Typography>
          <Rating value={skill.rating} readOnly precision={0.5} />
        </Box>
      ))}
      <Divider sx={{ my: 3 }} />
      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
        Feedback
      </Typography>
      <TextField
        label="Your Feedback"
        variant="outlined"
        fullWidth
        multiline
        rows={3}
        placeholder="Enter your feedback here..."
        sx={{ mb: 2 }}
      />
      <TextField
        label="Additional Notes (Optional)"
        variant="outlined"
        fullWidth
        multiline
        rows={3}
        placeholder="Enter any additional notes here..."
        sx={{ mb: 3 }}
      />
      <Button
        variant="contained"
        color="primary"
        sx={{ textTransform: 'none', fontWeight: 'bold' }}
      >
        Submit Feedback
      </Button>
    </Box>
  );

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        bgcolor: (theme) => theme.palette.background.paper,
        borderRadius: 2,
      }}
    >
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
        Interviewer Panel
      </Typography>
      <Typography variant="subtitle2" color="textSecondary" gutterBottom>
        Manage your assigned candidates efficiently.
      </Typography>
      <Divider sx={{ mb: 3 }} />
      {view === 'list' ? renderCandidateList() : renderCandidateDetails()}
    </Paper>
  );
};

export default InterviewerPanel;