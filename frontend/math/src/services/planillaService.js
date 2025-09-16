// src/services/planillaService.js
const API_URL =  'http://localhost:4000/api';

const PlanillaService = {
  // Obtener todas las planillas
  getAllPlanillas: async () => {
    try {
      const response = await fetch(`${API_URL}/planillas`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al obtener planillas:', error);
      throw error;
    }
  },

  // Obtener planilla por ID
  getPlanillaById: async (id) => {
    try {
      const response = await fetch(`${API_URL}/planillas/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al obtener planilla:', error);
      throw error;
    }
  },

  // Crear nueva planilla
  createPlanilla: async (planillaData) => {
    try {
      const response = await fetch(`${API_URL}/planillas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(planillaData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al crear planilla:', error);
      throw error;
    }
  },

  // Actualizar planilla
  updatePlanilla: async (id, planillaData) => {
    try {
      const response = await fetch(`${API_URL}/planillas/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(planillaData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al actualizar planilla:', error);
      throw error;
    }
  },

  // Eliminar planilla
  deletePlanilla: async (id) => {
    try {
      const response = await fetch(`${API_URL}/planillas/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return { success: true };
    } catch (error) {
      console.error('Error al eliminar planilla:', error);
      throw error;
    }
  },

  // Obtener planillas por empleado
  getPlanillasByEmpleado: async (empleadoId) => {
    try {
      const response = await fetch(`${API_URL}/planillas/empleado/${empleadoId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al obtener planillas por empleado:', error);
      throw error;
    }
  },

  // Obtener planillas por rango de fechas
  getPlanillasByFechas: async (fechaInicio, fechaFin) => {
    try {
      const params = new URLSearchParams({
        fechaInicio: fechaInicio,
        fechaFin: fechaFin
      });
      
      const response = await fetch(`${API_URL}/planillas/fechas?${params}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al obtener planillas por fechas:', error);
      throw error;
    }
  }
};

export default PlanillaService;