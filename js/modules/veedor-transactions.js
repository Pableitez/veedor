// ========================================
// VEEDOR TRANSACTIONS - GESTIÓN DE TRANSACCIONES
// ========================================

class VeedorTransactions {
    static addTransaction(transactionData, app) {
        const transaction = {
            id: this.generateId(),
            description: transactionData.description,
            amount: parseFloat(transactionData.amount),
            category: transactionData.category,
            type: transactionData.type,
            date: transactionData.date || new Date().toISOString().split('T')[0],
            envelope: transactionData.envelope || null,
            notes: transactionData.notes || '',
            createdAt: new Date().toISOString()
        };

        app.transactions.push(transaction);
        VeedorStorage.saveTransactions(app.transactions);
        
        VeedorUI.showMessage('Transacción agregada correctamente', 'success');
        this.updateTransactionsList(app);
        VeedorDashboard.updateAll(app);
    }

    static editTransaction(transactionId, app) {
        const transaction = app.transactions.find(t => t.id === transactionId);
        if (!transaction) return;

        this.showTransactionModal(transaction, app);
    }

    static updateTransaction(transactionId, transactionData, app) {
        const index = app.transactions.findIndex(t => t.id === transactionId);
        if (index === -1) return;

        app.transactions[index] = {
            ...app.transactions[index],
            description: transactionData.description,
            amount: parseFloat(transactionData.amount),
            category: transactionData.category,
            type: transactionData.type,
            date: transactionData.date,
            envelope: transactionData.envelope || null,
            notes: transactionData.notes || '',
            updatedAt: new Date().toISOString()
        };

        VeedorStorage.saveTransactions(app.transactions);
        
        VeedorUI.showMessage('Transacción actualizada correctamente', 'success');
        this.updateTransactionsList(app);
        VeedorDashboard.updateAll(app);
    }

    static deleteTransaction(transactionId, app) {
        if (!confirm('¿Estás seguro de que quieres eliminar esta transacción?')) return;

        app.transactions = app.transactions.filter(t => t.id !== transactionId);
        VeedorStorage.saveTransactions(app.transactions);
        
        VeedorUI.showMessage('Transacción eliminada correctamente', 'success');
        this.updateTransactionsList(app);
        VeedorDashboard.updateAll(app);
    }

    static handleTransactionSubmit(data, app) {
        const transactionId = data.id;
        
        if (transactionId) {
            this.updateTransaction(transactionId, data, app);
        } else {
            this.addTransaction(data, app);
        }
    }

