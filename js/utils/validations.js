/* ========================================
   SISTEMA DE VALIDACIONES
   ======================================== */

import { CONFIG } from '../core/config.js';

/**
 * Clase para manejar validaciones
 */
export class Validator {
    constructor() {
        this.errors = [];
        this.rules = new Map();
        this.setupDefaultRules();
    }

    /**
     * Configurar reglas por defecto
     */
    setupDefaultRules() {
        this.addRule('required', (value) => {
            return value !== null && value !== undefined && value !== '';
        });

        this.addRule('email', (value) => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(value);
        });

        this.addRule('minLength', (value, min) => {
            return value && value.length >= min;
        });

        this.addRule('maxLength', (value, max) => {
            return !value || value.length <= max;
        });

        this.addRule('min', (value, min) => {
            return !isNaN(value) && parseFloat(value) >= min;
        });

        this.addRule('max', (value, max) => {
            return !isNaN(value) && parseFloat(value) <= max;
        });

        this.addRule('positive', (value) => {
            return !isNaN(value) && parseFloat(value) > 0;
        });

        this.addRule('integer', (value) => {
            return Number.isInteger(parseFloat(value));
        });

        this.addRule('decimal', (value, places = 2) => {
            const regex = new RegExp(`^\\d+(\\.\\d{1,${places}})?$`);
            return regex.test(value.toString());
        });

        this.addRule('date', (value) => {
            const date = new Date(value);
            return date instanceof Date && !isNaN(date);
        });

        this.addRule('futureDate', (value) => {
            const date = new Date(value);
            return date instanceof Date && !isNaN(date) && date > new Date();
        });

        this.addRule('pastDate', (value) => {
            const date = new Date(value);
            return date instanceof Date && !isNaN(date) && date <= new Date();
        });

        this.addRule('oneOf', (value, options) => {
            return Array.isArray(options) && options.includes(value);
        });

        this.addRule('pattern', (value, regex) => {
            return new RegExp(regex).test(value);
        });
    }

    /**
     * Agregar regla personalizada
     */
    addRule(name, rule) {
        this.rules.set(name, rule);
    }

    /**
     * Validar un valor contra una regla
     */
    validateRule(value, ruleName, ...args) {
        const rule = this.rules.get(ruleName);
        if (!rule) {
            throw new Error(`Regla de validación '${ruleName}' no encontrada`);
        }
        return rule(value, ...args);
    }

    /**
     * Validar un objeto completo
     */
    validate(data, schema) {
        this.errors = [];
        
        for (const [field, rules] of Object.entries(schema)) {
            const value = data[field];
            
            for (const rule of rules) {
                const ruleName = typeof rule === 'string' ? rule : rule.name;
                const ruleArgs = typeof rule === 'object' ? rule.args || [] : [];
                
                if (!this.validateRule(value, ruleName, ...ruleArgs)) {
                    this.errors.push({
                        field,
                        rule: ruleName,
                        message: this.getErrorMessage(field, ruleName, ruleArgs),
                        value
                    });
                }
            }
        }
        
        return this.errors.length === 0;
    }

    /**
     * Obtener mensaje de error
     */
    getErrorMessage(field, rule, args) {
        const messages = {
            required: `${field} es requerido`,
            email: `${field} debe ser un email válido`,
            minLength: `${field} debe tener al menos ${args[0]} caracteres`,
            maxLength: `${field} no puede tener más de ${args[0]} caracteres`,
            min: `${field} debe ser mayor o igual a ${args[0]}`,
            max: `${field} debe ser menor o igual a ${args[0]}`,
            positive: `${field} debe ser un número positivo`,
            integer: `${field} debe ser un número entero`,
            decimal: `${field} debe ser un número decimal válido`,
            date: `${field} debe ser una fecha válida`,
            futureDate: `${field} debe ser una fecha futura`,
            pastDate: `${field} debe ser una fecha pasada`,
            oneOf: `${field} debe ser uno de: ${args[0].join(', ')}`,
            pattern: `${field} no tiene el formato correcto`
        };
        
        return messages[rule] || `${field} no es válido`;
    }

    /**
     * Obtener errores
     */
    getErrors() {
        return this.errors;
    }

    /**
     * Obtener primer error
     */
    getFirstError() {
        return this.errors[0] || null;
    }

    /**
     * Obtener errores por campo
     */
    getErrorsByField(field) {
        return this.errors.filter(error => error.field === field);
    }

    /**
     * Limpiar errores
     */
    clearErrors() {
        this.errors = [];
    }

    /**
     * Verificar si hay errores
     */
    hasErrors() {
        return this.errors.length > 0;
    }
}

// Instancia global del validador
export const validator = new Validator();

// Funciones de validación específicas
export const validateUser = (user) => {
    const schema = {
        name: ['required', { name: 'minLength', args: [CONFIG.VALIDATION.MIN_NAME_LENGTH] }, { name: 'maxLength', args: [CONFIG.VALIDATION.MAX_NAME_LENGTH] }],
        email: ['required', 'email'],
        password: ['required', { name: 'minLength', args: [CONFIG.VALIDATION.MIN_PASSWORD_LENGTH] }, { name: 'maxLength', args: [CONFIG.VALIDATION.MAX_PASSWORD_LENGTH] }]
    };
    
    return validator.validate(user, schema);
};

