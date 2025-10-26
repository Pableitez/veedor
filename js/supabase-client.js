// ========================================
// CLIENTE SUPABASE PARA VEEDOR
// ========================================

import { createClient } from '@supabase/supabase-js'

// Configuración de Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Crear cliente Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ========================================
// SERVICIOS DE AUTENTICACIÓN
// ========================================

export class AuthService {
    // Registrar nuevo usuario
    static async signUp(email, password, fullName) {
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName
                    }
                }
            })
            
            if (error) throw error
            
            // Crear perfil financiero inicial
            if (data.user) {
                await this.createFinancialProfile(data.user.id)
            }
            
            return { data, error: null }
        } catch (error) {
            console.error('Error en registro:', error)
            return { data: null, error }
        }
    }

    // Iniciar sesión
    static async signIn(email, password) {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            })
            
            return { data, error }
        } catch (error) {
            console.error('Error en inicio de sesión:', error)
            return { data: null, error }
        }
    }

    // Cerrar sesión
    static async signOut() {
        try {
            const { error } = await supabase.auth.signOut()
            return { error }
        } catch (error) {
            console.error('Error al cerrar sesión:', error)
            return { error }
        }
    }

    // Obtener usuario actual
    static async getCurrentUser() {
        try {
            const { data: { user }, error } = await supabase.auth.getUser()
            return { user, error }
        } catch (error) {
            console.error('Error al obtener usuario:', error)
            return { user: null, error }
        }
    }

    // Crear perfil financiero inicial
    static async createFinancialProfile(userId) {
        try {
            const { data, error } = await supabase
                .from('financial_profiles')
                .insert({
                    user_id: userId,
                    monthly_salary: 0,
                    monthly_income: 0,
                    savings_goal: 0,
                    emergency_fund: 0,
                    investment_goal: 0
                })
            
            return { data, error }
        } catch (error) {
            console.error('Error al crear perfil financiero:', error)
            return { data: null, error }
        }
    }
}

// ========================================
// SERVICIOS DE TRANSACCIONES
// ========================================

export class TransactionService {
    // Obtener todas las transacciones del usuario
    static async getTransactions(userId, limit = 50, offset = 0) {
        try {
            const { data, error } = await supabase
                .from('transactions')
                .select(`
                    *,
                    categories (
                        name,
                        color,
                        icon
                    )
                `)
                .eq('user_id', userId)
                .order('date', { ascending: false })
                .range(offset, offset + limit - 1)
            
            return { data, error }
        } catch (error) {
            console.error('Error al obtener transacciones:', error)
            return { data: null, error }
        }
    }

    // Crear nueva transacción
    static async createTransaction(transactionData) {
        try {
            const { data, error } = await supabase
                .from('transactions')
                .insert(transactionData)
                .select()
            
            return { data, error }
        } catch (error) {
            console.error('Error al crear transacción:', error)
            return { data: null, error }
        }
    }

    // Actualizar transacción
    static async updateTransaction(transactionId, updates) {
        try {
            const { data, error } = await supabase
                .from('transactions')
                .update(updates)
                .eq('id', transactionId)
                .select()
            
            return { data, error }
        } catch (error) {
            console.error('Error al actualizar transacción:', error)
            return { data: null, error }
        }
    }

    // Eliminar transacción
    static async deleteTransaction(transactionId) {
        try {
            const { error } = await supabase
                .from('transactions')
                .delete()
                .eq('id', transactionId)
            
            return { error }
        } catch (error) {
            console.error('Error al eliminar transacción:', error)
            return { error }
        }
    }

    // Obtener estadísticas de transacciones
    static async getTransactionStats(userId, startDate, endDate) {
        try {
            const { data, error } = await supabase
                .from('transactions')
                .select('type, amount, date, categories(name)')
                .eq('user_id', userId)
                .gte('date', startDate)
                .lte('date', endDate)
            
            if (error) throw error
            
            // Procesar estadísticas
            const stats = {
                totalIncome: 0,
                totalExpenses: 0,
                byCategory: {},
                byType: { income: 0, expense: 0 }
            }
            
            data.forEach(transaction => {
                const amount = parseFloat(transaction.amount)
                const category = transaction.categories?.name || 'Sin categoría'
                
                if (transaction.type === 'income') {
                    stats.totalIncome += amount
                    stats.byType.income += amount
                } else {
                    stats.totalExpenses += amount
                    stats.byType.expense += amount
                }
                
                if (!stats.byCategory[category]) {
                    stats.byCategory[category] = 0
                }
                stats.byCategory[category] += amount
            })
            
            stats.netIncome = stats.totalIncome - stats.totalExpenses
            stats.savingsRate = stats.totalIncome > 0 ? (stats.netIncome / stats.totalIncome) * 100 : 0
            
            return { data: stats, error: null }
        } catch (error) {
            console.error('Error al obtener estadísticas:', error)
            return { data: null, error }
        }
    }
}

// ========================================
// SERVICIOS DE CATEGORÍAS
// ========================================

export class CategoryService {
    // Obtener categorías del usuario
    static async getCategories(userId) {
        try {
            const { data, error } = await supabase
                .from('categories')
                .select('*')
                .eq('user_id', userId)
                .order('name')
            
            return { data, error }
        } catch (error) {
            console.error('Error al obtener categorías:', error)
            return { data: null, error }
        }
    }

