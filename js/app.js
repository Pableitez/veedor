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
    // Ocultar todas las secciones
    document.getElementById('dashboard').style.display = 'none';
    document.getElementById('calculadora').style.display = 'none';
    document.getElementById('auth-required').style.display = 'none';
    
    // Mostrar solo el inicio
    document.getElementById('inicio').scrollIntoView({
        behavior: 'smooth'
    });
}

// Mostrar calculadora
function showCalculadora() {
    // Ocultar otras secciones
    document.getElementById('dashboard').style.display = 'none';
    document.getElementById('auth-required').style.display = 'none';
    
    // Mostrar calculadora
    document.getElementById('calculadora').style.display = 'block';
    document.getElementById('calculadora').scrollIntoView({
        behavior: 'smooth'
    });
}

// Mostrar sección de funciones
function showFeatures() {
    // Ocultar otras secciones
    document.getElementById('dashboard').style.display = 'none';
    document.getElementById('calculadora').style.display = 'none';
    document.getElementById('auth-required').style.display = 'none';
    
    // Mostrar funciones
    document.getElementById('features').scrollIntoView({
        behavior: 'smooth'
    });
}

// Mostrar sección acerca de
function showAbout() {
    // Ocultar otras secciones
    document.getElementById('dashboard').style.display = 'none';
    document.getElementById('calculadora').style.display = 'none';
    document.getElementById('auth-required').style.display = 'none';
    
    // Mostrar acerca de (footer)
    document.getElementById('footer').scrollIntoView({
        behavior: 'smooth'
    });
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

// Cargar datos de desarrollo para pruebas
function loadDevData() {
    console.log('Cargando datos de desarrollo...');
    
    // Datos de transacciones de ejemplo
    const sampleTransactions = [
        {
            id: '1',
            type: 'expense',
            description: 'Compra en Supermercado',
            amount: 85.50,
            category: 'alimentacion',
            date: '2024-01-15',
            time: '14:30'
        },
        {
            id: '2',
            type: 'expense',
            description: 'Gasolina Shell',
            amount: 45.00,
            category: 'transporte',
            date: '2024-01-14',
            time: '09:15'
        },
        {
            id: '3',
            type: 'income',
            description: 'Salario',
            amount: 2500.00,
            category: 'otros',
            date: '2024-01-01',
            time: '00:00'
        },
        {
            id: '4',
            type: 'expense',
            description: 'Netflix',
            amount: 12.99,
            category: 'entretenimiento',
            date: '2024-01-10',
            time: '00:00'
        },
        {
            id: '5',
            type: 'expense',
            description: 'Farmacia',
            amount: 25.80,
            category: 'salud',
            date: '2024-01-12',
            time: '16:45'
        },
        {
            id: '6',
            type: 'expense',
            description: 'Alquiler',
            amount: 800.00,
            category: 'vivienda',
            date: '2024-01-01',
            time: '00:00'
        },
        {
            id: '7',
            type: 'expense',
            description: 'Restaurante',
            amount: 35.50,
            category: 'alimentacion',
            date: '2024-01-13',
            time: '20:30'
        },
        {
            id: '8',
            type: 'expense',
            description: 'Uber',
            amount: 12.50,
            category: 'transporte',
            date: '2024-01-14',
            time: '18:20'
        }
    ];

    // Guardar datos de ejemplo en localStorage
    localStorage.setItem('veedorTransactions', JSON.stringify(sampleTransactions));

    // Datos de presupuestos de ejemplo
    const sampleBudgets = [
        {
            id: '1',
            category: 'alimentacion',
            amount: 300,
            period: 'monthly',
            createdAt: '2024-01-01T00:00:00.000Z',
            isActive: true,
            alertThresholds: {
                warning: 0.8,
                critical: 0.95
            }
        },
        {
            id: '2',
            category: 'transporte',
            amount: 150,
            period: 'monthly',
            createdAt: '2024-01-01T00:00:00.000Z',
            isActive: true,
            alertThresholds: {
                warning: 0.8,
                critical: 0.95
            }
        },
        {
            id: '3',
            category: 'entretenimiento',
            amount: 100,
            period: 'monthly',
            createdAt: '2024-01-01T00:00:00.000Z',
            isActive: true,
            alertThresholds: {
                warning: 0.8,
                critical: 0.95
            }
        }
    ];

    localStorage.setItem('veedorBudgets', JSON.stringify(sampleBudgets));

    // Datos de objetivos de ejemplo
    const sampleGoals = [
        {
            id: '1',
            name: 'Fondo de Emergencia',
            targetAmount: 5000,
            currentAmount: 1200,
            createdAt: '2024-01-01T00:00:00.000Z',
            isActive: true
        },
        {
            id: '2',
            name: 'Vacaciones de Verano',
            targetAmount: 2000,
            currentAmount: 450,
            createdAt: '2024-01-01T00:00:00.000Z',
            isActive: true
        }
    ];

    localStorage.setItem('veedorGoals', JSON.stringify(sampleGoals));

    console.log('Datos de desarrollo cargados correctamente');
    
    // Inicializar el dashboard manager
    if (!window.dashboardManager) {
        window.dashboardManager = new DashboardManager();
        console.log('DashboardManager inicializado');
    }
    
    // Actualizar el dashboard
    if (window.dashboardManager) {
        window.dashboardManager.loadData();
        window.dashboardManager.updateFinancialSummary();
        window.dashboardManager.loadOverviewTab();
        console.log('Dashboard actualizado con datos de desarrollo');
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

// Hacer las funciones globales para acceso desde HTML
window.toggleDevMode = toggleDevMode;
window.showInicio = showInicio;
window.showDashboard = showDashboard;
window.showCalculadora = showCalculadora;
window.showFeatures = showFeatures;
window.showAbout = showAbout;
window.showDashboardTab = showDashboardTab;
window.testDashboard = testDashboard;

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
    
    // Ocultar otras secciones
    document.getElementById('auth-required').style.display = 'none';
    document.getElementById('calculadora').style.display = 'none';
    
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
        } else {
            console.error('DashboardManager no está definido');
        }
    }
    
    // Cargar datos del dashboard si existe el manager
    if (window.dashboardManager) {
        console.log('Cargando datos del dashboard...');
        window.dashboardManager.loadData();
        window.dashboardManager.updateFinancialSummary();
        window.dashboardManager.loadOverviewTab();
    } else {
        console.error('DashboardManager no disponible');
    }
}

