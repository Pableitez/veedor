// ========================================
// FUNCIONES DE MODAL (GLOBALES)
// ========================================

// ========================================
// MODALES NUEVOS - FUNCIONES SIMPLIFICADAS
// ========================================

/**
 * Toggle del menú móvil hamburguesa
 */
function toggleMobileMenu() {
    const navMenu = document.getElementById('nav-menu');
    const hamburger = document.querySelector('.hamburger');
    
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
}

/**
 * Cerrar el menú móvil
 */
function closeMobileMenu() {
    const navMenu = document.getElementById('nav-menu');
    const hamburger = document.querySelector('.hamburger');
    
    navMenu.classList.remove('active');
    hamburger.classList.remove('active');
}

/**
 * Cerrar menú al hacer clic fuera
 */
document.addEventListener('click', function(event) {
    const navMenu = document.getElementById('nav-menu');
    const hamburger = document.querySelector('.hamburger');
    const navbar = document.querySelector('.navbar');
    
    if (navMenu.classList.contains('active') && 
        !navbar.contains(event.target)) {
        closeMobileMenu();
    }
});

/**
 * Cerrar menú al cambiar tamaño de ventana
 */
window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
        closeMobileMenu();
    }
});

/**
 * Cierra un modal específico por su ID
 * @param {string} modalId - ID del modal a cerrar
 */
function closeModal(modalId) {
    console.log('Closing modal:', modalId);
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
        console.log('Modal closed:', modalId);
    }
}

/**
 * Muestra el modal de autenticación
 */
function showAuth() {
    console.log('showAuth called');
    const authOverlay = document.getElementById('auth-overlay');
    if (authOverlay) {
        authOverlay.classList.add('show');
        document.body.style.overflow = 'hidden';
        console.log('Auth modal opened');
    } else {
        console.error('Auth overlay not found');
    }
}

/**
 * Oculta el modal de autenticación
 */
function hideAuth() {
    console.log('hideAuth called');
    const authOverlay = document.getElementById('auth-overlay');
    if (authOverlay) {
        authOverlay.classList.remove('show');
        document.body.style.overflow = 'auto';
        console.log('Auth modal closed');
    } else {
        console.error('Auth overlay not found');
    }
}

// Event listeners para cerrar modales
document.addEventListener('DOMContentLoaded', function() {
    // Cerrar modal al hacer click fuera
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal') || e.target.classList.contains('auth-overlay')) {
            const modalId = e.target.id;
            if (modalId === 'auth-overlay') {
                hideAuth();
            } else if (modalId.startsWith('modal')) {
                closeModal(modalId);
            }
        }
    });

    // Cerrar modal con Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            // Cerrar auth modal si está abierto
            const authOverlay = document.getElementById('auth-overlay');
            if (authOverlay && authOverlay.classList.contains('show')) {
                hideAuth();
            }
            
            // Cerrar otros modales
            const openModals = document.querySelectorAll('.modal.show');
            openModals.forEach(modal => {
                closeModal(modal.id);
            });
        }
    });
});

// Hacer funciones globales
window.openModal = openModal;
window.closeModal = closeModal;
window.showAuth = showAuth;
window.hideAuth = hideAuth;

// ========================================
// APLICACIÓN PRINCIPAL
// ========================================

class App {
    constructor() {
        this.init();
    }

    // Inicializar la aplicación
    init() {
        console.log(`${CONFIG.APP_NAME} v${CONFIG.VERSION} iniciada`);
        
        // Configurar UI
        this.setupUI();
        
        // Configurar eventos
        this.setupEvents();
        
        // Cargar datos iniciales
        this.loadInitialData();
    }

    // Configurar interfaz de usuario
    setupUI() {
        uiManager.setupSmoothNavigation();
        uiManager.setupRealTimeValidation();
    }

    // Configurar eventos
    setupEvents() {
        // Evento para agregar gasto
        const agregarBtn = document.querySelector('.calc-inputs button');
        if (agregarBtn) {
            agregarBtn.addEventListener('click', () => {
                const descripcion = document.getElementById('gasto').value;
                const monto = document.getElementById('monto').value;
                const categoria = document.getElementById('categoria').value;
                
                gastosManager.agregarGasto(descripcion, monto, categoria);
            });
        }

        // Evento para mostrar funciones (scroll)
        const ctaButton = document.querySelector('.cta-button');
        if (ctaButton) {
            ctaButton.addEventListener('click', () => {
                document.getElementById('funciones').scrollIntoView({
                    behavior: 'smooth'
                });
            });
        }
    }

    // Cargar datos iniciales
    loadInitialData() {
        gastosManager.loadGastos();
    }
}

// Función para agregar gasto (compatibilidad con HTML)
function agregarGasto() {
    const descripcion = document.getElementById('gasto').value;
    const monto = document.getElementById('monto').value;
    const categoria = document.getElementById('categoria').value;
    
    gastosManager.agregarGasto(descripcion, monto, categoria);
}

// Función para mostrar funciones (compatibilidad con HTML)
function mostrarFunciones() {
    document.getElementById('funciones').scrollIntoView({
        behavior: 'smooth'
    });
}

// ========================================
// NAVEGACIÓN
// ========================================

// Mostrar sección de inicio
function showInicio() {
    // Ocultar dashboard si existe
    const dashboard = document.getElementById('dashboard');
    if (dashboard) dashboard.style.display = 'none';
    
    // Mostrar solo el inicio
    const inicio = document.getElementById('inicio');
    if (inicio) {
        inicio.style.display = 'block';
        inicio.scrollIntoView({
            behavior: 'smooth'
        });
    }
}

// Mostrar calculadora
function showCalculadora() {
    // Ocultar dashboard si existe
    const dashboard = document.getElementById('dashboard');
    if (dashboard) dashboard.style.display = 'none';
    
    // Mostrar calculadora si existe
    const calculadora = document.getElementById('calculadora');
    if (calculadora) {
        calculadora.style.display = 'block';
        calculadora.scrollIntoView({
            behavior: 'smooth'
        });
    } else {
        console.log('Calculadora no encontrada');
    }
}

// Mostrar sección de funciones
function showFeatures() {
    // Ocultar dashboard si existe
    const dashboard = document.getElementById('dashboard');
    if (dashboard) dashboard.style.display = 'none';
    
    // Mostrar funciones
    const features = document.getElementById('features');
    if (features) {
        features.style.display = 'block';
        features.scrollIntoView({
            behavior: 'smooth'
        });
    }
}

// Mostrar sección acerca de
function showAbout() {
    // Ocultar dashboard si existe
    const dashboard = document.getElementById('dashboard');
    if (dashboard) dashboard.style.display = 'none';
    
    // Mostrar acerca de (footer)
    const footer = document.getElementById('footer');
    if (footer) {
        footer.scrollIntoView({
            behavior: 'smooth'
        });
    }
}

// Mostrar pestaña específica del dashboard
function showDashboardTab(tabName) {
    console.log('showDashboardTab llamado con:', tabName);
    
    // Mostrar el dashboard primero
    showDashboard();
    
    // Esperar un poco para que el dashboard se cargue
    setTimeout(() => {
        if (window.dashboardManager) {
            console.log('Llamando a dashboardManager.showDashboardTab');
            window.dashboardManager.showDashboardTab(tabName);
        } else {
            console.log('DashboardManager no disponible, intentando inicializar...');
            // Intentar inicializar el dashboard manager
            if (typeof DashboardManager !== 'undefined') {
                window.dashboardManager = new DashboardManager();
                window.dashboardManager.showDashboardTab(tabName);
            } else {
                console.error('DashboardManager no está definido');
            }
        }
    }, 200);
}

