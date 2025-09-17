import React, { useState, useEffect } from "react";
import InventarioService from "../services/inventarioService";

function InventarioForm({ movimiento, onSubmit, onCancel, loading }) {
  const [formData, setFormData] = useState({
    nombreProducto: "",
    tipoMovimiento: "entrada",
    unidades: 1,
    precioUnitario: 0,
  });

  const [productosConStock, setProductosConStock] = useState([]);
  const [stockActual, setStockActual] = useState(null);
  const [sugerencias, setSugerencias] = useState([]);

  useEffect(() => {
    if (movimiento) setFormData(movimiento);
  }, [movimiento]);

  useEffect(() => {
    const loadProductosConStock = async () => {
      if (formData.tipoMovimiento === "salida") {
        try {
          const movimientos = await InventarioService.getAllMovimientos();
          const stockMap = {};

          movimientos.forEach((mov) => {
            if (!stockMap[mov.nombreProducto]) stockMap[mov.nombreProducto] = 0;
            if (mov.tipoMovimiento === "entrada") stockMap[mov.nombreProducto] += mov.unidades;
            else if (mov.tipoMovimiento === "salida") stockMap[mov.nombreProducto] -= mov.unidades;
          });

          const disponibles = Object.entries(stockMap)
            .filter(([_, cantidad]) => cantidad > 0)
            .map(([nombre, cantidad]) => ({ nombre, stock: cantidad }));

          setProductosConStock(disponibles);

          // Reset si el producto seleccionado ya no tiene stock
          if (formData.nombreProducto && !disponibles.find(p => p.nombre === formData.nombreProducto)) {
            setFormData(prev => ({ ...prev, nombreProducto: "" }));
            setStockActual(null);
          }
        } catch (error) {
          console.error("Error al cargar productos con stock:", error);
        }
      } else {
        setProductosConStock([]);
        setStockActual(null);
      }
    };

    loadProductosConStock();
  }, [formData.tipoMovimiento, formData.nombreProducto]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Autocompletado para salida
    if (name === "nombreProducto" && formData.tipoMovimiento === "salida") {
      const filtered = productosConStock.filter(p =>
        p.nombre.toLowerCase().includes(value.toLowerCase())
      );
      setSugerencias(filtered);
      const productoSeleccionado = productosConStock.find(p => p.nombre === value);
      setStockActual(productoSeleccionado ? productoSeleccionado.stock : null);
    }

    setFormData(prev => ({
      ...prev,
      [name]: name === "unidades" || name === "precioUnitario" ? Number(value) : value
    }));
  };

  const handleSelectSugerencia = (producto) => {
    setFormData(prev => ({ ...prev, nombreProducto: producto.nombre }));
    setStockActual(producto.stock);
    setSugerencias([]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.tipoMovimiento === "salida" && stockActual !== null && formData.unidades > stockActual) {
      alert(`No hay suficiente stock. Stock disponible: ${stockActual}`);
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="form-card">
      <div>
        <label>Producto</label>
        {formData.tipoMovimiento === "salida" ? (
          <div style={{ position: "relative" }}>
            <input
              type="text"
              name="nombreProducto"
              value={formData.nombreProducto}
              onChange={handleChange}
              required
              autoComplete="off"
            />
            {sugerencias.length > 0 && (
              <ul style={{
                position: "absolute",
                background: "#fff",
                border: "1px solid #ccc",
                width: "100%",
                maxHeight: "150px",
                overflowY: "auto",
                margin: 0,
                padding: "0",
                listStyle: "none",
                zIndex: 10
              }}>
                {sugerencias.map((p) => (
                  <li
                    key={p.nombre}
                    onClick={() => handleSelectSugerencia(p)}
                    style={{ padding: "8px", cursor: "pointer" }}
                  >
                    {p.nombre} (Stock: {p.stock})
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : (
          <input
            type="text"
            name="nombreProducto"
            value={formData.nombreProducto}
            onChange={handleChange}
            required
          />
        )}
      </div>

      <div>
        <label>Tipo de Movimiento</label>
        <select name="tipoMovimiento" value={formData.tipoMovimiento} onChange={handleChange}>
          <option value="entrada">Entrada</option>
          <option value="salida">Salida</option>
        </select>
      </div>

      <div>
        <label>
          Unidades {formData.tipoMovimiento === "salida" && stockActual !== null ? `(Stock disponible: ${stockActual})` : ""}
        </label>
        <input
          type="number"
          name="unidades"
          value={formData.unidades}
          onChange={handleChange}
          required
          min="1"
          max={formData.tipoMovimiento === "salida" && stockActual !== null ? stockActual : undefined}
        />
      </div>

      <div>
        <label>Precio Unitario</label>
        <input
          type="number"
          name="precioUnitario"
          value={formData.precioUnitario}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-buttons">
        <button type="submit" disabled={loading}>
          {loading ? "Guardando..." : "Guardar"}
        </button>
        <button type="button" onClick={onCancel} disabled={loading}>
          Cancelar
        </button>
      </div>
    </form>
  );
}

export default InventarioForm;
