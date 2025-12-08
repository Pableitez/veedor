// Versión Standalone para GitHub Pages (solo localStorage, sin servidor)
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

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    initializeAuth();
});

// Verificar autenticación
function checkAuth() {
    const savedUser = localStorage.getItem('veedor_currentUser');
    if (savedUser) {
        currentUser = savedUser;
        showMainApp();
        loadUserData();
        initializeDate();
        initializeCategories();
        initializeTabs();
        initializeForms();
        updateDisplay();
        initializeCharts();
        updateUserInfo();
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
    document.getElementById('loginFormElement').addEventListener('submit', (e) => {
        e.preventDefault();
        login();
    });
    
    // Formulario de registro
    document.getElementById('registerFormElement').addEventListener('submit', (e) => {
        e.preventDefault();
        register();
    });
    
    // Botón cambiar usuario
    document.getElementById('switchUserBtn').addEventListener('click', () => {
        if (confirm('¿Deseas cerrar sesión y cambiar de usuario?')) {
            logout();
        }
    });
}

// Registrar nuevo usuario
function register() {
    const username = document.getElementById('registerUsername').value.trim();
    const password = document.getElementById('registerPassword').value;
    const passwordConfirm = document.getElementById('registerPasswordConfirm').value;
    const errorMsg = document.getElementById('registerError');
    
    if (password !== passwordConfirm) {
        errorMsg.textContent = 'Las contraseñas no coinciden';
        return;
    }
    
    if (password.length < 4) {
        errorMsg.textContent = 'La contraseña debe tener al menos 4 caracteres';
        return;
    }
    
    const users = getUsers();
    if (users[username]) {
        errorMsg.textContent = 'Este usuario ya existe';
        return;
    }
    
    // Crear usuario
    users[username] = {
        password: btoa(password), // Encriptación simple (base64)
        createdAt: new Date().toISOString()
    };
    saveUsers(users);
    
    // Iniciar sesión automáticamente
    currentUser = username;
    localStorage.setItem('veedor_currentUser', username);
    showMainApp();
    loadUserData();
    initializeDate();
    initializeCategories();
    initializeTabs();
    initializeForms();
    updateDisplay();
    initializeCharts();
    updateUserInfo();
}

// Iniciar sesión
function login() {
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;
    const errorMsg = document.getElementById('loginError');
    
    const users = getUsers();
    if (!users[username]) {
        errorMsg.textContent = 'Usuario no encontrado';
        return;
    }
    
    if (users[username].password !== btoa(password)) {
        errorMsg.textContent = 'Contraseña incorrecta';
        return;
    }
    
    currentUser = username;
    localStorage.setItem('veedor_currentUser', username);
    showMainApp();
    loadUserData();
    initializeDate();
    initializeCategories();
    initializeTabs();
    initializeForms();
    updateDisplay();
    initializeCharts();
    updateUserInfo();
}

// Cerrar sesión
function logout() {
    currentUser = null;
    localStorage.removeItem('veedor_currentUser');
    transactions = [];
    envelopes = [];
    showAuthScreen();
    document.getElementById('loginFormElement').reset();
    document.getElementById('registerFormElement').reset();
}

// Obtener usuarios
function getUsers() {
    const usersData = localStorage.getItem('veedor_users');
    return usersData ? JSON.parse(usersData) : {};
}

// Guardar usuarios
function saveUsers(users) {
    localStorage.setItem('veedor_users', JSON.stringify(users));
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
function loadUserData() {
    if (!currentUser) return;
    
    const userDataKey = `veedor_userData_${currentUser}`;
    const userData = localStorage.getItem(userDataKey);
    
    if (userData) {
        const data = JSON.parse(userData);
        transactions = data.transactions || [];
        envelopes = data.envelopes || [];
    } else {
        transactions = [];
        envelopes = [];
    }
}

// Guardar datos del usuario actual
function saveData() {
    if (!currentUser) return;
    
    const userDataKey = `veedor_userData_${currentUser}`;
    const userData = {
        transactions,
        envelopes,
        lastUpdate: new Date().toISOString()
    };
    
    localStorage.setItem(userDataKey, JSON.stringify(userData));
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
        transactionForm.addEventListener('submit', (e) => {
            e.preventDefault();
            addTransaction();
        });
    }
    
    // Formulario de sobres
    const envelopeForm = document.getElementById('envelopeForm');
    if (envelopeForm) {
        envelopeForm.addEventListener('submit', (e) => {
            e.preventDefault();
            addEnvelope();
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
function addTransaction() {
    const type = document.getElementById('transactionType').value;
    const date = document.getElementById('transactionDate').value;
    const amount = parseFloat(document.getElementById('transactionAmount').value);
    const categoryGeneral = document.getElementById('categoryGeneral').value;
    const categorySpecific = document.getElementById('categorySpecific').value;
    const envelope = document.getElementById('envelope').value;
    const description = document.getElementById('transactionDescription').value;
    
    const transaction = {
        id: Date.now(),
        type,
        date,
        amount: type === 'expense' ? -Math.abs(amount) : Math.abs(amount),
        categoryGeneral,
        categorySpecific,
        envelope: envelope || null,
        description: description || `${categories.general.find(c => c.id === categoryGeneral)?.name} - ${categorySpecific}`
    };
    
    transactions.push(transaction);
    transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    saveData();
    updateDisplay();
    document.getElementById('transactionForm').reset();
    initializeDate();
    initializeCategories();
    updateEnvelopeSelect();
}

// Agregar sobre
function addEnvelope() {
    const name = document.getElementById('envelopeName').value;
    const budget = parseFloat(document.getElementById('envelopeBudget').value);
    
    const envelope = {
        id: Date.now(),
        name,
        budget,
        createdAt: new Date().toISOString()
    };
    
    envelopes.push(envelope);
    saveData();
    updateDisplay();
    document.getElementById('envelopeForm').reset();
    updateEnvelopeSelect();
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
function deleteTransaction(id) {
    if (!confirm('¿Estás seguro de eliminar esta transacción?')) return;
    
    transactions = transactions.filter(t => t.id !== id);
    saveData();
    updateDisplay();
}

// Eliminar sobre
function deleteEnvelope(id) {
    if (!confirm('¿Estás seguro de eliminar este sobre? Esto no eliminará las transacciones asociadas.')) return;
    
    envelopes = envelopes.filter(e => e.id !== id);
    saveData();
    updateDisplay();
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
function importData(event) {
    if (!currentUser) return;
    
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);
            if (data.transactions) transactions = data.transactions;
            if (data.envelopes) envelopes = data.envelopes;
            saveData();
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

