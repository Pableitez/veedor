// ========================================
// ANALYTICS MODULE
// ========================================

class AnalyticsModule {
    constructor(core) {
        this.core = core;
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Event listeners para controles de análisis
        document.addEventListener('change', (e) => {
            if (e.target.classList.contains('analytics-period')) {
                this.updateAnalyticsPeriod(e.target.value);
            }
        });
    }

    updateAnalyticsTab() {
        this.updateAnalyticsSummary();
        this.updateSpendingChart();
        this.updateTrendsVisualization();
        this.updateAnalyticsInsights();
    }

    updateAnalyticsSummary() {
        const analyticsGrid = document.querySelector('.analytics-grid');
        if (!analyticsGrid) return;
        
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        
        // Calcular métricas del mes actual
        const monthlyData = this.getMonthlyData(currentMonth, currentYear);
        const previousMonthData = this.getMonthlyData(
            currentMonth === 0 ? 11 : currentMonth - 1,
            currentMonth === 0 ? currentYear - 1 : currentYear
        );
        
        analyticsGrid.innerHTML = `
            <div class="analytics-card">
                <h3>Resumen del Mes</h3>
                <div class="card-metrics">
                    <div class="metric-summary">
                        <span class="metric-label">Ingresos</span>
                        <span class="metric-value positive">€${monthlyData.income.toFixed(2)}</span>
                    </div>
                    <div class="metric-summary">
                        <span class="metric-label">Gastos</span>
                        <span class="metric-value negative">€${monthlyData.expenses.toFixed(2)}</span>
                    </div>
                    <div class="metric-summary">
                        <span class="metric-label">Balance</span>
                        <span class="metric-value ${monthlyData.balance >= 0 ? 'positive' : 'negative'}">€${monthlyData.balance.toFixed(2)}</span>
                    </div>
                    <div class="metric-summary">
                        <span class="metric-label">Transacciones</span>
                        <span class="metric-value">${monthlyData.transactions}</span>
                    </div>
                </div>
            </div>
            
            <div class="analytics-card">
                <h3>Comparación Mensual</h3>
                <div class="comparison-visualization">
                    <div class="comparison-item">
                        <div class="comparison-label">Ingresos</div>
                        <div class="comparison-bars">
                            <div class="comparison-bar">
                                <div class="bar-label">Mes Anterior</div>
                                <div class="bar-fill" style="height: ${(previousMonthData.income / Math.max(monthlyData.income, previousMonthData.income)) * 100}%; background-color: #6B7280;"></div>
                                <div class="bar-value">€${previousMonthData.income.toFixed(2)}</div>
                            </div>
                            <div class="comparison-bar">
                                <div class="bar-label">Mes Actual</div>
                                <div class="bar-fill" style="height: ${(monthlyData.income / Math.max(monthlyData.income, previousMonthData.income)) * 100}%; background-color: #4CAF50;"></div>
                                <div class="bar-value">€${monthlyData.income.toFixed(2)}</div>
                            </div>
                        </div>
                        <div class="comparison-change ${monthlyData.income >= previousMonthData.income ? 'positive' : 'negative'}">
                            ${monthlyData.income >= previousMonthData.income ? '+' : ''}€${(monthlyData.income - previousMonthData.income).toFixed(2)}
                        </div>
                    </div>
                    
                    <div class="comparison-item">
                        <div class="comparison-label">Gastos</div>
                        <div class="comparison-bars">
                            <div class="comparison-bar">
                                <div class="bar-label">Mes Anterior</div>
                                <div class="bar-fill" style="height: ${(previousMonthData.expenses / Math.max(monthlyData.expenses, previousMonthData.expenses)) * 100}%; background-color: #6B7280;"></div>
                                <div class="bar-value">€${previousMonthData.expenses.toFixed(2)}</div>
                            </div>
                            <div class="comparison-bar">
                                <div class="bar-label">Mes Actual</div>
                                <div class="bar-fill" style="height: ${(monthlyData.expenses / Math.max(monthlyData.expenses, previousMonthData.expenses)) * 100}%; background-color: #F44336;"></div>
                                <div class="bar-value">€${monthlyData.expenses.toFixed(2)}</div>
                            </div>
                        </div>
                        <div class="comparison-change ${monthlyData.expenses <= previousMonthData.expenses ? 'positive' : 'negative'}">
                            ${monthlyData.expenses <= previousMonthData.expenses ? '-' : '+'}€${Math.abs(monthlyData.expenses - previousMonthData.expenses).toFixed(2)}
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="analytics-card">
                <h3>Distribución de Gastos</h3>
                <div class="category-breakdown">
                    ${this.getCategoryBreakdown(monthlyData.expensesByCategory).map(category => `
                        <div class="category-item">
                            <div class="category-info">
                                <div class="category-name">${category.name}</div>
                                <div class="category-percentage">${category.percentage.toFixed(1)}%</div>
                            </div>
                            <div class="category-bar">
                                <div class="category-fill" style="width: ${category.percentage}%; background-color: ${category.color}"></div>
                            </div>
                            <div class="category-amount">€${category.amount.toFixed(2)}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    updateSpendingChart() {
        const spendingChart = document.querySelector('.spending-chart');
        if (!spendingChart) return;
        
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const monthlyData = this.getMonthlyData(currentMonth, currentYear);
        const categories = this.getCategoryBreakdown(monthlyData.expensesByCategory);
        
        if (categories.length === 0) {
            spendingChart.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📊</div>
                    <div class="empty-state-title">No hay datos de gastos</div>
                </div>
            `;
            return;
        }
        
        spendingChart.innerHTML = categories.map(category => `
            <div class="chart-item">
                <div class="chart-info">
                    <div class="chart-category">${category.name}</div>
                    <div class="chart-amount">€${category.amount.toFixed(2)}</div>
                </div>
                <div class="chart-bar">
                    <div class="chart-fill" style="width: ${category.percentage}%; background-color: ${category.color}"></div>
                </div>
            </div>
        `).join('');
    }

    updateTrendsVisualization() {
        const trendsVisualization = document.querySelector('.trends-visualization');
        if (!trendsVisualization) return;
        
        const trendsData = this.getTrendsData();
        
        trendsVisualization.innerHTML = `
            <div class="trend-chart">
                <div class="trend-line">
                    ${trendsData.map((point, index) => `
                        <div class="trend-point ${index === trendsData.length - 1 ? 'active' : ''}" 
                             style="left: ${(index / (trendsData.length - 1)) * 100}%; 
                                    bottom: ${(point.balance / Math.max(...trendsData.map(p => p.balance))) * 100}%"></div>
                    `).join('')}
                </div>
                <div class="trend-labels">
                    <span>Hace 6 meses</span>
                    <span>Hace 3 meses</span>
                    <span>Mes actual</span>
                </div>
            </div>
            <div class="trend-summary">
                <div class="trend-stat">
                    <span class="trend-label">Tendencia</span>
                    <span class="trend-value ${trendsData[trendsData.length - 1].balance >= trendsData[0].balance ? 'positive' : 'negative'}">
                        ${trendsData[trendsData.length - 1].balance >= trendsData[0].balance ? '↗' : '↘'}
                    </span>
                </div>
                <div class="trend-stat">
                    <span class="trend-label">Cambio Total</span>
                    <span class="trend-value ${trendsData[trendsData.length - 1].balance >= trendsData[0].balance ? 'positive' : 'negative'}">
                        €${(trendsData[trendsData.length - 1].balance - trendsData[0].balance).toFixed(2)}
                    </span>
                </div>
            </div>
        `;
    }

    updateAnalyticsInsights() {
        const analyticsInsights = document.querySelector('.analytics-insights');
        if (!analyticsInsights) return;
        
        const insights = this.generateAnalyticsInsights();
        
        analyticsInsights.innerHTML = insights.map(insight => `
            <div class="insight-item ${insight.type}">
                <div class="insight-icon">${insight.icon}</div>
                <div class="insight-content">
                    <div class="insight-title">${insight.title}</div>
                    <div class="insight-description">${insight.description}</div>
                </div>
            </div>
        `).join('');
    }

    getMonthlyData(month, year) {
        let income = 0;
        let expenses = 0;
        let transactions = 0;
        const expensesByCategory = {};
        
        this.core.transactions.forEach(transaction => {
            const transactionDate = new Date(transaction.date);
            if (transactionDate.getMonth() === month && transactionDate.getFullYear() === year) {
                transactions++;
                if (transaction.type === 'income') {
                    income += transaction.amount;
                } else {
                    const amount = Math.abs(transaction.amount);
                    expenses += amount;
                    expensesByCategory[transaction.category] = (expensesByCategory[transaction.category] || 0) + amount;
                }
            }
        });
        
        return {
            income,
            expenses,
            balance: income - expenses,
            transactions,
            expensesByCategory
        };
    }

    getCategoryBreakdown(expensesByCategory) {
        const totalExpenses = Object.values(expensesByCategory).reduce((sum, amount) => sum + amount, 0);
        
        return Object.entries(expensesByCategory)
            .map(([categoryId, amount]) => {
                const category = this.core.categories.find(c => c.id === categoryId);
                return {
                    name: category ? category.name : 'Otros',
                    amount,
                    percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0,
                    color: category ? category.color : '#6B7280'
                };
            })
            .sort((a, b) => b.amount - a.amount);
    }

    getTrendsData() {
        const trends = [];
        const currentDate = new Date();
        
        for (let i = 5; i >= 0; i--) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
            const monthData = this.getMonthlyData(date.getMonth(), date.getFullYear());
            trends.push({
                month: date.getMonth(),
                year: date.getFullYear(),
                balance: monthData.balance,
                income: monthData.income,
                expenses: monthData.expenses
            });
        }
        
        return trends;
    }

    generateAnalyticsInsights() {
        const insights = [];
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const monthlyData = this.getMonthlyData(currentMonth, currentYear);
        const previousMonthData = this.getMonthlyData(
            currentMonth === 0 ? 11 : currentMonth - 1,
            currentMonth === 0 ? currentYear - 1 : currentYear
        );
        
        // Insight de balance
        if (monthlyData.balance > 0) {
            insights.push({
                type: 'success',
                icon: '✓',
                title: 'Balance Positivo',
                description: `Tienes un balance positivo de €${monthlyData.balance.toFixed(2)} este mes`
            });
        } else {
            insights.push({
                type: 'error',
                icon: '⚠',
                title: 'Balance Negativo',
                description: `Tu balance es negativo en €${Math.abs(monthlyData.balance).toFixed(2)} este mes`
            });
        }
        
        // Insight de tendencia de ingresos
        const incomeChange = monthlyData.income - previousMonthData.income;
        if (incomeChange > 0) {
            insights.push({
                type: 'success',
                icon: '↗',
                title: 'Ingresos en Aumento',
                description: `Tus ingresos han aumentado €${incomeChange.toFixed(2)} respecto al mes anterior`
            });
        } else if (incomeChange < 0) {
            insights.push({
                type: 'warning',
                icon: '↘',
                title: 'Ingresos en Disminución',
                description: `Tus ingresos han disminuido €${Math.abs(incomeChange).toFixed(2)} respecto al mes anterior`
            });
        }
        
        // Insight de categoría principal
        const categoryBreakdown = this.getCategoryBreakdown(monthlyData.expensesByCategory);
        if (categoryBreakdown.length > 0) {
            const topCategory = categoryBreakdown[0];
            insights.push({
                type: 'info',
                icon: '📊',
                title: 'Categoría Principal',
                description: `${topCategory.name} representa el ${topCategory.percentage.toFixed(1)}% de tus gastos`
            });
        }
        
        // Insight de ahorro
        const savingsRate = monthlyData.income > 0 ? (monthlyData.balance / monthlyData.income) * 100 : 0;
        if (savingsRate > 20) {
            insights.push({
                type: 'success',
                icon: '💰',
                title: 'Excelente Tasa de Ahorro',
                description: `Estás ahorrando el ${savingsRate.toFixed(1)}% de tus ingresos`
            });
        } else if (savingsRate > 10) {
            insights.push({
                type: 'info',
                icon: '💡',
                title: 'Buena Tasa de Ahorro',
                description: `Estás ahorrando el ${savingsRate.toFixed(1)}% de tus ingresos`
            });
        } else if (savingsRate < 0) {
            insights.push({
                type: 'error',
                icon: '⚠',
                title: 'Gastos Superan Ingresos',
                description: `Tus gastos superan tus ingresos en €${Math.abs(monthlyData.balance).toFixed(2)}`
            });
        }
        
        return insights;
    }

    updateAnalyticsPeriod(period) {
        // Implementar lógica para cambiar el período de análisis
        console.log('Analytics period changed to:', period);
        this.updateAnalyticsTab();
    }
}

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AnalyticsModule;
}
