// ========================================
// VEEDOR PROFESSIONAL FINANCE CENTER
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

    initializeTabs() {
        // Ocultar todas las secciones primero
        document.querySelectorAll('.tab-panel').forEach(panel => {
            panel.classList.remove('active');
        });
        
        // Mostrar solo la sección overview
        this.showTab('overview');
    }

    // ========================================
    // CARGA DE DATOS CON PERSISTENCIA
    // ========================================
    loadData() {
        // Intentar cargar datos guardados
        const savedData = this.loadFromStorage();
        
        if (savedData && Object.keys(savedData).length > 0) {
            this.transactions = savedData.transactions || [];
            this.budgets = savedData.budgets || [];
            this.goals = savedData.goals || [];
            this.envelopes = savedData.envelopes || [];
            this.assets = savedData.assets || [];
            this.liabilities = savedData.liabilities || [];
        } else {
            // Cargar datos de demo si no hay datos guardados
            this.loadProfessionalData();
        }
        
        // Generar datos adicionales para nuevas características
        this.generateEnvelopeData();
        this.generateNetWorthData();
        
        // Guardar datos iniciales
        this.saveToStorage();
    }

    generateEnvelopeData() {
        // Generar sobres de demo (Goodbudget style)
        if (!this.envelopes || this.envelopes.length === 0) {
            this.envelopes = [
                { id: 1, name: 'Alimentación', amount: 220.00, budget: 300, color: '#FF6B6B' },
                { id: 2, name: 'Transporte', amount: 75.80, budget: 150, color: '#4ECDC4' },
                { id: 3, name: 'Entretenimiento', amount: 30.99, budget: 100, color: '#45B7D1' },
                { id: 4, name: 'Salud', amount: 25.30, budget: 200, color: '#96CEB4' },
                { id: 5, name: 'Compras', amount: 89.99, budget: 200, color: '#FFEAA7' },
                { id: 6, name: 'Servicios', amount: 85.20, budget: 150, color: '#DDA0DD' },
                { id: 7, name: 'Ahorro', amount: 500.00, budget: 800, color: '#98D8C8' },
                { id: 8, name: 'Emergencias', amount: 200.00, budget: 500, color: '#F7DC6F' }
            ];
        }
    }

    generateNetWorthData() {
        // Generar activos de demo (Personal Capital style)
        if (!this.assets || this.assets.length === 0) {
            this.assets = [
                { id: 1, name: 'Cuenta Corriente', amount: 3200.00, type: 'cash', institution: 'BBVA' },
                { id: 2, name: 'Cuenta Ahorro', amount: 8500.00, type: 'savings', institution: 'Santander' },
                { id: 3, name: 'Inversiones', amount: 12000.00, type: 'investment', institution: 'MyInvestor' },
                { id: 4, name: 'Coche', amount: 15000.00, type: 'property', institution: 'Propio' },
                { id: 5, name: 'Casa', amount: 200000.00, type: 'property', institution: 'Propio' }
            ];
        }

        // Generar pasivos de demo
        if (!this.liabilities || this.liabilities.length === 0) {
            this.liabilities = [
                { id: 1, name: 'Hipoteca', amount: 180000.00, type: 'mortgage', institution: 'BBVA', monthlyPayment: 850.00 },
                { id: 2, name: 'Préstamo Coche', amount: 12000.00, type: 'loan', institution: 'Santander', monthlyPayment: 280.00 },
                { id: 3, name: 'Tarjeta Crédito', amount: 1200.00, type: 'credit', institution: 'BBVA', monthlyPayment: 50.00 }
            ];
        }
    }

    loadProfessionalData() {
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();
        
        // Generar transacciones del último mes
        this.transactions = this.generateTransactionHistory(currentMonth, currentYear);
        
        // Presupuestos inteligentes
        this.budgets = this.categories
            .filter(cat => cat.budget > 0)
            .map(cat => ({
                id: cat.id,
                category: cat.id,
                limit: cat.budget,
                spent: this.calculateCategorySpent(cat.id),
                period: 'monthly',
                alerts: this.calculateBudgetAlerts(cat.id, cat.budget)
            }));
        
        // Objetivos financieros realistas
        this.goals = [
            {
                id: 1,
                name: 'Vacaciones de Verano',
                target: 1500,
                current: 800,
                deadline: '2025-06-01',
                category: 'travel',
                monthlyTarget: 250,
                priority: 'high'
            },
            {
                id: 2,
                name: 'Fondo de Emergencia',
                target: 5000,
                current: 2000,
                deadline: '2025-12-31',
                category: 'emergency',
                monthlyTarget: 500,
                priority: 'critical'
            },
            {
                id: 3,
                name: 'Nuevo Portátil',
                target: 1200,
                current: 450,
                deadline: '2025-03-15',
                category: 'technology',
                monthlyTarget: 250,
                priority: 'medium'
            }
        ];
    }

    generateTransactionHistory(month, year) {
        const transactions = [];
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        // Transacciones recurrentes
        const recurringTransactions = [
            { description: 'Nómina', amount: 2500, category: 'income', day: 1 },
            { description: 'Alquiler', amount: -800, category: 'utilities', day: 5 },
            { description: 'Supermercado Carrefour', amount: -85, category: 'food', day: 8 },
            { description: 'Gasolina Shell', amount: -45, category: 'transport', day: 12 },
            { description: 'Netflix', amount: -13, category: 'entertainment', day: 15 },
            { description: 'Farmacia', amount: -25, category: 'health', day: 18 },
            { description: 'Zara', amount: -68, category: 'shopping', day: 22 },
            { description: 'Freelance', amount: 350, category: 'income', day: 25 }
        ];
        
        recurringTransactions.forEach(transaction => {
            if (transaction.day <= daysInMonth) {
                transactions.push({
                    id: Date.now() + Math.random(),
                    description: transaction.description,
                    amount: transaction.amount,
                    category: transaction.category,
                    date: `${year}-${String(month + 1).padStart(2, '0')}-${String(transaction.day).padStart(2, '0')}`,
                    type: transaction.amount > 0 ? 'income' : 'expense',
                    recurring: true
                });
            }
        });
        
        // Transacciones aleatorias adicionales
        for (let i = 0; i < 15; i++) {
            const randomDay = Math.floor(Math.random() * daysInMonth) + 1;
            const randomCategory = this.categories[Math.floor(Math.random() * 6)]; // Excluir income
            const randomAmount = -(Math.random() * 100 + 10);
            
            transactions.push({
                id: Date.now() + Math.random(),
                description: this.generateRandomDescription(randomCategory.id),
                amount: randomAmount,
                category: randomCategory.id,
                date: `${year}-${String(month + 1).padStart(2, '0')}-${String(randomDay).padStart(2, '0')}`,
                type: 'expense',
                recurring: false
            });
        }
        
        return transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    generateRandomDescription(category) {
        const descriptions = {
            food: ['Mercadona', 'Lidl', 'El Corte Inglés', 'Restaurante', 'Cafetería', 'Delivery'],
            transport: ['Uber', 'Taxi', 'Metro', 'Autobús', 'Parking', 'Peaje'],
            entertainment: ['Cine', 'Teatro', 'Spotify', 'Amazon Prime', 'Gimnasio', 'Concierto'],
            health: ['Farmacia', 'Dentista', 'Médico', 'Óptica', 'Fisioterapia', 'Analítica'],
            shopping: ['H&M', 'Primark', 'Decathlon', 'Fnac', 'IKEA', 'Leroy Merlin'],
            utilities: ['Luz', 'Agua', 'Gas', 'Internet', 'Teléfono', 'Seguro'],
            other: ['Cajero', 'Transferencia', 'Comisión', 'Multa', 'Regalo', 'Donación']
        };
        
        const categoryDescriptions = descriptions[category] || descriptions.other;
        return categoryDescriptions[Math.floor(Math.random() * categoryDescriptions.length)];
    }

    // ========================================
    // EVENT LISTENERS PROFESIONALES
    // ========================================
    setupEventListeners() {
        // Tabs del dashboard
        document.querySelectorAll('.nav-tab').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tabName = e.target.closest('.nav-tab').dataset.tab;
                this.showTab(tabName);
            });
        });

        // Botones de acción
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-action="add-transaction"]')) {
                this.showAddTransactionModal();
            }
            if (e.target.matches('[data-action="add-budget"]')) {
                this.showAddBudgetModal();
            }
            if (e.target.matches('[data-action="add-goal"]')) {
                this.showAddGoalModal();
            }
            if (e.target.matches('[data-action="export-data"]')) {
                this.exportData();
            }
            if (e.target.matches('[data-action="import-data"]')) {
                this.showImportModal();
            }
        });

        // Navegación por URL hash
        window.addEventListener('hashchange', () => {
            const hash = window.location.hash.substring(1);
            if (hash && ['overview', 'transactions', 'budgets', 'goals', 'analytics'].includes(hash)) {
                this.showTab(hash);
            }
        });

        // Filtros avanzados
        this.setupFilters();
        
        // Búsqueda en tiempo real
        this.setupSearch();
        
        // Formularios
        this.setupForms();
    }

    setupFilters() {
        const filterElements = {
            category: document.getElementById('filter-category'),
            type: document.getElementById('filter-type'),
            dateRange: document.getElementById('filter-date-range'),
            amountMin: document.getElementById('filter-amount-min'),
            amountMax: document.getElementById('filter-amount-max')
        };

        Object.entries(filterElements).forEach(([key, element]) => {
            if (element) {
                element.addEventListener('change', () => {
                    this.applyFilters();
                });
            }
        });
    }

    setupSearch() {
        const searchInput = document.getElementById('search-transactions');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filters.search = e.target.value;
                this.applyFilters();
            });
        }
    }

    setupForms() {
        // Formulario de nueva transacción
        document.addEventListener('submit', (e) => {
            if (e.target.id === 'new-transaction-form') {
                e.preventDefault();
                this.addTransaction();
            }
        });
    }

    // ========================================
    // NAVEGACIÓN PROFESIONAL
    // ========================================
    showTab(tabName) {
        this.currentTab = tabName;
        
        // Ocultar todos los tabs
        document.querySelectorAll('.tab-panel').forEach(panel => {
            panel.classList.remove('active');
        });
        
        document.querySelectorAll('.nav-tab').forEach(btn => {
            btn.classList.remove('active');
        });

        // Mostrar tab seleccionado
        const targetPanel = document.getElementById(tabName);
        const targetBtn = document.querySelector(`[data-tab="${tabName}"]`);
        
        if (targetPanel) {
            targetPanel.classList.add('active');
        }
        if (targetBtn) {
            targetBtn.classList.add('active');
        }

        // Actualizar contenido específico del tab
        this.updateTabContent(tabName);
        
        // Actualizar URL sin recargar
        history.pushState(null, null, `#${tabName}`);
        
        // Scroll suave al contenido
        setTimeout(() => {
            const dashboardTabs = document.querySelector('.dashboard-tabs');
            if (dashboardTabs) {
                dashboardTabs.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                });
            }
        }, 100);
    }

    updateTabContent(tabName) {
        switch(tabName) {
            case 'overview':
                this.updateOverview();
                break;
            case 'transactions':
                this.updateTransactions();
                break;
            case 'budgets':
                this.updateBudgets();
                break;
            case 'envelopes':
                this.updateEnvelopes();
                break;
            case 'assets':
                this.updateAssets();
                break;
            case 'goals':
                this.updateGoals();
                break;
            case 'analytics':
                this.updateAnalytics();
                break;
        }
    }

    // ========================================
    // DASHBOARD PRINCIPAL PROFESIONAL
    // ========================================
    updateDashboard() {
        this.updateFinancialSummary();
        this.updateQuickStats();
        this.updateInsightsCenter();
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

    updateQuickStats() {
        const stats = this.calculateQuickStats();
        
        // Transacciones del mes
        const transactionsElement = document.querySelector('.stat-transactions');
        if (transactionsElement) {
            transactionsElement.innerHTML = `
                <span class="stat-number">${stats.transactionsCount}</span>
                <span class="stat-label">Transacciones este mes</span>
            `;
        }

        // Categorías más gastadas
        const topCategoryElement = document.querySelector('.stat-top-category');
        if (topCategoryElement) {
            const topCategory = stats.topCategory;
            topCategoryElement.innerHTML = `
                <span class="stat-number">${topCategory.name}</span>
                <span class="stat-label">€${topCategory.amount.toFixed(2)}</span>
            `;
        }

        // Días restantes del mes
        const daysLeftElement = document.querySelector('.stat-days-left');
        if (daysLeftElement) {
            const daysLeft = stats.daysLeft;
            daysLeftElement.innerHTML = `
                <span class="stat-number">${daysLeft}</span>
                <span class="stat-label">Días restantes</span>
            `;
        }
    }

    updateInsightsCenter() {
        const insights = this.generateInsights();
        const container = document.querySelector('#insights-grid');
        if (!container) return;

        container.innerHTML = insights.map(insight => `
            <div class="insight-card ${insight.type}">
                <div class="insight-header">
                    <div class="insight-title">${insight.title}</div>
                </div>
                <div class="insight-content">
                    <div class="insight-description">${insight.description}</div>
                </div>
                <div class="insight-metrics">
                    <div class="insight-value ${insight.valueType}">${insight.value}</div>
                    ${insight.action ? `<div class="insight-action" onclick="${insight.action}">${insight.actionText}</div>` : ''}
                </div>
            </div>
        `).join('');
    }

    // ========================================
    // TAB OVERVIEW PROFESIONAL
    // ========================================
    updateOverview() {
        this.updateRecentTransactions();
        this.updateBudgetsOverview();
        this.updateGoalsOverview();
        this.updateSpendingChart();
    }

    updateRecentTransactions() {
        const container = document.querySelector('#overview .recent-transactions');
        if (!container) return;

        const recentTransactions = this.transactions
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 8);

        container.innerHTML = recentTransactions.map(transaction => {
            const category = this.categories.find(c => c.id === transaction.category);
            const isPositive = transaction.amount > 0;
            
            return `
                <div class="transaction-item">
                    <div class="transaction-icon" style="background: ${category?.color || '#8B5CF6'}">
                        <div class="category-color" style="background-color: ${category?.color || '#F7DC6F'}; width: 12px; height: 12px; border-radius: 50%;"></div>
                    </div>
                    <div class="transaction-info">
                        <div class="transaction-description">${transaction.description}</div>
                        <div class="transaction-meta">
                            <span class="transaction-category">${category?.name || 'Otros'}</span>
                            <span class="transaction-date">${this.formatDate(transaction.date)}</span>
                        </div>
                    </div>
                    <div class="transaction-amount ${isPositive ? 'positive' : 'negative'}">
                        ${isPositive ? '+' : ''}€${Math.abs(transaction.amount).toFixed(2)}
                    </div>
                </div>
            `;
        }).join('');
    }

    updateBudgetsOverview() {
        const container = document.querySelector('#overview .budgets-overview');
        if (!container) return;

        container.innerHTML = this.budgets.map(budget => {
            const category = this.categories.find(c => c.id === budget.category);
            const percentage = (budget.spent / budget.limit) * 100;
            const remaining = budget.limit - budget.spent;
            const status = percentage > 90 ? 'warning' : percentage > 70 ? 'good' : 'excellent';
            
            return `
                <div class="budget-item">
                    <div class="budget-header">
                        <div class="budget-category">
                            <span class="budget-icon" style="background: ${category?.color || '#8B5CF6'}">
                                <div class="category-color" style="background-color: ${category?.color || '#F7DC6F'}; width: 12px; height: 12px; border-radius: 50%;"></div>
                            </span>
                            <span class="budget-name">${category?.name || budget.category}</span>
                        </div>
                        <div class="budget-status ${status}">${percentage.toFixed(1)}%</div>
                    </div>
                    <div class="budget-progress">
                        <div class="budget-bar">
                            <div class="budget-fill ${status}" style="width: ${Math.min(percentage, 100)}%"></div>
                        </div>
                        <div class="budget-amounts">
                            <span class="budget-spent">€${budget.spent.toFixed(2)}</span>
                            <span class="budget-limit">€${budget.limit.toFixed(2)}</span>
                        </div>
                    </div>
                    <div class="budget-remaining">€${remaining.toFixed(2)} restantes</div>
                </div>
            `;
        }).join('');
    }

    updateGoalsOverview() {
        const container = document.querySelector('#overview .goals-overview');
        if (!container) return;

        container.innerHTML = this.goals.map(goal => {
            const percentage = (goal.current / goal.target) * 100;
            const daysLeft = Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24));
            const monthlyNeeded = (goal.target - goal.current) / Math.max(daysLeft / 30, 1);
            
            return `
                <div class="goal-item">
                    <div class="goal-header">
                        <div class="goal-name">${goal.name}</div>
                        <div class="goal-priority ${goal.priority}">${goal.priority}</div>
                    </div>
                    <div class="goal-progress">
                        <div class="goal-bar">
                            <div class="goal-fill" style="width: ${Math.min(percentage, 100)}%"></div>
                        </div>
                        <div class="goal-percentage">${percentage.toFixed(1)}%</div>
                    </div>
                    <div class="goal-details">
                        <div class="goal-amount">€${goal.current.toFixed(2)} / €${goal.target.toFixed(2)}</div>
                        <div class="goal-deadline">${daysLeft} días restantes</div>
                        <div class="goal-monthly">€${monthlyNeeded.toFixed(2)}/mes</div>
                    </div>
                </div>
            `;
        }).join('');
    }

    updateSpendingChart() {
        const container = document.querySelector('#overview .spending-chart');
        if (!container) return;

        const categoryTotals = this.calculateCategoryTotals();
        const maxAmount = Math.max(...Object.values(categoryTotals));

        container.innerHTML = Object.entries(categoryTotals)
            .filter(([category, amount]) => amount > 0)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5)
            .map(([category, amount]) => {
                const categoryInfo = this.categories.find(c => c.id === category);
                const percentage = (amount / maxAmount) * 100;
                
                return `
                    <div class="chart-item">
                        <div class="chart-info">
                            <span class="chart-category">${categoryInfo?.name || category}</span>
                            <span class="chart-amount">€${amount.toFixed(2)}</span>
                        </div>
                        <div class="chart-bar">
                            <div class="chart-fill" style="width: ${percentage}%; background: ${categoryInfo?.color || '#8B5CF6'};"></div>
                        </div>
                    </div>
                `;
            }).join('');
    }

    // ========================================
    // TAB TRANSACCIONES PROFESIONAL
    // ========================================
    updateTransactions() {
        this.updateTransactionsList();
        this.updateTransactionsSummary();
        this.updateTransactionsFilters();
    }

    updateTransactionsList() {
        const container = document.querySelector('#transactions .transactions-list');
        if (!container) return;

        const filteredTransactions = this.getFilteredTransactions();
        const sortedTransactions = filteredTransactions
            .sort((a, b) => new Date(b.date) - new Date(a.date));

        container.innerHTML = sortedTransactions.map(transaction => {
            const category = this.categories.find(c => c.id === transaction.category);
            const isPositive = transaction.amount > 0;
            
            return `
                <div class="transaction-item">
                    <div class="transaction-icon" style="background: ${category?.color || '#8B5CF6'}">
                        <div class="category-color" style="background-color: ${category?.color || '#F7DC6F'}; width: 12px; height: 12px; border-radius: 50%;"></div>
                    </div>
                    <div class="transaction-info">
                        <div class="transaction-description">${transaction.description}</div>
                        <div class="transaction-meta">
                            <span class="transaction-category">${category?.name || 'Otros'}</span>
                            <span class="transaction-date">${this.formatDate(transaction.date)}</span>
                            ${transaction.recurring ? '<span class="transaction-recurring">🔄</span>' : ''}
                        </div>
                    </div>
                    <div class="transaction-amount ${isPositive ? 'positive' : 'negative'}">
                        ${isPositive ? '+' : ''}€${Math.abs(transaction.amount).toFixed(2)}
                    </div>
                    <div class="transaction-actions">
                        <button class="btn-icon" onclick="veedorFinance.editTransaction('${transaction.id}')" title="Editar">
                            <span class="edit-icon">✏</span>
                        </button>
                        <button class="btn-icon" onclick="veedorFinance.deleteTransaction('${transaction.id}')" title="Eliminar">
                            <span class="delete-icon">🗑</span>
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    updateTransactionsSummary() {
        const filteredTransactions = this.getFilteredTransactions();
        const totals = this.calculateFilteredTotals(filteredTransactions);
        
        const summaryElement = document.querySelector('#transactions .transactions-summary');
        if (summaryElement) {
            summaryElement.innerHTML = `
                <div class="summary-item">
                    <span class="summary-label">Total Ingresos:</span>
                    <span class="summary-value positive">€${totals.income.toFixed(2)}</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">Total Gastos:</span>
                    <span class="summary-value negative">€${totals.expenses.toFixed(2)}</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">Balance:</span>
                    <span class="summary-value ${totals.balance > 0 ? 'positive' : 'negative'}">€${totals.balance.toFixed(2)}</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">Transacciones:</span>
                    <span class="summary-value">${filteredTransactions.length}</span>
                </div>
            `;
        }
    }

    updateTransactionsFilters() {
        const container = document.querySelector('#transactions .transactions-filters');
        if (!container) return;

        container.innerHTML = `
            <div class="filters-compact">
                <div class="filters-main">
                    <select id="filter-category" class="filter-select-compact">
                        <option value="">Todas las categorías</option>
                        ${this.categories.map(cat => 
                            `<option value="${cat.id}">${cat.name}</option>`
                        ).join('')}
                    </select>
                    <select id="filter-type" class="filter-select-compact">
                        <option value="">Todos los tipos</option>
                        <option value="income">Ingresos</option>
                        <option value="expense">Gastos</option>
                    </select>
                    <select id="filter-date-range" class="filter-select-compact">
                        <option value="">Todos los períodos</option>
                        <option value="today">Hoy</option>
                        <option value="week">Esta semana</option>
                        <option value="month">Este mes</option>
                        <option value="quarter">Este trimestre</option>
                        <option value="year">Este año</option>
                    </select>
                    <input type="text" id="search-transactions" class="filter-input-compact" placeholder="Buscar...">
                </div>
                <div class="filters-actions">
                    <button class="btn-compact btn-secondary" onclick="veedorFinance.clearFilters()">Limpiar</button>
                    <button class="btn-compact btn-primary" onclick="veedorFinance.exportTransactions()">Exportar</button>
                </div>
            </div>
        `;
        
        this.setupFilters();
        this.setupSearch();
    }

    // ========================================
    // TAB PRESUPUESTOS PROFESIONAL
    // ========================================
    updateBudgets() {
        this.updateBudgetsList();
        this.updateBudgetsSummary();
        this.updateBudgetAlerts();
    }

    updateBudgetsList() {
        const container = document.querySelector('#budgets .budgets-grid');
        if (!container) return;

        container.innerHTML = this.budgets.map(budget => {
            const category = this.categories.find(c => c.id === budget.category);
            const percentage = (budget.spent / budget.limit) * 100;
            const remaining = budget.limit - budget.spent;
            const status = percentage > 90 ? 'warning' : percentage > 70 ? 'good' : 'excellent';
            
            return `
                <div class="budget-card">
                    <div class="budget-header">
                        <div class="budget-category">
                            <span class="budget-icon" style="background: ${category?.color || '#8B5CF6'}">
                                <div class="category-color" style="background-color: ${category?.color || '#F7DC6F'}; width: 12px; height: 12px; border-radius: 50%;"></div>
                            </span>
                            <span class="budget-name">${category?.name || budget.category}</span>
                        </div>
                        <div class="budget-status ${status}">${percentage.toFixed(1)}%</div>
                    </div>
                    <div class="budget-progress">
                        <div class="budget-bar">
                            <div class="budget-fill ${status}" style="width: ${Math.min(percentage, 100)}%"></div>
                        </div>
                        <div class="budget-amounts">
                            <span class="budget-spent">€${budget.spent.toFixed(2)}</span>
                            <span class="budget-limit">€${budget.limit.toFixed(2)}</span>
                        </div>
                    </div>
                    <div class="budget-details">
                        <div class="budget-remaining">€${remaining.toFixed(2)} restantes</div>
                        <div class="budget-daily">€${(remaining / this.getDaysLeftInMonth()).toFixed(2)}/día</div>
                    </div>
                    <div class="budget-actions">
                        <button class="btn btn-sm btn-outline" onclick="veedorFinance.editBudget('${budget.id}')">Editar</button>
                        <button class="btn btn-sm btn-primary" onclick="veedorFinance.addToBudget('${budget.id}')">Añadir</button>
                    </div>
                </div>
            `;
        }).join('');
    }

    updateBudgetsSummary() {
        const totals = this.calculateBudgetTotals();
        const summaryElement = document.querySelector('#budgets .budgets-summary');
        if (summaryElement) {
            summaryElement.innerHTML = `
                <div class="summary-item">
                    <span class="summary-label">Presupuesto Total:</span>
                    <span class="summary-value">€${totals.totalBudget.toFixed(2)}</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">Gastado:</span>
                    <span class="summary-value negative">€${totals.totalSpent.toFixed(2)}</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">Restante:</span>
                    <span class="summary-value positive">€${totals.totalRemaining.toFixed(2)}</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">Progreso:</span>
                    <span class="summary-value">${totals.progress.toFixed(1)}%</span>
                </div>
            `;
        }
    }

    updateBudgetAlerts() {
        const alerts = this.generateBudgetAlerts();
        const container = document.querySelector('#budgets .budget-alerts');
        if (!container) return;

        container.innerHTML = alerts.map(alert => `
            <div class="alert-item ${alert.type}">
                <div class="alert-icon">${alert.icon}</div>
                <div class="alert-content">
                    <div class="alert-title">${alert.title}</div>
                    <div class="alert-message">${alert.message}</div>
                </div>
            </div>
        `).join('');
    }

    // ========================================
    // TAB OBJETIVOS PROFESIONAL
    // ========================================
    updateGoals() {
        this.updateGoalsList();
        this.updateGoalsSummary();
        this.updateGoalsProgress();
    }

    updateGoalsList() {
        const container = document.querySelector('#goals .goals-grid');
        if (!container) return;

        container.innerHTML = this.goals.map(goal => {
            const percentage = (goal.current / goal.target) * 100;
            const daysLeft = Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24));
            const monthlyNeeded = (goal.target - goal.current) / Math.max(daysLeft / 30, 1);
            
            return `
                <div class="goal-card">
                    <div class="goal-header">
                        <div class="goal-name">${goal.name}</div>
                        <div class="goal-priority ${goal.priority}">${goal.priority}</div>
                    </div>
                    <div class="goal-progress">
                        <div class="goal-bar">
                            <div class="goal-fill" style="width: ${Math.min(percentage, 100)}%"></div>
                        </div>
                        <div class="goal-percentage">${percentage.toFixed(1)}%</div>
                    </div>
                    <div class="goal-details">
                        <div class="goal-amount">€${goal.current.toFixed(2)} / €${goal.target.toFixed(2)}</div>
                        <div class="goal-deadline">${daysLeft} días restantes</div>
                        <div class="goal-monthly">€${monthlyNeeded.toFixed(2)}/mes necesarios</div>
                    </div>
                    <div class="goal-actions">
                        <button class="btn btn-sm btn-outline" onclick="veedorFinance.editGoal('${goal.id}')">Editar</button>
                        <button class="btn btn-sm btn-primary" onclick="veedorFinance.addToGoal('${goal.id}')">Añadir</button>
                    </div>
                </div>
            `;
        }).join('');
    }

    updateGoalsSummary() {
        const totals = this.calculateGoalTotals();
        const summaryElement = document.querySelector('#goals .goals-summary');
        if (summaryElement) {
            summaryElement.innerHTML = `
                <div class="summary-item">
                    <span class="summary-label">Objetivos Activos:</span>
                    <span class="summary-value">${totals.activeGoals}</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">Total Ahorrado:</span>
                    <span class="summary-value positive">€${totals.totalSaved.toFixed(2)}</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">Objetivos Completados:</span>
                    <span class="summary-value">${totals.completedGoals}</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">Progreso Promedio:</span>
                    <span class="summary-value">${totals.averageProgress.toFixed(1)}%</span>
                </div>
            `;
        }
    }

    updateGoalsProgress() {
        const overallProgress = this.calculateOverallGoalsProgress();
        const container = document.querySelector('#goals .goals-progress');
        if (container) {
            container.innerHTML = `
                <div class="progress-header">
                    <h4>Progreso General</h4>
                    <span class="progress-percentage">${overallProgress.toFixed(1)}%</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${overallProgress}%"></div>
                </div>
                <div class="progress-details">
                    <span class="progress-text">${overallProgress.toFixed(1)}% completado de todos los objetivos</span>
                </div>
            `;
        }
    }

    // ========================================
    // TAB ANÁLISIS PROFESIONAL
    // ========================================
    updateAnalytics() {
        this.updateAnalyticsCharts();
        this.updateAnalyticsInsights();
        this.updateAnalyticsTrends();
    }

    updateAnalyticsCharts() {
        this.updateCategoryChart();
        this.updateTrendsChart();
        this.updateComparisonChart();
    }

    updateCategoryChart() {
        const container = document.querySelector('#analytics .category-chart');
        if (!container) return;

        const categoryTotals = this.calculateCategoryTotals();
        const maxAmount = Math.max(...Object.values(categoryTotals));

        container.innerHTML = Object.entries(categoryTotals)
            .filter(([category, amount]) => amount > 0)
            .sort(([,a], [,b]) => b - a)
            .map(([category, amount]) => {
                const categoryInfo = this.categories.find(c => c.id === category);
                const percentage = (amount / maxAmount) * 100;
                
                return `
                    <div class="chart-item">
                        <div class="chart-info">
                            <span class="chart-category">${categoryInfo?.name || category}</span>
                            <span class="chart-amount">€${amount.toFixed(2)}</span>
                            <span class="chart-percentage">${percentage.toFixed(1)}%</span>
                        </div>
                        <div class="chart-bar">
                            <div class="chart-fill" style="width: ${percentage}%; background: ${categoryInfo?.color || '#8B5CF6'};"></div>
                        </div>
                    </div>
                `;
            }).join('');
    }

    updateTrendsChart() {
        const container = document.querySelector('#analytics .trends-chart');
        if (!container) return;

        const trends = this.calculateTrends();
        
        container.innerHTML = `
            <div class="trends-grid">
                <div class="trend-item">
                    <div class="trend-icon">↗</div>
                    <div class="trend-content">
                        <div class="trend-label">Ingresos</div>
                        <div class="trend-value ${trends.income > 0 ? 'positive' : 'negative'}">
                            ${trends.income > 0 ? '+' : ''}${trends.income.toFixed(1)}%
                        </div>
                    </div>
                </div>
                <div class="trend-item">
                    <div class="trend-icon">📉</div>
                    <div class="trend-content">
                        <div class="trend-label">Gastos</div>
                        <div class="trend-value ${trends.expenses < 0 ? 'positive' : 'negative'}">
                            ${trends.expenses > 0 ? '+' : ''}${trends.expenses.toFixed(1)}%
                        </div>
                    </div>
                </div>
                <div class="trend-item">
                    <div class="trend-icon">€</div>
                    <div class="trend-content">
                        <div class="trend-label">Ahorro</div>
                        <div class="trend-value ${trends.savings > 0 ? 'positive' : 'negative'}">
                            ${trends.savings > 0 ? '+' : ''}${trends.savings.toFixed(1)}%
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    updateComparisonChart() {
        const container = document.querySelector('#analytics .comparison-chart');
        if (!container) return;

        const comparison = this.calculateMonthlyComparison();
        
        container.innerHTML = `
            <div class="comparison-grid">
                <div class="comparison-item">
                    <div class="comparison-label">Mes Anterior</div>
                    <div class="comparison-bars">
                        <div class="comparison-bar previous">
                            <div class="bar-fill" style="height: 70%; background: #4A2D1F;"></div>
                            <span class="bar-value">€${comparison.previous.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
                <div class="comparison-item">
                    <div class="comparison-label">Mes Actual</div>
                    <div class="comparison-bars">
                        <div class="comparison-bar current">
                            <div class="bar-fill" style="height: 80%; background: #2D4A2D;"></div>
                            <span class="bar-value">€${comparison.current.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
                <div class="comparison-item">
                    <div class="comparison-label">Diferencia</div>
                    <div class="comparison-change ${comparison.difference > 0 ? 'positive' : 'negative'}">
                        ${comparison.difference > 0 ? '+' : ''}€${comparison.difference.toFixed(2)}
                    </div>
                </div>
            </div>
        `;
    }

    updateAnalyticsInsights() {
        const insights = this.generateAnalyticsInsights();
        const container = document.querySelector('#analytics .analytics-insights');
        if (!container) return;

        container.innerHTML = insights.map(insight => `
            <div class="insight-item ${insight.type}">
                <div class="insight-icon">${insight.icon}</div>
                <div class="insight-content">
                    <div class="insight-title">${insight.title}</div>
                    <div class="insight-description">${insight.description}</div>
                </div>
            </div>
        `).join('');
    }

    updateAnalyticsTrends() {
        const trends = this.calculateDetailedTrends();
        const totals = this.calculateTotals();
        const container = document.querySelector('#analytics .analytics-trends');
        if (!container) return;

        container.innerHTML = `
            <div class="trends-summary">
                <div class="trend-summary-item">
                    <span class="trend-label">Transacciones Este Mes</span>
                    <span class="trend-value">${this.transactions.length}</span>
                </div>
                <div class="trend-summary-item">
                    <span class="trend-label">Días Restantes</span>
                    <span class="trend-value">${trends.daysRemaining}</span>
                </div>
                <div class="trend-summary-item">
                    <span class="trend-label">Gasto Promedio Diario</span>
                    <span class="trend-value">€${trends.dailyAverage.toFixed(2)}</span>
                </div>
                <div class="trend-summary-item">
                    <span class="trend-label">Categoría Principal</span>
                    <span class="trend-value">${trends.mostVariableCategory}</span>
                </div>
            </div>
        `;
    }

    // ========================================
    // CÁLCULOS PROFESIONALES
    // ========================================
    calculateTotals() {
        const income = this.transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
        
        const expenses = Math.abs(this.transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0));
        
        const balance = income - expenses;
        
        return { income, expenses, balance };
    }

    calculateTrends() {
        // Simulación de tendencias basadas en datos actuales
        const totals = this.calculateTotals();
        const savingsRate = totals.balance / totals.income * 100;
        
        return {
            income: 8.5, // Simulado
            expenses: -3.2, // Simulado
            savings: savingsRate,
            balance: 12.3 // Simulado
        };
    }

    calculateQuickStats() {
        const totals = this.calculateTotals();
        const categoryTotals = this.calculateCategoryTotals();
        const topCategory = Object.entries(categoryTotals)
            .sort(([,a], [,b]) => b - a)[0];
        
        return {
            transactionsCount: this.transactions.length,
            topCategory: {
                name: this.categories.find(c => c.id === topCategory[0])?.name || 'Otros',
                amount: topCategory[1]
            },
            daysLeft: this.getDaysLeftInMonth()
        };
    }

    calculateCategoryTotals() {
        const totals = {};
        
        this.transactions.forEach(transaction => {
            if (transaction.type === 'expense') {
                totals[transaction.category] = (totals[transaction.category] || 0) + Math.abs(transaction.amount);
            }
        });
        
        return totals;
    }

    calculateCategorySpent(categoryId) {
        return this.transactions
            .filter(t => t.category === categoryId && t.type === 'expense')
            .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    }

    calculateBudgetTotals() {
        const totalBudget = this.budgets.reduce((sum, b) => sum + b.limit, 0);
        const totalSpent = this.budgets.reduce((sum, b) => sum + b.spent, 0);
        const totalRemaining = totalBudget - totalSpent;
        const progress = (totalSpent / totalBudget) * 100;
        
        return { totalBudget, totalSpent, totalRemaining, progress };
    }

    calculateGoalTotals() {
        const activeGoals = this.goals.length;
        const totalSaved = this.goals.reduce((sum, g) => sum + g.current, 0);
        const completedGoals = this.goals.filter(g => g.current >= g.target).length;
        const averageProgress = this.goals.reduce((sum, g) => sum + (g.current / g.target), 0) / this.goals.length * 100;
        
        return { activeGoals, totalSaved, completedGoals, averageProgress };
    }

    calculateOverallGoalsProgress() {
        const totalProgress = this.goals.reduce((sum, goal) => {
            return sum + (goal.current / goal.target);
        }, 0);
        
        return (totalProgress / this.goals.length) * 100;
    }

    calculateMonthlyComparison() {
        // Simulación de comparación mensual
        const current = this.calculateTotals().expenses;
        const previous = current * 0.85; // Simulado
        const difference = current - previous;
        
        return { current, previous, difference };
    }

    calculateDetailedTrends() {
        const dailyAverage = this.calculateTotals().expenses / this.getDaysLeftInMonth();
        const highSpendingDays = Math.floor(Math.random() * 5) + 3; // Simulado
        const mostVariableCategory = 'Servicios'; // Simulado
        const daysRemaining = this.getDaysLeftInMonth();
        
        return { dailyAverage, highSpendingDays, mostVariableCategory, daysRemaining };
    }

    getDaysLeftInMonth() {
        const today = new Date();
        const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        return lastDay.getDate() - today.getDate();
    }

    // ========================================
    // FILTROS Y BÚSQUEDA
    // ========================================
    getFilteredTransactions() {
        let filtered = [...this.transactions];
        
        // Filtro por categoría
        if (this.filters.category) {
            filtered = filtered.filter(t => t.category === this.filters.category);
        }
        
        // Filtro por tipo
        if (this.filters.type) {
            filtered = filtered.filter(t => t.type === this.filters.type);
        }
        
        // Filtro por rango de fechas
        if (this.filters.dateRange) {
            filtered = this.filterByDateRange(filtered, this.filters.dateRange);
        }
        
        // Filtro por rango de montos
        if (this.filters.amountRange.min || this.filters.amountRange.max) {
            filtered = filtered.filter(t => {
                const amount = Math.abs(t.amount);
                const min = this.filters.amountRange.min ? parseFloat(this.filters.amountRange.min) : 0;
                const max = this.filters.amountRange.max ? parseFloat(this.filters.amountRange.max) : Infinity;
                return amount >= min && amount <= max;
            });
        }
        
        // Filtro por búsqueda
        if (this.filters.search) {
            const searchTerm = this.filters.search.toLowerCase();
            filtered = filtered.filter(t => 
                t.description.toLowerCase().includes(searchTerm) ||
                this.categories.find(c => c.id === t.category)?.name.toLowerCase().includes(searchTerm)
            );
        }
        
        return filtered;
    }

    filterByDateRange(transactions, range) {
        const today = new Date();
        const startDate = new Date();
        
        switch(range) {
            case 'today':
                startDate.setHours(0, 0, 0, 0);
                break;
            case 'week':
                startDate.setDate(today.getDate() - 7);
                break;
            case 'month':
                startDate.setMonth(today.getMonth() - 1);
                break;
            case 'quarter':
                startDate.setMonth(today.getMonth() - 3);
                break;
            case 'year':
                startDate.setFullYear(today.getFullYear() - 1);
                break;
        }
        
        return transactions.filter(t => new Date(t.date) >= startDate);
    }

    calculateFilteredTotals(transactions) {
        const income = transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
        
        const expenses = Math.abs(transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0));
        
        const balance = income - expenses;
        
        return { income, expenses, balance };
    }

    applyFilters() {
        this.updateTransactions();
    }

    clearFilters() {
        this.filters = {
            category: '',
            type: '',
            dateRange: '',
            amountRange: { min: '', max: '' },
            search: ''
        };
        
        // Limpiar inputs
        document.querySelectorAll('.filter-select, .filter-input').forEach(input => {
            input.value = '';
        });
        
        this.updateTransactions();
    }

    // ========================================
    // NOTIFICACIONES INTELIGENTES
    // ========================================
    generateInsights() {
        const insights = [];
        const totals = this.calculateTotals();
        const categoryTotals = this.calculateCategoryTotals();
        
        // Insight sobre balance mensual
        if (totals.balance > 0) {
            insights.push({
                type: 'success',
                title: 'Excelente Mes Financiero',
                description: 'Has logrado un balance positivo este mes. ¡Sigue así!',
                value: `€${totals.balance.toFixed(2)}`,
                valueType: 'positive',
                action: 'showTab("analytics")',
                actionText: 'Ver análisis'
            });
        }
        
        // Insight sobre tasa de ahorro
        const savingsRate = (totals.balance / totals.income) * 100;
        if (savingsRate > 20) {
            insights.push({
                type: 'success',
                title: 'Tasa de Ahorro Excelente',
                description: 'Estás ahorrando más del 20% de tus ingresos. ¡Excelente disciplina financiera!',
                value: `${savingsRate.toFixed(1)}%`,
                valueType: 'positive',
                action: 'showTab("goals")',
                actionText: 'Ver objetivos'
            });
        } else if (savingsRate < 10) {
            insights.push({
                type: 'warning',
                title: 'Tasa de Ahorro Baja',
                description: 'Considera reducir gastos o aumentar ingresos para mejorar tu tasa de ahorro.',
                value: `${savingsRate.toFixed(1)}%`,
                valueType: 'negative',
                action: 'showTab("budgets")',
                actionText: 'Revisar presupuestos'
            });
        }
        
        // Insight sobre categoría principal de gastos
        const topCategory = Object.entries(categoryTotals)
            .sort(([,a], [,b]) => b - a)[0];
        
        if (topCategory) {
            const categoryName = this.categories.find(c => c.id === topCategory[0])?.name || 'Otros';
            const percentage = (topCategory[1] / totals.expenses) * 100;
            
            insights.push({
                type: 'info',
                title: 'Categoría Principal',
                description: `${categoryName} representa el ${percentage.toFixed(1)}% de tus gastos totales.`,
                value: `€${topCategory[1].toFixed(2)}`,
                valueType: 'neutral',
                action: 'showTab("analytics")',
                actionText: 'Ver detalles'
            });
        }
        
        // Insight sobre presupuestos
        const budgetAlerts = this.budgets.filter(b => (b.spent / b.limit) > 0.8);
        if (budgetAlerts.length > 0) {
            const criticalBudget = budgetAlerts.find(b => (b.spent / b.limit) > 0.9);
            if (criticalBudget) {
                const categoryName = this.categories.find(c => c.id === criticalBudget.category)?.name || 'Otros';
                insights.push({
                    type: 'critical',
                    title: 'Presupuesto Crítico',
                    description: `El presupuesto de ${categoryName} está al ${((criticalBudget.spent / criticalBudget.limit) * 100).toFixed(1)}% de su límite.`,
                    value: `${((criticalBudget.spent / criticalBudget.limit) * 100).toFixed(1)}%`,
                    valueType: 'negative',
                    action: 'showTab("budgets")',
                    actionText: 'Gestionar'
                });
            }
        }
        
        // Insight sobre objetivos
        const activeGoals = this.goals.filter(g => g.current < g.target);
        if (activeGoals.length > 0) {
            const closestGoal = activeGoals.reduce((closest, goal) => {
                const closestProgress = closest.current / closest.target;
                const goalProgress = goal.current / goal.target;
                return goalProgress > closestProgress ? goal : closest;
            });
            
            const progress = (closestGoal.current / closestGoal.target) * 100;
            insights.push({
                type: 'info',
                title: 'Objetivo Más Cercano',
                description: `"${closestGoal.name}" está al ${progress.toFixed(1)}% de completarse.`,
                value: `${progress.toFixed(1)}%`,
                valueType: progress > 80 ? 'positive' : 'neutral',
                action: 'showTab("goals")',
                actionText: 'Ver progreso'
            });
        }
        
        // Insight sobre tendencias
        const trends = this.calculateTrends();
        if (trends.income > 5) {
            insights.push({
                type: 'success',
                title: 'Crecimiento de Ingresos',
                description: 'Tus ingresos han aumentado significativamente este mes.',
                value: `+${trends.income.toFixed(1)}%`,
                valueType: 'positive',
                action: 'showTab("analytics")',
                actionText: 'Ver tendencias'
            });
        }
        
        return insights.slice(0, 6); // Máximo 6 insights
    }

    updateNetWorth() {
        const totalAssets = this.assets.reduce((sum, asset) => sum + asset.amount, 0);
        const totalLiabilities = this.liabilities.reduce((sum, liability) => sum + liability.amount, 0);
        const netWorth = totalAssets - totalLiabilities;
        
        // Actualizar valores en el DOM
        const netWorthValue = document.getElementById('net-worth-value');
        const totalAssetsEl = document.getElementById('total-assets');
        const totalLiabilitiesEl = document.getElementById('total-liabilities');
        
        if (netWorthValue) {
            netWorthValue.textContent = `€${netWorth.toLocaleString('es-ES', { minimumFractionDigits: 2 })}`;
        }
        
        if (totalAssetsEl) {
            totalAssetsEl.textContent = `€${totalAssets.toLocaleString('es-ES', { minimumFractionDigits: 2 })}`;
        }
        
        if (totalLiabilitiesEl) {
            totalLiabilitiesEl.textContent = `€${totalLiabilities.toLocaleString('es-ES', { minimumFractionDigits: 2 })}`;
        }
    }

    updateEnvelopes() {
        const container = document.querySelector('.envelope-grid');
        if (!container) return;

        container.innerHTML = this.envelopes.map(envelope => {
            const percentage = (envelope.amount / envelope.budget) * 100;
            const status = percentage > 90 ? 'critical' : percentage > 75 ? 'warning' : 'success';
            const statusText = percentage > 90 ? 'Crítico' : percentage > 75 ? 'Atención' : 'Bien';
            
            return `
                <div class="envelope-card">
                    <div class="envelope-header">
                        <div class="envelope-name">${envelope.name}</div>
                        <div class="envelope-color" style="background-color: ${envelope.color}; width: 20px; height: 20px; border-radius: 50%;"></div>
                    </div>
                    <div class="envelope-amount">€${envelope.amount.toFixed(2)}</div>
                    <div class="envelope-progress">
                        <div class="envelope-progress-bar ${status}" style="width: ${Math.min(percentage, 100)}%"></div>
                    </div>
                    <div class="envelope-status">${statusText} - €${envelope.budget.toFixed(2)} presupuesto</div>
                    <div class="envelope-actions">
                        <button class="envelope-btn" onclick="addToEnvelope(${envelope.id})">+ Añadir</button>
                        <button class="envelope-btn" onclick="removeFromEnvelope(${envelope.id})">- Quitar</button>
                    </div>
                </div>
            `;
        }).join('');
    }

    generateBudgetAlerts() {
        const alerts = [];
        
        this.budgets.forEach(budget => {
            const percentage = (budget.spent / budget.limit) * 100;
            const category = this.categories.find(c => c.id === budget.category);
            
            if (percentage > 90) {
                alerts.push({
                    type: 'warning',
                    icon: '⚠',
                    title: `${category?.name} - Presupuesto Agotado`,
                    message: `Has gastado el ${percentage.toFixed(1)}% de tu presupuesto`
                });
            } else if (percentage > 70) {
                alerts.push({
                    type: 'info',
                    icon: 'ℹ',
                    title: `${category?.name} - Cerca del Límite`,
                    message: `Has gastado el ${percentage.toFixed(1)}% de tu presupuesto`
                });
            }
        });
        
        return alerts;
    }

    generateAnalyticsInsights() {
        const insights = [];
        const totals = this.calculateTotals();
        const categoryTotals = this.calculateCategoryTotals();
        
        // Insight sobre gastos
        const topCategory = Object.entries(categoryTotals)
            .sort(([,a], [,b]) => b - a)[0];
        
        if (topCategory) {
            insights.push({
                type: 'info',
                title: 'Categoría Principal',
                description: `${this.categories.find(c => c.id === topCategory[0])?.name} representa el ${((topCategory[1] / totals.expenses) * 100).toFixed(1)}% de tus gastos`
            });
        }
        
        // Insight sobre ahorro
        const savingsRate = (totals.balance / totals.income) * 100;
        if (savingsRate > 20) {
            insights.push({
                type: 'success',
                icon: '🎉',
                title: 'Excelente Tasa de Ahorro',
                description: `Estás ahorrando el ${savingsRate.toFixed(1)}% de tus ingresos`
            });
        }
        
        // Insight sobre tendencias
        insights.push({
            type: 'info',
            title: 'Tendencia Positiva',
            description: 'Tus ingresos han aumentado un 8.5% este mes'
        });
        
        return insights;
    }

    // ========================================
    // MODALES PROFESIONALES
    // ========================================
    showAddTransactionModal() {
        const modal = this.createModal('Nueva Transacción', this.getTransactionFormHTML());
        document.body.appendChild(modal);
        
        // Event listener para el formulario
        modal.querySelector('#new-transaction-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addTransaction();
            modal.remove();
        });
    }

    showAddBudgetModal() {
        const modal = this.createModal('Nuevo Presupuesto', this.getBudgetFormHTML());
        document.body.appendChild(modal);
        
        modal.querySelector('#new-budget-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addBudget();
            modal.remove();
        });
    }

    showAddGoalModal() {
        const modal = this.createModal('Nuevo Objetivo', this.getGoalFormHTML());
        document.body.appendChild(modal);
        
        modal.querySelector('#new-goal-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addGoal();
            modal.remove();
        });
    }

    createModal(title, content) {
        const modal = document.createElement('div');
        modal.className = 'modal show';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>${title}</h2>
                    <button class="close-btn" onclick="this.closest('.modal').remove()">&times;</button>
                </div>
                <div class="modal-body">
                    ${content}
                </div>
            </div>
        `;
        return modal;
    }

    getTransactionFormHTML() {
        return `
            <form id="new-transaction-form" class="modal-form">
                <div class="form-group">
                    <label>Tipo</label>
                    <select id="transaction-type" required>
                        <option value="expense">Gasto</option>
                        <option value="income">Ingreso</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Descripción</label>
                    <input type="text" id="transaction-description" placeholder="Ej: Supermercado" required>
                </div>
                <div class="form-group">
                    <label>Monto</label>
                    <input type="number" id="transaction-amount" step="0.01" placeholder="0.00" required>
                </div>
                <div class="form-group">
                    <label>Categoría</label>
                    <select id="transaction-category" required>
                        ${this.categories.map(cat => 
                            `<option value="${cat.id}">${cat.name}</option>`
                        ).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label>Fecha</label>
                    <input type="date" id="transaction-date" value="${new Date().toISOString().split('T')[0]}" required>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="this.closest('.modal').remove()">Cancelar</button>
                    <button type="submit" class="btn btn-primary">Guardar</button>
                </div>
            </form>
        `;
    }

    getBudgetFormHTML() {
        return `
            <form id="new-budget-form" class="modal-form">
                <div class="form-group">
                    <label>Categoría</label>
                    <select id="budget-category" required>
                        ${this.categories.filter(c => c.budget > 0).map(cat => 
                            `<option value="${cat.id}">${cat.name}</option>`
                        ).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label>Límite Mensual</label>
                    <input type="number" id="budget-limit" step="0.01" placeholder="0.00" required>
                </div>
                <div class="form-group">
                    <label>Período</label>
                    <select id="budget-period" required>
                        <option value="monthly">Mensual</option>
                        <option value="weekly">Semanal</option>
                        <option value="yearly">Anual</option>
                    </select>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="this.closest('.modal').remove()">Cancelar</button>
                    <button type="submit" class="btn btn-primary">Crear</button>
                </div>
            </form>
        `;
    }

    getGoalFormHTML() {
        return `
            <form id="new-goal-form" class="modal-form">
                <div class="form-group">
                    <label>Nombre del Objetivo</label>
                    <input type="text" id="goal-name" placeholder="Ej: Vacaciones" required>
                </div>
                <div class="form-group">
                    <label>Monto Objetivo</label>
                    <input type="number" id="goal-target" step="0.01" placeholder="0.00" required>
                </div>
                <div class="form-group">
                    <label>Monto Actual</label>
                    <input type="number" id="goal-current" step="0.01" placeholder="0.00" value="0">
                </div>
                <div class="form-group">
                    <label>Fecha Límite</label>
                    <input type="date" id="goal-deadline" required>
                </div>
                <div class="form-group">
                    <label>Prioridad</label>
                    <select id="goal-priority" required>
                        <option value="low">Baja</option>
                        <option value="medium">Media</option>
                        <option value="high">Alta</option>
                        <option value="critical">Crítica</option>
                    </select>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="this.closest('.modal').remove()">Cancelar</button>
                    <button type="submit" class="btn btn-primary">Crear</button>
                </div>
            </form>
        `;
    }

    // ========================================
    // FUNCIONES DE GESTIÓN
    // ========================================
    addTransaction() {
        const form = document.getElementById('new-transaction-form');
        if (!form) return;

        const type = document.getElementById('transaction-type').value;
        const amount = parseFloat(document.getElementById('transaction-amount').value);
        const description = document.getElementById('transaction-description').value.trim();
        const category = document.getElementById('transaction-category').value;
        const date = document.getElementById('transaction-date').value;

        const transactionData = {
            type,
            amount,
            description,
            category,
            date
        };

        // Validar datos
        const errors = this.validateTransaction(transactionData);
        if (errors.length > 0) {
            this.showError(errors.join(', '));
            return;
        }

        const transaction = {
            id: Date.now() + Math.random(),
            description,
            amount: type === 'income' ? amount : -amount,
            category,
            date,
            type,
            recurring: false,
            createdAt: new Date().toISOString()
        };

        this.transactions.unshift(transaction);
        this.saveToStorage();
        this.updateDashboard();
        this.updateTabContent(this.currentTab);
        
        this.showSuccess('Transacción agregada correctamente');
    }

    addBudget() {
        const form = document.getElementById('new-budget-form');
        if (!form) return;

        const category = document.getElementById('budget-category').value;
        const limit = parseFloat(document.getElementById('budget-limit').value);
        const period = document.getElementById('budget-period').value;

        const budgetData = {
            category,
            limit,
            period
        };

        // Validar datos
        const errors = this.validateBudget(budgetData);
        if (errors.length > 0) {
            this.showError(errors.join(', '));
            return;
        }

        // Verificar si ya existe un presupuesto para esta categoría
        const existingBudget = this.budgets.find(b => b.category === category);
        if (existingBudget) {
            this.showError('Ya existe un presupuesto para esta categoría');
            return;
        }

        const budget = {
            id: Date.now() + Math.random(),
            category,
            limit,
            spent: this.calculateCategorySpent(category),
            period,
            alerts: [],
            createdAt: new Date().toISOString()
        };

        this.budgets.push(budget);
        this.saveToStorage();
        this.updateDashboard();
        this.updateTabContent(this.currentTab);
        
        this.showSuccess('Presupuesto creado correctamente');
    }

    addGoal() {
        const form = document.getElementById('new-goal-form');
        if (!form) return;

        const name = document.getElementById('goal-name').value.trim();
        const target = parseFloat(document.getElementById('goal-target').value);
        const current = parseFloat(document.getElementById('goal-current').value) || 0;
        const deadline = document.getElementById('goal-deadline').value;
        const priority = document.getElementById('goal-priority').value;

        const goalData = {
            name,
            target,
            current,
            deadline,
            priority
        };

        // Validar datos
        const errors = this.validateGoal(goalData);
        if (errors.length > 0) {
            this.showError(errors.join(', '));
            return;
        }

        const goal = {
            id: Date.now() + Math.random(),
            name,
            target,
            current,
            deadline,
            priority,
            category: 'personal',
            monthlyTarget: (target - current) / Math.max(Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 30)), 1),
            createdAt: new Date().toISOString()
        };

        this.goals.push(goal);
        this.saveToStorage();
        this.updateDashboard();
        this.updateTabContent(this.currentTab);
        
        this.showSuccess('Objetivo creado correctamente');
    }

    editTransaction(id) {
        const transaction = this.transactions.find(t => t.id === id);
        if (!transaction) return;

        const modal = this.createModal('Editar Transacción', this.getTransactionFormHTML(transaction));
        document.body.appendChild(modal);
        
        // Llenar formulario con datos existentes
        document.getElementById('transaction-type').value = transaction.type;
        document.getElementById('transaction-description').value = transaction.description;
        document.getElementById('transaction-amount').value = Math.abs(transaction.amount);
        document.getElementById('transaction-category').value = transaction.category;
        document.getElementById('transaction-date').value = transaction.date;
        
        modal.querySelector('#new-transaction-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.updateTransaction(id);
            modal.remove();
        });
    }

    updateTransaction(id) {
        const form = document.getElementById('new-transaction-form');
        if (!form) return;

        const type = document.getElementById('transaction-type').value;
        const amount = parseFloat(document.getElementById('transaction-amount').value);
        const description = document.getElementById('transaction-description').value.trim();
        const category = document.getElementById('transaction-category').value;
        const date = document.getElementById('transaction-date').value;

        const transactionData = {
            type,
            amount,
            description,
            category,
            date
        };

        // Validar datos
        const errors = this.validateTransaction(transactionData);
        if (errors.length > 0) {
            this.showError(errors.join(', '));
            return;
        }

        const transactionIndex = this.transactions.findIndex(t => t.id === id);
        if (transactionIndex !== -1) {
            this.transactions[transactionIndex] = {
                ...this.transactions[transactionIndex],
                description,
                amount: type === 'income' ? amount : -amount,
                category,
                date,
                type,
                updatedAt: new Date().toISOString()
            };
            
            this.saveToStorage();
            this.updateDashboard();
            this.updateTabContent(this.currentTab);
            this.showSuccess('Transacción actualizada correctamente');
        }
    }

    deleteTransaction(id) {
        if (confirm('¿Estás seguro de que quieres eliminar esta transacción?')) {
            this.transactions = this.transactions.filter(t => t.id !== id);
            this.saveToStorage();
            this.updateDashboard();
            this.updateTabContent(this.currentTab);
            this.showSuccess('Transacción eliminada correctamente');
        }
    }

    editBudget(id) {
        const budget = this.budgets.find(b => b.id === id);
        if (!budget) return;

        const modal = this.createModal('Editar Presupuesto', this.getBudgetFormHTML(budget));
        document.body.appendChild(modal);
        
        // Llenar formulario con datos existentes
        document.getElementById('budget-category').value = budget.category;
        document.getElementById('budget-limit').value = budget.limit;
        document.getElementById('budget-period').value = budget.period;
        
        modal.querySelector('#new-budget-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.updateBudget(id);
            modal.remove();
        });
    }

    updateBudget(id) {
        const form = document.getElementById('new-budget-form');
        if (!form) return;

        const limit = parseFloat(document.getElementById('budget-limit').value);
        const period = document.getElementById('budget-period').value;

        const budgetData = {
            category: document.getElementById('budget-category').value,
            limit,
            period
        };

        // Validar datos
        const errors = this.validateBudget(budgetData);
        if (errors.length > 0) {
            this.showError(errors.join(', '));
            return;
        }

        const budgetIndex = this.budgets.findIndex(b => b.id === id);
        if (budgetIndex !== -1) {
            this.budgets[budgetIndex] = {
                ...this.budgets[budgetIndex],
                limit,
                period,
                updatedAt: new Date().toISOString()
            };
            
            this.saveToStorage();
            this.updateDashboard();
            this.updateTabContent(this.currentTab);
            this.showSuccess('Presupuesto actualizado correctamente');
        }
    }

    addToBudget(id) {
        const budget = this.budgets.find(b => b.id === id);
        if (!budget) return;

        const amount = prompt(`¿Cuánto quieres añadir al presupuesto de ${this.categories.find(c => c.id === budget.category)?.name}?`);
        if (amount && !isNaN(amount) && parseFloat(amount) > 0) {
            budget.limit += parseFloat(amount);
            this.saveToStorage();
            this.updateDashboard();
            this.updateTabContent(this.currentTab);
            this.showSuccess(`Se añadieron €${amount} al presupuesto`);
        }
    }

    editGoal(id) {
        const goal = this.goals.find(g => g.id === id);
        if (!goal) return;

        const modal = this.createModal('Editar Objetivo', this.getGoalFormHTML(goal));
        document.body.appendChild(modal);
        
        // Llenar formulario con datos existentes
        document.getElementById('goal-name').value = goal.name;
        document.getElementById('goal-target').value = goal.target;
        document.getElementById('goal-current').value = goal.current;
        document.getElementById('goal-deadline').value = goal.deadline;
        document.getElementById('goal-priority').value = goal.priority;
        
        modal.querySelector('#new-goal-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.updateGoal(id);
            modal.remove();
        });
    }

    updateGoal(id) {
        const form = document.getElementById('new-goal-form');
        if (!form) return;

        const name = document.getElementById('goal-name').value.trim();
        const target = parseFloat(document.getElementById('goal-target').value);
        const current = parseFloat(document.getElementById('goal-current').value) || 0;
        const deadline = document.getElementById('goal-deadline').value;
        const priority = document.getElementById('goal-priority').value;

        const goalData = {
            name,
            target,
            current,
            deadline,
            priority
        };

        // Validar datos
        const errors = this.validateGoal(goalData);
        if (errors.length > 0) {
            this.showError(errors.join(', '));
            return;
        }

        const goalIndex = this.goals.findIndex(g => g.id === id);
        if (goalIndex !== -1) {
            this.goals[goalIndex] = {
                ...this.goals[goalIndex],
                name,
                target,
                current,
                deadline,
                priority,
                monthlyTarget: (target - current) / Math.max(Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 30)), 1),
                updatedAt: new Date().toISOString()
            };
            
            this.saveToStorage();
            this.updateDashboard();
            this.updateTabContent(this.currentTab);
            this.showSuccess('Objetivo actualizado correctamente');
        }
    }

    addToGoal(id) {
        const goal = this.goals.find(g => g.id === id);
        if (!goal) return;

        const amount = prompt(`¿Cuánto quieres añadir al objetivo "${goal.name}"?`);
        if (amount && !isNaN(amount) && parseFloat(amount) > 0) {
            goal.current += parseFloat(amount);
            goal.monthlyTarget = (goal.target - goal.current) / Math.max(Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 30)), 1);
            
            this.saveToStorage();
            this.updateDashboard();
            this.updateTabContent(this.currentTab);
            this.showSuccess(`Se añadieron €${amount} al objetivo`);
        }
    }

    // ========================================
    // EXPORTACIÓN Y IMPORTACIÓN
    // ========================================
    exportData() {
        const data = {
            transactions: this.transactions,
            budgets: this.budgets,
            goals: this.goals,
            exportDate: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `veedor-data-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        this.showNotification('Datos exportados correctamente', 'success');
    }

    exportTransactions() {
        const csv = this.transactionsToCSV(this.getFilteredTransactions());
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `transacciones-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        
        this.showNotification('Transacciones exportadas a CSV', 'success');
    }

    transactionsToCSV(transactions) {
        const headers = ['Fecha', 'Descripción', 'Categoría', 'Tipo', 'Monto'];
        const rows = transactions.map(t => [
            t.date,
            t.description,
            this.categories.find(c => c.id === t.category)?.name || t.category,
            t.type,
            t.amount.toFixed(2)
        ]);
        
        return [headers, ...rows].map(row => row.join(',')).join('\n');
    }

    showImportModal() {
        const modal = this.createModal('Importar Datos', `
            <div class="import-content">
                <p>Selecciona un archivo JSON para importar tus datos:</p>
                <input type="file" id="import-file" accept=".json" class="file-input">
                <div class="import-actions">
                    <button type="button" class="btn btn-secondary" onclick="this.closest('.modal').remove()">Cancelar</button>
                    <button type="button" class="btn btn-primary" onclick="veedorFinance.importData()">Importar</button>
                </div>
            </div>
        `);
        document.body.appendChild(modal);
    }

    importData() {
        const fileInput = document.getElementById('import-file');
        const file = fileInput.files[0];
        
        if (!file) {
            this.showNotification('Selecciona un archivo', 'error');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                this.transactions = data.transactions || [];
                this.budgets = data.budgets || [];
                this.goals = data.goals || [];
                
                this.updateDashboard();
                this.updateTabContent(this.currentTab);
                this.showNotification('Datos importados correctamente', 'success');
                
                document.querySelector('.modal').remove();
            } catch (error) {
                this.showNotification('Error al importar el archivo', 'error');
            }
        };
        reader.readAsText(file);
    }

    // ========================================
    // GRÁFICOS INTERACTIVOS
    // ========================================
    initializeCharts() {
        // Inicializar Chart.js si está disponible
        if (typeof Chart !== 'undefined') {
            this.createCategoryChart();
            this.createTrendsChart();
        }
    }

    createCategoryChart() {
        const ctx = document.getElementById('categoryChart');
        if (!ctx) return;

        const categoryTotals = this.calculateCategoryTotals();
        const labels = Object.keys(categoryTotals).map(id => 
            this.categories.find(c => c.id === id)?.name || id
        );
        const data = Object.values(categoryTotals);
        const colors = Object.keys(categoryTotals).map(id => 
            this.categories.find(c => c.id === id)?.color || '#8B5CF6'
        );

        this.charts.category = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels,
                datasets: [{
                    data,
                    backgroundColor: colors,
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true
                        }
                    }
                }
            }
        });
    }

    createTrendsChart() {
        const ctx = document.getElementById('trendsChart');
        if (!ctx) return;

        // Datos simulados para tendencias
        const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'];
        const incomeData = [2200, 2400, 2300, 2500, 2600, 2500];
        const expenseData = [1800, 1900, 1850, 2000, 2100, 2000];

        this.charts.trends = new Chart(ctx, {
            type: 'line',
            data: {
                labels: months,
                datasets: [{
                    label: 'Ingresos',
                    data: incomeData,
                    borderColor: '#4CAF50',
                    backgroundColor: 'rgba(76, 175, 80, 0.1)',
                    tension: 0.4
                }, {
                    label: 'Gastos',
                    data: expenseData,
                    borderColor: '#F44336',
                    backgroundColor: 'rgba(244, 67, 54, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '€' + value;
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'top'
                    }
                }
            }
        });
    }

    // ========================================
    // ACTUALIZACIONES EN TIEMPO REAL
    // ========================================
    startRealTimeUpdates() {
        // Actualizar cada 30 segundos
        setInterval(() => {
            this.updateDashboard();
        }, 30000);
        
        // Actualizar insights cada minuto
        setInterval(() => {
            this.updateInsightsCenter();
        }, 60000);
    }

    // ========================================
    // PERSISTENCIA DE DATOS
    // ========================================
    saveToStorage() {
        const data = {
            transactions: this.transactions,
            budgets: this.budgets,
            goals: this.goals,
            lastUpdated: new Date().toISOString()
        };
        
        try {
            localStorage.setItem('veedor-finance-data', JSON.stringify(data));
        } catch (error) {
            console.warn('No se pudieron guardar los datos:', error);
        }
    }

    loadFromStorage() {
        try {
            const data = localStorage.getItem('veedor-finance-data');
            return data ? JSON.parse(data) : {};
        } catch (error) {
            console.warn('No se pudieron cargar los datos:', error);
            return {};
        }
    }

    // ========================================
    // GESTIÓN DE TEMA
    // ========================================
    setupThemeToggle() {
        // Cargar tema guardado
        this.loadTheme();
        
        // Configurar listener para cambios de tema
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
                    this.updateChartsTheme();
                }
            });
        });
        
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme']
        });
    }

    loadTheme() {
        const savedTheme = localStorage.getItem('veedor-theme') || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);
        document.body.setAttribute('data-theme', savedTheme);
        
        const themeIcon = document.querySelector('.theme-icon');
        if (themeIcon) {
            themeIcon.textContent = savedTheme === 'dark' ? '☀' : '☾';
        }
    }

    updateChartsTheme() {
        // Actualizar colores de gráficos según el tema
        if (this.charts.category) {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            this.charts.category.options.plugins.legend.labels.color = isDark ? '#FFFFFF' : '#1D1D1F';
            this.charts.category.update();
        }
        
        if (this.charts.trends) {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            this.charts.trends.options.scales.y.ticks.color = isDark ? '#FFFFFF' : '#1D1D1F';
            this.charts.trends.options.scales.x.ticks.color = isDark ? '#FFFFFF' : '#1D1D1F';
            this.charts.trends.update();
        }
    }

    // ========================================
    // VALIDACIONES Y MANEJO DE ERRORES
    // ========================================
    validateTransaction(data) {
        const errors = [];
        
        if (!data.description || data.description.trim().length < 2) {
            errors.push('La descripción debe tener al menos 2 caracteres');
        }
        
        if (!data.amount || isNaN(data.amount) || data.amount <= 0) {
            errors.push('El monto debe ser un número positivo');
        }
        
        if (!data.category) {
            errors.push('Debe seleccionar una categoría');
        }
        
        if (!data.date) {
            errors.push('Debe seleccionar una fecha');
        }
        
        return errors;
    }

    validateBudget(data) {
        const errors = [];
        
        if (!data.category) {
            errors.push('Debe seleccionar una categoría');
        }
        
        if (!data.limit || isNaN(data.limit) || data.limit <= 0) {
            errors.push('El límite debe ser un número positivo');
        }
        
        return errors;
    }

    validateGoal(data) {
        const errors = [];
        
        if (!data.name || data.name.trim().length < 2) {
            errors.push('El nombre debe tener al menos 2 caracteres');
        }
        
        if (!data.target || isNaN(data.target) || data.target <= 0) {
            errors.push('El objetivo debe ser un número positivo');
        }
        
        if (!data.deadline) {
            errors.push('Debe seleccionar una fecha límite');
        } else if (new Date(data.deadline) <= new Date()) {
            errors.push('La fecha límite debe ser futura');
        }
        
        return errors;
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    // ========================================
    // UTILIDADES PROFESIONALES
    // ========================================
    formatDate(dateString) {
        const date = new Date(dateString);
        const today = new Date();
        const diffTime = Math.abs(today - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) return 'Hoy';
        if (diffDays === 2) return 'Ayer';
        if (diffDays <= 7) return `Hace ${diffDays - 1} días`;
        
        return date.toLocaleDateString('es-ES', { 
            day: 'numeric', 
            month: 'short',
            year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
        });
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${this.getNotificationColor(type)};
            color: white;
            padding: 16px 20px;
            border-radius: 8px;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            animation: slideInRight 0.3s ease;
            max-width: 400px;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }

    getNotificationColor(type) {
        const colors = {
            success: '#4CAF50',
            error: '#F44336',
            warning: '#FF9800',
            info: '#2196F3'
        };
        return colors[type] || colors.info;
    }

    calculateBudgetAlerts(categoryId, limit) {
        const spent = this.calculateCategorySpent(categoryId);
        const percentage = (spent / limit) * 100;
        
        if (percentage > 90) return 'critical';
        if (percentage > 70) return 'warning';
        return 'good';
    }
}

// ========================================
// FUNCIONES GLOBALES PROFESIONALES
// ========================================
let veedorFinance;

// Inicializar cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    veedorFinance = new VeedorFinanceCenter();
});

// Funciones globales para HTML
function showTab(tabName) {
    if (veedorFinance) {
        veedorFinance.showTab(tabName);
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

function loadTheme() {
    const savedTheme = localStorage.getItem('veedor-theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        document.body.setAttribute('data-theme', savedTheme);
        const themeIcon = document.querySelector('.theme-icon');
        if (themeIcon) {
            themeIcon.textContent = savedTheme === 'dark' ? '☀' : '☾';
        }
    } else {
        const defaultTheme = 'dark';
        document.documentElement.setAttribute('data-theme', defaultTheme);
        document.body.setAttribute('data-theme', defaultTheme);
        const themeIcon = document.querySelector('.theme-icon');
        if (themeIcon) {
            themeIcon.textContent = '☀';
        }
    }
}

function toggleUserMenu() {
    const dropdown = document.querySelector('.nav-dropdown');
    dropdown.classList.toggle('active');
}

function showAuth() {
    const authOverlay = document.getElementById('auth-overlay');
    if (authOverlay) {
        authOverlay.classList.add('show');
    }
}

function hideAuth() {
    const authOverlay = document.getElementById('auth-overlay');
    if (authOverlay) {
        authOverlay.classList.remove('show');
    }
}

function switchAuthTab(tab) {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const tabs = document.querySelectorAll('.auth-tab');
    
    tabs.forEach(t => t.classList.remove('active'));
    
    if (tab === 'login') {
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
        tabs[0].classList.add('active');
    } else {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
        tabs[1].classList.add('active');
    }
}

function openModal(modalId) {
    const modal = document.getElementById(modalId + '-modal');
    if (modal) {
        modal.classList.add('show');
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId + '-modal');
    if (modal) {
        modal.classList.remove('show');
    }
}

function downloadApp(platform) {
    if (platform === 'ios') {
        window.open('https://apps.apple.com/app/veedor', '_blank');
    } else if (platform === 'android') {
        window.open('https://play.google.com/store/apps/details?id=com.veedor', '_blank');
    }
}

function toggleMobileMenu() {
    const navMenu = document.getElementById('nav-menu');
    navMenu.classList.toggle('active');
}

function closeMobileMenu() {
    const navMenu = document.getElementById('nav-menu');
    navMenu.classList.remove('active');
}

// Función duplicada eliminada - ya existe arriba

function showDashboard() {
    // Ya estamos en el dashboard, no hacer nada
}

function logout() {
        // Limpiar datos de sesión
        localStorage.removeItem('veedor-user');
        localStorage.removeItem('veedor-session');
        
        // Ocultar elementos de usuario autenticado
        const dashboardLink = document.getElementById('dashboard-link');
        const logoutButton = document.getElementById('logout-button');
        const authButton = document.getElementById('auth-button');
        
        if (dashboardLink) dashboardLink.style.display = 'none';
        if (logoutButton) logoutButton.style.display = 'none';
        if (authButton) authButton.style.display = 'block';
        
        // Mostrar mensaje de confirmación
        if (veedorFinance) {
            veedorFinance.showMessage('Sesión cerrada correctamente', 'success');
        }
        
        // Redirigir a página principal
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    }

    function showEnvelopeModal() {
        const modal = createEnvelopeModal();
        document.body.appendChild(modal);
        modal.style.display = 'flex';
        setTimeout(() => modal.classList.add('show'), 10);
    }
    
    function createEnvelopeModal() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Nuevo Sobre</h2>
                    <button class="close-btn" onclick="this.closest('.modal').remove()">×</button>
                </div>
                <form class="modal-form" onsubmit="saveEnvelope(event)">
                    <div class="form-group">
                        <label for="envelope-name">Nombre del Sobre</label>
                        <input type="text" id="envelope-name" required placeholder="Ej: Alimentación">
                    </div>
                    <div class="form-group">
                        <label for="envelope-budget">Presupuesto (€)</label>
                        <input type="number" id="envelope-budget" step="0.01" required placeholder="300.00">
                    </div>
                    <div class="form-group">
                        <label for="envelope-color">Color</label>
                        <select id="envelope-color" required>
                            <option value="#FF6B6B">Rojo</option>
                            <option value="#4ECDC4">Turquesa</option>
                            <option value="#45B7D1">Azul</option>
                            <option value="#96CEB4">Verde</option>
                            <option value="#FFEAA7">Amarillo</option>
                            <option value="#DDA0DD">Púrpura</option>
                            <option value="#98D8C8">Verde claro</option>
                            <option value="#F7DC6F">Dorado</option>
                        </select>
                    </div>
                    <div class="form-actions">
                        <button type="button" class="btn-outline" onclick="this.closest('.modal').remove()">Cancelar</button>
                        <button type="submit" class="btn-primary">Crear Sobre</button>
                    </div>
                </form>
            </div>
        `;
        return modal;
    }
    
    function saveEnvelope(event) {
        event.preventDefault();
        if (!veedorFinance) return;

        const name = document.getElementById('envelope-name').value;
        const budget = parseFloat(document.getElementById('envelope-budget').value);
        const color = document.getElementById('envelope-color').value;

        const newEnvelope = {
            id: Date.now(),
            name: name,
            amount: 0,
            budget: budget,
            color: color
        };

        veedorFinance.envelopes.push(newEnvelope);
        veedorFinance.updateEnvelopes();
        veedorFinance.saveToStorage();
        veedorFinance.showMessage('Sobre creado correctamente', 'success');
        event.target.closest('.modal').remove();
    }

    function showEnvelopeSettings() {
        const modal = createEnvelopeSettingsModal();
        document.body.appendChild(modal);
        modal.style.display = 'flex';
        setTimeout(() => modal.classList.add('show'), 10);
    }
    
    function createEnvelopeSettingsModal() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Configuración de Sobres</h2>
                    <button class="close-btn" onclick="this.closest('.modal').remove()">×</button>
                </div>
                <div class="modal-body">
                    <div class="settings-section">
                        <h3>Gestión de Sobres</h3>
                        <div class="settings-actions">
                            <button class="btn-primary" onclick="showEnvelopeModal(); this.closest('.modal').remove();">+ Nuevo Sobre</button>
                            <button class="btn-outline" onclick="resetEnvelopes()">Resetear Todos</button>
                        </div>
                    </div>
                    <div class="settings-section">
                        <h3>Configuración General</h3>
                        <div class="form-group">
                            <label>
                                <input type="checkbox" id="auto-assign-transactions" checked>
                                Asignar transacciones automáticamente
                            </label>
                        </div>
                        <div class="form-group">
                            <label>
                                <input type="checkbox" id="show-envelope-progress" checked>
                                Mostrar progreso visual
                            </label>
                        </div>
                    </div>
                    <div class="settings-section">
                        <h3>Alertas</h3>
                        <div class="form-group">
                            <label for="alert-threshold">Umbral de alerta (%)</label>
                            <input type="number" id="alert-threshold" value="80" min="50" max="100">
                        </div>
                    </div>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn-outline" onclick="this.closest('.modal').remove()">Cerrar</button>
                    <button type="button" class="btn-primary" onclick="saveEnvelopeSettings()">Guardar</button>
                </div>
            </div>
        `;
        return modal;
    }
    
    function resetEnvelopes() {
        if (confirm('¿Estás seguro de que quieres resetear todos los sobres? Esto eliminará todos los datos.')) {
            if (veedorFinance) {
                veedorFinance.envelopes = [];
                veedorFinance.updateEnvelopes();
                veedorFinance.saveToStorage();
                veedorFinance.showMessage('Sobres reseteados correctamente', 'success');
            }
        }
    }
    
    function saveEnvelopeSettings() {
        // Guardar configuración (por ahora solo mostrar mensaje)
        if (veedorFinance) {
            veedorFinance.showMessage('Configuración guardada', 'success');
        }
        document.querySelector('.modal').remove();
    }

    function addToEnvelope(envelopeId) {
        // Función para añadir dinero a un sobre
        if (veedorFinance) {
            const envelope = veedorFinance.envelopes.find(e => e.id === envelopeId);
            if (envelope) {
                const amount = prompt(`¿Cuánto quieres añadir a ${envelope.name}?`);
                if (amount && !isNaN(amount)) {
                    envelope.amount += parseFloat(amount);
                    veedorFinance.updateEnvelopes();
                    veedorFinance.saveToStorage();
                }
            }
        }
    }

    function removeFromEnvelope(envelopeId) {
        // Función para quitar dinero de un sobre
        if (veedorFinance) {
            const envelope = veedorFinance.envelopes.find(e => e.id === envelopeId);
            if (envelope) {
                const amount = prompt(`¿Cuánto quieres quitar de ${envelope.name}?`);
                if (amount && !isNaN(amount)) {
                    envelope.amount = Math.max(0, envelope.amount - parseFloat(amount));
                    veedorFinance.updateEnvelopes();
                    veedorFinance.saveToStorage();
                }
            }
        }
    }

    // ========================================
    // FUNCIONES GLOBALES PARA ACTIVOS Y PASIVOS
    // ========================================
    function showAddAssetModal() {
        const modal = createAssetModal();
        document.body.appendChild(modal);
        modal.style.display = 'flex';
        setTimeout(() => modal.classList.add('show'), 10);
    }

    function showAddLiabilityModal() {
        const modal = createLiabilityModal();
        document.body.appendChild(modal);
        modal.style.display = 'flex';
        setTimeout(() => modal.classList.add('show'), 10);
    }

    function showAssetsList() {
        if (veedorFinance) {
            veedorFinance.showTab('assets');
        }
    }

    function showLiabilitiesList() {
        if (veedorFinance) {
            veedorFinance.showTab('assets');
        }
    }

    function showNetWorthSettings() {
        const modal = createNetWorthSettingsModal();
        document.body.appendChild(modal);
        modal.style.display = 'flex';
        setTimeout(() => modal.classList.add('show'), 10);
    }
    
    function createNetWorthSettingsModal() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Configuración de Patrimonio</h2>
                    <button class="close-btn" onclick="this.closest('.modal').remove()">×</button>
                </div>
                <div class="modal-body">
                    <div class="settings-section">
                        <h3>Gestión de Activos</h3>
                        <div class="settings-actions">
                            <button class="btn-primary" onclick="showAddAssetModal(); this.closest('.modal').remove();">+ Nuevo Activo</button>
                            <button class="btn-outline" onclick="resetAssets()">Resetear Activos</button>
                        </div>
                    </div>
                    <div class="settings-section">
                        <h3>Gestión de Pasivos</h3>
                        <div class="settings-actions">
                            <button class="btn-primary" onclick="showAddLiabilityModal(); this.closest('.modal').remove();">+ Nuevo Pasivo</button>
                            <button class="btn-outline" onclick="resetLiabilities()">Resetear Pasivos</button>
                        </div>
                    </div>
                    <div class="settings-section">
                        <h3>Configuración General</h3>
                        <div class="form-group">
                            <label>
                                <input type="checkbox" id="auto-update-net-worth" checked>
                                Actualización automática del patrimonio
                            </label>
                        </div>
                        <div class="form-group">
                            <label>
                                <input type="checkbox" id="show-monthly-change" checked>
                                Mostrar cambio mensual
                            </label>
                        </div>
                    </div>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn-outline" onclick="this.closest('.modal').remove()">Cerrar</button>
                    <button type="button" class="btn-primary" onclick="saveNetWorthSettings()">Guardar</button>
                </div>
            </div>
        `;
        return modal;
    }
    
    function resetAssets() {
        if (confirm('¿Estás seguro de que quieres resetear todos los activos?')) {
            if (veedorFinance) {
                veedorFinance.assets = [];
                veedorFinance.updateAssets();
                veedorFinance.updateNetWorth();
                veedorFinance.saveToStorage();
                veedorFinance.showMessage('Activos reseteados correctamente', 'success');
            }
        }
    }
    
    function resetLiabilities() {
        if (confirm('¿Estás seguro de que quieres resetear todos los pasivos?')) {
            if (veedorFinance) {
                veedorFinance.liabilities = [];
                veedorFinance.updateAssets();
                veedorFinance.updateNetWorth();
                veedorFinance.saveToStorage();
                veedorFinance.showMessage('Pasivos reseteados correctamente', 'success');
            }
        }
    }
    
    function saveNetWorthSettings() {
        if (veedorFinance) {
            veedorFinance.showMessage('Configuración de patrimonio guardada', 'success');
        }
        document.querySelector('.modal').remove();
    }

    function editAsset(assetId) {
        if (veedorFinance) {
            const asset = veedorFinance.assets.find(a => a.id === assetId);
            if (asset) {
                const modal = createAssetModal(asset);
                document.body.appendChild(modal);
                modal.style.display = 'flex';
                setTimeout(() => modal.classList.add('show'), 10);
            }
        }
    }

    function deleteAsset(assetId) {
        if (veedorFinance && confirm('¿Estás seguro de que quieres eliminar este activo?')) {
            veedorFinance.assets = veedorFinance.assets.filter(a => a.id !== assetId);
            veedorFinance.updateAssets();
            veedorFinance.updateNetWorth();
            veedorFinance.saveToStorage();
            veedorFinance.showMessage('Activo eliminado correctamente', 'success');
        }
    }

    function editLiability(liabilityId) {
        if (veedorFinance) {
            const liability = veedorFinance.liabilities.find(l => l.id === liabilityId);
            if (liability) {
                const modal = createLiabilityModal(liability);
                document.body.appendChild(modal);
                modal.style.display = 'flex';
                setTimeout(() => modal.classList.add('show'), 10);
            }
        }
    }

    function deleteLiability(liabilityId) {
        if (veedorFinance && confirm('¿Estás seguro de que quieres eliminar este pasivo?')) {
            veedorFinance.liabilities = veedorFinance.liabilities.filter(l => l.id !== liabilityId);
            veedorFinance.updateAssets();
            veedorFinance.updateNetWorth();
            veedorFinance.saveToStorage();
            veedorFinance.showMessage('Pasivo eliminado correctamente', 'success');
        }
    }

    function createAssetModal(asset = null) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>${asset ? 'Editar Activo' : 'Nuevo Activo'}</h2>
                    <button class="close-btn" onclick="this.closest('.modal').remove()">×</button>
                </div>
                <form class="modal-form" onsubmit="saveAsset(event, ${asset ? asset.id : 'null'})">
                    <div class="form-group">
                        <label for="asset-name">Nombre</label>
                        <input type="text" id="asset-name" value="${asset ? asset.name : ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="asset-amount">Valor (€)</label>
                        <input type="number" id="asset-amount" step="0.01" value="${asset ? asset.amount : ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="asset-type">Tipo</label>
                        <select id="asset-type" required>
                            <option value="cash" ${asset && asset.type === 'cash' ? 'selected' : ''}>Efectivo</option>
                            <option value="savings" ${asset && asset.type === 'savings' ? 'selected' : ''}>Ahorro</option>
                            <option value="investment" ${asset && asset.type === 'investment' ? 'selected' : ''}>Inversión</option>
                            <option value="property" ${asset && asset.type === 'property' ? 'selected' : ''}>Propiedad</option>
                            <option value="vehicle" ${asset && asset.type === 'vehicle' ? 'selected' : ''}>Vehículo</option>
                            <option value="other" ${asset && asset.type === 'other' ? 'selected' : ''}>Otro</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="asset-institution">Institución</label>
                        <input type="text" id="asset-institution" value="${asset ? asset.institution : ''}" required>
                    </div>
                    <div class="form-actions">
                        <button type="button" class="btn-outline" onclick="this.closest('.modal').remove()">Cancelar</button>
                        <button type="submit" class="btn-primary">${asset ? 'Actualizar' : 'Crear'}</button>
                    </div>
                </form>
            </div>
        `;
        return modal;
    }

    function createLiabilityModal(liability = null) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>${liability ? 'Editar Pasivo' : 'Nuevo Pasivo'}</h2>
                    <button class="close-btn" onclick="this.closest('.modal').remove()">×</button>
                </div>
                <form class="modal-form" onsubmit="saveLiability(event, ${liability ? liability.id : 'null'})">
                    <div class="form-group">
                        <label for="liability-name">Nombre</label>
                        <input type="text" id="liability-name" value="${liability ? liability.name : ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="liability-amount">Valor (€)</label>
                        <input type="number" id="liability-amount" step="0.01" value="${liability ? liability.amount : ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="liability-type">Tipo</label>
                        <select id="liability-type" required>
                            <option value="mortgage" ${liability && liability.type === 'mortgage' ? 'selected' : ''}>Hipoteca</option>
                            <option value="loan" ${liability && liability.type === 'loan' ? 'selected' : ''}>Préstamo</option>
                            <option value="credit" ${liability && liability.type === 'credit' ? 'selected' : ''}>Tarjeta de Crédito</option>
                            <option value="debt" ${liability && liability.type === 'debt' ? 'selected' : ''}>Deuda</option>
                            <option value="other" ${liability && liability.type === 'other' ? 'selected' : ''}>Otro</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="liability-institution">Institución</label>
                        <input type="text" id="liability-institution" value="${liability ? liability.institution : ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="liability-payment">Pago Mensual (€)</label>
                        <input type="number" id="liability-payment" step="0.01" value="${liability ? liability.monthlyPayment || '' : ''}">
                    </div>
                    <div class="form-actions">
                        <button type="button" class="btn-outline" onclick="this.closest('.modal').remove()">Cancelar</button>
                        <button type="submit" class="btn-primary">${liability ? 'Actualizar' : 'Crear'}</button>
                    </div>
                </form>
            </div>
        `;
        return modal;
    }

    function saveAsset(event, assetId) {
        event.preventDefault();
        if (!veedorFinance) return;

        const formData = {
            name: document.getElementById('asset-name').value,
            amount: parseFloat(document.getElementById('asset-amount').value),
            type: document.getElementById('asset-type').value,
            institution: document.getElementById('asset-institution').value
        };

        if (assetId) {
            // Editar activo existente
            const assetIndex = veedorFinance.assets.findIndex(a => a.id === assetId);
            if (assetIndex !== -1) {
                veedorFinance.assets[assetIndex] = { ...veedorFinance.assets[assetIndex], ...formData };
                veedorFinance.showMessage('Activo actualizado correctamente', 'success');
            }
        } else {
            // Crear nuevo activo
            const newAsset = {
                id: Date.now(),
                ...formData
            };
            veedorFinance.assets.push(newAsset);
            veedorFinance.showMessage('Activo creado correctamente', 'success');
        }

        veedorFinance.updateAssets();
        veedorFinance.updateNetWorth();
        veedorFinance.saveToStorage();
        event.target.closest('.modal').remove();
    }

    function saveLiability(event, liabilityId) {
        event.preventDefault();
        if (!veedorFinance) return;

        const formData = {
            name: document.getElementById('liability-name').value,
            amount: parseFloat(document.getElementById('liability-amount').value),
            type: document.getElementById('liability-type').value,
            institution: document.getElementById('liability-institution').value,
            monthlyPayment: parseFloat(document.getElementById('liability-payment').value) || 0
        };

        if (liabilityId) {
            // Editar pasivo existente
            const liabilityIndex = veedorFinance.liabilities.findIndex(l => l.id === liabilityId);
            if (liabilityIndex !== -1) {
                veedorFinance.liabilities[liabilityIndex] = { ...veedorFinance.liabilities[liabilityIndex], ...formData };
                veedorFinance.showMessage('Pasivo actualizado correctamente', 'success');
            }
        } else {
            // Crear nuevo pasivo
            const newLiability = {
                id: Date.now(),
                ...formData
            };
            veedorFinance.liabilities.push(newLiability);
            veedorFinance.showMessage('Pasivo creado correctamente', 'success');
        }

        veedorFinance.updateAssets();
        veedorFinance.updateNetWorth();
        veedorFinance.saveToStorage();
        event.target.closest('.modal').remove();
    }

