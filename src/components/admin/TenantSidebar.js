// src/components/admin/TenantSidebar.js
import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import './TenantSidebar.css'; // Updated path

const TenetSidebar = ({ activeItem, onMenuClick, onLogout }) => {
  const navigate = useNavigate();

  const handleMenuClick = (item) => {
    onMenuClick(item);
    switch (item) {
      case 'tenets':
        navigate('/onboard');
        break;
      case 'reports':
        navigate('/super-admin/reports');
        break;
      // Add more cases as needed
      default:
        navigate('/');
    }
  };

  return (
    <aside className="tenant-sidebar">
      <div className="tenant-sidebar__header">
        <h2>ATS Admin</h2>
      </div>
      <nav className="tenant-sidebar__nav">
        <ul className="tenant-sidebar__menu">
          <li
            className={`tenant-sidebar__menu-item ${
              activeItem === 'tenets' ? 'tenant-sidebar__menu-item--active' : ''
            }`}
            onClick={() => handleMenuClick('tenets')}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => e.key === 'Enter' && handleMenuClick('tenets')}
          >
            <i className="fas fa-building"></i>
            <span>Tenants</span>
          </li>
          <li
            className={`tenant-sidebar__menu-item ${
              activeItem === 'reports' ? 'tenant-sidebar__menu-item--active' : ''
            }`}
            onClick={() => handleMenuClick('reports')}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => e.key === 'Enter' && handleMenuClick('reports')}
          >
            <i className="fas fa-chart-bar"></i>
            <span>Reports</span>
          </li>
          {/* Add more menu items here */}
        </ul>
      </nav>
      <div className="tenant-sidebar__footer">
        <button className="button button--logout" onClick={onLogout}>
          <i className="fas fa-sign-out-alt"></i> Logout
        </button>
      </div>
    </aside>
  );
};

TenetSidebar.propTypes = {
  activeItem: PropTypes.string.isRequired,
  onMenuClick: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
};

export default TenetSidebar;