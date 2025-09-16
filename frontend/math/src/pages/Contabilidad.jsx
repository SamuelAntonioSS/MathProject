import React, { useState, useEffect } from "react";
import contabilidadService from "../services/contabilidadService";
import ContabilidadList from "../components/ContabilidadList";

function Contabilidad() {
  const [contabilidad, setContabilidad] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    proveedores: 0,
    impuestosPorPagar: 0,
    ivaPorPagar: 0,
    obligacionesEmpleados: 0,
    retencionesPorPagar: 0
  });
  const [editingId, setEditingId] = useState(null);

  // Cargar datos al montar el componente
  useEffect(() => {
    loadContabilidad();
  }, []);

  const loadContabilidad = async () => {
    try {
      setLoading(true);
      const data = await contabilidadService.getContabilidad();
      setContabilidad(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar los datos de contabilidad');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: Number(value) || 0
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await contabilidadService.updateContabilidad(editingId, formData);
      } else {
        await contabilidadService.createContabilidad(formData);
      }
      
      // Recargar datos y resetear formulario
      await loadContabilidad();
      resetForm();
      setShowForm(false);
    } catch (err) {
      setError('Error al guardar el registro');
      console.error(err);
    }
  };

  const handleEdit = (item) => {
    setFormData({
      proveedores: item.proveedores,
      impuestosPorPagar: item.impuestosPorPagar,
      ivaPorPagar: item.ivaPorPagar,
      obligacionesEmpleados: item.obligacionesEmpleados,
      retencionesPorPagar: item.retencionesPorPagar
    });
    setEditingId(item._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este registro?')) {
      try {
        await contabilidadService.deleteContabilidad(id);
        await loadContabilidad();
      } catch (err) {
        setError('Error al eliminar el registro');
        console.error(err);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      proveedores: 0,
      impuestosPorPagar: 0,
      ivaPorPagar: 0,
      obligacionesEmpleados: 0,
      retencionesPorPagar: 0
    });
    setEditingId(null);
  };

  const cancelEdit = () => {
    resetForm();
    setShowForm(false);
  };

  if (loading) return <div className="container"><p>Cargando...</p></div>;
  if (error) return <div className="container"><p style={{color: 'red'}}>{error}</p></div>;

  return (
    <div className="container">
      <h2>Contabilidad</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={() => setShowForm(!showForm)}
          style={{ 
            backgroundColor: '#007bff', 
            color: 'white', 
            padding: '10px 20px', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {showForm ? 'Cancelar' : 'Nuevo Registro'}
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: '20px' }}>
          <h3>{editingId ? 'Editar Registro' : 'Nuevo Registro'}</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
              <div>
                <label>Proveedores:</label>
                <input
                  type="number"
                  name="proveedores"
                  value={formData.proveedores}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '8px', marginTop: '4px' }}
                />
              </div>
              <div>
                <label>Impuestos por Pagar:</label>
                <input
                  type="number"
                  name="impuestosPorPagar"
                  value={formData.impuestosPorPagar}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '8px', marginTop: '4px' }}
                />
              </div>
              <div>
                <label>IVA por Pagar:</label>
                <input
                  type="number"
                  name="ivaPorPagar"
                  value={formData.ivaPorPagar}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '8px', marginTop: '4px' }}
                />
              </div>
              <div>
                <label>Obligaciones Empleados:</label>
                <input
                  type="number"
                  name="obligacionesEmpleados"
                  value={formData.obligacionesEmpleados}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '8px', marginTop: '4px' }}
                />
              </div>
              <div>
                <label>Retenciones por Pagar:</label>
                <input
                  type="number"
                  name="retencionesPorPagar"
                  value={formData.retencionesPorPagar}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '8px', marginTop: '4px' }}
                />
              </div>
            </div>
            <div style={{ marginTop: '15px' }}>
              <button 
                type="submit"
                style={{ 
                  backgroundColor: '#28a745', 
                  color: 'white', 
                  padding: '10px 20px', 
                  border: 'none', 
                  borderRadius: '4px',
                  cursor: 'pointer',
                  marginRight: '10px'
                }}
              >
                {editingId ? 'Actualizar' : 'Guardar'}
              </button>
              <button 
                type="button"
                onClick={cancelEdit}
                style={{ 
                  backgroundColor: '#6c757d', 
                  color: 'white', 
                  padding: '10px 20px', 
                  border: 'none', 
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <ContabilidadList 
        contabilidad={contabilidad} 
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default Contabilidad;