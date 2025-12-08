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
    email: { type: String, unique: true, required: true, lowercase: true, trim: true },
    username: { type: String, unique: true, required: true, trim: true },
    password: { type: String, required: true },
    // Datos personales
    firstName: { type: String, default: '' },
    lastName: { type: String, default: '' },
    age: { type: Number, default: null },
    phone: { type: String, default: '' },
    address: { type: String, default: '' },
    city: { type: String, default: '' },
    country: { type: String, default: '' },
    birthDate: { type: String, default: null },
    notes: { type: String, default: '' },
    savingsGoal: { type: Number, default: null }, // Meta de ahorro del usuario
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
    account_id: { type: String, default: null }, // ID de la cuenta bancaria asociada
    investment_id: { type: String, default: null }, // ID de la inversión asociada (si el gasto/ingreso es para una inversión)
    description: { type: String, default: null },
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
    category_id: { type: String, required: true }, // ID de la categoría
    amount: { type: Number, required: true }, // Presupuesto
    period_type: { type: String, required: true, enum: ['weekly', 'monthly', 'yearly'] }, // Tipo de período
    period_value: { type: String, required: true }, // Valor del período (YYYY-MM-DD para semanal, YYYY-MM para mensual, YYYY para anual)
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

const investmentSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    type: { type: String, enum: ['stocks', 'bonds', 'crypto', 'funds', 'real_estate', 'other'], required: true },
    current_value: { type: Number, required: true, default: 0 }, // Valor actual de la inversión
    description: { type: String, default: null },
    // Historial de aportes (como una hucha)
    contributions: [{ // Aportes realizados
        date: { type: String, required: true },
        amount: { type: Number, required: true },
        transaction_id: { type: String, default: null } // ID de la transacción asociada (si viene de un gasto)
    }],
    // Aportes periódicos
    periodic_contribution: {
        enabled: { type: Boolean, default: false },
        frequency: { type: String, enum: ['weekly', 'monthly', 'yearly'], default: 'monthly' },
        amount: { type: Number, default: 0 },
        start_date: { type: String, default: null },
        end_date: { type: String, default: null }, // null = indefinido
        completed_contributions: [{ // Aportes realizados por el usuario
            date: { type: String, required: true },
            amount: { type: Number, required: true },
            transaction_id: { type: String, default: null } // ID de la transacción asociada
        }]
    },
    created_at: { type: Date, default: Date.now }
});

const accountSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true }, // Nombre de la cuenta (ej: "Cuenta Nómina BBVA")
    type: { type: String, enum: ['checking', 'savings', 'credit', 'investment', 'other'], required: true }, // Tipo de cuenta
    bank: { type: String, default: null }, // Nombre del banco
    account_number: { type: String, default: null }, // Últimos 4 dígitos o referencia
    balance: { type: Number, required: true, default: 0 }, // Saldo actual
    currency: { type: String, default: 'EUR' }, // Moneda
    description: { type: String, default: null },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Transaction = mongoose.model('Transaction', transactionSchema);
const Envelope = mongoose.model('Envelope', envelopeSchema);
const Loan = mongoose.model('Loan', loanSchema);
const Investment = mongoose.model('Investment', investmentSchema);
const Budget = mongoose.model('Budget', budgetSchema);
const Account = mongoose.model('Account', accountSchema);

const assetSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true }, // Nombre del bien (ej: "Piso en Madrid", "Coche Toyota")
    type: { type: String, enum: ['property', 'vehicle', 'jewelry', 'art', 'electronics', 'other'], required: true },
    purchase_date: { type: String, required: true }, // Fecha de adquisición
    purchase_price: { type: Number, required: true }, // Precio de compra
    current_value: { type: Number, required: true }, // Valor actual
    description: { type: String, default: null },
    location: { type: String, default: null }, // Ubicación (para propiedades)
    value_history: [{ // Historial de valores
        date: { type: String, required: true },
        value: { type: Number, required: true },
        notes: { type: String, default: null }
    }],
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

const Asset = mongoose.model('Asset', assetSchema);

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

        const { email, username, password } = req.body;

        if (!email || !username || !password) {
            return res.status(400).json({ error: 'Email, nombre de usuario y contraseña requeridos' });
        }

        // Validar formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
            return res.status(400).json({ error: 'Email inválido' });
        }

        if (username.trim().length < 3) {
            return res.status(400).json({ error: 'El nombre de usuario debe tener al menos 3 caracteres' });
        }

        if (password.length < 4) {
            return res.status(400).json({ error: 'La contraseña debe tener al menos 4 caracteres' });
        }

        // Verificar si el email ya existe
        const existingUserByEmail = await User.findOne({ email: email.trim().toLowerCase() });
        if (existingUserByEmail) {
            return res.status(400).json({ error: 'El email ya está registrado' });
        }

        // Verificar si el username ya existe
        const existingUserByUsername = await User.findOne({ username: username.trim() });
        if (existingUserByUsername) {
            return res.status(400).json({ error: 'El nombre de usuario ya está en uso' });
        }

        // Hash de la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear usuario
        const user = new User({ 
            email: email.trim().toLowerCase(),
            username: username.trim(),
            password: hashedPassword 
        });
        await user.save();

        // Generar token
        const token = jwt.sign({ userId: user._id.toString(), email: user.email, username: user.username }, JWT_SECRET, { expiresIn: '30d' });

        res.status(201).json({
            message: 'Usuario creado exitosamente',
            token,
            user: { 
                id: user._id.toString(), 
                email: user.email, 
                username: user.username,
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                age: user.age || null,
                phone: user.phone || '',
                address: user.address || '',
                city: user.city || '',
                country: user.country || '',
                birthDate: user.birthDate || null,
                notes: user.notes || ''
            }
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

        const { emailOrUsername, password } = req.body;

        if (!emailOrUsername || !password) {
            return res.status(400).json({ error: 'Email/nombre de usuario y contraseña requeridos' });
        }

        // Intentar buscar por email o username
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isEmail = emailRegex.test(emailOrUsername.trim());
        
        let user;
        if (isEmail) {
            user = await User.findOne({ email: emailOrUsername.trim().toLowerCase() });
        } else {
            user = await User.findOne({ username: emailOrUsername.trim() });
        }
        
        if (!user) {
            return res.status(401).json({ error: 'Email/nombre de usuario o contraseña incorrectos' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Email/nombre de usuario o contraseña incorrectos' });
        }

        const token = jwt.sign({ userId: user._id.toString(), email: user.email, username: user.username }, JWT_SECRET, { expiresIn: '30d' });

        res.json({
            message: 'Login exitoso',
            token,
            user: { id: user._id.toString(), email: user.email, username: user.username }
        });
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ error: error.message || 'Error del servidor' });
    }
});

// Solicitar recuperación de contraseña
app.post('/api/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({ error: 'Email requerido' });
        }
        
        // Validar formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
            return res.status(400).json({ error: 'Email inválido' });
        }
        
        const user = await User.findOne({ email: email.trim().toLowerCase() });
        if (!user) {
            // Por seguridad, no revelamos si el usuario existe
            return res.json({ message: 'Si el email está registrado, se ha enviado un enlace de recuperación' });
        }
        
        // Generar token de recuperación (válido por 1 hora)
        const crypto = require('crypto');
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = new Date();
        resetTokenExpiry.setHours(resetTokenExpiry.getHours() + 1);
        
        user.resetToken = resetToken;
        user.resetTokenExpiry = resetTokenExpiry;
        await user.save();
        
        // En producción, aquí enviarías un email con el token
        // Por ahora, devolvemos el token directamente (solo para desarrollo)
        // TODO: Implementar envío de email real
        res.json({ 
            message: 'Token de recuperación generado. En producción se enviaría por email.',
            token: resetToken, // Solo en desarrollo - eliminar en producción
            expiresAt: resetTokenExpiry
        });
    } catch (error) {
        console.error('Error en forgot-password:', error);
        res.status(500).json({ error: 'Error del servidor' });
    }
});

// Resetear contraseña con token
app.post('/api/reset-password', async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        
        if (!token || !newPassword) {
            return res.status(400).json({ error: 'Token y nueva contraseña requeridos' });
        }
        
        if (newPassword.length < 4) {
            return res.status(400).json({ error: 'La contraseña debe tener al menos 4 caracteres' });
        }
        
        const user = await User.findOne({ 
            resetToken: token,
            resetTokenExpiry: { $gt: new Date() }
        });
        
        if (!user) {
            return res.status(400).json({ error: 'Token inválido o expirado' });
        }
        
        // Actualizar contraseña
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetToken = null;
        user.resetTokenExpiry = null;
        await user.save();
        
        res.json({ message: 'Contraseña actualizada exitosamente' });
    } catch (error) {
        console.error('Error en reset-password:', error);
        res.status(500).json({ error: 'Error del servidor' });
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
        res.json({ 
            user: { 
                id: user._id.toString(), 
                email: user.email,
                username: user.username,
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                age: user.age || null,
                phone: user.phone || '',
                address: user.address || '',
                city: user.city || '',
                country: user.country || '',
                birthDate: user.birthDate || null,
                notes: user.notes || '',
                savingsGoal: user.savingsGoal || null
            } 
        });
    } catch (error) {
        console.error('Error verificando token:', error);
        res.status(500).json({ error: 'Error del servidor' });
    }
});

// Obtener perfil de usuario
app.get('/api/user/profile', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.json({
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            age: user.age || null,
            phone: user.phone || '',
            address: user.address || '',
            city: user.city || '',
            country: user.country || '',
            birthDate: user.birthDate || null,
            notes: user.notes || '',
            savingsGoal: user.savingsGoal || null
        });
    } catch (error) {
        console.error('Error obteniendo perfil:', error);
        res.status(500).json({ error: 'Error al obtener perfil' });
    }
});

// Actualizar perfil de usuario
app.put('/api/user/profile', authenticateToken, async (req, res) => {
    try {
        const { firstName, lastName, age, birthDate, phone, address, city, country, notes, savingsGoal } = req.body;

        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        if (firstName !== undefined) user.firstName = firstName;
        if (lastName !== undefined) user.lastName = lastName;
        if (age !== undefined) user.age = age;
        if (birthDate !== undefined) user.birthDate = birthDate;
        if (phone !== undefined) user.phone = phone;
        if (address !== undefined) user.address = address;
        if (city !== undefined) user.city = city;
        if (country !== undefined) user.country = country;
        if (notes !== undefined) user.notes = notes;
        if (savingsGoal !== undefined) user.savingsGoal = savingsGoal === null || savingsGoal === '' ? null : parseFloat(savingsGoal);
        
        user.updatedAt = new Date();
        await user.save();
        
        res.json({ 
            message: 'Perfil actualizado exitosamente', 
            user: {
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                age: user.age || null,
                phone: user.phone || '',
                address: user.address || '',
                city: user.city || '',
                country: user.country || '',
                birthDate: user.birthDate || null,
                notes: user.notes || '',
                savingsGoal: user.savingsGoal || null
            }
        });
    } catch (error) {
        console.error('Error actualizando perfil:', error);
        res.status(500).json({ error: 'Error al actualizar perfil' });
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
        const { type, date, amount, categoryGeneral, categorySpecific, envelope, account_id, investment_id, description } = req.body;

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
            account_id: account_id || null,
            investment_id: investment_id || null,
            description: description || null
        });

        await transaction.save();
        
        // Si la transacción está asociada a una inversión, agregar al historial de aportes
        if (investment_id && type === 'expense') {
            const investment = await Investment.findOne({ _id: investment_id, user_id: req.user.userId });
            if (investment) {
                // Agregar al historial de aportes general
                if (!investment.contributions) {
                    investment.contributions = [];
                }
                investment.contributions.push({
                    date: date,
                    amount: Math.abs(amount),
                    transaction_id: transaction._id.toString()
                });
                
                // Si tiene aportes periódicos activos, también registrar ahí
                if (investment.periodic_contribution && investment.periodic_contribution.enabled) {
                    // Verificar si este aporte ya fue registrado en este período
                    const contributionDate = new Date(date);
                    
                    // Determinar el período según la frecuencia
                    let periodKey = '';
                    if (investment.periodic_contribution.frequency === 'weekly') {
                        const weekStart = new Date(contributionDate);
                        weekStart.setDate(weekStart.getDate() - weekStart.getDay());
                        periodKey = weekStart.toISOString().split('T')[0];
                    } else if (investment.periodic_contribution.frequency === 'monthly') {
                        periodKey = `${contributionDate.getFullYear()}-${String(contributionDate.getMonth() + 1).padStart(2, '0')}`;
                    } else if (investment.periodic_contribution.frequency === 'yearly') {
                        periodKey = `${contributionDate.getFullYear()}`;
                    }
                    
                    // Verificar si ya existe un aporte para este período
                    const existingContribution = investment.periodic_contribution.completed_contributions?.find(c => {
                        const cDate = new Date(c.date);
                        if (investment.periodic_contribution.frequency === 'weekly') {
                            const cWeekStart = new Date(cDate);
                            cWeekStart.setDate(cWeekStart.getDate() - cWeekStart.getDay());
                            return cWeekStart.toISOString().split('T')[0] === periodKey;
                        } else if (investment.periodic_contribution.frequency === 'monthly') {
                            return `${cDate.getFullYear()}-${String(cDate.getMonth() + 1).padStart(2, '0')}` === periodKey;
                        } else if (investment.periodic_contribution.frequency === 'yearly') {
                            return `${cDate.getFullYear()}` === periodKey;
                        }
                        return false;
                    });
                    
                    // Si no existe, agregar el aporte completado
                    if (!existingContribution) {
                        if (!investment.periodic_contribution.completed_contributions) {
                            investment.periodic_contribution.completed_contributions = [];
                        }
                        investment.periodic_contribution.completed_contributions.push({
                            date: date,
                            amount: Math.abs(amount),
                            transaction_id: transaction._id.toString()
                        });
                    }
                }
                
                // Guardar el aporte (ya agregado arriba al historial general)
                await investment.save();
            }
        }
        
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

// ==================== RUTAS DE PRESUPUESTOS ====================

// Obtener todos los presupuestos del usuario
app.get('/api/budgets', authenticateToken, async (req, res) => {
    try {
        const budgets = await Budget.find({ user_id: req.user.userId })
            .sort({ period_type: 1, period_value: -1, category_id: 1 });
        res.json(budgets);
    } catch (error) {
        console.error('Error obteniendo presupuestos:', error);
        res.status(500).json({ error: 'Error al obtener presupuestos' });
    }
});

// Crear o actualizar presupuesto
app.post('/api/budgets', authenticateToken, async (req, res) => {
    try {
        const { category_id, amount, period_type, period_value } = req.body;

        if (!category_id || amount === undefined || !period_type || !period_value) {
            return res.status(400).json({ error: 'Todos los campos son requeridos' });
        }

        // Buscar presupuesto existente para esta categoría y período
        const existingBudget = await Budget.findOne({ 
            user_id: req.user.userId, 
            category_id, 
            period_type, 
            period_value 
        });

        if (existingBudget) {
            // Actualizar presupuesto existente
            existingBudget.amount = amount;
            await existingBudget.save();
            return res.status(200).json(existingBudget);
        } else {
            // Crear nuevo presupuesto
            const budget = new Budget({
                user_id: req.user.userId,
                category_id,
                amount,
                period_type,
                period_value
            });
            await budget.save();
            return res.status(201).json(budget);
        }
    } catch (error) {
        console.error('Error creando/actualizando presupuesto:', error);
        res.status(500).json({ error: 'Error al guardar presupuesto' });
    }
});

// Actualizar presupuesto
app.put('/api/budgets/:id', authenticateToken, async (req, res) => {
    try {
        const { amount } = req.body;

        if (amount === undefined) {
            return res.status(400).json({ error: 'Monto requerido' });
        }

        const budget = await Budget.findOneAndUpdate(
            { _id: req.params.id, user_id: req.user.userId },
            { amount },
            { new: true }
        );

        if (!budget) {
            return res.status(404).json({ error: 'Presupuesto no encontrado' });
        }

        res.json(budget);
    } catch (error) {
        console.error('Error actualizando presupuesto:', error);
        res.status(500).json({ error: 'Error al actualizar presupuesto' });
    }
});

// Eliminar presupuesto
app.delete('/api/budgets/:id', authenticateToken, async (req, res) => {
    try {
        const budget = await Budget.findOneAndDelete({
            _id: req.params.id,
            user_id: req.user.userId
        });

        if (!budget) {
            return res.status(404).json({ error: 'Presupuesto no encontrado' });
        }

        res.json({ message: 'Presupuesto eliminado exitosamente' });
    } catch (error) {
        console.error('Error eliminando presupuesto:', error);
        res.status(500).json({ error: 'Error al eliminar presupuesto' });
    }
});

// ==================== RUTAS DE CUENTAS BANCARIAS ====================

// Obtener todas las cuentas del usuario
app.get('/api/accounts', authenticateToken, async (req, res) => {
    try {
        const accounts = await Account.find({ user_id: req.user.userId })
            .sort({ created_at: -1 });
        res.json(accounts);
    } catch (error) {
        console.error('Error obteniendo cuentas:', error);
        res.status(500).json({ error: 'Error al obtener cuentas' });
    }
});

// Crear cuenta
app.post('/api/accounts', authenticateToken, async (req, res) => {
    try {
        const { name, type, bank, account_number, balance, currency, description } = req.body;
        
        if (!name || !type) {
            return res.status(400).json({ error: 'Nombre y tipo de cuenta son requeridos' });
        }
        
        const account = new Account({
            user_id: req.user.userId,
            name,
            type,
            bank: bank || null,
            account_number: account_number || null,
            balance: balance || 0,
            currency: currency || 'EUR',
            description: description || null
        });
        
        await account.save();
        res.status(201).json(account);
    } catch (error) {
        console.error('Error creando cuenta:', error);
        res.status(500).json({ error: 'Error al crear cuenta' });
    }
});

// Actualizar cuenta
app.put('/api/accounts/:id', authenticateToken, async (req, res) => {
    try {
        const { name, type, bank, account_number, balance, currency, description } = req.body;
        
        const account = await Account.findOneAndUpdate(
            { _id: req.params.id, user_id: req.user.userId },
            { 
                name, 
                type, 
                bank, 
                account_number, 
                balance, 
                currency, 
                description,
                updated_at: new Date()
            },
            { new: true }
        );
        
        if (!account) {
            return res.status(404).json({ error: 'Cuenta no encontrada' });
        }
        
        res.json(account);
    } catch (error) {
        console.error('Error actualizando cuenta:', error);
        res.status(500).json({ error: 'Error al actualizar cuenta' });
    }
});

// Eliminar cuenta
app.delete('/api/accounts/:id', authenticateToken, async (req, res) => {
    try {
        const account = await Account.findOneAndDelete({
            _id: req.params.id,
            user_id: req.user.userId
        });
        
        if (!account) {
            return res.status(404).json({ error: 'Cuenta no encontrada' });
        }
        
        res.json({ message: 'Cuenta eliminada exitosamente' });
    } catch (error) {
        console.error('Error eliminando cuenta:', error);
        res.status(500).json({ error: 'Error al eliminar cuenta' });
    }
});

// ==================== RUTAS DE CUENTAS BANCARIAS ====================

// Obtener todas las cuentas del usuario
app.get('/api/accounts', authenticateToken, async (req, res) => {
    try {
        const accounts = await Account.find({ user_id: req.user.userId })
            .sort({ created_at: -1 });
        res.json(accounts);
    } catch (error) {
        console.error('Error obteniendo cuentas:', error);
        res.status(500).json({ error: 'Error al obtener cuentas' });
    }
});

// Crear cuenta
app.post('/api/accounts', authenticateToken, async (req, res) => {
    try {
        const { name, type, bank, account_number, balance, currency, description } = req.body;
        
        if (!name || !type) {
            return res.status(400).json({ error: 'Nombre y tipo de cuenta son requeridos' });
        }
        
        const account = new Account({
            user_id: req.user.userId,
            name,
            type,
            bank: bank || null,
            account_number: account_number || null,
            balance: balance || 0,
            currency: currency || 'EUR',
            description: description || null
        });
        
        await account.save();
        res.status(201).json(account);
    } catch (error) {
        console.error('Error creando cuenta:', error);
        res.status(500).json({ error: 'Error al crear cuenta' });
    }
});

// Actualizar cuenta
app.put('/api/accounts/:id', authenticateToken, async (req, res) => {
    try {
        const { name, type, bank, account_number, balance, currency, description } = req.body;
        
        const account = await Account.findOneAndUpdate(
            { _id: req.params.id, user_id: req.user.userId },
            { 
                name, 
                type, 
                bank, 
                account_number, 
                balance, 
                currency, 
                description,
                updated_at: new Date()
            },
            { new: true }
        );
        
        if (!account) {
            return res.status(404).json({ error: 'Cuenta no encontrada' });
        }
        
        res.json(account);
    } catch (error) {
        console.error('Error actualizando cuenta:', error);
        res.status(500).json({ error: 'Error al actualizar cuenta' });
    }
});

// Eliminar cuenta
app.delete('/api/accounts/:id', authenticateToken, async (req, res) => {
    try {
        const account = await Account.findOneAndDelete({
            _id: req.params.id,
            user_id: req.user.userId
        });
        
        if (!account) {
            return res.status(404).json({ error: 'Cuenta no encontrada' });
        }
        
        res.json({ message: 'Cuenta eliminada exitosamente' });
    } catch (error) {
        console.error('Error eliminando cuenta:', error);
        res.status(500).json({ error: 'Error al eliminar cuenta' });
    }
});

// ==================== RUTAS DE INVERSIONES ====================

// Obtener todas las inversiones del usuario
app.get('/api/investments', authenticateToken, async (req, res) => {
    try {
        const investments = await Investment.find({ user_id: req.user.userId })
            .sort({ created_at: -1 });
        res.json(investments);
    } catch (error) {
        console.error('Error obteniendo inversiones:', error);
        res.status(500).json({ error: 'Error al obtener inversiones' });
    }
});

// Crear inversión
app.post('/api/investments', authenticateToken, async (req, res) => {
    try {
        const { name, type, current_value, description, periodic_contribution } = req.body;

        if (!name || current_value === undefined || !type) {
            return res.status(400).json({ error: 'Todos los campos requeridos deben estar presentes' });
        }

        const investment = new Investment({
            user_id: req.user.userId,
            name,
            type,
            current_value: current_value || 0,
            description: description || null,
            contributions: [], // Inicialmente vacío
            periodic_contribution: periodic_contribution || {
                enabled: false,
                frequency: 'monthly',
                amount: 0,
                start_date: null,
                end_date: null,
                completed_contributions: []
            }
        });

        await investment.save();
        res.status(201).json(investment);
    } catch (error) {
        console.error('Error creando inversión:', error);
        res.status(500).json({ error: 'Error al crear inversión' });
    }
});

// Añadir aporte a una inversión
app.post('/api/investments/:id/contribution', authenticateToken, async (req, res) => {
    try {
        const { amount, date } = req.body;
        
        if (!amount || amount <= 0 || !date) {
            return res.status(400).json({ error: 'Monto y fecha son requeridos' });
        }
        
        const investment = await Investment.findOne({ _id: req.params.id, user_id: req.user.userId });
        if (!investment) {
            return res.status(404).json({ error: 'Inversión no encontrada' });
        }
        
        // Agregar el aporte al historial
        if (!investment.contributions) {
            investment.contributions = [];
        }
        
        investment.contributions.push({
            date: date,
            amount: parseFloat(amount),
            transaction_id: null
        });
        
        await investment.save();
        res.json(investment);
    } catch (error) {
        console.error('Error añadiendo aporte:', error);
        res.status(500).json({ error: 'Error al añadir aporte' });
    }
});

// Actualizar inversión
app.put('/api/investments/:id', authenticateToken, async (req, res) => {
    try {
        const investment = await Investment.findOneAndUpdate(
            { _id: req.params.id, user_id: req.user.userId },
            req.body,
            { new: true }
        );

        if (!investment) {
            return res.status(404).json({ error: 'Inversión no encontrada' });
        }

        res.json(investment);
    } catch (error) {
        console.error('Error actualizando inversión:', error);
        res.status(500).json({ error: 'Error al actualizar inversión' });
    }
});

// Eliminar inversión
app.delete('/api/investments/:id', authenticateToken, async (req, res) => {
    try {
        const investment = await Investment.findOneAndDelete({
            _id: req.params.id,
            user_id: req.user.userId
        });

        if (!investment) {
            return res.status(404).json({ error: 'Inversión no encontrada' });
        }

        res.json({ message: 'Inversión eliminada exitosamente' });
    } catch (error) {
        console.error('Error eliminando inversión:', error);
        res.status(500).json({ error: 'Error al eliminar inversión' });
    }
});

// ==================== RUTAS DE PATRIMONIO ====================

// Obtener todos los bienes del usuario
app.get('/api/assets', authenticateToken, async (req, res) => {
    try {
        const assets = await Asset.find({ user_id: req.user.userId })
            .sort({ created_at: -1 });
        res.json(assets);
    } catch (error) {
        console.error('Error obteniendo bienes:', error);
        res.status(500).json({ error: 'Error al obtener bienes' });
    }
});

// Crear bien
app.post('/api/assets', authenticateToken, async (req, res) => {
    try {
        const { name, type, purchase_date, purchase_price, current_value, description, location } = req.body;
        
        if (!name || !type || !purchase_date || !purchase_price || current_value === undefined) {
            return res.status(400).json({ error: 'Todos los campos requeridos deben estar completos' });
        }
        
        const asset = new Asset({
            user_id: req.user.userId,
            name,
            type,
            purchase_date,
            purchase_price,
            current_value,
            description: description || null,
            location: location || null,
            value_history: [{
                date: purchase_date,
                value: purchase_price,
                notes: 'Valor inicial de compra'
            }, {
                date: new Date().toISOString().split('T')[0],
                value: current_value,
                notes: 'Valor actual'
            }]
        });
        
        await asset.save();
        res.status(201).json(asset);
    } catch (error) {
        console.error('Error creando bien:', error);
        res.status(500).json({ error: 'Error al crear bien' });
    }
});

// Actualizar bien (incluyendo valor actual)
app.put('/api/assets/:id', authenticateToken, async (req, res) => {
    try {
        const { name, type, purchase_date, purchase_price, current_value, description, location, update_value_history } = req.body;
        
        const asset = await Asset.findOne({ _id: req.params.id, user_id: req.user.userId });
        if (!asset) {
            return res.status(404).json({ error: 'Bien no encontrado' });
        }
        
        // Si se actualiza el valor actual, agregar al historial
        if (update_value_history && current_value !== undefined && current_value !== asset.current_value) {
            asset.value_history.push({
                date: new Date().toISOString().split('T')[0],
                value: current_value,
                notes: 'Actualización de valor'
            });
        }
        
        asset.name = name || asset.name;
        asset.type = type || asset.type;
        asset.purchase_date = purchase_date || asset.purchase_date;
        asset.purchase_price = purchase_price !== undefined ? purchase_price : asset.purchase_price;
        asset.current_value = current_value !== undefined ? current_value : asset.current_value;
        asset.description = description !== undefined ? description : asset.description;
        asset.location = location !== undefined ? location : asset.location;
        asset.updated_at = new Date();
        
        await asset.save();
        res.json(asset);
    } catch (error) {
        console.error('Error actualizando bien:', error);
        res.status(500).json({ error: 'Error al actualizar bien' });
    }
});

// Eliminar bien
app.delete('/api/assets/:id', authenticateToken, async (req, res) => {
    try {
        const asset = await Asset.findOneAndDelete({
            _id: req.params.id,
            user_id: req.user.userId
        });
        
        if (!asset) {
            return res.status(404).json({ error: 'Bien no encontrado' });
        }
        
        res.json({ message: 'Bien eliminado exitosamente' });
    } catch (error) {
        console.error('Error eliminando bien:', error);
        res.status(500).json({ error: 'Error al eliminar bien' });
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
