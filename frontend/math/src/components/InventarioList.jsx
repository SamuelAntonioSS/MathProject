import React from "react";

function InventarioList({ movimientos, onEdit, onDelete, loading }) {
  if (loading) return <p>Cargando movimientos...</p>;
  if (movimientos.length === 0) return <p>No hay movimientos registrados.</p>;

  return (
    <table className="table">
      <thead>
        <tr>
          <th>Producto</th>
          <th>Tipo</th>
          <th>Unidades</th>
          <th>Precio U.</th>
          <th>Total</th>
          <th>Fecha</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {movimientos.map((mov) => (
          <tr key={mov._id}>
            <td>{mov.nombreProducto}</td>
            <td>{mov.tipoMovimiento}</td>
            <td>{mov.unidades}</td>
            <td>${mov.precioUnitario}</td>
            <td>${mov.total}</td>
            <td>{new Date(mov.createdAt).toLocaleDateString()}</td>
            <td>
              <button onClick={() => onEdit(mov)}>✏️</button>
              <button onClick={() => onDelete(mov._id)}>🗑️</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default InventarioList;
