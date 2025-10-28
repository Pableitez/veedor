// ========================================
// VEEDOR BUDGETS - GESTIÓN DE PRESUPUESTOS
// ========================================

class VeedorBudgets {
    static addBudget(budgetData, app) {
        const budget = {
            id: this.generateId(),
            name: budgetData.name,
            category: budgetData.category,
            amount: parseFloat(budgetData.amount),
            period: budgetData.period || 'monthly',
            createdAt: new Date().toISOString()
        };

        app.budgets.push(budget);
        VeedorStorage.saveBudgets(app.budgets);
        
        VeedorUI.showMessage('Presupuesto creado correctamente', 'success');
        this.updateBudgetsList(app);
        VeedorDashboard.updateAll(app);
    }

    static editBudget(budgetId, app) {
        const budget = app.budgets.find(b => b.id === budgetId);
        if (!budget) return;

        this.showBudgetModal(budget, app);
    }

    static updateBudget(budgetId, budgetData, app) {
        const index = app.budgets.findIndex(b => b.id === budgetId);
        if (index === -1) return;

        app.budgets[index] = {
            ...app.budgets[index],
            name: budgetData.name,
            category: budgetData.category,
            amount: parseFloat(budgetData.amount),
            period: budgetData.period,
            updatedAt: new Date().toISOString()
        };

        VeedorStorage.saveBudgets(app.budgets);
        
        VeedorUI.showMessage('Presupuesto actualizado correctamente', 'success');
        this.updateBudgetsList(app);
        VeedorDashboard.updateAll(app);
    }

    static deleteBudget(budgetId, app) {
        if (!confirm('¿Estás seguro de que quieres eliminar este presupuesto?')) return;

        app.budgets = app.budgets.filter(b => b.id !== budgetId);
        VeedorStorage.saveBudgets(app.budgets);
        
        VeedorUI.showMessage('Presupuesto eliminado correctamente', 'success');
        this.updateBudgetsList(app);
        VeedorDashboard.updateAll(app);
    }

    static handleBudgetSubmit(data, app) {
        const budgetId = data.id;
        
        if (budgetId) {
            this.updateBudget(budgetId, data, app);
        } else {
            this.addBudget(data, app);
        }
    }

    static updateBudgetsList(app) {
        const container = document.querySelector('.budgets-grid');
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
                <div class="budget-card ${status}">
                    <div class="budget-header">
                        <h3>${budget.name}</h3>
                        <div class="budget-actions">
                            <button class="edit-btn" data-action="edit-budget" data-id="${budget.id}">✏</button>
                            <button class="delete-btn" data-action="delete-budget" data-id="${budget.id}">🗑</button>
                        </div>
                    </div>
                    <div class="budget-details">
                        <div>
                            <span class="budget-label">Categoría:</span>
                            <span>${this.getCategoryName(budget.category, app.categories)}</span>
                        </div>
                        <div>
                            <span class="budget-label">Período:</span>
                            <span>${this.getPeriodText(budget.period)}</span>
                        </div>
                    </div>
                    <div class="budget-progress">
                        <div class="budget-bar">
                            <div class="budget-fill ${status}" style="width: ${Math.min(100, progress.percentage)}%"></div>
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

    static showBudgetModal(budget = null, app) {
        const modalId = 'budget-modal';
        let modal = document.getElementById(modalId);
        
        if (!modal) {
            modal = this.createBudgetModal(modalId);
            document.body.appendChild(modal);
        }

        if (budget) {
            this.populateBudgetForm(modal, budget);
        } else {
            this.clearBudgetForm(modal);
        }

        VeedorUI.showModal(modalId);
    }

    static createBudgetModal(modalId) {
        const modal = document.createElement('div');
        modal.id = modalId;
        modal.className = 'modal';
        
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Nuevo Presupuesto</h2>
                    <button class="close-btn" onclick="VeedorUI.closeModal('${modalId}')">×</button>
                </div>
                <form class="modal-form" data-form-type="budget">
                    <input type="hidden" name="id" value="">
                    
                    <div class="form-group">
                        <label for="name">Nombre *</label>
                        <input type="text" id="name" name="name" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="category">Categoría *</label>
                        <select id="category" name="category" required>
                            <option value="">Seleccionar categoría</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="amount">Cantidad *</label>
                        <input type="number" id="amount" name="amount" step="0.01" min="0" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="period">Período *</label>
                        <select id="period" name="period" required>
                            <option value="monthly">Mensual</option>
                            <option value="weekly">Semanal</option>
                            <option value="yearly">Anual</option>
                        </select>
                    </div>
                    
                    <div class="form-actions">
                        <button type="button" class="btn btn-outline" onclick="VeedorUI.closeModal('${modalId}')">
                            Cancelar
                        </button>
                        <button type="submit" class="btn btn-primary">
                            Crear
                        </button>
                    </div>
                </form>
            </div>
        `;
        
        return modal;
    }

    static populateBudgetForm(modal, budget) {
        const form = modal.querySelector('form');
        form.querySelector('[name="id"]').value = budget.id;
        form.querySelector('[name="name"]').value = budget.name;
        form.querySelector('[name="category"]').value = budget.category;
        form.querySelector('[name="amount"]').value = budget.amount;
        form.querySelector('[name="period"]').value = budget.period;
    }

    static clearBudgetForm(modal) {
        const form = modal.querySelector('form');
        form.reset();
    }

    static getCategoryName(categoryId, categories) {
        const category = categories.find(c => c.id === categoryId);
        return category ? category.name : 'Otros';
    }

    static getPeriodText(period) {
        const periods = {
            monthly: 'Mensual',
            weekly: 'Semanal',
            yearly: 'Anual'
        };
        return periods[period] || period;
    }

    static generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
}

// Exportar para uso global
window.VeedorBudgets = VeedorBudgets;
