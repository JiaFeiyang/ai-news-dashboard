import React from 'react';
import '../App.css';

const Header = ({ title, subtitle }) => {
  return (
    <header className="dashboard-header">
      <div className="header-content">
        <h1 className="header-title">{title || 'AI News Dashboard'}</h1>
        {subtitle && <p className="header-subtitle">{subtitle}</p>}
      </div>
    </header>
  );
};

export default Header;