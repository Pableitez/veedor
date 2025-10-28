// ========================================
// TRANSACTIONS MODULE
// ========================================

class TransactionsModule {
    constructor(core) {
        this.core = core;
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Event listeners específicos para transacciones
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('add-transaction-btn')) {
                this.showAddTransactionModal();
            } else if (e.target.classList.contains('edit-transaction-btn')) {
                this.editTransaction(e.target.dataset.id);
            } else if (e.target.classList.contains('delete-transaction-btn')) {
                this.deleteTransaction(e.target.dataset.id);
            }
        });
    }

    showAddTransactionModal() {
        const modal = document.createElement('div');
        modal.className = 'modal show';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Nueva Transacción</h2>
                    <button class="close-btn" onclick="this.closest('.modal').remove()">×</button>
                </div>
                <form class="modal-form" data-form-type="transaction">
                    <div class="form-group">
                        <label for="transaction-description">Descripción</label>
                        <input type="text" id="transaction-description" name="description" required>
                    </div>
                    <div class="form-group">
                        <label for="transaction-amount">Cantidad</label>
                        <input type="number" id="transaction-amount" name="amount" step="0.01" required>
                    </div>
                    <div class="form-group">
                        <label for="transaction-category">Categoría</label>
                        <select id="transaction-category" name="category" required>
                            <option value="">Seleccionar categoría</option>
                            ${this.core.categories.map(cat => 
                                `<option value="${cat.id}">${cat.name}</option>`
                            ).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="transaction-type">Tipo</label>
                        <select id="transaction-type" name="type" required>
                            <option value="expense">Gasto</option>
                            <option value="income">Ingreso</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="transaction-date">Fecha</label>
                        <input type="date" id="transaction-date" name="date" required>
                    </div>
                    <div class="form-actions">
                        <button type="button" class="btn btn-outline" onclick="this.closest('.modal').remove()">Cancelar</button>
                        <button type="submit" class="btn btn-primary">Guardar</button>
                    </div>
                </form>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Establecer fecha actual por defecto
        const dateInput = modal.querySelector('#transaction-date');
        dateInput.value = new Date().toISOString().split('T')[0];
    }

    saveTransaction(form) {
        const formData = new FormData(form);
        const transaction = {
            id: Date.now(),
            description: formData.get('description'),
            amount: parseFloat(formData.get('amount')),
            category: formData.get('category'),
            type: formData.get('type'),
            date: formData.get('date')
        };
        
        // Ajustar cantidad si es un gasto
        if (transaction.type === 'expense') {
            transaction.amount = -Math.abs(transaction.amount);
        }
        
        this.core.transactions.push(transaction);
        this.core.saveToStorage();
        this.core.updateDashboard();
        this.core.showMessage('Transacción guardada correctamente', 'success');
        
        // Cerrar modal
        form.closest('.modal').remove();
    }

    editTransaction(id) {
        const transaction = this.core.transactions.find(t => t.id == id);
        if (!transaction) return;
        
        const modal = document.createElement('div');
        modal.className = 'modal show';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Editar Transacción</h2>
                    <button class="close-btn" onclick="this.closest('.modal').remove()">×</button>
                </div>
                <form class="modal-form" data-form-type="transaction" data-transaction-id="${id}">
                    <div class="form-group">
                        <label for="edit-transaction-description">Descripción</label>
                        <input type="text" id="edit-transaction-description" name="description" value="${transaction.description}" required>
                    </div>
                    <div class="form-group">
                        <label for="edit-transaction-amount">Cantidad</label>
                        <input type="number" id="edit-transaction-amount" name="amount" step="0.01" value="${Math.abs(transaction.amount)}" required>
                    </div>
                    <div class="form-group">
                        <label for="edit-transaction-category">Categoría</label>
                        <select id="edit-transaction-category" name="category" required>
                            <option value="">Seleccionar categoría</option>
                            ${this.core.categories.map(cat => 
                                `<option value="${cat.id}" ${cat.id === transaction.category ? 'selected' : ''}>${cat.name}</option>`
                            ).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="edit-transaction-type">Tipo</label>
                        <select id="edit-transaction-type" name="type" required>
                            <option value="expense" ${transaction.type === 'expense' ? 'selected' : ''}>Gasto</option>
                            <option value="income" ${transaction.type === 'income' ? 'selected' : ''}>Ingreso</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="edit-transaction-date">Fecha</label>
                        <input type="date" id="edit-transaction-date" name="date" value="${transaction.date}" required>
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

    deleteTransaction(id) {
        if (confirm('¿Estás seguro de que quieres eliminar esta transacción?')) {
            this.core.transactions = this.core.transactions.filter(t => t.id != id);
            this.core.saveToStorage();
            this.core.updateDashboard();
            this.core.showMessage('Transacción eliminada correctamente', 'success');
        }
    }

    updateTransactionsTab() {
        const transactionsList = document.querySelector('.transactions-list');
        if (!transactionsList) return;
        
        const filteredTransactions = this.getFilteredTransactions();
        
        if (filteredTransactions.length === 0) {
            transactionsList.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📊</div>
                    <div class="empty-state-title">No hay transacciones</div>
                    <div class="empty-state-description">Agrega tu primera transacción para comenzar</div>
                </div>
            `;
            return;
        }
        
        transactionsList.innerHTML = filteredTransactions.map(transaction => `
            <div class="transaction-item">
                <div class="transaction-icon" style="background-color: ${this.getCategoryColor(transaction.category)}">
                    ${this.getCategoryIcon(transaction.category)}
                </div>
                <div class="transaction-info">
                    <div class="transaction-description">${transaction.description}</div>
                    <div class="transaction-meta">
                        <span>${this.core.formatDate(transaction.date)}</span>
                        <span>${this.getCategoryName(transaction.category)}</span>
                    </div>
                </div>
                <div class="transaction-amount ${transaction.amount > 0 ? 'positive' : 'negative'}">
                    ${this.core.formatCurrency(transaction.amount)}
                </div>
                <div class="transaction-actions">
                    <button class="btn btn-sm edit-transaction-btn" data-id="${transaction.id}">✏</button>
                    <button class="btn btn-sm btn-danger delete-transaction-btn" data-id="${transaction.id}">🗑</button>
                </div>
            </div>
        `).join('');
    }

    getFilteredTransactions() {
        let filtered = [...this.core.transactions];
        
        // Filtrar por categoría
        if (this.core.filters.category) {
            filtered = filtered.filter(t => t.category === this.core.filters.category);
        }
        
        // Filtrar por tipo
        if (this.core.filters.type) {
            filtered = filtered.filter(t => t.type === this.core.filters.type);
        }
        
        // Filtrar por búsqueda
        if (this.core.filters.search) {
            const searchTerm = this.core.filters.search.toLowerCase();
            filtered = filtered.filter(t => 
                t.description.toLowerCase().includes(searchTerm) ||
                this.getCategoryName(t.category).toLowerCase().includes(searchTerm)
            );
        }
        
        // Ordenar por fecha (más recientes primero)
        return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    getCategoryColor(categoryId) {
        const category = this.core.categories.find(c => c.id === categoryId);
        return category ? category.color : '#6B7280';
    }

    getCategoryName(categoryId) {
        const category = this.core.categories.find(c => c.id === categoryId);
        return category ? category.name : 'Otros';
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

    updateRecentTransactions() {
        const recentTransactions = document.querySelector('.recent-transactions');
        if (!recentTransactions) return;
        
        const recent = this.core.transactions
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5);
        
        if (recent.length === 0) {
            recentTransactions.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📊</div>
                    <div class="empty-state-title">No hay transacciones recientes</div>
                </div>
            `;
            return;
        }
        
        recentTransactions.innerHTML = recent.map(transaction => `
            <div class="transaction-item">
                <div class="transaction-icon" style="background-color: ${this.getCategoryColor(transaction.category)}">
                    ${this.getCategoryIcon(transaction.category)}
                </div>
                <div class="transaction-info">
                    <div class="transaction-description">${transaction.description}</div>
                    <div class="transaction-meta">
                        <span>${this.core.formatDate(transaction.date)}</span>
                        <span>${this.getCategoryName(transaction.category)}</span>
                    </div>
                </div>
                <div class="transaction-amount ${transaction.amount > 0 ? 'positive' : 'negative'}">
                    ${this.core.formatCurrency(transaction.amount)}
                </div>
            </div>
        `).join('');
    }
}

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TransactionsModule;
}
