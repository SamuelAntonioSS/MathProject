import React, { useState, useEffect } from "react";
import PlanillaService from "../services/planillaService";
import CrearPlanilla from "../components/CrearPlanilla";
import EditarPlanilla from "../components/EditarPlanilla";
import FiltrosPlanillas from "../components/FiltrosPlanillas";
import GenerarPDF from "../components/GenerarPDF";
import GenerarExcel from "../components/GenerarExcel";
import Dashboard from "../components/Dashboard";

function Planilla() {
  const [planillas, setPlanillas] = useState([]);
  const [planillasFiltradas, setPlanillasFiltradas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [planillaEditando, setPlanillaEditando] = useState(null);

  // Cargar planillas al montar el componente
  useEffect(() => {
    loadPlanillas();
  }, []);

  const loadPlanillas = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await PlanillaService.getAllPlanillas();
      console.log('Planillas cargadas:', data);

      setPlanillas(data);
      setPlanillasFiltradas(data);
    } catch (err) {
      setError('Error al cargar las planillas: ' + err.message);
      console.error('Error completo:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta planilla?')) {
      try {
        await PlanillaService.deletePlanilla(id);
        loadPlanillas();
        alert('Planilla eliminada exitosamente');
      } catch (err) {
        setError('Error al eliminar la planilla: ' + err.message);
        console.error(err);
      }
    }
  };

  const handleEdit = (planilla) => {
    setPlanillaEditando(planilla);
  };

  const handleCloseEdit = () => {
    setPlanillaEditando(null);
  };

  const handlePlanillaUpdated = () => {
    loadPlanillas();
    setPlanillaEditando(null);
  };

  const handleFilterChange = (filtradas) => {
    setPlanillasFiltradas(filtradas);
  };

  if (loading) {
    return (
      <div className="container">
        <div style={{ 
          textAlign: 'center', 
          padding: '40px',
          fontSize: '18px',
          color: '#666'
        }}>
          ⏳ Cargando planillas...
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h2 style={{ 
        textAlign: 'center', 
        marginBottom: '30px',
        color: '#333',
        borderBottom: '3px solid #007bff',
        paddingBottom: '10px'
      }}>
        💼 Sistema de Planillas Quincenal
      </h2>

      {/* Dashboard de resumen */}
      <Dashboard planillas={planillas} />
      
      {/* Componente para crear nueva planilla */}
      <CrearPlanilla onPlanillaCreated={loadPlanillas} />

      {/* Componente de filtros */}
      <FiltrosPlanillas 
        planillas={planillas}
        onFilterChange={handleFilterChange}
      />

      {/* Componentes para generar reportes */}
      <div style={{ 
        display: 'flex', 
        gap: '15px', 
        marginBottom: '20px',
        justifyContent: 'center',
        flexWrap: 'wrap'
      }}>
        <GenerarPDF 
          planillas={planillasFiltradas}
          titulo="Reporte de Planillas Filtradas"
        />
        
        <GenerarExcel 
          planillas={planillasFiltradas}
          titulo="Reporte de Planillas Filtradas"
        />
      </div>
      
      {/* Botones de control */}
      <div style={{ 
        marginBottom: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <button 
          onClick={loadPlanillas} 
          style={{ 
            backgroundColor: '#007bff', 
            color: 'white', 
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          🔄 Actualizar Lista
        </button>
        
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <span style={{ color: '#130606ff', fontSize: '14px' }}>
            📊 Total: <strong>{planillas.length}</strong> planillas | 
            📋 Filtradas: <strong>{planillasFiltradas.length}</strong>
          </span>
        </div>
      </div>

      {/* Mostrar errores */}
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
          <button 
            onClick={loadPlanillas} 
            style={{ 
              marginLeft: '10px',
              backgroundColor: 'transparent',
              border: 'none',
              color: 'blue',
              textDecoration: 'underline',
              cursor: 'pointer'
            }}
          >
            Reintentar
          </button>
        </div>
      )}

      {/* Modal de edición */}
      {planillaEditando && (
        <EditarPlanilla
          planilla={planillaEditando}
          onClose={handleCloseEdit}
          onPlanillaUpdated={handlePlanillaUpdated}
        />
      )}
      
      {/* Tabla de planillas */}
      {planillasFiltradas.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px',
          backgroundColor: '#f8f9fa',
          border: '1px solid #dee2e6',
          borderRadius: '5px'
        }}>
          <h4>No hay planillas que coincidan con los filtros</h4>
          <p>Intenta ajustar los criterios de búsqueda.</p>
        </div>
      ) : (
        <div className="card" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <th style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'left' }}>Empleado</th>
                <th style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'center' }}>Días Trabajados</th>
                <th style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'center' }}>H. Extras Diurnas</th>
                <th style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'center' }}>H. Extras Nocturnas</th>
                <th style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'right' }}>Subtotal Devengado</th>
                <th style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'right' }}>ISS</th>
                <th style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'right' }}>AFP</th>
                <th style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'right' }}>ISR</th> {/* Nueva columna */}
                <th style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'right' }}>Total Retenciones</th>
                <th style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'right' }}>Líquido a Pagar</th>
                <th style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'center' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {planillasFiltradas.map((planilla) => (
                <tr key={planilla._id} style={{ borderBottom: '1px solid #dee2e6' }}>
                  <td style={{ padding: '12px', border: '1px solid #dee2e6' }}>
                    {planilla.empleado && planilla.empleado.nombre 
                      ? `${planilla.empleado.nombre} ${planilla.empleado.apellido || ''}`
                      : 'Empleado no encontrado'
                    }
                  </td>
                  <td style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'center' }}>
                    {planilla.diasTrabajados || 0}
                  </td>
                  <td style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'center' }}>
                    {planilla.horasExtrasDiurnas || 0}
                  </td>
                  <td style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'center' }}>
                    {planilla.horasExtrasNocturnas || 0}
                  </td>
                  <td style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'right' }}>
                    ${(planilla.subTotalDevengado || 0).toFixed(2)}
                  </td>
                  <td style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'right' }}>
                    ${(planilla.iss || 0).toFixed(2)}
                  </td>
                  <td style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'right' }}>
                    ${(planilla.afp || 0).toFixed(2)}
                  </td>
                  <td style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'right' }}>
                    ${(planilla.isr || 0).toFixed(2)} {/* Muestra el ISR */}
                  </td>
                  <td style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'right' }}>
                    ${(planilla.totalRetenciones || 0).toFixed(2)}
                  </td>
                  <td style={{ 
                    padding: '12px', 
                    border: '1px solid #dee2e6', 
                    textAlign: 'right',
                    fontWeight: 'bold',
                    backgroundColor: '#e8f5e8'
                  }}>
                    ${(planilla.liquidoAPagar || 0).toFixed(2)}
                  </td>
                  <td style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                      <button 
                        onClick={() => handleEdit(planilla)}
                        style={{ 
                          backgroundColor: '#28a745', 
                          color: 'white', 
                          border: 'none', 
                          padding: '6px 12px',
                          cursor: 'pointer',
                          borderRadius: '3px',
                          fontSize: '12px'
                        }}
                      >
                        ✏️ Editar
                      </button>
                      <button 
                        onClick={() => handleDelete(planilla._id)}
                        style={{ 
                          backgroundColor: '#dc3545', 
                          color: 'white', 
                          border: 'none', 
                          padding: '6px 12px',
                          cursor: 'pointer',
                          borderRadius: '3px',
                          fontSize: '12px'
                        }}
                      >
                        🗑️ Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Planilla;
