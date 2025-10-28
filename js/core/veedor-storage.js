// ========================================
// VEEDOR STORAGE - GESTIÓN DE DATOS
// ========================================

class VeedorStorage {
    static loadAllData(app) {
        app.transactions = this.loadTransactions();
        app.budgets = this.loadBudgets();
        app.goals = this.loadGoals();
        app.envelopes = this.loadEnvelopes();
        app.assets = this.loadAssets();
        app.liabilities = this.loadLiabilities();
        app.categories = this.loadCategories() || app.categories;
        app.filters = this.loadFilters() || app.filters;
    }

    static saveAllData(app) {
        this.saveTransactions(app.transactions);
        this.saveBudgets(app.budgets);
        this.saveGoals(app.goals);
        this.saveEnvelopes(app.envelopes);
        this.saveAssets(app.assets);
        this.saveLiabilities(app.liabilities);
        this.saveCategories(app.categories);
        this.saveFilters(app.filters);
    }

    // Transacciones
    static loadTransactions() {
        try {
            const data = localStorage.getItem('veedor_transactions');
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error loading transactions:', error);
            return [];
        }
    }

    static saveTransactions(transactions) {
        try {
            localStorage.setItem('veedor_transactions', JSON.stringify(transactions));
        } catch (error) {
            console.error('Error saving transactions:', error);
        }
    }

    // Presupuestos
    static loadBudgets() {
        try {
            const data = localStorage.getItem('veedor_budgets');
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error loading budgets:', error);
            return [];
        }
    }

    static saveBudgets(budgets) {
        try {
            localStorage.setItem('veedor_budgets', JSON.stringify(budgets));
        } catch (error) {
            console.error('Error saving budgets:', error);
        }
    }

    // Metas
    static loadGoals() {
        try {
            const data = localStorage.getItem('veedor_goals');
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error loading goals:', error);
            return [];
        }
    }

    static saveGoals(goals) {
        try {
            localStorage.setItem('veedor_goals', JSON.stringify(goals));
        } catch (error) {
            console.error('Error saving goals:', error);
        }
    }

    // Sobres
    static loadEnvelopes() {
        try {
            const data = localStorage.getItem('veedor_envelopes');
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error loading envelopes:', error);
            return [];
        }
    }

    static saveEnvelopes(envelopes) {
        try {
            localStorage.setItem('veedor_envelopes', JSON.stringify(envelopes));
        } catch (error) {
            console.error('Error saving envelopes:', error);
        }
    }

    // Activos
    static loadAssets() {
        try {
            const data = localStorage.getItem('veedor_assets');
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error loading assets:', error);
            return [];
        }
    }

    static saveAssets(assets) {
        try {
            localStorage.setItem('veedor_assets', JSON.stringify(assets));
        } catch (error) {
            console.error('Error saving assets:', error);
        }
    }

    // Pasivos
    static loadLiabilities() {
        try {
            const data = localStorage.getItem('veedor_liabilities');
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error loading liabilities:', error);
            return [];
        }
    }

    static saveLiabilities(liabilities) {
        try {
            localStorage.setItem('veedor_liabilities', JSON.stringify(liabilities));
        } catch (error) {
            console.error('Error saving liabilities:', error);
        }
    }

    // Categorías
    static loadCategories() {
        try {
            const data = localStorage.getItem('veedor_categories');
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error loading categories:', error);
            return null;
        }
    }

    static saveCategories(categories) {
        try {
            localStorage.setItem('veedor_categories', JSON.stringify(categories));
        } catch (error) {
            console.error('Error saving categories:', error);
        }
    }

    // Filtros
    static loadFilters() {
        try {
            const data = localStorage.getItem('veedor_filters');
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error loading filters:', error);
            return null;
        }
    }

    static saveFilters(filters) {
        try {
            localStorage.setItem('veedor_filters', JSON.stringify(filters));
        } catch (error) {
            console.error('Error saving filters:', error);
        }
    }

    // Configuración
    static loadConfig() {
        try {
            const data = localStorage.getItem('veedor_config');
            return data ? JSON.parse(data) : {};
        } catch (error) {
            console.error('Error loading config:', error);
            return {};
        }
    }

    static saveConfig(config) {
        try {
            localStorage.setItem('veedor_config', JSON.stringify(config));
        } catch (error) {
            console.error('Error saving config:', error);
        }
    }

    // Limpiar todos los datos
    static clearAllData() {
        try {
            const keys = [
                'veedor_transactions',
                'veedor_budgets', 
                'veedor_goals',
                'veedor_envelopes',
                'veedor_assets',
                'veedor_liabilities',
                'veedor_categories',
                'veedor_filters',
                'veedor_config'
            ];
            
            keys.forEach(key => localStorage.removeItem(key));
            return true;
        } catch (error) {
            console.error('Error clearing data:', error);
            return false;
        }
    }

    // Exportar datos
    static exportData(app) {
        const data = {
            transactions: app.transactions,
            budgets: app.budgets,
            goals: app.goals,
            envelopes: app.envelopes,
            assets: app.assets,
            liabilities: app.liabilities,
            categories: app.categories,
            filters: app.filters,
            exportDate: new Date().toISOString(),
            version: '1.0.0'
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `veedor-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Importar datos
    static importData(file, app) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    
                    // Validar estructura
                    if (this.validateImportData(data)) {
                        app.transactions = data.transactions || [];
                        app.budgets = data.budgets || [];
                        app.goals = data.goals || [];
                        app.envelopes = data.envelopes || [];
                        app.assets = data.assets || [];
                        app.liabilities = data.liabilities || [];
                        app.categories = data.categories || app.categories;
                        app.filters = data.filters || app.filters;
                        
                        this.saveAllData(app);
                        resolve(true);
                    } else {
                        reject(new Error('Formato de archivo inválido'));
                    }
                } catch (error) {
                    reject(new Error('Error al procesar el archivo'));
                }
            };
            reader.onerror = () => reject(new Error('Error al leer el archivo'));
            reader.readAsText(file);
        });
    }

    static validateImportData(data) {
        return data && 
               typeof data === 'object' && 
               Array.isArray(data.transactions) &&
               Array.isArray(data.budgets) &&
               Array.isArray(data.goals);
    }
}

// Exportar para uso global
window.VeedorStorage = VeedorStorage;
