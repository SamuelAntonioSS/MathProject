import React from "react";

function GenerarPDF({ planillas, titulo = "Reporte de Planillas" }) {
  
  const generarPDF = () => {
    // Crear el contenido HTML del reporte
    const contenidoHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>${titulo}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
            font-size: 12px;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #333;
            padding-bottom: 10px;
          }
          .company-name {
            font-size: 18px;
            font-weight: bold;
            color: #333;
          }
          .report-title {
            font-size: 14px;
            margin-top: 5px;
            color: #666;
          }
          .report-date {
            font-size: 10px;
            margin-top: 5px;
            color: #999;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
            font-size: 11px;
          }
          th {
            background-color: #f2f2f2;
            font-weight: bold;
            text-align: center;
          }
          .numero {
            text-align: right;
          }
          .centro {
            text-align: center;
          }
          .total-row {
            background-color: #e8f5e8;
            font-weight: bold;
          }
          .summary {
            margin-top: 30px;
            padding: 15px;
            background-color: #f8f9fa;
            border: 1px solid #dee2e6;
            border-radius: 5px;
          }
          .summary h3 {
            margin-top: 0;
            color: #333;
          }
          .summary-item {
            display: flex;
            justify-content: space-between;
            padding: 5px 0;
            border-bottom: 1px solid #eee;
          }
          .footer {
            margin-top: 40px;
            text-align: center;
            font-size: 10px;
            color: #999;
            border-top: 1px solid #ddd;
            padding-top: 10px;
          }
          @media print {
            body { margin: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="company-name">Sistema de Planillas</div>
          <div class="report-title">${titulo}</div>
          <div class="report-date">Generado el: ${new Date().toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}</div>
        </div>

        <table>
          <thead>
            <tr>
              <th>No.</th>
              <th>Empleado</th>
              <th>Días</th>
              <th>H.Ext.D</th>
              <th>H.Ext.N</th>
              <th>Subtotal</th>
              <th>ISS</th>
              <th>AFP</th>
              <th>Retenc.</th>
              <th>Líquido</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            ${planillas.map((planilla, index) => `
              <tr>
                <td class="centro">${index + 1}</td>
                <td>${planilla.empleado?.nombre || 'Sin empleado'}</td>
                <td class="centro">${planilla.diasTrabajados || 0}</td>
                <td class="centro">${planilla.horasExtrasDiurnas || 0}</td>
                <td class="centro">${planilla.horasExtrasNocturnas || 0}</td>
                <td class="numero">$${(planilla.subTotalDevengado || 0).toFixed(2)}</td>
                <td class="numero">$${(planilla.iss || 0).toFixed(2)}</td>
                <td class="numero">$${(planilla.afp || 0).toFixed(2)}</td>
                <td class="numero">$${(planilla.totalRetenciones || 0).toFixed(2)}</td>
                <td class="numero">$${(planilla.liquidoAPagar || 0).toFixed(2)}</td>
                <td class="centro">${new Date(planilla.createdAt || Date.now()).toLocaleDateString('es-ES')}</td>
              </tr>
            `).join('')}
            <tr class="total-row">
              <td colspan="5" class="centro"><strong>TOTALES</strong></td>
              <td class="numero"><strong>$${planillas.reduce((sum, p) => sum + (p.subTotalDevengado || 0), 0).toFixed(2)}</strong></td>
              <td class="numero"><strong>$${planillas.reduce((sum, p) => sum + (p.iss || 0), 0).toFixed(2)}</strong></td>
              <td class="numero"><strong>$${planillas.reduce((sum, p) => sum + (p.afp || 0), 0).toFixed(2)}</strong></td>
              <td class="numero"><strong>$${planillas.reduce((sum, p) => sum + (p.totalRetenciones || 0), 0).toFixed(2)}</strong></td>
              <td class="numero"><strong>$${planillas.reduce((sum, p) => sum + (p.liquidoAPagar || 0), 0).toFixed(2)}</strong></td>
              <td class="centro">-</td>
            </tr>
          </tbody>
        </table>

        <div class="summary">
          <h3>📊 Resumen del Reporte</h3>
          <div class="summary-item">
            <span>Total de planillas:</span>
            <strong>${planillas.length}</strong>
          </div>
          <div class="summary-item">
            <span>Empleados únicos:</span>
            <strong>${new Set(planillas.map(p => p.empleado?._id).filter(Boolean)).size}</strong>
          </div>
          <div class="summary-item">
            <span>Total días trabajados:</span>
            <strong>${planillas.reduce((sum, p) => sum + (p.diasTrabajados || 0), 0)}</strong>
          </div>
          <div class="summary-item">
            <span>Total horas extras:</span>
            <strong>${planillas.reduce((sum, p) => sum + (p.horasExtrasDiurnas || 0) + (p.horasExtrasNocturnas || 0), 0)}</strong>
          </div>
          <div class="summary-item">
            <span>Promedio líquido a pagar:</span>
            <strong>$${planillas.length > 0 ? (planillas.reduce((sum, p) => sum + (p.liquidoAPagar || 0), 0) / planillas.length).toFixed(2) : '0.00'}</strong>
          </div>
        </div>

        <div class="footer">
          <p>Este reporte fue generado automáticamente por el Sistema de Planillas</p>
          <p>Total de registros: ${planillas.length} | Fecha: ${new Date().toLocaleString('es-ES')}</p>
        </div>
      </body>
      </html>
    `;

    // Abrir nueva ventana con el contenido
    const ventana = window.open('', '_blank');
    if (ventana) {
      ventana.document.write(contenidoHTML);
      ventana.document.close();
      
      // Esperar un poco para que cargue el contenido y luego imprimir
      setTimeout(() => {
        ventana.print();
      }, 500);
    } else {
      alert('No se pudo abrir la ventana para generar el PDF. Verifica que no esté bloqueada por el navegador.');
    }
  };

  if (planillas.length === 0) {
    return (
      <div style={{ 
        padding: '15px', 
        backgroundColor: '#fff3cd', 
        border: '1px solid #ffeaa7',
        borderRadius: '5px',
        color: '#856404',
        textAlign: 'center'
      }}>
        ⚠️ No hay planillas para generar el reporte
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: '#e3f2fd',
      padding: '15px',
      borderRadius: '8px',
      border: '1px solid #90caf9',
      marginBottom: '20px'
    }}>
      <h4 style={{ margin: '0 0 15px 0', color: '#1976d2' }}>
        📄 Generar Reporte PDF
      </h4>
      
      <div style={{ marginBottom: '15px', fontSize: '14px', color: '#424242' }}>
        Planillas a incluir: <strong>{planillas.length}</strong> registros
        <br />
        Total a pagar: <strong>${planillas.reduce((sum, p) => sum + (p.liquidoAPagar || 0), 0).toFixed(2)}</strong>
      </div>
      
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <button
          onClick={generarPDF}
          style={{
            backgroundColor: '#f44336',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          🖨️ Imprimir PDF
        </button>
        
        <div style={{ fontSize: '12px', color: '#666', alignSelf: 'center' }}>
          Se abrirá una ventana nueva para imprimir o guardar como PDF
        </div>
      </div>
    </div>
  );
}

export default GenerarPDF;