// ========================================
// VEEDOR PROFESSIONAL FINANCE CENTER
// ========================================

class VeedorFinanceCenter {
    constructor() {
        this.transactions = [];
        this.budgets = [];
        this.goals = [];
        this.assets = [];
        this.liabilities = [];
        this.currentTab = 'overview';
        this.init();
    }

    init() {
        this.loadData();
        this.setupEventListeners();
        this.updateDashboard();
        this.initializeTabs();
        this.setupForms();
    }

    initializeTabs() {
        const tabButtons = document.querySelectorAll('.nav-tab');
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabName = button.getAttribute('data-tab');
                this.showTab(tabName);
            });
        });
    }

    loadData() {
        this.transactions = JSON.parse(localStorage.getItem('veedorTransactions') || '[]');
        this.budgets = JSON.parse(localStorage.getItem('veedorBudgets') || '[]');
        this.goals = JSON.parse(localStorage.getItem('veedorGoals') || '[]');
        this.assets = JSON.parse(localStorage.getItem('veedorAssets') || '[]');
        this.liabilities = JSON.parse(localStorage.getItem('veedorLiabilities') || '[]');
    }

    saveData() {
        localStorage.setItem('veedorTransactions', JSON.stringify(this.transactions));
        localStorage.setItem('veedorBudgets', JSON.stringify(this.budgets));
        localStorage.setItem('veedorGoals', JSON.stringify(this.goals));
        localStorage.setItem('veedorAssets', JSON.stringify(this.assets));
        localStorage.setItem('veedorLiabilities', JSON.stringify(this.liabilities));
    }

    showTab(tabName) {
        // Ocultar todas las pestañas
        document.querySelectorAll('.tab-panel').forEach(panel => {
            panel.classList.remove('active');
        });

        // Remover clase active de todos los botones
        document.querySelectorAll('.nav-tab').forEach(btn => {
            btn.classList.remove('active');
        });

        // Mostrar pestaña seleccionada
        const selectedTab = document.getElementById(tabName);
        const selectedBtn = document.querySelector(`[data-tab="${tabName}"]`);

        if (selectedTab) {
            selectedTab.classList.add('active');
        }

        if (selectedBtn) {
            selectedBtn.classList.add('active');
        }

        this.currentTab = tabName;
        this.updateTabContent(tabName);
    }

    updateTabContent(tabName) {
        switch (tabName) {
            case 'overview':
                this.updateOverview();
                break;
            case 'transactions':
                this.updateTransactions();
                break;
            case 'budgets':
                this.updateBudgets();
                break;
            case 'goals':
                this.updateGoals();
                break;
            case 'assets':
                this.updateAssets();
                break;
            case 'analytics':
                this.updateAnalytics();
                break;
        }
    }

    updateDashboard() {
        this.updateFinancialSummary();
        this.updateQuickStats();
        this.updateNetWorth();
    }

    updateFinancialSummary() {
        const totals = this.calculateTotals();
        const trends = this.calculateTrends();
        
        // Balance total con tendencia
        const balanceElement = document.querySelector('.balance-amount');
        if (balanceElement) {
            balanceElement.innerHTML = `
                €${totals.balance.toFixed(2)}
                <span class="trend ${trends.balance > 0 ? 'positive' : 'negative'}">
                    ${trends.balance > 0 ? '↗' : '↘'} ${Math.abs(trends.balance).toFixed(1)}%
                </span>
            `;
        }

        // Ingresos con comparación
        const incomeElement = document.querySelector('.income-amount');
        if (incomeElement) {
            incomeElement.innerHTML = `
                €${totals.income.toFixed(2)}
                <span class="trend ${trends.income > 0 ? 'positive' : 'negative'}">
                    ${trends.income > 0 ? '↗' : '↘'} ${Math.abs(trends.income).toFixed(1)}%
                </span>
            `;
        }

        // Gastos con comparación
        const expensesElement = document.querySelector('.expenses-amount');
        if (expensesElement) {
            expensesElement.innerHTML = `
                €${totals.expenses.toFixed(2)}
                <span class="trend ${trends.expenses < 0 ? 'positive' : 'negative'}">
                    ${trends.expenses < 0 ? '↗' : '↘'} ${Math.abs(trends.expenses).toFixed(1)}%
                </span>
            `;
        }

        // Ahorro con tasa
        const savingsElement = document.querySelector('.savings-amount');
        if (savingsElement) {
            const savingsRate = (totals.balance / totals.income) * 100;
            savingsElement.innerHTML = `
                €${totals.balance.toFixed(2)}
                <span class="savings-rate">${savingsRate.toFixed(1)}% tasa de ahorro</span>
            `;
        }
    }

    calculateTotals() {
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        
        const monthlyTransactions = this.transactions.filter(t => {
            const transactionDate = new Date(t.date);
            return transactionDate.getMonth() === currentMonth && 
                   transactionDate.getFullYear() === currentYear;
        });

        const income = monthlyTransactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);

        const expenses = monthlyTransactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        const balance = income - expenses;

        return { income, expenses, balance };
    }

    calculateTrends() {
        // Implementación básica de tendencias
        return {
            income: 5.2,
            expenses: -2.1,
            balance: 8.3
        };
    }

    updateQuickStats() {
        const stats = this.calculateQuickStats();
        
        const transactionsEl = document.querySelector('.stat-transactions');
        if (transactionsEl) {
            transactionsEl.textContent = stats.transactions;
        }

        const topCategoryEl = document.querySelector('.stat-top-category');
        if (topCategoryEl) {
            topCategoryEl.textContent = stats.topCategory;
        }

        const daysLeftEl = document.querySelector('.stat-days-left');
        if (daysLeftEl) {
            daysLeftEl.textContent = stats.daysLeft;
        }
    }

    calculateQuickStats() {
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        
        const monthlyTransactions = this.transactions.filter(t => {
            const transactionDate = new Date(t.date);
            return transactionDate.getMonth() === currentMonth && 
                   transactionDate.getFullYear() === currentYear;
        });

        // Calcular categoría más gastada
        const categoryTotals = {};
        monthlyTransactions
            .filter(t => t.type === 'expense')
            .forEach(t => {
                categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
            });

        const topCategory = Object.keys(categoryTotals).reduce((a, b) => 
            categoryTotals[a] > categoryTotals[b] ? a : b, 'N/A'
        );

        // Días restantes en el mes
        const today = new Date();
        const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        const daysLeft = lastDay.getDate() - today.getDate();

        return {
            transactions: monthlyTransactions.length,
            topCategory: topCategory,
            daysLeft: daysLeft
        };
    }

    updateNetWorth() {
        const netWorth = this.calculateNetWorth();
        
        const netWorthEl = document.querySelector('.net-worth-amount');
        if (netWorthEl) {
            netWorthEl.textContent = `€${netWorth.toFixed(2)}`;
        }
    }

    calculateNetWorth() {
        const totalAssets = this.assets.reduce((sum, asset) => sum + asset.value, 0);
        const totalLiabilities = this.liabilities.reduce((sum, liability) => sum + liability.balance, 0);
        return totalAssets - totalLiabilities;
    }

    updateOverview() {
        this.updateRecentTransactions();
        this.updateBudgetsOverview();
        this.updateGoalsOverview();
    }

    updateRecentTransactions() {
        const recentTransactions = this.transactions
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5);

        const container = document.querySelector('.recent-transactions');
        if (container) {
            container.innerHTML = recentTransactions.map(t => `
                <div class="transaction-item">
                    <div class="transaction-info">
                        <span class="transaction-description">${t.description}</span>
                        <span class="transaction-category">${t.category}</span>
                    </div>
                    <div class="transaction-amount ${t.type}">
                        ${t.type === 'income' ? '+' : '-'}€${t.amount.toFixed(2)}
                    </div>
                </div>
            `).join('');
        }
    }

    updateBudgetsOverview() {
        const container = document.querySelector('.budgets-overview');
        if (container) {
            container.innerHTML = this.budgets.slice(0, 3).map(budget => `
                <div class="budget-item">
                    <div class="budget-name">${budget.name}</div>
                    <div class="budget-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${(budget.spent / budget.limit) * 100}%"></div>
                        </div>
                        <span class="budget-amount">€${budget.spent.toFixed(2)} / €${budget.limit.toFixed(2)}</span>
                    </div>
                </div>
            `).join('');
        }
    }

    updateGoalsOverview() {
        const container = document.querySelector('.goals-overview');
        if (container) {
            container.innerHTML = this.goals.slice(0, 3).map(goal => `
                <div class="goal-item">
                    <div class="goal-name">${goal.name}</div>
                    <div class="goal-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${(goal.current / goal.target) * 100}%"></div>
                        </div>
                        <span class="goal-amount">€${goal.current.toFixed(2)} / €${goal.target.toFixed(2)}</span>
                    </div>
                </div>
            `).join('');
        }
    }

    updateTransactions() {
        // Implementación básica
        console.log('Actualizando transacciones...');
    }

    updateBudgets() {
        // Implementación básica
        console.log('Actualizando presupuestos...');
    }

    updateGoals() {
        // Implementación básica
        console.log('Actualizando objetivos...');
    }

    updateAssets() {
        // Implementación básica
        console.log('Actualizando activos...');
    }

    updateAnalytics() {
        // Implementación básica
        console.log('Actualizando analytics...');
    }

    setupEventListeners() {
        // Event listeners básicos
    }

    setupForms() {
        // Setup de formularios básico
    }
}

