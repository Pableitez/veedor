// Evitar cargar múltiples veces
// Versión: 2.5.0 - Detalles de resumen, meta de ahorro en BD, header mejorado
if (window.VEEDOR_LOADED) {
    console.warn('⚠️ app.js ya fue cargado, evitando carga duplicada');
} else {
    window.VEEDOR_LOADED = true;
    
    // Exponer funciones globales inmediatamente (stubs) para evitar errores de referencia
    window.showUserProfile = function() { console.warn('showUserProfile aún no está disponible'); };
    window.closeUserProfile = function() { console.warn('closeUserProfile aún no está disponible'); };
    window.showSummaryDetails = function() { console.warn('showSummaryDetails aún no está disponible'); };
    window.closeSummaryDetails = function() { console.warn('closeSummaryDetails aún no está disponible'); };
    window.showSavingsGoalModal = function() { console.warn('showSavingsGoalModal aún no está disponible'); };
    window.closeSavingsGoalModal = function() { console.warn('closeSavingsGoalModal aún no está disponible'); };
    window.deleteSavingsGoal = function() { console.warn('deleteSavingsGoal aún no está disponible'); };
    
    // Configuración de la API
    const API_URL = '/api';

    // Log inicial para verificar que el script se carga
    console.log('🚀 app.js cargado correctamente');
    console.log('API_URL:', API_URL);
    console.log('URL actual:', window.location.href);

// Categorías de gastos e ingresos
const categories = {
    expense: [
        { id: 'food', name: 'Alimentación', subcategories: ['Supermercado', 'Restaurantes', 'Delivery', 'Café'] },
        { id: 'transport', name: 'Transporte', subcategories: ['Gasolina', 'Transporte público', 'Taxi/Uber', 'Mantenimiento'] },
        { id: 'housing', name: 'Vivienda', subcategories: ['Alquiler/Hipoteca', 'Servicios', 'Mantenimiento', 'Decoración'] },
        { id: 'health', name: 'Salud', subcategories: ['Médico', 'Farmacia', 'Gimnasio', 'Seguro médico'] },
        { id: 'entertainment', name: 'Entretenimiento', subcategories: ['Cine', 'Streaming', 'Eventos', 'Hobbies'] },
        { id: 'shopping', name: 'Compras', subcategories: ['Ropa', 'Electrónica', 'Hogar', 'Otros'] },
        { id: 'education', name: 'Educación', subcategories: ['Cursos', 'Libros', 'Materiales', 'Matrícula'] },
        { id: 'bills', name: 'Facturas', subcategories: ['Internet', 'Teléfono', 'Luz', 'Agua', 'Otros servicios'] },
        { id: 'insurance', name: 'Seguros', subcategories: ['Seguro de coche', 'Seguro de hogar', 'Seguro de vida', 'Seguro de salud', 'Otros seguros'] },
        { id: 'fines', name: 'Multas y Sanciones', subcategories: ['Multa de tráfico', 'Multa administrativa', 'Sanció', 'Otros'] },
        { id: 'personal', name: 'Personal', subcategories: ['Cuidado personal', 'Ropa', 'Regalos', 'Otros'] },
        { id: 'other', name: 'Otros', subcategories: ['Varios', 'Imprevistos'] }
    ],
    income: [
        { id: 'salary', name: 'Salario', subcategories: ['Nómina', 'Pago mensual', 'Pago quincenal', 'Pago semanal'] },
        { id: 'freelance', name: 'Freelance', subcategories: ['Proyecto', 'Hora', 'Servicio', 'Otros'] },
        { id: 'investment', name: 'Inversiones', subcategories: ['Dividendos', 'Intereses', 'Renta', 'Ganancias'] },
        { id: 'business', name: 'Negocio', subcategories: ['Ventas', 'Servicios', 'Comisiones', 'Otros'] },
        { id: 'gift', name: 'Regalos', subcategories: ['Cumpleaños', 'Navidad', 'Ocasión especial', 'Otros'] },
        { id: 'refund', name: 'Reembolsos', subcategories: ['Compra', 'Impuesto', 'Seguro', 'Otros'] },
        { id: 'rental', name: 'Alquiler', subcategories: ['Propiedad', 'Habitación', 'Garaje', 'Otros'] },
        { id: 'other', name: 'Otros', subcategories: ['Varios', 'Imprevistos'] }
    ],
    // Mantener compatibilidad con código antiguo
    general: [
        { id: 'food', name: 'Alimentación', subcategories: ['Supermercado', 'Restaurantes', 'Delivery', 'Café'] },
        { id: 'transport', name: 'Transporte', subcategories: ['Gasolina', 'Transporte público', 'Taxi/Uber', 'Mantenimiento'] },
        { id: 'housing', name: 'Vivienda', subcategories: ['Alquiler/Hipoteca', 'Servicios', 'Mantenimiento', 'Decoración'] },
        { id: 'health', name: 'Salud', subcategories: ['Médico', 'Farmacia', 'Gimnasio', 'Seguro médico'] },
        { id: 'entertainment', name: 'Entretenimiento', subcategories: ['Cine', 'Streaming', 'Eventos', 'Hobbies'] },
        { id: 'shopping', name: 'Compras', subcategories: ['Ropa', 'Electrónica', 'Hogar', 'Otros'] },
        { id: 'education', name: 'Educación', subcategories: ['Cursos', 'Libros', 'Materiales', 'Matrícula'] },
        { id: 'bills', name: 'Facturas', subcategories: ['Internet', 'Teléfono', 'Luz', 'Agua', 'Otros servicios'] },
        { id: 'personal', name: 'Personal', subcategories: ['Cuidado personal', 'Ropa', 'Regalos', 'Otros'] },
        { id: 'other', name: 'Otros', subcategories: ['Varios', 'Imprevistos'] }
    ]
};

// Categorías personalizadas del usuario (guardadas en la base de datos)
let customCategories = {
    expense: [],
    income: []
};

// Estado de la aplicación
let transactions = [];
let envelopes = [];
let budgets = [];
let accounts = [];
let properties = [];
let assets = [];
let charts = {};
let currentUser = null;
let currentUserEmail = null;
let authToken = null;
let summaryPeriod = 'month'; // 'month', 'year', 'all'

// Utilidad para hacer peticiones autenticadas
async function apiRequest(endpoint, options = {}) {
    // Asegurarse de que el token esté cargado desde localStorage
    if (!authToken) {
        authToken = localStorage.getItem('veedor_token');
    }
    
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
        console.log('🔑 Token enviado en request:', authToken.substring(0, 20) + '...');
    } else {
        console.warn('⚠️ No hay token disponible para la petición a:', endpoint);
    }

    try {
        console.log('📤 Enviando petición a:', `${API_URL}${endpoint}`, {
            method: options.method || 'GET',
            hasAuth: !!authToken,
            headers: Object.keys(headers)
        });
        
        const response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers
        });

        let data;
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            data = await response.json();
        } else {
            const text = await response.text();
            throw new Error(text || 'Error en la respuesta del servidor');
        }

        if (response.status === 401 || response.status === 403) {
            logout();
            throw new Error('Sesión expirada');
        }
        
        if (!response.ok) {
            throw new Error(data.error || `Error ${response.status}: ${response.statusText}`);
        }

        return data;
    } catch (error) {
        if (error.message) {
            throw error;
        }
        throw new Error('Error de conexión. Verifica tu internet y que el servidor esté funcionando.');
    }
}

// ==================== SISTEMA DE NOTIFICACIONES TOAST ====================
function showToast(message, type = 'info', duration = 4000) {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.style.cssText = `
        background: white;
        padding: 16px 20px;
        border-radius: 12px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15), 0 4px 12px rgba(0, 0, 0, 0.1);
        display: flex;
        align-items: center;
        gap: 12px;
        min-width: 300px;
        max-width: 500px;
        pointer-events: auto;
        animation: slideInRight 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        border-left: 4px solid;
        position: relative;
        overflow: hidden;
    `;
    
    const colors = {
        success: { border: '#10b981', bg: '#f0fdf4', icon: '✅', text: '#065f46' },
        error: { border: '#ef4444', bg: '#fef2f2', icon: '❌', text: '#991b1b' },
        warning: { border: '#f59e0b', bg: '#fffbeb', icon: '⚠️', text: '#92400e' },
        info: { border: '#6366f1', bg: '#eef2ff', icon: 'ℹ️', text: '#3730a3' }
    };
    
    toast.innerHTML = `
        <span style="font-size: 20px; flex-shrink: 0;">${style.icon}</span>
        <span style="flex: 1; color: ${style.text}; font-size: 14px; font-weight: 500; line-height: 1.4;">${message}</span>
        <button onclick="this.parentElement.remove()" style="background: none; border: none; color: ${style.text}; font-size: 18px; cursor: pointer; padding: 0; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; opacity: 0.6; transition: opacity 0.2s;" onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='0.6'">×</button>
    `;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// Exponer función global
window.showToast = showToast;

// ==================== SISTEMA DE CONFIRMACIÓN ====================
function showConfirm(title, message, confirmText = 'Confirmar', cancelText = 'Cancelar') {
    return new Promise((resolve) => {
        const modal = document.getElementById('confirmModal');
        const titleEl = document.getElementById('confirmModalTitle');
        const messageEl = document.getElementById('confirmModalMessage');
        const confirmBtn = document.getElementById('confirmModalConfirm');
        const cancelBtn = document.getElementById('confirmModalCancel');
        
        if (!modal || !titleEl || !messageEl || !confirmBtn || !cancelBtn) {
            resolve(false);
            return;
        }
        
        titleEl.textContent = title;
        messageEl.textContent = message;
        confirmBtn.textContent = confirmText;
        cancelBtn.textContent = cancelText;
        
        modal.style.display = 'flex';
        
        const handleConfirm = () => {
            modal.style.display = 'none';
            confirmBtn.onclick = null;
            cancelBtn.onclick = null;
            resolve(true);
        };
        
        const handleCancel = () => {
            modal.style.display = 'none';
            confirmBtn.onclick = null;
            cancelBtn.onclick = null;
            resolve(false);
        };
        
        confirmBtn.onclick = handleConfirm;
        cancelBtn.onclick = handleCancel;
        
        // Cerrar al hacer click fuera del modal
        modal.onclick = (e) => {
            if (e.target === modal) handleCancel();
        };
    });
}

// Exponer función global
window.showConfirm = showConfirm;

// ==================== INDICADORES DE CARGA ====================
function showLoader(text = 'Cargando...') {
    const loader = document.getElementById('globalLoader');
    const loaderText = document.getElementById('globalLoaderText');
    if (loader) {
        if (loaderText) loaderText.textContent = text;
        loader.style.display = 'flex';
    }
}

function hideLoader() {
    const loader = document.getElementById('globalLoader');
    if (loader) {
        loader.style.display = 'none';
    }
}

// Exponer funciones globales
window.showLoader = showLoader;
window.hideLoader = hideLoader;

// ==================== MODO OSCURO ====================
function toggleDarkMode() {
    const body = document.body;
    const isDark = body.classList.contains('dark-mode');
    
    if (isDark) {
        body.classList.remove('dark-mode');
        localStorage.setItem('veedor_darkMode', 'false');
        const toggleText = document.getElementById('darkModeToggleText');
        if (toggleText) toggleText.textContent = '🌙 Modo Oscuro';
    } else {
        body.classList.add('dark-mode');
        localStorage.setItem('veedor_darkMode', 'true');
        const toggleText = document.getElementById('darkModeToggleText');
        if (toggleText) toggleText.textContent = '☀️ Modo Claro';
    }
}

function initDarkMode() {
    const savedMode = localStorage.getItem('veedor_darkMode');
    if (savedMode === 'true') {
        document.body.classList.add('dark-mode');
        const toggleText = document.getElementById('darkModeToggleText');
        if (toggleText) toggleText.textContent = '☀️ Modo Claro';
    }
}

// Exponer función global
window.toggleDarkMode = toggleDarkMode;

// Inicialización - Ejecutar inmediatamente
console.log('🚀 app.js ejecutándose...');
console.log('Estado del DOM:', document.readyState);

// Establecer español como idioma por defecto al iniciar
if (!localStorage.getItem('veedor_language')) {
    localStorage.setItem('veedor_language', 'es');
    document.documentElement.lang = 'es';
    console.log('🌐 Idioma por defecto establecido: Español');
}

function initializeApp() {
    console.log('=== INICIALIZANDO APLICACIÓN ===');
    // Asegurar que el idioma esté en español por defecto
    if (!localStorage.getItem('veedor_language')) {
        localStorage.setItem('veedor_language', 'es');
        document.documentElement.lang = 'es';
    }
    checkAuth();
    initializeAuth();
}

// Intentar inicializar de inmediato (solo una vez)
if (!window.VEEDOR_INITIALIZED) {
    window.VEEDOR_INITIALIZED = true;
    
    if (document.readyState === 'loading') {
        console.log('Esperando DOMContentLoaded...');
        document.addEventListener('DOMContentLoaded', () => {
            console.log('✅ DOMContentLoaded disparado');
            initializeApp();
        });
    } else {
        console.log('✅ DOM ya está listo, inicializando inmediatamente...');
        // Pequeño delay para asegurar que todo esté listo
        setTimeout(() => {
            initializeApp();
        }, 100);
    }
} else {
    console.log('⚠️ Aplicación ya inicializada, evitando inicialización duplicada');
}

// Verificar autenticación
async function checkAuth() {
    authToken = localStorage.getItem('veedor_token');
    if (authToken) {
        try {
            const data = await apiRequest('/verify');
            currentUser = data.user.username || data.user.email;
            currentUserEmail = data.user.email;
            // Cargar datos del perfil
            userProfile = {
                firstName: data.user.firstName || '',
                lastName: data.user.lastName || '',
                age: data.user.age || null,
                phone: data.user.phone || '',
                address: data.user.address || '',
                city: data.user.city || '',
                country: data.user.country || '',
                birthDate: data.user.birthDate || null,
                notes: data.user.notes || ''
            };
            showMainApp();
            // updateCurrentDateDisplay(); // Removido - fecha ya no se muestra
            await loadUserData();
            initializeDate();
            initializeCategories();
            initializeTabs();
            initializeForms();
            updateDisplay();
            initializeCharts();
            // Actualizar gráficas después de inicializarlas
            setTimeout(() => {
                updateCharts();
            }, 200);
            updateUserInfo();
            // Inicializar traducciones
            if (typeof updateTranslations === 'function') {
                updateTranslations();
            }
            // NO hacer scroll automático - el usuario decidirá dónde quiere ir
        } catch (error) {
            console.error('Error verificando autenticación:', error);
            logout();
        }
    } else {
        showAuthScreen();
        // Inicializar traducciones en la pantalla de auth también
        setTimeout(() => {
            if (typeof updateTranslations === 'function') {
                updateTranslations();
            }
        }, 300);
    }
}

// Inicializar sistema de autenticación
function initializeAuth() {
    console.log('Inicializando autenticación...');
    
    // Tabs de autenticación
    const authTabs = document.querySelectorAll('.auth-tab-btn');
    console.log('Tabs encontrados:', authTabs.length);
    authTabs.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const targetTab = btn.getAttribute('data-auth-tab');
            console.log('🔄 Tab seleccionado:', targetTab);
            
            // Actualizar clases de tabs
            authTabs.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Mostrar/ocultar formularios de forma explícita
            const loginForm = document.getElementById('loginForm');
            const registerForm = document.getElementById('registerForm');
            
            if (loginForm && registerForm) {
                if (targetTab === 'login') {
                    // Ocultar registro primero
                    registerForm.classList.remove('active');
                    registerForm.style.display = 'none';
                    registerForm.style.setProperty('display', 'none', 'important');
                    
                    // Mostrar login
                    loginForm.classList.add('active');
                    loginForm.style.display = 'block';
                    loginForm.style.setProperty('display', 'block', 'important');
                    
                    console.log('✅ Mostrando formulario de login');
                    console.log('🔍 Estado loginForm:', { 
                        display: loginForm.style.display, 
                        computed: window.getComputedStyle(loginForm).display,
                        hasActive: loginForm.classList.contains('active') 
                    });
                    console.log('🔍 Estado registerForm:', { 
                        display: registerForm.style.display,
                        computed: window.getComputedStyle(registerForm).display,
                        hasActive: registerForm.classList.contains('active') 
                    });
                } else if (targetTab === 'register') {
                    // Ocultar login primero
                    loginForm.classList.remove('active');
                    loginForm.style.display = 'none';
                    loginForm.style.setProperty('display', 'none', 'important');
                    
                    // Mostrar registro
                    registerForm.classList.add('active');
                    registerForm.style.display = 'block';
                    registerForm.style.setProperty('display', 'block', 'important');
                    
                    console.log('✅ Mostrando formulario de registro');
                    console.log('🔍 Estado loginForm:', { 
                        display: loginForm.style.display,
                        computed: window.getComputedStyle(loginForm).display,
                        hasActive: loginForm.classList.contains('active') 
                    });
                    console.log('🔍 Estado registerForm:', { 
                        display: registerForm.style.display,
                        computed: window.getComputedStyle(registerForm).display,
                        hasActive: registerForm.classList.contains('active') 
                    });
                }
            } else {
                console.error('❌ Formularios no encontrados:', { loginForm: !!loginForm, registerForm: !!registerForm });
            }
            
            // Limpiar errores
            const loginError = document.getElementById('loginError');
            const registerError = document.getElementById('registerError');
            if (loginError) loginError.textContent = '';
            if (registerError) registerError.textContent = '';
        });
    });
    
    // Formulario de login
    const loginFormElement = document.getElementById('loginFormElement');
    if (loginFormElement) {
        console.log('Agregando listener a loginFormElement');
        loginFormElement.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log('Formulario de login enviado');
            await login();
        });
    } else {
        console.error('❌ loginFormElement no encontrado');
    }
    
    // Formulario de registro - Múltiples formas de asegurar que funcione
    const registerFormElement = document.getElementById('registerFormElement');
    const registerButton = registerFormElement?.querySelector('button[type="submit"]');
    
    if (registerFormElement) {
        console.log('✅ registerFormElement encontrado');
        
        // Listener en el formulario (submit)
        registerFormElement.addEventListener('submit', async (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('✅ Formulario de registro enviado (submit event)');
            await register();
            return false;
        });
        
        // También listener directo en el botón por si acaso
        if (registerButton) {
            console.log('✅ Botón de registro encontrado, agregando listener adicional');
            registerButton.addEventListener('click', async (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('✅ Botón de registro clickeado');
                await register();
                return false;
            });
        }
    } else {
        console.error('❌ registerFormElement no encontrado');
        // Intentar de nuevo después de un momento
        setTimeout(() => {
            const retryForm = document.getElementById('registerFormElement');
            if (retryForm) {
                console.log('✅ registerFormElement encontrado en reintento');
                retryForm.addEventListener('submit', async (e) => {
                    e.preventDefault();
                    await register();
                });
            }
        }, 1000);
    }
    
    // Botón cambiar usuario
    const switchUserBtn = document.getElementById('switchUserBtn');
    if (switchUserBtn) {
        switchUserBtn.addEventListener('click', async () => {
            const confirmed = await showConfirm(
                'Cerrar Sesión',
                '¿Deseas cerrar sesión y cambiar de usuario?',
                'Cerrar Sesión',
                'Cancelar'
            );
            if (confirmed) {
                logout();
            }
        });
    }
    
    // Enlaces de recuperación de contraseña
    const forgotPasswordLink = document.getElementById('forgotPasswordLink');
    const backToLoginLink = document.getElementById('backToLoginLink');
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    const loginForm = document.getElementById('loginForm');
    
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', (e) => {
            e.preventDefault();
            if (loginForm) loginForm.style.display = 'none';
            if (forgotPasswordForm) forgotPasswordForm.style.display = 'block';
        });
    }
    
    if (backToLoginLink) {
        backToLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            if (forgotPasswordForm) forgotPasswordForm.style.display = 'none';
            if (loginForm) loginForm.style.display = 'block';
        });
    }
    
    // Formulario de solicitud de token
    const forgotPasswordFormElement = document.getElementById('forgotPasswordFormElement');
    if (forgotPasswordFormElement) {
        forgotPasswordFormElement.addEventListener('submit', async (e) => {
            e.preventDefault();
            await requestPasswordReset();
        });
    }
    
    // Formulario de reset de contraseña
    const resetPasswordFormElement = document.getElementById('resetPasswordFormElement');
    if (resetPasswordFormElement) {
        resetPasswordFormElement.addEventListener('submit', async (e) => {
            e.preventDefault();
            await resetPassword();
        });
    }
    
    console.log('Autenticación inicializada');
}

// Helper para obtener traducciones
function getTranslation(key, lang = null) {
    if (!lang) {
        lang = localStorage.getItem('veedor_language') || 'es';
    }
    if (window.t && typeof window.t === 'function') {
        return window.t(key, lang);
    }
    if (window.translations && window.translations[lang]) {
        const keys = key.split('.');
        let value = window.translations[lang];
        for (const k of keys) {
            value = value?.[k];
            if (!value) {
                // Fallback a español
                value = window.translations['es'];
                for (const k2 of keys) {
                    value = value?.[k2];
                }
                break;
            }
        }
        return value || key;
    }
    return key;
}

// Solicitar recuperación de contraseña
async function requestPasswordReset() {
    const email = document.getElementById('forgotEmail').value.trim();
    const errorMsg = document.getElementById('forgotPasswordError');
    const successMsg = document.getElementById('forgotPasswordSuccess');
    const resetSection = document.getElementById('resetPasswordSection');
    const lang = localStorage.getItem('veedor_language') || 'es';
    
    if (errorMsg) errorMsg.textContent = '';
    if (successMsg) successMsg.style.display = 'none';
    
    if (!email) {
        if (errorMsg) errorMsg.textContent = getTranslation('auth.pleaseEnterEmail', lang);
        return;
    }
    
    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        if (errorMsg) errorMsg.textContent = getTranslation('auth.pleaseEnterValidEmail', lang);
        return;
    }
    
    try {
        const data = await apiRequest('/forgot-password', {
            method: 'POST',
            body: JSON.stringify({ email })
        });
        
            if (successMsg) {
                if (data.token) {
                    // Mostrar código directamente (normal en Render plan gratuito)
                    successMsg.innerHTML = `
                    <div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); padding: 10px; border-radius: 8px; border: 1px solid var(--primary); margin-bottom: 12px;">
                        <div style="display: flex; align-items: center; gap: 4px; margin-bottom: 6px;">
                            <span style="font-size: 16px;">✅</span>
                            <strong style="color: var(--gray-900); font-size: 13px;">Código generado (válido 1h)</strong>
                        </div>
                        <div style="background: white; padding: 8px 10px; border-radius: 6px; border: 1px solid var(--primary); margin: 6px 0; display: flex; align-items: center; justify-content: space-between; gap: 6px;">
                            <code style="font-size: 10px; font-weight: 600; color: var(--primary); word-break: break-all; flex: 1; font-family: 'Courier New', monospace; line-height: 1.3;">${data.token}</code>
                            <button type="button" onclick="event.preventDefault(); event.stopPropagation(); const token = '${data.token}'; navigator.clipboard.writeText(token).then(() => { const btn = event.target; btn.textContent='✓'; setTimeout(() => { btn.textContent='📋'; }, 2000); }).catch(err => console.error('Error copiando:', err));" style="background: var(--primary); color: white; border: none; padding: 5px 8px; border-radius: 4px; cursor: pointer; font-size: 11px; flex-shrink: 0;" title="Copiar">📋</button>
                        </div>
                    </div>
                `;
                    successMsg.style.display = 'block';
                    if (resetSection) resetSection.style.display = 'block';
                } else {
                    // Email enviado correctamente - NO mostrar código
                    successMsg.innerHTML = `
                    <div style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); padding: 14px; border-radius: 10px; border: 1px solid #22c55e; margin-bottom: 14px;">
                        <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 8px;">
                            <span style="font-size: 20px;">✅</span>
                            <strong style="color: var(--gray-900); font-size: 14px;">Email de recuperación enviado</strong>
                        </div>
                        <p style="margin: 4px 0 8px 0; color: var(--gray-700); font-size: 13px; line-height: 1.4;">Hemos enviado un código de recuperación a tu email. Revisa tu bandeja de entrada y la carpeta de spam.</p>
                        <p style="margin: 8px 0 0 0; color: var(--gray-600); font-size: 12px; line-height: 1.3; font-style: italic;">El código expirará en 1 hora. Si no lo recibes en unos minutos, verifica tu carpeta de spam o solicita uno nuevo.</p>
                    </div>
                `;
                    successMsg.style.display = 'block';
                    if (resetSection) resetSection.style.display = 'block';
                }
            }
    } catch (error) {
        console.error('Error en requestPasswordReset:', error);
        if (errorMsg) {
            errorMsg.textContent = error.message || getTranslation('auth.passwordResetRequestError', lang);
        }
    }
}

// Resetear contraseña
async function resetPassword() {
    const token = document.getElementById('resetToken').value.trim();
    const newPassword = document.getElementById('resetNewPassword').value;
    const errorMsg = document.getElementById('resetPasswordError');
    const lang = localStorage.getItem('veedor_language') || 'es';
    
    if (errorMsg) errorMsg.textContent = '';
    
    if (!token || !newPassword) {
        if (errorMsg) errorMsg.textContent = getTranslation('auth.pleaseCompleteAllFields', lang);
        return;
    }
    
    if (newPassword.length < 4) {
        if (errorMsg) errorMsg.textContent = getTranslation('auth.passwordMinLength', lang);
        return;
    }
    
    try {
        await apiRequest('/reset-password', {
            method: 'POST',
            body: JSON.stringify({ token, newPassword })
        });
        
        alert('✅ ' + getTranslation('auth.passwordResetSuccess', lang));
        const forgotForm = document.getElementById('forgotPasswordFormElement');
        const resetForm = document.getElementById('resetPasswordFormElement');
        if (forgotForm) forgotForm.reset();
        if (resetForm) resetForm.reset();
        const forgotPasswordForm = document.getElementById('forgotPasswordForm');
        const loginForm = document.getElementById('loginForm');
        if (forgotPasswordForm) forgotPasswordForm.style.display = 'none';
        if (loginForm) loginForm.style.display = 'block';
    } catch (error) {
        if (errorMsg) errorMsg.textContent = error.message || getTranslation('auth.passwordResetError', lang);
    }
}

// Registrar nuevo usuario
async function register() {
    console.log('=== FUNCIÓN REGISTER LLAMADA ===');
    
    const emailInput = document.getElementById('registerEmail');
    const usernameInput = document.getElementById('registerUsername');
    const passwordInput = document.getElementById('registerPassword');
    const passwordConfirmInput = document.getElementById('registerPasswordConfirm');
    const errorMsg = document.getElementById('registerError');
    
    if (!emailInput || !usernameInput || !passwordInput || !passwordConfirmInput || !errorMsg) {
        console.error('❌ Elementos del formulario no encontrados');
        alert('Error: Formulario no encontrado. Recarga la página.');
        return;
    }
    
    const email = emailInput.value.trim();
    const username = usernameInput.value.trim();
    const password = passwordInput.value;
    const passwordConfirm = passwordConfirmInput.value;
    
    console.log('Datos del formulario:', { email, username, passwordLength: password.length, passwordsMatch: password === passwordConfirm });
    
    errorMsg.textContent = '';
    
    const lang = localStorage.getItem('veedor_language') || 'es';
    
    if (!email) {
        errorMsg.textContent = getTranslation('auth.emailRequired', lang);
        console.log('Validación fallida: email vacío');
        return;
    }
    
    if (!username) {
        errorMsg.textContent = getTranslation('auth.usernameRequired', lang);
        console.log('Validación fallida: username vacío');
        return;
    }
    
    if (username.length < 3) {
        errorMsg.textContent = getTranslation('auth.usernameMinLength', lang);
        console.log('Validación fallida: username muy corto');
        return;
    }
    
    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        errorMsg.textContent = getTranslation('auth.pleaseEnterValidEmail', lang);
        console.log('Validación fallida: email inválido');
        return;
    }
    
    if (password !== passwordConfirm) {
        errorMsg.textContent = getTranslation('auth.passwordsDoNotMatch', lang);
        console.log('Validación fallida: contraseñas no coinciden');
        return;
    }
    
    if (password.length < 4) {
        errorMsg.textContent = getTranslation('auth.passwordMinLength', lang);
        console.log('Validación fallida: contraseña muy corta');
        return;
    }
    
    try {
        errorMsg.textContent = getTranslation('auth.registering', lang);
        errorMsg.style.color = '#666';
        console.log('Enviando registro a:', `${API_URL}/register`);
        console.log('URL completa:', window.location.origin + API_URL + '/register');
        console.log('Datos:', { email, username, password: '***' });
        
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, username, password })
        });
        
        console.log('Respuesta recibida. Status:', response.status);
        console.log('Headers:', Object.fromEntries(response.headers.entries()));
        
        let data;
        try {
            const text = await response.text();
            console.log('Respuesta texto:', text);
            data = JSON.parse(text);
            console.log('Datos de respuesta parseados:', data);
        } catch (parseError) {
            console.error('Error parseando JSON:', parseError);
            throw new Error(`Error del servidor: ${response.status} ${response.statusText}`);
        }
        
        if (!response.ok) {
            throw new Error(data.error || `Error ${response.status}: ${response.statusText}`);
        }
        
        console.log('✅ Registro exitoso');
        authToken = data.token;
        currentUser = data.user.username || data.user.email;
        currentUserEmail = data.user.email;
        // Cargar datos del perfil
        userProfile = {
            firstName: data.user.firstName || '',
            lastName: data.user.lastName || '',
            age: data.user.age || null,
            phone: data.user.phone || '',
            address: data.user.address || '',
            city: data.user.city || '',
            country: data.user.country || '',
            birthDate: data.user.birthDate || null,
            notes: data.user.notes || ''
        };
        localStorage.setItem('veedor_token', authToken);
        
        showMainApp();
        await loadUserData();
        initializeDate();
        initializeCategories();
        initializeTabs();
        initializeForms();
        updateDisplay();
        initializeCharts();
        updateUserInfo();
        
        const form = document.getElementById('registerFormElement');
        if (form) form.reset();
    } catch (error) {
        console.error('❌ Error en registro:', error);
        console.error('Stack:', error.stack);
        const lang = localStorage.getItem('veedor_language') || 'es';
        errorMsg.textContent = error.message || getTranslation('auth.registerError', lang);
        errorMsg.style.color = '#ef4444';
    }
}

// Iniciar sesión
async function login() {
    const emailOrUsernameInput = document.getElementById('loginEmailOrUsername');
    if (!emailOrUsernameInput) {
        console.error('Campo loginEmailOrUsername no encontrado');
        return;
    }
    const emailOrUsername = emailOrUsernameInput.value.trim();
    const password = document.getElementById('loginPassword').value;
    const errorMsg = document.getElementById('loginError');
    
    errorMsg.textContent = '';
    
    const lang = localStorage.getItem('veedor_language') || 'es';
    
    if (!emailOrUsername) {
        errorMsg.textContent = getTranslation('auth.pleaseEnterEmailOrUsername', lang);
        return;
    }
    
    try {
        const data = await apiRequest('/login', {
            method: 'POST',
            body: JSON.stringify({ emailOrUsername, password })
        });
        
        authToken = data.token;
        currentUser = data.user.username || data.user.email;
        currentUserEmail = data.user.email;
        // Cargar datos del perfil
        userProfile = {
            firstName: data.user.firstName || '',
            lastName: data.user.lastName || '',
            age: data.user.age || null,
            phone: data.user.phone || '',
            address: data.user.address || '',
            city: data.user.city || '',
            country: data.user.country || '',
            birthDate: data.user.birthDate || null,
            notes: data.user.notes || ''
        };
        localStorage.setItem('veedor_token', authToken);
        
        showMainApp();
        // updateCurrentDateDisplay(); // Removido - fecha ya no se muestra
        await loadUserData();
        initializeDate();
        initializeCategories();
        initializeTabs();
        initializeForms();
        updateDisplay();
        initializeCharts();
        updateUserInfo();
        
        document.getElementById('loginFormElement').reset();
    } catch (error) {
        const lang = localStorage.getItem('veedor_language') || 'es';
        errorMsg.textContent = error.message || getTranslation('auth.loginError', lang);
    }
}

// Cerrar sesión
function logout() {
    currentUser = null;
    authToken = null;
    localStorage.removeItem('veedor_token');
    transactions = [];
    envelopes = [];
    showAuthScreen();
    document.getElementById('loginFormElement').reset();
    document.getElementById('registerFormElement').reset();
}

// Mostrar pantalla de autenticación
function showAuthScreen() {
    const authScreen = document.getElementById('authScreen');
    const mainApp = document.getElementById('mainApp');
    if (authScreen) {
        authScreen.style.display = 'flex';
        // Ocultar footer en welcome page
        const footer = document.getElementById('mainFooter');
        if (footer) footer.style.display = 'none';
    }
    if (mainApp) {
        mainApp.style.display = 'none';
    }
    
    // Asegurar que los formularios estén visibles
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    if (loginForm) loginForm.style.display = 'block';
    if (registerForm) registerForm.style.display = 'none';
}

// Mostrar aplicación principal
function showMainApp() {
    document.getElementById('authScreen').style.display = 'none';
    document.getElementById('mainApp').style.display = 'block';
    // Mostrar footer en la app principal
    const footer = document.getElementById('mainFooter');
    if (footer) footer.style.display = 'block';
    // updateCurrentDateDisplay(); // Removido - fecha ya no se muestra
}

// Actualizar información del usuario
function updateUserInfo() {
    const currentUserTextEl = document.getElementById('currentUserText');
    if (currentUserTextEl) {
        let displayName = 'Usuario';
        if (userProfile && (userProfile.firstName || userProfile.lastName)) {
            displayName = `${userProfile.firstName || ''} ${userProfile.lastName || ''}`.trim();
        } else if (currentUser) {
            displayName = currentUser;
        }
        currentUserTextEl.textContent = displayName;
        console.log('✅ Nombre de usuario actualizado:', displayName);
    } else {
        console.warn('⚠️ Elemento currentUserText no encontrado');
    }
}

// Cargar datos del usuario actual
async function loadUserData() {
    try {
        const [transactionsData, envelopesData, loansData, investmentsData] = await Promise.all([
            apiRequest('/transactions'),
            apiRequest('/envelopes'),
            apiRequest('/loans'),
            apiRequest('/investments').catch(() => [])
        ]);
        
        transactions = transactionsData.map(t => ({
            ...t,
            categoryGeneral: t.category_general,
            categorySpecific: t.category_specific
        }));
        
        envelopes = envelopesData;
        loans = loansData;
        investments = investmentsData || [];
        
        // Cargar presupuestos por separado para manejar errores
        let budgetsData = [];
        try {
            budgetsData = await apiRequest('/budgets');
        } catch (error) {
            console.warn('No se pudieron cargar presupuestos:', error);
            budgetsData = [];
        }
        budgets = budgetsData || [];
        
        // Cargar cuentas bancarias por separado para manejar errores
        let accountsData = [];
        try {
            accountsData = await apiRequest('/accounts');
        } catch (error) {
            console.warn('No se pudieron cargar cuentas:', error);
            accountsData = [];
        }
        accounts = accountsData || [];
        
        // Cargar propiedades por separado para manejar errores
        let propertiesData = [];
        try {
            propertiesData = await apiRequest('/properties');
        } catch (error) {
            console.warn('No se pudieron cargar propiedades:', error);
            propertiesData = [];
        }
        properties = propertiesData || [];
        
        // Actualizar selectores después de cargar datos
        updateAccountSelect();
        updatePropertySelect();
        
        // Cargar categorías personalizadas
        loadCustomCategories();
        
        // Cargar meta de ahorro desde el perfil del usuario
        try {
            const profileData = await apiRequest('/user/profile');
            if (profileData && profileData.savingsGoal !== undefined) {
                savingsGoal = profileData.savingsGoal;
            }
        } catch (error) {
            console.warn('No se pudo cargar la meta de ahorro:', error);
            // Fallback a localStorage si existe (migración)
            const savedGoal = localStorage.getItem('veedor_savingsGoal');
            if (savedGoal) {
                try {
                    savingsGoal = parseFloat(savedGoal);
                    // Migrar a la BD
                    await apiRequest('/user/profile', {
                        method: 'PUT',
                        body: JSON.stringify({ savingsGoal })
                    });
                    localStorage.removeItem('veedor_savingsGoal');
                } catch (e) {
                    savingsGoal = null;
                }
            }
        }
    } catch (error) {
        console.error('Error cargando datos:', error);
        transactions = [];
        envelopes = [];
    }
}

// Guardar datos del usuario actual (ya no necesario, se guarda automáticamente)
function saveData() {
    // Los datos se guardan automáticamente al crear/eliminar
}

// Inicializar fecha por defecto
function initializeDate() {
    const dateInput = document.getElementById('transactionDate');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.value = today;
    }
    
    // Actualizar indicador de fecha actual en el header
    // updateCurrentDateDisplay(); // Removido - fecha ya no se muestra
}

// Actualizar fecha actual en el header
function updateCurrentDateDisplay() {
    const dateDisplay = document.getElementById('currentDateText');
    if (dateDisplay) {
        const now = new Date();
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        dateDisplay.textContent = now.toLocaleDateString('es-ES', options);
    }
}

// Toggle del menú desplegable principal de navegación
function toggleMainNavDropdown() {
    const dropdown = document.getElementById('mainNavDropdown');
    const settingsDropdown = document.getElementById('settingsDropdown');
    if (dropdown) {
        dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
    }
    // Cerrar settings dropdown si está abierto
    if (settingsDropdown && settingsDropdown.style.display === 'block') {
        settingsDropdown.style.display = 'none';
    }
}

function toggleSettingsDropdown() {
    const dropdown = document.getElementById('settingsDropdown');
    const mainNavDropdown = document.getElementById('mainNavDropdown');
    if (dropdown) {
        dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
    }
    // Cerrar navegación dropdown si está abierto
    if (mainNavDropdown && mainNavDropdown.style.display === 'block') {
        mainNavDropdown.style.display = 'none';
    }
}

// Toggle del menú desplegable de Panel de Mandos (mantener para compatibilidad)
function toggleDashboardDropdown() {
    toggleMainNavDropdown(); // Redirigir al menú principal
}

// Cerrar dropdown al hacer clic fuera
document.addEventListener('click', function(event) {
    const mainDropdown = document.getElementById('mainNavDropdown');
    const mainBtn = document.getElementById('mainNavDropdownBtn');
    const dashboardDropdown = document.getElementById('dashboardDropdown');
    const dashboardBtn = document.getElementById('dashboardDropdownBtn');
    
    if (mainDropdown && mainBtn && !mainDropdown.contains(event.target) && !mainBtn.contains(event.target)) {
        mainDropdown.style.display = 'none';
    }
    
    const settingsDropdown = document.getElementById('settingsDropdown');
    const settingsBtn = document.getElementById('settingsDropdownBtn');
    
    if (settingsDropdown && settingsBtn && !settingsDropdown.contains(event.target) && !settingsBtn.contains(event.target)) {
        settingsDropdown.style.display = 'none';
    }
    
    if (dashboardDropdown && dashboardBtn && !dashboardDropdown.contains(event.target) && !dashboardBtn.contains(event.target)) {
        dashboardDropdown.style.display = 'none';
    }
    
    // Cerrar dropdowns de idioma
    const languageDropdown = document.getElementById('languageDropdown');
    const languageBtn = document.getElementById('languageDropdownBtn');
    if (languageDropdown && languageBtn && !languageDropdown.contains(event.target) && !languageBtn.contains(event.target)) {
        languageDropdown.style.display = 'none';
    }
    
    const authLanguageDropdown = document.getElementById('authLanguageDropdown');
    const authLanguageBtn = document.getElementById('authLanguageDropdownBtn');
    if (authLanguageDropdown && authLanguageBtn && !authLanguageDropdown.contains(event.target) && !authLanguageBtn.contains(event.target)) {
        authLanguageDropdown.style.display = 'none';
    }
});

