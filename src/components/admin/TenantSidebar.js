import React from "react";
import PropTypes from "prop-types";
import "./TenantsOnboard.css";

const TenantSidebar = ({ activeItem, onMenuClick, onLogout }) => {
  const menuItems = [
    { label: "Overview", icon: "fa fa-dashboard" },
    { label: "Tenants", icon: "fa fa-users" },
    { label: "Onboarding", icon: "fa fa-rocket" },
    { label: "Reports", icon: "fa fa-chart-bar" },
    { label: "Settings", icon: "fa fa-cog" },
  ];

  return (
    <aside className="tenant-sidebar">
      <div className="tenant-sidebar-header">
        <h2>Tenant Management</h2>
      </div>
      <ul className="tenant-sidebar-menu">
        {menuItems.map((item) => (
          <li
            key={item.label}
            className={`menu-item ${item.label === activeItem ? "active" : ""}`}
            onClick={() => onMenuClick(item.label)}
          >
            <i className={item.icon}></i>
            <span>{item.label}</span>
          </li>
        ))}
      </ul>
      <div className="tenant-sidebar-footer">
        <button onClick={onLogout} className="logout-button">
          Logout
        </button>
      </div>
    </aside>
  );
};

TenantSidebar.propTypes = {
  activeItem: PropTypes.string.isRequired,
  onMenuClick: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
};

export default TenantSidebar;