// ========================================
// VEEDOR - SISTEMA UNIFICADO Y COHERENTE
// ========================================

console.log('=== VEEDOR UNIFIED SYSTEM LOADING ===');

// ========================================
// CONFIGURACIÓN GLOBAL
// ========================================

const VEEDOR_CONFIG = {
    version: '2.0.0',
    theme: 'dark',
    currency: '€',
    language: 'es',
    debug: true,
    
    // URLs de las páginas
    pages: {
        home: 'index.html',
        dashboard: 'demo.html',
        auth: 'auth.html',
        profile: 'profile.html'
    },
    
    // Configuración de gráficas
    charts: {
        colors: {
            primary: '#8B5CF6',
            secondary: '#3B82F6',
            success: '#10B981',
            warning: '#F59E0B',
            error: '#EF4444',
            info: '#06B6D4'
        },
        animation: {
            duration: 1000,
            easing: 'easeOutQuart'
        }
    },
    
    // Configuración de datos
    data: {
        storageKey: 'veedorData',
        demoData: true,
        autoSave: true
    }
};

// ========================================
// SISTEMA DE DATOS UNIFICADO
// ========================================

class VeedorDataManager {
    constructor() {
        this.data = {
            transactions: [],
            budgets: [],
            goals: [],
            categories: this.getDefaultCategories(),
            user: null,
            settings: this.getDefaultSettings()
        };
        
        this.loadData();
    }
    
    getDefaultCategories() {
        return [
            { id: 'alimentacion', name: 'Alimentación', color: '#EF4444', icon: '🍽️' },
            { id: 'transporte', name: 'Transporte', color: '#3B82F6', icon: '🚗' },
            { id: 'vivienda', name: 'Vivienda', color: '#8B5CF6', icon: '🏠' },
            { id: 'entretenimiento', name: 'Entretenimiento', color: '#F59E0B', icon: '🎬' },
            { id: 'salud', name: 'Salud', color: '#10B981', icon: '🏥' },
            { id: 'educacion', name: 'Educación', color: '#06B6D4', icon: '📚' },
            { id: 'otros', name: 'Otros', color: '#6B7280', icon: '📦' }
        ];
    }
    
    getDefaultSettings() {
        return {
            theme: 'dark',
            currency: '€',
            language: 'es',
            notifications: true,
            autoSave: true
        };
    }
    
    loadData() {
        try {
            const savedData = localStorage.getItem(VEEDOR_CONFIG.data.storageKey);
            if (savedData) {
                const parsed = JSON.parse(savedData);
                this.data = { ...this.data, ...parsed };
                console.log('✅ Datos cargados desde localStorage');
            } else {
                console.log('📝 No hay datos guardados, usando configuración por defecto');
            }
        } catch (error) {
            console.error('❌ Error cargando datos:', error);
        }
    }
    
    saveData() {
        try {
            localStorage.setItem(VEEDOR_CONFIG.data.storageKey, JSON.stringify(this.data));
            console.log('✅ Datos guardados en localStorage');
        } catch (error) {
            console.error('❌ Error guardando datos:', error);
        }
    }
    
    createDemoData() {
        console.log('🎭 Creando datos de demostración...');
        
        const demoTransactions = [
            {
                id: 'demo-1',
                type: 'income',
                amount: 3000,
                category: 'Salario',
                description: 'Salario mensual',
                date: new Date().toISOString().split('T')[0],
                createdAt: new Date().toISOString()
            },
            {
                id: 'demo-2',
                type: 'expense',
                amount: 800,
                category: 'Vivienda',
                description: 'Alquiler',
                date: new Date().toISOString().split('T')[0],
                createdAt: new Date().toISOString()
            },
            {
                id: 'demo-3',
                type: 'expense',
                amount: 300,
                category: 'Alimentación',
                description: 'Supermercado',
                date: new Date().toISOString().split('T')[0],
                createdAt: new Date().toISOString()
            },
            {
                id: 'demo-4',
                type: 'expense',
                amount: 150,
                category: 'Transporte',
                description: 'Gasolina',
                date: new Date().toISOString().split('T')[0],
                createdAt: new Date().toISOString()
            },
            {
                id: 'demo-5',
                type: 'expense',
                amount: 200,
                category: 'Alimentación',
                description: 'Restaurante',
                date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
                createdAt: new Date(Date.now() - 86400000).toISOString()
            },
            {
                id: 'demo-6',
                type: 'expense',
                amount: 50,
                category: 'Transporte',
                description: 'Metro/Bus',
                date: new Date(Date.now() - 172800000).toISOString().split('T')[0],
                createdAt: new Date(Date.now() - 172800000).toISOString()
            },
            {
                id: 'demo-7',
                type: 'expense',
                amount: 100,
                category: 'Entretenimiento',
                description: 'Cine',
                date: new Date(Date.now() - 259200000).toISOString().split('T')[0],
                createdAt: new Date(Date.now() - 259200000).toISOString()
            },
            {
                id: 'demo-8',
                type: 'expense',
                amount: 75,
                category: 'Salud',
                description: 'Farmacia',
                date: new Date(Date.now() - 345600000).toISOString().split('T')[0],
                createdAt: new Date(Date.now() - 345600000).toISOString()
            }
        ];
        
        this.data.transactions = demoTransactions;
        this.saveData();
        console.log('✅ Datos de demostración creados:', demoTransactions.length, 'transacciones');
        
        return demoTransactions;
    }
    
