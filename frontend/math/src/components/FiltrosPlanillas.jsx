import React, { useState, useEffect } from "react";
import EmpleadoService from "../services/empleadoService";

function FiltrosPlanillas({ onFilterChange, planillas }) {
  const [empleados, setEmpleados] = useState([]);
  const [filtros, setFiltros] = useState({
    empleadoId: '',
    fechaInicio: '',
    fechaFin: '',
    montoMinimo: '',
    montoMaximo: '',
    busqueda: ''
  });

  useEffect(() => {
    loadEmpleados();
  }, []);

  useEffect(() => {
    aplicarFiltros();
  }, [filtros, planillas]);

  const loadEmpleados = async () => {
    try {
      const data = await EmpleadoService.getAllEmpleados();
      setEmpleados(data);
    } catch (err) {
      console.error('Error al cargar empleados:', err);
    }
  };

  const aplicarFiltros = () => {
    let planillasFiltradas = [...planillas];

    // Filtro por empleado
    if (filtros.empleadoId) {
      planillasFiltradas = planillasFiltradas.filter(p => 
        p.empleado && p.empleado._id === filtros.empleadoId
      );
    }

    // Filtro por fecha (usando timestamps de creación)
    if (filtros.fechaInicio) {
      const fechaInicio = new Date(filtros.fechaInicio);
      planillasFiltradas = planillasFiltradas.filter(p => 
        new Date(p.createdAt) >= fechaInicio
      );
    }

    if (filtros.fechaFin) {
      const fechaFin = new Date(filtros.fechaFin);
      fechaFin.setHours(23, 59, 59, 999); // Final del día
      planillasFiltradas = planillasFiltradas.filter(p => 
        new Date(p.createdAt) <= fechaFin
      );
    }

    // Filtro por monto
    if (filtros.montoMinimo) {
      planillasFiltradas = planillasFiltradas.filter(p => 
        p.liquidoAPagar >= parseFloat(filtros.montoMinimo)
      );
    }

    if (filtros.montoMaximo) {
      planillasFiltradas = planillasFiltradas.filter(p => 
        p.liquidoAPagar <= parseFloat(filtros.montoMaximo)
      );
    }

    // Búsqueda por nombre de empleado
    if (filtros.busqueda) {
      const busqueda = filtros.busqueda.toLowerCase();
      planillasFiltradas = planillasFiltradas.filter(p => 
        p.empleado && p.empleado.nombre.toLowerCase().includes(busqueda)
      );
    }

    if (onFilterChange) {
      onFilterChange(planillasFiltradas);
    }
  };

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const limpiarFiltros = () => {
    setFiltros({
      empleadoId: '',
      fechaInicio: '',
      fechaFin: '',
      montoMinimo: '',
      montoMaximo: '',
      busqueda: ''
    });
  };

  const obtenerFechaHoy = () => {
    const hoy = new Date();
    return hoy.toISOString().split('T')[0];
  };

  const obtenerFechaHace30Dias = () => {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() - 30);
    return fecha.toISOString().split('T')[0];
  };

  return (
    <div style={{
      backgroundColor: '#f8f9fa',
      padding: '20px',
      borderRadius: '8px',
      marginBottom: '20px',
      border: '1px solid #dee2e6'
    }}>
      <h4 style={{ marginTop: 0, marginBottom: '15px' }}>🔍 Filtros y Búsqueda</h4>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
        
        {/* Búsqueda por nombre */}
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '12px' }}>
            Buscar por nombre:
          </label>
          <input
            type="text"
            name="busqueda"
            value={filtros.busqueda}
            onChange={handleFiltroChange}
            placeholder="Nombre del empleado..."
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '3px',
              border: '1px solid #ccc',
              fontSize: '14px'
            }}
          />
        </div>

        {/* Filtro por empleado */}
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '12px' }}>
            Empleado específico:
          </label>
          <select
            name="empleadoId"
            value={filtros.empleadoId}
            onChange={handleFiltroChange}
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '3px',
              border: '1px solid #ccc',
              fontSize: '14px'
            }}
          >
            <option value="">Todos los empleados</option>
            {empleados.map(emp => (
              <option key={emp._id} value={emp._id}>
                {emp.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Fecha inicio */}
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '12px' }}>
            Desde fecha:
          </label>
          <input
            type="date"
            name="fechaInicio"
            value={filtros.fechaInicio}
            onChange={handleFiltroChange}
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '3px',
              border: '1px solid #ccc',
              fontSize: '14px'
            }}
          />
        </div>

        {/* Fecha fin */}
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '12px' }}>
            Hasta fecha:
          </label>
          <input
            type="date"
            name="fechaFin"
            value={filtros.fechaFin}
            onChange={handleFiltroChange}
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '3px',
              border: '1px solid #ccc',
              fontSize: '14px'
            }}
          />
        </div>

        {/* Monto mínimo */}
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '12px' }}>
            Monto mínimo:
          </label>
          <input
            type="number"
            name="montoMinimo"
            value={filtros.montoMinimo}
            onChange={handleFiltroChange}
            placeholder="$0.00"
            step="0.01"
            min="0"
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '3px',
              border: '1px solid #ccc',
              fontSize: '14px'
            }}
          />
        </div>

        {/* Monto máximo */}
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '12px' }}>
            Monto máximo:
          </label>
          <input
            type="number"
            name="montoMaximo"
            value={filtros.montoMaximo}
            onChange={handleFiltroChange}
            placeholder="$9999.99"
            step="0.01"
            min="0"
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '3px',
              border: '1px solid #ccc',
              fontSize: '14px'
            }}
          />
        </div>
      </div>

      {/* Botones de filtros rápidos */}
      <div style={{ marginTop: '15px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <button
          onClick={() => setFiltros(prev => ({ ...prev, fechaInicio: obtenerFechaHoy(), fechaFin: obtenerFechaHoy() }))}
          style={{
            backgroundColor: '#17a2b8',
            color: 'white',
            padding: '6px 12px',
            border: 'none',
            borderRadius: '3px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          Hoy
        </button>
        
        <button
          onClick={() => setFiltros(prev => ({ ...prev, fechaInicio: obtenerFechaHace30Dias(), fechaFin: obtenerFechaHoy() }))}
          style={{
            backgroundColor: '#17a2b8',
            color: 'white',
            padding: '6px 12px',
            border: 'none',
            borderRadius: '3px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          Últimos 30 días
        </button>

        <button
          onClick={limpiarFiltros}
          style={{
            backgroundColor: '#6c757d',
            color: 'white',
            padding: '6px 12px',
            border: 'none',
            borderRadius: '3px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          Limpiar filtros
        </button>
      </div>

      {/* Indicador de filtros activos */}
      <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
        {Object.values(filtros).some(v => v) && (
          <span>🔸 Filtros activos aplicados</span>
        )}
      </div>
    </div>
  );
}

export default FiltrosPlanillas;