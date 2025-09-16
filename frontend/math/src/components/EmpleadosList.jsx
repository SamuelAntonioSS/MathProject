// components/EmpleadosList.jsx
import React from "react";

function EmpleadosList({ empleados, onEdit, onDelete, loading }) {
  
  if (loading) {
    return (
      <div style={{textAlign: 'center', padding: '2rem'}}>
        <p>Cargando empleados...</p>
      </div>
    );
  }

  if (!empleados || empleados.length === 0) {
    return (
      <div style={{textAlign: 'center', padding: '2rem'}}>
        <p>No hay empleados registrados</p>
      </div>
    );
  }

  const formatCurrency = (amount) => {
    return `$${amount.toFixed(2)}`;
  };

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Sueldo Base</th>
            <th>Días Trabajados</th>
            <th>H. Extras Diurnas</th>
            <th>H. Extras Nocturnas</th>
            <th>ISSS</th>
            <th>AFP</th>
            <th>Líquido a Pagar</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {empleados.map((emp) => (
            <tr key={emp._id}>
              <td><strong>{emp.nombre}</strong></td>
              <td>{formatCurrency(emp.sueldoBase)}</td>
              <td>{emp.diasTrabajados}</td>
              <td>{emp.horasExtrasDiurnas || 0}</td>
              <td>{emp.horasExtrasNocturnas || 0}</td>
              <td>{formatCurrency(emp.iss || 0)}</td>
              <td>{formatCurrency(emp.afp || 0)}</td>
              <td><strong style={{color: '#10b981'}}>{formatCurrency(emp.liquidoAPagar || 0)}</strong></td>
              <td className="actions-cell">
                <button 
                  onClick={() => onEdit(emp)}
                  className="btn-edit"
                  style={{marginRight: '0.5rem'}}
                >
                  ✏️ Editar
                </button>
                <button 
                  onClick={() => onDelete(emp._id)}
                  className="btn-delete"
                  style={{background: 'linear-gradient(135deg, #ef4444, #dc2626)'}}
                >
                  🗑️ Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <style>{`
        .table-container {
          overflow-x: auto;
        }
        
        .actions-cell {
          white-space: nowrap;
        }
        
        .btn-edit, .btn-delete {
          padding: 8px 12px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          font-size: 0.9rem;
          transition: all 0.3s ease;
        }
        
        .btn-edit {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
        }
        
        .btn-edit:hover, .btn-delete:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        }
      `}</style>
    </div>
  );
}

export default EmpleadosList;