// Mostrar panel de mandos del mes
function showMonthDashboard() {
    const monthDashboard = document.getElementById('monthDashboard');
    const dashboardMonthInput = document.getElementById('dashboardMonth');
    
    if (!monthDashboard || !dashboardMonthInput) {
        console.error('No se encontró monthDashboard o dashboardMonthInput');
        return;
    }
    
    // Si no hay mes seleccionado, establecer el mes actual
    if (!dashboardMonthInput.value) {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        dashboardMonthInput.value = `${year}-${month}`;
    }
    
    // Mostrar el panel
    monthDashboard.style.display = 'block';
    
    // Actualizar el contenido del panel
    updateMonthDashboard();
    
    // Hacer scroll al dashboard
    setTimeout(() => {
        const dashboard = document.querySelector('.dashboard');
        if (dashboard) {
            const rect = dashboard.getBoundingClientRect();
            const header = document.querySelector('header');
            const headerHeight = header ? header.offsetHeight : 80;
            const scrollPosition = rect.top + window.pageYOffset - headerHeight - 20;
            window.scrollTo({ 
                top: Math.max(0, scrollPosition), 
                behavior: 'smooth' 
            });
        }
    }, 300);
}

// Scroll al dashboard principal
function scrollToDashboard() {
    const dashboard = document.querySelector('.dashboard');
    if (dashboard) {
        dashboard.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Exponer funciones globalmente
window.toggleMainNavDropdown = toggleMainNavDropdown;
window.toggleDashboardDropdown = toggleDashboardDropdown;
window.showMonthDashboard = showMonthDashboard;
window.scrollToDashboard = scrollToDashboard;
window.switchToTab = switchToTab;

// Inicializar categorías
function initializeCategories() {
    const generalSelect = document.getElementById('categoryGeneral');
    const specificSelect = document.getElementById('categorySpecific');
    const filterCategory = document.getElementById('filterCategory');
    const transactionType = document.getElementById('transactionType');
    
    if (!generalSelect || !specificSelect || !filterCategory) return;
    
    // Función para actualizar categorías según el tipo
    const updateCategoriesByType = () => {
        const type = transactionType ? transactionType.value : 'expense';
        const categoryList = type === 'income' ? categories.income : categories.expense;
        const customList = type === 'income' ? customCategories.income : customCategories.expense;
        
        // Limpiar selects
        generalSelect.innerHTML = '<option value="">Seleccionar...</option>';
        specificSelect.innerHTML = '<option value="">Seleccionar...</option>';
        
        // Agregar categorías predefinidas
        categoryList.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.id;
            option.textContent = cat.name;
            generalSelect.appendChild(option);
        });
        
        // Agregar categorías personalizadas
        customList.forEach(cat => {
            const option = document.createElement('option');
            option.value = `custom_${cat.id}`;
            option.textContent = `${cat.name} (Personalizada)`;
            generalSelect.appendChild(option);
        });
        
        // Actualizar filtro de categorías
        filterCategory.innerHTML = '<option value="">Todas las categorías</option>';
        [...categoryList, ...customList].forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.id;
            option.textContent = cat.name;
            filterCategory.appendChild(option);
        });
    };
    
    // Actualizar cuando cambia el tipo de transacción
    if (transactionType) {
        transactionType.addEventListener('change', updateCategoriesByType);
    }
    
    // Actualizar categorías específicas cuando cambia la general
    generalSelect.addEventListener('change', () => {
        const selectedGeneral = generalSelect.value;
        specificSelect.innerHTML = '<option value="">Seleccionar...</option>';
        
        if (selectedGeneral) {
            const type = transactionType ? transactionType.value : 'expense';
            const categoryList = type === 'income' ? categories.income : categories.expense;
            const customList = type === 'income' ? customCategories.income : customCategories.expense;
            
            // Buscar en categorías predefinidas
            let category = categoryList.find(c => c.id === selectedGeneral);
            
            // Si no está, buscar en personalizadas
            if (!category && selectedGeneral.startsWith('custom_')) {
                const customId = selectedGeneral.replace('custom_', '');
                const customCat = customList.find(c => c.id === customId);
                if (customCat) {
                    // Si la categoría personalizada tiene subcategorías, usarlas
                    if (customCat.subcategories && customCat.subcategories.length > 0) {
                        customCat.subcategories.forEach(sub => {
                            const option = document.createElement('option');
                            option.value = sub;
                            option.textContent = sub;
                            specificSelect.appendChild(option);
                        });
                        return;
                    }
                }
            }
            
            if (category) {
                category.subcategories.forEach(sub => {
                    const option = document.createElement('option');
                    option.value = sub;
                    option.textContent = sub;
                    specificSelect.appendChild(option);
                });
            }
        }
    });
    
    // Inicializar con categorías de gastos por defecto
    updateCategoriesByType();
}

// Función para cambiar de tab (reutilizable)
function switchToTab(targetTab, doScroll = false) {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const navItems = document.querySelectorAll('.nav-item');
    
    // Actualizar tabs principales
    tabButtons.forEach(b => b.classList.remove('active'));
    tabContents.forEach(c => c.classList.remove('active'));
    
    const targetTabBtn = document.querySelector(`.tab-btn[data-tab="${targetTab}"]`);
    const targetTabContent = document.getElementById(`${targetTab}-tab`);
    
    if (targetTabBtn) targetTabBtn.classList.add('active');
    if (targetTabContent) {
        targetTabContent.classList.add('active');
        // Solo hacer scroll si se solicita explícitamente (doScroll = true)
        if (doScroll) {
            // Scroll suave a la sección - esperar a que el DOM se actualice y el tab esté visible
            setTimeout(() => {
                if (targetTabContent) {
                    // Obtener altura del header sticky
                    const header = document.querySelector('header');
                    const headerHeight = header ? header.offsetHeight : 80;
                    
                    // Obtener posición del tab content
                    const tabRect = targetTabContent.getBoundingClientRect();
                    const scrollPosition = tabRect.top + window.pageYOffset - headerHeight - 20; // 20px de margen adicional
                    
                    // Hacer scroll suave
                    window.scrollTo({ 
                        top: Math.max(0, scrollPosition), 
                        behavior: 'smooth' 
                    });
                }
            }, 100);
        }
    }
    
    // Actualizar items del dropdown
    const dropdownItems = document.querySelectorAll('.nav-dropdown-item[data-tab]');
    dropdownItems.forEach(item => {
        if (item.getAttribute('data-tab') === targetTab) {
            item.style.background = 'var(--primary-light)';
            item.style.color = 'var(--primary)';
            item.style.fontWeight = '600';
        } else {
            item.style.background = 'transparent';
            item.style.color = 'var(--gray-900)';
            item.style.fontWeight = '400';
        }
    });
    
    // Actualizar gráficas y análisis cuando se cambia al tab de análisis
    if (targetTab === 'charts') {
        setTimeout(() => {
            updateCharts();
        }, 100);
    }
    
    // Actualizar presupuestos cuando se cambia al tab de presupuestos
    if (targetTab === 'budgets') {
        setTimeout(() => {
            updateBudgets();
        }, 100);
    }
    
    // Actualizar cuentas cuando se cambia al tab de cuentas
    if (targetTab === 'accounts') {
        setTimeout(() => {
            updateAccounts();
        }, 100);
    }
    
    // Actualizar propiedades cuando se cambia al tab de propiedades
    if (targetTab === 'properties') {
        setTimeout(() => {
            updateProperties();
        }, 100);
    }
    
    // Actualizar patrimonio cuando se cambia al tab de patrimonio
    if (targetTab === 'assets') {
        setTimeout(() => {
            updateAssets();
        }, 100);
    }
}

// Inicializar tabs
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const navItems = document.querySelectorAll('.nav-item');
    
    // Event listeners para tabs principales
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');
            switchToTab(targetTab, true); // Permitir scroll cuando el usuario hace clic manualmente
        });
    });
    
    // Event listeners para navegación del header
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetTab = item.getAttribute('data-tab');
            switchToTab(targetTab, true); // Permitir scroll cuando el usuario hace clic manualmente
            // Scroll suave hacia el contenido
            const mainContent = document.querySelector('.main-content');
            if (mainContent) {
                mainContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
    
    // Inicializar estado activo del primer tab SIN hacer scroll automático
    if (tabButtons.length > 0) {
        const firstTab = tabButtons[0].getAttribute('data-tab');
        const firstTabBtn = document.querySelector(`.tab-btn[data-tab="${firstTab}"]`);
        const firstTabContent = document.getElementById(`${firstTab}-tab`);
        
        // Activar el primer tab sin hacer scroll
        if (firstTabBtn) firstTabBtn.classList.add('active');
        if (firstTabContent) {
            firstTabContent.classList.add('active');
        }
        
        // NO hacer scroll automático - el usuario decidirá dónde quiere ir
    }
}

// Inicializar formularios
function initializeForms() {
    console.log('🔧 initializeForms() - Iniciando...');
    
    // Formulario de transacciones
    const transactionForm = document.getElementById('transactionForm');
    console.log('🔍 Buscando formulario transactionForm:', transactionForm ? '✅ Encontrado' : '❌ NO ENCONTRADO');
    
    if (transactionForm) {
        console.log('✅ Formulario encontrado, agregando event listener...');
        transactionForm.addEventListener('submit', async (e) => {
            console.log('🎯 EVENTO SUBMIT DISPARADO!');
            e.preventDefault();
            console.log('🔄 Llamando a addTransaction()...');
            try {
                await addTransaction();
            } catch (error) {
                console.error('❌ Error en addTransaction desde event listener:', error);
            }
        });
        console.log('✅ Event listener agregado al formulario');
    } else {
        console.error('❌ ERROR: No se encontró el formulario transactionForm');
        console.error('❌ Elementos disponibles:', document.querySelectorAll('form').length, 'formularios encontrados');
    }
    
    // Formulario de sobres
    const envelopeForm = document.getElementById('envelopeForm');
    if (envelopeForm) {
        envelopeForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await addEnvelope();
        });
    }
    
    // Formulario de inversiones
    const investmentForm = document.getElementById('investmentForm');
    if (investmentForm) {
        investmentForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await addInvestment();
        });
    }
    
    // Formulario de cuentas bancarias
    const accountForm = document.getElementById('accountForm');
    if (accountForm) {
        accountForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await addAccount();
        });
        
        // Ya no necesitamos calcular rentabilidad automáticamente en el formulario
        // La rentabilidad se calcula en base a los aportes acumulados
    }
    
    // Formulario de patrimonio
    const assetForm = document.getElementById('assetForm');
    if (assetForm) {
        assetForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await addAsset();
        });
        
        // Inicializar fecha de adquisición con hoy
        const assetPurchaseDate = document.getElementById('assetPurchaseDate');
        if (assetPurchaseDate) {
            const today = new Date().toISOString().split('T')[0];
            assetPurchaseDate.value = today;
        }
    }
    
    // Toggle de aportes periódicos en inversiones
    const enablePeriodicContribution = document.getElementById('enablePeriodicContribution');
    const periodicContributionFields = document.getElementById('periodicContributionFields');
    if (enablePeriodicContribution && periodicContributionFields) {
        enablePeriodicContribution.addEventListener('change', (e) => {
            periodicContributionFields.style.display = e.target.checked ? 'block' : 'none';
            
            // Inicializar fechas si se activa
            if (e.target.checked) {
                const contributionStartDate = document.getElementById('contributionStartDate');
                const contributionEndDate = document.getElementById('contributionEndDate');
                if (contributionStartDate) {
                    const today = new Date().toISOString().split('T')[0];
                    contributionStartDate.value = today;
                }
            }
        });
    }
    
    // Formulario de préstamos
    const loanForm = document.getElementById('loanForm');
    if (loanForm) {
        loanForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await addLoan();
        });
        
        // Calcular cuota mensual automáticamente
        const loanPrincipal = document.getElementById('loanPrincipal');
        const loanInterestRate = document.getElementById('loanInterestRate');
        const loanStartDate = document.getElementById('loanStartDate');
        const loanEndDate = document.getElementById('loanEndDate');
        const loanMonthlyPayment = document.getElementById('loanMonthlyPayment');
        
        if (loanPrincipal && loanInterestRate && loanStartDate && loanEndDate && loanMonthlyPayment) {
            const calculatePayment = () => {
                const principal = parseFloat(loanPrincipal.value) || 0;
                const rate = parseFloat(loanInterestRate.value) || 0;
                const start = new Date(loanStartDate.value);
                const end = new Date(loanEndDate.value);
                
                if (principal > 0 && rate >= 0 && end > start && !isNaN(start.getTime()) && !isNaN(end.getTime())) {
                    const months = Math.ceil((end - start) / (1000 * 60 * 60 * 24 * 30.44));
                    if (months > 0) {
                        const payment = calculateMonthlyPayment(principal, rate, months);
                        loanMonthlyPayment.value = payment.toFixed(2);
                    }
                }
            };
            
            loanPrincipal.addEventListener('input', calculatePayment);
            loanInterestRate.addEventListener('input', calculatePayment);
            loanStartDate.addEventListener('change', calculatePayment);
            loanEndDate.addEventListener('change', calculatePayment);
        }
        
        // Inicializar fecha de inicio
        if (loanStartDate) {
            const today = new Date().toISOString().split('T')[0];
            loanStartDate.value = today;
        }
    }
    
    // Búsqueda y filtros
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', updateDisplay);
    }
    
    const filterCategory = document.getElementById('filterCategory');
    if (filterCategory) {
        filterCategory.addEventListener('change', updateDisplay);
    }
    
    const filterMonth = document.getElementById('filterMonth');
    if (filterMonth) {
        filterMonth.addEventListener('change', updateDisplay);
    }
    
    // Selector de período para gráficas (global - mantener para compatibilidad)
    const chartPeriod = document.getElementById('chartPeriod');
    if (chartPeriod) {
        chartPeriod.addEventListener('change', updateCharts);
    }
    
    // Selectores individuales de período para cada gráfico
    document.querySelectorAll('.chart-period-select').forEach(select => {
        select.addEventListener('change', () => {
            const chartName = select.getAttribute('data-chart');
            const value = select.value;
            
            // Mostrar/ocultar selector de fecha personalizada
            const customDateRange = document.getElementById(`${chartName}CustomDateRange`);
            if (customDateRange) {
                if (value === 'custom') {
                    customDateRange.style.display = 'flex';
                } else {
                    customDateRange.style.display = 'none';
                }
            }
            
            updateSingleChart(chartName);
        });
    });
    
    // Listeners para fechas personalizadas
    document.querySelectorAll('[id$="StartDate"], [id$="EndDate"]').forEach(input => {
        input.addEventListener('change', () => {
            // Extraer el nombre del gráfico del ID
            const id = input.id;
            const chartName = id.replace(/StartDate|EndDate/, '');
            if (chartName) {
                updateSingleChart(chartName);
            }
        });
    });
    
    // Selectores de filtros de categorías/tipos
    document.querySelectorAll('.chart-category-filter').forEach(select => {
        select.addEventListener('change', () => {
            const chartName = select.getAttribute('data-chart');
            updateSingleChart(chartName);
        });
    });
    
    document.querySelectorAll('.chart-loan-filter').forEach(select => {
        select.addEventListener('change', () => {
            updateSingleChart('loansPending');
        });
    });
    
    document.querySelectorAll('.chart-asset-filter').forEach(select => {
        select.addEventListener('change', () => {
            updateSingleChart('assetsEvolution');
        });
    });
    
    document.querySelectorAll('.chart-account-filter').forEach(select => {
        select.addEventListener('change', () => {
            updateSingleChart('accountsBalance');
        });
    });
    
    // Poblar filtros cuando se cargan los datos
    updateChartFilters();
    
    // Botón para agregar categoría personalizada
    const addCustomCategoryBtn = document.getElementById('addCustomCategoryBtn');
    if (addCustomCategoryBtn) {
        addCustomCategoryBtn.addEventListener('click', showAddCustomCategoryModal);
    }
    
    // Modal de categoría personalizada
    const customCategoryModal = document.getElementById('customCategoryModal');
    const closeCustomCategoryModalBtn = document.getElementById('closeCustomCategoryModal');
    const cancelCustomCategoryBtn = document.getElementById('cancelCustomCategoryBtn');
    const customCategoryForm = document.getElementById('customCategoryForm');
    
    if (closeCustomCategoryModalBtn) {
        closeCustomCategoryModalBtn.addEventListener('click', closeCustomCategoryModal);
    }
    
    if (cancelCustomCategoryBtn) {
        cancelCustomCategoryBtn.addEventListener('click', closeCustomCategoryModal);
    }
    
    if (customCategoryForm) {
        customCategoryForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await addCustomCategory();
        });
    }
    
    // Cerrar modal al hacer clic fuera
    if (customCategoryModal) {
        customCategoryModal.addEventListener('click', (e) => {
            if (e.target === customCategoryModal) {
                closeCustomCategoryModal();
            }
        });
    }
    
    // Modal de amortización
    const amortizationModal = document.getElementById('amortizationModal');
    const closeAmortizationModalBtn = document.getElementById('closeAmortizationModal');
    
    if (closeAmortizationModalBtn) {
        closeAmortizationModalBtn.addEventListener('click', () => {
            if (amortizationModal) {
                amortizationModal.style.display = 'none';
            }
        });
    }
    
    if (amortizationModal) {
        amortizationModal.addEventListener('click', (e) => {
            if (e.target === amortizationModal) {
                amortizationModal.style.display = 'none';
            }
        });
    }
    
    // Botón para establecer meta de ahorro
    const setSavingsGoalBtn = document.getElementById('setSavingsGoalBtn');
    if (setSavingsGoalBtn) {
        setSavingsGoalBtn.addEventListener('click', () => {
            showSavingsGoalModal();
        });
    }
    
    // Inicializar formulario de meta de ahorro
    const savingsGoalForm = document.getElementById('savingsGoalForm');
    if (savingsGoalForm) {
        // Remover listeners anteriores si existen
        const newForm = savingsGoalForm.cloneNode(true);
        savingsGoalForm.parentNode.replaceChild(newForm, savingsGoalForm);
        
        document.getElementById('savingsGoalForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const input = document.getElementById('savingsGoalInput');
            if (!input) {
                alert('Error: No se encontró el campo de entrada');
                return;
            }
            
            const value = input.value.trim();
            if (!value) {
                alert('Por favor ingresa una cantidad válida');
                return;
            }
            
            const numValue = parseFloat(value);
            if (isNaN(numValue) || numValue < 0) {
                alert('Por favor ingresa un número válido mayor o igual a 0');
                return;
            }
            
            try {
                savingsGoal = numValue > 0 ? numValue : null;
                const response = await apiRequest('/user/profile', {
                    method: 'PUT',
                    body: JSON.stringify({ savingsGoal: savingsGoal })
                });
                
                // Verificar que se guardó correctamente
                if (response && response.savingsGoal !== undefined) {
                    savingsGoal = response.savingsGoal;
                }
                
                updateSummary();
                closeSavingsGoalModal();
                alert('✅ Meta de ahorro guardada exitosamente');
            } catch (error) {
                console.error('Error al guardar la meta de ahorro:', error);
                alert('Error al guardar la meta de ahorro: ' + (error.message || 'Error desconocido'));
            }
        });
    }
    
    // Inicializar formulario de añadir dinero a inversión
    const addMoneyInvestmentForm = document.getElementById('addMoneyInvestmentForm');
    if (addMoneyInvestmentForm) {
        addMoneyInvestmentForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await processAddMoneyToInvestment();
        });
    }
    
    // Inicializar formulario de actualizar valor de inversión
    const updateInvestmentValueForm = document.getElementById('updateInvestmentValueForm');
    if (updateInvestmentValueForm) {
        updateInvestmentValueForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await processUpdateInvestmentValue();
        });
    }
    
    // Inicializar formulario de actualizar saldo de cuenta
    const updateAccountBalanceForm = document.getElementById('updateAccountBalanceForm');
    if (updateAccountBalanceForm) {
        updateAccountBalanceForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await processUpdateAccountBalance();
        });
    }
    
    // Inicializar formulario de actualizar valor de bien
    const updateAssetValueForm = document.getElementById('updateAssetValueForm');
    if (updateAssetValueForm) {
        updateAssetValueForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await processUpdateAssetValue();
        });
    }
    
    // Botón de perfil de usuario ya se maneja con onclick en HTML
    
    // Selector de período en dashboard
    const summaryPeriodSelect = document.getElementById('summaryPeriod');
    const summaryYearInput = document.getElementById('summaryYear');
    if (summaryPeriodSelect) {
        // Inicializar año actual
        if (summaryYearInput) {
            summaryYearInput.value = new Date().getFullYear();
        }
        
        summaryPeriodSelect.addEventListener('change', (e) => {
            const value = e.target.value;
            summaryPeriod = value;
            
            // Mostrar/ocultar selector de año
            if (summaryYearInput) {
                if (value === 'year-select') {
                    summaryYearInput.style.display = 'block';
                    summaryYearInput.focus();
                } else {
                    summaryYearInput.style.display = 'none';
                }
            }
            
            updateSummary();
        });
        
        // Listener para cambio de año
        if (summaryYearInput) {
            summaryYearInput.addEventListener('change', () => {
                if (summaryPeriod === 'year-select') {
                    const yearValue = parseInt(summaryYearInput.value);
                    if (yearValue && yearValue >= 2000 && yearValue <= 2100) {
                        updateSummary();
                    }
                }
            });
            
            summaryYearInput.addEventListener('input', () => {
                if (summaryPeriod === 'year-select') {
                    const yearValue = parseInt(summaryYearInput.value);
                    if (yearValue && yearValue >= 2000 && yearValue <= 2100) {
                        updateSummary();
                    }
                }
            });
        }
    }
    
    // Selector de mes para el panel de mandos
    const dashboardMonthInput = document.getElementById('dashboardMonth');
    if (dashboardMonthInput) {
        // Establecer mes actual por defecto
        const now = new Date();
        dashboardMonthInput.value = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        
        dashboardMonthInput.addEventListener('change', (e) => {
            updateMonthDashboard();
        });
        
        // Actualizar panel al cargar
        setTimeout(() => updateMonthDashboard(), 500);
    }
    
    // Formulario de presupuestos
    const budgetForm = document.getElementById('budgetForm');
    if (budgetForm) {
        budgetForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await addBudget();
        });
        
        // Inicializar período actual
        const budgetPeriodType = document.getElementById('budgetPeriodType');
        const budgetPeriodValue = document.getElementById('budgetPeriodValue');
        const budgetPeriodValueLabel = document.getElementById('budgetPeriodValueLabel');
        const budgetPeriodValueHelp = document.getElementById('budgetPeriodValueHelp');
        const budgetAmountLabel = document.getElementById('budgetAmountLabel');
        const budgetAmountHelp = document.getElementById('budgetAmountHelp');
        const budgetDurationGroup = document.getElementById('budgetDurationGroup');
        const budgetDuration = document.getElementById('budgetDuration');
        const budgetDurationLabel = document.getElementById('budgetDurationLabel');
        const budgetDurationHelp = document.getElementById('budgetDurationHelp');
        
        if (budgetPeriodType && budgetPeriodValue) {
            const now = new Date();
            const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
            const currentYear = now.getFullYear().toString();
            const currentWeek = getWeekStartDate(now);
            
            budgetPeriodValue.value = currentMonth;
            
            // Actualizar campos según tipo de período
            budgetPeriodType.addEventListener('change', (e) => {
                const periodType = e.target.value;
                updateBudgetPeriodFields(periodType, budgetPeriodValue, budgetPeriodValueLabel, budgetPeriodValueHelp, budgetAmountLabel, budgetAmountHelp, budgetDurationGroup, budgetDuration, budgetDurationLabel, budgetDurationHelp, now);
            });
            
            // Inicializar campos
            updateBudgetPeriodFields(budgetPeriodType.value, budgetPeriodValue, budgetPeriodValueLabel, budgetPeriodValueHelp, budgetAmountLabel, budgetAmountHelp, budgetDurationGroup, budgetDuration, budgetDurationLabel, budgetDurationHelp, now);
        }
        
        // Función para actualizar campos según período
        function updateBudgetPeriodFields(periodType, periodValueInput, periodValueLabel, periodValueHelp, amountLabel, amountHelp, durationGroup, durationSelect, durationLabel, durationHelp, now) {
            if (periodType === 'weekly') {
                periodValueInput.type = 'date';
                periodValueInput.value = getWeekStartDate(now);
                periodValueLabel.textContent = 'Semana (Inicio)';
                periodValueHelp.textContent = 'Selecciona el lunes de la semana';
                amountLabel.textContent = 'Presupuesto Semanal (€)';
                amountHelp.textContent = 'Límite máximo de gasto para esta semana';
                if (durationGroup) durationGroup.style.display = 'none';
            } else if (periodType === 'monthly') {
                periodValueInput.type = 'month';
                periodValueInput.value = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
                periodValueLabel.textContent = 'Mes de Inicio';
                periodValueHelp.textContent = 'Mes desde el que comienza el presupuesto';
                amountLabel.textContent = 'Presupuesto Mensual (€)';
                amountHelp.textContent = 'Límite máximo de gasto para cada mes';
                if (durationGroup) {
                    durationGroup.style.display = 'block';
                    if (durationLabel) durationLabel.textContent = 'Duración';
                    if (durationHelp) durationHelp.textContent = 'Por cuántos meses aplicar este presupuesto';
                }
            } else if (periodType === 'yearly') {
                periodValueInput.type = 'number';
                periodValueInput.min = '2000';
                periodValueInput.max = '2100';
                periodValueInput.value = now.getFullYear();
                periodValueLabel.textContent = 'Año';
                periodValueHelp.textContent = 'Selecciona el año';
                amountLabel.textContent = 'Presupuesto Anual (€)';
                amountHelp.textContent = 'Límite máximo de gasto para este año';
                if (durationGroup) durationGroup.style.display = 'none';
            }
        }
        
        // Función para obtener el lunes de la semana
        function getWeekStartDate(date) {
            const d = new Date(date);
            const day = d.getDay();
            const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Ajustar al lunes
            const monday = new Date(d.setDate(diff));
            return monday.toISOString().split('T')[0];
        }
        
        // Actualizar categorías según tipo de presupuesto
        const budgetType = document.getElementById('budgetType');
        const budgetCategory = document.getElementById('budgetCategory');
        
        const updateBudgetCategories = () => {
            if (!budgetCategory || !budgetType) return;
            budgetCategory.innerHTML = '<option value="">Seleccionar categoría...</option>';
            
            const type = budgetType.value;
            const categoryList = type === 'income' ? categories.income : categories.expense;
            const customList = type === 'income' ? customCategories.income : customCategories.expense;
            
            [...categoryList, ...customList].forEach(cat => {
                const option = document.createElement('option');
                option.value = cat.id;
                option.textContent = cat.name;
                budgetCategory.appendChild(option);
            });
        };
        
        if (budgetType) {
            budgetType.addEventListener('change', updateBudgetCategories);
        }
        
        // Inicializar categorías
        updateBudgetCategories();
    }
    
    // Formulario de perfil de usuario
    const userProfileForm = document.getElementById('userProfileForm');
    if (userProfileForm) {
        userProfileForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await saveUserProfile();
        });
    }
    
    // Event listener para cerrar modal de perfil al hacer clic fuera
    const userProfileModal = document.getElementById('userProfileModal');
    if (userProfileModal) {
        userProfileModal.addEventListener('click', (e) => {
            if (e.target === userProfileModal) {
                closeUserProfile();
            }
        });
    }
    
    const closeUserProfileModalBtn = document.getElementById('closeUserProfileModal');
    if (closeUserProfileModalBtn) {
        closeUserProfileModalBtn.addEventListener('click', closeUserProfile);
    }
}

// Agregar transacción
async function addTransaction() {
    console.log('🔄 ========================================');
    console.log('🔄 addTransaction() - INICIANDO');
    console.log('🔄 ========================================');
    
    try {
        // Obtener valores del formulario
        console.log('📋 Obteniendo valores del formulario...');
        const typeEl = document.getElementById('transactionType');
        const dateEl = document.getElementById('transactionDate');
        const amountEl = document.getElementById('transactionAmount');
        const categoryGeneralEl = document.getElementById('categoryGeneral');
        const categorySpecificEl = document.getElementById('categorySpecific');
        const envelopeEl = document.getElementById('envelope');
        const accountIdEl = document.getElementById('transactionAccount');
        const investmentIdEl = document.getElementById('transactionInvestment');
        const propertyIdEl = document.getElementById('transactionProperty');
        const descriptionEl = document.getElementById('transactionDescription');
        
        console.log('📋 Elementos encontrados:', {
            typeEl: !!typeEl,
            dateEl: !!dateEl,
            amountEl: !!amountEl,
            categoryGeneralEl: !!categoryGeneralEl,
            categorySpecificEl: !!categorySpecificEl,
            envelopeEl: !!envelopeEl,
            accountIdEl: !!accountIdEl,
            investmentIdEl: !!investmentIdEl,
            propertyIdEl: !!propertyIdEl,
            descriptionEl: !!descriptionEl
        });
        
        if (!typeEl || !dateEl || !amountEl || !categoryGeneralEl || !categorySpecificEl) {
            console.error('❌ ERROR: Faltan elementos del formulario');
            alert('Error: No se encontraron todos los campos del formulario. Recarga la página.');
            return;
        }
        
        const type = typeEl.value;
        const date = dateEl.value;
        const amountInput = amountEl.value;
        const categoryGeneral = categoryGeneralEl.value;
        const categorySpecific = categorySpecificEl.value;
        const envelope = envelopeEl ? envelopeEl.value : '';
        const accountId = accountIdEl ? accountIdEl.value : '';
        const investmentId = investmentIdEl ? investmentIdEl.value : '';
        const propertyId = propertyIdEl ? propertyIdEl.value : '';
        const description = descriptionEl ? descriptionEl.value : '';
        
        console.log('📋 Datos del formulario:', {
            type, date, amountInput, categoryGeneral, categorySpecific,
            envelope, accountId, investmentId, propertyId, description
        });
    
        // Validaciones básicas
        console.log('✅ Validando campos requeridos...');
        if (!type || !date || !amountInput || !categoryGeneral || !categorySpecific) {
            console.error('❌ Validación fallida - campos requeridos faltantes');
            showToast('Por favor completa todos los campos requeridos', 'warning');
            return;
        }
        
        console.log('✅ Validando monto...');
        const amount = parseFloat(amountInput);
        if (isNaN(amount) || amount <= 0) {
            console.error('❌ Validación fallida - monto inválido:', amountInput);
            showToast('Por favor ingresa un monto válido mayor a 0', 'warning');
            return;
        }
        console.log('✅ Monto válido:', amount);
    
        // Normalizar campos opcionales (convertir strings vacíos a null)
        console.log('✅ Normalizando campos opcionales...');
        const normalizedEnvelope = (envelope && envelope.trim() !== '') ? envelope.trim() : null;
        const normalizedAccountId = (accountId && accountId.trim() !== '') ? accountId.trim() : null;
        const normalizedInvestmentId = (investmentId && investmentId.trim() !== '') ? investmentId.trim() : null;
        const normalizedPropertyId = (propertyId && propertyId.trim() !== '') ? propertyId.trim() : null;
        const normalizedDescription = (description && description.trim() !== '') ? description.trim() : null;
        
        // Preparar datos para enviar
        const transactionData = {
            type: type,
            date: date,
            amount: Math.abs(amount),
            categoryGeneral: categoryGeneral,
            categorySpecific: categorySpecific,
            envelope: normalizedEnvelope,
            account_id: normalizedAccountId,
            investment_id: normalizedInvestmentId,
            property_id: normalizedPropertyId,
            description: normalizedDescription
        };
        
        console.log('📤 ========================================');
        console.log('📤 Enviando datos al servidor:');
        console.log('📤', JSON.stringify(transactionData, null, 2));
        console.log('📤 ========================================');
        
        // Enviar al servidor
        console.log('📡 Llamando a apiRequest...');
        const transaction = await apiRequest('/transactions', {
            method: 'POST',
            body: JSON.stringify(transactionData)
        });
        
        console.log('✅ ========================================');
        console.log('✅ Transacción creada exitosamente:');
        console.log('✅', transaction);
        console.log('✅ ========================================');
        
        // Si está asociada a una inversión, recargar datos
        console.log('✅ Actualizando interfaz...');
        if (normalizedInvestmentId && type === 'expense') {
            console.log('✅ Recargando datos completos (transacción asociada a inversión)...');
            await loadUserData();
        } else {
            console.log('✅ Agregando transacción a lista local...');
            // Agregar a la lista local
            transactions.push({
                ...transaction,
                categoryGeneral: transaction.category_general,
                categorySpecific: transaction.category_specific
            });
            transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
            updateDisplay();
        }
        
        // Limpiar formulario
        console.log('✅ Limpiando formulario...');
        document.getElementById('transactionForm').reset();
        initializeDate();
        initializeCategories();
        updateEnvelopeSelect();
        updateAccountSelect();
        
        console.log('✅ ========================================');
        console.log('✅ Proceso completado exitosamente');
        console.log('✅ ========================================');
        
    } catch (error) {
        console.error('❌ ========================================');
        console.error('❌ ERROR COMPLETO al agregar transacción:');
        console.error('❌ Error name:', error.name);
        console.error('❌ Error message:', error.message);
        console.error('❌ Error stack:', error.stack);
        if (error.response) {
            console.error('❌ Error response:', error.response);
        }
        console.error('❌ ========================================');
        
        let errorMsg = 'Error al crear transacción';
        if (error.message) {
            errorMsg = error.message;
        } else if (error.response && error.response.error) {
            errorMsg = error.response.error;
        }
        
        alert('Error al agregar transacción:\n\n' + errorMsg + '\n\nRevisa la consola para más detalles.');
    }
}

// Agregar sobre
async function addEnvelope() {
    const name = document.getElementById('envelopeName').value;
    const budget = parseFloat(document.getElementById('envelopeBudget').value);
    
    try {
        const envelope = await apiRequest('/envelopes', {
            method: 'POST',
            body: JSON.stringify({ name, budget })
        });
        
        envelopes.push(envelope);
        updateDisplay();
        document.getElementById('envelopeForm').reset();
        updateEnvelopeSelect();
    } catch (error) {
        alert('Error al crear sobre: ' + error.message);
    }
}

// Actualizar visualización
function updateDisplay() {
    try {
        updateSummary();
        updateTransactionsTable();
        updateEnvelopes();
        updateEnvelopeSelect();
        updateAccountSelect(); // Actualizar selector de cuentas
        updateInvestmentSelect(); // Actualizar selector de inversiones
        updatePropertySelect(); // Actualizar selector de propiedades
        updateLoans();
        updateInvestments();
        updateBudgets(); // Asegurar que los presupuestos se actualicen
        updateProperties(); // Actualizar propiedades
        updateAssets(); // Actualizar patrimonio
        updateMonthFilter();
        updateMonthDashboard();
        
        // Actualizar filtros de gráficos
        updateChartFilters();
        
        // Actualizar gráficas siempre (no solo cuando el tab está activo)
        updateCharts();
    } catch (error) {
        console.error('Error en updateDisplay:', error);
    }
}

