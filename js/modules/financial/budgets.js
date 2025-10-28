// ========================================
// BUDGETS MODULE
// ========================================

class BudgetsModule {
    constructor(core) {
        this.core = core;
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('add-budget-btn')) {
                this.showAddBudgetModal();
            } else if (e.target.classList.contains('edit-budget-btn')) {
                this.editBudget(e.target.dataset.id);
            } else if (e.target.classList.contains('delete-budget-btn')) {
                this.deleteBudget(e.target.dataset.id);
            }
        });
    }

    showAddBudgetModal() {
        const modal = document.createElement('div');
        modal.className = 'modal show';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Nuevo Presupuesto</h2>
                    <button class="close-btn" onclick="this.closest('.modal').remove()">×</button>
                </div>
                <form class="modal-form" data-form-type="budget">
                    <div class="form-group">
                        <label for="budget-name">Nombre</label>
                        <input type="text" id="budget-name" name="name" required>
                    </div>
                    <div class="form-group">
                        <label for="budget-category">Categoría</label>
                        <select id="budget-category" name="category" required>
                            <option value="">Seleccionar categoría</option>
                            ${this.core.categories.map(cat => 
                                `<option value="${cat.id}">${cat.name}</option>`
                            ).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="budget-amount">Presupuesto Mensual</label>
                        <input type="number" id="budget-amount" name="budget" step="0.01" required>
                    </div>
                    <div class="form-group">
                        <label for="budget-color">Color</label>
                        <input type="color" id="budget-color" name="color" value="#8B5CF6">
                    </div>
                    <div class="form-actions">
                        <button type="button" class="btn btn-outline" onclick="this.closest('.modal').remove()">Cancelar</button>
                        <button type="submit" class="btn btn-primary">Guardar</button>
                    </div>
                </form>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    saveBudget(form) {
        const formData = new FormData(form);
        const budget = {
            id: Date.now(),
            name: formData.get('name'),
            category: formData.get('category'),
            budget: parseFloat(formData.get('budget')),
            color: formData.get('color'),
            spent: 0
        };
        
        this.core.budgets.push(budget);
        this.updateBudgetSpent();
        this.core.saveToStorage();
        this.core.updateDashboard();
        this.core.showMessage('Presupuesto creado correctamente', 'success');
        
        form.closest('.modal').remove();
    }

    editBudget(id) {
        const budget = this.core.budgets.find(b => b.id == id);
        if (!budget) return;
        
        const modal = document.createElement('div');
        modal.className = 'modal show';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Editar Presupuesto</h2>
                    <button class="close-btn" onclick="this.closest('.modal').remove()">×</button>
                </div>
                <form class="modal-form" data-form-type="budget" data-budget-id="${id}">
                    <div class="form-group">
                        <label for="edit-budget-name">Nombre</label>
                        <input type="text" id="edit-budget-name" name="name" value="${budget.name}" required>
                    </div>
                    <div class="form-group">
                        <label for="edit-budget-category">Categoría</label>
                        <select id="edit-budget-category" name="category" required>
                            <option value="">Seleccionar categoría</option>
                            ${this.core.categories.map(cat => 
                                `<option value="${cat.id}" ${cat.id === budget.category ? 'selected' : ''}>${cat.name}</option>`
                            ).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="edit-budget-amount">Presupuesto Mensual</label>
                        <input type="number" id="edit-budget-amount" name="budget" step="0.01" value="${budget.budget}" required>
                    </div>
                    <div class="form-group">
                        <label for="edit-budget-color">Color</label>
                        <input type="color" id="edit-budget-color" name="color" value="${budget.color}">
                    </div>
                    <div class="form-actions">
                        <button type="button" class="btn btn-outline" onclick="this.closest('.modal').remove()">Cancelar</button>
                        <button type="submit" class="btn btn-primary">Actualizar</button>
                    </div>
                </form>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    deleteBudget(id) {
        if (confirm('¿Estás seguro de que quieres eliminar este presupuesto?')) {
            this.core.budgets = this.core.budgets.filter(b => b.id != id);
            this.core.saveToStorage();
            this.core.updateDashboard();
            this.core.showMessage('Presupuesto eliminado correctamente', 'success');
        }
    }

    updateBudgetsTab() {
        this.updateBudgetSpent();
        this.updateBudgetsGrid();
        this.updateBudgetsSummary();
    }

    updateBudgetSpent() {
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        
        this.core.budgets.forEach(budget => {
            let spent = 0;
            this.core.transactions.forEach(transaction => {
                const transactionDate = new Date(transaction.date);
                if (transactionDate.getMonth() === currentMonth && 
                    transactionDate.getFullYear() === currentYear &&
                    transaction.category === budget.category &&
                    transaction.type === 'expense') {
                    spent += Math.abs(transaction.amount);
                }
            });
            budget.spent = spent;
        });
    }

    updateBudgetsGrid() {
        const budgetsGrid = document.querySelector('.budgets-grid');
        if (!budgetsGrid) return;
        
        if (this.core.budgets.length === 0) {
            budgetsGrid.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">💰</div>
                    <div class="empty-state-title">No hay presupuestos</div>
                    <div class="empty-state-description">Crea tu primer presupuesto para controlar tus gastos</div>
                </div>
            `;
            return;
        }
        
        budgetsGrid.innerHTML = this.core.budgets.map(budget => {
            const percentage = (budget.spent / budget.budget) * 100;
            const status = this.getBudgetStatus(percentage);
            const remaining = budget.budget - budget.spent;
            
            return `
                <div class="budget-card ${status}">
                    <div class="budget-header">
                        <div class="budget-category">
                            <div class="budget-icon" style="background-color: ${budget.color}">
                                ${this.getCategoryIcon(budget.category)}
                            </div>
                            <div class="budget-name">${budget.name}</div>
                        </div>
                        <div class="budget-status ${status}">${percentage.toFixed(1)}%</div>
                    </div>
                    <div class="budget-progress">
                        <div class="budget-bar">
                            <div class="budget-fill" style="width: ${Math.min(percentage, 100)}%; background-color: ${budget.color}"></div>
                        </div>
                        <div class="budget-amounts">
                            <span>€${budget.spent.toFixed(2)}</span>
                            <span>€${budget.budget.toFixed(2)}</span>
                        </div>
                        <div class="budget-remaining">
                            ${remaining >= 0 ? `Restante: €${remaining.toFixed(2)}` : `Excedido: €${Math.abs(remaining).toFixed(2)}`}
                        </div>
                    </div>
                    <div class="budget-actions">
                        <button class="btn btn-sm edit-budget-btn" data-id="${budget.id}">✏</button>
                        <button class="btn btn-sm btn-danger delete-budget-btn" data-id="${budget.id}">🗑</button>
                    </div>
                </div>
            `;
        }).join('');
    }

    updateBudgetsSummary() {
        const budgetsSummary = document.querySelector('.budgets-summary');
        if (!budgetsSummary) return;
        
        const totalBudget = this.core.budgets.reduce((sum, budget) => sum + budget.budget, 0);
        const totalSpent = this.core.budgets.reduce((sum, budget) => sum + budget.spent, 0);
        const averageUsage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
        const budgetsCount = this.core.budgets.length;
        
        budgetsSummary.innerHTML = `
            <div class="summary-item">
                <span class="summary-label">Presupuestos</span>
                <span class="summary-value">${budgetsCount}</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Total Presupuestado</span>
                <span class="summary-value">€${totalBudget.toFixed(2)}</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Total Gastado</span>
                <span class="summary-value">€${totalSpent.toFixed(2)}</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Uso Promedio</span>
                <span class="summary-value ${averageUsage > 100 ? 'negative' : 'positive'}">${averageUsage.toFixed(1)}%</span>
            </div>
        `;
    }

    updateBudgetsOverview() {
        const budgetsOverview = document.querySelector('.budgets-overview');
        if (!budgetsOverview) return;
        
        const topBudgets = this.core.budgets
            .sort((a, b) => b.spent - a.spent)
            .slice(0, 5);
        
        if (topBudgets.length === 0) {
            budgetsOverview.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">💰</div>
                    <div class="empty-state-title">No hay presupuestos</div>
                </div>
            `;
            return;
        }
        
        budgetsOverview.innerHTML = topBudgets.map(budget => {
            const percentage = (budget.spent / budget.budget) * 100;
            const status = this.getBudgetStatus(percentage);
            
            return `
                <div class="budget-item">
                    <div class="budget-header">
                        <div class="budget-category">
                            <div class="budget-icon" style="background-color: ${budget.color}">
                                ${this.getCategoryIcon(budget.category)}
                            </div>
                            <div class="budget-name">${budget.name}</div>
                        </div>
                        <div class="budget-status ${status}">${percentage.toFixed(1)}%</div>
                    </div>
                    <div class="budget-progress">
                        <div class="budget-bar">
                            <div class="budget-fill" style="width: ${Math.min(percentage, 100)}%; background-color: ${budget.color}"></div>
                        </div>
                        <div class="budget-amounts">
                            <span>€${budget.spent.toFixed(2)}</span>
                            <span>€${budget.budget.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    getBudgetStatus(percentage) {
        if (percentage > 100) return 'critical';
        if (percentage > 90) return 'warning';
        if (percentage > 70) return 'good';
        return 'excellent';
    }

    getCategoryIcon(categoryId) {
        const icons = {
            food: '🍽',
            transport: '🚗',
            entertainment: '🎬',
            health: '🏥',
            shopping: '🛍',
            utilities: '⚡',
            income: '💰',
            other: '📦'
        };
        return icons[categoryId] || '📦';
    }
}

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BudgetsModule;
}
