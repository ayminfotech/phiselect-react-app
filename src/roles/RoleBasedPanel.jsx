// src/components/roles/RoleBasedPanel.jsx

import React, { Suspense } from 'react';
import PropTypes from 'prop-types';
import roleComponents from './RoleComponents';
import { CircularProgress, Box } from '@mui/material';

const LoadingFallback = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', padding: 2 }}>
    <CircularProgress />
  </Box>
);

const RoleBasedPanel = ({ roles, ...props }) => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      {roles.map((role) => {
        const SpecificComponents = roleComponents[role];
        if (Array.isArray(SpecificComponents)) {
          return SpecificComponents.map((Component, index) => (
            <Box key={`${role}-${index}`} sx={{ marginBottom: 4 }}>
              <Component {...props} />
            </Box>
          ));
        } else if (SpecificComponents) {
          return (
            <Box key={role} sx={{ marginBottom: 4 }}>
              <SpecificComponents {...props} />
            </Box>
          );
        } else {
          return null;
        }
      })}
    </Suspense>
  );
};

RoleBasedPanel.propTypes = {
  roles: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default RoleBasedPanel;