import React from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

function ExportarReportes({ movimientos = [] }) {
  // Calcular totales
  const totalCompras = movimientos
    .filter(m => m.tipoMovimiento === "entrada")
    .reduce((sum, m) => sum + (m.unidades * m.precioUnitario || 0), 0);

  const totalVentas = movimientos
    .filter(m => m.tipoMovimiento === "salida")
    .reduce((sum, m) => sum + (m.unidades * m.precioUnitario || 0), 0);

  const ganancias = totalVentas - totalCompras;

  // Exportar a PDF
  const handleDownloadPDF = () => {
    if (movimientos.length === 0) {
      alert("No hay movimientos para exportar");
      return;
    }

    const doc = new jsPDF();
    
    // Título
    doc.setFontSize(18);
    doc.text("Reporte de Inventario", 14, 20);
    
    // Fecha del reporte
    doc.setFontSize(10);
    doc.text(`Generado el: ${new Date().toLocaleDateString('es-ES')}`, 14, 30);

    // Tabla de movimientos
    autoTable(doc, {
      startY: 40,
      head: [["Producto", "Tipo", "Unidades", "Precio Unit.", "Total"]],
      body: movimientos.map(m => [
        m.nombreProducto,
        m.tipoMovimiento === "entrada" ? "Entrada" : "Salida",
        m.unidades.toString(),
        `$${(m.precioUnitario || 0).toFixed(2)}`,
        `$${(m.unidades * m.precioUnitario || 0).toFixed(2)}`
      ]),
      foot: [
        ["TOTALES", "", "", "", ""]
      ]
    });

    // Resumen financiero
    const finalY = doc.lastAutoTable.finalY + 15;
    doc.setFontSize(12);
    doc.text("RESUMEN FINANCIERO", 14, finalY);
    
    doc.setFontSize(10);
    doc.text(`Total Compras (Entradas): $${totalCompras.toFixed(2)}`, 14, finalY + 10);
    doc.text(`Total Ventas (Salidas): $${totalVentas.toFixed(2)}`, 14, finalY + 20);
    
    // Color para ganancias
    if (ganancias >= 0) {
      doc.setTextColor(0, 128, 0); // Verde
    } else {
      doc.setTextColor(255, 0, 0); // Rojo
    }
    doc.text(`Ganancias/Pérdidas: $${ganancias.toFixed(2)}`, 14, finalY + 30);

    doc.save(`inventario_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  // Exportar a Excel
  const handleDownloadExcel = () => {
    if (movimientos.length === 0) {
      alert("No hay movimientos para exportar");
      return;
    }

    // Datos de los movimientos
    const movimientosData = movimientos.map(m => ({
      "Producto": m.nombreProducto,
      "Tipo": m.tipoMovimiento === "entrada" ? "Entrada" : "Salida",
      "Unidades": m.unidades,
      "Precio Unitario": m.precioUnitario,
      "Total": m.unidades * m.precioUnitario,
      "Fecha": new Date(m.createdAt || Date.now()).toLocaleDateString('es-ES')
    }));

    // Crear hoja de cálculo
    const worksheet = XLSX.utils.json_to_sheet(movimientosData);

    // Agregar resumen al final
    const resumenData = [
      {},
      { "Producto": "RESUMEN FINANCIERO" },
      { "Producto": "Total Compras (Entradas)", "Total": totalCompras },
      { "Producto": "Total Ventas (Salidas)", "Total": totalVentas },
      { "Producto": "Ganancias/Pérdidas", "Total": ganancias }
    ];

    XLSX.utils.sheet_add_json(worksheet, resumenData, { 
      skipHeader: true, 
      origin: -1 
    });

    // Crear libro y guardar
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Inventario");
    
    const fileName = `inventario_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  const styles = {
    container: {
      backgroundColor: '#f8f9fa',
      padding: '20px',
      borderRadius: '12px',
      marginBottom: '20px',
      border: '1px solid #dee2e6'
    },
    header: {
      marginBottom: '15px'
    },
    title: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#495057',
      marginBottom: '8px'
    },
    resumenRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '15px',
      marginBottom: '15px'
    },
    resumenItem: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '10px',
      backgroundColor: 'white',
      borderRadius: '8px',
      minWidth: '120px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    resumenLabel: {
      fontSize: '12px',
      color: '#6c757d',
      marginBottom: '4px'
    },
    resumenValue: {
      fontSize: '16px',
      fontWeight: 'bold'
    },
    buttonContainer: {
      display: 'flex',
      gap: '12px',
      flexWrap: 'wrap'
    },
    button: {
      backgroundColor: '#007bff',
      color: 'white',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      transition: 'all 0.2s ease'
    },
    buttonPDF: {
      backgroundColor: '#dc3545'
    },
    buttonExcel: {
      backgroundColor: '#28a745'
    },
    buttonDisabled: {
      backgroundColor: '#6c757d',
      cursor: 'not-allowed',
      opacity: 0.6
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>📊 Reportes y Exportación</h3>
      </div>

      {/* Resumen rápido */}
      <div style={styles.resumenRow}>
        <div style={styles.resumenItem}>
          <div style={styles.resumenLabel}>Total Movimientos</div>
          <div style={{...styles.resumenValue, color: '#007bff'}}>
            {movimientos.length}
          </div>
        </div>
        
        <div style={styles.resumenItem}>
          <div style={styles.resumenLabel}>Compras</div>
          <div style={{...styles.resumenValue, color: '#fd7e14'}}>
            ${totalCompras.toFixed(2)}
          </div>
        </div>
        
        <div style={styles.resumenItem}>
          <div style={styles.resumenLabel}>Ventas</div>
          <div style={{...styles.resumenValue, color: '#20c997'}}>
            ${totalVentas.toFixed(2)}
          </div>
        </div>
        
        <div style={styles.resumenItem}>
          <div style={styles.resumenLabel}>Ganancias</div>
          <div style={{
            ...styles.resumenValue, 
            color: ganancias >= 0 ? '#28a745' : '#dc3545'
          }}>
            ${ganancias.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Botones de exportación */}
      <div style={styles.buttonContainer}>
        <button
          onClick={handleDownloadPDF}
          disabled={movimientos.length === 0}
          style={{
            ...styles.button,
            ...styles.buttonPDF,
            ...(movimientos.length === 0 ? styles.buttonDisabled : {})
          }}
          onMouseEnter={(e) => {
            if (movimientos.length > 0) {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
            }
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = 'none';
          }}
        >
          📄 Exportar PDF
        </button>
        
        <button
          onClick={handleDownloadExcel}
          disabled={movimientos.length === 0}
          style={{
            ...styles.button,
            ...styles.buttonExcel,
            ...(movimientos.length === 0 ? styles.buttonDisabled : {})
          }}
          onMouseEnter={(e) => {
            if (movimientos.length > 0) {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
            }
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = 'none';
          }}
        >
          📊 Exportar Excel
        </button>
      </div>

      {movimientos.length === 0 && (
        <div style={{
          textAlign: 'center',
          color: '#6c757d',
          fontStyle: 'italic',
          marginTop: '10px',
          fontSize: '14px'
        }}>
          No hay movimientos para exportar
        </div>
      )}
    </div>
  );
}

export default ExportarReportes;