import React, { useState } from "react";

function Contabilidad() {
  const [contabilidad] = useState([
    { concepto: "Proveedores", monto: 1000 },
    { concepto: "Impuestos por Pagar", monto: 200 },
    { concepto: "IVA por Pagar", monto: 150 },
    { concepto: "Obligaciones Empleados", monto: 400 },
    { concepto: "Retenciones por Pagar", monto: 50 },
  ]);

  return (
    <div className="container">
      <h2>Contabilidad</h2>
      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Concepto</th>
              <th>Monto</th>
            </tr>
          </thead>
          <tbody>
            {contabilidad.map((item, i) => (
              <tr key={i}>
                <td>{item.concepto}</td>
                <td>${item.monto}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Contabilidad;
