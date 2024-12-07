// src/components/admin/TenantsListPage.js
import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext';
import { getAllTenets } from '../../services/TenantService';
import './TenantsListPage.css';

const TenantsListPage = () => {
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const data = await getAllTenets();
        setTenants(data);
      } catch (error) {
        console.error('Error fetching tenants:', error);
        alert('Failed to load tenants.');
      } finally {
        setLoading(false);
      }
    };
    fetchTenants();
  }, []);

  if (loading) {
    return <div className="loader">Loading tenants...</div>;
  }

  return (
    <div className="tenants-list-page">
      <header className="tenants-list-page__header">
        <h2>Tenants</h2>
        <button
          onClick={() => navigate('/super-admin/tenants/add')}
          className="button button--primary"
        >
          <i className="fas fa-plus"></i> Add New Tenant
        </button>
      </header>
      <div className="tenants-list-page__table-container">
        <table className="tenants-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Status</th>
              <th className="actions-column">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tenants.map((tenant) => (
              <tr key={tenant.id}>
                <td>{tenant.name}</td>
                <td>{tenant.email}</td>
                <td>{tenant.phone}</td>
                <td>
                  <span
                    className={`status-badge ${
                      tenant.active ? 'status-active' : 'status-inactive'
                    }`}
                  >
                    {tenant.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>
                  <button
                    onClick={() => navigate(`/super-admin/tenants/${tenant.id}/edit`)}
                    className="button button--secondary"
                  >
                    <i className="fas fa-edit"></i> Edit
                  </button>
                  <button
                    onClick={() => navigate(`/super-admin/tenants/${tenant.id}/reports`)}
                    className="button button--info"
                  >
                    <i className="fas fa-chart-bar"></i> Reports
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TenantsListPage;