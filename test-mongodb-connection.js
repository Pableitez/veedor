const mongoose = require('mongoose');
require('dotenv').config();

// Obtener MONGODB_URI desde variables de entorno (acepta MONGO_URI o MONGODB_URI)
let MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/veedor';

// Asegurar que el connection string tenga el formato correcto
// Si la URI ya tiene una base de datos especificada, no la modificamos
if (MONGODB_URI && !MONGODB_URI.includes('mongodb://localhost')) {
    const uriMatch = MONGODB_URI.match(/mongodb\+srv:\/\/[^/]+\/([^?]+)/);
    if (!uriMatch || uriMatch[1] === '') {
        // No tiene base de datos especificada, agregar /veedor
        if (MONGODB_URI.includes('?')) {
            MONGODB_URI = MONGODB_URI.replace('?', '/veedor?');
        } else {
            MONGODB_URI = MONGODB_URI.endsWith('/') 
                ? MONGODB_URI + 'veedor' 
                : MONGODB_URI + '/veedor';
        }
    }
}

console.log('🔍 Verificando conexión a MongoDB...\n');
console.log('📍 URI configurada:', MONGODB_URI.replace(/:[^:@]+@/, ':****@'));
console.log('');

async function testConnection() {
    try {
        console.log('⏳ Intentando conectar...');
        
        await mongoose.connect(MONGODB_URI, {
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 45000,
            retryWrites: true,
            w: 'majority',
            maxPoolSize: 10
        });
        
        console.log('✅ ¡Conexión exitosa a MongoDB!');
        console.log('');
        console.log('📊 Información de la conexión:');
        console.log('   Estado:', mongoose.connection.readyState === 1 ? 'Conectado' : 'Desconectado');
        console.log('   Base de datos:', mongoose.connection.db?.databaseName || 'N/A');
        console.log('   Host:', mongoose.connection.host || 'N/A');
        console.log('   Puerto:', mongoose.connection.port || 'N/A');
        console.log('');
        
        // Listar colecciones disponibles
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('📚 Colecciones disponibles:');
        if (collections.length > 0) {
            collections.forEach(col => {
                console.log(`   - ${col.name}`);
            });
        } else {
            console.log('   (No hay colecciones aún)');
        }
        console.log('');
        
        // Contar documentos en algunas colecciones principales
        const User = mongoose.connection.db.collection('users');
        const Transaction = mongoose.connection.db.collection('transactions');
        const userCount = await User.countDocuments();
        const transactionCount = await Transaction.countDocuments();
        
        console.log('📈 Estadísticas:');
        console.log(`   Usuarios: ${userCount}`);
        console.log(`   Transacciones: ${transactionCount}`);
        console.log('');
        
        console.log('✅ La base de datos está disponible y funcionando correctamente.');
        
        await mongoose.disconnect();
        console.log('🔌 Desconectado de MongoDB.');
        process.exit(0);
        
    } catch (err) {
        console.error('❌ Error al conectar a MongoDB:');
        console.error('   Mensaje:', err.message);
        console.error('   Código:', err.code || 'N/A');
        console.error('');
        
        if (err.code === 'ENOTFOUND') {
            console.error('💡 El servidor de MongoDB no se encontró.');
            console.error('   Verifica que la URL del cluster sea correcta.');
        } else if (err.code === 'ETIMEDOUT') {
            console.error('💡 Timeout al conectar.');
            console.error('   Verifica tu conexión a Internet y que MongoDB Atlas esté accesible.');
        } else if (err.code === 'EAUTH' || err.message.includes('authentication')) {
            console.error('💡 Error de autenticación.');
            console.error('   Verifica que el usuario y contraseña sean correctos.');
        } else if (err.message.includes('IP')) {
            console.error('💡 Tu IP no está en la whitelist de MongoDB Atlas.');
            console.error('   Ve a MongoDB Atlas > Network Access y agrega tu IP o 0.0.0.0/0');
        } else {
            console.error('💡 Revisa la configuración de MONGODB_URI.');
        }
        
        console.error('');
        console.error('🔧 URI utilizada:', MONGODB_URI.replace(/:[^:@]+@/, ':****@'));
        
        process.exit(1);
    }
}

testConnection();