// Mostrar calculadora (función interna)
function showCalculator() {
    document.getElementById('auth-required').style.display = 'none';
    document.getElementById('dashboard').style.display = 'none';
    document.getElementById('calculadora').style.display = 'block';
}

// Mostrar mensaje de autenticación requerida
function showAuthRequired() {
    document.getElementById('auth-required').style.display = 'block';
    document.getElementById('calculadora').style.display = 'none';
    document.getElementById('dashboard').style.display = 'none';
    document.getElementById('dashboard-link').style.display = 'none';
}

// Mostrar modal de autenticación
function showAuth() {
    document.getElementById('auth-overlay').style.display = 'flex';
}

// Ocultar modal de autenticación
function hideAuth() {
    document.getElementById('auth-overlay').style.display = 'none';
    // Limpiar formularios
    document.querySelectorAll('.auth-form').forEach(form => form.reset());
    document.querySelectorAll('.auth-error, .auth-success').forEach(el => el.style.display = 'none');
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

// Event listeners para formularios
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar aplicación
    new App();
    
    // Inicializar autenticación
    initAuth();
    
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

// Hacer funciones globales
window.showAuth = showAuth;
window.showAuthTab = showAuthTab;
window.showForgotPassword = showForgotPassword;
window.showProfile = showProfile;
window.logout = logout;
