const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'tu_secreto_super_seguro_cambiar_en_produccion';
// Obtener MONGODB_URI y asegurar formato correcto
let MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/veedor';

// Asegurar que el connection string tenga el formato correcto
if (MONGODB_URI && !MONGODB_URI.includes('mongodb://localhost')) {
    // Si no termina con /veedor, agregarlo
    if (!MONGODB_URI.includes('/veedor') && !MONGODB_URI.includes('/?')) {
        // Si tiene query params, insertar /veedor antes del ?
        if (MONGODB_URI.includes('?')) {
            MONGODB_URI = MONGODB_URI.replace('?', '/veedor?');
        } else {
            MONGODB_URI = MONGODB_URI.endsWith('/') 
                ? MONGODB_URI + 'veedor' 
                : MONGODB_URI + '/veedor';
        }
    }
}

// Middleware
app.use(cors());
app.use(express.json());

// Servir archivos estáticos desde la carpeta public (ANTES de las rutas de API)
app.use(express.static(path.join(__dirname, 'public'), {
    etag: false,
    lastModified: false
}));
console.log('📁 Archivos estáticos servidos desde:', path.join(__dirname, 'public'));

// Modelos de MongoDB
const userSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
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
    description: { type: String, default: null },
    created_at: { type: Date, default: Date.now }
});

const envelopeSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    budget: { type: Number, required: true },
    created_at: { type: Date, default: Date.now }
});

const loanSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    principal: { type: Number, required: true }, // Monto principal
    interest_rate: { type: Number, required: true }, // Tasa de interés anual (%)
    tae: { type: Number, default: null }, // TAE (Tasa Anual Equivalente) - incluye comisiones
    start_date: { type: String, required: true },
    end_date: { type: String, required: true },
    monthly_payment: { type: Number, required: true },
    type: { type: String, enum: ['debt', 'credit'], required: true }, // Deuda que debo o crédito que me deben
    description: { type: String, default: null },
    opening_commission: { type: Number, default: 0 }, // Comisión de apertura
    early_payment_commission: { type: Number, default: 0 }, // Comisión por amortización anticipada (%)
    payment_frequency: { type: String, enum: ['monthly', 'quarterly', 'yearly'], default: 'monthly' },
    payment_day: { type: Number, default: 1 }, // Día del mes en que se paga
    total_paid: { type: Number, default: 0 }, // Total pagado hasta ahora
    last_payment_date: { type: String, default: null },
    early_payments: [{ // Amortizaciones anticipadas
        date: { type: String, required: true },
        amount: { type: Number, required: true },
        commission: { type: Number, default: 0 }
    }],
    created_at: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Transaction = mongoose.model('Transaction', transactionSchema);
const Envelope = mongoose.model('Envelope', envelopeSchema);
const Loan = mongoose.model('Loan', loanSchema);

// Conectar a MongoDB
console.log('=== CONFIGURACIÓN MONGODB ===');
console.log('MONGODB_URI configurado:', MONGODB_URI ? 'Sí' : 'No');
if (MONGODB_URI) {
    // Ocultar la contraseña en los logs
    const uriForLog = MONGODB_URI.replace(/:[^:@]+@/, ':****@');
    console.log('MONGODB_URI (sin contraseña):', uriForLog);
}

if (!MONGODB_URI || MONGODB_URI === 'mongodb://localhost:27017/veedor') {
    console.error('❌ MONGODB_URI no está configurado correctamente!');
    console.error('💡 Configura MONGODB_URI en las variables de entorno de Render');
}

// Función para conectar a MongoDB
async function connectToMongoDB() {
    try {
        console.log('Intentando conectar a MongoDB...');
        await mongoose.connect(MONGODB_URI, {
            serverSelectionTimeoutMS: 30000,
            socketTimeoutMS: 45000,
            retryWrites: true,
            w: 'majority',
            maxPoolSize: 10
        });
        console.log('✅ Conectado a MongoDB exitosamente');
        console.log('Estado de conexión:', mongoose.connection.readyState);
        console.log('Base de datos:', mongoose.connection.db?.databaseName || 'conectando...');
        return true;
    } catch (err) {
        console.error('❌ Error conectando a MongoDB:', err.message);
        console.error('Código de error:', err.code);
        if (err.code === 'ENOTFOUND' || err.code === 'ETIMEDOUT') {
            console.error('💡 Error de red. Verifica que MongoDB Atlas esté accesible.');
        } else if (err.code === 'EAUTH') {
            console.error('💡 Error de autenticación. Verifica usuario y contraseña.');
        }
        console.log('💡 Asegúrate de configurar MONGODB_URI en las variables de entorno');
        console.log('💡 Verifica que tu IP esté en la whitelist de MongoDB Atlas (0.0.0.0/0)');
        console.log('💡 Formato esperado: mongodb+srv://usuario:password@cluster.mongodb.net/veedor');
        return false;
    }
}