// Cerrar menú al hacer click fuera
document.addEventListener('click', function(event) {
    const dropdown = document.querySelector('.nav-dropdown');
    if (dropdown && !dropdown.contains(event.target)) {
        dropdown.classList.remove('active');
    }
});

// CSS adicional para animaciones profesionales
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification {
        font-weight: 500;
        font-size: 14px;
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 18px;
        cursor: pointer;
        padding: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .budget-fill.excellent {
        background: linear-gradient(90deg, #4CAF50, #66BB6A);
    }
    
    .budget-fill.good {
        background: linear-gradient(90deg, #FF9800, #FFB74D);
    }
    
    .budget-fill.warning {
        background: linear-gradient(90deg, #F44336, #EF5350);
    }
    
    .goal-fill {
        background: linear-gradient(90deg, #8B5CF6, #A855F7);
        height: 8px;
        border-radius: 4px;
        transition: width 0.3s ease;
    }
    
    .chart-item {
        margin-bottom: 16px;
        display: flex;
        align-items: center;
        gap: 16px;
    }
    
    .chart-info {
        display: flex;
        align-items: center;
        gap: 12px;
        min-width: 200px;
    }
    
    .chart-category {
        font-size: 0.9rem;
        color: var(--text-primary);
        font-weight: 500;
    }
    
    .chart-amount {
        font-size: 0.9rem;
        color: var(--text-secondary);
        font-weight: 600;
    }
    
    .chart-percentage {
        font-size: 0.8rem;
        color: var(--text-tertiary);
    }
    
    .chart-bar {
        flex: 1;
        height: 20px;
        background: var(--card-bg);
        border-radius: 10px;
        overflow: hidden;
    }
    
    .chart-fill {
        height: 100%;
        border-radius: 10px;
        transition: width 0.3s ease;
    }
    
    .trend {
        font-size: 0.8rem;
        font-weight: 600;
        margin-left: 8px;
    }
    
    .trend.positive {
        color: #4CAF50;
    }
    
    .trend.negative {
        color: #F44336;
    }
    
    .savings-rate {
        font-size: 0.8rem;
        color: var(--text-secondary);
        margin-left: 8px;
    }
    
    .transaction-recurring {
        font-size: 0.8rem;
        color: var(--accent);
    }
    
    .btn-icon {
        background: none;
        border: none;
        padding: 4px;
        cursor: pointer;
        border-radius: 4px;
        transition: background 0.2s ease;
    }
    
    .btn-icon:hover {
        background: var(--card-bg);
    }
    
    .file-input {
        width: 100%;
        padding: 12px;
        border: 2px dashed var(--border-color);
        border-radius: 8px;
        background: var(--card-bg);
        color: var(--text-primary);
        margin-bottom: 16px;
    }
    
    .import-content {
        text-align: center;
    }
    
    .import-actions {
        display: flex;
        gap: 12px;
        justify-content: center;
    }
    
    .priority.critical {
        background: #F44336;
        color: white;
        padding: 2px 8px;
        border-radius: 12px;
        font-size: 0.7rem;
        font-weight: 600;
    }
    
    .priority.high {
        background: #FF9800;
        color: white;
        padding: 2px 8px;
        border-radius: 12px;
        font-size: 0.7rem;
        font-weight: 600;
    }
    
    .priority.medium {
        background: #2196F3;
        color: white;
        padding: 2px 8px;
        border-radius: 12px;
        font-size: 0.7rem;
        font-weight: 600;
    }
    
    .priority.low {
        background: #4CAF50;
        color: white;
        padding: 2px 8px;
        border-radius: 12px;
        font-size: 0.7rem;
        font-weight: 600;
    }
`;
document.head.appendChild(style);

// ========================================
// MEJORAS AVANZADAS DE UX
// ========================================
VeedorFinanceCenter.prototype.setupKeyboardShortcuts = function() {
    document.addEventListener('keydown', (e) => {
        // Alt + número para cambiar de tab
        if (e.altKey && !e.ctrlKey && !e.shiftKey) {
            const tabs = ['overview', 'transactions', 'budgets', 'envelopes', 'goals', 'analytics'];
            const number = parseInt(e.key);
            
            if (number >= 1 && number <= tabs.length) {
                e.preventDefault();
                this.showTab(tabs[number - 1]);
            }
            
            // Alt + T para cambiar tema
            if (e.key.toLowerCase() === 't') {
                e.preventDefault();
                toggleTheme();
            }
        }
        
        // Escape para cerrar modales
        if (e.key === 'Escape') {
            const authOverlay = document.getElementById('auth-overlay');
            if (authOverlay && authOverlay.style.display === 'flex') {
                authOverlay.style.display = 'none';
            }
        }
    });
};

VeedorFinanceCenter.prototype.setupAccessibility = function() {
    // Añadir aria-labels
    document.querySelectorAll('.nav-tab').forEach((tab) => {
        if (!tab.getAttribute('aria-label')) {
            tab.setAttribute('aria-label', `Navegar a ${tab.textContent.trim()}`);
            tab.setAttribute('role', 'tab');
        }
    });
    
    // Anunciar cambios para lectores de pantalla
    const announceChange = (message) => {
        const announcement = document.createElement('div');
        announcement.setAttribute('role', 'status');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.style.position = 'absolute';
        announcement.style.left = '-10000px';
        announcement.style.width = '1px';
        announcement.style.height = '1px';
        announcement.style.overflow = 'hidden';
        announcement.textContent = message;
        document.body.appendChild(announcement);
        setTimeout(() => announcement.remove(), 1000);
    };
    
    // Override showTab para anunciar cambios
    const originalShowTab = this.showTab.bind(this);
    this.showTab = function(tabName) {
        originalShowTab(tabName);
        const tabNames = {
            'overview': 'Resumen',
            'transactions': 'Transacciones',
            'budgets': 'Límites de Gasto',
            'envelopes': 'Sobres de Dinero',
            'goals': 'Objetivos',
            'analytics': 'Análisis'
        };
        announceChange(`Navegando a ${tabNames[tabName]}`);
    };
};

// Mostrar mensajes de feedback eliminables
VeedorFinanceCenter.prototype.showMessage = function(message, type = 'info') {
    const container = document.createElement('div');
    container.className = `message ${type}`;
    container.style.position = 'fixed';
    container.style.top = '80px';
    container.style.right = '20px';
    container.style.zIndex = '9999';
    container.style.maxWidth = '300px';
    container.style.display = 'flex';
    container.style.alignItems = 'center';
    container.style.justifyContent = 'space-between';
    container.style.gap = 'var(--space-sm)';
    
    const messageText = document.createElement('span');
    messageText.textContent = message;
    
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '×';
    closeBtn.style.background = 'none';
    closeBtn.style.border = 'none';
    closeBtn.style.fontSize = '1.2rem';
    closeBtn.style.cursor = 'pointer';
    closeBtn.style.color = 'inherit';
    closeBtn.style.padding = '0';
    closeBtn.style.marginLeft = 'var(--space-sm)';
    closeBtn.onclick = () => container.remove();
    
    container.appendChild(messageText);
    container.appendChild(closeBtn);
    
    document.body.appendChild(container);
    
    // Auto-remove después de 5 segundos
    setTimeout(() => {
        if (container.parentNode) {
            container.style.opacity = '0';
            setTimeout(() => container.remove(), 300);
        }
    }, 5000);
};

// ========================================
// FUNCIONES CRUD PARA ACTIVOS Y PASIVOS
// ========================================
VeedorFinanceCenter.prototype.updateAssets = function() {
    this.updateAssetsList();
    this.updateLiabilitiesList();
};

VeedorFinanceCenter.prototype.updateAssetsList = function() {
    const container = document.querySelector('#assets-list');
    if (!container) return;

    if (this.assets.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-title">Sin activos</div>
                <div class="empty-state-description">Añade tu primera cuenta, inversión o propiedad</div>
                <button class="btn-primary" onclick="showAddAssetModal()">+ Añadir Activo</button>
            </div>
        `;
        return;
    }

    container.innerHTML = this.assets.map(asset => `
        <div class="asset-item">
            <div class="asset-header">
                <div class="asset-name">${asset.name}</div>
                <div class="asset-amount">€${asset.amount.toLocaleString('es-ES', { minimumFractionDigits: 2 })}</div>
            </div>
            <div class="asset-details">
                <div>Tipo: ${this.getAssetTypeName(asset.type)}</div>
                <div>Institución: ${asset.institution}</div>
            </div>
            <div class="asset-actions">
                <button class="edit-btn" onclick="editAsset(${asset.id})">Editar</button>
                <button class="delete-btn" onclick="deleteAsset(${asset.id})">Eliminar</button>
            </div>
        </div>
    `).join('');
};

VeedorFinanceCenter.prototype.updateLiabilitiesList = function() {
    const container = document.querySelector('#liabilities-list');
    if (!container) return;

    if (this.liabilities.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-title">Sin pasivos</div>
                <div class="empty-state-description">Añade tu primera deuda o préstamo</div>
                <button class="btn-primary" onclick="showAddLiabilityModal()">+ Añadir Pasivo</button>
            </div>
        `;
        return;
    }

    container.innerHTML = this.liabilities.map(liability => `
        <div class="liability-item">
            <div class="liability-header">
                <div class="liability-name">${liability.name}</div>
                <div class="liability-amount">€${liability.amount.toLocaleString('es-ES', { minimumFractionDigits: 2 })}</div>
            </div>
            <div class="liability-details">
                <div>Tipo: ${this.getLiabilityTypeName(liability.type)}</div>
                <div>Institución: ${liability.institution}</div>
                ${liability.monthlyPayment ? `<div>Pago mensual: €${liability.monthlyPayment.toFixed(2)}</div>` : ''}
            </div>
            <div class="liability-actions">
                <button class="edit-btn" onclick="editLiability(${liability.id})">Editar</button>
                <button class="delete-btn" onclick="deleteLiability(${liability.id})">Eliminar</button>
            </div>
        </div>
    `).join('');
};

VeedorFinanceCenter.prototype.getAssetTypeName = function(type) {
    const types = {
        'cash': 'Efectivo',
        'savings': 'Ahorro',
        'investment': 'Inversión',
        'property': 'Propiedad',
        'vehicle': 'Vehículo',
        'other': 'Otro'
    };
    return types[type] || 'Otro';
};

VeedorFinanceCenter.prototype.getLiabilityTypeName = function(type) {
    const types = {
        'mortgage': 'Hipoteca',
        'loan': 'Préstamo',
        'credit': 'Tarjeta de Crédito',
        'debt': 'Deuda',
        'other': 'Otro'
    };
    return types[type] || 'Otro';
};