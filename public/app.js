// Evitar cargar múltiples veces
// Versión: 2.1.0 - Cuentas bancarias y presupuestos de ingresos
if (window.VEEDOR_LOADED) {
    console.warn('⚠️ app.js ya fue cargado, evitando carga duplicada');
} else {
    window.VEEDOR_LOADED = true;
    
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
let assets = [];
let charts = {};
let currentUser = null;
let authToken = null;
let summaryPeriod = 'month'; // 'month', 'year', 'all'

// Utilidad para hacer peticiones autenticadas
async function apiRequest(endpoint, options = {}) {
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
    }

    try {
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

// Inicialización - Ejecutar inmediatamente
console.log('🚀 app.js ejecutándose...');
console.log('Estado del DOM:', document.readyState);

function initializeApp() {
    console.log('=== INICIALIZANDO APLICACIÓN ===');
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
            currentUser = data.user.username;
            showMainApp();
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
        } catch (error) {
            console.error('Error verificando autenticación:', error);
            logout();
        }
    } else {
        showAuthScreen();
    }
}

// Inicializar sistema de autenticación
function initializeAuth() {
    console.log('Inicializando autenticación...');
    
    // Tabs de autenticación
    const authTabs = document.querySelectorAll('.auth-tab-btn');
    console.log('Tabs encontrados:', authTabs.length);
    authTabs.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-auth-tab');
            authTabs.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const loginForm = document.getElementById('loginForm');
            const registerForm = document.getElementById('registerForm');
            
            if (loginForm) loginForm.classList.toggle('active', targetTab === 'login');
            if (registerForm) registerForm.classList.toggle('active', targetTab === 'register');
            
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
        switchUserBtn.addEventListener('click', () => {
            if (confirm('¿Deseas cerrar sesión y cambiar de usuario?')) {
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

// Solicitar recuperación de contraseña
async function requestPasswordReset() {
    const email = document.getElementById('forgotEmail').value.trim();
    const errorMsg = document.getElementById('forgotPasswordError');
    const successMsg = document.getElementById('forgotPasswordSuccess');
    const resetSection = document.getElementById('resetPasswordSection');
    
    if (errorMsg) errorMsg.textContent = '';
    if (successMsg) successMsg.style.display = 'none';
    
    if (!email) {
        if (errorMsg) errorMsg.textContent = 'Por favor ingresa tu email';
        return;
    }
    
    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        if (errorMsg) errorMsg.textContent = 'Por favor ingresa un email válido';
        return;
    }
    
    try {
        const data = await apiRequest('/forgot-password', {
            method: 'POST',
            body: JSON.stringify({ email })
        });
        
        if (successMsg) {
            successMsg.textContent = `Código de recuperación generado: ${data.token} (válido por 1 hora). En producción se enviaría por email.`;
            successMsg.style.display = 'block';
        }
        if (resetSection) resetSection.style.display = 'block';
    } catch (error) {
        if (errorMsg) errorMsg.textContent = error.message || 'Error al solicitar recuperación';
    }
}

// Resetear contraseña
async function resetPassword() {
    const token = document.getElementById('resetToken').value.trim();
    const newPassword = document.getElementById('resetNewPassword').value;
    const errorMsg = document.getElementById('resetPasswordError');
    
    if (errorMsg) errorMsg.textContent = '';
    
    if (!token || !newPassword) {
        if (errorMsg) errorMsg.textContent = 'Por favor completa todos los campos';
        return;
    }
    
    if (newPassword.length < 4) {
        if (errorMsg) errorMsg.textContent = 'La contraseña debe tener al menos 4 caracteres';
        return;
    }
    
    try {
        await apiRequest('/reset-password', {
            method: 'POST',
            body: JSON.stringify({ token, newPassword })
        });
        
        alert('✅ Contraseña actualizada exitosamente. Ahora puedes iniciar sesión.');
        const forgotForm = document.getElementById('forgotPasswordFormElement');
        const resetForm = document.getElementById('resetPasswordFormElement');
        if (forgotForm) forgotForm.reset();
        if (resetForm) resetForm.reset();
        const forgotPasswordForm = document.getElementById('forgotPasswordForm');
        const loginForm = document.getElementById('loginForm');
        if (forgotPasswordForm) forgotPasswordForm.style.display = 'none';
        if (loginForm) loginForm.style.display = 'block';
    } catch (error) {
        if (errorMsg) errorMsg.textContent = error.message || 'Error al restablecer contraseña';
    }
}

// Registrar nuevo usuario
async function register() {
    console.log('=== FUNCIÓN REGISTER LLAMADA ===');
    
    const emailInput = document.getElementById('registerEmail');
    const passwordInput = document.getElementById('registerPassword');
    const passwordConfirmInput = document.getElementById('registerPasswordConfirm');
    const errorMsg = document.getElementById('registerError');
    
    if (!emailInput || !passwordInput || !passwordConfirmInput || !errorMsg) {
        console.error('❌ Elementos del formulario no encontrados');
        alert('Error: Formulario no encontrado. Recarga la página.');
        return;
    }
    
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const passwordConfirm = passwordConfirmInput.value;
    
    console.log('Datos del formulario:', { email, passwordLength: password.length, passwordsMatch: password === passwordConfirm });
    
    errorMsg.textContent = '';
    
    if (!email) {
        errorMsg.textContent = 'El email es requerido';
        console.log('Validación fallida: email vacío');
        return;
    }
    
    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        errorMsg.textContent = 'Por favor ingresa un email válido';
        console.log('Validación fallida: email inválido');
        return;
    }
    
    if (password !== passwordConfirm) {
        errorMsg.textContent = 'Las contraseñas no coinciden';
        console.log('Validación fallida: contraseñas no coinciden');
        return;
    }
    
    if (password.length < 4) {
        errorMsg.textContent = 'La contraseña debe tener al menos 4 caracteres';
        console.log('Validación fallida: contraseña muy corta');
        return;
    }
    
    try {
        errorMsg.textContent = 'Registrando...';
        errorMsg.style.color = '#666';
        console.log('Enviando registro a:', `${API_URL}/register`);
        console.log('URL completa:', window.location.origin + API_URL + '/register');
        console.log('Datos:', { email, password: '***' });
        
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
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
        currentUser = data.user.email;
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
        errorMsg.textContent = error.message || 'Error al registrar usuario. Verifica tu conexión.';
        errorMsg.style.color = '#ef4444';
    }
}

// Iniciar sesión
async function login() {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const errorMsg = document.getElementById('loginError');
    
    errorMsg.textContent = '';
    
    if (!email) {
        errorMsg.textContent = 'Por favor ingresa tu email';
        return;
    }
    
    try {
        const data = await apiRequest('/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
        
        authToken = data.token;
        currentUser = data.user.email;
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
        
        document.getElementById('loginFormElement').reset();
    } catch (error) {
        errorMsg.textContent = error.message || 'Error al iniciar sesión';
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
    document.getElementById('authScreen').style.display = 'flex';
    document.getElementById('mainApp').style.display = 'none';
}

// Mostrar aplicación principal
function showMainApp() {
    document.getElementById('authScreen').style.display = 'none';
    document.getElementById('mainApp').style.display = 'block';
}

// Actualizar información del usuario
function updateUserInfo() {
    document.getElementById('currentUser').textContent = `👤 ${currentUser}`;
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
        
        // Actualizar selector de cuentas después de cargar datos
        updateAccountSelect();
        
        // Cargar categorías personalizadas
        loadCustomCategories();
        
        // Cargar meta de ahorro
        const savedGoal = localStorage.getItem('veedor_savingsGoal');
        if (savedGoal) {
            try {
                savingsGoal = parseFloat(savedGoal);
            } catch (e) {
                savingsGoal = null;
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
}

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

// Inicializar tabs
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');
            
            tabButtons.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            btn.classList.add('active');
            document.getElementById(`${targetTab}-tab`).classList.add('active');
            
            // Actualizar gráficas y análisis cuando se cambia al tab de análisis
            if (targetTab === 'charts') {
                // Pequeño delay para asegurar que el tab esté visible
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
            
            // Actualizar patrimonio cuando se cambia al tab de patrimonio
            if (targetTab === 'assets') {
                setTimeout(() => {
                    updateAssets();
                }, 100);
            }
        });
    });
}

// Inicializar formularios
function initializeForms() {
    // Formulario de transacciones
    const transactionForm = document.getElementById('transactionForm');
    if (transactionForm) {
        transactionForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await addTransaction();
        });
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
        
        // Calcular rentabilidad automáticamente
        const investmentAmount = document.getElementById('investmentAmount');
        const investmentCurrentValue = document.getElementById('investmentCurrentValue');
        const investmentReturn = document.getElementById('investmentReturn');
        const investmentProfit = document.getElementById('investmentProfit');
        
        if (investmentAmount && investmentCurrentValue && investmentReturn && investmentProfit) {
            const calculateReturn = () => {
                const amount = parseFloat(investmentAmount.value) || 0;
                const current = parseFloat(investmentCurrentValue.value) || 0;
                
                if (amount > 0) {
                    const profit = current - amount;
                    const returnPercent = ((profit / amount) * 100);
                    investmentProfit.value = profit.toFixed(2);
                    investmentReturn.value = returnPercent.toFixed(2);
                }
            };
            
            investmentAmount.addEventListener('input', calculateReturn);
            investmentCurrentValue.addEventListener('input', calculateReturn);
        }
        
        // Inicializar fecha
        const investmentDate = document.getElementById('investmentDate');
        if (investmentDate) {
            const today = new Date().toISOString().split('T')[0];
            investmentDate.value = today;
        }
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
    
    // Selector de período para gráficas
    const chartPeriod = document.getElementById('chartPeriod');
    if (chartPeriod) {
        chartPeriod.addEventListener('change', updateCharts);
    }
    
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
            const currentGoal = savingsGoal ? savingsGoal.toString() : '';
            const newGoal = prompt('Establece tu meta de ahorro (en euros):', currentGoal);
            if (newGoal && !isNaN(newGoal) && parseFloat(newGoal) > 0) {
                savingsGoal = parseFloat(newGoal);
                localStorage.setItem('veedor_savingsGoal', savingsGoal.toString());
                updateSummary();
                alert('✅ Meta de ahorro establecida');
            } else if (newGoal === '') {
                // Eliminar meta
                savingsGoal = null;
                localStorage.removeItem('veedor_savingsGoal');
                updateSummary();
            }
        });
    }
    
    // Botón de exportar CSV
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportData);
    }
    
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
}

