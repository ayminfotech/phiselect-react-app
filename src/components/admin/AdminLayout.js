import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import TenantList from './TenantList';
import TenantRegistration from './TenantRegistration';
import OrganizationCRUD from './OrganizationCRUD';
import Dashboard from './TenantsOnboard';

const AdminLayout = () => {
    return (
        <div>
            <h1>Admin Panel</h1>
            <Routes>
                <Route path="/" element={<Navigate to="/admin/dashboard" />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/tenants" element={<TenantList />} />
                <Route path="/tenants/register" element={<TenantRegistration />} />
                <Route path="/organizations" element={<OrganizationCRUD />} />
            </Routes>
        </div>
    );
};

export default AdminLayout; // Ensure this line exists