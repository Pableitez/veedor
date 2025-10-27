// ========================================
// VEEDOR UNIFIED DASHBOARD SYSTEM
// ========================================

class VeedorDashboard {
    constructor() {
        this.currentTab = 'overview';
        this.transactions = [];
        this.budgets = [];
        this.goals = [];
        this.assets = [];
        this.liabilities = [];
        this.financialData = {
            totalBalance: 0,
            monthlyIncome: 0,
            monthlyExpenses: 0,
            savingsGoal: 0
        };
        this.charts = {};
        this.init();
    }

    init() {
        console.log('Inicializando VeedorDashboard...');
        this.loadData();
        this.setupEventListeners();
        this.updateFinancialSummary();
        this.generateAlerts();
        this.generateTips();
        
        // Cargar gráficas después de que Chart.js esté disponible
        this.waitForChartJS();
    }
    
    waitForChartJS() {
        if (typeof Chart !== 'undefined') {
            console.log('Chart.js disponible, inicializando gráficas...');
            this.updateOverviewCharts();
        } else {
            console.log('Esperando Chart.js...');
            setTimeout(() => this.waitForChartJS(), 100);
        }
    }

    loadData() {
        console.log('Cargando datos...');
        
        // Cargar transacciones desde localStorage
        const savedTransactions = localStorage.getItem('veedorTransactions');
        if (savedTransactions) {
            this.transactions = JSON.parse(savedTransactions);
            console.log('Transacciones cargadas:', this.transactions.length);
        }

        // Cargar presupuestos
        const savedBudgets = localStorage.getItem('veedorBudgets');
        if (savedBudgets) {
            this.budgets = JSON.parse(savedBudgets);
        }

        // Cargar objetivos
        const savedGoals = localStorage.getItem('veedorGoals');
        if (savedGoals) {
            this.goals = JSON.parse(savedGoals);
        }

        // Calcular datos financieros
        this.calculateFinancialData();
    }

