// ========================================
// VEEDOR DEMO - ORGANIZED JAVASCRIPT
// ========================================

// Importar módulos (en un entorno real, usaría import/export)
// Por ahora, asumimos que los módulos están disponibles globalmente

// ========================================
// MAIN APPLICATION INITIALIZATION
// ========================================

class VeedorDemoApp {
    constructor() {
        this.core = null;
        this.modules = {};
        this.init();
    }

    init() {
        // Inicializar el core
        this.core = new VeedorFinanceCenter();
        
        // Inicializar módulos
        this.initializeModules();
        
        // Configurar eventos globales
        this.setupGlobalEvents();
    }

    initializeModules() {
        // Inicializar módulos de funcionalidad
        this.modules.transactions = new TransactionsModule(this.core);
        this.modules.budgets = new BudgetsModule(this.core);
        this.modules.analytics = new AnalyticsModule(this.core);
        
        // Configurar métodos del core para usar los módulos
        this.setupCoreMethods();
    }

    setupCoreMethods() {
        // Sobrescribir métodos del core para usar los módulos
        this.core.updateTransactionsTab = () => {
            this.modules.transactions.updateTransactionsTab();
        };
        
        this.core.updateBudgetsTab = () => {
            this.modules.budgets.updateBudgetsTab();
        };
        
        this.core.updateAnalyticsTab = () => {
            this.modules.analytics.updateAnalyticsTab();
        };
        
        this.core.updateRecentTransactions = () => {
            this.modules.transactions.updateRecentTransactions();
        };
        
        this.core.updateBudgetsOverview = () => {
            this.modules.budgets.updateBudgetsOverview();
        };
    }

    setupGlobalEvents() {
        // Eventos globales de la aplicación
        document.addEventListener('DOMContentLoaded', () => {
            this.onDOMReady();
        });
        
        // Eventos de navegación
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-tab]')) {
                const tabName = e.target.getAttribute('data-tab');
                this.core.showTab(tabName);
            }
        });
        
        // Eventos de formularios
        document.addEventListener('submit', (e) => {
            this.handleFormSubmit(e);
        });
        
        // Eventos de teclado
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });
    }

    onDOMReady() {
        // Configuración inicial cuando el DOM está listo
        this.initializeTheme();
        this.initializeMobileMenu();
        this.initializeTooltips();
    }

    initializeTheme() {
        // Cargar tema guardado
        const savedTheme = localStorage.getItem('veedorTheme') || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);
        document.body.setAttribute('data-theme', savedTheme);
        
        // Actualizar icono del tema
        const themeIcon = document.querySelector('.theme-icon');
        if (themeIcon) {
            themeIcon.textContent = savedTheme === 'dark' ? '☀' : '☾';
        }
    }

    initializeMobileMenu() {
        // Configurar menú móvil
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        
        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                navMenu.classList.toggle('active');
            });
        }
    }

    initializeTooltips() {
        // Configurar tooltips
        document.querySelectorAll('[data-tooltip]').forEach(element => {
            element.addEventListener('mouseenter', (e) => {
                this.showTooltip(e.target);
            });
            
            element.addEventListener('mouseleave', (e) => {
                this.hideTooltip(e.target);
            });
        });
    }

    showTooltip(element) {
        const tooltipText = element.getAttribute('data-tooltip');
        if (!tooltipText) return;
        
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = tooltipText;
        tooltip.style.cssText = `
            position: absolute;
            background: var(--bg-primary);
            color: var(--text-primary);
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 0.8rem;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 1000;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.2s ease;
        `;
        
        document.body.appendChild(tooltip);
        
        const rect = element.getBoundingClientRect();
        tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
        tooltip.style.top = rect.top - tooltip.offsetHeight - 8 + 'px';
        
        // Mostrar tooltip
        setTimeout(() => {
            tooltip.style.opacity = '1';
        }, 10);
        
        element._tooltip = tooltip;
    }

    hideTooltip(element) {
        if (element._tooltip) {
            element._tooltip.remove();
            delete element._tooltip;
        }
    }

    handleFormSubmit(e) {
        const form = e.target;
        const formType = form.getAttribute('data-form-type');
        
        if (!formType) return;
        
        e.preventDefault();
        
        // Delegar al core para manejar el formulario
        this.core.handleFormSubmit(form);
    }

    handleKeyboardShortcuts(e) {
        // Atajos de teclado globales
        if (e.altKey) {
            switch (e.key) {
                case '1':
                    e.preventDefault();
                    this.core.showTab('overview');
                    break;
                case '2':
                    e.preventDefault();
                    this.core.showTab('transactions');
                    break;
                case '3':
                    e.preventDefault();
                    this.core.showTab('budgets');
                    break;
                case '4':
                    e.preventDefault();
                    this.core.showTab('goals');
                    break;
                case '5':
                    e.preventDefault();
                    this.core.showTab('analytics');
                    break;
                case '6':
                    e.preventDefault();
                    this.core.showTab('assets');
                    break;
                case 't':
                    e.preventDefault();
                    this.core.toggleTheme();
                    break;
            }
        }
        
        // Escape para cerrar modales
        if (e.key === 'Escape') {
            this.core.closeAllModals();
        }
    }
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

// Funciones de utilidad globales
window.toggleTheme = function() {
    if (window.veedorApp && window.veedorApp.core) {
        window.veedorApp.core.toggleTheme();
    }
};

window.toggleMobileMenu = function() {
    const navMenu = document.querySelector('.nav-menu');
    if (navMenu) {
        navMenu.classList.toggle('active');
    }
};

window.closeMobileMenu = function() {
    const navMenu = document.querySelector('.nav-menu');
    if (navMenu) {
        navMenu.classList.remove('active');
    }
};

window.showDashboard = function() {
    if (window.veedorApp && window.veedorApp.core) {
        window.veedorApp.core.showTab('overview');
    }
};

window.showAuth = function() {
    // Implementar lógica de autenticación
    console.log('Show auth modal');
};

window.logout = function() {
    // Implementar lógica de logout
    console.log('Logout');
};

// ========================================
// INITIALIZATION
// ========================================

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.veedorApp = new VeedorDemoApp();
    window.veedor = window.veedorApp.core; // Mantener compatibilidad
});

// ========================================
// ERROR HANDLING
// ========================================

window.addEventListener('error', (e) => {
    console.error('Application error:', e.error);
    
    // Mostrar mensaje de error al usuario
    if (window.veedorApp && window.veedorApp.core) {
        window.veedorApp.core.showMessage('Ha ocurrido un error inesperado', 'error');
    }
});

// ========================================
// PERFORMANCE MONITORING
// ========================================

// Monitorear rendimiento
window.addEventListener('load', () => {
    if ('performance' in window) {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        console.log(`Page loaded in ${loadTime}ms`);
    }
});

// ========================================
// SERVICE WORKER REGISTRATION
// ========================================

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
