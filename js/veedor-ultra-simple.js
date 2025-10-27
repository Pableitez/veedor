// ========================================
// VEEDOR ULTRA SIMPLE - VERSIÓN GARANTIZADA
// ========================================

console.log('🚀 VEEDOR ULTRA SIMPLE INICIANDO...');

// Datos estáticos garantizados
const DEMO_DATA = {
    balance: 1525.00,
    income: 3000.00,
    expenses: 1675.00,
    savings: 1325.00,
    netWorth: 45230.00,
    totalAssets: 52180.00,
    totalLiabilities: 6950.00,
    monthlyChange: 2150.00
};

// Función para actualizar resumen financiero
function updateFinancialSummary() {
    console.log('💰 Actualizando resumen financiero...');
    
    const elements = {
        balance: document.querySelector('.balance-amount'),
        income: document.querySelector('.income-amount'),
        expenses: document.querySelector('.expenses-amount'),
        savings: document.querySelector('.savings-amount')
    };
    
    if (elements.balance) {
        elements.balance.textContent = `€${DEMO_DATA.balance.toLocaleString()}`;
        console.log('✅ Balance actualizado');
    } else {
        console.log('❌ Elemento balance-amount no encontrado');
    }
    
    if (elements.income) {
        elements.income.textContent = `€${DEMO_DATA.income.toLocaleString()}`;
        console.log('✅ Ingresos actualizados');
    } else {
        console.log('❌ Elemento income-amount no encontrado');
    }
    
    if (elements.expenses) {
        elements.expenses.textContent = `€${DEMO_DATA.expenses.toLocaleString()}`;
        console.log('✅ Gastos actualizados');
    } else {
        console.log('❌ Elemento expenses-amount no encontrado');
    }
    
    if (elements.savings) {
        elements.savings.textContent = `€${DEMO_DATA.savings.toLocaleString()}`;
        console.log('✅ Ahorro actualizado');
    } else {
        console.log('❌ Elemento savings-amount no encontrado');
    }
}

// Función para actualizar patrimonio neto
function updateNetWorth() {
    console.log('🏠 Actualizando patrimonio neto...');
    
    const elements = {
        netWorth: document.getElementById('net-worth-value'),
        netWorthChange: document.getElementById('net-worth-change'),
        totalAssets: document.getElementById('total-assets'),
        totalLiabilities: document.getElementById('total-liabilities')
    };
    
    if (elements.netWorth) {
        elements.netWorth.textContent = `€${DEMO_DATA.netWorth.toLocaleString()}`;
        console.log('✅ Patrimonio neto actualizado');
    } else {
        console.log('❌ Elemento net-worth-value no encontrado');
    }
    
    if (elements.netWorthChange) {
        elements.netWorthChange.textContent = `+€${DEMO_DATA.monthlyChange.toLocaleString()} este mes`;
        console.log('✅ Cambio mensual actualizado');
    } else {
        console.log('❌ Elemento net-worth-change no encontrado');
    }
    
    if (elements.totalAssets) {
        elements.totalAssets.textContent = `€${DEMO_DATA.totalAssets.toLocaleString()}`;
        console.log('✅ Total activos actualizado');
    } else {
        console.log('❌ Elemento total-assets no encontrado');
    }
    
    if (elements.totalLiabilities) {
        elements.totalLiabilities.textContent = `€${DEMO_DATA.totalLiabilities.toLocaleString()}`;
        console.log('✅ Total pasivos actualizado');
    } else {
        console.log('❌ Elemento total-liabilities no encontrado');
    }
}

