import React from "react";

function PlanillaList({ planillas }) {
  return (
    <table border="1" cellPadding="10">
      <thead>
        <tr>
          <th>Empleado</th>
          <th>Líquido a Pagar</th>
        </tr>
      </thead>
      <tbody>
        {planillas.map((p, index) => (
          <tr key={index}>
            <td>{p.empleado}</td>
            <td>${p.liquidoAPagar}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default PlanillaList;
