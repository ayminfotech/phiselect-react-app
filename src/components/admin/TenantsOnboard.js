// src/components/admin/TenantsOnboard.js
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getAllTenets,
  deleteTenet,
  activateTenet,
  deactivateTenet,
} from '../../services/TenantService';
import { AuthContext } from '../auth/AuthContext';
import TenetSidebar from './TenantSidebar';
import TenetList from './TenantList';
import './TenantsOnboard.css'; // Updated path

const TenantsOnboard = () => {
  const [tenants, setTenants] = useState([]);
  const [activeItem, setActiveItem] = useState('tenets');
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const data = await getAllTenets();
        console.log('Fetched Tenants:', data);
        setTenants(data);
      } catch (error) {
        console.error('Error fetching tenants:', error);
        alert('Failed to fetch tenants. Please try again later.');
      }
    };
    fetchTenants();
  }, []);

  const handleAddTenant = () => {
    navigate('/super-admin/tenants/add');
  };

  const handleEditTenant = (id) => {
    if (!id) {
      console.error('Invalid organization id:', id);
      alert('Cannot navigate to edit page. Invalid organization ID.');
      return;
    }
    console.log('Navigating to edit tenant with Organization ID:', id);
    navigate(`/super-admin/tenants/${id}/edit`);
  };

  const handleDeleteTenant = async (tenantId) => {
    if (!window.confirm('Are you sure you want to delete this tenant?')) return;

    try {
      await deleteTenet(tenantId);
      setTenants((prev) => prev.filter((t) => t.id !== tenantId));
      alert('Tenant deleted successfully.');
    } catch (error) {
      console.error('Error deleting tenant:', error);
      alert('Failed to delete tenant. Please try again.');
    }
  };

  const handleActivateTenant = async (tenantId) => {
    try {
      await activateTenet(tenantId);
      setTenants((prev) =>
        prev.map((t) =>
          t.id === tenantId ? { ...t, active: true } : t
        )
      );
      alert('Tenant activated successfully.');
    } catch (error) {
      console.error('Error activating tenant:', error);
      alert('Failed to activate tenant. Please try again.');
    }
  };

  const handleDeactivateTenant = async (tenantId) => {
    try {
      await deactivateTenet(tenantId);
      setTenants((prev) =>
        prev.map((t) =>
          t.id === tenantId ? { ...t, active: false } : t
        )
      );
      alert('Tenant deactivated successfully.');
    } catch (error) {
      console.error('Error deactivating tenant:', error);
      alert('Failed to deactivate tenant. Please try again.');
    }
  };

  return (
    <div className="tenants-onboard">
      <TenetSidebar
        activeItem={activeItem}
        onMenuClick={setActiveItem}
        onLogout={logout}
      />
      <main className="tenants-onboard__content">
        <header className="tenants-onboard__header">
          <h1>Manage Tenants</h1>
          <button className="button button--primary" onClick={handleAddTenant}>
            <i className="fas fa-plus"></i> Add Tenant
          </button>
        </header>
        <section className="tenants-onboard__list">
          <TenetList
            tenants={tenants}
            onEditTenant={handleEditTenant}
            onDeleteTenant={handleDeleteTenant}
            onActivateTenant={handleActivateTenant}
            onDeactivateTenant={handleDeactivateTenant}
          />
        </section>
      </main>
    </div>
  );
};

export default TenantsOnboard;