// ========================================
// VEEDOR DASHBOARD - PANEL PRINCIPAL
// ========================================

class VeedorDashboard {
    static updateAll(app) {
        this.updateFinancialSummary(app);
        this.updateQuickStats(app);
        this.updateRecentTransactions(app);
        this.updateBudgetsOverview(app);
        this.updateGoalsOverview(app);
        this.updateAnalyticsInsights(app);
        this.updateNetWorth(app);
    }

    static updateFinancialSummary(app) {
        const income = VeedorCalculators.calculateTotalIncome(app.transactions);
        const expenses = VeedorCalculators.calculateTotalExpenses(app.transactions);
        const balance = VeedorCalculators.calculateBalance(app.transactions);
        const savingsRate = income > 0 ? ((balance / income) * 100) : 0;

        // Actualizar elementos
        this.updateElement('.income-amount', VeedorCalculators.formatCurrency(income));
        this.updateElement('.expenses-amount', VeedorCalculators.formatCurrency(expenses));
        this.updateElement('.balance-amount', VeedorCalculators.formatCurrency(balance));
        this.updateElement('.savings-amount', VeedorCalculators.formatCurrency(balance));
        
        // Actualizar cambios
        this.updateElement('.summary-change.positive', `+€150.00 este mes`);
        this.updateElement('.summary-change.negative', `+€30.00 vs mes anterior`);
        
        // Actualizar tasa de ahorro
        const savingsRateElement = document.querySelector('.summary-change.positive');
        if (savingsRateElement && savingsRateElement.textContent.includes('tasa de ahorro')) {
            savingsRateElement.textContent = `${savingsRate.toFixed(1)}% tasa de ahorro`;
        }
    }

    static updateQuickStats(app) {
        const stats = this.calculateQuickStats(app);
        
        // Actualizar estadísticas
        this.updateElement('.stat-number', stats.transactionsCount);
        this.updateElement('.stat-label', 'Transacciones este mes');
        
        // Actualizar categoría principal
        const topCategoryElement = document.querySelector('.stat-label');
        if (topCategoryElement && topCategoryElement.textContent.includes('Servicios')) {
            topCategoryElement.textContent = stats.topCategory.name;
        }
        
        // Actualizar días restantes
        this.updateElement('.stat-number', stats.daysLeft);
    }

    static calculateQuickStats(app) {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        
        const monthlyTransactions = app.transactions.filter(t => {
            const transactionDate = new Date(t.date);
            return transactionDate.getMonth() === currentMonth && 
                   transactionDate.getFullYear() === currentYear;
        });
        
        const categoryTotals = VeedorCalculators.calculateCategoryTotals(monthlyTransactions);
        const topCategory = Object.entries(categoryTotals)
            .filter(([cat, data]) => data.expenses > 0)
            .sort((a, b) => b[1].expenses - a[1].expenses)[0];
        
        const daysLeft = new Date(currentYear, currentMonth + 1, 0).getDate() - now.getDate();
        
        return {
            transactionsCount: monthlyTransactions.length,
            topCategory: topCategory ? {
                name: app.categories.find(c => c.id === topCategory[0])?.name || 'Otros',
                amount: topCategory[1].expenses
            } : { name: 'N/A', amount: 0 },
            daysLeft: daysLeft
        };
    }

    static updateRecentTransactions(app) {
        const recentTransactions = app.transactions
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5);
        
        const container = document.querySelector('.recent-transactions');
        if (!container) return;
        
        if (recentTransactions.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📊</div>
                    <div class="empty-state-title">No hay transacciones</div>
                    <div class="empty-state-description">Agrega tu primera transacción para comenzar</div>
                </div>
            `;
            return;
        }
        
        container.innerHTML = recentTransactions.map(transaction => `
            <div class="transaction-item">
                <div class="transaction-icon" style="background-color: ${this.getCategoryColor(transaction.category, app.categories)}">
                    ${this.getCategoryIcon(transaction.category)}
                </div>
                <div class="transaction-info">
                    <div class="transaction-description">${transaction.description}</div>
                    <div class="transaction-meta">
                        <span>${VeedorUtils.formatDate(transaction.date)}</span>
                        <span>${this.getCategoryName(transaction.category, app.categories)}</span>
                    </div>
                </div>
                <div class="transaction-amount ${transaction.type}">
                    ${transaction.type === 'income' ? '+' : '-'}${VeedorCalculators.formatCurrency(transaction.amount)}
                </div>
            </div>
        `).join('');
    }

    static updateBudgetsOverview(app) {
        const container = document.querySelector('.budgets-overview');
        if (!container) return;
        
        if (app.budgets.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">💰</div>
                    <div class="empty-state-title">No hay presupuestos</div>
                    <div class="empty-state-description">Crea tu primer presupuesto para controlar tus gastos</div>
                </div>
            `;
            return;
        }
        
