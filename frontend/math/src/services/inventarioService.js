const API_URL = 'https://mathproject.onrender.com/api';

const InventarioService = {
  // Obtener todos los movimientos
  getAllMovimientos: async () => {
    try {
      const response = await fetch(`${API_URL}/inventario/movimientos`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching movimientos:', error);
      throw new Error('No se pudieron cargar los movimientos');
    }
  },

  // Crear nuevo movimiento
  createMovimiento: async (movimientoData) => {
    try {
      const response = await fetch(`${API_URL}/inventario/movimientos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(movimientoData),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error creating movimiento:', error);
      throw new Error('No se pudo crear el movimiento');
    }
  },

  // Actualizar movimiento existente
  updateMovimiento: async (id, movimientoData) => {
    try {
      const response = await fetch(`${API_URL}/inventario/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(movimientoData),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error updating movimiento:', error);
      throw new Error('No se pudo actualizar el movimiento');
    }
  },

  // Eliminar movimiento
  deleteMovimiento: async (id) => {
    try {
      const response = await fetch(`${API_URL}/inventario/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error deleting movimiento:', error);
      throw new Error('No se pudo eliminar el movimiento');
    }
  },

  // 🔥 NUEVO: Obtener totales directamente desde el backend
  getTotales: async () => {
    try {
      const response = await fetch(`${API_URL}/inventario/totales`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json(); // { totalCompras, totalVentas, ganancias }
    } catch (error) {
      console.error('Error fetching totales:', error);
      throw new Error('No se pudieron cargar los totales');
    }
  },

  // Opción: calcular resumen en frontend si no quieres backend
  getResumenInventario: async () => {
    try {
      const movimientos = await this.getAllMovimientos();
      let totalEntradas = 0, totalSalidas = 0;
      movimientos.forEach(mov => {
        if (mov.tipoMovimiento === 'entrada') totalEntradas += mov.total;
        else if (mov.tipoMovimiento === 'salida') totalSalidas += mov.total;
      });
      return {
        totalEntradas,
        totalSalidas,
        balance: totalEntradas - totalSalidas,
        totalMovimientos: movimientos.length
      };
    } catch (error) {
      console.error('Error getting resumen:', error);
      throw new Error('No se pudo obtener el resumen');
    }
  }
};

export default InventarioService;