// Generar datos de demo ESPECTACULARES
function generateSpectacularDemoData() {
    console.log('=== GENERANDO DATOS DE DEMO ESPECTACULARES ===');
    
    const transactions = [];
    const now = new Date();
    let transactionId = 1;

    try {
        // Perfil de usuario demo: Profesional joven con buen salario
        const monthlyBudget = {
            income: 3500, // Salario alto para impresionar
            fixedExpenses: {
                vivienda: 1200, // Alquiler de piso bueno
                suministros: 180, // Luz, agua, gas, internet premium
                seguro: 80, // Seguro de coche + vida
                movil: 45 // Plan premium
            },
            variableExpenses: {
                alimentacion: 450, // Supermercado premium + restaurantes
                transporte: 250, // Coche + transporte público
                salud: 120, // Gimnasio premium + farmacia
                entretenimiento: 200, // Ocio + streaming + conciertos
                ropa: 150, // Ropa de marca
                otros: 200 // Imprevistos y gastos varios
            }
        };

        // Generar datos para los últimos 6 meses (más manejable)
        for (let i = 5; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const year = date.getFullYear();
            const month = date.getMonth();
            const isCurrentMonth = i === 0;
            
            // INGRESOS MENSUALES
            // Salario principal
            transactions.push({
                id: (transactionId++).toString(),
                type: 'income',
                description: 'Salario',
                amount: monthlyBudget.income,
                category: 'otros',
                date: `${year}-${String(month + 1).padStart(2, '0')}-01`,
                time: '00:00'
            });

            // Ingresos extra frecuentes (freelance, bonus, etc.)
            if (Math.random() < 0.4) {
                transactions.push({
                    id: (transactionId++).toString(),
                    type: 'income',
                    description: 'Freelance/Proyecto',
                    amount: 400 + Math.random() * 600,
                    category: 'otros',
                    date: `${year}-${String(month + 1).padStart(2, '0')}-${Math.floor(Math.random() * 28) + 1}`,
                    time: '00:00'
                });
            }

            // GASTOS FIJOS MENSUALES
            // Vivienda
            transactions.push({
                id: (transactionId++).toString(),
                type: 'expense',
                description: 'Alquiler',
                amount: monthlyBudget.fixedExpenses.vivienda,
                category: 'vivienda',
                date: `${year}-${String(month + 1).padStart(2, '0')}-01`,
                time: '00:00'
            });

            // Suministros
            transactions.push({
                id: (transactionId++).toString(),
                type: 'expense',
                description: 'Luz, agua, gas',
                amount: monthlyBudget.fixedExpenses.suministros,
                category: 'vivienda',
                date: `${year}-${String(month + 1).padStart(2, '0')}-05`,
                time: '00:00'
            });

            // Internet premium
            transactions.push({
                id: (transactionId++).toString(),
                type: 'expense',
                description: 'Internet Fibra',
                amount: 65,
                category: 'vivienda',
                date: `${year}-${String(month + 1).padStart(2, '0')}-10`,
                time: '00:00'
            });

            // Seguros
            transactions.push({
                id: (transactionId++).toString(),
                type: 'expense',
                description: 'Seguro coche',
                amount: monthlyBudget.fixedExpenses.seguro,
                category: 'otros',
                date: `${year}-${String(month + 1).padStart(2, '0')}-15`,
                time: '00:00'
            });

            // Móvil premium
            transactions.push({
                id: (transactionId++).toString(),
                type: 'expense',
                description: 'Móvil Premium',
                amount: monthlyBudget.fixedExpenses.movil,
                category: 'otros',
                date: `${year}-${String(month + 1).padStart(2, '0')}-20`,
                time: '00:00'
            });

            // GASTOS VARIABLES (solo para el mes actual para evitar sobrecarga)
            if (isCurrentMonth) {
                const variableExpenses = [
                    // Alimentación premium
                    { category: 'alimentacion', amount: 120, description: 'Mercadona Premium' },
                    { category: 'alimentacion', amount: 85, description: 'Carrefour' },
                    { category: 'alimentacion', amount: 65, description: 'Restaurante Japonés' },
                    { category: 'alimentacion', amount: 45, description: 'Café de especialidad' },
                    { category: 'alimentacion', amount: 55, description: 'Supermercado Bio' },
                    { category: 'alimentacion', amount: 35, description: 'Panadería artesanal' },
                    { category: 'alimentacion', amount: 45, description: 'Cena con amigos' },
                    
                    // Transporte
                    { category: 'transporte', amount: 80, description: 'Gasolina' },
                    { category: 'transporte', amount: 35, description: 'Metro/Bus' },
                    { category: 'transporte', amount: 25, description: 'Parking centro' },
                    { category: 'transporte', amount: 30, description: 'Taxi' },
                    { category: 'transporte', amount: 20, description: 'Uber' },
                    { category: 'transporte', amount: 60, description: 'Mantenimiento coche' },
                    
                    // Salud y bienestar
                    { category: 'salud', amount: 45, description: 'Gimnasio Premium' },
                    { category: 'salud', amount: 35, description: 'Farmacia' },
                    { category: 'salud', amount: 40, description: 'Masaje' },
                    
                    // Entretenimiento premium
                    { category: 'entretenimiento', amount: 15, description: 'Netflix Premium' },
                    { category: 'entretenimiento', amount: 12, description: 'Spotify Premium' },
                    { category: 'entretenimiento', amount: 25, description: 'Cine IMAX' },
                    { category: 'entretenimiento', amount: 40, description: 'Bar de moda' },
                    { category: 'entretenimiento', amount: 80, description: 'Concierto' },
                    { category: 'entretenimiento', amount: 28, description: 'Disney+' },
                    
                    // Ropa y estilo
                    { category: 'otros', amount: 120, description: 'Ropa Zara' },
                    { category: 'otros', amount: 80, description: 'Zapatos' },
                    { category: 'otros', amount: 30, description: 'Peluquería' },
                    { category: 'otros', amount: 50, description: 'Regalo' },
                    { category: 'otros', amount: 60, description: 'Imprevisto' }
                ];

                variableExpenses.forEach(expense => {
                    const day = Math.floor(Math.random() * 28) + 1;
                    transactions.push({
                        id: (transactionId++).toString(),
                        type: 'expense',
                        description: expense.description,
                        amount: expense.amount,
                        category: expense.category,
                        date: `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
                        time: `${Math.floor(Math.random() * 24).toString().padStart(2, '0')}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`
                    });
                });
            }
        }

        console.log('Datos espectaculares generados:', transactions.length, 'transacciones');
        
        // Guardar transacciones
        localStorage.setItem('veedorTransactions', JSON.stringify(transactions));

        // Presupuestos espectaculares
        const budgetCurrentMonth = new Date().getMonth();
        const budgetCurrentYear = new Date().getFullYear();
        
        const currentMonthExpenses = transactions.filter(t => 
            t.type === 'expense' && 
            new Date(t.date).getMonth() === budgetCurrentMonth && 
            new Date(t.date).getFullYear() === budgetCurrentYear
        );

        const categorySpent = {};
        currentMonthExpenses.forEach(expense => {
            categorySpent[expense.category] = (categorySpent[expense.category] || 0) + expense.amount;
        });

        const spectacularBudgets = [
            {
                id: '1',
                category: 'vivienda',
                amount: 1445, // 1200 + 180 + 65
                spent: Math.round(categorySpent.vivienda || 0),
                period: 'monthly',
                createdAt: '2020-01-01T00:00:00.000Z',
                isActive: true,
                alertThresholds: {
                    warning: 0.8,
                    critical: 0.95
                }
            },
            {
                id: '2',
                category: 'alimentacion',
                amount: 450,
                spent: Math.round(categorySpent.alimentacion || 0),
                period: 'monthly',
                createdAt: '2020-01-01T00:00:00.000Z',
                isActive: true,
                alertThresholds: {
                    warning: 0.8,
                    critical: 0.95
                }
            },
            {
                id: '3',
                category: 'transporte',
                amount: 250,
                spent: Math.round(categorySpent.transporte || 0),
                period: 'monthly',
                createdAt: '2020-01-01T00:00:00.000Z',
                isActive: true,
                alertThresholds: {
                    warning: 0.8,
                    critical: 0.95
                }
            },
            {
                id: '4',
                category: 'salud',
                amount: 120,
                spent: Math.round(categorySpent.salud || 0),
                period: 'monthly',
                createdAt: '2020-01-01T00:00:00.000Z',
                isActive: true,
                alertThresholds: {
                    warning: 0.8,
                    critical: 0.95
                }
            },
            {
                id: '5',
                category: 'entretenimiento',
                amount: 200,
                spent: Math.round(categorySpent.entretenimiento || 0),
                period: 'monthly',
                createdAt: '2020-01-01T00:00:00.000Z',
                isActive: true,
                alertThresholds: {
                    warning: 0.8,
                    critical: 0.95
                }
            },
            {
                id: '6',
                category: 'otros',
                amount: 370, // 80 + 45 + 150 + 95
                spent: Math.round(categorySpent.otros || 0),
                period: 'monthly',
                createdAt: '2020-01-01T00:00:00.000Z',
                isActive: true,
                alertThresholds: {
                    warning: 0.8,
                    critical: 0.95
                }
            }
        ];

        localStorage.setItem('veedorBudgets', JSON.stringify(spectacularBudgets));

        // Objetivos espectaculares
        const spectacularGoals = [
            {
                id: '1',
                name: 'Entrada para Piso',
                targetAmount: 50000,
                currentAmount: 18500, // 37% completado
                createdAt: '2020-01-01T00:00:00.000Z',
                isActive: true
            },
            {
                id: '2',
                name: 'Vacaciones Japón',
                targetAmount: 4000,
                currentAmount: 2800, // 70% completado
                createdAt: '2021-01-01T00:00:00.000Z',
                isActive: true
            },
            {
                id: '3',
                name: 'Tesla Model 3',
                targetAmount: 45000,
                currentAmount: 12000, // 27% completado
                createdAt: '2022-01-01T00:00:00.000Z',
                isActive: true
            },
            {
                id: '4',
                name: 'Fondo de Emergencia',
                targetAmount: 21000, // 6 meses de gastos
                currentAmount: 15000, // 71% completado
                createdAt: '2020-01-01T00:00:00.000Z',
                isActive: true
            },
            {
                id: '5',
                name: 'Máster en IA',
                targetAmount: 8000,
                currentAmount: 3200, // 40% completado
                createdAt: '2023-01-01T00:00:00.000Z',
                isActive: true
            }
        ];

        localStorage.setItem('veedorGoals', JSON.stringify(spectacularGoals));
        
        console.log('=== DATOS DE DEMO ESPECTACULARES GENERADOS ===');
        console.log('Transacciones:', transactions.length);
        console.log('Presupuestos:', spectacularBudgets.length);
        console.log('Objetivos:', spectacularGoals.length);
        
    } catch (error) {
        console.error('Error generando datos espectaculares:', error);
    }
}

// Generar datos históricos realistas para un español medio
function generateHistoricalData(years) {
    console.log('Generando presupuesto realista español...');
    
    const transactions = [];
    const now = new Date();
    let transactionId = 1;

    try {
        // Presupuesto realista para un español medio (2024)
        const monthlyBudget = {
            income: 2200, // Salario neto medio en España
            fixedExpenses: {
                vivienda: 650, // Alquiler/hipoteca
                suministros: 120, // Luz, agua, gas, internet
                seguro: 45, // Seguro de coche/vida
                movil: 25 // Móvil
            },
            variableExpenses: {
                alimentacion: 280, // Supermercado + restaurantes
                transporte: 150, // Gasolina + transporte público
                salud: 60, // Farmacia + gimnasio
                entretenimiento: 80, // Ocio + streaming
                ropa: 50, // Ropa y calzado
                otros: 100 // Imprevistos y gastos varios
            }
        };

        // Generar datos para los últimos 12 meses
        for (let i = 11; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const year = date.getFullYear();
            const month = date.getMonth();
            const isCurrentMonth = i === 0;
            
            // INGRESOS MENSUALES
            // Salario principal
            transactions.push({
                id: (transactionId++).toString(),
                type: 'income',
                description: 'Salario',
                amount: monthlyBudget.income,
                category: 'otros',
                date: `${year}-${String(month + 1).padStart(2, '0')}-01`,
                time: '00:00'
            });

            // Ingresos extra ocasionales (cada 3-4 meses)
            if (Math.random() < 0.25) {
                transactions.push({
                    id: (transactionId++).toString(),
                    type: 'income',
                    description: 'Bonus/Extra',
                    amount: 200 + Math.random() * 300,
                    category: 'otros',
                    date: `${year}-${String(month + 1).padStart(2, '0')}-${Math.floor(Math.random() * 28) + 1}`,
                    time: '00:00'
                });
            }

            // GASTOS FIJOS MENSUALES
            // Vivienda
            transactions.push({
                id: (transactionId++).toString(),
                type: 'expense',
                description: 'Alquiler/Hipoteca',
                amount: monthlyBudget.fixedExpenses.vivienda,
                category: 'vivienda',
                date: `${year}-${String(month + 1).padStart(2, '0')}-01`,
                time: '00:00'
            });

            // Suministros
            transactions.push({
                id: (transactionId++).toString(),
                type: 'expense',
                description: 'Luz, agua, gas',
                amount: monthlyBudget.fixedExpenses.suministros,
                category: 'vivienda',
                date: `${year}-${String(month + 1).padStart(2, '0')}-05`,
                time: '00:00'
            });

            // Internet
            transactions.push({
                id: (transactionId++).toString(),
                type: 'expense',
                description: 'Internet',
                amount: 35,
                category: 'vivienda',
                date: `${year}-${String(month + 1).padStart(2, '0')}-10`,
                time: '00:00'
            });

            // Seguro
            transactions.push({
                id: (transactionId++).toString(),
                type: 'expense',
                description: 'Seguro coche',
                amount: monthlyBudget.fixedExpenses.seguro,
                category: 'otros',
                date: `${year}-${String(month + 1).padStart(2, '0')}-15`,
                time: '00:00'
            });

            // Móvil
            transactions.push({
                id: (transactionId++).toString(),
                type: 'expense',
                description: 'Móvil',
                amount: monthlyBudget.fixedExpenses.movil,
                category: 'otros',
                date: `${year}-${String(month + 1).padStart(2, '0')}-20`,
                time: '00:00'
            });

            // GASTOS VARIABLES (solo para el mes actual para evitar sobrecarga)
            if (isCurrentMonth) {
                const variableExpenses = [
                    // Alimentación
                    { category: 'alimentacion', amount: 85, description: 'Mercadona' },
                    { category: 'alimentacion', amount: 45, description: 'Carrefour' },
                    { category: 'alimentacion', amount: 35, description: 'Restaurante' },
                    { category: 'alimentacion', amount: 25, description: 'Café/Desayuno' },
                    { category: 'alimentacion', amount: 30, description: 'Supermercado' },
                    { category: 'alimentacion', amount: 20, description: 'Panadería' },
                    
                    // Transporte
                    { category: 'transporte', amount: 45, description: 'Gasolina' },
                    { category: 'transporte', amount: 25, description: 'Metro/Bus' },
                    { category: 'transporte', amount: 15, description: 'Parking' },
                    { category: 'transporte', amount: 20, description: 'Taxi' },
                    { category: 'transporte', amount: 12, description: 'Uber' },
                    
                    // Salud
                    { category: 'salud', amount: 25, description: 'Farmacia' },
                    { category: 'salud', amount: 35, description: 'Gimnasio' },
                    
                    // Entretenimiento
                    { category: 'entretenimiento', amount: 12, description: 'Netflix' },
                    { category: 'entretenimiento', amount: 8, description: 'Spotify' },
                    { category: 'entretenimiento', amount: 15, description: 'Cine' },
                    { category: 'entretenimiento', amount: 20, description: 'Bar' },
                    { category: 'entretenimiento', amount: 25, description: 'Concierto' },
                    
                    // Ropa
                    { category: 'otros', amount: 30, description: 'Ropa' },
                    { category: 'otros', amount: 20, description: 'Calzado' },
                    
                    // Otros
                    { category: 'otros', amount: 15, description: 'Peluquería' },
                    { category: 'otros', amount: 25, description: 'Regalo' },
                    { category: 'otros', amount: 40, description: 'Imprevisto' }
                ];

                variableExpenses.forEach(expense => {
                    const day = Math.floor(Math.random() * 28) + 1;
                    transactions.push({
                        id: (transactionId++).toString(),
                        type: 'expense',
                        description: expense.description,
                        amount: expense.amount,
                        category: expense.category,
                        date: `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
                        time: `${Math.floor(Math.random() * 24).toString().padStart(2, '0')}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`
                    });
                });
            }
        }

        console.log('Presupuesto español generado:', transactions.length, 'transacciones');
        return transactions;
        
    } catch (error) {
        console.error('Error generando presupuesto español:', error);
        return [];
    }
}

