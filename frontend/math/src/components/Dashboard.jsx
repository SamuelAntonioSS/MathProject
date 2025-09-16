import React from "react";

function Dashboard({ planillas }) {
  if (!planillas || planillas.length === 0) {
    return (
      <div style={{
        backgroundColor: '#f8f9fa',
        padding: '20px',
        borderRadius: '8px',
        border: '1px solid #dee2e6',
        textAlign: 'center',
        marginBottom: '20px'
      }}>
        <h3>📊 Dashboard de Planillas</h3>
        <p style={{ color: '#666' }}>No hay datos para mostrar estadísticas</p>
      </div>
    );
  }

  // Cálculos para el dashboard
  const totalPlanillas = planillas.length;
  const empleadosUnicos = new Set(planillas.map(p => p.empleado?._id).filter(Boolean)).size;
  const totalLiquidoAPagar = planillas.reduce((sum, p) => sum + (p.liquidoAPagar || 0), 0);
  const totalRetenciones = planillas.reduce((sum, p) => sum + (p.totalRetenciones || 0), 0);
  const totalDevengado = planillas.reduce((sum, p) => sum + (p.subTotalDevengado || 0), 0);
  const totalDiasTrabajados = planillas.reduce((sum, p) => sum + (p.diasTrabajados || 0), 0);
  const totalHorasExtras = planillas.reduce((sum, p) => sum + (p.horasExtrasDiurnas || 0) + (p.horasExtrasNocturnas || 0), 0);
  
  const promedioLiquido = totalPlanillas > 0 ? totalLiquidoAPagar / totalPlanillas : 0;
  const promedioDias = totalPlanillas > 0 ? totalDiasTrabajados / totalPlanillas : 0;

  // Top 3 empleados por líquido a pagar
  const empleadosPorLiquido = planillas
    .filter(p => p.empleado?.nombre)
    .reduce((acc, p) => {
      const empleado = p.empleado.nombre;
      if (!acc[empleado]) {
        acc[empleado] = { total: 0, planillas: 0 };
      }
      acc[empleado].total += p.liquidoAPagar || 0;
      acc[empleado].planillas += 1;
      return acc;
    }, {});

  const top3Empleados = Object.entries(empleadosPorLiquido)
    .map(([nombre, data]) => ({ nombre, ...data }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 3);

  // Planillas por mes
  const planillasPorMes = planillas.reduce((acc, p) => {
    const fecha = new Date(p.createdAt || Date.now());
    const mes = fecha.toLocaleDateString('es-ES', { year: 'numeric', month: 'long' });
    acc[mes] = (acc[mes] || 0) + 1;
    return acc;
  }, {});

  return (
    <div style={{
      backgroundColor: '#f8f9fa',
      padding: '20px',
      borderRadius: '8px',
      border: '1px solid #dee2e6',
      marginBottom: '20px'
    }}>
      <h3 style={{ margin: '0 0 20px 0', color: '#333', textAlign: 'center' }}>
        📊 Dashboard de Planillas
      </h3>

      {/* Tarjetas de estadísticas principales */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '15px',
        marginBottom: '25px'
      }}>
        
        <div style={{
          backgroundColor: '#e8f5e8',
          padding: '15px',
          borderRadius: '8px',
          border: '1px solid #c3e6c3',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#28a745' }}>
            {totalPlanillas}
          </div>
          <div style={{ fontSize: '14px', color: '#666' }}>Total Planillas</div>
        </div>

        <div style={{
          backgroundColor: '#e3f2fd',
          padding: '15px',
          borderRadius: '8px',
          border: '1px solid #90caf9',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1976d2' }}>
            {empleadosUnicos}
          </div>
          <div style={{ fontSize: '14px', color: '#666' }}>Empleados Únicos</div>
        </div>

        <div style={{
          backgroundColor: '#fff3e0',
          padding: '15px',
          borderRadius: '8px',
          border: '1px solid #ffcc02',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f57c00' }}>
            ${totalLiquidoAPagar.toFixed(2)}
          </div>
          <div style={{ fontSize: '14px', color: '#666' }}>Total Líquido</div>
        </div>

        <div style={{
          backgroundColor: '#fce4ec',
          padding: '15px',
          borderRadius: '8px',
          border: '1px solid #f8bbd9',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#c2185b' }}>
            ${totalRetenciones.toFixed(2)}
          </div>
          <div style={{ fontSize: '14px', color: '#666' }}>Total Retenciones</div>
        </div>
      </div>

      {/* Estadísticas adicionales */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px'
      }}>
        
        {/* Promedios */}
        <div style={{
          backgroundColor: 'white',
          padding: '15px',
          borderRadius: '8px',
          border: '1px solid #dee2e6'
        }}>
          <h4 style={{ margin: '0 0 15px 0', color: '#333' }}>📈 Promedios</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Líquido por planilla:</span>
              <strong>${promedioLiquido.toFixed(2)}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Días por planilla:</span>
              <strong>{promedioDias.toFixed(1)}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Total días trabajados:</span>
              <strong>{totalDiasTrabajados}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Total horas extras:</span>
              <strong>{totalHorasExtras}</strong>
            </div>
          </div>
        </div>

        {/* Top empleados */}
        <div style={{
          backgroundColor: 'white',
          padding: '15px',
          borderRadius: '8px',
          border: '1px solid #dee2e6'
        }}>
          <h4 style={{ margin: '0 0 15px 0', color: '#333' }}>🏆 Top Empleados por Líquido</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {top3Empleados.map((emp, index) => (
              <div key={index} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '8px',
                backgroundColor: index === 0 ? '#fff3e0' : '#f8f9fa',
                borderRadius: '4px'
              }}>
                <div>
                  <div style={{ fontWeight: 'bold' }}>
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'} {emp.nombre}
                  </div>
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    {emp.planillas} planilla{emp.planillas !== 1 ? 's' : ''}
                  </div>
                </div>
                <div style={{ fontWeight: 'bold', color: '#28a745' }}>
                  ${emp.total.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Distribución por mes */}
        {Object.keys(planillasPorMes).length > 1 && (
          <div style={{
            backgroundColor: 'white',
            padding: '15px',
            borderRadius: '8px',
            border: '1px solid #dee2e6'
          }}>
            <h4 style={{ margin: '0 0 15px 0', color: '#333' }}>📅 Planillas por Mes</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {Object.entries(planillasPorMes)
                .sort(([a], [b]) => new Date(a) - new Date(b))
                .map(([mes, cantidad]) => (
                  <div key={mes} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '5px 0',
                    borderBottom: '1px solid #eee'
                  }}>
                    <span>{mes}:</span>
                    <strong>{cantidad}</strong>
                  </div>
                ))
              }
            </div>
          </div>
        )}

        {/* Resumen financiero */}
        <div style={{
          backgroundColor: 'white',
          padding: '15px',
          borderRadius: '8px',
          border: '1px solid #dee2e6'
        }}>
          <h4 style={{ margin: '0 0 15px 0', color: '#333' }}>💰 Resumen Financiero</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Total Devengado:</span>
              <strong style={{ color: '#17a2b8' }}>${totalDevengado.toFixed(2)}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Total Retenciones:</span>
              <strong style={{ color: '#dc3545' }}>${totalRetenciones.toFixed(2)}</strong>
            </div>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              paddingTop: '8px',
              borderTop: '2px solid #28a745'
            }}>
              <span><strong>Total Líquido:</strong></span>
              <strong style={{ color: '#28a745', fontSize: '18px' }}>${totalLiquidoAPagar.toFixed(2)}</strong>
            </div>
            <div style={{ fontSize: '12px', color: '#666', textAlign: 'center', marginTop: '8px' }}>
              Porcentaje de retención: {totalDevengado > 0 ? ((totalRetenciones / totalDevengado) * 100).toFixed(1) : 0}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;