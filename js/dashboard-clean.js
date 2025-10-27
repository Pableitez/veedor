// ========================================
// DASHBOARD PRINCIPAL (ESTILO FINTONIC)
// ========================================

class DashboardManager {
    constructor() {
        this.currentTab = 'overview';
        this.transactions = [];
        this.budgets = [];
        this.goals = [];
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
            this.updateOverviewCharts();
        } else {
            // Esperar a que Chart.js se cargue
            setTimeout(() => this.waitForChartJS(), 100);
        }
    }

    loadData() {
        // Cargar transacciones desde localStorage o Supabase
        const savedTransactions = localStorage.getItem('veedorTransactions');
        if (savedTransactions) {
            this.transactions = JSON.parse(savedTransactions);
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

    showDashboardTab(tabName) {
        // Ocultar todas las pestañas
        document.querySelectorAll('.dashboard-tab').forEach(tab => {
            tab.classList.remove('active');
        });

        // Ocultar todos los botones de navegación
        document.querySelectorAll('.nav-tab').forEach(btn => {
            btn.classList.remove('active');
        });

        // Mostrar pestaña seleccionada
        const selectedTab = document.getElementById(`${tabName}-tab`);
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
        this.updateRecentTransactions();
        this.updateCategoryChart();
        
        // Actualizar gráficas con Chart.js si está disponible
        if (typeof Chart !== 'undefined') {
            this.updateOverviewCharts();
        } else {
            // Esperar a que Chart.js se cargue
            setTimeout(() => {
                if (typeof Chart !== 'undefined') {
                    this.updateOverviewCharts();
                }
            }, 200);
        }
    }

    updateFinancialSummary() {
        // Recalcular para asegurar datos actuales
        this.calculateFinancialData();
        
        const totalBalanceEl = document.querySelector('.balance-amount');
        const monthlyIncomeEl = document.querySelector('.income-amount');
        const monthlyExpensesEl = document.querySelector('.expenses-amount');
        const monthlySavingsEl = document.querySelector('.savings-amount');
        
        if (totalBalanceEl) {
            totalBalanceEl.textContent = `€${this.financialData.totalBalance.toFixed(2)}`;
        }
        
        if (monthlyIncomeEl) {
            monthlyIncomeEl.textContent = `€${this.financialData.monthlyIncome.toFixed(2)}`;
        }
        
        if (monthlyExpensesEl) {
            monthlyExpensesEl.textContent = `€${this.financialData.monthlyExpenses.toFixed(2)}`;
        }
        
        if (monthlySavingsEl) {
            // Calcular ahorro mensual
            const monthlySavings = this.financialData.monthlyIncome - this.financialData.monthlyExpenses;
            monthlySavingsEl.textContent = `€${monthlySavings.toFixed(2)}`;
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
        // Crear gráficas principales para el dashboard
        this.createOverviewCategoryChart();
        this.createOverviewTrendsChart();
        this.createOverviewIncomeExpensesChart();
    }

    createOverviewCategoryChart() {
        const canvas = document.getElementById('overviewCategoryChart');
        if (!canvas || typeof Chart === 'undefined') return;

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

        if (amounts.length === 0) return;

        // Colores profesionales
        const colors = [
            '#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', 
            '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16'
        ];

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
    }

    createOverviewTrendsChart() {
        const canvas = document.getElementById('overviewTrendsChart');
        if (!canvas || typeof Chart === 'undefined') return;

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
    }

    createOverviewIncomeExpensesChart() {
        const canvas = document.getElementById('overviewIncomeExpensesChart');
        if (!canvas || typeof Chart === 'undefined') return;

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
                tips.push('¡Excelente tasa de ahorro! Mantén este ritmo.');
            } else if (savingsRate > 10) {
                tips.push('Buena tasa de ahorro. Considera aumentar tus ingresos o reducir gastos.');
            } else {
                tips.push('Considera revisar tus gastos para mejorar tu tasa de ahorro.');
            }
        }
        
        return tips;
    }

    loadTransactionsTab() {
        // Implementación básica para la pestaña de transacciones
    }

    loadBudgetsTab() {
        // Implementación básica para la pestaña de presupuestos
    }

    loadAnalyticsTab() {
        // Implementación básica para la pestaña de analytics
    }

    loadGoalsTab() {
        // Implementación básica para la pestaña de objetivos
    }
}

// Inicializar dashboard cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    window.dashboardManager = new DashboardManager();
});
