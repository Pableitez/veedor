// ========================================
// SISTEMA DE PRESUPUESTOS Y ALERTAS
// ========================================

class BudgetManager {
    constructor() {
        this.budgets = this.loadBudgets();
        this.alerts = this.loadAlerts();
        this.notifications = [];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.checkBudgetAlerts();
    }

    loadBudgets() {
        const saved = localStorage.getItem('veedorBudgets');
        return saved ? JSON.parse(saved) : [];
    }

    loadAlerts() {
        const saved = localStorage.getItem('veedorBudgetAlerts');
        return saved ? JSON.parse(saved) : [];
    }

    saveBudgets() {
        localStorage.setItem('veedorBudgets', JSON.stringify(this.budgets));
    }

    saveAlerts() {
        localStorage.setItem('veedorBudgetAlerts', JSON.stringify(this.alerts));
    }

    setupEventListeners() {
        // Escuchar cambios en transacciones para actualizar presupuestos
        window.addEventListener('transactionAdded', () => {
            this.checkBudgetAlerts();
        });
    }

    createBudget(category, amount, period = 'monthly') {
        const budget = {
            id: Date.now().toString(),
            category,
            amount: parseFloat(amount),
            period,
            createdAt: new Date().toISOString(),
            isActive: true,
            alertThresholds: {
                warning: 0.8, // 80% del presupuesto
                critical: 0.95 // 95% del presupuesto
            }
        };

        this.budgets.push(budget);
        this.saveBudgets();
        return budget;
    }

    updateBudget(budgetId, updates) {
        const budget = this.budgets.find(b => b.id === budgetId);
        if (budget) {
            Object.assign(budget, updates);
            this.saveBudgets();
            this.checkBudgetAlerts();
        }
    }

    deleteBudget(budgetId) {
        this.budgets = this.budgets.filter(b => b.id !== budgetId);
        this.saveBudgets();
    }

    getBudgetStatus(category, period = 'monthly') {
        const budget = this.budgets.find(b => 
            b.category === category && b.period === period && b.isActive
        );

        if (!budget) return null;

        const spent = this.calculateSpentAmount(category, period);
        const percentage = (spent / budget.amount) * 100;
        const remaining = budget.amount - spent;

        return {
            budget,
            spent,
            remaining,
            percentage,
            status: this.getBudgetStatusLevel(percentage, budget.alertThresholds)
        };
    }

    calculateSpentAmount(category, period = 'monthly') {
        const transactions = JSON.parse(localStorage.getItem('veedorTransactions') || '[]');
        const now = new Date();
        
        let startDate, endDate;
        
        switch (period) {
            case 'weekly':
                startDate = new Date(now.setDate(now.getDate() - now.getDay()));
                endDate = new Date(now.setDate(now.getDate() - now.getDay() + 6));
                break;
            case 'monthly':
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
                break;
            case 'yearly':
                startDate = new Date(now.getFullYear(), 0, 1);
                endDate = new Date(now.getFullYear(), 11, 31);
                break;
            default:
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        }

        return transactions
            .filter(t => 
                t.type === 'expense' && 
                t.category === category &&
                new Date(t.date) >= startDate &&
                new Date(t.date) <= endDate
            )
            .reduce((sum, t) => sum + t.amount, 0);
    }

    getBudgetStatusLevel(percentage, thresholds) {
        if (percentage >= 100) return 'exceeded';
        if (percentage >= thresholds.critical * 100) return 'critical';
        if (percentage >= thresholds.warning * 100) return 'warning';
        return 'good';
    }

    checkBudgetAlerts() {
        this.notifications = [];
        
        this.budgets.forEach(budget => {
            if (!budget.isActive) return;

            const status = this.getBudgetStatus(budget.category, budget.period);
            if (!status) return;

            const { percentage, status: level } = status;

            // Crear alertas basadas en el estado del presupuesto
            if (level === 'exceeded') {
                this.addAlert({
                    type: 'budget_exceeded',
                    category: budget.category,
                    message: `Has excedido el presupuesto de ${budget.category} (${percentage.toFixed(1)}%)`,
                    severity: 'critical',
                    budgetId: budget.id
                });
            } else if (level === 'critical') {
                this.addAlert({
                    type: 'budget_critical',
                    category: budget.category,
                    message: `Presupuesto de ${budget.category} casi agotado (${percentage.toFixed(1)}%)`,
                    severity: 'warning',
                    budgetId: budget.id
                });
            } else if (level === 'warning') {
                this.addAlert({
                    type: 'budget_warning',
                    category: budget.category,
                    message: `Presupuesto de ${budget.category} al ${percentage.toFixed(1)}%`,
                    severity: 'info',
                    budgetId: budget.id
                });
            }
        });

        this.saveAlerts();
        this.displayNotifications();
    }

    addAlert(alert) {
        const existingAlert = this.alerts.find(a => 
            a.type === alert.type && 
            a.category === alert.category && 
            a.budgetId === alert.budgetId
        );

        if (!existingAlert) {
            alert.id = Date.now().toString();
            alert.createdAt = new Date().toISOString();
            alert.isRead = false;
            this.alerts.push(alert);
        }
    }

    displayNotifications() {
        const unreadAlerts = this.alerts.filter(a => !a.isRead);
        
        if (unreadAlerts.length > 0 && window.uiManager) {
            unreadAlerts.forEach(alert => {
                window.uiManager.showNotification(alert.message, alert.severity);
            });
        }
    }

