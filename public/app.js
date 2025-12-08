// Configuración de la API
const API_URL = window.location.origin.includes('localhost') 
    ? 'http://localhost:3000/api' 
    : '/api';

// Categorías de gastos
const categories = {
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

// Estado de la aplicación
let transactions = [];
let envelopes = [];
let charts = {};
let currentUser = null;
let authToken = null;

// Utilidad para hacer peticiones autenticadas
async function apiRequest(endpoint, options = {}) {
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers
    });

    if (response.status === 401 || response.status === 403) {
        logout();
        throw new Error('Sesión expirada');
    }

    const data = await response.json();
    
    if (!response.ok) {
        throw new Error(data.error || 'Error en la petición');
    }

    return data;
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    initializeAuth();
});

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
    // Tabs de autenticación
    const authTabs = document.querySelectorAll('.auth-tab-btn');
    authTabs.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-auth-tab');
            authTabs.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            document.getElementById('loginForm').classList.toggle('active', targetTab === 'login');
            document.getElementById('registerForm').classList.toggle('active', targetTab === 'register');
            
            // Limpiar errores
            document.getElementById('loginError').textContent = '';
            document.getElementById('registerError').textContent = '';
        });
    });
    
    // Formulario de login
    document.getElementById('loginFormElement').addEventListener('submit', async (e) => {
        e.preventDefault();
        await login();
    });
    
    // Formulario de registro
    document.getElementById('registerFormElement').addEventListener('submit', async (e) => {
        e.preventDefault();
        await register();
    });
    
    // Botón cambiar usuario
    document.getElementById('switchUserBtn').addEventListener('click', () => {
        if (confirm('¿Deseas cerrar sesión y cambiar de usuario?')) {
            logout();
        }
    });
}

