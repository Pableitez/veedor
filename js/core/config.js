// ========================================
// CONFIGURACIÓN GLOBAL DE LA APLICACIÓN
// ========================================

const CONFIG = {
    // Configuración de la aplicación
    APP_NAME: 'Veedor',
    VERSION: '1.0.0',
    
    // Configuración de localStorage
    STORAGE_KEYS: {
        GASTOS: 'veedorGastos',
        CONFIG: 'veedorConfig'
    },
    
    // Configuración de categorías
    CATEGORIAS: {
        ALIMENTACION: 'alimentacion',
        TRANSPORTE: 'transporte',
        ENTRETENIMIENTO: 'entretenimiento',
        SALUD: 'salud',
        OTROS: 'otros'
    },
    
    // Configuración de validaciones
    VALIDATION: {
        MIN_MONTO: 0.01,
        MAX_MONTO: 999999.99,
        MAX_DESCRIPCION: 100
    },
    
    // Configuración de notificaciones
    NOTIFICATION: {
        DURATION: 3000,
        POSITION: 'top-right'
    }
};

// Exportar para uso global
window.CONFIG = CONFIG;
