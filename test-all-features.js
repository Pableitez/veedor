const mongoose = require('mongoose');
require('dotenv').config();

// Leer MONGODB_URI desde .env o variable de entorno
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
    console.error('❌ Error: MONGODB_URI no está configurado.');
    console.error('   Por favor, crea un archivo .env con: MONGODB_URI=tu_uri_de_mongodb');
    process.exit(1);
}

// Schemas
const userSchema = new mongoose.Schema({
    email: { type: String, unique: true, required: true, lowercase: true, trim: true },
    username: { type: String, unique: true, required: true, trim: true },
    password: { type: String, required: true },
    firstName: { type: String, default: '' },
    lastName: { type: String, default: '' },
    age: { type: Number, default: null },
    phone: { type: String, default: '' },
    address: { type: String, default: '' },
    city: { type: String, default: '' },
    country: { type: String, default: '' },
    birthDate: { type: String, default: null },
    notes: { type: String, default: '' },
    savingsGoal: { type: Number, default: null },
    resetToken: { type: String, default: null },
    resetTokenExpiry: { type: Date, default: null },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
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
    is_recurring: { type: Boolean, default: false },
    recurring_frequency: { type: String, enum: ['weekly', 'monthly', 'yearly'], default: null },
    recurring_day: { type: Number, default: null },
    created_at: { type: Date, default: Date.now }
});

const envelopeSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    budget: { type: Number, required: true },
    created_at: { type: Date, default: Date.now }
});

const budgetSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    category_id: { type: String, required: true },
    amount: { type: Number, required: true },
    period_type: { type: String, required: true, enum: ['weekly', 'monthly', 'yearly'] },
    period_value: { type: String, required: true },
    budget_type: { type: String, enum: ['income', 'expense'], default: 'expense' },
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
    description: { type: String, default: null },
    opening_commission: { type: Number, default: 0 },
    early_payment_commission: { type: Number, default: 0 },
    payment_frequency: { type: String, enum: ['monthly', 'quarterly', 'yearly'], default: 'monthly' },
    payment_day: { type: Number, default: 1 },
    total_paid: { type: Number, default: 0 },
    last_payment_date: { type: String, default: null },
    early_payments: [{
        date: { type: String, required: true },
        amount: { type: Number, required: true },
        commission: { type: Number, default: 0 }
    }],
    created_at: { type: Date, default: Date.now }
});

const investmentSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    type: { type: String, enum: ['stocks', 'bonds', 'crypto', 'funds', 'real_estate', 'other'], required: true },
    current_value: { type: Number, required: true, default: 0 },
    description: { type: String, default: null },
    contributions: [{
        date: { type: String, required: true },
        amount: { type: Number, required: true },
        transaction_id: { type: String, default: null }
    }],
    periodic_contribution: {
        enabled: { type: Boolean, default: false },
        frequency: { type: String, enum: ['weekly', 'monthly', 'yearly'], default: 'monthly' },
        amount: { type: Number, default: 0 },
        start_date: { type: String, default: null },
        end_date: { type: String, default: null },
        completed_contributions: [{
            date: { type: String, required: true },
            amount: { type: Number, required: true },
            transaction_id: { type: String, default: null }
        }]
    },
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
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

const propertySchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    address: { type: String, default: null },
    type: { type: String, enum: ['apartment', 'house', 'office', 'commercial', 'other'], default: 'apartment' },
    description: { type: String, default: null },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

const assetSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    type: { type: String, enum: ['property', 'vehicle', 'jewelry', 'art', 'electronics', 'other'], required: true },
    purchase_date: { type: String, required: true },
    purchase_price: { type: Number, required: true },
    current_value: { type: Number, required: true },
    description: { type: String, default: null },
    location: { type: String, default: null },
    value_history: [{
        date: { type: String, required: true },
        value: { type: Number, required: true },
        notes: { type: String, default: null }
    }],
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Transaction = mongoose.model('Transaction', transactionSchema);
const Envelope = mongoose.model('Envelope', envelopeSchema);
const Budget = mongoose.model('Budget', budgetSchema);
const Loan = mongoose.model('Loan', loanSchema);
const Investment = mongoose.model('Investment', investmentSchema);
const Account = mongoose.model('Account', accountSchema);
const Property = mongoose.model('Property', propertySchema);
const Asset = mongoose.model('Asset', assetSchema);