    // Crear nueva categoría
    static async createCategory(categoryData) {
        try {
            const { data, error } = await supabase
                .from('categories')
                .insert(categoryData)
                .select()
            
            return { data, error }
        } catch (error) {
            console.error('Error al crear categoría:', error)
            return { data: null, error }
        }
    }

    // Actualizar categoría
    static async updateCategory(categoryId, updates) {
        try {
            const { data, error } = await supabase
                .from('categories')
                .update(updates)
                .eq('id', categoryId)
                .select()
            
            return { data, error }
        } catch (error) {
            console.error('Error al actualizar categoría:', error)
            return { data: null, error }
        }
    }

    // Eliminar categoría
    static async deleteCategory(categoryId) {
        try {
            const { error } = await supabase
                .from('categories')
                .delete()
                .eq('id', categoryId)
            
            return { error }
        } catch (error) {
            console.error('Error al eliminar categoría:', error)
            return { error }
        }
    }
}

// ========================================
// SERVICIOS DE PERFIL FINANCIERO
// ========================================

export class FinancialProfileService {
    // Obtener perfil financiero
    static async getProfile(userId) {
        try {
            const { data, error } = await supabase
                .from('financial_profiles')
                .select('*')
                .eq('user_id', userId)
                .single()
            
            return { data, error }
        } catch (error) {
            console.error('Error al obtener perfil:', error)
            return { data: null, error }
        }
    }

    // Actualizar perfil financiero
    static async updateProfile(userId, updates) {
        try {
            const { data, error } = await supabase
                .from('financial_profiles')
                .update(updates)
                .eq('user_id', userId)
                .select()
            
            return { data, error }
        } catch (error) {
            console.error('Error al actualizar perfil:', error)
            return { data: null, error }
        }
    }
}

// ========================================
// SERVICIOS DE GASTOS RECURRENTES
// ========================================

export class RecurringExpenseService {
    // Obtener gastos recurrentes
    static async getRecurringExpenses(userId) {
        try {
            const { data, error } = await supabase
                .from('recurring_expenses')
                .select(`
                    *,
                    categories (
                        name,
                        color,
                        icon
                    )
                `)
                .eq('user_id', userId)
                .eq('is_active', true)
                .order('name')
            
            return { data, error }
        } catch (error) {
            console.error('Error al obtener gastos recurrentes:', error)
            return { data: null, error }
        }
    }

    // Crear gasto recurrente
    static async createRecurringExpense(expenseData) {
        try {
            const { data, error } = await supabase
                .from('recurring_expenses')
                .insert(expenseData)
                .select()
            
            return { data, error }
        } catch (error) {
            console.error('Error al crear gasto recurrente:', error)
            return { data: null, error }
        }
    }

    // Procesar gastos recurrentes (ejecutar automáticamente)
    static async processRecurringExpenses(userId) {
        try {
            const today = new Date().toISOString().split('T')[0]
            
            const { data: expenses, error } = await supabase
                .from('recurring_expenses')
                .select('*')
                .eq('user_id', userId)
                .eq('is_active', true)
                .lte('next_due_date', today)
            
            if (error) throw error
            
            const transactions = []
            
            for (const expense of expenses) {
                // Crear transacción automática
                const transaction = {
                    user_id: userId,
                    category_id: expense.category_id,
                    recurring_expense_id: expense.id,
                    type: 'expense',
                    amount: expense.amount,
                    description: expense.name,
                    date: today,
                    is_recurring: true
                }
                
                transactions.push(transaction)
                
                // Actualizar próxima fecha de vencimiento
                const nextDate = this.calculateNextDueDate(expense.frequency, expense.day_of_month, expense.day_of_week)
                await supabase
                    .from('recurring_expenses')
                    .update({ next_due_date: nextDate })
                    .eq('id', expense.id)
            }
            
            if (transactions.length > 0) {
                const { error: insertError } = await supabase
                    .from('transactions')
                    .insert(transactions)
                
                if (insertError) throw insertError
            }
            
            return { data: transactions, error: null }
        } catch (error) {
            console.error('Error al procesar gastos recurrentes:', error)
            return { data: null, error }
        }
    }

    // Calcular próxima fecha de vencimiento
    static calculateNextDueDate(frequency, dayOfMonth, dayOfWeek) {
        const today = new Date()
        const nextDate = new Date(today)
        
        switch (frequency) {
            case 'daily':
                nextDate.setDate(today.getDate() + 1)
                break
            case 'weekly':
                const daysUntilNext = (dayOfWeek - today.getDay() + 7) % 7
                nextDate.setDate(today.getDate() + (daysUntilNext || 7))
                break
            case 'monthly':
                nextDate.setMonth(today.getMonth() + 1)
                nextDate.setDate(dayOfMonth || today.getDate())
                break
            case 'yearly':
                nextDate.setFullYear(today.getFullYear() + 1)
                break
        }
        
        return nextDate.toISOString().split('T')[0]
    }
}

// Exportar todos los servicios
export {
    AuthService,
    TransactionService,
    CategoryService,
    FinancialProfileService,
    RecurringExpenseService
}