// Cargar datos de desarrollo para pruebas
function loadDevData() {
    console.log('=== INICIANDO CARGA DE DATOS DE DESARROLLO ===');
    
    try {
        // Obtener fecha actual para datos de ejemplo
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth();
        
        console.log('Fecha actual:', now);
        console.log('Año actual:', currentYear, 'Mes actual:', currentMonth);
        
        // Generar datos de 5 años (60 meses)
        console.log('Generando datos históricos...');
        const sampleTransactions = generateHistoricalData(5);
        console.log('Transacciones generadas:', sampleTransactions.length);

    // Guardar datos de ejemplo en localStorage
    localStorage.setItem('veedorTransactions', JSON.stringify(sampleTransactions));
    console.log('Transacciones guardadas en localStorage:', sampleTransactions.length);

    // Calcular gastos del mes actual para presupuestos realistas
    const budgetCurrentMonth = new Date().getMonth();
    const budgetCurrentYear = new Date().getFullYear();
    
    const currentMonthExpenses = sampleTransactions.filter(t => 
        t.type === 'expense' && 
        new Date(t.date).getMonth() === budgetCurrentMonth && 
        new Date(t.date).getFullYear() === budgetCurrentYear
    );

    // Agrupar gastos por categoría del mes actual
    const categorySpent = {};
    currentMonthExpenses.forEach(expense => {
        categorySpent[expense.category] = (categorySpent[expense.category] || 0) + expense.amount;
    });

    // Presupuesto realista para un español medio
    const sampleBudgets = [
        {
            id: '1',
            category: 'vivienda',
            amount: 705, // 650 + 35 + 20 (alquiler + suministros + internet)
            spent: Math.round(categorySpent.vivienda || 0),
            period: 'monthly',
            createdAt: '2020-01-01T00:00:00.000Z',
            isActive: true,
            alertThresholds: {
                warning: 0.8,
                critical: 0.95
            }
        },
        {
            id: '2',
            category: 'alimentacion',
            amount: 280,
            spent: Math.round(categorySpent.alimentacion || 0),
            period: 'monthly',
            createdAt: '2020-01-01T00:00:00.000Z',
            isActive: true,
            alertThresholds: {
                warning: 0.8,
                critical: 0.95
            }
        },
        {
            id: '3',
            category: 'transporte',
            amount: 150,
            spent: Math.round(categorySpent.transporte || 0),
            period: 'monthly',
            createdAt: '2020-01-01T00:00:00.000Z',
            isActive: true,
            alertThresholds: {
                warning: 0.8,
                critical: 0.95
            }
        },
        {
            id: '4',
            category: 'salud',
            amount: 60,
            spent: Math.round(categorySpent.salud || 0),
            period: 'monthly',
            createdAt: '2020-01-01T00:00:00.000Z',
            isActive: true,
            alertThresholds: {
                warning: 0.8,
                critical: 0.95
            }
        },
        {
            id: '5',
            category: 'entretenimiento',
            amount: 80,
            spent: Math.round(categorySpent.entretenimiento || 0),
            period: 'monthly',
            createdAt: '2020-01-01T00:00:00.000Z',
            isActive: true,
            alertThresholds: {
                warning: 0.8,
                critical: 0.95
            }
        },
        {
            id: '6',
            category: 'otros',
            amount: 190, // 45 + 25 + 50 + 70 (seguro + móvil + ropa + otros)
            spent: Math.round(categorySpent.otros || 0),
            period: 'monthly',
            createdAt: '2020-01-01T00:00:00.000Z',
            isActive: true,
            alertThresholds: {
                warning: 0.8,
                critical: 0.95
            }
        }
    ];

    localStorage.setItem('veedorBudgets', JSON.stringify(sampleBudgets));
    console.log('Presupuestos guardados en localStorage:', sampleBudgets.length);

    // Objetivos realistas para un español medio
    const sampleGoals = [
        {
            id: '1',
            name: 'Fondo de Emergencia',
            targetAmount: 13200, // 6 meses de gastos (2200 * 6)
            currentAmount: 8000, // 60% completado
            createdAt: '2020-01-01T00:00:00.000Z',
            isActive: true
        },
        {
            id: '2',
            name: 'Vacaciones de Verano',
            targetAmount: 2000,
            currentAmount: 1200, // 60% completado
            createdAt: '2021-01-01T00:00:00.000Z',
            isActive: true
        },
        {
            id: '3',
            name: 'Nuevo Móvil',
            targetAmount: 800,
            currentAmount: 500, // 62% completado
            createdAt: '2022-01-01T00:00:00.000Z',
            isActive: true
        },
        {
            id: '4',
            name: 'Curso de Inglés',
            targetAmount: 1200,
            currentAmount: 300, // 25% completado
            createdAt: '2023-01-01T00:00:00.000Z',
            isActive: true
        },
        {
            id: '5',
            name: 'Entrada para Piso',
            targetAmount: 15000,
            currentAmount: 2500, // 17% completado
            createdAt: '2024-01-01T00:00:00.000Z',
            isActive: true
        }
    ];

    localStorage.setItem('veedorGoals', JSON.stringify(sampleGoals));
    console.log('Objetivos guardados en localStorage:', sampleGoals.length);

        console.log('Datos de desarrollo cargados correctamente');
        
        // Inicializar el dashboard manager
        if (!window.dashboardManager) {
            console.log('Inicializando DashboardManager...');
            window.dashboardManager = new DashboardManager();
            console.log('DashboardManager inicializado');
        }
        
        // Actualizar el dashboard
        if (window.dashboardManager) {
            console.log('Cargando datos en DashboardManager...');
            window.dashboardManager.loadData();
            console.log('Transacciones cargadas:', window.dashboardManager.transactions.length);
            console.log('Presupuestos cargados:', window.dashboardManager.budgets.length);
            console.log('Objetivos cargados:', window.dashboardManager.goals.length);
            
            console.log('Actualizando resumen financiero...');
            window.dashboardManager.updateFinancialSummary();
            
            console.log('Cargando pestaña de resumen...');
            window.dashboardManager.loadOverviewTab();
            
            console.log('=== DATOS DE DESARROLLO CARGADOS EXITOSAMENTE ===');
        } else {
            console.error('DashboardManager no disponible');
        }
        
    } catch (error) {
        console.error('Error cargando datos de desarrollo:', error);
        console.error('Stack trace:', error.stack);
    }
}

