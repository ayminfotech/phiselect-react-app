// src/components/admin/TenetSidebar.js
import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import './TenantSidebar.css';

const TenetSidebar = ({ activeItem, onMenuClick, onLogout }) => {
  const navigate = useNavigate();

  const handleMenuClick = (item) => {
    onMenuClick(item);
    if (item === 'Tenets') {
      navigate('/onboard');
    } else if (item === 'Reports') {
      navigate('/super-admin/reports');
    }
  };

  return (
    <div className="tenet-sidebar">
      <div className="tenet-sidebar-header">
        <h2>ATS Admin</h2>
      </div>
      <ul className="tenet-sidebar-menu">
        <li
          className={`menu-item ${activeItem === 'Tenets' ? 'active' : ''}`}
          onClick={() => handleMenuClick('Tenets')}
        >
          <i className="fa fa-building"></i>
          <span>Tenets</span>
        </li>
        <li
          className={`menu-item ${activeItem === 'Reports' ? 'active' : ''}`}
          onClick={() => handleMenuClick('Reports')}
        >
          <i className="fa fa-chart-bar"></i>
          <span>Reports</span>
        </li>
        {/* Add more menu items if needed */}
      </ul>
      <div className="tenet-sidebar-footer">
        <button className="logout-button" onClick={onLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

TenetSidebar.propTypes = {
  activeItem: PropTypes.string.isRequired,
  onMenuClick: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
};

export default TenetSidebar;