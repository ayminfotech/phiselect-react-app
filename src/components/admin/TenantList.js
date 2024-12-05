import React from "react";
import PropTypes from "prop-types";

const TenantList = ({
  tenants,
  onEditTenant,
  onDeleteTenant,
  onActivateTenant,
  onDeactivateTenant,
}) => {
  return (
    <div className="tenant-list">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tenants.map((tenant) => (
            <tr key={tenant.id}>
              <td>{tenant.name}</td>
              <td>{tenant.status}</td>
              <td>
                <button onClick={() => onEditTenant(tenant)}>Edit</button>
                <button onClick={() => onDeleteTenant(tenant.id)}>Delete</button>
                {tenant.status === "Active" ? (
                  <button onClick={() => onDeactivateTenant(tenant.organizationRefId)}>
                    Deactivate
                  </button>
                ) : (
                  <button onClick={() => onActivateTenant(tenant.organizationRefId)}>
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
  tenants: PropTypes.array.isRequired,
  onEditTenant: PropTypes.func.isRequired,
  onDeleteTenant: PropTypes.func.isRequired,
  onActivateTenant: PropTypes.func.isRequired,
  onDeactivateTenant: PropTypes.func.isRequired,
};

export default TenantList;