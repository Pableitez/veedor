const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const nodemailer = require('nodemailer');
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
    baseFund: { type: Number, default: null }, // Fondo base del usuario
    resetToken: { type: String, default: null },
    resetTokenExpiry: { type: Date, default: null },
    emailVerified: { type: Boolean, default: false },
    emailVerificationToken: { type: String, default: null },
    emailVerificationExpiry: { type: Date, default: null },
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
    loan_id: { type: String, default: null }, // ID del préstamo asociado (si es una cuota)
    property_id: { type: String, default: null }, // ID de la propiedad/piso asociada
    description: { type: String, default: null },
    is_recurring: { type: Boolean, default: false }, // Si es una transacción recurrente
    recurring_frequency: { type: String, enum: ['weekly', 'monthly', 'yearly'], default: null }, // Frecuencia de recurrencia
    recurring_day: { type: Number, default: null }, // Día del mes/semana para transacciones recurrentes
    created_at: { type: Date, default: Date.now }
});

const envelopeSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    budget: { type: Number, required: true },
    patrimonio_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Patrimonio', default: null }, // ID del patrimonio asociado (opcional)
    created_at: { type: Date, default: Date.now }
});

const budgetSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    category_id: { type: String, default: null }, // ID de la categoría (opcional si hay patrimonio_id)
    patrimonio_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Patrimonio', default: null }, // ID del patrimonio asociado (opcional)
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
    patrimonio_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Patrimonio', default: null }, // ID de la propiedad del patrimonio asociada
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
        account_id: { type: String, default: null }, // ID de la cuenta para aportes periódicos
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

const propertySchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true }, // Nombre de la propiedad (ej: "Piso Calle Mayor 5", "Casa en la playa")
    address: { type: String, default: null }, // Dirección completa
    type: { type: String, enum: ['apartment', 'house', 'office', 'commercial', 'other'], default: 'apartment' }, // Tipo de propiedad
    description: { type: String, default: null },
    current_value: { type: Number, default: 0 }, // Valor actual de la propiedad
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

// ==================== MÓDULO PATRIMONIO ====================
// Nuevo esquema unificado de Patrimonio que reemplaza Property y Asset
const patrimonioSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true }, // Nombre de la propiedad (ej: "Piso Calle Mayor 5", "Casa en la playa", "Coche Toyota")
    type: { 
        type: String, 
        enum: ['apartment', 'house', 'office', 'commercial', 'vehicle', 'jewelry', 'art', 'electronics', 'other'], 
        required: true 
    }, // Tipo de propiedad
    address: { type: String, default: null }, // Dirección completa (para propiedades inmobiliarias)
    location: { type: String, default: null }, // Ubicación general (para otros tipos)
    purchase_date: { type: String, default: null }, // Fecha de adquisición
    purchase_price: { type: Number, default: 0 }, // Precio de compra
    current_value: { type: Number, required: true, default: 0 }, // Valor actual
    description: { type: String, default: null },
    // Historial de valores para seguimiento de evolución
    value_history: [{ 
        date: { type: String, required: true },
        value: { type: Number, required: true },
        notes: { type: String, default: null }
    }],
    // Préstamos asociados a esta propiedad
    associated_loans: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Loan' 
    }],
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

const Patrimonio = mongoose.model('Patrimonio', patrimonioSchema);

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

// Conectar al iniciar (no bloquear el inicio del servidor)
connectToMongoDB().catch(err => {
    console.error('Error inicial al conectar a MongoDB:', err);
    console.log('⚠️ El servidor continuará, pero algunas funciones pueden no funcionar hasta que MongoDB esté disponible');
});

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

// ==================== CONFIGURACIÓN DE EMAIL ====================

// Configurar transporter de nodemailer
let emailTransporter = null;

function setupEmailTransporter() {
    console.log('🔧 ===== CONFIGURANDO EMAIL TRANSPORTER =====');
    console.log('🔧 Verificando variables de entorno...');
    console.log('🔧 EMAIL_HOST:', process.env.EMAIL_HOST ? '✅ Configurado' : '❌ No configurado');
    console.log('🔧 EMAIL_USER:', process.env.EMAIL_USER ? '✅ Configurado' : '❌ No configurado');
    console.log('🔧 EMAIL_PASS:', process.env.EMAIL_PASS ? '✅ Configurado (oculto)' : '❌ No configurado');
    console.log('🔧 EMAIL_PORT:', process.env.EMAIL_PORT || 'No configurado (usará 587 por defecto)');
    console.log('🔧 EMAIL_SECURE:', process.env.EMAIL_SECURE || 'No configurado');
    console.log('🔧 APP_URL:', process.env.APP_URL || 'No configurado');
    
    // Validar que no sean placeholders
    const isPlaceholder = (value) => {
        if (!value) return false;
        const lower = value.toLowerCase();
        return lower.includes('tuemail') || 
               lower.includes('tupassword') || 
               lower.includes('tu_password') ||
               lower.includes('example') ||
               lower.includes('placeholder');
    };
    
    // Si hay credenciales de email configuradas, crear transporter
    if (process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        // Validar placeholders
        if (isPlaceholder(process.env.EMAIL_USER) || isPlaceholder(process.env.EMAIL_PASS)) {
            console.error('❌ ERROR: Los valores de EMAIL_USER o EMAIL_PASS parecen ser placeholders');
            console.error('❌ Por favor, configura valores reales en Render');
            console.error('💡 Para Gmail, necesitas usar una "Contraseña de aplicación" (App Password)');
            console.error('💡 Ve a: https://myaccount.google.com/apppasswords');
            emailTransporter = null;
            return;
        }
        
        // Render puede bloquear el puerto 465, intentar 587 primero
        let emailPort = parseInt(process.env.EMAIL_PORT || '587');
        let emailSecure = process.env.EMAIL_SECURE === 'true' || process.env.EMAIL_SECURE === '1' || emailPort === 465;
        const isGmail = process.env.EMAIL_HOST.includes('gmail.com');
        
        // Si está configurado para puerto 465 pero estamos en Render, sugerir 587
        if (emailPort === 465 && process.env.RENDER) {
            console.warn('⚠️ ADVERTENCIA: Puerto 465 puede estar bloqueado en Render');
            console.warn('⚠️ Si tienes problemas de conexión, intenta cambiar a puerto 587');
            console.warn('⚠️ Configura EMAIL_PORT=587 y EMAIL_SECURE=false');
        }
        
        try {
            // Configuración optimizada para Gmail
            const transporterConfig = {
            host: process.env.EMAIL_HOST,
            port: emailPort,
                secure: emailSecure,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            },
            tls: {
                    rejectUnauthorized: false
                },
                // Timeouts aumentados para evitar ETIMEDOUT
                connectionTimeout: 30000, // 30 segundos
                greetingTimeout: 30000,
                socketTimeout: 30000,
                // Configuración adicional para Gmail
                pool: true,
                maxConnections: 1,
                maxMessages: 3
            };
            
            // Configuración específica para Gmail con SSL (puerto 465)
            if (isGmail && emailSecure) {
                transporterConfig.requireTLS = false;
                // Para puerto 465 (SSL), no necesitamos TLS
                delete transporterConfig.tls;
            } else if (isGmail && !emailSecure) {
                // Para puerto 587 (TLS)
                transporterConfig.requireTLS = true;
                transporterConfig.tls = {
                    rejectUnauthorized: false
                };
            }
            
            emailTransporter = nodemailer.createTransport(transporterConfig);
            
            // Verificar la conexión de forma asíncrona (no bloquea el inicio)
            // Usar un timeout más largo para la verificación inicial
            const verifyTimeout = setTimeout(() => {
                console.warn('⚠️ La verificación de conexión de email está tomando más tiempo del esperado...');
                console.warn('⚠️ Esto puede ser normal en el primer inicio. El email funcionará cuando se necesite.');
            }, 10000);
            
            emailTransporter.verify(function(error, success) {
                clearTimeout(verifyTimeout);
                
                if (error) {
                    console.error('❌ ===== ERROR VERIFICANDO CONEXIÓN DE EMAIL =====');
                    console.error('❌ Error:', error.message);
                    console.error('❌ Código:', error.code);
                    
                    // Mensajes de ayuda específicos para errores comunes
                    if (error.code === 'EAUTH') {
                        console.error('💡 ERROR DE AUTENTICACIÓN:');
                        console.error('💡 - Verifica que EMAIL_USER sea tu email completo');
                        console.error('💡 - Verifica que EMAIL_PASS sea una "Contraseña de aplicación" (App Password) de 16 caracteres');
                        console.error('💡 - Si tienes 2FA activado en Gmail, DEBES usar una App Password');
                        console.error('💡 - Genera una aquí: https://myaccount.google.com/apppasswords');
                        console.error('💡 - La App Password debe tener exactamente 16 caracteres (sin espacios)');
                    } else if (error.code === 'ECONNECTION' || error.code === 'ETIMEDOUT') {
                        console.error('💡 ERROR DE CONEXIÓN (esto puede ser temporal):');
                        console.error('💡 - El timeout puede ocurrir durante la verificación inicial');
                        console.error('💡 - El email debería funcionar cuando se intente enviar');
                        console.error('💡 - Verifica que EMAIL_HOST sea: smtp.gmail.com');
                        console.error('💡 - Verifica que EMAIL_PORT sea: 465 (con EMAIL_SECURE=true)');
                        console.error('💡 - Verifica que no haya restricciones de firewall en Render');
                        console.error('💡 - Si el problema persiste, intenta usar puerto 587 con EMAIL_SECURE=false');
                    } else {
                        console.error('💡 Revisa los logs anteriores para más detalles');
                    }
                    console.warn('⚠️ NOTA: El servidor continuará. El email se intentará enviar cuando sea necesario.');
                } else {
                    console.log('✅ Conexión de email verificada correctamente');
                    console.log('✅ El servidor de email está listo para enviar correos');
                }
            });
            
            console.log('✅ Transporter de email configurado exitosamente');
        console.log('📧 Email configurado para:', process.env.EMAIL_USER);
        console.log('📧 Host:', process.env.EMAIL_HOST);
        console.log('📧 Puerto:', emailPort);
        console.log('📧 Secure (SSL):', emailSecure);
            console.log('📧 Es Gmail:', isGmail);
        console.log('📧 APP_URL:', process.env.APP_URL || 'No configurado');
            
            if (isGmail) {
                console.log('💡 NOTA: Si tienes problemas, asegúrate de usar una "Contraseña de aplicación"');
                console.log('💡 Genera una aquí: https://myaccount.google.com/apppasswords');
            }
        } catch (error) {
            console.error('❌ Error creando transporter de email:', error);
            emailTransporter = null;
        }
    } else {
        console.log('⚠️ Email no configurado. Los emails de verificación no se enviarán.');
        console.log('💡 Configura EMAIL_HOST, EMAIL_USER, EMAIL_PASS en las variables de entorno para habilitar emails');
        console.log('💡 Variables actuales:', {
            EMAIL_HOST: process.env.EMAIL_HOST ? 'Configurado' : 'No configurado',
            EMAIL_USER: process.env.EMAIL_USER ? 'Configurado' : 'No configurado',
            EMAIL_PASS: process.env.EMAIL_PASS ? 'Configurado' : 'No configurado'
        });
    }
    console.log('🔧 ===== FIN CONFIGURACIÓN EMAIL =====');
}