// Actualizar resumen
async function updateSummary() {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    // Cargar meta de ahorro desde el perfil del usuario
    try {
        const profileData = await apiRequest('/user/profile');
        if (profileData && profileData.savingsGoal !== undefined) {
            savingsGoal = profileData.savingsGoal;
        }
    } catch (error) {
        console.warn('No se pudo cargar la meta de ahorro:', error);
    }
    
    // Obtener año seleccionado si aplica
    const summaryYearInput = document.getElementById('summaryYear');
    let selectedYear = currentYear;
    if (summaryYearInput && summaryPeriod === 'year-select') {
        selectedYear = parseInt(summaryYearInput.value) || currentYear;
    }
    
    const monthTransactions = transactions.filter(t => {
        const tDate = new Date(t.date);
        return tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear;
    });
    
    // Transacciones del año (actual o seleccionado)
    const yearTransactions = transactions.filter(t => {
        const tDate = new Date(t.date);
        return tDate.getFullYear() === selectedYear;
    });
    
    // Cálculos del mes
    // Balance total = transacciones + valor actual de inversiones - capital restante de préstamos
    const transactionsBalance = transactions.reduce((sum, t) => sum + t.amount, 0);
    const investmentsValue = investments.reduce((sum, inv) => sum + inv.current_value, 0);
    const loansDebt = loans.filter(l => l.type === 'debt').reduce((sum, loan) => {
        const amortization = calculateAmortizationTable(
            loan.principal,
            loan.interest_rate,
            loan.monthly_payment,
            loan.start_date,
            loan.total_paid || 0,
            loan.early_payments || []
        );
        return sum + amortization.finalBalance;
    }, 0);
    const loansCredit = loans.filter(l => l.type === 'credit').reduce((sum, loan) => {
        const amortization = calculateAmortizationTable(
            loan.principal,
            loan.interest_rate,
            loan.monthly_payment,
            loan.start_date,
            loan.total_paid || 0,
            loan.early_payments || []
        );
        return sum + amortization.finalBalance;
    }, 0);
    const assetsValue = assets.reduce((sum, asset) => sum + (asset.current_value || 0), 0);
    const totalBalance = transactionsBalance + investmentsValue + loansCredit - loansDebt + assetsValue;
    // Calcular según período seleccionado
    let periodIncome, periodExpenses, periodSavings, periodLabel;
    
    if (summaryPeriod === 'month') {
        periodIncome = monthTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
        periodExpenses = Math.abs(monthTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0));
        periodSavings = periodIncome - periodExpenses;
        periodLabel = 'Este mes';
    } else if (summaryPeriod === 'year') {
        // Usar año actual cuando se selecciona "Este Año"
        const yearForCalculation = currentYear;
        const yearTransactionsForPeriod = transactions.filter(t => {
            const tDate = new Date(t.date);
            return tDate.getFullYear() === yearForCalculation;
        });
        periodIncome = yearTransactionsForPeriod.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
        periodExpenses = Math.abs(yearTransactionsForPeriod.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0));
        periodSavings = periodIncome - periodExpenses;
        periodLabel = 'Este año';
    } else if (summaryPeriod === 'year-select') {
        // Usar año seleccionado cuando se selecciona "Año Específico"
        periodIncome = yearTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
        periodExpenses = Math.abs(yearTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0));
        periodSavings = periodIncome - periodExpenses;
        periodLabel = `Año ${selectedYear}`;
    } else { // 'all'
        periodIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
        periodExpenses = Math.abs(transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0));
        periodSavings = periodIncome - periodExpenses;
        periodLabel = 'Todos los tiempos';
    }
    
    // Actualizar elementos según período
    const totalBalanceEl = document.getElementById('totalBalance');
    const totalBalancePeriodEl = document.getElementById('totalBalancePeriod');
    const periodIncomeEl = document.getElementById('periodIncome');
    const periodIncomeLabelEl = document.getElementById('periodIncomeLabel');
    const periodIncomeSubLabelEl = document.getElementById('periodIncomeSubLabel');
    const periodExpensesEl = document.getElementById('periodExpenses');
    const periodExpensesLabelEl = document.getElementById('periodExpensesLabel');
    const periodExpensesSubLabelEl = document.getElementById('periodExpensesSubLabel');
    const periodSavingsEl = document.getElementById('periodSavings');
    const periodSavingsLabelEl = document.getElementById('periodSavingsLabel');
    const periodSavingsSubLabelEl = document.getElementById('periodSavingsSubLabel');
    
    // Calcular saldo total de cuentas
    const totalAccountsBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
    
    if (totalBalanceEl) totalBalanceEl.textContent = formatCurrency(totalBalance);
    if (totalBalancePeriodEl) totalBalancePeriodEl.textContent = 'Todos los tiempos';
    
    // Actualizar saldo de cuentas en el resumen
    const totalAccountsBalanceEl = document.getElementById('totalAccountsBalance');
    if (totalAccountsBalanceEl) {
        totalAccountsBalanceEl.textContent = formatCurrency(totalAccountsBalance);
    }
    
    if (periodIncomeEl) periodIncomeEl.textContent = formatCurrency(periodIncome);
    if (periodIncomeLabelEl) periodIncomeLabelEl.textContent = `Ingresos ${periodLabel}`;
    if (periodIncomeSubLabelEl) periodIncomeSubLabelEl.textContent = periodLabel;
    
    if (periodExpensesEl) periodExpensesEl.textContent = formatCurrency(periodExpenses);
    if (periodExpensesLabelEl) periodExpensesLabelEl.textContent = `Gastos ${periodLabel}`;
    if (periodExpensesSubLabelEl) periodExpensesSubLabelEl.textContent = periodLabel;
    
    if (periodSavingsEl) {
        periodSavingsEl.textContent = formatCurrency(periodSavings);
        periodSavingsEl.className = periodSavings >= 0 ? 'amount positive' : 'amount negative';
    }
    if (periodSavingsLabelEl) periodSavingsLabelEl.textContent = `Ahorro ${periodLabel}`;
    if (periodSavingsSubLabelEl) periodSavingsSubLabelEl.textContent = periodLabel;
    
    // Actualizar meta de ahorro
    const savingsGoalEl = document.getElementById('savingsGoal');
    if (savingsGoalEl) {
        if (savingsGoal) {
            const progress = (totalBalance / savingsGoal) * 100;
            savingsGoalEl.textContent = `${formatCurrency(totalBalance)} / ${formatCurrency(savingsGoal)}`;
            savingsGoalEl.style.fontSize = '14px';
            if (progress >= 100) {
                savingsGoalEl.style.color = '#10b981';
                savingsGoalEl.textContent += ' ✅ ¡Meta alcanzada!';
            } else {
                savingsGoalEl.style.color = '#fbbf24';
            }
        } else {
            savingsGoalEl.textContent = 'Sin meta';
        }
    }
}

// Actualizar tabla de transacciones
function updateTransactionsTable() {
    const tbody = document.getElementById('transactionsBody');
    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
    const filterCategory = document.getElementById('filterCategory')?.value || '';
    const filterMonth = document.getElementById('filterMonth')?.value || '';
    
    let filtered = transactions;
    
    if (searchTerm) {
        filtered = filtered.filter(t => 
            (t.description || '').toLowerCase().includes(searchTerm) ||
            (t.categorySpecific || '').toLowerCase().includes(searchTerm)
        );
    }
    
    if (filterCategory) {
        filtered = filtered.filter(t => t.categoryGeneral === filterCategory);
    }
    
    if (filterMonth) {
        filtered = filtered.filter(t => {
            const tDate = new Date(t.date);
            return `${tDate.getFullYear()}-${String(tDate.getMonth() + 1).padStart(2, '0')}` === filterMonth;
        });
    }
    
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" style="text-align: center; padding: 40px; color: #999;">No hay transacciones registradas</td></tr>';
        return;
    }
    
    filtered.forEach(transaction => {
        const row = document.createElement('tr');
        const date = new Date(transaction.date);
        
        // Buscar nombre de categoría (predefinida o personalizada)
        let categoryName = transaction.categoryGeneral;
        if (transaction.type === 'expense') {
            const expenseCat = categories.expense.find(c => c.id === transaction.categoryGeneral);
            if (expenseCat) {
                categoryName = expenseCat.name;
            } else {
                const customCat = customCategories.expense.find(c => c.id === transaction.categoryGeneral);
                categoryName = customCat ? customCat.name : transaction.categoryGeneral;
            }
        } else {
            const incomeCat = categories.income.find(c => c.id === transaction.categoryGeneral);
            if (incomeCat) {
                categoryName = incomeCat.name;
            } else {
                const customCat = customCategories.income.find(c => c.id === transaction.categoryGeneral);
                categoryName = customCat ? customCat.name : transaction.categoryGeneral;
            }
        }
        
        // Buscar nombre de cuenta
        let accountName = '-';
        if (transaction.account_id) {
            const account = accounts.find(a => (a._id || a.id) === transaction.account_id);
            accountName = account ? account.name : '-';
        }
        
        // Buscar nombre de propiedad
        let propertyName = '-';
        if (transaction.property_id) {
            const property = properties.find(p => (p._id || p.id) === transaction.property_id);
            propertyName = property ? property.name : '-';
        }
        
        row.innerHTML = `
            <td>${formatDate(date)}</td>
            <td><span class="badge badge-${transaction.type}">${transaction.type === 'income' ? 'Ingreso' : 'Gasto'}</span></td>
            <td>${categoryName} - ${transaction.categorySpecific}</td>
            <td>${transaction.description || '-'}</td>
            <td>${accountName}</td>
            <td>${propertyName}</td>
            <td>${transaction.envelope || '-'}</td>
            <td style="font-weight: 600; color: ${transaction.amount >= 0 ? '#10b981' : '#ef4444'}">${formatCurrency(transaction.amount)}</td>
            <td><button class="btn-danger" onclick="deleteTransaction('${transaction._id || transaction.id}')">Eliminar</button></td>
        `;
        tbody.appendChild(row);
    });
}