    markAlertAsRead(alertId) {
        const alert = this.alerts.find(a => a.id === alertId);
        if (alert) {
            alert.isRead = true;
            this.saveAlerts();
        }
    }

    getBudgetRecommendations() {
        const recommendations = [];
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        // Analizar patrones de gasto del mes anterior
        const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

        const lastMonthTransactions = JSON.parse(localStorage.getItem('veedorTransactions') || '[]')
            .filter(t => {
                const transactionDate = new Date(t.date);
                return t.type === 'expense' && 
                       transactionDate.getMonth() === lastMonth &&
                       transactionDate.getFullYear() === lastMonthYear;
            });

        // Agrupar por categoría
        const categorySpending = {};
        lastMonthTransactions.forEach(t => {
            categorySpending[t.category] = (categorySpending[t.category] || 0) + t.amount;
        });

        // Generar recomendaciones
        Object.entries(categorySpending).forEach(([category, amount]) => {
            const existingBudget = this.budgets.find(b => b.category === category && b.isActive);
            
            if (!existingBudget) {
                recommendations.push({
                    type: 'create_budget',
                    category,
                    suggestedAmount: Math.round(amount * 1.1), // 10% más que el mes anterior
                    message: `Considera crear un presupuesto de $${Math.round(amount * 1.1)} para ${category}`
                });
            } else if (amount > existingBudget.amount * 1.2) {
                recommendations.push({
                    type: 'increase_budget',
                    category,
                    currentAmount: existingBudget.amount,
                    suggestedAmount: Math.round(amount * 1.1),
                    message: `Considera aumentar el presupuesto de ${category} a $${Math.round(amount * 1.1)}`
                });
            }
        });

        return recommendations;
    }

    getBudgetInsights() {
        const insights = [];
        const totalBudget = this.budgets.reduce((sum, b) => sum + b.amount, 0);
        const totalSpent = this.budgets.reduce((sum, b) => {
            const status = this.getBudgetStatus(b.category, b.period);
            return sum + (status ? status.spent : 0);
        }, 0);

        if (totalBudget > 0) {
            const overallPercentage = (totalSpent / totalBudget) * 100;
            
            insights.push({
                type: 'overall_budget',
                percentage: overallPercentage,
                message: `Has gastado el ${overallPercentage.toFixed(1)}% de tu presupuesto total`
            });

            if (overallPercentage > 80) {
                insights.push({
                    type: 'spending_high',
                    message: 'Tus gastos están cerca del límite. Considera reducir gastos no esenciales.'
                });
            }
        }

        // Encontrar categoría con mayor gasto
        const categorySpending = {};
        this.budgets.forEach(budget => {
            const status = this.getBudgetStatus(budget.category, budget.period);
            if (status) {
                categorySpending[budget.category] = status.spent;
            }
        });

        const topCategory = Object.entries(categorySpending)
            .sort(([,a], [,b]) => b - a)[0];

        if (topCategory) {
            insights.push({
                type: 'top_category',
                category: topCategory[0],
                amount: topCategory[1],
                message: `${topCategory[0]} es tu categoría de mayor gasto con $${topCategory[1].toFixed(2)}`
            });
        }

        return insights;
    }

    exportBudgetData() {
        const budgetData = {
            budgets: this.budgets,
            alerts: this.alerts,
            insights: this.getBudgetInsights(),
            recommendations: this.getBudgetRecommendations(),
            exportDate: new Date().toISOString()
        };

        const dataStr = JSON.stringify(budgetData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `veedor-budgets-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
    }

    // Funciones para la interfaz
    renderBudgetCard(budget) {
        const status = this.getBudgetStatus(budget.category, budget.period);
        if (!status) return '';

        const { spent, remaining, percentage, status: level } = status;
        const statusClass = `budget-status-${level}`;
        const statusIcon = this.getStatusIcon(level);

        return `
            <div class="budget-card ${statusClass}">
                <div class="budget-header">
                    <h4>${budget.category}</h4>
                    <span class="budget-status">${statusIcon}</span>
                </div>
                <div class="budget-progress">
                    <div class="budget-progress-bar" style="width: ${Math.min(percentage, 100)}%"></div>
                </div>
                <div class="budget-details">
                    <div class="budget-amount">
                        $${spent.toFixed(2)} de $${budget.amount.toFixed(2)}
                    </div>
                    <div class="budget-remaining">
                        Restante: $${Math.max(remaining, 0).toFixed(2)}
                    </div>
                </div>
                <div class="budget-actions">
                    <button class="btn btn-sm btn-secondary" onclick="budgetManager.editBudget('${budget.id}')">
                        Editar
                    </button>
                    <button class="btn btn-sm btn-error" onclick="budgetManager.deleteBudget('${budget.id}')">
                        Eliminar
                    </button>
                </div>
            </div>
        `;
    }

    getStatusIcon(level) {
        const icons = {
            good: '✅',
            warning: '⚠️',
            critical: '🚨',
            exceeded: '❌'
        };
        return icons[level] || '❓';
    }

    editBudget(budgetId) {
        const budget = this.budgets.find(b => b.id === budgetId);
        if (!budget) return;

        // Implementar modal de edición
        const newAmount = prompt(`Nuevo presupuesto para ${budget.category}:`, budget.amount);
        if (newAmount && !isNaN(newAmount)) {
            this.updateBudget(budgetId, { amount: parseFloat(newAmount) });
            if (window.dashboardManager) {
                window.dashboardManager.loadBudgetsTab();
            }
        }
    }
}

// Instancia global del gestor de presupuestos
window.budgetManager = new BudgetManager();
