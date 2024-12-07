// src/components/admin/TenantList.js
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ConfirmDialog from './ConfirmDialog';
import './TenetList.css'; // Corrected CSS filename

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
    <div className="tenant-list">
      {showConfirm && (
        <ConfirmDialog
          title="Delete Tenant"
          message="Are you sure you want to delete this tenant? This action cannot be undone."
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Status</th>
            <th className="actions-header">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tenants.map((tenant) => (
            <tr key={tenant.id}>
              <td>{tenant.name}</td>
              <td>{tenant.active === "true" ? "Active" : "Inactive"}</td>
              <td className="actions">
                {/* Edit Button - Pass id */}
                <button
                  className="action-button edit"
                  onClick={() => onEditTenant(tenant.id)}
                >
                  Edit
                </button>

                {/* Delete Button */}
                <button
                  className="action-button delete"
                  onClick={() => handleDeleteClick(tenant.id)}
                >
                  Delete
                </button>

                {/* Activate/Deactivate Button */}
                {tenant.active === "true" ? (
                  <button
                    className="action-button deactivate"
                    onClick={() => onDeactivateTenant(tenant.id)}
                  >
                    Deactivate
                  </button>
                ) : (
                  <button
                    className="action-button activate"
                    onClick={() => onActivateTenant(tenant.id)}
                  >
                    Activate
                  </button>
                )}
              </td>
            </tr>
          ))}
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