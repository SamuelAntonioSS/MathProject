import React, { useState } from "react";

function Empleados() {
  const [empleados] = useState([
    { nombre: "Juan Pérez", sueldoBase: 400, diasTrabajados: 15 },
    { nombre: "Ana López", sueldoBase: 500, diasTrabajados: 15 },
    { nombre: "Carlos Ruiz", sueldoBase: 450, diasTrabajados: 14 },
  ]);

  return (
    <div className="container">
      <h2>Empleados</h2>
      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Sueldo Base</th>
              <th>Días Trabajados</th>
            </tr>
          </thead>
          <tbody>
            {empleados.map((emp, i) => (
              <tr key={i}>
                <td>{emp.nombre}</td>
                <td>${emp.sueldoBase}</td>
                <td>{emp.diasTrabajados}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Empleados;
