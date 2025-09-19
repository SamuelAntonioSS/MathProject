import React, { useState, useEffect } from "react";
import InventarioList from "../components/InventarioList";
import InventarioForm from "../components/InventarioForm";
import ResumenInventario from "../components/ResumenInventario";
import InventarioService from "../services/inventarioService";
import { useInventario } from "../contexts/InventarioContext"; // ⭐ AGREGAR ESTA LÍNEA

function Inventario() {
  const [movimientos, setMovimientos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingMovimiento, setEditingMovimiento] = useState(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  // ⭐ AGREGAR ESTAS LÍNEAS - Usar el contexto
  const { notifyMovimientoCreated, notifyMovimientoDeleted } = useInventario();

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
      
      // ⭐ AGREGAR ESTA LÍNEA - Notificar al contexto que hubo un cambio
      notifyMovimientoCreated(
        formData.tipoMovimiento, 
        formData.nombreProducto, 
        formData.unidades
      );
      
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
        
        // ⭐ AGREGAR ESTA LÍNEA - Notificar al contexto que se eliminó un movimiento
        notifyMovimientoDeleted();
        
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