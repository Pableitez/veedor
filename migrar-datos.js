const mongoose = require('mongoose');
require('dotenv').config();

// URIs de ambas bases de datos
const URI_ORIGEN = 'mongodb+srv://veedor_admin:EBS2iHSo5EGwMBeI@cluster0.sqt1psn.mongodb.net/veedor?retryWrites=true&w=majority';
const URI_DESTINO = 'mongodb+srv://veedor_admin:EBS2iHSo5EGwMBeI@cluster0.sqt1psn.mongodb.net/redSocialDB?retryWrites=true&w=majority';

// Esquemas
const transactionSchema = new mongoose.Schema({}, { strict: false, collection: 'transactions' });
const userSchema = new mongoose.Schema({}, { strict: false, collection: 'users' });
const envelopeSchema = new mongoose.Schema({}, { strict: false, collection: 'envelopes' });
const budgetSchema = new mongoose.Schema({}, { strict: false, collection: 'budgets' });
const accountSchema = new mongoose.Schema({}, { strict: false, collection: 'accounts' });
const loanSchema = new mongoose.Schema({}, { strict: false, collection: 'loans' });
const investmentSchema = new mongoose.Schema({}, { strict: false, collection: 'investments' });
const propertySchema = new mongoose.Schema({}, { strict: false, collection: 'properties' });
const patrimonioSchema = new mongoose.Schema({}, { strict: false, collection: 'patrimonios' });
const recurringExpenseSchema = new mongoose.Schema({}, { strict: false, collection: 'recurringexpenses' });