    getTransactions() {
        return this.data.transactions;
    }
    
    addTransaction(transaction) {
        const newTransaction = {
            id: 'txn-' + Date.now(),
            ...transaction,
            createdAt: new Date().toISOString()
        };
        
        this.data.transactions.push(newTransaction);
        this.saveData();
        console.log('✅ Transacción agregada:', newTransaction.description);
        
        return newTransaction;
    }
    
    getFinancialSummary() {
        const transactions = this.data.transactions;
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        
        // Filtrar transacciones del mes actual
        const monthlyTransactions = transactions.filter(transaction => {
            const transactionDate = new Date(transaction.date);
            return transactionDate.getMonth() === currentMonth && 
                   transactionDate.getFullYear() === currentYear;
        });

        // Calcular ingresos del mes
        const monthlyIncome = monthlyTransactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);

        // Calcular gastos del mes
        const monthlyExpenses = monthlyTransactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        // Calcular balance total
        const totalIncome = transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);

        const totalExpenses = transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        const totalBalance = totalIncome - totalExpenses;
        const monthlySavings = monthlyIncome - monthlyExpenses;

        return {
            totalBalance,
            monthlyIncome,
            monthlyExpenses,
            monthlySavings,
            savingsRate: monthlyIncome > 0 ? (monthlySavings / monthlyIncome) * 100 : 0
        };
    }
    
    getCategoryData() {
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        
        const categoryData = {};
        this.data.transactions
            .filter(t => t.type === 'expense' && 
                new Date(t.date).getMonth() === currentMonth && 
                new Date(t.date).getFullYear() === currentYear)
            .forEach(transaction => {
                categoryData[transaction.category] = (categoryData[transaction.category] || 0) + transaction.amount;
            });

        return categoryData;
    }
    
    getTrendsData() {
        const months = [];
        const incomeData = [];
        const expenseData = [];
        
        for (let i = 5; i >= 0; i--) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            const monthName = date.toLocaleDateString('es-ES', { month: 'short' });
            months.push(monthName);
            
            const monthTransactions = this.data.transactions.filter(t => {
                const transactionDate = new Date(t.date);
                return transactionDate.getMonth() === date.getMonth() && 
                       transactionDate.getFullYear() === date.getFullYear();
            });
            
            const income = monthTransactions
                .filter(t => t.type === 'income')
                .reduce((sum, t) => sum + t.amount, 0);
            
            const expenses = monthTransactions
                .filter(t => t.type === 'expense')
                .reduce((sum, t) => sum + t.amount, 0);
            
            incomeData.push(income);
            expenseData.push(expenses);
        }

        return { months, incomeData, expenseData };
    }
}

// ========================================
// SISTEMA DE GRÁFICAS UNIFICADO
// ========================================

class VeedorChartManager {
    constructor(dataManager) {
        this.dataManager = dataManager;
        this.charts = {};
        this.isChartJSAvailable = false;
        
        this.checkChartJS();
    }
    
    checkChartJS() {
        if (typeof Chart !== 'undefined') {
            this.isChartJSAvailable = true;
            console.log('✅ Chart.js disponible');
        } else {
            console.log('⏳ Esperando Chart.js...');
            setTimeout(() => this.checkChartJS(), 100);
        }
    }
    