// Agregar transacción
async function addTransaction() {
    const type = document.getElementById('transactionType').value;
    const date = document.getElementById('transactionDate').value;
    const amount = parseFloat(document.getElementById('transactionAmount').value);
    const categoryGeneral = document.getElementById('categoryGeneral').value;
    const categorySpecific = document.getElementById('categorySpecific').value;
    const envelope = document.getElementById('envelope').value;
    const accountId = document.getElementById('transactionAccount').value;
    const investmentId = document.getElementById('transactionInvestment').value;
    const description = document.getElementById('transactionDescription').value;
    
    try {
        const transaction = await apiRequest('/transactions', {
            method: 'POST',
            body: JSON.stringify({
                type,
                date,
                amount: Math.abs(amount),
                categoryGeneral,
                categorySpecific,
                envelope: envelope || null,
                account_id: accountId || null,
                investment_id: investmentId || null,
                description: description || `${categories.general.find(c => c.id === categoryGeneral)?.name} - ${categorySpecific}`
            })
        });
        
        // Si la transacción está asociada a una inversión, actualizar el monto invertido
        if (investmentId) {
            const investment = investments.find(inv => (inv._id || inv.id) === investmentId);
            if (investment) {
                let newAmount = investment.amount;
                if (type === 'expense') {
                    // Si es un gasto, se suma al monto invertido (dinero que se invierte)
                    newAmount = investment.amount + Math.abs(amount);
                } else if (type === 'income') {
                    // Si es un ingreso, podría ser una retirada (restar) o un retorno (sumar al valor actual)
                    // Por ahora, asumimos que es un retorno y actualizamos el valor actual
                    const newCurrentValue = investment.current_value + amount;
                    try {
                        await apiRequest(`/investments/${investmentId}`, {
                            method: 'PUT',
                            body: JSON.stringify({
                                ...investment,
                                current_value: newCurrentValue
                            })
                        });
                    } catch (error) {
                        console.error('Error actualizando valor de inversión:', error);
                    }
                }
                
                if (type === 'expense') {
                    try {
                        await apiRequest(`/investments/${investmentId}`, {
                            method: 'PUT',
                            body: JSON.stringify({
                                ...investment,
                                amount: newAmount
                            })
                        });
                        await loadUserData(); // Recargar datos para reflejar el cambio
                    } catch (error) {
                        console.error('Error actualizando inversión:', error);
                    }
                }
            }
        }
        
        // Agregar a la lista local
        transactions.push({
            ...transaction,
            categoryGeneral: transaction.category_general,
            categorySpecific: transaction.category_specific
        });
        transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        updateDisplay();
        document.getElementById('transactionForm').reset();
        initializeDate();
        initializeCategories();
        updateEnvelopeSelect();
        updateAccountSelect();
    } catch (error) {
        alert('Error al agregar transacción: ' + error.message);
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
        updateLoans();
        updateInvestments();
        updateBudgets(); // Asegurar que los presupuestos se actualicen
        updateAssets(); // Actualizar patrimonio
        updateMonthFilter();
        updateMonthDashboard();
        
        // Actualizar métricas y tablas de análisis si estamos en el tab de análisis
        const chartsTab = document.getElementById('charts-tab');
        if (chartsTab && chartsTab.classList.contains('active')) {
            updateFinancialHealthMetrics();
            updateAnalysisTables();
        }
    } catch (error) {
        console.error('Error en updateDisplay:', error);
    }
}

