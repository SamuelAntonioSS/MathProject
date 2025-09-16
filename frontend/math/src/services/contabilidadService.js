const API_BASE_URL = 'https://mathproject.onrender.com/api'; // Cambia el puerto según tu backend

const contabilidadService = {
  // Obtener todos los registros de contabilidad
  getContabilidad: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/contabilidad`);
      if (!response.ok) {
        throw new Error('Error al obtener datos de contabilidad');
      }
      return await response.json();
    } catch (error) {
      console.error('Error en getContabilidad:', error);
      throw error;
    }
  },

  // Crear nuevo registro contable
  createContabilidad: async (data) => {
    try {
      const response = await fetch(`${API_BASE_URL}/contabilidad`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error('Error al crear registro contable');
      }
      return await response.json();
    } catch (error) {
      console.error('Error en createContabilidad:', error);
      throw error;
    }
  },

  // Actualizar registro contable
  updateContabilidad: async (id, data) => {
    try {
      const response = await fetch(`${API_BASE_URL}/contabilidad/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error('Error al actualizar registro contable');
      }
      return await response.json();
    } catch (error) {
      console.error('Error en updateContabilidad:', error);
      throw error;
    }
  },

  // Eliminar registro contable
  deleteContabilidad: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/contabilidad/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('Error al eliminar registro contable');
      }
      return await response.json();
    } catch (error) {
      console.error('Error en deleteContabilidad:', error);
      throw error;
    }
  }
};

export default contabilidadService;