// Función para enviar email de verificación
async function sendVerificationEmail(email, verificationToken) {
    if (!emailTransporter) {
        console.log('⚠️ Email transporter no configurado.');
        console.log('📧 Token de verificación generado:', verificationToken);
        console.log('💡 Para habilitar emails, configura en Render:');
        console.log('   - EMAIL_HOST (ej: smtp.gmail.com)');
        console.log('   - EMAIL_USER (tu email)');
        console.log('   - EMAIL_PASS (tu contraseña de aplicación)');
        console.log('   - EMAIL_PORT (587 para TLS, 465 para SSL)');
        console.log('   - EMAIL_SECURE (true para SSL, false para TLS)');
        console.log('   - APP_URL (URL de tu aplicación en Render)');
        return false;
    }

    const verificationUrl = `${process.env.APP_URL || 'http://localhost:3000'}/verify-email?token=${verificationToken}`;
    
    const mailOptions = {
        from: `"Veedor" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Verifica tu email - Veedor',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #6366F1;">¡Bienvenido a Veedor!</h2>
                <p>Gracias por registrarte. Por favor, verifica tu dirección de email haciendo clic en el siguiente enlace:</p>
                <p style="text-align: center; margin: 30px 0;">
                    <a href="${verificationUrl}" style="background: #6366F1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Verificar Email</a>
                </p>
                <p>O copia y pega este enlace en tu navegador:</p>
                <p style="word-break: break-all; color: #666; font-size: 12px;">${verificationUrl}</p>
                <p style="color: #999; font-size: 12px; margin-top: 30px;">Este enlace expirará en 24 horas.</p>
            </div>
        `
    };

    try {
        console.log('📧 Intentando enviar email a:', email);
        console.log('📧 Desde:', process.env.EMAIL_USER);
        console.log('📧 Host:', process.env.EMAIL_HOST);
        console.log('📧 Puerto:', process.env.EMAIL_PORT || '587');
        
        const info = await emailTransporter.sendMail(mailOptions);
        console.log('✅ Email de verificación enviado exitosamente a', email);
        console.log('📧 Message ID:', info.messageId);
        return true;
    } catch (error) {
        console.error('❌ Error enviando email:', error);
        console.error('❌ Detalles del error:', {
            code: error.code,
            command: error.command,
            response: error.response,
            responseCode: error.responseCode
        });
        return false;
    }
}

