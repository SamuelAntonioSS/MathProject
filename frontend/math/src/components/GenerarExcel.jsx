import React from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

function GenerarExcel({ planillas, titulo = "Reporte de Planillas" }) {
  // Calcular totales
  const cantidadRegistros = planillas?.length || 0;
  const totalAPagar = planillas?.reduce((total, planilla) => {
    return total + (planilla.liquidoAPagar || 0);
  }, 0) || 0;

  const generarExcel = () => {
    if (!planillas || planillas.length === 0) {
      alert("⚠️ No hay planillas para exportar.");
      return;
    }

    // Convertir planillas en un arreglo de objetos plano
    const data = planillas.map((p, index) => ({
      No: index + 1,
      Empleado: p.empleado?.nombre || "Sin empleado",
      Días: p.diasTrabajados || 0,
      "H.Ext.D": p.horasExtrasDiurnas || 0,
      "H.Ext.N": p.horasExtrasNocturnas || 0,
      Subtotal: p.subTotalDevengado || 0,
      ISS: p.iss || 0,
      AFP: p.afp || 0,
      Retenciones: p.totalRetenciones || 0,
      "Líquido a Pagar": p.liquidoAPagar || 0,
      Fecha: new Date(p.createdAt || Date.now()).toLocaleDateString("es-ES"),
    }));

    // Crear hoja de Excel
    const ws = XLSX.utils.json_to_sheet(data);

    // Crear libro
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Planillas");

    // Generar archivo Excel
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });

    // Descargar
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(blob, `${titulo.replace(/\s+/g, "_")}.xlsx`);
  };

  return (
    <div style={{
      backgroundColor: "#e8f5e9",
      padding: "15px",
      borderRadius: "8px",
      border: "1px solid #a5d6a7",
      marginBottom: "20px"
    }}>
      <h4 style={{ margin: "0 0 15px 0", color: "#2e7d32" }}>
        📊 Generar Reporte Excel
      </h4>
      
      {/* Información de resumen */}
      <div style={{
        backgroundColor: "#f1f8e9",
        padding: "12px",
        borderRadius: "6px",
        marginBottom: "15px",
        border: "1px solid #c8e6c9"
      }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "10px",
          fontSize: "14px",
          color: "#2e7d32"
        }}>
          <span>
            <strong>Planillas a incluir:</strong> {cantidadRegistros} registros
          </span>
          <span>
            <strong>Total a pagar:</strong> ${totalAPagar.toFixed(2)}
          </span>
        </div>
      </div>
      
      <button
        onClick={generarExcel}
        disabled={cantidadRegistros === 0}
        style={{
          backgroundColor: cantidadRegistros === 0 ? "#ccc" : "#4caf50",
          color: "white",
          padding: "10px 20px",
          border: "none",
          borderRadius: "5px",
          cursor: cantidadRegistros === 0 ? "not-allowed" : "pointer",
          fontSize: "14px",
          display: "flex",
          alignItems: "center",
          gap: "8px"
        }}
      >
        📥 Descargar Excel
      </button>
    </div>
  );
}

export default GenerarExcel;