// Conectar al iniciar
connectToMongoDB();

// Manejar eventos de conexión
mongoose.connection.on('error', (err) => {
    console.error('Error de MongoDB:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB desconectado. Intentando reconectar...');
    // Intentar reconectar después de 5 segundos
    setTimeout(() => {
        if (mongoose.connection.readyState === 0) {
            connectToMongoDB();
        }
    }, 5000);
});

mongoose.connection.on('connected', () => {
    console.log('✅ MongoDB conectado');
});

mongoose.connection.on('reconnected', () => {
    console.log('✅ MongoDB reconectado');
});

// Middleware de autenticación
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Token no proporcionado' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Token inválido' });
        }
        req.user = user;
        next();
    });
}

// ==================== RUTAS DE HEALTH CHECK ====================

// Health check
app.get('/api/health', (req, res) => {
    const mongoStatus = mongoose.connection.readyState;
    const status = {
        server: 'ok',
        mongodb: mongoStatus === 1 ? 'connected' : mongoStatus === 2 ? 'connecting' : 'disconnected',
        mongodbState: mongoStatus,
        hasMongoURI: !!MONGODB_URI,
        mongoURILength: MONGODB_URI ? MONGODB_URI.length : 0
    };
    res.json(status);
});

// ==================== RUTAS DE AUTENTICACIÓN ====================

// Registro
app.post('/api/register', async (req, res) => {
    try {
        console.log('=== INTENTO DE REGISTRO ===');
        console.log('Estado MongoDB:', mongoose.connection.readyState);
        console.log('Body recibido:', { username: req.body.username, password: req.body.password ? '***' : 'no proporcionada' });
        console.log('MONGODB_URI configurado:', MONGODB_URI ? 'Sí' : 'No');
        
        // Verificar que MONGODB_URI esté configurado
        if (!MONGODB_URI || MONGODB_URI === 'mongodb://localhost:27017/veedor') {
            console.error('❌ MONGODB_URI no está configurado en Render');
            return res.status(500).json({ error: 'Servidor no configurado correctamente. Contacta al administrador.' });
        }
        
        // Verificar conexión a MongoDB
        if (mongoose.connection.readyState !== 1) {
            console.log('❌ MongoDB no está conectado. Estado:', mongoose.connection.readyState);
            console.log('Estados: 0=desconectado, 1=conectado, 2=conectando, 3=desconectando');
            
            // Intentar reconectar
            if (mongoose.connection.readyState === 0) {
                console.log('Intentando reconectar a MongoDB...');
                const reconnected = await connectToMongoDB();
                if (!reconnected) {
                    return res.status(503).json({ error: 'Base de datos no disponible. Verifica la configuración de MongoDB en Render.' });
                }
            } else {
                return res.status(503).json({ error: 'Base de datos no disponible. Intenta de nuevo en unos momentos.' });
            }
        }

        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Usuario y contraseña requeridos' });
        }

        if (username.trim().length === 0) {
            return res.status(400).json({ error: 'El usuario no puede estar vacío' });
        }

        if (password.length < 4) {
            return res.status(400).json({ error: 'La contraseña debe tener al menos 4 caracteres' });
        }

        // Verificar si el usuario ya existe
        const existingUser = await User.findOne({ username: username.trim() });
        if (existingUser) {
            return res.status(400).json({ error: 'El usuario ya existe' });
        }

        // Hash de la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear usuario
        const user = new User({ 
            username: username.trim(), 
            password: hashedPassword 
        });
        await user.save();

        // Generar token
        const token = jwt.sign({ userId: user._id.toString(), username: user.username }, JWT_SECRET, { expiresIn: '30d' });

        res.status(201).json({
            message: 'Usuario creado exitosamente',
            token,
            user: { id: user._id.toString(), username: user.username }
        });
    } catch (error) {
        console.error('❌ Error en registro:', error);
        console.error('Tipo de error:', error.name);
        console.error('Código de error:', error.code);
        console.error('Mensaje:', error.message);
        
        if (error.code === 11000) {
            return res.status(400).json({ error: 'El usuario ya existe' });
        }
        if (error.name === 'MongoServerError' || error.name === 'MongoError') {
            return res.status(500).json({ error: 'Error de base de datos. Verifica la conexión a MongoDB.' });
        }
        if (error.message) {
            return res.status(500).json({ error: error.message });
        }
        res.status(500).json({ error: 'Error del servidor. Revisa los logs para más detalles.' });
    }
});

