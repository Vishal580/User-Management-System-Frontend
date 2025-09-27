import React, { useState, useEffect } from 'react';
import './UserForm.css';
import { validateEmail, validatePhone } from '../../utils/auth';

const UserForm = ({ user, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    status: 'active'
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        status: user.status || 'active'
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        status: 'active'
      });
    }
    setErrors({});
    setTouched({});
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    validateField(name, formData[name]);
  };

  const validateField = (name, value) => {
    let error = '';

    switch (name) {
      case 'name':
        if (!value.trim()) {
          error = 'Name is required';
        } else if (value.trim().length < 2) {
          error = 'Name must be at least 2 characters';
        } else if (value.trim().length > 255) {
          error = 'Name must be less than 255 characters';
        }
        break;

      case 'email':
        if (!value.trim()) {
          error = 'Email is required';
        } else if (!validateEmail(value)) {
          error = 'Please enter a valid email address';
        }
        break;

      case 'phone':
        if (value && !validatePhone(value)) {
          error = 'Please enter a valid phone number';
        }
        break;

      default:
        break;
    }

    if (error) {
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }

    return !error;
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    // Validate all fields
    Object.keys(formData).forEach(field => {
      if (field !== 'status') { // status doesn't need validation
        const fieldValid = validateField(field, formData[field]);
        if (!fieldValid) {
          isValid = false;
        }
      }
    });

    // Mark all fields as touched
    setTouched({
      name: true,
      email: true,
      phone: true,
      status: true
    });

    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Clean up the data
      const submitData = {
        ...formData,
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim() || null
      };
      
      onSubmit(submitData);
    }
  };

  const getFieldClass = (fieldName) => {
    let className = 'form-control';
    if (touched[fieldName]) {
      className += errors[fieldName] ? ' is-invalid' : ' is-valid';
    }
    return className;
  };

  return (
    <div className="user-form">
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-12">
            <div className="form-group">
              <label htmlFor="name" className="form-label required">
                <i className="fas fa-user me-2"></i>
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className={getFieldClass('name')}
                placeholder="Enter full name"
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={loading}
                maxLength="255"
              />
              {touched.name && errors.name && (
                <div className="invalid-feedback">
                  <i className="fas fa-exclamation-triangle me-1"></i>
                  {errors.name}
                </div>
              )}
              {touched.name && !errors.name && formData.name && (
                <div className="valid-feedback">
                  <i className="fas fa-check me-1"></i>
                  Looks good!
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <div className="form-group">
              <label htmlFor="email" className="form-label required">
                <i className="fas fa-envelope me-2"></i>
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className={getFieldClass('email')}
                placeholder="Enter email address"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={loading}
              />
              {touched.email && errors.email && (
                <div className="invalid-feedback">
                  <i className="fas fa-exclamation-triangle me-1"></i>
                  {errors.email}
                </div>
              )}
              {touched.email && !errors.email && formData.email && (
                <div className="valid-feedback">
                  <i className="fas fa-check me-1"></i>
                  Looks good!
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-8">
            <div className="form-group">
              <label htmlFor="phone" className="form-label">
                <i className="fas fa-phone me-2"></i>
                Phone Number
                <span className="text-muted ms-2">(Optional)</span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                className={getFieldClass('phone')}
                placeholder="Enter phone number"
                value={formData.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={loading}
              />
              {touched.phone && errors.phone && (
                <div className="invalid-feedback">
                  <i className="fas fa-exclamation-triangle me-1"></i>
                  {errors.phone}
                </div>
              )}
              {touched.phone && !errors.phone && formData.phone && (
                <div className="valid-feedback">
                  <i className="fas fa-check me-1"></i>
                  Looks good!
                </div>
              )}
            </div>
          </div>
          
          <div className="col-md-4">
            <div className="form-group">
              <label htmlFor="status" className="form-label required">
                <i className="fas fa-toggle-on me-2"></i>
                Status
              </label>
              <select
                id="status"
                name="status"
                className="form-select"
                value={formData.status}
                onChange={handleChange}
                disabled={loading}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
            disabled={loading}
          >
            <i className="fas fa-times me-2"></i>
            Cancel
          </button>
          
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin me-2"></i>
                {user ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              <>
                <i className={`fas ${user ? 'fa-save' : 'fa-plus'} me-2`}></i>
                {user ? 'Update User' : 'Create User'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;