    createCategoryChart(canvasId) {
        if (!this.isChartJSAvailable) {
            console.log('❌ Chart.js no disponible para gráfica de categorías');
            return;
        }
        
        const canvas = document.getElementById(canvasId);
        if (!canvas) {
            console.log('❌ Canvas no encontrado:', canvasId);
            return;
        }
        
        console.log('📊 Creando gráfica de categorías...');
        
        // Destruir gráfico existente
        if (this.charts.categoryChart && typeof this.charts.categoryChart.destroy === 'function') {
            this.charts.categoryChart.destroy();
        }
        
        const categoryData = this.dataManager.getCategoryData();
        const categories = Object.keys(categoryData);
        const amounts = Object.values(categoryData);
        
        if (amounts.length === 0) {
            console.log('❌ No hay datos de gastos para mostrar');
            return;
        }
        
        const colors = [
            VEEDOR_CONFIG.charts.colors.primary,
            VEEDOR_CONFIG.charts.colors.secondary,
            VEEDOR_CONFIG.charts.colors.success,
            VEEDOR_CONFIG.charts.colors.warning,
            VEEDOR_CONFIG.charts.colors.error,
            VEEDOR_CONFIG.charts.colors.info
        ];
        
        try {
            this.charts.categoryChart = new Chart(canvas, {
                type: 'doughnut',
                data: {
                    labels: categories,
                    datasets: [{
                        data: amounts,
                        backgroundColor: colors.slice(0, categories.length),
                        borderWidth: 0,
                        hoverOffset: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                usePointStyle: true,
                                padding: 20,
                                font: {
                                    family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                                    size: 12
                                }
                            }
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                    const percentage = ((context.parsed / total) * 100).toFixed(1);
                                    return `${context.label}: ${VEEDOR_CONFIG.currency}${context.parsed.toFixed(2)} (${percentage}%)`;
                                }
                            }
                        }
                    },
                    cutout: '60%',
                    animation: {
                        animateRotate: true,
                        duration: VEEDOR_CONFIG.charts.animation.duration,
                        easing: VEEDOR_CONFIG.charts.animation.easing
                    }
                }
            });
            console.log('✅ Gráfica de categorías creada exitosamente');
        } catch (error) {
            console.error('❌ Error creando gráfica de categorías:', error);
        }
    }
    
    createTrendsChart(canvasId) {
        if (!this.isChartJSAvailable) {
            console.log('❌ Chart.js no disponible para gráfica de tendencias');
            return;
        }
        
        const canvas = document.getElementById(canvasId);
        if (!canvas) {
            console.log('❌ Canvas no encontrado:', canvasId);
            return;
        }
        
        console.log('📈 Creando gráfica de tendencias...');
        
        // Destruir gráfico existente
        if (this.charts.trendsChart && typeof this.charts.trendsChart.destroy === 'function') {
            this.charts.trendsChart.destroy();
        }
        
        const trendsData = this.dataManager.getTrendsData();
        
        try {
            this.charts.trendsChart = new Chart(canvas, {
                type: 'line',
                data: {
                    labels: trendsData.months,
                    datasets: [{
                        label: 'Ingresos',
                        data: trendsData.incomeData,
                        borderColor: VEEDOR_CONFIG.charts.colors.success,
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4
                    }, {
                        label: 'Gastos',
                        data: trendsData.expenseData,
                        borderColor: VEEDOR_CONFIG.charts.colors.error,
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'top',
                            labels: {
                                usePointStyle: true,
                                padding: 20,
                                font: {
                                    family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                                    size: 12
                                }
                            }
                        },
                        tooltip: {
                            mode: 'index',
                            intersect: false,
                            callbacks: {
                                label: function(context) {
                                    return `${context.dataset.label}: ${VEEDOR_CONFIG.currency}${context.parsed.y.toFixed(2)}`;
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: {
                                color: 'rgba(255, 255, 255, 0.1)'
                            },
                            ticks: {
                                callback: function(value) {
                                    return VEEDOR_CONFIG.currency + value.toFixed(0);
                                }
                            }
                        },
                        x: {
                            grid: {
                                color: 'rgba(255, 255, 255, 0.1)'
                            }
                        }
                    },
                    interaction: {
                        intersect: false,
                        mode: 'index'
                    },
                    animation: {
                        duration: VEEDOR_CONFIG.charts.animation.duration,
                        easing: VEEDOR_CONFIG.charts.animation.easing
                    }
                }
            });
            console.log('✅ Gráfica de tendencias creada exitosamente');
        } catch (error) {
            console.error('❌ Error creando gráfica de tendencias:', error);
        }
    }
    
    createSummaryChart(canvasId) {
        if (!this.isChartJSAvailable) {
            console.log('❌ Chart.js no disponible para gráfica de resumen');
            return;
        }
        
        const canvas = document.getElementById(canvasId);
        if (!canvas) {
            console.log('❌ Canvas no encontrado:', canvasId);
            return;
        }
        
        console.log('📊 Creando gráfica de resumen financiero...');
        
        // Destruir gráfico existente
        if (this.charts.summaryChart && typeof this.charts.summaryChart.destroy === 'function') {
            this.charts.summaryChart.destroy();
        }
        
        const summary = this.dataManager.getFinancialSummary();
        
        try {
            this.charts.summaryChart = new Chart(canvas, {
                type: 'bar',
                data: {
                    labels: ['Ingresos', 'Gastos', 'Ahorro'],
                    datasets: [{
                        data: [summary.monthlyIncome, summary.monthlyExpenses, summary.monthlySavings],
                        backgroundColor: [
                            'rgba(16, 185, 129, 0.8)',
                            'rgba(239, 68, 68, 0.8)',
                            'rgba(59, 130, 246, 0.8)'
                        ],
                        borderColor: [
                            VEEDOR_CONFIG.charts.colors.success,
                            VEEDOR_CONFIG.charts.colors.error,
                            VEEDOR_CONFIG.charts.colors.secondary
                        ],
                        borderWidth: 2,
                        borderRadius: 8,
                        borderSkipped: false
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    return `${context.label}: ${VEEDOR_CONFIG.currency}${context.parsed.y.toFixed(2)}`;
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: {
                                color: 'rgba(255, 255, 255, 0.1)'
                            },
                            ticks: {
                                callback: function(value) {
                                    return VEEDOR_CONFIG.currency + value.toFixed(0);
                                }
                            }
                        },
                        x: {
                            grid: {
                                display: false
                            }
                        }
                    },
                    animation: {
                        duration: VEEDOR_CONFIG.charts.animation.duration,
                        easing: VEEDOR_CONFIG.charts.animation.easing
                    }
                }
            });
            console.log('✅ Gráfica de resumen financiero creada exitosamente');
        } catch (error) {
            console.error('❌ Error creando gráfica de resumen financiero:', error);
        }
    }
    
    updateAllCharts() {
        console.log('🔄 Actualizando todas las gráficas...');
        
        this.createCategoryChart('overviewCategoryChart');
        this.createTrendsChart('overviewTrendsChart');
        this.createSummaryChart('overviewIncomeExpensesChart');
        
        console.log('✅ Todas las gráficas actualizadas');
    }
}

// ========================================
// SISTEMA DE UI UNIFICADO
// ========================================

class VeedorUIManager {
    constructor(dataManager, chartManager) {
        this.dataManager = dataManager;
        this.chartManager = chartManager;
    }
    
    updateFinancialSummary() {
        console.log('💰 Actualizando resumen financiero...');
        
        const summary = this.dataManager.getFinancialSummary();
        
        const elements = {
            balance: document.querySelector('.balance-amount'),
            income: document.querySelector('.income-amount'),
            expenses: document.querySelector('.expenses-amount'),
            savings: document.querySelector('.savings-amount')
        };
        
        if (elements.balance) {
            elements.balance.textContent = `${VEEDOR_CONFIG.currency}${summary.totalBalance.toFixed(2)}`;
            console.log('✅ Balance actualizado');
        }
        
        if (elements.income) {
            elements.income.textContent = `${VEEDOR_CONFIG.currency}${summary.monthlyIncome.toFixed(2)}`;
            console.log('✅ Ingresos actualizados');
        }
        
        if (elements.expenses) {
            elements.expenses.textContent = `${VEEDOR_CONFIG.currency}${summary.monthlyExpenses.toFixed(2)}`;
            console.log('✅ Gastos actualizados');
        }
        
        if (elements.savings) {
            elements.savings.textContent = `${VEEDOR_CONFIG.currency}${summary.monthlySavings.toFixed(2)}`;
            console.log('✅ Ahorro actualizado');
        }
    }
    
    updateRecentTransactions() {
        console.log('📝 Actualizando transacciones recientes...');
        
        const container = document.querySelector('.recent-transactions');
        if (!container) {
            console.log('❌ Container de transacciones recientes no encontrado');
            return;
        }
        
        const transactions = this.dataManager.getTransactions()
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5);
        
        container.innerHTML = transactions.map(transaction => `
            <div class="transaction-item">
                <div class="transaction-info">
                    <span class="transaction-description">${transaction.description}</span>
                    <span class="transaction-category">${transaction.category}</span>
                </div>
                <div class="transaction-amount ${transaction.type}">
                    ${transaction.type === 'income' ? '+' : '-'}${VEEDOR_CONFIG.currency}${transaction.amount.toFixed(2)}
                </div>
            </div>
        `).join('');
        
        console.log('✅ Transacciones recientes actualizadas:', transactions.length);
    }
    
    updateInsights() {
        console.log('💡 Actualizando insights financieros...');
        
        const summary = this.dataManager.getFinancialSummary();
        const categoryData = this.dataManager.getCategoryData();
        
        // Encontrar la categoría con mayor gasto
        const topCategory = Object.entries(categoryData)
            .sort(([,a], [,b]) => b - a)[0];
        
        const insights = [
            {
                title: 'Patrón de Gastos',
                content: topCategory ? 
                    `Tu mayor gasto este mes es en <strong>${topCategory[0]}</strong> con ${VEEDOR_CONFIG.currency}${topCategory[1].toFixed(2)}` :
                    'No hay datos de gastos para analizar',
                action: 'Optimizar'
            },
            {
                title: 'Tasa de Ahorro',
                content: summary.savingsRate > 20 ? 
                    `Excelente tasa de ahorro del ${summary.savingsRate.toFixed(1)}%` :
                    summary.savingsRate > 10 ?
                    `Buena tasa de ahorro del ${summary.savingsRate.toFixed(1)}%` :
                    `Tasa de ahorro del ${summary.savingsRate.toFixed(1)}% - considera optimizar`,
                action: 'Mejorar'
            },
            {
                title: 'Tendencia Mensual',
                content: summary.monthlySavings > 0 ?
                    `Estás ahorrando ${VEEDOR_CONFIG.currency}${summary.monthlySavings.toFixed(2)} este mes` :
                    `Tus gastos superan tus ingresos en ${VEEDOR_CONFIG.currency}${Math.abs(summary.monthlySavings).toFixed(2)}`,
                action: 'Analizar'
            }
        ];
        
        const insightsContainer = document.querySelector('.insights-grid');
        if (insightsContainer) {
            insightsContainer.innerHTML = insights.map(insight => `
                <div class="insight-card">
                    <div class="insight-icon">●</div>
                    <div class="insight-content">
                        <h4>${insight.title}</h4>
                        <p>${insight.content}</p>
                        <div class="insight-action">
                            <button class="btn btn-sm btn-outline">${insight.action}</button>
                        </div>
                    </div>
                </div>
            `).join('');
            
            console.log('✅ Insights actualizados');
        }
    }
    
    updateAll() {
        console.log('🔄 Actualizando toda la UI...');
        
        this.updateFinancialSummary();
        this.updateRecentTransactions();
        this.updateInsights();
        
        // Actualizar gráficas si están disponibles
        if (this.chartManager.isChartJSAvailable) {
            this.chartManager.updateAllCharts();
        }
        
        console.log('✅ UI completamente actualizada');
    }
}

// ========================================
// SISTEMA PRINCIPAL UNIFICADO
// ========================================

class VeedorApp {
    constructor() {
        console.log('🚀 Inicializando Veedor App...');
        
        this.dataManager = new VeedorDataManager();
        this.chartManager = new VeedorChartManager(this.dataManager);
        this.uiManager = new VeedorUIManager(this.dataManager, this.chartManager);
        
        this.currentPage = this.detectCurrentPage();
        
        this.init();
    }
    
    detectCurrentPage() {
        const path = window.location.pathname;
        const filename = path.split('/').pop();
        
        // Detectar por filename
        if (filename === 'demo.html') {
            return 'dashboard';
        } else if (filename === 'index.html') {
            return 'home';
        } else if (filename === 'auth.html') {
            return 'auth';
        } else if (filename === 'profile.html') {
            return 'profile';
        }
        
        // Detectar por elementos del DOM
        if (document.getElementById('overviewCategoryChart')) {
            return 'dashboard';
        }
        
        if (document.getElementById('dashboard-link')) {
            return 'home';
        }
        
        // Detectar por URL hash
        const hash = window.location.hash.substring(1);
        if (hash === 'dashboard' || hash === 'demo') {
            return 'dashboard';
        }
        
        console.log('❓ Página no detectada, usando modo dashboard por defecto');
        return 'dashboard';
    }
    
