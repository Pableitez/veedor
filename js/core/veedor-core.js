// ========================================
// VEEDOR CORE - CLASE PRINCIPAL
// ========================================

class VeedorFinanceCenter {
    constructor() {
        this.transactions = [];
        this.budgets = [];
        this.goals = [];
        this.envelopes = [];
        this.assets = [];
        this.liabilities = [];
        this.categories = [
            { id: 'food', name: 'Alimentación', color: '#FF6B6B', budget: 300 },
            { id: 'transport', name: 'Transporte', color: '#4ECDC4', budget: 150 },
            { id: 'entertainment', name: 'Entretenimiento', color: '#45B7D1', budget: 100 },
            { id: 'health', name: 'Salud', color: '#96CEB4', budget: 200 },
            { id: 'shopping', name: 'Compras', color: '#FFEAA7', budget: 200 },
            { id: 'utilities', name: 'Servicios', color: '#DDA0DD', budget: 150 },
            { id: 'income', name: 'Ingresos', color: '#98D8C8', budget: 0 },
            { id: 'other', name: 'Otros', color: '#F7DC6F', budget: 100 }
        ];
        
        this.filters = {
            category: '',
            type: '',
            dateRange: '',
            amountRange: { min: '', max: '' },
            search: ''
        };
        
        this.charts = {};
        this.notifications = [];
        this.currentTab = 'overview';
        
        this.init();
    }

    init() {
        this.loadData();
        this.setupEventListeners();
        this.initializeCharts();
        this.updateDashboard();
        this.initializeTabs();
        this.startRealTimeUpdates();
        this.setupThemeToggle();
        this.setupKeyboardShortcuts();
        this.setupAccessibility();
    }

    // Métodos principales delegados a módulos específicos
    loadData() {
        VeedorStorage.loadAllData(this);
    }

    saveData() {
        VeedorStorage.saveAllData(this);
    }

    updateDashboard() {
        VeedorDashboard.updateAll(this);
    }

    setupEventListeners() {
        VeedorUI.setupGlobalListeners(this);
    }

    initializeCharts() {
        VeedorCharts.initializeAll(this);
    }

    initializeTabs() {
        VeedorUI.initializeTabs(this);
    }

    startRealTimeUpdates() {
        VeedorUI.startRealTimeUpdates(this);
    }

    setupThemeToggle() {
        VeedorUI.setupThemeToggle();
    }

    setupKeyboardShortcuts() {
        VeedorUI.setupKeyboardShortcuts();
    }

    setupAccessibility() {
        VeedorUI.setupAccessibility();
    }

    // Métodos de utilidad
    showMessage(message, type = 'info', duration = 5000) {
        VeedorUI.showMessage(message, type, duration);
    }

    formatCurrency(amount) {
        return VeedorUtils.formatCurrency(amount);
    }

    formatDate(date) {
        return VeedorUtils.formatDate(date);
    }

    // Getters para datos
    getTotalIncome() {
        return VeedorCalculators.calculateTotalIncome(this.transactions);
    }

    getTotalExpenses() {
        return VeedorCalculators.calculateTotalExpenses(this.transactions);
    }

    getBalance() {
        return VeedorCalculators.calculateBalance(this.transactions);
    }

    getNetWorth() {
        return VeedorCalculators.calculateNetWorth(this.assets, this.liabilities);
    }
}

// Exportar para uso global
window.VeedorFinanceCenter = VeedorFinanceCenter;
