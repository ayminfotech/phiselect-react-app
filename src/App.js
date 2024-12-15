// src/App.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/auth/Login';
import Logout from './components/auth/Logout';
import TenantsOnboard from './components/admin/TenantsOnboard';
import TenantAddPage from './components/admin/TenantAddPage';
import TenantEditPage from './components/admin/TenantEditPage'; // Corrected spelling
import TenantDashboard from './components/admin/TenantDashboard';
import TenantReports from './components/admin/TenantReports'; // Corrected spelling
import ProtectedRoute from './components/common/ProtectedRoute';
import TenantsListPage from './components/admin/TenantsListPage';

const App = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/logout" element={<Logout />} />

      {/* Super Admin Routes */}
      <Route
        path="/onboard"
        element={
          <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
            <TenantsOnboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/super-admin/tenants"
        element={
          <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
            <TenantsListPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/super-admin/tenants/add"
        element={
          <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
            <TenantAddPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/super-admin/tenants/:id/edit"
        element={
          <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
            <TenantEditPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/super-admin/reports"
        element={
          <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
            <TenantReports />
          </ProtectedRoute>
        }
      />

      {/* Tenant Admin Route with Multiple Roles */}
      <Route
        path="/tenant/:tenantId/dashboard"
        element={   
          <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER', 'INTERVIEWER', 'RECRUITER']}>
            <TenantDashboard />
          </ProtectedRoute>
        }
      />

      {/* Fallback Route */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default App;