async function migrarDatos() {
    try {
        console.log('🔄 Iniciando migración de datos...\n');
        
        // Conectar a ambas bases de datos
        console.log('📡 Conectando a base de datos origen (veedor)...');
        const connOrigen = await mongoose.createConnection(URI_ORIGEN);
        console.log('✅ Conectado a veedor\n');
        
        console.log('📡 Conectando a base de datos destino (redSocialDB)...');
        const connDestino = await mongoose.createConnection(URI_DESTINO);
        console.log('✅ Conectado a redSocialDB\n');
        
        // Modelos origen
        const UserOrigen = connOrigen.model('User', userSchema);
        const TransactionOrigen = connOrigen.model('Transaction', transactionSchema);
        const EnvelopeOrigen = connOrigen.model('Envelope', envelopeSchema);
        const BudgetOrigen = connOrigen.model('Budget', budgetSchema);
        const AccountOrigen = connOrigen.model('Account', accountSchema);
        const LoanOrigen = connOrigen.model('Loan', loanSchema);
        const InvestmentOrigen = connOrigen.model('Investment', investmentSchema);
        const PropertyOrigen = connOrigen.model('Property', propertySchema);
        const PatrimonioOrigen = connOrigen.model('Patrimonio', patrimonioSchema);
        const RecurringExpenseOrigen = connOrigen.model('RecurringExpense', recurringExpenseSchema);
        
        // Modelos destino
        const UserDestino = connDestino.model('User', userSchema);
        const TransactionDestino = connDestino.model('Transaction', transactionSchema);
        const EnvelopeDestino = connDestino.model('Envelope', envelopeSchema);
        const BudgetDestino = connDestino.model('Budget', budgetSchema);
        const AccountDestino = connDestino.model('Account', accountSchema);
        const LoanDestino = connDestino.model('Loan', loanSchema);
        const InvestmentDestino = connDestino.model('Investment', investmentSchema);
        const PropertyDestino = connDestino.model('Property', propertySchema);
        const PatrimonioDestino = connDestino.model('Patrimonio', patrimonioSchema);
        const RecurringExpenseDestino = connDestino.model('RecurringExpense', recurringExpenseSchema);
        
        // Migrar usuarios
        console.log('👤 Migrando usuarios...');
        const users = await UserOrigen.find({});
        console.log(`   Encontrados: ${users.length} usuarios`);
        if (users.length > 0) {
            for (const user of users) {
                const userData = user.toObject();
                delete userData._id;
                const existingUser = await UserDestino.findOne({ email: userData.email });
                if (!existingUser) {
                    await UserDestino.create(userData);
                    console.log(`   ✅ Usuario migrado: ${userData.email}`);
                } else {
                    console.log(`   ⚠️ Usuario ya existe: ${userData.email}`);
                }
            }
        }
        console.log('');
        
        // Migrar transacciones
        console.log('💰 Migrando transacciones...');
        const transactions = await TransactionOrigen.find({});
        console.log(`   Encontradas: ${transactions.length} transacciones`);
        if (transactions.length > 0) {
            // Obtener todos los usuarios destino para mapear IDs
            const usersDestino = await UserDestino.find({});
            const userMap = {};
            usersDestino.forEach(u => {
                userMap[u.email] = u._id;
            });
            
            let migradas = 0;
            for (const transaction of transactions) {
                const transData = transaction.toObject();
                const userOrigen = await UserOrigen.findById(transData.user_id);
                if (userOrigen && userMap[userOrigen.email]) {
                    transData.user_id = userMap[userOrigen.email];
                    delete transData._id;
                    await TransactionDestino.create(transData);
                    migradas++;
                }
            }
            console.log(`   ✅ ${migradas} transacciones migradas`);
        }
        console.log('');
        
        // Migrar sobres
        console.log('✉️ Migrando sobres...');
        const envelopes = await EnvelopeOrigen.find({});
        console.log(`   Encontrados: ${envelopes.length} sobres`);
        if (envelopes.length > 0) {
            const usersDestino = await UserDestino.find({});
            const userMap = {};
            usersDestino.forEach(u => {
                userMap[u.email] = u._id;
            });
            
            let migrados = 0;
            for (const envelope of envelopes) {
                const envData = envelope.toObject();
                const userOrigen = await UserOrigen.findById(envData.user_id);
                if (userOrigen && userMap[userOrigen.email]) {
                    envData.user_id = userMap[userOrigen.email];
                    delete envData._id;
                    await EnvelopeDestino.create(envData);
                    migrados++;
                }
            }
            console.log(`   ✅ ${migrados} sobres migrados`);
        }
        console.log('');
        
        // Migrar presupuestos
        console.log('📊 Migrando presupuestos...');
        const budgets = await BudgetOrigen.find({});
        console.log(`   Encontrados: ${budgets.length} presupuestos`);
        if (budgets.length > 0) {
            const usersDestino = await UserDestino.find({});
            const userMap = {};
            usersDestino.forEach(u => {
                userMap[u.email] = u._id;
            });
            
            let migrados = 0;
            for (const budget of budgets) {
                const budgetData = budget.toObject();
                const userOrigen = await UserOrigen.findById(budgetData.user_id);
                if (userOrigen && userMap[userOrigen.email]) {
                    budgetData.user_id = userMap[userOrigen.email];
                    delete budgetData._id;
                    await BudgetDestino.create(budgetData);
                    migrados++;
                }
            }
            console.log(`   ✅ ${migrados} presupuestos migrados`);
        }
        console.log('');
        
        // Migrar cuentas
        console.log('🏦 Migrando cuentas...');
        const accounts = await AccountOrigen.find({});
        console.log(`   Encontradas: ${accounts.length} cuentas`);
        if (accounts.length > 0) {
            const usersDestino = await UserDestino.find({});
            const userMap = {};
            usersDestino.forEach(u => {
                userMap[u.email] = u._id;
            });
            
            let migradas = 0;
            for (const account of accounts) {
                const accountData = account.toObject();
                const userOrigen = await UserOrigen.findById(accountData.user_id);
                if (userOrigen && userMap[userOrigen.email]) {
                    accountData.user_id = userMap[userOrigen.email];
                    delete accountData._id;
                    await AccountDestino.create(accountData);
                    migradas++;
                }
            }
            console.log(`   ✅ ${migradas} cuentas migradas`);
        }
        console.log('');
        
        // Cerrar conexiones
        await connOrigen.close();
        await connDestino.close();
        
        console.log('✅ Migración completada');
        process.exit(0);
    } catch (err) {
        console.error('❌ Error en migración:', err);
        process.exit(1);
    }
}

migrarDatos();
