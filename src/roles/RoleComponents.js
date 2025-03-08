// src/components/Dashboard/roleComponents.js

// src/components/roles/roleComponents.js

import React, { lazy } from 'react';

// Lazy load role-specific components for performance optimization
const ManagerPanel = lazy(() => import('./ManagerPanel'));
const RecruiterPanel = lazy(() => import('./RecruiterPanel'));
const InterviewerPanel = lazy(() => import('./InterviewerPanel'));
const AdminPanel = lazy(() => import('./AdminPanel'));
const ActiveJobsPanel = lazy(() => import('./ActiveJobsPanel')); // New Component

// Mapping roles to components
const roleComponents = {
  MANAGER: ManagerPanel,
  RECRUITER: RecruiterPanel,
  INTERVIEWER: InterviewerPanel,
  ADMIN: [AdminPanel], // Allow Admin to have multiple components
};

export default roleComponents;