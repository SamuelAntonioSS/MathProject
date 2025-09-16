import React, { useState, useEffect } from "react";
import PlanillaService from "../services/planillaService";

function EditarPlanilla({ planilla, onClose, onPlanillaUpdated }) {
  const [formData, setFormData] = useState({
    diasTrabajados: 0,
    horasExtrasDiurnas: 0,
    horasExtrasNocturnas: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (planilla) {
      setFormData({
        diasTrabajados: planilla.diasTrabajados || 0,
        horasExtrasDiurnas: planilla.horasExtrasDiurnas || 0,
        horasExtrasNocturnas: planilla.horasExtrasNocturnas || 0
      });
    }
  }, [planilla]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await PlanillaService.updatePlanilla(planilla._id, formData);
      alert('Planilla actualizada exitosamente');
      
      if (onPlanillaUpdated) {
        onPlanillaUpdated();
      }
      if (onClose) {
        onClose();
      }
    } catch (err) {
      setError('Error al actualizar planilla: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }));
  };

  if (!planilla) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '8px',
        width: '500px',
        maxHeight: '80vh',
        overflow: 'auto'
      }}>
        <h3>Editar Planilla</h3>
        <p><strong>Empleado:</strong> {planilla.empleado?.nombre || 'Sin nombre'}</p>

        {error && (
          <div style={{
            color: 'red',
            marginBottom: '15px',
            padding: '10px',
            backgroundColor: '#ffe6e6',
            border: '1px solid #ff0000',
            borderRadius: '3px'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Días Trabajados:
            </label>
            <input
              type="number"
              name="diasTrabajados"
              value={formData.diasTrabajados}
              onChange={handleInputChange}
              min="0"
              max="31"
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '3px',
                border: '1px solid #ccc'
              }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Horas Extras Diurnas:
            </label>
            <input
              type="number"
              name="horasExtrasDiurnas"
              value={formData.horasExtrasDiurnas}
              onChange={handleInputChange}
              min="0"
              step="0.5"
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '3px',
                border: '1px solid #ccc'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Horas Extras Nocturnas:
            </label>
            <input
              type="number"
              name="horasExtrasNocturnas"
              value={formData.horasExtrasNocturnas}
              onChange={handleInputChange}
              min="0"
              step="0.5"
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '3px',
                border: '1px solid #ccc'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                backgroundColor: '#6c757d',
                color: 'white',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '3px',
                cursor: 'pointer'
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                backgroundColor: loading ? '#ccc' : '#28a745',
                color: 'white',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '3px',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Actualizando...' : 'Actualizar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditarPlanilla;