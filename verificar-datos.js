const mongoose = require('mongoose');
require('dotenv').config();

// Verificar ambas bases de datos
const URI_VEEDOR = 'mongodb+srv://veedor_admin:EBS2iHSo5EGwMBeI@cluster0.sqt1psn.mongodb.net/veedor?retryWrites=true&w=majority';
const URI_REDSOCIAL = 'mongodb+srv://veedor_admin:EBS2iHSo5EGwMBeI@cluster0.sqt1psn.mongodb.net/redSocialDB?retryWrites=true&w=majority';

async function verificarDatos() {
    try {
        console.log('🔍 Verificando datos en ambas bases de datos...\n');
        
        // Conectar a veedor (base de datos anterior)
        console.log('📊 Verificando base de datos: veedor');
        const connVeedor = await mongoose.createConnection(URI_VEEDOR);
        const TransactionVeedor = connVeedor.model('Transaction', new mongoose.Schema({}, { strict: false }));
        const UserVeedor = connVeedor.model('User', new mongoose.Schema({}, { strict: false }));
        
        const transactionsVeedor = await TransactionVeedor.countDocuments();
        const usersVeedor = await UserVeedor.countDocuments();
        
        console.log(`   Transacciones: ${transactionsVeedor}`);
        console.log(`   Usuarios: ${usersVeedor}`);
        
        if (transactionsVeedor > 0) {
            console.log('   ✅ ¡Hay datos en la base de datos veedor!\n');
            
            // Listar usuarios
            const users = await UserVeedor.find({}).select('email username').limit(10);
            console.log('   Usuarios encontrados:');
            users.forEach(user => {
                console.log(`     - ${user.email} (${user.username})`);
            });
        } else {
            console.log('   ⚠️ No hay transacciones en veedor\n');
        }
        
        await connVeedor.close();
        
        // Conectar a redSocialDB (base de datos actual)
        console.log('📊 Verificando base de datos: redSocialDB');
        const connRedSocial = await mongoose.createConnection(URI_REDSOCIAL);
        const TransactionRedSocial = connRedSocial.model('Transaction', new mongoose.Schema({}, { strict: false }));
        const UserRedSocial = connRedSocial.model('User', new mongoose.Schema({}, { strict: false }));
        
        const transactionsRedSocial = await TransactionRedSocial.countDocuments();
        const usersRedSocial = await UserRedSocial.countDocuments();
        
        console.log(`   Transacciones: ${transactionsRedSocial}`);
        console.log(`   Usuarios: ${usersRedSocial}`);
        
        if (transactionsRedSocial > 0) {
            console.log('   ✅ Hay datos en redSocialDB');
        } else {
            console.log('   ⚠️ No hay transacciones en redSocialDB');
        }
        
        await connRedSocial.close();
        
        console.log('\n📋 Resumen:');
        console.log(`   veedor: ${transactionsVeedor} transacciones, ${usersVeedor} usuarios`);
        console.log(`   redSocialDB: ${transactionsRedSocial} transacciones, ${usersRedSocial} usuarios`);
        
        if (transactionsVeedor > 0 && transactionsRedSocial === 0) {
            console.log('\n💡 RECOMENDACIÓN:');
            console.log('   Tus datos están en la base de datos "veedor".');
            console.log('   Necesitas migrar los datos o cambiar la configuración para usar "veedor" en lugar de "redSocialDB".');
        }
        
        process.exit(0);
    } catch (err) {
        console.error('❌ Error:', err.message);
        process.exit(1);
    }
}

verificarDatos();
