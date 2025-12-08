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
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/veedor';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

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

const User = mongoose.model('User', userSchema);
const Transaction = mongoose.model('Transaction', transactionSchema);
const Envelope = mongoose.model('Envelope', envelopeSchema);

// Conectar a MongoDB
mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('✅ Conectado a MongoDB');
    })
    .catch((err) => {
        console.error('❌ Error conectando a MongoDB:', err.message);
        console.log('💡 Asegúrate de configurar MONGODB_URI en las variables de entorno');
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

// ==================== RUTAS DE AUTENTICACIÓN ====================

// Registro
app.post('/api/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Usuario y contraseña requeridos' });
        }

        if (password.length < 4) {
            return res.status(400).json({ error: 'La contraseña debe tener al menos 4 caracteres' });
        }

        // Verificar si el usuario ya existe
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: 'El usuario ya existe' });
        }

        // Hash de la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear usuario
        const user = new User({ username, password: hashedPassword });
        await user.save();

        // Generar token
        const token = jwt.sign({ userId: user._id, username }, JWT_SECRET, { expiresIn: '30d' });

        res.status(201).json({
            message: 'Usuario creado exitosamente',
            token,
            user: { id: user._id, username: user.username }
        });
    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({ error: 'Error del servidor' });
    }
});

// Login
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Usuario y contraseña requeridos' });
        }

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
        }

        const token = jwt.sign({ userId: user._id, username: user.username }, JWT_SECRET, { expiresIn: '30d' });

        res.json({
            message: 'Login exitoso',
            token,
            user: { id: user._id, username: user.username }
        });
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ error: 'Error del servidor' });
    }
});

// Verificar token
app.get('/api/verify', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.json({ user: { id: user._id, username: user.username } });
    } catch (error) {
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
