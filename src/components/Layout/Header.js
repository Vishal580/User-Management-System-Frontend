import React, { useState, useRef, useEffect } from 'react';
import './Header.css';

const Header = ({ admin, onLogout, onToggleSidebar, sidebarOpen }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const wrapperRef = useRef(null);

  const toggleDropdown = (e) => {
    if (e) e.stopPropagation();
    setDropdownOpen(prev => !prev);
  };

  const handleLogout = (e) => {
    if (e) e.stopPropagation();
    setDropdownOpen(false);
    onLogout();
  };

  useEffect(() => {
    const handleDocClick = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    const handleEsc = (e) => {
      if (e.key === 'Escape') setDropdownOpen(false);
    };
    document.addEventListener('mousedown', handleDocClick);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleDocClick);
      document.removeEventListener('keydown', handleEsc);
    };
  }, []);

  return (
    <header className="main-header">
      <div className="header-content">
        <div className="header-left">
          <button 
            className="sidebar-toggle-btn"
            onClick={onToggleSidebar}
            title={sidebarOpen ? 'Close Sidebar' : 'Open Sidebar'}
          >
            <i className={`fas ${sidebarOpen ? 'fa-times' : 'fa-bars'}`}></i>
          </button>
          
          <div className="page-info">
            <h1 className="page-title">Admin Dashboard</h1>
            <span className="page-subtitle">Welcome back!</span>
          </div>
        </div>

        <div className="header-right">
          <div className="admin-profile" ref={wrapperRef}>
            <div className={`profile-dropdown ${dropdownOpen ? 'show' : ''}`}>
              <div 
                className="profile-trigger"
                onClick={toggleDropdown}
              >
                <div className="profile-avatar">
                  <i className="fas fa-user-circle"></i>
                </div>
                <div className="profile-info d-none d-md-block">
                  <span className="profile-name">{admin?.name || 'Admin'}</span>
                </div>
                <i className="fas fa-chevron-down profile-arrow"></i>
              </div>

              <div 
                className="dropdown-menu"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="dropdown-header">
                  <div className="dropdown-avatar">
                    <i className="fas fa-user-circle"></i>
                  </div>
                  <div className="dropdown-info">
                    <strong>{admin?.name || 'Admin'}</strong>
                    <small>{admin?.email}</small>
                  </div>
                </div>
                
                <div className="dropdown-divider"></div>
                
                <a href="/settings" className="dropdown-item" role="menuitem"> 
                  <i className="fas fa-cog me-2"></i>
                  Settings
                </a>
                
                <div className="dropdown-divider"></div>
                
                <button className="dropdown-item logout-item" onClick={handleLogout}>
                  <i className="fas fa-sign-out-alt me-2"></i>
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;