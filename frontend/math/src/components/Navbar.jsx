import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav style={{ padding: "10px", backgroundColor: "#333", color: "#fff" }}>
      <Link style={{ color: "#fff", marginRight: "10px" }} to="/empleados">Empleados</Link>
      <Link style={{ color: "#fff", marginRight: "10px" }} to="/planilla">Planilla</Link>
      <Link style={{ color: "#fff" }} to="/contabilidad">Contabilidad</Link>
    </nav>
  );
}

export default Navbar;
