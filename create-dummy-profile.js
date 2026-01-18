const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Configuración de MongoDB
let MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/veedor';

if (MONGODB_URI && !MONGODB_URI.includes('mongodb://localhost')) {
    if (!MONGODB_URI.includes('/veedor') && !MONGODB_URI.includes('/?')) {
        if (MONGODB_URI.includes('?')) {
            MONGODB_URI = MONGODB_URI.replace('?', '/veedor?');
        } else {
            MONGODB_URI = MONGODB_URI.endsWith('/') 
                ? MONGODB_URI + 'veedor' 
                : MONGODB_URI + '/veedor';
        }
    }
}

// Esquemas (simplificados, deben coincidir con server.js)
const userSchema = new mongoose.Schema({
    email: { type: String, unique: true, required: true, lowercase: true, trim: true },
    username: { type: String, unique: true, required: true, trim: true },
    password: { type: String, required: true },
    firstName: { type: String, default: '' },
    lastName: { type: String, default: '' },
    savingsGoal: { type: Number, default: null },
    emailVerified: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

const transactionSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, required: true },
    date: { type: String, required: true },
    amount: { type: Number, required: true },
    category_general: { type: String, required: true },
    category_specific: { type: String, required: true },
    envelope: { type: String, default: null },
    account_id: { type: String, default: null },
    investment_id: { type: String, default: null },
    loan_id: { type: String, default: null },
    property_id: { type: String, default: null },
    description: { type: String, default: null },
    created_at: { type: Date, default: Date.now }
});

const accountSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    type: { type: String, enum: ['checking', 'savings', 'credit', 'investment', 'other'], required: true },
    bank: { type: String, default: null },
    account_number: { type: String, default: null },
    balance: { type: Number, required: true, default: 0 },
    currency: { type: String, default: 'EUR' },
    description: { type: String, default: null },
    created_at: { type: Date, default: Date.now }
});

const loanSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    principal: { type: Number, required: true },
    interest_rate: { type: Number, required: true },
    tae: { type: Number, default: null },
    start_date: { type: String, required: true },
    end_date: { type: String, required: true },
    monthly_payment: { type: Number, required: true },
    type: { type: String, enum: ['debt', 'credit'], required: true },
    account_id: { type: String, default: null },
    description: { type: String, default: null },
    opening_commission: { type: Number, default: 0 },
    early_payment_commission: { type: Number, default: 0 },
    payment_day: { type: Number, default: 1 },
    total_paid: { type: Number, default: 0 },
    early_payments: { type: Array, default: [] },
    created_at: { type: Date, default: Date.now }
});

const investmentSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    type: { type: String, enum: ['stocks', 'bonds', 'crypto', 'funds', 'real_estate', 'other'], required: true },
    description: { type: String, default: null },
    current_value: { type: Number, required: true },
    contributions: { type: Array, default: [] },
    value_history: { type: Array, default: [] },
    created_at: { type: Date, default: Date.now }
});

const propertySchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    address: { type: String, default: null },
    type: { type: String, enum: ['apartment', 'house', 'office', 'commercial', 'other'], default: 'apartment' },
    description: { type: String, default: null },
    created_at: { type: Date, default: Date.now }
});

const assetSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    type: { type: String, enum: ['property', 'vehicle', 'jewelry', 'electronics', 'other'], required: true },
    purchase_date: { type: String, required: true },
    purchase_price: { type: Number, required: true },
    current_value: { type: Number, required: true },
    description: { type: String, default: null },
    value_history: { type: Array, default: [] },
    created_at: { type: Date, default: Date.now }
});

const budgetSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    category_id: { type: String, required: true },
    amount: { type: Number, required: true },
    period_type: { type: String, required: true, enum: ['weekly', 'monthly', 'yearly'] },
    period_value: { type: String, required: true },
    created_at: { type: Date, default: Date.now }
});

const envelopeSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    budget: { type: Number, required: true },
    patrimonio_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Patrimonio', default: null },
    created_at: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Transaction = mongoose.model('Transaction', transactionSchema);
const Account = mongoose.model('Account', accountSchema);
const Loan = mongoose.model('Loan', loanSchema);
const Investment = mongoose.model('Investment', investmentSchema);
const Property = mongoose.model('Property', propertySchema);
const Asset = mongoose.model('Asset', assetSchema);
const Budget = mongoose.model('Budget', budgetSchema);
const Envelope = mongoose.model('Envelope', envelopeSchema);

// Función para generar fechas
function getDateString(daysAgo = 0) {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date.toISOString().split('T')[0];
}

