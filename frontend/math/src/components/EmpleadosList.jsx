import React from "react";

function EmpleadosList({ empleados }) {
  return (
    <table border="1" cellPadding="10">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Sueldo Base</th>
          <th>Días Trabajados</th>
        </tr>
      </thead>
      <tbody>
        {empleados.map((emp, index) => (
          <tr key={index}>
            <td>{emp.nombre}</td>
            <td>${emp.sueldoBase}</td>
            <td>{emp.diasTrabajados}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default EmpleadosList;
