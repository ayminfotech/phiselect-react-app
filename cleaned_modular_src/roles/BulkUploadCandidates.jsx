// src/components/roles/BulkUploadCandidates.jsx
import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Alert, 
  CircularProgress 
} from '@mui/material';
import UploadIcon from '@mui/icons-material/Upload';
import Papa from 'papaparse';
import { bulkCreateCandidates } from '../services/candidateService';

const BulkUploadCandidates = ({ onSuccess }) => {
  const [bulkUploading, setBulkUploading] = useState(false);
  const [bulkError, setBulkError] = useState(null);
  const [bulkSuccess, setBulkSuccess] = useState(null);

  const handleBulkUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setBulkUploading(true);
    setBulkError(null);
    setBulkSuccess(null);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const data = results.data;
        // Validate required fields
        const requiredFields = ['firstName', 'lastName', 'email', 'phoneNumber', 'tenantId'];
        const isValid = data.every(row => requiredFields.every(field => row[field] && row[field].trim() !== ''));
        if (!isValid) {
          setBulkError('CSV file is missing required fields.');
          setBulkUploading(false);
          return;
        }

        // Prepare bulk request
        const bulkRequest = {
          jobId: 'JOB-12345', // Replace with dynamic jobId if needed
          positionId: 'POS-67890', // Replace with dynamic positionId if needed
          candidates: data.map(row => ({
            firstName: row.firstName,
            lastName: row.lastName,
            email: row.email,
            phoneNumber: row.phoneNumber,
            currentCompany: row.currentCompany || '',
            previousCompanies: row.previousCompanies || '',
            skillSet: row.skillSet || '',
            appliedJobIds: ['JOB-12345'], // Replace with dynamic jobId if needed
            jobRefIds: ['POS-67890'], // Replace with dynamic positionId if needed
            tenantId: row.tenantId,
            panCardNumber: row.panCardNumber || '',
          })),
        };

        try {
          const createdCandidates = await bulkCreateCandidates(bulkRequest);
          setBulkSuccess(`${createdCandidates.length} candidates successfully created.`);
          if (onSuccess) onSuccess(createdCandidates);
        } catch (err) {
          setBulkError(err.message || 'Failed to bulk create candidates.');
        } finally {
          setBulkUploading(false);
        }
      },
      error: (err) => {
        setBulkError('Error parsing CSV file.');
        setBulkUploading(false);
      }
    });
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
        Bulk Upload Candidates
      </Typography>
      <Button
        variant="outlined"
        component="label"
        startIcon={<UploadIcon />}
        disabled={bulkUploading}
      >
        Upload CSV
        <input
          type="file"
          accept=".csv"
          hidden
          onChange={handleBulkUpload}
        />
      </Button>
      {bulkUploading && <CircularProgress size={24} sx={{ ml: 2 }} />}
      {bulkError && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {bulkError}
        </Alert>
      )}
      {bulkSuccess && (
        <Alert severity="success" sx={{ mt: 2 }}>
          {bulkSuccess}
        </Alert>
      )}
      <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
        CSV format: Each row should have "firstName", "lastName", "email", "phoneNumber", and "tenantId" columns. Example:
        <pre>
          firstName,lastName,email,phoneNumber,tenantId,panCardNumber
          John,Doe,john.doe@example.com,1234567890,TENANT-001,ABCDE1234F
          Jane,Smith,jane.smith@example.com,0987654321,TENANT-001,FGHIJ5678K
          {/* Add more rows as needed */}
        </pre>
      </Typography>
    </Box>
  );
};

export default BulkUploadCandidates;