// Actualizar sobres
function updateEnvelopes() {
    const grid = document.getElementById('envelopesGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    if (envelopes.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 40px; color: #999;">No hay sobres creados</p>';
        return;
    }
    
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    envelopes.forEach(envelope => {
        const monthTransactions = transactions.filter(t => {
            const tDate = new Date(t.date);
            return t.envelope === envelope.name &&
                   t.type === 'expense' &&
                   tDate.getMonth() === currentMonth &&
                   tDate.getFullYear() === currentYear;
        });
        
        const spent = Math.abs(monthTransactions.reduce((sum, t) => sum + t.amount, 0));
        const remaining = envelope.budget - spent;
        const percentage = (spent / envelope.budget) * 100;
        
        const card = document.createElement('div');
        card.className = 'envelope-card';
        card.innerHTML = `
            <h3>${envelope.name}</h3>
            <div class="envelope-budget">${formatCurrency(envelope.budget)}</div>
            <div class="envelope-spent">Gastado: ${formatCurrency(spent)}</div>
            <div class="envelope-remaining ${remaining < 0 ? 'negative' : ''}">
                Restante: ${formatCurrency(remaining)}
            </div>
            <div class="envelope-progress">
                <div class="envelope-progress-bar" style="width: ${Math.min(percentage, 100)}%"></div>
            </div>
            <div class="envelope-actions">
                <button class="btn-danger" onclick="deleteEnvelope('${envelope._id || envelope.id}')">Eliminar</button>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Actualizar selector de sobres
function updateEnvelopeSelect() {
    const select = document.getElementById('envelope');
    if (!select) return;
    
    select.innerHTML = '<option value="">Ninguno</option>';
    envelopes.forEach(envelope => {
        const option = document.createElement('option');
        option.value = envelope.name;
        option.textContent = envelope.name;
        select.appendChild(option);
    });
}

// Actualizar selector de cuentas bancarias
function updateAccountSelect() {
    const select = document.getElementById('transactionAccount');
    if (!select) return;
    
    select.innerHTML = '<option value="">Ninguna</option>';
    accounts.forEach(account => {
        const option = document.createElement('option');
        option.value = account._id || account.id;
        option.textContent = `${account.name}${account.bank ? ` (${account.bank})` : ''}`;
        select.appendChild(option);
    });
}

// Actualizar selector de inversiones
function updateInvestmentSelect() {
    const select = document.getElementById('transactionInvestment');
    if (!select) return;
    
    select.innerHTML = '<option value="">Ninguna</option>';
    investments.forEach(investment => {
        const option = document.createElement('option');
        option.value = investment._id || investment.id;
        option.textContent = investment.name;
        select.appendChild(option);
    });
}

// Actualizar selector de propiedades
function updatePropertySelect() {
    const select = document.getElementById('transactionProperty');
    if (!select) return;
    
    select.innerHTML = '<option value="">Ninguna</option>';
    properties.forEach(property => {
        const option = document.createElement('option');
        option.value = property._id || property.id;
        option.textContent = property.name;
        select.appendChild(option);
    });
}

// ==================== PRESUPUESTOS ====================

// Agregar presupuesto
async function addBudget() {
    const category_id = document.getElementById('budgetCategory').value;
    const amount = parseFloat(document.getElementById('budgetAmount').value);
    const period_type = document.getElementById('budgetPeriodType').value;
    const period_value = document.getElementById('budgetPeriodValue').value;
    const duration = period_type === 'monthly' ? parseInt(document.getElementById('budgetDuration')?.value || '1') : 1;
    
    if (!category_id || !amount || !period_type || !period_value) {
        alert('Por favor completa todos los campos');
        return;
    }
    
    if (isNaN(amount) || amount <= 0) {
        alert('El monto debe ser un número positivo');
        return;
    }
    
    try {
        // Si es mensual, crear presupuestos según la duración
        if (period_type === 'monthly') {
            if (duration === 0) {
                // Duración indefinida: crear presupuesto solo para el mes inicial
                const budget = await apiRequest('/budgets', {
                    method: 'POST',
                    body: JSON.stringify({
                        category_id,
                        amount,
                        period_type,
                        period_value
                    })
                });
                
                await loadUserData();
                updateDisplay();
                
                alert(`✅ Presupuesto mensual establecido indefinidamente desde ${period_value}`);
            } else {
                // Duración específica: crear múltiples presupuestos
                const startDate = new Date(period_value + '-01');
                const budgetsCreated = [];
                
                for (let i = 0; i < duration; i++) {
                    const currentDate = new Date(startDate);
                    currentDate.setMonth(startDate.getMonth() + i);
                    const monthValue = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
                    
                    try {
                        const budget = await apiRequest('/budgets', {
                            method: 'POST',
                            body: JSON.stringify({
                                category_id,
                                amount,
                                period_type,
                                period_value: monthValue
                            })
                        });
                        budgetsCreated.push(monthValue);
                    } catch (error) {
                        console.error(`Error creando presupuesto para ${monthValue}:`, error);
                        alert(`Error al crear presupuesto para ${monthValue}: ${error.message}`);
                    }
                }
                
                await loadUserData();
                updateDisplay();
                
                alert(`✅ Presupuesto establecido para ${budgetsCreated.length} mes(es) exitosamente`);
            }
            
            // Resetear formulario
            const budgetForm = document.getElementById('budgetForm');
            if (budgetForm) {
                budgetForm.reset();
                const budgetPeriodType = document.getElementById('budgetPeriodType');
                if (budgetPeriodType) budgetPeriodType.value = 'monthly';
                const budgetPeriodValue = document.getElementById('budgetPeriodValue');
                if (budgetPeriodValue) {
                    const now = new Date();
                    budgetPeriodValue.value = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
                }
                const budgetDuration = document.getElementById('budgetDuration');
                if (budgetDuration) budgetDuration.value = '1';
            }
        } else {
            // Para otros tipos de período o duración 0 (indefinido), crear uno solo
            const budget = await apiRequest('/budgets', {
                method: 'POST',
                body: JSON.stringify({
                    category_id,
                    amount,
                    period_type,
                    period_value
                })
            });
            
            await loadUserData();
            updateDisplay();
            
            // Resetear formulario
            const budgetForm = document.getElementById('budgetForm');
            if (budgetForm) {
                budgetForm.reset();
                const budgetPeriodType = document.getElementById('budgetPeriodType');
                if (budgetPeriodType) budgetPeriodType.value = 'monthly';
                const budgetPeriodValue = document.getElementById('budgetPeriodValue');
                if (budgetPeriodValue) {
                    const now = new Date();
                    budgetPeriodValue.value = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
                }
            }
            
            alert('✅ Presupuesto establecido exitosamente');
        }
    } catch (error) {
        alert('Error al establecer presupuesto: ' + error.message);
    }
}

// Función auxiliar para obtener el lunes de la semana
function getWeekStartDate(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Ajustar al lunes
    const monday = new Date(d.setDate(diff));
    return monday.toISOString().split('T')[0];
}

// Actualizar presupuestos
function updateBudgets() {
    const grid = document.getElementById('budgetsGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const currentYear = now.getFullYear().toString();
    const currentWeek = getWeekStartDate(now);
    
    // Filtrar presupuestos activos (del período actual)
    const activeBudgets = budgets.filter(b => {
        if (b.period_type === 'monthly') {
            return b.period_value === currentMonth;
        } else if (b.period_type === 'yearly') {
            return b.period_value === currentYear;
        } else if (b.period_type === 'weekly') {
            return b.period_value === currentWeek;
        }
        return false;
    });
    
    if (activeBudgets.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--gray-500);">No hay presupuestos activos para el período actual</p>';
        return;
    }
    
    // Calcular transacciones por categoría según período (ingresos y gastos)
    const transactionsByCategory = {};
    transactions.forEach(t => {
        const tDate = new Date(t.date);
        
        // Verificar si la transacción está en algún período activo
        const isInActivePeriod = activeBudgets.some(b => {
            if (b.period_type === 'monthly') {
                return tDate.toISOString().startsWith(b.period_value);
            } else if (b.period_type === 'yearly') {
                return tDate.getFullYear().toString() === b.period_value;
            } else if (b.period_type === 'weekly') {
                const weekStart = new Date(b.period_value);
                const weekEnd = new Date(weekStart);
                weekEnd.setDate(weekEnd.getDate() + 6);
                return tDate >= weekStart && tDate <= weekEnd;
            }
            return false;
        });
        
        if (isInActivePeriod) {
            const catId = t.categoryGeneral;
            if (!transactionsByCategory[catId]) {
                transactionsByCategory[catId] = { income: 0, expense: 0 };
            }
            if (t.type === 'income') {
                transactionsByCategory[catId].income += t.amount;
            } else {
                transactionsByCategory[catId].expense += Math.abs(t.amount);
            }
        }
    });
    
    activeBudgets.forEach(budget => {
        // Determinar si es presupuesto de ingreso o gasto buscando en ambas categorías
        let category = categories.expense.find(c => c.id === budget.category_id) || 
                      customCategories.expense.find(c => c.id === budget.category_id);
        let isIncome = false;
        
        if (!category) {
            category = categories.income.find(c => c.id === budget.category_id) || 
                      customCategories.income.find(c => c.id === budget.category_id);
            isIncome = true;
        }
        
        const categoryName = category ? category.name : budget.category_id;
        const actual = isIncome ? 
            (transactionsByCategory[budget.category_id]?.income || 0) : 
            (transactionsByCategory[budget.category_id]?.expense || 0);
        const difference = isIncome ? (actual - budget.amount) : (budget.amount - actual);
        const percentage = budget.amount > 0 ? (actual / budget.amount) * 100 : 0;
        const isOverBudget = isIncome ? (actual < budget.amount) : (actual > budget.amount);
        
        // Obtener etiqueta del período
        let periodLabel = '';
        if (budget.period_type === 'weekly') {
            periodLabel = 'Semanal';
        } else if (budget.period_type === 'monthly') {
            periodLabel = 'Mensual';
        } else if (budget.period_type === 'yearly') {
            periodLabel = 'Anual';
        }
        
        const card = document.createElement('div');
        card.className = 'envelope-card';
        card.style.borderLeft = `4px solid ${isOverBudget ? 'var(--danger)' : percentage > 80 ? 'var(--warning)' : 'var(--success)'}`;
        card.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 12px;">
                <h3 style="margin: 0;">${categoryName}</h3>
                <span style="font-size: 11px; padding: 4px 8px; background: var(--gray-100); border-radius: var(--radius); color: var(--gray-700); font-weight: 600;">${periodLabel}</span>
            </div>
            <div style="margin: 12px 0;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span style="font-size: 13px; color: var(--gray-600);">Presupuesto:</span>
                    <span style="font-weight: 600; color: var(--gray-900);">${formatCurrency(budget.amount)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span style="font-size: 13px; color: var(--gray-600);">${isIncome ? 'Ingresado:' : 'Gastado:'}</span>
                    <span style="font-weight: 600; color: ${isOverBudget ? 'var(--danger)' : 'var(--gray-900)'};">${formatCurrency(actual)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                    <span style="font-size: 13px; color: var(--gray-600);">${isIncome ? 'Falta:' : 'Restante:'}</span>
                    <span style="font-weight: 700; font-size: 16px; color: ${difference >= 0 ? 'var(--success)' : 'var(--danger)'};">
                        ${formatCurrency(Math.abs(difference))}
                    </span>
                </div>
            </div>
            <div style="margin: 12px 0;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                    <span style="font-size: 12px; color: var(--gray-600);">Progreso:</span>
                    <span style="font-size: 12px; font-weight: 600; color: ${isOverBudget ? 'var(--danger)' : percentage > 80 ? 'var(--warning)' : 'var(--gray-700)'};">
                        ${percentage.toFixed(1)}%
                    </span>
                </div>
                <div class="envelope-progress">
                    <div class="envelope-progress-bar" style="width: ${Math.min(percentage, 100)}%; background: ${isOverBudget ? 'var(--danger)' : percentage > 80 ? 'var(--warning)' : 'var(--success)'};"></div>
                </div>
            </div>
            ${isOverBudget ? `<div style="padding: 8px; background: #FEE2E2; border-radius: var(--radius); color: var(--danger); font-size: 12px; font-weight: 600; margin-top: 8px;">⚠️ ${isIncome ? 'Por debajo del presupuesto' : 'Presupuesto excedido'}</div>` : ''}
            <div style="margin-top: 8px; padding: 6px; background: ${isIncome ? 'var(--success-light)' : 'var(--gray-50)'}; border-radius: var(--radius); font-size: 11px; color: var(--gray-700);">
                ${isIncome ? '💰 Ingreso' : '💸 Gasto'}
            </div>
            <div class="envelope-actions" style="margin-top: 12px;">
                <button class="btn-danger" onclick="deleteBudget('${budget._id || budget.id}')" style="width: 100%;">Eliminar</button>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Eliminar presupuesto
async function deleteBudget(id) {
    if (!confirm('¿Estás seguro de eliminar este presupuesto?')) return;
    
    try {
        await apiRequest(`/budgets/${id}`, { method: 'DELETE' });
        await loadUserData();
        updateDisplay();
    } catch (error) {
        alert('Error al eliminar presupuesto: ' + error.message);
    }
}

// Exponer función global
window.deleteBudget = deleteBudget;

// Actualizar filtro de meses
function updateMonthFilter() {
    const select = document.getElementById('filterMonth');
    if (!select) return;
    
    const months = new Set();
    
    transactions.forEach(t => {
        const date = new Date(t.date);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        months.add(monthKey);
    });
    
    const sortedMonths = Array.from(months).sort().reverse();
    select.innerHTML = '<option value="">Todos los meses</option>';
    
    sortedMonths.forEach(month => {
        const [year, monthNum] = month.split('-');
        const date = new Date(year, parseInt(monthNum) - 1);
        const option = document.createElement('option');
        option.value = month;
        option.textContent = date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long' });
        select.appendChild(option);
    });
}

// Eliminar transacción
async function deleteTransaction(id) {
    const confirmed = await showConfirm(
        'Eliminar Transacción',
        '¿Estás seguro de eliminar esta transacción? Esta acción no se puede deshacer.',
        'Eliminar',
        'Cancelar'
    );
    if (!confirmed) return;
    
    try {
        showLoader('Eliminando transacción...');
        await apiRequest(`/transactions/${id}`, { method: 'DELETE' });
        await loadUserData();
        updateDisplay();
        hideLoader();
        showToast('Transacción eliminada exitosamente', 'success');
    } catch (error) {
        hideLoader();
        showToast('Error al eliminar transacción: ' + error.message, 'error');
    }
}

// Exponer funciones al scope global para onclick handlers
window.deleteTransaction = deleteTransaction;

// Eliminar sobre
async function deleteEnvelope(id) {
    if (!confirm('¿Estás seguro de eliminar este sobre? Esto no eliminará las transacciones asociadas.')) return;
    
    try {
        await apiRequest(`/envelopes/${id}`, { method: 'DELETE' });
        // Recargar datos desde el servidor
        await loadUserData();
        updateDisplay();
    } catch (error) {
        console.error('Error eliminando sobre:', error);
        alert('Error al eliminar sobre: ' + (error.message || 'Error desconocido'));
    }
}

// Exponer funciones al scope global para onclick handlers
window.deleteEnvelope = deleteEnvelope;

// Agregar préstamo
// Calcular cuota mensual usando fórmula de amortización francesa
function calculateMonthlyPayment(principal, annualRate, months) {
    if (annualRate === 0) return principal / months;
    if (months <= 0) return 0;
    const monthlyRate = annualRate / 100 / 12;
    const denominator = Math.pow(1 + monthlyRate, months) - 1;
    if (denominator === 0) return principal / months;
    return principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) / denominator;
}

// Exponer función globalmente
window.calculateMonthlyPayment = calculateMonthlyPayment;

// Calcular tabla de amortización
function calculateAmortizationTable(principal, annualRate, monthlyPayment, startDate, totalPaid = 0, earlyPayments = []) {
    const monthlyRate = annualRate / 100 / 12;
    let balance = principal;
    let totalInterest = 0;
    const table = [];
    const start = new Date(startDate);
    let currentDate = new Date(start);
    
    // Aplicar pagos anticipados
    earlyPayments.forEach(ep => {
        balance -= ep.amount;
        totalInterest += ep.commission || 0;
    });
    
    // Restar lo ya pagado
    balance -= totalPaid;
    
    let month = 0;
    while (balance > 0.01 && month < 600) { // Máximo 50 años
        month++;
        currentDate.setMonth(currentDate.getMonth() + 1);
        
        const interest = balance * monthlyRate;
        const principalPayment = Math.min(monthlyPayment - interest, balance);
        balance -= principalPayment;
        totalInterest += interest;
        
        table.push({
            month,
            date: new Date(currentDate),
            payment: monthlyPayment,
            principal: principalPayment,
            interest,
            balance: Math.max(0, balance)
        });
    }
    
    return { table, totalInterest, finalBalance: balance };
}

async function addLoan() {
    const name = document.getElementById('loanName').value.trim();
    const principal = parseFloat(document.getElementById('loanPrincipal').value);
    const interestRate = parseFloat(document.getElementById('loanInterestRate').value);
    const tae = document.getElementById('loanTAE').value ? parseFloat(document.getElementById('loanTAE').value) : null;
    const startDate = document.getElementById('loanStartDate').value;
    const endDate = document.getElementById('loanEndDate').value;
    const monthlyPayment = parseFloat(document.getElementById('loanMonthlyPayment').value);
    const type = document.getElementById('loanType').value;
    const description = document.getElementById('loanDescription').value.trim();
    const openingCommission = parseFloat(document.getElementById('loanOpeningCommission').value) || 0;
    const earlyPaymentCommission = parseFloat(document.getElementById('loanEarlyPaymentCommission').value) || 0;
    const paymentDay = parseInt(document.getElementById('loanPaymentDay').value) || 1;
    
    if (!name || !principal || !interestRate || !startDate || !endDate || !monthlyPayment || !type) {
        alert('Por favor completa todos los campos requeridos');
        return;
    }
    
    try {
        const loan = await apiRequest('/loans', {
            method: 'POST',
            body: JSON.stringify({
                name,
                principal,
                interest_rate: interestRate,
                tae: tae,
                start_date: startDate,
                end_date: endDate,
                monthly_payment: monthlyPayment,
                type,
                description: description || null,
                opening_commission: openingCommission,
                early_payment_commission: earlyPaymentCommission,
                payment_day: paymentDay
            })
        });
        
        loans.push(loan);
        updateDisplay();
        document.getElementById('loanForm').reset();
        const loanStartDate = document.getElementById('loanStartDate');
        if (loanStartDate) {
            const today = new Date().toISOString().split('T')[0];
            loanStartDate.value = today;
        }
        alert('✅ Préstamo agregado exitosamente');
    } catch (error) {
        alert('Error al crear préstamo: ' + error.message);
    }
}

// Actualizar préstamos con cálculos avanzados
function updateLoans() {
    const grid = document.getElementById('loansGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    if (loans.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 40px; color: #999;">No hay préstamos registrados</p>';
        return;
    }
    
    loans.forEach(loan => {
        const startDate = new Date(loan.start_date);
        const endDate = new Date(loan.end_date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Calcular meses
        const totalMonths = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24 * 30.44));
        const monthsElapsed = Math.max(0, Math.floor((today - startDate) / (1000 * 60 * 60 * 24 * 30.44)));
        const monthsRemaining = Math.max(0, Math.ceil((endDate - today) / (1000 * 60 * 60 * 24 * 30.44)));
        
        // Calcular amortización
        const amortization = calculateAmortizationTable(
            loan.principal,
            loan.interest_rate,
            loan.monthly_payment,
            loan.start_date,
            loan.total_paid || 0,
            loan.early_payments || []
        );
        
        // Calcular totales
        const totalPaid = (loan.total_paid || 0) + (loan.early_payments || []).reduce((sum, ep) => sum + ep.amount + (ep.commission || 0), 0);
        const remainingPrincipal = amortization.finalBalance;
        const totalInterestPaid = amortization.totalInterest;
        
        // Calcular costo real usando TAE si está disponible, sino TIN
        const effectiveRate = loan.tae || loan.interest_rate;
        const monthlyEffectiveRate = effectiveRate / 100 / 12;
        
        // Calcular interés total proyectado con TAE
        let totalInterestProjected = 0;
        let testBalance = loan.principal;
        for (let i = 0; i < totalMonths && testBalance > 0.01; i++) {
            const interest = testBalance * monthlyEffectiveRate;
            const principalPayment = Math.min(loan.monthly_payment - interest, testBalance);
            testBalance -= principalPayment;
            totalInterestProjected += interest;
        }
        
        const totalAmount = loan.principal + totalInterestProjected + (loan.opening_commission || 0);
        const totalCommissions = (loan.opening_commission || 0) + (loan.early_payments || []).reduce((sum, ep) => sum + (ep.commission || 0), 0);
        const realCost = totalInterestProjected + totalCommissions; // Costo real del préstamo
        const totalCost = totalAmount - loan.principal; // Costo total (intereses + comisiones)
        
        // Calcular próximo pago
        const nextPaymentDate = new Date(startDate);
        nextPaymentDate.setMonth(nextPaymentDate.getMonth() + monthsElapsed + 1);
        nextPaymentDate.setDate(loan.payment_day || 1);
        
        const card = document.createElement('div');
        card.className = 'envelope-card';
        card.style.border = loan.type === 'debt' ? '2px solid #ef4444' : '2px solid #10b981';
        card.style.position = 'relative';
        card.innerHTML = `
            <h3>${loan.name} <span style="font-size: 12px; color: ${loan.type === 'debt' ? '#ef4444' : '#10b981'}">(${loan.type === 'debt' ? 'Debo' : 'Me deben'})</span></h3>
            
            <div style="margin: 10px 0; padding: 12px; background: ${loan.type === 'debt' ? '#fef2f2' : '#f0fdf4'}; border-radius: 6px;">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 13px; margin-bottom: 12px;">
                    <div><strong>Principal:</strong></div>
                    <div style="font-weight: 600;">${formatCurrency(loan.principal)}</div>
                    <div><strong>TIN (Interés Nominal):</strong></div>
                    <div>${loan.interest_rate}%</div>
                    ${loan.tae ? `
                        <div><strong>TAE (Costo Real):</strong></div>
                        <div style="color: ${loan.tae > loan.interest_rate ? '#ef4444' : '#10b981'}; font-weight: 700;">${loan.tae}%</div>
                        <div style="grid-column: 1/-1; font-size: 11px; color: #666; margin-top: 4px; padding: 6px; background: rgba(255,255,255,0.7); border-radius: 4px;">
                            ⚠️ Diferencia: ${(loan.tae - loan.interest_rate).toFixed(2)}% adicional por comisiones y gastos
                        </div>
                    ` : ''}
                    <div><strong>Cuota Mensual:</strong></div>
                    <div style="font-weight: 600;">${formatCurrency(loan.monthly_payment)}</div>
                    ${loan.opening_commission > 0 ? `<div><strong>Com. Apertura:</strong></div><div>${formatCurrency(loan.opening_commission)}</div>` : ''}
                </div>
            </div>
            
            <div style="margin: 10px 0; padding: 12px; background: #f3f4f6; border-radius: 6px;">
                <div style="font-size: 13px; line-height: 1.8;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                        <strong>Capital Restante:</strong>
                        <span style="color: ${remainingPrincipal > 0 ? '#ef4444' : '#10b981'}; font-size: 18px; font-weight: bold;">${formatCurrency(remainingPrincipal)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <strong>Total Pagado:</strong>
                        <span>${formatCurrency(totalPaid)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <strong>Intereses Totales:</strong>
                        <span>${formatCurrency(totalInterestProjected)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <strong>Comisiones Totales:</strong>
                        <span>${formatCurrency(totalCommissions)}</span>
                    </div>
                    <div style="margin-top: 8px; padding: 8px; background: ${loan.type === 'debt' ? '#fee2e2' : '#dcfce7'}; border-radius: 4px; border-left: 3px solid ${loan.type === 'debt' ? '#ef4444' : '#10b981'};">
                        <div style="display: flex; justify-content: space-between; font-weight: 700; margin-bottom: 4px;">
                            <span>💰 Costo Real del Préstamo:</span>
                            <span style="color: ${loan.type === 'debt' ? '#ef4444' : '#10b981'}; font-size: 16px;">${formatCurrency(realCost)}</span>
                        </div>
                        <div style="font-size: 11px; color: #666;">
                            Intereses (${formatCurrency(totalInterestProjected)}) + Comisiones (${formatCurrency(totalCommissions)})
                        </div>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-top: 8px;">
                        <strong>Total a Pagar:</strong>
                        <span style="font-weight: 700;">${formatCurrency(totalAmount)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <strong>Progreso:</strong>
                        <span>${((totalPaid / totalAmount) * 100).toFixed(1)}%</span>
                    </div>
                    <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #ddd;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                            <strong>Meses Transcurridos:</strong>
                            <span>${monthsElapsed} / ${totalMonths}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                            <strong>Meses Restantes:</strong>
                            <span>${monthsRemaining}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <strong>Próximo Pago:</strong>
                            <span>${formatDate(nextPaymentDate)}</span>
                        </div>
                    </div>
                </div>
            </div>
            
            ${loan.early_payments && loan.early_payments.length > 0 ? `
                <div style="margin: 10px 0; padding: 8px; background: #fef3c7; border-radius: 6px; font-size: 12px;">
                    <strong>Amortizaciones Anticipadas:</strong> ${loan.early_payments.length}
                    <div style="margin-top: 4px;">
                        ${loan.early_payments.map(ep => 
                            `${formatDate(new Date(ep.date))}: ${formatCurrency(ep.amount)}${ep.commission > 0 ? ` (+ ${formatCurrency(ep.commission)} comisión)` : ''}`
                        ).join('<br>')}
                    </div>
                </div>
            ` : ''}
            
            ${loan.description ? `<div style="margin: 10px 0; font-size: 12px; color: #666; font-style: italic;">${loan.description}</div>` : ''}
            
            <!-- Cuadro de amortización - Próximas cuotas -->
            <div style="margin: 16px 0; padding: 12px; background: var(--gray-50); border-radius: 6px;">
                <h4 style="font-size: 14px; font-weight: 700; margin-bottom: 12px; color: var(--gray-900);">📅 Próximas Cuotas</h4>
                <div style="max-height: 200px; overflow-y: auto;">
                    <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
                        <thead>
                            <tr style="background: var(--gray-100); border-bottom: 1px solid var(--gray-300);">
                                <th style="padding: 6px; text-align: left; font-weight: 600;">Mes</th>
                                <th style="padding: 6px; text-align: right; font-weight: 600;">Fecha</th>
                                <th style="padding: 6px; text-align: right; font-weight: 600;">Cuota</th>
                                <th style="padding: 6px; text-align: right; font-weight: 600;">Capital</th>
                                <th style="padding: 6px; text-align: right; font-weight: 600;">Interés</th>
                                <th style="padding: 6px; text-align: right; font-weight: 600;">Restante</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${amortization.table.slice(0, 12).map((row, idx) => `
                                <tr style="border-bottom: 1px solid var(--gray-200); ${idx % 2 === 0 ? '' : 'background: white;'}">
                                    <td style="padding: 6px; font-weight: 600;">${row.month}</td>
                                    <td style="padding: 6px; text-align: right; color: var(--gray-700);">${formatDate(row.date)}</td>
                                    <td style="padding: 6px; text-align: right; font-weight: 600;">${formatCurrency(row.payment)}</td>
                                    <td style="padding: 6px; text-align: right; color: var(--success);">${formatCurrency(row.principal)}</td>
                                    <td style="padding: 6px; text-align: right; color: var(--danger);">${formatCurrency(row.interest)}</td>
                                    <td style="padding: 6px; text-align: right; font-weight: 600; color: ${row.balance > 0 ? 'var(--danger)' : 'var(--success)'};">${formatCurrency(row.balance)}</td>
                                </tr>
                            `).join('')}
                            ${amortization.table.length > 12 ? `
                                <tr>
                                    <td colspan="6" style="padding: 8px; text-align: center; color: var(--gray-600); font-size: 11px; font-style: italic;">
                                        ... y ${amortization.table.length - 12} cuota(s) más
                                    </td>
                                </tr>
                            ` : ''}
                        </tbody>
                    </table>
                </div>
                <button onclick="showLoanDetails('${loan._id || loan.id}')" class="btn-secondary" style="width: 100%; margin-top: 12px; font-size: 13px; padding: 8px;">
                    📊 Ver Cuadro de Amortización Completo
                </button>
            </div>
            
            <div class="envelope-actions" style="display: flex; gap: 8px; margin-top: 10px;">
                <button class="btn-secondary" onclick="showLoanDetails('${loan._id || loan.id}')" style="flex: 1;">📊 Detalles</button>
                <button class="btn-secondary" onclick="showEarlyPaymentModal('${loan._id || loan.id}')" style="flex: 1;">💰 Amortizar</button>
                <button class="btn-danger" onclick="deleteLoan('${loan._id || loan.id}')" style="flex: 1;">🗑️ Eliminar</button>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Mostrar detalles del préstamo con tabla de amortización completa
function showLoanDetails(loanId) {
    const loan = loans.find(l => (l._id || l.id) === loanId);
    if (!loan) return;
    
    const amortization = calculateAmortizationTable(
        loan.principal,
        loan.interest_rate,
        loan.monthly_payment,
        loan.start_date,
        loan.total_paid || 0,
        loan.early_payments || []
    );
    
    const modal = document.getElementById('amortizationModal');
    const modalTitle = document.getElementById('amortizationModalTitle');
    const modalContent = document.getElementById('amortizationModalContent');
    
    if (!modal || !modalTitle || !modalContent) return;
    
    // Título del modal
    modalTitle.textContent = `📊 Tabla de Amortización - ${loan.name}`;
    
    // Calcular resumen
    const totalPaid = (loan.total_paid || 0) + (loan.early_payments || []).reduce((sum, ep) => sum + ep.amount + (ep.commission || 0), 0);
    const totalInterest = amortization.totalInterest;
    const totalCommissions = (loan.opening_commission || 0) + (loan.early_payments || []).reduce((sum, ep) => sum + (ep.commission || 0), 0);
    const totalCost = totalInterest + totalCommissions;
    const remainingPrincipal = amortization.finalBalance;
    
    // Crear contenido del modal
    let contentHTML = `
        <div style="margin-bottom: 24px; padding: 16px; background: var(--gray-50); border-radius: var(--radius);">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
                <div>
                    <strong style="color: var(--gray-600); font-size: 12px;">Capital Inicial</strong>
                    <div style="font-size: 18px; font-weight: 700; color: var(--gray-900);">${formatCurrency(loan.principal)}</div>
                </div>
                <div>
                    <strong style="color: var(--gray-600); font-size: 12px;">Capital Restante</strong>
                    <div style="font-size: 18px; font-weight: 700; color: ${remainingPrincipal > 0 ? 'var(--danger)' : 'var(--success)'};">${formatCurrency(remainingPrincipal)}</div>
                </div>
                <div>
                    <strong style="color: var(--gray-600); font-size: 12px;">Total Pagado</strong>
                    <div style="font-size: 18px; font-weight: 700; color: var(--gray-900);">${formatCurrency(totalPaid)}</div>
                </div>
                <div>
                    <strong style="color: var(--gray-600); font-size: 12px;">Intereses Totales</strong>
                    <div style="font-size: 18px; font-weight: 700; color: var(--danger);">${formatCurrency(totalInterest)}</div>
                </div>
                <div>
                    <strong style="color: var(--gray-600); font-size: 12px;">Comisiones Totales</strong>
                    <div style="font-size: 18px; font-weight: 700; color: var(--warning);">${formatCurrency(totalCommissions)}</div>
                </div>
                <div>
                    <strong style="color: var(--gray-600); font-size: 12px;">Costo Total</strong>
                    <div style="font-size: 18px; font-weight: 700; color: var(--danger);">${formatCurrency(totalCost)}</div>
                </div>
            </div>
        </div>
        
        <div style="margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center;">
            <h3 style="margin: 0; font-size: 18px; font-weight: 700;">Cuadro de Amortización Completo</h3>
            <span style="color: var(--gray-600); font-size: 14px;">${amortization.table.length} cuotas</span>
        </div>
        
        <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; background: white; border-radius: var(--radius); overflow: hidden;">
                <thead>
                    <tr style="background: var(--primary); color: white;">
                        <th style="padding: 12px; text-align: left; font-weight: 600; font-size: 13px;">Mes</th>
                        <th style="padding: 12px; text-align: right; font-weight: 600; font-size: 13px;">Fecha</th>
                        <th style="padding: 12px; text-align: right; font-weight: 600; font-size: 13px;">Cuota</th>
                        <th style="padding: 12px; text-align: right; font-weight: 600; font-size: 13px;">Capital</th>
                        <th style="padding: 12px; text-align: right; font-weight: 600; font-size: 13px;">Interés</th>
                        <th style="padding: 12px; text-align: right; font-weight: 600; font-size: 13px;">Capital Restante</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    amortization.table.forEach((row, index) => {
        const isEven = index % 2 === 0;
        contentHTML += `
            <tr style="border-bottom: 1px solid var(--gray-200); background: ${isEven ? 'white' : 'var(--gray-50)'};">
                <td style="padding: 10px; font-weight: 600; color: var(--gray-900);">${row.month}</td>
                <td style="padding: 10px; text-align: right; color: var(--gray-700);">${formatDate(row.date)}</td>
                <td style="padding: 10px; text-align: right; font-weight: 600; color: var(--gray-900);">${formatCurrency(row.payment)}</td>
                <td style="padding: 10px; text-align: right; color: var(--success);">${formatCurrency(row.principal)}</td>
                <td style="padding: 10px; text-align: right; color: var(--danger);">${formatCurrency(row.interest)}</td>
                <td style="padding: 10px; text-align: right; font-weight: 600; color: ${row.balance > 0 ? 'var(--danger)' : 'var(--success)'};">${formatCurrency(row.balance)}</td>
            </tr>
        `;
    });
    
    contentHTML += `
                </tbody>
                <tfoot style="background: var(--gray-100); font-weight: 700;">
                    <tr>
                        <td colspan="2" style="padding: 12px; text-align: left;">TOTALES</td>
                        <td style="padding: 12px; text-align: right;">${formatCurrency(amortization.table.reduce((sum, r) => sum + r.payment, 0))}</td>
                        <td style="padding: 12px; text-align: right; color: var(--success);">${formatCurrency(loan.principal - remainingPrincipal)}</td>
                        <td style="padding: 12px; text-align: right; color: var(--danger);">${formatCurrency(totalInterest)}</td>
                        <td style="padding: 12px; text-align: right; color: ${remainingPrincipal > 0 ? 'var(--danger)' : 'var(--success)'};">${formatCurrency(remainingPrincipal)}</td>
                    </tr>
                </tfoot>
            </table>
        </div>
    `;
    
    modalContent.innerHTML = contentHTML;
    modal.style.display = 'flex';
    
    // Asegurar que los event listeners estén activos
    const closeBtn = document.getElementById('closeAmortizationModal');
    if (closeBtn) {
        // Remover listeners anteriores para evitar duplicados
        const newCloseBtn = closeBtn.cloneNode(true);
        closeBtn.parentNode.replaceChild(newCloseBtn, closeBtn);
        
        newCloseBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }
    
    // Cerrar al hacer clic fuera del modal
    modal.onclick = (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    };
}

// Mostrar modal de amortización anticipada
function showEarlyPaymentModal(loanId) {
    const loan = loans.find(l => (l._id || l.id) === loanId);
    if (!loan) return;
    
    const modal = document.getElementById('earlyPaymentModal');
    const loanInfo = document.getElementById('earlyPaymentLoanInfo');
    const form = document.getElementById('earlyPaymentForm');
    const amountInput = document.getElementById('earlyPaymentAmount');
    const commissionInfo = document.getElementById('earlyPaymentCommissionInfo');
    const commissionAmount = document.getElementById('earlyPaymentCommissionAmount');
    
    if (!modal || !loanInfo || !form || !amountInput) return;
    
    // Calcular capital restante
    const amortization = calculateAmortizationTable(
        loan.principal,
        loan.interest_rate,
        loan.monthly_payment,
        loan.start_date,
        loan.total_paid || 0,
        loan.early_payments || []
    );
    const remainingCapital = amortization.finalBalance;
    
    // Mostrar información del préstamo
    loanInfo.innerHTML = `
        <div style="margin-bottom: 8px;">
            <strong style="color: var(--gray-700);">Préstamo:</strong> 
            <span style="font-weight: 700; color: var(--gray-900);">${loan.name}</span>
        </div>
        <div>
            <strong style="color: var(--gray-700);">Capital Restante:</strong> 
            <span style="font-weight: 700; color: ${remainingCapital > 0 ? 'var(--danger)' : 'var(--success)'}; font-size: 18px;">${formatCurrency(remainingCapital)}</span>
        </div>
    `;
    
    // Resetear formulario
    form.reset();
    if (commissionInfo) commissionInfo.style.display = 'none';
    
    // Remover listeners anteriores
    const newForm = form.cloneNode(true);
    form.parentNode.replaceChild(newForm, form);
    
    // Obtener referencias nuevas después del clonado
    const updatedForm = document.getElementById('earlyPaymentForm');
    const updatedAmountInput = document.getElementById('earlyPaymentAmount');
    const updatedCommissionInfo = document.getElementById('earlyPaymentCommissionInfo');
    const updatedCommissionAmount = document.getElementById('earlyPaymentCommissionAmount');
    
    if (!updatedForm || !updatedAmountInput) return;
    
    // Calcular comisión cuando cambia el monto
    updatedAmountInput.addEventListener('input', () => {
        const amount = parseFloat(updatedAmountInput.value) || 0;
        if (amount > 0 && loan.early_payment_commission > 0 && updatedCommissionInfo && updatedCommissionAmount) {
            const commission = amount * loan.early_payment_commission / 100;
            updatedCommissionAmount.textContent = formatCurrency(commission);
            updatedCommissionInfo.style.display = 'block';
        } else if (updatedCommissionInfo) {
            updatedCommissionInfo.style.display = 'none';
        }
    });
    
    // Manejar envío del formulario
    updatedForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const amount = parseFloat(updatedAmountInput.value);
        
        if (!amount || amount <= 0) {
            alert('Por favor ingresa un monto válido');
            return;
        }
        
        if (amount > remainingCapital) {
            alert(`El monto no puede ser mayor al capital restante (${formatCurrency(remainingCapital)})`);
            return;
        }
        
        await registerLoanPayment(loanId, amount, true);
        modal.style.display = 'none';
    });
    
    // Mostrar modal
    modal.style.display = 'flex';
    updatedAmountInput.focus();
}

// Registrar pago de préstamo
async function registerLoanPayment(loanId, amount, isEarlyPayment = false) {
    try {
        const loan = await apiRequest(`/loans/${loanId}/payment`, {
            method: 'POST',
            body: JSON.stringify({
                amount,
                date: new Date().toISOString().split('T')[0],
                is_early_payment: isEarlyPayment
            })
        });
        
        await loadUserData();
        updateDisplay();
        alert('✅ Pago registrado exitosamente');
    } catch (error) {
        alert('Error al registrar pago: ' + error.message);
    }
}

// Exponer funciones globales
window.showLoanDetails = showLoanDetails;
window.showEarlyPaymentModal = showEarlyPaymentModal;

// ==================== INVERSIONES ====================

// Agregar inversión
async function addInvestment() {
    const name = document.getElementById('investmentName').value.trim();
    const type = document.getElementById('investmentType').value;
    const currentValue = parseFloat(document.getElementById('investmentCurrentValue').value);
    const description = document.getElementById('investmentDescription').value.trim();
    
    // Aportes periódicos
    const enablePeriodic = document.getElementById('enablePeriodicContribution')?.checked || false;
    const contributionFrequency = document.getElementById('contributionFrequency')?.value || 'monthly';
    const contributionAmount = parseFloat(document.getElementById('contributionAmount')?.value || 0);
    const contributionStartDate = document.getElementById('contributionStartDate')?.value || null;
    const contributionEndDate = document.getElementById('contributionEndDate')?.value || null;
    
    if (!name || isNaN(currentValue) || !type) {
        alert('Por favor completa todos los campos requeridos');
        return;
    }
    
    if (enablePeriodic && (!contributionAmount || contributionAmount <= 0 || !contributionStartDate)) {
        alert('Si activas aportes periódicos, debes especificar el monto y la fecha de inicio');
        return;
    }
    
    try {
        const investmentData = {
            name,
            type,
            current_value: currentValue || 0,
            description: description || null,
            contributions: [], // Inicialmente vacío, se irá llenando con aportes
            periodic_contribution: {
                enabled: enablePeriodic,
                frequency: enablePeriodic ? contributionFrequency : 'monthly',
                amount: enablePeriodic ? contributionAmount : 0,
                start_date: enablePeriodic ? contributionStartDate : null,
                end_date: enablePeriodic ? (contributionEndDate || null) : null,
                completed_contributions: []
            }
        };
        
        const investment = await apiRequest('/investments', {
            method: 'POST',
            body: JSON.stringify(investmentData)
        });
        
        investments.push(investment);
        updateDisplay();
        document.getElementById('investmentForm').reset();
        // Resetear campos de aportes periódicos
        const enablePeriodicCheckbox = document.getElementById('enablePeriodicContribution');
        const periodicFields = document.getElementById('periodicContributionFields');
        if (enablePeriodicCheckbox) enablePeriodicCheckbox.checked = false;
        if (periodicFields) periodicFields.style.display = 'none';
        alert('✅ Inversión creada. Ahora puedes añadir dinero a tu hucha.');
    } catch (error) {
        alert('Error al crear inversión: ' + error.message);
    }
}

// Actualizar inversiones
function updateInvestments() {
    const grid = document.getElementById('investmentsGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    if (investments.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 40px; color: #999;">No hay inversiones registradas</p>';
        return;
    }
    
    const totalInvested = investments.reduce((sum, inv) => {
        return sum + ((inv.contributions || []).reduce((contribSum, c) => contribSum + c.amount, 0));
    }, 0);
    const totalCurrentValue = investments.reduce((sum, inv) => sum + inv.current_value, 0);
    const totalProfit = totalCurrentValue - totalInvested;
    const totalReturn = totalInvested > 0 ? ((totalProfit / totalInvested) * 100) : 0;
    
    investments.forEach(investment => {
        // Calcular total invertido (suma de todos los aportes)
        const totalInvested = (investment.contributions || []).reduce((sum, c) => sum + c.amount, 0);
        const profit = investment.current_value - totalInvested;
        const returnPercent = totalInvested > 0 ? ((profit / totalInvested) * 100) : 0;
        
        // Calcular días desde el primer aporte
        const firstContribution = investment.contributions && investment.contributions.length > 0 
            ? new Date(investment.contributions[0].date)
            : new Date(investment.created_at);
        const daysHeld = Math.floor((new Date() - firstContribution) / (1000 * 60 * 60 * 24));
        
        const typeNames = {
            stocks: 'Acciones',
            bonds: 'Bonos',
            crypto: 'Criptomonedas',
            funds: 'Fondos',
            real_estate: 'Inmuebles',
            other: 'Otros'
        };
        
        const card = document.createElement('div');
        card.className = 'envelope-card';
        card.style.borderLeft = `4px solid ${profit >= 0 ? 'var(--success)' : 'var(--danger)'}`;
        card.innerHTML = `
            <h3>${investment.name} <span style="font-size: 12px; color: var(--gray-500); font-weight: normal;">(${typeNames[investment.type] || investment.type})</span></h3>
            
            <div style="margin: 16px 0; padding: 16px; background: var(--gray-50); border-radius: var(--radius);">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 14px;">
                    <div><strong>💰 Total Invertido:</strong></div>
                    <div style="text-align: right; font-weight: 600;">${formatCurrency(totalInvested)}</div>
                    <div><strong>💵 Valor Actual:</strong></div>
                    <div style="text-align: right; font-weight: 600; font-size: 16px;">${formatCurrency(investment.current_value)}</div>
                    <div><strong>📈 Ganancia/Pérdida:</strong></div>
                    <div style="text-align: right; color: ${profit >= 0 ? 'var(--success)' : 'var(--danger)'}; font-weight: 700; font-size: 18px;">
                        ${profit >= 0 ? '+' : ''}${formatCurrency(profit)}
                    </div>
                    <div><strong>📊 Rentabilidad:</strong></div>
                    <div style="text-align: right; color: ${returnPercent >= 0 ? 'var(--success)' : 'var(--danger)'}; font-weight: 700; font-size: 16px;">
                        ${returnPercent >= 0 ? '+' : ''}${returnPercent.toFixed(2)}%
                    </div>
                    ${investment.contributions && investment.contributions.length > 0 ? `
                        <div><strong>🔢 Aportes:</strong></div>
                        <div style="text-align: right; color: var(--gray-600);">${investment.contributions.length}</div>
                    ` : ''}
                </div>
            </div>
            
            ${investment.description ? `<div style="margin: 12px 0; font-size: 13px; color: var(--gray-600); font-style: italic;">${investment.description}</div>` : ''}
            
            ${investment.contributions && investment.contributions.length > 0 ? `
                <div style="margin: 12px 0; padding: 12px; background: rgba(16, 185, 129, 0.05); border-radius: var(--radius); border-left: 3px solid var(--success);">
                    <div style="font-size: 12px; font-weight: 600; color: var(--success); margin-bottom: 8px;">💰 Historial de Aportes</div>
                    <div style="max-height: 120px; overflow-y: auto; font-size: 12px;">
                        ${investment.contributions.slice().reverse().slice(0, 5).map(c => `
                            <div style="display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid rgba(16, 185, 129, 0.1);">
                                <span>${formatDate(new Date(c.date))}</span>
                                <span style="font-weight: 600; color: var(--success);">+${formatCurrency(c.amount)}</span>
                            </div>
                        `).join('')}
                        ${investment.contributions.length > 5 ? `
                            <div style="text-align: center; padding-top: 6px; color: var(--gray-500); font-size: 11px;">
                                +${investment.contributions.length - 5} aportes más
                            </div>
                        ` : ''}
                    </div>
                </div>
            ` : `
                <div style="margin: 12px 0; padding: 12px; background: rgba(99, 102, 241, 0.05); border-radius: var(--radius); border-left: 3px solid var(--primary);">
                    <div style="font-size: 12px; color: var(--gray-600); text-align: center;">
                        💡 Aún no has añadido dinero. Haz clic en "Añadir Dinero" para empezar.
                    </div>
                </div>
            `}
            
            ${investment.periodic_contribution && investment.periodic_contribution.enabled ? `
                <div style="margin: 12px 0; padding: 12px; background: rgba(99, 102, 241, 0.1); border-radius: var(--radius); border-left: 3px solid var(--primary);">
                    <div style="font-size: 12px; font-weight: 600; color: var(--primary); margin-bottom: 8px;">💡 Aporte Periódico Activo</div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 13px;">
                        <div><strong>Frecuencia:</strong></div>
                        <div style="text-align: right;">${investment.periodic_contribution.frequency === 'weekly' ? 'Semanal' : investment.periodic_contribution.frequency === 'monthly' ? 'Mensual' : 'Anual'}</div>
                        <div><strong>Monto:</strong></div>
                        <div style="text-align: right; font-weight: 600;">${formatCurrency(investment.periodic_contribution.amount)}</div>
                        <div><strong>Inicio:</strong></div>
                        <div style="text-align: right;">${formatDate(new Date(investment.periodic_contribution.start_date))}</div>
                        ${investment.periodic_contribution.end_date ? `
                            <div><strong>Fin:</strong></div>
                            <div style="text-align: right;">${formatDate(new Date(investment.periodic_contribution.end_date))}</div>
                        ` : `
                            <div><strong>Fin:</strong></div>
                            <div style="text-align: right; color: var(--gray-500);">Indefinido</div>
                        `}
                    </div>
                    ${investment.periodic_contribution.completed_contributions && investment.periodic_contribution.completed_contributions.length > 0 ? `
                        <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid rgba(99, 102, 241, 0.2);">
                            <div style="font-size: 11px; font-weight: 600; color: var(--primary); margin-bottom: 6px;">✅ Aportes Realizados (${investment.periodic_contribution.completed_contributions.length})</div>
                            <div style="max-height: 100px; overflow-y: auto; font-size: 12px;">
                                ${investment.periodic_contribution.completed_contributions.slice(-5).map(c => `
                                    <div style="display: flex; justify-content: space-between; padding: 4px 0; border-bottom: 1px solid rgba(99, 102, 241, 0.1);">
                                        <span>${formatDate(new Date(c.date))}</span>
                                        <span style="font-weight: 600;">${formatCurrency(c.amount)}</span>
                                    </div>
                                `).join('')}
                                ${investment.periodic_contribution.completed_contributions.length > 5 ? `
                                    <div style="text-align: center; padding-top: 4px; color: var(--gray-500); font-size: 11px;">
                                        +${investment.periodic_contribution.completed_contributions.length - 5} más
                                    </div>
                                ` : ''}
                            </div>
                        </div>
                    ` : `
                        <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid rgba(99, 102, 241, 0.2);">
                            <div style="font-size: 11px; color: var(--gray-500); text-align: center;">
                                💡 Asocia un gasto a esta inversión para registrar el aporte
                            </div>
                        </div>
                    `}
                </div>
            ` : ''}
            
            <div class="envelope-actions" style="display: flex; gap: 8px; margin-top: 12px;">
                <button class="btn-primary" onclick="addMoneyToInvestment('${investment._id || investment.id}')" style="flex: 1;">💰 Añadir Dinero</button>
                <button class="btn-secondary" onclick="updateInvestmentValue('${investment._id || investment.id}')" style="flex: 1;">📊 Actualizar Valor</button>
                <button class="btn-danger" onclick="deleteInvestment('${investment._id || investment.id}')" style="flex: 1;">🗑️ Eliminar</button>
            </div>
        `;
        grid.appendChild(card);
    });
    
    // Agregar resumen total
    const summaryCard = document.createElement('div');
    summaryCard.className = 'envelope-card';
    summaryCard.style.gridColumn = '1 / -1';
    summaryCard.style.background = 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)';
    summaryCard.style.color = 'white';
    summaryCard.style.border = 'none';
    summaryCard.innerHTML = `
        <h3 style="color: white; margin-bottom: 16px;">Resumen de Inversiones</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
            <div>
                <div style="font-size: 13px; opacity: 0.9; margin-bottom: 4px;">Total Invertido</div>
                <div style="font-size: 24px; font-weight: 700;">${formatCurrency(totalInvested)}</div>
            </div>
            <div>
                <div style="font-size: 13px; opacity: 0.9; margin-bottom: 4px;">Valor Actual</div>
                <div style="font-size: 24px; font-weight: 700;">${formatCurrency(totalCurrentValue)}</div>
            </div>
            <div>
                <div style="font-size: 13px; opacity: 0.9; margin-bottom: 4px;">Ganancia/Pérdida</div>
                <div style="font-size: 24px; font-weight: 700; color: ${totalProfit >= 0 ? 'var(--success)' : 'var(--danger)'};">
                    ${totalProfit >= 0 ? '+' : ''}${formatCurrency(totalProfit)}
                </div>
            </div>
            <div>
                <div style="font-size: 13px; opacity: 0.9; margin-bottom: 4px;">Rentabilidad Total</div>
                <div style="font-size: 24px; font-weight: 700; color: ${totalReturn >= 0 ? 'var(--success)' : 'var(--danger)'};">
                    ${totalReturn >= 0 ? '+' : ''}${totalReturn.toFixed(2)}%
                </div>
            </div>
        </div>
    `;
    grid.insertBefore(summaryCard, grid.firstChild);
}

// Variable global para almacenar el ID de la inversión actual
let currentInvestmentId = null;

// Mostrar modal para añadir dinero a inversión
function showAddMoneyInvestmentModal(id) {
    currentInvestmentId = id;
    const modal = document.getElementById('addMoneyInvestmentModal');
    const titleEl = document.getElementById('addMoneyInvestmentTitle');
    const infoEl = document.getElementById('addMoneyInvestmentInfo');
    
    if (!modal || !titleEl || !infoEl) return;
    
    // Buscar la inversión
    const investment = investments.find(inv => (inv._id || inv.id) === id);
    if (investment) {
        titleEl.textContent = `💰 Añadir Dinero a ${investment.name}`;
        infoEl.innerHTML = `
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 14px;">
                <div><strong>Valor Actual:</strong></div>
                <div style="text-align: right; font-weight: 600;">${formatCurrency(investment.current_value || 0)}</div>
                <div><strong>Total Invertido:</strong></div>
                <div style="text-align: right; font-weight: 600;">${formatCurrency(investment.contributions?.reduce((sum, c) => sum + c.amount, 0) || 0)}</div>
            </div>
        `;
    }
    
    modal.style.display = 'flex';
    document.getElementById('addMoneyAmount').value = '';
}

// Cerrar modal de añadir dinero
function closeAddMoneyInvestmentModal() {
    const modal = document.getElementById('addMoneyInvestmentModal');
    if (modal) modal.style.display = 'none';
    currentInvestmentId = null;
}

// Mostrar modal para actualizar valor de inversión
function showUpdateInvestmentValueModal(id) {
    currentInvestmentId = id;
    const modal = document.getElementById('updateInvestmentValueModal');
    const titleEl = document.getElementById('updateInvestmentValueTitle');
    
    if (!modal || !titleEl) return;
    
    // Buscar la inversión
    const investment = investments.find(inv => (inv._id || inv.id) === id);
    if (investment) {
        titleEl.textContent = `📊 Actualizar Valor de ${investment.name}`;
        const input = document.getElementById('updateInvestmentValueInput');
        if (input) {
            input.value = investment.current_value || 0;
        }
    }
    
    modal.style.display = 'flex';
}

// Cerrar modal de actualizar valor
function closeUpdateInvestmentValueModal() {
    const modal = document.getElementById('updateInvestmentValueModal');
    if (modal) modal.style.display = 'none';
    currentInvestmentId = null;
}

// Añadir dinero a una inversión (hucha)
async function addMoneyToInvestment(id) {
    showAddMoneyInvestmentModal(id);
}

// Actualizar valor actual de la inversión
async function updateInvestmentValue(id) {
    showUpdateInvestmentValueModal(id);
}

// Procesar añadir dinero a inversión desde el modal
async function processAddMoneyToInvestment() {
    if (!currentInvestmentId) return;
    
    const input = document.getElementById('addMoneyAmount');
    if (!input || !input.value || isNaN(input.value) || parseFloat(input.value) <= 0) {
        alert('Por favor ingresa una cantidad válida mayor a 0');
        return;
    }
    
    const amount = parseFloat(input.value);
    
    try {
        await apiRequest(`/investments/${currentInvestmentId}/contribution`, {
            method: 'POST',
            body: JSON.stringify({
                amount: amount,
                date: new Date().toISOString().split('T')[0]
            })
        });
        
        await loadUserData();
        updateDisplay();
        closeAddMoneyInvestmentModal();
        alert('✅ Dinero añadido exitosamente');
    } catch (error) {
        alert('Error al añadir dinero: ' + error.message);
    }
}

// Procesar actualización de valor de inversión desde el modal
async function processUpdateInvestmentValue() {
    if (!currentInvestmentId) return;
    
    const input = document.getElementById('updateInvestmentValueInput');
    if (!input || !input.value || isNaN(input.value)) {
        alert('Por favor ingresa un valor válido');
        return;
    }
    
    try {
        await apiRequest(`/investments/${currentInvestmentId}`, {
            method: 'PUT',
            body: JSON.stringify({
                current_value: parseFloat(input.value)
            })
        });
        
        await loadUserData();
        updateDisplay();
        closeUpdateInvestmentValueModal();
    } catch (error) {
        alert('Error al actualizar valor: ' + error.message);
    }
}

// Eliminar inversión
async function deleteInvestment(id) {
    const confirmed = await showConfirm(
        'Eliminar Inversión',
        '¿Estás seguro de eliminar esta inversión? Esta acción no se puede deshacer.',
        'Eliminar',
        'Cancelar'
    );
    if (!confirmed) return;
    
    try {
        showLoader('Eliminando inversión...');
        await apiRequest(`/investments/${id}`, { method: 'DELETE' });
        await loadUserData();
        updateDisplay();
        hideLoader();
        showToast('Inversión eliminada exitosamente', 'success');
    } catch (error) {
        hideLoader();
        showToast('Error al eliminar inversión: ' + error.message, 'error');
    }
}

// ==================== PROPIEDADES/PISOS ====================

// Agregar propiedad
async function addProperty() {
    const name = document.getElementById('propertyName').value.trim();
    const type = document.getElementById('propertyType').value;
    const address = document.getElementById('propertyAddress').value.trim();
    const description = document.getElementById('propertyDescription').value.trim();
    
    if (!name) {
        alert('Por favor ingresa el nombre de la propiedad');
        return;
    }
    
    try {
        const property = await apiRequest('/properties', {
            method: 'POST',
            body: JSON.stringify({
                name,
                type,
                address: address || null,
                description: description || null
            })
        });
        
        properties.push(property);
        updateDisplay();
        updatePropertySelect();
        document.getElementById('propertyForm').reset();
        alert('✅ Propiedad agregada exitosamente');
    } catch (error) {
        alert('Error al crear propiedad: ' + error.message);
    }
}

// Actualizar propiedades
function updateProperties() {
    const grid = document.getElementById('propertiesGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    if (properties.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 40px; color: #999;">No hay propiedades registradas</p>';
        return;
    }
    
    properties.forEach(property => {
        const card = document.createElement('div');
        card.className = 'envelope-card';
        card.style.background = 'white';
        card.style.border = '1px solid var(--border-color)';
        card.style.borderRadius = 'var(--radius-md)';
        card.style.padding = '20px';
        card.style.boxShadow = 'var(--shadow-sm)';
        
        const typeNames = {
            apartment: 'Piso/Apartamento',
            house: 'Casa',
            office: 'Oficina',
            commercial: 'Local Comercial',
            other: 'Otro'
        };
        
        // Calcular gastos asociados a esta propiedad
        const propertyExpenses = transactions
            .filter(t => t.property_id === (property._id || property.id) && t.type === 'expense')
            .reduce((sum, t) => sum + Math.abs(t.amount), 0);
        
        const propertyIncomes = transactions
            .filter(t => t.property_id === (property._id || property.id) && t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
        
        card.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 16px;">
                <div style="flex: 1;">
                    <h3 style="margin: 0 0 8px 0; font-size: 18px; font-weight: 700; color: var(--gray-900);">${property.name}</h3>
                    <div style="font-size: 13px; color: var(--gray-600); margin-bottom: 4px;">
                        <strong>Tipo:</strong> ${typeNames[property.type] || property.type}
                    </div>
                    ${property.address ? `
                        <div style="font-size: 13px; color: var(--gray-600); margin-bottom: 4px;">
                            <strong>Dirección:</strong> ${property.address}
                        </div>
                    ` : ''}
                    ${property.description ? `
                        <div style="font-size: 13px; color: var(--gray-600); margin-top: 8px;">
                            ${property.description}
                        </div>
                    ` : ''}
                </div>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 16px; padding-top: 16px; border-top: 1px solid var(--gray-200);">
                <div>
                    <div style="font-size: 12px; color: var(--gray-600); margin-bottom: 4px;">Gastos Totales</div>
                    <div style="font-size: 18px; font-weight: 700; color: var(--danger);">${formatCurrency(propertyExpenses)}</div>
                </div>
                <div>
                    <div style="font-size: 12px; color: var(--gray-600); margin-bottom: 4px;">Ingresos Totales</div>
                    <div style="font-size: 18px; font-weight: 700; color: var(--success);">${formatCurrency(propertyIncomes)}</div>
                </div>
            </div>
            <div class="envelope-actions" style="display: flex; gap: 8px; margin-top: 16px;">
                <button class="btn-secondary" onclick="editProperty('${property._id || property.id}')" style="flex: 1;">✏️ Editar</button>
                <button class="btn-danger" onclick="deleteProperty('${property._id || property.id}')" style="flex: 1;">🗑️ Eliminar</button>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Editar propiedad
async function editProperty(id) {
    const property = properties.find(p => (p._id || p.id) === id);
    if (!property) return;
    
    const newName = prompt('Nombre de la propiedad:', property.name);
    if (!newName || newName.trim() === '') return;
    
    const newAddress = prompt('Dirección (opcional):', property.address || '');
    const newDescription = prompt('Descripción (opcional):', property.description || '');
    
    try {
        await apiRequest(`/properties/${id}`, {
            method: 'PUT',
            body: JSON.stringify({
                name: newName.trim(),
                address: newAddress.trim() || null,
                description: newDescription.trim() || null,
                type: property.type
            })
        });
        
        await loadUserData();
        updateDisplay();
        alert('✅ Propiedad actualizada exitosamente');
    } catch (error) {
        alert('Error al actualizar propiedad: ' + error.message);
    }
}

// Eliminar propiedad
async function deleteProperty(id) {
    if (!confirm('¿Estás seguro de eliminar esta propiedad? Esto no eliminará las transacciones asociadas.')) return;
    
    try {
        await apiRequest(`/properties/${id}`, { method: 'DELETE' });
        await loadUserData();
        updateDisplay();
        alert('✅ Propiedad eliminada exitosamente');
    } catch (error) {
        alert('Error al eliminar propiedad: ' + error.message);
    }
}

// Exponer funciones globalmente
window.editProperty = editProperty;
window.deleteProperty = deleteProperty;

// ==================== CUENTAS BANCARIAS ====================

// Agregar cuenta bancaria
async function addAccount() {
    const name = document.getElementById('accountName').value.trim();
    const type = document.getElementById('accountType').value;
    const bank = document.getElementById('accountBank').value.trim();
    const accountNumber = document.getElementById('accountNumber').value.trim();
    const balance = parseFloat(document.getElementById('accountBalance').value);
    const description = document.getElementById('accountDescription').value.trim();
    
    if (!name || !type) {
        alert('Por favor completa todos los campos requeridos');
        return;
    }
    
    if (isNaN(balance)) {
        alert('El saldo debe ser un número válido');
        return;
    }
    
    try {
        const account = await apiRequest('/accounts', {
            method: 'POST',
            body: JSON.stringify({
                name,
                type,
                bank: bank || null,
                account_number: accountNumber || null,
                balance,
                currency: 'EUR',
                description: description || null
            })
        });
        
        accounts.push(account);
        updateDisplay();
        document.getElementById('accountForm').reset();
        alert('✅ Cuenta agregada exitosamente');
    } catch (error) {
        alert('Error al crear cuenta: ' + error.message);
    }
}

// Actualizar cuentas
function updateAccounts() {
    const grid = document.getElementById('accountsGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    if (accounts.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--gray-500);">No hay cuentas registradas</p>';
        return;
    }
    
    const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
    
    accounts.forEach(account => {
        const typeNames = {
            checking: 'Cuenta Corriente',
            savings: 'Cuenta de Ahorros',
            credit: 'Tarjeta de Crédito',
            investment: 'Cuenta de Inversión',
            other: 'Otra'
        };
        
        const card = document.createElement('div');
        card.className = 'envelope-card';
        card.style.borderLeft = `4px solid ${account.balance >= 0 ? 'var(--success)' : 'var(--danger)'}`;
        card.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 12px;">
                <div>
                    <h3 style="margin: 0; font-size: 18px; font-weight: 700; color: var(--gray-900);">${account.name}</h3>
                    <p style="margin: 4px 0 0 0; font-size: 13px; color: var(--gray-600);">${typeNames[account.type] || account.type}</p>
                    ${account.bank ? `<p style="margin: 2px 0 0 0; font-size: 12px; color: var(--gray-500);">🏦 ${account.bank}</p>` : ''}
                    ${account.account_number ? `<p style="margin: 2px 0 0 0; font-size: 12px; color: var(--gray-500);">📋 ****${account.account_number}</p>` : ''}
                </div>
            </div>
            
            <div style="margin: 16px 0; padding: 16px; background: var(--gray-50); border-radius: var(--radius);">
                <div style="text-align: center;">
                    <div style="font-size: 12px; color: var(--gray-600); margin-bottom: 4px;">Saldo Actual</div>
                    <div style="font-size: 28px; font-weight: 700; color: ${account.balance >= 0 ? 'var(--success)' : 'var(--danger)'};">
                        ${formatCurrency(account.balance)}
                    </div>
                    <div style="font-size: 11px; color: var(--gray-500); margin-top: 4px;">${account.currency}</div>
                </div>
            </div>
            
            ${account.description ? `<div style="margin: 12px 0; font-size: 13px; color: var(--gray-600); font-style: italic;">${account.description}</div>` : ''}
            
            <div class="envelope-actions" style="display: flex; gap: 8px; margin-top: 12px;">
                <button class="btn-secondary" onclick="editAccount('${account._id || account.id}')" style="flex: 1;">✏️ Editar</button>
                <button class="btn-danger" onclick="deleteAccount('${account._id || account.id}')" style="flex: 1;">🗑️ Eliminar</button>
            </div>
        `;
        grid.appendChild(card);
    });
    
    // Agregar resumen total
    const summaryCard = document.createElement('div');
    summaryCard.className = 'envelope-card';
    summaryCard.style.gridColumn = '1 / -1';
    summaryCard.style.background = 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)';
    summaryCard.style.color = 'white';
    summaryCard.style.border = 'none';
    summaryCard.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
                <h3 style="margin: 0; color: white; font-size: 18px;">💰 Saldo Total</h3>
                <p style="margin: 8px 0 0 0; color: rgba(255,255,255,0.9); font-size: 14px;">${accounts.length} cuenta${accounts.length !== 1 ? 's' : ''}</p>
            </div>
            <div style="text-align: right;">
                <div style="font-size: 32px; font-weight: 700; color: white;">
                    ${formatCurrency(totalBalance)}
                </div>
                <div style="font-size: 12px; color: rgba(255,255,255,0.8);">EUR</div>
            </div>
        </div>
    `;
    grid.appendChild(summaryCard);
}

// Editar cuenta (actualizar saldo)
async function editAccount(id) {
    showUpdateAccountBalanceModal(id);
}

// Eliminar cuenta
async function deleteAccount(id) {
    const confirmed = await showConfirm(
        'Eliminar Cuenta',
        '¿Estás seguro de eliminar esta cuenta? Esta acción no se puede deshacer.',
        'Eliminar',
        'Cancelar'
    );
    if (!confirmed) return;
    
    try {
        showLoader('Eliminando cuenta...');
        await apiRequest(`/accounts/${id}`, { method: 'DELETE' });
        await loadUserData();
        updateDisplay();
        hideLoader();
        showToast('Cuenta eliminada exitosamente', 'success');
    } catch (error) {
        hideLoader();
        showToast('Error al eliminar cuenta: ' + error.message, 'error');
    }
}

// Exponer funciones globales
window.addMoneyToInvestment = addMoneyToInvestment;
window.updateInvestmentValue = updateInvestmentValue;
window.deleteInvestment = deleteInvestment;
window.editAccount = editAccount;
window.deleteAccount = deleteAccount;

// ==================== PATRIMONIO ====================

// Agregar bien
async function addAsset() {
    const name = document.getElementById('assetName').value.trim();
    const type = document.getElementById('assetType').value;
    const purchaseDate = document.getElementById('assetPurchaseDate').value;
    const purchasePrice = parseFloat(document.getElementById('assetPurchasePrice').value);
    const currentValue = parseFloat(document.getElementById('assetCurrentValue').value);
    const location = document.getElementById('assetLocation').value.trim();
    const description = document.getElementById('assetDescription').value.trim();
    
    if (!name || !type || !purchaseDate || isNaN(purchasePrice) || isNaN(currentValue)) {
        alert('Por favor completa todos los campos requeridos');
        return;
    }
    
    try {
        const asset = await apiRequest('/assets', {
            method: 'POST',
            body: JSON.stringify({
                name,
                type,
                purchase_date: purchaseDate,
                purchase_price: purchasePrice,
                current_value: currentValue,
                location: location || null,
                description: description || null
            })
        });
        
        assets.push(asset);
        updateDisplay();
        document.getElementById('assetForm').reset();
        const assetPurchaseDate = document.getElementById('assetPurchaseDate');
        if (assetPurchaseDate) {
            const today = new Date().toISOString().split('T')[0];
            assetPurchaseDate.value = today;
        }
        alert('✅ Bien agregado exitosamente');
    } catch (error) {
        alert('Error al crear bien: ' + error.message);
    }
}

// Actualizar patrimonio
function updateAssets() {
    const grid = document.getElementById('assetsGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    if (assets.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--gray-500);">No hay bienes registrados</p>';
        return;
    }
    
    const totalPurchaseValue = assets.reduce((sum, a) => sum + a.purchase_price, 0);
    const totalCurrentValue = assets.reduce((sum, a) => sum + a.current_value, 0);
    const totalAppreciation = totalCurrentValue - totalPurchaseValue;
    const totalAppreciationPercent = totalPurchaseValue > 0 ? ((totalAppreciation / totalPurchaseValue) * 100) : 0;
    
    assets.forEach(asset => {
        const appreciation = asset.current_value - asset.purchase_price;
        const appreciationPercent = asset.purchase_price > 0 ? ((appreciation / asset.purchase_price) * 100) : 0;
        const purchaseDate = new Date(asset.purchase_date);
        const daysOwned = Math.floor((new Date() - purchaseDate) / (1000 * 60 * 60 * 24));
        
        const typeNames = {
            property: 'Propiedad',
            vehicle: 'Vehículo',
            jewelry: 'Joyas',
            art: 'Arte',
            electronics: 'Electrónica',
            other: 'Otro'
        };
        
        const card = document.createElement('div');
        card.className = 'envelope-card';
        card.style.borderLeft = `4px solid ${appreciation >= 0 ? 'var(--success)' : 'var(--danger)'}`;
        card.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 12px;">
                <div>
                    <h3 style="margin: 0; font-size: 18px; font-weight: 700; color: var(--gray-900);">${asset.name}</h3>
                    <p style="margin: 4px 0 0 0; font-size: 13px; color: var(--gray-600);">${typeNames[asset.type] || asset.type}</p>
                    ${asset.location ? `<p style="margin: 2px 0 0 0; font-size: 12px; color: var(--gray-500);">📍 ${asset.location}</p>` : ''}
                </div>
            </div>
            
            <div style="margin: 16px 0; padding: 16px; background: var(--gray-50); border-radius: var(--radius);">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 14px;">
                    <div><strong>Compra:</strong></div>
                    <div style="text-align: right;">${formatCurrency(asset.purchase_price)}</div>
                    <div><strong>Valor Actual:</strong></div>
                    <div style="text-align: right; font-weight: 600;">${formatCurrency(asset.current_value)}</div>
                    <div><strong>Evolución:</strong></div>
                    <div style="text-align: right; color: ${appreciation >= 0 ? 'var(--success)' : 'var(--danger)'}; font-weight: 700; font-size: 16px;">
                        ${appreciation >= 0 ? '+' : ''}${formatCurrency(appreciation)}
                    </div>
                    <div><strong>Porcentaje:</strong></div>
                    <div style="text-align: right; color: ${appreciationPercent >= 0 ? 'var(--success)' : 'var(--danger)'}; font-weight: 700;">
                        ${appreciationPercent >= 0 ? '+' : ''}${appreciationPercent.toFixed(2)}%
                    </div>
                    <div><strong>Días:</strong></div>
                    <div style="text-align: right; color: var(--gray-600);">${daysOwned}</div>
                </div>
            </div>
            
            ${asset.description ? `<div style="margin: 12px 0; font-size: 13px; color: var(--gray-600); font-style: italic;">${asset.description}</div>` : ''}
            
            ${asset.value_history && asset.value_history.length > 2 ? `
                <div style="margin: 12px 0; padding: 12px; background: var(--gray-100); border-radius: var(--radius);">
                    <strong style="font-size: 12px; color: var(--gray-700);">Historial de Valores:</strong>
                    <div style="margin-top: 8px; font-size: 11px; color: var(--gray-600); max-height: 100px; overflow-y: auto;">
                        ${asset.value_history.slice(-5).map(h => `
                            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                                <span>${h.date}</span>
                                <span style="font-weight: 600;">${formatCurrency(h.value)}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
            
            <div class="envelope-actions" style="display: flex; gap: 8px; margin-top: 12px;">
                <button class="btn-secondary" onclick="editAsset('${asset._id || asset.id}')" style="flex: 1;">✏️ Editar</button>
                <button class="btn-danger" onclick="deleteAsset('${asset._id || asset.id}')" style="flex: 1;">🗑️ Eliminar</button>
            </div>
        `;
        grid.appendChild(card);
    });
    
    // Agregar resumen total
    const summaryCard = document.createElement('div');
    summaryCard.className = 'envelope-card';
    summaryCard.style.gridColumn = '1 / -1';
    summaryCard.style.background = 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)';
    summaryCard.style.color = 'white';
    summaryCard.style.border = 'none';
    summaryCard.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
                <h3 style="margin: 0; color: white; font-size: 18px;">🏠 Valor Total del Patrimonio</h3>
                <p style="margin: 8px 0 0 0; color: rgba(255,255,255,0.9); font-size: 14px;">${assets.length} bien${assets.length !== 1 ? 'es' : ''}</p>
            </div>
            <div style="text-align: right;">
                <div style="font-size: 32px; font-weight: 700; color: white;">
                    ${formatCurrency(totalCurrentValue)}
                </div>
                <div style="font-size: 12px; color: rgba(255,255,255,0.8);">
                    ${totalAppreciation >= 0 ? '+' : ''}${formatCurrency(totalAppreciation)} (${totalAppreciationPercent >= 0 ? '+' : ''}${totalAppreciationPercent.toFixed(2)}%)
                </div>
            </div>
        </div>
    `;
    grid.appendChild(summaryCard);
}

// Editar bien (actualizar valor)
async function editAsset(id) {
    showUpdateAssetValueModal(id);
}

// Procesar actualización de valor de bien desde el modal
async function processUpdateAssetValue() {
    if (!currentAssetId) return;
    
    const asset = assets.find(a => (a._id || a.id) === currentAssetId);
    if (!asset) return;
    
    const input = document.getElementById('updateAssetValueInput');
    if (!input || !input.value || isNaN(input.value)) {
        alert('Por favor ingresa un número válido');
        return;
    }
    
    const currentValue = parseFloat(input.value);
    
    try {
        await apiRequest(`/assets/${currentAssetId}`, {
            method: 'PUT',
            body: JSON.stringify({
                ...asset,
                current_value: currentValue,
                update_value_history: true
            })
        });
        
        await loadUserData();
        updateDisplay();
        closeUpdateAssetValueModal();
    } catch (error) {
        alert('Error al actualizar bien: ' + error.message);
    }
}

// Eliminar bien
async function deleteAsset(id) {
    const confirmed = await showConfirm(
        'Eliminar Bien',
        '¿Estás seguro de eliminar este bien? Esta acción no se puede deshacer.',
        'Eliminar',
        'Cancelar'
    );
    if (!confirmed) return;
    
    try {
        showLoader('Eliminando bien...');
        await apiRequest(`/assets/${id}`, { method: 'DELETE' });
        await loadUserData();
        updateDisplay();
        hideLoader();
        showToast('Bien eliminado exitosamente', 'success');
    } catch (error) {
        hideLoader();
        showToast('Error al eliminar bien: ' + error.message, 'error');
    }
}

// Exponer funciones globales
window.editAsset = editAsset;
window.deleteAsset = deleteAsset;

// Eliminar préstamo
async function deleteLoan(id) {
    if (!confirm('¿Estás seguro de eliminar este préstamo?')) return;
    
    try {
        await apiRequest(`/loans/${id}`, { method: 'DELETE' });
        await loadUserData();
        updateDisplay();
    } catch (error) {
        console.error('Error eliminando préstamo:', error);
        alert('Error al eliminar préstamo: ' + (error.message || 'Error desconocido'));
    }
}

// Exponer funciones al scope global para onclick handlers
window.deleteLoan = deleteLoan;

// Inicializar gráficas
function initializeCharts() {
    charts.savings = new Chart(document.getElementById('savingsChart'), {
        type: 'line',
        data: { labels: [], datasets: [] },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { display: true }
            }
        }
    });
    
    charts.expenses = new Chart(document.getElementById('expensesChart'), {
        type: 'bar',
        data: { labels: [], datasets: [] },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { display: false }
            }
        }
    });
    
    charts.incomeExpense = new Chart(document.getElementById('incomeExpenseChart'), {
        type: 'bar',
        data: { labels: [], datasets: [] },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { display: true }
            },
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
    
    charts.distribution = new Chart(document.getElementById('distributionChart'), {
        type: 'doughnut',
        data: { labels: [], datasets: [] },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { position: 'right' }
            }
        }
    });
    
    // Nuevas gráficas
    const incomeEvolutionEl = document.getElementById('incomeEvolutionChart');
    if (incomeEvolutionEl) {
        charts.incomeEvolution = new Chart(incomeEvolutionEl, {
            type: 'line',
            data: { labels: [], datasets: [] },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: { legend: { display: true } },
                scales: { y: { beginAtZero: true } }
            }
        });
    }
    
    const expensesEvolutionEl = document.getElementById('expensesEvolutionChart');
    if (expensesEvolutionEl) {
        charts.expensesEvolution = new Chart(expensesEvolutionEl, {
            type: 'line',
            data: { labels: [], datasets: [] },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: { legend: { display: true } },
                scales: { y: { beginAtZero: true } }
            }
        });
    }
    
    const loansPendingEl = document.getElementById('loansPendingChart');
    if (loansPendingEl) {
        charts.loansPending = new Chart(loansPendingEl, {
            type: 'line',
            data: { labels: [], datasets: [] },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: { legend: { display: true } },
                scales: { y: { beginAtZero: true } }
            }
        });
    }
    
    const assetsEvolutionEl = document.getElementById('assetsEvolutionChart');
    if (assetsEvolutionEl) {
        charts.assetsEvolution = new Chart(assetsEvolutionEl, {
            type: 'line',
            data: { labels: [], datasets: [] },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: { legend: { display: true } },
                scales: { y: { beginAtZero: true } }
            }
        });
    }
    
    const accountsBalanceEl = document.getElementById('accountsBalanceChart');
    if (accountsBalanceEl) {
        charts.accountsBalance = new Chart(accountsBalanceEl, {
            type: 'line',
            data: { labels: [], datasets: [] },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: { legend: { display: true } },
                scales: { y: { beginAtZero: true } }
            }
        });
    }
}

// Obtener período seleccionado (global o específico de gráfico)
function getSelectedPeriod(chartName = null) {
    if (chartName) {
        const chartSelect = document.querySelector(`.chart-period-select[data-chart="${chartName}"]`);
        if (chartSelect) {
            const value = chartSelect.value;
            if (value === 'custom') {
                return 'custom';
            }
            return value === 'all' ? 999 : parseInt(value) || 6;
        }
    }
    const periodSelect = document.getElementById('chartPeriod');
    if (!periodSelect) return 6;
    const value = periodSelect.value;
    return value === 'all' ? 999 : parseInt(value) || 6;
}

// Obtener transacciones filtradas por período
function getTransactionsByPeriod(chartName = null) {
    const period = getSelectedPeriod(chartName);
    const now = new Date();
    
    if (period === 999) { // "all"
        return transactions;
    }
    
    if (period === 'custom') {
        // Primero intentar obtener fechas del modal (si estamos en el modal)
        const modalStartDate = document.getElementById('modalStartDate');
        const modalEndDate = document.getElementById('modalEndDate');
        
        if (modalStartDate && modalEndDate && modalStartDate.value && modalEndDate.value) {
            const startDate = new Date(modalStartDate.value);
            const endDate = new Date(modalEndDate.value);
            endDate.setHours(23, 59, 59, 999);
            
            return transactions.filter(t => {
                const tDate = new Date(t.date);
                return tDate >= startDate && tDate <= endDate;
            });
        }
        
        // Si no está en el modal, obtener fechas del gráfico pequeño
        const startDateInput = document.getElementById(`${chartName}StartDate`) || 
                              document.querySelector(`#${chartName}StartDate`);
        const endDateInput = document.getElementById(`${chartName}EndDate`) || 
                            document.querySelector(`#${chartName}EndDate`);
        
        if (startDateInput && endDateInput && startDateInput.value && endDateInput.value) {
            const startDate = new Date(startDateInput.value);
            const endDate = new Date(endDateInput.value);
            endDate.setHours(23, 59, 59, 999); // Incluir todo el día final
            
            return transactions.filter(t => {
                const tDate = new Date(t.date);
                return tDate >= startDate && tDate <= endDate;
            });
        }
        // Si no hay fechas seleccionadas, usar período por defecto
        const startDate = new Date(now.getFullYear(), now.getMonth() - 6, 1);
        return transactions.filter(t => {
            const tDate = new Date(t.date);
            return tDate >= startDate;
        });
    }
    
    const startDate = new Date(now.getFullYear(), now.getMonth() - period, 1);
    return transactions.filter(t => {
        const tDate = new Date(t.date);
        return tDate >= startDate;
    });
}

// Actualizar un gráfico específico
function updateSingleChart(chartName) {
    switch(chartName) {
        case 'savings':
            updateSavingsChart();
            break;
        case 'expenses':
            updateExpensesChart();
            break;
        case 'incomeExpense':
            updateIncomeExpenseChart();
            break;
        case 'distribution':
            updateDistributionChart();
            break;
        case 'incomeEvolution':
            updateIncomeEvolutionChart();
            break;
        case 'expensesEvolution':
            updateExpensesEvolutionChart();
            break;
        case 'loansPending':
            updateLoansOutstandingChart();
            break;
        case 'assetsEvolution':
            updateAssetsEvolutionChart();
            break;
        case 'accountsBalance':
            updateAccountsBalanceChart();
            break;
    }
}

// Actualizar filtros de los gráficos
function updateChartFilters() {
    // Filtros de categorías de ingresos
    const incomeFilter = document.querySelector('.chart-category-filter[data-chart="incomeEvolution"]');
    if (incomeFilter) {
        const currentValue = incomeFilter.value;
        incomeFilter.innerHTML = '<option value="all">Todas las categorías</option>';
        const incomeCats = [...categories.income, ...customCategories.income];
        incomeCats.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.id;
            option.textContent = cat.name;
            incomeFilter.appendChild(option);
        });
        if (currentValue) incomeFilter.value = currentValue;
    }
    
    // Filtros de categorías de gastos
    const expenseFilter = document.querySelector('.chart-category-filter[data-chart="expensesEvolution"]');
    if (expenseFilter) {
        const currentValue = expenseFilter.value;
        expenseFilter.innerHTML = '<option value="all">Todas las categorías</option>';
        const expenseCats = [...categories.expense, ...customCategories.expense];
        expenseCats.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.id;
            option.textContent = cat.name;
            expenseFilter.appendChild(option);
        });
        if (currentValue) expenseFilter.value = currentValue;
    }
    
    // Filtros de préstamos
    const loanFilter = document.querySelector('.chart-loan-filter[data-chart="loansPending"]');
    if (loanFilter) {
        const currentValue = loanFilter.value;
        loanFilter.innerHTML = '<option value="all">Todos los préstamos</option>';
        loans.forEach(loan => {
            const option = document.createElement('option');
            option.value = loan._id || loan.id;
            option.textContent = loan.name || `Préstamo ${loan._id || loan.id}`;
            loanFilter.appendChild(option);
        });
        if (currentValue) loanFilter.value = currentValue;
    }
    
    // Filtros de bienes
    const assetFilter = document.querySelector('.chart-asset-filter[data-chart="assetsEvolution"]');
    if (assetFilter) {
        const currentValue = assetFilter.value;
        assetFilter.innerHTML = '<option value="all">Todos los bienes</option>';
        assets.forEach(asset => {
            const option = document.createElement('option');
            option.value = asset._id || asset.id;
            option.textContent = asset.name || `Bien ${asset._id || asset.id}`;
            assetFilter.appendChild(option);
        });
        if (currentValue) assetFilter.value = currentValue;
    }
    
    // Filtros de cuentas
    const accountFilter = document.querySelector('.chart-account-filter[data-chart="accountsBalance"]');
    if (accountFilter) {
        const currentValue = accountFilter.value;
        accountFilter.innerHTML = '<option value="all">Todas las cuentas</option>';
        accounts.forEach(account => {
            const option = document.createElement('option');
            option.value = account._id || account.id;
            option.textContent = account.name || `Cuenta ${account._id || account.id}`;
            accountFilter.appendChild(option);
        });
        if (currentValue) accountFilter.value = currentValue;
    }
}