    calculateFinancialData() {
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        
        // Filtrar transacciones del mes actual
        const monthlyTransactions = this.transactions.filter(transaction => {
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

        // Calcular balance total (ahorros acumulados)
        const totalIncome = this.transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);

        const totalExpenses = this.transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        const totalBalance = totalIncome - totalExpenses;

        // Actualizar datos financieros
        this.financialData = {
            totalBalance,
            monthlyIncome,
            monthlyExpenses,
            savingsGoal: monthlyIncome * 0.2 // 20% del ingreso mensual como meta de ahorro
        };
        
        console.log('Datos financieros calculados:', this.financialData);
    }

    setupEventListeners() {
        // Event listeners para filtros y búsquedas
        const searchInput = document.getElementById('transaction-search');
        if (searchInput) {
            searchInput.addEventListener('input', () => this.filterTransactions());
        }

        const categoryFilter = document.getElementById('category-filter');
        if (categoryFilter) {
            categoryFilter.addEventListener('change', () => this.filterTransactions());
        }
    }

    showTab(tabName) {
        console.log('Cambiando a pestaña:', tabName);
        
        // Ocultar todas las pestañas
        document.querySelectorAll('.tab-panel').forEach(tab => {
            tab.classList.remove('active');
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
        }
    }

    loadOverviewTab() {
        console.log('Cargando pestaña overview...');
        this.updateRecentTransactions();
        this.updateCategoryChart();
        
        // Actualizar gráficas con Chart.js si está disponible
        if (typeof Chart !== 'undefined') {
            this.updateOverviewCharts();
        } else {
            console.log('Chart.js no disponible, esperando...');
            setTimeout(() => {
                if (typeof Chart !== 'undefined') {
                    this.updateOverviewCharts();
                }
            }, 200);
        }
    }

    updateFinancialSummary() {
        console.log('Actualizando resumen financiero...');
        
        // Recalcular para asegurar datos actuales
        this.calculateFinancialData();
        
        const totalBalanceEl = document.querySelector('.balance-amount');
        const monthlyIncomeEl = document.querySelector('.income-amount');
        const monthlyExpensesEl = document.querySelector('.expenses-amount');
        const monthlySavingsEl = document.querySelector('.savings-amount');
        
        if (totalBalanceEl) {
            totalBalanceEl.textContent = `€${this.financialData.totalBalance.toFixed(2)}`;
            console.log('Balance actualizado:', totalBalanceEl.textContent);
        }
        
        if (monthlyIncomeEl) {
            monthlyIncomeEl.textContent = `€${this.financialData.monthlyIncome.toFixed(2)}`;
            console.log('Ingresos actualizados:', monthlyIncomeEl.textContent);
        }
        
        if (monthlyExpensesEl) {
            monthlyExpensesEl.textContent = `€${this.financialData.monthlyExpenses.toFixed(2)}`;
            console.log('Gastos actualizados:', monthlyExpensesEl.textContent);
        }
        
        if (monthlySavingsEl) {
            // Calcular ahorro mensual
            const monthlySavings = this.financialData.monthlyIncome - this.financialData.monthlyExpenses;
            monthlySavingsEl.textContent = `€${monthlySavings.toFixed(2)}`;
            console.log('Ahorro actualizado:', monthlySavingsEl.textContent);
        }
        
        // Actualizar métricas adicionales del resumen
        this.updateOverviewMetrics();
    }

    updateOverviewMetrics() {
        // Actualizar métricas del resumen principal
        const monthlyBalance = this.financialData.monthlyIncome - this.financialData.monthlyExpenses;
        const dailyAverage = this.financialData.monthlyExpenses / 30;
        
        // Actualizar elementos adicionales si existen
        const dailyAverageEl = document.querySelector('.daily-average');
        if (dailyAverageEl) {
            dailyAverageEl.textContent = `€${dailyAverage.toFixed(2)}`;
        }
    }

    updateRecentTransactions() {
        const container = document.querySelector('.recent-transactions');
        if (!container) return;

        const recentTransactions = this.transactions
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5);

        container.innerHTML = recentTransactions.map(transaction => `
            <div class="transaction-item">
                <div class="transaction-info">
                    <span class="transaction-description">${transaction.description}</span>
                    <span class="transaction-category">${transaction.category}</span>
                </div>
                <div class="transaction-amount ${transaction.type}">
                    ${transaction.type === 'income' ? '+' : '-'}€${transaction.amount.toFixed(2)}
                </div>
            </div>
        `).join('');
    }

    updateCategoryChart() {
        const canvas = document.getElementById('categoryChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        
        // Calcular gastos por categoría
        const categoryData = {};
        this.transactions
            .filter(t => t.type === 'expense')
            .forEach(transaction => {
                categoryData[transaction.category] = (categoryData[transaction.category] || 0) + transaction.amount;
            });

        const categories = Object.keys(categoryData);
        const amounts = Object.values(categoryData);

        if (amounts.length === 0) {
            ctx.fillStyle = 'var(--text-secondary)';
            ctx.font = '14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('No hay datos de gastos', canvas.width / 2, canvas.height / 2);
            return;
        }

        // Dibujar gráfico de barras simple
        const maxAmount = Math.max(...amounts);
        const barWidth = canvas.width / categories.length - 10;
        
        categories.forEach((category, index) => {
            const barHeight = (amounts[index] / maxAmount) * (canvas.height - 40);
            const x = index * (barWidth + 10) + 5;
            const y = canvas.height - barHeight - 20;
            
            // Dibujar barra
            ctx.fillStyle = `hsl(${index * 60}, 70%, 50%)`;
            ctx.fillRect(x, y, barWidth, barHeight);
            
            // Dibujar etiqueta
            ctx.fillStyle = 'var(--text-primary)';
            ctx.font = '12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(category.substring(0, 8), x + barWidth / 2, canvas.height - 5);
        });
    }

    updateOverviewCharts() {
        console.log('Actualizando gráficas principales...');
        
        // Crear gráficas principales para el dashboard
        this.createOverviewCategoryChart();
        this.createOverviewTrendsChart();
        this.createOverviewIncomeExpensesChart();
    }

    createOverviewCategoryChart() {
        const canvas = document.getElementById('overviewCategoryChart');
        if (!canvas || typeof Chart === 'undefined') {
            console.log('Canvas o Chart.js no disponible para gráfica de categorías');
            return;
        }

        console.log('Creando gráfica de categorías...');

        // Destruir gráfico existente si existe
        if (window.overviewCategoryChart && typeof window.overviewCategoryChart.destroy === 'function') {
            window.overviewCategoryChart.destroy();
        }

        // Calcular gastos por categoría del mes actual
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        
        const categoryData = {};
        this.transactions
            .filter(t => t.type === 'expense' && 
                new Date(t.date).getMonth() === currentMonth && 
                new Date(t.date).getFullYear() === currentYear)
            .forEach(transaction => {
                categoryData[transaction.category] = (categoryData[transaction.category] || 0) + transaction.amount;
            });

        const categories = Object.keys(categoryData);
        const amounts = Object.values(categoryData);

        if (amounts.length === 0) {
            console.log('No hay datos de gastos para el mes actual');
            return;
        }

        console.log('Datos de categorías:', { categories, amounts });

        // Colores profesionales
        const colors = [
            '#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', 
            '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16'
        ];

        try {
            window.overviewCategoryChart = new Chart(canvas, {
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
                                    return `${context.label}: €${context.parsed.toFixed(2)} (${percentage}%)`;
                                }
                            }
                        }
                    },
                    cutout: '60%',
                    animation: {
                        animateRotate: true,
                        duration: 1000,
                        easing: 'easeOutQuart'
                    }
                }
            });
            console.log('✅ Gráfica de categorías creada exitosamente');
        } catch (error) {
            console.error('❌ Error creando gráfica de categorías:', error);
        }
    }

    createOverviewTrendsChart() {
        const canvas = document.getElementById('overviewTrendsChart');
        if (!canvas || typeof Chart === 'undefined') {
            console.log('Canvas o Chart.js no disponible para gráfica de tendencias');
            return;
        }

        console.log('Creando gráfica de tendencias...');

        // Destruir gráfico existente si existe
        if (window.overviewTrendsChart && typeof window.overviewTrendsChart.destroy === 'function') {
            window.overviewTrendsChart.destroy();
        }

        // Obtener datos de los últimos 6 meses
        const months = [];
        const incomeData = [];
        const expenseData = [];
        
        for (let i = 5; i >= 0; i--) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            const monthName = date.toLocaleDateString('es-ES', { month: 'short' });
            months.push(monthName);
            
            const monthTransactions = this.transactions.filter(t => {
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

        console.log('Datos de tendencias:', { months, incomeData, expenseData });

        try {
            window.overviewTrendsChart = new Chart(canvas, {
                type: 'line',
                data: {
                    labels: months,
                    datasets: [{
                        label: 'Ingresos',
                        data: incomeData,
                        borderColor: '#10B981',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4
                    }, {
                        label: 'Gastos',
                        data: expenseData,
                        borderColor: '#EF4444',
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
                                    return `${context.dataset.label}: €${context.parsed.y.toFixed(2)}`;
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
                                    return '€' + value.toFixed(0);
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
                        duration: 1000,
                        easing: 'easeOutQuart'
                    }
                }
            });
            console.log('✅ Gráfica de tendencias creada exitosamente');
        } catch (error) {
            console.error('❌ Error creando gráfica de tendencias:', error);
        }
    }

    createOverviewIncomeExpensesChart() {
        const canvas = document.getElementById('overviewIncomeExpensesChart');
        if (!canvas || typeof Chart === 'undefined') {
            console.log('Canvas o Chart.js no disponible para gráfica de resumen');
            return;
        }

        console.log('Creando gráfica de resumen financiero...');

        // Destruir gráfico existente si existe
        if (window.overviewIncomeExpensesChart && typeof window.overviewIncomeExpensesChart.destroy === 'function') {
            window.overviewIncomeExpensesChart.destroy();
        }

        // Calcular totales del mes actual
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

        const savings = income - expenses;

        console.log('Datos de resumen:', { income, expenses, savings });

        try {
            window.overviewIncomeExpensesChart = new Chart(canvas, {
                type: 'bar',
                data: {
                    labels: ['Ingresos', 'Gastos', 'Ahorro'],
                    datasets: [{
                        data: [income, expenses, savings],
                        backgroundColor: [
                            'rgba(16, 185, 129, 0.8)',
                            'rgba(239, 68, 68, 0.8)',
                            'rgba(59, 130, 246, 0.8)'
                        ],
                        borderColor: [
                            '#10B981',
                            '#EF4444',
                            '#3B82F6'
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
                                    return `${context.label}: €${context.parsed.y.toFixed(2)}`;
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
                                    return '€' + value.toFixed(0);
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
                        duration: 1000,
                        easing: 'easeOutQuart'
                    }
                }
            });
            console.log('✅ Gráfica de resumen financiero creada exitosamente');
        } catch (error) {
            console.error('❌ Error creando gráfica de resumen financiero:', error);
        }
    }

    filterTransactions() {
        // Implementación básica de filtrado
        const searchTerm = document.getElementById('transaction-search')?.value.toLowerCase() || '';
        const categoryFilter = document.getElementById('category-filter')?.value || '';
        
        // Filtrar transacciones basado en los criterios
        // Esta función se puede expandir según las necesidades
    }

    generateAlerts() {
        // Generar alertas financieras
        const alerts = [];
        
        if (this.financialData.monthlyExpenses > this.financialData.monthlyIncome) {
            alerts.push({
                type: 'warning',
                message: 'Tus gastos superan tus ingresos este mes'
            });
        }
        
        if (this.financialData.totalBalance < 0) {
            alerts.push({
                type: 'error',
                message: 'Tu balance total es negativo'
            });
        }
        
        return alerts;
    }

    generateTips() {
        // Generar consejos financieros
        const tips = [];
        
        if (this.financialData.monthlyIncome > 0) {
            const savingsRate = ((this.financialData.monthlyIncome - this.financialData.monthlyExpenses) / this.financialData.monthlyIncome) * 100;
            
            if (savingsRate > 20) {
                tips.push('Excelente tasa de ahorro! Mantén este ritmo.');
            } else if (savingsRate > 10) {
                tips.push('Buena tasa de ahorro. Considera aumentar tus ingresos o reducir gastos.');
            } else {
                tips.push('Considera revisar tus gastos para mejorar tu tasa de ahorro.');
            }
        }
        
        return tips;
    }

    loadTransactionsTab() {
        console.log('Cargando pestaña de transacciones...');
    }

    loadBudgetsTab() {
        console.log('Cargando pestaña de presupuestos...');
    }

    loadAnalyticsTab() {
        console.log('Cargando pestaña de analytics...');
    }

    loadGoalsTab() {
        console.log('Cargando pestaña de objetivos...');
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
        },
        {
            id: 'demo-5',
            type: 'expense',
            amount: 200,
            category: 'Alimentación',
            description: 'Restaurante',
            date: new Date(Date.now() - 86400000).toISOString().split('T')[0] // Ayer
        },
        {
            id: 'demo-6',
            type: 'expense',
            amount: 50,
            category: 'Transporte',
            description: 'Metro/Bus',
            date: new Date(Date.now() - 172800000).toISOString().split('T')[0] // Hace 2 días
        }
    ];
    
    localStorage.setItem('veedorTransactions', JSON.stringify(demoTransactions));
    console.log('✅ Datos básicos de demo creados:', demoTransactions.length, 'transacciones');
}

// Función para inicializar demo con datos
function initializeDemoWithData() {
    console.log('=== INICIALIZANDO DEMO CON DATOS ===');
    
    // Verificar si ya hay datos
    const existingTransactions = JSON.parse(localStorage.getItem('veedorTransactions') || '[]');
    
    if (existingTransactions.length === 0) {
        console.log('No hay datos, generando datos de demo...');
        
        // Generar datos de demo si la función está disponible
        if (typeof generateSpectacularDemoData === 'function') {
            generateSpectacularDemoData();
        } else {
            createBasicDemoData();
        }
    } else {
        console.log('✅ Ya hay datos existentes:', existingTransactions.length, 'transacciones');
    }
}

// Función de debug para verificar el estado
function debugCharts() {
    console.log('=== DEBUG CHARTS ===');
    console.log('Chart.js disponible:', typeof Chart !== 'undefined');
    console.log('VeedorDashboard disponible:', !!window.veedorDashboard);
    
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
    
    // Verificar datos
    const transactions = JSON.parse(localStorage.getItem('veedorTransactions') || '[]');
    console.log('Transacciones en localStorage:', transactions.length);
    
    if (window.veedorDashboard) {
        console.log('Transacciones en VeedorDashboard:', window.veedorDashboard.transactions.length);
        console.log('Datos financieros:', window.veedorDashboard.financialData);
    }
}

// Inicializar automáticamente cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    console.log('=== DOM CARGADO ===');
    
    setTimeout(() => {
        initializeDemoWithData();
        
        // Crear instancia única de VeedorDashboard
        if (!window.veedorDashboard) {
            window.veedorDashboard = new VeedorDashboard();
            console.log('✅ VeedorDashboard creado');
        }
    }, 100);
});

// También inicializar cuando la ventana se carga completamente
window.addEventListener('load', () => {
    console.log('=== VENTANA CARGADA COMPLETAMENTE ===');
    
    setTimeout(() => {
        console.log('Verificando componentes...');
        console.log('Chart.js:', typeof Chart !== 'undefined');
        console.log('VeedorDashboard:', !!window.veedorDashboard);
        
        if (typeof Chart !== 'undefined' && window.veedorDashboard) {
            console.log('✅ Todo listo, forzando actualización de gráficas...');
            window.veedorDashboard.updateOverviewCharts();
        } else {
            console.log('Esperando componentes...');
            // Reintentar después de más tiempo
            setTimeout(() => {
                if (typeof Chart !== 'undefined' && window.veedorDashboard) {
                    console.log('✅ Componentes listos en segundo intento');
                    window.veedorDashboard.updateOverviewCharts();
                } else {
                    console.error('❌ No se pudieron cargar los componentes necesarios');
                }
            }, 1000);
        }
    }, 500);
});

// Hacer las funciones globales
window.debugCharts = debugCharts;
window.initializeDemoWithData = initializeDemoWithData;

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
    if (window.veedorDashboard && window.veedorDashboard.updateOverviewCharts) {
        window.veedorDashboard.updateOverviewCharts();
    }
}

// Inicializar tema al cargar
loadTheme();

// Función global para cambiar pestañas
function showTab(tabName) {
    if (window.veedorDashboard) {
        window.veedorDashboard.showTab(tabName);
    }
}
