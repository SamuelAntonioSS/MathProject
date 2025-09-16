import React from "react";

function InventarioList({ movimientos, onEdit, onDelete, loading }) {
  if (loading) return <p>Cargando movimientos...</p>;
  if (movimientos.length === 0) return <p>No hay movimientos registrados.</p>;

  return (
    <>
      <style>
        {`
          /* Estilo general para la tabla */
          .table-container {
            max-width: 100%;
            overflow-x: auto; /* Habilita desplazamiento horizontal */
            margin: 0 auto;
            padding: 20px;
          }

          .table {
            width: 100%;
            border-collapse: collapse;
            min-width: 600px; /* Asegura que la tabla tenga un ancho mínimo */
          }

          .table th, .table td {
            padding: 12px;
            text-align: left;
            border: 1px solid #ddd;
          }

          .table th {
            background-color: #f4f4f4;
            font-weight: bold;
          }

          .table td {
            font-size: 14px;
          }

          /* Estilo para los botones dentro de la tabla */
          .table button {
            padding: 6px 10px;
            margin: 0 5px;
            font-size: 14px;
            cursor: pointer;
          }

          .table button:hover {
            background-color: #f0f0f0;
          }

          /* Media query para pantallas pequeñas */
          @media (max-width: 768px) {
            .table-container {
              padding: 10px; /* Reducir el padding en pantallas pequeñas */
            }

            .table {
              min-width: 100%; /* La tabla ocupará el 100% del ancho disponible */
            }

            .table th, .table td {
              font-size: 12px; /* Reducir el tamaño de la fuente para que quepa mejor */
              padding: 8px; /* Reducir el padding de las celdas */
            }

            /* Hacer los botones más pequeños */
            .table button {
              font-size: 12px;
              padding: 5px 8px;
            }
          }
        `}
      </style>

      <div className="table-container">
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
      </div>
    </>
  );
}

export default InventarioList;