// Actualizar gráficas
function updateCharts() {
    updateSavingsChart();
    updateExpensesChart();
    updateIncomeExpenseChart();
    updateDistributionChart();
    // Actualizar gráficas de evolución (si existen) - con manejo de errores
    try {
        if (typeof updateIncomeEvolutionChart === 'function') updateIncomeEvolutionChart();
    } catch (e) { 
        // Función no disponible, ignorar silenciosamente
    }
    try {
        if (typeof updateExpensesEvolutionChart === 'function') updateExpensesEvolutionChart();
    } catch (e) { 
        // Función no disponible, ignorar silenciosamente
    }
    try {
        if (typeof updateLoansOutstandingChart === 'function') updateLoansOutstandingChart();
    } catch (e) { 
        // Función no disponible, ignorar silenciosamente
    }
    try {
        if (typeof updateAssetsEvolutionChart === 'function') updateAssetsEvolutionChart();
    } catch (e) { 
        // Función no disponible, ignorar silenciosamente
    }
    try {
        if (typeof updateAccountsBalanceChart === 'function') updateAccountsBalanceChart();
    } catch (e) { 
        // Función no disponible, ignorar silenciosamente
    }
    updateFinancialHealthMetrics();
    updateAnalysisTables();
}

// Gráfica de ahorro
function updateSavingsChart() {
    if (!charts.savings) return;
    
    const period = getSelectedPeriod('savings');
    const now = new Date();
    const months = [];
    const savings = [];
    let runningTotal = 0;
    
    const periodTransactions = getTransactionsByPeriod();
    
    // Si es "all", agrupar por mes desde la primera transacción
    if (period === 999) {
        if (periodTransactions.length === 0) {
            charts.savings.data.labels = [];
            charts.savings.data.datasets = [];
            charts.savings.update();
            return;
        }
        
        // Encontrar la primera transacción
        const firstDate = new Date(Math.min(...periodTransactions.map(t => new Date(t.date))));
        const startMonth = firstDate.getMonth();
        const startYear = firstDate.getFullYear();
        const endMonth = now.getMonth();
        const endYear = now.getFullYear();
        
        let currentMonth = startMonth;
        let currentYear = startYear;
        
        while (currentYear < endYear || (currentYear === endYear && currentMonth <= endMonth)) {
            const date = new Date(currentYear, currentMonth, 1);
            const monthKey = date.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
            months.push(monthKey);
            
            const monthTransactions = periodTransactions.filter(t => {
                const tDate = new Date(t.date);
                return tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear;
            });
            
            const monthIncome = monthTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
            const monthExpenses = Math.abs(monthTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0));
            const monthSavings = monthIncome - monthExpenses;
            
            runningTotal += monthSavings;
            savings.push(runningTotal);
            
            currentMonth++;
            if (currentMonth > 11) {
                currentMonth = 0;
                currentYear++;
            }
        }
    } else {
        // Período fijo de meses
        for (let i = period - 1; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthKey = date.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
            months.push(monthKey);
            
            const monthTransactions = periodTransactions.filter(t => {
                const tDate = new Date(t.date);
                return tDate.getMonth() === date.getMonth() && tDate.getFullYear() === date.getFullYear();
            });
            
            const monthIncome = monthTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
            const monthExpenses = Math.abs(monthTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0));
            const monthSavings = monthIncome - monthExpenses;
            
            runningTotal += monthSavings;
            savings.push(runningTotal);
        }
    }
    
    charts.savings.data.labels = months;
    charts.savings.data.datasets = [{
        label: 'Ahorro Acumulado',
        data: savings,
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        fill: true
    }];
    charts.savings.update();
}

// Gráfica de gastos por categoría
function updateExpensesChart() {
    if (!charts.expenses) return;
    
    const periodTransactions = getTransactionsByPeriod('expenses');
    const expenses = periodTransactions.filter(t => t.type === 'expense');
    
    const categoryTotals = {};
    expenses.forEach(t => {
        let catName;
        // Buscar en categorías de gastos
        const expenseCat = categories.expense.find(c => c.id === t.categoryGeneral);
        if (expenseCat) {
            catName = expenseCat.name;
        } else {
            // Buscar en personalizadas
            const customCat = customCategories.expense.find(c => c.id === t.categoryGeneral);
            catName = customCat ? customCat.name : t.categoryGeneral;
        }
        categoryTotals[catName] = (categoryTotals[catName] || 0) + Math.abs(t.amount);
    });
    
    const labels = Object.keys(categoryTotals);
    const data = Object.values(categoryTotals);
    
    charts.expenses.data.labels = labels;
    charts.expenses.data.datasets = [{
        label: 'Gastos',
        data: data,
        backgroundColor: [
            '#667eea', '#764ba2', '#f093fb', '#4facfe',
            '#00f2fe', '#43e97b', '#fa709a', '#fee140',
            '#30cfd0', '#a8edea', '#fad961', '#f5576c'
        ]
    }];
    charts.expenses.update();
}

// Gráfica de ingresos vs gastos
function updateIncomeExpenseChart() {
    if (!charts.incomeExpense) return;
    
    const period = getSelectedPeriod('incomeExpense');
    const now = new Date();
    const months = [];
    const incomes = [];
    const expenses = [];
    
    const periodTransactions = getTransactionsByPeriod('incomeExpense');
    
    if (period === 999) {
        // Todo el historial
        if (periodTransactions.length === 0) {
            charts.incomeExpense.data.labels = [];
            charts.incomeExpense.data.datasets = [];
            charts.incomeExpense.update();
            return;
        }
        
        const firstDate = new Date(Math.min(...periodTransactions.map(t => new Date(t.date))));
        const startMonth = firstDate.getMonth();
        const startYear = firstDate.getFullYear();
        const endMonth = now.getMonth();
        const endYear = now.getFullYear();
        
        let currentMonth = startMonth;
        let currentYear = startYear;
        
        while (currentYear < endYear || (currentYear === endYear && currentMonth <= endMonth)) {
            const date = new Date(currentYear, currentMonth, 1);
            const monthKey = date.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
            months.push(monthKey);
            
            const monthTransactions = periodTransactions.filter(t => {
                const tDate = new Date(t.date);
                return tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear;
            });
            
            const monthIncome = monthTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
            const monthExpenses = Math.abs(monthTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0));
            
            incomes.push(monthIncome);
            expenses.push(monthExpenses);
            
            currentMonth++;
            if (currentMonth > 11) {
                currentMonth = 0;
                currentYear++;
            }
        }
    } else {
        // Período fijo
        for (let i = period - 1; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthKey = date.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
            months.push(monthKey);
            
            const monthTransactions = periodTransactions.filter(t => {
                const tDate = new Date(t.date);
                return tDate.getMonth() === date.getMonth() && tDate.getFullYear() === date.getFullYear();
            });
            
            const monthIncome = monthTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
            const monthExpenses = Math.abs(monthTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0));
            
            incomes.push(monthIncome);
            expenses.push(monthExpenses);
        }
    }
    
    charts.incomeExpense.data.labels = months;
    charts.incomeExpense.data.datasets = [
        {
            label: 'Ingresos',
            data: incomes,
            backgroundColor: '#10b981'
        },
        {
            label: 'Gastos',
            data: expenses,
            backgroundColor: '#ef4444'
        }
    ];
    charts.incomeExpense.update();
}

// Gráfica de distribución
function updateDistributionChart() {
    if (!charts.distribution) return;
    
    const periodTransactions = getTransactionsByPeriod('distribution');
    const expenses = periodTransactions.filter(t => t.type === 'expense');
    
    const categoryTotals = {};
    expenses.forEach(t => {
        let catName;
        const expenseCat = categories.expense.find(c => c.id === t.categoryGeneral);
        if (expenseCat) {
            catName = expenseCat.name;
        } else {
            const customCat = customCategories.expense.find(c => c.id === t.categoryGeneral);
            catName = customCat ? customCat.name : t.categoryGeneral;
        }
        categoryTotals[catName] = (categoryTotals[catName] || 0) + Math.abs(t.amount);
    });
    
    const labels = Object.keys(categoryTotals);
    const data = Object.values(categoryTotals);
    
    charts.distribution.data.labels = labels;
    charts.distribution.data.datasets = [{
        data: data,
        backgroundColor: [
            '#667eea', '#764ba2', '#f093fb', '#4facfe',
            '#00f2fe', '#43e97b', '#fa709a', '#fee140',
            '#30cfd0', '#a8edea', '#fad961', '#f5576c'
        ]
    }];
    charts.distribution.update();
}

// Gráfica de evolución de ingresos por categoría
function updateIncomeEvolutionChart() {
    if (!charts.incomeEvolution) return;
    
    const period = getSelectedPeriod('incomeEvolution');
    const categoryFilter = document.querySelector('.chart-category-filter[data-chart="incomeEvolution"]');
    const selectedCategory = categoryFilter ? categoryFilter.value : 'all';
    
    let periodTransactions = getTransactionsByPeriod('incomeEvolution');
    
    // Filtrar por categoría si está seleccionada
    if (selectedCategory !== 'all') {
        periodTransactions = periodTransactions.filter(t => t.categoryGeneral === selectedCategory);
    }
    const now = new Date();
    const months = [];
    
    if (periodTransactions.length === 0) {
        charts.incomeEvolution.data.labels = [];
        charts.incomeEvolution.data.datasets = [];
        charts.incomeEvolution.update();
        return;
    }
    
    // Obtener todas las categorías de ingresos únicas
    const incomeCategories = {};
    periodTransactions.filter(t => t.type === 'income').forEach(t => {
        let catName;
        const incomeCat = categories.income.find(c => c.id === t.categoryGeneral);
        if (incomeCat) {
            catName = incomeCat.name;
        } else {
            const customCat = customCategories.income.find(c => c.id === t.categoryGeneral);
            catName = customCat ? customCat.name : t.categoryGeneral;
        }
        if (!incomeCategories[catName]) {
            incomeCategories[catName] = [];
        }
    });
    
    // Generar meses
    if (period === 999) {
        const firstDate = new Date(Math.min(...periodTransactions.map(t => new Date(t.date))));
        let currentMonth = firstDate.getMonth();
        let currentYear = firstDate.getFullYear();
        const endMonth = now.getMonth();
        const endYear = now.getFullYear();
        
        while (currentYear < endYear || (currentYear === endYear && currentMonth <= endMonth)) {
            const date = new Date(currentYear, currentMonth, 1);
            const monthKey = date.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
            months.push(monthKey);
            
            // Calcular ingresos por categoría para este mes
            const monthTransactions = periodTransactions.filter(t => {
                const tDate = new Date(t.date);
                return tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear && t.type === 'income';
            });
            
            Object.keys(incomeCategories).forEach(catName => {
                if (!incomeCategories[catName]) incomeCategories[catName] = [];
                const catIncome = monthTransactions
                    .filter(t => {
                        let tCatName;
                        const incomeCat = categories.income.find(c => c.id === t.categoryGeneral);
                        if (incomeCat) {
                            tCatName = incomeCat.name;
                        } else {
                            const customCat = customCategories.income.find(c => c.id === t.categoryGeneral);
                            tCatName = customCat ? customCat.name : t.categoryGeneral;
                        }
                        return tCatName === catName;
                    })
                    .reduce((sum, t) => sum + t.amount, 0);
                incomeCategories[catName].push(catIncome);
            });
            
            currentMonth++;
            if (currentMonth > 11) {
                currentMonth = 0;
                currentYear++;
            }
        }
    } else {
        for (let i = period - 1; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthKey = date.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
            months.push(monthKey);
            
            const monthTransactions = periodTransactions.filter(t => {
                const tDate = new Date(t.date);
                return tDate.getMonth() === date.getMonth() && tDate.getFullYear() === date.getFullYear() && t.type === 'income';
            });
            
            Object.keys(incomeCategories).forEach(catName => {
                if (!incomeCategories[catName]) incomeCategories[catName] = [];
                const catIncome = monthTransactions
                    .filter(t => {
                        let tCatName;
                        const incomeCat = categories.income.find(c => c.id === t.categoryGeneral);
                        if (incomeCat) {
                            tCatName = incomeCat.name;
                        } else {
                            const customCat = customCategories.income.find(c => c.id === t.categoryGeneral);
                            tCatName = customCat ? customCat.name : t.categoryGeneral;
                        }
                        return tCatName === catName;
                    })
                    .reduce((sum, t) => sum + t.amount, 0);
                incomeCategories[catName].push(catIncome);
            });
        }
    }
    
    // Colores para las categorías
    const colors = [
        '#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444',
        '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6366f1'
    ];
    
    // Crear datasets para cada categoría
    const datasets = Object.keys(incomeCategories).map((catName, index) => {
        const data = incomeCategories[catName];
        // Solo mostrar categorías que tengan al menos un valor > 0
        const hasData = data.some(v => v > 0);
        if (!hasData) return null;
        
        return {
            label: catName,
            data: data,
            borderColor: colors[index % colors.length],
            backgroundColor: colors[index % colors.length] + '20',
            tension: 0.4,
            fill: false
        };
    }).filter(d => d !== null);
    
    charts.incomeEvolution.data.labels = months;
    charts.incomeEvolution.data.datasets = datasets.length > 0 ? datasets : [{
        label: 'Ingresos',
        data: new Array(months.length).fill(0),
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        fill: true
    }];
    charts.incomeEvolution.update();
}

// Gráfica de evolución de gastos por categoría
function updateExpensesEvolutionChart() {
    if (!charts.expensesEvolution) return;
    
    const period = getSelectedPeriod('expensesEvolution');
    const categoryFilter = document.querySelector('.chart-category-filter[data-chart="expensesEvolution"]');
    const selectedCategory = categoryFilter ? categoryFilter.value : 'all';
    
    let periodTransactions = getTransactionsByPeriod('expensesEvolution');
    
    // Filtrar por categoría si está seleccionada
    if (selectedCategory !== 'all') {
        periodTransactions = periodTransactions.filter(t => t.categoryGeneral === selectedCategory);
    }
    const now = new Date();
    const months = [];
    
    if (periodTransactions.length === 0) {
        charts.expensesEvolution.data.labels = [];
        charts.expensesEvolution.data.datasets = [];
        charts.expensesEvolution.update();
        return;
    }
    
    // Obtener todas las categorías de gastos únicas
    const expenseCategories = {};
    periodTransactions.filter(t => t.type === 'expense').forEach(t => {
        let catName;
        const expenseCat = categories.expense.find(c => c.id === t.categoryGeneral);
        if (expenseCat) {
            catName = expenseCat.name;
        } else {
            const customCat = customCategories.expense.find(c => c.id === t.categoryGeneral);
            catName = customCat ? customCat.name : t.categoryGeneral;
        }
        if (!expenseCategories[catName]) {
            expenseCategories[catName] = [];
        }
    });
    
    // Generar meses
    if (period === 999) {
        const firstDate = new Date(Math.min(...periodTransactions.map(t => new Date(t.date))));
        let currentMonth = firstDate.getMonth();
        let currentYear = firstDate.getFullYear();
        const endMonth = now.getMonth();
        const endYear = now.getFullYear();
        
        while (currentYear < endYear || (currentYear === endYear && currentMonth <= endMonth)) {
            const date = new Date(currentYear, currentMonth, 1);
            const monthKey = date.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
            months.push(monthKey);
            
            // Calcular gastos por categoría para este mes
            const monthTransactions = periodTransactions.filter(t => {
                const tDate = new Date(t.date);
                return tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear && t.type === 'expense';
            });
            
            Object.keys(expenseCategories).forEach(catName => {
                if (!expenseCategories[catName]) expenseCategories[catName] = [];
                const catExpenses = Math.abs(monthTransactions
                    .filter(t => {
                        let tCatName;
                        const expenseCat = categories.expense.find(c => c.id === t.categoryGeneral);
                        if (expenseCat) {
                            tCatName = expenseCat.name;
                        } else {
                            const customCat = customCategories.expense.find(c => c.id === t.categoryGeneral);
                            tCatName = customCat ? customCat.name : t.categoryGeneral;
                        }
                        return tCatName === catName;
                    })
                    .reduce((sum, t) => sum + t.amount, 0));
                expenseCategories[catName].push(catExpenses);
            });
            
            currentMonth++;
            if (currentMonth > 11) {
                currentMonth = 0;
                currentYear++;
            }
        }
    } else {
        for (let i = period - 1; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthKey = date.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
            months.push(monthKey);
            
            const monthTransactions = periodTransactions.filter(t => {
                const tDate = new Date(t.date);
                return tDate.getMonth() === date.getMonth() && tDate.getFullYear() === date.getFullYear() && t.type === 'expense';
            });
            
            Object.keys(expenseCategories).forEach(catName => {
                if (!expenseCategories[catName]) expenseCategories[catName] = [];
                const catExpenses = Math.abs(monthTransactions
                    .filter(t => {
                        let tCatName;
                        const expenseCat = categories.expense.find(c => c.id === t.categoryGeneral);
                        if (expenseCat) {
                            tCatName = expenseCat.name;
                        } else {
                            const customCat = customCategories.expense.find(c => c.id === t.categoryGeneral);
                            tCatName = customCat ? customCat.name : t.categoryGeneral;
                        }
                        return tCatName === catName;
                    })
                    .reduce((sum, t) => sum + t.amount, 0));
                expenseCategories[catName].push(catExpenses);
            });
        }
    }
    
    // Colores para las categorías
    const colors = [
        '#ef4444', '#f59e0b', '#8b5cf6', '#3b82f6', '#10b981',
        '#ec4899', '#6366f1', '#06b6d4', '#84cc16', '#f97316'
    ];
    
    // Crear datasets para cada categoría
    const datasets = Object.keys(expenseCategories).map((catName, index) => {
        const data = expenseCategories[catName];
        // Solo mostrar categorías que tengan al menos un valor > 0
        const hasData = data.some(v => v > 0);
        if (!hasData) return null;
        
        return {
            label: catName,
            data: data,
            borderColor: colors[index % colors.length],
            backgroundColor: colors[index % colors.length] + '20',
            tension: 0.4,
            fill: false
        };
    }).filter(d => d !== null);
    
    charts.expensesEvolution.data.labels = months;
    charts.expensesEvolution.data.datasets = datasets.length > 0 ? datasets : [{
        label: 'Gastos',
        data: new Array(months.length).fill(0),
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
        fill: true
    }];
    charts.expensesEvolution.update();
}

// Gráfica de préstamos pendientes
function updateLoansOutstandingChart() {
    if (!charts.loansPending) return;
    
    const period = getSelectedPeriod('loansPending');
    const loanFilter = document.querySelector('.chart-loan-filter[data-chart="loansPending"]');
    const selectedLoan = loanFilter ? loanFilter.value : 'all';
    
    let filteredLoans = loans;
    if (selectedLoan !== 'all') {
        filteredLoans = loans.filter(loan => (loan._id || loan.id) === selectedLoan);
    }
    const now = new Date();
    const months = [];
    const outstandingData = [];
    
    if (loans.length === 0) {
        charts.loansPending.data.labels = [];
        charts.loansPending.data.datasets = [];
        charts.loansPending.update();
        return;
    }
    
    // Calcular préstamos pendientes por mes
    const periodMonths = period === 999 ? 12 : period;
    
    for (let i = periodMonths - 1; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthKey = date.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
        months.push(monthKey);
        
        // Calcular préstamos pendientes en ese mes
        let totalOutstanding = 0;
        filteredLoans.forEach(loan => {
            const loanDate = new Date(loan.start_date);
            if (loanDate <= date) {
                // Calcular cuánto se ha pagado hasta esa fecha
                const paymentsUntilDate = loan.payments.filter(p => {
                    const pDate = new Date(p.date);
                    return pDate <= date;
                });
                const paidAmount = paymentsUntilDate.reduce((sum, p) => sum + p.amount, 0);
                const outstanding = loan.principal_amount - paidAmount;
                totalOutstanding += Math.max(0, outstanding);
            }
        });
        
        outstandingData.push(totalOutstanding);
    }
    
    charts.loansPending.data.labels = months;
    charts.loansPending.data.datasets = [{
        label: 'Préstamos Pendientes',
        data: outstandingData,
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        tension: 0.4,
        fill: true
    }];
    charts.loansPending.update();
}

// Gráfica de evolución del patrimonio
function updateAssetsEvolutionChart() {
    if (!charts.assetsEvolution) return;
    
    const period = getSelectedPeriod('assetsEvolution');
    const assetFilter = document.querySelector('.chart-asset-filter[data-chart="assetsEvolution"]');
    const selectedAsset = assetFilter ? assetFilter.value : 'all';
    
    let filteredAssets = assets;
    if (selectedAsset !== 'all') {
        filteredAssets = assets.filter(asset => (asset._id || asset.id) === selectedAsset);
    }
    const now = new Date();
    const months = [];
    const assetsData = [];
    
    if (assets.length === 0) {
        charts.assetsEvolution.data.labels = [];
        charts.assetsEvolution.data.datasets = [];
        charts.assetsEvolution.update();
        return;
    }
    
    const periodMonths = period === 999 ? 12 : period;
    
    for (let i = periodMonths - 1; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthKey = date.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
        months.push(monthKey);
        
        // Calcular patrimonio total en ese mes
        let totalAssets = 0;
        filteredAssets.forEach(asset => {
            const assetDate = new Date(asset.purchase_date);
            if (assetDate <= date) {
                // Buscar valor histórico más cercano a esa fecha
                let assetValue = asset.current_value || 0;
                if (asset.value_history && asset.value_history.length > 0) {
                    const historicalValues = asset.value_history.filter(v => {
                        const vDate = new Date(v.date);
                        return vDate <= date;
                    });
                    if (historicalValues.length > 0) {
                        const latest = historicalValues[historicalValues.length - 1];
                        assetValue = latest.value || asset.current_value || 0;
                    }
                }
                totalAssets += assetValue;
            }
        });
        
        assetsData.push(totalAssets);
    }
    
    charts.assetsEvolution.data.labels = months;
    charts.assetsEvolution.data.datasets = [{
        label: 'Patrimonio Total',
        data: assetsData,
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        tension: 0.4,
        fill: true
    }];
    charts.assetsEvolution.update();
}

// Gráfica de evolución de saldo en cuentas
function updateAccountsBalanceChart() {
    if (!charts.accountsBalance) return;
    
    const period = getSelectedPeriod('accountsBalance');
    const accountFilter = document.querySelector('.chart-account-filter[data-chart="accountsBalance"]');
    const selectedAccount = accountFilter ? accountFilter.value : 'all';
    
    let filteredAccounts = accounts;
    if (selectedAccount !== 'all') {
        filteredAccounts = accounts.filter(account => (account._id || account.id) === selectedAccount);
    }
    
    const now = new Date();
    const months = [];
    const balanceData = [];
    
    if (filteredAccounts.length === 0) {
        charts.accountsBalance.data.labels = [];
        charts.accountsBalance.data.datasets = [];
        charts.accountsBalance.update();
        return;
    }
    
    const periodTransactions = getTransactionsByPeriod('accountsBalance');
    const periodMonths = period === 999 ? 12 : period;
    
    for (let i = periodMonths - 1; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthKey = date.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
        months.push(monthKey);
        
        // Calcular saldo total de cuentas en ese mes
        let totalBalance = 0;
        filteredAccounts.forEach(account => {
            // Saldo inicial de la cuenta
            let accountBalance = account.balance || 0;
            
            // Sumar transacciones hasta esa fecha
            const accountTransactions = periodTransactions.filter(t => {
                const tDate = new Date(t.date);
                return tDate <= date && t.account_id === account._id;
            });
            
            accountTransactions.forEach(t => {
                if (t.type === 'income') {
                    accountBalance += t.amount;
                } else if (t.type === 'expense') {
                    accountBalance -= Math.abs(t.amount);
                }
            });
            
            totalBalance += accountBalance;
        });
        
        balanceData.push(totalBalance);
    }
    
    charts.accountsBalance.data.labels = months;
    charts.accountsBalance.data.datasets = [{
        label: 'Saldo Total',
        data: balanceData,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true
    }];
    charts.accountsBalance.update();
}

// Modal de gráfico detallado
let chartModalChart = null;
let currentChartType = null;

