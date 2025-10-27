// ========================================
// VEEDOR DEMO - CENTRO DE FINANZAS PERSONAL
// ========================================

class VeedorDemo {
    constructor() {
        this.transactions = [];
        this.budgets = [];
        this.goals = [];
        this.categories = [
            { id: 'food', name: 'Comida', icon: '🍽️', color: '#FF6B6B' },
            { id: 'transport', name: 'Transporte', icon: '🚗', color: '#4ECDC4' },
            { id: 'entertainment', name: 'Entretenimiento', icon: '🎬', icon: '#45B7D1' },
            { id: 'health', name: 'Salud', icon: '🏥', color: '#96CEB4' },
            { id: 'shopping', name: 'Compras', icon: '🛍️', color: '#FFEAA7' },
            { id: 'utilities', name: 'Servicios', icon: '⚡', color: '#DDA0DD' },
            { id: 'income', name: 'Ingresos', icon: '💰', color: '#98D8C8' },
            { id: 'other', name: 'Otros', icon: '📦', color: '#F7DC6F' }
        ];
        
        this.init();
    }

    init() {
        this.loadDemoData();
        this.setupEventListeners();
        this.updateDashboard();
        this.showTab('overview');
    }

    // ========================================
    // DATOS DE DEMO REALISTAS
    // ========================================
    loadDemoData() {
        // Transacciones de ejemplo
        this.transactions = [
            {
                id: 1,
                description: 'Supermercado Carrefour',
                amount: -85.50,
                category: 'food',
                date: '2024-12-15',
                type: 'expense'
            },
            {
                id: 2,
                description: 'Gasolina Shell',
                amount: -45.00,
                category: 'transport',
                date: '2024-12-14',
                type: 'expense'
            },
            {
                id: 3,
                description: 'Nómina Diciembre',
                amount: 2500.00,
                category: 'income',
                date: '2024-12-01',
                type: 'income'
            },
            {
                id: 4,
                description: 'Netflix',
                amount: -12.99,
                category: 'entertainment',
                date: '2024-12-10',
                type: 'expense'
            },
            {
                id: 5,
                description: 'Farmacia',
                amount: -23.45,
                category: 'health',
                date: '2024-12-12',
                type: 'expense'
            },
            {
                id: 6,
                description: 'Zara',
                amount: -67.80,
                category: 'shopping',
                date: '2024-12-11',
                type: 'expense'
            },
            {
                id: 7,
                description: 'Luz',
                amount: -89.20,
                category: 'utilities',
                date: '2024-12-05',
                type: 'expense'
            },
            {
                id: 8,
                description: 'Freelance',
                amount: 350.00,
                category: 'income',
                date: '2024-12-08',
                type: 'income'
            }
        ];

        // Presupuestos
        this.budgets = [
            {
                id: 1,
                category: 'food',
                limit: 300,
                spent: 85.50,
                period: 'monthly'
            },
            {
                id: 2,
                category: 'transport',
                limit: 150,
                spent: 45.00,
                period: 'monthly'
            },
            {
                id: 3,
                category: 'entertainment',
                limit: 100,
                spent: 12.99,
                period: 'monthly'
            },
            {
                id: 4,
                category: 'shopping',
                limit: 200,
                spent: 67.80,
                period: 'monthly'
            }
        ];

        // Objetivos
        this.goals = [
            {
                id: 1,
                name: 'Vacaciones de Verano',
                target: 1500,
                current: 800,
                deadline: '2025-06-01',
                category: 'travel'
            },
            {
                id: 2,
                name: 'Fondo de Emergencia',
                target: 5000,
                current: 2000,
                deadline: '2025-12-31',
                category: 'emergency'
            },
            {
                id: 3,
                name: 'Nuevo Portátil',
                target: 1200,
                current: 450,
                deadline: '2025-03-15',
                category: 'technology'
            }
        ];
    }