    static updateTransactionsList(app) {
        const container = document.querySelector('.transactions-list');
        if (!container) return;

        const filteredTransactions = VeedorUI.filterTransactions(app.transactions, app.filters);
        
        if (filteredTransactions.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📊</div>
                    <div class="empty-state-title">No hay transacciones</div>
                    <div class="empty-state-description">Agrega tu primera transacción para comenzar</div>
                </div>
            `;
            return;
        }

        container.innerHTML = filteredTransactions.map(transaction => `
            <div class="transaction-item">
                <div class="transaction-icon" style="background-color: ${this.getCategoryColor(transaction.category, app.categories)}">
                    ${this.getCategoryIcon(transaction.category)}
                </div>
                <div class="transaction-info">
                    <div class="transaction-description">${transaction.description}</div>
                    <div class="transaction-meta">
                        <span>${VeedorUtils.formatDate(transaction.date)}</span>
                        <span>${this.getCategoryName(transaction.category, app.categories)}</span>
                        ${transaction.envelope ? `<span>Sobre: ${this.getEnvelopeName(transaction.envelope, app.envelopes)}</span>` : ''}
                    </div>
                </div>
                <div class="transaction-amount ${transaction.type}">
                    ${transaction.type === 'income' ? '+' : '-'}${VeedorCalculators.formatCurrency(transaction.amount)}
                </div>
                <div class="transaction-actions">
                    <button class="edit-btn" data-action="edit-transaction" data-id="${transaction.id}">
                        ✏
                    </button>
                    <button class="delete-btn" data-action="delete-transaction" data-id="${transaction.id}">
                        🗑
                    </button>
                </div>
            </div>
        `).join('');
    }

    static showTransactionModal(transaction = null, app) {
        const modalId = 'transaction-modal';
        let modal = document.getElementById(modalId);
        
        if (!modal) {
            modal = this.createTransactionModal(modalId);
            document.body.appendChild(modal);
        }

        // Llenar formulario si es edición
        if (transaction) {
            this.populateTransactionForm(modal, transaction);
        } else {
            this.clearTransactionForm(modal);
        }

        VeedorUI.showModal(modalId);
    }

    static createTransactionModal(modalId) {
        const modal = document.createElement('div');
        modal.id = modalId;
        modal.className = 'modal';
        
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>${transaction ? 'Editar Transacción' : 'Nueva Transacción'}</h2>
                    <button class="close-btn" onclick="VeedorUI.closeModal('${modalId}')">×</button>
                </div>
                <form class="modal-form" data-form-type="transaction">
                    <input type="hidden" name="id" value="">
                    
                    <div class="form-group">
                        <label for="description">Descripción *</label>
                        <input type="text" id="description" name="description" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="amount">Cantidad *</label>
                        <input type="number" id="amount" name="amount" step="0.01" min="0" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="type">Tipo *</label>
                        <select id="type" name="type" required>
                            <option value="expense">Gasto</option>
                            <option value="income">Ingreso</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="category">Categoría *</label>
                        <select id="category" name="category" required>
                            <option value="">Seleccionar categoría</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="date">Fecha *</label>
                        <input type="date" id="date" name="date" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="envelope">Sobre (opcional)</label>
                        <select id="envelope" name="envelope">
                            <option value="">Sin sobre</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="notes">Notas</label>
                        <textarea id="notes" name="notes" rows="3"></textarea>
                    </div>
                    
                    <div class="form-actions">
                        <button type="button" class="btn btn-outline" onclick="VeedorUI.closeModal('${modalId}')">
                            Cancelar
                        </button>
                        <button type="submit" class="btn btn-primary">
                            ${transaction ? 'Actualizar' : 'Agregar'}
                        </button>
                    </div>
                </form>
            </div>
        `;
        
        return modal;
    }

    static populateTransactionForm(modal, transaction) {
        const form = modal.querySelector('form');
        form.querySelector('[name="id"]').value = transaction.id;
        form.querySelector('[name="description"]').value = transaction.description;
        form.querySelector('[name="amount"]').value = transaction.amount;
        form.querySelector('[name="type"]').value = transaction.type;
        form.querySelector('[name="category"]').value = transaction.category;
        form.querySelector('[name="date"]').value = transaction.date;
        form.querySelector('[name="envelope"]').value = transaction.envelope || '';
        form.querySelector('[name="notes"]').value = transaction.notes || '';
    }

    static clearTransactionForm(modal) {
        const form = modal.querySelector('form');
        form.reset();
        form.querySelector('[name="date"]').value = new Date().toISOString().split('T')[0];
    }

    static populateCategoryOptions(select, categories, type = null) {
        select.innerHTML = '<option value="">Seleccionar categoría</option>';
        
        categories.forEach(category => {
            if (!type || category.id !== 'income' || type === 'income') {
                const option = document.createElement('option');
                option.value = category.id;
                option.textContent = category.name;
                select.appendChild(option);
            }
        });
    }

    static populateEnvelopeOptions(select, envelopes) {
        select.innerHTML = '<option value="">Sin sobre</option>';
        
        envelopes.forEach(envelope => {
            const option = document.createElement('option');
            option.value = envelope.id;
            option.textContent = envelope.name;
            select.appendChild(option);
        });
    }

    static updateTransactionSummary(app) {
        const summary = this.calculateTransactionSummary(app.transactions);
        
        // Actualizar resumen en la interfaz
        this.updateElement('.transactions-summary .summary-value.positive', 
            VeedorCalculators.formatCurrency(summary.totalIncome));
        this.updateElement('.transactions-summary .summary-value.negative', 
            VeedorCalculators.formatCurrency(summary.totalExpenses));
        this.updateElement('.transactions-summary .summary-value', 
            VeedorCalculators.formatCurrency(summary.balance));
    }

    static calculateTransactionSummary(transactions) {
        const totalIncome = VeedorCalculators.calculateTotalIncome(transactions);
        const totalExpenses = VeedorCalculators.calculateTotalExpenses(transactions);
        const balance = VeedorCalculators.calculateBalance(transactions);
        
        return {
            totalIncome,
            totalExpenses,
            balance,
            count: transactions.length
        };
    }

    static exportTransactions(transactions) {
        const csvContent = this.convertToCSV(transactions);
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', `transacciones-${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    static convertToCSV(transactions) {
        const headers = ['Fecha', 'Descripción', 'Tipo', 'Categoría', 'Cantidad', 'Notas'];
        const rows = transactions.map(t => [
            t.date,
            t.description,
            t.type === 'income' ? 'Ingreso' : 'Gasto',
            t.category,
            t.amount,
            t.notes || ''
        ]);
        
        return [headers, ...rows].map(row => 
            row.map(field => `"${field}"`).join(',')
        ).join('\n');
    }

    // Utilidades
    static generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

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

    static getEnvelopeName(envelopeId, envelopes) {
        const envelope = envelopes.find(e => e.id === envelopeId);
        return envelope ? envelope.name : 'Desconocido';
    }
}

// Exportar para uso global
window.VeedorTransactions = VeedorTransactions;
