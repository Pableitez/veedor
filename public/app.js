// Evitar cargar múltiples veces
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
    
    console.log('Autenticación inicializada');
}

// Registrar nuevo usuario
async function register() {
    console.log('=== FUNCIÓN REGISTER LLAMADA ===');
    
    const usernameInput = document.getElementById('registerUsername');
    const passwordInput = document.getElementById('registerPassword');
    const passwordConfirmInput = document.getElementById('registerPasswordConfirm');
    const errorMsg = document.getElementById('registerError');
    
    if (!usernameInput || !passwordInput || !passwordConfirmInput || !errorMsg) {
        console.error('❌ Elementos del formulario no encontrados');
        alert('Error: Formulario no encontrado. Recarga la página.');
        return;
    }
    
    const username = usernameInput.value.trim();
    const password = passwordInput.value;
    const passwordConfirm = passwordConfirmInput.value;
    
    console.log('Datos del formulario:', { username, passwordLength: password.length, passwordsMatch: password === passwordConfirm });
    
    errorMsg.textContent = '';
    
    if (!username) {
        errorMsg.textContent = 'El usuario es requerido';
        console.log('Validación fallida: usuario vacío');
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
        console.log('Datos:', { username, password: '***' });
        
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
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
        currentUser = data.user.username;
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
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;
    const errorMsg = document.getElementById('loginError');
    
    errorMsg.textContent = '';
    
    try {
        const data = await apiRequest('/login', {
            method: 'POST',
            body: JSON.stringify({ username, password })
        });
        
        authToken = data.token;
        currentUser = data.user.username;
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
        budgets = budgetsData || [];
        
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
            
            if (targetTab === 'charts') {
                updateCharts();
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
    if (summaryPeriodSelect) {
        summaryPeriodSelect.addEventListener('change', (e) => {
            summaryPeriod = e.target.value;
            updateSummary();
        });
    }
    
    // Formulario de presupuestos
    const budgetForm = document.getElementById('budgetForm');
    if (budgetForm) {
        budgetForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await addBudget();
        });
        
        // Inicializar mes actual
        const budgetMonth = document.getElementById('budgetMonth');
        if (budgetMonth) {
            const now = new Date();
            const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
            budgetMonth.value = currentMonth;
        }
        
        // Llenar categorías de gastos en el selector
        const budgetCategory = document.getElementById('budgetCategory');
        if (budgetCategory) {
            categories.expense.forEach(cat => {
                const option = document.createElement('option');
                option.value = cat.id;
                option.textContent = cat.name;
                budgetCategory.appendChild(option);
            });
        }
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
                description: description || `${categories.general.find(c => c.id === categoryGeneral)?.name} - ${categorySpecific}`
            })
        });
        
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
    updateSummary();
    updateTransactionsTable();
    updateEnvelopes();
    updateEnvelopeSelect();
    updateLoans();
    updateInvestments();
    updateMonthFilter();
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
    
    const monthTransactions = transactions.filter(t => {
        const tDate = new Date(t.date);
        return tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear;
    });
    
    // Transacciones del año
    const yearTransactions = transactions.filter(t => {
        const tDate = new Date(t.date);
        return tDate.getFullYear() === currentYear;
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
        periodIncome = yearTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
        periodExpenses = Math.abs(yearTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0));
        periodSavings = periodIncome - periodExpenses;
        periodLabel = 'Este año';
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
    const periodExpensesEl = document.getElementById('periodExpenses');
    const periodExpensesLabelEl = document.getElementById('periodExpensesLabel');
    const periodSavingsEl = document.getElementById('periodSavings');
    const periodSavingsLabelEl = document.getElementById('periodSavingsLabel');
    
    if (totalBalanceEl) totalBalanceEl.textContent = formatCurrency(totalBalance);
    if (totalBalancePeriodEl) totalBalancePeriodEl.textContent = 'Todos los tiempos';
    
    if (periodIncomeEl) periodIncomeEl.textContent = formatCurrency(periodIncome);
    if (periodIncomeLabelEl) periodIncomeLabelEl.textContent = periodLabel;
    
    if (periodExpensesEl) periodExpensesEl.textContent = formatCurrency(periodExpenses);
    if (periodExpensesLabelEl) periodExpensesLabelEl.textContent = periodLabel;
    
    if (periodSavingsEl) {
        periodSavingsEl.textContent = formatCurrency(periodSavings);
        periodSavingsEl.className = periodSavings >= 0 ? 'amount positive' : 'amount negative';
    }
    if (periodSavingsLabelEl) periodSavingsLabelEl.textContent = periodLabel;
    
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
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 40px; color: #999;">No hay transacciones registradas</td></tr>';
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
        
        row.innerHTML = `
            <td>${formatDate(date)}</td>
            <td><span class="badge badge-${transaction.type}">${transaction.type === 'income' ? 'Ingreso' : 'Gasto'}</span></td>
            <td>${categoryName} - ${transaction.categorySpecific}</td>
            <td>${transaction.description || '-'}</td>
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

// ==================== PRESUPUESTOS ====================

// Agregar presupuesto
async function addBudget() {
    const category = document.getElementById('budgetCategory').value;
    const amount = parseFloat(document.getElementById('budgetAmount').value);
    const month = document.getElementById('budgetMonth').value;
    
    if (!category || !amount || !month) {
        alert('Por favor completa todos los campos');
        return;
    }
    
    try {
        const budget = await apiRequest('/budgets', {
            method: 'POST',
            body: JSON.stringify({
                category,
                amount,
                month
            })
        });
        
        // Recargar presupuestos del mes actual
        const now = new Date();
        const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        if (month === currentMonth) {
            await loadUserData();
        }
        updateDisplay();
        document.getElementById('budgetForm').reset();
        const budgetMonth = document.getElementById('budgetMonth');
        if (budgetMonth) {
            budgetMonth.value = currentMonth;
        }
        alert('✅ Presupuesto establecido exitosamente');
    } catch (error) {
        alert('Error al establecer presupuesto: ' + error.message);
    }
}

// Actualizar presupuestos
function updateBudgets() {
    const grid = document.getElementById('budgetsGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const monthBudgets = budgets.filter(b => b.month === currentMonth);
    
    if (monthBudgets.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--gray-500);">No hay presupuestos establecidos para este mes</p>';
        return;
    }
    
    // Calcular gastos por categoría del mes actual
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
        const category = categories.expense.find(c => c.id === budget.category) || 
                        customCategories.expense.find(c => c.id === budget.category);
        const categoryName = category ? category.name : budget.category;
        const spent = expensesByCategory[budget.category] || 0;
        const remaining = budget.amount - spent;
        const percentage = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;
        const isOverBudget = spent > budget.amount;
        
        const card = document.createElement('div');
        card.className = 'envelope-card';
        card.style.borderLeft = `4px solid ${isOverBudget ? 'var(--danger)' : percentage > 80 ? 'var(--warning)' : 'var(--success)'}`;
        card.innerHTML = `
            <h3>${categoryName}</h3>
            <div style="margin: 12px 0;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span style="font-size: 13px; color: var(--gray-600);">Presupuesto:</span>
                    <span style="font-weight: 600; color: var(--gray-900);">${formatCurrency(budget.amount)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span style="font-size: 13px; color: var(--gray-600);">Gastado:</span>
                    <span style="font-weight: 600; color: ${isOverBudget ? 'var(--danger)' : 'var(--gray-900)'};">${formatCurrency(spent)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                    <span style="font-size: 13px; color: var(--gray-600);">Restante:</span>
                    <span style="font-weight: 700; font-size: 16px; color: ${remaining >= 0 ? 'var(--success)' : 'var(--danger)'};">
                        ${formatCurrency(remaining)}
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
            ${isOverBudget ? '<div style="padding: 8px; background: #FEE2E2; border-radius: var(--radius); color: var(--danger); font-size: 12px; font-weight: 600; margin-top: 8px;">⚠️ Presupuesto excedido</div>' : ''}
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
        const totalInterestProjected = amortization.totalInterest;
        const totalAmount = loan.principal + totalInterestProjected + (loan.opening_commission || 0);
        const totalCommissions = (loan.opening_commission || 0) + (loan.early_payments || []).reduce((sum, ep) => sum + (ep.commission || 0), 0);
        
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
            
            <div style="margin: 10px 0; padding: 10px; background: ${loan.type === 'debt' ? '#fef2f2' : '#f0fdf4'}; border-radius: 6px;">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 13px;">
                    <div><strong>Principal:</strong></div>
                    <div>${formatCurrency(loan.principal)}</div>
                    <div><strong>Interés Anual:</strong></div>
                    <div>${loan.interest_rate}%</div>
                    ${loan.tae ? `<div><strong>TAE:</strong></div><div>${loan.tae}%</div>` : ''}
                    <div><strong>Cuota Mensual:</strong></div>
                    <div>${formatCurrency(loan.monthly_payment)}</div>
                    ${loan.opening_commission > 0 ? `<div><strong>Com. Apertura:</strong></div><div>${formatCurrency(loan.opening_commission)}</div>` : ''}
                </div>
            </div>
            
            <div style="margin: 10px 0; padding: 10px; background: #f3f4f6; border-radius: 6px;">
                <div style="font-size: 13px; line-height: 1.8;">
                    <div><strong>Capital Restante:</strong> <span style="color: ${remainingPrincipal > 0 ? '#ef4444' : '#10b981'}; font-size: 16px; font-weight: bold;">${formatCurrency(remainingPrincipal)}</span></div>
                    <div><strong>Total Pagado:</strong> ${formatCurrency(totalPaid)}</div>
                    <div><strong>Intereses Pagados:</strong> ${formatCurrency(totalInterestPaid)}</div>
                    <div><strong>Comisiones Totales:</strong> ${formatCurrency(totalCommissions)}</div>
                    <div><strong>Total a Pagar:</strong> ${formatCurrency(totalAmount)}</div>
                    <div><strong>Progreso:</strong> ${((totalPaid / totalAmount) * 100).toFixed(1)}%</div>
                    <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #ddd;">
                        <div><strong>Meses Transcurridos:</strong> ${monthsElapsed} / ${totalMonths}</div>
                        <div><strong>Meses Restantes:</strong> ${monthsRemaining}</div>
                        <div><strong>Próximo Pago:</strong> ${formatDate(nextPaymentDate)}</div>
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
            
            <div class="envelope-actions" style="display: flex; gap: 8px; margin-top: 10px;">
                <button class="btn-secondary" onclick="showLoanDetails('${loan._id || loan.id}')" style="flex: 1;">📊 Detalles</button>
                <button class="btn-secondary" onclick="showEarlyPaymentModal('${loan._id || loan.id}')" style="flex: 1;">💰 Amortizar</button>
                <button class="btn-danger" onclick="deleteLoan('${loan._id || loan.id}')" style="flex: 1;">🗑️ Eliminar</button>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Mostrar detalles del préstamo
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
    
    let tableHTML = '<table style="width: 100%; border-collapse: collapse; margin-top: 10px;"><thead><tr style="background: #f3f4f6;"><th style="padding: 8px; text-align: left;">Mes</th><th style="padding: 8px; text-align: right;">Cuota</th><th style="padding: 8px; text-align: right;">Capital</th><th style="padding: 8px; text-align: right;">Interés</th><th style="padding: 8px; text-align: right;">Restante</th></tr></thead><tbody>';
    
    amortization.table.slice(0, 12).forEach(row => {
        tableHTML += `<tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 6px;">${row.month}</td>
            <td style="padding: 6px; text-align: right;">${formatCurrency(row.payment)}</td>
            <td style="padding: 6px; text-align: right;">${formatCurrency(row.principal)}</td>
            <td style="padding: 6px; text-align: right;">${formatCurrency(row.interest)}</td>
            <td style="padding: 6px; text-align: right;">${formatCurrency(row.balance)}</td>
        </tr>`;
    });
    
    if (amortization.table.length > 12) {
        tableHTML += `<tr><td colspan="5" style="padding: 8px; text-align: center; color: #666;">... y ${amortization.table.length - 12} meses más</td></tr>`;
    }
    
    tableHTML += '</tbody></table>';
    
    alert(`Tabla de Amortización - ${loan.name}\n\n(Se muestran los primeros 12 meses)\n\nTotal de meses: ${amortization.table.length}\nInterés total: ${formatCurrency(amortization.totalInterest)}`);
}

// Mostrar modal de amortización anticipada
function showEarlyPaymentModal(loanId) {
    const loan = loans.find(l => (l._id || l.id) === loanId);
    if (!loan) return;
    
    const amount = prompt(`Amortización Anticipada - ${loan.name}\n\nCapital restante: ${formatCurrency(loan.principal - (loan.total_paid || 0))}\n\nIngresa el monto a amortizar (€):`);
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) return;
    
    const paymentAmount = parseFloat(amount);
    const commission = loan.early_payment_commission > 0 
        ? (paymentAmount * loan.early_payment_commission / 100) 
        : 0;
    
    if (confirm(`¿Confirmar amortización anticipada de ${formatCurrency(paymentAmount)}?\n\nComisión: ${formatCurrency(commission)}\nTotal: ${formatCurrency(paymentAmount + commission)}`)) {
        registerLoanPayment(loanId, paymentAmount, true);
    }
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
    
    if (!name || !amount || !currentValue || !date || !type) {
        alert('Por favor completa todos los campos requeridos');
        return;
    }
    
    try {
        const investment = await apiRequest('/investments', {
            method: 'POST',
            body: JSON.stringify({
                name,
                type,
                amount,
                current_value: currentValue,
                date,
                description: description || null
            })
        });
        
        investments.push(investment);
        updateDisplay();
        document.getElementById('investmentForm').reset();
        const investmentDate = document.getElementById('investmentDate');
        if (investmentDate) {
            const today = new Date().toISOString().split('T')[0];
            investmentDate.value = today;
        }
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

// Exponer funciones globales
window.editInvestment = editInvestment;
window.deleteInvestment = deleteInvestment;

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
    const type = prompt('¿Qué tipo de categoría quieres crear?\n1 = Ingreso\n2 = Gasto');
    if (!type || (type !== '1' && type !== '2')) return;
    
    const categoryType = type === '1' ? 'income' : 'expense';
    const categoryName = prompt(`Nombre de la categoría de ${categoryType === 'income' ? 'ingreso' : 'gasto'}:`);
    if (!categoryName || categoryName.trim() === '') return;
    
    const subcategoriesInput = prompt('Subcategorías (separadas por comas, opcional):');
    const subcategories = subcategoriesInput ? subcategoriesInput.split(',').map(s => s.trim()).filter(s => s) : [];
    
    const newCategory = {
        id: Date.now().toString(),
        name: categoryName.trim(),
        subcategories: subcategories.length > 0 ? subcategories : ['General']
    };
    
    customCategories[categoryType].push(newCategory);
    
    // Guardar en localStorage (temporalmente, hasta que agreguemos API)
    localStorage.setItem('veedor_customCategories', JSON.stringify(customCategories));
    
    // Recargar categorías
    initializeCategories();
    
    alert(`✅ Categoría "${categoryName}" agregada exitosamente`);
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

// Exportar datos
function exportData() {
    if (!currentUser) return;
    
    // Crear CSV para Excel
    let csv = 'Fecha,Tipo,Categoría General,Categoría Específica,Descripción,Sobre,Monto\n';
    transactions.forEach(t => {
        const date = new Date(t.date).toLocaleDateString('es-ES');
        const type = t.type === 'income' ? 'Ingreso' : 'Gasto';
        const description = (t.description || '').replace(/"/g, '""');
        csv += `"${date}","${type}","${t.categoryGeneral}","${t.categorySpecific}","${description}","${t.envelope || ''}","${t.amount}"\n`;
    });
    
    // Descargar CSV
    const csvBlob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const csvLink = document.createElement('a');
    const csvUrl = URL.createObjectURL(csvBlob);
    csvLink.setAttribute('href', csvUrl);
    csvLink.setAttribute('download', `veedor_${currentUser}_${new Date().toISOString().split('T')[0]}.csv`);
    csvLink.style.visibility = 'hidden';
    document.body.appendChild(csvLink);
    csvLink.click();
    document.body.removeChild(csvLink);
    URL.revokeObjectURL(csvUrl);
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

// Cerrar el bloque de protección contra carga múltiple
}