function openChartModal(chartType, title) {
    currentChartType = chartType;
    const modal = document.getElementById('chartModal');
    const modalTitle = document.getElementById('chartModalTitle');
    const modalControls = document.getElementById('chartModalControls');
    const modalCanvas = document.getElementById('chartModalCanvas');
    
    if (!modal || !modalTitle || !modalControls || !modalCanvas) return;
    
    modalTitle.textContent = title;
    modal.style.display = 'flex';
    
    // Limpiar canvas anterior
    if (chartModalChart) {
        chartModalChart.destroy();
        chartModalChart = null;
    }
    
    // Crear controles según el tipo de gráfico
    modalControls.innerHTML = '';
    
    // Obtener el período actual del gráfico pequeño
    const originalPeriodSelect = document.querySelector(`.chart-period-select[data-chart="${chartType}"]`);
    const currentPeriod = originalPeriodSelect ? originalPeriodSelect.value : '6';
    const isCustom = currentPeriod === 'custom';
    
    // Obtener fechas del gráfico pequeño si está en modo custom
    const originalStartDate = document.getElementById(`${chartType}StartDate`);
    const originalEndDate = document.getElementById(`${chartType}EndDate`);
    const startDateValue = (originalStartDate && originalStartDate.value) ? originalStartDate.value : '';
    const endDateValue = (originalEndDate && originalEndDate.value) ? originalEndDate.value : '';
    
    // Selector de período (todos los gráficos)
    const periodDiv = document.createElement('div');
    periodDiv.style.display = 'flex'; 
    periodDiv.style.alignItems = 'center';
    periodDiv.style.gap = '8px';
    periodDiv.innerHTML = `
        <label style="font-weight: 600; font-size: 14px;">Período:</label>
        <select id="modalChartPeriod" style="padding: 8px 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px; min-width: 150px;">
            <option value="1" ${currentPeriod === '1' ? 'selected' : ''}>1 mes</option>
            <option value="3" ${currentPeriod === '3' ? 'selected' : ''}>3 meses</option>
            <option value="6" ${currentPeriod === '6' || !isCustom ? 'selected' : ''}>6 meses</option>
            <option value="12" ${currentPeriod === '12' ? 'selected' : ''}>1 año</option>
            <option value="24" ${currentPeriod === '24' ? 'selected' : ''}>2 años</option>
            <option value="all" ${currentPeriod === 'all' ? 'selected' : ''}>Todo el historial</option>
            <option value="custom" ${isCustom ? 'selected' : ''}>Fecha personalizada</option>
        </select>
    `;
    modalControls.appendChild(periodDiv);
    
    // Contenedor para fechas personalizadas del modal
    const customDateRangeDiv = document.createElement('div');
    customDateRangeDiv.id = 'modalCustomDateRange';
    customDateRangeDiv.style.display = isCustom ? 'flex' : 'none';
    customDateRangeDiv.style.gap = '8px';
    customDateRangeDiv.style.flexWrap = 'wrap';
    customDateRangeDiv.style.flexDirection = 'row';
    customDateRangeDiv.style.marginTop = '8px';
    customDateRangeDiv.style.alignItems = 'center';
    customDateRangeDiv.style.width = '100%';
    customDateRangeDiv.innerHTML = `
        <label style="font-weight: 600; font-size: 14px; white-space: nowrap;">Desde:</label>
        <input type="date" id="modalStartDate" value="${startDateValue}" style="padding: 8px 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px; min-width: 150px; flex: 1;">
        <label style="font-weight: 600; font-size: 14px; white-space: nowrap;">Hasta:</label>
        <input type="date" id="modalEndDate" value="${endDateValue}" style="padding: 8px 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px; min-width: 150px; flex: 1;">
    `;
    modalControls.appendChild(customDateRangeDiv);
    
    // Filtros específicos según el tipo
    if (chartType === 'incomeEvolution' || chartType === 'expensesEvolution') {
        const filterDiv = document.createElement('div');
        filterDiv.style.display = 'flex';
        filterDiv.style.alignItems = 'center';
        filterDiv.style.gap = '8px';
        const filterType = chartType === 'incomeEvolution' ? 'income' : 'expense';
        const filterLabel = chartType === 'incomeEvolution' ? 'Categoría de Ingreso:' : 'Categoría de Gasto:';
        filterDiv.innerHTML = `
            <label style="font-weight: 600; font-size: 14px;">${filterLabel}</label>
            <select id="modalChartCategoryFilter" style="padding: 8px 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px; min-width: 200px;">
                <option value="all">Todas las categorías</option>
            </select>
        `;
        modalControls.appendChild(filterDiv);
        
        // Poblar categorías y sincronizar con el gráfico pequeño
        setTimeout(() => {
            const categorySelect = document.getElementById('modalChartCategoryFilter');
            if (categorySelect) {
                const cats = filterType === 'income' ? [...categories.income, ...customCategories.income] : [...categories.expense, ...customCategories.expense];
                cats.forEach(cat => {
                    const option = document.createElement('option');
                    option.value = cat.id;
                    option.textContent = cat.name;
                    categorySelect.appendChild(option);
                });
                
                // Sincronizar con el selector del gráfico pequeño
                const originalCategorySelect = document.querySelector(`.chart-category-filter[data-chart="${chartType}"]`);
                if (originalCategorySelect && originalCategorySelect.value) {
                    categorySelect.value = originalCategorySelect.value;
                }
            }
        }, 100);
    } else if (chartType === 'loansPending') {
        const filterDiv = document.createElement('div');
        filterDiv.style.display = 'flex';
        filterDiv.style.alignItems = 'center';
        filterDiv.style.gap = '8px';
        filterDiv.innerHTML = `
            <label style="font-weight: 600; font-size: 14px;">Préstamo:</label>
            <select id="modalChartLoanFilter" style="padding: 8px 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px; min-width: 200px;">
                <option value="all">Todos los préstamos</option>
            </select>
        `;
        modalControls.appendChild(filterDiv);
        
        setTimeout(() => {
            const loanSelect = document.getElementById('modalChartLoanFilter');
            if (loanSelect) {
                loans.forEach(loan => {
                    const option = document.createElement('option');
                    option.value = loan._id || loan.id;
                    option.textContent = loan.name || `Préstamo ${loan._id || loan.id}`;
                    loanSelect.appendChild(option);
                });
            }
        }, 100);
    } else if (chartType === 'assetsEvolution') {
        const filterDiv = document.createElement('div');
        filterDiv.style.display = 'flex';
        filterDiv.style.alignItems = 'center';
        filterDiv.style.gap = '8px';
        filterDiv.innerHTML = `
            <label style="font-weight: 600; font-size: 14px;">Bien:</label>
            <select id="modalChartAssetFilter" style="padding: 8px 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px; min-width: 200px;">
                <option value="all">Todos los bienes</option>
            </select>
        `;
        modalControls.appendChild(filterDiv);
        
        setTimeout(() => {
            const assetSelect = document.getElementById('modalChartAssetFilter');
            if (assetSelect) {
                assets.forEach(asset => {
                    const option = document.createElement('option');
                    option.value = asset._id || asset.id;
                    option.textContent = asset.name || `Bien ${asset._id || asset.id}`;
                    assetSelect.appendChild(option);
                });
            }
        }, 100);
    } else if (chartType === 'accountsBalance') {
        const filterDiv = document.createElement('div');
        filterDiv.style.display = 'flex';
        filterDiv.style.alignItems = 'center';
        filterDiv.style.gap = '8px';
        filterDiv.innerHTML = `
            <label style="font-weight: 600; font-size: 14px;">Cuenta:</label>
            <select id="modalChartAccountFilter" style="padding: 8px 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px; min-width: 200px;">
                <option value="all">Todas las cuentas</option>
            </select>
        `;
        modalControls.appendChild(filterDiv);
        
        setTimeout(() => {
            const accountSelect = document.getElementById('modalChartAccountFilter');
            if (accountSelect) {
                accounts.forEach(account => {
                    const option = document.createElement('option');
                    option.value = account._id || account.id;
                    option.textContent = account.name || `Cuenta ${account._id || account.id}`;
                    accountSelect.appendChild(option);
                });
            }
        }, 100);
    }
    
    // Event listeners para los controles con sincronización bidireccional
    setTimeout(() => {
        const periodSelect = document.getElementById('modalChartPeriod');
        if (periodSelect) {
            // Asegurar que el contenedor de fechas se muestre si ya está en modo custom al abrir
            const customDateRange = document.getElementById('modalCustomDateRange');
            if (customDateRange && periodSelect.value === 'custom') {
                customDateRange.style.display = 'flex';
            }
            
            periodSelect.onchange = () => {
                const value = periodSelect.value;
                const customDateRange = document.getElementById('modalCustomDateRange');
                if (customDateRange) {
                    if (value === 'custom') {
                        customDateRange.style.display = 'flex';
                        // Si no hay fechas, establecer valores por defecto
                        const modalStartDate = document.getElementById('modalStartDate');
                        const modalEndDate = document.getElementById('modalEndDate');
                        if (modalStartDate && !modalStartDate.value) {
                            const today = new Date();
                            const sixMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 6, 1);
                            modalStartDate.value = sixMonthsAgo.toISOString().split('T')[0];
                        }
                        if (modalEndDate && !modalEndDate.value) {
                            const today = new Date();
                            modalEndDate.value = today.toISOString().split('T')[0];
                        }
                    } else {
                        customDateRange.style.display = 'none';
                    }
                }
                // Sincronizar con el gráfico pequeño
                const originalPeriodSelect = document.querySelector(`.chart-period-select[data-chart="${chartType}"]`);
                if (originalPeriodSelect) {
                    originalPeriodSelect.value = value;
                    if (value === 'custom') {
                        const originalCustomDateRange = document.getElementById(`${chartType}CustomDateRange`);
                        if (originalCustomDateRange) {
                            originalCustomDateRange.style.display = 'flex';
                        }
                    } else {
                        const originalCustomDateRange = document.getElementById(`${chartType}CustomDateRange`);
                        if (originalCustomDateRange) {
                            originalCustomDateRange.style.display = 'none';
                        }
                    }
                }
                updateModalChart();
            };
        }
        
        // Listeners para fechas personalizadas del modal
        const modalStartDate = document.getElementById('modalStartDate');
        const modalEndDate = document.getElementById('modalEndDate');
        if (modalStartDate) {
            modalStartDate.onchange = () => {
                // Sincronizar con el gráfico pequeño
                const originalStartDate = document.getElementById(`${chartType}StartDate`);
                if (originalStartDate) {
                    originalStartDate.value = modalStartDate.value;
                }
                updateModalChart();
            };
        }
        if (modalEndDate) {
            modalEndDate.onchange = () => {
                // Sincronizar con el gráfico pequeño
                const originalEndDate = document.getElementById(`${chartType}EndDate`);
                if (originalEndDate) {
                    originalEndDate.value = modalEndDate.value;
                }
                updateModalChart();
            };
        }
        
        // Sincronizar filtros de categoría del modal con el gráfico pequeño
        const categoryFilter = document.getElementById('modalChartCategoryFilter');
        if (categoryFilter) {
            categoryFilter.onchange = () => {
                const originalCategorySelect = document.querySelector(`.chart-category-filter[data-chart="${chartType}"]`);
                if (originalCategorySelect) {
                    originalCategorySelect.value = categoryFilter.value;
                }
                updateModalChart();
            };
        }
        
        // Sincronizar filtros de préstamo
        const loanFilter = document.getElementById('modalChartLoanFilter');
        if (loanFilter) {
            loanFilter.onchange = () => {
                const originalLoanSelect = document.querySelector(`.chart-loan-filter[data-chart="${chartType}"]`);
                if (originalLoanSelect) {
                    originalLoanSelect.value = loanFilter.value;
                }
                updateModalChart();
            };
        }
        
        // Sincronizar filtros de bienes
        const assetFilter = document.getElementById('modalChartAssetFilter');
        if (assetFilter) {
            assetFilter.onchange = () => {
                const originalAssetSelect = document.querySelector(`.chart-asset-filter[data-chart="${chartType}"]`);
                if (originalAssetSelect) {
                    originalAssetSelect.value = assetFilter.value;
                }
                updateModalChart();
            };
        }
        
        // Sincronizar filtros de cuentas
        const accountFilter = document.getElementById('modalChartAccountFilter');
        if (accountFilter) {
            accountFilter.onchange = () => {
                const originalAccountSelect = document.querySelector(`.chart-account-filter[data-chart="${chartType}"]`);
                if (originalAccountSelect) {
                    originalAccountSelect.value = accountFilter.value;
                }
                updateModalChart();
            };
        }
        
        // Inicializar gráfico
        updateModalChart();
    }, 200);
}

function closeChartModal() {
    const modal = document.getElementById('chartModal');
    if (modal) {
        modal.style.display = 'none';
    }
    if (chartModalChart) {
        chartModalChart.destroy();
        chartModalChart = null;
    }
    currentChartType = null;
}

function updateModalChart() {
    if (!currentChartType) return;
    
    const modalCanvas = document.getElementById('chartModalCanvas');
    if (!modalCanvas) {
        console.warn('Canvas del modal no encontrado');
        return;
    }
    
    // Obtener período seleccionado
    const periodSelect = document.getElementById('modalChartPeriod');
    let period = periodSelect ? (periodSelect.value === 'all' ? 999 : (periodSelect.value === 'custom' ? 'custom' : parseInt(periodSelect.value) || 6)) : 6;
    
    // Si es fecha personalizada, obtener las fechas del modal
    if (period === 'custom') {
        const modalStartDate = document.getElementById('modalStartDate');
        const modalEndDate = document.getElementById('modalEndDate');
        if (modalStartDate && modalEndDate && modalStartDate.value && modalEndDate.value) {
            // Usar fechas personalizadas del modal
            period = 'custom';
        } else {
            // Si no hay fechas, usar período por defecto
            period = 6;
        }
    }
    
    // Obtener filtros adicionales
    let categoryFilter = 'all';
    let loanFilter = 'all';
    let assetFilter = 'all';
    let accountFilter = 'all';
    
    if (currentChartType === 'incomeEvolution' || currentChartType === 'expensesEvolution') {
        const categorySelect = document.getElementById('modalChartCategoryFilter');
        categoryFilter = categorySelect ? categorySelect.value : 'all';
    } else if (currentChartType === 'loansPending') {
        const loanSelect = document.getElementById('modalChartLoanFilter');
        loanFilter = loanSelect ? loanSelect.value : 'all';
    } else if (currentChartType === 'assetsEvolution') {
        const assetSelect = document.getElementById('modalChartAssetFilter');
        assetFilter = assetSelect ? assetSelect.value : 'all';
    } else if (currentChartType === 'accountsBalance') {
        const accountSelect = document.getElementById('modalChartAccountFilter');
        accountFilter = accountSelect ? accountSelect.value : 'all';
    }
    
    // Si es fecha personalizada del modal, sincronizar con el gráfico pequeño
    if (period === 'custom') {
        const modalStartDate = document.getElementById('modalStartDate');
        const modalEndDate = document.getElementById('modalEndDate');
        const originalStartDate = document.getElementById(`${currentChartType}StartDate`);
        const originalEndDate = document.getElementById(`${currentChartType}EndDate`);
        
        if (modalStartDate && modalEndDate && originalStartDate && originalEndDate) {
            originalStartDate.value = modalStartDate.value;
            originalEndDate.value = modalEndDate.value;
        }
    }
    
    // Actualizar el período en el selector del gráfico original temporalmente
    const originalPeriodSelect = document.querySelector(`.chart-period-select[data-chart="${currentChartType}"]`);
    if (originalPeriodSelect && periodSelect) {
        originalPeriodSelect.value = periodSelect.value;
    }
    
    // Aplicar filtros a los selectores originales si existen
    if (currentChartType === 'incomeEvolution' || currentChartType === 'expensesEvolution') {
        const originalCategorySelect = document.querySelector(`.chart-category-filter[data-chart="${currentChartType}"]`);
        if (originalCategorySelect && categoryFilter !== 'all') {
            originalCategorySelect.value = categoryFilter;
        }
    } else if (currentChartType === 'loansPending') {
        const originalLoanSelect = document.querySelector(`.chart-loan-filter[data-chart="${currentChartType}"]`);
        if (originalLoanSelect && loanFilter !== 'all') {
            originalLoanSelect.value = loanFilter;
        }
    } else if (currentChartType === 'assetsEvolution') {
        const originalAssetSelect = document.querySelector(`.chart-asset-filter[data-chart="${currentChartType}"]`);
        if (originalAssetSelect && assetFilter !== 'all') {
            originalAssetSelect.value = assetFilter;
        }
    } else if (currentChartType === 'accountsBalance') {
        const originalAccountSelect = document.querySelector(`.chart-account-filter[data-chart="${currentChartType}"]`);
        if (originalAccountSelect && accountFilter !== 'all') {
            originalAccountSelect.value = accountFilter;
        }
    }
    
    // Actualizar el gráfico original con el nuevo período y filtros
    updateSingleChart(currentChartType);
    
    // Esperar un momento para que el gráfico se actualice
    setTimeout(() => {
        // Obtener el gráfico original actualizado
        let originalChart = null;
        switch(currentChartType) {
            case 'savings':
                originalChart = charts.savings;
                break;
            case 'expenses':
                originalChart = charts.expenses;
                break;
            case 'incomeExpense':
                originalChart = charts.incomeExpense;
                break;
            case 'distribution':
                originalChart = charts.distribution;
                break;
            case 'incomeEvolution':
                originalChart = charts.incomeEvolution;
                break;
            case 'expensesEvolution':
                originalChart = charts.expensesEvolution;
                break;
            case 'loansPending':
                originalChart = charts.loansPending;
                break;
            case 'assetsEvolution':
                originalChart = charts.assetsEvolution;
                break;
            case 'accountsBalance':
                originalChart = charts.accountsBalance;
                break;
        }
        
        if (originalChart && originalChart.data) {
            // Destruir gráfico anterior del modal
            if (chartModalChart) {
                chartModalChart.destroy();
                chartModalChart = null;
            }
            
            // Clonar datos del gráfico original
            const clonedData = JSON.parse(JSON.stringify(originalChart.data));
            
            // Crear nuevo gráfico en el modal
            chartModalChart = new Chart(modalCanvas, {
                type: originalChart.config.type,
                data: clonedData,
                options: {
                    ...originalChart.options,
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        ...originalChart.options.plugins,
                        legend: {
                            display: true,
                            position: 'top'
                        }
                    }
                }
            });
        } else {
            console.warn('Gráfico original no encontrado o sin datos:', currentChartType);
        }
    }, 100);
}

// Exponer funciones globalmente
window.openChartModal = openChartModal;
window.closeChartModal = closeChartModal;

// Mostrar modal para agregar categoría personalizada
function showAddCustomCategoryModal() {
    const modal = document.getElementById('customCategoryModal');
    if (!modal) return;
    
    // Resetear formulario
    const form = document.getElementById('customCategoryForm');
    if (form) {
        form.reset();
    }
    
    // Mostrar modal
    modal.style.display = 'flex';
}

// Cerrar modal de categoría personalizada
function closeCustomCategoryModal() {
    const modal = document.getElementById('customCategoryModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Agregar categoría personalizada desde el formulario
async function addCustomCategory() {
    const type = document.getElementById('customCategoryType')?.value;
    const parentValue = document.getElementById('customCategoryParent')?.value;
    const name = document.getElementById('customCategoryName')?.value?.trim();
    const subcategoriesInput = document.getElementById('customCategorySubcategories')?.value?.trim();
    
    if (!type) {
        alert('Por favor, selecciona el tipo de categoría (Ingreso o Gasto).');
        return;
    }
    
    const categoryType = type;
    
    // Si se seleccionó una categoría padre, agregar subcategorías
    if (parentValue) {
        const [parentType, parentId] = parentValue.split('_');
        const parentCategory = customCategories[parentType].find(c => c.id === parentId);
        
        if (!parentCategory) {
            alert('Error: Categoría padre no encontrada.');
            return;
        }
        
        if (!subcategoriesInput || !subcategoriesInput.trim()) {
            alert('Por favor, ingresa al menos una subcategoría.');
            return;
        }
        
        const newSubcategories = subcategoriesInput.split(',').map(s => s.trim()).filter(s => s);
        
        // Agregar subcategorías a la categoría existente
        if (!parentCategory.subcategories) {
            parentCategory.subcategories = [];
        }
        
        // Agregar solo las subcategorías que no existan
        newSubcategories.forEach(sub => {
            if (!parentCategory.subcategories.includes(sub)) {
                parentCategory.subcategories.push(sub);
            }
        });
        
        // Guardar en localStorage
        localStorage.setItem('veedor_customCategories', JSON.stringify(customCategories));
        
        // Recargar categorías
        initializeCategories();
        
        // Cerrar modal
        closeCustomCategoryModal();
        
        alert(`✅ ${newSubcategories.length} subcategoría(s) agregada(s) a "${parentCategory.name}"`);
    } else {
        // Crear nueva categoría
        if (!name) {
            alert('Por favor, ingresa un nombre para la categoría.');
            return;
        }
        
        const subcategories = subcategoriesInput ? subcategoriesInput.split(',').map(s => s.trim()).filter(s => s) : [];
        
        const newCategory = {
            id: Date.now().toString(),
            name: name,
            subcategories: subcategories.length > 0 ? subcategories : ['General']
        };
        
        customCategories[categoryType].push(newCategory);
        
        // Guardar en localStorage
        localStorage.setItem('veedor_customCategories', JSON.stringify(customCategories));
        
        // Recargar categorías
        initializeCategories();
        
        // Cerrar modal
        closeCustomCategoryModal();
        
        alert(`✅ Categoría "${name}" agregada exitosamente`);
    }
}

// Cargar categorías personalizadas
function loadCustomCategories() {
    const saved = localStorage.getItem('veedor_customCategories');
    if (saved) {
        try {
            customCategories = JSON.parse(saved);
        } catch (e) {
            console.error('Error cargando categorías personalizadas:', e);
        }
    }
}

// Actualizar panel de mandos del mes seleccionado
function updateMonthDashboard() {
    const dashboardMonthInput = document.getElementById('dashboardMonth');
    const monthDashboard = document.getElementById('monthDashboard');
    
    if (!dashboardMonthInput || !monthDashboard) return;
    
    const selectedMonth = dashboardMonthInput.value;
    if (!selectedMonth) {
        monthDashboard.style.display = 'none';
        return;
    }
    
    monthDashboard.style.display = 'block';
    
    const [year, month] = selectedMonth.split('-').map(Number);
    const monthIndex = month - 1;
    
    // Filtrar transacciones del mes seleccionado
    const monthTransactions = transactions.filter(t => {
        const tDate = new Date(t.date);
        return tDate.getMonth() === monthIndex && tDate.getFullYear() === year;
    });
    
    const monthExpenses = monthTransactions.filter(t => t.type === 'expense');
    const monthIncome = monthTransactions.filter(t => t.type === 'income');
    
    // Gastos por categoría
    const expensesByCategory = {};
    monthExpenses.forEach(t => {
        const catId = t.categoryGeneral;
        if (!expensesByCategory[catId]) {
            expensesByCategory[catId] = { amount: 0, transactions: [] };
        }
        expensesByCategory[catId].amount += Math.abs(t.amount);
        expensesByCategory[catId].transactions.push(t);
    });
    
    const expensesContainer = document.getElementById('monthExpensesByCategory');
    if (expensesContainer) {
        expensesContainer.innerHTML = '';
        
        if (Object.keys(expensesByCategory).length === 0) {
            expensesContainer.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--gray-500);">No hay gastos registrados para este mes</div>';
        } else {
            Object.entries(expensesByCategory).forEach(([catId, data]) => {
                const category = categories.expense.find(c => c.id === catId) || 
                               customCategories.expense.find(c => c.id === catId);
                const categoryName = category ? category.name : catId;
                
                // Buscar presupuesto para esta categoría en este mes
                const budget = budgets.find(b => b.period_type === 'monthly' && b.period_value === selectedMonth && b.category_id === catId);
                const budgetAmount = budget ? budget.amount : 0;
                const percentage = budgetAmount > 0 ? (data.amount / budgetAmount) * 100 : 0;
                
                let progressColor = '#10b981'; // Verde
                if (percentage > 80 && percentage <= 100) {
                    progressColor = '#fbbf24'; // Amarillo
                } else if (percentage > 100) {
                    progressColor = '#ef4444'; // Rojo
                }
                
                const card = document.createElement('div');
                card.style.cssText = 'background: var(--bg-primary); padding: 20px; border-radius: var(--radius); border: 1px solid var(--border-color); box-shadow: var(--shadow-light); cursor: pointer; transition: all 0.2s; color: var(--text-primary);';
                card.onmouseover = function() {
                    this.style.transform = 'translateY(-2px)';
                    this.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.12)';
                    this.style.borderColor = 'var(--primary)';
                };
                card.onmouseout = function() {
                    this.style.transform = 'translateY(0)';
                    this.style.boxShadow = 'var(--shadow-light)';
                    this.style.borderColor = 'var(--border-color)';
                };
                card.onclick = () => showCategoryDetails(categoryName, data.transactions, 'expense', selectedMonth, catId, budgetAmount);
                card.innerHTML = `
                    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 12px;">
                        <div>
                            <h5 style="font-size: 16px; font-weight: 700; margin: 0 0 4px 0; color: var(--text-primary);">${categoryName}</h5>
                            <p style="font-size: 14px; color: var(--text-secondary); margin: 0;">${data.transactions.length} ${data.transactions.length !== 1 ? 'transacciones' : 'transacción'}</p>
                        </div>
                        <div style="text-align: right;">
                            <p style="font-size: 20px; font-weight: 700; margin: 0; color: var(--danger-color);">${formatCurrency(data.amount)}</p>
                            ${budgetAmount > 0 ? `<small style="color: var(--text-tertiary);">de ${formatCurrency(budgetAmount)}</small>` : ''}
                        </div>
                    </div>
                    ${budgetAmount > 0 ? `
                        <div style="margin-top: 12px;">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                                <small style="font-size: 12px; color: var(--text-secondary);">Progreso del presupuesto</small>
                                <small style="font-size: 12px; font-weight: 600; color: ${progressColor};">${percentage.toFixed(1)}%</small>
                            </div>
                            <div style="background: var(--gray-200); border-radius: 4px; height: 8px; overflow: hidden;">
                                <div style="background: ${progressColor}; height: 100%; width: ${Math.min(percentage, 100)}%; transition: width 0.3s;"></div>
                            </div>
                            <div style="display: flex; justify-content: space-between; margin-top: 8px;">
                                <small style="font-size: 11px; color: var(--text-tertiary);">Restante: ${formatCurrency(Math.max(0, budgetAmount - data.amount))}</small>
                                ${percentage > 100 ? `<small style="font-size: 11px; color: var(--danger-color); font-weight: 600;">⚠️ Excedido</small>` : ''}
                            </div>
                        </div>
                    ` : '<small style="color: var(--text-tertiary);">Sin presupuesto establecido</small>'}
                    <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid var(--border-color);">
                        <small style="color: var(--primary); font-weight: 500;">👆 Click para ver detalles</small>
                    </div>
                `;
                expensesContainer.appendChild(card);
            });
        }
    }
    
    // Ingresos por categoría
    const incomeByCategory = {};
    monthIncome.forEach(t => {
        const catId = t.categoryGeneral;
        if (!incomeByCategory[catId]) {
            incomeByCategory[catId] = { amount: 0, transactions: [] };
        }
        incomeByCategory[catId].amount += t.amount;
        incomeByCategory[catId].transactions.push(t);
    });
    
    const incomeContainer = document.getElementById('monthIncomeByCategory');
    if (incomeContainer) {
        incomeContainer.innerHTML = '';
        
        if (Object.keys(incomeByCategory).length === 0) {
            incomeContainer.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--gray-500);">No hay ingresos registrados para este mes</div>';
        } else {
            Object.entries(incomeByCategory).forEach(([catId, data]) => {
                const category = categories.income.find(c => c.id === catId) || 
                               customCategories.income.find(c => c.id === catId);
                const categoryName = category ? category.name : catId;
                
                // Buscar presupuesto para esta categoría en este mes
                const budget = budgets.find(b => b.period_type === 'monthly' && b.period_value === selectedMonth && b.category_id === catId);
                const budgetAmount = budget ? budget.amount : 0;
                const percentage = budgetAmount > 0 ? (data.amount / budgetAmount) * 100 : 0;
                
                let progressColor = '#10b981'; // Verde
                if (percentage < 80) {
                    progressColor = '#fbbf24'; // Amarillo
                } else if (percentage < 100) {
                    progressColor = '#10b981'; // Verde
                }
                
                const card = document.createElement('div');
                card.style.cssText = 'background: var(--bg-primary); padding: 20px; border-radius: var(--radius); border: 1px solid var(--border-color); box-shadow: var(--shadow-light); cursor: pointer; transition: all 0.2s; color: var(--text-primary);';
                card.onmouseover = function() {
                    this.style.transform = 'translateY(-2px)';
                    this.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.12)';
                    this.style.borderColor = 'var(--primary)';
                };
                card.onmouseout = function() {
                    this.style.transform = 'translateY(0)';
                    this.style.boxShadow = 'var(--shadow-light)';
                    this.style.borderColor = 'var(--border-color)';
                };
                card.onclick = () => showCategoryDetails(categoryName, data.transactions, 'income', selectedMonth, catId, budgetAmount);
                card.innerHTML = `
                    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 12px;">
                        <div>
                            <h5 style="font-size: 16px; font-weight: 700; margin: 0 0 4px 0; color: var(--text-primary);">${categoryName}</h5>
                            <p style="font-size: 14px; color: var(--text-secondary); margin: 0;">${data.transactions.length} ${data.transactions.length !== 1 ? 'transacciones' : 'transacción'}</p>
                        </div>
                        <div style="text-align: right;">
                            <p style="font-size: 20px; font-weight: 700; margin: 0; color: var(--success);">${formatCurrency(data.amount)}</p>
                            ${budgetAmount > 0 ? `<small style="color: var(--text-tertiary);">de ${formatCurrency(budgetAmount)}</small>` : ''}
                        </div>
                    </div>
                    ${budgetAmount > 0 ? `
                        <div style="margin-top: 12px;">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                                <small style="font-size: 12px; color: var(--text-secondary);">Progreso del presupuesto</small>
                                <small style="font-size: 12px; font-weight: 600; color: ${progressColor};">${percentage.toFixed(1)}%</small>
                            </div>
                            <div style="background: var(--gray-200); border-radius: 4px; height: 8px; overflow: hidden;">
                                <div style="background: ${progressColor}; height: 100%; width: ${Math.min(percentage, 100)}%; transition: width 0.3s;"></div>
                            </div>
                            <div style="display: flex; justify-content: space-between; margin-top: 8px;">
                                <small style="font-size: 11px; color: var(--text-tertiary);">Diferencia: ${formatCurrency(data.amount - budgetAmount)}</small>
                                ${percentage < 100 ? `<small style="font-size: 11px; color: var(--warning); font-weight: 600;">⚠️ Por debajo del presupuesto</small>` : ''}
                            </div>
                        </div>
                    ` : '<small style="color: var(--text-tertiary);">Sin presupuesto establecido</small>'}
                    <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid var(--border-color);">
                        <small style="color: var(--primary); font-weight: 500;">👆 Click para ver detalles</small>
                    </div>
                `;
                incomeContainer.appendChild(card);
            });
        }
    }
    
    // Estado de presupuestos del mes (ingresos y gastos)
    const monthBudgets = budgets.filter(b => b.period_type === 'monthly' && b.period_value === selectedMonth);
    const budgetsStatusContainer = document.getElementById('monthBudgetsStatus');
    if (budgetsStatusContainer) {
        budgetsStatusContainer.innerHTML = '';
        
        if (monthBudgets.length === 0) {
            budgetsStatusContainer.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--gray-500);">No hay presupuestos establecidos para este mes</div>';
        } else {
            // Separar presupuestos de ingresos y gastos
            const incomeBudgets = [];
            const expenseBudgets = [];
            
            monthBudgets.forEach(budget => {
                // Determinar si es ingreso o gasto
                let category = categories.expense.find(c => c.id === budget.category_id) || 
                              customCategories.expense.find(c => c.id === budget.category_id);
                if (category) {
                    expenseBudgets.push({ budget, category, isIncome: false });
                } else {
                    category = categories.income.find(c => c.id === budget.category_id) || 
                              customCategories.income.find(c => c.id === budget.category_id);
                    if (category) {
                        incomeBudgets.push({ budget, category, isIncome: true });
                    }
                }
            });
            
            // Mostrar resumen general primero
            const totalIncomeBudget = incomeBudgets.reduce((sum, b) => sum + b.budget.amount, 0);
            const totalExpenseBudget = expenseBudgets.reduce((sum, b) => sum + b.budget.amount, 0);
            const totalIncomeActual = monthIncome.reduce((sum, t) => sum + t.amount, 0);
            const totalExpenseActual = monthExpenses.reduce((sum, t) => sum + Math.abs(t.amount), 0);
            
            if (totalIncomeBudget > 0 || totalExpenseBudget > 0) {
                const summaryCard = document.createElement('div');
                summaryCard.style.cssText = 'background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%); padding: 24px; border-radius: var(--radius); border: none; box-shadow: var(--shadow-light); color: white; grid-column: 1/-1;';
                summaryCard.innerHTML = `
                    <h5 style="font-size: 18px; font-weight: 700; margin: 0 0 20px 0; color: white;">📊 Resumen del Mes</h5>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px;">
                        <div>
                            <div style="font-size: 12px; opacity: 0.9; margin-bottom: 6px;">Presupuesto Ingresos</div>
                            <div style="font-size: 24px; font-weight: 700;">${formatCurrency(totalIncomeBudget)}</div>
                            <div style="font-size: 14px; margin-top: 4px; opacity: 0.8;">Real: ${formatCurrency(totalIncomeActual)}</div>
                            <div style="font-size: 12px; margin-top: 4px; color: ${totalIncomeActual >= totalIncomeBudget ? '#D1FAE5' : '#FEE2E2'};">
                                ${totalIncomeBudget > 0 ? ((totalIncomeActual / totalIncomeBudget) * 100).toFixed(1) + '%' : '-'}
                            </div>
                        </div>
                        <div>
                            <div style="font-size: 12px; opacity: 0.9; margin-bottom: 6px;">Presupuesto Gastos</div>
                            <div style="font-size: 24px; font-weight: 700;">${formatCurrency(totalExpenseBudget)}</div>
                            <div style="font-size: 14px; margin-top: 4px; opacity: 0.8;">Real: ${formatCurrency(totalExpenseActual)}</div>
                            <div style="font-size: 12px; margin-top: 4px; color: ${totalExpenseActual <= totalExpenseBudget ? '#D1FAE5' : '#FEE2E2'};">
                                ${totalExpenseBudget > 0 ? ((totalExpenseActual / totalExpenseBudget) * 100).toFixed(1) + '%' : '-'}
                            </div>
                        </div>
                        <div>
                            <div style="font-size: 12px; opacity: 0.9; margin-bottom: 6px;">Ahorro Previsto</div>
                            <div style="font-size: 24px; font-weight: 700;">${formatCurrency(totalIncomeBudget - totalExpenseBudget)}</div>
                            <div style="font-size: 14px; margin-top: 4px; opacity: 0.8;">Real: ${formatCurrency(totalIncomeActual - totalExpenseActual)}</div>
                        </div>
                    </div>
                `;
                budgetsStatusContainer.appendChild(summaryCard);
            }
            
            // Mostrar presupuestos de ingresos
            incomeBudgets.forEach(({ budget, category, isIncome }) => {
                const categoryIncome = monthIncome.filter(t => t.categoryGeneral === budget.category_id);
                const actual = categoryIncome.reduce((sum, t) => sum + t.amount, 0);
                const difference = actual - budget.amount;
                const percentage = budget.amount > 0 ? (actual / budget.amount) * 100 : 0;
                const isUnderBudget = actual < budget.amount;
                
                let progressColor = '#10b981';
                if (percentage < 80) {
                    progressColor = '#fbbf24';
                } else if (percentage < 100) {
                    progressColor = '#10b981';
                }
                
                const card = document.createElement('div');
                card.style.cssText = 'background: white; padding: 20px; border-radius: var(--radius); border: 1px solid var(--border-color); box-shadow: var(--shadow-light); border-left: 4px solid var(--success);';
                card.innerHTML = `
                    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 12px;">
                        <h5 style="font-size: 16px; font-weight: 700; margin: 0; color: var(--gray-900);">${category.name}</h5>
                        <span style="font-size: 11px; padding: 4px 8px; background: var(--success-light); border-radius: var(--radius); color: var(--success-dark); font-weight: 600;">💰 Ingreso</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                        <span style="font-size: 14px; color: var(--gray-600);">Presupuesto:</span>
                        <span style="font-size: 14px; font-weight: 600; color: var(--gray-900);">${formatCurrency(budget.amount)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                        <span style="font-size: 14px; color: var(--gray-600);">Ingresado:</span>
                        <span style="font-size: 14px; font-weight: 600; color: var(--success);">${formatCurrency(actual)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                        <span style="font-size: 14px; color: var(--gray-600);">Diferencia:</span>
                        <span style="font-size: 14px; font-weight: 600; color: ${difference >= 0 ? 'var(--success)' : 'var(--warning)'};">${formatCurrency(Math.abs(difference))}</span>
                    </div>
                    <div style="background: var(--gray-200); border-radius: 4px; height: 8px; overflow: hidden; margin-bottom: 4px;">
                        <div style="background: ${progressColor}; height: 100%; width: ${Math.min(percentage, 100)}%; transition: width 0.3s;"></div>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <small style="font-size: 11px; color: var(--gray-500);">${categoryIncome.length} transacciones</small>
                        <small style="font-size: 11px; font-weight: 600; color: ${progressColor};">${percentage.toFixed(1)}%</small>
                    </div>
                    ${isUnderBudget ? '<div style="margin-top: 8px; padding: 6px; background: #FEF3C7; border-radius: var(--radius); color: var(--warning-dark); font-size: 11px; font-weight: 600;">⚠️ Por debajo del presupuesto</div>' : ''}
                `;
                budgetsStatusContainer.appendChild(card);
            });
            
            // Mostrar presupuestos de gastos
            expenseBudgets.forEach(({ budget, category, isIncome }) => {
                const categoryExpenses = monthExpenses.filter(t => t.categoryGeneral === budget.category_id);
                const spent = categoryExpenses.reduce((sum, t) => sum + Math.abs(t.amount), 0);
                const remaining = budget.amount - spent;
                const percentage = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;
                const isOverBudget = spent > budget.amount;
                
                let progressColor = '#10b981';
                if (percentage > 80 && percentage <= 100) {
                    progressColor = '#fbbf24';
                } else if (percentage > 100) {
                    progressColor = '#ef4444';
                }
                
                const card = document.createElement('div');
                card.style.cssText = 'background: white; padding: 20px; border-radius: var(--radius); border: 1px solid var(--border-color); box-shadow: var(--shadow-light); border-left: 4px solid ' + (isOverBudget ? 'var(--danger)' : progressColor) + ';';
                card.innerHTML = `
                    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 12px;">
                        <h5 style="font-size: 16px; font-weight: 700; margin: 0; color: var(--gray-900);">${category.name}</h5>
                        <span style="font-size: 11px; padding: 4px 8px; background: var(--gray-100); border-radius: var(--radius); color: var(--gray-700); font-weight: 600;">💸 Gasto</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                        <span style="font-size: 14px; color: var(--gray-600);">Presupuesto:</span>
                        <span style="font-size: 14px; font-weight: 600; color: var(--gray-900);">${formatCurrency(budget.amount)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                        <span style="font-size: 14px; color: var(--gray-600);">Gastado:</span>
                        <span style="font-size: 14px; font-weight: 600; color: var(--danger);">${formatCurrency(spent)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                        <span style="font-size: 14px; color: var(--gray-600);">Restante:</span>
                        <span style="font-size: 14px; font-weight: 600; color: ${remaining >= 0 ? 'var(--success)' : 'var(--danger)'};">${formatCurrency(remaining)}</span>
                    </div>
                    <div style="background: var(--gray-200); border-radius: 4px; height: 8px; overflow: hidden; margin-bottom: 4px;">
                        <div style="background: ${progressColor}; height: 100%; width: ${Math.min(percentage, 100)}%; transition: width 0.3s;"></div>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <small style="font-size: 11px; color: var(--gray-500);">${categoryExpenses.length} transacciones</small>
                        <small style="font-size: 11px; font-weight: 600; color: ${progressColor};">${percentage.toFixed(1)}% usado</small>
                    </div>
                    ${isOverBudget ? '<div style="margin-top: 8px; padding: 6px; background: #FEE2E2; border-radius: var(--radius); color: var(--danger); font-size: 11px; font-weight: 600;">⚠️ Presupuesto excedido</div>' : ''}
                `;
                budgetsStatusContainer.appendChild(card);
            });
        }
    }
    
    // Estado de sobres del mes
    const envelopesStatusContainer = document.getElementById('monthEnvelopesStatus');
    if (envelopesStatusContainer) {
        envelopesStatusContainer.innerHTML = '';
        
        if (envelopes.length === 0) {
            envelopesStatusContainer.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--gray-500);">No hay sobres creados</div>';
        } else {
            envelopes.forEach(envelope => {
                const envelopeTransactions = monthTransactions.filter(t => t.envelope === envelope.name);
                const spent = envelopeTransactions.reduce((sum, t) => sum + Math.abs(t.amount), 0);
                const remaining = envelope.budget - spent;
                const percentage = (spent / envelope.budget) * 100;
                
                let progressColor = '#10b981';
                if (percentage > 80 && percentage <= 100) {
                    progressColor = '#fbbf24';
                } else if (percentage > 100) {
                    progressColor = '#ef4444';
                }
                
                const card = document.createElement('div');
                card.style.cssText = 'background: var(--bg-primary); padding: 20px; border-radius: var(--radius); border: 1px solid var(--border-color); box-shadow: var(--shadow-light); color: var(--text-primary);';
                card.innerHTML = `
                    <h5 style="font-size: 16px; font-weight: 700; margin: 0 0 12px 0; color: var(--text-primary);">${envelope.name}</h5>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                        <span style="font-size: 14px; color: var(--text-secondary);">Presupuesto:</span>
                        <span style="font-size: 14px; font-weight: 600; color: var(--text-primary);">${formatCurrency(envelope.budget)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                        <span style="font-size: 14px; color: var(--text-secondary);">Gastado:</span>
                        <span style="font-size: 14px; font-weight: 600; color: var(--danger-color);">${formatCurrency(spent)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                        <span style="font-size: 14px; color: var(--text-secondary);">Restante:</span>
                        <span style="font-size: 14px; font-weight: 600; color: ${remaining >= 0 ? 'var(--success-color)' : 'var(--danger-color)'};">${formatCurrency(remaining)}</span>
                    </div>
                    <div style="background: var(--gray-200); border-radius: 4px; height: 8px; overflow: hidden; margin-bottom: 4px;">
                        <div style="background: ${progressColor}; height: 100%; width: ${Math.min(percentage, 100)}%; transition: width 0.3s;"></div>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <small style="font-size: 11px; color: var(--text-tertiary);">${envelopeTransactions.length} transacciones</small>
                        <small style="font-size: 11px; font-weight: 600; color: ${progressColor};">${percentage.toFixed(1)}% usado</small>
                    </div>
                `;
                envelopesStatusContainer.appendChild(card);
            });
        }
    }
}

