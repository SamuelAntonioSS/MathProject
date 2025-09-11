import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar.jsx";
import Empleados from "./pages/Empleados.jsx";
import Planilla from "./pages/Planilla.jsx";
import Contabilidad from "./pages/Contabilidad.jsx";
import "./App.css"; // tu CSS puro


function App() {
  return (
    <Router>
      <Navbar />
      <div style={{ padding: "20px" }}>
        <Routes>
          <Route path="/empleados" element={<Empleados />} />
          <Route path="/planilla" element={<Planilla />} />
          <Route path="/contabilidad" element={<Contabilidad />} />
          <Route path="*" element={<h2>Página no encontrada</h2>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