// Función para enviar email de recuperación de contraseña
async function sendPasswordResetEmail(email, resetToken) {
    if (!emailTransporter) {
        console.log('⚠️ Email transporter no configurado.');
        console.log('📧 Token de recuperación generado:', resetToken);
        console.log('💡 Para habilitar emails, configura en Render:');
        console.log('   - EMAIL_HOST (ej: smtp.gmail.com)');
        console.log('   - EMAIL_USER (tu email)');
        console.log('   - EMAIL_PASS (tu contraseña de aplicación)');
        console.log('   - EMAIL_PORT (587 para TLS, 465 para SSL)');
        console.log('   - EMAIL_SECURE (true para SSL, false para TLS)');
        console.log('   - APP_URL (URL de tu aplicación en Render)');
        return false;
    }

    const resetUrl = `${process.env.APP_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
    
    const mailOptions = {
        from: `"Veedor" <${process.env.EMAIL_USER}>`,
        to: email, // El email se envía al usuario que lo solicita, no a EMAIL_USER
        subject: 'Recuperar Contraseña - Veedor',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #ffffff;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #6366F1; margin: 0; font-size: 28px;">Veedor</h1>
                    <p style="color: #6B7280; margin: 5px 0 0 0; font-size: 14px;">Control total de tus finanzas personales</p>
                </div>
                
                <div style="background: #F9FAFB; border-radius: 12px; padding: 30px; margin-bottom: 20px;">
                    <h2 style="color: #111827; margin-top: 0; font-size: 22px;">Recuperar Contraseña</h2>
                    <p style="color: #374151; font-size: 16px; line-height: 1.6;">Hola,</p>
                    <p style="color: #374151; font-size: 16px; line-height: 1.6;">Has solicitado restablecer tu contraseña en Veedor. Usa el siguiente código para crear una nueva contraseña:</p>
                    
                    <div style="background: #FFFFFF; border: 2px solid #6366F1; border-radius: 8px; padding: 24px; text-align: center; margin: 30px 0;">
                        <p style="font-size: 20px; font-weight: bold; color: #6366F1; letter-spacing: 2px; margin: 0; font-family: 'Courier New', monospace; word-break: break-all;">${resetToken}</p>
                    </div>
                    
                    <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">Para restablecer tu contraseña:</p>
                    <ol style="color: #374151; font-size: 16px; line-height: 1.8; padding-left: 20px;">
                        <li>Ve a la página de recuperación de contraseña</li>
                        <li>Ingresa el código de arriba</li>
                        <li>Crea tu nueva contraseña</li>
                    </ol>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${resetUrl}" style="background: #6366F1; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600; font-size: 16px;">Restablecer Contraseña</a>
                    </div>
                    
                    <p style="color: #6B7280; font-size: 14px; line-height: 1.6; margin-top: 30px; padding-top: 20px; border-top: 1px solid #E5E7EB;">
                        <strong>⚠️ Importante:</strong> Este código expirará en <strong>1 hora</strong>. Si no solicitaste este cambio, puedes ignorar este email de forma segura.
                    </p>
                </div>
                
                <div style="text-align: center; padding-top: 20px; border-top: 1px solid #E5E7EB;">
                    <p style="color: #9CA3AF; font-size: 12px; margin: 5px 0;">Si el botón no funciona, copia y pega este enlace en tu navegador:</p>
                    <p style="word-break: break-all; color: #6366F1; font-size: 12px; margin: 5px 0;">${resetUrl}</p>
                </div>
                
                <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #E5E7EB;">
                    <p style="color: #9CA3AF; font-size: 12px; margin: 0;">© ${new Date().getFullYear()} Veedor. Todos los derechos reservados.</p>
                </div>
            </div>
        `
    };

    try {
        console.log('📧 ===== INTENTANDO ENVIAR EMAIL DE RECUPERACIÓN =====');
        console.log('📧 Destinatario:', email);
        console.log('📧 Desde:', process.env.EMAIL_USER);
        console.log('📧 Host:', process.env.EMAIL_HOST);
        console.log('📧 Puerto:', process.env.EMAIL_PORT || '587');
        console.log('📧 Secure:', process.env.EMAIL_SECURE);
        console.log('📧 Transporter configurado:', emailTransporter ? 'Sí' : 'No');
        
        if (!emailTransporter) {
            console.error('❌ ERROR: emailTransporter es null o undefined');
            console.error('❌ Verifica que las variables de entorno estén configuradas correctamente en Render');
            return false;
        }
        
        const info = await emailTransporter.sendMail(mailOptions);
        console.log('✅ Email de recuperación enviado exitosamente a', email);
        console.log('📧 Message ID:', info.messageId);
        console.log('📧 Response:', info.response);
        return true;
    } catch (error) {
        console.error('❌ ===== ERROR ENVIANDO EMAIL DE RECUPERACIÓN =====');
        console.error('❌ Error completo:', error);
        console.error('❌ Mensaje:', error.message);
        console.error('❌ Código:', error.code);
        console.error('❌ Detalles del error:', {
            code: error.code,
            command: error.command,
            response: error.response,
            responseCode: error.responseCode,
            errno: error.errno,
            syscall: error.syscall
        });
        
        // Mensajes de ayuda específicos
        if (error.code === 'EAUTH') {
            console.error('💡 ERROR DE AUTENTICACIÓN:');
            console.error('💡 - Verifica que EMAIL_USER sea tu email completo de Gmail');
            console.error('💡 - Verifica que EMAIL_PASS sea una "Contraseña de aplicación" (App Password) de 16 caracteres');
            console.error('💡 - Si tienes 2FA activado, DEBES usar una App Password, no tu contraseña normal');
            console.error('💡 - Genera una aquí: https://myaccount.google.com/apppasswords');
        } else if (error.code === 'ECONNECTION' || error.code === 'ETIMEDOUT') {
            console.error('💡 ===== PROBLEMA: RENDER BLOQUEA SMTP =====');
            console.error('💡 Render en plan gratuito BLOQUEA todas las conexiones SMTP salientes');
            console.error('💡 Esto incluye Gmail (puertos 465 y 587)');
            console.error('💡');
            console.error('💡 ===== SOLUCIÓN: USA SENDGRID (GRATIS) =====');
            console.error('💡 SendGrid es gratuito hasta 100 emails/día y funciona en Render');
            console.error('💡');
            console.error('💡 PASOS PARA CONFIGURAR SENDGRID:');
            console.error('💡 1. Crea cuenta en: https://signup.sendgrid.com');
            console.error('💡 2. Ve a Settings > API Keys');
            console.error('💡 3. Crea un API Key (Full Access)');
            console.error('💡 4. Copia el API Key');
            console.error('💡 5. En Render, actualiza las variables:');
            console.error('💡    - EMAIL_HOST = smtp.sendgrid.net');
            console.error('💡    - EMAIL_USER = apikey');
            console.error('💡    - EMAIL_PASS = [tu API Key de SendGrid]');
            console.error('💡    - EMAIL_PORT = 587');
            console.error('💡    - EMAIL_SECURE = false');
            console.error('💡 6. Guarda y espera el redeploy');
            console.error('💡');
            console.error('💡 ALTERNATIVA: Mailgun (gratis hasta 5,000 emails/mes)');
            console.error('💡   - Ve a: https://signup.mailgun.com');
            console.error('💡   - Configura similar a SendGrid');
        } else if (error.code === 'EENVELOPE') {
            console.error('💡 ERROR EN EL ENVÍO:');
            console.error('💡 - Verifica que el email del destinatario sea válido');
        }
        
        return false;
    }
}

// Inicializar transporter al iniciar
setupEmailTransporter();

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

// Endpoint de diagnóstico de email (solo para verificar configuración)
app.get('/api/email-status', (req, res) => {
    const status = {
        transporterConfigured: emailTransporter !== null,
        emailHost: process.env.EMAIL_HOST ? 'Configurado' : 'No configurado',
        emailUser: process.env.EMAIL_USER ? 'Configurado' : 'No configurado',
        emailPass: process.env.EMAIL_PASS ? 'Configurado' : 'No configurado',
        emailPort: process.env.EMAIL_PORT || 'No configurado',
        emailSecure: process.env.EMAIL_SECURE || 'No configurado',
        appUrl: process.env.APP_URL || 'No configurado',
        isPlaceholder: (() => {
            const isPlaceholder = (value) => {
                if (!value) return false;
                const lower = value.toLowerCase();
                return lower.includes('tuemail') || 
                       lower.includes('tupassword') || 
                       lower.includes('tu_password') ||
                       lower.includes('example') ||
                       lower.includes('placeholder');
            };
            return isPlaceholder(process.env.EMAIL_USER) || isPlaceholder(process.env.EMAIL_PASS);
        })()
    };
    res.json(status);
});

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

        // Generar token de verificación de email
        const crypto = require('crypto');
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const verificationExpiry = new Date();
        verificationExpiry.setHours(verificationExpiry.getHours() + 24); // Válido por 24 horas

        // Crear usuario
        const user = new User({ 
            email: email.trim().toLowerCase(),
            username: username.trim(),
            password: hashedPassword,
            emailVerificationToken: verificationToken,
            emailVerificationExpiry: verificationExpiry,
            emailVerified: false
        });
        await user.save();

        // Enviar email de verificación
        const emailSent = await sendVerificationEmail(user.email, verificationToken);
        
        // Generar token de sesión
        const token = jwt.sign({ userId: user._id.toString(), email: user.email, username: user.username }, JWT_SECRET, { expiresIn: '30d' });

        res.status(201).json({
            message: emailSent 
                ? 'Usuario creado exitosamente. Revisa tu email para verificar tu cuenta.' 
                : 'Usuario creado exitosamente. Por favor, verifica tu email (el email no pudo enviarse, pero puedes usar el token de verificación).',
            token,
            emailVerificationToken: emailSent ? null : verificationToken, // Solo en desarrollo si no se envió email
            user: { 
                id: user._id.toString(), 
                email: user.email, 
                username: user.username,
                emailVerified: user.emailVerified,
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
            return res.json({ 
                message: 'Si el email está registrado, recibirás un código de recuperación por email.',
                token: null
            });
        }
        
        // Generar token de recuperación (válido por 1 hora)
        const crypto = require('crypto');
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = new Date();
        resetTokenExpiry.setHours(resetTokenExpiry.getHours() + 1);
        
        // Actualizar campos de reset usando updateOne para evitar problemas de validación
        try {
            await User.updateOne(
                { _id: user._id },
                {
                    $set: {
                        resetToken: resetToken,
                        resetTokenExpiry: resetTokenExpiry
                    }
                }
            );
        } catch (saveError) {
            console.error('Error guardando token de recuperación:', saveError);
            console.error('Detalles del error:', saveError.message);
            return res.status(500).json({ error: 'Error al generar código de recuperación' });
        }
        
        console.log(`🔑 Token de recuperación generado para ${email}: ${resetToken.substring(0, 10)}...`);
        
        // Enviar email de recuperación
        console.log('📧 ===== INTENTANDO ENVIAR EMAIL DE RECUPERACIÓN =====');
        console.log('📧 Email del usuario:', user.email);
        console.log('📧 Token generado:', resetToken.substring(0, 20) + '...');
        
        const emailSent = await sendPasswordResetEmail(user.email, resetToken);
        
        if (emailSent) {
            // Si el email se envió correctamente, NO devolver el token por seguridad
            console.log('✅ ===== EMAIL ENVIADO EXITOSAMENTE =====');
            console.log('✅ El código de recuperación fue enviado por email');
            console.log('✅ NO se devuelve el token al cliente por seguridad');
            res.json({ 
                message: 'Email de recuperación enviado',
                token: null, // NUNCA devolver el token si el email se envió
                expiresAt: resetTokenExpiry
            });
        } else {
            // Si el email no se pudo enviar, devolver el token para mostrarlo en el modal
            // Esto es normal en Render plan gratuito que bloquea SMTP saliente
            console.log('📧 ===== MOSTRANDO CÓDIGO EN MODAL (Plan Gratuito) =====');
            console.log('📧 Render plan gratuito bloquea SMTP, mostrando código directamente');
            console.log('📧 Esto es normal y seguro - el código se muestra solo al usuario que lo solicita');
            console.log('📧 El código es válido por 1 hora');
            res.json({ 
                message: 'Código de recuperación generado',
                token: resetToken, // Mostrar código en modal (normal en plan gratuito)
                expiresAt: resetTokenExpiry
            });
        }
    } catch (error) {
        console.error('Error en forgot-password:', error);
        res.status(500).json({ error: 'Error del servidor' });
    }
});