// ========================================
// SISTEMA DE AUTENTICACIÓN INTEGRADO
// ========================================

// Variables globales
let currentUser = null;
let useSupabase = false;

// Modo de desarrollo - permite probar sin autenticación
let DEV_MODE = true; // Cambiar a false en producción

// Función para probar datos
function testData() {
    console.log('=== TEST DE DATOS ===');
    console.log('DEV_MODE:', DEV_MODE);
    console.log('DashboardManager disponible:', typeof DashboardManager !== 'undefined');
    console.log('window.dashboardManager:', window.dashboardManager);
    
    if (window.dashboardManager) {
        console.log('Transacciones:', window.dashboardManager.transactions);
        console.log('Presupuestos:', window.dashboardManager.budgets);
        console.log('Objetivos:', window.dashboardManager.goals);
        console.log('Datos financieros:', window.dashboardManager.financialData);
    }
    
    // Forzar carga de datos de desarrollo
    loadDevData();
    
    if (window.dashboardManager) {
        window.dashboardManager.updateFinancialSummary();
        window.dashboardManager.loadOverviewTab();
        console.log('Datos actualizados después del test');
    }
}

// Función para cargar y mostrar demo ESPECTACULAR
function loadAndShowDemo() {
    console.log('=== CARGANDO DEMO ESPECTACULAR ===');
    
    // Mostrar loading state
    showDemoLoading();
    
    // Limpiar datos anteriores
    localStorage.removeItem('veedorTransactions');
    localStorage.removeItem('veedorBudgets');
    localStorage.removeItem('veedorGoals');
    
    // Generar datos de demo más espectaculares
    generateSpectacularDemoData();
    
    // Esperar un poco para que se carguen los datos
    setTimeout(() => {
        // Mostrar el dashboard con animación
        showDashboardWithAnimation();
        
        // Forzar actualización de todas las vistas
        if (window.dashboardManager) {
            console.log('Actualizando todas las vistas de la demo...');
            window.dashboardManager.calculateFinancialData();
            window.dashboardManager.updateFinancialSummary();
            window.dashboardManager.loadOverviewTab();
            
            // Actualizar también las otras pestañas
            if (typeof renderTransactionsTable === 'function') renderTransactionsTable();
            if (typeof updateTransactionSummary === 'function') updateTransactionSummary();
            if (typeof renderBudgets === 'function') renderBudgets();
            if (typeof updateBudgetSummary === 'function') updateBudgetSummary();
            if (typeof renderGoals === 'function') renderGoals();
            if (typeof updateGoalsSummary === 'function') updateGoalsSummary();
            
            // Mostrar notificación de éxito
            showDemoSuccess();
            
            console.log('Demo espectacular cargada y mostrada correctamente');
        } else {
            console.error('DashboardManager no disponible');
        }
    }, 800);
}

