import React from 'react';
import './Header.css';

export const Header: React.FC = () => {
  const BackIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12,8 8,12 12,16"></polyline>
      <line x1="16" y1="12" x2="8" y2="12"></line>
    </svg>
  );

  const HelpIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"></circle>
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
      <line x1="12" y1="17" x2="12.01" y2="17"></line>
    </svg>
  );

  const BellIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
    </svg>
  );

  return (
    <div className="header">
      <div className="header-left">
        <button className="back-btn">
          <BackIcon />
        </button>
      </div>
      
      <div className="header-right">
        <button className="help-btn">
          <HelpIcon />
        </button>
        <button className="notification-btn">
          <BellIcon />
        </button>
        <div className="user-avatar">
          <img 
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face&auto=format" 
            alt="User Avatar" 
          />
        </div>
      </div>
    </div>
  );
};
