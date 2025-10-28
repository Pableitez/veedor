// ========================================
// VEEDOR CALCULATORS - CÁLCULOS FINANCIEROS
// ========================================

class VeedorCalculators {
    // Cálculos básicos de transacciones
    static calculateTotalIncome(transactions) {
        return transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    }

    static calculateTotalExpenses(transactions) {
        return transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    }

    static calculateBalance(transactions) {
        return this.calculateTotalIncome(transactions) - this.calculateTotalExpenses(transactions);
    }

    // Cálculos por categoría
    static calculateCategoryTotals(transactions) {
        const totals = {};
        transactions.forEach(transaction => {
            const category = transaction.category;
            if (!totals[category]) {
                totals[category] = { income: 0, expenses: 0, count: 0 };
            }
            totals[category][transaction.type] += parseFloat(transaction.amount);
            totals[category].count++;
        });
        return totals;
    }

    static calculateCategoryPercentage(transactions, category) {
        const categoryTotal = transactions
            .filter(t => t.category === category && t.type === 'expense')
            .reduce((sum, t) => sum + parseFloat(t.amount), 0);
        const totalExpenses = this.calculateTotalExpenses(transactions);
        return totalExpenses > 0 ? (categoryTotal / totalExpenses) * 100 : 0;
    }

    // Cálculos de patrimonio neto
    static calculateNetWorth(assets, liabilities) {
        const totalAssets = this.calculateTotalAssets(assets);
        const totalLiabilities = this.calculateTotalLiabilities(liabilities);
        return totalAssets - totalLiabilities;
    }

    static calculateTotalAssets(assets) {
        return assets.reduce((sum, asset) => sum + parseFloat(asset.value), 0);
    }

    static calculateTotalLiabilities(liabilities) {
        return liabilities.reduce((sum, liability) => sum + parseFloat(liability.amount), 0);
    }

    // Cálculos de presupuestos
    static calculateBudgetProgress(budget, transactions) {
        const spent = transactions
            .filter(t => t.category === budget.category && t.type === 'expense')
            .reduce((sum, t) => sum + parseFloat(t.amount), 0);
        const percentage = (spent / budget.amount) * 100;
        return { spent, percentage, remaining: budget.amount - spent };
    }

    static calculateBudgetStatus(percentage) {
        if (percentage >= 100) return 'critical';
        if (percentage >= 80) return 'warning';
        if (percentage >= 60) return 'good';
        return 'excellent';
    }

    // Cálculos de metas
    static calculateGoalProgress(goal, transactions) {
        const saved = transactions
            .filter(t => t.category === goal.category && t.type === 'income')
            .reduce((sum, t) => sum + parseFloat(t.amount), 0);
        const percentage = (saved / goal.target) * 100;
        return { saved, percentage, remaining: goal.target - saved };
    }

    // Cálculos de amortización
    static calculateAmortization(principal, rate, years, tae) {
        const monthlyRate = rate / 100 / 12;
        const totalPayments = years * 12;
        
        if (monthlyRate === 0) {
            return {
                monthlyPayment: principal / totalPayments,
                totalInterest: 0,
                totalCost: principal,
                tae: 0,
                tin: 0
            };
        }

        const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) / 
                              (Math.pow(1 + monthlyRate, totalPayments) - 1);
        
        const totalCost = monthlyPayment * totalPayments;
        const totalInterest = totalCost - principal;
        
