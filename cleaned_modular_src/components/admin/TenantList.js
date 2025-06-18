// src/components/admin/TenantList.js
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ConfirmDialog from './ConfirmDialog';
import './TenantList.css'; // Corrected CSS filename

const TenantList = ({
  tenants,
  onEditTenant,
  onDeleteTenant,
  onActivateTenant,
  onDeactivateTenant,
}) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [tenantToDelete, setTenantToDelete] = useState(null);

  const handleDeleteClick = (tenantId) => {
    setTenantToDelete(tenantId);
    setShowConfirm(true);
  };

  const handleConfirmDelete = () => {
    onDeleteTenant(tenantToDelete);
    setShowConfirm(false);
    setTenantToDelete(null);
  };

  const handleCancelDelete = () => {
    setShowConfirm(false);
    setTenantToDelete(null);
  };

  return (
    <div className="tenant-list-container">
      {showConfirm && (
        <ConfirmDialog
          title="Delete Tenant"
          message="Are you sure you want to delete this tenant? This action cannot be undone."
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
      <table className="tenant-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Status</th>
            <th className="actions-header">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tenants.length > 0 ? (
            tenants.map((tenant) => (
              <tr key={tenant.id}>
                <td className="tenant-name">{tenant.name}</td>
                <td>
                  <span
                    className={`status-badge ${
                      tenant.active === "true" ? 'active' : 'inactive'
                    }`}
                  >
                    {tenant.active === "true" ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="actions-cell">
                  {/* Edit Button */}
                  <button
                    className="action-button edit-button"
                    onClick={() => onEditTenant(tenant.id)}
                    aria-label={`Edit ${tenant.name}`}
                  >
                    <i className="fas fa-edit"></i> Edit
                  </button>

                  {/* Delete Button */}
                  <button
                    className="action-button delete-button"
                    onClick={() => handleDeleteClick(tenant.id)}
                    aria-label={`Delete ${tenant.name}`}
                  >
                    <i className="fas fa-trash-alt"></i> Delete
                  </button>

                  {/* Activate/Deactivate Button */}
                  {tenant.active === "true" ? (
                    <button
                      className="action-button deactivate-button"
                      onClick={() => onDeactivateTenant(tenant.id)}
                      aria-label={`Deactivate ${tenant.name}`}
                    >
                      <i className="fas fa-times-circle"></i> Deactivate
                    </button>
                  ) : (
                    <button
                      className="action-button activate-button"
                      onClick={() => onActivateTenant(tenant.id)}
                      aria-label={`Activate ${tenant.name}`}
                    >
                      <i className="fas fa-check-circle"></i> Activate
                    </button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="no-data">
                No tenants available. Click "Add Tenant" to get started.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

TenantList.propTypes = {
  tenants: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      active: PropTypes.string.isRequired, // Assuming 'active' is a string based on your data
      // Add other tenant properties as needed
    })
  ).isRequired,
  onEditTenant: PropTypes.func.isRequired,
  onDeleteTenant: PropTypes.func.isRequired,
  onActivateTenant: PropTypes.func.isRequired,
  onDeactivateTenant: PropTypes.func.isRequired,
};

export default TenantList;