// Función para actualizar transacciones recientes
function updateRecentTransactions() {
    console.log('📝 Actualizando transacciones recientes...');
    
    const container = document.querySelector('.recent-transactions');
    if (!container) {
        console.log('❌ Container recent-transactions no encontrado');
        return;
    }

    const transactions = [
        { description: 'Salario mensual', category: 'Salario', amount: 3000, type: 'income' },
        { description: 'Alquiler', category: 'Vivienda', amount: 800, type: 'expense' },
        { description: 'Supermercado', category: 'Alimentación', amount: 300, type: 'expense' },
        { description: 'Gasolina', category: 'Transporte', amount: 150, type: 'expense' },
        { description: 'Restaurante', category: 'Alimentación', amount: 200, type: 'expense' }
    ];

    container.innerHTML = transactions.map(transaction => `
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
    
    console.log('✅ Transacciones recientes actualizadas');
}

// Función para crear gráfica de categorías
function createCategoryChart() {
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

    try {
        window.overviewCategoryChart = new Chart(canvas, {
            type: 'doughnut',
            data: {
                labels: ['Vivienda', 'Alimentación', 'Transporte', 'Entretenimiento', 'Salud'],
                datasets: [{
                    data: [800, 500, 200, 100, 75],
                    backgroundColor: ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EF4444'],
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
function createTrendsChart() {
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

    try {
        window.overviewTrendsChart = new Chart(canvas, {
            type: 'line',
            data: {
                labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
                datasets: [{
                    label: 'Ingresos',
                    data: [2800, 3000, 3200, 3000, 3100, 3000],
                    borderColor: '#10B981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }, {
                    label: 'Gastos',
                    data: [1200, 1350, 1400, 1300, 1450, 1675],
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
function createIncomeExpensesChart() {
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

    try {
        window.overviewIncomeExpensesChart = new Chart(canvas, {
            type: 'bar',
            data: {
                labels: ['Ingresos', 'Gastos', 'Ahorro'],
                datasets: [{
                    data: [3000, 1675, 1325],
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

// Función para cambiar pestañas
function showTab(tabName) {
    console.log('🔄 Cambiando a pestaña:', tabName);
    
    // Ocultar todas las pestañas
    document.querySelectorAll('.tab-panel').forEach(tab => {
        tab.classList.remove('active');
    });

    // Remover clase active de todos los botones
    document.querySelectorAll('.nav-tab').forEach(btn => {
        btn.classList.remove('active');
    });

    // Mostrar pestaña seleccionada
    const selectedTab = document.getElementById(tabName);
    const selectedBtn = document.querySelector(`[data-tab="${tabName}"]`);

    if (selectedTab) {
        selectedTab.classList.add('active');
        console.log('✅ Pestaña activada:', selectedTab.id);
    } else {
        console.log('❌ Pestaña no encontrada:', tabName);
    }
    
    if (selectedBtn) {
        selectedBtn.classList.add('active');
        console.log('✅ Botón activado:', selectedBtn);
    } else {
        console.log('❌ Botón no encontrado para:', tabName);
    }

    // Cargar contenido específico de la pestaña
    if (tabName === 'overview') {
        updateFinancialSummary();
        updateRecentTransactions();
        updateNetWorth();
        createCategoryChart();
        createTrendsChart();
        createIncomeExpensesChart();
    }
}

// Función para configurar event listeners
function setupEventListeners() {
    console.log('🔗 Configurando event listeners...');
    
    // Event listeners para botones de navegación
    document.querySelectorAll('.nav-tab').forEach(button => {
        const tabName = button.getAttribute('data-tab');
        if (tabName) {
            button.addEventListener('click', () => {
                console.log('🖱️ Botón clickeado:', tabName);
                showTab(tabName);
            });
            console.log('✅ Event listener agregado para:', tabName);
        }
    });
    
    console.log('✅ Event listeners configurados');
}

// Función de debug específica para verificar duplicados
function checkDuplicates() {
    console.log('=== VERIFICANDO DUPLICADOS ===');
    
    const chartIds = [
        'overviewCategoryChart',
        'overviewTrendsChart', 
        'overviewIncomeExpensesChart'
    ];
    
    chartIds.forEach(id => {
        const elements = document.querySelectorAll(`#${id}`);
        console.log(`${id}:`, elements.length, 'elementos encontrados');
        
        if (elements.length > 1) {
            console.log('❌ DUPLICADO DETECTADO:', id);
            elements.forEach((el, index) => {
                console.log(`   Elemento ${index + 1}:`, el);
            });
        } else if (elements.length === 1) {
            console.log('✅ Elemento único:', id);
        } else {
            console.log('❌ Elemento no encontrado:', id);
        }
    });
    
    // Verificar si Chart.js está creando múltiples instancias
    const charts = [
        'overviewCategoryChart',
        'overviewTrendsChart',
        'overviewIncomeExpensesChart'
    ];
    
    console.log('Gráficas creadas en window:');
    charts.forEach(chartName => {
        const chart = window[chartName];
        console.log(`${chartName}:`, chart ? '✅ Creada' : '❌ No creada');
        if (chart) {
            console.log(`   Tipo:`, chart.config.type);
            console.log(`   Datos:`, chart.data.datasets[0].data);
        }
    });
    
    console.log('=== VERIFICACIÓN COMPLETADA ===');
}

// Función principal de inicialización
function initializeSystem() {
    console.log('=== INICIALIZANDO SISTEMA ULTRA SIMPLE ===');
    
    // 1. Actualizar datos
    updateFinancialSummary();
    updateRecentTransactions();
    updateNetWorth();
    
    // 2. Configurar navegación
    setupEventListeners();
    
    // 3. Crear gráficas si Chart.js está disponible
    if (typeof Chart !== 'undefined') {
        console.log('✅ Chart.js disponible, creando gráficas...');
        createCategoryChart();
        createTrendsChart();
        createIncomeExpensesChart();
    } else {
        console.log('❌ Chart.js no disponible');
    }
    
    console.log('=== SISTEMA INICIALIZADO ===');
}

// Hacer funciones globales
window.debugSystem = debugSystem;
window.checkDuplicates = checkDuplicates;
window.initializeSystem = initializeSystem;
window.showTab = showTab;
window.updateFinancialSummary = updateFinancialSummary;
window.updateNetWorth = updateNetWorth;
window.updateRecentTransactions = updateRecentTransactions;
window.createCategoryChart = createCategoryChart;
window.createTrendsChart = createTrendsChart;
window.createIncomeExpensesChart = createIncomeExpensesChart;
window.setupEventListeners = setupEventListeners;

// Inicializar automáticamente
document.addEventListener('DOMContentLoaded', () => {
    console.log('=== DOM CARGADO ===');
    setTimeout(() => {
        initializeSystem();
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
            createCategoryChart();
            createTrendsChart();
            createIncomeExpensesChart();
        } else {
            console.log('❌ Chart.js no disponible');
        }
    }, 500);
});

console.log('=== VEEDOR ULTRA SIMPLE CARGADO ===');
