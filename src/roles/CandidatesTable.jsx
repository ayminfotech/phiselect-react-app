// src/components/CandidatesTable.jsx

import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Checkbox, CircularProgress, Alert, TextField, InputAdornment, IconButton,
  Toolbar, Typography, Tooltip, Button
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { getAllCandidates } from '../services/candidateService';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  tableContainer: {
    maxHeight: 500,
  },
});

const CandidatesTable = ({ onSelectionChange }) => {
  const classes = useStyles();
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCandidates, setSelectedCandidates] = useState([]);

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllCandidates();
      setCandidates(data);
    } catch (err) {
      console.error('Error fetching candidates:', err);
      setError('Failed to load candidates.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredCandidates = candidates.filter((candidate) => {
    const fullName = `${candidate.firstName} ${candidate.lastName}`.toLowerCase();
    return (
      fullName.includes(searchQuery.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = filteredCandidates.map((n) => n.id);
      setSelectedCandidates(newSelecteds);
      onSelectionChange(newSelecteds);
      return;
    }
    setSelectedCandidates([]);
    onSelectionChange([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selectedCandidates.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedCandidates, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedCandidates.slice(1));
    } else if (selectedIndex === selectedCandidates.length - 1) {
      newSelected = newSelected.concat(selectedCandidates.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedCandidates.slice(0, selectedIndex),
        selectedCandidates.slice(selectedIndex + 1),
      );
    }

    setSelectedCandidates(newSelected);
    onSelectionChange(newSelected);
  };

  const isSelected = (id) => selectedCandidates.indexOf(id) !== -1;

  return (
    <Paper>
      {/* Toolbar */}
      <Toolbar>
        {selectedCandidates.length > 0 ? (
          <Typography sx={{ flex: '1 1 100%' }} color="inherit" variant="subtitle1" component="div">
            {selectedCandidates.length} selected
          </Typography>
        ) : (
          <Typography sx={{ flex: '1 1 100%' }} variant="h6" id="tableTitle" component="div">
            Candidates
          </Typography>
        )}

        {/* Batch Schedule Button */}
        {selectedCandidates.length > 0 && (
          <Tooltip title="Schedule Interviews">
            <Button variant="contained" color="primary">
              Schedule Interviews
            </Button>
          </Tooltip>
        )}
      </Toolbar>

      {/* Search Bar */}
      <TextField
        variant="outlined"
        placeholder="Search by name or email"
        value={searchQuery}
        onChange={handleSearchChange}
        fullWidth
        margin="normal"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      {/* Loading and Error States */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      ) : (
        <TableContainer className={classes.tableContainer}>
          <Table stickyHeader aria-label="candidates table">
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={selectedCandidates.length > 0 && selectedCandidates.length < filteredCandidates.length}
                    checked={filteredCandidates.length > 0 && selectedCandidates.length === filteredCandidates.length}
                    onChange={handleSelectAllClick}
                    inputProps={{ 'aria-label': 'select all candidates' }}
                  />
                </TableCell>
                <TableCell>ID</TableCell>
                <TableCell>First Name</TableCell>
                <TableCell>Last Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone Number</TableCell>
                <TableCell>Current Company</TableCell>
                <TableCell>Skills</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCandidates.map((candidate) => {
                const isItemSelected = isSelected(candidate.id);
                const labelId = `enhanced-table-checkbox-${candidate.id}`;

                return (
                  <TableRow
                    hover
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={candidate.id}
                    selected={isItemSelected}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        onClick={(event) => handleClick(event, candidate.id)}
                        color="primary"
                        checked={isItemSelected}
                        inputProps={{
                          'aria-labelledby': labelId,
                        }}
                      />
                    </TableCell>
                    <TableCell>{candidate.id}</TableCell>
                    <TableCell>{candidate.firstName}</TableCell>
                    <TableCell>{candidate.lastName}</TableCell>
                    <TableCell>{candidate.email}</TableCell>
                    <TableCell>{candidate.phoneNumber}</TableCell>
                    <TableCell>{candidate.currentCompany}</TableCell>
                    <TableCell>{candidate.skillSet}</TableCell>
                    <TableCell>
                      {/* Add individual actions if needed */}
                      {/* Example: <Button size="small">View</Button> */}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  );
};

CandidatesTable.propTypes = {
  onSelectionChange: PropTypes.func.isRequired,
};

export default CandidatesTable;