// ==================== MODAL DE DETALLES DE CATEGORÍA ====================
function showCategoryDetails(categoryName, transactions, type, month, categoryId, budgetAmount) {
    const modal = document.getElementById('categoryDetailsModal');
    const modalTitle = document.getElementById('categoryDetailsModalTitle');
    const modalContent = document.getElementById('categoryDetailsContent');
    
    if (!modal || !modalTitle || !modalContent) {
        console.error('Modal elements not found');
        return;
    }
    
    const [year, monthNum] = month.split('-');
    const monthName = new Date(year, parseInt(monthNum) - 1, 1).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
    
    modalTitle.textContent = `${categoryName} - ${monthName}`;
    
    const total = transactions.reduce((sum, t) => sum + (type === 'expense' ? Math.abs(t.amount) : t.amount), 0);
    
    let content = `
        <div style="margin-bottom: 24px;">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 24px;">
                <div style="background: ${type === 'expense' ? 'var(--danger)' : 'var(--success)'}; padding: 20px; border-radius: 12px; color: white;">
                    <div style="font-size: 14px; opacity: 0.9; margin-bottom: 8px;">Total ${type === 'expense' ? 'Gastado' : 'Ingresado'}</div>
                    <div style="font-size: 28px; font-weight: 700;">${formatCurrency(total)}</div>
                </div>
                <div style="background: var(--bg-tertiary); padding: 20px; border-radius: 12px; border: 1px solid var(--border-color);">
                    <div style="font-size: 14px; color: var(--text-secondary); margin-bottom: 8px;">Transacciones</div>
                    <div style="font-size: 28px; font-weight: 700; color: var(--text-primary);">${transactions.length}</div>
                </div>
                ${budgetAmount > 0 ? `
                    <div style="background: var(--primary-light); padding: 20px; border-radius: 12px; border: 1px solid var(--border-color);">
                        <div style="font-size: 14px; color: var(--primary); margin-bottom: 8px;">Presupuesto</div>
                        <div style="font-size: 28px; font-weight: 700; color: var(--primary-dark);">${formatCurrency(budgetAmount)}</div>
                    </div>
                ` : ''}
            </div>
        </div>
        
        <div>
            <h3 style="font-size: 18px; font-weight: 700; margin-bottom: 16px; color: var(--text-primary);">Transacciones</h3>
            <div class="table-container">
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="background: var(--bg-tertiary); border-bottom: 2px solid var(--border-color);">
                            <th style="padding: 12px; text-align: left; font-weight: 600; font-size: 13px; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.5px;">Fecha</th>
                            <th style="padding: 12px; text-align: left; font-weight: 600; font-size: 13px; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.5px;">Descripción</th>
                            <th style="padding: 12px; text-align: left; font-weight: 600; font-size: 13px; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.5px;">Subcategoría</th>
                            <th style="padding: 12px; text-align: right; font-weight: 600; font-size: 13px; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.5px;">Monto</th>
                        </tr>
                    </thead>
                    <tbody>
    `;
    
    const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    if (sortedTransactions.length === 0) {
        content += '<tr><td colspan="4" style="text-align: center; padding: 40px; color: var(--text-tertiary);">No hay transacciones</td></tr>';
    } else {
        sortedTransactions.forEach(t => {
            const date = new Date(t.date);
            const amount = type === 'expense' ? Math.abs(t.amount) : t.amount;
            content += `
                <tr style="border-bottom: 1px solid var(--border-color); transition: background-color 0.2s;" onmouseover="this.style.background='var(--bg-tertiary)'" onmouseout="this.style.background='transparent'">
                    <td style="padding: 12px; color: var(--text-secondary);">${formatDate(date)}</td>
                    <td style="padding: 12px; color: var(--text-secondary);">${t.description || '-'}</td>
                    <td style="padding: 12px; color: var(--text-secondary);">${t.categorySpecific || '-'}</td>
                    <td style="padding: 12px; text-align: right; font-weight: 600; color: ${type === 'expense' ? 'var(--danger)' : 'var(--success)'};">${formatCurrency(amount)}</td>
                </tr>
            `;
        });
    }
    
    content += `
                    </tbody>
                </table>
            </div>
        </div>
    `;
    
    modalContent.innerHTML = content;
    modal.style.display = 'flex';
}

function closeCategoryDetailsModal() {
    const modal = document.getElementById('categoryDetailsModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Exponer funciones globales
window.showCategoryDetails = showCategoryDetails;
window.closeCategoryDetailsModal = closeCategoryDetailsModal;

// Exportar datos
function exportData() {
    if (!currentUser) return;
    
    const date = new Date().toISOString().split('T')[0];
    const timestamp = new Date().toISOString();
    
    // Crear CSV completo con múltiples secciones
    let csv = `VEEDOR - EXPORTACIÓN COMPLETA DE DATOS FINANCIEROS\n`;
    csv += `Usuario: ${currentUser}\n`;
    csv += `Fecha de exportación: ${new Date().toLocaleDateString('es-ES')}\n`;
    csv += `\n`;
    
    // ========== TRANSACCIONES ==========
    csv += `\n========== TRANSACCIONES ==========\n`;
    csv += `Fecha,Tipo,Categoría General,Categoría Específica,Descripción,Sobre,Monto (€)\n`;
    transactions.forEach(t => {
        const transDate = new Date(t.date).toLocaleDateString('es-ES');
        const type = t.type === 'income' ? 'Ingreso' : 'Gasto';
        const description = (t.description || '').replace(/"/g, '""');
        csv += `"${transDate}","${type}","${t.categoryGeneral}","${t.categorySpecific}","${description}","${t.envelope || ''}","${t.amount}"\n`;
    });
    
    // ========== PRESUPUESTOS ==========
    csv += `\n========== PRESUPUESTOS MENSUALES ==========\n`;
    csv += `Mes,Categoría,Presupuesto (€),Gastado (€),Restante (€),% Usado\n`;
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const monthBudgets = budgets.filter(b => b.month === currentMonth);
    const monthTransactions = transactions.filter(t => {
        const tDate = new Date(t.date);
        return tDate.getMonth() === now.getMonth() && 
               tDate.getFullYear() === now.getFullYear() &&
               t.type === 'expense';
    });
    const expensesByCategory = {};
    monthTransactions.forEach(t => {
        expensesByCategory[t.categoryGeneral] = (expensesByCategory[t.categoryGeneral] || 0) + Math.abs(t.amount);
    });
    
    monthBudgets.forEach(budget => {
        const spent = expensesByCategory[budget.category] || 0;
        const remaining = budget.amount - spent;
        const percentage = budget.amount > 0 ? ((spent / budget.amount) * 100) : 0;
        const category = categories.expense.find(c => c.id === budget.category) || 
                        customCategories.expense.find(c => c.id === budget.category);
        const categoryName = category ? category.name : budget.category;
        csv += `"${budget.month}","${categoryName}","${budget.amount}","${spent}","${remaining}","${percentage.toFixed(2)}"\n`;
    });
    
    // ========== SOBRES ==========
    csv += `\n========== SOBRES (PRESUPUESTOS FLEXIBLES) ==========\n`;
    csv += `Nombre,Presupuesto Mensual (€),Gastado Este Mes (€),Restante (€)\n`;
    envelopes.forEach(envelope => {
        const monthExpenses = monthTransactions.filter(t => t.envelope === envelope.name);
        const spent = monthExpenses.reduce((sum, t) => sum + Math.abs(t.amount), 0);
        const remaining = envelope.budget - spent;
        csv += `"${envelope.name}","${envelope.budget}","${spent}","${remaining}"\n`;
    });
    
    // ========== PRÉSTAMOS ==========
    csv += `\n========== PRÉSTAMOS E HIPOTECAS ==========\n`;
    csv += `Nombre,Tipo,Principal (€),Interés Anual (%),TAE (%),Pago Mensual (€),Capital Restante (€),Total Pagado (€),Meses Restantes\n`;
    loans.forEach(loan => {
        const amortization = calculateAmortizationTable(
            loan.principal,
            loan.interest_rate,
            loan.monthly_payment,
            loan.start_date,
            loan.total_paid || 0,
            loan.early_payments || []
        );
        const startDate = new Date(loan.start_date);
        const endDate = new Date(loan.end_date);
        const today = new Date();
        const monthsRemaining = Math.max(0, Math.ceil((endDate - today) / (1000 * 60 * 60 * 24 * 30.44)));
        const totalPaid = (loan.total_paid || 0) + (loan.early_payments || []).reduce((sum, ep) => sum + ep.amount + (ep.commission || 0), 0);
        
        csv += `"${loan.name}","${loan.type === 'debt' ? 'Deuda' : 'Crédito'}","${loan.principal}","${loan.interest_rate}","${loan.tae || ''}","${loan.monthly_payment}","${amortization.finalBalance.toFixed(2)}","${totalPaid.toFixed(2)}","${monthsRemaining}"\n`;
    });
    
    // ========== INVERSIONES ==========
    csv += `\n========== INVERSIONES ==========\n`;
    csv += `Nombre,Tipo,Monto Invertido (€),Valor Actual (€),Ganancia/Pérdida (€),Rentabilidad (%),Fecha Inversión\n`;
    investments.forEach(investment => {
        const profit = investment.current_value - investment.amount;
        const returnPercent = investment.amount > 0 ? ((profit / investment.amount) * 100) : 0;
        const typeNames = {
            stocks: 'Acciones',
            bonds: 'Bonos',
            crypto: 'Criptomonedas',
            funds: 'Fondos',
            real_estate: 'Inmuebles',
            other: 'Otros'
        };
        const invDate = new Date(investment.date).toLocaleDateString('es-ES');
        csv += `"${investment.name}","${typeNames[investment.type] || investment.type}","${investment.amount}","${investment.current_value}","${profit.toFixed(2)}","${returnPercent.toFixed(2)}","${invDate}"\n`;
    });
    
    // ========== RESUMEN ==========
    csv += `\n========== RESUMEN FINANCIERO ==========\n`;
    const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = Math.abs(transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0));
    const totalSavings = totalIncome - totalExpenses;
    const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);
    const totalInvestmentsValue = investments.reduce((sum, inv) => sum + inv.current_value, 0);
    const totalInvestmentsProfit = totalInvestmentsValue - totalInvested;
    
    csv += `Concepto,Valor (€)\n`;
    csv += `"Total Ingresos","${totalIncome.toFixed(2)}"\n`;
    csv += `"Total Gastos","${totalExpenses.toFixed(2)}"\n`;
    csv += `"Ahorro Total","${totalSavings.toFixed(2)}"\n`;
    csv += `"Total Invertido","${totalInvested.toFixed(2)}"\n`;
    csv += `"Valor Actual Inversiones","${totalInvestmentsValue.toFixed(2)}"\n`;
    csv += `"Ganancia/Pérdida Inversiones","${totalInvestmentsProfit.toFixed(2)}"\n`;
    
    // Calcular balance total
    const transactionsBalance = transactions.reduce((sum, t) => sum + t.amount, 0);
    const loansDebt = loans.filter(l => l.type === 'debt').reduce((sum, loan) => {
        const amortization = calculateAmortizationTable(
            loan.principal,
            loan.interest_rate,
            loan.monthly_payment,
            loan.start_date,
            loan.total_paid || 0,
            loan.early_payments || []
        );
        return sum + amortization.finalBalance;
    }, 0);
    const loansCredit = loans.filter(l => l.type === 'credit').reduce((sum, loan) => {
        const amortization = calculateAmortizationTable(
            loan.principal,
            loan.interest_rate,
            loan.monthly_payment,
            loan.start_date,
            loan.total_paid || 0,
            loan.early_payments || []
        );
        return sum + amortization.finalBalance;
    }, 0);
    const calculatedBalance = transactionsBalance + totalInvestmentsValue + loansCredit - loansDebt;
    
    csv += `"Balance Total","${calculatedBalance.toFixed(2)}"\n`;
    
    // Descargar CSV
    const csvBlob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const csvLink = document.createElement('a');
    const csvUrl = URL.createObjectURL(csvBlob);
    csvLink.setAttribute('href', csvUrl);
    csvLink.setAttribute('download', `veedor_${currentUser}_${date}.csv`);
    csvLink.style.visibility = 'hidden';
    document.body.appendChild(csvLink);
    csvLink.click();
    document.body.removeChild(csvLink);
    URL.revokeObjectURL(csvUrl);
    
    alert(`✅ Exportación completada\n\nEl archivo incluye:\n- ${transactions.length} transacciones\n- ${monthBudgets.length} presupuestos\n- ${envelopes.length} sobres\n- ${loans.length} préstamos\n- ${investments.length} inversiones\n- Resumen financiero completo`);
}


// Utilidades
function formatCurrency(amount) {
    return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'EUR'
    }).format(amount);
}

function formatDate(date) {
    return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Actualizar métricas de salud financiera
function updateFinancialHealthMetrics() {
    const container = document.getElementById('financialHealthMetrics');
    if (!container) {
        // El contenedor puede no existir si no estamos en el tab de análisis
        return;
    }
    
    console.log('📊 Actualizando métricas de salud financiera...');
    container.innerHTML = '';
    
    // Usar el mismo período que el análisis detallado
    const periodTransactions = getTransactionsByPeriod();
    const period = getSelectedPeriod();
    const now = new Date();
    
    // Calcular meses en el período para proyecciones
    let monthsInPeriod = 1;
    if (period === 999) { // "all"
        const dates = periodTransactions.map(t => new Date(t.date));
        if (dates.length > 0) {
            const minDate = new Date(Math.min(...dates));
            const maxDate = new Date(Math.max(...dates));
            const diffTime = Math.abs(maxDate - minDate);
            monthsInPeriod = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30.44)));
        }
    } else {
        monthsInPeriod = period;
    }
    
    // Calcular balance del período (no total acumulado)
    const periodBalance = periodTransactions.reduce((sum, t) => sum + t.amount, 0);
    
    // Activos totales (histórico acumulado para contexto)
    const totalTransactionsBalance = transactions.reduce((sum, t) => sum + t.amount, 0);
    const investmentsValue = investments.reduce((sum, inv) => sum + inv.current_value, 0);
    const loansCredit = loans.filter(l => l.type === 'credit').reduce((sum, loan) => {
        const amortization = calculateAmortizationTable(
            loan.principal,
            loan.interest_rate,
            loan.monthly_payment,
            loan.start_date,
            loan.total_paid || 0,
            loan.early_payments || []
        );
        return sum + amortization.finalBalance;
    }, 0);
    
    const totalAssets = totalTransactionsBalance + investmentsValue + loansCredit;
    
    // Calcular deudas totales (histórico)
    // Verificar préstamos activos (que aún no han terminado)
    const activeDebtLoans = loans.filter(l => {
        if (l.type !== 'debt') return false;
        const endDate = new Date(l.end_date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return endDate >= today; // Préstamo aún activo
    });
    
    const loansDebt = activeDebtLoans.reduce((sum, loan) => {
        const amortization = calculateAmortizationTable(
            loan.principal,
            loan.interest_rate,
            loan.monthly_payment,
            loan.start_date,
            loan.total_paid || 0,
            loan.early_payments || []
        );
        return sum + amortization.finalBalance;
    }, 0);
    
    // También verificar si hay préstamos activos aunque el capital restante sea bajo
    const hasActiveDebts = activeDebtLoans.length > 0;
    
    // Calcular ingresos y gastos del período seleccionado
    const periodIncome = periodTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const periodExpenses = Math.abs(periodTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0));
    const periodSavings = periodIncome - periodExpenses;
    
    // Proyectar a anual para comparaciones
    const annualIncome = monthsInPeriod > 0 ? (periodIncome / monthsInPeriod) * 12 : 0;
    const annualExpenses = monthsInPeriod > 0 ? (periodExpenses / monthsInPeriod) * 12 : 0;
    const annualSavings = annualIncome - annualExpenses;
    
    // 1. Porcentaje de Deuda Pendiente
    const debtPercentage = totalAssets > 0 ? (loansDebt / totalAssets) * 100 : (loansDebt > 0 ? 100 : 0);
    const debtStatus = debtPercentage < 30 ? 'excellent' : debtPercentage < 50 ? 'good' : debtPercentage < 70 ? 'warning' : 'danger';
    
    // 2. Ratio de Endeudamiento (Deuda / Activos)
    const debtToAssetsRatio = totalAssets > 0 ? (loansDebt / totalAssets) : (loansDebt > 0 ? 1 : 0);
    const debtRatioStatus = debtToAssetsRatio < 0.3 ? 'excellent' : debtToAssetsRatio < 0.5 ? 'good' : debtToAssetsRatio < 0.7 ? 'warning' : 'danger';
    
    // 3. Ratio de Salud Financiera (Activos / Deudas)
    const healthRatio = loansDebt > 0 ? (totalAssets / loansDebt) : (totalAssets > 0 ? 999 : (totalAssets < 0 ? -999 : 0));
    // Si no hay deudas activas y hay activos positivos = excelente, si activos negativos = peligro
    const healthStatus = !hasActiveDebts ? (totalAssets > 0 ? 'excellent' : (totalAssets < 0 ? 'danger' : 'warning')) : (healthRatio > 3 ? 'excellent' : healthRatio > 2 ? 'good' : healthRatio > 1 ? 'warning' : 'danger');
    
    // 4. Ratio de Cobertura de Deuda (Ingresos anuales / Deuda)
    const debtCoverageRatio = loansDebt > 0 ? (annualIncome / loansDebt) : (annualIncome > 0 ? 999 : 0);
    // Si no hay deudas = excelente, si hay deudas pero no ingresos = peligro
    const coverageStatus = loansDebt === 0 ? 'excellent' : (debtCoverageRatio > 2 ? 'excellent' : debtCoverageRatio > 1 ? 'good' : debtCoverageRatio > 0.5 ? 'warning' : 'danger');
    
    // 5. Ratio de Ahorro (Ahorro del período / Ingresos del período)
    const savingsRatio = periodIncome > 0 ? (periodSavings / periodIncome) * 100 : (periodIncome === 0 && periodExpenses > 0 ? -100 : 0);
    // Lógica corregida: negativo o 0% = bajo/peligro, positivo = bueno
    // Si no hay ingresos y hay gastos = peligro, si no hay ingresos ni gastos = moderado
    const savingsStatus = periodIncome === 0 && periodExpenses === 0 ? 'warning' : (savingsRatio >= 20 ? 'excellent' : savingsRatio >= 10 ? 'good' : savingsRatio > 0 ? 'warning' : 'danger');
    
    // 6. Ratio de Liquidez (Activos líquidos / Gastos mensuales promedio del período)
    const avgMonthlyExpenses = monthsInPeriod > 0 ? periodExpenses / monthsInPeriod : periodExpenses;
    const liquidityRatio = avgMonthlyExpenses > 0 ? (totalTransactionsBalance / avgMonthlyExpenses) : (totalTransactionsBalance > 0 ? 999 : (totalTransactionsBalance < 0 ? -999 : 0));
    // Si balance negativo = peligro, si no hay gastos y hay balance positivo = excelente
    const liquidityStatus = totalTransactionsBalance < 0 ? 'danger' : (avgMonthlyExpenses === 0 && totalTransactionsBalance > 0 ? 'excellent' : (liquidityRatio >= 6 ? 'excellent' : liquidityRatio >= 3 ? 'good' : liquidityRatio >= 1 ? 'warning' : 'danger'));
    
    // 7. Ratio de Inversión (Inversiones / Activos totales)
    const investmentRatio = totalAssets > 0 ? (investmentsValue / totalAssets) * 100 : (totalAssets < 0 ? 0 : 0);
    // Si activos negativos o 0% = bajo, si positivo según porcentaje
    const investmentStatus = totalAssets <= 0 ? 'danger' : (investmentRatio > 20 ? 'excellent' : investmentRatio > 10 ? 'good' : investmentRatio > 5 ? 'warning' : 'danger');
    
    // 8. Ratio de Servicio de Deuda (Pagos mensuales / Ingresos mensuales promedio del período)
    const avgMonthlyIncome = monthsInPeriod > 0 ? periodIncome / monthsInPeriod : 0;
    const monthlyLoanPayments = loans.filter(l => l.type === 'debt').reduce((sum, loan) => sum + loan.monthly_payment, 0);
    const debtServiceRatio = avgMonthlyIncome > 0 ? (monthlyLoanPayments / avgMonthlyIncome) * 100 : (monthlyLoanPayments > 0 ? 999 : 0);
    // Si no hay ingresos pero hay pagos = peligro crítico
    const debtServiceStatus = avgMonthlyIncome === 0 && monthlyLoanPayments > 0 ? 'danger' : (debtServiceRatio >= 40 ? 'danger' : debtServiceRatio >= 30 ? 'warning' : debtServiceRatio >= 20 ? 'good' : 'excellent');
    
    const metrics = [
        {
            title: 'Deuda Pendiente',
            value: debtPercentage.toFixed(1) + '%',
            description: `Deuda sobre activos totales`,
            status: debtStatus,
            icon: '📊',
            detail: formatCurrency(loansDebt) + ' de ' + formatCurrency(totalAssets)
        },
        {
            title: 'Ratio de Endeudamiento',
            value: (debtToAssetsRatio * 100).toFixed(1) + '%',
            description: `Deuda / Activos totales`,
            status: debtRatioStatus,
            icon: '⚖️',
            detail: debtToAssetsRatio < 0.3 ? 'Excelente' : debtToAssetsRatio < 0.5 ? 'Bueno' : debtToAssetsRatio < 0.7 ? 'Moderado' : 'Alto'
        },
        {
            title: 'Salud Financiera',
            value: healthRatio > 999 ? '∞' : healthRatio < -999 ? '-∞' : healthRatio.toFixed(2),
            description: `Activos / Deudas`,
            status: healthStatus,
            icon: '💚',
            detail: !hasActiveDebts ? (totalAssets > 0 ? 'Sin deudas activas, activos positivos' : (totalAssets < 0 ? 'Sin deudas activas, pero activos negativos' : 'Sin deudas activas ni activos')) : (healthRatio > 3 ? 'Excelente' : healthRatio > 2 ? 'Buena' : healthRatio > 1 ? 'Moderada' : 'Baja')
        },
        {
            title: 'Cobertura de Deuda',
            value: debtCoverageRatio > 999 ? '∞' : debtCoverageRatio.toFixed(2),
            description: `Ingresos anuales / Deuda`,
            status: coverageStatus,
            icon: '🛡️',
            detail: !hasActiveDebts ? 'Sin deudas activas' : (debtCoverageRatio > 2 ? 'Excelente' : debtCoverageRatio > 1 ? 'Buena' : debtCoverageRatio > 0.5 ? 'Moderada' : 'Baja')
        },
        {
            title: 'Ratio de Ahorro',
            value: savingsRatio.toFixed(1) + '%',
            description: `Ahorro del período / Ingresos del período`,
            status: savingsStatus,
            icon: '💰',
            detail: formatCurrency(periodSavings) + ' de ' + formatCurrency(periodIncome) + (periodIncome === 0 ? ' (sin ingresos)' : '')
        },
        {
            title: 'Liquidez',
            value: liquidityRatio > 999 ? '∞' : liquidityRatio < 0 ? '0.0 meses' : liquidityRatio.toFixed(1) + ' meses',
            description: `Activos líquidos / Gastos mensuales promedio`,
            status: liquidityStatus,
            icon: '💧',
            detail: totalTransactionsBalance < 0 ? 'Balance negativo' : (avgMonthlyExpenses === 0 && totalTransactionsBalance > 0 ? 'Sin gastos, balance positivo' : (liquidityRatio >= 6 ? 'Excelente' : liquidityRatio >= 3 ? 'Buena' : liquidityRatio >= 1 ? 'Moderada' : 'Baja'))
        },
        {
            title: 'Ratio de Inversión',
            value: investmentRatio.toFixed(1) + '%',
            description: `Inversiones / Activos totales`,
            status: investmentStatus,
            icon: '📈',
            detail: totalAssets <= 0 ? 'Sin activos o activos negativos' : (formatCurrency(investmentsValue) + ' de ' + formatCurrency(totalAssets))
        },
        {
            title: 'Servicio de Deuda',
            value: debtServiceRatio >= 999 ? '∞%' : debtServiceRatio.toFixed(1) + '%',
            description: `Pagos mensuales / Ingresos mensuales promedio`,
            status: debtServiceStatus,
            icon: '💳',
            detail: formatCurrency(monthlyLoanPayments) + ' de ' + formatCurrency(avgMonthlyIncome) + (avgMonthlyIncome === 0 ? ' (sin ingresos)' : '')
        }
    ];
    
    metrics.forEach((metric, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.style.borderLeft = `4px solid ${
            metric.status === 'excellent' ? 'var(--success)' :
            metric.status === 'good' ? '#10b981' :
            metric.status === 'warning' ? 'var(--warning)' :
            'var(--danger)'
        }`;
        card.style.cursor = 'pointer';
        card.style.transition = 'transform 0.2s, box-shadow 0.2s';
        card.onmouseover = () => {
            card.style.transform = 'translateY(-2px)';
            card.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
        };
        card.onmouseout = () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = '';
        };
        card.onclick = () => showFinancialHealthDetail(metric, index);
        
        const statusColors = {
            excellent: { bg: '#D1FAE5', text: '#065F46' },
            good: { bg: '#DCFCE7', text: '#166534' },
            warning: { bg: '#FEF3C7', text: '#92400E' },
            danger: { bg: '#FEE2E2', text: '#991B1B' }
        };
        
        const statusStyle = statusColors[metric.status] || statusColors.warning;
        
        card.innerHTML = `
            <div style="display: flex; align-items: start; justify-content: space-between; margin-bottom: 12px;">
                <div>
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                        <span style="font-size: 20px;">${metric.icon}</span>
                        <h3 style="margin: 0; font-size: 16px; font-weight: 700; color: var(--gray-900);">${metric.title}</h3>
                    </div>
                    <p style="margin: 0; font-size: 12px; color: var(--gray-600);">${metric.description}</p>
                </div>
                <span style="padding: 4px 10px; background: ${statusStyle.bg}; color: ${statusStyle.text}; border-radius: var(--radius-full); font-size: 11px; font-weight: 600;">
                    ${metric.status === 'excellent' ? 'Excelente' : metric.status === 'good' ? 'Bueno' : metric.status === 'warning' ? 'Moderado' : 'Bajo'}
                </span>
            </div>
            <div style="margin-top: 16px;">
                <div style="font-size: 28px; font-weight: 700; color: var(--gray-900); margin-bottom: 8px;">
                    ${metric.value}
                </div>
                <div style="font-size: 13px; color: var(--gray-600);">
                    ${metric.detail}
                </div>
            </div>
        `;
        
        container.appendChild(card);
    });
}

