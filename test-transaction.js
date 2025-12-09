const http = require('http');

const API_URL = 'http://localhost:3000/api';

function makeRequest(url, options = {}) {
    return new Promise((resolve, reject) => {
        const urlObj = new URL(url);
        const requestOptions = {
            hostname: urlObj.hostname,
            port: urlObj.port || 3000,
            path: urlObj.pathname,
            method: options.method || 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            }
        };

        const req = http.request(requestOptions, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                try {
                    const jsonData = JSON.parse(data);
                    resolve({ status: res.statusCode, data: jsonData, ok: res.statusCode >= 200 && res.statusCode < 300 });
                } catch (e) {
                    resolve({ status: res.statusCode, data: data, ok: res.statusCode >= 200 && res.statusCode < 300 });
                }
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        if (options.body) {
            req.write(JSON.stringify(options.body));
        }

        req.end();
    });
}

async function testTransaction() {
    try {
        console.log('🧪 Iniciando prueba de transacciones...\n');
        
        // Paso 1: Login (necesitas tener un usuario creado)
        console.log('1️⃣ Intentando login...');
        const loginResponse = await makeRequest(`${API_URL}/login`, {
            method: 'POST',
            body: {
                emailOrUsername: 'test@test.com', // Cambia esto por un usuario real
                password: 'test123' // Cambia esto por la contraseña real
            }
        });
        
        if (!loginResponse.ok) {
            console.log('❌ Error en login:', loginResponse.data);
            console.log('\n⚠️  Necesitas crear un usuario primero o usar credenciales válidas');
            console.log('💡 Puedes usar cualquier usuario que tengas registrado en la app');
            return;
        }
        
        const token = loginResponse.data.token;
        console.log('✅ Login exitoso, token obtenido\n');
        
        // Paso 2: Crear transacción
        console.log('2️⃣ Intentando crear transacción...');
        const transactionData = {
            type: 'expense',
            date: '2024-01-15',
            amount: 100,
            categoryGeneral: 'food',
            categorySpecific: 'restaurant',
            description: 'Prueba de transacción'
        };
        
        console.log('📤 Datos a enviar:', transactionData);
        
        const transactionResponse = await makeRequest(`${API_URL}/transactions`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: transactionData
        });
        
        if (transactionResponse.ok) {
            console.log('✅ Transacción creada exitosamente!');
            console.log('📄 Respuesta:', JSON.stringify(transactionResponse.data, null, 2));
        } else {
            console.log('❌ Error al crear transacción');
            console.log('📄 Respuesta:', JSON.stringify(transactionResponse.data, null, 2));
            console.log('📊 Status:', transactionResponse.status);
        }
        
    } catch (error) {
        console.error('❌ Error en la prueba:', error.message);
        console.error('Stack:', error.stack);
    }
}

testTransaction();

