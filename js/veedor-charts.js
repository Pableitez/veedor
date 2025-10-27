// ========================================
// VEEDOR CHARTS - SOLUCIÓN DIRECTA Y SIMPLE
// ========================================

console.log('=== VEEDOR CHARTS INICIANDO ===');

// Función para crear datos de demo
function createDemoData() {
    const demoTransactions = [
        {
            id: 'demo-1',
            type: 'income',
            amount: 3000,
            category: 'Salario',
            description: 'Salario mensual',
            date: new Date().toISOString().split('T')[0]
        },
        {
            id: 'demo-2',
            type: 'expense',
            amount: 800,
            category: 'Vivienda',
            description: 'Alquiler',
            date: new Date().toISOString().split('T')[0]
        },
        {
            id: 'demo-3',
            type: 'expense',
            amount: 300,
            category: 'Alimentación',
            description: 'Supermercado',
            date: new Date().toISOString().split('T')[0]
        },
        {
            id: 'demo-4',
            type: 'expense',
            amount: 150,
            category: 'Transporte',
            description: 'Gasolina',
            date: new Date().toISOString().split('T')[0]
        },
        {
            id: 'demo-5',
            type: 'expense',
            amount: 200,
            category: 'Alimentación',
            description: 'Restaurante',
            date: new Date(Date.now() - 86400000).toISOString().split('T')[0]
        },
        {
            id: 'demo-6',
            type: 'expense',
            amount: 50,
            category: 'Transporte',
            description: 'Metro/Bus',
            date: new Date(Date.now() - 172800000).toISOString().split('T')[0]
        },
        {
            id: 'demo-7',
            type: 'expense',
            amount: 100,
            category: 'Entretenimiento',
            description: 'Cine',
            date: new Date(Date.now() - 259200000).toISOString().split('T')[0]
        },
        {
            id: 'demo-8',
            type: 'expense',
            amount: 75,
            category: 'Salud',
            description: 'Farmacia',
            date: new Date(Date.now() - 345600000).toISOString().split('T')[0]
        }
    ];
    
    localStorage.setItem('veedorTransactions', JSON.stringify(demoTransactions));
    console.log('✅ Datos de demo creados:', demoTransactions.length, 'transacciones');
    return demoTransactions;
}

// Función para calcular datos financieros
function calculateFinancialData(transactions) {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    // Filtrar transacciones del mes actual
    const monthlyTransactions = transactions.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return transactionDate.getMonth() === currentMonth && 
               transactionDate.getFullYear() === currentYear;
    });

    // Calcular ingresos del mes
    const monthlyIncome = monthlyTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

    // Calcular gastos del mes
    const monthlyExpenses = monthlyTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

    // Calcular balance total
    const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

    const totalBalance = totalIncome - totalExpenses;

    return {
        totalBalance,
        monthlyIncome,
        monthlyExpenses,
        monthlySavings: monthlyIncome - monthlyExpenses
    };
}

// Función para actualizar el resumen financiero
function updateFinancialSummary(transactions) {
    console.log('💰 Actualizando resumen financiero...');
    
    const financialData = calculateFinancialData(transactions);
    
    const elements = {
        balance: document.querySelector('.balance-amount'),
        income: document.querySelector('.income-amount'),
        expenses: document.querySelector('.expenses-amount'),
        savings: document.querySelector('.savings-amount')
    };
    
    if (elements.balance) {
        elements.balance.textContent = `€${financialData.totalBalance.toFixed(2)}`;
        console.log('✅ Balance actualizado:', elements.balance.textContent);
    } else {
        console.log('❌ Elemento balance-amount no encontrado');
    }
    
    if (elements.income) {
        elements.income.textContent = `€${financialData.monthlyIncome.toFixed(2)}`;
        console.log('✅ Ingresos actualizados:', elements.income.textContent);
    } else {
        console.log('❌ Elemento income-amount no encontrado');
    }
    
    if (elements.expenses) {
        elements.expenses.textContent = `€${financialData.monthlyExpenses.toFixed(2)}`;
        console.log('✅ Gastos actualizados:', elements.expenses.textContent);
    } else {
        console.log('❌ Elemento expenses-amount no encontrado');
    }
    
    if (elements.savings) {
        elements.savings.textContent = `€${financialData.monthlySavings.toFixed(2)}`;
        console.log('✅ Ahorro actualizado:', elements.savings.textContent);
    } else {
        console.log('❌ Elemento savings-amount no encontrado');
    }
}