export const validateTransaction = (transaction) => {
    const schema = {
        amount: ['required', 'positive', { name: 'max', args: [CONFIG.VALIDATION.MAX_AMOUNT] }],
        description: ['required', { name: 'minLength', args: [CONFIG.VALIDATION.MIN_DESCRIPTION_LENGTH] }, { name: 'maxLength', args: [CONFIG.VALIDATION.MAX_DESCRIPTION_LENGTH] }],
        category: ['required', { name: 'oneOf', args: [CONFIG.CATEGORIES.INCOME.concat(CONFIG.CATEGORIES.EXPENSE).map(c => c.id)] }],
        date: ['required', 'date', 'pastDate'],
        type: ['required', { name: 'oneOf', args: [['income', 'expense']] }]
    };
    
    return validator.validate(transaction, schema);
};

export const validateBudget = (budget) => {
    const schema = {
        name: ['required', { name: 'minLength', args: [2] }, { name: 'maxLength', args: [50] }],
        amount: ['required', 'positive', { name: 'max', args: [CONFIG.VALIDATION.MAX_AMOUNT] }],
        category: ['required', { name: 'oneOf', args: [CONFIG.CATEGORIES.EXPENSE.map(c => c.id)] }],
        period: ['required', { name: 'oneOf', args: [['monthly', 'weekly', 'yearly']] }]
    };
    
    return validator.validate(budget, schema);
};

export const validateGoal = (goal) => {
    const schema = {
        name: ['required', { name: 'minLength', args: [2] }, { name: 'maxLength', args: [50] }],
        targetAmount: ['required', 'positive', { name: 'max', args: [CONFIG.VALIDATION.MAX_AMOUNT] }],
        currentAmount: ['positive', { name: 'max', args: [CONFIG.VALIDATION.MAX_AMOUNT] }],
        targetDate: ['required', 'date', 'futureDate'],
        priority: ['required', { name: 'oneOf', args: [CONFIG.GOAL_PRIORITIES.map(p => p.id)] }]
    };
    
    return validator.validate(goal, schema);
};

export const validateAsset = (asset) => {
    const schema = {
        name: ['required', { name: 'minLength', args: [2] }, { name: 'maxLength', args: [50] }],
        value: ['required', 'positive', { name: 'max', args: [CONFIG.VALIDATION.MAX_AMOUNT] }],
        type: ['required', { name: 'oneOf', args: [CONFIG.ASSET_TYPES.map(t => t.id)] }],
        description: [{ name: 'maxLength', args: [255] }]
    };
    
    return validator.validate(asset, schema);
};

export const validateLiability = (liability) => {
    const schema = {
        name: ['required', { name: 'minLength', args: [2] }, { name: 'maxLength', args: [50] }],
        amount: ['required', 'positive', { name: 'max', args: [CONFIG.VALIDATION.MAX_AMOUNT] }],
        type: ['required', { name: 'oneOf', args: [CONFIG.LIABILITY_TYPES.map(t => t.id)] }],
        interestRate: ['positive', { name: 'max', args: [100] }],
        monthlyPayment: ['positive', { name: 'max', args: [CONFIG.VALIDATION.MAX_AMOUNT] }],
        remainingPayments: ['integer', 'positive']
    };
    
    return validator.validate(liability, schema);
};

export const validateEnvelope = (envelope) => {
    const schema = {
        name: ['required', { name: 'minLength', args: [2] }, { name: 'maxLength', args: [50] }],
        amount: ['required', 'positive', { name: 'max', args: [CONFIG.VALIDATION.MAX_AMOUNT] }],
        category: ['required', { name: 'oneOf', args: [CONFIG.CATEGORIES.EXPENSE.map(c => c.id)] }]
    };
    
    return validator.validate(envelope, schema);
};

// Funciones de validación de formato
export const formatCurrency = (amount, currency = CONFIG.CURRENCY.DEFAULT) => {
    if (isNaN(amount)) return '0,00 €';
    
    const formatter = new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: CONFIG.CURRENCY.DECIMAL_PLACES,
        maximumFractionDigits: CONFIG.CURRENCY.DECIMAL_PLACES
    });
    
    return formatter.format(amount);
};

export const formatNumber = (number, decimals = CONFIG.CURRENCY.DECIMAL_PLACES) => {
    if (isNaN(number)) return '0';
    
    return new Intl.NumberFormat('es-ES', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    }).format(number);
};

export const formatDate = (date, format = CONFIG.DATE_FORMAT) => {
    if (!date) return '';
    
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    
    return format
        .replace('DD', day)
        .replace('MM', month)
        .replace('YYYY', year);
};

export const parseCurrency = (value) => {
    if (typeof value !== 'string') return 0;
    
    // Remover símbolos de moneda y espacios
    const cleaned = value.replace(/[€$£¥\s]/g, '');
    
    // Reemplazar comas por puntos para parseFloat
    const normalized = cleaned.replace(',', '.');
    
    const parsed = parseFloat(normalized);
    return isNaN(parsed) ? 0 : parsed;
};

export const parseDate = (value, format = CONFIG.DATE_FORMAT) => {
    if (!value) return null;
    
    // Detectar formato DD/MM/YYYY
    if (format === 'DD/MM/YYYY') {
        const parts = value.split('/');
        if (parts.length === 3) {
            const day = parseInt(parts[0], 10);
            const month = parseInt(parts[1], 10) - 1; // Los meses en JS van de 0-11
            const year = parseInt(parts[2], 10);
            
            const date = new Date(year, month, day);
            return isNaN(date.getTime()) ? null : date;
        }
    }
    
    // Fallback a Date constructor
    const date = new Date(value);
    return isNaN(date.getTime()) ? null : date;
};

export default validator;