async function testAllFeatures() {
    try {
        console.log('🔌 Conectando a MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Conectado a MongoDB\n');

        // Buscar o crear usuario de prueba
        let testUser = await User.findOne({ email: 'test@veedor.com' });
        if (!testUser) {
            console.log('👤 Creando usuario de prueba...');
            testUser = new User({
                email: 'test@veedor.com',
                username: 'testuser',
                password: 'hashed_password_test',
                firstName: 'Test',
                lastName: 'Usuario',
                age: 30,
                phone: '+34 600 000 000',
                address: 'Calle de Prueba 123',
                city: 'Madrid',
                country: 'España',
                savingsGoal: 10000
            });
            await testUser.save();
            console.log('✅ Usuario creado\n');
        } else {
            console.log('✅ Usuario de prueba encontrado\n');
        }

        const userId = testUser._id;
        const today = new Date();
        const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 15);
        const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 15);

        // Limpiar datos anteriores del usuario de prueba
        console.log('🧹 Limpiando datos anteriores...');
        await Transaction.deleteMany({ user_id: userId });
        await Envelope.deleteMany({ user_id: userId });
        await Budget.deleteMany({ user_id: userId });
        await Loan.deleteMany({ user_id: userId });
        await Investment.deleteMany({ user_id: userId });
        await Account.deleteMany({ user_id: userId });
        await Property.deleteMany({ user_id: userId });
        await Asset.deleteMany({ user_id: userId });
        console.log('✅ Datos limpiados\n');

        // 1. CREAR CUENTAS BANCARIAS
        console.log('🏦 Creando cuentas bancarias...');
        const account1 = new Account({
            user_id: userId,
            name: 'Cuenta Nómina BBVA',
            type: 'checking',
            bank: 'BBVA',
            account_number: '****1234',
            balance: 5000,
            currency: 'EUR',
            description: 'Cuenta principal'
        });
        await account1.save();

        const account2 = new Account({
            user_id: userId,
            name: 'Cuenta Ahorro',
            type: 'savings',
            bank: 'ING',
            account_number: '****5678',
            balance: 15000,
            currency: 'EUR'
        });
        await account2.save();
        console.log('✅ 2 cuentas creadas\n');

        // 2. CREAR PROPIEDADES
        console.log('🏘️ Creando propiedades...');
        const property1 = new Property({
            user_id: userId,
            name: 'Piso Calle Mayor 5',
            address: 'Calle Mayor 5, 3ºB, Madrid',
            type: 'apartment',
            description: 'Piso principal'
        });
        await property1.save();

        const property2 = new Property({
            user_id: userId,
            name: 'Casa en la playa',
            address: 'Avenida del Mar 12, Valencia',
            type: 'house',
            description: 'Segunda residencia'
        });
        await property2.save();
        console.log('✅ 2 propiedades creadas\n');

        // 3. CREAR INVERSIONES
        console.log('📈 Creando inversiones...');
        const investment1 = new Investment({
            user_id: userId,
            name: 'Fondo Indexado S&P 500',
            type: 'funds',
            current_value: 5000,
            description: 'Inversión a largo plazo',
            contributions: [],
            periodic_contribution: {
                enabled: true,
                frequency: 'monthly',
                amount: 500,
                start_date: lastMonth.toISOString().split('T')[0],
                end_date: null
            }
        });
        await investment1.save();

        const investment2 = new Investment({
            user_id: userId,
            name: 'Bitcoin',
            type: 'crypto',
            current_value: 2000,
            description: 'Criptomoneda',
            contributions: []
        });
        await investment2.save();
        console.log('✅ 2 inversiones creadas\n');

        // 4. CREAR PRÉSTAMOS
        console.log('🏦 Creando préstamos...');
        const loan1 = new Loan({
            user_id: userId,
            name: 'Hipoteca Vivienda',
            principal: 200000,
            interest_rate: 2.5,
            tae: 2.8,
            start_date: '2020-01-15',
            end_date: '2040-01-15',
            monthly_payment: 850,
            type: 'debt',
            description: 'Hipoteca principal',
            payment_day: 5,
            total_paid: 51000
        });
        await loan1.save();

        const loan2 = new Loan({
            user_id: userId,
            name: 'Préstamo Personal',
            principal: 10000,
            interest_rate: 5.0,
            start_date: '2024-06-01',
            end_date: '2026-06-01',
            monthly_payment: 450,
            type: 'debt',
            description: 'Préstamo para reforma',
            payment_day: 1,
            total_paid: 2700
        });
        await loan2.save();
        console.log('✅ 2 préstamos creados\n');

        // 5. CREAR SOBRES/ENVELOPES
        console.log('📦 Creando sobres...');
        const envelope1 = new Envelope({
            user_id: userId,
            name: 'Vacaciones',
            budget: 2000
        });
        await envelope1.save();

        const envelope2 = new Envelope({
            user_id: userId,
            name: 'Emergencias',
            budget: 5000
        });
        await envelope2.save();
        console.log('✅ 2 sobres creados\n');

        // 6. CREAR PRESUPUESTOS
        console.log('📋 Creando presupuestos...');
        const currentMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
        
        const budget1 = new Budget({
            user_id: userId,
            category_id: 'food',
            amount: 400,
            period_type: 'monthly',
            period_value: currentMonth,
            budget_type: 'expense'
        });
        await budget1.save();

        const budget2 = new Budget({
            user_id: userId,
            category_id: 'salary',
            amount: 3000,
            period_type: 'monthly',
            period_value: currentMonth,
            budget_type: 'income'
        });
        await budget2.save();
        console.log('✅ 2 presupuestos creados\n');

        // 7. CREAR TRANSACCIONES
        console.log('💳 Creando transacciones...');
        const transactions = [
            // Ingresos
            new Transaction({
                user_id: userId,
                type: 'income',
                date: today.toISOString().split('T')[0],
                amount: 3000,
                category_general: 'salary',
                category_specific: 'Nómina',
                account_id: account1._id.toString(),
                description: 'Salario mensual'
            }),
            new Transaction({
                user_id: userId,
                type: 'income',
                date: new Date(today.getFullYear(), today.getMonth() - 1, 1).toISOString().split('T')[0],
                amount: 500,
                category_general: 'freelance',
                category_specific: 'Proyecto',
                account_id: account1._id.toString(),
                description: 'Proyecto freelance'
            }),
            // Gastos asociados a propiedad
            new Transaction({
                user_id: userId,
                type: 'expense',
                date: today.toISOString().split('T')[0],
                amount: -120,
                category_general: 'bills',
                category_specific: 'Agua',
                property_id: property1._id.toString(),
                account_id: account1._id.toString(),
                description: 'Agua del piso'
            }),
            new Transaction({
                user_id: userId,
                type: 'expense',
                date: today.toISOString().split('T')[0],
                amount: -80,
                category_general: 'bills',
                category_specific: 'Luz',
                property_id: property1._id.toString(),
                account_id: account1._id.toString(),
                description: 'Luz del piso'
            }),
            // Gastos normales
            new Transaction({
                user_id: userId,
                type: 'expense',
                date: today.toISOString().split('T')[0],
                amount: -150,
                category_general: 'food',
                category_specific: 'Supermercado',
                envelope: envelope1.name,
                account_id: account1._id.toString(),
                description: 'Compra semanal'
            }),
            new Transaction({
                user_id: userId,
                type: 'expense',
                date: new Date(today.getFullYear(), today.getMonth() - 1, 20).toISOString().split('T')[0],
                amount: -60,
                category_general: 'transport',
                category_specific: 'Gasolina',
                account_id: account1._id.toString(),
                description: 'Repostaje'
            }),
            // Gasto asociado a inversión
            new Transaction({
                user_id: userId,
                type: 'expense',
                date: today.toISOString().split('T')[0],
                amount: -500,
                category_general: 'investment',
                category_specific: 'Aporte',
                investment_id: investment1._id.toString(),
                account_id: account1._id.toString(),
                description: 'Aporte mensual a inversión'
            }),
            // Transacciones recurrentes de préstamos (ya creadas automáticamente por el servidor)
        ];

        await Transaction.insertMany(transactions);
        console.log(`✅ ${transactions.length} transacciones creadas\n`);

        // 8. CREAR PATRIMONIO/ASSETS
        console.log('🏠 Creando patrimonio...');
        const asset1 = new Asset({
            user_id: userId,
            name: 'Coche Toyota Corolla',
            type: 'vehicle',
            purchase_date: '2020-05-15',
            purchase_price: 18000,
            current_value: 12000,
            description: 'Vehículo principal',
            value_history: [
                { date: '2020-05-15', value: 18000, notes: 'Compra' },
                { date: '2022-05-15', value: 15000, notes: 'Revaluación' },
                { date: today.toISOString().split('T')[0], value: 12000, notes: 'Valor actual' }
            ]
        });
        await asset1.save();

        const asset2 = new Asset({
            user_id: userId,
            name: 'Reloj Rolex',
            type: 'jewelry',
            purchase_date: '2018-03-10',
            purchase_price: 8000,
            current_value: 10000,
            description: 'Reloj de colección',
            value_history: [
                { date: '2018-03-10', value: 8000, notes: 'Compra' },
                { date: today.toISOString().split('T')[0], value: 10000, notes: 'Revaluación' }
            ]
        });
        await asset2.save();
        console.log('✅ 2 activos creados\n');

        // 9. ACTUALIZAR PERFIL CON META DE AHORRO
        console.log('💾 Actualizando perfil con meta de ahorro...');
        testUser.savingsGoal = 15000;
        await testUser.save();
        console.log('✅ Meta de ahorro actualizada\n');

        console.log('✅✅✅ TODAS LAS PRUEBAS COMPLETADAS ✅✅✅\n');
        console.log('📊 RESUMEN DE DATOS CREADOS:');
        console.log(`   👤 Usuario: ${testUser.email}`);
        console.log(`   🏦 Cuentas: 2`);
        console.log(`   🏘️ Propiedades: 2`);
        console.log(`   📈 Inversiones: 2`);
        console.log(`   🏦 Préstamos: 2`);
        console.log(`   📦 Sobres: 2`);
        console.log(`   📋 Presupuestos: 2`);
        console.log(`   💳 Transacciones: ${transactions.length}`);
        console.log(`   🏠 Activos: 2`);
        console.log(`   💰 Meta de ahorro: ${testUser.savingsGoal}€\n`);

        await mongoose.disconnect();
        console.log('🔌 Desconectado de MongoDB');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        await mongoose.disconnect();
        process.exit(1);
    }
}

testAllFeatures();