// Función para crear gráfica de categorías
function createCategoryChart(transactions) {
    console.log('📊 Creando gráfica de categorías...');
    
    const canvas = document.getElementById('overviewCategoryChart');
    if (!canvas) {
        console.log('❌ Canvas overviewCategoryChart no encontrado');
        return;
    }

    if (typeof Chart === 'undefined') {
        console.log('❌ Chart.js no disponible');
        return;
    }

    // Destruir gráfico existente si existe
    if (window.overviewCategoryChart && typeof window.overviewCategoryChart.destroy === 'function') {
        window.overviewCategoryChart.destroy();
    }

    // Calcular gastos por categoría del mes actual
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const categoryData = {};
    transactions
        .filter(t => t.type === 'expense' && 
            new Date(t.date).getMonth() === currentMonth && 
            new Date(t.date).getFullYear() === currentYear)
        .forEach(transaction => {
            categoryData[transaction.category] = (categoryData[transaction.category] || 0) + transaction.amount;
        });

    const categories = Object.keys(categoryData);
    const amounts = Object.values(categoryData);

    if (amounts.length === 0) {
        console.log('❌ No hay datos de gastos para el mes actual');
        return;
    }

    console.log('✅ Datos de categorías:', { categories, amounts });

    // Colores profesionales
    const colors = [
        '#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', 
        '#EF4444', '#06B6D4', '#84CC16', '#F97316'
    ];

    try {
        window.overviewCategoryChart = new Chart(canvas, {
            type: 'doughnut',
            data: {
                labels: categories,
                datasets: [{
                    data: amounts,
                    backgroundColor: colors.slice(0, categories.length),
                    borderWidth: 0,
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            usePointStyle: true,
                            padding: 20,
                            font: {
                                family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((context.parsed / total) * 100).toFixed(1);
                                return `${context.label}: €${context.parsed.toFixed(2)} (${percentage}%)`;
                            }
                        }
                    }
                },
                cutout: '60%',
                animation: {
                    animateRotate: true,
                    duration: 1000,
                    easing: 'easeOutQuart'
                }
            }
        });
        console.log('✅ Gráfica de categorías creada exitosamente');
    } catch (error) {
        console.error('❌ Error creando gráfica de categorías:', error);
    }
}