// Función para crear datos básicos de demo
function createBasicDemoData() {
    const demoTransactions = [
        {
            id: 'demo-1',
            type: 'income',
            amount: 3000,
            category: 'Salario',
            description: 'Salario mensual',
            date: new Date().toISOString().split('T')[0]
        },
        {
            id: 'demo-2',
            type: 'expense',
            amount: 800,
            category: 'Vivienda',
            description: 'Alquiler',
            date: new Date().toISOString().split('T')[0]
        },
        {
            id: 'demo-3',
            type: 'expense',
            amount: 300,
            category: 'Alimentación',
            description: 'Supermercado',
            date: new Date().toISOString().split('T')[0]
        },
        {
            id: 'demo-4',
            type: 'expense',
            amount: 150,
            category: 'Transporte',
            description: 'Gasolina',
            date: new Date().toISOString().split('T')[0]
        }
    ];
    
    localStorage.setItem('veedorTransactions', JSON.stringify(demoTransactions));
}

// Función para inicializar demo con datos (limpia, sin debug)
function initializeDemoWithData() {
    // Verificar si ya hay datos
    const existingTransactions = JSON.parse(localStorage.getItem('veedorTransactions') || '[]');
    
    if (existingTransactions.length === 0) {
        // Generar datos de demo si la función está disponible
        if (typeof generateSpectacularDemoData === 'function') {
            generateSpectacularDemoData();
        } else {
            createBasicDemoData();
        }
    }
    
    // Inicializar dashboard manager si no existe
    if (!window.dashboardManager && typeof DashboardManager !== 'undefined') {
        window.dashboardManager = new DashboardManager();
    }
    
    // Actualizar el dashboard después de un breve delay
    setTimeout(() => {
        if (window.dashboardManager) {
            window.dashboardManager.loadData();
            window.dashboardManager.updateFinancialSummary();
            window.dashboardManager.loadOverviewTab();
        }
    }, 500);
}

