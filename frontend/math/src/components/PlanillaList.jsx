import React from "react";

function PlanillaList({ planillas, onDelete }) {
  if (!planillas || planillas.length === 0) {
    return <p>No hay planillas para mostrar</p>;
  }

  return (
    <table border="1" cellPadding="10">
      <thead>
        <tr>
          <th>Empleado</th>
          <th>Días Trabajados</th>
          <th>Horas Extras Diurnas</th>
          <th>Horas Extras Nocturnas</th>
          <th>Subtotal Devengado</th>
          <th>ISS</th>
          <th>AFP</th>
          <th>Total Retenciones</th>
          <th>Líquido a Pagar</th>
          {onDelete && <th>Acciones</th>}
        </tr>
      </thead>
      <tbody>
        {planillas.map((planilla) => (
          <tr key={planilla._id}>
            <td>
              {planilla.empleado && planilla.empleado.nombre 
                ? planilla.empleado.nombre 
                : 'Empleado no encontrado'
              }
            </td>
            <td>{planilla.diasTrabajados || 0}</td>
            <td>{planilla.horasExtrasDiurnas || 0}</td>
            <td>{planilla.horasExtrasNocturnas || 0}</td>
            <td>${(planilla.subTotalDevengado || 0).toFixed(2)}</td>
            <td>${(planilla.iss || 0).toFixed(2)}</td>
            <td>${(planilla.afp || 0).toFixed(2)}</td>
            <td>${(planilla.totalRetenciones || 0).toFixed(2)}</td>
            <td>${(planilla.liquidoAPagar || 0).toFixed(2)}</td>
            {onDelete && (
              <td>
                <button 
                  onClick={() => onDelete(planilla._id)}
                  style={{ 
                    backgroundColor: '#dc3545', 
                    color: 'white', 
                    border: 'none', 
                    padding: '5px 10px',
                    cursor: 'pointer',
                    borderRadius: '3px'
                  }}
                >
                  Eliminar
                </button>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default PlanillaList;