        return {
            monthlyPayment,
            totalInterest,
            totalCost,
            tae: tae || rate,
            tin: rate,
            totalPayments,
            totalYears: years,
            totalMonths: totalPayments
        };
    }

    static calculateAmortizationSchedule(principal, rate, years) {
        const monthlyRate = rate / 100 / 12;
        const totalPayments = years * 12;
        const monthlyPayment = this.calculateAmortization(principal, rate, years).monthlyPayment;
        
        const schedule = [];
        let remainingBalance = principal;
        
        for (let i = 0; i < totalPayments; i++) {
            const interestPayment = remainingBalance * monthlyRate;
            const principalPayment = monthlyPayment - interestPayment;
            remainingBalance -= principalPayment;
            
            schedule.push({
                payment: i + 1,
                monthlyPayment,
                principalPayment,
                interestPayment,
                remainingBalance: Math.max(0, remainingBalance)
            });
        }
        
        return schedule;
    }

    // Cálculos de sobres
    static calculateEnvelopeProgress(envelope, transactions) {
        const spent = transactions
            .filter(t => t.envelope === envelope.id && t.type === 'expense')
            .reduce((sum, t) => sum + parseFloat(t.amount), 0);
        const percentage = (spent / envelope.budget) * 100;
        return { spent, percentage, remaining: envelope.budget - spent };
    }

    // Cálculos de tendencias
    static calculateTrends(transactions, period = 'month') {
        const now = new Date();
        const currentPeriod = this.getPeriodData(transactions, now, period);
        const previousPeriod = this.getPeriodData(transactions, this.getPreviousPeriod(now, period), period);
        
        return {
            current: currentPeriod,
            previous: previousPeriod,
            incomeChange: this.calculatePercentageChange(previousPeriod.income, currentPeriod.income),
            expenseChange: this.calculatePercentageChange(previousPeriod.expenses, currentPeriod.expenses),
            balanceChange: this.calculatePercentageChange(previousPeriod.balance, currentPeriod.balance)
        };
    }

    static getPeriodData(transactions, date, period) {
        const startDate = this.getPeriodStart(date, period);
        const endDate = this.getPeriodEnd(date, period);
        
        const periodTransactions = transactions.filter(t => {
            const transactionDate = new Date(t.date);
            return transactionDate >= startDate && transactionDate <= endDate;
        });
        
        return {
            income: this.calculateTotalIncome(periodTransactions),
            expenses: this.calculateTotalExpenses(periodTransactions),
            balance: this.calculateBalance(periodTransactions),
            count: periodTransactions.length
        };
    }

    static getPeriodStart(date, period) {
        const start = new Date(date);
        if (period === 'month') {
            start.setDate(1);
            start.setHours(0, 0, 0, 0);
        } else if (period === 'year') {
            start.setMonth(0, 1);
            start.setHours(0, 0, 0, 0);
        }
        return start;
    }

    static getPeriodEnd(date, period) {
        const end = new Date(date);
        if (period === 'month') {
            end.setMonth(end.getMonth() + 1, 0);
            end.setHours(23, 59, 59, 999);
        } else if (period === 'year') {
            end.setMonth(11, 31);
            end.setHours(23, 59, 59, 999);
        }
        return end;
    }

    static getPreviousPeriod(date, period) {
        const previous = new Date(date);
        if (period === 'month') {
            previous.setMonth(previous.getMonth() - 1);
        } else if (period === 'year') {
            previous.setFullYear(previous.getFullYear() - 1);
        }
        return previous;
    }

    static calculatePercentageChange(oldValue, newValue) {
        if (oldValue === 0) return newValue > 0 ? 100 : 0;
        return ((newValue - oldValue) / oldValue) * 100;
    }

    // Cálculos de salud financiera
    static calculateFinancialHealth(transactions, assets, liabilities) {
        const netWorth = this.calculateNetWorth(assets, liabilities);
        const monthlyIncome = this.calculateTotalIncome(transactions);
        const monthlyExpenses = this.calculateTotalExpenses(transactions);
        const savingsRate = monthlyIncome > 0 ? ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100 : 0;
        
        let score = 0;
        let factors = [];
        
        // Factor de ahorro
        if (savingsRate >= 20) {
            score += 25;
            factors.push({ name: 'Tasa de ahorro excelente', value: savingsRate.toFixed(1) + '%' });
        } else if (savingsRate >= 10) {
            score += 15;
            factors.push({ name: 'Tasa de ahorro buena', value: savingsRate.toFixed(1) + '%' });
        } else if (savingsRate >= 0) {
            score += 5;
            factors.push({ name: 'Tasa de ahorro baja', value: savingsRate.toFixed(1) + '%' });
        } else {
            factors.push({ name: 'Gastos superan ingresos', value: savingsRate.toFixed(1) + '%' });
        }
        
        // Factor de patrimonio neto
        if (netWorth > 0) {
            score += 25;
            factors.push({ name: 'Patrimonio neto positivo', value: this.formatCurrency(netWorth) });
        } else {
            factors.push({ name: 'Patrimonio neto negativo', value: this.formatCurrency(netWorth) });
        }
        
        // Factor de estabilidad de ingresos
        const incomeStability = this.calculateIncomeStability(transactions);
        if (incomeStability >= 0.8) {
            score += 25;
            factors.push({ name: 'Ingresos estables', value: (incomeStability * 100).toFixed(1) + '%' });
        } else if (incomeStability >= 0.6) {
            score += 15;
            factors.push({ name: 'Ingresos moderadamente estables', value: (incomeStability * 100).toFixed(1) + '%' });
        } else {
            score += 5;
            factors.push({ name: 'Ingresos variables', value: (incomeStability * 100).toFixed(1) + '%' });
        }
        
        // Factor de diversificación de gastos
        const expenseDiversification = this.calculateExpenseDiversification(transactions);
        if (expenseDiversification >= 0.7) {
            score += 25;
            factors.push({ name: 'Gastos bien diversificados', value: (expenseDiversification * 100).toFixed(1) + '%' });
        } else if (expenseDiversification >= 0.5) {
            score += 15;
            factors.push({ name: 'Gastos moderadamente diversificados', value: (expenseDiversification * 100).toFixed(1) + '%' });
        } else {
            score += 5;
            factors.push({ name: 'Gastos concentrados', value: (expenseDiversification * 100).toFixed(1) + '%' });
        }
        
        return {
            score: Math.min(100, Math.max(0, score)),
            factors,
            netWorth,
            savingsRate,
            incomeStability,
            expenseDiversification
        };
    }

    static calculateIncomeStability(transactions) {
        const incomeTransactions = transactions.filter(t => t.type === 'income');
        if (incomeTransactions.length < 2) return 0;
        
        const monthlyIncomes = {};
        incomeTransactions.forEach(t => {
            const month = new Date(t.date).toISOString().substring(0, 7);
            if (!monthlyIncomes[month]) monthlyIncomes[month] = 0;
            monthlyIncomes[month] += parseFloat(t.amount);
        });
        
        const values = Object.values(monthlyIncomes);
        const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
        const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
        const standardDeviation = Math.sqrt(variance);
        
        return mean > 0 ? Math.max(0, 1 - (standardDeviation / mean)) : 0;
    }

    static calculateExpenseDiversification(transactions) {
        const expenseTransactions = transactions.filter(t => t.type === 'expense');
        if (expenseTransactions.length === 0) return 0;
        
        const categoryTotals = {};
        expenseTransactions.forEach(t => {
            categoryTotals[t.category] = (categoryTotals[t.category] || 0) + parseFloat(t.amount);
        });
        
        const totalExpenses = Object.values(categoryTotals).reduce((sum, val) => sum + val, 0);
        const categories = Object.keys(categoryTotals).length;
        const maxCategoryShare = Math.max(...Object.values(categoryTotals)) / totalExpenses;
        
        return Math.min(1, categories / 5) * (1 - maxCategoryShare);
    }

    // Utilidades de formato
    static formatCurrency(amount) {
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'EUR'
        }).format(amount);
    }

    static formatNumber(number, decimals = 2) {
        return new Intl.NumberFormat('es-ES', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        }).format(number);
    }

    static formatPercentage(value, decimals = 1) {
        return new Intl.NumberFormat('es-ES', {
            style: 'percent',
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        }).format(value / 100);
    }
}

// Exportar para uso global
window.VeedorCalculators = VeedorCalculators;