    init() {
        console.log('📄 Página detectada:', this.currentPage);
        
        // Crear datos de demo si no existen
        if (this.dataManager.getTransactions().length === 0) {
            this.dataManager.createDemoData();
        }
        
        // Inicializar según la página
        switch (this.currentPage) {
            case 'dashboard':
                this.initDashboard();
                break;
            case 'home':
                this.initHome();
                break;
            case 'auth':
                this.initAuth();
                break;
            case 'profile':
                this.initProfile();
                break;
            default:
                console.log('❓ Página desconocida, inicializando modo básico');
                this.initBasic();
        }
        
        console.log('✅ Veedor App inicializado correctamente');
    }
    
    initDashboard() {
        console.log('📊 Inicializando dashboard...');
        
        // Configurar navegación inmediatamente
        this.setupNavigation();
        
        // Esperar a que el DOM esté listo
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.loadDashboard();
            });
        } else {
            // Si el DOM ya está listo, cargar inmediatamente
            setTimeout(() => {
                this.loadDashboard();
            }, 100);
        }
    }
    
    loadDashboard() {
        console.log('🔄 Cargando dashboard...');
        
        // Verificar que los elementos necesarios existan
        const requiredElements = [
            '.balance-amount',
            '.income-amount', 
            '.expenses-amount',
            '.savings-amount',
            '#overviewCategoryChart',
            '#overviewTrendsChart',
            '#overviewIncomeExpensesChart'
        ];
        
        const missingElements = requiredElements.filter(selector => !document.querySelector(selector));
        if (missingElements.length > 0) {
            console.log('❌ Elementos faltantes:', missingElements);
            console.log('⏳ Esperando elementos del DOM...');
            
            // Reintentar después de un tiempo
            setTimeout(() => {
                this.loadDashboard();
            }, 500);
            return;
        }
        
        console.log('✅ Todos los elementos del DOM encontrados');
        
        // Actualizar UI
        this.uiManager.updateAll();
        
        // Si Chart.js no está disponible, esperar
        if (!this.chartManager.isChartJSAvailable) {
            console.log('⏳ Esperando Chart.js para gráficas...');
            const checkChartJS = () => {
                if (this.chartManager.isChartJSAvailable) {
                    console.log('✅ Chart.js disponible, creando gráficas...');
                    this.chartManager.updateAllCharts();
                } else {
                    setTimeout(checkChartJS, 100);
                }
            };
            checkChartJS();
        } else {
            console.log('✅ Chart.js disponible, creando gráficas...');
            this.chartManager.updateAllCharts();
        }
        
        console.log('✅ Dashboard cargado completamente');
    }
    
    initHome() {
        console.log('🏠 Inicializando página principal...');
        
        // Configurar navegación
        this.setupNavigation();
        
        console.log('✅ Página principal inicializada');
    }
    
    initAuth() {
        console.log('🔐 Inicializando autenticación...');
        
        // Configurar formularios de auth
        this.setupAuth();
        
        console.log('✅ Autenticación inicializada');
    }
    
    initProfile() {
        console.log('👤 Inicializando perfil...');
        
        // Configurar perfil de usuario
        this.setupProfile();
        
        console.log('✅ Perfil inicializado');
    }
    
    initBasic() {
        console.log('🔧 Inicializando modo básico...');
        
        // Configuración básica para páginas desconocidas
        this.setupBasic();
        
        console.log('✅ Modo básico inicializado');
    }
    
    setupNavigation() {
        console.log('🔗 Configurando navegación...');
        
        // Configurar navegación entre páginas
        const dashboardLink = document.getElementById('dashboard-link');
        if (dashboardLink) {
            dashboardLink.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = VEEDOR_CONFIG.pages.dashboard;
            });
        }
        
        // Configurar tabs del dashboard
        this.setupDashboardTabs();
        
        // Configurar botones de acción
        this.setupActionButtons();
        
        console.log('✅ Navegación configurada');
    }
    
    setupDashboardTabs() {
        console.log('📑 Configurando tabs del dashboard...');
        
        document.querySelectorAll('.nav-tab').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const tabName = e.target.closest('.nav-tab').dataset.tab;
                console.log('Cambiando a tab:', tabName);
                this.showTab(tabName);
            });
        });
        
        console.log('✅ Tabs del dashboard configurados');
    }
    
    setupActionButtons() {
        console.log('🔘 Configurando botones de acción...');
        
        // Botón "Ver todas" transacciones
        const verTodasBtn = document.querySelector('.recent-transactions + .btn, .recent-transactions .btn');
        if (verTodasBtn) {
            verTodasBtn.addEventListener('click', () => {
                console.log('Mostrando todas las transacciones...');
                this.showTab('transactions');
            });
        }
        
        // Botón "Gestionar" presupuestos
        const gestionarBtn = document.querySelector('[data-action="manage-budgets"], .budgets-section .btn');
        if (gestionarBtn) {
            gestionarBtn.addEventListener('click', () => {
                console.log('Mostrando gestión de presupuestos...');
                this.showTab('budgets');
            });
        }
        
        // Botón "Ver todos" objetivos
        const verTodosBtn = document.querySelector('[data-action="view-goals"], .goals-section .btn');
        if (verTodosBtn) {
            verTodosBtn.addEventListener('click', () => {
                console.log('Mostrando todos los objetivos...');
                this.showTab('goals');
            });
        }
        
        // Botón "Ver análisis" gastos por categoría
        const verAnalisisBtn = document.querySelector('[data-action="view-analysis"], .category-section .btn');
        if (verAnalisisBtn) {
            verAnalisisBtn.addEventListener('click', () => {
                console.log('Mostrando análisis de gastos...');
                this.showTab('analytics');
            });
        }
        
        console.log('✅ Botones de acción configurados');
    }
    
    showTab(tabName) {
        console.log('📑 Cambiando a pestaña:', tabName);
        
        // Ocultar todas las pestañas
        document.querySelectorAll('.tab-panel, .dashboard-tab').forEach(tab => {
            tab.classList.remove('active');
        });

        // Remover clase active de todos los botones
        document.querySelectorAll('.nav-tab').forEach(btn => {
            btn.classList.remove('active');
        });

        // Mostrar pestaña seleccionada
        const selectedTab = document.getElementById(`${tabName}-tab`) || document.getElementById(tabName);
        const selectedBtn = document.querySelector(`[data-tab="${tabName}"]`);

        if (selectedTab) {
            selectedTab.classList.add('active');
            console.log('✅ Pestaña activada:', selectedTab.id);
        } else {
            console.log('❌ Pestaña no encontrada:', `${tabName}-tab`);
        }
        
        if (selectedBtn) {
            selectedBtn.classList.add('active');
            console.log('✅ Botón activado:', selectedBtn);
        } else {
            console.log('❌ Botón no encontrado para:', tabName);
        }

        // Actualizar pestaña actual
        this.currentTab = tabName;

        // Cargar contenido específico de la pestaña
        switch (tabName) {
            case 'overview':
                this.loadOverviewTab();
                break;
            case 'transactions':
                this.loadTransactionsTab();
                break;
            case 'budgets':
                this.loadBudgetsTab();
                break;
            case 'analytics':
                this.loadAnalyticsTab();
                break;
            case 'goals':
                this.loadGoalsTab();
                break;
            default:
                console.log('❓ Pestaña desconocida:', tabName);
        }
        
        console.log('✅ Pestaña cambiada a:', tabName);
    }
    
    loadOverviewTab() {
        console.log('📊 Cargando pestaña overview...');
        this.uiManager.updateAll();
    }
    
    loadTransactionsTab() {
        console.log('📝 Cargando pestaña de transacciones...');
        
        const container = document.getElementById('transactions-tab') || document.getElementById('transactions');
        if (container) {
            const transactions = this.dataManager.getTransactions();
            
            container.innerHTML = `
                <div class="transactions-header">
                    <h3>Todas las Transacciones</h3>
                    <button class="btn btn-primary" onclick="window.veedorApp.showAddTransactionModal()">
                        + Nueva Transacción
                    </button>
                </div>
                <div class="transactions-list">
                    ${transactions.map(transaction => `
                        <div class="transaction-item">
                            <div class="transaction-info">
                                <span class="transaction-description">${transaction.description}</span>
                                <span class="transaction-category">${transaction.category}</span>
                                <span class="transaction-date">${new Date(transaction.date).toLocaleDateString('es-ES')}</span>
                            </div>
                            <div class="transaction-amount ${transaction.type}">
                                ${transaction.type === 'income' ? '+' : '-'}${VEEDOR_CONFIG.currency}${transaction.amount.toFixed(2)}
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        }
    }
    
    loadBudgetsTab() {
        console.log('💰 Cargando pestaña de presupuestos...');
        
        const container = document.getElementById('budgets-tab') || document.getElementById('budgets');
        if (container) {
            container.innerHTML = `
                <div class="budgets-header">
                    <h3>Presupuestos</h3>
                    <button class="btn btn-primary" onclick="window.veedorApp.showAddBudgetModal()">
                        + Nuevo Presupuesto
                    </button>
                </div>
                <div class="budgets-list">
                    <div class="empty-state">
                        <p>No hay presupuestos configurados</p>
                        <button class="btn btn-outline" onclick="window.veedorApp.showAddBudgetModal()">
                            Crear Primer Presupuesto
                        </button>
                    </div>
                </div>
            `;
        }
    }
    
    loadAnalyticsTab() {
        console.log('📈 Cargando pestaña de análisis...');
        
        const container = document.getElementById('analytics-tab') || document.getElementById('analytics');
        if (container) {
            const summary = this.dataManager.getFinancialSummary();
            const categoryData = this.dataManager.getCategoryData();
            
            container.innerHTML = `
                <div class="analytics-header">
                    <h3>Análisis Financiero</h3>
                </div>
                <div class="analytics-content">
                    <div class="analytics-summary">
                        <div class="summary-card">
                            <h4>Tasa de Ahorro</h4>
                            <div class="summary-value">${summary.savingsRate.toFixed(1)}%</div>
                        </div>
                        <div class="summary-card">
                            <h4>Gasto Promedio Diario</h4>
                            <div class="summary-value">${VEEDOR_CONFIG.currency}${(summary.monthlyExpenses / 30).toFixed(2)}</div>
                        </div>
                    </div>
                    <div class="analytics-charts">
                        <div class="chart-container">
                            <h4>Gastos por Categoría</h4>
                            <canvas id="analyticsCategoryChart" width="400" height="300"></canvas>
                        </div>
                    </div>
                </div>
            `;
            
            // Crear gráfica de análisis
            setTimeout(() => {
                this.chartManager.createCategoryChart('analyticsCategoryChart');
            }, 100);
        }
    }
    
    loadGoalsTab() {
        console.log('🎯 Cargando pestaña de objetivos...');
        
        const container = document.getElementById('goals-tab') || document.getElementById('goals');
        if (container) {
            container.innerHTML = `
                <div class="goals-header">
                    <h3>Objetivos Financieros</h3>
                    <button class="btn btn-primary" onclick="window.veedorApp.showAddGoalModal()">
                        + Nuevo Objetivo
                    </button>
                </div>
                <div class="goals-list">
                    <div class="empty-state">
                        <p>No hay objetivos configurados</p>
                        <button class="btn btn-outline" onclick="window.veedorApp.showAddGoalModal()">
                            Crear Primer Objetivo
                        </button>
                    </div>
                </div>
            `;
        }
    }
    
    showAddTransactionModal() {
        console.log('➕ Mostrando modal de nueva transacción...');
        // Implementar modal de nueva transacción
        alert('Funcionalidad de nueva transacción en desarrollo');
    }
    
    showAddBudgetModal() {
        console.log('➕ Mostrando modal de nuevo presupuesto...');
        // Implementar modal de nuevo presupuesto
        alert('Funcionalidad de nuevo presupuesto en desarrollo');
    }
    
    showAddGoalModal() {
        console.log('➕ Mostrando modal de nuevo objetivo...');
        // Implementar modal de nuevo objetivo
        alert('Funcionalidad de nuevo objetivo en desarrollo');
    }
    
    setupAuth() {
        // Configurar formularios de autenticación
        console.log('🔐 Configurando autenticación...');
    }
    
    setupProfile() {
        // Configurar perfil de usuario
        console.log('👤 Configurando perfil...');
    }
    
    setupBasic() {
        // Configuración básica
        console.log('🔧 Configuración básica aplicada');
    }
    
    // Métodos públicos para uso externo
    addTransaction(transaction) {
        const newTransaction = this.dataManager.addTransaction(transaction);
        this.uiManager.updateAll();
        return newTransaction;
    }
    
    getFinancialSummary() {
        return this.dataManager.getFinancialSummary();
    }
    
    getTransactions() {
        return this.dataManager.getTransactions();
    }
    
    refreshDashboard() {
        this.uiManager.updateAll();
    }
}

