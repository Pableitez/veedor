const mongoose = require('mongoose');
require('dotenv').config();

const URI = 'mongodb+srv://veedor_admin:EBS2iHSo5EGwMBeI@cluster0.sqt1psn.mongodb.net/?retryWrites=true&w=majority';

async function listarBasesDatos() {
    try {
        console.log('🔍 Listando todas las bases de datos en el cluster...\n');
        
        const conn = await mongoose.connect(URI);
        const admin = conn.connection.db.admin();
        
        // Listar todas las bases de datos
        const dbs = await conn.connection.db.admin().listDatabases();
        
        console.log('📊 Bases de datos encontradas:\n');
        
        for (const db of dbs.databases) {
            console.log(`   📁 ${db.name}`);
            console.log(`      Tamaño: ${(db.sizeOnDisk / 1024 / 1024).toFixed(2)} MB`);
            
            // Conectar a cada base de datos y contar colecciones
            try {
                const dbConn = conn.connection.useDb(db.name);
                const collections = await dbConn.db.listCollections().toArray();
                console.log(`      Colecciones: ${collections.length}`);
                
                if (collections.length > 0) {
                    // Contar documentos en cada colección
                    for (const col of collections) {
                        const count = await dbConn.db.collection(col.name).countDocuments();
                        if (count > 0) {
                            console.log(`         - ${col.name}: ${count} documentos`);
                        }
                    }
                }
            } catch (err) {
                console.log(`      ⚠️ Error accediendo: ${err.message}`);
            }
            console.log('');
        }
        
        await mongoose.disconnect();
        process.exit(0);
    } catch (err) {
        console.error('❌ Error:', err.message);
        process.exit(1);
    }
}

listarBasesDatos();
