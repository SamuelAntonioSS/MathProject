import React, { useEffect, useState } from "react";
import InventarioService from "../services/inventarioService";

function ResumenInventario() {
  const [totales, setTotales] = useState({ totalCompras: 0, totalVentas: 0, ganancias: 0 });

  useEffect(() => {
    const loadTotales = async () => {
      try {
        const response = await InventarioService.getTotales();
        setTotales(response);
      } catch (error) {
        console.error("Error al cargar totales:", error);
      }
    };

    loadTotales();
  }, []);

  return (
    <div className="resumen-card">
      <h3>Resumen de Inventario</h3>
      <p>Total Compras (Entradas): ${totales.totalCompras}</p>
      <p>Total Ventas (Salidas): ${totales.totalVentas}</p>
      <p>Ganancias: ${totales.ganancias}</p>
    </div>
  );
}

export default ResumenInventario;
