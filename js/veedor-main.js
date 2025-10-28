// ========================================
// VEEDOR MAIN - ARCHIVO PRINCIPAL
// ========================================

// Importar todos los módulos
import './core/veedor-core.js';
import './core/veedor-storage.js';
import './calculators/veedor-calculators.js';
import './components/veedor-ui.js';
import './modules/veedor-dashboard.js';
import './modules/veedor-transactions.js';
import './modules/veedor-budgets.js';
import './utils/veedor-utils.js';

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Crear instancia global de la aplicación
    window.app = new VeedorFinanceCenter();
    
    // Configurar tema inicial
    const savedTheme = localStorage.getItem('veedor_theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // Mostrar mensaje de bienvenida
    VeedorUI.showMessage('¡Bienvenido a Veedor Finance Center!', 'success', 3000);
    
    console.log('Veedor Finance Center inicializado correctamente');
});

// Manejar errores globales
window.addEventListener('error', function(event) {
    console.error('Error global:', event.error);
    VeedorUI.showMessage('Ha ocurrido un error inesperado', 'error');
});

// Manejar errores de promesas no capturadas
window.addEventListener('unhandledrejection', function(event) {
    console.error('Promesa rechazada:', event.reason);
    VeedorUI.showMessage('Error en operación asíncrona', 'error');
});

// Exportar para uso global
window.VeedorMain = {
    version: '1.0.0',
    modules: {
        Core: VeedorFinanceCenter,
        Storage: VeedorStorage,
        Calculators: VeedorCalculators,
        UI: VeedorUI,
        Dashboard: VeedorDashboard,
        Transactions: VeedorTransactions,
        Budgets: VeedorBudgets,
        Utils: VeedorUtils
    }
};
