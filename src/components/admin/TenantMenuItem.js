import React from "react";
import PropTypes from "prop-types";

const TenantMenuItem = ({ label, isActive, onClick }) => {
  return (
    <li
      className={`tenant-menu-item ${isActive ? "active" : ""}`}
      onClick={onClick}
    >
      {label}
    </li>
  );
};

TenantMenuItem.propTypes = {
  label: PropTypes.string.isRequired,
  isActive: PropTypes.bool,
  onClick: PropTypes.func,
};

TenantMenuItem.defaultProps = {
  isActive: false,
  onClick: () => {},
};

export default TenantMenuItem;