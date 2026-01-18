const mongoose = require('mongoose');
require('dotenv').config();

const URI = 'mongodb+srv://veedor_admin:EBS2iHSo5EGwMBeI@cluster0.sqt1psn.mongodb.net/?retryWrites=true&w=majority';

async function verificarBackups() {
    try {
        console.log('🔍 Verificando información sobre backups...\n');
        console.log('⚠️ NOTA: Los backups de MongoDB Atlas se gestionan desde el dashboard web.');
        console.log('⚠️ Este script puede verificar bases de datos, pero no puede acceder directamente a los backups.\n');
        
        await mongoose.connect(URI);
        const admin = conn.connection.db.admin();
        
        // Obtener información del cluster
        const serverStatus = await conn.connection.db.admin().serverStatus();
        console.log('📊 Información del Cluster:');
        console.log(`   Host: ${conn.connection.host}`);
        console.log(`   Versión: ${serverStatus.version || 'N/A'}\n`);
        
        // Listar todas las bases de datos
        const dbs = await conn.connection.db.admin().listDatabases();
        
        console.log('📁 Bases de datos en el cluster:');
        let totalSize = 0;
        let databasesWithData = [];
        
        for (const db of dbs.databases) {
            const sizeMB = db.sizeOnDisk / 1024 / 1024;
            totalSize += sizeMB;
            
            if (db.name !== 'admin' && db.name !== 'local' && sizeMB > 0.01) {
                databasesWithData.push({
                    name: db.name,
                    size: sizeMB
                });
                
                try {
                    const dbConn = conn.connection.useDb(db.name);
                    const collections = await dbConn.db.listCollections().toArray();
                    let totalDocs = 0;
                    
                    for (const col of collections) {
                        const count = await dbConn.db.collection(col.name).countDocuments();
                        totalDocs += count;
                    }
                    
                    if (totalDocs > 0) {
                        console.log(`   ✅ ${db.name}: ${totalDocs.toLocaleString()} documentos (${sizeMB.toFixed(2)} MB)`);
                    }
                } catch (err) {
                    // Ignorar errores de acceso
                }
            }
        }
        
        console.log(`\n💾 Tamaño total de datos: ${totalSize.toFixed(2)} MB`);
        
        // Verificar si hay bases de datos con datos recientes
        console.log('\n📋 Análisis:');
        if (databasesWithData.length === 0) {
            console.log('   ⚠️ No se encontraron bases de datos con datos significativos');
            console.log('   ⚠️ Esto confirma que los datos fueron borrados');
        } else {
            console.log(`   ✅ Se encontraron ${databasesWithData.length} bases de datos con datos`);
        }
        
        await mongoose.disconnect();
        
        console.log('\n🔍 PRÓXIMOS PASOS PARA VERIFICAR BACKUPS:');
        console.log('   1. Ve a https://cloud.mongodb.com/');
        console.log('   2. Inicia sesión con tu cuenta');
        console.log('   3. Selecciona tu proyecto/cluster');
        console.log('   4. En el menú lateral, busca "Backups" o "Backup"');
        console.log('   5. Si hay backups habilitados, verás una lista de snapshots');
        console.log('   6. Busca un snapshot ANTES de cuando borraste los datos');
        console.log('   7. Si encuentras uno, puedes restaurarlo desde ahí\n');
        
        console.log('💡 Si no ves la opción "Backups":');
        console.log('   - Puede que los backups no estén habilitados');
        console.log('   - O puede estar en "More" o "..." en el menú');
        console.log('   - Revisa la guía en: habilitar-backups.md\n');
        
        process.exit(0);
    } catch (err) {
        console.error('❌ Error:', err.message);
        console.error('\n💡 Esto es normal - los backups no se pueden verificar desde la conexión estándar.');
        console.error('💡 Debes verificar los backups desde el dashboard web de MongoDB Atlas.\n');
        process.exit(1);
    }
}

// Intentar verificar, pero mostrar instrucciones claras
console.log('🔍 Verificando estado de las bases de datos...\n');

const conn = mongoose.createConnection(URI);

conn.on('connected', async () => {
    try {
        const dbs = await conn.db.admin().listDatabases();
        
        console.log('📊 Resumen de bases de datos:\n');
        
        let hasData = false;
        for (const db of dbs.databases) {
            if (db.name !== 'admin' && db.name !== 'local') {
                const sizeMB = db.sizeOnDisk / 1024 / 1024;
                if (sizeMB > 0.01) {
                    try {
                        const dbConn = conn.useDb(db.name);
                        const collections = await dbConn.db.listCollections().toArray();
                        let totalDocs = 0;
                        
                        for (const col of collections) {
                            const count = await dbConn.db.collection(col.name).countDocuments();
                            totalDocs += count;
                        }
                        
                        if (totalDocs > 0) {
                            console.log(`   📁 ${db.name}: ${totalDocs.toLocaleString()} documentos`);
                            hasData = true;
                        }
                    } catch (err) {
                        // Ignorar
                    }
                }
            }
        }
        
        if (!hasData) {
            console.log('   ⚠️ No se encontraron datos en ninguna base de datos');
            console.log('   ⚠️ Esto confirma que los datos fueron borrados\n');
        }
        
        await conn.close();
        
        console.log('🔍 VERIFICACIÓN DE BACKUPS:');
        console.log('   Los backups de MongoDB Atlas NO se pueden verificar desde aquí.');
        console.log('   Debes verificar manualmente en el dashboard web.\n');
        console.log('📋 INSTRUCCIONES:');
        console.log('   1. Ve a: https://cloud.mongodb.com/');
        console.log('   2. Inicia sesión');
        console.log('   3. Selecciona tu proyecto');
        console.log('   4. Busca "Backups" en el menú lateral');
        console.log('   5. Si está habilitado, verás snapshots con fechas');
        console.log('   6. Busca un snapshot ANTES de cuando borraste los datos\n');
        console.log('💡 Si no ves "Backups":');
        console.log('   - Puede estar en "More" o "..."');
        console.log('   - O puede que no estén habilitados');
        console.log('   - Revisa: habilitar-backups.md para habilitarlos\n');
        
        process.exit(0);
    } catch (err) {
        console.error('❌ Error:', err.message);
        process.exit(1);
    }
});

conn.on('error', (err) => {
    console.error('❌ Error de conexión:', err.message);
    process.exit(1);
});
