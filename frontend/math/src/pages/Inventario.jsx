import React, { useState, useEffect } from "react";
import InventarioList from "../components/InventarioList";
import InventarioForm from "../components/InventarioForm";
import ResumenInventario from "../components/ResumenInventario"; // <-- Importa el resumen
import InventarioService from "../services/inventarioService";

function Inventario() {
  const [movimientos, setMovimientos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingMovimiento, setEditingMovimiento] = useState(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  useEffect(() => {
    loadMovimientos();
  }, []);

  const showMessage = (text, type) => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 4000);
  };

  const loadMovimientos = async () => {
    try {
      setLoading(true);
      const data = await InventarioService.getAllMovimientos();
      setMovimientos(data);
    } catch (error) {
      showMessage("Error al cargar movimientos: " + error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      setFormLoading(true);
      if (editingMovimiento) {
        await InventarioService.updateMovimiento(editingMovimiento._id, formData);
        showMessage("Movimiento actualizado correctamente", "success");
      } else {
        await InventarioService.createMovimiento(formData);
        showMessage("Movimiento registrado correctamente", "success");
      }
      setShowForm(false);
      setEditingMovimiento(null);
      await loadMovimientos();
    } catch (error) {
      showMessage("Error al guardar movimiento: " + error.message, "error");
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (movimiento) => {
    setEditingMovimiento(movimiento);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Eliminar este movimiento?")) {
      try {
        await InventarioService.deleteMovimiento(id);
        showMessage("Movimiento eliminado correctamente", "success");
        await loadMovimientos();
      } catch (error) {
        showMessage("Error al eliminar: " + error.message, "error");
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingMovimiento(null);
  };

  const handleNew = () => {
    setEditingMovimiento(null);
    setShowForm(true);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Inventario</h2>
        <button 
          onClick={handleNew}
          className="btn-new-empleado"
          disabled={loading}
        >
          + Nuevo Movimiento
        </button>
      </div>

      {message && (
        <div className={`message ${messageType}`}>{message}</div>
      )}

      {showForm && (
        <InventarioForm
          movimiento={editingMovimiento}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={formLoading}
        />
      )}

      {/* Aquí llamamos al resumen de inventario usando el componente que hace fetch al backend */}
      <ResumenInventario />

      <div className="card">
        <div className="card-header">
          <h3>Movimientos</h3>
          <button onClick={loadMovimientos} className="btn-refresh" disabled={loading}>
            🔄 {loading ? "Cargando..." : "Actualizar"}
          </button>
        </div>

        <InventarioList
          movimientos={movimientos}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={loading}
        />
      </div>
    </div>
  );
}

export default Inventario;