// Mostrar estado de carga de la demo
function showDemoLoading() {
    // Crear overlay de loading
    const loadingOverlay = document.createElement('div');
    loadingOverlay.id = 'demo-loading';
    loadingOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        color: white;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;
    
    loadingOverlay.innerHTML = `
        <div style="text-align: center;">
            <div style="font-size: 3rem; margin-bottom: 1rem;"></div>
            <h2 style="margin: 0 0 1rem 0; font-size: 2rem; font-weight: 600;">Preparando tu demo</h2>
            <p style="margin: 0 0 2rem 0; opacity: 0.9; font-size: 1.1rem;">Cargando datos financieros realistas...</p>
            <div style="width: 200px; height: 4px; background: rgba(255,255,255,0.2); border-radius: 2px; overflow: hidden;">
                <div id="loading-bar" style="width: 0%; height: 100%; background: white; border-radius: 2px; transition: width 0.3s ease;"></div>
            </div>
        </div>
    `;
    
    document.body.appendChild(loadingOverlay);
    
    // Animar la barra de progreso
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress > 100) progress = 100;
        document.getElementById('loading-bar').style.width = progress + '%';
        
        if (progress >= 100) {
            clearInterval(interval);
        }
    }, 100);
}

// Mostrar el dashboard con animación
function showDashboardWithAnimation() {
    // Ocultar loading
    const loadingOverlay = document.getElementById('demo-loading');
    if (loadingOverlay) {
        loadingOverlay.style.opacity = '0';
        setTimeout(() => {
            loadingOverlay.remove();
        }, 300);
    }
    
    // Mostrar dashboard
    showDashboard();
    
    // Añadir clase de animación al dashboard
    const dashboard = document.getElementById('dashboard');
    if (dashboard) {
        dashboard.style.opacity = '0';
        dashboard.style.transform = 'translateY(20px)';
        dashboard.style.transition = 'all 0.6s ease';
        
        setTimeout(() => {
            dashboard.style.opacity = '1';
            dashboard.style.transform = 'translateY(0)';
        }, 100);
    }
}

// Función para abrir la demo de página completa
function openDemo() {
    console.log('Abriendo demo de página completa...');
    
    // Ocultar el contenido principal
    const mainContent = document.querySelector('main');
    const header = document.querySelector('header');
    const footer = document.querySelector('footer');
    
    if (mainContent) mainContent.style.display = 'none';
    if (header) header.style.display = 'none';
    if (footer) footer.style.display = 'none';
    
    // Mostrar la demo de página completa
    const demoFullpage = document.getElementById('demo-fullpage');
    if (demoFullpage) {
        demoFullpage.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevenir scroll del body
        
        // Inicializar el dashboard en la demo
        setTimeout(() => {
            if (window.dashboardManager) {
                window.dashboardManager.loadDemoData();
                window.dashboardManager.updateFinancialSummary();
            }
        }, 300);
    }
}

// Función para cerrar la demo
function closeDemo() {
    console.log('Cerrando demo...');
    
    const demoFullpage = document.getElementById('demo-fullpage');
    if (demoFullpage) {
        demoFullpage.classList.remove('active');
        document.body.style.overflow = ''; // Restaurar scroll del body
        
        // Mostrar el contenido principal nuevamente
        setTimeout(() => {
            const mainContent = document.querySelector('main');
            const header = document.querySelector('header');
            const footer = document.querySelector('footer');
            
            if (mainContent) mainContent.style.display = '';
            if (header) header.style.display = '';
            if (footer) footer.style.display = '';
        }, 300);
    }
}

// Función para manejar la demo desde el botón "Ver Demo"
function showDemo() {
    openDemo();
}