// Función para crear gráfica de tendencias
function createTrendsChart(transactions) {
    console.log('📈 Creando gráfica de tendencias...');
    
    const canvas = document.getElementById('overviewTrendsChart');
    if (!canvas) {
        console.log('❌ Canvas overviewTrendsChart no encontrado');
        return;
    }

    if (typeof Chart === 'undefined') {
        console.log('❌ Chart.js no disponible');
        return;
    }

    // Destruir gráfico existente si existe
    if (window.overviewTrendsChart && typeof window.overviewTrendsChart.destroy === 'function') {
        window.overviewTrendsChart.destroy();
    }

    // Obtener datos de los últimos 6 meses
    const months = [];
    const incomeData = [];
    const expenseData = [];
    
    for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthName = date.toLocaleDateString('es-ES', { month: 'short' });
        months.push(monthName);
        
        const monthTransactions = transactions.filter(t => {
            const transactionDate = new Date(t.date);
            return transactionDate.getMonth() === date.getMonth() && 
                   transactionDate.getFullYear() === date.getFullYear();
        });
        
        const income = monthTransactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
        
        const expenses = monthTransactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);
        
        incomeData.push(income);
        expenseData.push(expenses);
    }

    console.log('✅ Datos de tendencias:', { months, incomeData, expenseData });

    try {
        window.overviewTrendsChart = new Chart(canvas, {
            type: 'line',
            data: {
                labels: months,
                datasets: [{
                    label: 'Ingresos',
                    data: incomeData,
                    borderColor: '#10B981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }, {
                    label: 'Gastos',
                    data: expenseData,
                    borderColor: '#EF4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            usePointStyle: true,
                            padding: 20,
                            font: {
                                family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            label: function(context) {
                                return `${context.dataset.label}: €${context.parsed.y.toFixed(2)}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            callback: function(value) {
                                return '€' + value.toFixed(0);
                            }
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                animation: {
                    duration: 1000,
                    easing: 'easeOutQuart'
                }
            }
        });
        console.log('✅ Gráfica de tendencias creada exitosamente');
    } catch (error) {
        console.error('❌ Error creando gráfica de tendencias:', error);
    }
}

// Función para crear gráfica de resumen financiero
function createIncomeExpensesChart(transactions) {
    console.log('📊 Creando gráfica de resumen financiero...');
    
    const canvas = document.getElementById('overviewIncomeExpensesChart');
    if (!canvas) {
        console.log('❌ Canvas overviewIncomeExpensesChart no encontrado');
        return;
    }

    if (typeof Chart === 'undefined') {
        console.log('❌ Chart.js no disponible');
        return;
    }

    // Destruir gráfico existente si existe
    if (window.overviewIncomeExpensesChart && typeof window.overviewIncomeExpensesChart.destroy === 'function') {
        window.overviewIncomeExpensesChart.destroy();
    }

    // Calcular totales del mes actual
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthlyTransactions = transactions.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate.getMonth() === currentMonth && 
               transactionDate.getFullYear() === currentYear;
    });

    const income = monthlyTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

    const expenses = monthlyTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

    const savings = income - expenses;

    console.log('✅ Datos de resumen:', { income, expenses, savings });

    try {
        window.overviewIncomeExpensesChart = new Chart(canvas, {
            type: 'bar',
            data: {
                labels: ['Ingresos', 'Gastos', 'Ahorro'],
                datasets: [{
                    data: [income, expenses, savings],
                    backgroundColor: [
                        'rgba(16, 185, 129, 0.8)',
                        'rgba(239, 68, 68, 0.8)',
                        'rgba(59, 130, 246, 0.8)'
                    ],
                    borderColor: [
                        '#10B981',
                        '#EF4444',
                        '#3B82F6'
                    ],
                    borderWidth: 2,
                    borderRadius: 8,
                    borderSkipped: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.label}: €${context.parsed.y.toFixed(2)}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            callback: function(value) {
                                return '€' + value.toFixed(0);
                            }
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                },
                animation: {
                    duration: 1000,
                    easing: 'easeOutQuart'
                }
            }
        });
        console.log('✅ Gráfica de resumen financiero creada exitosamente');
    } catch (error) {
        console.error('❌ Error creando gráfica de resumen financiero:', error);
    }
}

// Función para actualizar transacciones recientes
function updateRecentTransactions(transactions) {
    console.log('📝 Actualizando transacciones recientes...');
    
    const container = document.querySelector('.recent-transactions');
    if (!container) {
        console.log('❌ Container recent-transactions no encontrado');
        return;
    }

    const recentTransactions = transactions
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);

    container.innerHTML = recentTransactions.map(transaction => `
        <div class="transaction-item">
            <div class="transaction-info">
                <span class="transaction-description">${transaction.description}</span>
                <span class="transaction-category">${transaction.category}</span>
            </div>
            <div class="transaction-amount ${transaction.type}">
                ${transaction.type === 'income' ? '+' : '-'}€${transaction.amount.toFixed(2)}
            </div>
        </div>
    `).join('');
    
    console.log('✅ Transacciones recientes actualizadas:', recentTransactions.length);
}

// Función principal para inicializar todo
function initializeDashboard() {
    console.log('=== INICIALIZANDO DASHBOARD ===');
    
    // 1. Crear o cargar datos
    let transactions = JSON.parse(localStorage.getItem('veedorTransactions') || '[]');
    if (transactions.length === 0) {
        console.log('No hay datos, creando datos de demo...');
        transactions = createDemoData();
    } else {
        console.log('✅ Datos existentes cargados:', transactions.length, 'transacciones');
    }
    
    // 2. Actualizar resumen financiero
    updateFinancialSummary(transactions);
    
    // 3. Actualizar transacciones recientes
    updateRecentTransactions(transactions);
    
    // 4. Crear gráficas si Chart.js está disponible
    if (typeof Chart !== 'undefined') {
        console.log('✅ Chart.js disponible, creando gráficas...');
        createCategoryChart(transactions);
        createTrendsChart(transactions);
        createIncomeExpensesChart(transactions);
    } else {
        console.log('❌ Chart.js no disponible, esperando...');
        // Reintentar después de un tiempo
        setTimeout(() => {
            if (typeof Chart !== 'undefined') {
                console.log('✅ Chart.js disponible en segundo intento');
                createCategoryChart(transactions);
                createTrendsChart(transactions);
                createIncomeExpensesChart(transactions);
            } else {
                console.log('❌ Chart.js sigue sin estar disponible');
            }
        }, 1000);
    }
    
    console.log('=== DASHBOARD INICIALIZADO ===');
}

// Función de debug para verificar el estado
function debugCharts() {
    console.log('=== DEBUG CHARTS ===');
    console.log('Chart.js disponible:', typeof Chart !== 'undefined');
    
    const canvas1 = document.getElementById('overviewCategoryChart');
    const canvas2 = document.getElementById('overviewTrendsChart');
    const canvas3 = document.getElementById('overviewIncomeExpensesChart');
    
    console.log('Canvas encontrados:', {
        categoryChart: !!canvas1,
        trendsChart: !!canvas2,
        incomeExpensesChart: !!canvas3
    });
    
    if (canvas1) console.log('Canvas 1 dimensions:', canvas1.width, 'x', canvas1.height);
    if (canvas2) console.log('Canvas 2 dimensions:', canvas2.width, 'x', canvas2.height);
    if (canvas3) console.log('Canvas 3 dimensions:', canvas3.width, 'x', canvas3.height);
    
    const transactions = JSON.parse(localStorage.getItem('veedorTransactions') || '[]');
    console.log('Transacciones en localStorage:', transactions.length);
    
    // Verificar elementos del resumen financiero
    const elements = [
        '.balance-amount',
        '.income-amount', 
        '.expenses-amount',
        '.savings-amount',
        '.recent-transactions'
    ];
    
    elements.forEach(selector => {
        const element = document.querySelector(selector);
        console.log(`${selector}:`, element ? '✅ Encontrado' : '❌ No encontrado');
    });
    
    // Verificar gráficas creadas
    const charts = [
        'overviewCategoryChart',
        'overviewTrendsChart',
        'overviewIncomeExpensesChart'
    ];
    
    charts.forEach(chartName => {
        const chart = window[chartName];
        console.log(`${chartName}:`, chart ? '✅ Creada' : '❌ No creada');
    });
}

// Función para cambiar pestañas
function showTab(tabName) {
    console.log('Cambiando a pestaña:', tabName);
    
    // Ocultar todas las pestañas
    document.querySelectorAll('.tab-panel, .dashboard-tab').forEach(tab => {
        tab.classList.remove('active');
    });

    // Remover clase active de todos los botones
    document.querySelectorAll('.nav-tab').forEach(btn => {
        btn.classList.remove('active');
    });

    // Mostrar pestaña seleccionada
    const selectedTab = document.getElementById(`${tabName}-tab`) || document.getElementById(tabName);
    const selectedBtn = document.querySelector(`[data-tab="${tabName}"]`);

    if (selectedTab) {
        selectedTab.classList.add('active');
        console.log('✅ Pestaña activada:', selectedTab.id);
    } else {
        console.log('❌ Pestaña no encontrada:', `${tabName}-tab`);
    }
    
    if (selectedBtn) {
        selectedBtn.classList.add('active');
        console.log('✅ Botón activado:', selectedBtn);
    } else {
        console.log('❌ Botón no encontrado para:', tabName);
    }
}

// Hacer funciones globales
window.debugCharts = debugCharts;
window.initializeDashboard = initializeDashboard;
window.showTab = showTab;

// Inicializar automáticamente cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    console.log('=== DOM CARGADO ===');
    setTimeout(() => {
        initializeDashboard();
    }, 100);
});

// También inicializar cuando la ventana se carga completamente
window.addEventListener('load', () => {
    console.log('=== VENTANA CARGADA COMPLETAMENTE ===');
    setTimeout(() => {
        console.log('Verificando componentes...');
        console.log('Chart.js:', typeof Chart !== 'undefined');
        
        if (typeof Chart !== 'undefined') {
            console.log('✅ Chart.js disponible, forzando actualización...');
            // Recargar datos y crear gráficas
            const transactions = JSON.parse(localStorage.getItem('veedorTransactions') || '[]');
            if (transactions.length > 0) {
                createCategoryChart(transactions);
                createTrendsChart(transactions);
                createIncomeExpensesChart(transactions);
            }
        } else {
            console.log('❌ Chart.js no disponible');
        }
    }, 500);
});

console.log('=== VEEDOR CHARTS CARGADO ===');