// Login
app.post('/api/login', async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({ error: 'Base de datos no disponible. Intenta de nuevo en unos momentos.' });
        }

        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Usuario y contraseña requeridos' });
        }

        const user = await User.findOne({ username: username.trim() });
        if (!user) {
            return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
        }

        const token = jwt.sign({ userId: user._id.toString(), username: user.username }, JWT_SECRET, { expiresIn: '30d' });

        res.json({
            message: 'Login exitoso',
            token,
            user: { id: user._id.toString(), username: user.username }
        });
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ error: error.message || 'Error del servidor' });
    }
});

// Verificar token
app.get('/api/verify', authenticateToken, async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({ error: 'Base de datos no disponible' });
        }
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.json({ user: { id: user._id.toString(), username: user.username } });
    } catch (error) {
        console.error('Error verificando token:', error);
        res.status(500).json({ error: 'Error del servidor' });
    }
});

// ==================== RUTAS DE TRANSACCIONES ====================

// Obtener todas las transacciones del usuario
app.get('/api/transactions', authenticateToken, async (req, res) => {
    try {
        const transactions = await Transaction.find({ user_id: req.user.userId })
            .sort({ date: -1, created_at: -1 });
        res.json(transactions);
    } catch (error) {
        console.error('Error obteniendo transacciones:', error);
        res.status(500).json({ error: 'Error al obtener transacciones' });
    }
});

// Crear transacción
app.post('/api/transactions', authenticateToken, async (req, res) => {
    try {
        const { type, date, amount, categoryGeneral, categorySpecific, envelope, description } = req.body;

        if (!type || !date || amount === undefined || !categoryGeneral || !categorySpecific) {
            return res.status(400).json({ error: 'Datos incompletos' });
        }

        const finalAmount = type === 'expense' ? -Math.abs(amount) : Math.abs(amount);

        const transaction = new Transaction({
            user_id: req.user.userId,
            type,
            date,
            amount: finalAmount,
            category_general: categoryGeneral,
            category_specific: categorySpecific,
            envelope: envelope || null,
            description: description || null
        });

        await transaction.save();
        res.status(201).json(transaction);
    } catch (error) {
        console.error('Error creando transacción:', error);
        res.status(500).json({ error: 'Error al crear transacción' });
    }
});

// Eliminar transacción
app.delete('/api/transactions/:id', authenticateToken, async (req, res) => {
    try {
        const transaction = await Transaction.findOneAndDelete({
            _id: req.params.id,
            user_id: req.user.userId
        });

        if (!transaction) {
            return res.status(404).json({ error: 'Transacción no encontrada' });
        }

        res.json({ message: 'Transacción eliminada exitosamente' });
    } catch (error) {
        console.error('Error eliminando transacción:', error);
        res.status(500).json({ error: 'Error al eliminar transacción' });
    }
});

// ==================== RUTAS DE SOBRES ====================

// Obtener todos los sobres del usuario
app.get('/api/envelopes', authenticateToken, async (req, res) => {
    try {
        const envelopes = await Envelope.find({ user_id: req.user.userId })
            .sort({ created_at: -1 });
        res.json(envelopes);
    } catch (error) {
        console.error('Error obteniendo sobres:', error);
        res.status(500).json({ error: 'Error al obtener sobres' });
    }
});

// Crear sobre
app.post('/api/envelopes', authenticateToken, async (req, res) => {
    try {
        const { name, budget } = req.body;

        if (!name || budget === undefined) {
            return res.status(400).json({ error: 'Nombre y presupuesto requeridos' });
        }

        const envelope = new Envelope({
            user_id: req.user.userId,
            name,
            budget
        });

        await envelope.save();
        res.status(201).json(envelope);
    } catch (error) {
        console.error('Error creando sobre:', error);
        res.status(500).json({ error: 'Error al crear sobre' });
    }
});

// Eliminar sobre
app.delete('/api/envelopes/:id', authenticateToken, async (req, res) => {
    try {
        const envelope = await Envelope.findOneAndDelete({
            _id: req.params.id,
            user_id: req.user.userId
        });

        if (!envelope) {
            return res.status(404).json({ error: 'Sobre no encontrado' });
        }

        res.json({ message: 'Sobre eliminado exitosamente' });
    } catch (error) {
        console.error('Error eliminando sobre:', error);
        res.status(500).json({ error: 'Error al eliminar sobre' });
    }
});

// ==================== RUTAS DE PRÉSTAMOS ====================

