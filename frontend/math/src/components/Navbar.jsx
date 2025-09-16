// components/Navbar.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();
  
  const isActive = (path) => location.pathname === path;
  
  return (
    <nav className="modern-navbar">
      <div className="navbar-brand">
        <Link to="/" className="brand-link">
          <div className="brand-icon">💼</div>
          <span className="brand-text">Sistema Empresarial</span>
        </Link>
      </div>
      
      <div className="navbar-links">
        <Link 
          to="/" 
          className={`nav-link ${isActive('/') ? 'active' : ''}`}
        >
          <span className="nav-icon">🏠</span>
          Inicio
        </Link>
        <Link 
          to="/empleados" 
          className={`nav-link ${isActive('/empleados') ? 'active' : ''}`}
        >
          <span className="nav-icon">👥</span>
          Empleados
        </Link>
        <Link 
          to="/planilla" 
          className={`nav-link ${isActive('/planilla') ? 'active' : ''}`}
        >
          <span className="nav-icon">📋</span>
          Planilla
        </Link>
        <Link 
          to="/inventario" 
          className={`nav-link ${isActive('/inventario') ? 'active' : ''}`}
        >
          <span className="nav-icon">📊</span>
          Inventario
        </Link>
      </div>
      
      <div className="navbar-user">
        <div className="user-avatar">👤</div>
        <span className="user-name">Admin</span>
      </div>
    </nav>
  );
}

export default Navbar;