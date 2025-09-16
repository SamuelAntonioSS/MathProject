// components/EmpleadoForm.jsx
import React, { useState, useEffect } from "react";

function EmpleadoForm({ empleado, onSubmit, onCancel, loading }) {
  const [formData, setFormData] = useState({
    nombre: '',
    sueldoBase: '',
    diasTrabajados: '',
    horasExtrasDiurnas: '',
    horasExtrasNocturnas: ''
  });

  const [errors, setErrors] = useState({});

  // Si hay un empleado para editar, llenar el formulario
  useEffect(() => {
    if (empleado) {
      setFormData({
        nombre: empleado.nombre || '',
        sueldoBase: empleado.sueldoBase || '',
        diasTrabajados: empleado.diasTrabajados || '',
        horasExtrasDiurnas: empleado.horasExtrasDiurnas || '',
        horasExtrasNocturnas: empleado.horasExtrasNocturnas || ''
      });
    }
  }, [empleado]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }
    
    if (!formData.sueldoBase || formData.sueldoBase <= 0) {
      newErrors.sueldoBase = 'El sueldo base debe ser mayor a 0';
    }
    
    if (!formData.diasTrabajados || formData.diasTrabajados < 0 || formData.diasTrabajados > 31) {
      newErrors.diasTrabajados = 'Los días trabajados deben estar entre 0 y 31';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Convertir strings a números
      const submitData = {
        ...formData,
        sueldoBase: parseFloat(formData.sueldoBase),
        diasTrabajados: parseInt(formData.diasTrabajados),
        horasExtrasDiurnas: parseFloat(formData.horasExtrasDiurnas) || 0,
        horasExtrasNocturnas: parseFloat(formData.horasExtrasNocturnas) || 0
      };
      
      onSubmit(submitData);
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      sueldoBase: '',
      diasTrabajados: '',
      horasExtrasDiurnas: '',
      horasExtrasNocturnas: ''
    });
    setErrors({});
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="empleado-form">
        <h3>{empleado ? 'Editar Empleado' : 'Nuevo Empleado'}</h3>
        
        <div className="form-group">
          <label>Nombre Completo:</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className={errors.nombre ? 'error' : ''}
            placeholder="Ej: Juan Pérez"
          />
          {errors.nombre && <span className="error-message">{errors.nombre}</span>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Sueldo Base ($):</label>
            <input
              type="number"
              name="sueldoBase"
              value={formData.sueldoBase}
              onChange={handleChange}
              className={errors.sueldoBase ? 'error' : ''}
              placeholder="500.00"
              step="0.01"
            />
            {errors.sueldoBase && <span className="error-message">{errors.sueldoBase}</span>}
          </div>

          <div className="form-group">
            <label>Días Trabajados:</label>
            <input
              type="number"
              name="diasTrabajados"
              value={formData.diasTrabajados}
              onChange={handleChange}
              className={errors.diasTrabajados ? 'error' : ''}
              placeholder="30"
              min="0"
              max="31"
            />
            {errors.diasTrabajados && <span className="error-message">{errors.diasTrabajados}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Horas Extras Diurnas:</label>
            <input
              type="number"
              name="horasExtrasDiurnas"
              value={formData.horasExtrasDiurnas}
              onChange={handleChange}
              placeholder="0"
              step="0.5"
              min="0"
            />
          </div>

          <div className="form-group">
            <label>Horas Extras Nocturnas:</label>
            <input
              type="number"
              name="horasExtrasNocturnas"
              value={formData.horasExtrasNocturnas}
              onChange={handleChange}
              placeholder="0"
              step="0.5"
              min="0"
            />
          </div>
        </div>

        <div className="form-actions">
          <button 
            type="submit" 
            disabled={loading}
            className="btn-primary"
          >
            {loading ? 'Guardando...' : (empleado ? 'Actualizar' : 'Guardar')}
          </button>
          
          <button 
            type="button" 
            onClick={() => {
              resetForm();
              onCancel();
            }}
            className="btn-secondary"
          >
            Cancelar
          </button>
        </div>
      </form>

      <style>{`
        .form-container {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          padding: 2rem;
          border-radius: 20px;
          margin-bottom: 2rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }

        .empleado-form h3 {
          color: #4f46e5;
          margin-bottom: 1.5rem;
          text-align: center;
        }

        .form-group {
          margin-bottom: 1rem;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 600;
          color: #374151;
        }

        .form-group input {
          width: 100%;
          padding: 12px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 1rem;
          transition: border-color 0.3s ease;
        }

        .form-group input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .form-group input.error {
          border-color: #ef4444;
        }

        .error-message {
          color: #ef4444;
          font-size: 0.875rem;
          margin-top: 0.25rem;
          display: block;
        }

        .form-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
          margin-top: 2rem;
        }

        .btn-primary {
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);
        }

        .btn-primary:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .btn-secondary {
          background: #6b7280;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-secondary:hover {
          background: #4b5563;
          transform: translateY(-2px);
        }

        @media (max-width: 768px) {
          .form-row {
            grid-template-columns: 1fr;
          }
          
          .form-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}

export default EmpleadoForm;