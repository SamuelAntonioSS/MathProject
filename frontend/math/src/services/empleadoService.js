const API_BASE_URL = 'https://mathproject.onrender.com/api'; // Cambia por la URL de tu backend

class EmpleadoService {
  
  // Obtener todos los empleados
  static async getAllEmpleados() {
    try {
      const response = await fetch(`${API_BASE_URL}/empleados`);
      if (!response.ok) {
        throw new Error('Error al obtener empleados');
      }
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  // Crear nuevo empleado
  static async createEmpleado(empleadoData) {
    try {
      const response = await fetch(`${API_BASE_URL}/empleados`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(empleadoData),
      });
      
      if (!response.ok) {
        throw new Error('Error al crear empleado');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  // Actualizar empleado
  static async updateEmpleado(id, empleadoData) {
    try {
      const response = await fetch(`${API_BASE_URL}/empleados/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(empleadoData),
      });
      
      if (!response.ok) {
        throw new Error('Error al actualizar empleado');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  // Eliminar empleado
  static async deleteEmpleado(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/empleados/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Error al eliminar empleado');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }
}

export default EmpleadoService;