// Función para generar número aleatorio en rango
function randomBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Función para generar decimal aleatorio
function randomDecimal(min, max) {
    return parseFloat((Math.random() * (max - min) + min).toFixed(2));
}

async function createDummyProfile() {
    try {
        console.log('🔌 Conectando a MongoDB...');
        console.log('📍 URI:', MONGODB_URI ? MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@') : 'No configurada');
        
        if (!MONGODB_URI || MONGODB_URI === 'mongodb://localhost:27017/veedor') {
            console.error('❌ MONGODB_URI no está configurada en las variables de entorno');
            console.error('   Por favor, asegúrate de tener un archivo .env con MONGODB_URI');
            process.exit(1);
        }
        
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Conectado a MongoDB');

        // Verificar si el usuario ya existe
        const existingUser = await User.findOne({ email: 'demo@veedor.com' });
        if (existingUser) {
            console.log('⚠️  El usuario demo ya existe. Eliminando datos anteriores...');
            await Transaction.deleteMany({ user_id: existingUser._id });
            await Account.deleteMany({ user_id: existingUser._id });
            await Loan.deleteMany({ user_id: existingUser._id });
            await Investment.deleteMany({ user_id: existingUser._id });
            await Property.deleteMany({ user_id: existingUser._id });
            await Asset.deleteMany({ user_id: existingUser._id });
            await Budget.deleteMany({ user_id: existingUser._id });
            await Envelope.deleteMany({ user_id: existingUser._id });
            await User.deleteOne({ _id: existingUser._id });
            console.log('✅ Datos anteriores eliminados');
        }

        // Crear usuario
        console.log('👤 Creando usuario...');
        const hashedPassword = await bcrypt.hash('demo123', 10);
        const user = new User({
            email: 'demo@veedor.com',
            username: 'demo_user',
            password: hashedPassword,
            firstName: 'María',
            lastName: 'García',
            savingsGoal: 15000,
            emailVerified: true,
            emailVerificationToken: null,
            emailVerificationExpiry: null
        });
        await user.save();
        console.log('✅ Usuario creado:', user.email);
        console.log('   Email verificado:', user.emailVerified);
        console.log('   ID:', user._id.toString());
        
        // Verificar que el usuario se guardó correctamente
        const savedUser = await User.findById(user._id);
        if (!savedUser) {
            throw new Error('Error: El usuario no se guardó correctamente');
        }
        console.log('✅ Usuario verificado en la base de datos');

        const userId = user._id;

        // Crear cuentas bancarias
        console.log('💳 Creando cuentas bancarias...');
        const cuentaNomina = new Account({
            user_id: userId,
            name: 'Cuenta Nómina BBVA',
            type: 'checking',
            bank: 'BBVA',
            account_number: '****1234',
            balance: 8500.50,
            currency: 'EUR',
            description: 'Cuenta principal para nómina'
        });
        await cuentaNomina.save();

        const cuentaAhorro = new Account({
            user_id: userId,
            name: 'Cuenta Ahorro Santander',
            type: 'savings',
            bank: 'Santander',
            account_number: '****5678',
            balance: 12500.00,
            currency: 'EUR',
            description: 'Cuenta de ahorro para emergencias'
        });
        await cuentaAhorro.save();

        const cuentaInversion = new Account({
            user_id: userId,
            name: 'Cuenta Inversión ING',
            type: 'investment',
            bank: 'ING',
            account_number: '****9012',
            balance: 3200.75,
            currency: 'EUR',
            description: 'Cuenta para inversiones'
        });
        await cuentaInversion.save();

        console.log('✅ Cuentas creadas');

        // Crear propiedad (piso)
        console.log('🏠 Creando propiedad...');
        const property = new Property({
            user_id: userId,
            name: 'Piso Centro Madrid',
            address: 'Calle Gran Vía 45, 3ºB, 28013 Madrid',
            type: 'apartment',
            description: 'Piso de 85m² en el centro de Madrid'
        });
        await property.save();
        console.log('✅ Propiedad creada');

        // Crear activo (propiedad como activo)
        const propertyAsset = new Asset({
            user_id: userId,
            name: 'Piso Centro Madrid',
            type: 'property',
            purchase_date: getDateString(730), // Hace 2 años
            purchase_price: 280000,
            current_value: 310000, // Apreciación del 10.7%
            description: 'Piso de 85m² en el centro de Madrid',
            value_history: [
                { date: getDateString(730), value: 280000 },
                { date: getDateString(365), value: 295000 },
                { date: getDateString(0), value: 310000 }
            ]
        });
        await propertyAsset.save();

        // Crear hipoteca asociada a la propiedad
        console.log('🏦 Creando hipoteca...');
        const startDate = getDateString(730); // Hace 2 años
        const endDate = new Date();
        endDate.setFullYear(endDate.getFullYear() + 23); // 25 años total
        
        const hipoteca = new Loan({
            user_id: userId,
            name: 'Hipoteca Piso Centro',
            principal: 250000,
            interest_rate: 2.5,
            tae: 2.8,
            start_date: startDate,
            end_date: endDate.toISOString().split('T')[0],
            monthly_payment: 1125.50,
            type: 'debt',
            account_id: cuentaNomina._id.toString(),
            description: 'Hipoteca para compra del piso',
            opening_commission: 1500,
            early_payment_commission: 1.5,
            payment_day: 5,
            total_paid: 27000 // 24 meses * 1125.50
        });
        await hipoteca.save();
        console.log('✅ Hipoteca creada');

        // Crear inversiones
        console.log('📈 Creando inversiones...');
        const inversionAcciones = new Investment({
            user_id: userId,
            name: 'Cartera Acciones Diversificada',
            type: 'stocks',
            description: 'Cartera de acciones diversificada (S&P 500, IBEX 35)',
            current_value: 18500.00,
            contributions: [
                { date: getDateString(180), amount: 5000 },
                { date: getDateString(90), amount: 3000 },
                { date: getDateString(30), amount: 2000 }
            ],
            value_history: [
                { date: getDateString(180), value: 5000 },
                { date: getDateString(90), value: 8500 },
                { date: getDateString(30), value: 10000 },
                { date: getDateString(0), value: 18500 }
            ]
        });
        await inversionAcciones.save();

        const inversionFondos = new Investment({
            user_id: userId,
            name: 'Fondo Indexado Global',
            type: 'funds',
            description: 'Fondo indexado de bajo costo',
            current_value: 12000.00,
            contributions: [
                { date: getDateString(365), amount: 10000 }
            ],
            value_history: [
                { date: getDateString(365), value: 10000 },
                { date: getDateString(180), value: 10500 },
                { date: getDateString(0), value: 12000 }
            ]
        });
        await inversionFondos.save();

        console.log('✅ Inversiones creadas');

        // Crear transacciones de los últimos 12 meses
        console.log('💰 Creando transacciones...');
        const transactions = [];

        // Ingresos mensuales (nómina)
        for (let month = 0; month < 12; month++) {
            const salaryDate = getDateString(month * 30 + 1);
            transactions.push({
                user_id: userId,
                type: 'income',
                date: salaryDate,
                amount: 3200.00,
                category_general: 'Trabajo',
                category_specific: 'Salario',
                account_id: cuentaNomina._id.toString(),
                description: 'Nómina mensual'
            });
        }

        // Gastos mensuales recurrentes
        const monthlyExpenses = [
            { category: 'Vivienda', specific: 'Hipoteca', amount: 1125.50, account: cuentaNomina._id.toString(), loan_id: hipoteca._id.toString(), property_id: property._id.toString() },
            { category: 'Facturas', specific: 'Luz', amount: 85.00, account: cuentaNomina._id.toString() },
            { category: 'Facturas', specific: 'Agua', amount: 45.00, account: cuentaNomina._id.toString() },
            { category: 'Facturas', specific: 'Internet', amount: 45.00, account: cuentaNomina._id.toString() },
            { category: 'Facturas', specific: 'Teléfono', amount: 35.00, account: cuentaNomina._id.toString() },
            { category: 'Alimentación', specific: 'Supermercado', amount: 350.00, account: cuentaNomina._id.toString() },
            { category: 'Transporte', specific: 'Gasolina', amount: 120.00, account: cuentaNomina._id.toString() },
            { category: 'Salud', specific: 'Gimnasio', amount: 45.00, account: cuentaNomina._id.toString() },
            { category: 'Entretenimiento', specific: 'Streaming', amount: 15.00, account: cuentaNomina._id.toString() }
        ];

        for (let month = 0; month < 12; month++) {
            monthlyExpenses.forEach(expense => {
                const expenseDate = getDateString(month * 30 + randomBetween(1, 28));
                transactions.push({
                    user_id: userId,
                    type: 'expense',
                    date: expenseDate,
                    amount: -expense.amount,
                    category_general: expense.category,
                    category_specific: expense.specific,
                    account_id: expense.account,
                    loan_id: expense.loan_id || null,
                    property_id: expense.property_id || null,
                    description: expense.specific
                });
            });
        }

        // Gastos variables mensuales
        for (let month = 0; month < 12; month++) {
            // Restaurantes (2-4 veces al mes)
            const restaurantCount = randomBetween(2, 4);
            for (let i = 0; i < restaurantCount; i++) {
                transactions.push({
                    user_id: userId,
                    type: 'expense',
                    date: getDateString(month * 30 + randomBetween(1, 28)),
                    amount: -randomDecimal(25, 80),
                    category_general: 'Alimentación',
                    category_specific: 'Restaurantes',
                    account_id: cuentaNomina._id.toString(),
                    description: 'Cena/Restaurante'
                });
            }

            // Ropa (ocasional)
            if (month % 3 === 0) {
                transactions.push({
                    user_id: userId,
                    type: 'expense',
                    date: getDateString(month * 30 + randomBetween(1, 28)),
                    amount: -randomDecimal(80, 200),
                    category_general: 'Compras',
                    category_specific: 'Ropa',
                    account_id: cuentaNomina._id.toString(),
                    description: 'Compra de ropa'
                });
            }

            // Ahorro mensual a cuenta de ahorro
            transactions.push({
                user_id: userId,
                type: 'expense',
                date: getDateString(month * 30 + 25),
                amount: -800.00,
                category_general: 'Otros',
                category_specific: 'Ahorro',
                account_id: cuentaAhorro._id.toString(),
                description: 'Transferencia a cuenta de ahorro'
            });

            // Inversión mensual (cada 2-3 meses)
            if (month % 2 === 0) {
                transactions.push({
                    user_id: userId,
                    type: 'expense',
                    date: getDateString(month * 30 + 1),
                    amount: -randomDecimal(1000, 3000),
                    category_general: 'Otros',
                    category_specific: 'Inversión',
                    account_id: cuentaInversion._id.toString(),
                    investment_id: inversionAcciones._id.toString(),
                    description: 'Aporte a inversión'
                });
            }
        }

        // Ingresos adicionales (algunos meses)
        for (let month = 0; month < 12; month += 4) {
            transactions.push({
                user_id: userId,
                type: 'income',
                date: getDateString(month * 30 + randomBetween(1, 28)),
                amount: randomDecimal(200, 500),
                category_general: 'Trabajo',
                category_specific: 'Extra',
                account_id: cuentaNomina._id.toString(),
                description: 'Pago extra / Freelance'
            });
        }

        // Insertar todas las transacciones
        await Transaction.insertMany(transactions);
        console.log(`✅ ${transactions.length} transacciones creadas`);

        // Crear presupuestos mensuales
        console.log('📊 Creando presupuestos...');
        const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
        
        const budgets = [
            { category: 'Alimentación', amount: 500 },
            { category: 'Transporte', amount: 150 },
            { category: 'Facturas', amount: 250 },
            { category: 'Entretenimiento', amount: 100 },
            { category: 'Compras', amount: 200 }
        ];

        for (const budget of budgets) {
            const budgetDoc = new Budget({
                user_id: userId,
                category_id: budget.category,
                amount: budget.amount,
                period_type: 'monthly',
                period_value: currentMonth
            });
            await budgetDoc.save();
        }
        console.log('✅ Presupuestos creados');

        // Crear sobres (envelopes)
        console.log('📮 Creando sobres...');
        const sobreVacaciones = new Envelope({
            user_id: userId,
            name: 'Vacaciones Verano',
            budget: 2000.00,
            patrimonio_id: null
        });
        await sobreVacaciones.save();

        const sobreNavidad = new Envelope({
            user_id: userId,
            name: 'Navidad',
            budget: 800.00,
            patrimonio_id: null
        });
        await sobreNavidad.save();

        const sobreEmergencias = new Envelope({
            user_id: userId,
            name: 'Fondo Emergencias',
            budget: 15000.00,
            patrimonio_id: null
        });
        await sobreEmergencias.save();

        const sobreCoche = new Envelope({
            user_id: userId,
            name: 'Nuevo Coche',
            budget: 15000.00,
            patrimonio_id: null
        });
        await sobreCoche.save();

        console.log('✅ Sobres creados');

        // Crear más propiedades
        console.log('🏘️ Creando más propiedades...');
        const propiedad2 = new Property({
            user_id: userId,
            name: 'Garaje Trastero',
            address: 'Calle Gran Vía 45, Planta -1, 28013 Madrid',
            type: 'other',
            description: 'Garaje y trastero asociados al piso'
        });
        await propiedad2.save();
        console.log('✅ Propiedades adicionales creadas');

        // Crear más activos
        console.log('🚗 Creando más activos...');
        const coche = new Asset({
            user_id: userId,
            name: 'Coche - Seat León',
            type: 'vehicle',
            purchase_date: getDateString(1095), // Hace 3 años
            purchase_price: 18000,
            current_value: 12000, // Depreciación
            description: 'Seat León 2019, 1.6 TDI',
            value_history: [
                { date: getDateString(1095), value: 18000 },
                { date: getDateString(730), value: 15000 },
                { date: getDateString(365), value: 13500 },
                { date: getDateString(0), value: 12000 }
            ]
        });
        await coche.save();

        const joyas = new Asset({
            user_id: userId,
            name: 'Joyas y Relojes',
            type: 'jewelry',
            purchase_date: getDateString(1825), // Hace 5 años
            purchase_price: 5000,
            current_value: 5500, // Apreciación
            description: 'Colección de joyas y relojes',
            value_history: [
                { date: getDateString(1825), value: 5000 },
                { date: getDateString(1095), value: 5200 },
                { date: getDateString(730), value: 5300 },
                { date: getDateString(365), value: 5400 },
                { date: getDateString(0), value: 5500 }
            ]
        });
        await joyas.save();

        const electronica = new Asset({
            user_id: userId,
            name: 'Equipos Electrónicos',
            type: 'electronics',
            purchase_date: getDateString(365), // Hace 1 año
            purchase_price: 3000,
            current_value: 2000, // Depreciación
            description: 'Laptop, tablet, móviles, etc.',
            value_history: [
                { date: getDateString(365), value: 3000 },
                { date: getDateString(180), value: 2500 },
                { date: getDateString(0), value: 2000 }
            ]
        });
        await electronica.save();
        console.log('✅ Activos adicionales creados');

        // Crear presupuestos adicionales (semanales, anuales)
        console.log('📊 Creando presupuestos adicionales...');
        
        // Presupuesto semanal
        const weekStart = new Date();
        weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1); // Lunes de esta semana
        const weekStartStr = weekStart.toISOString().split('T')[0];
        const budgetSemanal = new Budget({
            user_id: userId,
            category_id: 'Entretenimiento',
            amount: 50,
            period_type: 'weekly',
            period_value: weekStartStr
        });
        await budgetSemanal.save();

        // Presupuesto anual
        const currentYear = new Date().getFullYear().toString();
        const budgetAnual = new Budget({
            user_id: userId,
            category_id: 'Viajes',
            amount: 3000,
            period_type: 'yearly',
            period_value: currentYear
        });
        await budgetAnual.save();

        console.log('✅ Presupuestos adicionales creados');

        // Verificar que el usuario puede hacer login
        console.log('\n🔐 Verificando que el usuario puede hacer login...');
        const testUser = await User.findOne({ email: 'demo@veedor.com' });
        if (!testUser) {
            throw new Error('Error: El usuario no se encontró después de crearlo');
        }
        const testPassword = await bcrypt.compare('demo123', testUser.password);
        if (!testPassword) {
            throw new Error('Error: La contraseña no coincide');
        }
        console.log('✅ Usuario verificado - puede hacer login correctamente');
        
        console.log('\n✅ ========================================');
        console.log('✅ PERFIL DEMO CREADO EXITOSAMENTE');
        console.log('✅ ========================================');
        console.log('\n📧 Credenciales:');
        console.log('   Email: demo@veedor.com');
        console.log('   Usuario: demo_user');
        console.log('   Contraseña: demo123');
        console.log('\n⚠️  IMPORTANTE:');
        console.log('   Si ves "sesión expirada", simplemente cierra sesión');
        console.log('   y vuelve a iniciar sesión con las credenciales de arriba.');
        console.log('\n💰 Resumen del perfil:');
        console.log('   • 3 cuentas bancarias (Total: ~24,200€)');
        console.log('   • 2 propiedades (Piso + Garaje/Trastero)');
        console.log('   • 1 hipoteca (250,000€ inicial, ~223,000€ restante)');
        console.log('   • 2 inversiones (Total: ~30,500€)');
        console.log('   • 4 activos (Piso, Coche, Joyas, Electrónica)');
        console.log('   • 4 sobres (Vacaciones, Navidad, Emergencias, Nuevo Coche)');
        console.log('   • Transacciones de los últimos 12 meses');
        console.log('   • Presupuestos mensuales, semanales y anuales');
        console.log('   • Fondo de emergencia: 12,500€');
        console.log('\n💡 Este perfil representa una persona financieramente solvente');
        console.log('   con buen control de gastos, ahorros e inversiones.');
        console.log('');

        await mongoose.disconnect();
        console.log('🔌 Desconectado de MongoDB');
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

// Ejecutar
createDummyProfile();

