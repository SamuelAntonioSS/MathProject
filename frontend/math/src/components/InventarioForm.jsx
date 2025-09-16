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
    setFormData((prev) => ({
      ...prev,
      [name]: name === "unidades" || name === "precioUnitario" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <>
      <style>
        {`
          .form-card {
            display: flex;
            flex-direction: column;
            gap: 20px;
            max-width: 100%;
            width: 100%;
            box-sizing: border-box;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 8px;
            background-color: #fff;
            overflow: hidden;
          }

          .form-card div {
            display: flex;
            flex-direction: column;
            gap: 8px;
          }

          .form-card label {
            font-weight: bold;
            font-size: 14px;
            color: #333;
          }

          .form-card input, .form-card select {
            padding: 10px;
            font-size: 16px;
            border: 1px solid #ccc;
            border-radius: 4px;
            width: 100%;
            box-sizing: border-box;
          }

          .form-buttons {
            display: flex;
            justify-content: space-between;
            gap: 10px;
            flex-wrap: wrap;
          }

          .form-buttons button {
            padding: 12px 20px;
            font-size: 16px;
            border: none;
            background-color: #4CAF50;
            color: white;
            cursor: pointer;
            border-radius: 4px;
            width: 48%;  /* Use a percentage to fit on smaller screens */
            box-sizing: border-box;
          }

          .form-buttons button:disabled {
            background-color: #ccc;
            cursor: not-allowed;
          }

          /* Media Query para pantallas pequeñas */
          @media (max-width: 768px) {
            .form-card {
              padding: 15px;
            }

            .form-buttons {
              flex-direction: column;
              gap: 10px;
            }

            .form-buttons button {
              width: 100%;
            }
          }

          /* Prevent any form content from breaking out of its container */
          * {
            box-sizing: border-box;
          }
        `}
      </style>

      <form onSubmit={handleSubmit} className="form-card">
        <div>
          <label>Producto</label>
          <input
            type="text"
            name="nombreProducto"
            value={formData.nombreProducto}
            onChange={handleChange}
            required
          />
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
          <input
            type="number"
            name="unidades"
            value={formData.unidades}
            onChange={handleChange}
            required
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
    </>
  );
}

export default InventarioForm;