// Resetear contraseña con token
app.post('/api/reset-password', async (req, res) => {
    try {
        console.log('🔑 ===== INTENTANDO RESETEAR CONTRASEÑA =====');
        const { token, newPassword } = req.body;
        
        if (!token || !newPassword) {
            console.log('❌ Faltan parámetros: token o newPassword');
            return res.status(400).json({ error: 'Token y nueva contraseña requeridos' });
        }
        
        if (newPassword.length < 4) {
            console.log('❌ Contraseña muy corta:', newPassword.length);
            return res.status(400).json({ error: 'La contraseña debe tener al menos 4 caracteres' });
        }
        
        console.log('🔍 Buscando usuario con token:', token.substring(0, 10) + '...');
        const user = await User.findOne({ 
            resetToken: token,
            resetTokenExpiry: { $gt: new Date() }
        });
        
        if (!user) {
            console.log('❌ Token no encontrado o expirado');
            // Verificar si el token existe pero está expirado
            const expiredUser = await User.findOne({ resetToken: token });
            if (expiredUser) {
                console.log('⚠️ Token encontrado pero expirado');
                return res.status(400).json({ error: 'El código de recuperación ha expirado. Solicita uno nuevo.' });
            }
            return res.status(400).json({ error: 'Código de recuperación inválido. Verifica que lo hayas copiado correctamente.' });
        }
        
        console.log('✅ Usuario encontrado:', user.email);
        console.log('✅ Username del usuario:', user.username);
        
        // Actualizar contraseña usando updateOne para evitar problemas de validación
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        
        try {
            // Usar updateOne en lugar de save() para evitar validación de campos requeridos
            await User.updateOne(
                { _id: user._id },
                {
                    $set: {
                        password: hashedPassword,
                        resetToken: null,
                        resetTokenExpiry: null,
                        updatedAt: new Date()
                    }
                }
            );
            console.log('✅ Contraseña actualizada exitosamente para:', user.email);
        res.json({ message: 'Contraseña actualizada exitosamente' });
        } catch (saveError) {
            console.error('❌ Error guardando nueva contraseña:', saveError);
            console.error('❌ Detalles:', saveError.message);
            console.error('❌ Stack:', saveError.stack);
            return res.status(500).json({ error: 'Error al guardar la nueva contraseña. Intenta de nuevo.' });
        }
    } catch (error) {
        console.error('❌ ===== ERROR EN RESET-PASSWORD =====');
        console.error('❌ Error completo:', error);
        console.error('❌ Mensaje:', error.message);
        console.error('❌ Stack:', error.stack);
        res.status(500).json({ error: 'Error del servidor. Por favor, intenta de nuevo más tarde.' });
    }
});

// Verificar email con token
app.get('/api/verify-email', async (req, res) => {
    try {
        const { token } = req.query;
        
        if (!token) {
            return res.status(400).json({ error: 'Token de verificación requerido' });
        }
        
        const user = await User.findOne({
            emailVerificationToken: token,
            emailVerificationExpiry: { $gt: new Date() }
        });
        
        if (!user) {
            return res.status(400).json({ error: 'Token inválido o expirado' });
        }
        
        // Marcar email como verificado
        await User.updateOne(
            { _id: user._id },
            {
                $set: {
                    emailVerified: true,
                    emailVerificationToken: null,
                    emailVerificationExpiry: null
                }
            }
        );
        
        res.json({ message: 'Email verificado exitosamente' });
    } catch (error) {
        console.error('Error verificando email:', error);
        res.status(500).json({ error: 'Error del servidor' });
    }
});

// Reenviar email de verificación
app.post('/api/resend-verification', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        
        if (user.emailVerified) {
            return res.status(400).json({ error: 'El email ya está verificado' });
        }
        
        // Generar nuevo token
        const crypto = require('crypto');
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const verificationExpiry = new Date();
        verificationExpiry.setHours(verificationExpiry.getHours() + 24);
        
        await User.updateOne(
            { _id: user._id },
            {
                $set: {
                    emailVerificationToken: verificationToken,
                    emailVerificationExpiry: verificationExpiry
                }
            }
        );
        
        const emailSent = await sendVerificationEmail(user.email, verificationToken);
        
        res.json({
            message: emailSent 
                ? 'Email de verificación reenviado exitosamente' 
                : 'Token de verificación regenerado (el email no pudo enviarse)',
            token: emailSent ? null : verificationToken
        });
    } catch (error) {
        console.error('Error reenviando verificación:', error);
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
                savingsGoal: user.savingsGoal || null,
                baseFund: user.baseFund || null
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
            savingsGoal: user.savingsGoal || null,
            baseFund: user.baseFund || null
        });
    } catch (error) {
        console.error('Error obteniendo perfil:', error);
        res.status(500).json({ error: 'Error al obtener perfil' });
    }
});