// Actualizar resumen
function updateSummary() {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    // Cargar meta de ahorro
    const savedGoal = localStorage.getItem('veedor_savingsGoal');
    if (savedGoal) {
        try {
            savingsGoal = parseFloat(savedGoal);
        } catch (e) {
            savingsGoal = null;
        }
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
    const totalBalance = transactionsBalance + investmentsValue + loansCredit - loansDebt;
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
        tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 40px; color: #999;">No hay transacciones registradas</td></tr>';
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
        
        row.innerHTML = `
            <td>${formatDate(date)}</td>
            <td><span class="badge badge-${transaction.type}">${transaction.type === 'income' ? 'Ingreso' : 'Gasto'}</span></td>
            <td>${categoryName} - ${transaction.categorySpecific}</td>
            <td>${transaction.description || '-'}</td>
            <td>${accountName}</td>
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
    if (!confirm('¿Estás seguro de eliminar esta transacción?')) return;
    
    try {
        await apiRequest(`/transactions/${id}`, { method: 'DELETE' });
        // Recargar datos desde el servidor
        await loadUserData();
        updateDisplay();
    } catch (error) {
        alert('Error al eliminar transacción: ' + error.message);
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
    const amount = parseFloat(document.getElementById('investmentAmount').value);
    const currentValue = parseFloat(document.getElementById('investmentCurrentValue').value);
    const date = document.getElementById('investmentDate').value;
    const description = document.getElementById('investmentDescription').value.trim();
    
    // Aportes periódicos
    const enablePeriodic = document.getElementById('enablePeriodicContribution')?.checked || false;
    const contributionFrequency = document.getElementById('contributionFrequency')?.value || 'monthly';
    const contributionAmount = parseFloat(document.getElementById('contributionAmount')?.value || 0);
    const contributionStartDate = document.getElementById('contributionStartDate')?.value || null;
    const contributionEndDate = document.getElementById('contributionEndDate')?.value || null;
    
    if (!name || !amount || !currentValue || !date || !type) {
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
            amount,
            current_value: currentValue,
            date,
            description: description || null,
            periodic_contribution: {
                enabled: enablePeriodic,
                frequency: enablePeriodic ? contributionFrequency : 'monthly',
                amount: enablePeriodic ? contributionAmount : 0,
                start_date: enablePeriodic ? contributionStartDate : null,
                end_date: enablePeriodic ? (contributionEndDate || null) : null
            }
        };
        
        const investment = await apiRequest('/investments', {
            method: 'POST',
            body: JSON.stringify(investmentData)
        });
        
        investments.push(investment);
        updateDisplay();
        document.getElementById('investmentForm').reset();
        const investmentDate = document.getElementById('investmentDate');
        if (investmentDate) {
            const today = new Date().toISOString().split('T')[0];
            investmentDate.value = today;
        }
        // Resetear campos de aportes periódicos
        const enablePeriodicCheckbox = document.getElementById('enablePeriodicContribution');
        const periodicFields = document.getElementById('periodicContributionFields');
        if (enablePeriodicCheckbox) enablePeriodicCheckbox.checked = false;
        if (periodicFields) periodicFields.style.display = 'none';
        alert('✅ Inversión agregada exitosamente');
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
    
    const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);
    const totalCurrentValue = investments.reduce((sum, inv) => sum + inv.current_value, 0);
    const totalProfit = totalCurrentValue - totalInvested;
    const totalReturn = totalInvested > 0 ? ((totalProfit / totalInvested) * 100) : 0;
    
    investments.forEach(investment => {
        const profit = investment.current_value - investment.amount;
        const returnPercent = investment.amount > 0 ? ((profit / investment.amount) * 100) : 0;
        const investmentDate = new Date(investment.date);
        const daysHeld = Math.floor((new Date() - investmentDate) / (1000 * 60 * 60 * 24));
        
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
                    <div><strong>Invertido:</strong></div>
                    <div style="text-align: right;">${formatCurrency(investment.amount)}</div>
                    <div><strong>Valor Actual:</strong></div>
                    <div style="text-align: right; font-weight: 600;">${formatCurrency(investment.current_value)}</div>
                    <div><strong>Ganancia/Pérdida:</strong></div>
                    <div style="text-align: right; color: ${profit >= 0 ? 'var(--success)' : 'var(--danger)'}; font-weight: 700; font-size: 16px;">
                        ${profit >= 0 ? '+' : ''}${formatCurrency(profit)}
                    </div>
                    <div><strong>Rentabilidad:</strong></div>
                    <div style="text-align: right; color: ${returnPercent >= 0 ? 'var(--success)' : 'var(--danger)'}; font-weight: 700;">
                        ${returnPercent >= 0 ? '+' : ''}${returnPercent.toFixed(2)}%
                    </div>
                    <div><strong>Días:</strong></div>
                    <div style="text-align: right; color: var(--gray-600);">${daysHeld}</div>
                </div>
            </div>
            
            ${investment.description ? `<div style="margin: 12px 0; font-size: 13px; color: var(--gray-600); font-style: italic;">${investment.description}</div>` : ''}
            
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
                </div>
            ` : ''}
            
            <div class="envelope-actions" style="display: flex; gap: 8px; margin-top: 12px;">
                <button class="btn-secondary" onclick="editInvestment('${investment._id || investment.id}')" style="flex: 1;">✏️ Editar</button>
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

// Editar inversión
async function editInvestment(id) {
    const investment = investments.find(inv => (inv._id || inv.id) === id);
    if (!investment) return;
    
    const newValue = prompt(`Actualizar valor de "${investment.name}"\n\nValor actual: ${formatCurrency(investment.current_value)}\n\nNuevo valor (€):`, investment.current_value);
    if (!newValue || isNaN(newValue)) return;
    
    try {
        await apiRequest(`/investments/${id}`, {
            method: 'PUT',
            body: JSON.stringify({
                current_value: parseFloat(newValue)
            })
        });
        
        await loadUserData();
        updateDisplay();
        alert('✅ Inversión actualizada');
    } catch (error) {
        alert('Error al actualizar inversión: ' + error.message);
    }
}

// Eliminar inversión
async function deleteInvestment(id) {
    if (!confirm('¿Estás seguro de eliminar esta inversión?')) return;
    
    try {
        await apiRequest(`/investments/${id}`, { method: 'DELETE' });
        await loadUserData();
        updateDisplay();
    } catch (error) {
        alert('Error al eliminar inversión: ' + error.message);
    }
}

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
    const account = accounts.find(a => (a._id || a.id) === id);
    if (!account) return;
    
    const newBalance = prompt(`Actualizar saldo de "${account.name}":`, account.balance);
    if (newBalance === null) return;
    
    const balance = parseFloat(newBalance);
    if (isNaN(balance)) {
        alert('Por favor ingresa un número válido');
        return;
    }
    
    try {
        await apiRequest(`/accounts/${id}`, {
            method: 'PUT',
            body: JSON.stringify({
                ...account,
                balance
            })
        });
        
        await loadUserData();
        updateDisplay();
        alert('✅ Saldo actualizado exitosamente');
    } catch (error) {
        alert('Error al actualizar cuenta: ' + error.message);
    }
}

