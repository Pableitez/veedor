/* ========================================
   CONFIGURACIÓN DE LA APLICACIÓN
   ======================================== */

/**
 * Configuración global de la aplicación
 */
export const CONFIG = {
    // === CONFIGURACIÓN GENERAL ===
    APP_NAME: 'Veedor',
    APP_VERSION: '1.0.0',
    APP_DESCRIPTION: 'La cuenta de la vieja digital',
    
    // === CONFIGURACIÓN DE ALMACENAMIENTO ===
    STORAGE_KEYS: {
        USER: 'veedor_user',
        THEME: 'veedor_theme',
        TRANSACTIONS: 'veedor_transactions',
        BUDGETS: 'veedor_budgets',
        GOALS: 'veedor_goals',
        ASSETS: 'veedor_assets',
        LIABILITIES: 'veedor_liabilities',
        ENVELOPES: 'veedor_envelopes',
        SETTINGS: 'veedor_settings'
    },
    
    // === CONFIGURACIÓN DE API ===
    API: {
        BASE_URL: process.env.NODE_ENV === 'production' 
            ? 'https://api.veedor.com' 
            : 'http://localhost:3000',
        TIMEOUT: 10000,
        RETRY_ATTEMPTS: 3
    },
    
    // === CONFIGURACIÓN DE SUPABASE ===
    SUPABASE: {
        URL: process.env.SUPABASE_URL || '',
        ANON_KEY: process.env.SUPABASE_ANON_KEY || '',
        BUCKET_NAME: 'veedor-assets'
    },
    
    // === CONFIGURACIÓN DE MONEDAS ===
    CURRENCY: {
        DEFAULT: 'EUR',
        SYMBOL: '€',
        DECIMAL_PLACES: 2,
        THOUSAND_SEPARATOR: '.',
        DECIMAL_SEPARATOR: ','
    },
    
    // === CONFIGURACIÓN DE FECHAS ===
    DATE_FORMAT: 'DD/MM/YYYY',
    TIME_FORMAT: 'HH:mm',
    DATETIME_FORMAT: 'DD/MM/YYYY HH:mm',
    
    // === CONFIGURACIÓN DE PAGINACIÓN ===
    PAGINATION: {
        DEFAULT_PAGE_SIZE: 20,
        MAX_PAGE_SIZE: 100,
        PAGE_SIZE_OPTIONS: [10, 20, 50, 100]
    },
    
    // === CONFIGURACIÓN DE VALIDACIÓN ===
    VALIDATION: {
        MIN_PASSWORD_LENGTH: 8,
        MAX_PASSWORD_LENGTH: 128,
        MIN_NAME_LENGTH: 2,
        MAX_NAME_LENGTH: 50,
        MIN_AMOUNT: 0.01,
        MAX_AMOUNT: 999999999.99,
        MIN_DESCRIPTION_LENGTH: 3,
        MAX_DESCRIPTION_LENGTH: 255
    },
    
    // === CONFIGURACIÓN DE NOTIFICACIONES ===
    NOTIFICATIONS: {
        DEFAULT_DURATION: 5000,
        SUCCESS_DURATION: 3000,
        ERROR_DURATION: 8000,
        WARNING_DURATION: 6000,
        INFO_DURATION: 5000
    },
    
    // === CONFIGURACIÓN DE ANIMACIONES ===
    ANIMATIONS: {
        DURATION_FAST: 150,
        DURATION_NORMAL: 300,
        DURATION_SLOW: 500,
        EASING: 'cubic-bezier(0.4, 0, 0.2, 1)'
    },
    
    // === CONFIGURACIÓN DE BREAKPOINTS ===
    BREAKPOINTS: {
        MOBILE: 480,
        TABLET: 768,
        DESKTOP: 1024,
        LARGE_DESKTOP: 1200
    },
    
    // === CONFIGURACIÓN DE CATEGORÍAS ===
    CATEGORIES: {
        INCOME: [
            { id: 'salary', name: 'Salario', icon: '💼', color: '#4CAF50' },
            { id: 'freelance', name: 'Freelance', icon: '💻', color: '#2196F3' },
            { id: 'investment', name: 'Inversiones', icon: '📈', color: '#FF9800' },
            { id: 'rental', name: 'Alquileres', icon: '🏠', color: '#9C27B0' },
            { id: 'other', name: 'Otros', icon: '💰', color: '#607D8B' }
        ],
        EXPENSE: [
            { id: 'food', name: 'Alimentación', icon: '🍽️', color: '#F44336' },
            { id: 'transport', name: 'Transporte', icon: '🚗', color: '#FF5722' },
            { id: 'housing', name: 'Vivienda', icon: '🏠', color: '#795548' },
            { id: 'utilities', name: 'Servicios', icon: '⚡', color: '#FFC107' },
            { id: 'health', name: 'Salud', icon: '🏥', color: '#E91E63' },
            { id: 'entertainment', name: 'Entretenimiento', icon: '🎬', color: '#3F51B5' },
            { id: 'shopping', name: 'Compras', icon: '🛍️', color: '#009688' },
            { id: 'education', name: 'Educación', icon: '📚', color: '#673AB7' },
            { id: 'other', name: 'Otros', icon: '📦', color: '#9E9E9E' }
        ]
    },
    
    // === CONFIGURACIÓN DE TIPOS DE ACTIVOS ===
    ASSET_TYPES: [
        { id: 'cash', name: 'Efectivo', icon: '💵' },
        { id: 'bank', name: 'Cuenta Bancaria', icon: '🏦' },
        { id: 'investment', name: 'Inversiones', icon: '📈' },
        { id: 'property', name: 'Propiedades', icon: '🏠' },
        { id: 'vehicle', name: 'Vehículos', icon: '🚗' },
        { id: 'other', name: 'Otros', icon: '📦' }
    ],
    
    // === CONFIGURACIÓN DE TIPOS DE PASIVOS ===
    LIABILITY_TYPES: [
        { id: 'credit_card', name: 'Tarjeta de Crédito', icon: '💳' },
        { id: 'loan', name: 'Préstamo Personal', icon: '🏦' },
        { id: 'mortgage', name: 'Hipoteca', icon: '🏠' },
        { id: 'car_loan', name: 'Préstamo de Coche', icon: '🚗' },
        { id: 'student_loan', name: 'Préstamo Estudiantil', icon: '🎓' },
        { id: 'other', name: 'Otros', icon: '📦' }
    ],
    
    // === CONFIGURACIÓN DE PRIORIDADES DE OBJETIVOS ===
    GOAL_PRIORITIES: [
        { id: 'low', name: 'Baja', color: '#4CAF50' },
        { id: 'medium', name: 'Media', color: '#FF9800' },
        { id: 'high', name: 'Alta', color: '#F44336' }
    ],
    
    // === CONFIGURACIÓN DE ESTADOS DE PRESUPUESTO ===
    BUDGET_STATUS: {
        EXCELLENT: { threshold: 0.8, color: '#4CAF50', name: 'Excelente' },
        GOOD: { threshold: 0.6, color: '#8BC34A', name: 'Bueno' },
        WARNING: { threshold: 0.4, color: '#FF9800', name: 'Advertencia' },
        CRITICAL: { threshold: 0, color: '#F44336', name: 'Crítico' }
    },
    
    // === CONFIGURACIÓN DE MÉTRICAS FINANCIERAS ===
    FINANCIAL_METRICS: {
        SAVINGS_RATE_EXCELLENT: 20,
        SAVINGS_RATE_GOOD: 15,
        SAVINGS_RATE_FAIR: 10,
        DEBT_TO_INCOME_RATIO_MAX: 0.36,
        EMERGENCY_FUND_MONTHS: 6
    },
    
    // === CONFIGURACIÓN DE CÁLCULOS ===
    CALCULATIONS: {
        AMORTIZATION_METHOD: 'french', // french, german, american
        INTEREST_CALCULATION: 'compound', // simple, compound
        TAX_RATE_DEFAULT: 0.21,
        INFLATION_RATE_DEFAULT: 0.03
    },
    
    // === CONFIGURACIÓN DE EXPORTACIÓN ===
    EXPORT: {
        FORMATS: ['csv', 'xlsx', 'pdf'],
        CSV_DELIMITER: ',',
        CSV_ENCODING: 'utf-8',
        PDF_ORIENTATION: 'portrait',
        PDF_FORMAT: 'a4'
    },
    
    // === CONFIGURACIÓN DE BACKUP ===
    BACKUP: {
        AUTO_BACKUP_INTERVAL: 24 * 60 * 60 * 1000, // 24 horas
        MAX_BACKUPS: 30,
        BACKUP_FORMAT: 'json'
    },
    
    // === CONFIGURACIÓN DE DESARROLLO ===
    DEBUG: process.env.NODE_ENV === 'development',
    LOG_LEVEL: process.env.NODE_ENV === 'development' ? 'debug' : 'error',
    
    // === CONFIGURACIÓN DE RENDIMIENTO ===
    PERFORMANCE: {
        DEBOUNCE_DELAY: 300,
        THROTTLE_DELAY: 100,
        LAZY_LOAD_OFFSET: 100,
        CACHE_DURATION: 5 * 60 * 1000 // 5 minutos
    }
};

