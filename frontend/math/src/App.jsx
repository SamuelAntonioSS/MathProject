// App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar.jsx";
import HomePage from "./pages/HomePage.jsx";
import Empleados from "./pages/Empleados.jsx";
import Planilla from "./pages/Planilla.jsx";
import Contabilidad from "./pages/Contabilidad.jsx";
import "./App.css"; // tu CSS mejorado

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/empleados" element={<Empleados />} />
            <Route path="/planilla" element={<Planilla />} />
            <Route path="/contabilidad" element={<Contabilidad />} />
            <Route path="*" element={
              <div className="page-container">
                <h2>Página no encontrada</h2>
                <p>La página que buscas no existe.</p>
              </div>
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;