// ========================================
// FUNCIONES DE DEBUG Y UTILIDADES
// ========================================

function debugVeedor() {
    console.log('=== DEBUG VEEDOR COMPLETO ===');
    console.log('Configuración:', VEEDOR_CONFIG);
    console.log('Página actual:', window.location.pathname);
    console.log('Chart.js disponible:', typeof Chart !== 'undefined');
    console.log('VeedorApp disponible:', !!window.veedorApp);
    
    if (window.veedorApp) {
        console.log('Página detectada:', window.veedorApp.currentPage);
        console.log('DataManager:', window.veedorApp.dataManager);
        console.log('ChartManager:', window.veedorApp.chartManager);
        console.log('UIManager:', window.veedorApp.uiManager);
        
        const transactions = window.veedorApp.getTransactions();
        console.log('Transacciones:', transactions.length);
        
        const summary = window.veedorApp.getFinancialSummary();
        console.log('Resumen financiero:', summary);
        
        // Verificar gráficas creadas
        console.log('Gráficas creadas:', {
            categoryChart: !!window.veedorApp.chartManager.charts.categoryChart,
            trendsChart: !!window.veedorApp.chartManager.charts.trendsChart,
            summaryChart: !!window.veedorApp.chartManager.charts.summaryChart
        });
    }
    
    // Verificar elementos del DOM
    const elements = [
        '.balance-amount',
        '.income-amount',
        '.expenses-amount',
        '.savings-amount',
        '.recent-transactions',
        '#overviewCategoryChart',
        '#overviewTrendsChart',
        '#overviewIncomeExpensesChart'
    ];
    
    console.log('=== ELEMENTOS DEL DOM ===');
    elements.forEach(selector => {
        const element = document.querySelector(selector);
        console.log(`${selector}:`, element ? '✅ Encontrado' : '❌ No encontrado');
        if (element) {
            console.log(`  - Texto: "${element.textContent?.substring(0, 50)}..."`);
            console.log(`  - Dimensiones: ${element.offsetWidth}x${element.offsetHeight}`);
        }
    });
    
    // Verificar tabs y botones
    console.log('=== NAVEGACIÓN ===');
    const tabs = document.querySelectorAll('.nav-tab');
    console.log('Tabs encontrados:', tabs.length);
    tabs.forEach(tab => {
        console.log(`  - Tab: ${tab.textContent} (data-tab: ${tab.dataset.tab})`);
    });
    
    const buttons = document.querySelectorAll('button');
    console.log('Botones encontrados:', buttons.length);
    
    // Forzar recarga del dashboard
    console.log('=== FORZANDO RECARGA ===');
    if (window.veedorApp) {
        window.veedorApp.loadDashboard();
    }
}