// Mostrar notificación de éxito de la demo
function showDemoSuccess() {
    // Crear notificación de éxito
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #4CAF50, #45a049);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.2);
        z-index: 10001;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-weight: 500;
        transform: translateX(400px);
        transition: transform 0.4s ease;
    `;
    
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span style="font-size: 1.2rem;">🎉</span>
            <span>¡Demo cargada exitosamente!</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animar entrada
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remover después de 3 segundos
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            notification.remove();
        }, 400);
    }, 3000);
}

// Función para forzar actualización
function forceUpdate() {
    console.log('=== FORZANDO ACTUALIZACIÓN ===');
    
    // Limpiar localStorage
    localStorage.removeItem('veedorTransactions');
    localStorage.removeItem('veedorBudgets');
    localStorage.removeItem('veedorGoals');
    
    // Recargar datos
    loadDevData();
    
    // Forzar recálculo
    if (window.dashboardManager) {
        window.dashboardManager.calculateFinancialData();
        window.dashboardManager.updateFinancialSummary();
        window.dashboardManager.loadOverviewTab();
        
        // Actualizar también las otras pestañas
        renderTransactionsTable();
        updateTransactionSummary();
        renderBudgets();
        updateBudgetSummary();
        renderGoals();
        updateGoalsSummary();
        
        console.log('Actualización forzada completada');
    } else {
        console.error('DashboardManager no disponible para actualización');
    }
}

// Función para cambiar modo (útil para desarrollo)
function toggleDevMode() {
    DEV_MODE = !DEV_MODE;
    console.log('Modo desarrollo:', DEV_MODE ? 'ACTIVADO' : 'DESACTIVADO');
    
    if (DEV_MODE) {
        // Recargar página para aplicar modo desarrollo
        location.reload();
    } else {
        // Mostrar mensaje de que se necesita recargar
        alert('Cambia DEV_MODE a false y recarga la página para desactivar el modo desarrollo');
    }
}

// Función de prueba para el dashboard
function testDashboard() {
    console.log('=== INICIANDO TEST DASHBOARD ===');
    
    // Mostrar dashboard
    showDashboard();
    
    // Esperar y probar cambio de pestaña
    setTimeout(() => {
        console.log('Probando cambio a pestaña overview...');
        showDashboardTab('overview');
    }, 500);
    
    // Probar otra pestaña después
    setTimeout(() => {
        console.log('Probando cambio a pestaña transactions...');
        showDashboardTab('transactions');
    }, 2000);
}

// ========================================
// FUNCIONES DE GESTIÓN DE DATOS
// ========================================

// Limpiar filtros de transacciones
function clearFilters() {
    document.getElementById('filter-type').value = '';
    document.getElementById('filter-category').value = '';
    document.getElementById('filter-date').value = '';
    
    // Recargar tabla de transacciones
    if (window.dashboardManager) {
        renderTransactionsTable();
    }
}

// Editar transacción
function editTransaction(id) {
    console.log('Editando transacción:', id);
    // TODO: Implementar modal de edición
    alert('Función de edición en desarrollo');
}

// Eliminar transacción
function deleteTransaction(id) {
    if (confirm('¿Estás seguro de que quieres eliminar esta transacción?')) {
        if (window.dashboardManager) {
            window.dashboardManager.transactions = window.dashboardManager.transactions.filter(t => t.id !== id);
            window.dashboardManager.saveData();
            renderTransactionsTable();
            updateTransactionSummary();
            console.log('Transacción eliminada:', id);
        }
    }
}

// Editar presupuesto
function editBudget(id) {
    console.log('Editando presupuesto:', id);
    // TODO: Implementar modal de edición
    alert('Función de edición en desarrollo');
}

// Eliminar presupuesto
function deleteBudget(id) {
    if (confirm('¿Estás seguro de que quieres eliminar este presupuesto?')) {
        if (window.dashboardManager) {
            window.dashboardManager.budgets = window.dashboardManager.budgets.filter(b => b.id !== id);
            window.dashboardManager.saveData();
            renderBudgets();
            updateBudgetSummary();
            console.log('Presupuesto eliminado:', id);
        }
    }
}

// Editar objetivo
function editGoal(id) {
    console.log('Editando objetivo:', id);
    // TODO: Implementar modal de edición
    alert('Función de edición en desarrollo');
}

// Eliminar objetivo
function deleteGoal(id) {
    if (confirm('¿Estás seguro de que quieres eliminar este objetivo?')) {
        if (window.dashboardManager) {
            window.dashboardManager.goals = window.dashboardManager.goals.filter(g => g.id !== id);
            window.dashboardManager.saveData();
            renderGoals();
            updateGoalsSummary();
            console.log('Objetivo eliminado:', id);
        }
    }
}

// Manejar nueva transacción
function handleNewTransaction(event) {
    event.preventDefault();
    
    if (!window.dashboardManager) {
        console.error('DashboardManager no disponible');
        return;
    }
    
    const description = document.getElementById('transaction-description').value;
    const amount = parseFloat(document.getElementById('transaction-amount').value);
    const type = document.getElementById('transaction-type').value;
    const category = document.getElementById('transaction-category').value;
    const date = document.getElementById('transaction-date').value;
    
    if (!description || !amount || !category || !date) {
        alert('Por favor completa todos los campos');
        return;
    }
    
    const transaction = {
        id: Date.now().toString(),
        type: type,
        description: description,
        amount: amount,
        category: category,
        date: date,
        time: new Date().toTimeString().split(' ')[0]
    };
    
    // Agregar transacción
    window.dashboardManager.transactions.push(transaction);
    window.dashboardManager.saveData();
    window.dashboardManager.calculateFinancialData();
    window.dashboardManager.updateFinancialSummary();
    
    // Actualizar vistas
    renderTransactionsTable();
    updateTransactionSummary();
    
    // Cerrar modal
    hideAddTransaction();
    
    // Mostrar notificación
    alert('Transacción agregada correctamente');
    
    console.log('Nueva transacción agregada:', transaction);
}

// Hacer las funciones globales para acceso desde HTML
window.toggleDevMode = toggleDevMode;
window.showInicio = showInicio;
window.showDashboard = showDashboard;
window.showCalculadora = showCalculadora;
window.showFeatures = showFeatures;
window.showAbout = showAbout;
window.showDashboardTab = showDashboardTab;
window.testDashboard = testDashboard;
window.clearFilters = clearFilters;
window.editTransaction = editTransaction;
window.deleteTransaction = deleteTransaction;
window.editBudget = editBudget;
window.deleteBudget = deleteBudget;
window.editGoal = editGoal;
window.deleteGoal = deleteGoal;
window.handleNewTransaction = handleNewTransaction;
window.hideAddTransaction = hideAddTransaction;
window.showAddTransaction = showAddTransaction;
window.showAddBudget = showAddBudget;
window.showAddGoal = showAddGoal;
window.openDemo = openDemo;
window.closeDemo = closeDemo;

// Inicializar autenticación
async function initAuth() {
    if (DEV_MODE) {
        console.log('Modo de desarrollo activado - Acceso sin autenticación');
        useSupabase = false;
        currentUser = {
            id: 'dev-user',
            email: 'desarrollador@veedor.com',
            user_metadata: {
                full_name: 'Desarrollador'
            }
        };
        
        // Mostrar indicador de modo desarrollo
        const devIndicator = document.getElementById('dev-mode-indicator');
        if (devIndicator) {
            devIndicator.innerHTML = `
                <span>Modo Desarrollo - Acceso sin autenticación</span>
                <button onclick="toggleDevMode()" style="margin-left: 1rem; background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.3); color: white; padding: 0.25rem 0.5rem; border-radius: 4px; cursor: pointer; font-size: 0.8rem;">
                    Cambiar Modo
                </button>
            `;
            devIndicator.style.display = 'block';
        }
        
        showUserMenu();
        loadUserData();
        loadDevData(); // Cargar datos de ejemplo
        showDashboard();
        return;
    }

    try {
        const module = await import('./supabase-client.js');
        window.AuthService = module.AuthService;
        window.TransactionService = module.TransactionService;
        window.FinancialProfileService = module.FinancialProfileService;
        useSupabase = true;
        
        const { user } = await AuthService.getCurrentUser();
        if (user) {
            currentUser = user;
            showUserMenu();
            loadUserData();
            showDashboard();
        } else {
            showAuthButtons();
            showAuthRequired();
        }
    } catch (error) {
        console.log('Supabase no configurado, usando modo local');
        useSupabase = false;
        showAuthButtons();
        showAuthRequired();
    }
}

// Mostrar botones de autenticación
function showAuthButtons() {
    document.getElementById('auth-buttons').style.display = 'block';
    document.getElementById('user-menu').style.display = 'none';
}

// Mostrar menú de usuario
function showUserMenu() {
    document.getElementById('auth-buttons').style.display = 'none';
    document.getElementById('user-menu').style.display = 'flex';
    
    if (currentUser) {
        const name = currentUser.user_metadata?.full_name || currentUser.email;
        document.getElementById('user-name-display').textContent = name;
        
        // Generar avatar con iniciales
        const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
        document.getElementById('user-avatar').textContent = initials;
    }
}

// Mostrar dashboard
function showDashboard() {
    console.log('showDashboard llamado');
    
    // Ocultar otras secciones principales
    const inicio = document.getElementById('inicio');
    const features = document.getElementById('features');
    const about = document.getElementById('about');
    
    if (inicio) inicio.style.display = 'none';
    if (features) features.style.display = 'none';
    if (about) about.style.display = 'none';
    
    // Mostrar dashboard
    const dashboardElement = document.getElementById('dashboard');
    if (dashboardElement) {
        dashboardElement.style.display = 'block';
        console.log('Dashboard mostrado');
    } else {
        console.error('Elemento dashboard no encontrado');
    }
    
    const dashboardLink = document.getElementById('dashboard-link');
    if (dashboardLink) {
        dashboardLink.style.display = 'block';
    }
    
    // Scroll suave al dashboard
    if (dashboardElement) {
        dashboardElement.scrollIntoView({
            behavior: 'smooth'
        });
    }
    
    // Inicializar dashboard manager si no existe
    if (!window.dashboardManager) {
        console.log('Inicializando DashboardManager...');
        if (typeof DashboardManager !== 'undefined') {
            window.dashboardManager = new DashboardManager();
            console.log('DashboardManager creado exitosamente');
        } else {
            console.error('DashboardManager no está definido, esperando...');
            // Esperar un poco y reintentar
            setTimeout(() => {
                if (typeof DashboardManager !== 'undefined') {
                    window.dashboardManager = new DashboardManager();
                    console.log('DashboardManager creado en reintento');
                } else {
                    console.error('DashboardManager sigue sin estar disponible');
                }
            }, 100);
        }
    }
    
    // Cargar datos del dashboard si existe el manager
    if (window.dashboardManager) {
        console.log('Cargando datos del dashboard...');
        // Cargar datos de desarrollo si estamos en modo DEV
        if (DEV_MODE) {
            loadDevData();
        } else {
            window.dashboardManager.loadData();
        }
        window.dashboardManager.updateFinancialSummary();
        window.dashboardManager.loadOverviewTab();
    } else {
        console.error('DashboardManager no disponible');
    }
}

// Mostrar calculadora (función interna)
function showCalculator() {
    // Ocultar dashboard si existe
    const dashboard = document.getElementById('dashboard');
    if (dashboard) dashboard.style.display = 'none';
    
    // Mostrar calculadora si existe
    const calculadora = document.getElementById('calculadora');
    if (calculadora) {
        calculadora.style.display = 'block';
    } else {
        console.log('Calculadora no encontrada');
    }
}

// Mostrar mensaje de autenticación requerida
function showAuthRequired() {
    // Ocultar dashboard si existe
    const dashboard = document.getElementById('dashboard');
    if (dashboard) dashboard.style.display = 'none';
    
    // Ocultar calculadora si existe
    const calculadora = document.getElementById('calculadora');
    if (calculadora) calculadora.style.display = 'none';
    
    // Ocultar enlace del dashboard si existe
    const dashboardLink = document.getElementById('dashboard-link');
    if (dashboardLink) dashboardLink.style.display = 'none';
    
    console.log('Mostrando mensaje de autenticación requerida');
}

// Cambiar pestaña de autenticación
function showAuthTab(tab) {
    document.querySelectorAll('.auth-form').forEach(form => form.classList.remove('active'));
    document.querySelectorAll('.auth-tab').forEach(tabEl => tabEl.classList.remove('active'));
    
    document.getElementById(tab + '-form').classList.add('active');
    event.target.classList.add('active');
}

// Mostrar recuperación de contraseña
function showForgotPassword() {
    showAuthTab('forgot');
}

// Cargar datos del usuario
async function loadUserData() {
    if (!useSupabase || !currentUser) return;
    
    try {
        const { data: transactions } = await TransactionService.getTransactions(currentUser.id, 100);
        
        if (transactions) {
            const localTransactions = transactions.map(t => ({
                id: t.id,
                descripcion: t.description,
                monto: parseFloat(t.amount),
                categoria: t.categories?.name || 'otros',
                fecha: t.date,
                hora: t.time || '00:00',
                tipo: t.type
            }));
            
            gastosManager.gastos = localTransactions;
            uiManager.updateGastosList(localTransactions);
        }
    } catch (error) {
        console.error('Error al cargar datos:', error);
    }
}

// Mostrar perfil
function showProfile() {
    window.open('profile.html', '_blank');
}

// Cerrar sesión
async function logout() {
    if (useSupabase && currentUser) {
        await AuthService.signOut();
    }
    
    currentUser = null;
    showAuthButtons();
    showAuthRequired();
    
    // Limpiar datos locales
    gastosManager.gastos = [];
    uiManager.updateGastosList([]);
    storageManager.clearGastos();
}

// ========================================
// FUNCIONES DE TEMA
// ========================================

// Función para cambiar entre modo claro y oscuro
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    // Aplicar el nuevo tema
    document.documentElement.setAttribute('data-theme', newTheme);
    document.body.setAttribute('data-theme', newTheme);
    
    // Guardar en localStorage
    localStorage.setItem('veedor-theme', newTheme);
    
    // Actualizar icono del botón
    const themeIcon = document.querySelector('.theme-icon');
    if (themeIcon) {
        themeIcon.textContent = newTheme === 'dark' ? '☀️' : '🌙';
    }
    
    console.log(`Tema cambiado a: ${newTheme}`);
}

// Cargar tema guardado al iniciar
function loadTheme() {
    // Si hay un tema guardado en localStorage, usarlo
    const savedTheme = localStorage.getItem('veedor-theme');
    
    if (savedTheme) {
        // Usar el tema guardado
        document.documentElement.setAttribute('data-theme', savedTheme);
        document.body.setAttribute('data-theme', savedTheme);
        
        // Actualizar icono del botón
        const themeIcon = document.querySelector('.theme-icon');
        if (themeIcon) {
            themeIcon.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
        }
        
        console.log(`Tema cargado desde localStorage: ${savedTheme}`);
    } else {
        // Si no hay tema guardado, usar el modo oscuro por defecto
        const defaultTheme = 'dark';
        document.documentElement.setAttribute('data-theme', defaultTheme);
        document.body.setAttribute('data-theme', defaultTheme);
        
        console.log('Usando modo oscuro por defecto');
        
        // Actualizar icono del botón para modo oscuro
        const themeIcon = document.querySelector('.theme-icon');
        if (themeIcon) {
            themeIcon.textContent = '☀️';
        }
    }
}

// Asegurar que las funciones estén en el scope global
// ========================================
// CARRUSEL NETFLIX STYLE
// ========================================
let currentSlide = 0;
const cardsPerView = 3; // Número de cards visibles
const totalCards = 6; // Cards originales (sin duplicar)

function scrollCarousel(direction) {
    const track = document.querySelector('.carousel-track');
    const cardWidth = 300 + 24; // 300px + gap
    
    currentSlide += direction;
    
    // Si llegamos al final de la primera copia, saltar al inicio de la segunda copia
    if (currentSlide >= totalCards) {
        currentSlide = 0;
        // Saltar instantáneamente sin transición
        track.style.transition = 'none';
        track.style.transform = `translateX(0px)`;
        // Restaurar transición después de un frame
        requestAnimationFrame(() => {
            track.style.transition = 'transform 0.5s ease';
        });
        return;
    }
    
    // Si estamos en negativo, ir al final de la primera copia
    if (currentSlide < 0) {
        currentSlide = totalCards - 1;
        // Saltar instantáneamente sin transición
        track.style.transition = 'none';
        track.style.transform = `translateX(${-(totalCards - 1) * cardWidth}px)`;
        // Restaurar transición después de un frame
        requestAnimationFrame(() => {
            track.style.transition = 'transform 0.5s ease';
        });
        return;
    }
    
    const translateX = -currentSlide * cardWidth;
    track.style.transform = `translateX(${translateX}px)`;
    
    // Actualizar visibilidad de botones
    updateCarouselButtons();
}

function updateCarouselButtons() {
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    // En modo infinito, los botones siempre están activos
    if (prevBtn && nextBtn) {
        prevBtn.style.opacity = '1';
        nextBtn.style.opacity = '1';
    }
}

// Auto-scroll del carrusel
function autoScrollCarousel() {
    // En modo infinito, siempre avanza al siguiente
    scrollCarousel(1);
}

// Inicializar carrusel
function initCarousel() {
    updateCarouselButtons();
    
    // Auto-scroll cada 5 segundos
    setInterval(autoScrollCarousel, 5000);
    
    // Scroll con rueda del mouse
    const carousel = document.querySelector('.carousel-container');
    if (carousel) {
        carousel.addEventListener('wheel', (e) => {
            e.preventDefault();
            if (e.deltaY > 0) {
                scrollCarousel(1);
            } else {
                scrollCarousel(-1);
            }
        });
    }
}

// Hacer funciones globales
window.scrollCarousel = scrollCarousel;
window.loadAndShowDemo = loadAndShowDemo;
window.testData = testData;
window.forceUpdate = forceUpdate;
window.showDashboard = showDashboard;
window.showAuth = showAuth;
window.toggleTheme = toggleTheme;

// Event listeners para formularios
document.addEventListener('DOMContentLoaded', () => {
    // Cargar tema guardado
    loadTheme();
    
    // Inicializar aplicación
    new App();
    
    // Inicializar autenticación
    initAuth();
    
    // Inicializar carrusel
    initCarousel();
    
    // Login
    document.getElementById('login-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (!useSupabase) {
            alert('Sistema de autenticación no disponible. Usando modo local.');
            hideAuth();
            return;
        }
        
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        const { data, error } = await AuthService.signIn(email, password);
        
        if (error) {
            showError('login-error', error.message);
        } else {
            currentUser = data.user;
            showUserMenu();
            showCalculator();
            hideAuth();
            loadUserData();
            showSuccess('login-success', '¡Bienvenido a Veedor!');
        }
    });
    
    // Registro
    document.getElementById('register-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (!useSupabase) {
            alert('Sistema de autenticación no disponible. Usando modo local.');
            hideAuth();
            return;
        }
        
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm').value;
        
        if (password !== confirmPassword) {
            showError('register-error', 'Las contraseñas no coinciden');
            return;
        }
        
        const { data, error } = await AuthService.signUp(email, password, name);
        
        if (error) {
            showError('register-error', error.message);
        } else {
            showSuccess('register-success', 'Cuenta creada. Verifica tu email para activar tu cuenta.');
        }
    });
    
    // Recuperación de contraseña
    document.getElementById('forgot-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('forgot-email').value;
        showSuccess('forgot-success', 'Si el correo existe, recibirás un enlace de recuperación.');
    });
    
    // Cerrar modal al hacer clic fuera
    document.getElementById('auth-overlay').addEventListener('click', (e) => {
        if (e.target.id === 'auth-overlay') {
            hideAuth();
        }
    });
});

// Funciones auxiliares
function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    errorElement.textContent = message;
    errorElement.style.display = 'block';
    
    // Ocultar después de 5 segundos
    setTimeout(() => {
        errorElement.style.display = 'none';
    }, 5000);
}

function showSuccess(elementId, message) {
    const successElement = document.getElementById(elementId);
    successElement.textContent = message;
    successElement.style.display = 'block';
    
    // Ocultar después de 3 segundos
    setTimeout(() => {
        successElement.style.display = 'none';
    }, 3000);
}

// Event listeners para modales
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal')) {
        closeModal(event.target.id);
    }
});

document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const openModal = document.querySelector('.modal[style*="flex"]');
        if (openModal) {
            closeModal(openModal.id);
        }
    }
});

// Auth Validations
function initAuthValidations() {
    // Validación de email
    const emailInputs = document.querySelectorAll('input[type="email"]');
    emailInputs.forEach(input => {
        input.addEventListener('input', function() {
            validateEmail(this);
        });
    });

    // Validación de contraseña
    const passwordInputs = document.querySelectorAll('input[type="password"]');
    passwordInputs.forEach(input => {
        input.addEventListener('input', function() {
            validatePassword(this);
        });
    });

    // Validación de nombre
    const nameInputs = document.querySelectorAll('input[type="text"]');
    nameInputs.forEach(input => {
        input.addEventListener('input', function() {
            validateName(this);
        });
    });
}

function validateEmail(input) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(input.value);
    const errorElement = document.getElementById(input.id + '-error');
    
    if (input.value && !isValid) {
        showFieldError(input, errorElement, 'Email no válido');
        return false;
    } else {
        hideFieldError(input, errorElement);
        return true;
    }
}

function validatePassword(input) {
    const isValid = input.value.length >= 6;
    const errorElement = document.getElementById(input.id + '-error');
    
    if (input.value && !isValid) {
        showFieldError(input, errorElement, 'Mínimo 6 caracteres');
        return false;
    } else {
        hideFieldError(input, errorElement);
        return true;
    }
}

function validateName(input) {
    const isValid = input.value.length >= 2;
    const errorElement = document.getElementById(input.id + '-error');
    
    if (input.value && !isValid) {
        showFieldError(input, errorElement, 'Mínimo 2 caracteres');
        return false;
    } else {
        hideFieldError(input, errorElement);
        return true;
    }
}

function showFieldError(input, errorElement, message) {
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
    input.parentElement.classList.add('error');
    input.parentElement.classList.remove('success');
}

function hideFieldError(input, errorElement) {
    if (errorElement) {
        errorElement.classList.remove('show');
    }
    input.parentElement.classList.remove('error');
    input.parentElement.classList.add('success');
}

// Funciones de zoom eliminadas - usando CSS puro para responsividad

// Social Login Functions
function loginWithGmail() {
    console.log('Iniciando login con Gmail...');
    // Aquí se integrará con Gmail API
    showNotification('Conectando con Gmail...', 'info');
    
    // Simulación de login exitoso
    setTimeout(() => {
        showNotification('¡Conectado con Gmail!', 'success');
        hideAuth();
        // Aquí se configurará la integración con Gmail
        setupGmailIntegration();
    }, 2000);
}

function loginWithNotion() {
    console.log('Iniciando login con Notion...');
    showNotification('Conectando con Notion...', 'info');
    
    // Simulación de login exitoso
    setTimeout(() => {
        showNotification('¡Conectado con Notion!', 'success');
        hideAuth();
        // Aquí se configurará la integración con Notion
        setupNotionIntegration();
    }, 2000);
}

// Integration Setup Functions
function setupGmailIntegration() {
    console.log('Configurando integración con Gmail...');
    // Aquí se implementará la integración real con Gmail API
    // Para sincronizar emails con gastos financieros
}

function setupNotionIntegration() {
    console.log('Configurando integración con Notion...');
    // Aquí se implementará la integración con Notion API
    // Para sincronizar notas y documentos con el dashboard financiero
}

// Download App Functions
function downloadApp(platform) {
    if (platform === 'ios') {
        console.log('Redirigiendo a App Store...');
        showNotification('Redirigiendo a App Store...', 'info');
        // Aquí se pondría el enlace real a la App Store
        // window.open('https://apps.apple.com/app/veedor/idXXXXXXXX', '_blank');
        setTimeout(() => {
            showNotification('Próximamente disponible en App Store', 'info');
        }, 1500);
    } else if (platform === 'android') {
        console.log('Redirigiendo a Google Play...');
        showNotification('Redirigiendo a Google Play...', 'info');
        // Aquí se pondría el enlace real a Google Play
        // window.open('https://play.google.com/store/apps/details?id=com.veedor.app', '_blank');
        setTimeout(() => {
            showNotification('Próximamente disponible en Google Play', 'info');
        }, 1500);
    }
}

// Hacer funciones globales
window.showAuth = showAuth;
window.showAuthTab = showAuthTab;
window.showForgotPassword = showForgotPassword;
window.showProfile = showProfile;
window.logout = logout;
window.loginWithGmail = loginWithGmail;
window.loginWithNotion = loginWithNotion;
window.downloadApp = downloadApp;
