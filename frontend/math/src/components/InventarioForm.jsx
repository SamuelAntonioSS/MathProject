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

  // Función para manejar el focus en campos numéricos
  const handleFocusNumericField = (e) => {
    // Seleccionar todo el texto cuando se hace focus
    e.target.select();
  };

  // Función para manejar el click en campos numéricos  
  const handleClickNumericField = (e) => {
    // Seleccionar todo el texto cuando se hace click
    e.target.select();
  };

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

  const styles = {
    formContainer: {
      maxWidth: '500px',
      margin: '0 auto',
      padding: '32px',
      backgroundColor: '#ffffff',
      borderRadius: '16px',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
      border: '1px solid #e5e7eb',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    },
    
    formTitle: {
      fontSize: '24px',
      fontWeight: '700',
      color: '#1f2937',
      marginBottom: '24px',
      textAlign: 'center',
      letterSpacing: '-0.025em'
    },

    inputGroup: {
      marginBottom: '24px'
    },

    label: {
      display: 'block',
      fontSize: '14px',
      fontWeight: '600',
      color: '#374151',
      marginBottom: '8px',
      letterSpacing: '0.025em'
    },

    input: {
      width: '100%',
      padding: '12px 16px',
      fontSize: '16px',
      border: '2px solid #e5e7eb',
      borderRadius: '12px',
      backgroundColor: '#ffffff',
      color: '#1f2937',
      transition: 'all 0.2s ease-in-out',
      outline: 'none',
      boxSizing: 'border-box'
    },

    inputFocus: {
      borderColor: '#3b82f6',
      boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)'
    },

    select: {
      width: '100%',
      padding: '12px 16px',
      fontSize: '16px',
      border: '2px solid #e5e7eb',
      borderRadius: '12px',
      backgroundColor: '#ffffff',
      color: '#1f2937',
      cursor: 'pointer',
      outline: 'none',
      boxSizing: 'border-box',
      appearance: 'none',
      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
      backgroundPosition: 'right 12px center',
      backgroundRepeat: 'no-repeat',
      backgroundSize: '16px',
      paddingRight: '48px'
    },

    autocompleteContainer: {
      position: 'relative'
    },

    suggestionsList: {
      position: 'absolute',
      top: '100%',
      left: '0',
      right: '0',
      backgroundColor: '#ffffff',
      border: '2px solid #e5e7eb',
      borderTop: 'none',
      borderRadius: '0 0 12px 12px',
      maxHeight: '200px',
      overflowY: 'auto',
      zIndex: 1000,
      margin: 0,
      padding: 0,
      listStyle: 'none',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
    },

    suggestionItem: {
      padding: '12px 16px',
      cursor: 'pointer',
      fontSize: '14px',
      color: '#374151',
      borderBottom: '1px solid #f3f4f6',
      transition: 'background-color 0.15s ease-in-out'
    },

    suggestionItemHover: {
      backgroundColor: '#f3f4f6'
    },

    stockInfo: {
      fontSize: '12px',
      color: '#6b7280',
      marginTop: '4px',
      fontWeight: '500'
    },

    stockAvailable: {
      color: '#059669'
    },

    buttonGroup: {
      display: 'flex',
      gap: '12px',
      marginTop: '32px',
      flexDirection: 'column'
    },

    buttonPrimary: {
      width: '100%',
      padding: '14px 24px',
      fontSize: '16px',
      fontWeight: '600',
      backgroundColor: '#3b82f6',
      color: '#ffffff',
      border: 'none',
      borderRadius: '12px',
      cursor: 'pointer',
      transition: 'all 0.2s ease-in-out',
      outline: 'none',
      letterSpacing: '0.025em'
    },

    buttonPrimaryHover: {
      backgroundColor: '#2563eb',
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)'
    },

    buttonSecondary: {
      width: '100%',
      padding: '14px 24px',
      fontSize: '16px',
      fontWeight: '600',
      backgroundColor: '#ffffff',
      color: '#6b7280',
      border: '2px solid #e5e7eb',
      borderRadius: '12px',
      cursor: 'pointer',
      transition: 'all 0.2s ease-in-out',
      outline: 'none',
      letterSpacing: '0.025em'
    },

    buttonSecondaryHover: {
      backgroundColor: '#f9fafb',
      borderColor: '#d1d5db',
      color: '#374151'
    },

    buttonDisabled: {
      opacity: 0.6,
      cursor: 'not-allowed',
      transform: 'none',
      boxShadow: 'none'
    },

    tipoMovimientoEntrada: {
      borderColor: '#10b981',
      backgroundColor: '#f0fdf4'
    },

    tipoMovimientoSalida: {
      borderColor: '#f59e0b',
      backgroundColor: '#fffbeb'
    }
  };

  return (
    <div style={styles.formContainer}>
      <h2 style={styles.formTitle}>
        {movimiento ? 'Editar Movimiento' : 'Nuevo Movimiento de Inventario'}
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Producto</label>
          {formData.tipoMovimiento === "salida" ? (
            <div style={styles.autocompleteContainer}>
              <input
                type="text"
                name="nombreProducto"
                value={formData.nombreProducto}
                onChange={handleChange}
                style={styles.input}
                required
                autoComplete="off"
                placeholder="Buscar producto..."
              />
              {sugerencias.length > 0 && (
                <ul style={styles.suggestionsList}>
                  {sugerencias.map((p) => (
                    <li
                      key={p.nombre}
                      onClick={() => handleSelectSugerencia(p)}
                      style={styles.suggestionItem}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                    >
                      <div>{p.nombre}</div>
                      <div style={{...styles.stockInfo, ...styles.stockAvailable}}>
                        Stock disponible: {p.stock} unidades
                      </div>
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
              style={styles.input}
              placeholder="Nombre del producto"
              required
            />
          )}
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Tipo de Movimiento</label>
          <select 
            name="tipoMovimiento" 
            value={formData.tipoMovimiento} 
            onChange={handleChange}
            style={{
              ...styles.select,
              ...(formData.tipoMovimiento === "entrada" 
                ? styles.tipoMovimientoEntrada 
                : styles.tipoMovimientoSalida
              )
            }}
          >
            <option value="entrada">📦 Entrada (Agregar Stock)</option>
            <option value="salida">📤 Salida (Remover Stock)</option>
          </select>
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>
            Unidades
            {formData.tipoMovimiento === "salida" && stockActual !== null && (
              <span style={{...styles.stockInfo, ...styles.stockAvailable}}>
                {` • Stock disponible: ${stockActual}`}
              </span>
            )}
          </label>
          <input
            type="number"
            name="unidades"
            value={formData.unidades}
            onChange={handleChange}
            onFocus={handleFocusNumericField}
            onClick={handleClickNumericField}
            style={styles.input}
            required
            min="1"
            max={formData.tipoMovimiento === "salida" && stockActual !== null ? stockActual : undefined}
            placeholder="Cantidad de unidades"
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Precio Unitario ($)</label>
          <input
            type="number"
            name="precioUnitario"
            value={formData.precioUnitario}
            onChange={handleChange}
            onFocus={handleFocusNumericField}
            onClick={handleClickNumericField}
            style={styles.input}
            required
            min="0"
            step="0.01"
            placeholder="0.00"
          />
        </div>

        <div style={styles.buttonGroup}>
          <button 
            type="submit" 
            disabled={loading}
            style={{
              ...styles.buttonPrimary,
              ...(loading ? styles.buttonDisabled : {})
            }}
            onMouseEnter={(e) => !loading && Object.assign(e.target.style, styles.buttonPrimaryHover)}
            onMouseLeave={(e) => !loading && Object.assign(e.target.style, styles.buttonPrimary)}
          >
            {loading ? "⏳ Guardando..." : "💾 Guardar Movimiento"}
          </button>
          <button 
            type="button" 
            onClick={onCancel} 
            disabled={loading}
            style={{
              ...styles.buttonSecondary,
              ...(loading ? styles.buttonDisabled : {})
            }}
            onMouseEnter={(e) => !loading && Object.assign(e.target.style, styles.buttonSecondaryHover)}
            onMouseLeave={(e) => !loading && Object.assign(e.target.style, styles.buttonSecondary)}
          >
            ❌ Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default InventarioForm;