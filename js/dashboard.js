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
        console.log('DashboardManager.loadData() llamado');
        
        // Cargar transacciones desde localStorage o Supabase
        const savedTransactions = localStorage.getItem('veedorTransactions');
        if (savedTransactions) {
            this.transactions = JSON.parse(savedTransactions);
            console.log('Transacciones cargadas desde localStorage:', this.transactions.length);
        } else {
            console.log('No hay transacciones en localStorage');
        }

        // Cargar presupuestos
        const savedBudgets = localStorage.getItem('veedorBudgets');
        if (savedBudgets) {
            this.budgets = JSON.parse(savedBudgets);
            console.log('Presupuestos cargados desde localStorage:', this.budgets.length);
        } else {
            console.log('No hay presupuestos en localStorage');
        }

        // Cargar objetivos
        const savedGoals = localStorage.getItem('veedorGoals');
        if (savedGoals) {
            this.goals = JSON.parse(savedGoals);
            console.log('Objetivos cargados desde localStorage:', this.goals.length);
        } else {
            console.log('No hay objetivos en localStorage');
        }

        this.calculateFinancialData();
        console.log('Datos financieros calculados:', this.financialData);
    }

    calculateFinancialData() {
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        
        console.log('Calculando datos financieros...');
        console.log('Mes actual:', currentMonth, 'Año actual:', currentYear);
        console.log('Total transacciones:', this.transactions.length);

        // DATOS MENSUALES (solo mes actual)
        const monthlyIncomeTransactions = this.transactions.filter(t => t.type === 'income' && 
            new Date(t.date).getMonth() === currentMonth && 
            new Date(t.date).getFullYear() === currentYear);
        
        const monthlyExpenseTransactions = this.transactions.filter(t => t.type === 'expense' && 
            new Date(t.date).getMonth() === currentMonth && 
            new Date(t.date).getFullYear() === currentYear);
            
        console.log('Transacciones de ingresos del mes:', monthlyIncomeTransactions.length);
        console.log('Transacciones de gastos del mes:', monthlyExpenseTransactions.length);

        this.financialData.monthlyIncome = monthlyIncomeTransactions.reduce((sum, t) => sum + t.amount, 0);
        this.financialData.monthlyExpenses = monthlyExpenseTransactions.reduce((sum, t) => sum + t.amount, 0);
        
        // BALANCE TOTAL (ahorros acumulados de todos los meses)
        const totalIncome = this.transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
        
        const totalExpenses = this.transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);
        
        this.financialData.totalBalance = totalIncome - totalExpenses;
        
        console.log('Ingresos del mes:', this.financialData.monthlyIncome);
        console.log('Gastos del mes:', this.financialData.monthlyExpenses);
        console.log('Balance total (ahorros acumulados):', this.financialData.totalBalance);
        console.log('Total ingresos históricos:', totalIncome);
        console.log('Total gastos históricos:', totalExpenses);
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
        console.log('Cargando pestaña de transacciones...');
        renderTransactionsTable();
        updateTransactionSummary();
    }

    loadBudgetsTab() {
        console.log('Cargando pestaña de presupuestos...');
        renderBudgets();
        updateBudgetSummary();
    }

    loadAnalyticsTab() {
        console.log('Cargando pestaña de análisis...');
        renderAnalyticsCharts();
        updateAnalyticsMetrics();
    }

    loadGoalsTab() {
        console.log('Cargando pestaña de objetivos...');
        renderGoals();
        updateGoalsSummary();
    }

    updateFinancialSummary() {
        console.log('Actualizando resumen financiero...');
        console.log('Datos financieros:', this.financialData);
        
        // Recalcular para asegurar datos actuales
        this.calculateFinancialData();
        
        const totalBalanceEl = document.getElementById('total-balance');
        const monthlyIncomeEl = document.getElementById('monthly-income');
        const monthlyExpensesEl = document.getElementById('monthly-expenses');
        const monthlySavingsEl = document.getElementById('monthly-savings');
        
        if (totalBalanceEl) {
            totalBalanceEl.textContent = `€${this.financialData.totalBalance.toFixed(2)}`;
            console.log('Balance total actualizado:', totalBalanceEl.textContent);
        } else {
            console.error('Elemento total-balance no encontrado');
        }
        
        if (monthlyIncomeEl) {
            monthlyIncomeEl.textContent = `€${this.financialData.monthlyIncome.toFixed(2)}`;
            console.log('Ingresos mensuales actualizados:', monthlyIncomeEl.textContent);
        } else {
            console.error('Elemento monthly-income no encontrado');
        }
        
        if (monthlyExpensesEl) {
            monthlyExpensesEl.textContent = `€${this.financialData.monthlyExpenses.toFixed(2)}`;
            console.log('Gastos mensuales actualizados:', monthlyExpensesEl.textContent);
        } else {
            console.error('Elemento monthly-expenses no encontrado');
        }
        
        if (monthlySavingsEl) {
            // Calcular ahorro mensual
            const monthlySavings = this.financialData.monthlyIncome - this.financialData.monthlyExpenses;
            monthlySavingsEl.textContent = `€${monthlySavings.toFixed(2)}`;
            console.log('Ahorro mensual actualizado:', monthlySavingsEl.textContent);
        } else {
            console.error('Elemento monthly-savings no encontrado');
        }
        
        // Actualizar métricas adicionales del resumen
        this.updateOverviewMetrics();
    }

    updateOverviewMetrics() {
        // Actualizar métricas del resumen principal
        const monthlyBalance = this.financialData.monthlyIncome - this.financialData.monthlyExpenses;
        const dailyAverage = this.financialData.monthlyExpenses / 30;
        const daysRemaining = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate() - new Date().getDate();
        
        // Balance del mes
        const monthlyBalanceEl = document.getElementById('monthly-balance');
        if (monthlyBalanceEl) {
            monthlyBalanceEl.textContent = `€${monthlyBalance.toFixed(2)}`;
        }
        
        // Cambio del balance
        const monthlyBalanceChangeEl = document.getElementById('monthly-balance-change');
        if (monthlyBalanceChangeEl) {
            const changeText = monthlyBalance >= 0 ? `+€${monthlyBalance.toFixed(2)}` : `€${monthlyBalance.toFixed(2)}`;
            monthlyBalanceChangeEl.textContent = changeText;
            monthlyBalanceChangeEl.className = `metric-change ${monthlyBalance >= 0 ? 'positive' : 'negative'}`;
        }
        
        // Gasto promedio diario
        const dailyAverageEl = document.getElementById('daily-average');
        if (dailyAverageEl) {
            dailyAverageEl.textContent = `€${dailyAverage.toFixed(2)}`;
        }
        
        // Días restantes
        const daysRemainingEl = document.getElementById('days-remaining');
        if (daysRemainingEl) {
            daysRemainingEl.textContent = daysRemaining.toString();
        }
        
        // Actualizar resumen de presupuestos
        this.updateBudgetsOverview();
    }

    updateBudgetsOverview() {
        const container = document.getElementById('budgets-overview');
        if (!container) return;
        
        if (this.budgets.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">No hay presupuestos configurados</p>';
            return;
        }
        
        // Mostrar solo los primeros 3 presupuestos en el resumen
        const topBudgets = this.budgets.slice(0, 3);
        
        container.innerHTML = topBudgets.map(budget => {
            const spent = this.transactions
                .filter(t => t.type === 'expense' && t.category === budget.category)
                .reduce((sum, t) => sum + t.amount, 0);
            const percentage = (spent / budget.amount) * 100;
            const status = percentage >= 100 ? 'exceeded' : percentage >= 80 ? 'warning' : 'good';
            
            return `
                <div class="budget-overview-item ${status}">
                    <div class="budget-overview-header">
                        <span class="budget-category">${getCategoryName(budget.category)}</span>
                        <span class="budget-percentage">${percentage.toFixed(0)}%</span>
                    </div>
                    <div class="budget-overview-bar">
                        <div class="budget-overview-fill" style="width: ${Math.min(percentage, 100)}%"></div>
                    </div>
                    <div class="budget-overview-amount">
                        €${spent.toFixed(0)} / €${budget.amount.toFixed(0)}
                    </div>
                </div>
            `;
        }).join('');
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
                        ${transaction.type === 'income' ? '+' : '-'}€${transaction.amount.toFixed(2)}
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
                        €${spent.toFixed(2)} de €${budget.amount.toFixed(2)}
                    </div>
                </div>
            `;
        }).join('');
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
                        €${goal.currentAmount.toFixed(2)} de €${goal.targetAmount.toFixed(2)}
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
                icon: '',
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
                    icon: '',
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
        const modal = document.getElementById('transaction-modal');
        modal.classList.add('show');
        document.getElementById('transaction-date').value = new Date().toISOString().split('T')[0];
        
        // Cerrar modal al hacer clic fuera
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.hideAddTransaction();
            }
        });
        
        // Cerrar modal con tecla Escape
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                this.hideAddTransaction();
                document.removeEventListener('keydown', handleEscape);
            }
        };
        document.addEventListener('keydown', handleEscape);
    }

    hideAddTransaction() {
        const modal = document.getElementById('transaction-modal');
        modal.classList.remove('show');
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

// Función de debug para probar el modal
function debugModal() {
    console.log('Debug: Probando modal...');
    const modal = document.getElementById('transaction-modal');
    console.log('Modal encontrado:', modal);
    if (modal) {
        console.log('Clases del modal:', modal.className);
        modal.classList.add('show');
        console.log('Clase show agregada');
        console.log('Clases después:', modal.className);
    }
}

// Hacer la función disponible globalmente
window.debugModal = debugModal;

function showAddTransaction() {
    // Asegurar que el dashboardManager esté inicializado
    if (!window.dashboardManager) {
        console.log('DashboardManager no inicializado, inicializando...');
        window.dashboardManager = new DashboardManager();
    }
    
    if (window.dashboardManager) {
        window.dashboardManager.showAddTransaction();
    } else {
        console.error('No se pudo inicializar DashboardManager');
        // Fallback: mostrar modal directamente
        const modal = document.getElementById('transaction-modal');
        if (modal) {
            modal.classList.add('show');
            document.getElementById('transaction-date').value = new Date().toISOString().split('T')[0];
        } else {
            console.error('Modal transaction-modal no encontrado');
        }
    }
}

function hideAddTransaction() {
    if (window.dashboardManager) {
        window.dashboardManager.hideAddTransaction();
    } else {
        // Fallback: ocultar modal directamente
        const modal = document.getElementById('transaction-modal');
        if (modal) {
            modal.classList.remove('show');
            const form = document.getElementById('transaction-form');
            if (form) {
                form.reset();
            }
        }
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

// Funciones adicionales para las nuevas funcionalidades
function exportTransactions() {
    if (!window.dashboardManager) return;
    
    const transactions = window.dashboardManager.transactions;
    const csvContent = [
        ['Fecha', 'Descripción', 'Tipo', 'Categoría', 'Monto'].join(','),
        ...transactions.map(t => [
            t.date,
            `"${t.description}"`,
            t.type,
            t.category,
            t.amount
        ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transacciones-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
}

function exportAnalytics() {
    console.log('Exportando análisis...');
    // Implementar exportación de análisis
}

function createBudgetTemplate() {
    console.log('Creando plantilla de presupuesto...');
    // Implementar plantillas de presupuesto
}

function createGoalTemplate() {
    console.log('Creando plantilla de objetivo...');
    // Implementar plantillas de objetivos
}

// ========================================
// FUNCIONES DE RENDERIZADO
// ========================================

function renderTransactionsTable() {
    if (!window.dashboardManager) return;
    
    const tbody = document.getElementById('transactions-list');
    if (!tbody) return;

    const transactions = window.dashboardManager.transactions;
    
    if (transactions.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 2rem;">No hay transacciones registradas</td></tr>';
        return;
    }

    tbody.innerHTML = transactions.map(transaction => `
        <tr>
            <td>${new Date(transaction.date).toLocaleDateString()}</td>
            <td>${transaction.description}</td>
            <td>
                <span class="transaction-type ${transaction.type}">
                    ${transaction.type === 'income' ? 'Ingreso' : 'Gasto'}
                </span>
            </td>
            <td>
                <span class="transaction-category">${getCategoryName(transaction.category)}</span>
            </td>
            <td class="${transaction.type === 'income' ? 'positive' : 'negative'}">
                ${transaction.type === 'income' ? '+' : '-'}€${transaction.amount.toFixed(2)}
            </td>
            <td>
                <button class="btn btn-sm btn-outline" onclick="editTransaction('${transaction.id}')">Editar</button>
                <button class="btn btn-sm btn-danger" onclick="deleteTransaction('${transaction.id}')">Eliminar</button>
            </td>
        </tr>
    `).join('');
}

function renderBudgets() {
    if (!window.dashboardManager) return;
    
    const container = document.getElementById('budgets-list');
    if (!container) return;

    const budgets = window.dashboardManager.budgets;
    
    if (budgets.length === 0) {
        container.innerHTML = '<div class="empty-state">No hay presupuestos configurados</div>';
        return;
    }

    container.innerHTML = budgets.map(budget => {
        const percentage = (budget.spent / budget.amount) * 100;
        const status = getBudgetStatus(percentage);
        
        return `
            <div class="budget-card ${status}">
                <div class="budget-header">
                    <h4>${getCategoryName(budget.category)}</h4>
                    <span class="budget-amount">€${budget.amount.toFixed(2)}</span>
                </div>
                <div class="budget-progress">
                    <div class="budget-bar">
                        <div class="budget-progress-bar" style="width: ${Math.min(percentage, 100)}%"></div>
                    </div>
                    <div class="budget-stats">
                        <span>Gastado: €${budget.spent.toFixed(2)}</span>
                        <span>Restante: €${(budget.amount - budget.spent).toFixed(2)}</span>
                    </div>
                </div>
                <div class="budget-actions">
                    <button class="btn btn-sm btn-outline" onclick="editBudget('${budget.id}')">Editar</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteBudget('${budget.id}')">Eliminar</button>
                </div>
            </div>
        `;
    }).join('');
}

function renderAnalyticsCharts() {
    console.log('Renderizando gráficos de análisis...');
    const container = document.querySelector('#analytics-tab .analytics-grid');
    if (!container) return;

    if (!window.dashboardManager) {
        container.innerHTML = '<p>No hay datos disponibles</p>';
        return;
    }

    const transactions = window.dashboardManager.transactions;
    const expenses = transactions.filter(t => t.type === 'expense');
    
    if (expenses.length === 0) {
        container.innerHTML = '<p>No hay datos de gastos para mostrar</p>';
        return;
    }

    container.innerHTML = `
        <div class="analytics-card">
            <h4>Distribución por Categorías</h4>
            <canvas id="categoryChart" width="400" height="200"></canvas>
        </div>
        <div class="analytics-card">
            <h4>Tendencias de Gastos</h4>
            <canvas id="trendsChart" width="400" height="200"></canvas>
        </div>
        <div class="analytics-card">
            <h4>Comparación Mensual</h4>
            <canvas id="monthlyChart" width="400" height="200"></canvas>
        </div>
        <div class="analytics-card">
            <h4>Ingresos vs Gastos</h4>
            <canvas id="incomeExpensesChart" width="400" height="200"></canvas>
        </div>
    `;

    // Crear gráficos después de que se renderice el HTML
    setTimeout(() => {
        // Destruir gráficos existentes si existen
        if (window.categoryChart) window.categoryChart.destroy();
        if (window.trendsChart) window.trendsChart.destroy();
        if (window.monthlyChart) window.monthlyChart.destroy();
        if (window.incomeExpensesChart) window.incomeExpensesChart.destroy();
        
        createCategoryChart(expenses);
        createTrendsChart(transactions);
        createMonthlyChart(transactions);
        createIncomeExpensesChart(transactions);
    }, 100);
}

function renderGoals() {
    if (!window.dashboardManager) return;
    
    const container = document.getElementById('goals-list');
    if (!container) return;

    const goals = window.dashboardManager.goals;
    
    if (goals.length === 0) {
        container.innerHTML = '<div class="empty-state">No hay objetivos configurados</div>';
        return;
    }

    container.innerHTML = goals.map(goal => {
        const percentage = (goal.currentAmount / goal.targetAmount) * 100;
        
        return `
            <div class="goal-card">
                <div class="goal-header">
                    <h4>${goal.name}</h4>
                    <span class="goal-target">€${goal.targetAmount.toFixed(2)}</span>
                </div>
                <div class="goal-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${Math.min(percentage, 100)}%"></div>
                    </div>
                    <div class="goal-stats">
                        <span>Ahorrado: $${goal.currentAmount.toFixed(2)}</span>
                        <span>Faltan: $${(goal.targetAmount - goal.currentAmount).toFixed(2)}</span>
                    </div>
                </div>
                <div class="goal-actions">
                    <button class="btn btn-sm btn-outline" onclick="editGoal('${goal.id}')">Editar</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteGoal('${goal.id}')">Eliminar</button>
                </div>
            </div>
        `;
    }).join('');
}

// ========================================
// FUNCIONES AUXILIARES
// ========================================

function getCategoryName(category) {
    const categories = {
        'alimentacion': 'Alimentación',
        'transporte': 'Transporte',
        'entretenimiento': 'Entretenimiento',
        'salud': 'Salud',
        'vivienda': 'Vivienda',
        'educacion': 'Educación',
        'otros': 'Otros'
    };
    return categories[category] || category;
}

function getBudgetStatus(percentage) {
    if (percentage >= 100) return 'exceeded';
    if (percentage >= 95) return 'critical';
    if (percentage >= 80) return 'warning';
    return 'good';
}

function updateTransactionSummary() {
    if (!window.dashboardManager) return;
    
    const transactions = window.dashboardManager.transactions;
    const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const balance = totalIncome - totalExpenses;
    
    document.getElementById('total-income').textContent = `€${totalIncome.toFixed(2)}`;
    document.getElementById('total-expenses').textContent = `€${totalExpenses.toFixed(2)}`;
    document.getElementById('transaction-balance').textContent = `€${balance.toFixed(2)}`;
    document.getElementById('transaction-count').textContent = transactions.length.toString();
}

function updateBudgetSummary() {
    if (!window.dashboardManager) return;
    
    const budgets = window.dashboardManager.budgets;
    const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0);
    const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
    const totalRemaining = totalBudget - totalSpent;
    const progress = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
    
    document.getElementById('total-budget').textContent = `€${totalBudget.toFixed(2)}`;
    document.getElementById('total-spent').textContent = `€${totalSpent.toFixed(2)}`;
    document.getElementById('total-remaining').textContent = `€${totalRemaining.toFixed(2)}`;
    document.getElementById('budget-progress').textContent = `${progress.toFixed(1)}%`;
}

function updateAnalyticsMetrics() {
    if (!window.dashboardManager) return;
    
    const transactions = window.dashboardManager.transactions;
    const expenses = transactions.filter(t => t.type === 'expense');
    
    // Gasto promedio diario
    const dailyAverage = expenses.length > 0 ? expenses.reduce((sum, t) => sum + t.amount, 0) / 30 : 0;
    document.getElementById('daily-average').textContent = `€${dailyAverage.toFixed(2)}`;
    
    // Categoría más gastada
    const categoryTotals = {};
    expenses.forEach(t => {
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
    });
    const topCategory = Object.keys(categoryTotals).reduce((a, b) => categoryTotals[a] > categoryTotals[b] ? a : b, 'N/A');
    document.getElementById('top-category').textContent = getCategoryName(topCategory);
    
    // Días sin gastos (simplificado)
    const uniqueDays = new Set(expenses.map(t => t.date)).size;
    const noSpendDays = 30 - uniqueDays;
    document.getElementById('no-spend-days').textContent = Math.max(0, noSpendDays);
}

function updateGoalsSummary() {
    if (!window.dashboardManager) return;
    
    const goals = window.dashboardManager.goals;
    const activeGoals = goals.filter(g => g.isActive).length;
    const totalSaved = goals.reduce((sum, g) => sum + g.currentAmount, 0);
    const completedGoals = goals.filter(g => g.currentAmount >= g.targetAmount).length;
    
    document.getElementById('active-goals').textContent = activeGoals;
    document.getElementById('total-saved').textContent = `€${totalSaved.toFixed(2)}`;
    document.getElementById('completed-goals').textContent = completedGoals;
    
    // Progreso general
    const totalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0);
    const overallProgress = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;
    document.getElementById('overall-progress').style.width = `${overallProgress}%`;
    document.getElementById('progress-text').textContent = `${overallProgress.toFixed(1)}% completado`;
}

// ========================================
// FUNCIONES DE GRÁFICOS
// ========================================

function createCategoryChart(expenses) {
    const ctx = document.getElementById('categoryChart');
    if (!ctx) return;

    // Agrupar gastos por categoría
    const categoryTotals = {};
    expenses.forEach(expense => {
        const category = getCategoryName(expense.category);
        categoryTotals[category] = (categoryTotals[category] || 0) + expense.amount;
    });

    // Ordenar por cantidad descendente
    const sortedCategories = Object.entries(categoryTotals)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 6); // Solo mostrar top 6

    const labels = sortedCategories.map(([name]) => name);
    const data = sortedCategories.map(([,amount]) => amount);
    
    // Colores profesionales y consistentes
    const colors = [
        '#007AFF', '#FF3B30', '#34C759', '#FF9500', 
        '#5856D6', '#FF2D92'
    ];

    window.categoryChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Gastos por Categoría',
                data: data,
                backgroundColor: colors.slice(0, labels.length),
                borderColor: colors.slice(0, labels.length),
                borderWidth: 0,
                borderRadius: 8,
                borderSkipped: false,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.9)',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    borderWidth: 1,
                    cornerRadius: 12,
                    padding: 12,
                    titleFont: {
                        size: 14,
                        weight: '600'
                    },
                    bodyFont: {
                        size: 13
                    },
                    callbacks: {
                        title: function(context) {
                            return context[0].label;
                        },
                        label: function(context) {
                            const total = data.reduce((a, b) => a + b, 0);
                            const percentage = ((context.parsed.x / total) * 100).toFixed(1);
                            return `€${context.parsed.x.toFixed(2)} (${percentage}%)`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#86868B',
                        font: {
                            size: 12,
                            weight: '500'
                        },
                        callback: function(value) {
                            return '€' + value.toFixed(0);
                        }
                    }
                },
                y: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#1D1D1F',
                        font: {
                            size: 13,
                            weight: '500'
                        }
                    }
                }
            },
            animation: {
                duration: 1200,
                easing: 'easeOutQuart'
            }
        }
    });
}

function createTrendsChart(transactions) {
    const ctx = document.getElementById('trendsChart');
    if (!ctx) return;

    // Agrupar gastos por día de la semana
    const dayTotals = {
        'Lunes': 0, 'Martes': 0, 'Miércoles': 0, 'Jueves': 0,
        'Viernes': 0, 'Sábado': 0, 'Domingo': 0
    };

    const expenses = transactions.filter(t => t.type === 'expense');
    expenses.forEach(expense => {
        const day = new Date(expense.date).toLocaleDateString('es-ES', { weekday: 'long' });
        if (dayTotals.hasOwnProperty(day)) {
            dayTotals[day] += expense.amount;
        }
    });

    const labels = Object.keys(dayTotals);
    const data = Object.values(dayTotals);

    window.trendsChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Gastos por día',
                data: data,
                backgroundColor: 'rgba(0, 122, 255, 0.8)',
                borderColor: '#007AFF',
                borderWidth: 0,
                borderRadius: 8,
                borderSkipped: false,
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
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    borderWidth: 1,
                    cornerRadius: 8,
                    callbacks: {
                        label: function(context) {
                            return `Gastos: €${context.parsed.y.toFixed(2)}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
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
            }
        }
    });
}