// Obtener todos los préstamos del usuario
app.get('/api/loans', authenticateToken, async (req, res) => {
    try {
        const loans = await Loan.find({ user_id: req.user.userId })
            .sort({ created_at: -1 });
        res.json(loans);
    } catch (error) {
        console.error('Error obteniendo préstamos:', error);
        res.status(500).json({ error: 'Error al obtener préstamos' });
    }
});

// Crear préstamo
app.post('/api/loans', authenticateToken, async (req, res) => {
    try {
        const { 
            name, principal, interest_rate, tae, start_date, end_date, monthly_payment, type, description,
            opening_commission, early_payment_commission, payment_frequency, payment_day
        } = req.body;

        if (!name || principal === undefined || interest_rate === undefined || !start_date || !end_date || monthly_payment === undefined || !type) {
            return res.status(400).json({ error: 'Todos los campos requeridos deben estar presentes' });
        }

        const loan = new Loan({
            user_id: req.user.userId,
            name,
            principal,
            interest_rate,
            tae: tae || null,
            start_date,
            end_date,
            monthly_payment,
            type,
            description: description || null,
            opening_commission: opening_commission || 0,
            early_payment_commission: early_payment_commission || 0,
            payment_frequency: payment_frequency || 'monthly',
            payment_day: payment_day || 1
        });

        await loan.save();
        res.status(201).json(loan);
    } catch (error) {
        console.error('Error creando préstamo:', error);
        res.status(500).json({ error: 'Error al crear préstamo' });
    }
});

// Registrar pago de préstamo
app.post('/api/loans/:id/payment', authenticateToken, async (req, res) => {
    try {
        const { amount, date, is_early_payment } = req.body;
        const loan = await Loan.findOne({ _id: req.params.id, user_id: req.user.userId });

        if (!loan) {
            return res.status(404).json({ error: 'Préstamo no encontrado' });
        }

        if (is_early_payment) {
            const commission = loan.early_payment_commission > 0 
                ? (amount * loan.early_payment_commission / 100) 
                : 0;
            
            loan.early_payments.push({
                date: date || new Date().toISOString().split('T')[0],
                amount,
                commission
            });
        }

        loan.total_paid += amount;
        loan.last_payment_date = date || new Date().toISOString().split('T')[0];
        await loan.save();

        res.json(loan);
    } catch (error) {
        console.error('Error registrando pago:', error);
        res.status(500).json({ error: 'Error al registrar pago' });
    }
});

// Actualizar préstamo
app.put('/api/loans/:id', authenticateToken, async (req, res) => {
    try {
        const loan = await Loan.findOneAndUpdate(
            { _id: req.params.id, user_id: req.user.userId },
            req.body,
            { new: true }
        );

        if (!loan) {
            return res.status(404).json({ error: 'Préstamo no encontrado' });
        }

        res.json(loan);
    } catch (error) {
        console.error('Error actualizando préstamo:', error);
        res.status(500).json({ error: 'Error al actualizar préstamo' });
    }
});

// Eliminar préstamo
app.delete('/api/loans/:id', authenticateToken, async (req, res) => {
    try {
        const loan = await Loan.findOneAndDelete({
            _id: req.params.id,
            user_id: req.user.userId
        });

        if (!loan) {
            return res.status(404).json({ error: 'Préstamo no encontrado' });
        }

        res.json({ message: 'Préstamo eliminado exitosamente' });
    } catch (error) {
        console.error('Error eliminando préstamo:', error);
        res.status(500).json({ error: 'Error al eliminar préstamo' });
    }
});

// ==================== RUTA PARA SERVIR EL FRONTEND ====================
app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    } else {
        res.status(404).json({ error: 'Ruta no encontrada' });
    }
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
    const os = require('os');
    const networkInterfaces = os.networkInterfaces();
    let localIP = 'localhost';
    
    if (process.env.RENDER) {
        console.log(`🚀 Servidor corriendo en Render.com`);
    } else {
        // Obtener la primera IP local (no loopback)
        for (const interfaceName in networkInterfaces) {
            const interfaces = networkInterfaces[interfaceName];
            for (const iface of interfaces) {
                if (iface.family === 'IPv4' && !iface.internal) {
                    localIP = iface.address;
                    break;
                }
            }
            if (localIP !== 'localhost') break;
        }
        
        console.log(`🚀 Servidor corriendo:`);
        console.log(`   Local:   http://localhost:${PORT}`);
        console.log(`   Red:     http://${localIP}:${PORT}`);
    }
    
    console.log(`📊 Base de datos: MongoDB (en la nube)`);
    if (!process.env.RENDER) {
        console.log(`\n💡 Para acceder desde otros dispositivos, usa: http://${localIP}:${PORT}`);
    }
});
