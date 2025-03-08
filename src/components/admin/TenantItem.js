import React from "react";
import PropTypes from "prop-types";

const TenantItem = ({ tenant, onEdit, onDelete, onActivate, onDeactivate }) => {
  return (
    <li className="tenant-item">
      <span>{tenant.name}</span>
      <span>{tenant.status}</span>
      <div className="actions">
        <button onClick={() => onEdit(tenant)}>Edit</button>
        <button onClick={() => onDelete(tenant.id)} className="delete">
          Delete
        </button>
        {tenant.status !== "Active" && (
          <button onClick={() => onActivate(tenant.organizationRefId)}>
            Activate
          </button>
        )}
        {tenant.status === "Active" && (
          <button onClick={() => onDeactivate(tenant.organizationRefId)}>
            Deactivate
          </button>
        )}
      </div>
    </li>
  );
};

TenantItem.propTypes = {
  tenant: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    organizationRefId: PropTypes.string.isRequired,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onActivate: PropTypes.func.isRequired,
  onDeactivate: PropTypes.func.isRequired,
};

export default TenantItem;