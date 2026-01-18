/**
 * Script para crear un usuario de prueba y testear funcionalidades
 * Ejecutar: node test-user.js
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Leer MONGODB_URI desde .env o variable de entorno
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
    console.error('❌ Error: MONGODB_URI no está configurado.');
    console.error('   Por favor, crea un archivo .env con: MONGODB_URI=tu_uri_de_mongodb');
    process.exit(1);
}

const userSchema = new mongoose.Schema({
    email: { type: String, unique: true, required: true, lowercase: true, trim: true },
    username: { type: String, unique: true, required: true, trim: true },
    password: { type: String, required: true },
    resetToken: { type: String, default: null },
    resetTokenExpiry: { type: Date, default: null },
    createdAt: { type: Date, default: Date.now }
});

const transactionSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['income', 'expense'], required: true },
    amount: { type: Number, required: true },
    date: { type: String, required: true },
    category_general: { type: String, required: true },
    category_specific: { type: String, required: true },
    description: { type: String, default: '' },
    account_id: { type: String, default: null },
    investment_id: { type: String, default: null }
});

const envelopeSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    amount: { type: Number, required: true },
    description: { type: String, default: '' }
});

const loanSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    type: { type: String, enum: ['debt', 'credit'], required: true },
    principal: { type: Number, required: true },
    interest_rate: { type: Number, required: true },
    monthly_payment: { type: Number, required: true },
    start_date: { type: String, required: true },
    total_paid: { type: Number, default: 0 },
    tae: { type: Number, default: null },
    opening_commission: { type: Number, default: 0 },
    early_payment_commission: { type: Number, default: 0 },
    payment_frequency: { type: String, enum: ['monthly', 'weekly', 'yearly'], default: 'monthly' },
    payment_day: { type: Number, default: 1 },
    early_payments: { type: Array, default: [] }
});

const investmentSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    type: { type: String, enum: ['stocks', 'bonds', 'crypto', 'funds', 'real_estate', 'other'], required: true },
    current_value: { type: Number, required: true, default: 0 },
    description: { type: String, default: null },
    contributions: [{ date: String, amount: Number, transaction_id: String }],
    periodic_contribution: {
        enabled: { type: Boolean, default: false },
        frequency: { type: String, enum: ['weekly', 'monthly', 'yearly'], default: 'monthly' },
        amount: { type: Number, default: 0 },
        start_date: { type: String, default: null },
        end_date: { type: String, default: null },
        completed_contributions: []
    },
    created_at: { type: Date, default: Date.now }
});

const accountSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    type: { type: String, enum: ['checking', 'savings', 'credit', 'other'], required: true },
    bank: { type: String, default: '' },
    account_number: { type: String, default: '' },
    balance: { type: Number, required: true, default: 0 },
    description: { type: String, default: '' }
});

const assetSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    type: { type: String, enum: ['property', 'vehicle', 'jewelry', 'electronics', 'other'], required: true },
    purchase_price: { type: Number, required: true },
    current_value: { type: Number, required: true },
    purchase_date: { type: String, required: true },
    description: { type: String, default: '' },
    value_history: [{ date: String, value: Number }]
});

const budgetSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    category: { type: String, required: true },
    amount: { type: Number, required: true },
    period_type: { type: String, enum: ['weekly', 'monthly', 'yearly'], required: true },
    period_value: { type: String, required: true },
    budget_type: { type: String, enum: ['expense', 'income'], default: 'expense' }
});

async function createTestUser() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Conectado a MongoDB');

        const User = mongoose.model('User', userSchema);
        const Transaction = mongoose.model('Transaction', transactionSchema);
        const Envelope = mongoose.model('Envelope', envelopeSchema);
        const Loan = mongoose.model('Loan', loanSchema);
        const Investment = mongoose.model('Investment', investmentSchema);
        const Account = mongoose.model('Account', accountSchema);
        const Asset = mongoose.model('Asset', assetSchema);
        const Budget = mongoose.model('Budget', budgetSchema);

        // Eliminar usuario de prueba si existe
        const existingUser = await User.findOne({ email: 'test@veedor.com' });
        if (existingUser) {
            console.log('🗑️ Eliminando usuario de prueba existente...');
            await Transaction.deleteMany({ user_id: existingUser._id });
            await Envelope.deleteMany({ user_id: existingUser._id });
            await Loan.deleteMany({ user_id: existingUser._id });
            await Investment.deleteMany({ user_id: existingUser._id });
            await Account.deleteMany({ user_id: existingUser._id });
            await Asset.deleteMany({ user_id: existingUser._id });
            await Budget.deleteMany({ user_id: existingUser._id });
            await User.deleteOne({ _id: existingUser._id });
        }

        // Crear usuario de prueba
        const hashedPassword = await bcrypt.hash('test1234', 10);
        const testUser = new User({
            email: 'test@veedor.com',
            username: 'testuser',
            password: hashedPassword
        });
        await testUser.save();
        console.log('✅ Usuario de prueba creado:');
        console.log('   Email: test@veedor.com');
        console.log('   Username: testuser');
        console.log('   Password: test1234');

        const userId = testUser._id;
        const today = new Date();
        const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const twoMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 2, 1);

        // Crear transacciones de prueba
        const transactions = [
            { type: 'income', amount: 2500, date: today.toISOString().split('T')[0], category_general: 'salary', category_specific: 'Nómina', description: 'Salario mensual' },
            { type: 'expense', amount: -800, date: today.toISOString().split('T')[0], category_general: 'housing', category_specific: 'Alquiler', description: 'Alquiler piso' },
            { type: 'expense', amount: -150, date: today.toISOString().split('T')[0], category_general: 'food', category_specific: 'Supermercado', description: 'Compra semanal' },
            { type: 'income', amount: 2500, date: lastMonth.toISOString().split('T')[0], category_general: 'salary', category_specific: 'Nómina', description: 'Salario mes anterior' },
            { type: 'expense', amount: -200, date: lastMonth.toISOString().split('T')[0], category_general: 'transport', category_specific: 'Gasolina', description: 'Repostaje' },
        ];

        for (const t of transactions) {
            const transaction = new Transaction({
                user_id: userId,
                ...t
            });
            await transaction.save();
        }
        console.log(`✅ ${transactions.length} transacciones creadas`);

        // Crear sobre de prueba
        const envelope = new Envelope({
            user_id: userId,
            name: 'Vacaciones 2025',
            amount: 500,
            description: 'Ahorro para viaje'
        });
        await envelope.save();
        console.log('✅ Sobre creado');

        // Crear préstamo de prueba
        const loan = new Loan({
            user_id: userId,
            name: 'Hipoteca Vivienda',
            type: 'debt',
            principal: 200000,
            interest_rate: 2.5,
            monthly_payment: 850,
            start_date: '2020-01-01',
            total_paid: 40800,
            tae: 2.8
        });
        await loan.save();
        console.log('✅ Préstamo creado');

        // Crear inversión de prueba
        const investment = new Investment({
            user_id: userId,
            name: 'Fondo Indexado S&P 500',
            type: 'funds',
            current_value: 5500,
            description: 'Inversión a largo plazo',
            contributions: [
                { date: '2024-01-15', amount: 1000, transaction_id: null },
                { date: '2024-02-15', amount: 1000, transaction_id: null },
                { date: '2024-03-15', amount: 1000, transaction_id: null }
            ]
        });
        await investment.save();
        console.log('✅ Inversión creada');

        // Crear cuenta bancaria de prueba
        const account = new Account({
            user_id: userId,
            name: 'Cuenta Principal',
            type: 'checking',
            bank: 'BBVA',
            balance: 3500,
            description: 'Cuenta corriente principal'
        });
        await account.save();
        console.log('✅ Cuenta bancaria creada');

        // Crear activo de prueba
        const asset = new Asset({
            user_id: userId,
            name: 'Coche',
            type: 'vehicle',
            purchase_price: 15000,
            current_value: 12000,
            purchase_date: '2022-06-01',
            description: 'Volkswagen Golf',
            value_history: [
                { date: '2022-06-01', value: 15000 },
                { date: '2023-06-01', value: 13500 },
                { date: '2024-06-01', value: 12000 }
            ]
        });
        await asset.save();
        console.log('✅ Activo creado');

        // Crear presupuesto de prueba
        const budget = new Budget({
            user_id: userId,
            category: 'food',
            amount: 300,
            period_type: 'monthly',
            period_value: today.toISOString().split('T')[0].substring(0, 7),
            budget_type: 'expense'
        });
        await budget.save();
        console.log('✅ Presupuesto creado');

        console.log('\n✅ Usuario de prueba creado exitosamente con datos de ejemplo!');
        console.log('\n📝 Credenciales:');
        console.log('   Email: test@veedor.com');
        console.log('   Username: testuser');
        console.log('   Password: test1234');
        console.log('\n💡 Puedes iniciar sesión con cualquiera de los dos (email o username)');

        await mongoose.disconnect();
        console.log('\n✅ Desconectado de MongoDB');
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

createTestUser();

