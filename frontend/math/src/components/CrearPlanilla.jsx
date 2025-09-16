import React, { useState, useEffect } from "react";
import EmpleadoService from "../services/empleadoService"; // Ajusta la ruta según tu estructura
import PlanillaService from "../services/planillaService"; // Ajusta la ruta según tu estructura

function CrearPlanilla({ onPlanillaCreated }) {
  const [empleados, setEmpleados] = useState([]);
  const [selectedEmpleado, setSelectedEmpleado] = useState("");
  const [formData, setFormData] = useState({
    diasTrabajados: 15,
    horasExtrasDiurnas: 0,
    horasExtrasNocturnas: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadEmpleados();
  }, []);

  const loadEmpleados = async () => {
    try {
      // Usar tu servicio existente
      const empleados = await EmpleadoService.getAllEmpleados();
      setEmpleados(empleados);
      setError(null);
    } catch (err) {
      setError('Error al cargar empleados: ' + err.message);
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedEmpleado) {
      alert('Selecciona un empleado');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const planillaData = {
        empleadoId: selectedEmpleado,
        diasTrabajados: formData.diasTrabajados,
        horasExtrasDiurnas: formData.horasExtrasDiurnas,
        horasExtrasNocturnas: formData.horasExtrasNocturnas
      };

      console.log('Enviando datos:', planillaData); // Para debug

      const result = await PlanillaService.createPlanilla(planillaData);
      console.log('Planilla creada:', result); // Para debug
      
      // Limpiar formulario
      setSelectedEmpleado("");
      setFormData({
        diasTrabajados: 15,
        horasExtrasDiurnas: 0,
        horasExtrasNocturnas: 0
      });
      
      // Notificar al componente padre para que actualice la lista
      if (onPlanillaCreated) {
        onPlanillaCreated();
      }
      
      alert('Planilla creada exitosamente');
    } catch (err) {
      setError('Error al crear planilla: ' + err.message);
      console.error('Error completo:', err);
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

  return (
    <div style={{ 
      marginBottom: '20px', 
      padding: '15px', 
      border: '1px solid #ccc', 
      borderRadius: '5px',
      backgroundColor: '#f8f9fa'
    }}>
      <h3>Crear Nueva Planilla</h3>
      
      {error && (
        <div style={{ 
          color: 'red', 
          marginBottom: '10px',
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
            Empleado:
          </label>
          <select 
            value={selectedEmpleado} 
            onChange={(e) => setSelectedEmpleado(e.target.value)}
            required
            style={{ 
              width: '100%', 
              padding: '8px', 
              borderRadius: '3px',
              border: '1px solid #ccc'
            }}
          >
            <option value="">Seleccionar empleado...</option>
            {empleados.map((emp) => (
              <option key={emp._id} value={emp._id}>
                {emp.nombre} - Sueldo Base: ${emp.sueldoBase}
              </option>
            ))}
          </select>
          <small style={{ color: '#666' }}>
            Total empleados disponibles: {empleados.length}
          </small>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
          <div>
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
              style={{ width: '100%', padding: '8px', borderRadius: '3px', border: '1px solid #ccc' }}
            />
          </div>

          <div>
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
              style={{ width: '100%', padding: '8px', borderRadius: '3px', border: '1px solid #ccc' }}
            />
          </div>

          <div>
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
              style={{ width: '100%', padding: '8px', borderRadius: '3px', border: '1px solid #ccc' }}
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          style={{ 
            backgroundColor: loading ? '#ccc' : '#28a745', 
            color: 'white', 
            padding: '10px 20px', 
            border: 'none', 
            borderRadius: '3px',
            cursor: loading ? 'not-allowed' : 'pointer',
            marginTop: '15px',
            fontSize: '16px'
          }}
        >
          {loading ? 'Creando...' : 'Crear Planilla'}
        </button>
      </form>
    </div>
  );
}

export default CrearPlanilla;