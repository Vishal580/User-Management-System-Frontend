import React, { useState, useEffect } from 'react';
import './UserList.css';
import { usersAPI } from '../../services/api';
import { formatDate } from '../../utils/auth';
import UserModal from './UserModal';
import Loading from '../Common/Loading';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchUsers();
  }, [pagination.currentPage, searchTerm]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await usersAPI.getUsers({
        page: pagination.currentPage,
        limit: 10,
        search: searchTerm
      });

      const { users: userList, total, pages, currentPage } = response.data.data;
      setUsers(userList);
      setPagination({
        currentPage,
        totalPages: pages,
        total
      });
    } catch (error) {
      console.error('Error fetching users:', error);
      setMessage('Error fetching users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handleAddUser = () => {
    setSelectedUser(null);
    setModalOpen(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  const handleDeleteUser = async (userId) => {
    try {
      await usersAPI.deleteUser(userId);
      setMessage('User deleted successfully!');
      setDeleteConfirm(null);
      fetchUsers();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error deleting user:', error);
      setMessage('Error deleting user. Please try again.');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedUser(null);
  };

  const handleUserSaved = () => {
    setModalOpen(false);
    setSelectedUser(null);
    fetchUsers();
    setMessage('User saved successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
  };

  if (loading && users.length === 0) {
    return <Loading message="Loading users..." />;
  }

  return (
    <div className="user-list-container">
      <div className="page-header">
        <div className="user-header-content">
          <div className="user-header-left">
             <h1 className="page-title">
               <i className="fas fa-users me-3"></i>
               Users Management
             </h1>
            <p className="user-page-description">
               Manage system users, view details, and control access
             </p>
           </div>
          <div className="user-header-right">
             <button 
               className="btn btn-primary"
               onClick={handleAddUser}
             >
               <i className="fas fa-plus me-2"></i>
               Add User
             </button>
           </div>
        </div>
       </div>

      {message && (
        <div className={`alert ${message.includes('Error') ? 'alert-danger' : 'alert-success'} fade-in`}>
          <i className={`fas ${message.includes('Error') ? 'fa-exclamation-circle' : 'fa-check-circle'} me-2`}></i>
          {message}
        </div>
      )}

      <div className="users-card">
        <div className="card-header">
          <div className="search-controls">
            <div className="search-box">
              <i className="fas fa-search search-icon"></i>
              <input
                type="text"
                className="form-control"
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            <div className="results-info">
              {pagination.total > 0 && (
                <span className="text-muted">
                  Showing {users.length} of {pagination.total} users
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="card-body p-0">
          {loading ? (
            <Loading size="small" message="Loading users..." />
          ) : users.length === 0 ? (
            <div className="no-data">
              <i className="fas fa-users fa-3x text-muted mb-3"></i>
              <h5 className="text-muted">No users found</h5>
              <p className="text-muted">
                {searchTerm ? 'Try adjusting your search terms' : 'Get started by adding your first user'}
              </p>
              {!searchTerm && (
                <button className="btn btn-primary mt-3" onClick={handleAddUser}>
                  <i className="fas fa-plus me-2"></i>
                  Add First User
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Contact</th>
                      <th>Status</th>
                      <th>Created</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td>
                          <div className="user-info">
                            <div className="user-avatar">
                              <i className="fas fa-user"></i>
                            </div>
                            <div className="user-details">
                              <div className="user-name">{user.name}</div>
                              <div className="user-email">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="contact-info">
                            {user.phone ? (
                              <div className="phone-number">
                                <i className="fas fa-phone me-2"></i>
                                {user.phone}
                              </div>
                            ) : (
                              <span className="text-muted">No phone</span>
                            )}
                          </div>
                        </td>
                        <td>
                          <span className={`badge status-badge ${user.status === 'active' ? 'status-active' : 'status-inactive'}`}>
                            <i className={`fas ${user.status === 'active' ? 'fa-check-circle' : 'fa-times-circle'} me-1`}></i>
                            {user.status}
                          </span>
                        </td>
                        <td>
                          <div className="date-info">
                            {formatDate(user.created_at)}
                          </div>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => handleEditUser(user)}
                              title="Edit User"
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger ms-2"
                              onClick={() => setDeleteConfirm(user)}
                              title="Delete User"
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {pagination.totalPages > 1 && (
                <div className="pagination-wrapper">
                  <nav>
                    <ul className="pagination justify-content-center">
                      <li className={`page-item ${pagination.currentPage === 1 ? 'disabled' : ''}`}>
                        <button 
                          className="page-link"
                          onClick={() => handlePageChange(pagination.currentPage - 1)}
                          disabled={pagination.currentPage === 1}
                        >
                          <i className="fas fa-chevron-left"></i>
                        </button>
                      </li>
                      
                      {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
                        <li key={page} className={`page-item ${pagination.currentPage === page ? 'active' : ''}`}>
                          <button 
                            className="page-link"
                            onClick={() => handlePageChange(page)}
                          >
                            {page}
                          </button>
                        </li>
                      ))}
                      
                      <li className={`page-item ${pagination.currentPage === pagination.totalPages ? 'disabled' : ''}`}>
                        <button 
                          className="page-link"
                          onClick={() => handlePageChange(pagination.currentPage + 1)}
                          disabled={pagination.currentPage === pagination.totalPages}
                        >
                          <i className="fas fa-chevron-right"></i>
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* User Modal */}
      {modalOpen && (
        <UserModal
          user={selectedUser}
          onClose={handleModalClose}
          onSave={handleUserSaved}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="modal-overlay">
          <div className="modal-container small">
            <div className="modal-header">
              <h5 className="modal-title">Confirm Delete</h5>
              <button 
                className="modal-close-btn"
                onClick={() => setDeleteConfirm(null)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="text-center">
                <i className="fas fa-exclamation-triangle text-warning fa-3x mb-3"></i>
                <h6>Delete User</h6>
                <p>Are you sure you want to delete <strong>{deleteConfirm.name}</strong>?</p>
                <p className="text-muted small">This action cannot be undone.</p>
                
                <div className="d-flex gap-2 justify-content-center mt-4">
                  <button 
                    className="btn btn-secondary"
                    onClick={() => setDeleteConfirm(null)}
                  >
                    Cancel
                  </button>
                  <button 
                    className="btn btn-danger"
                    onClick={() => handleDeleteUser(deleteConfirm.id)}
                  >
                    <i className="fas fa-trash me-2"></i>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;