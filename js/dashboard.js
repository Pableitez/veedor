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

        this.calculateFinancialData();
    }

    calculateFinancialData() {
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        this.financialData.monthlyIncome = this.transactions
            .filter(t => t.type === 'income' && 
                new Date(t.date).getMonth() === currentMonth && 
                new Date(t.date).getFullYear() === currentYear)
            .reduce((sum, t) => sum + t.amount, 0);

        this.financialData.monthlyExpenses = this.transactions
            .filter(t => t.type === 'expense' && 
                new Date(t.date).getMonth() === currentMonth && 
                new Date(t.date).getFullYear() === currentYear)
            .reduce((sum, t) => sum + t.amount, 0);

        this.financialData.totalBalance = this.financialData.monthlyIncome - this.financialData.monthlyExpenses;
    }

    setupEventListeners() {
        // Formulario de nueva transacción
        const transactionForm = document.getElementById('transaction-form');
        if (transactionForm) {
            transactionForm.addEventListener('submit', (e) => this.handleNewTransaction(e));
        }

        // Filtros de transacciones
        const filterCategory = document.getElementById('filter-category');
        const filterType = document.getElementById('filter-type');
        const filterDate = document.getElementById('filter-date');

        if (filterCategory) filterCategory.addEventListener('change', () => this.filterTransactions());
        if (filterType) filterType.addEventListener('change', () => this.filterTransactions());
        if (filterDate) filterDate.addEventListener('change', () => this.filterTransactions());
    }

    showDashboardTab(tabName) {
        console.log('Cambiando a pestaña:', tabName);
        
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
            console.log('Pestaña activada:', selectedTab.id);
        } else {
            console.log('Pestaña no encontrada:', `${tabName}-tab`);
        }
        
        if (selectedBtn) {
            selectedBtn.classList.add('active');
            console.log('Botón activado:', selectedBtn);
        } else {
            console.log('Botón no encontrado para:', tabName);
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
        
        console.log('Pestaña cambiada a:', tabName, 'Contenido cargado');
    }

    loadOverviewTab() {
        this.updateRecentTransactions();
        this.updateCategoryChart();
    }

    loadTransactionsTab() {
        this.renderTransactionsTable();
    }

    loadBudgetsTab() {
        this.renderBudgets();
    }

    loadAnalyticsTab() {
        this.renderAnalyticsCharts();
    }

    loadGoalsTab() {
        this.renderGoals();
    }

    updateFinancialSummary() {
        document.getElementById('total-balance').textContent = `$${this.financialData.totalBalance.toFixed(2)}`;
        document.getElementById('monthly-income').textContent = `$${this.financialData.monthlyIncome.toFixed(2)}`;
        document.getElementById('monthly-expenses').textContent = `$${this.financialData.monthlyExpenses.toFixed(2)}`;
        document.getElementById('savings-goal').textContent = `$${this.financialData.savingsGoal.toFixed(2)}`;
    }

    updateRecentTransactions() {
        const container = document.getElementById('recent-transactions');
        if (!container) return;

        const recentTransactions = this.transactions
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5);

        if (recentTransactions.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">No hay transacciones recientes</p>';
            return;
        }

        container.innerHTML = recentTransactions.map(transaction => `
            <div class="transaction-item">
                <div class="transaction-info">
                    <div class="transaction-description">${transaction.description}</div>
                    <div class="transaction-category">${transaction.category}</div>
                </div>
                <div class="transaction-amount ${transaction.type}">
                    ${transaction.type === 'income' ? '+' : '-'}$${transaction.amount.toFixed(2)}
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

        // Colores para las categorías
        const colors = [
            '#3B82F6', '#EF4444', '#10B981', '#F59E0B', 
            '#8B5CF6', '#06B6D4', '#84CC16', '#F97316'
        ];

        // Dibujar gráfico de barras simple
        const barWidth = canvas.width / categories.length * 0.8;
        const maxAmount = Math.max(...amounts);
        const barSpacing = canvas.width / categories.length;

        categories.forEach((category, index) => {
            const barHeight = (amounts[index] / maxAmount) * (canvas.height - 40);
            const x = index * barSpacing + (barSpacing - barWidth) / 2;
            const y = canvas.height - barHeight - 20;

            ctx.fillStyle = colors[index % colors.length];
            ctx.fillRect(x, y, barWidth, barHeight);

            // Etiqueta de categoría
            ctx.fillStyle = 'var(--text-secondary)';
            ctx.font = '10px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(category.substring(0, 8), x + barWidth / 2, canvas.height - 5);
        });
    }

    renderTransactionsTable() {
        const container = document.getElementById('transactions-list');
        if (!container) return;

        if (this.transactions.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 2rem;">No hay transacciones registradas</p>';
            return;
        }

        const sortedTransactions = [...this.transactions].sort((a, b) => new Date(b.date) - new Date(a.date));

        container.innerHTML = `
            <div class="transaction-row">
                <div>Descripción</div>
                <div>Categoría</div>
                <div>Monto</div>
                <div>Fecha</div>
                <div>Acciones</div>
            </div>
            ${sortedTransactions.map(transaction => `
                <div class="transaction-row">
                    <div class="transaction-description-cell">${transaction.description}</div>
                    <div class="transaction-category-cell">${transaction.category}</div>
                    <div class="transaction-amount-cell ${transaction.type}">
                        ${transaction.type === 'income' ? '+' : '-'}$${transaction.amount.toFixed(2)}
                    </div>
                    <div class="transaction-date-cell">${new Date(transaction.date).toLocaleDateString()}</div>
                    <div class="transaction-actions-cell">
                        <button class="btn btn-sm btn-secondary" onclick="dashboardManager.editTransaction('${transaction.id}')">Editar</button>
                        <button class="btn btn-sm btn-error" onclick="dashboardManager.deleteTransaction('${transaction.id}')">Eliminar</button>
                    </div>
                </div>
            `).join('')}
        `;
    }

    renderBudgets() {
        const container = document.getElementById('budgets-list');
        if (!container) return;

        if (this.budgets.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 2rem;">No hay presupuestos configurados</p>';
            return;
        }

        container.innerHTML = this.budgets.map(budget => {
            const spent = this.transactions
                .filter(t => t.type === 'expense' && t.category === budget.category)
                .reduce((sum, t) => sum + t.amount, 0);
            const percentage = (spent / budget.amount) * 100;

            return `
                <div class="budget-card">
                    <h4>${budget.category}</h4>
                    <div class="budget-progress">
                        <div class="budget-progress-bar" style="width: ${Math.min(percentage, 100)}%"></div>
                    </div>
                    <div class="budget-amount">
                        $${spent.toFixed(2)} de $${budget.amount.toFixed(2)}
                    </div>
                </div>
            `;
        }).join('');
    }

    renderAnalyticsCharts() {
        // Implementar gráficos de análisis
        console.log('Cargando análisis...');
    }

    renderGoals() {
        const container = document.getElementById('goals-list');
        if (!container) return;

        if (this.goals.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 2rem;">No hay objetivos configurados</p>';
            return;
        }

        container.innerHTML = this.goals.map(goal => {
            const progress = (goal.currentAmount / goal.targetAmount) * 100;

            return `
                <div class="goal-card">
                    <h4>${goal.name}</h4>
                    <div class="goal-progress">
                        <div class="goal-progress-bar" style="width: ${Math.min(progress, 100)}%"></div>
                    </div>
                    <div class="goal-amount">
                        $${goal.currentAmount.toFixed(2)} de $${goal.targetAmount.toFixed(2)}
                    </div>
                </div>
            `;
        }).join('');
    }

    generateAlerts() {
        const container = document.getElementById('financial-alerts');
        if (!container) return;

        const alerts = [];

        // Alerta de gastos excesivos
        if (this.financialData.monthlyExpenses > this.financialData.monthlyIncome * 0.8) {
            alerts.push({
                icon: '⚠️',
                title: 'Gastos Altos',
                message: 'Tus gastos representan más del 80% de tus ingresos'
            });
        }

        // Alerta de presupuesto excedido
        this.budgets.forEach(budget => {
            const spent = this.transactions
                .filter(t => t.type === 'expense' && t.category === budget.category)
                .reduce((sum, t) => sum + t.amount, 0);
            
            if (spent > budget.amount) {
                alerts.push({
                    icon: '🚨',
                    title: 'Presupuesto Excedido',
                    message: `Has excedido el presupuesto de ${budget.category}`
                });
            }
        });

        if (alerts.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">No hay alertas</p>';
            return;
        }

        container.innerHTML = alerts.map(alert => `
            <div class="alert-item">
                <div class="alert-icon">${alert.icon}</div>
                <div class="alert-content">
                    <div class="alert-title">${alert.title}</div>
                    <div class="alert-message">${alert.message}</div>
                </div>
            </div>
        `).join('');
    }

    generateTips() {
        const container = document.getElementById('financial-tips');
        if (!container) return;

        const tips = [
            {
                title: 'Regla 50-30-20',
                description: 'Asigna 50% para necesidades, 30% para deseos y 20% para ahorros'
            },
            {
                title: 'Fondo de Emergencia',
                description: 'Mantén 3-6 meses de gastos en un fondo de emergencia'
            },
            {
                title: 'Revisa tus Gastos',
                description: 'Revisa tus transacciones semanalmente para identificar patrones'
            }
        ];

        container.innerHTML = tips.map(tip => `
            <div class="tip-item">
                <div class="tip-title">${tip.title}</div>
                <div class="tip-description">${tip.description}</div>
            </div>
        `).join('');
    }

    handleNewTransaction(e) {
        e.preventDefault();

        const description = document.getElementById('transaction-description').value;
        const amount = parseFloat(document.getElementById('transaction-amount').value);
        
        // Categorización automática si no se ha seleccionado categoría
        let category = document.getElementById('transaction-category').value;
        if (!category && window.categorizationEngine) {
            const suggestion = window.categorizationEngine.suggestCategory(description);
            category = suggestion.category;
            
            // Actualizar el select con la categoría sugerida
            document.getElementById('transaction-category').value = category;
            
            // Mostrar notificación de categorización automática
            if (window.uiManager) {
                window.uiManager.showNotification(
                    `Categoría sugerida: ${category} (${Math.round(suggestion.confidence * 100)}% confianza)`, 
                    'info'
                );
            }
        }

        const transaction = {
            id: Date.now().toString(),
            type: document.getElementById('transaction-type').value,
            description: description,
            amount: amount,
            category: category,
            date: document.getElementById('transaction-date').value
        };

        this.transactions.push(transaction);
        this.saveData();
        this.calculateFinancialData();
        this.updateFinancialSummary();
        this.hideAddTransaction();

        // Actualizar la vista actual
        if (this.currentTab === 'overview') {
            this.loadOverviewTab();
        } else if (this.currentTab === 'transactions') {
            this.loadTransactionsTab();
        }

        // Mostrar notificación
        if (window.uiManager) {
            window.uiManager.showNotification('Transacción agregada correctamente', 'success');
        }
    }

    showAddTransaction() {
        document.getElementById('transaction-modal').style.display = 'flex';
        document.getElementById('transaction-date').value = new Date().toISOString().split('T')[0];
    }

    hideAddTransaction() {
        document.getElementById('transaction-modal').style.display = 'none';
        document.getElementById('transaction-form').reset();
    }

    filterTransactions() {
        // Implementar filtrado de transacciones
        this.loadTransactionsTab();
    }

    editTransaction(id) {
        // Implementar edición de transacciones
        console.log('Editando transacción:', id);
    }

    deleteTransaction(id) {
        if (confirm('¿Estás seguro de que quieres eliminar esta transacción?')) {
            this.transactions = this.transactions.filter(t => t.id !== id);
            this.saveData();
            this.calculateFinancialData();
            this.updateFinancialSummary();
            this.loadTransactionsTab();
        }
    }

    saveData() {
        localStorage.setItem('veedorTransactions', JSON.stringify(this.transactions));
        localStorage.setItem('veedorBudgets', JSON.stringify(this.budgets));
        localStorage.setItem('veedorGoals', JSON.stringify(this.goals));
    }
}

// Funciones globales para el dashboard
function showDashboardTab(tabName) {
    if (window.dashboardManager) {
        window.dashboardManager.showDashboardTab(tabName);
    }
}

function showAddTransaction() {
    if (window.dashboardManager) {
        window.dashboardManager.showAddTransaction();
    }
}

function hideAddTransaction() {
    if (window.dashboardManager) {
        window.dashboardManager.hideAddTransaction();
    }
}

function showAddBudget() {
    // Implementar modal de nuevo presupuesto
    console.log('Mostrar modal de nuevo presupuesto');
}

function showAddGoal() {
    // Implementar modal de nuevo objetivo
    console.log('Mostrar modal de nuevo objetivo');
}

// Inicializar dashboard cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    window.dashboardManager = new DashboardManager();
});
