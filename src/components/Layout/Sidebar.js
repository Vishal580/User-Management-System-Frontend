import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ isOpen, onToggle }) => {
  const menuItems = [
    {
      path: '/users',
      icon: 'fas fa-users',
      label: 'Users',
      description: 'Manage system users'
    },
    {
      path: '/settings',
      icon: 'fas fa-cog',
      label: 'Settings',
      description: 'Admin settings'
    }
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="sidebar-overlay d-md-none" onClick={onToggle}></div>
      )}
      
      <div className={`sidebar ${isOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <div className="brand-icon">
              <i className="fas fa-shield-alt"></i>
            </div>
            {isOpen && (
              <div className="brand-text">
                <h4>Admin Panel</h4>
                <span>Management System</span>
              </div>
            )}
          </div>
        </div>

        <div className="sidebar-menu">
          <nav>
            <ul className="nav-list">
              {menuItems.map((item) => (
                <li key={item.path} className="nav-item">
                  <NavLink
                    to={item.path}
                    className={({ isActive }) => 
                      `nav-link ${isActive ? 'active' : ''}`
                    }
                    title={!isOpen ? item.label : ''}
                  >
                    <div className="nav-icon">
                      <i className={item.icon}></i>
                    </div>
                    {isOpen && (
                      <div className="nav-content">
                        <span className="nav-label">{item.label}</span>
                        <span className="nav-description">{item.description}</span>
                      </div>
                    )}
                    {isOpen && <i className="fas fa-chevron-right nav-arrow"></i>}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;