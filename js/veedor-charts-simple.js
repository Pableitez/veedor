// ========================================
// VEEDOR CHARTS - VERSIÓN SIMPLE Y DIRECTA
// ========================================

console.log('🚀 VEEDOR CHARTS SIMPLE INICIANDO...');

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

    // Datos de ejemplo
    const data = {
        labels: ['Vivienda', 'Alimentación', 'Transporte', 'Entretenimiento', 'Salud'],
        datasets: [{
            data: [800, 500, 200, 100, 75],
            backgroundColor: [
                '#8B5CF6',
                '#3B82F6', 
                '#10B981',
                '#F59E0B',
                '#EF4444'
            ],
            borderWidth: 0,
            hoverOffset: 4
        }]
    };

    try {
        window.overviewCategoryChart = new Chart(canvas, {
            type: 'doughnut',
            data: data,
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

    // Datos de ejemplo
    const data = {
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
    };

    try {
        window.overviewTrendsChart = new Chart(canvas, {
            type: 'line',
            data: data,
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

    // Datos de ejemplo
    const data = {
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
    };

    try {
        window.overviewIncomeExpensesChart = new Chart(canvas, {
            type: 'bar',
            data: data,
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

// Función para actualizar el resumen financiero
function updateFinancialSummary() {
    console.log('💰 Actualizando resumen financiero...');
    
    const elements = {
        balance: document.querySelector('.balance-amount'),
        income: document.querySelector('.income-amount'),
        expenses: document.querySelector('.expenses-amount'),
        savings: document.querySelector('.savings-amount')
    };
    
    if (elements.balance) {
        elements.balance.textContent = '€1,525.00';
        console.log('✅ Balance actualizado');
    } else {
        console.log('❌ Elemento balance-amount no encontrado');
    }
    
    if (elements.income) {
        elements.income.textContent = '€3,000.00';
        console.log('✅ Ingresos actualizados');
    } else {
        console.log('❌ Elemento income-amount no encontrado');
    }
    
    if (elements.expenses) {
        elements.expenses.textContent = '€1,675.00';
        console.log('✅ Gastos actualizados');
    } else {
        console.log('❌ Elemento expenses-amount no encontrado');
    }
    
    if (elements.savings) {
        elements.savings.textContent = '€1,325.00';
        console.log('✅ Ahorro actualizado');
    } else {
        console.log('❌ Elemento savings-amount no encontrado');
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

// Función principal para inicializar todo
function initializeDashboard() {
    console.log('=== INICIALIZANDO DASHBOARD SIMPLE ===');
    
    // 1. Crear datos de demo
    createDemoData();
    
    // 2. Actualizar resumen financiero
    updateFinancialSummary();
    
    // 3. Actualizar transacciones recientes
    updateRecentTransactions();
    
    // 4. Actualizar patrimonio neto
    updateNetWorth();
    
    // 5. Crear gráficas si Chart.js está disponible
    if (typeof Chart !== 'undefined') {
        console.log('✅ Chart.js disponible, creando gráficas...');
        createCategoryChart();
        createTrendsChart();
        createIncomeExpensesChart();
    } else {
        console.log('❌ Chart.js no disponible, esperando...');
        // Reintentar después de un tiempo
        setTimeout(() => {
            if (typeof Chart !== 'undefined') {
                console.log('✅ Chart.js disponible en segundo intento');
                createCategoryChart();
                createTrendsChart();
                createIncomeExpensesChart();
            } else {
                console.log('❌ Chart.js sigue sin estar disponible');
            }
        }, 1000);
    }
    
    console.log('=== DASHBOARD SIMPLE INICIALIZADO ===');
}

// Función de debug para verificar el estado
function debugCharts() {
    console.log('=== DEBUG CHARTS SIMPLE ===');
    console.log('Chart.js disponible:', typeof Chart !== 'undefined');
    
    const canvas1 = document.getElementById('overviewCategoryChart');
    const canvas2 = document.getElementById('overviewTrendsChart');
    const canvas3 = document.getElementById('overviewIncomeExpensesChart');
    
    console.log('Canvas encontrados:', {
        categoryChart: !!canvas1,
        trendsChart: !!canvas2,
        incomeExpensesChart: !!canvas3
    });
    
    if (canvas1) console.log('Canvas 1 dimensions:', canvas1.offsetWidth, 'x', canvas1.offsetHeight);
    if (canvas2) console.log('Canvas 2 dimensions:', canvas2.offsetWidth, 'x', canvas2.offsetHeight);
    if (canvas3) console.log('Canvas 3 dimensions:', canvas3.offsetWidth, 'x', canvas3.offsetHeight);
    
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

// Función para actualizar patrimonio neto
function updateNetWorth() {
    console.log('💰 Actualizando patrimonio neto...');
    
    // Datos de ejemplo para patrimonio
    const netWorthData = {
        totalAssets: 52180,
        totalLiabilities: 6950,
        netWorth: 45230,
        monthlyChange: 2150
    };
    
    // Actualizar elementos del patrimonio
    const netWorthValue = document.getElementById('net-worth-value');
    const netWorthChange = document.getElementById('net-worth-change');
    const totalAssets = document.getElementById('total-assets');
    const totalLiabilities = document.getElementById('total-liabilities');
    
    if (netWorthValue) {
        netWorthValue.textContent = `€${netWorthData.netWorth.toLocaleString()}`;
        console.log('✅ Patrimonio neto actualizado');
    } else {
        console.log('❌ Elemento net-worth-value no encontrado');
    }
    
    if (netWorthChange) {
        netWorthChange.textContent = `+€${netWorthData.monthlyChange.toLocaleString()} este mes`;
        console.log('✅ Cambio mensual actualizado');
    } else {
        console.log('❌ Elemento net-worth-change no encontrado');
    }
    
    if (totalAssets) {
        totalAssets.textContent = `€${netWorthData.totalAssets.toLocaleString()}`;
        console.log('✅ Total activos actualizado');
    } else {
        console.log('❌ Elemento total-assets no encontrado');
    }
    
    if (totalLiabilities) {
        totalLiabilities.textContent = `€${netWorthData.totalLiabilities.toLocaleString()}`;
        console.log('✅ Total pasivos actualizado');
    } else {
        console.log('❌ Elemento total-liabilities no encontrado');
    }
}

// Función para actualizar lista de activos
function updateAssetsList() {
    console.log('📈 Actualizando lista de activos...');
    
    const container = document.getElementById('assets-list');
    if (!container) {
        console.log('❌ Container assets-list no encontrado');
        return;
    }

    const assets = [
        { name: 'Cuenta Corriente', amount: 8500, type: 'bank' },
        { name: 'Cuenta de Ahorros', amount: 12000, type: 'bank' },
        { name: 'Inversiones', amount: 8500, type: 'investment' },
        { name: 'Coche', amount: 15000, type: 'vehicle' },
        { name: 'Propiedad', amount: 8500, type: 'property' }
    ];

    container.innerHTML = assets.map(asset => `
        <div class="asset-item">
            <div class="asset-info">
                <span class="asset-name">${asset.name}</span>
                <span class="asset-type">${asset.type}</span>
            </div>
            <div class="asset-amount positive">
                €${asset.amount.toLocaleString()}
            </div>
        </div>
    `).join('');
    
    console.log('✅ Lista de activos actualizada:', assets.length, 'activos');
}

// Función para actualizar lista de pasivos
function updateLiabilitiesList() {
    console.log('📉 Actualizando lista de pasivos...');
    
    const container = document.getElementById('liabilities-list');
    if (!container) {
        console.log('❌ Container liabilities-list no encontrado');
        return;
    }

    const liabilities = [
        { name: 'Hipoteca', amount: 4500, type: 'mortgage', interest: 2.5 },
        { name: 'Préstamo Coche', amount: 1200, type: 'loan', interest: 4.2 },
        { name: 'Tarjeta de Crédito', amount: 800, type: 'credit', interest: 18.5 },
        { name: 'Préstamo Personal', amount: 450, type: 'loan', interest: 6.8 }
    ];

    container.innerHTML = liabilities.map(liability => `
        <div class="liability-item">
            <div class="liability-info">
                <span class="liability-name">${liability.name}</span>
                <span class="liability-type">${liability.type} (${liability.interest}%)</span>
            </div>
            <div class="liability-amount negative">
                €${liability.amount.toLocaleString()}
            </div>
        </div>
    `).join('');
    
    console.log('✅ Lista de pasivos actualizada:', liabilities.length, 'pasivos');
}

// Función para actualizar insights de amortización
function updateAmortizationInsights() {
    console.log('💡 Actualizando insights de amortización...');
    
    const container = document.getElementById('liability-insights');
    if (!container) {
        console.log('❌ Container liability-insights no encontrado');
        return;
    }

    const insights = [
        {
            title: 'Prioridad de Amortización',
            content: 'Amortiza primero la Tarjeta de Crédito (18.5% interés) para ahorrar €148/año',
            action: 'Optimizar'
        },
        {
            title: 'Impacto en Patrimonio',
            content: 'Reducir deudas en €1,000 aumentaría tu patrimonio neto en €1,000',
            action: 'Calcular'
        },
        {
            title: 'Recomendación Inteligente',
            content: 'Con €500/mes extra, podrías eliminar la Tarjeta de Crédito en 1.6 meses',
            action: 'Planificar'
        }
    ];
    
    container.innerHTML = insights.map(insight => `
        <div class="insight-card">
            <div class="insight-icon">💡</div>
            <div class="insight-content">
                <h4>${insight.title}</h4>
                <p>${insight.content}</p>
                <div class="insight-action">
                    <button class="btn btn-sm btn-outline">${insight.action}</button>
                </div>
            </div>
        </div>
    `).join('');
    
    console.log('✅ Insights de amortización actualizados');
}

// Función para cargar pestaña de patrimonio
function loadAssetsTab() {
    console.log('🏠 Cargando pestaña de patrimonio...');
    
    const container = document.getElementById('assets');
    if (container) {
        // Actualizar listas de activos y pasivos
        updateAssetsList();
        updateLiabilitiesList();
        updateAmortizationInsights();
        
        console.log('✅ Pestaña de patrimonio cargada');
    }
}

// Funciones para modales de patrimonio
function showAddAssetModal() {
    console.log('➕ Mostrando modal de nuevo activo...');
    alert('Funcionalidad de nuevo activo en desarrollo');
}

function showAddLiabilityModal() {
    console.log('➕ Mostrando modal de nuevo pasivo...');
    alert('Funcionalidad de nuevo pasivo en desarrollo');
}

function showAssetsList() {
    console.log('📋 Mostrando lista de activos...');
    showTab('assets');
}

function showLiabilitiesList() {
    console.log('📋 Mostrando lista de pasivos...');
    showTab('assets');
}

function showNetWorthSettings() {
    console.log('⚙️ Mostrando configuración de patrimonio...');
    alert('Funcionalidad de configuración en desarrollo');
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

    // Cargar contenido específico de la pestaña
    switch (tabName) {
        case 'overview':
            updateFinancialSummary();
            updateRecentTransactions();
            updateNetWorth();
            updateAllCharts();
            break;
        case 'transactions':
            console.log('📝 Cargando pestaña de transacciones...');
            break;
        case 'budgets':
            console.log('💰 Cargando pestaña de presupuestos...');
            break;
        case 'analytics':
            console.log('📊 Cargando pestaña de análisis...');
            break;
        case 'goals':
            console.log('🎯 Cargando pestaña de objetivos...');
            break;
        case 'assets':
            loadAssetsTab();
            break;
        default:
            console.log('❓ Pestaña desconocida:', tabName);
    }
}

// Función para actualizar todas las gráficas
function updateAllCharts() {
    console.log('📊 Actualizando todas las gráficas...');
    
    if (typeof Chart !== 'undefined') {
        createCategoryChart();
        createTrendsChart();
        createIncomeExpensesChart();
        console.log('✅ Todas las gráficas actualizadas');
    } else {
        console.log('❌ Chart.js no disponible para actualizar gráficas');
    }
}

// Hacer funciones globales
window.debugCharts = debugCharts;
window.initializeDashboard = initializeDashboard;
window.showTab = showTab;
window.updateAllCharts = updateAllCharts;
window.updateNetWorth = updateNetWorth;
window.updateAssetsList = updateAssetsList;
window.updateLiabilitiesList = updateLiabilitiesList;
window.updateAmortizationInsights = updateAmortizationInsights;
window.loadAssetsTab = loadAssetsTab;
window.showAddAssetModal = showAddAssetModal;
window.showAddLiabilityModal = showAddLiabilityModal;
window.showAssetsList = showAssetsList;
window.showLiabilitiesList = showLiabilitiesList;
window.showNetWorthSettings = showNetWorthSettings;
window.showSavingsConfiguration = showSavingsConfiguration;

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
            createCategoryChart();
            createTrendsChart();
            createIncomeExpensesChart();
        } else {
            console.log('❌ Chart.js no disponible');
        }
    }, 500);
});

console.log('=== VEEDOR CHARTS SIMPLE CARGADO ===');