// Registrar nuevo usuario
async function register() {
    const username = document.getElementById('registerUsername').value.trim();
    const password = document.getElementById('registerPassword').value;
    const passwordConfirm = document.getElementById('registerPasswordConfirm').value;
    const errorMsg = document.getElementById('registerError');
    
    errorMsg.textContent = '';
    
    if (password !== passwordConfirm) {
        errorMsg.textContent = 'Las contraseñas no coinciden';
        return;
    }
    
    if (password.length < 4) {
        errorMsg.textContent = 'La contraseña debe tener al menos 4 caracteres';
        return;
    }
    
    try {
        const data = await apiRequest('/register', {
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
        
        document.getElementById('registerFormElement').reset();
    } catch (error) {
        errorMsg.textContent = error.message || 'Error al registrar usuario';
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
        const [transactionsData, envelopesData] = await Promise.all([
            apiRequest('/transactions'),
            apiRequest('/envelopes')
        ]);
        
        transactions = transactionsData.map(t => ({
            ...t,
            categoryGeneral: t.category_general,
            categorySpecific: t.category_specific
        }));
        
        envelopes = envelopesData;
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
    
    if (!generalSelect || !specificSelect || !filterCategory) return;
    
    // Llenar categorías generales
    categories.general.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat.id;
        option.textContent = cat.name;
        generalSelect.appendChild(option);
        
        const filterOption = option.cloneNode(true);
        filterCategory.appendChild(filterOption);
    });
    
    // Actualizar categorías específicas cuando cambia la general
    generalSelect.addEventListener('change', () => {
        const selectedGeneral = generalSelect.value;
        specificSelect.innerHTML = '<option value="">Seleccionar...</option>';
        
        if (selectedGeneral) {
            const category = categories.general.find(c => c.id === selectedGeneral);
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
    
    // Botones de exportar/importar
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportData);
    }
    
    const importBtn = document.getElementById('importBtn');
    if (importBtn) {
        importBtn.addEventListener('click', () => {
            let importFile = document.getElementById('importFile');
            if (!importFile) {
                importFile = document.createElement('input');
                importFile.type = 'file';
                importFile.id = 'importFile';
                importFile.accept = '.json';
                importFile.style.display = 'none';
                importFile.addEventListener('change', importData);
                document.body.appendChild(importFile);
            }
            importFile.click();
        });
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
    updateMonthFilter();
}

// Actualizar resumen
function updateSummary() {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const monthTransactions = transactions.filter(t => {
        const tDate = new Date(t.date);
        return tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear;
    });
    
    const totalBalance = transactions.reduce((sum, t) => sum + t.amount, 0);
    const monthIncome = monthTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const monthExpenses = Math.abs(monthTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0));
    const monthSavings = monthIncome - monthExpenses;
    
    document.getElementById('totalBalance').textContent = formatCurrency(totalBalance);
    document.getElementById('monthIncome').textContent = formatCurrency(monthIncome);
    document.getElementById('monthExpenses').textContent = formatCurrency(monthExpenses);
    document.getElementById('monthSavings').textContent = formatCurrency(monthSavings);
    document.getElementById('monthSavings').className = monthSavings >= 0 ? 'amount positive' : 'amount negative';
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
        const categoryName = categories.general.find(c => c.id === transaction.categoryGeneral)?.name || transaction.categoryGeneral;
        
        row.innerHTML = `
            <td>${formatDate(date)}</td>
            <td><span class="badge badge-${transaction.type}">${transaction.type === 'income' ? 'Ingreso' : 'Gasto'}</span></td>
            <td>${categoryName} - ${transaction.categorySpecific}</td>
            <td>${transaction.description || '-'}</td>
            <td>${transaction.envelope || '-'}</td>
            <td style="font-weight: 600; color: ${transaction.amount >= 0 ? '#10b981' : '#ef4444'}">${formatCurrency(transaction.amount)}</td>
            <td><button class="btn-danger" onclick="deleteTransaction(${transaction.id})">Eliminar</button></td>
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
                <button class="btn-danger" onclick="deleteEnvelope(${envelope.id})">Eliminar</button>
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
        transactions = transactions.filter(t => t.id !== id);
        updateDisplay();
    } catch (error) {
        alert('Error al eliminar transacción: ' + error.message);
    }
}

// Eliminar sobre
async function deleteEnvelope(id) {
    if (!confirm('¿Estás seguro de eliminar este sobre? Esto no eliminará las transacciones asociadas.')) return;
    
    try {
        await apiRequest(`/envelopes/${id}`, { method: 'DELETE' });
        envelopes = envelopes.filter(e => e.id !== id);
        updateDisplay();
    } catch (error) {
        alert('Error al eliminar sobre: ' + error.message);
    }
}

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
    
    const now = new Date();
    const months = [];
    const savings = [];
    let runningTotal = 0;
    
    for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthKey = date.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
        months.push(monthKey);
        
        const monthTransactions = transactions.filter(t => {
            const tDate = new Date(t.date);
            return tDate.getMonth() === date.getMonth() && tDate.getFullYear() === date.getFullYear();
        });
        
        const monthIncome = monthTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
        const monthExpenses = Math.abs(monthTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0));
        const monthSavings = monthIncome - monthExpenses;
        
        runningTotal += monthSavings;
        savings.push(runningTotal);
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
    
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const monthExpenses = transactions.filter(t => {
        const tDate = new Date(t.date);
        return t.type === 'expense' &&
               tDate.getMonth() === currentMonth &&
               tDate.getFullYear() === currentYear;
    });
    
    const categoryTotals = {};
    monthExpenses.forEach(t => {
        const catName = categories.general.find(c => c.id === t.categoryGeneral)?.name || t.categoryGeneral;
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
            '#30cfd0', '#a8edea'
        ]
    }];
    charts.expenses.update();
}

// Gráfica de ingresos vs gastos
function updateIncomeExpenseChart() {
    if (!charts.incomeExpense) return;
    
    const now = new Date();
    const months = [];
    const incomes = [];
    const expenses = [];
    
    for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthKey = date.toLocaleDateString('es-ES', { month: 'short' });
        months.push(monthKey);
        
        const monthTransactions = transactions.filter(t => {
            const tDate = new Date(t.date);
            return tDate.getMonth() === date.getMonth() && tDate.getFullYear() === date.getFullYear();
        });
        
        const monthIncome = monthTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
        const monthExpenses = Math.abs(monthTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0));
        
        incomes.push(monthIncome);
        expenses.push(monthExpenses);
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
    
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const monthExpenses = transactions.filter(t => {
        const tDate = new Date(t.date);
        return t.type === 'expense' &&
               tDate.getMonth() === currentMonth &&
               tDate.getFullYear() === currentYear;
    });
    
    const categoryTotals = {};
    monthExpenses.forEach(t => {
        const catName = categories.general.find(c => c.id === t.categoryGeneral)?.name || t.categoryGeneral;
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
            '#30cfd0', '#a8edea'
        ]
    }];
    charts.distribution.update();
}

// Exportar datos
function exportData() {
    if (!currentUser) return;
    
    const data = {
        username: currentUser,
        transactions,
        envelopes,
        exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `veedor_backup_${currentUser}_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

// Importar datos
async function importData(event) {
    if (!currentUser) return;
    
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = async (e) => {
        try {
            const data = JSON.parse(e.target.result);
            
            // Importar transacciones
            if (data.transactions) {
                for (const transaction of data.transactions) {
                    try {
                        await apiRequest('/transactions', {
                            method: 'POST',
                            body: JSON.stringify({
                                type: transaction.type,
                                date: transaction.date,
                                amount: Math.abs(transaction.amount),
                                categoryGeneral: transaction.categoryGeneral || transaction.category_general,
                                categorySpecific: transaction.categorySpecific || transaction.category_specific,
                                envelope: transaction.envelope,
                                description: transaction.description
                            })
                        });
                    } catch (error) {
                        console.error('Error importando transacción:', error);
                    }
                }
            }
            
            // Importar sobres
            if (data.envelopes) {
                for (const envelope of data.envelopes) {
                    try {
                        await apiRequest('/envelopes', {
                            method: 'POST',
                            body: JSON.stringify({
                                name: envelope.name,
                                budget: envelope.budget
                            })
                        });
                    } catch (error) {
                        console.error('Error importando sobre:', error);
                    }
                }
            }
            
            await loadUserData();
            updateDisplay();
            alert('Datos importados correctamente');
        } catch (error) {
            alert('Error al importar datos: ' + error.message);
        }
    };
    reader.readAsText(file);
    event.target.value = '';
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

