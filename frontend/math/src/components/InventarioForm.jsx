import React, { useState, useEffect } from "react";

function InventarioForm({ movimiento, onSubmit, onCancel, loading }) {
  const [formData, setFormData] = useState({
    nombreProducto: "",
    tipoMovimiento: "entrada",
    unidades: 1,
    precioUnitario: 0,
  });

  useEffect(() => {
    if (movimiento) setFormData(movimiento);
  }, [movimiento]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "unidades" || name === "precioUnitario" ? Number(value) : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="form-card">
      <div>
        <label>Producto</label>
        <input type="text" name="nombreProducto" value={formData.nombreProducto} onChange={handleChange} required />
      </div>
      <div>
        <label>Tipo de Movimiento</label>
        <select name="tipoMovimiento" value={formData.tipoMovimiento} onChange={handleChange}>
          <option value="entrada">Entrada</option>
          <option value="salida">Salida</option>
        </select>
      </div>
      <div>
        <label>Unidades</label>
        <input type="number" name="unidades" value={formData.unidades} onChange={handleChange} required />
      </div>
      <div>
        <label>Precio Unitario</label>
        <input type="number" name="precioUnitario" value={formData.precioUnitario} onChange={handleChange} required />
      </div>
      <div className="form-buttons">
        <button type="submit" disabled={loading}>
          {loading ? "Guardando..." : "Guardar"}
        </button>
        <button type="button" onClick={onCancel} disabled={loading}>Cancelar</button>
      </div>
    </form>
  );
}

export default InventarioForm;
