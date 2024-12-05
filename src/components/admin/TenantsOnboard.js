// src/components/admin/TenetsOnboard.js
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
        setTenets(data);
      } catch (error) {
        console.error('Error fetching tenets:', error);
      }
    };
    fetchTenets();
  }, []);

  const handleAddTenet = () => {
    navigate('/super-admin/tenets/add');
  };

  const handleDeleteTenet = async (tenetId) => {
    try {
      await deleteTenet(tenetId);
      setTenets((prev) => prev.filter((t) => t.id !== tenetId));
      alert('Tenet deleted successfully.');
    } catch (error) {
      console.error('Error deleting tenet:', error);
      alert('Failed to delete tenet. Please try again.');
    }
  };

  const handleActivateTenet = async (tenetId) => {
    try {
      await activateTenet(tenetId);
      setTenets((prev) =>
        prev.map((t) =>
          t.id === tenetId ? { ...t, status: 'Active' } : t
        )
      );
      alert('Tenet activated successfully.');
    } catch (error) {
      console.error('Error activating tenet:', error);
      alert('Failed to activate tenet. Please try again.');
    }
  };

  const handleDeactivateTenet = async (tenetId) => {
    try {
      await deactivateTenet(tenetId);
      setTenets((prev) =>
        prev.map((t) =>
          t.id === tenetId ? { ...t, status: 'Inactive' } : t
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
            tenets={tenets}
            onDeleteTenet={handleDeleteTenet}
            onActivateTenet={handleActivateTenet}
            onDeactivateTenet={handleDeactivateTenet}
          />
        </section>
      </main>
    </div>
  );
};

export default TenetsOnboard;