// Eliminar cuenta
async function deleteAccount(id) {
    if (!confirm('¿Estás seguro de eliminar esta cuenta?')) return;
    
    try {
        await apiRequest(`/accounts/${id}`, { method: 'DELETE' });
        await loadUserData();
        updateDisplay();
    } catch (error) {
        alert('Error al eliminar cuenta: ' + error.message);
    }
}

// Exponer funciones globales
window.editInvestment = editInvestment;
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
    const asset = assets.find(a => (a._id || a.id) === id);
    if (!asset) return;
    
    const newValue = prompt(`Actualizar valor actual de "${asset.name}":`, asset.current_value);
    if (newValue === null) return;
    
    const currentValue = parseFloat(newValue);
    if (isNaN(currentValue)) {
        alert('Por favor ingresa un número válido');
        return;
    }
    
    try {
        await apiRequest(`/assets/${id}`, {
            method: 'PUT',
            body: JSON.stringify({
                ...asset,
                current_value: currentValue,
                update_value_history: true
            })
        });
        
        await loadUserData();
        updateDisplay();
        alert('✅ Valor actualizado exitosamente');
    } catch (error) {
        alert('Error al actualizar bien: ' + error.message);
    }
}

// Eliminar bien
async function deleteAsset(id) {
    if (!confirm('¿Estás seguro de eliminar este bien?')) return;
    
    try {
        await apiRequest(`/assets/${id}`, { method: 'DELETE' });
        await loadUserData();
        updateDisplay();
    } catch (error) {
        alert('Error al eliminar bien: ' + error.message);
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

// Obtener período seleccionado
function getSelectedPeriod() {
    const periodSelect = document.getElementById('chartPeriod');
    if (!periodSelect) return 6;
    const value = periodSelect.value;
    return value === 'all' ? 999 : parseInt(value) || 6;
}

// Obtener transacciones filtradas por período
function getTransactionsByPeriod() {
    const period = getSelectedPeriod();
    const now = new Date();
    
    if (period === 999) { // "all"
        return transactions;
    }
    
    const startDate = new Date(now.getFullYear(), now.getMonth() - period, 1);
    return transactions.filter(t => {
        const tDate = new Date(t.date);
        return tDate >= startDate;
    });
}

// Actualizar gráficas
function updateCharts() {
    updateSavingsChart();
    updateExpensesChart();
    updateIncomeExpenseChart();
    updateDistributionChart();
    updateIncomeEvolutionChart();
    updateExpensesEvolutionChart();
    updateLoansPendingChart();
    updateAssetsEvolutionChart();
    updateAccountsBalanceChart();
    updateFinancialHealthMetrics();
    updateAnalysisTables();
}

// Gráfica de ahorro
function updateSavingsChart() {
    if (!charts.savings) return;
    
    const period = getSelectedPeriod();
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
    
    const periodTransactions = getTransactionsByPeriod();
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
    
    const period = getSelectedPeriod();
    const now = new Date();
    const months = [];
    const incomes = [];
    const expenses = [];
    
    const periodTransactions = getTransactionsByPeriod();
    
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
    
    const periodTransactions = getTransactionsByPeriod();
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
                card.style.cssText = 'background: white; padding: 20px; border-radius: var(--radius); border: 1px solid var(--border-color); box-shadow: var(--shadow-light);';
                card.innerHTML = `
                    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 12px;">
                        <div>
                            <h5 style="font-size: 16px; font-weight: 700; margin: 0 0 4px 0; color: var(--gray-900);">${categoryName}</h5>
                            <p style="font-size: 14px; color: var(--gray-600); margin: 0;">${data.transactions.length} transacción${data.transactions.length !== 1 ? 'es' : ''}</p>
                        </div>
                        <div style="text-align: right;">
                            <p style="font-size: 20px; font-weight: 700; margin: 0; color: var(--danger-color);">${formatCurrency(data.amount)}</p>
                            ${budgetAmount > 0 ? `<small style="color: var(--gray-500);">de ${formatCurrency(budgetAmount)}</small>` : ''}
                        </div>
                    </div>
                    ${budgetAmount > 0 ? `
                        <div style="margin-top: 12px;">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                                <small style="font-size: 12px; color: var(--gray-600);">Progreso del presupuesto</small>
                                <small style="font-size: 12px; font-weight: 600; color: ${progressColor};">${percentage.toFixed(1)}%</small>
                            </div>
                            <div style="background: var(--gray-200); border-radius: 4px; height: 8px; overflow: hidden;">
                                <div style="background: ${progressColor}; height: 100%; width: ${Math.min(percentage, 100)}%; transition: width 0.3s;"></div>
                            </div>
                            <div style="display: flex; justify-content: space-between; margin-top: 8px;">
                                <small style="font-size: 11px; color: var(--gray-500);">Restante: ${formatCurrency(Math.max(0, budgetAmount - data.amount))}</small>
                                ${percentage > 100 ? `<small style="font-size: 11px; color: var(--danger-color); font-weight: 600;">⚠️ Excedido</small>` : ''}
                            </div>
                        </div>
                    ` : '<small style="color: var(--gray-500);">Sin presupuesto establecido</small>'}
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
                card.style.cssText = 'background: white; padding: 20px; border-radius: var(--radius); border: 1px solid var(--border-color); box-shadow: var(--shadow-light);';
                card.innerHTML = `
                    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 12px;">
                        <div>
                            <h5 style="font-size: 16px; font-weight: 700; margin: 0 0 4px 0; color: var(--gray-900);">${categoryName}</h5>
                            <p style="font-size: 14px; color: var(--gray-600); margin: 0;">${data.transactions.length} transacción${data.transactions.length !== 1 ? 'es' : ''}</p>
                        </div>
                        <div style="text-align: right;">
                            <p style="font-size: 20px; font-weight: 700; margin: 0; color: var(--success);">${formatCurrency(data.amount)}</p>
                            ${budgetAmount > 0 ? `<small style="color: var(--gray-500);">de ${formatCurrency(budgetAmount)}</small>` : ''}
                        </div>
                    </div>
                    ${budgetAmount > 0 ? `
                        <div style="margin-top: 12px;">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                                <small style="font-size: 12px; color: var(--gray-600);">Progreso del presupuesto</small>
                                <small style="font-size: 12px; font-weight: 600; color: ${progressColor};">${percentage.toFixed(1)}%</small>
                            </div>
                            <div style="background: var(--gray-200); border-radius: 4px; height: 8px; overflow: hidden;">
                                <div style="background: ${progressColor}; height: 100%; width: ${Math.min(percentage, 100)}%; transition: width 0.3s;"></div>
                            </div>
                            <div style="display: flex; justify-content: space-between; margin-top: 8px;">
                                <small style="font-size: 11px; color: var(--gray-500);">Diferencia: ${formatCurrency(data.amount - budgetAmount)}</small>
                                ${percentage < 100 ? `<small style="font-size: 11px; color: var(--warning); font-weight: 600;">⚠️ Por debajo del presupuesto</small>` : ''}
                            </div>
                        </div>
                    ` : '<small style="color: var(--gray-500);">Sin presupuesto establecido</small>'}
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
                card.style.cssText = 'background: white; padding: 20px; border-radius: var(--radius); border: 1px solid var(--border-color); box-shadow: var(--shadow-light);';
                card.innerHTML = `
                    <h5 style="font-size: 16px; font-weight: 700; margin: 0 0 12px 0; color: var(--gray-900);">${envelope.name}</h5>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                        <span style="font-size: 14px; color: var(--gray-600);">Presupuesto:</span>
                        <span style="font-size: 14px; font-weight: 600; color: var(--gray-900);">${formatCurrency(envelope.budget)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                        <span style="font-size: 14px; color: var(--gray-600);">Gastado:</span>
                        <span style="font-size: 14px; font-weight: 600; color: var(--danger-color);">${formatCurrency(spent)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                        <span style="font-size: 14px; color: var(--gray-600);">Restante:</span>
                        <span style="font-size: 14px; font-weight: 600; color: ${remaining >= 0 ? 'var(--success-color)' : 'var(--danger-color)'};">${formatCurrency(remaining)}</span>
                    </div>
                    <div style="background: var(--gray-200); border-radius: 4px; height: 8px; overflow: hidden; margin-bottom: 4px;">
                        <div style="background: ${progressColor}; height: 100%; width: ${Math.min(percentage, 100)}%; transition: width 0.3s;"></div>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <small style="font-size: 11px; color: var(--gray-500);">${envelopeTransactions.length} transacciones</small>
                        <small style="font-size: 11px; font-weight: 600; color: ${progressColor};">${percentage.toFixed(1)}% usado</small>
                    </div>
                `;
                envelopesStatusContainer.appendChild(card);
            });
        }
    }
}

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
    // Si no hay deudas y hay activos positivos = excelente, si activos negativos = peligro
    const healthStatus = loansDebt === 0 ? (totalAssets > 0 ? 'excellent' : (totalAssets < 0 ? 'danger' : 'warning')) : (healthRatio > 3 ? 'excellent' : healthRatio > 2 ? 'good' : healthRatio > 1 ? 'warning' : 'danger');
    
    // 4. Ratio de Cobertura de Deuda (Ingresos anuales / Deuda)
    const debtCoverageRatio = loansDebt > 0 ? (annualIncome / loansDebt) : (annualIncome > 0 ? 999 : 0);
    // Si no hay deudas = excelente, si hay deudas pero no ingresos = peligro
    const coverageStatus = loansDebt === 0 ? 'excellent' : (debtCoverageRatio > 2 ? 'excellent' : debtCoverageRatio > 1 ? 'good' : debtCoverageRatio > 0.5 ? 'warning' : 'danger');
    
    // 5. Ratio de Ahorro (Ahorro del período / Ingresos del período)
    const savingsRatio = periodIncome > 0 ? (periodSavings / periodIncome) * 100 : (periodIncome === 0 && periodExpenses > 0 ? -100 : 0);
    // Lógica corregida: negativo = peligro, 0% = moderado, positivo = bueno
    const savingsStatus = savingsRatio >= 20 ? 'excellent' : savingsRatio >= 10 ? 'good' : savingsRatio > 0 ? 'warning' : (savingsRatio < 0 ? 'danger' : 'warning');
    
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
    const debtServiceRatio = avgMonthlyIncome > 0 ? (monthlyLoanPayments / avgMonthlyIncome) * 100 : (monthlyLoanPayments > 0 ? 100 : 0);
    const debtServiceStatus = debtServiceRatio < 20 ? 'excellent' : debtServiceRatio < 30 ? 'good' : debtServiceRatio < 40 ? 'warning' : 'danger';
    
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
            detail: loansDebt === 0 ? (totalAssets > 0 ? 'Sin deudas, activos positivos' : (totalAssets < 0 ? 'Sin deudas, pero activos negativos' : 'Sin deudas ni activos')) : (healthRatio > 3 ? 'Excelente' : healthRatio > 2 ? 'Buena' : healthRatio > 1 ? 'Moderada' : 'Baja')
        },
        {
            title: 'Cobertura de Deuda',
            value: debtCoverageRatio > 999 ? '∞' : debtCoverageRatio.toFixed(2),
            description: `Ingresos anuales / Deuda`,
            status: coverageStatus,
            icon: '🛡️',
            detail: loansDebt === 0 ? 'Sin deudas' : (debtCoverageRatio > 2 ? 'Excelente' : debtCoverageRatio > 1 ? 'Buena' : debtCoverageRatio > 0.5 ? 'Moderada' : 'Baja')
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
            value: debtServiceRatio.toFixed(1) + '%',
            description: `Pagos mensuales / Ingresos mensuales promedio`,
            status: debtServiceStatus,
            icon: '💳',
            detail: formatCurrency(monthlyLoanPayments) + ' de ' + formatCurrency(avgMonthlyIncome) + (avgMonthlyIncome === 0 ? ' (sin ingresos)' : '')
        }
    ];
    
    metrics.forEach(metric => {
        const card = document.createElement('div');
        card.className = 'card';
        card.style.borderLeft = `4px solid ${
            metric.status === 'excellent' ? 'var(--success)' :
            metric.status === 'good' ? '#10b981' :
            metric.status === 'warning' ? 'var(--warning)' :
            'var(--danger)'
        }`;
        
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

// Cerrar el bloque de protección contra carga múltiple
}

