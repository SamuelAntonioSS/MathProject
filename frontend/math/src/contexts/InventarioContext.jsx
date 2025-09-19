import React, { createContext, useContext, useState, useCallback } from 'react';

// Crear el contexto
const InventarioContext = createContext();

// Hook para usar el contexto
export const useInventario = () => {
  const context = useContext(InventarioContext);
  if (!context) {
    throw new Error('useInventario debe usarse dentro de InventarioProvider');
  }
  return context;
};

// Provider del contexto
export const InventarioProvider = ({ children }) => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [lastUpdate, setLastUpdate] = useState(null);

  // Función para forzar actualización del resumen
  const refreshResumen = useCallback(() => {
    setRefreshKey(prev => prev + 1);
    setLastUpdate(new Date().toISOString());
    console.log('📊 Actualizando resumen de inventario...');
  }, []);

  // Función para notificar cuando se crea/actualiza un movimiento
  const notifyMovimientoCreated = useCallback((tipo, producto, cantidad) => {
    console.log(`✅ ${tipo} realizada: ${producto} - ${cantidad} unidades`);
    refreshResumen();
  }, [refreshResumen]);

  // Función para notificar cuando se elimina un movimiento  
  const notifyMovimientoDeleted = useCallback(() => {
    console.log('🗑️ Movimiento eliminado');
    refreshResumen();
  }, [refreshResumen]);

  const value = {
    refreshKey,
    lastUpdate,
    refreshResumen,
    notifyMovimientoCreated,
    notifyMovimientoDeleted
  };

  return (
    <InventarioContext.Provider value={value}>
      {children}
    </InventarioContext.Provider>
  );
};

export default InventarioContext;