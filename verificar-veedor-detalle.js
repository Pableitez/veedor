const mongoose = require('mongoose');
require('dotenv').config();

const URI = 'mongodb+srv://veedor_admin:EBS2iHSo5EGwMBeI@cluster0.sqt1psn.mongodb.net/veedor?retryWrites=true&w=majority';

async function verificarDetalle() {
    try {
        console.log('🔍 Verificando en detalle la base de datos "veedor"...\n');
        
        await mongoose.connect(URI);
        const db = mongoose.connection.db;
        
        // Listar todas las colecciones
        const collections = await db.listCollections().toArray();
        console.log(`📚 Colecciones encontradas: ${collections.length}\n`);
        
        for (const col of collections) {
            const collection = db.collection(col.name);
            const count = await collection.countDocuments();
            console.log(`📋 ${col.name}: ${count} documentos`);
            
            if (count > 0 && count <= 10) {
                // Mostrar algunos documentos
                const docs = await collection.find({}).limit(5).toArray();
                console.log(`   Ejemplos:`);
                docs.forEach((doc, i) => {
                    const preview = JSON.stringify(doc).substring(0, 100);
                    console.log(`   ${i + 1}. ${preview}...`);
                });
            } else if (count > 10) {
                // Mostrar solo el primero
                const doc = await collection.findOne({});
                const preview = JSON.stringify(doc).substring(0, 100);
                console.log(`   Primer documento: ${preview}...`);
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

verificarDetalle();
