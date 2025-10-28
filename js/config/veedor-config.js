// ========================================
// VEEDOR CONFIG - CONFIGURACIÓN GLOBAL
// ========================================

const VeedorConfig = {
    // Configuración de la aplicación
    app: {
        name: 'Veedor Finance Center',
        version: '1.0.0',
        description: 'Centro de Finanzas Personal',
        author: 'Veedor Team'
    },

    // Configuración de almacenamiento
    storage: {
        prefix: 'veedor_',
        version: '1.0.0',
        encryption: false
    },

    // Configuración de categorías por defecto
    defaultCategories: [
        { id: 'food', name: 'Alimentación', color: '#FF6B6B', budget: 300, icon: '🍽️' },
        { id: 'transport', name: 'Transporte', color: '#4ECDC4', budget: 150, icon: '🚗' },
        { id: 'entertainment', name: 'Entretenimiento', color: '#45B7D1', budget: 100, icon: '🎬' },
        { id: 'health', name: 'Salud', color: '#96CEB4', budget: 200, icon: '🏥' },
        { id: 'shopping', name: 'Compras', color: '#FFEAA7', budget: 200, icon: '🛍️' },
        { id: 'utilities', name: 'Servicios', color: '#DDA0DD', budget: 150, icon: '⚡' },
        { id: 'income', name: 'Ingresos', color: '#98D8C8', budget: 0, icon: '💰' },
        { id: 'other', name: 'Otros', color: '#F7DC6F', budget: 100, icon: '📦' }
    ],

    // Configuración de temas
    themes: {
        light: {
            name: 'Claro',
            primary: '#8B5CF6',
            background: '#FFFFFF',
            surface: '#F8FAFC',
            text: '#1F2937'
        },
        dark: {
            name: 'Oscuro',
            primary: '#8B5CF6',
            background: '#111827',
            surface: '#1F2937',
            text: '#F9FAFB'
        }
    },

    // Configuración de monedas
    currency: {
        default: 'EUR',
        symbol: '€',
        locale: 'es-ES',
        decimals: 2
    },

    // Configuración de fechas
    dateFormat: {
        display: 'DD/MM/YYYY',
        input: 'YYYY-MM-DD',
        locale: 'es-ES'
    },

    // Configuración de notificaciones
    notifications: {
        duration: 5000,
        position: 'top-right',
        maxVisible: 5
    },

    // Configuración de gráficos
    charts: {
        colors: [
            '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#3B82F6',
            '#8B5CF6', '#06B6D4', '#84CC16', '#F97316', '#EC4899'
        ],
        animation: {
            duration: 1000,
            easing: 'easeInOutQuart'
        }
    },

    // Configuración de validación
    validation: {
        minAmount: 0.01,
        maxAmount: 999999.99,
        maxDescriptionLength: 100,
        maxNotesLength: 500
    },

    // Configuración de exportación
    export: {
        csv: {
            delimiter: ',',
            encoding: 'utf-8'
        },
        json: {
            pretty: true,
            includeMetadata: true
        }
    },

    // Configuración de API (para futuras integraciones)
    api: {
        baseUrl: '',
        timeout: 10000,
        retries: 3
    },

    // Configuración de desarrollo
    debug: {
        enabled: false,
        logLevel: 'info',
        showPerformance: false
    },

    // Métodos de utilidad
    getCategoryById(id) {
        return this.defaultCategories.find(cat => cat.id === id);
    },

    getCategoryIcon(id) {
        const category = this.getCategoryById(id);
        return category ? category.icon : '📦';
    },

    getCategoryColor(id) {
        const category = this.getCategoryById(id);
        return category ? category.color : '#6B7280';
    },

    formatCurrency(amount) {
        return new Intl.NumberFormat(this.currency.locale, {
            style: 'currency',
            currency: this.currency.default
        }).format(amount);
    },

    formatDate(date) {
        return new Date(date).toLocaleDateString(this.dateFormat.locale);
    },

    isDevelopment() {
        return window.location.hostname === 'localhost' || 
               window.location.hostname === '127.0.0.1' ||
               window.location.hostname.includes('dev');
    },

    isProduction() {
        return !this.isDevelopment();
    }
};

// Exportar para uso global
window.VeedorConfig = VeedorConfig;