/**
 * Obtener configuración por clave
 */
export function getConfig(key) {
    return key.split('.').reduce((obj, k) => obj?.[k], CONFIG);
}

/**
 * Establecer configuración
 */
export function setConfig(key, value) {
    const keys = key.split('.');
    const lastKey = keys.pop();
    const target = keys.reduce((obj, k) => obj[k] = obj[k] || {}, CONFIG);
    target[lastKey] = value;
}

/**
 * Obtener configuración de almacenamiento
 */
export function getStorageKey(key) {
    return CONFIG.STORAGE_KEYS[key] || key;
}

/**
 * Obtener configuración de categorías
 */
export function getCategories(type = 'all') {
    if (type === 'all') {
        return [...CONFIG.CATEGORIES.INCOME, ...CONFIG.CATEGORIES.EXPENSE];
    }
    return CONFIG.CATEGORIES[type.toUpperCase()] || [];
}

/**
 * Obtener categoría por ID
 */
export function getCategoryById(id) {
    const allCategories = getCategories();
    return allCategories.find(cat => cat.id === id);
}

/**
 * Obtener configuración de breakpoint
 */
export function getBreakpoint(width = window.innerWidth) {
    const breakpoints = CONFIG.BREAKPOINTS;
    if (width < breakpoints.MOBILE) return 'mobile';
    if (width < breakpoints.TABLET) return 'tablet';
    if (width < breakpoints.DESKTOP) return 'desktop';
    return 'large-desktop';
}

/**
 * Verificar si es móvil
 */
export function isMobile() {
    return getBreakpoint() === 'mobile';
}

/**
 * Verificar si es tablet
 */
export function isTablet() {
    return getBreakpoint() === 'tablet';
}

/**
 * Verificar si es desktop
 */
export function isDesktop() {
    const breakpoint = getBreakpoint();
    return breakpoint === 'desktop' || breakpoint === 'large-desktop';
}

export default CONFIG;
