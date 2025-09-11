import React from "react";

function ContabilidadList({ contabilidad }) {
  return (
    <table border="1" cellPadding="10">
      <thead>
        <tr>
          <th>Concepto</th>
          <th>Monto</th>
        </tr>
      </thead>
      <tbody>
        {contabilidad.map((item, index) => (
          <tr key={index}>
            <td>{item.concepto}</td>
            <td>${item.monto}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default ContabilidadList;