function createMonthlyChart(transactions) {
    const ctx = document.getElementById('monthlyChart');
    if (!ctx) return;

    // Obtener datos de los últimos 6 meses
    const months = [];
    const incomeData = [];
    const expenseData = [];

    for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthName = date.toLocaleDateString('es-ES', { month: 'short' });
        months.push(monthName);

        const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
        const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

        const monthTransactions = transactions.filter(t => {
            const transactionDate = new Date(t.date);
            return transactionDate >= monthStart && transactionDate <= monthEnd;
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

    window.monthlyChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: months,
            datasets: [
                {
                    label: 'Ingresos',
                    data: incomeData,
                    backgroundColor: 'rgba(52, 199, 89, 0.8)',
                    borderColor: '#34C759',
                    borderWidth: 0,
                    borderRadius: 6,
                    borderSkipped: false,
                },
                {
                    label: 'Gastos',
                    data: expenseData,
                    backgroundColor: 'rgba(255, 59, 48, 0.8)',
                    borderColor: '#FF3B30',
                    borderWidth: 0,
                    borderRadius: 6,
                    borderSkipped: false,
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 20
                    }
                },
                tooltip: {
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
                        color: 'rgba(0, 0, 0, 0.1)'
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
            }
        }
    });
}

function createIncomeExpensesChart(transactions) {
    const ctx = document.getElementById('incomeExpensesChart');
    if (!ctx) return;

    // Calcular totales
    const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

    const savings = totalIncome - totalExpenses;

    window.incomeExpensesChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Gastos', 'Ahorros'],
            datasets: [{
                data: [totalExpenses, Math.max(0, savings)],
                backgroundColor: ['#FF3B30', '#34C759'],
                borderWidth: 0,
                hoverBorderWidth: 3,
                hoverBorderColor: '#ffffff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '65%',
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 25,
                        usePointStyle: true,
                        pointStyle: 'circle',
                        font: {
                            size: 13,
                            weight: '500'
                        },
                        color: '#1D1D1F'
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.9)',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    borderWidth: 1,
                    cornerRadius: 12,
                    padding: 12,
                    titleFont: {
                        size: 14,
                        weight: '600'
                    },
                    bodyFont: {
                        size: 13
                    },
                    callbacks: {
                        label: function(context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = total > 0 ? ((context.parsed / total) * 100).toFixed(1) : 0;
                            return `${context.label}: €${context.parsed.toFixed(2)} (${percentage}%)`;
                        }
                    }
                }
            },
            animation: {
                animateRotate: true,
                duration: 1200,
                easing: 'easeOutQuart'
            }
        }
    });
}

// Inicializar dashboard cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    window.dashboardManager = new DashboardManager();
});