    // ========================================
    // EVENT LISTENERS
    // ========================================
    setupEventListeners() {
        // Tabs del dashboard
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tabName = e.target.textContent.toLowerCase();
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
        });

        // Formularios
        this.setupForms();
    }

    setupForms() {
        // Formulario de nueva transacción
        const transactionForm = document.getElementById('transaction-form');
        if (transactionForm) {
            transactionForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.addTransaction();
            });
        }
    }

    // ========================================
    // NAVEGACIÓN ENTRE TABS
    // ========================================
    showTab(tabName) {
        // Ocultar todos los tabs
        document.querySelectorAll('.tab-panel').forEach(panel => {
            panel.classList.remove('active');
        });
        
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        // Mostrar tab seleccionado
        const targetPanel = document.getElementById(tabName);
        const targetBtn = document.querySelector(`[onclick="showTab('${tabName}')"]`);
        
        if (targetPanel) targetPanel.classList.add('active');
        if (targetBtn) targetBtn.classList.add('active');

        // Actualizar contenido específico del tab
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
            case 'goals':
                this.updateGoals();
                break;
            case 'analytics':
                this.updateAnalytics();
                break;
        }
    }

    // ========================================
    // DASHBOARD PRINCIPAL
    // ========================================
    updateDashboard() {
        this.updateFinancialSummary();
        this.updateOverview();
    }

    updateFinancialSummary() {
        const totals = this.calculateTotals();
        
        // Balance total
        const balanceElement = document.querySelector('.balance-amount');
        if (balanceElement) {
            balanceElement.textContent = `€${totals.balance.toFixed(2)}`;
        }

        // Ingresos
        const incomeElement = document.querySelector('.balance-card:nth-child(2) .balance-amount');
        if (incomeElement) {
            incomeElement.textContent = `€${totals.income.toFixed(2)}`;
        }

        // Gastos
        const expensesElement = document.querySelector('.balance-card:nth-child(3) .balance-amount');
        if (expensesElement) {
            expensesElement.textContent = `€${totals.expenses.toFixed(2)}`;
        }
    }

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

    // ========================================
    // TAB OVERVIEW
    // ========================================
    updateOverview() {
        this.updateRecentTransactions();
        this.updateBudgetsOverview();
        this.updateGoalsOverview();
    }

    updateRecentTransactions() {
        const container = document.querySelector('#overview .transaction-list');
        if (!container) return;

        const recentTransactions = this.transactions
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5);

        container.innerHTML = recentTransactions.map(transaction => {
            const category = this.categories.find(c => c.id === transaction.category);
            const isPositive = transaction.amount > 0;
            
            return `
                <div class="transaction-item">
                    <div class="transaction-info">
                        <span class="transaction-category">${category ? category.name : 'Otros'}</span>
                        <span class="transaction-description">${transaction.description}</span>
                        <span class="transaction-date">${this.formatDate(transaction.date)}</span>
                    </div>
                    <span class="transaction-amount ${isPositive ? 'positive' : 'negative'}">
                        ${isPositive ? '+' : ''}€${Math.abs(transaction.amount).toFixed(2)}
                    </span>
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
            const status = percentage > 90 ? 'warning' : percentage > 70 ? 'good' : 'excellent';
            
            return `
                <div class="budget-item">
                    <div class="budget-info">
                        <span class="budget-category">${category ? category.name : budget.category}</span>
                        <span class="budget-progress">€${budget.spent.toFixed(2)} / €${budget.limit.toFixed(2)}</span>
                    </div>
                    <div class="budget-bar">
                        <div class="budget-fill ${status}" style="width: ${Math.min(percentage, 100)}%"></div>
                    </div>
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
            
            return `
                <div class="goal-item">
                    <div class="goal-info">
                        <span class="goal-name">${goal.name}</span>
                        <span class="goal-progress">€${goal.current.toFixed(2)} / €${goal.target.toFixed(2)}</span>
                    </div>
                    <div class="goal-bar">
                        <div class="goal-fill" style="width: ${Math.min(percentage, 100)}%"></div>
                    </div>
                    <div class="goal-details">
                        <span class="goal-percentage">${percentage.toFixed(1)}% completado</span>
                        <span class="goal-deadline">${daysLeft} días restantes</span>
                    </div>
                </div>
            `;
        }).join('');
    }

    // ========================================
    // TAB TRANSACCIONES
    // ========================================
    updateTransactions() {
        const container = document.querySelector('#transactions .transactions-list');
        if (!container) return;

        const sortedTransactions = this.transactions
            .sort((a, b) => new Date(b.date) - new Date(a.date));

        container.innerHTML = sortedTransactions.map(transaction => {
            const category = this.categories.find(c => c.id === transaction.category);
            const isPositive = transaction.amount > 0;
            
            return `
                <div class="transaction-item">
                    <div class="transaction-info">
                        <span class="transaction-category">${category ? category.name : 'Otros'}</span>
                        <span class="transaction-description">${transaction.description}</span>
                        <span class="transaction-date">${this.formatDate(transaction.date)}</span>
                    </div>
                    <span class="transaction-amount ${isPositive ? 'positive' : 'negative'}">
                        ${isPositive ? '+' : ''}€${Math.abs(transaction.amount).toFixed(2)}
                    </span>
                </div>
            `;
        }).join('');
    }

    // ========================================
    // TAB PRESUPUESTOS
    // ========================================
    updateBudgets() {
        const container = document.querySelector('#budgets .budgets-grid');
        if (!container) return;

        container.innerHTML = this.budgets.map(budget => {
            const category = this.categories.find(c => c.id === budget.category);
            const percentage = (budget.spent / budget.limit) * 100;
            const remaining = budget.limit - budget.spent;
            const status = percentage > 90 ? 'warning' : percentage > 70 ? 'good' : 'excellent';
            
            return `
                <div class="budget-card">
                    <h4>${category ? category.name : budget.category}</h4>
                    <div class="budget-amount">€${budget.spent.toFixed(2)} / €${budget.limit.toFixed(2)}</div>
                    <div class="budget-bar">
                        <div class="budget-fill ${status}" style="width: ${Math.min(percentage, 100)}%"></div>
                    </div>
                    <div class="budget-status ${status}">${percentage.toFixed(1)}% usado</div>
                    <div class="budget-remaining">€${remaining.toFixed(2)} restantes</div>
                </div>
            `;
        }).join('');
    }

    // ========================================
    // TAB OBJETIVOS
    // ========================================
    updateGoals() {
        const container = document.querySelector('#goals .goals-grid');
        if (!container) return;

        container.innerHTML = this.goals.map(goal => {
            const percentage = (goal.current / goal.target) * 100;
            const daysLeft = Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24));
            const monthlyNeeded = (goal.target - goal.current) / Math.max(daysLeft / 30, 1);
            
            return `
                <div class="goal-card">
                    <h4>${goal.name}</h4>
                    <div class="goal-amount">€${goal.current.toFixed(2)} / €${goal.target.toFixed(2)}</div>
                    <div class="goal-bar">
                        <div class="goal-fill" style="width: ${Math.min(percentage, 100)}%"></div>
                    </div>
                    <div class="goal-progress">${percentage.toFixed(1)}% completado</div>
                    <div class="goal-details">
                        <div class="goal-deadline">${daysLeft} días restantes</div>
                        <div class="goal-monthly">€${monthlyNeeded.toFixed(2)}/mes necesarios</div>
                    </div>
                </div>
            `;
        }).join('');
    }

    // ========================================
    // TAB ANÁLISIS
    // ========================================
    updateAnalytics() {
        this.updateCategoryChart();
        this.updateTrendsChart();
    }

    updateCategoryChart() {
        const container = document.querySelector('#analytics .analytics-chart');
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
                    <div class="chart-bar">
                        <div class="bar-fill" style="width: ${percentage}%; background: ${categoryInfo?.color || '#8B5CF6'};"></div>
                        <span class="bar-label">${categoryInfo?.name || category} (€${amount.toFixed(2)})</span>
                    </div>
                `;
            }).join('');
    }

    updateTrendsChart() {
        const container = document.querySelector('#analytics .trend-info');
        if (!container) return;

        const trends = this.calculateTrends();
        
        container.innerHTML = `
            <div class="trend-item">
                <span class="trend-label">Ingresos</span>
                <span class="trend-value ${trends.income > 0 ? 'positive' : 'negative'}">${trends.income > 0 ? '+' : ''}${trends.income.toFixed(1)}%</span>
            </div>
            <div class="trend-item">
                <span class="trend-label">Gastos</span>
                <span class="trend-value ${trends.expenses < 0 ? 'positive' : 'negative'}">${trends.expenses > 0 ? '+' : ''}${trends.expenses.toFixed(1)}%</span>
            </div>
            <div class="trend-item">
                <span class="trend-label">Ahorro</span>
                <span class="trend-value ${trends.savings > 0 ? 'positive' : 'negative'}">${trends.savings > 0 ? '+' : ''}${trends.savings.toFixed(1)}%</span>
            </div>
        `;
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

    calculateTrends() {
        // Simulación de tendencias basadas en datos actuales
        const totals = this.calculateTotals();
        const savingsRate = totals.balance / totals.income * 100;
        
        return {
            income: 8.5, // Simulado
            expenses: -3.2, // Simulado
            savings: savingsRate
        };
    }

    // ========================================
    // MODALES Y FORMULARIOS
    // ========================================
    showAddTransactionModal() {
        // Crear modal dinámicamente
        const modal = document.createElement('div');
        modal.className = 'modal show';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Nueva Transacción</h2>
                    <button class="close-btn" onclick="this.closest('.modal').remove()">&times;</button>
                </div>
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
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Event listener para el formulario
        modal.querySelector('#new-transaction-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addTransaction();
            modal.remove();
        });
    }

    addTransaction() {
        const form = document.getElementById('new-transaction-form');
        if (!form) return;

        const formData = new FormData(form);
        const type = document.getElementById('transaction-type').value;
        const amount = parseFloat(document.getElementById('transaction-amount').value);
        const description = document.getElementById('transaction-description').value;
        const category = document.getElementById('transaction-category').value;
        const date = document.getElementById('transaction-date').value;

        const transaction = {
            id: Date.now(),
            description,
            amount: type === 'income' ? amount : -amount,
            category,
            date,
            type
        };

        this.transactions.push(transaction);
        this.updateDashboard();
        this.showTab('transactions');
        
        // Mostrar notificación
        this.showNotification('Transacción agregada correctamente', 'success');
    }

    showAddBudgetModal() {
        // Implementar modal de presupuesto
        this.showNotification('Funcionalidad de presupuestos próximamente', 'info');
    }

    showAddGoalModal() {
        // Implementar modal de objetivos
        this.showNotification('Funcionalidad de objetivos próximamente', 'info');
    }

    // ========================================
    // UTILIDADES
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
            month: 'short' 
        });
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#F44336' : '#2196F3'};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// ========================================
// FUNCIONES GLOBALES
// ========================================
let veedorDemo;

// Inicializar cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    veedorDemo = new VeedorDemo();
});

// Funciones globales para HTML
function showTab(tabName) {
    if (veedorDemo) {
        veedorDemo.showTab(tabName);
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
        themeIcon.textContent = newTheme === 'dark' ? '☀️' : '🌙';
    }
}

function loadTheme() {
    const savedTheme = localStorage.getItem('veedor-theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        document.body.setAttribute('data-theme', savedTheme);
        const themeIcon = document.querySelector('.theme-icon');
        if (themeIcon) {
            themeIcon.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
        }
    } else {
        const defaultTheme = 'dark';
        document.documentElement.setAttribute('data-theme', defaultTheme);
        document.body.setAttribute('data-theme', defaultTheme);
        const themeIcon = document.querySelector('.theme-icon');
        if (themeIcon) {
            themeIcon.textContent = '☀️';
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

// Cerrar menú al hacer click fuera
document.addEventListener('click', function(event) {
    const dropdown = document.querySelector('.nav-dropdown');
    if (dropdown && !dropdown.contains(event.target)) {
        dropdown.classList.remove('active');
    }
});

// CSS adicional para animaciones
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .notification {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        font-weight: 500;
    }
    
    .budget-fill.excellent {
        background: #4CAF50;
    }
    
    .budget-fill.good {
        background: #FF9800;
    }
    
    .budget-fill.warning {
        background: #F44336;
    }
    
    .goal-fill {
        background: linear-gradient(90deg, #8B5CF6, #A855F7);
        height: 8px;
        border-radius: 4px;
        transition: width 0.3s ease;
    }
    
    .chart-bar {
        margin-bottom: 12px;
        display: flex;
        align-items: center;
        gap: 12px;
    }
    
    .bar-fill {
        height: 20px;
        border-radius: 10px;
        min-width: 4px;
        transition: width 0.3s ease;
    }
    
    .bar-label {
        font-size: 0.9rem;
        color: var(--text-primary);
        font-weight: 500;
    }
`;
document.head.appendChild(style);
