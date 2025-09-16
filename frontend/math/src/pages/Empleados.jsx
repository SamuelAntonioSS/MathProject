// pages/Empleados.jsx
import React, { useState, useEffect } from "react";
import EmpleadosList from "../components/EmpleadosList";
import EmpleadoForm from "../components/EmpleadoForm";
import EmpleadoService from "../services/empleadoService";

function Empleados() {
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingEmpleado, setEditingEmpleado] = useState(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  // Cargar empleados al montar el componente
  useEffect(() => {
    loadEmpleados();
  }, []);

  const loadEmpleados = async () => {
    try {
      setLoading(true);
      const data = await EmpleadoService.getAllEmpleados();
      setEmpleados(data);
    } catch (error) {
      showMessage('Error al cargar empleados: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (text, type) => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 4000);
  };

  const handleSubmit = async (formData) => {
    try {
      setFormLoading(true);
      
      if (editingEmpleado) {
        // Actualizar empleado existente
        await EmpleadoService.updateEmpleado(editingEmpleado._id, formData);
        showMessage('Empleado actualizado correctamente', 'success');
      } else {
        // Crear nuevo empleado
        await EmpleadoService.createEmpleado(formData);
        showMessage('Empleado creado correctamente', 'success');
      }
      
      // Recargar lista y cerrar formulario
      await loadEmpleados();
      setShowForm(false);
      setEditingEmpleado(null);
      
    } catch (error) {
      showMessage('Error al guardar: ' + error.message, 'error');
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (empleado) => {
    setEditingEmpleado(empleado);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este empleado?')) {
      try {
        await EmpleadoService.deleteEmpleado(id);
        showMessage('Empleado eliminado correctamente', 'success');
        await loadEmpleados();
      } catch (error) {
        showMessage('Error al eliminar: ' + error.message, 'error');
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingEmpleado(null);
  };

  const handleNewEmpleado = () => {
    setEditingEmpleado(null);
    setShowForm(true);
  };

  const getTotalPlanilla = () => {
    return empleados.reduce((total, emp) => total + (emp.liquidoAPagar || 0), 0);
  };

  const getTotalRetenciones = () => {
    return empleados.reduce((total, emp) => total + (emp.totalRetenciones || 0), 0);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Gestión de Empleados</h2>
        <button 
          onClick={handleNewEmpleado}
          className="btn-new-empleado"
          disabled={loading}
        >
          + Nuevo Empleado
        </button>
      </div>

      {/* Mensaje de éxito/error */}
      {message && (
        <div className={`message ${messageType}`}>
          {message}
        </div>
      )}

      {/* Formulario */}
      {showForm && (
        <EmpleadoForm
          empleado={editingEmpleado}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={formLoading}
        />
      )}

      {/* Estadísticas rápidas */}
      {!loading && empleados.length > 0 && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number">{empleados.length}</div>
            <div className="stat-label">Total Empleados</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">${getTotalPlanilla().toFixed(2)}</div>
            <div className="stat-label">Total Planilla</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">${getTotalRetenciones().toFixed(2)}</div>
            <div className="stat-label">Total Retenciones</div>
          </div>
        </div>
      )}

      {/* Lista de empleados */}
      <div className="card">
        <div className="card-header">
          <h3>Lista de Empleados</h3>
          <button 
            onClick={loadEmpleados}
            className="btn-refresh"
            disabled={loading}
          >
            🔄 {loading ? 'Cargando...' : 'Actualizar'}
          </button>
        </div>
        
        <EmpleadosList
          empleados={empleados}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={loading}
        />
      </div>

      <style>{`
        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .btn-new-empleado {
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 1rem;
        }

        .btn-new-empleado:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);
        }

        .btn-new-empleado:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .message {
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1rem;
          font-weight: 600;
        }

        .message.success {
          background-color: #d1fae5;
          color: #065f46;
          border: 1px solid #10b981;
        }

        .message.error {
          background-color: #fee2e2;
          color: #991b1b;
          border: 1px solid #ef4444;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          padding: 1.5rem;
          border-radius: 12px;
          text-align: center;
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }

        .stat-number {
          font-size: 2rem;
          font-weight: 800;
          color: #667eea;
          margin-bottom: 0.5rem;
        }

        .stat-label {
          color: #6b7280;
          font-weight: 600;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .card-header h3 {
          color: #4f46e5;
          margin: 0;
        }

        .btn-refresh {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-refresh:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        }

        .btn-refresh:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .page-header {
            flex-direction: column;
            gap: 1rem;
            align-items: stretch;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .card-header {
            flex-direction: column;
            gap: 1rem;
            align-items: stretch;
          }
        }
      `}</style>
    </div>
  );
}

export default Empleados;