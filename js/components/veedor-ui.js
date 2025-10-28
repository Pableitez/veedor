// ========================================
// VEEDOR UI - INTERFAZ DE USUARIO
// ========================================

class VeedorUI {
    static setupGlobalListeners(app) {
        // Event listeners para navegación
        this.setupNavigationListeners();
        
        // Event listeners para modales
        this.setupModalListeners();
        
        // Event listeners para formularios
        this.setupFormListeners(app);
        
        // Event listeners para filtros
        this.setupFilterListeners(app);
        
        // Event listeners para botones de acción
        this.setupActionListeners(app);
    }

    static setupNavigationListeners() {
        // Menú móvil
        const hamburger = document.querySelector('.hamburger');
        if (hamburger) {
            hamburger.addEventListener('click', this.toggleMobileMenu);
        }

        // Cerrar menú al hacer clic fuera
        document.addEventListener('click', (event) => {
            const navMenu = document.getElementById('nav-menu');
            const hamburger = document.querySelector('.hamburger');
            const navbar = document.querySelector('.navbar');
            
            if (navMenu && navMenu.classList.contains('active') && 
                !navbar.contains(event.target)) {
                this.closeMobileMenu();
            }
        });

        // Cerrar menú al cambiar tamaño de ventana
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                this.closeMobileMenu();
            }
        });
    }

    static setupModalListeners() {
        // Cerrar modales con Escape
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                this.closeAllModals();
            }
        });

        // Cerrar modales al hacer clic fuera
        document.addEventListener('click', (event) => {
            if (event.target.classList.contains('modal')) {
                this.closeModal(event.target);
            }
        });
    }

    static setupFormListeners(app) {
        // Validación en tiempo real
        document.addEventListener('input', (event) => {
            if (event.target.matches('input[required], select[required]')) {
                this.validateField(event.target);
            }
        });

        // Envío de formularios
        document.addEventListener('submit', (event) => {
            event.preventDefault();
            this.handleFormSubmit(event, app);
        });
    }

    static setupFilterListeners(app) {
        // Filtros de transacciones
        const filterInputs = document.querySelectorAll('.filter-input, .filter-select');
        filterInputs.forEach(input => {
            input.addEventListener('change', () => {
                this.applyFilters(app);
            });
        });

        // Búsqueda
        const searchInput = document.querySelector('.search-input');
        if (searchInput) {
            searchInput.addEventListener('input', this.debounce(() => {
                this.applyFilters(app);
            }, 300));
        }
    }

    static setupActionListeners(app) {
        // Botones de acción
        document.addEventListener('click', (event) => {
            const button = event.target.closest('button');
            if (!button) return;

            const action = button.dataset.action;
            if (!action) return;

            this.handleAction(action, button, app);
        });
    }

    // Navegación
    static toggleMobileMenu() {
        const navMenu = document.getElementById('nav-menu');
        const hamburger = document.querySelector('.hamburger');
        
        if (navMenu && hamburger) {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        }
    }

    static closeMobileMenu() {
        const navMenu = document.getElementById('nav-menu');
        const hamburger = document.querySelector('.hamburger');
        
        if (navMenu && hamburger) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        }
    }

    // Modales
    static showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
            
            // Focus en el primer input
            const firstInput = modal.querySelector('input, select, textarea');
            if (firstInput) {
                setTimeout(() => firstInput.focus(), 100);
            }
        }
    }

    static closeModal(modal) {
        if (typeof modal === 'string') {
            modal = document.getElementById(modal);
        }
        
        if (modal) {
            modal.classList.remove('show');
            document.body.style.overflow = '';
        }
    }

    static closeAllModals() {
        const modals = document.querySelectorAll('.modal.show');
        modals.forEach(modal => this.closeModal(modal));
    }

    // Tabs
    static initializeTabs(app) {
        const tabButtons = document.querySelectorAll('.nav-tab');
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabId = button.dataset.tab;
                this.switchTab(tabId, app);
            });
        });
    }

    static switchTab(tabId, app) {
        // Actualizar botones
        document.querySelectorAll('.nav-tab').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');

        // Actualizar paneles
        document.querySelectorAll('.tab-panel').forEach(panel => {
            panel.classList.remove('active');
        });
        document.getElementById(tabId).classList.add('active');

        // Actualizar estado
        app.currentTab = tabId;

        // Actualizar contenido específico del tab
        this.updateTabContent(tabId, app);
    }

    static updateTabContent(tabId, app) {
        switch (tabId) {
            case 'overview':
                VeedorDashboard.updateOverview(app);
                break;
            case 'transactions':
                VeedorTransactions.updateTransactionsList(app);
                break;
            case 'budgets':
                VeedorBudgets.updateBudgetsList(app);
                break;
            case 'goals':
                VeedorGoals.updateGoalsList(app);
                break;
            case 'analytics':
                VeedorAnalytics.updateAnalytics(app);
                break;
            case 'assets':
                VeedorAssets.updateAssetsList(app);
                break;
        }
    }

    // Formularios
    static validateField(field) {
        const isValid = field.checkValidity();
        field.classList.toggle('invalid', !isValid);
        field.classList.toggle('valid', isValid);
        return isValid;
    }

    static validateForm(form) {
        const fields = form.querySelectorAll('input[required], select[required], textarea[required]');
        let isValid = true;
        
        fields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });
        
        return isValid;
    }

    static handleFormSubmit(event, app) {
        const form = event.target;
        const formType = form.dataset.formType;
        
        if (!this.validateForm(form)) {
            this.showMessage('Por favor, completa todos los campos requeridos', 'error');
            return;
        }

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        switch (formType) {
            case 'transaction':
                VeedorTransactions.handleTransactionSubmit(data, app);
                break;
            case 'budget':
                VeedorBudgets.handleBudgetSubmit(data, app);
                break;
            case 'goal':
                VeedorGoals.handleGoalSubmit(data, app);
                break;
            case 'envelope':
                VeedorEnvelopes.handleEnvelopeSubmit(data, app);
                break;
            case 'asset':
                VeedorAssets.handleAssetSubmit(data, app);
                break;
            case 'liability':
                VeedorLiabilities.handleLiabilitySubmit(data, app);
                break;
        }

        form.reset();
        this.closeModal(form.closest('.modal'));
    }

    // Filtros
    static applyFilters(app) {
        const filters = this.getFilterValues();
        app.filters = { ...app.filters, ...filters };
        
        VeedorStorage.saveFilters(app.filters);
        this.updateFilteredContent(app);
    }

    static getFilterValues() {
        const filters = {};
        
        const categoryFilter = document.querySelector('.filter-category');
        if (categoryFilter) filters.category = categoryFilter.value;
        
        const typeFilter = document.querySelector('.filter-type');
        if (typeFilter) filters.type = typeFilter.value;
        
        const dateFilter = document.querySelector('.filter-date');
        if (dateFilter) filters.dateRange = dateFilter.value;
        
        const searchFilter = document.querySelector('.search-input');
        if (searchFilter) filters.search = searchFilter.value;
        
        return filters;
    }

    static updateFilteredContent(app) {
        const filteredTransactions = this.filterTransactions(app.transactions, app.filters);
        VeedorTransactions.renderTransactionsList(filteredTransactions);
    }

    static filterTransactions(transactions, filters) {
        return transactions.filter(transaction => {
            if (filters.category && transaction.category !== filters.category) return false;
            if (filters.type && transaction.type !== filters.type) return false;
            if (filters.search && !transaction.description.toLowerCase().includes(filters.search.toLowerCase())) return false;
            if (filters.dateRange && !this.isInDateRange(transaction.date, filters.dateRange)) return false;
            return true;
        });
    }

    static isInDateRange(date, range) {
        const transactionDate = new Date(date);
        const now = new Date();
        
        switch (range) {
            case 'today':
                return transactionDate.toDateString() === now.toDateString();
            case 'week':
                const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                return transactionDate >= weekAgo;
            case 'month':
                return transactionDate.getMonth() === now.getMonth() && 
                       transactionDate.getFullYear() === now.getFullYear();
            case 'year':
                return transactionDate.getFullYear() === now.getFullYear();
            default:
                return true;
        }
    }

    // Acciones
    static handleAction(action, button, app) {
        const itemId = button.dataset.id;
        
        switch (action) {
            case 'edit-transaction':
                VeedorTransactions.editTransaction(itemId, app);
                break;
            case 'delete-transaction':
                VeedorTransactions.deleteTransaction(itemId, app);
                break;
            case 'edit-budget':
                VeedorBudgets.editBudget(itemId, app);
                break;
            case 'delete-budget':
                VeedorBudgets.deleteBudget(itemId, app);
                break;
            case 'edit-goal':
                VeedorGoals.editGoal(itemId, app);
                break;
            case 'delete-goal':
                VeedorGoals.deleteGoal(itemId, app);
                break;
            case 'edit-envelope':
                VeedorEnvelopes.editEnvelope(itemId, app);
                break;
            case 'delete-envelope':
                VeedorEnvelopes.deleteEnvelope(itemId, app);
                break;
            case 'edit-asset':
                VeedorAssets.editAsset(itemId, app);
                break;
            case 'delete-asset':
                VeedorAssets.deleteAsset(itemId, app);
                break;
            case 'edit-liability':
                VeedorLiabilities.editLiability(itemId, app);
                break;
            case 'delete-liability':
                VeedorLiabilities.deleteLiability(itemId, app);
                break;
        }
    }

    // Mensajes
    static showMessage(message, type = 'info', duration = 5000) {
        const container = this.getOrCreateMessageContainer();
        const messageEl = this.createMessageElement(message, type);
        
        container.appendChild(messageEl);
        
        // Auto-remove
        if (duration > 0) {
            setTimeout(() => {
                this.removeMessage(messageEl);
            }, duration);
        }
        
        // Animar entrada
        requestAnimationFrame(() => {
            messageEl.classList.add('show');
        });
    }

    static getOrCreateMessageContainer() {
        let container = document.getElementById('notifications-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'notifications-container';
            container.className = 'notifications-container';
            document.body.appendChild(container);
        }
        return container;
    }

    static createMessageElement(message, type) {
        const messageEl = document.createElement('div');
        messageEl.className = `notification-item ${type}`;
        
        messageEl.innerHTML = `
            <div class="notification-icon">${this.getMessageIcon(type)}</div>
            <div class="notification-content">
                <div class="notification-title">${this.getMessageTitle(type)}</div>
                <div class="notification-message">${message}</div>
            </div>
            <button class="notification-close" onclick="VeedorUI.removeMessage(this.parentElement)">×</button>
        `;
        
        return messageEl;
    }

    static getMessageIcon(type) {
        const icons = {
            success: '✓',
            error: '✗',
            warning: '⚠',
            info: 'ℹ'
        };
        return icons[type] || icons.info;
    }

    static getMessageTitle(type) {
        const titles = {
            success: 'Éxito',
            error: 'Error',
            warning: 'Advertencia',
            info: 'Información'
        };
        return titles[type] || titles.info;
    }

    static removeMessage(messageEl) {
        messageEl.classList.add('hide');
        setTimeout(() => {
            if (messageEl.parentNode) {
                messageEl.parentNode.removeChild(messageEl);
            }
        }, 300);
    }

    // Tema
    static setupThemeToggle() {
        const themeToggle = document.querySelector('.theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', this.toggleTheme);
        }
    }

    static toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('veedor_theme', newTheme);
        
        this.showMessage(`Tema cambiado a ${newTheme === 'dark' ? 'oscuro' : 'claro'}`, 'info');
    }

    // Atajos de teclado
    static setupKeyboardShortcuts() {
        document.addEventListener('keydown', (event) => {
            if (event.altKey) {
                switch (event.key) {
                    case '1':
                        event.preventDefault();
                        this.switchTab('overview', window.app);
                        break;
                    case '2':
                        event.preventDefault();
                        this.switchTab('transactions', window.app);
                        break;
                    case '3':
                        event.preventDefault();
                        this.switchTab('budgets', window.app);
                        break;
                    case '4':
                        event.preventDefault();
                        this.switchTab('goals', window.app);
                        break;
                    case '5':
                        event.preventDefault();
                        this.switchTab('analytics', window.app);
                        break;
                    case '6':
                        event.preventDefault();
                        this.switchTab('assets', window.app);
                        break;
                    case 't':
                        event.preventDefault();
                        this.toggleTheme();
                        break;
                }
            }
        });
    }

    // Accesibilidad
    static setupAccessibility() {
        // ARIA labels
        this.addAriaLabels();
        
        // Focus management
        this.setupFocusManagement();
        
        // Screen reader announcements
        this.setupScreenReaderSupport();
    }

    static addAriaLabels() {
        const buttons = document.querySelectorAll('button:not([aria-label])');
        buttons.forEach(button => {
            if (!button.textContent.trim()) {
                button.setAttribute('aria-label', 'Botón de acción');
            }
        });
    }

    static setupFocusManagement() {
        // Focus visible para mejor accesibilidad
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });
        
        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
    }

    static setupScreenReaderSupport() {
        // Anunciar cambios importantes
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    const addedNodes = Array.from(mutation.addedNodes);
                    addedNodes.forEach(node => {
                        if (node.nodeType === Node.ELEMENT_NODE && 
                            node.classList && 
                            node.classList.contains('notification-item')) {
                            this.announceToScreenReader(node.textContent);
                        }
                    });
                }
            });
        });
        
        observer.observe(document.body, { childList: true, subtree: true });
    }

    static announceToScreenReader(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = message;
        
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }

    // Actualizaciones en tiempo real
    static startRealTimeUpdates(app) {
        // Actualizar cada 30 segundos
        setInterval(() => {
            this.updateDashboard(app);
        }, 30000);
        
        // Actualizar al volver a la ventana
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                this.updateDashboard(app);
            }
        });
    }

    static updateDashboard(app) {
        VeedorDashboard.updateAll(app);
    }

    // Utilidades
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    static throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// Exportar para uso global
window.VeedorUI = VeedorUI;