// Función para forzar inicialización completa
function forceInitVeedor() {
    console.log('🚀 FORZANDO INICIALIZACIÓN COMPLETA DE VEEDOR');
    
    // Recrear la app si no existe
    if (!window.veedorApp) {
        console.log('📱 Recreando VeedorApp...');
        window.veedorApp = new VeedorApp();
    }
    
    // Forzar carga del dashboard
    if (window.veedorApp.currentPage === 'dashboard') {
        console.log('📊 Forzando carga del dashboard...');
        window.veedorApp.loadDashboard();
    }
    
    console.log('✅ Inicialización forzada completada');
}

// Función para recargar solo las gráficas
function reloadCharts() {
    console.log('📊 RECARGANDO GRÁFICAS');
    
    if (window.veedorApp && window.veedorApp.chartManager) {
        if (window.veedorApp.chartManager.isChartJSAvailable) {
            window.veedorApp.chartManager.updateAllCharts();
            console.log('✅ Gráficas recargadas');
        } else {
            console.log('❌ Chart.js no disponible');
        }
    } else {
        console.log('❌ ChartManager no disponible');
    }
}

// ========================================
// INICIALIZACIÓN GLOBAL
// ========================================

// Crear instancia global de la app
window.veedorApp = new VeedorApp();

// Hacer funciones globales
window.debugVeedor = debugVeedor;
window.forceInitVeedor = forceInitVeedor;
window.reloadCharts = reloadCharts;
window.VEEDOR_CONFIG = VEEDOR_CONFIG;

// Función para cambiar pestañas (compatibilidad)
function showTab(tabName) {
    console.log('Cambiando a pestaña:', tabName);
    if (window.veedorApp) {
        window.veedorApp.showTab(tabName);
    } else {
        console.log('❌ VeedorApp no disponible');
    }
}

// Función para toggle de tema
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('veedor-theme', newTheme);
    
    const themeIcon = document.querySelector('.theme-icon');
    if (themeIcon) {
        themeIcon.textContent = newTheme === 'dark' ? '☀' : '☾';
    }
    
    // Actualizar gráficas si existen
    if (window.veedorApp && window.veedorApp.chartManager) {
        window.veedorApp.chartManager.updateAllCharts();
    }
}

// Cargar tema guardado
function loadTheme() {
    const savedTheme = localStorage.getItem('veedor-theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        document.body.setAttribute('data-theme', savedTheme);
        const themeIcon = document.querySelector('.theme-icon');
        if (themeIcon) {
            themeIcon.textContent = savedTheme === 'dark' ? '☀' : '☾';
        }
    }
}

// Inicializar tema
loadTheme();

console.log('=== VEEDOR UNIFIED SYSTEM LOADED ===');
