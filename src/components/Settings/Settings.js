import React, { useState } from 'react';
import './Settings.css';
import { settingsAPI } from '../../services/api';

const Settings = ({ admin, setAdmin }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Profile form state
  const [profileData, setProfileData] = useState({
    name: admin?.name || ''
  });
  const [profileErrors, setProfileErrors] = useState({});

  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordErrors, setPasswordErrors] = useState({});

  const showMessage = (msg, type = 'success') => {
    setMessage({ text: msg, type });
    setTimeout(() => setMessage(''), 3000);
  };

  // Profile Management
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (profileErrors[name]) {
      setProfileErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateProfile = () => {
    const errors = {};
    
    if (!profileData.name.trim()) {
      errors.name = 'Name is required';
    } else if (profileData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    } else if (profileData.name.trim().length > 255) {
      errors.name = 'Name must be less than 255 characters';
    }

    setProfileErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateProfile()) return;

    setLoading(true);
    try {
      const response = await settingsAPI.updateProfile({
        name: profileData.name.trim()
      });
      
      setAdmin(response.data.admin);
      setProfileData({ name: response.data.admin.name });
      showMessage('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update profile';
      showMessage(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Password Management
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (passwordErrors[name]) {
      setPasswordErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validatePassword = () => {
    const errors = {};
    
    if (!passwordData.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }
    
    if (!passwordData.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 6) {
      errors.newPassword = 'New password must be at least 6 characters';
    }
    
    if (!passwordData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your new password';
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (!validatePassword()) return;

    setLoading(true);
    try {
      await settingsAPI.updatePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        confirmPassword: passwordData.confirmPassword
      });
      
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      showMessage('Password updated successfully!');
    } catch (error) {
      console.error('Error updating password:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update password';
      showMessage(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="settings-container">
      <div className="page-header">
        <div className="settings-header-content">
          <div className="settings-header-left">
             <h1 className="page-title">
               <i className="fas fa-cog me-3"></i>
               Settings
             </h1>
            <p className="settings-page-description">
              Manage your admin account settings and preferences
            </p>
          </div>
        </div>
      </div>

      {message && (
        <div className={`alert alert-${message.type === 'error' ? 'danger' : 'success'} fade-in`}>
          <i className={`fas ${message.type === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle'} me-2`}></i>
          {message.text}
        </div>
      )}

      <div className="settings-card">
        <div className="settings-nav">
          <nav className="nav nav-tabs" role="tablist">
            <button
              className={`nav-link ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
              type="button"
              role="tab"
            >
              <i className="fas fa-user-circle me-2"></i>
              Profile
            </button>
            <button
              className={`nav-link ${activeTab === 'password' ? 'active' : ''}`}
              onClick={() => setActiveTab('password')}
              type="button"
              role="tab"
            >
              <i className="fas fa-key me-2"></i>
              Password
            </button>
          </nav>
        </div>

        <div className="settings-content">
          {activeTab === 'profile' && (
            <div className="tab-pane active">
              <div className="settings-section">
                <div className="section-header">
                  <h3 className="section-title">Profile Information</h3>
                  <p className="section-description">
                    Update your admin profile information
                  </p>
                </div>

                <form onSubmit={handleProfileSubmit} className="settings-form">
                  <div className="row">
                    <div className="col-lg-6">
                      <div className="form-group">
                        <label htmlFor="name" className="form-label">
                          <i className="fas fa-user me-2"></i>
                          Admin Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          className={`form-control ${profileErrors.name ? 'is-invalid' : ''}`}
                          placeholder="Enter admin name"
                          value={profileData.name}
                          onChange={handleProfileChange}
                          disabled={loading}
                          maxLength="255"
                        />
                        {profileErrors.name && (
                          <div className="invalid-feedback">
                            <i className="fas fa-exclamation-triangle me-1"></i>
                            {profileErrors.name}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="col-lg-6">
                      <div className="form-group">
                        <label className="form-label">
                          <i className="fas fa-envelope me-2"></i>
                          Email Address
                        </label>
                        <input
                          type="email"
                          className="form-control"
                          value={admin?.email || ''}
                          disabled
                          readOnly
                        />
                        <small className="form-text text-muted">
                          Email address cannot be changed
                        </small>
                      </div>
                    </div>
                  </div>

                  <div className="form-actions">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <i className="fas fa-spinner fa-spin me-2"></i>
                          Updating...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-save me-2"></i>
                          Update Profile
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {activeTab === 'password' && (
            <div className="tab-pane active">
              <div className="settings-section">
                <div className="section-header">
                  <h3 className="section-title">Change Password</h3>
                  <p className="section-description">
                    Update your admin account password for better security
                  </p>
                </div>

                <form onSubmit={handlePasswordSubmit} className="settings-form">
                  <div className="row">
                    <div className="col-lg-6">
                      <div className="form-group">
                        <label htmlFor="currentPassword" className="form-label">
                          <i className="fas fa-lock me-2"></i>
                          Current Password
                        </label>
                        <input
                          type="password"
                          id="currentPassword"
                          name="currentPassword"
                          className={`form-control ${passwordErrors.currentPassword ? 'is-invalid' : ''}`}
                          placeholder="Enter current password"
                          value={passwordData.currentPassword}
                          onChange={handlePasswordChange}
                          disabled={loading}
                        />
                        {passwordErrors.currentPassword && (
                          <div className="invalid-feedback">
                            <i className="fas fa-exclamation-triangle me-1"></i>
                            {passwordErrors.currentPassword}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-lg-6">
                      <div className="form-group">
                        <label htmlFor="newPassword" className="form-label">
                          <i className="fas fa-key me-2"></i>
                          New Password
                        </label>
                        <input
                          type="password"
                          id="newPassword"
                          name="newPassword"
                          className={`form-control ${passwordErrors.newPassword ? 'is-invalid' : ''}`}
                          placeholder="Enter new password"
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          disabled={loading}
                        />
                        {passwordErrors.newPassword && (
                          <div className="invalid-feedback">
                            <i className="fas fa-exclamation-triangle me-1"></i>
                            {passwordErrors.newPassword}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="col-lg-6">
                      <div className="form-group">
                        <label htmlFor="confirmPassword" className="form-label">
                          <i className="fas fa-shield-alt me-2"></i>
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          id="confirmPassword"
                          name="confirmPassword"
                          className={`form-control ${passwordErrors.confirmPassword ? 'is-invalid' : ''}`}
                          placeholder="Confirm new password"
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChange}
                          disabled={loading}
                        />
                        {passwordErrors.confirmPassword && (
                          <div className="invalid-feedback">
                            <i className="fas fa-exclamation-triangle me-1"></i>
                            {passwordErrors.confirmPassword}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="password-requirements">
                    <h6 className="requirements-title">
                      <i className="fas fa-info-circle me-2"></i>
                      Password Requirements
                    </h6>
                    <ul className="requirements-list">
                      <li>At least 6 characters long</li>
                      <li>Use a combination of letters and numbers</li>
                      <li>Avoid using common passwords</li>
                    </ul>
                  </div>

                  <div className="form-actions">
                    <button
                      type="submit"
                      className="btn btn-warning"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <i className="fas fa-spinner fa-spin me-2"></i>
                          Updating...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-key me-2"></i>
                          Update Password
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;