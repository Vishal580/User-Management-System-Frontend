import React from 'react';
import './Loading.css';

const Loading = ({ message = 'Loading...', size = 'large' }) => {
  return (
    <div className={`loading-container ${size}`}>
      <div className="loading-content">
        <div className="loading-spinner">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
        <div className="loading-message">
          {message}
        </div>
      </div>
    </div>
  );
};

export default Loading;