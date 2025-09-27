import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Components
import Login from './components/Auth/Login';
import Layout from './components/Layout/Layout';
import UserList from './components/Users/UserList';
import Settings from './components/Settings/Settings';
import Loading from './components/Common/Loading';

// Utils
import { isAuthenticated, getAdmin } from './utils/auth';
import { authAPI } from './services/api';

function App() {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    if (isAuthenticated()) {
      try {
        const response = await authAPI.verifyToken();
        if (response.data.valid) {
          setAuthenticated(true);
          setAdmin(response.data.admin || getAdmin());
        } else {
          localStorage.removeItem('token');
          localStorage.removeItem('admin');
        }
      } catch (error) {
        console.error('Auth verification failed:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('admin');
      }
    }
    setLoading(false);
  };

  const handleLogin = (adminData) => {
    setAuthenticated(true);
    setAdmin(adminData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
    setAuthenticated(false);
    setAdmin(null);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <Router>
      <div className="App">
        {!authenticated ? (
          <Routes>
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        ) : (
          <Layout admin={admin} onLogout={handleLogout}>
            <Routes>
              <Route path="/" element={<Navigate to="/users" replace />} />
              <Route path="/users" element={<UserList />} />
              <Route path="/settings" element={<Settings admin={admin} setAdmin={setAdmin} />} />
              <Route path="*" element={<Navigate to="/users" replace />} />
            </Routes>
          </Layout>
        )}
      </div>
    </Router>
  );
}

export default App;