// src/components/admin/TenantsListPage.js
import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext';
import { getAllTenets } from '../../services/TenantService'; // Assuming this service exists
import './TenantsListPage.css';
const TenantsListPage = () => {
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const data = await getAllTenets(); // Fetch all tenants
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
    return <div>Loading tenants...</div>;
  }

  return (
    <div className="tenants-list-page">
      <h2>Tenants</h2>
      <button onClick={() => navigate('/super-admin/tenants/add')} className="primary-button">
        Add New Tenant
      </button>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tenants.map((tenant) => (
            <tr key={tenant.id}>
              <td>{tenant.name}</td>
              <td>{tenant.email}</td>
              <td>{tenant.phone}</td>
              <td>{tenant.active ? 'Active' : 'Inactive'}</td>
              <td>
                <button onClick={() => navigate(`/super-admin/tenants/${tenant.id}/edit`)} className="secondary-button">
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TenantsListPage;