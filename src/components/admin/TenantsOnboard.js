// src/components/admin/TenetsOnboard.js
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getAllTenets,
  deleteTenet,
  activateTenet,
  deactivateTenet,
} from '../../services/TenantService'; // Corrected import: handleEditTenant removed
import { AuthContext } from '../auth/AuthContext';
import TenetSidebar from './TenantSidebar';
import TenetList from './TenantList';
import './TenantsOnboard.css';

const TenetsOnboard = () => {
  const [tenets, setTenets] = useState([]);
  const [activeItem, setActiveItem] = useState('Tenets');
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    const fetchTenets = async () => {
      try {
        const data = await getAllTenets();
        console.log('Fetched Tenets:', data); // Debugging line
        setTenets(data);
      } catch (error) {
        console.error('Error fetching tenets:', error);
        alert('Failed to fetch tenets. Please try again later.');
      }
    };
    fetchTenets();
  }, []);

  const handleAddTenet = () => {
    navigate('/super-admin/tenants/add');
  };

  /**
    * Handles navigation to the Edit Tenet page using id.
    * @param {String} id - UUID of the organization.
    */
  const handleEditTenant = (id) => {
    if (!id) {
      console.error('Invalid organization id:', id);
      alert('Cannot navigate to edit page. Invalid organization ID.');
      return;
    }
    console.log('Navigating to edit tenant with Organization ID:', id);
    navigate(`/super-admin/tenants/${id}/edit`);
  };

  /**
   * Handles deletion of a tenet.
   * @param {String} tenetId - ID of the tenet to delete.
   */
  const handleDeleteTenet = async (tenetId) => {
    if (!window.confirm('Are you sure you want to delete this tenet?')) return;

    try {
      await deleteTenet(tenetId);
      setTenets((prev) => prev.filter((t) => t.id !== tenetId));
      alert('Tenet deleted successfully.');
    } catch (error) {
      console.error('Error deleting tenet:', error);
      alert('Failed to delete tenet. Please try again.');
    }
  };

  /**
   * Handles activation of a tenet.
   * @param {String} tenetId - ID of the tenet to activate.
   */
  const handleActivateTenet = async (tenetId) => {
    try {
      await activateTenet(tenetId);
      setTenets((prev) =>
        prev.map((t) =>
          t.id === tenetId ? { ...t, active: 'true' } : t
        )
      );
      alert('Tenet activated successfully.');
    } catch (error) {
      console.error('Error activating tenet:', error);
      alert('Failed to activate tenet. Please try again.');
    }
  };

  /**
   * Handles deactivation of a tenet.
   * @param {String} tenetId - ID of the tenet to deactivate.
   */
  const handleDeactivateTenet = async (tenetId) => {
    try {
      await deactivateTenet(tenetId);
      setTenets((prev) =>
        prev.map((t) =>
          t.id === tenetId ? { ...t, active: 'false' } : t
        )
      );
      alert('Tenet deactivated successfully.');
    } catch (error) {
      console.error('Error deactivating tenet:', error);
      alert('Failed to deactivate tenet. Please try again.');
    }
  };

  return (
    <div className="tenets-onboard-container">
      <TenetSidebar
        activeItem={activeItem}
        onMenuClick={setActiveItem}
        onLogout={logout}
      />
      <main className="content">
        <header className="header">
          <h1>Manage Tenets</h1>
          <button className="primary-button" onClick={handleAddTenet}>
            Add Tenet
          </button>
        </header>
        <section className="tenet-list-container">
          <TenetList
            tenants={tenets}
            onEditTenant={handleEditTenant}
            onDeleteTenant={handleDeleteTenet}
            onActivateTenant={handleActivateTenet}
            onDeactivateTenant={handleDeactivateTenet}
          />
        </section>
      </main>
    </div>
  );
};

export default TenetsOnboard;