import React, { useEffect, useState } from "react";
import InventarioService from "../services/inventarioService";
import { useInventario } from "../contexts/InventarioContext"; // Importar el contexto

function ResumenInventario() {
  const [totales, setTotales] = useState({ totalCompras: 0, totalVentas: 0, ganancias: 0 });
  const [loading, setLoading] = useState(true);
  const { refreshKey, lastUpdate } = useInventario(); // Usar el contexto

  const loadTotales = async () => {
    try {
      setLoading(true);
      const response = await InventarioService.getTotales();
      setTotales(response);
      console.log('📊 Datos del resumen actualizados:', response);
    } catch (error) {
      console.error("Error al cargar totales:", error);
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos inicialmente
  useEffect(() => {
    loadTotales();
  }, []);

  // Recargar datos cuando refreshKey cambie (cuando se notifique una actualización)
  useEffect(() => {
    if (refreshKey > 0) {
      loadTotales();
    }
  }, [refreshKey]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount || 0);
  };

  const styles = {
    container: {
      padding: '24px',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    },

    header: {
      marginBottom: '32px',
      textAlign: 'center'
    },

    title: {
      fontSize: '32px',
      fontWeight: '800',
      color: '#1f2937',
      marginBottom: '8px',
      letterSpacing: '-0.025em'
    },

    subtitle: {
      fontSize: '16px',
      color: '#0a1f49ff',
      fontWeight: '500'
    },

    lastUpdateInfo: {
      fontSize: '12px',
      color: '#6b7280',
      marginTop: '8px',
      fontStyle: 'italic'
    },

    gridContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '24px',
      maxWidth: '1200px',
      margin: '0 auto'
    },

    card: {
      backgroundColor: '#ffffff',
      borderRadius: '20px',
      padding: '32px',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      border: '1px solid #f3f4f6',
      position: 'relative',
      overflow: 'hidden',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      cursor: 'pointer'
    },

    cardHover: {
      transform: 'translateY(-8px)',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
    },

    cardCompras: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },

    cardVentas: {
      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },

    cardGanancias: {
      background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    },

    cardIcon: {
      width: '64px',
      height: '64px',
      borderRadius: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '24px',
      fontSize: '28px',
      background: 'rgba(255, 255, 255, 0.2)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.3)'
    },

    cardContent: {
      position: 'relative',
      zIndex: 1
    },

    cardLabel: {
      fontSize: '14px',
      fontWeight: '600',
      color: 'rgba(255, 255, 255, 0.9)',
      marginBottom: '8px',
      letterSpacing: '0.05em',
      textTransform: 'uppercase'
    },

    cardValue: {
      fontSize: '36px',
      fontWeight: '800',
      color: '#ffffff',
      marginBottom: '12px',
      letterSpacing: '-0.025em',
      textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
    },

    cardDescription: {
      fontSize: '14px',
      color: 'rgba(255, 255, 255, 0.8)',
      fontWeight: '500'
    },

    decorativeShape: {
      position: 'absolute',
      top: '-50%',
      right: '-20%',
      width: '200px',
      height: '200px',
      borderRadius: '50%',
      background: 'rgba(255, 255, 255, 0.1)',
      opacity: 0.3
    },

    loadingCard: {
      backgroundColor: '#f9fafb',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '200px'
    },

    loadingSpinner: {
      width: '40px',
      height: '40px',
      border: '4px solid #e5e7eb',
      borderTop: '4px solid #3b82f6',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    },

    statsRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: '16px',
      paddingTop: '16px',
      borderTop: '1px solid rgba(255, 255, 255, 0.2)'
    },

    trend: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      fontSize: '12px',
      fontWeight: '600',
      color: 'rgba(255, 255, 255, 0.9)'
    },

    badge: {
      padding: '4px 12px',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: '600',
      background: 'rgba(255, 255, 255, 0.2)',
      color: '#ffffff',
      backdropFilter: 'blur(10px)'
    },

    refreshIndicator: {
      position: 'absolute',
      top: '16px',
      right: '16px',
      width: '12px',
      height: '12px',
      borderRadius: '50%',
      background: '#10b981',
      animation: loading ? 'pulse 1.5s ease-in-out infinite' : 'none'
    }
  };

  // Agregar animaciones CSS
  const animationStyles = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
  `;

  useEffect(() => {
    const styleSheet = document.styleSheets[0];
    try {
      styleSheet.insertRule(animationStyles.replace(/\s+/g, ' '), styleSheet.cssRules.length);
    } catch (e) {
      // Si ya existe la regla, ignora el error
    }
  }, []);

  if (loading && refreshKey === 0) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h2 style={styles.title}>Resumen de Inventario</h2>
          <p style={styles.subtitle}>Cargando datos financieros...</p>
        </div>
        <div style={styles.gridContainer}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{...styles.card, ...styles.loadingCard}}>
              <div style={styles.loadingSpinner}></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const cardData = [
    {
      label: 'Total Compras',
      value: formatCurrency(totales.totalCompras),
      description: 'Inversión en inventario',
      icon: '📦',
      style: styles.cardCompras,
      trend: 'Entradas'
    },
    {
      label: 'Total Ventas',
      value: formatCurrency(totales.totalVentas),
      description: 'Ingresos por ventas',
      icon: '💰',
      style: styles.cardVentas,
      trend: 'Salidas'
    },
    {
      label: 'Ganancias',
      value: formatCurrency(totales.ganancias),
      description: 'Beneficio neto',
      icon: '📈',
      style: styles.cardGanancias,
      trend: totales.ganancias >= 0 ? 'Positivo' : 'Negativo'
    }
  ];

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>📊 Dashboard Financiero</h2>
        <p style={styles.subtitle}>Resumen completo de tu inventario y rendimiento</p>
        {lastUpdate && (
          <p style={styles.lastUpdateInfo}>
            Última actualización: {new Date(lastUpdate).toLocaleString('es-ES')}
          </p>
        )}
      </div>

      <div style={styles.gridContainer}>
        {cardData.map((card, index) => (
          <div
            key={index}
            style={{...styles.card, ...card.style, position: 'relative'}}
            onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.cardHover)}
            onMouseLeave={(e) => Object.assign(e.currentTarget.style, {...styles.card, ...card.style, position: 'relative'})}
          >
            {loading && <div style={styles.refreshIndicator}></div>}
            <div style={styles.decorativeShape}></div>
            <div style={styles.cardContent}>
              <div style={styles.cardIcon}>
                {card.icon}
              </div>
              <div style={styles.cardLabel}>{card.label}</div>
              <div style={styles.cardValue}>{card.value}</div>
              <div style={styles.cardDescription}>{card.description}</div>
              
              <div style={styles.statsRow}>
                <div style={styles.trend}>
                  {card.trend === 'Positivo' && '↗️'}
                  {card.trend === 'Negativo' && '↘️'}
                  {card.trend === 'Entradas' && '📥'}
                  {card.trend === 'Salidas' && '📤'}
                  {card.trend}
                </div>
                <div style={styles.badge}>
                  {index === 0 && 'Compras'}
                  {index === 1 && 'Ventas'}
                  {index === 2 && 'Profit'}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ResumenInventario;