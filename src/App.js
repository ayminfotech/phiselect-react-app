import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/auth/Login';
import Logout from './components/auth/Logout';
import TenantsOnboard from './components/admin/TenantsOnboard';
import TenantAddPage from './components/admin/TenantAddPage';
import TenantDashboard from './components/admin/TenantDashboard';
import ProtectedRoute from './components/common/ProtectedRoute';
import { AuthProvider } from './components/auth/AuthContext';

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Route */}
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
          path="/super-admin/tenants/add" 
          element={
            <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
              <TenantAddPage />
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