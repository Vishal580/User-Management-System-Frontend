import React, { useState } from 'react';
import './UserModal.css';
import Modal from '../Common/Modal';
import UserForm from './UserForm';
import { usersAPI } from '../../services/api';

const UserModal = ({ user, onClose, onSave }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError('');

    try {
      if (user) {
        // Update existing user
        await usersAPI.updateUser(user.id, formData);
      } else {
        // Create new user
        await usersAPI.createUser(formData);
      }
      
      onSave();
    } catch (error) {
      console.error('Error saving user:', error);
      const errorMessage = error.response?.data?.message || 'Failed to save user. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (!loading) {
      onClose();
    }
  };

  const modalTitle = user ? (
    <>
      <i className="fas fa-user-edit me-2"></i>
      Edit User
    </>
  ) : (
    <>
      <i className="fas fa-user-plus me-2"></i>
      Add New User
    </>
  );

  return (
    <Modal
      isOpen={true}
      onClose={handleCancel}
      title={modalTitle}
      size="medium"
      showCloseButton={!loading}
      className="user-modal"
    >
      <div className="user-modal-content">
        {error && (
          <div className="alert alert-danger mb-4">
            <i className="fas fa-exclamation-circle me-2"></i>
            {error}
            <button
              type="button"
              className="btn-close ms-auto"
              onClick={() => setError('')}
            ></button>
          </div>
        )}

        <div className="user-form-container">
          <UserForm
            user={user}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            loading={loading}
          />
        </div>

        {user && (
          <div className="user-info-footer">
            <div className="info-grid">
              <div className="info-item">
                <label>User ID:</label>
                <span>#{user.id}</span>
              </div>
              <div className="info-item">
                <label>Created:</label>
                <span>{new Date(user.created_at).toLocaleDateString()}</span>
              </div>
              {user.updated_at && (
                <div className="info-item">
                  <label>Last Updated:</label>
                  <span>{new Date(user.updated_at).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default UserModal;