// Actualizar perfil de usuario
app.put('/api/user/profile', authenticateToken, async (req, res) => {
    try {
        const { firstName, lastName, age, birthDate, phone, address, city, country, notes, savingsGoal, baseFund } = req.body;

        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Actualizar solo los campos proporcionados, sin validar campos requeridos que no se están actualizando
        if (firstName !== undefined) user.firstName = firstName;
        if (lastName !== undefined) user.lastName = lastName;
        if (age !== undefined) user.age = age;
        if (birthDate !== undefined) user.birthDate = birthDate;
        if (phone !== undefined) user.phone = phone;
        if (address !== undefined) user.address = address;
        if (city !== undefined) user.city = city;
        if (country !== undefined) user.country = country;
        if (notes !== undefined) user.notes = notes;
        if (savingsGoal !== undefined) {
            if (savingsGoal === null || savingsGoal === '' || savingsGoal === 0) {
                user.savingsGoal = null;
            } else {
                const parsed = parseFloat(savingsGoal);
                user.savingsGoal = isNaN(parsed) ? null : parsed;
            }
        }
        if (baseFund !== undefined) {
            if (baseFund === null || baseFund === '' || baseFund === 0) {
                user.baseFund = null;
            } else {
                const parsed = parseFloat(baseFund);
                user.baseFund = isNaN(parsed) ? null : parsed;
            }
        }
        
        user.updatedAt = new Date();
        
        // Usar updateOne para evitar validación de campos requeridos que no se están actualizando
        try {
            await User.updateOne(
                { _id: req.user.userId },
                {
                    $set: {
                        firstName: user.firstName,
                        lastName: user.lastName,
                        age: user.age,
                        birthDate: user.birthDate,
                        phone: user.phone,
                        address: user.address,
                        city: user.city,
                        country: user.country,
                        notes: user.notes,
                        savingsGoal: user.savingsGoal,
                        baseFund: user.baseFund,
                        updatedAt: user.updatedAt
                    }
                }
            );
            
            // Recargar el usuario actualizado
            const updatedUser = await User.findById(req.user.userId);
            
            // Devolver el usuario actualizado con savingsGoal
            res.json({
                firstName: updatedUser.firstName || '',
                lastName: updatedUser.lastName || '',
                age: updatedUser.age || null,
                phone: updatedUser.phone || '',
                address: updatedUser.address || '',
                city: updatedUser.city || '',
                country: updatedUser.country || '',
                birthDate: updatedUser.birthDate || null,
                notes: updatedUser.notes || '',
                savingsGoal: updatedUser.savingsGoal || null
            });
            return;
        } catch (saveError) {
            console.error('Error guardando perfil:', saveError);
            return res.status(500).json({ error: 'Error al actualizar perfil: ' + (saveError.message || 'Error desconocido') });
        }
        
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

// Eliminar usuario y todos sus datos
app.delete('/api/user', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        
        // Eliminar todos los datos asociados al usuario
        await Transaction.deleteMany({ user_id: userId });
        await Envelope.deleteMany({ user_id: userId });
        await Budget.deleteMany({ user_id: userId });
        await Loan.deleteMany({ user_id: userId });
        await Investment.deleteMany({ user_id: userId });
        await Account.deleteMany({ user_id: userId });
        await Patrimonio.deleteMany({ user_id: userId });
        
        // Eliminar el usuario
        await User.findByIdAndDelete(userId);
        
        res.json({ message: 'Usuario y todos sus datos eliminados exitosamente' });
    } catch (error) {
        console.error('Error eliminando usuario:', error);
        res.status(500).json({ error: 'Error al eliminar usuario' });
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

// Crear transacción - CÓDIGO COMPLETAMENTE REVISADO Y CORREGIDO
app.post('/api/transactions', authenticateToken, async (req, res) => {
    try {
        // 1. Validar conexión a MongoDB
        if (mongoose.connection.readyState !== 1) {
            console.error('❌ MongoDB no está conectado. Estado:', mongoose.connection.readyState);
            return res.status(503).json({ error: 'Base de datos no disponible. Intenta de nuevo en unos momentos.' });
        }
        
        // 2. Validar que req.user existe
        if (!req.user || !req.user.userId) {
            console.error('❌ req.user o req.user.userId no existe');
            console.error('❌ req.user completo:', req.user);
            return res.status(401).json({ error: 'Usuario no autenticado' });
        }
        
        console.log('📥 POST /api/transactions - Recibido');
        console.log('📥 req.user.userId:', req.user.userId);
        console.log('📥 req.body completo:', JSON.stringify(req.body, null, 2));
        
        // 3. Extraer datos del body
        const { type, date, amount, categoryGeneral, categorySpecific, envelope, account_id, investment_id, property_id, loan_id, description } = req.body;
        
        // 4. Validar campos requeridos
        if (!type || !date || amount === undefined || amount === null || !categoryGeneral || !categorySpecific) {
            console.log('❌ Validación fallida - campos requeridos faltantes');
            console.log('❌ Valores recibidos:', { type, date, amount, categoryGeneral, categorySpecific });
            return res.status(400).json({ error: 'Todos los campos requeridos deben estar presentes' });
        }
        
        // 5. Validar tipo
        if (type !== 'income' && type !== 'expense') {
            console.log('❌ Validación fallida - tipo inválido:', type);
            return res.status(400).json({ error: 'El tipo debe ser income o expense' });
        }
        
        // 6. Validar y convertir monto
        const amountNum = parseFloat(amount);
        if (isNaN(amountNum) || amountNum <= 0) {
            console.log('❌ Validación fallida - monto inválido:', amount);
            return res.status(400).json({ error: 'El monto debe ser un número mayor a 0' });
        }
        
        // 7. Normalizar campos opcionales (convertir strings vacíos a null)
        const normalizedEnvelope = (envelope && typeof envelope === 'string' && envelope.trim() !== '') ? envelope.trim() : null;
        const normalizedAccountId = (account_id && typeof account_id === 'string' && account_id.trim() !== '') ? account_id.trim() : null;
        const normalizedInvestmentId = (investment_id && typeof investment_id === 'string' && investment_id.trim() !== '') ? investment_id.trim() : null;
        const normalizedPropertyId = (property_id && typeof property_id === 'string' && property_id.trim() !== '') ? property_id.trim() : null;
        const normalizedLoanId = (loan_id && typeof loan_id === 'string' && loan_id.trim() !== '') ? loan_id.trim() : null;
        const normalizedDescription = (description && typeof description === 'string' && description.trim() !== '') ? description.trim() : null;
        
        // 8. Calcular monto final
        const finalAmount = type === 'expense' ? -Math.abs(amountNum) : Math.abs(amountNum);
        
        console.log('📥 Datos normalizados para crear transacción:', {
            user_id: req.user.userId,
            type,
            date,
            amount: finalAmount,
            category_general: categoryGeneral,
            category_specific: categorySpecific,
            envelope: normalizedEnvelope,
            account_id: normalizedAccountId,
            investment_id: normalizedInvestmentId,
            property_id: normalizedPropertyId,
            loan_id: normalizedLoanId,
            description: normalizedDescription
        });
        
        // 9. Crear la transacción
        const transactionData = {
            user_id: req.user.userId,
            type: type,
            date: date,
            amount: finalAmount,
            category_general: categoryGeneral,
            category_specific: categorySpecific,
            envelope: normalizedEnvelope,
            account_id: normalizedAccountId,
            investment_id: normalizedInvestmentId,
            property_id: normalizedPropertyId,
            loan_id: normalizedLoanId,
            description: normalizedDescription
        };
        
        console.log('📥 Creando instancia de Transaction con:', transactionData);
        
        const transaction = new Transaction(transactionData);
        
        console.log('📥 Transacción creada (antes de save):', JSON.stringify(transaction.toObject(), null, 2));
        
        // 10. Guardar la transacción
        try {
        await transaction.save();
            console.log('✅ Transacción guardada exitosamente. ID:', transaction._id);
        } catch (saveError) {
            console.error('❌ Error al guardar transacción:', saveError);
            console.error('❌ Error name:', saveError.name);
            console.error('❌ Error message:', saveError.message);
            if (saveError.errors) {
                console.error('❌ Errores de validación:', JSON.stringify(saveError.errors, null, 2));
            }
            throw saveError;
        }
        
        // 11. Si está asociada a un préstamo, actualizar el saldo pendiente
        if (normalizedLoanId && type === 'expense') {
            try {
                const loan = await Loan.findOne({ _id: normalizedLoanId, user_id: req.user.userId });
                if (loan) {
                    // Actualizar el total pagado y el saldo pendiente
                    loan.total_paid = (loan.total_paid || 0) + Math.abs(amountNum);
                    loan.last_payment_date = date;
                    await loan.save();
                    console.log('✅ Préstamo actualizado con el pago');
                }
            } catch (loanError) {
                console.error('⚠️ Error al actualizar préstamo (no crítico):', loanError);
                // No fallar la transacción si hay error al actualizar el préstamo
            }
        }
        
        // 12. Si está asociada a una inversión, actualizar el historial
        if (normalizedInvestmentId && type === 'expense') {
            try {
                const investment = await Investment.findOne({ _id: normalizedInvestmentId, user_id: req.user.userId });
            if (investment) {
                    // Si la transacción no tiene cuenta pero la inversión tiene cuenta configurada en aportes periódicos, usarla
                    if (!normalizedAccountId && investment.periodic_contribution?.account_id) {
                        transaction.account_id = investment.periodic_contribution.account_id;
                        await transaction.save();
                    }
                    
                if (!investment.contributions) {
                    investment.contributions = [];
                }
                investment.contributions.push({
                    date: date,
                        amount: Math.abs(amountNum),
                    transaction_id: transaction._id.toString()
                });
                
                if (investment.periodic_contribution && investment.periodic_contribution.enabled) {
                    const contributionDate = new Date(date);
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
                    
                    if (!existingContribution) {
                        if (!investment.periodic_contribution.completed_contributions) {
                            investment.periodic_contribution.completed_contributions = [];
                        }
                        investment.periodic_contribution.completed_contributions.push({
                            date: date,
                                amount: Math.abs(amountNum),
                            transaction_id: transaction._id.toString()
                        });
                    }
                }
                
                await investment.save();
                    console.log('✅ Inversión actualizada con el aporte');
                }
            } catch (invError) {
                console.error('⚠️ Error al actualizar inversión (no crítico):', invError);
                // No fallar la transacción si hay error al actualizar la inversión
            }
        }
        
        console.log('✅ Enviando respuesta exitosa con transacción:', transaction._id);
        res.status(201).json(transaction);
    } catch (error) {
        console.error('❌ ERROR CRÍTICO creando transacción:');
        console.error('❌ Error name:', error.name);
        console.error('❌ Error message:', error.message);
        console.error('❌ Error stack:', error.stack);
        if (error.errors) {
            console.error('❌ Errores de validación:', JSON.stringify(error.errors, null, 2));
        }
        if (error.code) {
            console.error('❌ Error code:', error.code);
        }
        
        // Respuesta de error más detallada
        const errorResponse = {
            error: 'Error al crear transacción',
            details: error.message,
            errorName: error.name
        };
        
        if (error.errors) {
            errorResponse.validationErrors = error.errors;
        }
        
        res.status(500).json(errorResponse);
    }
});

// Actualizar transacción
app.put('/api/transactions/:id', authenticateToken, async (req, res) => {
    try {
        // 1. Validar conexión a MongoDB
        if (mongoose.connection.readyState !== 1) {
            console.error('❌ MongoDB no está conectado. Estado:', mongoose.connection.readyState);
            return res.status(503).json({ error: 'Base de datos no disponible. Intenta de nuevo en unos momentos.' });
        }
        
        // 2. Validar que req.user existe
        if (!req.user || !req.user.userId) {
            console.error('❌ req.user o req.user.userId no existe');
            return res.status(401).json({ error: 'Usuario no autenticado' });
        }
        
        console.log('📥 PUT /api/transactions/:id - Recibido');
        console.log('📥 Transaction ID:', req.params.id);
        console.log('📥 req.user.userId:', req.user.userId);
        console.log('📥 req.body completo:', JSON.stringify(req.body, null, 2));
        
        // 3. Buscar la transacción
        const transaction = await Transaction.findOne({
            _id: req.params.id,
            user_id: req.user.userId
        });
        
        if (!transaction) {
            return res.status(404).json({ error: 'Transacción no encontrada' });
        }
        
        // 4. Extraer datos del body
        const { type, date, amount, categoryGeneral, categorySpecific, envelope, account_id, investment_id, property_id, description } = req.body;
        
        // 5. Validar campos requeridos
        if (!type || !date || amount === undefined || amount === null || !categoryGeneral || !categorySpecific) {
            console.log('❌ Validación fallida - campos requeridos faltantes');
            return res.status(400).json({ error: 'Todos los campos requeridos deben estar presentes' });
        }
        
        // 6. Validar tipo
        if (type !== 'income' && type !== 'expense') {
            console.log('❌ Validación fallida - tipo inválido:', type);
            return res.status(400).json({ error: 'El tipo debe ser income o expense' });
        }
        
        // 7. Validar y convertir monto
        const amountNum = parseFloat(amount);
        // Validar que el valor absoluto del monto sea mayor a 0 (acepta negativos para gastos)
        if (isNaN(amountNum) || Math.abs(amountNum) <= 0) {
            console.log('❌ Validación fallida - monto inválido:', amount);
            return res.status(400).json({ error: 'El monto debe ser un número mayor a 0' });
        }
        
        // 8. Normalizar campos opcionales
        const normalizedEnvelope = (envelope && typeof envelope === 'string' && envelope.trim() !== '') ? envelope.trim() : null;
        const normalizedAccountId = (account_id && typeof account_id === 'string' && account_id.trim() !== '') ? account_id.trim() : null;
        const normalizedInvestmentId = (investment_id && typeof investment_id === 'string' && investment_id.trim() !== '') ? investment_id.trim() : null;
        const normalizedPropertyId = (property_id && typeof property_id === 'string' && property_id.trim() !== '') ? property_id.trim() : null;
        const normalizedDescription = (description && typeof description === 'string' && description.trim() !== '') ? description.trim() : null;
        
        // 9. Calcular monto final - si ya viene con signo correcto, usarlo; si no, calcularlo
        let finalAmount;
        if ((type === 'expense' && amountNum < 0) || (type === 'income' && amountNum > 0)) {
            // Ya viene con el signo correcto
            finalAmount = amountNum;
        } else {
            // Calcular el signo según el tipo
            finalAmount = type === 'expense' ? -Math.abs(amountNum) : Math.abs(amountNum);
        }
        
        // 10. Actualizar la transacción
        transaction.type = type;
        transaction.date = date;
        transaction.amount = finalAmount;
        transaction.category_general = categoryGeneral;
        transaction.category_specific = categorySpecific;
        transaction.envelope = normalizedEnvelope;
        transaction.account_id = normalizedAccountId;
        transaction.investment_id = normalizedInvestmentId;
        transaction.property_id = normalizedPropertyId;
        transaction.description = normalizedDescription;
        
        await transaction.save();
        
        console.log('✅ Transacción actualizada exitosamente. ID:', transaction._id);
        res.json(transaction);
    } catch (error) {
        console.error('❌ ERROR actualizando transacción:');
        console.error('❌ Error name:', error.name);
        console.error('❌ Error message:', error.message);
        console.error('❌ Error stack:', error.stack);
        
        if (error.name === 'CastError') {
            return res.status(400).json({ error: 'ID de transacción inválido' });
        }
        
        res.status(500).json({ error: 'Error al actualizar transacción', details: error.message });
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
        const { name, budget, patrimonio_id } = req.body;

        if (!name || budget === undefined) {
            return res.status(400).json({ error: 'Nombre y presupuesto requeridos' });
        }

        const envelope = new Envelope({
            user_id: req.user.userId,
            name,
            budget,
            patrimonio_id: patrimonio_id || null
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
            opening_commission, early_payment_commission, payment_frequency, payment_day, account_id,
            patrimonio_id
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
            patrimonio_id: patrimonio_id || null,
            opening_commission: opening_commission || 0,
            early_payment_commission: early_payment_commission || 0,
            payment_frequency: payment_frequency || 'monthly',
            payment_day: payment_day || 1
        });

        await loan.save();
        
        // Si es una deuda (debt), crear transacción recurrente mensual automáticamente
        if (type === 'debt' && monthly_payment > 0) {
            try {
                // Calcular la fecha del primer pago (día de pago del mes de inicio)
                const startDateObj = new Date(start_date);
                const paymentDay = payment_day || 1;
                const firstPaymentDate = new Date(startDateObj.getFullYear(), startDateObj.getMonth(), paymentDay);
                
                // Si la fecha de inicio ya pasó, usar el próximo mes
                if (firstPaymentDate < new Date()) {
                    firstPaymentDate.setMonth(firstPaymentDate.getMonth() + 1);
                }
                
                const firstPaymentDateStr = firstPaymentDate.toISOString().split('T')[0];
                
                // Crear transacción recurrente para la cuota del préstamo
                const recurringTransaction = new Transaction({
                    user_id: req.user.userId,
                    type: 'expense',
                    date: firstPaymentDateStr,
                    amount: -Math.abs(monthly_payment), // Negativo porque es un gasto
                    category_general: 'Préstamos e Hipotecas',
                    category_specific: 'Cuota de Préstamo',
                    loan_id: loan._id.toString(),
                    account_id: account_id || null, // Asociar cuenta si se especificó
                    description: `Cuota mensual: ${name}`,
                    is_recurring: true,
                    recurring_frequency: payment_frequency || 'monthly',
                    recurring_day: paymentDay
                });
                
                await recurringTransaction.save();
            } catch (recurringError) {
                console.error('Error creando transacción recurrente para préstamo:', recurringError);
                // No fallar la creación del préstamo si falla la transacción recurrente
            }
        }
        
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
        
        // Crear transacción automática para el pago del préstamo
        const paymentDate = date || new Date().toISOString().split('T')[0];
        const totalPaymentAmount = amount + (is_early_payment && loan.early_payment_commission > 0 ? (amount * loan.early_payment_commission / 100) : 0);
        
        const paymentTransaction = new Transaction({
            user_id: req.user.userId,
            type: 'expense',
            date: paymentDate,
            amount: -Math.abs(totalPaymentAmount),
            category_general: 'bills',
            category_specific: 'Préstamo',
            loan_id: loan._id.toString(),
            description: `Pago de préstamo: ${loan.name}${is_early_payment ? ' (Amortización anticipada)' : ''}`,
            is_recurring: !is_early_payment,
            recurring_frequency: !is_early_payment ? 'monthly' : null
        });
        
        await paymentTransaction.save();

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

// Editar amortización anticipada
app.put('/api/loans/:id/early-payment/:index', authenticateToken, async (req, res) => {
    try {
        const loan = await Loan.findOne({ _id: req.params.id, user_id: req.user.userId });
        if (!loan) {
            return res.status(404).json({ error: 'Préstamo no encontrado' });
        }

        const index = parseInt(req.params.index);
        if (!loan.early_payments || index < 0 || index >= loan.early_payments.length) {
            return res.status(404).json({ error: 'Amortización no encontrada' });
        }

        const { date, amount, commission } = req.body;
        if (!date || !amount || amount <= 0) {
            return res.status(400).json({ error: 'Fecha y monto son requeridos' });
        }

        loan.early_payments[index] = {
            date,
            amount,
            commission: commission || 0
        };

        await loan.save();
        res.json(loan);
    } catch (error) {
        console.error('Error editando amortización:', error);
        res.status(500).json({ error: 'Error al editar amortización' });
    }
});

// Eliminar amortización anticipada
app.delete('/api/loans/:id/early-payment/:index', authenticateToken, async (req, res) => {
    try {
        const loan = await Loan.findOne({ _id: req.params.id, user_id: req.user.userId });
        if (!loan) {
            return res.status(404).json({ error: 'Préstamo no encontrado' });
        }

        const index = parseInt(req.params.index);
        if (!loan.early_payments || index < 0 || index >= loan.early_payments.length) {
            return res.status(404).json({ error: 'Amortización no encontrada' });
        }

        loan.early_payments.splice(index, 1);
        await loan.save();
        res.json(loan);
    } catch (error) {
        console.error('Error eliminando amortización:', error);
        res.status(500).json({ error: 'Error al eliminar amortización' });
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
        const { category_id, patrimonio_id, amount, period_type, period_value } = req.body;

        // Validar que al menos uno de category_id o patrimonio_id esté presente
        if ((!category_id && !patrimonio_id) || amount === undefined || !period_type || !period_value) {
            return res.status(400).json({ error: 'Debe especificar una categoría o patrimonio, y todos los campos son requeridos' });
        }

        // Construir query de búsqueda
        const query = {
            user_id: req.user.userId,
            period_type,
            period_value
        };
        
        if (category_id) {
            query.category_id = category_id;
        }
        if (patrimonio_id) {
            query.patrimonio_id = patrimonio_id;
        }

        // Buscar presupuesto existente
        const existingBudget = await Budget.findOne(query);

        if (existingBudget) {
            // Actualizar presupuesto existente
            existingBudget.amount = amount;
            if (category_id !== undefined) existingBudget.category_id = category_id || null;
            if (patrimonio_id !== undefined) existingBudget.patrimonio_id = patrimonio_id || null;
            await existingBudget.save();
            return res.status(200).json(existingBudget);
        } else {
            // Crear nuevo presupuesto
            const budget = new Budget({
                user_id: req.user.userId,
                category_id: category_id || null,
                patrimonio_id: patrimonio_id || null,
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

// ==================== RUTAS DE PROPIEDADES/PISOS ====================

// Obtener todas las propiedades del usuario
app.get('/api/properties', authenticateToken, async (req, res) => {
    try {
        const properties = await Property.find({ user_id: req.user.userId })
            .sort({ created_at: -1 });
        res.json(properties);
    } catch (error) {
        console.error('Error obteniendo propiedades:', error);
        res.status(500).json({ error: 'Error al obtener propiedades' });
    }
});

// Crear propiedad
app.post('/api/properties', authenticateToken, async (req, res) => {
    try {
        const { name, address, type, description } = req.body;
        
        if (!name) {
            return res.status(400).json({ error: 'El nombre de la propiedad es requerido' });
        }
        
        const property = new Property({
            user_id: req.user.userId,
            name,
            address: address || null,
            type: type || 'apartment',
            description: description || null
        });
        
        await property.save();
        res.status(201).json(property);
    } catch (error) {
        console.error('Error creando propiedad:', error);
        res.status(500).json({ error: 'Error al crear propiedad' });
    }
});

// Actualizar propiedad
app.put('/api/properties/:id', authenticateToken, async (req, res) => {
    try {
        const { name, address, type, description, current_value } = req.body;
        
        const updateData = {
            updated_at: new Date()
        };
        
        if (name !== undefined) updateData.name = name;
        if (address !== undefined) updateData.address = address;
        if (type !== undefined) updateData.type = type;
        if (description !== undefined) updateData.description = description;
        if (current_value !== undefined) updateData.current_value = current_value;
        
        const property = await Property.findOneAndUpdate(
            { _id: req.params.id, user_id: req.user.userId },
            updateData,
            { new: true }
        );
        
        if (!property) {
            return res.status(404).json({ error: 'Propiedad no encontrada' });
        }
        
        res.json(property);
    } catch (error) {
        console.error('Error actualizando propiedad:', error);
        res.status(500).json({ error: 'Error al actualizar propiedad' });
    }
});

// Eliminar propiedad
app.delete('/api/properties/:id', authenticateToken, async (req, res) => {
    try {
        const property = await Property.findOneAndDelete({
            _id: req.params.id,
            user_id: req.user.userId
        });
        
        if (!property) {
            return res.status(404).json({ error: 'Propiedad no encontrada' });
        }
        
        res.json({ message: 'Propiedad eliminada exitosamente' });
    } catch (error) {
        console.error('Error eliminando propiedad:', error);
        res.status(500).json({ error: 'Error al eliminar propiedad' });
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
        
        const contributionAmount = parseFloat(amount);
        
        // Obtener account_id de los aportes periódicos si existe
        const accountId = investment.periodic_contribution?.account_id || null;
        
        // Crear transacción automática para el aporte a la inversión
        const contributionTransaction = new Transaction({
            user_id: req.user.userId,
            type: 'expense',
            date: date,
            amount: -Math.abs(contributionAmount),
            category_general: 'investment',
            category_specific: 'Aporte',
            investment_id: investment._id.toString(),
            account_id: accountId, // Asociar cuenta si está configurada en aportes periódicos
            description: `Aporte a inversión: ${investment.name}`
        });
        
        await contributionTransaction.save();
        
        investment.contributions.push({
            date: date,
            amount: contributionAmount,
            transaction_id: contributionTransaction._id.toString()
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

// Obtener todas las propiedades del patrimonio del usuario
app.get('/api/patrimonio', authenticateToken, async (req, res) => {
    try {
        const patrimonio = await Patrimonio.find({ user_id: req.user.userId })
            .populate('associated_loans')
            .sort({ created_at: -1 });
        res.json(patrimonio);
    } catch (error) {
        console.error('Error obteniendo patrimonio:', error);
        res.status(500).json({ error: 'Error al obtener patrimonio' });
    }
});

// Obtener una propiedad específica del patrimonio
app.get('/api/patrimonio/:id', authenticateToken, async (req, res) => {
    try {
        const patrimonio = await Patrimonio.findOne({ 
            _id: req.params.id, 
            user_id: req.user.userId 
        }).populate('associated_loans');
        
        if (!patrimonio) {
            return res.status(404).json({ error: 'Propiedad no encontrada' });
        }
        
        res.json(patrimonio);
    } catch (error) {
        console.error('Error obteniendo propiedad:', error);
        res.status(500).json({ error: 'Error al obtener propiedad' });
    }
});

// Crear nueva propiedad en el patrimonio
app.post('/api/patrimonio', authenticateToken, async (req, res) => {
    try {
        const { name, type, address, location, purchase_date, purchase_price, current_value, description } = req.body;
        
        if (!name || !type || current_value === undefined) {
            return res.status(400).json({ error: 'Nombre, tipo y valor actual son campos requeridos' });
        }
        
        const patrimonio = new Patrimonio({
            user_id: req.user.userId,
            name,
            type,
            address: address || null,
            location: location || null,
            purchase_date: purchase_date || null,
            purchase_price: purchase_price || 0,
            current_value,
            description: description || null,
            value_history: []
        });
        
        // Agregar valor inicial al historial si se proporciona fecha de compra
        if (purchase_date && purchase_price) {
            patrimonio.value_history.push({
                date: purchase_date,
                value: purchase_price,
                notes: 'Valor inicial de compra'
            });
        }
        
        // Agregar valor actual al historial
        patrimonio.value_history.push({
            date: new Date().toISOString().split('T')[0],
            value: current_value,
            notes: 'Valor actual'
        });
        
        await patrimonio.save();
        res.status(201).json(patrimonio);
    } catch (error) {
        console.error('Error creando propiedad:', error);
        res.status(500).json({ error: 'Error al crear propiedad' });
    }
});

// Actualizar propiedad del patrimonio
app.put('/api/patrimonio/:id', authenticateToken, async (req, res) => {
    try {
        const { name, type, address, location, purchase_date, purchase_price, current_value, description, update_value_history } = req.body;
        
        const patrimonio = await Patrimonio.findOne({ _id: req.params.id, user_id: req.user.userId });
        if (!patrimonio) {
            return res.status(404).json({ error: 'Propiedad no encontrada' });
        }
        
        // Si se actualiza el valor actual, agregar al historial
        if (update_value_history && current_value !== undefined && current_value !== patrimonio.current_value) {
            patrimonio.value_history.push({
                date: new Date().toISOString().split('T')[0],
                value: current_value,
                notes: 'Actualización de valor'
            });
        }
        
        patrimonio.name = name !== undefined ? name : patrimonio.name;
        patrimonio.type = type !== undefined ? type : patrimonio.type;
        patrimonio.address = address !== undefined ? address : patrimonio.address;
        patrimonio.location = location !== undefined ? location : patrimonio.location;
        patrimonio.purchase_date = purchase_date !== undefined ? purchase_date : patrimonio.purchase_date;
        patrimonio.purchase_price = purchase_price !== undefined ? purchase_price : patrimonio.purchase_price;
        patrimonio.current_value = current_value !== undefined ? current_value : patrimonio.current_value;
        patrimonio.description = description !== undefined ? description : patrimonio.description;
        patrimonio.updated_at = new Date();
        
        await patrimonio.save();
        res.json(patrimonio);
    } catch (error) {
        console.error('Error actualizando propiedad:', error);
        res.status(500).json({ error: 'Error al actualizar propiedad' });
    }
});

// Eliminar propiedad del patrimonio
app.delete('/api/patrimonio/:id', authenticateToken, async (req, res) => {
    try {
        const patrimonio = await Patrimonio.findOne({ _id: req.params.id, user_id: req.user.userId });
        
        if (!patrimonio) {
            return res.status(404).json({ error: 'Propiedad no encontrada' });
        }
        
        // Desasociar préstamos relacionados
        if (patrimonio.associated_loans && patrimonio.associated_loans.length > 0) {
            await Loan.updateMany(
                { _id: { $in: patrimonio.associated_loans } },
                { $unset: { patrimonio_id: "" } }
            );
        }
        
        await Patrimonio.findByIdAndDelete(req.params.id);
        
        res.json({ message: 'Propiedad eliminada exitosamente' });
    } catch (error) {
        console.error('Error eliminando propiedad:', error);
        res.status(500).json({ error: 'Error al eliminar propiedad' });
    }
});

// Asociar un préstamo a una propiedad del patrimonio
app.post('/api/patrimonio/:id/loans/:loanId', authenticateToken, async (req, res) => {
    try {
        const patrimonio = await Patrimonio.findOne({ _id: req.params.id, user_id: req.user.userId });
        if (!patrimonio) {
            return res.status(404).json({ error: 'Propiedad no encontrada' });
        }
        
        const loan = await Loan.findOne({ _id: req.params.loanId, user_id: req.user.userId });
        if (!loan) {
            return res.status(404).json({ error: 'Préstamo no encontrado' });
        }
        
        // Agregar préstamo a la propiedad si no está ya asociado
        if (!patrimonio.associated_loans.includes(loan._id)) {
            patrimonio.associated_loans.push(loan._id);
            await patrimonio.save();
        }
        
        // Asociar propiedad al préstamo
        loan.patrimonio_id = patrimonio._id;
        await loan.save();
        
        const updatedPatrimonio = await Patrimonio.findById(patrimonio._id).populate('associated_loans');
        res.json(updatedPatrimonio);
    } catch (error) {
        console.error('Error asociando préstamo:', error);
        res.status(500).json({ error: 'Error al asociar préstamo' });
    }
});

// Desasociar un préstamo de una propiedad del patrimonio
app.delete('/api/patrimonio/:id/loans/:loanId', authenticateToken, async (req, res) => {
    try {
        const patrimonio = await Patrimonio.findOne({ _id: req.params.id, user_id: req.user.userId });
        if (!patrimonio) {
            return res.status(404).json({ error: 'Propiedad no encontrada' });
        }
        
        const loan = await Loan.findOne({ _id: req.params.loanId, user_id: req.user.userId });
        if (!loan) {
            return res.status(404).json({ error: 'Préstamo no encontrado' });
        }
        
        // Remover préstamo de la propiedad
        patrimonio.associated_loans = patrimonio.associated_loans.filter(
            loanId => loanId.toString() !== loan._id.toString()
        );
        await patrimonio.save();
        
        // Desasociar propiedad del préstamo
        loan.patrimonio_id = null;
        await loan.save();
        
        const updatedPatrimonio = await Patrimonio.findById(patrimonio._id).populate('associated_loans');
        res.json(updatedPatrimonio);
    } catch (error) {
        console.error('Error desasociando préstamo:', error);
        res.status(500).json({ error: 'Error al desasociar préstamo' });
    }
});

// ==================== RUTA PARA SERVIR EL FRONTEND ====================
// Health check endpoint para Render (simple, sin /api)
app.get('/health', (req, res) => {
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    res.status(200).json({ 
        status: 'ok', 
        database: dbStatus,
        timestamp: new Date().toISOString()
    });
});

app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    } else {
        res.status(404).json({ error: 'Ruta no encontrada' });
    }
});

// Manejo de errores no capturados
process.on('uncaughtException', (err) => {
    console.error('❌ Excepción no capturada:', err);
    console.error('Stack:', err.stack);
    // No cerrar el proceso, solo registrar el error
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Promesa rechazada no manejada:', reason);
    console.error('En:', promise);
    // No cerrar el proceso, solo registrar el error
});

// Iniciar servidor
const server = app.listen(PORT, '0.0.0.0', () => {
    const os = require('os');
    const networkInterfaces = os.networkInterfaces();
    let localIP = 'localhost';
    
    if (process.env.RENDER) {
        console.log(`🚀 Servidor corriendo en Render.com en puerto ${PORT}`);
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
    
    const dbStatus = mongoose.connection.readyState === 1 ? '✅ Conectado' : '⚠️ Desconectado';
    console.log(`📊 Base de datos: MongoDB - ${dbStatus}`);
    if (!process.env.RENDER) {
        console.log(`\n💡 Para acceder desde otros dispositivos, usa: http://${localIP}:${PORT}`);
    }
});

// Manejo de errores del servidor
server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`❌ Puerto ${PORT} ya está en uso`);
    } else {
        console.error('❌ Error del servidor:', err);
    }
});