// Actualizar tablas de análisis
function updateAnalysisTables() {
    console.log('📊 Actualizando tablas de análisis...');
    const periodTransactions = getTransactionsByPeriod();
    const expenses = periodTransactions.filter(t => t.type === 'expense');
    const income = periodTransactions.filter(t => t.type === 'income');
    
    // Top Gastos
    const topExpenses = [...expenses]
        .sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount))
        .slice(0, 10);
    
    const topExpensesBody = document.getElementById('topExpensesBody');
    if (topExpensesBody) {
        topExpensesBody.innerHTML = '';
        if (topExpenses.length === 0) {
            topExpensesBody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 40px; color: var(--gray-500);">No hay gastos en este período</td></tr>';
        } else {
            topExpenses.forEach(t => {
                const row = document.createElement('tr');
                const category = categories.expense.find(c => c.id === t.categoryGeneral) || 
                               customCategories.expense.find(c => c.id === t.categoryGeneral);
                const categoryName = category ? category.name : t.categoryGeneral;
                row.innerHTML = `
                    <td>${formatDate(new Date(t.date))}</td>
                    <td>${categoryName}</td>
                    <td>${t.description || '-'}</td>
                    <td style="color: var(--danger); font-weight: 600;">${formatCurrency(Math.abs(t.amount))}</td>
                `;
                topExpensesBody.appendChild(row);
            });
        }
    }
    
    // Gastos Recurrentes
    const categoryTotals = {};
    const categoryCounts = {};
    expenses.forEach(t => {
        const catId = t.categoryGeneral;
        if (!categoryTotals[catId]) {
            categoryTotals[catId] = 0;
            categoryCounts[catId] = 0;
        }
        categoryTotals[catId] += Math.abs(t.amount);
        categoryCounts[catId]++;
    });
    
    const recurringExpensesBody = document.getElementById('recurringExpensesBody');
    if (recurringExpensesBody) {
        recurringExpensesBody.innerHTML = '';
        const recurring = Object.entries(categoryTotals)
            .map(([catId, total]) => {
                const category = categories.expense.find(c => c.id === catId) || 
                               customCategories.expense.find(c => c.id === catId);
                const categoryName = category ? category.name : catId;
                const count = categoryCounts[catId];
                const months = getMonthsInPeriod();
                const avgMonthly = months > 0 ? total / months : total;
                return { categoryName, count, avgMonthly, total };
            })
            .sort((a, b) => b.total - a.total)
            .slice(0, 10);
        
        if (recurring.length === 0) {
            recurringExpensesBody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 40px; color: var(--gray-500);">No hay gastos recurrentes</td></tr>';
        } else {
            recurring.forEach(item => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${item.categoryName}</td>
                    <td>${item.count} transacciones</td>
                    <td>${formatCurrency(item.avgMonthly)}</td>
                    <td style="font-weight: 600;">${formatCurrency(item.total)}</td>
                `;
                recurringExpensesBody.appendChild(row);
            });
        }
    }
    
    // Comparativa Mensual
    const monthlyData = {};
    periodTransactions.forEach(t => {
        const date = new Date(t.date);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        if (!monthlyData[monthKey]) {
            monthlyData[monthKey] = { income: 0, expenses: 0 };
        }
        if (t.type === 'income') {
            monthlyData[monthKey].income += t.amount;
        } else {
            monthlyData[monthKey].expenses += Math.abs(t.amount);
        }
    });
    
    const monthlyComparisonBody = document.getElementById('monthlyComparisonBody');
    if (monthlyComparisonBody) {
        monthlyComparisonBody.innerHTML = '';
        const sortedMonths = Object.entries(monthlyData)
            .sort(([a], [b]) => a.localeCompare(b))
            .reverse();
        
        if (sortedMonths.length === 0) {
            monthlyComparisonBody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 40px; color: var(--gray-500);">No hay datos para este período</td></tr>';
        } else {
            sortedMonths.forEach(([monthKey, data]) => {
                const [year, month] = monthKey.split('-');
                const monthName = new Date(year, month - 1).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
                const savings = data.income - data.expenses;
                const savingsPercent = data.income > 0 ? (savings / data.income) * 100 : 0;
                
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td style="font-weight: 600;">${monthName}</td>
                    <td style="color: var(--success);">${formatCurrency(data.income)}</td>
                    <td style="color: var(--danger);">${formatCurrency(data.expenses)}</td>
                    <td style="color: ${savings >= 0 ? 'var(--success)' : 'var(--danger)'}; font-weight: 600;">${formatCurrency(savings)}</td>
                    <td style="color: ${savingsPercent >= 0 ? 'var(--success)' : 'var(--danger)'}; font-weight: 600;">${savingsPercent.toFixed(1)}%</td>
                `;
                monthlyComparisonBody.appendChild(row);
            });
        }
    }
    
    // Análisis por Categoría
    const categoryAnalysis = {};
    expenses.forEach(t => {
        const catId = t.categoryGeneral;
        if (!categoryAnalysis[catId]) {
            categoryAnalysis[catId] = { total: 0, count: 0 };
        }
        categoryAnalysis[catId].total += Math.abs(t.amount);
        categoryAnalysis[catId].count++;
    });
    
    const totalExpenses = expenses.reduce((sum, t) => sum + Math.abs(t.amount), 0);
    const months = getMonthsInPeriod();
    
    const categoryAnalysisBody = document.getElementById('categoryAnalysisBody');
    if (categoryAnalysisBody) {
        categoryAnalysisBody.innerHTML = '';
        const sorted = Object.entries(categoryAnalysis)
            .map(([catId, data]) => {
                const category = categories.expense.find(c => c.id === catId) || 
                               customCategories.expense.find(c => c.id === catId);
                const categoryName = category ? category.name : catId;
                const percent = totalExpenses > 0 ? (data.total / totalExpenses) * 100 : 0;
                const avgMonthly = months > 0 ? data.total / months : data.total;
                return { categoryName, total: data.total, percent, avgMonthly, count: data.count };
            })
            .sort((a, b) => b.total - a.total);
        
        if (sorted.length === 0) {
            categoryAnalysisBody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 40px; color: var(--gray-500);">No hay gastos por categoría</td></tr>';
        } else {
            sorted.forEach(item => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td style="font-weight: 600;">${item.categoryName}</td>
                    <td>${formatCurrency(item.total)}</td>
                    <td>${item.percent.toFixed(1)}%</td>
                    <td>${formatCurrency(item.avgMonthly)}</td>
                    <td>${item.count}</td>
                `;
                categoryAnalysisBody.appendChild(row);
            });
        }
    }
}

// Obtener número de meses en el período
function getMonthsInPeriod() {
    const chartPeriod = document.getElementById('chartPeriod')?.value || '6';
    if (chartPeriod === 'all') {
        const dates = transactions.map(t => new Date(t.date));
        if (dates.length === 0) return 1;
        const minDate = new Date(Math.min(...dates));
        const maxDate = new Date(Math.max(...dates));
        const diffTime = Math.abs(maxDate - minDate);
        const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30.44));
        return Math.max(1, diffMonths);
    }
    return parseInt(chartPeriod);
}

// Cargar contenido de políticas desde archivos
async function loadPolicyContent(file, contentId) {
    try {
        const response = await fetch(`/${file}`);
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const content = doc.querySelector('.policy-container');
        if (content) {
            // Remover el título y el back link
            const title = content.querySelector('h1');
            const backLink = content.querySelector('.back-link');
            if (title) title.remove();
            if (backLink) backLink.remove();
            document.getElementById(contentId).innerHTML = content.innerHTML;
        }
    } catch (error) {
        console.error(`Error cargando ${file}:`, error);
        document.getElementById(contentId).innerHTML = '<p>Error al cargar el contenido.</p>';
    }
}

// Mostrar modales de políticas
function showPrivacyModal() {
    const modal = document.getElementById('privacyModal');
    if (modal) {
        loadPolicyContent('privacy.html', 'privacyContent');
        modal.style.display = 'flex';
    }
}

function closePrivacyModal() {
    const modal = document.getElementById('privacyModal');
    if (modal) modal.style.display = 'none';
}

function showCookiesModal() {
    const modal = document.getElementById('cookiesModal');
    if (modal) {
        loadPolicyContent('cookies.html', 'cookiesContent');
        modal.style.display = 'flex';
    }
}

function closeCookiesModal() {
    const modal = document.getElementById('cookiesModal');
    if (modal) modal.style.display = 'none';
}

function showTermsModal() {
    const modal = document.getElementById('termsModal');
    if (modal) {
        loadPolicyContent('terms.html', 'termsContent');
        modal.style.display = 'flex';
    }
}

function closeTermsModal() {
    const modal = document.getElementById('termsModal');
    if (modal) modal.style.display = 'none';
}

// Cerrar modales al hacer clic fuera
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        ['privacyModal', 'cookiesModal', 'termsModal'].forEach(modalId => {
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.addEventListener('click', (e) => {
                    if (e.target === modal) {
                        if (modalId === 'privacyModal') closePrivacyModal();
                        if (modalId === 'cookiesModal') closeCookiesModal();
                        if (modalId === 'termsModal') closeTermsModal();
                    }
                });
            }
        });
    });
}

// Asegurar que las funciones de políticas estén disponibles globalmente ANTES de exponerlas
// (ya están definidas arriba, solo las exponemos)

// Mostrar modal de perfil de usuario
function showUserProfile() {
    const modal = document.getElementById('userProfileModal');
    if (!modal) {
        console.error('Modal de perfil no encontrado');
        return;
    }
    
    // Cargar datos del perfil
    const emailInput = document.getElementById('profileEmail');
    const usernameInput = document.getElementById('profileUsername');
    const firstNameInput = document.getElementById('profileFirstName');
    const lastNameInput = document.getElementById('profileLastName');
    const ageInput = document.getElementById('profileAge');
    const phoneInput = document.getElementById('profilePhone');
    const addressInput = document.getElementById('profileAddress');
    const cityInput = document.getElementById('profileCity');
    const countryInput = document.getElementById('profileCountry');
    const birthDateInput = document.getElementById('profileBirthDate');
    const notesInput = document.getElementById('profileNotes');
    
    if (emailInput) emailInput.value = currentUserEmail || '';
    if (usernameInput) usernameInput.value = currentUser || '';
    if (firstNameInput) firstNameInput.value = userProfile.firstName || '';
    if (lastNameInput) lastNameInput.value = userProfile.lastName || '';
    if (ageInput) ageInput.value = userProfile.age || '';
    if (phoneInput) phoneInput.value = userProfile.phone || '';
    if (addressInput) addressInput.value = userProfile.address || '';
    if (cityInput) cityInput.value = userProfile.city || '';
    if (countryInput) countryInput.value = userProfile.country || '';
    if (birthDateInput) birthDateInput.value = userProfile.birthDate || '';
    if (notesInput) notesInput.value = userProfile.notes || '';
    
    modal.style.display = 'flex';
}

// Cerrar modal de perfil
function closeUserProfile() {
    const modal = document.getElementById('userProfileModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Guardar perfil de usuario
async function saveUserProfile() {
    const firstName = document.getElementById('profileFirstName')?.value.trim() || '';
    const lastName = document.getElementById('profileLastName')?.value.trim() || '';
    const age = document.getElementById('profileAge')?.value ? parseInt(document.getElementById('profileAge').value) : null;
    const phone = document.getElementById('profilePhone')?.value.trim() || '';
    const address = document.getElementById('profileAddress')?.value.trim() || '';
    const city = document.getElementById('profileCity')?.value.trim() || '';
    const country = document.getElementById('profileCountry')?.value.trim() || '';
    const birthDate = document.getElementById('profileBirthDate')?.value || null;
    const notes = document.getElementById('profileNotes')?.value.trim() || '';
    
    try {
        const data = await apiRequest('/user/profile', {
            method: 'PUT',
            body: JSON.stringify({
                firstName,
                lastName,
                age,
                phone,
                address,
                city,
                country,
                birthDate,
                notes
            })
        });
        
        // Actualizar datos locales
        userProfile = {
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            age: data.age || null,
            phone: data.phone || '',
            address: data.address || '',
            city: data.city || '',
            country: data.country || '',
            birthDate: data.birthDate || null,
            notes: data.notes || ''
        };
        
        updateUserInfo();
        closeUserProfile();
        alert('✅ Perfil actualizado exitosamente');
    } catch (error) {
        alert('Error al actualizar perfil: ' + error.message);
    }
}

// Eliminar cuenta de usuario
async function deleteUserAccount() {
    const confirmed = confirm('⚠️ ¿Estás seguro de que quieres eliminar tu cuenta?\n\nEsta acción eliminará:\n- Todas tus transacciones\n- Todas tus cuentas bancarias\n- Todos tus sobres y presupuestos\n- Todos tus préstamos\n- Todas tus inversiones\n- Todas tus propiedades\n- Todos tus bienes\n\nEsta acción NO se puede deshacer.\n\n¿Deseas continuar?');
    
    if (!confirmed) return;
    
    const doubleConfirm = confirm('⚠️ ÚLTIMA CONFIRMACIÓN\n\nEstás a punto de eliminar permanentemente tu cuenta y todos tus datos.\n\n¿Estás completamente seguro?');
    
    if (!doubleConfirm) return;
    
    try {
        await apiRequest('/user', {
            method: 'DELETE'
        });
        
        showToast('Tu cuenta ha sido eliminada exitosamente. Serás redirigido a la página de inicio.', 'success', 5000);
        
        // Limpiar datos locales
        localStorage.removeItem('veedor_token');
        localStorage.removeItem('veedor_user');
        
        // Redirigir a la página de inicio
        window.location.href = '/';
    } catch (error) {
        showToast('Error al eliminar cuenta: ' + error.message, 'error');
    }
}

// Mostrar detalles de resumen
function showSummaryDetails(type) {
    const modal = document.getElementById('summaryDetailsModal');
    const titleEl = document.getElementById('summaryDetailsTitle');
    const contentEl = document.getElementById('summaryDetailsContent');
    
    if (!modal || !titleEl || !contentEl) return;
    
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const summaryYearInput = document.getElementById('summaryYear');
    let selectedYear = currentYear;
    if (summaryYearInput && summaryPeriod === 'year-select') {
        selectedYear = parseInt(summaryYearInput.value) || currentYear;
    }
    
    let title = '';
    let content = '';
    
    if (type === 'balance') {
        title = '📊 Detalles del Balance Total';
        const transactionsBalance = transactions.reduce((sum, t) => sum + t.amount, 0);
        const investmentsValue = investments.reduce((sum, inv) => sum + inv.current_value, 0);
        const loansDebt = loans.filter(l => l.type === 'debt').reduce((sum, loan) => {
            const amortization = calculateAmortizationTable(
                loan.principal,
                loan.interest_rate,
                loan.monthly_payment,
                loan.start_date,
                loan.total_paid || 0,
                loan.early_payments || []
            );
            return sum + amortization.finalBalance;
        }, 0);
        const loansCredit = loans.filter(l => l.type === 'credit').reduce((sum, loan) => {
            const amortization = calculateAmortizationTable(
                loan.principal,
                loan.interest_rate,
                loan.monthly_payment,
                loan.start_date,
                loan.total_paid || 0,
                loan.early_payments || []
            );
            return sum + amortization.finalBalance;
        }, 0);
        const assetsValue = assets.reduce((sum, asset) => sum + (asset.current_value || 0), 0);
        const totalBalance = transactionsBalance + investmentsValue + loansCredit - loansDebt + assetsValue;
        
        content = `
            <div style="display: grid; gap: 16px;">
                <div style="background: var(--gray-50); padding: 16px; border-radius: var(--radius); border-left: 4px solid var(--primary);">
                    <h3 style="margin: 0 0 12px 0; color: var(--gray-900);">Balance Total: ${formatCurrency(totalBalance)}</h3>
                </div>
                <div style="display: grid; gap: 12px;">
                    <div style="display: flex; justify-content: space-between; padding: 12px; background: var(--gray-50); border-radius: var(--radius);">
                        <span><strong>Saldo de Transacciones:</strong></span>
                        <span style="color: ${transactionsBalance >= 0 ? '#10b981' : '#ef4444'}">${formatCurrency(transactionsBalance)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 12px; background: var(--gray-50); border-radius: var(--radius);">
                        <span><strong>Valor de Inversiones:</strong></span>
                        <span style="color: #10b981">${formatCurrency(investmentsValue)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 12px; background: var(--gray-50); border-radius: var(--radius);">
                        <span><strong>Valor de Patrimonio:</strong></span>
                        <span style="color: #10b981">${formatCurrency(assetsValue)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 12px; background: var(--gray-50); border-radius: var(--radius);">
                        <span><strong>Préstamos a Favor:</strong></span>
                        <span style="color: #10b981">${formatCurrency(loansCredit)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 12px; background: var(--gray-50); border-radius: var(--radius);">
                        <span><strong>Deudas Pendientes:</strong></span>
                        <span style="color: #ef4444">-${formatCurrency(loansDebt)}</span>
                    </div>
                </div>
            </div>
        `;
    } else if (type === 'accounts') {
        title = '💰 Detalles de Cuentas Bancarias';
        const totalAccountsBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
        content = `
            <div style="display: grid; gap: 16px;">
                <div style="background: var(--gray-50); padding: 16px; border-radius: var(--radius); border-left: 4px solid #10b981;">
                    <h3 style="margin: 0 0 12px 0; color: var(--gray-900);">Saldo Total: ${formatCurrency(totalAccountsBalance)}</h3>
                </div>
                ${accounts.length === 0 ? '<p style="text-align: center; color: var(--gray-500); padding: 20px;">No hay cuentas registradas</p>' : ''}
                ${accounts.map(acc => `
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 16px; background: var(--gray-50); border-radius: var(--radius); border: 1px solid var(--border-color);">
                        <div>
                            <strong>${acc.name}</strong>
                            <br><small style="color: var(--gray-600);">${acc.type || 'Cuenta bancaria'}</small>
                        </div>
                        <div style="text-align: right;">
                            <strong style="color: ${acc.balance >= 0 ? '#10b981' : '#ef4444'}">${formatCurrency(acc.balance)}</strong>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    } else if (type === 'income') {
        title = '💵 Detalles de Ingresos';
        let periodTransactions = [];
        if (summaryPeriod === 'month') {
            periodTransactions = transactions.filter(t => {
                const tDate = new Date(t.date);
                return tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear && t.type === 'income';
            });
        } else if (summaryPeriod === 'year' || summaryPeriod === 'year-select') {
            periodTransactions = transactions.filter(t => {
                const tDate = new Date(t.date);
                return tDate.getFullYear() === selectedYear && t.type === 'income';
            });
        } else {
            periodTransactions = transactions.filter(t => t.type === 'income');
        }
        const totalIncome = periodTransactions.reduce((sum, t) => sum + t.amount, 0);
        content = `
            <div style="display: grid; gap: 16px;">
                <div style="background: var(--gray-50); padding: 16px; border-radius: var(--radius); border-left: 4px solid #10b981;">
                    <h3 style="margin: 0 0 12px 0; color: var(--gray-900);">Total Ingresos: ${formatCurrency(totalIncome)}</h3>
                </div>
                ${periodTransactions.length === 0 ? '<p style="text-align: center; color: var(--gray-500); padding: 20px;">No hay ingresos registrados</p>' : ''}
                ${periodTransactions.slice(0, 20).map(t => `
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px; background: var(--gray-50); border-radius: var(--radius); border: 1px solid var(--border-color);">
                        <div>
                            <strong>${t.category_specific || t.category_general}</strong>
                            <br><small style="color: var(--gray-600);">${new Date(t.date).toLocaleDateString('es-ES')}</small>
                        </div>
                        <div style="text-align: right;">
                            <strong style="color: #10b981">${formatCurrency(t.amount)}</strong>
                        </div>
                    </div>
                `).join('')}
                ${periodTransactions.length > 20 ? `<p style="text-align: center; color: var(--gray-500);">Y ${periodTransactions.length - 20} ingresos más...</p>` : ''}
            </div>
        `;
    } else if (type === 'expenses') {
        title = '💸 Detalles de Gastos';
        let periodTransactions = [];
        if (summaryPeriod === 'month') {
            periodTransactions = transactions.filter(t => {
                const tDate = new Date(t.date);
                return tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear && t.type === 'expense';
            });
        } else if (summaryPeriod === 'year' || summaryPeriod === 'year-select') {
            periodTransactions = transactions.filter(t => {
                const tDate = new Date(t.date);
                return tDate.getFullYear() === selectedYear && t.type === 'expense';
            });
        } else {
            periodTransactions = transactions.filter(t => t.type === 'expense');
        }
        const totalExpenses = Math.abs(periodTransactions.reduce((sum, t) => sum + t.amount, 0));
        content = `
            <div style="display: grid; gap: 16px;">
                <div style="background: var(--gray-50); padding: 16px; border-radius: var(--radius); border-left: 4px solid #ef4444;">
                    <h3 style="margin: 0 0 12px 0; color: var(--gray-900);">Total Gastos: ${formatCurrency(totalExpenses)}</h3>
                </div>
                ${periodTransactions.length === 0 ? '<p style="text-align: center; color: var(--gray-500); padding: 20px;">No hay gastos registrados</p>' : ''}
                ${periodTransactions.slice(0, 20).map(t => `
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px; background: var(--gray-50); border-radius: var(--radius); border: 1px solid var(--border-color);">
                        <div>
                            <strong>${t.category_specific || t.category_general}</strong>
                            <br><small style="color: var(--gray-600);">${new Date(t.date).toLocaleDateString('es-ES')}</small>
                        </div>
                        <div style="text-align: right;">
                            <strong style="color: #ef4444">${formatCurrency(Math.abs(t.amount))}</strong>
                        </div>
                    </div>
                `).join('')}
                ${periodTransactions.length > 20 ? `<p style="text-align: center; color: var(--gray-500);">Y ${periodTransactions.length - 20} gastos más...</p>` : ''}
            </div>
        `;
    } else if (type === 'savings') {
        title = '💰 Detalles de Ahorro';
        let periodIncome = 0, periodExpenses = 0;
        if (summaryPeriod === 'month') {
            const monthTransactions = transactions.filter(t => {
                const tDate = new Date(t.date);
                return tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear;
            });
            periodIncome = monthTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
            periodExpenses = Math.abs(monthTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0));
        } else if (summaryPeriod === 'year' || summaryPeriod === 'year-select') {
            const yearTransactions = transactions.filter(t => {
                const tDate = new Date(t.date);
                return tDate.getFullYear() === selectedYear;
            });
            periodIncome = yearTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
            periodExpenses = Math.abs(yearTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0));
        } else {
            periodIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
            periodExpenses = Math.abs(transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0));
        }
        const periodSavings = periodIncome - periodExpenses;
        content = `
            <div style="display: grid; gap: 16px;">
                <div style="background: var(--gray-50); padding: 16px; border-radius: var(--radius); border-left: 4px solid ${periodSavings >= 0 ? '#10b981' : '#ef4444'};">
                    <h3 style="margin: 0 0 12px 0; color: var(--gray-900);">Ahorro Total: ${formatCurrency(periodSavings)}</h3>
                </div>
                <div style="display: grid; gap: 12px;">
                    <div style="display: flex; justify-content: space-between; padding: 12px; background: var(--gray-50); border-radius: var(--radius);">
                        <span><strong>Ingresos:</strong></span>
                        <span style="color: #10b981">${formatCurrency(periodIncome)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 12px; background: var(--gray-50); border-radius: var(--radius);">
                        <span><strong>Gastos:</strong></span>
                        <span style="color: #ef4444">${formatCurrency(periodExpenses)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 12px; background: var(--gray-50); border-radius: var(--radius);">
                        <span><strong>Ahorro:</strong></span>
                        <span style="color: ${periodSavings >= 0 ? '#10b981' : '#ef4444'}">${formatCurrency(periodSavings)}</span>
                    </div>
                </div>
            </div>
        `;
    }
    
    titleEl.textContent = title;
    contentEl.innerHTML = content;
    modal.style.display = 'flex';
}

// Cerrar modal de detalles de resumen
function closeSummaryDetails() {
    const modal = document.getElementById('summaryDetailsModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Funciones para modal de meta de ahorro
function showSavingsGoalModal() {
    const modal = document.getElementById('savingsGoalModal');
    const input = document.getElementById('savingsGoalInput');
    if (modal && input) {
        input.value = savingsGoal || '';
        modal.style.display = 'flex';
    }
}

function closeSavingsGoalModal() {
    const modal = document.getElementById('savingsGoalModal');
    if (modal) modal.style.display = 'none';
}

async function deleteSavingsGoal() {
    try {
        savingsGoal = null;
        await apiRequest('/user/profile', {
            method: 'PUT',
            body: JSON.stringify({ savingsGoal: null })
        });
        updateSummary();
        closeSavingsGoalModal();
    } catch (error) {
        alert('Error al eliminar la meta de ahorro: ' + error.message);
    }
}

// Exponer funciones globales
window.showUserProfile = showUserProfile;
window.closeUserProfile = closeUserProfile;
window.deleteUserAccount = deleteUserAccount;
window.showSummaryDetails = showSummaryDetails;
window.closeSummaryDetails = closeSummaryDetails;
window.showPrivacyModal = showPrivacyModal;
window.closePrivacyModal = closePrivacyModal;
window.showCookiesModal = showCookiesModal;
window.closeCookiesModal = closeCookiesModal;
window.showTermsModal = showTermsModal;
window.closeTermsModal = closeTermsModal;
window.showSavingsGoalModal = showSavingsGoalModal;
window.closeSavingsGoalModal = closeSavingsGoalModal;
window.deleteSavingsGoal = deleteSavingsGoal;
window.showFinancialHealthDetail = showFinancialHealthDetail;
window.showAddMoneyInvestmentModal = showAddMoneyInvestmentModal;
window.closeAddMoneyInvestmentModal = closeAddMoneyInvestmentModal;
window.showUpdateInvestmentValueModal = showUpdateInvestmentValueModal;
window.closeUpdateInvestmentValueModal = closeUpdateInvestmentValueModal;
window.addMoneyToInvestment = addMoneyToInvestment;
window.updateInvestmentValue = updateInvestmentValue;

// Mostrar detalles de métrica de salud financiera
function showFinancialHealthDetail(metric, index) {
    const modal = document.getElementById('summaryDetailsModal');
    const titleEl = document.getElementById('summaryDetailsTitle');
    const contentEl = document.getElementById('summaryDetailsContent');
    
    if (!modal || !titleEl || !contentEl) return;
    
    titleEl.textContent = `${metric.icon} ${metric.title}`;
    
    // Obtener datos detallados según la métrica
    const periodTransactions = getTransactionsByPeriod();
    const period = getSelectedPeriod();
    const now = new Date();
    
    let monthsInPeriod = 1;
    if (period === 999) {
        const dates = periodTransactions.map(t => new Date(t.date));
        if (dates.length > 0) {
            const minDate = new Date(Math.min(...dates));
            const maxDate = new Date(Math.max(...dates));
            const diffTime = Math.abs(maxDate - minDate);
            monthsInPeriod = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30.44)));
        }
    } else {
        monthsInPeriod = period;
    }
    
    const totalTransactionsBalance = transactions.reduce((sum, t) => sum + t.amount, 0);
    const investmentsValue = investments.reduce((sum, inv) => sum + inv.current_value, 0);
    const loansCredit = loans.filter(l => l.type === 'credit').reduce((sum, loan) => {
        const amortization = calculateAmortizationTable(
            loan.principal,
            loan.interest_rate,
            loan.monthly_payment,
            loan.start_date,
            loan.total_paid || 0,
            loan.early_payments || []
        );
        return sum + amortization.finalBalance;
    }, 0);
    const totalAssets = totalTransactionsBalance + investmentsValue + loansCredit;
    
    // Verificar préstamos activos (que aún no han terminado)
    const activeDebtLoans = loans.filter(l => {
        if (l.type !== 'debt') return false;
        const endDate = new Date(l.end_date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return endDate >= today; // Préstamo aún activo
    });
    
    const loansDebt = activeDebtLoans.reduce((sum, loan) => {
        const amortization = calculateAmortizationTable(
            loan.principal,
            loan.interest_rate,
            loan.monthly_payment,
            loan.start_date,
            loan.total_paid || 0,
            loan.early_payments || []
        );
        return sum + amortization.finalBalance;
    }, 0);
    
    const hasActiveDebts = activeDebtLoans.length > 0;
    const periodIncome = periodTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const periodExpenses = Math.abs(periodTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0));
    const periodSavings = periodIncome - periodExpenses;
    const avgMonthlyIncome = monthsInPeriod > 0 ? periodIncome / monthsInPeriod : 0;
    const avgMonthlyExpenses = monthsInPeriod > 0 ? periodExpenses / monthsInPeriod : periodExpenses;
    const monthlyLoanPayments = loans.filter(l => l.type === 'debt').reduce((sum, loan) => sum + loan.monthly_payment, 0);
    
    // Generar gráfico según la métrica
    if (index === 0 || index === 1) { // Deuda vs Activos
        chartHTML = '<div style="margin: 20px 0;"><canvas id="metricChart" style="max-height: 300px;"></canvas></div>';
        chartData = {
            type: 'doughnut',
            data: {
                labels: ['Deuda', 'Activos'],
                datasets: [{
                    data: [loansDebt, Math.max(0, totalAssets - loansDebt)],
                    backgroundColor: ['#ef4444', '#10b981']
                }]
            }
        };
    } else if (index === 4) { // Ratio de Ahorro - Ingresos vs Gastos
        chartHTML = '<div style="margin: 20px 0;"><canvas id="metricChart" style="max-height: 300px;"></canvas></div>';
        chartData = {
            type: 'bar',
            data: {
                labels: ['Ingresos', 'Gastos', 'Ahorro'],
                datasets: [{
                    label: 'Euros',
                    data: [periodIncome, periodExpenses, Math.max(0, periodSavings)],
                    backgroundColor: ['#10b981', '#ef4444', '#6366f1']
                }]
            },
            options: {
                scales: { y: { beginAtZero: true } }
            }
        };
    } else if (index === 5) { // Liquidez - Evolución temporal
        const months = [];
        const balances = [];
        let runningBalance = totalTransactionsBalance;
        for (let i = monthsInPeriod - 1; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            months.push(date.toLocaleDateString('es-ES', { month: 'short' }));
            const monthTransactions = periodTransactions.filter(t => {
                const tDate = new Date(t.date);
                return tDate.getMonth() === date.getMonth() && tDate.getFullYear() === date.getFullYear();
            });
            runningBalance += monthTransactions.reduce((sum, t) => sum + t.amount, 0);
            balances.push(runningBalance);
        }
        chartHTML = '<div style="margin: 20px 0;"><canvas id="metricChart" style="max-height: 300px;"></canvas></div>';
        chartData = {
            type: 'line',
            data: {
                labels: months,
                datasets: [{
                    label: 'Balance',
                    data: balances,
                    borderColor: '#6366f1',
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            }
        };
    } else if (index === 6) { // Ratio de Inversión
        chartHTML = '<div style="margin: 20px 0;"><canvas id="metricChart" style="max-height: 300px;"></canvas></div>';
        chartData = {
            type: 'doughnut',
            data: {
                labels: ['Inversiones', 'Otros Activos'],
                datasets: [{
                    data: [investmentsValue, Math.max(0, totalAssets - investmentsValue)],
                    backgroundColor: ['#10b981', '#6366f1']
                }]
            }
        };
    }
    
    let detailContent = `
        <div style="display: flex; flex-direction: column; gap: 20px;">
            <div style="background: var(--gray-50); padding: 20px; border-radius: 12px;">
                <h3 style="margin: 0 0 12px 0; font-size: 18px; color: var(--gray-900);">Valor Actual</h3>
                <div style="font-size: 32px; font-weight: 700; color: var(--primary); margin-bottom: 8px;">
                    ${metric.value}
                </div>
                <p style="margin: 0; color: var(--gray-600); font-size: 14px;">${metric.description}</p>
            </div>
            
            ${chartHTML}
            
            <div>
                <h3 style="margin: 0 0 12px 0; font-size: 16px; color: var(--gray-900);">Detalles del Cálculo</h3>
                <div style="display: flex; flex-direction: column; gap: 12px;">
    `;
    
    // Agregar detalles específicos según la métrica
    if (index === 0) { // Deuda Pendiente
        detailContent += `
            <div style="padding: 12px; background: white; border-radius: 8px; border-left: 3px solid ${hasActiveDebts ? 'var(--danger)' : 'var(--success)'};">
                <strong>Préstamos Activos:</strong> ${activeDebtLoans.length} ${hasActiveDebts ? '(Hay deudas activas)' : '(Sin deudas activas)'}
            </div>
            <div style="padding: 12px; background: white; border-radius: 8px; border-left: 3px solid var(--danger);">
                <strong>Capital Restante Total:</strong> ${formatCurrency(loansDebt)}
            </div>
            <div style="padding: 12px; background: white; border-radius: 8px; border-left: 3px solid var(--success);">
                <strong>Activos Totales:</strong> ${formatCurrency(totalAssets)}
            </div>
        `;
    } else if (index === 1) { // Ratio de Endeudamiento
        detailContent += `
            <div style="padding: 12px; background: white; border-radius: 8px; border-left: 3px solid ${hasActiveDebts ? 'var(--danger)' : 'var(--success)'};">
                <strong>Préstamos Activos:</strong> ${activeDebtLoans.length} ${hasActiveDebts ? '(Hay deudas activas)' : '(Sin deudas activas)'}
            </div>
            <div style="padding: 12px; background: white; border-radius: 8px; border-left: 3px solid var(--danger);">
                <strong>Capital Restante Total:</strong> ${formatCurrency(loansDebt)}
            </div>
            <div style="padding: 12px; background: white; border-radius: 8px; border-left: 3px solid var(--success);">
                <strong>Activos Totales:</strong> ${formatCurrency(totalAssets)}
            </div>
            <div style="padding: 12px; background: white; border-radius: 8px; border-left: 3px solid var(--primary);">
                <strong>Ratio:</strong> ${(loansDebt / (totalAssets || 1) * 100).toFixed(2)}%
            </div>
        `;
    } else if (index === 2) { // Salud Financiera
        detailContent += `
            <div style="padding: 12px; background: white; border-radius: 8px; border-left: 3px solid ${hasActiveDebts ? 'var(--danger)' : 'var(--success)'};">
                <strong>Préstamos Activos:</strong> ${activeDebtLoans.length} ${hasActiveDebts ? '(Hay deudas activas)' : '(Sin deudas activas)'}
            </div>
            <div style="padding: 12px; background: white; border-radius: 8px; border-left: 3px solid var(--danger);">
                <strong>Capital Restante Total:</strong> ${formatCurrency(loansDebt)}
            </div>
            <div style="padding: 12px; background: white; border-radius: 8px; border-left: 3px solid var(--success);">
                <strong>Activos Totales:</strong> ${formatCurrency(totalAssets)}
            </div>
        `;
    } else if (index === 4) { // Ratio de Ahorro
        detailContent += `
            <div style="padding: 12px; background: white; border-radius: 8px; border-left: 3px solid var(--success);">
                <strong>Ingresos del Período:</strong> ${formatCurrency(periodIncome)}
            </div>
            <div style="padding: 12px; background: white; border-radius: 8px; border-left: 3px solid var(--danger);">
                <strong>Gastos del Período:</strong> ${formatCurrency(periodExpenses)}
            </div>
            <div style="padding: 12px; background: white; border-radius: 8px; border-left: 3px solid var(--primary);">
                <strong>Ahorro del Período:</strong> ${formatCurrency(periodSavings)}
            </div>
        `;
    } else if (index === 7) { // Servicio de Deuda
        detailContent += `
            <div style="padding: 12px; background: white; border-radius: 8px; border-left: 3px solid var(--danger);">
                <strong>Pagos Mensuales de Préstamos:</strong> ${formatCurrency(monthlyLoanPayments)}
            </div>
            <div style="padding: 12px; background: white; border-radius: 8px; border-left: 3px solid var(--success);">
                <strong>Ingresos Mensuales Promedio:</strong> ${formatCurrency(avgMonthlyIncome)} ${avgMonthlyIncome === 0 ? '(sin ingresos)' : ''}
            </div>
        `;
    }
    
    detailContent += `
                </div>
            </div>
            
            <div style="padding: 16px; background: var(--primary-light); border-radius: 12px; border: 1px solid var(--primary);">
                <p style="margin: 0; color: var(--gray-700); font-size: 14px; line-height: 1.6;">
                    <strong>Interpretación:</strong> ${metric.detail}
                </p>
            </div>
        </div>
    `;
    
    contentEl.innerHTML = detailContent;
    modal.style.display = 'flex';
    
    // Crear gráfico si hay datos
    if (chartData) {
        setTimeout(() => {
            const canvas = document.getElementById('metricChart');
            if (canvas && typeof Chart !== 'undefined') {
                // Destruir gráfico anterior si existe
                if (window.metricChartInstance) {
                    window.metricChartInstance.destroy();
                }
                window.metricChartInstance = new Chart(canvas, {
                    type: chartData.type,
                    data: chartData.data,
                    options: {
                        responsive: true,
                        maintainAspectRatio: true,
                        plugins: {
                            legend: { display: true }
                        },
                        ...chartData.options
                    }
                });
            }
        }, 100);
    }
}

// ==================== SISTEMA DE TRADUCCIÓN ====================

// Función para actualizar todas las traducciones
function updateTranslations() {
    // Usar funciones globales directamente
    const tFunc = window.t || (typeof t !== 'undefined' ? t : null);
    const getLangFunc = window.getLanguage || (typeof getLanguage !== 'undefined' ? getLanguage : null);
    
    // Si no están disponibles, intentar obtener idioma desde localStorage
    let lang = 'es';
    if (getLangFunc && typeof getLangFunc === 'function') {
        try {
            lang = getLangFunc();
        } catch (e) {
            console.warn('Error obteniendo idioma:', e);
            lang = localStorage.getItem('veedor_language') || 'es';
        }
    } else {
        lang = localStorage.getItem('veedor_language') || 'es';
    }
    
    console.log('🔄 Actualizando traducciones para:', lang);
    console.log('📦 Funciones disponibles:', { t: !!tFunc, getLanguage: !!getLangFunc, translations: !!window.translations });
    
    if (!tFunc && window.translations && window.translations[lang]) {
        // Fallback: usar traducciones directamente
        console.log('⚠️ Usando traducciones directamente desde window.translations');
        const trans = window.translations[lang];
        
        // Función t simple
        const simpleT = (key) => {
            const keys = key.split('.');
            let value = trans;
            for (const k of keys) {
                value = value?.[k];
                if (!value) {
                    // Fallback a español
                    value = window.translations['es'];
                    for (const k2 of keys) {
                        value = value?.[k2];
                    }
                    break;
                }
            }
            return value || key;
        };
        
        // Actualizar elementos
        document.querySelectorAll('[data-translate]').forEach(el => {
            const key = el.getAttribute('data-translate');
            if (key) {
                try {
                    const translation = simpleT(key);
                    if (translation && translation !== key) {
                        el.textContent = translation;
                    }
                } catch (e) {
                    console.warn('Error traduciendo:', key, e);
                }
            }
        });
        
        // Actualizar placeholders
        document.querySelectorAll('[data-translate-placeholder]').forEach(el => {
            const key = el.getAttribute('data-translate-placeholder');
            if (key) {
                try {
                    const translation = simpleT(key);
                    if (translation && translation !== key) {
                        el.placeholder = translation;
                    }
                } catch (e) {
                    console.warn('Error traduciendo placeholder:', key, e);
                }
            }
        });
        
        // Actualizar banderas
        const flags = { es: '🇪🇸', en: '🇬🇧', de: '🇩🇪', fr: '🇫🇷' };
        const flagEl = document.getElementById('currentLanguageFlag');
        if (flagEl) flagEl.textContent = flags[lang] || flags['es'];
        const authFlagEl = document.getElementById('authCurrentLanguageFlag');
        if (authFlagEl) authFlagEl.textContent = flags[lang] || flags['es'];
        document.documentElement.lang = lang;
        return;
    }
    
    if (!tFunc) {
        console.warn('⚠️ Función t no disponible. Esperando a que translations.js se cargue...');
        return;
    }
    
    // Actualizar elementos con data-translate (incluyendo elementos dinámicos)
    const elementsToTranslate = document.querySelectorAll('[data-translate]');
    console.log(`📝 Encontrados ${elementsToTranslate.length} elementos para traducir`);
    elementsToTranslate.forEach(el => {
        const key = el.getAttribute('data-translate');
        if (key && tFunc) {
            try {
                const translation = tFunc(key, lang);
                if (translation && translation !== key) {
                    el.textContent = translation;
                    console.log(`✅ Traducido: ${key} -> ${translation}`);
                } else {
                    console.warn(`⚠️ No se encontró traducción para: ${key}`);
                }
            } catch (e) {
                console.warn('Error traduciendo:', key, e);
            }
        }
    });
    
    // Actualizar placeholders
    document.querySelectorAll('[data-translate-placeholder]').forEach(el => {
        const key = el.getAttribute('data-translate-placeholder');
        if (key && tFunc) {
            try {
                const translation = tFunc(key, lang);
                if (translation && translation !== key) {
                    el.placeholder = translation;
                }
            } catch (e) {
                console.warn('Error traduciendo placeholder:', key, e);
            }
        }
    });
    
    // Actualizar títulos
    document.querySelectorAll('[data-translate-title]').forEach(el => {
        const key = el.getAttribute('data-translate-title');
        if (key && tFunc) {
            try {
                const translation = tFunc(key, lang);
                if (translation && translation !== key) {
                    el.title = translation;
                }
            } catch (e) {
                console.warn('Error traduciendo title:', key, e);
            }
        }
    });
    
    // Actualizar bandera del idioma actual (header)
    const flags = { es: '🇪🇸', en: '🇬🇧', de: '🇩🇪', fr: '🇫🇷' };
    const flagEl = document.getElementById('currentLanguageFlag');
    if (flagEl) {
        flagEl.textContent = flags[lang] || flags['es'];
    }
    
    // Actualizar bandera del idioma actual (auth page)
    const authFlagEl = document.getElementById('authCurrentLanguageFlag');
    if (authFlagEl) {
        authFlagEl.textContent = flags[lang] || flags['es'];
    }
    
    // Actualizar selección en dropdown de idioma (header)
    document.querySelectorAll('#languageDropdown .nav-dropdown-item').forEach(item => {
        const itemLang = item.getAttribute('data-lang');
        if (itemLang === lang) {
            item.style.background = 'var(--primary-light)';
            item.style.color = 'var(--primary)';
            item.style.fontWeight = '600';
        } else {
            item.style.background = 'transparent';
            item.style.color = 'var(--gray-900)';
            item.style.fontWeight = '400';
        }
    });
    
    // Actualizar selección en dropdown de idioma (auth page)
    document.querySelectorAll('#authLanguageDropdown .nav-dropdown-item').forEach(item => {
        const itemLang = item.getAttribute('data-lang');
        if (itemLang === lang) {
            item.style.background = 'var(--primary-light)';
            item.style.color = 'var(--primary)';
            item.style.fontWeight = '600';
        } else {
            item.style.background = 'transparent';
            item.style.color = 'var(--gray-900)';
            item.style.fontWeight = '400';
        }
    });
    
    // Actualizar atributo lang del HTML
    document.documentElement.lang = lang;
    
    // Forzar actualización de elementos dinámicos que puedan tener texto hardcodeado
    // Esto se ejecutará después de que se actualicen los elementos estáticos
    setTimeout(() => {
        // Actualizar tabs activos usando tFunc
        const tFuncForDynamic = window.t || (typeof t !== 'undefined' ? t : null);
        if (tFuncForDynamic) {
            const activeTab = document.querySelector('.tab-btn.active');
            if (activeTab) {
                const tabKey = activeTab.getAttribute('data-translate');
                if (tabKey) {
                    try {
                        const translation = tFuncForDynamic(tabKey, lang);
                        if (translation && translation !== tabKey) {
                            const span = activeTab.querySelector('span[data-translate]');
                            if (span) span.textContent = translation;
                        }
                    } catch (e) {}
                }
            }
            
            // Actualizar navegación
            document.querySelectorAll('.nav-dropdown-item span[data-translate]').forEach(span => {
                const key = span.getAttribute('data-translate');
                if (key) {
                    try {
                        const translation = tFuncForDynamic(key, lang);
                        if (translation && translation !== key) {
                            span.textContent = translation;
                        }
                    } catch (e) {}
                }
            });
        }
    }, 100);
}

// Función para cambiar idioma
function changeLanguage(lang) {
    console.log('🌐 Cambiando idioma a:', lang);
    
    // Guardar idioma
    const setLangFunc = window.setLanguage || (typeof setLanguage !== 'undefined' ? setLanguage : null);
    if (setLangFunc && typeof setLangFunc === 'function') {
        try {
            setLangFunc(lang);
        } catch (e) {
            console.warn('Error en setLanguage:', e);
            localStorage.setItem('veedor_language', lang);
        }
    } else {
        // Fallback: guardar en localStorage directamente
        localStorage.setItem('veedor_language', lang);
        // Actualizar variable global si existe
        if (typeof window !== 'undefined') {
            window.currentLanguage = lang;
        }
    }
    
    console.log('💾 Idioma guardado:', localStorage.getItem('veedor_language'));
    
    // Forzar actualización inmediata
    const forceUpdate = () => {
        console.log('🔄 Forzando actualización de traducciones...');
        updateTranslations();
        
        // Actualizar elementos dinámicos manualmente
        const tFunc = window.t || (typeof t !== 'undefined' ? t : null);
        if (tFunc) {
            // Actualizar navegación
            document.querySelectorAll('#mainNavDropdown .nav-dropdown-item span[data-translate]').forEach(span => {
                const key = span.getAttribute('data-translate');
                if (key) {
                    try {
                        const translation = tFunc(key, lang);
                        if (translation && translation !== key) {
                            span.textContent = translation;
                        }
                    } catch (e) {}
                }
            });
            
            // Actualizar tabs
            document.querySelectorAll('.tab-btn').forEach(btn => {
                const span = btn.querySelector('span[data-translate]');
                if (span) {
                    const key = span.getAttribute('data-translate');
                    if (key) {
                        try {
                            const translation = tFunc(key, lang);
                            if (translation && translation !== key) {
                                span.textContent = translation;
                            }
                        } catch (e) {}
                    }
                }
            });
        }
    };
    
    // Actualizar traducciones múltiples veces para asegurar que funcione
    forceUpdate();
    setTimeout(forceUpdate, 50);
    setTimeout(forceUpdate, 200);
    setTimeout(forceUpdate, 500);
    setTimeout(forceUpdate, 1000);
    
    // Recargar datos para actualizar formatos (solo si estamos en la app principal)
    if (typeof updateDisplay === 'function' && document.getElementById('mainApp') && document.getElementById('mainApp').style.display !== 'none') {
        setTimeout(() => {
            updateDisplay();
        }, 300);
    }
    
    // Forzar actualización de todos los elementos dinámicos
    if (typeof updateCharts === 'function') {
        setTimeout(() => {
            updateCharts();
        }, 400);
    }
}

// Función para toggle del dropdown de idioma (header)
function toggleLanguageDropdown() {
    const dropdown = document.getElementById('languageDropdown');
    const mainNavDropdown = document.getElementById('mainNavDropdown');
    const settingsDropdown = document.getElementById('settingsDropdown');
    
    if (dropdown) {
        dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
    }
    
    // Cerrar otros dropdowns
    if (mainNavDropdown && mainNavDropdown.style.display === 'block') {
        mainNavDropdown.style.display = 'none';
    }
    if (settingsDropdown && settingsDropdown.style.display === 'block') {
        settingsDropdown.style.display = 'none';
    }
}

// Función para toggle del dropdown de idioma (auth page)
function toggleAuthLanguageDropdown() {
    const dropdown = document.getElementById('authLanguageDropdown');
    
    if (dropdown) {
        dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
    }
}

// Exponer funciones globalmente
window.updateTranslations = updateTranslations;
window.changeLanguage = changeLanguage;
window.toggleLanguageDropdown = toggleLanguageDropdown;

// Inicializar traducciones cuando se carga la app
function initializeTranslationsOnLoad() {
    // Establecer español como idioma por defecto si no hay idioma guardado
    if (!localStorage.getItem('veedor_language')) {
        localStorage.setItem('veedor_language', 'es');
        console.log('🌐 Idioma por defecto establecido: Español');
    }
    
    // Esperar a que translations.js se cargue completamente
    const checkAndInit = () => {
        const getLangFunc = window.getLanguage || (typeof getLanguage !== 'undefined' ? getLanguage : null);
        const savedLang = localStorage.getItem('veedor_language') || 'es';
        
        if (window.translations) {
            console.log('✅ translations.js cargado');
            
            // Establecer idioma si la función está disponible
            if (getLangFunc && typeof getLangFunc === 'function') {
                try {
                    const currentLang = getLangFunc();
                    if (currentLang !== savedLang && window.setLanguage) {
                        window.setLanguage(savedLang);
                    }
                } catch (e) {
                    console.warn('Error obteniendo idioma:', e);
                }
            } else if (window.setLanguage && typeof window.setLanguage === 'function') {
                try {
                    window.setLanguage(savedLang);
                } catch (e) {
                    console.warn('Error estableciendo idioma:', e);
                }
            }
            
            document.documentElement.lang = savedLang;
            
            // Actualizar traducciones después de un delay
            setTimeout(() => {
                if (typeof updateTranslations === 'function') {
                    console.log('🔄 Inicializando traducciones al cargar...');
                    updateTranslations();
                }
            }, 200);
        } else {
            console.log('⏳ Esperando a que translations.js se cargue...');
            setTimeout(checkAndInit, 100);
        }
    };
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', checkAndInit);
    } else {
        checkAndInit();
    }
}

// Inicializar traducciones
initializeTranslationsOnLoad();

// Cerrar el bloque de protección contra carga múltiple
}