// Función limpia para inicializar gráficas
function initializeCharts() {
    console.log('Inicializando gráficas...');
    
    if (!window.dashboardManager) {
        console.error('DashboardManager no disponible');
        return;
    }
    
    if (typeof Chart === 'undefined') {
        console.error('Chart.js no disponible');
        return;
    }
    
    try {
        window.dashboardManager.updateOverviewCharts();
        console.log('✅ Gráficas inicializadas correctamente');
    } catch (error) {
        console.error('❌ Error inicializando gráficas:', error);
    }
}

// Inicializar automáticamente cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        initializeDemoWithData();
    }, 100);
});

// También inicializar cuando la ventana se carga completamente
window.addEventListener('load', () => {
    console.log('Ventana cargada completamente');
    
    // Esperar un poco más para asegurar que todo esté listo
    setTimeout(() => {
        console.log('Verificando componentes...');
        console.log('Chart.js:', typeof Chart !== 'undefined');
        console.log('DashboardManager:', !!window.dashboardManager);
        
        if (typeof Chart !== 'undefined' && window.dashboardManager) {
            initializeCharts();
        } else {
            console.log('Esperando componentes...');
            // Reintentar después de más tiempo
            setTimeout(() => {
                if (typeof Chart !== 'undefined' && window.dashboardManager) {
                    initializeCharts();
                } else {
                    console.error('No se pudieron cargar los componentes necesarios');
                }
            }, 1000);
        }
    }, 500);
});

// Función de debug temporal para verificar el estado
function debugCharts() {
    console.log('=== DEBUG CHARTS ===');
    console.log('Chart.js disponible:', typeof Chart !== 'undefined');
    console.log('DashboardManager disponible:', !!window.dashboardManager);
    
    const canvas1 = document.getElementById('overviewCategoryChart');
    const canvas2 = document.getElementById('overviewTrendsChart');
    const canvas3 = document.getElementById('overviewIncomeExpensesChart');
    
    console.log('Canvas encontrados:', {
        categoryChart: !!canvas1,
        trendsChart: !!canvas2,
        incomeExpensesChart: !!canvas3
    });
    
    if (canvas1) console.log('Canvas 1 dimensions:', canvas1.width, 'x', canvas1.height);
    if (canvas2) console.log('Canvas 2 dimensions:', canvas2.width, 'x', canvas2.height);
    if (canvas3) console.log('Canvas 3 dimensions:', canvas3.width, 'x', canvas3.height);
    
    // Intentar crear una gráfica simple
    if (typeof Chart !== 'undefined' && canvas1) {
        try {
            const ctx = canvas1.getContext('2d');
            new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['Test'],
                    datasets: [{
                        data: [100],
                        backgroundColor: ['#8B5CF6']
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false
                }
            });
            console.log('✅ Gráfica de prueba creada exitosamente');
        } catch (error) {
            console.error('❌ Error creando gráfica de prueba:', error);
        }
    }
}

// Hacer la función global
window.debugCharts = debugCharts;

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
    
    // Actualizar gráficos si existen
    if (veedorFinance && veedorFinance.updateChartsTheme) {
        veedorFinance.updateChartsTheme();
    }
}

// Inicializar tema al cargar
loadTheme();

// Inicializar la aplicación
let veedorFinance;
document.addEventListener('DOMContentLoaded', () => {
    veedorFinance = new VeedorFinanceCenter();
});

function showTab(tabName) {
    if (veedorFinance) {
        veedorFinance.showTab(tabName);
    }
}
