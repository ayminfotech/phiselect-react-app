// src/App.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/auth/Login';
import Logout from './components/auth/Logout';
import TenantsOnboard from './components/admin/TenantsOnboard';
import TenantAddPage from './components/admin/TenantAddPage';
import TenantEditPage from './components/admin/TenetEditPage'; // New
import TenantDashboard from './components/admin/TenantDashboard';
import TenantReports from './components/admin/TenetReports'; // New
import ProtectedRoute from './components/common/ProtectedRoute';
import { AuthProvider } from './components/auth/AuthContext';

const App = () => {
  return (
    <AuthProvider>
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
          path="/super-admin/tenets/add"
          element={
            <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
              <TenantAddPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/super-admin/tenets/:tenantId/edit"
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

        {/* Tenant Admin Route */}
        <Route
          path="/tenant/:tenantId/dashboard"
          element={
            <ProtectedRoute allowedRoles={['MANAGER']}>
              <TenantDashboard />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;