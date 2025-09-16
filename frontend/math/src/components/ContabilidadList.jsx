import React from "react";

function ContabilidadList({ contabilidad, onEdit, onDelete }) {
  if (!contabilidad || contabilidad.length === 0) {
    return (
      <div className="card">
        <p>No hay registros de contabilidad disponibles.</p>
      </div>
    );
  }

  return (
    <div className="card">
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f8f9fa' }}>
            <th style={{ border: '1px solid #dee2e6', padding: '12px', textAlign: 'left' }}>Proveedores</th>
            <th style={{ border: '1px solid #dee2e6', padding: '12px', textAlign: 'left' }}>Impuestos por Pagar</th>
            <th style={{ border: '1px solid #dee2e6', padding: '12px', textAlign: 'left' }}>IVA por Pagar</th>
            <th style={{ border: '1px solid #dee2e6', padding: '12px', textAlign: 'left' }}>Obligaciones Empleados</th>
            <th style={{ border: '1px solid #dee2e6', padding: '12px', textAlign: 'left' }}>Retenciones por Pagar</th>
            <th style={{ border: '1px solid #dee2e6', padding: '12px', textAlign: 'left' }}>Total General</th>
            <th style={{ border: '1px solid #dee2e6', padding: '12px', textAlign: 'left' }}>Fecha</th>
            <th style={{ border: '1px solid #dee2e6', padding: '12px', textAlign: 'center' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {contabilidad.map((item, index) => (
            <tr key={item._id || index}>
              <td style={{ border: '1px solid #dee2e6', padding: '12px' }}>
                ${item.proveedores?.toLocaleString() || 0}
              </td>
              <td style={{ border: '1px solid #dee2e6', padding: '12px' }}>
                ${item.impuestosPorPagar?.toLocaleString() || 0}
              </td>
              <td style={{ border: '1px solid #dee2e6', padding: '12px' }}>
                ${item.ivaPorPagar?.toLocaleString() || 0}
              </td>
              <td style={{ border: '1px solid #dee2e6', padding: '12px' }}>
                ${item.obligacionesEmpleados?.toLocaleString() || 0}
              </td>
              <td style={{ border: '1px solid #dee2e6', padding: '12px' }}>
                ${item.retencionesPorPagar?.toLocaleString() || 0}
              </td>
              <td style={{ border: '1px solid #dee2e6', padding: '12px', fontWeight: 'bold' }}>
                ${item.totalGeneral?.toLocaleString() || 0}
              </td>
              <td style={{ border: '1px solid #dee2e6', padding: '12px' }}>
                {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}
              </td>
              <td style={{ border: '1px solid #dee2e6', padding: '12px', textAlign: 'center' }}>
                <button
                  onClick={() => onEdit(item)}
                  style={{
                    backgroundColor: '#ffc107',
                    color: 'white',
                    border: 'none',
                    padding: '5px 10px',
                    borderRadius: '3px',
                    cursor: 'pointer',
                    marginRight: '5px',
                    fontSize: '12px'
                  }}
                >
                  Editar
                </button>
                <button
                  onClick={() => onDelete(item._id)}
                  style={{
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    padding: '5px 10px',
                    borderRadius: '3px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ContabilidadList;