const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'tu_secreto_super_seguro_cambiar_en_produccion';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Inicializar base de datos
const db = new sqlite3.Database('./veedor.db', (err) => {
    if (err) {
        console.error('Error abriendo base de datos:', err.message);
    } else {
        console.log('Conectado a la base de datos SQLite');
        initializeDatabase();
    }
});

// Inicializar tablas
function initializeDatabase() {
    // Tabla de usuarios
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Tabla de transacciones
    db.run(`CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        type TEXT NOT NULL,
        date TEXT NOT NULL,
        amount REAL NOT NULL,
        category_general TEXT NOT NULL,
        category_specific TEXT NOT NULL,
        envelope TEXT,
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
    )`);

    // Tabla de sobres
    db.run(`CREATE TABLE IF NOT EXISTS envelopes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        budget REAL NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
    )`);
}

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
        db.get('SELECT id FROM users WHERE username = ?', [username], async (err, row) => {
            if (err) {
                return res.status(500).json({ error: 'Error en la base de datos' });
            }

            if (row) {
                return res.status(400).json({ error: 'El usuario ya existe' });
            }

            // Hash de la contraseña
            const hashedPassword = await bcrypt.hash(password, 10);

            // Crear usuario
            db.run('INSERT INTO users (username, password) VALUES (?, ?)', 
                [username, hashedPassword], 
                function(err) {
                    if (err) {
                        return res.status(500).json({ error: 'Error al crear usuario' });
                    }

                    // Generar token
                    const token = jwt.sign({ userId: this.lastID, username }, JWT_SECRET, { expiresIn: '30d' });

                    res.status(201).json({
                        message: 'Usuario creado exitosamente',
                        token,
                        user: { id: this.lastID, username }
                    });
                }
            );
        });
    } catch (error) {
        res.status(500).json({ error: 'Error del servidor' });
    }
});

// Login
app.post('/api/login', (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Usuario y contraseña requeridos' });
        }

        db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
            if (err) {
                return res.status(500).json({ error: 'Error en la base de datos' });
            }

            if (!user) {
                return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
            }

            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) {
                return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
            }

            const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, { expiresIn: '30d' });

            res.json({
                message: 'Login exitoso',
                token,
                user: { id: user.id, username: user.username }
            });
        });
    } catch (error) {
        res.status(500).json({ error: 'Error del servidor' });
    }
});

// Verificar token
app.get('/api/verify', authenticateToken, (req, res) => {
    res.json({ user: req.user });
});

// ==================== RUTAS DE TRANSACCIONES ====================

// Obtener todas las transacciones del usuario
app.get('/api/transactions', authenticateToken, (req, res) => {
    db.all('SELECT * FROM transactions WHERE user_id = ? ORDER BY date DESC, created_at DESC', 
        [req.user.userId], 
        (err, rows) => {
            if (err) {
                return res.status(500).json({ error: 'Error al obtener transacciones' });
            }
            res.json(rows);
        }
    );
});

// Crear transacción
app.post('/api/transactions', authenticateToken, (req, res) => {
    const { type, date, amount, categoryGeneral, categorySpecific, envelope, description } = req.body;

    if (!type || !date || amount === undefined || !categoryGeneral || !categorySpecific) {
        return res.status(400).json({ error: 'Datos incompletos' });
    }

    const finalAmount = type === 'expense' ? -Math.abs(amount) : Math.abs(amount);

    db.run(
        'INSERT INTO transactions (user_id, type, date, amount, category_general, category_specific, envelope, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [req.user.userId, type, date, finalAmount, categoryGeneral, categorySpecific, envelope || null, description || null],
        function(err) {
            if (err) {
                return res.status(500).json({ error: 'Error al crear transacción' });
            }

            // Devolver la transacción creada
            db.get('SELECT * FROM transactions WHERE id = ?', [this.lastID], (err, row) => {
                if (err) {
                    return res.status(500).json({ error: 'Error al obtener transacción' });
                }
                res.status(201).json(row);
            });
        }
    );
});

// Eliminar transacción
app.delete('/api/transactions/:id', authenticateToken, (req, res) => {
    const transactionId = req.params.id;

    db.run('DELETE FROM transactions WHERE id = ? AND user_id = ?', 
        [transactionId, req.user.userId], 
        function(err) {
            if (err) {
                return res.status(500).json({ error: 'Error al eliminar transacción' });
            }

            if (this.changes === 0) {
                return res.status(404).json({ error: 'Transacción no encontrada' });
            }

            res.json({ message: 'Transacción eliminada exitosamente' });
        }
    );
});

// ==================== RUTAS DE SOBRES ====================

// Obtener todos los sobres del usuario
app.get('/api/envelopes', authenticateToken, (req, res) => {
    db.all('SELECT * FROM envelopes WHERE user_id = ? ORDER BY created_at DESC', 
        [req.user.userId], 
        (err, rows) => {
            if (err) {
                return res.status(500).json({ error: 'Error al obtener sobres' });
            }
            res.json(rows);
        }
    );
});

// Crear sobre
app.post('/api/envelopes', authenticateToken, (req, res) => {
    const { name, budget } = req.body;

    if (!name || budget === undefined) {
        return res.status(400).json({ error: 'Nombre y presupuesto requeridos' });
    }

    db.run(
        'INSERT INTO envelopes (user_id, name, budget) VALUES (?, ?, ?)',
        [req.user.userId, name, budget],
        function(err) {
            if (err) {
                return res.status(500).json({ error: 'Error al crear sobre' });
            }

            db.get('SELECT * FROM envelopes WHERE id = ?', [this.lastID], (err, row) => {
                if (err) {
                    return res.status(500).json({ error: 'Error al obtener sobre' });
                }
                res.status(201).json(row);
            });
        }
    );
});

// Eliminar sobre
app.delete('/api/envelopes/:id', authenticateToken, (req, res) => {
    const envelopeId = req.params.id;

    db.run('DELETE FROM envelopes WHERE id = ? AND user_id = ?', 
        [envelopeId, req.user.userId], 
        function(err) {
            if (err) {
                return res.status(500).json({ error: 'Error al eliminar sobre' });
            }

            if (this.changes === 0) {
                return res.status(404).json({ error: 'Sobre no encontrado' });
            }

            res.json({ message: 'Sobre eliminado exitosamente' });
        }
    );
});

// ==================== RUTA PARA SERVIR EL FRONTEND ====================
// Esta ruta debe ir al final, después de todas las rutas de API
app.get('*', (req, res) => {
    // Solo servir index.html si no es una ruta de API
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
    console.log(`📊 Base de datos: veedor.db`);
    console.log(`\n💡 Para acceder desde otros dispositivos, usa: http://${localIP}:${PORT}`);
});

// Cerrar base de datos al terminar
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Base de datos cerrada.');
        process.exit(0);
    });
});

