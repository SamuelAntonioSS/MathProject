import React, { useState } from "react";

function Planilla() {
  const [planillas] = useState([
    { empleado: "Juan Pérez", liquidoAPagar: 350, horasExtras: 5 },
    { empleado: "Ana López", liquidoAPagar: 450, horasExtras: 2 },
    { empleado: "Carlos Ruiz", liquidoAPagar: 400, horasExtras: 3 },
  ]);

  return (
    <div className="container">
      <h2>Planilla Quincenal</h2>
      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Empleado</th>
              <th>Líquido a Pagar</th>
              <th>Horas Extras</th>
            </tr>
          </thead>
          <tbody>
            {planillas.map((p, i) => (
              <tr key={i}>
                <td>{p.empleado}</td>
                <td>${p.liquidoAPagar}</td>
                <td>{p.horasExtras}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Planilla;