        container.innerHTML = app.budgets.map(budget => {
            const progress = VeedorCalculators.calculateBudgetProgress(budget, app.transactions);
            const status = VeedorCalculators.calculateBudgetStatus(progress.percentage);
            
            return `
                <div class="budget-item">
                    <div class="budget-header">
                        <div class="budget-category">
                            <div class="budget-icon" style="background-color: ${this.getCategoryColor(budget.category, app.categories)}">
                                ${this.getCategoryIcon(budget.category)}
                            </div>
                            <div class="budget-name">${this.getCategoryName(budget.category, app.categories)}</div>
                        </div>
                        <div class="budget-status ${status}">
                            ${this.getBudgetStatusText(status)}
                        </div>
                    </div>
                    <div class="budget-progress">
                        <div class="budget-bar">
                            <div class="budget-fill" style="width: ${Math.min(100, progress.percentage)}%"></div>
                        </div>
                        <div class="budget-amounts">
                            <span>${VeedorCalculators.formatCurrency(progress.spent)}</span>
                            <span>${VeedorCalculators.formatCurrency(budget.amount)}</span>
                        </div>
                        <div class="budget-remaining">
                            Restante: ${VeedorCalculators.formatCurrency(progress.remaining)}
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    static updateGoalsOverview(app) {
        const container = document.querySelector('.goals-overview');
        if (!container) return;
        
        if (app.goals.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">🎯</div>
                    <div class="empty-state-title">No hay metas</div>
                    <div class="empty-state-description">Establece tus primeras metas financieras</div>
                </div>
            `;
            return;
        }
        
        container.innerHTML = app.goals.map(goal => {
            const progress = VeedorCalculators.calculateGoalProgress(goal, app.transactions);
            
            return `
                <div class="goal-item">
                    <div class="goal-header">
                        <div class="goal-name">${goal.name}</div>
                        <div class="goal-priority ${goal.priority}">
                            ${goal.priority}
                        </div>
                    </div>
                    <div class="goal-progress">
                        <div class="goal-bar">
                            <div class="goal-fill" style="width: ${Math.min(100, progress.percentage)}%"></div>
                        </div>
                        <div class="goal-percentage">
                            ${progress.percentage.toFixed(1)}%
                        </div>
                    </div>
                    <div class="goal-details">
                        <div>
                            <span>Ahorrado:</span>
                            <span>${VeedorCalculators.formatCurrency(progress.saved)}</span>
                        </div>
                        <div>
                            <span>Meta:</span>
                            <span>${VeedorCalculators.formatCurrency(goal.target)}</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    static updateAnalyticsInsights(app) {
        const insights = this.generateAnalyticsInsights(app);
        const container = document.querySelector('.analytics-insights');
        if (!container) return;
        
        container.innerHTML = insights.map(insight => `
            <div class="insight-item ${insight.type}">
                <div class="insight-icon">${insight.icon || '📊'}</div>
                <div class="insight-content">
                    <div class="insight-title">${insight.title}</div>
                    <div class="insight-description">${insight.description}</div>
                </div>
            </div>
        `).join('');
    }

    static generateAnalyticsInsights(app) {
        const insights = [];
        const trends = VeedorCalculators.calculateTrends(app.transactions);
        
        // Tendencia de ingresos
        if (trends.incomeChange > 0) {
            insights.push({
                type: 'success',
                icon: '📈',
                title: 'Tendencia Positiva',
                description: `Tus ingresos han aumentado un ${trends.incomeChange.toFixed(1)}% este mes`
            });
        } else if (trends.incomeChange < 0) {
            insights.push({
                type: 'warning',
                icon: '📉',
                title: 'Tendencia Negativa',
                description: `Tus ingresos han disminuido un ${Math.abs(trends.incomeChange).toFixed(1)}% este mes`
            });
        }
        
        // Categoría principal
        const categoryTotals = VeedorCalculators.calculateCategoryTotals(app.transactions);
        const topCategory = Object.entries(categoryTotals)
            .filter(([cat, data]) => data.expenses > 0)
            .sort((a, b) => b[1].expenses - a[1].expenses)[0];
        
        if (topCategory) {
            const categoryName = app.categories.find(c => c.id === topCategory[0])?.name || 'Otros';
            const percentage = VeedorCalculators.calculateCategoryPercentage(app.transactions, topCategory[0]);
            insights.push({
                type: 'info',
                icon: '📊',
                title: 'Categoría Principal',
                description: `${categoryName} representa el ${percentage.toFixed(1)}% de tus gastos`
            });
        }
        
        return insights;
    }

    static updateNetWorth(app) {
        const netWorth = VeedorCalculators.calculateNetWorth(app.assets, app.liabilities);
        const totalAssets = VeedorCalculators.calculateTotalAssets(app.assets);
        const totalLiabilities = VeedorCalculators.calculateTotalLiabilities(app.liabilities);
        
        // Actualizar valor neto
        this.updateElement('.net-worth-value', VeedorCalculators.formatCurrency(netWorth));
        
        // Actualizar desglose
        this.updateElement('.net-worth-amount.positive', VeedorCalculators.formatCurrency(totalAssets));
        this.updateElement('.net-worth-amount.negative', VeedorCalculators.formatCurrency(totalLiabilities));
    }

    static updateOverview(app) {
        this.updateFinancialSummary(app);
        this.updateQuickStats(app);
        this.updateRecentTransactions(app);
        this.updateBudgetsOverview(app);
        this.updateGoalsOverview(app);
    }

    // Utilidades
    static updateElement(selector, content) {
        const element = document.querySelector(selector);
        if (element) {
            element.textContent = content;
        }
    }

    static getCategoryColor(categoryId, categories) {
        const category = categories.find(c => c.id === categoryId);
        return category ? category.color : '#6B7280';
    }

    static getCategoryName(categoryId, categories) {
        const category = categories.find(c => c.id === categoryId);
        return category ? category.name : 'Otros';
    }

    static getCategoryIcon(categoryId) {
        const icons = {
            food: '🍽️',
            transport: '🚗',
            entertainment: '🎬',
            health: '🏥',
            shopping: '🛍️',
            utilities: '⚡',
            income: '💰',
            other: '📦'
        };
        return icons[categoryId] || '📦';
    }

    static getBudgetStatusText(status) {
        const texts = {
            excellent: 'Excelente',
            good: 'Bueno',
            warning: 'Atención',
            critical: 'Crítico'
        };
        return texts[status] || 'Desconocido';
    }
}

// Exportar para uso global
window.VeedorDashboard = VeedorDashboard;
