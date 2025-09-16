import React from "react";
import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div className="home-container">
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Bienvenido al Sistema Empresarial
          </h1>
          <p className="hero-subtitle">
            Gestiona empleados, planillas y contabilidad desde un solo lugar
          </p>
          
          <div className="hero-cards">
            <Link to="/empleados" className="hero-card">
              <div className="card-icon">👥</div>
              <h3>Empleados</h3>
              <p>Administra la información de todos tus empleados</p>
              <div className="card-arrow">→</div>
            </Link>
            
            <Link to="/planilla" className="hero-card">
              <div className="card-icon">📋</div>
              <h3>Planilla</h3>
              <p>Gestiona nóminas y pagos de forma eficiente</p>
              <div className="card-arrow">→</div>
            </Link>
            
            <Link to="/contabilidad" className="hero-card">
              <div className="card-icon">📊</div>
              <h3>Inventario</h3>
              <p>Controla tu inventario de la manera mas optimizada</p>
              <div className="card-arrow">→</div>
            </Link>
          </div>
        </div>
      </div>
      
      <div className="stats-section">
        <div className="stat-item">
          <div className="stat-number">150+</div>
          <div className="stat-label">Empleados Activos</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">98%</div>
          <div className="stat-label">Precisión en Pagos</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">24/7</div>
          <div className="stat-label">Disponibilidad</div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;