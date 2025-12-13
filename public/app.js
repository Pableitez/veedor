// Evitar cargar múltiples veces
// Versión: 2.5.0 - Detalles de resumen, meta de ahorro en BD, header mejorado
if (window.VEEDOR_LOADED) {
    console.warn('⚠️ app.js ya fue cargado, evitando carga duplicada');
} else {
    window.VEEDOR_LOADED = true;
    
    // Exponer funciones globales inmediatamente (stubs) para evitar errores de referencia
    window.showUserProfile = function() { 
        const modal = document.getElementById('userProfileModal');
        if (modal) {
            modal.style.display = 'flex';
        } else {
            console.warn('Modal de perfil de usuario no encontrado');
        }
    };
    window.closeUserProfile = function() { 
        const modal = document.getElementById('userProfileModal');
        if (modal) modal.style.display = 'none';
    };
    window.showPrivacyModal = function() { 
        const modal = document.getElementById('privacyModal');
        if (modal) {
            // Intentar cargar contenido si la función está disponible
            if (typeof loadPolicyContent === 'function') {
                loadPolicyContent('privacy.html', 'privacyContent');
            }
            modal.style.display = 'flex';
        } else {
            console.warn('Modal de privacidad no encontrado');
        }
    };
    window.showCookiesModal = function() { 
        const modal = document.getElementById('cookiesModal');
        if (modal) {
            // Intentar cargar contenido si la función está disponible
            if (typeof loadPolicyContent === 'function') {
                loadPolicyContent('cookies.html', 'cookiesContent');
            }
            modal.style.display = 'flex';
        } else {
            console.warn('Modal de cookies no encontrado');
        }
    };
    window.showTermsModal = function() { 
        const modal = document.getElementById('termsModal');
        if (modal) {
            // Intentar cargar contenido si la función está disponible
            if (typeof loadPolicyContent === 'function') {
                loadPolicyContent('terms.html', 'termsContent');
            }
            modal.style.display = 'flex';
        } else {
            console.warn('Modal de términos no encontrado');
        }
    };
    window.closePrivacyModal = function() { 
        const modal = document.getElementById('privacyModal');
        if (modal) modal.style.display = 'none';
    };
    window.closeCookiesModal = function() { 
        const modal = document.getElementById('cookiesModal');
        if (modal) modal.style.display = 'none';
    };
    window.closeTermsModal = function() { 
        const modal = document.getElementById('termsModal');
        if (modal) modal.style.display = 'none';
    };
    window.showSummaryDetails = function() { console.warn('showSummaryDetails aún no está disponible'); };
    window.closeSummaryDetails = function() { 
        const modal = document.getElementById('summaryDetailsModal');
        if (modal) modal.style.display = 'none';
    };
    window.closeCategoryDetailsModal = function() { 
        const modal = document.getElementById('categoryDetailsModal');
        if (modal) modal.style.display = 'none';
    };
    window.showSavingsGoalModal = function() { console.warn('showSavingsGoalModal aún no está disponible'); };
    window.closeSavingsGoalModal = function() { 
        const modal = document.getElementById('savingsGoalModal');
        if (modal) modal.style.display = 'none';
    };
    window.openChartModal = function(chartType, title) {
        console.log('🔧 Stub openChartModal llamado:', { chartType, title, hasRealFunction: typeof window._openChartModalReal === 'function' });
        // Si la función real ya está disponible, usarla
        if (typeof window._openChartModalReal === 'function') {
            console.log('✅ Usando función real desde stub');
            return window._openChartModalReal(chartType, title);
        }
        // Si no, intentar abrir el modal básico y esperar a que la función real esté lista
        console.log('⚠️ Función real no disponible aún, usando stub. Reintentando en 200ms...');
        const modal = document.getElementById('chartModal');
        const modalTitle = document.getElementById('chartModalTitle');
        if (modal && modalTitle) {
            if (title) modalTitle.textContent = title;
            modal.style.display = 'flex';
            // Intentar llamar a la función real después de delays progresivos
            let attempts = 0;
            const maxAttempts = 10;
            const checkFunction = () => {
                attempts++;
                if (typeof window._openChartModalReal === 'function') {
                    console.log('✅ Función real disponible ahora, llamándola...');
                    window._openChartModalReal(chartType, title);
                } else if (attempts < maxAttempts) {
                    setTimeout(checkFunction, 200);
                } else {
                    console.error('❌ Función real aún no disponible después de', maxAttempts, 'intentos');
                    alert('Error: No se pudo cargar la función de gráficos. Por favor, recarga la página.');
                }
            };
            setTimeout(checkFunction, 200);
        } else {
            console.error('❌ Modal o modalTitle no encontrado en stub');
        }
    };
    window.closeChartModal = function() { 
        const modal = document.getElementById('chartModal');
        if (modal) modal.style.display = 'none';
    };
    window.deleteSavingsGoal = function() { console.warn('deleteSavingsGoal aún no está disponible'); };
    
    // Configuración de la API
    const API_URL = '/api';

    // Log inicial para verificar que el script se carga
    console.log('🚀 app.js cargado correctamente');
    
    // Registrar Service Worker para PWA
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/service-worker.js')
                .then((registration) => {
                    console.log('✅ Service Worker registrado:', registration.scope);
                    
                    // Verificar actualizaciones periódicamente
                    setInterval(() => {
                        registration.update();
                    }, 60000); // Cada minuto
                })
                .catch((error) => {
                    console.log('❌ Error registrando Service Worker:', error);
                });
            
            // Escuchar actualizaciones del Service Worker
            navigator.serviceWorker.addEventListener('controllerchange', () => {
                console.log('🔄 Nueva versión del Service Worker disponible');
                // Opcional: mostrar notificación al usuario
            });
        });
    }
    console.log('API_URL:', API_URL);
    console.log('URL actual:', window.location.href);

// Categorías de gastos e ingresos
const categories = {
    expense: [
        { id: 'food', name: 'Alimentación', subcategories: ['Supermercado', 'Restaurantes', 'Delivery', 'Café', 'Bebidas', 'Comida rápida', 'Mercado local', 'Tienda de conveniencia', 'Catering', 'Almuerzo de trabajo', 'Desayuno', 'Merienda', 'Cena', 'Snacks', 'Bebidas alcohólicas', 'Agua', 'Zumos'] },
        { id: 'transport', name: 'Transporte', subcategories: ['Gasolina', 'Transporte público', 'Taxi/Uber', 'Mantenimiento', 'Parking', 'Peaje', 'Seguro de coche', 'Reparaciones', 'Bicicleta', 'Scooter', 'Vuelos', 'Tren', 'Autobús', 'Metro', 'Tranvía', 'Barco', 'Ferry', 'Alquiler de coche', 'ITV', 'Impuesto de circulación'] },
        { id: 'housing', name: 'Vivienda', subcategories: ['Alquiler/Hipoteca', 'Servicios', 'Mantenimiento', 'Decoración', 'Limpieza', 'Jardinería', 'Reparaciones', 'Mejoras', 'Muebles', 'Electrodomésticos', 'Seguro del hogar', 'Comunidad', 'IBI/Impuestos', 'Luz', 'Agua', 'Gas', 'Calefacción', 'Aire acondicionado', 'Internet', 'Teléfono fijo', 'Basura', 'Reciclaje'] },
        { id: 'health', name: 'Salud', subcategories: ['Médico', 'Farmacia', 'Gimnasio', 'Seguro médico', 'Dentista', 'Óptica', 'Fisioterapia', 'Psicólogo', 'Nutricionista', 'Medicinas', 'Análisis', 'Especialistas', 'Urgencias', 'Hospital', 'Ambulancia', 'Prótesis', 'Ortodoncia', 'Cirugía', 'Rehabilitación', 'Terapias alternativas'] },
        { id: 'entertainment', name: 'Entretenimiento', subcategories: ['Cine', 'Streaming', 'Eventos', 'Hobbies', 'Conciertos', 'Teatro', 'Museos', 'Videojuegos', 'Libros', 'Revistas', 'Juegos de mesa', 'Deportes', 'Viajes', 'Vacaciones', 'Parques temáticos', 'Zoo', 'Acuario', 'Excursiones', 'Camping', 'Deportes acuáticos', 'Ski', 'Golf'] },
        { id: 'shopping', name: 'Compras', subcategories: ['Ropa', 'Electrónica', 'Hogar', 'Otros', 'Zapatos', 'Accesorios', 'Joyería', 'Cosméticos', 'Herramientas', 'Bricolaje', 'Jardín', 'Mascotas', 'Regalos', 'Libros', 'Música', 'Películas', 'Juguetes', 'Deportes', 'Fotografía', 'Arte', 'Antigüedades'] },
        { id: 'education', name: 'Educación', subcategories: ['Cursos', 'Libros', 'Materiales', 'Matrícula', 'Universidad', 'Máster', 'Idiomas', 'Formación online', 'Seminarios', 'Conferencias', 'Material escolar', 'Uniforme', 'Becas', 'Tutorías', 'Clases particulares', 'Certificaciones', 'Exámenes', 'Biblioteca', 'Software educativo'] },
        { id: 'bills', name: 'Facturas', subcategories: ['Internet', 'Teléfono', 'Luz', 'Agua', 'Otros servicios', 'Gas', 'Calefacción', 'Basura', 'TV/Cable', 'Streaming servicios', 'Suscripciones', 'Banco', 'Seguros', 'Teléfono móvil', 'Datos móviles', 'Servicios de nube', 'Hosting', 'Dominio', 'Software', 'Licencias'] },
        { id: 'insurance', name: 'Seguros', subcategories: ['Seguro de coche', 'Seguro de hogar', 'Seguro de vida', 'Seguro de salud', 'Otros seguros', 'Seguro de viaje', 'Seguro de mascota', 'Seguro de responsabilidad civil', 'Seguro de accidentes', 'Seguro de invalidez', 'Seguro de desempleo', 'Seguro de negocio'] },
        { id: 'fines', name: 'Multas y Sanciones', subcategories: ['Multa de tráfico', 'Multa administrativa', 'Sanción', 'Otros', 'Aparcamiento', 'Velocidad', 'ITV', 'Impuestos atrasados', 'Multa de estacionamiento', 'Multa de tránsito', 'Multa municipal', 'Sanciones de tráfico'] },
        { id: 'personal', name: 'Personal', subcategories: ['Cuidado personal', 'Ropa', 'Regalos', 'Otros', 'Peluquería', 'Estética', 'Spa', 'Masajes', 'Cosméticos', 'Perfumes', 'Cumpleaños', 'Aniversarios', 'Bodas', 'Manicura', 'Pedicura', 'Depilación', 'Tatuajes', 'Piercings', 'Gafas', 'Lentes de contacto'] },
        { id: 'subscriptions', name: 'Suscripciones', subcategories: ['Netflix', 'Spotify', 'Amazon Prime', 'Disney+', 'HBO', 'Gimnasio', 'Revistas', 'Software', 'Cloud storage', 'Apps', 'Newsletters', 'Clubes', 'Apple Music', 'YouTube Premium', 'Adobe Creative', 'Microsoft 365', 'Dropbox', 'iCloud', 'Google Drive', 'Clubes deportivos', 'Bibliotecas digitales'] },
        { id: 'charity', name: 'Donaciones y Caridad', subcategories: ['ONG', 'Caridad', 'Donaciones', 'Ayuda humanitaria', 'Fundaciones', 'Crowdfunding', 'Voluntariado', 'Ayuda a refugiados', 'Protección animal', 'Medio ambiente', 'Educación', 'Salud', 'Investigación'] },
        { id: 'taxes', name: 'Impuestos', subcategories: ['IRPF', 'IVA', 'IBI', 'Impuesto de circulación', 'Impuesto de sucesiones', 'Otros impuestos', 'Impuesto de sociedades', 'Impuesto de actividades económicas', 'Impuesto sobre vehículos', 'Tasas municipales', 'Multas fiscales'] },
        { id: 'debt', name: 'Deudas y Préstamos', subcategories: ['Pago de préstamo', 'Tarjeta de crédito', 'Hipoteca', 'Intereses', 'Comisiones bancarias', 'Refinanciación', 'Préstamo personal', 'Préstamo de coche', 'Préstamo estudiantil', 'Microcréditos', 'Préstamos rápidos'] },
        { id: 'pets', name: 'Mascotas', subcategories: ['Veterinario', 'Comida', 'Juguetes', 'Accesorios', 'Peluquería', 'Seguro de mascota', 'Medicinas', 'Vacunas', 'Guardería', 'Adiestramiento', 'Pensión', 'Cuidados especiales'] },
        { id: 'children', name: 'Niños', subcategories: ['Guardería', 'Colegio', 'Actividades extraescolares', 'Juguetes', 'Ropa', 'Material escolar', 'Cumpleaños', 'Regalos', 'Cuidados', 'Medicinas', 'Vacunas', 'Deportes', 'Música', 'Arte'] },
        { id: 'other', name: 'Otros', subcategories: ['Varios', 'Imprevistos', 'Gastos no categorizados', 'Transferencias', 'Comisiones', 'Pérdidas', 'Gastos varios', 'Emergencias', 'Reparaciones varias'] }
    ],
    income: [
        { id: 'salary', name: 'Salario', subcategories: ['Nómina', 'Pago mensual', 'Pago quincenal', 'Pago semanal', 'Pago diario', 'Horas extras', 'Bonus', 'Comisiones', 'Incentivos', 'Vacaciones pagadas', 'Plus de productividad', 'Plus de antigüedad', 'Dietas', 'Kilometraje'] },
        { id: 'freelance', name: 'Freelance', subcategories: ['Proyecto', 'Hora', 'Servicio', 'Otros', 'Consultoría', 'Diseño', 'Desarrollo', 'Escritura', 'Traducción', 'Marketing', 'Asesoría', 'Fotografía', 'Videografía', 'Diseño gráfico', 'Programación', 'Redacción', 'Edición', 'Community management'] },
        { id: 'investment', name: 'Inversiones', subcategories: ['Dividendos', 'Intereses', 'Renta', 'Ganancias', 'Acciones', 'Bonos', 'Fondos', 'Criptomonedas', 'Forex', 'Opciones', 'Futuros', 'Rentabilidad', 'Plusvalías', 'Rendimientos', 'Rentas de capital', 'Rentas inmobiliarias'] },
        { id: 'business', name: 'Negocio', subcategories: ['Ventas', 'Servicios', 'Comisiones', 'Otros', 'Ingresos por productos', 'Ingresos por servicios', 'Licencias', 'Franquicias', 'Royalties', 'Alquiler de maquinaria', 'Consultoría empresarial', 'Formación', 'Publicidad', 'Patrocinios'] },
        { id: 'gift', name: 'Regalos', subcategories: ['Cumpleaños', 'Navidad', 'Ocasión especial', 'Otros', 'Bodas', 'Aniversarios', 'Graduación', 'Bautizo', 'Comunión', 'Confirmación', 'Regalo de empresa', 'Regalo de amigos', 'Regalo familiar'] },
        { id: 'refund', name: 'Reembolsos', subcategories: ['Compra', 'Impuesto', 'Seguro', 'Otros', 'Devolución de producto', 'Reembolso de viaje', 'Reembolso médico', 'Reembolso de gastos', 'Reembolso de impuestos', 'Reembolso de seguro', 'Garantía', 'Devolución de garantía'] },
        { id: 'rental', name: 'Alquiler', subcategories: ['Propiedad', 'Habitación', 'Garaje', 'Otros', 'Alquiler de piso', 'Alquiler de casa', 'Alquiler de local', 'Alquiler de terreno', 'Alquiler de vehículo', 'Alquiler de maquinaria', 'Alquiler de equipos', 'Alquiler de espacios', 'Parking', 'Trastero'] },
        { id: 'pension', name: 'Pensión', subcategories: ['Jubilación', 'Invalidez', 'Viudedad', 'Orfandad', 'Pensión alimenticia', 'Pensión no contributiva', 'Pensión de viudedad', 'Pensión de orfandad', 'Pensión de invalidez permanente', 'Pensión de jubilación anticipada'] },
        { id: 'benefits', name: 'Prestaciones', subcategories: ['Desempleo', 'Baja médica', 'Maternidad', 'Paternidad', 'Ayudas sociales', 'Subsidios', 'Becas', 'Ayuda familiar', 'Renta mínima', 'Ayuda al alquiler', 'Subsidio de desempleo', 'Prestación por incapacidad', 'Ayuda por dependencia'] },
        { id: 'lottery', name: 'Lotería y Apuestas', subcategories: ['Lotería', 'Apuestas', 'Casino', 'Premios', 'Sorteos', 'Bingo', 'Rascas', 'Lotería de Navidad', 'Euromillones', 'Primitiva', 'Bonoloto', 'Ganancias de casino'] },
        { id: 'sale', name: 'Ventas', subcategories: ['Venta de objetos', 'Venta de vehículo', 'Venta de propiedad', 'Venta de acciones', 'Venta de artículos usados', 'Venta online', 'Venta de muebles', 'Venta de electrónica', 'Venta de ropa', 'Venta de libros', 'Venta de coleccionables', 'Venta de arte'] },
        { id: 'other', name: 'Otros', subcategories: ['Varios', 'Imprevistos', 'Ingresos no categorizados', 'Transferencias recibidas', 'Herencia', 'Indemnización', 'Compensación', 'Subvención', 'Ayuda económica', 'Préstamo recibido', 'Ingresos varios'] }
    ],
    // Mantener compatibilidad con código antiguo
    general: [
        { id: 'food', name: 'Alimentación', subcategories: ['Supermercado', 'Restaurantes', 'Delivery', 'Café', 'Bebidas', 'Comida rápida', 'Mercado local', 'Tienda de conveniencia', 'Catering', 'Almuerzo de trabajo', 'Desayuno', 'Merienda', 'Cena', 'Snacks', 'Bebidas alcohólicas', 'Agua', 'Zumos'] },
        { id: 'transport', name: 'Transporte', subcategories: ['Gasolina', 'Transporte público', 'Taxi/Uber', 'Mantenimiento', 'Parking', 'Peaje', 'Seguro de coche', 'Reparaciones', 'Bicicleta', 'Scooter', 'Vuelos', 'Tren', 'Autobús', 'Metro', 'Tranvía', 'Barco', 'Ferry', 'Alquiler de coche', 'ITV', 'Impuesto de circulación'] },
        { id: 'housing', name: 'Vivienda', subcategories: ['Alquiler/Hipoteca', 'Servicios', 'Mantenimiento', 'Decoración', 'Limpieza', 'Jardinería', 'Reparaciones', 'Mejoras', 'Muebles', 'Electrodomésticos', 'Seguro del hogar', 'Comunidad', 'IBI/Impuestos', 'Luz', 'Agua', 'Gas', 'Calefacción', 'Aire acondicionado', 'Internet', 'Teléfono fijo', 'Basura', 'Reciclaje'] },
        { id: 'health', name: 'Salud', subcategories: ['Médico', 'Farmacia', 'Gimnasio', 'Seguro médico', 'Dentista', 'Óptica', 'Fisioterapia', 'Psicólogo', 'Nutricionista', 'Medicinas', 'Análisis', 'Especialistas', 'Urgencias', 'Hospital', 'Ambulancia', 'Prótesis', 'Ortodoncia', 'Cirugía', 'Rehabilitación', 'Terapias alternativas'] },
        { id: 'entertainment', name: 'Entretenimiento', subcategories: ['Cine', 'Streaming', 'Eventos', 'Hobbies', 'Conciertos', 'Teatro', 'Museos', 'Videojuegos', 'Libros', 'Revistas', 'Juegos de mesa', 'Deportes', 'Viajes', 'Vacaciones', 'Parques temáticos', 'Zoo', 'Acuario', 'Excursiones', 'Camping', 'Deportes acuáticos', 'Ski', 'Golf'] },
        { id: 'shopping', name: 'Compras', subcategories: ['Ropa', 'Electrónica', 'Hogar', 'Otros', 'Zapatos', 'Accesorios', 'Joyería', 'Cosméticos', 'Herramientas', 'Bricolaje', 'Jardín', 'Mascotas', 'Regalos', 'Libros', 'Música', 'Películas', 'Juguetes', 'Deportes', 'Fotografía', 'Arte', 'Antigüedades'] },
        { id: 'education', name: 'Educación', subcategories: ['Cursos', 'Libros', 'Materiales', 'Matrícula', 'Universidad', 'Máster', 'Idiomas', 'Formación online', 'Seminarios', 'Conferencias', 'Material escolar', 'Uniforme', 'Becas', 'Tutorías', 'Clases particulares', 'Certificaciones', 'Exámenes', 'Biblioteca', 'Software educativo'] },
        { id: 'bills', name: 'Facturas', subcategories: ['Internet', 'Teléfono', 'Luz', 'Agua', 'Otros servicios', 'Gas', 'Calefacción', 'Basura', 'TV/Cable', 'Streaming servicios', 'Suscripciones', 'Banco', 'Seguros', 'Teléfono móvil', 'Datos móviles', 'Servicios de nube', 'Hosting', 'Dominio', 'Software', 'Licencias'] },
        { id: 'personal', name: 'Personal', subcategories: ['Cuidado personal', 'Ropa', 'Regalos', 'Otros', 'Peluquería', 'Estética', 'Spa', 'Masajes', 'Cosméticos', 'Perfumes', 'Cumpleaños', 'Aniversarios', 'Bodas', 'Manicura', 'Pedicura', 'Depilación', 'Tatuajes', 'Piercings', 'Gafas', 'Lentes de contacto'] },
        { id: 'other', name: 'Otros', subcategories: ['Varios', 'Imprevistos', 'Gastos no categorizados', 'Transferencias', 'Comisiones', 'Pérdidas', 'Gastos varios', 'Emergencias', 'Reparaciones varias'] }
    ]
};


// Estado de la aplicación
let transactions = [];
let envelopes = [];
let budgets = [];
let accounts = [];
let properties = [];
let patrimonio = [];
let loans = [];
let investments = [];
let charts = {};
let currentUser = null;
let currentUserEmail = null;
let authToken = null;
let summaryPeriod = 'year'; // 'month', 'year', 'all'

// Variables para debounce y cache
let filterDebounceTimeouts = {};
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

// Utilidad para hacer peticiones autenticadas
async function apiRequest(endpoint, options = {}) {
    // Asegurarse de que el token esté cargado desde localStorage
    if (!authToken) {
        authToken = localStorage.getItem('veedor_token');
    }
    
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
    } else if (endpoint !== '/login' && endpoint !== '/register' && endpoint !== '/forgot-password' && endpoint !== '/reset-password') {
        console.warn('⚠️ No hay token disponible para la petición a:', endpoint);
    }

    try {
        
        const response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers
        });

        let data;
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            data = await response.json();
        } else {
            const text = await response.text();
            throw new Error(text || 'Error en la respuesta del servidor');
        }

        if (response.status === 401 || response.status === 403) {
            logout();
            throw new Error('Sesión expirada');
        }
        
        if (!response.ok) {
            throw new Error(data.error || `Error ${response.status}: ${response.statusText}`);
        }

        return data;
    } catch (error) {
        if (error.message) {
            throw error;
        }
        throw new Error('Error de conexión. Verifica tu internet y que el servidor esté funcionando.');
    }
}

// ==================== SISTEMA DE NOTIFICACIONES TOAST ====================
function showToast(message, type = 'info', duration = 5000) {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    
    const toast = document.createElement('div');
    const isDark = document.body.classList.contains('dark-mode');
    
    const colors = {
        success: { 
            border: '#10b981', 
            bg: isDark ? 'rgba(16, 185, 129, 0.15)' : '#f0fdf4', 
            icon: '✅', 
            text: isDark ? '#10b981' : '#065f46' 
        },
        error: { 
            border: '#ef4444', 
            bg: isDark ? 'rgba(239, 68, 68, 0.15)' : '#fef2f2', 
            icon: '❌', 
            text: isDark ? '#ef4444' : '#991b1b' 
        },
        warning: { 
            border: '#f59e0b', 
            bg: isDark ? 'rgba(251, 191, 36, 0.15)' : '#fffbeb', 
            icon: '⚠️', 
            text: isDark ? '#fbbf24' : '#92400e' 
        },
        info: { 
            border: '#6366f1', 
            bg: isDark ? 'rgba(147, 51, 234, 0.15)' : '#f3e8ff', 
            icon: 'ℹ️', 
            text: isDark ? '#818cf8' : '#3730a3' 
        }
    };
    
    const style = colors[type] || colors.info;
    
    toast.style.cssText = `
        background: ${style.bg};
        padding: 16px 20px;
        border-radius: 12px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2), 0 4px 12px rgba(0, 0, 0, 0.15);
        display: flex;
        align-items: center;
        gap: 12px;
        min-width: 300px;
        max-width: 500px;
        pointer-events: auto;
        animation: slideInRight 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        border-left: 4px solid ${style.border};
        position: relative;
        overflow: hidden;
        z-index: 10002;
    `;
    
    toast.innerHTML = `
        <span style="font-size: 22px; flex-shrink: 0; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));">${style.icon}</span>
        <span style="flex: 1; color: ${style.text}; font-size: 15px; font-weight: 600; line-height: 1.5;">${message}</span>
        <button onclick="this.parentElement.remove()" style="background: none; border: none; color: ${style.text}; font-size: 20px; cursor: pointer; padding: 0; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; opacity: 0.7; transition: all 0.2s; border-radius: 4px;" onmouseover="this.style.opacity='1'; this.style.background='rgba(0,0,0,0.1)'" onmouseout="this.style.opacity='0.7'; this.style.background='transparent'">×</button>
    `;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// Exponer función global
window.showToast = showToast;

// ==================== SISTEMA DE CONFIRMACIÓN ====================
function showConfirm(title, message, confirmText = 'Confirmar', cancelText = 'Cancelar') {
    return new Promise((resolve) => {
        const modal = document.getElementById('confirmModal');
        const titleEl = document.getElementById('confirmModalTitle');
        const messageEl = document.getElementById('confirmModalMessage');
        const confirmBtn = document.getElementById('confirmModalConfirm');
        const cancelBtn = document.getElementById('confirmModalCancel');
        
        if (!modal || !titleEl || !messageEl || !confirmBtn || !cancelBtn) {
            resolve(false);
            return;
        }
        
        titleEl.textContent = title;
        messageEl.textContent = message;
        confirmBtn.textContent = confirmText;
        cancelBtn.textContent = cancelText;
        
        modal.style.display = 'flex';
        
        const handleConfirm = () => {
            modal.style.display = 'none';
            confirmBtn.onclick = null;
            cancelBtn.onclick = null;
            resolve(true);
        };
        
        const handleCancel = () => {
            modal.style.display = 'none';
            confirmBtn.onclick = null;
            cancelBtn.onclick = null;
            resolve(false);
        };
        
        confirmBtn.onclick = handleConfirm;
        cancelBtn.onclick = handleCancel;
        
        // Cerrar al hacer click fuera del modal
        modal.onclick = (e) => {
            if (e.target === modal) handleCancel();
        };
    });
}

// Exponer función global
window.showConfirm = showConfirm;

// ==================== INDICADORES DE CARGA ====================
function showLoader(text = 'Cargando...') {
    const loader = document.getElementById('globalLoader');
    const loaderText = document.getElementById('globalLoaderText');
    if (loader) {
        if (loaderText) loaderText.textContent = text;
        loader.style.display = 'flex';
    }
}

function hideLoader() {
    const loader = document.getElementById('globalLoader');
    if (loader) {
        loader.style.display = 'none';
    }
}

// Exponer funciones globales
window.showLoader = showLoader;
window.hideLoader = hideLoader;

// ==================== MODO OSCURO ====================
function toggleDarkMode() {
    const body = document.body;
    const html = document.documentElement;
    const isDark = body.classList.contains('dark-mode');
    
    if (isDark) {
        html.classList.remove('dark-mode');
        body.classList.remove('dark-mode');
        localStorage.setItem('veedor_darkMode', 'false');
        const toggleText = document.getElementById('darkModeToggleText');
        if (toggleText) toggleText.textContent = 'Modo Oscuro';
    } else {
        html.classList.add('dark-mode');
        body.classList.add('dark-mode');
        localStorage.setItem('veedor_darkMode', 'true');
        const toggleText = document.getElementById('darkModeToggleText');
        if (toggleText) toggleText.textContent = 'Modo Claro';
    }
    
    // Actualizar icono en welcome page
    updateAuthDarkModeIcon();
}

// Actualizar icono del botón de modo oscuro en welcome page
function updateAuthDarkModeIcon() {
    const authIcon = document.getElementById('authDarkModeIcon');
    if (authIcon) {
        const isDark = document.body.classList.contains('dark-mode');
        authIcon.textContent = isDark ? '☀' : '🌙';
    }
}

function initDarkMode() {
    const savedMode = localStorage.getItem('veedor_darkMode');
    // Por defecto, activar modo oscuro si no hay preferencia guardada
    if (savedMode === null || savedMode === 'true') {
        document.documentElement.classList.add('dark-mode');
        document.body.classList.add('dark-mode');
        const toggleText = document.getElementById('darkModeToggleText');
        if (toggleText) toggleText.textContent = 'Modo Claro';
        if (savedMode === null) {
            localStorage.setItem('veedor_darkMode', 'true');
        }
    } else {
        document.documentElement.classList.remove('dark-mode');
        document.body.classList.remove('dark-mode');
    }
    
    // Actualizar icono en welcome page
    updateAuthDarkModeIcon();
}

// ==================== TOGGLE FORMULARIOS ====================
function toggleForm(formId, buttonId) {
    const form = document.getElementById(formId);
    const button = document.getElementById(buttonId);
    const icon = document.getElementById(formId.replace('Form', 'FormIcon'));
    const text = document.getElementById(formId.replace('Form', 'FormText'));
    
    if (!form || !button) return;
    
    const isVisible = form.style.display !== 'none';
    
    if (isVisible) {
        // Ocultar formulario
        form.style.display = 'none';
        if (icon) icon.textContent = '➕';
        if (text) {
            const formNames = {
                'transactionForm': 'Nueva Transacción',
                'propertyForm': 'Nueva Propiedad',
                'accountForm': 'Nueva Cuenta',
                'loanForm': 'Nuevo Préstamo',
                'investmentForm': 'Nueva Inversión',
                'patrimonioForm': 'Nueva Propiedad',
                'budgetForm': 'Nuevo Presupuesto',
                'envelopeForm': 'Nuevo Sobre'
            };
            text.textContent = formNames[formId] || 'Nuevo';
        }
        // Resetear formulario si existe función
        const resetFunc = window['reset' + formId.charAt(0).toUpperCase() + formId.slice(1).replace('Form', 'Form')];
        if (resetFunc && typeof resetFunc === 'function') {
            resetFunc();
        }
    } else {
        // Mostrar formulario
        form.style.display = 'block';
        if (icon) icon.textContent = '➖';
        if (text) text.textContent = 'Cancelar';
        // Scroll suave al formulario
        setTimeout(() => {
            form.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
    }
}

// Exponer funciones globales
window.toggleDarkMode = toggleDarkMode;
window.updateAuthDarkModeIcon = updateAuthDarkModeIcon;
window.toggleForm = toggleForm;

// Inicialización - Ejecutar inmediatamente

// Establecer español como idioma por defecto al iniciar
if (!localStorage.getItem('veedor_language')) {
    localStorage.setItem('veedor_language', 'es');
    document.documentElement.lang = 'es';
}

function initializeApp() {
    // Inicializar modo oscuro primero
    initDarkMode();
    // Asegurar que el idioma esté en español por defecto
    if (!localStorage.getItem('veedor_language')) {
        localStorage.setItem('veedor_language', 'es');
        document.documentElement.lang = 'es';
    }
    checkAuth();
    initializeAuth();
}

// Intentar inicializar de inmediato (solo una vez)
if (!window.VEEDOR_INITIALIZED) {
    window.VEEDOR_INITIALIZED = true;
    
    // Función para inicializar cuando el DOM esté listo
    const initWhenReady = () => {
        // Verificar que los elementos críticos existan
        if (!document.getElementById('authScreen') && !document.getElementById('mainApp')) {
            // Si no hay elementos críticos, esperar un poco más
            setTimeout(initWhenReady, 50);
            return;
        }
        initializeApp();
    };
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initWhenReady);
    } else {
        // Si el DOM ya está cargado, usar un pequeño delay para asegurar que todo esté listo
        setTimeout(initWhenReady, 100);
    }
}

// Verificar autenticación
async function checkAuth() {
    authToken = localStorage.getItem('veedor_token');
    if (authToken) {
        try {
            const data = await apiRequest('/verify');
            currentUser = data.user.username || data.user.email;
            currentUserEmail = data.user.email;
            // Cargar datos del perfil
            userProfile = {
                firstName: data.user.firstName || '',
                lastName: data.user.lastName || '',
                age: data.user.age || null,
                phone: data.user.phone || '',
                address: data.user.address || '',
                city: data.user.city || '',
                country: data.user.country || '',
                birthDate: data.user.birthDate || null,
                notes: data.user.notes || ''
            };
            showMainApp();
            // updateCurrentDateDisplay(); // Removido - fecha ya no se muestra
            await loadUserData();
            initializeDate();
            initializeTabs();
            initializeForms();
            updateDisplay();
            initializeCharts();
            // Actualizar gráficas después de inicializarlas
            setTimeout(() => {
                updateCharts();
            }, 200);
            updateUserInfo();
            // Inicializar traducciones
            if (typeof updateTranslations === 'function') {
                updateTranslations();
            }
            // NO hacer scroll automático - el usuario decidirá dónde quiere ir
        } catch (error) {
            console.error('Error verificando autenticación:', error);
            logout();
        }
    } else {
        showAuthScreen();
        // Inicializar traducciones en la pantalla de auth también
        setTimeout(() => {
            if (typeof updateTranslations === 'function') {
                updateTranslations();
            }
        }, 300);
    }
}

// Inicializar sistema de autenticación
function initializeAuth() {
    console.log('Inicializando autenticación...');
    
    // Verificar que los elementos necesarios existan
    if (!document.getElementById('authScreen')) {
        console.warn('⚠️ authScreen no encontrado, esperando a que el DOM esté listo...');
        setTimeout(initializeAuth, 100);
        return;
    }
    
    // Tabs de autenticación
    const authTabs = document.querySelectorAll('.auth-tab-btn');
    console.log('Tabs encontrados:', authTabs.length);
    
    if (authTabs.length === 0) {
        console.warn('⚠️ No se encontraron tabs de autenticación');
        return;
    }
    
    authTabs.forEach(btn => {
        if (!btn) return;
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const targetTab = btn.getAttribute('data-auth-tab');
            console.log('🔄 Tab seleccionado:', targetTab);
            
            // Actualizar clases de tabs
            authTabs.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Mostrar/ocultar formularios de forma explícita
            const loginForm = document.getElementById('loginForm');
            const registerForm = document.getElementById('registerForm');
            const forgotPasswordForm = document.getElementById('forgotPasswordForm');
            
            // Ocultar formulario de recuperación siempre que se cambie de tab
            if (forgotPasswordForm) {
                forgotPasswordForm.style.display = 'none';
                forgotPasswordForm.classList.remove('active');
            }
            
            if (loginForm && registerForm) {
                if (targetTab === 'login') {
                    // Ocultar registro primero
                    registerForm.classList.remove('active');
                    registerForm.style.display = 'none';
                    registerForm.style.setProperty('display', 'none', 'important');
                    
                    // Mostrar login
                    loginForm.classList.add('active');
                    loginForm.style.display = 'block';
                    loginForm.style.setProperty('display', 'block', 'important');
                    
                    console.log('✅ Mostrando formulario de login');
                    console.log('🔍 Estado loginForm:', { 
                        display: loginForm.style.display, 
                        computed: window.getComputedStyle(loginForm).display,
                        hasActive: loginForm.classList.contains('active') 
                    });
                    console.log('🔍 Estado registerForm:', { 
                        display: registerForm.style.display,
                        computed: window.getComputedStyle(registerForm).display,
                        hasActive: registerForm.classList.contains('active') 
                    });
                } else if (targetTab === 'register') {
                    // Ocultar login primero
                    loginForm.classList.remove('active');
                    loginForm.style.display = 'none';
                    loginForm.style.setProperty('display', 'none', 'important');
                    
                    // Mostrar registro
                    registerForm.classList.add('active');
                    registerForm.style.display = 'block';
                    registerForm.style.setProperty('display', 'block', 'important');
                    
                    console.log('✅ Mostrando formulario de registro');
                    console.log('🔍 Estado loginForm:', { 
                        display: loginForm.style.display,
                        computed: window.getComputedStyle(loginForm).display,
                        hasActive: loginForm.classList.contains('active') 
                    });
                    console.log('🔍 Estado registerForm:', { 
                        display: registerForm.style.display,
                        computed: window.getComputedStyle(registerForm).display,
                        hasActive: registerForm.classList.contains('active') 
                    });
                }
            } else {
                console.error('❌ Formularios no encontrados:', { loginForm: !!loginForm, registerForm: !!registerForm });
            }
            
            // Limpiar errores
            const loginError = document.getElementById('loginError');
            const registerError = document.getElementById('registerError');
            if (loginError) loginError.textContent = '';
            if (registerError) registerError.textContent = '';
        });
    });
    
    // Formulario de login
    const loginFormElement = document.getElementById('loginFormElement');
    if (loginFormElement) {
        console.log('Agregando listener a loginFormElement');
        loginFormElement.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log('Formulario de login enviado');
            await login();
        });
    } else {
        console.error('❌ loginFormElement no encontrado');
    }
    
    // Formulario de registro - Múltiples formas de asegurar que funcione
    const registerFormElement = document.getElementById('registerFormElement');
    const registerButton = registerFormElement?.querySelector('button[type="submit"]');
    
    if (registerFormElement) {
        console.log('✅ registerFormElement encontrado');
        
        // Listener en el formulario (submit)
        registerFormElement.addEventListener('submit', async (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('✅ Formulario de registro enviado (submit event)');
            await register();
            return false;
        });
        
        // También listener directo en el botón por si acaso
        if (registerButton) {
            console.log('✅ Botón de registro encontrado, agregando listener adicional');
            registerButton.addEventListener('click', async (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('✅ Botón de registro clickeado');
                await register();
                return false;
            });
        }
    } else {
        console.error('❌ registerFormElement no encontrado');
        // Intentar de nuevo después de un momento
        setTimeout(() => {
            const retryForm = document.getElementById('registerFormElement');
            if (retryForm) {
                console.log('✅ registerFormElement encontrado en reintento');
                retryForm.addEventListener('submit', async (e) => {
                    e.preventDefault();
                    await register();
                });
            }
        }, 1000);
    }
    
    // Botón cambiar usuario
    const switchUserBtn = document.getElementById('switchUserBtn');
    if (switchUserBtn) {
        switchUserBtn.addEventListener('click', async () => {
            const confirmed = await showConfirm(
                'Cerrar Sesión',
                '¿Deseas cerrar sesión y cambiar de usuario?',
                'Cerrar Sesión',
                'Cancelar'
            );
            if (confirmed) {
                logout();
            }
        });
    }
    
    // Enlaces de recuperación de contraseña
    const forgotPasswordLink = document.getElementById('forgotPasswordLink');
    const backToLoginLink = document.getElementById('backToLoginLink');
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', (e) => {
            e.preventDefault();
            // Ocultar todos los formularios
            if (loginForm) {
                loginForm.style.display = 'none';
                loginForm.classList.remove('active');
            }
            if (registerForm) {
                registerForm.style.display = 'none';
                registerForm.classList.remove('active');
            }
            // Mostrar solo el formulario de recuperación
            if (forgotPasswordForm) {
                forgotPasswordForm.style.display = 'block';
                forgotPasswordForm.classList.add('active');
            }
        });
    }
    
    if (backToLoginLink) {
        backToLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            // Ocultar formulario de recuperación
            if (forgotPasswordForm) {
                forgotPasswordForm.style.display = 'none';
                forgotPasswordForm.classList.remove('active');
            }
            // Ocultar registro
            if (registerForm) {
                registerForm.style.display = 'none';
                registerForm.classList.remove('active');
            }
            // Mostrar solo login
            if (loginForm) {
                loginForm.style.display = 'block';
                loginForm.classList.add('active');
            }
        });
    } else {
        console.warn('⚠️ backToLoginLink no encontrado');
    }
    
    // Formulario de solicitud de token
    const forgotPasswordFormElement = document.getElementById('forgotPasswordFormElement');
    if (forgotPasswordFormElement) {
        forgotPasswordFormElement.addEventListener('submit', async (e) => {
            e.preventDefault();
            await requestPasswordReset();
        });
    } else {
        console.warn('⚠️ forgotPasswordFormElement no encontrado');
    }
    
    // Formulario de reset de contraseña
    const resetPasswordFormElement = document.getElementById('resetPasswordFormElement');
    if (resetPasswordFormElement) {
        resetPasswordFormElement.addEventListener('submit', async (e) => {
            e.preventDefault();
            await resetPassword();
        });
    } else {
        console.warn('⚠️ resetPasswordFormElement no encontrado');
    }
    
    console.log('Autenticación inicializada');
}

// Helper para obtener traducciones
function getTranslation(key, lang = null) {
    if (!lang) {
        lang = localStorage.getItem('veedor_language') || 'es';
    }
    if (window.t && typeof window.t === 'function') {
        return window.t(key, lang);
    }
    if (window.translations && window.translations[lang]) {
        const keys = key.split('.');
        let value = window.translations[lang];
        for (const k of keys) {
            value = value?.[k];
            if (!value) {
                // Fallback a español
                value = window.translations['es'];
                for (const k2 of keys) {
                    value = value?.[k2];
                }
                break;
            }
        }
        return value || key;
    }
    return key;
}

// Solicitar recuperación de contraseña
async function requestPasswordReset() {
    const email = document.getElementById('forgotEmail').value.trim();
    const errorMsg = document.getElementById('forgotPasswordError');
    const successMsg = document.getElementById('forgotPasswordSuccess');
    const resetSection = document.getElementById('resetPasswordSection');
    const lang = localStorage.getItem('veedor_language') || 'es';
    
    if (errorMsg) errorMsg.textContent = '';
    if (successMsg) successMsg.style.display = 'none';
    
    if (!email) {
        if (errorMsg) errorMsg.textContent = getTranslation('auth.pleaseEnterEmail', lang);
        return;
    }
    
    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        if (errorMsg) errorMsg.textContent = getTranslation('auth.pleaseEnterValidEmail', lang);
        return;
    }
    
    try {
        const data = await apiRequest('/forgot-password', {
            method: 'POST',
            body: JSON.stringify({ email })
        });
        
        if (successMsg) {
            if (data.token) {
                    // Mostrar código directamente (normal en Render plan gratuito)
                successMsg.innerHTML = `
                    <div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); padding: 10px; border-radius: 8px; border: 1px solid var(--primary); margin-bottom: 12px;">
                        <div style="display: flex; align-items: center; gap: 4px; margin-bottom: 6px;">
                            <span style="font-size: 16px;">✅</span>
                            <strong style="color: var(--gray-900); font-size: 13px;">Código generado (válido 1h)</strong>
                        </div>
                        <div style="background: var(--bg-primary); padding: 8px 10px; border-radius: 6px; border: 1px solid var(--primary); margin: 6px 0; display: flex; align-items: center; justify-content: space-between; gap: 6px; color: var(--text-primary);">
                            <code style="font-size: 10px; font-weight: 600; color: var(--primary); word-break: break-all; flex: 1; font-family: 'Courier New', monospace; line-height: 1.3;">${data.token}</code>
                            <button type="button" onclick="event.preventDefault(); event.stopPropagation(); const token = '${data.token}'; navigator.clipboard.writeText(token).then(() => { const btn = event.target; btn.textContent='Copiado'; setTimeout(() => { btn.textContent='Copiar'; }, 2000); }).catch(err => console.error('Error copiando:', err));" style="background: var(--primary); color: white; border: none; padding: 5px 8px; border-radius: 4px; cursor: pointer; font-size: 11px; flex-shrink: 0;" title="Copiar">Copiar</button>
                        </div>
                    </div>
                `;
                successMsg.style.display = 'block';
                if (resetSection) resetSection.style.display = 'block';
            } else {
                    // Email enviado correctamente - NO mostrar código
                    successMsg.innerHTML = `
                    <div style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); padding: 14px; border-radius: 10px; border: 1px solid #22c55e; margin-bottom: 14px;">
                        <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 8px;">
                            <span style="font-size: 20px;">✅</span>
                            <strong style="color: var(--gray-900); font-size: 14px;">Email de recuperación enviado</strong>
                        </div>
                        <p style="margin: 4px 0 8px 0; color: var(--gray-700); font-size: 13px; line-height: 1.4;">Hemos enviado un código de recuperación a tu email. Revisa tu bandeja de entrada y la carpeta de spam.</p>
                        <p style="margin: 8px 0 0 0; color: var(--gray-600); font-size: 12px; line-height: 1.3; font-style: italic;">El código expirará en 1 hora. Si no lo recibes en unos minutos, verifica tu carpeta de spam o solicita uno nuevo.</p>
                    </div>
                `;
                successMsg.style.display = 'block';
                    if (resetSection) resetSection.style.display = 'block';
            }
        }
    } catch (error) {
        console.error('Error en requestPasswordReset:', error);
        if (errorMsg) {
            errorMsg.textContent = error.message || getTranslation('auth.passwordResetRequestError', lang);
        }
    }
}

// Resetear contraseña
async function resetPassword() {
    const token = document.getElementById('resetToken').value.trim();
    const newPassword = document.getElementById('resetNewPassword').value;
    const errorMsg = document.getElementById('resetPasswordError');
    const lang = localStorage.getItem('veedor_language') || 'es';
    
    if (errorMsg) errorMsg.textContent = '';
    
    if (!token || !newPassword) {
        if (errorMsg) errorMsg.textContent = getTranslation('auth.pleaseCompleteAllFields', lang);
        return;
    }
    
    if (newPassword.length < 4) {
        if (errorMsg) errorMsg.textContent = getTranslation('auth.passwordMinLength', lang);
        return;
    }
    
    try {
        await apiRequest('/reset-password', {
            method: 'POST',
            body: JSON.stringify({ token, newPassword })
        });
        
        alert('✅ ' + getTranslation('auth.passwordResetSuccess', lang));
        const forgotForm = document.getElementById('forgotPasswordFormElement');
        const resetForm = document.getElementById('resetPasswordFormElement');
        if (forgotForm) forgotForm.reset();
        if (resetForm) resetForm.reset();
        const forgotPasswordForm = document.getElementById('forgotPasswordForm');
        const loginForm = document.getElementById('loginForm');
        if (forgotPasswordForm) forgotPasswordForm.style.display = 'none';
        if (loginForm) loginForm.style.display = 'block';
    } catch (error) {
        if (errorMsg) errorMsg.textContent = error.message || getTranslation('auth.passwordResetError', lang);
    }
}

// Registrar nuevo usuario
async function register() {
    console.log('=== FUNCIÓN REGISTER LLAMADA ===');
    
    const emailInput = document.getElementById('registerEmail');
    const usernameInput = document.getElementById('registerUsername');
    const passwordInput = document.getElementById('registerPassword');
    const passwordConfirmInput = document.getElementById('registerPasswordConfirm');
    const errorMsg = document.getElementById('registerError');
    
    if (!emailInput || !usernameInput || !passwordInput || !passwordConfirmInput || !errorMsg) {
        console.error('❌ Elementos del formulario no encontrados');
        alert('Error: Formulario no encontrado. Recarga la página.');
        return;
    }
    
    const email = emailInput.value.trim();
    const username = usernameInput.value.trim();
    const password = passwordInput.value;
    const passwordConfirm = passwordConfirmInput.value;
    
    console.log('Datos del formulario:', { email, username, passwordLength: password.length, passwordsMatch: password === passwordConfirm });
    
    errorMsg.textContent = '';
    
    const lang = localStorage.getItem('veedor_language') || 'es';
    
    if (!email) {
        errorMsg.textContent = getTranslation('auth.emailRequired', lang);
        console.log('Validación fallida: email vacío');
        return;
    }
    
    if (!username) {
        errorMsg.textContent = getTranslation('auth.usernameRequired', lang);
        console.log('Validación fallida: username vacío');
        return;
    }
    
    if (username.length < 3) {
        errorMsg.textContent = getTranslation('auth.usernameMinLength', lang);
        console.log('Validación fallida: username muy corto');
        return;
    }
    
    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        errorMsg.textContent = getTranslation('auth.pleaseEnterValidEmail', lang);
        console.log('Validación fallida: email inválido');
        return;
    }
    
    if (password !== passwordConfirm) {
        errorMsg.textContent = getTranslation('auth.passwordsDoNotMatch', lang);
        console.log('Validación fallida: contraseñas no coinciden');
        return;
    }
    
    if (password.length < 4) {
        errorMsg.textContent = getTranslation('auth.passwordMinLength', lang);
        console.log('Validación fallida: contraseña muy corta');
        return;
    }
    
    try {
        errorMsg.textContent = getTranslation('auth.registering', lang);
        errorMsg.style.color = 'var(--text-tertiary)';
        console.log('Enviando registro a:', `${API_URL}/register`);
        console.log('URL completa:', window.location.origin + API_URL + '/register');
        console.log('Datos:', { email, username, password: '***' });
        
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, username, password })
        });
        
        console.log('Respuesta recibida. Status:', response.status);
        console.log('Headers:', Object.fromEntries(response.headers.entries()));
        
        let data;
        try {
            const text = await response.text();
            console.log('Respuesta texto:', text);
            data = JSON.parse(text);
            console.log('Datos de respuesta parseados:', data);
        } catch (parseError) {
            console.error('Error parseando JSON:', parseError);
            throw new Error(`Error del servidor: ${response.status} ${response.statusText}`);
        }
        
        if (!response.ok) {
            throw new Error(data.error || `Error ${response.status}: ${response.statusText}`);
        }
        
        console.log('✅ Registro exitoso');
        authToken = data.token;
        currentUser = data.user.username || data.user.email;
        currentUserEmail = data.user.email;
        // Cargar datos del perfil
        userProfile = {
            firstName: data.user.firstName || '',
            lastName: data.user.lastName || '',
            age: data.user.age || null,
            phone: data.user.phone || '',
            address: data.user.address || '',
            city: data.user.city || '',
            country: data.user.country || '',
            birthDate: data.user.birthDate || null,
            notes: data.user.notes || ''
        };
        localStorage.setItem('veedor_token', authToken);
        
        showMainApp();
        await loadUserData();
        initializeDate();
        initializeTabs();
        initializeForms();
        updateDisplay();
        initializeCharts();
        updateUserInfo();
        
        const form = document.getElementById('registerFormElement');
        if (form) form.reset();
    } catch (error) {
        console.error('❌ Error en registro:', error);
        console.error('Stack:', error.stack);
        const lang = localStorage.getItem('veedor_language') || 'es';
        errorMsg.textContent = error.message || getTranslation('auth.registerError', lang);
        errorMsg.style.color = '#ef4444';
    }
}

// Iniciar sesión
async function login() {
    const emailOrUsernameInput = document.getElementById('loginEmailOrUsername');
    if (!emailOrUsernameInput) {
        console.error('Campo loginEmailOrUsername no encontrado');
        return;
    }
    const emailOrUsername = emailOrUsernameInput.value.trim();
    const password = document.getElementById('loginPassword').value;
    const errorMsg = document.getElementById('loginError');
    
    errorMsg.textContent = '';
    
    const lang = localStorage.getItem('veedor_language') || 'es';
    
    if (!emailOrUsername) {
        errorMsg.textContent = getTranslation('auth.pleaseEnterEmailOrUsername', lang);
        return;
    }
    
    try {
        const data = await apiRequest('/login', {
            method: 'POST',
            body: JSON.stringify({ emailOrUsername, password })
        });
        
        authToken = data.token;
        currentUser = data.user.username || data.user.email;
        currentUserEmail = data.user.email;
        // Cargar datos del perfil
        userProfile = {
            firstName: data.user.firstName || '',
            lastName: data.user.lastName || '',
            age: data.user.age || null,
            phone: data.user.phone || '',
            address: data.user.address || '',
            city: data.user.city || '',
            country: data.user.country || '',
            birthDate: data.user.birthDate || null,
            notes: data.user.notes || ''
        };
        localStorage.setItem('veedor_token', authToken);
        
        showMainApp();
        // updateCurrentDateDisplay(); // Removido - fecha ya no se muestra
        await loadUserData();
        initializeDate();
        initializeTabs();
        initializeForms();
        updateDisplay();
        initializeCharts();
        updateUserInfo();
        
        document.getElementById('loginFormElement').reset();
    } catch (error) {
        const lang = localStorage.getItem('veedor_language') || 'es';
        errorMsg.textContent = error.message || getTranslation('auth.loginError', lang);
    }
}

// Cerrar sesión
function logout() {
    currentUser = null;
    authToken = null;
    localStorage.removeItem('veedor_token');
    transactions = [];
    envelopes = [];
    showAuthScreen();
    document.getElementById('loginFormElement').reset();
    document.getElementById('registerFormElement').reset();
}

// Mostrar pantalla de autenticación
function showAuthScreen() {
    const authScreen = document.getElementById('authScreen');
    const mainApp = document.getElementById('mainApp');
    if (authScreen) {
        authScreen.style.display = 'flex';
        // Ocultar footer en welcome page
        const footer = document.getElementById('mainFooter');
        if (footer) footer.style.display = 'none';
    }
    if (mainApp) {
        mainApp.style.display = 'none';
    }
    
    // Asegurar que los formularios estén visibles
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    if (loginForm) loginForm.style.display = 'block';
    if (registerForm) registerForm.style.display = 'none';
}

// Mostrar aplicación principal
function showMainApp() {
    document.getElementById('authScreen').style.display = 'none';
    document.getElementById('mainApp').style.display = 'block';
    // Mostrar footer en la app principal
    const footer = document.getElementById('mainFooter');
    if (footer) footer.style.display = 'block';
    // updateCurrentDateDisplay(); // Removido - fecha ya no se muestra
}

// Actualizar información del usuario
function updateUserInfo() {
    const currentUserTextEl = document.getElementById('currentUserText');
    if (currentUserTextEl) {
        let displayName = 'Usuario';
        if (userProfile && (userProfile.firstName || userProfile.lastName)) {
            displayName = `${userProfile.firstName || ''} ${userProfile.lastName || ''}`.trim();
        } else if (currentUser) {
            displayName = currentUser;
        }
        currentUserTextEl.textContent = displayName;
        console.log('✅ Nombre de usuario actualizado:', displayName);
    } else {
        console.warn('⚠️ Elemento currentUserText no encontrado');
    }
}

// Cargar datos del usuario actual
async function loadUserData() {
    try {
        // Intentar cargar desde caché primero
        const cacheKey = `veedor_data_cache_${currentUser}`;
        const cachedData = sessionStorage.getItem(cacheKey);
        if (cachedData) {
            try {
                const parsed = JSON.parse(cachedData);
                const cacheAge = Date.now() - parsed.timestamp;
                // Usar caché si tiene menos de 30 segundos
                if (cacheAge < 30000 && parsed.data) {
                    transactions = parsed.data.transactions || [];
                    envelopes = parsed.data.envelopes || [];
                    loans = parsed.data.loans || [];
                    investments = parsed.data.investments || [];
                    budgets = parsed.data.budgets || [];
                    accounts = parsed.data.accounts || [];
                    patrimonio = parsed.data.patrimonio || [];
                    
                    // Actualizar selectores
                    updateAccountSelect();
                    updatePatrimonioSelect();
                    updateLoanSelect();
                    updateInvestmentSelect();
                    
                    // Cargar datos frescos en segundo plano
                    loadUserDataFresh();
                    return;
                }
            } catch (e) {
                // Si hay error con el caché, continuar con carga normal
            }
        }
        
        // Cargar todos los datos en paralelo para mejor rendimiento
        await loadUserDataFresh();
    } catch (error) {
        console.error('Error cargando datos:', error);
        transactions = [];
        envelopes = [];
    }
}

// Cargar datos frescos del servidor
async function loadUserDataFresh() {
    try {
        // Hacer todas las llamadas en paralelo
        const [
            transactionsData,
            envelopesData,
            loansData,
            investmentsData,
            budgetsData,
            accountsData,
            patrimonioData,
            profileData
        ] = await Promise.allSettled([
            apiRequest('/transactions'),
            apiRequest('/envelopes'),
            apiRequest('/loans'),
            apiRequest('/investments').catch(() => []),
            apiRequest('/budgets').catch(() => []),
            apiRequest('/accounts').catch(() => []),
            apiRequest('/patrimonio').catch(() => []),
            apiRequest('/user/profile').catch(() => null)
        ]);
        
        // Procesar transacciones
        transactions = transactionsData.status === 'fulfilled' 
            ? transactionsData.value.map(t => ({
                ...t,
                categoryGeneral: t.category_general,
                categorySpecific: t.category_specific
            }))
            : [];
        
        envelopes = envelopesData.status === 'fulfilled' ? envelopesData.value : [];
        loans = loansData.status === 'fulfilled' ? loansData.value : [];
        investments = investmentsData.status === 'fulfilled' ? (investmentsData.value || []) : [];
        budgets = budgetsData.status === 'fulfilled' ? (budgetsData.value || []) : [];
        accounts = accountsData.status === 'fulfilled' ? (accountsData.value || []) : [];
        patrimonio = patrimonioData.status === 'fulfilled' ? (patrimonioData.value || []) : [];
        
        // Procesar perfil
        if (profileData.status === 'fulfilled' && profileData.value) {
            if (profileData.value.savingsGoal !== undefined) {
                savingsGoal = profileData.value.savingsGoal;
            }
        } else {
            // Fallback a localStorage si existe (migración)
            const savedGoal = localStorage.getItem('veedor_savingsGoal');
            if (savedGoal) {
                try {
                    savingsGoal = parseFloat(savedGoal);
                    // Migrar a la BD en segundo plano
                    apiRequest('/user/profile', {
                        method: 'PUT',
                        body: JSON.stringify({ savingsGoal })
                    }).then(() => {
                        localStorage.removeItem('veedor_savingsGoal');
                    }).catch(() => {});
                } catch (e) {
                    savingsGoal = null;
                }
            }
        }
        
        // Actualizar selectores después de cargar datos
        updateAccountSelect();
        updatePatrimonioSelect();
        updateLoanSelect();
        updateInvestmentSelect();
        
        // Guardar en cache
        const cacheKey = `veedor_data_cache_${currentUser}`;
        const cacheData = {
            transactions,
            envelopes,
            loans,
            investments,
            budgets,
            accounts,
            patrimonio
        };
        sessionStorage.setItem(cacheKey, JSON.stringify({
            data: cacheData,
            timestamp: Date.now()
        }));
    } catch (error) {
        console.error('Error cargando datos frescos:', error);
    }
}

// Guardar datos del usuario actual (ya no necesario, se guarda automáticamente)
function saveData() {
    // Los datos se guardan automáticamente al crear/eliminar
}

// Inicializar fecha por defecto
function initializeDate() {
    const dateInput = document.getElementById('transactionDate');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.value = today;
    }
    
    // Actualizar indicador de fecha actual en el header
    // updateCurrentDateDisplay(); // Removido - fecha ya no se muestra
}

// Actualizar fecha actual en el header
function updateCurrentDateDisplay() {
    const dateDisplay = document.getElementById('currentDateText');
    if (dateDisplay) {
        const now = new Date();
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        dateDisplay.textContent = now.toLocaleDateString('es-ES', options);
    }
}

// Toggle del menú desplegable principal de navegación
function toggleMainNavDropdown() {
    const dropdown = document.getElementById('mainNavDropdown');
    const settingsDropdown = document.getElementById('settingsDropdown');
    if (dropdown) {
        dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
    }
    // Cerrar settings dropdown si está abierto
    if (settingsDropdown && settingsDropdown.style.display === 'block') {
        settingsDropdown.style.display = 'none';
    }
}

function toggleSettingsDropdown() {
    const dropdown = document.getElementById('settingsDropdown');
    const mainNavDropdown = document.getElementById('mainNavDropdown');
    if (dropdown) {
        dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
    }
    // Cerrar navegación dropdown si está abierto
    if (mainNavDropdown && mainNavDropdown.style.display === 'block') {
        mainNavDropdown.style.display = 'none';
    }
}

// Toggle del menú desplegable de Resumen (mantener para compatibilidad)
function toggleDashboardDropdown() {
    toggleMainNavDropdown(); // Redirigir al menú principal
}

// Cerrar dropdown al hacer clic fuera
document.addEventListener('click', function(event) {
    const mainDropdown = document.getElementById('mainNavDropdown');
    const mainBtn = document.getElementById('mainNavDropdownBtn');
    const dashboardDropdown = document.getElementById('dashboardDropdown');
    const dashboardBtn = document.getElementById('dashboardDropdownBtn');
    
    if (mainDropdown && mainBtn && !mainDropdown.contains(event.target) && !mainBtn.contains(event.target)) {
        mainDropdown.style.display = 'none';
    }
    
    const settingsDropdown = document.getElementById('settingsDropdown');
    const settingsBtn = document.getElementById('settingsDropdownBtn');
    
    if (settingsDropdown && settingsBtn && !settingsDropdown.contains(event.target) && !settingsBtn.contains(event.target)) {
        settingsDropdown.style.display = 'none';
    }
    
    if (dashboardDropdown && dashboardBtn && !dashboardDropdown.contains(event.target) && !dashboardBtn.contains(event.target)) {
        dashboardDropdown.style.display = 'none';
    }
    
    // Cerrar dropdowns de idioma
    const languageDropdown = document.getElementById('languageDropdown');
    const languageBtn = document.getElementById('languageDropdownBtn');
    if (languageDropdown && languageBtn && !languageDropdown.contains(event.target) && !languageBtn.contains(event.target)) {
        languageDropdown.style.display = 'none';
    }
    
    const authLanguageDropdown = document.getElementById('authLanguageDropdown');
    const authLanguageBtn = document.getElementById('authLanguageDropdownBtn');
    if (authLanguageDropdown && authLanguageBtn && !authLanguageDropdown.contains(event.target) && !authLanguageBtn.contains(event.target)) {
        authLanguageDropdown.style.display = 'none';
    }
});

// Mostrar análisis del mes seleccionado
function showMonthDashboard() {
    const monthDashboard = document.getElementById('monthDashboard');
    const monthAnalysisSelector = document.getElementById('monthAnalysisSelector');
    const dashboardMonthInput = document.getElementById('dashboardMonth');
    
    if (!monthDashboard || !dashboardMonthInput) {
        console.error('No se encontró monthDashboard o dashboardMonthInput');
        return;
    }
    
    // Mostrar el selector de análisis del mes
    if (monthAnalysisSelector) {
        monthAnalysisSelector.style.display = 'block';
    }
    
    // Si no hay mes seleccionado, establecer el mes actual
    if (!dashboardMonthInput.value) {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        dashboardMonthInput.value = `${year}-${month}`;
    }
    
    // Mostrar el panel
    monthDashboard.style.display = 'block';
    
    // Actualizar el contenido del panel
    updateMonthDashboard();
    
    // Hacer scroll al dashboard
    setTimeout(() => {
        const dashboard = document.querySelector('.dashboard');
        if (dashboard) {
            const rect = dashboard.getBoundingClientRect();
            const header = document.querySelector('header');
            const headerHeight = header ? header.offsetHeight : 80;
            const scrollPosition = rect.top + window.pageYOffset - headerHeight - 20;
            window.scrollTo({ 
                top: Math.max(0, scrollPosition), 
                behavior: 'smooth' 
            });
        }
    }, 300);
}

// Scroll al dashboard principal
function scrollToDashboard() {
    const dashboard = document.querySelector('.dashboard');
    if (dashboard) {
        dashboard.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Exponer funciones globalmente
window.toggleMainNavDropdown = toggleMainNavDropdown;
window.toggleDashboardDropdown = toggleDashboardDropdown;
window.showMonthDashboard = showMonthDashboard;
window.scrollToDashboard = scrollToDashboard;
window.switchToTab = switchToTab;

// Inicializar categorías
function initializeCategories() {
    const generalSelect = document.getElementById('categoryGeneral');
    const specificSelect = document.getElementById('categorySpecific');
    const filterCategory = document.getElementById('filterCategory');
    const transactionType = document.getElementById('transactionType');
    
    if (!generalSelect || !specificSelect) return;
    
    function updateGeneralCategories() {
        const type = transactionType ? transactionType.value : 'expense';
        const categoryList = type === 'income' ? categories.income : categories.expense;
        
        generalSelect.innerHTML = '<option value="">Seleccionar...</option>';
        specificSelect.innerHTML = '<option value="">Seleccionar...</option>';
        
        categoryList.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.id;
            option.textContent = cat.name;
            generalSelect.appendChild(option);
        });
        
        if (filterCategory) {
            filterCategory.innerHTML = '<option value="">Todas las categorías</option>';
            categoryList.forEach(cat => {
                const option = document.createElement('option');
                option.value = cat.id;
                option.textContent = cat.name;
                filterCategory.appendChild(option);
            });
        }
    }
    
    function updateSpecificCategories() {
        const selectedGeneral = generalSelect.value;
        specificSelect.innerHTML = '<option value="">Seleccionar...</option>';
        
        if (!selectedGeneral) return;
        
        const type = transactionType ? transactionType.value : 'expense';
        const categoryList = type === 'income' ? categories.income : categories.expense;
        const category = categoryList.find(c => c.id === selectedGeneral);
        
        if (category && category.subcategories && category.subcategories.length > 0) {
            category.subcategories.forEach(sub => {
                const option = document.createElement('option');
                option.value = sub;
                option.textContent = sub;
                specificSelect.appendChild(option);
            });
        }
    }
    
    if (transactionType) {
        transactionType.onchange = updateGeneralCategories;
    }
    
    generalSelect.onchange = updateSpecificCategories;
    
    updateGeneralCategories();
}

// Función para cambiar de tab (reutilizable)
function switchToTab(targetTab, doScroll = false) {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const navItems = document.querySelectorAll('.nav-item');
    
    // Actualizar tabs principales
    tabButtons.forEach(b => b.classList.remove('active'));
    tabContents.forEach(c => c.classList.remove('active'));
    
    const targetTabBtn = document.querySelector(`.tab-btn[data-tab="${targetTab}"]`);
    const targetTabContent = document.getElementById(`${targetTab}-tab`);
    
    if (targetTabBtn) targetTabBtn.classList.add('active');
    if (targetTabContent) {
        targetTabContent.classList.add('active');
        // Solo hacer scroll si se solicita explícitamente (doScroll = true)
        if (doScroll) {
        // Scroll suave a la sección - esperar a que el DOM se actualice y el tab esté visible
        setTimeout(() => {
                if (targetTabContent) {
                // Obtener altura del header sticky
                const header = document.querySelector('header');
                const headerHeight = header ? header.offsetHeight : 80;
                
                    // Obtener posición del tab content
                    const tabRect = targetTabContent.getBoundingClientRect();
                    const scrollPosition = tabRect.top + window.pageYOffset - headerHeight - 20; // 20px de margen adicional
                
                    // Hacer scroll suave
                window.scrollTo({ 
                    top: Math.max(0, scrollPosition), 
                    behavior: 'smooth' 
                });
            }
            }, 100);
        }
    }
    
    // Actualizar items del dropdown
    const dropdownItems = document.querySelectorAll('.nav-dropdown-item[data-tab]');
    dropdownItems.forEach(item => {
        if (item.getAttribute('data-tab') === targetTab) {
            item.style.background = 'var(--primary-light)';
            item.style.color = 'var(--primary)';
            item.style.fontWeight = '600';
        } else {
            item.style.background = 'transparent';
            item.style.color = 'var(--gray-900)';
            item.style.fontWeight = '400';
        }
    });
    
    // Actualizar gráficas y análisis cuando se cambia al tab de análisis
    if (targetTab === 'charts') {
        setTimeout(() => {
            updateCharts();
        }, 100);
    }
    
    // Actualizar presupuestos cuando se cambia al tab de presupuestos
    if (targetTab === 'budgets') {
        setTimeout(() => {
            updateBudgets();
        }, 100);
    }
    
    // Actualizar cuentas cuando se cambia al tab de cuentas
    if (targetTab === 'accounts') {
        setTimeout(() => {
            updateAccounts();
        }, 100);
    }
    
    // Actualizar propiedades cuando se cambia al tab de propiedades
    if (targetTab === 'properties') {
        setTimeout(() => {
            updateProperties();
        }, 100);
    }
    
    // Actualizar patrimonio cuando se cambia al tab de patrimonio
    if (targetTab === 'assets') {
        setTimeout(() => {
            updatePatrimonio();
        }, 100);
    }
    
    // Actualizar préstamos cuando se cambia al tab de préstamos
    if (targetTab === 'loans') {
        setTimeout(() => {
            updateLoans();
            // Actualizar selectores en el formulario de préstamos
            updateAccountSelect('loanAccount');
            updatePatrimonioSelect('loanPatrimonio');
        }, 100);
    }
    
    // Actualizar inversiones cuando se cambia al tab de inversiones
    if (targetTab === 'investments') {
        setTimeout(() => {
            updateInvestments();
            // Actualizar selector de cuentas en el formulario de inversiones (aportes periódicos)
            updateAccountSelect('contributionAccount');
        }, 100);
    }
}

// Inicializar tabs
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const navItems = document.querySelectorAll('.nav-item');
    
    // Event listeners para tabs principales
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');
            switchToTab(targetTab, true); // Permitir scroll cuando el usuario hace clic manualmente
        });
    });
    
    // Event listeners para navegación del header
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetTab = item.getAttribute('data-tab');
            switchToTab(targetTab, true); // Permitir scroll cuando el usuario hace clic manualmente
            // Scroll suave hacia el contenido
            const mainContent = document.querySelector('.main-content');
            if (mainContent) {
                mainContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
    
    // Inicializar estado activo del primer tab SIN hacer scroll automático
    if (tabButtons.length > 0) {
        const firstTab = tabButtons[0].getAttribute('data-tab');
        const firstTabBtn = document.querySelector(`.tab-btn[data-tab="${firstTab}"]`);
        const firstTabContent = document.getElementById(`${firstTab}-tab`);
        
        // Activar el primer tab sin hacer scroll
        if (firstTabBtn) firstTabBtn.classList.add('active');
        if (firstTabContent) {
            firstTabContent.classList.add('active');
        }
        
        // NO hacer scroll automático - el usuario decidirá dónde quiere ir
    }
}

// Inicializar formularios
function initializeForms() {
    console.log('🔧 initializeForms() - Iniciando...');
    
    // Formulario de transacciones - Remover listeners anteriores para evitar duplicados
    const transactionForm = document.getElementById('transactionForm');
    console.log('🔍 Buscando formulario transactionForm:', transactionForm ? '✅ Encontrado' : '❌ NO ENCONTRADO');
    
    if (transactionForm) {
        // Clonar formulario para remover listeners anteriores
        const newForm = transactionForm.cloneNode(true);
        transactionForm.parentNode.replaceChild(newForm, transactionForm);
        const cleanForm = document.getElementById('transactionForm');
        
        // Inicializar categorías DESPUÉS de clonar el formulario
        initializeCategories();
        
        console.log('✅ Formulario encontrado, agregando event listener...');
        cleanForm.addEventListener('submit', async (e) => {
            console.log('🎯 EVENTO SUBMIT DISPARADO!');
            e.preventDefault();
            e.stopPropagation();
            console.log('🔄 Llamando a updateTransaction()...');
            try {
                await updateTransaction();
            } catch (error) {
                console.error('❌ Error en updateTransaction desde event listener:', error);
            }
        });
        console.log('✅ Event listener agregado al formulario');
    } else {
        console.error('❌ ERROR: No se encontró el formulario transactionForm');
        console.error('❌ Elementos disponibles:', document.querySelectorAll('form').length, 'formularios encontrados');
    }
    
    // Formulario de sobres
    const envelopeForm = document.getElementById('envelopeForm');
    if (envelopeForm) {
        envelopeForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await updateEnvelope();
        });
    }
    
    // Formulario de inversiones
    const investmentForm = document.getElementById('investmentForm');
    if (investmentForm) {
        investmentForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await addInvestment();
        });
    }
    
    // Formulario de cuentas bancarias - Remover listeners anteriores para evitar duplicados
    const accountForm = document.getElementById('accountForm');
    if (accountForm) {
        // Clonar formulario para remover listeners anteriores
        const newForm = accountForm.cloneNode(true);
        accountForm.parentNode.replaceChild(newForm, accountForm);
        const cleanForm = document.getElementById('accountForm');
        
        cleanForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            e.stopPropagation();
            await addAccount();
        });
        
        // Ya no necesitamos calcular rentabilidad automáticamente en el formulario
        // La rentabilidad se calcula en base a los aportes acumulados
    }
    
    // Formulario de patrimonio
    const patrimonioForm = document.getElementById('patrimonioForm');
    if (patrimonioForm) {
        patrimonioForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await addPatrimonio();
        });
        
        // Inicializar fecha de adquisición con hoy
        const patrimonioPurchaseDate = document.getElementById('patrimonioPurchaseDate');
        if (patrimonioPurchaseDate) {
            const today = new Date().toISOString().split('T')[0];
            patrimonioPurchaseDate.value = today;
        }
    }
    
    // Toggle de aportes periódicos en inversiones
    const enablePeriodicContribution = document.getElementById('enablePeriodicContribution');
    const periodicContributionFields = document.getElementById('periodicContributionFields');
    if (enablePeriodicContribution && periodicContributionFields) {
        enablePeriodicContribution.addEventListener('change', (e) => {
            periodicContributionFields.style.display = e.target.checked ? 'block' : 'none';
            
            // Inicializar fechas si se activa
            if (e.target.checked) {
                const contributionStartDate = document.getElementById('contributionStartDate');
                const contributionEndDate = document.getElementById('contributionEndDate');
                if (contributionStartDate) {
                    const today = new Date().toISOString().split('T')[0];
                    contributionStartDate.value = today;
                }
            }
        });
    }
    
    // Formulario de propiedades
    const propertyForm = document.getElementById('propertyForm');
    if (propertyForm) {
        console.log('🔧 Inicializando formulario de propiedades');
        propertyForm.addEventListener('submit', async (e) => {
            console.log('🎯 Evento submit de propiedad disparado');
            e.preventDefault();
            e.stopPropagation();
            try {
                await addProperty();
            } catch (error) {
                console.error('❌ Error en addProperty desde event listener:', error);
                alert('Error al crear propiedad: ' + (error.message || 'Error desconocido'));
            }
        });
        console.log('✅ Event listener agregado al formulario de propiedades');
    } else {
        console.error('❌ ERROR: No se encontró el formulario propertyForm');
    }
    
    // Formulario de préstamos
    const loanForm = document.getElementById('loanForm');
    if (loanForm) {
        // Actualizar selectores cuando se muestra el formulario
        updatePatrimonioSelect('loanPatrimonio');
        updateAccountSelect('loanAccount');
        
        loanForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await addLoan();
        });
        
        // Calcular cuota mensual automáticamente
        const loanPrincipal = document.getElementById('loanPrincipal');
        const loanInterestRate = document.getElementById('loanInterestRate');
        const loanStartDate = document.getElementById('loanStartDate');
        const loanEndDate = document.getElementById('loanEndDate');
        const loanMonthlyPayment = document.getElementById('loanMonthlyPayment');
        
        if (loanPrincipal && loanInterestRate && loanStartDate && loanEndDate && loanMonthlyPayment) {
            const calculatePayment = () => {
                const principal = parseFloat(loanPrincipal.value) || 0;
                const rate = parseFloat(loanInterestRate.value) || 0;
                const start = new Date(loanStartDate.value);
                const end = new Date(loanEndDate.value);
                
                if (principal > 0 && rate >= 0 && end > start && !isNaN(start.getTime()) && !isNaN(end.getTime())) {
                    const months = Math.ceil((end - start) / (1000 * 60 * 60 * 24 * 30.44));
                    if (months > 0) {
                        const payment = calculateMonthlyPayment(principal, rate, months);
                        loanMonthlyPayment.value = payment.toFixed(2);
                    }
                }
            };
            
            loanPrincipal.addEventListener('input', calculatePayment);
            loanInterestRate.addEventListener('input', calculatePayment);
            loanStartDate.addEventListener('change', calculatePayment);
            loanEndDate.addEventListener('change', calculatePayment);
        }
        
        // Inicializar fecha de inicio
        if (loanStartDate) {
            const today = new Date().toISOString().split('T')[0];
            loanStartDate.value = today;
        }
    }
    
    // Búsqueda y filtros
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            currentPage = 1;
            updateDisplay();
        });
    }
    
    const filterCategory = document.getElementById('filterCategory');
    if (filterCategory) {
        filterCategory.addEventListener('change', () => {
            currentPage = 1;
            updateDisplay();
        });
    }
    
    const filterMonth = document.getElementById('filterMonth');
    if (filterMonth) {
        filterMonth.addEventListener('change', () => {
            currentPage = 1;
            updateDisplay();
        });
    }
    
    const filterStartDate = document.getElementById('filterStartDate');
    if (filterStartDate) {
        filterStartDate.addEventListener('change', () => {
            currentPage = 1;
            updateDisplay();
        });
    }
    
    const filterEndDateEl = document.getElementById('filterEndDate');
    if (filterEndDateEl) {
        filterEndDateEl.addEventListener('change', () => {
            currentPage = 1;
            updateDisplay();
        });
    }
    
    const rowsPerPageSelect = document.getElementById('rowsPerPage');
    if (rowsPerPageSelect) {
        rowsPerPageSelect.addEventListener('change', () => {
            currentPage = 1;
            updateTransactionsTable();
        });
    }
    
    // Selector de período para gráficas (global - mantener para compatibilidad)
    const chartPeriod = document.getElementById('chartPeriod');
    if (chartPeriod) {
        chartPeriod.addEventListener('change', updateCharts);
    }
    
    // Selectores individuales de período para cada gráfico
    document.querySelectorAll('.chart-period-select').forEach(select => {
        select.addEventListener('change', () => {
            const chartName = select.getAttribute('data-chart');
            const value = select.value;
            
            // Mostrar/ocultar selector de fecha personalizada
            const customDateRange = document.getElementById(`${chartName}CustomDateRange`);
            if (customDateRange) {
                if (value === 'custom') {
                    customDateRange.style.display = 'flex';
                } else {
                    customDateRange.style.display = 'none';
                }
            }
            
            updateSingleChart(chartName);
        });
    });
    
    // Listeners para fechas personalizadas
    document.querySelectorAll('[id$="StartDate"], [id$="EndDate"]').forEach(input => {
        input.addEventListener('change', () => {
            // Extraer el nombre del gráfico del ID
            const id = input.id;
            const chartName = id.replace(/StartDate|EndDate/, '');
            if (chartName) {
                updateSingleChart(chartName);
            }
        });
    });
    
    // Selectores de filtros de categorías/tipos
    document.querySelectorAll('.chart-category-filter').forEach(select => {
        select.addEventListener('change', () => {
            const chartName = select.getAttribute('data-chart');
            updateSingleChart(chartName);
        });
    });
    
    document.querySelectorAll('.chart-loan-filter').forEach(select => {
        select.addEventListener('change', () => {
            updateSingleChart('loansPending');
        });
    });
    
    document.querySelectorAll('.chart-asset-filter').forEach(select => {
        select.addEventListener('change', () => {
            updateSingleChart('assetsEvolution');
        });
    });
    
    document.querySelectorAll('.chart-account-filter').forEach(select => {
        select.addEventListener('change', () => {
            updateSingleChart('accountsBalance');
        });
    });
    
    // Poblar filtros cuando se cargan los datos
    updateChartFilters();
    
    
    // Modal de amortización - añadir a la lista de modales que se cierran al hacer clic fuera
    const amortizationModal = document.getElementById('amortizationModal');
    if (amortizationModal) {
        amortizationModal.addEventListener('click', (e) => {
            if (e.target === amortizationModal) {
                amortizationModal.style.display = 'none';
            }
        });
    }
    
    // Modal de amortización anticipada - añadir listener para cerrar al hacer clic fuera
    const earlyPaymentModal = document.getElementById('earlyPaymentModal');
    if (earlyPaymentModal) {
        earlyPaymentModal.addEventListener('click', (e) => {
            if (e.target === earlyPaymentModal) {
                closeEarlyPaymentModal();
            }
        });
    }
    
    // Botón para establecer meta de ahorro
    const setSavingsGoalBtn = document.getElementById('setSavingsGoalBtn');
    if (setSavingsGoalBtn) {
        setSavingsGoalBtn.addEventListener('click', () => {
            showSavingsGoalModal();
        });
    }
    
    // Inicializar formulario de meta de ahorro
    const savingsGoalForm = document.getElementById('savingsGoalForm');
    if (savingsGoalForm) {
        // Remover listeners anteriores si existen
        const newForm = savingsGoalForm.cloneNode(true);
        savingsGoalForm.parentNode.replaceChild(newForm, savingsGoalForm);
        
        document.getElementById('savingsGoalForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const input = document.getElementById('savingsGoalInput');
            if (!input) {
                alert('Error: No se encontró el campo de entrada');
                return;
            }
            
            const value = input.value.trim();
            if (!value) {
                alert('Por favor ingresa una cantidad válida');
                return;
            }
            
            const numValue = parseFloat(value);
            if (isNaN(numValue) || numValue < 0) {
                alert('Por favor ingresa un número válido mayor o igual a 0');
                return;
            }
            
            try {
                savingsGoal = numValue > 0 ? numValue : null;
                const response = await apiRequest('/user/profile', {
                    method: 'PUT',
                    body: JSON.stringify({ savingsGoal: savingsGoal })
                });
                
                // Verificar que se guardó correctamente
                if (response && response.savingsGoal !== undefined) {
                    savingsGoal = response.savingsGoal;
                }
                
                updateSummary();
                closeSavingsGoalModal();
                alert('✅ Fondo de emergencia guardado exitosamente');
            } catch (error) {
                console.error('Error al guardar el fondo de emergencia:', error);
                alert('Error al guardar el fondo de emergencia: ' + (error.message || 'Error desconocido'));
            }
        });
    }
    
    // Inicializar formulario de añadir dinero a inversión
    const addMoneyInvestmentForm = document.getElementById('addMoneyInvestmentForm');
    if (addMoneyInvestmentForm) {
        addMoneyInvestmentForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await processAddMoneyToInvestment();
        });
    }
    
    // Inicializar formulario de actualizar valor de inversión
    const updateInvestmentValueForm = document.getElementById('updateInvestmentValueForm');
    if (updateInvestmentValueForm) {
        updateInvestmentValueForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await processUpdateInvestmentValue();
        });
    }
    
    // Inicializar formulario de actualizar saldo de cuenta
    const updateAccountBalanceForm = document.getElementById('updateAccountBalanceForm');
    if (updateAccountBalanceForm) {
        updateAccountBalanceForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await processUpdateAccountBalance();
        });
    }
    
    // Inicializar formulario de actualizar valor de bien
    const updateAssetValueForm = document.getElementById('updateAssetValueForm');
    if (updateAssetValueForm) {
        updateAssetValueForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await processUpdatePatrimonioValue();
        });
    }
    
    // Inicializar formulario de actualizar valor de propiedad
    const updatePropertyValueForm = document.getElementById('updatePropertyValueForm');
    if (updatePropertyValueForm) {
        updatePropertyValueForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await processUpdatePropertyValue();
        });
    }
    
    // Botón de perfil de usuario ya se maneja con onclick en HTML
    
    // Inicializar ordenamiento de tabla de transacciones
    const sortableHeaders = document.querySelectorAll('#transactionsTable th.sortable');
    sortableHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const sortColumn = header.getAttribute('data-sort');
            
            // Si se hace clic en la misma columna, cambiar dirección
            if (transactionsSortColumn === sortColumn) {
                transactionsSortDirection = transactionsSortDirection === 'asc' ? 'desc' : 'asc';
            } else {
                transactionsSortColumn = sortColumn;
                transactionsSortDirection = 'asc';
            }
            
            // Actualizar indicadores visuales
            sortableHeaders.forEach(h => {
                const indicator = h.querySelector('.sort-indicator');
                if (indicator) {
                    indicator.textContent = '';
                }
                h.style.color = '';
            });
            
            const indicator = header.querySelector('.sort-indicator');
            if (indicator) {
                indicator.textContent = transactionsSortDirection === 'asc' ? ' ▲' : ' ▼';
            }
            header.style.color = 'var(--primary)';
            
            // Actualizar tabla
            updateTransactionsTable();
        });
    });
    
    // Establecer ordenamiento inicial (por fecha descendente)
    const dateHeader = document.querySelector('#transactionsTable th[data-sort="date"]');
    if (dateHeader) {
        const indicator = dateHeader.querySelector('.sort-indicator');
        if (indicator) {
            indicator.textContent = ' ▼';
        }
        dateHeader.style.color = 'var(--primary)';
    }
    
    // Selector de período en dashboard
    const summaryPeriodSelect = document.getElementById('summaryPeriod');
    const summaryYearInput = document.getElementById('summaryYear');
    if (summaryPeriodSelect) {
        // Inicializar con valor por defecto "Este año"
        summaryPeriodSelect.value = 'year';
        summaryPeriod = 'year';
        
        // Inicializar mes y año actual
        const summaryMonthContainer = document.getElementById('summaryMonthContainer');
        const summaryMonthSelect = document.getElementById('summaryMonthSelect');
        const summaryMonthYear = document.getElementById('summaryMonthYear');
        if (summaryMonthContainer && summaryMonthSelect && summaryMonthYear) {
            const now = new Date();
            summaryMonthSelect.value = now.getMonth() + 1;
            summaryMonthYear.value = now.getFullYear();
            // Asegurar que esté oculto por defecto
            summaryMonthContainer.style.display = 'none';
        }
        if (summaryYearInput) {
            summaryYearInput.value = new Date().getFullYear();
            // Asegurar que esté oculto por defecto
            summaryYearInput.style.display = 'none';
            summaryYearInput.style.visibility = 'hidden';
        }
        
        summaryPeriodSelect.addEventListener('change', (e) => {
            const value = e.target.value;
            summaryPeriod = value;
            
            // Mostrar/ocultar selector de mes
            if (summaryMonthContainer) {
                if (value === 'month-select') {
                    summaryMonthContainer.style.display = 'flex';
                    summaryMonthContainer.style.marginTop = 'clamp(12px, 3vw, 16px)';
                    summaryMonthContainer.style.marginBottom = '0';
                    if (summaryMonthSelect) summaryMonthSelect.focus();
                } else {
                    summaryMonthContainer.style.display = 'none';
                    summaryMonthContainer.style.marginTop = '0';
                    summaryMonthContainer.style.marginBottom = '0';
                }
            }
            
            // Mostrar/ocultar selector de año
            if (summaryYearInput) {
                if (value === 'year-select') {
                    summaryYearInput.style.display = 'block';
                    summaryYearInput.style.visibility = 'visible';
                    summaryYearInput.style.height = 'auto';
                    summaryYearInput.style.marginTop = 'clamp(12px, 3vw, 16px)';
                    summaryYearInput.style.marginBottom = '0';
                    summaryYearInput.style.marginLeft = '0';
                    summaryYearInput.style.marginRight = '0';
                    summaryYearInput.style.padding = 'clamp(10px, 2.5vw, 12px)';
                    summaryYearInput.style.minHeight = 'clamp(40px, 10vw, 44px)';
                    summaryYearInput.style.fontSize = 'clamp(14px, 3.5vw, 16px)';
                    summaryYearInput.style.border = '1.5px solid var(--border-color)';
                    summaryYearInput.style.width = '100%';
                    summaryYearInput.style.maxWidth = '100%';
                    summaryYearInput.style.minWidth = '100%';
                    summaryYearInput.style.boxSizing = 'border-box';
                    summaryYearInput.style.overflow = 'visible';
                    summaryYearInput.focus();
                } else {
                    summaryYearInput.style.display = 'none';
                    summaryYearInput.style.visibility = 'hidden';
                    summaryYearInput.style.height = '0';
                    summaryYearInput.style.marginTop = '0';
                    summaryYearInput.style.marginBottom = '0';
                    summaryYearInput.style.marginLeft = '0';
                    summaryYearInput.style.marginRight = '0';
                    summaryYearInput.style.padding = '0';
                    summaryYearInput.style.border = 'none';
                }
            }
            
            updateSummary();
            updateMonthDashboard();
            updateDashboardCharts();
        });
        
        // Listener para cambio de mes (usar las variables ya declaradas arriba)
        if (summaryMonthSelect) {
            summaryMonthSelect.addEventListener('change', () => {
                if (summaryPeriod === 'month-select') {
                    updateSummary();
                    updateMonthDashboard();
                    updateDashboardCharts();
                }
            });
        }
        if (summaryMonthYear) {
            summaryMonthYear.addEventListener('change', () => {
                if (summaryPeriod === 'month-select') {
                    updateSummary();
                    updateMonthDashboard();
                    updateDashboardCharts();
                }
            });
            summaryMonthYear.addEventListener('input', () => {
                if (summaryPeriod === 'month-select') {
                    const yearValue = parseInt(summaryMonthYear.value);
                    if (yearValue && yearValue >= 2000 && yearValue <= 2100) {
                        updateSummary();
                        updateMonthDashboard();
                        updateDashboardCharts();
                    }
                }
            });
        }
        
        // Listener para cambio de año
        if (summaryYearInput) {
            summaryYearInput.addEventListener('change', () => {
                if (summaryPeriod === 'year-select') {
                    const yearValue = parseInt(summaryYearInput.value);
                    if (yearValue && yearValue >= 2000 && yearValue <= 2100) {
                        updateSummary();
                        updateMonthDashboard();
                        updateDashboardCharts();
                    }
                }
            });
            
            summaryYearInput.addEventListener('input', () => {
                if (summaryPeriod === 'year-select') {
                    const yearValue = parseInt(summaryYearInput.value);
                    if (yearValue && yearValue >= 2000 && yearValue <= 2100) {
                        updateSummary();
                        updateMonthDashboard();
                        updateDashboardCharts();
                    }
                }
            });
        }
    }
    
    // Selector de mes para el análisis del mes
    const dashboardMonthInput = document.getElementById('dashboardMonth');
    if (dashboardMonthInput) {
        // Establecer mes actual por defecto
        const now = new Date();
        dashboardMonthInput.value = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        
        dashboardMonthInput.addEventListener('change', (e) => {
            updateMonthDashboard();
        });
        
        // Actualizar panel al cargar
        setTimeout(() => updateMonthDashboard(), 500);
    }
    
    // Formulario de presupuestos
    const budgetForm = document.getElementById('budgetForm');
    if (budgetForm) {
        budgetForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await addBudget();
        });
        
        // Inicializar período actual
        const budgetPeriodType = document.getElementById('budgetPeriodType');
        const budgetPeriodValue = document.getElementById('budgetPeriodValue');
        const budgetPeriodValueLabel = document.getElementById('budgetPeriodValueLabel');
        const budgetPeriodValueHelp = document.getElementById('budgetPeriodValueHelp');
        const budgetAmountLabel = document.getElementById('budgetAmountLabel');
        const budgetAmountHelp = document.getElementById('budgetAmountHelp');
        const budgetDurationGroup = document.getElementById('budgetDurationGroup');
        const budgetDuration = document.getElementById('budgetDuration');
        const budgetDurationLabel = document.getElementById('budgetDurationLabel');
        const budgetDurationHelp = document.getElementById('budgetDurationHelp');
        
        if (budgetPeriodType && budgetPeriodValue) {
            const now = new Date();
            const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
            const currentYear = now.getFullYear().toString();
            const currentWeek = getWeekStartDate(now);
            
            budgetPeriodValue.value = currentMonth;
            
            // Actualizar campos según tipo de período
            budgetPeriodType.addEventListener('change', (e) => {
                const periodType = e.target.value;
                updateBudgetPeriodFields(periodType, budgetPeriodValue, budgetPeriodValueLabel, budgetPeriodValueHelp, budgetAmountLabel, budgetAmountHelp, budgetDurationGroup, budgetDuration, budgetDurationLabel, budgetDurationHelp, now);
            });
            
            // Inicializar campos
            updateBudgetPeriodFields(budgetPeriodType.value, budgetPeriodValue, budgetPeriodValueLabel, budgetPeriodValueHelp, budgetAmountLabel, budgetAmountHelp, budgetDurationGroup, budgetDuration, budgetDurationLabel, budgetDurationHelp, now);
        }
        
        // Función para actualizar campos según período
        function updateBudgetPeriodFields(periodType, periodValueInput, periodValueLabel, periodValueHelp, amountLabel, amountHelp, durationGroup, durationSelect, durationLabel, durationHelp, now) {
            if (periodType === 'weekly') {
                periodValueInput.type = 'date';
                periodValueInput.value = getWeekStartDate(now);
                periodValueLabel.textContent = 'Semana (Inicio)';
                periodValueHelp.textContent = 'Selecciona el lunes de la semana';
                amountLabel.textContent = 'Presupuesto Semanal (€)';
                amountHelp.textContent = 'Límite máximo de gasto para esta semana';
                if (durationGroup) durationGroup.style.display = 'none';
            } else if (periodType === 'monthly') {
                periodValueInput.type = 'month';
                periodValueInput.value = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
                periodValueLabel.textContent = 'Mes de Inicio';
                periodValueHelp.textContent = 'Mes desde el que comienza el presupuesto';
                amountLabel.textContent = 'Presupuesto Mensual (€)';
                amountHelp.textContent = 'Límite máximo de gasto para cada mes';
                if (durationGroup) {
                    durationGroup.style.display = 'block';
                    if (durationLabel) durationLabel.textContent = 'Duración';
                    if (durationHelp) durationHelp.textContent = 'Por cuántos meses aplicar este presupuesto';
                }
            } else if (periodType === 'yearly') {
                periodValueInput.type = 'number';
                periodValueInput.min = '2000';
                periodValueInput.max = '2100';
                periodValueInput.value = now.getFullYear();
                periodValueLabel.textContent = 'Año';
                periodValueHelp.textContent = 'Selecciona el año';
                amountLabel.textContent = 'Presupuesto Anual (€)';
                amountHelp.textContent = 'Límite máximo de gasto para este año';
                if (durationGroup) durationGroup.style.display = 'none';
            }
        }
        
        // Función para obtener el lunes de la semana
        function getWeekStartDate(date) {
            const d = new Date(date);
            const day = d.getDay();
            const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Ajustar al lunes
            const monday = new Date(d.setDate(diff));
            return monday.toISOString().split('T')[0];
        }
        
        // Actualizar categorías según tipo de presupuesto
        const budgetType = document.getElementById('budgetType');
        const budgetCategory = document.getElementById('budgetCategory');
        
        const updateBudgetCategories = () => {
            if (!budgetCategory || !budgetType) return;
            budgetCategory.innerHTML = '<option value="">Seleccionar categoría...</option>';
            
            const type = budgetType.value;
            const categoryList = type === 'income' ? categories.income : categories.expense;
            
            categoryList.forEach(cat => {
                const option = document.createElement('option');
                option.value = cat.id;
                option.textContent = cat.name;
                budgetCategory.appendChild(option);
            });
        };
        
        if (budgetType) {
            budgetType.addEventListener('change', updateBudgetCategories);
        }
        
        // Inicializar categorías
        updateBudgetCategories();
    }
    
    // Formulario de perfil de usuario
    const userProfileForm = document.getElementById('userProfileForm');
    if (userProfileForm) {
        userProfileForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await saveUserProfile();
        });
    }
    
    // Event listener para cerrar modal de perfil al hacer clic fuera
    const userProfileModal = document.getElementById('userProfileModal');
    if (userProfileModal) {
        userProfileModal.addEventListener('click', (e) => {
            if (e.target === userProfileModal) {
                closeUserProfile();
            }
        });
    }
    
    const closeUserProfileModalBtn = document.getElementById('closeUserProfileModal');
    if (closeUserProfileModalBtn) {
        closeUserProfileModalBtn.addEventListener('click', closeUserProfile);
    }
}

// Agregar transacción
async function addTransaction() {
    console.log('🔄 ========================================');
    console.log('🔄 addTransaction() - INICIANDO');
    console.log('🔄 ========================================');
    
    try {
        // Obtener valores del formulario
        console.log('📋 Obteniendo valores del formulario...');
        const typeEl = document.getElementById('transactionType');
        const dateEl = document.getElementById('transactionDate');
        const amountEl = document.getElementById('transactionAmount');
        const categoryGeneralEl = document.getElementById('categoryGeneral');
        const categorySpecificEl = document.getElementById('categorySpecific');
        const envelopeEl = document.getElementById('envelope');
        const accountIdEl = document.getElementById('transactionAccount');
        const investmentIdEl = document.getElementById('transactionInvestment');
        const loanIdEl = document.getElementById('transactionLoan');
        const propertyIdEl = document.getElementById('transactionProperty');
        const descriptionEl = document.getElementById('transactionDescription');
        
        console.log('📋 Elementos encontrados:', {
            typeEl: !!typeEl,
            dateEl: !!dateEl,
            amountEl: !!amountEl,
            categoryGeneralEl: !!categoryGeneralEl,
            categorySpecificEl: !!categorySpecificEl,
            envelopeEl: !!envelopeEl,
            accountIdEl: !!accountIdEl,
            investmentIdEl: !!investmentIdEl,
            loanIdEl: !!loanIdEl,
            propertyIdEl: !!propertyIdEl,
            descriptionEl: !!descriptionEl
        });
        
        if (!typeEl || !dateEl || !amountEl || !categoryGeneralEl || !categorySpecificEl) {
            console.error('❌ ERROR: Faltan elementos del formulario');
            alert('Error: No se encontraron todos los campos del formulario. Recarga la página.');
            return;
        }
        
        const type = typeEl.value;
        const date = dateEl.value;
        const amountInput = amountEl.value;
        const categoryGeneral = categoryGeneralEl.value;
        const categorySpecific = categorySpecificEl.value;
        const envelope = envelopeEl ? envelopeEl.value : '';
        const accountId = accountIdEl ? accountIdEl.value : '';
        const investmentId = investmentIdEl ? investmentIdEl.value : '';
        const loanId = loanIdEl ? loanIdEl.value : '';
        const propertyId = propertyIdEl ? propertyIdEl.value : '';
        const description = descriptionEl ? descriptionEl.value : '';
        
        console.log('📋 Datos del formulario:', {
            type, date, amountInput, categoryGeneral, categorySpecific,
            envelope, accountId, investmentId, loanId, propertyId, description
        });
    
        // Validaciones básicas
        console.log('✅ Validando campos requeridos...');
        if (!type || !date || !amountInput || !categoryGeneral || !categorySpecific) {
            console.error('❌ Validación fallida - campos requeridos faltantes');
            showToast('Por favor completa todos los campos requeridos', 'warning');
            return;
        }
        
        console.log('✅ Validando monto...');
        // Normalizar el monto: reemplazar comas por puntos para parseFloat
        const normalizedAmountInput = normalizeNumber(amountInput);
        const amount = parseFloat(normalizedAmountInput);
        if (isNaN(amount) || amount <= 0) {
            console.error('❌ Validación fallida - monto inválido:', amountInput);
            showToast('Por favor ingresa un monto válido mayor a 0', 'warning');
            return;
        }
        console.log('✅ Monto válido:', amount);
    
        // Normalizar campos opcionales (convertir strings vacíos a null)
        console.log('✅ Normalizando campos opcionales...');
        const normalizedEnvelope = (envelope && envelope.trim() !== '') ? envelope.trim() : null;
        const normalizedAccountId = (accountId && accountId.trim() !== '') ? accountId.trim() : null;
        const normalizedInvestmentId = (investmentId && investmentId.trim() !== '') ? investmentId.trim() : null;
        const normalizedLoanId = (loanId && loanId.trim() !== '') ? loanId.trim() : null;
        const normalizedPropertyId = (propertyId && propertyId.trim() !== '') ? propertyId.trim() : null;
        const normalizedDescription = (description && description.trim() !== '') ? description.trim() : null;
        
        // Preparar datos para enviar
        const transactionData = {
            type: type,
            date: date,
            amount: Math.abs(amount),
            categoryGeneral: categoryGeneral,
            categorySpecific: categorySpecific,
            envelope: normalizedEnvelope,
            account_id: normalizedAccountId,
            investment_id: normalizedInvestmentId,
            loan_id: normalizedLoanId,
            property_id: normalizedPropertyId,
            description: normalizedDescription
        };
        
        console.log('📤 ========================================');
        console.log('📤 Enviando datos al servidor:');
        console.log('📤', JSON.stringify(transactionData, null, 2));
        console.log('📤 ========================================');
        
        // Enviar al servidor
        console.log('📡 Llamando a apiRequest...');
        const transaction = await apiRequest('/transactions', {
            method: 'POST',
            body: JSON.stringify(transactionData)
        });
        
        console.log('✅ ========================================');
        console.log('✅ Transacción creada exitosamente:');
        console.log('✅', transaction);
        console.log('✅ ========================================');
        
        // Si está asociada a una inversión o préstamo, recargar datos
        console.log('✅ Actualizando interfaz...');
        if ((normalizedInvestmentId && type === 'expense') || (normalizedLoanId && type === 'expense')) {
            console.log('✅ Recargando datos completos (transacción asociada a inversión o préstamo)...');
            
            // Si hay un préstamo asociado, descontar el importe
            if (normalizedLoanId && type === 'expense') {
                try {
                    console.log('✅ Descontando importe del préstamo...');
                    await apiRequest(`/loans/${normalizedLoanId}/payment`, {
                        method: 'POST',
                        body: JSON.stringify({
                            amount: Math.abs(amount),
                            date: date,
                            is_early_payment: false
                        })
                    });
                    console.log('✅ Importe descontado del préstamo exitosamente');
                } catch (error) {
                    console.error('❌ Error al descontar del préstamo:', error);
                    // No fallar la transacción si falla el descuento del préstamo
                }
            }
            
            await loadUserData();
        } else {
            console.log('✅ Agregando transacción a lista local...');
            // Agregar a la lista local
            transactions.push({
                ...transaction,
                categoryGeneral: transaction.category_general,
                categorySpecific: transaction.category_specific
            });
            transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
            updateDisplay();
        }
        
        // Limpiar formulario y ocultarlo
        console.log('✅ Limpiando formulario...');
        const transactionForm = document.getElementById('transactionForm');
        if (transactionForm) {
            transactionForm.reset();
            // Ocultar formulario después de agregar exitosamente
            toggleForm('transactionForm', 'toggleTransactionFormBtn');
        }
        initializeDate();
        initializeCategories();
        updateEnvelopeSelect();
        updateAccountSelect();
        
        console.log('✅ ========================================');
        console.log('✅ Proceso completado exitosamente');
        console.log('✅ ========================================');
        
    } catch (error) {
        console.error('❌ ========================================');
        console.error('❌ ERROR COMPLETO al agregar transacción:');
        console.error('❌ Error name:', error.name);
        console.error('❌ Error message:', error.message);
        console.error('❌ Error stack:', error.stack);
        if (error.response) {
            console.error('❌ Error response:', error.response);
        }
        console.error('❌ ========================================');
        
        let errorMsg = 'Error al crear transacción';
        if (error.message) {
            errorMsg = error.message;
        } else if (error.response && error.response.error) {
            errorMsg = error.response.error;
        }
        
        alert('Error al agregar transacción:\n\n' + errorMsg + '\n\nRevisa la consola para más detalles.');
    }
}

// Agregar sobre
async function addEnvelope() {
    const name = document.getElementById('envelopeName').value;
    const budget = parseFloat(document.getElementById('envelopeBudget').value);
    
    try {
        const envelope = await apiRequest('/envelopes', {
            method: 'POST',
            body: JSON.stringify({ name, budget })
        });
        
        envelopes.push(envelope);
        updateDisplay();
        resetEnvelopeForm();
        // Ocultar formulario después de agregar exitosamente
        const envelopeForm = document.getElementById('envelopeForm');
        if (envelopeForm && envelopeForm.style.display !== 'none') {
            toggleForm('envelopeForm', 'toggleEnvelopeFormBtn');
        }
        updateEnvelopeSelect();
    } catch (error) {
        alert('Error al crear sobre: ' + error.message);
    }
}

// Actualizar visualización
function updateDisplay() {
    try {
        updateSummary();
        updateTransactionsTable();
        updateEnvelopes();
        updateEnvelopeSelect();
        updateAccountSelect(); // Actualizar selector de cuentas
        updateInvestmentSelect(); // Actualizar selector de inversiones
        updatePatrimonioSelect(); // Actualizar selector de patrimonio
        updateLoanSelect(); // Actualizar selector de préstamos
        updateLoans();
        updateInvestments();
        updateBudgets(); // Asegurar que los presupuestos se actualicen
        updatePatrimonio(); // Actualizar patrimonio
        updateMonthFilter();
        updateMonthDashboard();
        
        // Actualizar filtros de gráficos
        updateChartFilters();
        
        // Actualizar gráficas siempre (no solo cuando el tab está activo)
        updateCharts();
    } catch (error) {
        console.error('Error en updateDisplay:', error);
    }
}

// Actualizar resumen
async function updateSummary() {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    // Cargar meta de ahorro desde el perfil del usuario
    try {
        const profileData = await apiRequest('/user/profile');
        if (profileData && profileData.savingsGoal !== undefined) {
            savingsGoal = profileData.savingsGoal;
        }
    } catch (error) {
        console.warn('No se pudo cargar la meta de ahorro:', error);
    }
    
    // Obtener mes y año seleccionados si aplica
    const summaryYearInput = document.getElementById('summaryYear');
    let selectedMonth = currentMonth;
    let selectedYear = currentYear;
    
    if (summaryMonthInput && summaryPeriod === 'month-select') {
        const monthValue = summaryMonthInput.value;
        if (monthValue) {
            const [year, month] = monthValue.split('-').map(Number);
            selectedYear = year;
            selectedMonth = month - 1; // Los meses en JS son 0-indexed
        }
    }
    
    if (summaryYearInput && summaryPeriod === 'year-select') {
        selectedYear = parseInt(summaryYearInput.value) || currentYear;
    }
    
    const monthTransactions = transactions.filter(t => {
        const tDate = new Date(t.date);
        return tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear;
    });
    
    // Transacciones del mes específico seleccionado
    const selectedMonthTransactions = transactions.filter(t => {
        const tDate = new Date(t.date);
        return tDate.getMonth() === selectedMonth && tDate.getFullYear() === selectedYear;
    });
    
    // Transacciones del año (actual o seleccionado)
    const yearTransactions = transactions.filter(t => {
        const tDate = new Date(t.date);
        return tDate.getFullYear() === selectedYear;
    });
    
    // Cálculos del mes
    // Balance total = transacciones + valor actual de inversiones - capital restante de préstamos
    const transactionsBalance = transactions.reduce((sum, t) => sum + t.amount, 0);
    const investmentsValue = investments.reduce((sum, inv) => sum + inv.current_value, 0);
    const loansDebt = loans.filter(l => l.type === 'debt').reduce((sum, loan) => {
        const amortization = calculateAmortizationTable(
            loan.principal,
            loan.interest_rate,
            loan.monthly_payment,
            loan.start_date,
            0, // No usar total_paid, calcular desde el inicio hasta hoy
            loan.early_payments || []
        );
        return sum + amortization.finalBalance;
    }, 0);
    const loansCredit = loans.filter(l => l.type === 'credit').reduce((sum, loan) => {
        const amortization = calculateAmortizationTable(
            loan.principal,
            loan.interest_rate,
            loan.monthly_payment,
            loan.start_date,
            0, // No usar total_paid, calcular desde el inicio hasta hoy
            loan.early_payments || []
        );
        return sum + amortization.finalBalance;
    }, 0);
    const patrimonioValue = patrimonio.reduce((sum, prop) => sum + (prop.current_value || 0), 0);
    const totalBalance = transactionsBalance + investmentsValue + loansCredit - loansDebt + patrimonioValue;
    // Calcular según período seleccionado
    let periodIncome, periodExpenses, periodSavings, periodLabel;
    
    if (summaryPeriod === 'month') {
        periodIncome = monthTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
        periodExpenses = Math.abs(monthTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0));
        periodSavings = periodIncome - periodExpenses;
        periodLabel = 'Este mes';
    } else if (summaryPeriod === 'month-select') {
        // Usar mes seleccionado cuando se selecciona "Mes Específico"
        periodIncome = selectedMonthTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
        periodExpenses = Math.abs(selectedMonthTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0));
        periodSavings = periodIncome - periodExpenses;
        const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        periodLabel = `${monthNames[selectedMonth]} ${selectedYear}`;
    } else if (summaryPeriod === 'year') {
        // Usar año actual cuando se selecciona "Este Año"
        const yearForCalculation = currentYear;
        const yearTransactionsForPeriod = transactions.filter(t => {
            const tDate = new Date(t.date);
            return tDate.getFullYear() === yearForCalculation;
        });
        periodIncome = yearTransactionsForPeriod.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
        periodExpenses = Math.abs(yearTransactionsForPeriod.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0));
        periodSavings = periodIncome - periodExpenses;
        periodLabel = 'Este año';
    } else if (summaryPeriod === 'year-select') {
        // Usar año seleccionado cuando se selecciona "Año Específico"
        periodIncome = yearTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
        periodExpenses = Math.abs(yearTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0));
        periodSavings = periodIncome - periodExpenses;
        periodLabel = `Año ${selectedYear}`;
    } else { // 'all'
        periodIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
        periodExpenses = Math.abs(transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0));
        periodSavings = periodIncome - periodExpenses;
        periodLabel = 'Historial completo';
    }
    
    // Actualizar elementos según período
    const totalBalanceEl = document.getElementById('totalBalance');
    const totalBalancePeriodEl = document.getElementById('totalBalancePeriod');
    const periodIncomeEl = document.getElementById('periodIncome');
    const periodIncomeLabelEl = document.getElementById('periodIncomeLabel');
    const periodIncomeSubLabelEl = document.getElementById('periodIncomeSubLabel');
    const periodExpensesEl = document.getElementById('periodExpenses');
    const periodExpensesLabelEl = document.getElementById('periodExpensesLabel');
    const periodExpensesSubLabelEl = document.getElementById('periodExpensesSubLabel');
    const periodSavingsEl = document.getElementById('periodSavings');
    const periodSavingsLabelEl = document.getElementById('periodSavingsLabel');
    const periodSavingsSubLabelEl = document.getElementById('periodSavingsSubLabel');
    
    // Calcular saldo total de cuentas
    const totalAccountsBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
    
    if (totalBalanceEl) totalBalanceEl.textContent = formatCurrency(totalBalance);
    if (totalBalancePeriodEl) totalBalancePeriodEl.textContent = periodLabel;
    
    // Actualizar saldo de cuentas en el resumen
    const totalAccountsBalanceEl = document.getElementById('totalAccountsBalance');
    if (totalAccountsBalanceEl) {
        totalAccountsBalanceEl.textContent = formatCurrency(totalAccountsBalance);
    }
    
    if (periodIncomeEl) periodIncomeEl.textContent = formatCurrency(periodIncome);
    if (periodIncomeLabelEl) periodIncomeLabelEl.textContent = `Ingresos ${periodLabel}`;
    if (periodIncomeSubLabelEl) periodIncomeSubLabelEl.textContent = periodLabel;
    
    if (periodExpensesEl) periodExpensesEl.textContent = formatCurrency(periodExpenses);
    if (periodExpensesLabelEl) periodExpensesLabelEl.textContent = `Gastos ${periodLabel}`;
    if (periodExpensesSubLabelEl) periodExpensesSubLabelEl.textContent = periodLabel;
    
    if (periodSavingsEl) {
        periodSavingsEl.textContent = formatCurrency(periodSavings);
        periodSavingsEl.className = periodSavings >= 0 ? 'amount positive' : 'amount negative';
    }
    if (periodSavingsLabelEl) periodSavingsLabelEl.textContent = `Ahorro ${periodLabel}`;
    if (periodSavingsSubLabelEl) periodSavingsSubLabelEl.textContent = periodLabel;
    
    // Actualizar meta de ahorro
    const savingsGoalEl = document.getElementById('savingsGoal');
    const savingsGoalProgress = document.getElementById('savingsGoalProgress');
    const savingsGoalProgressBar = document.getElementById('savingsGoalProgressBar');
    const savingsGoalProgressText = document.getElementById('savingsGoalProgressText');
    
    if (savingsGoalEl) {
        if (savingsGoal && savingsGoal > 0) {
            savingsGoalEl.textContent = formatCurrency(savingsGoal);
            
            // Calcular progreso basado en el saldo de cuentas
            const progress = Math.min((totalAccountsBalance / savingsGoal) * 100, 100);
            const isAchieved = totalAccountsBalance >= savingsGoal;
            
            if (savingsGoalProgress) {
                savingsGoalProgress.style.display = 'block';
                if (savingsGoalProgressBar) {
                    savingsGoalProgressBar.style.width = `${Math.max(0, progress)}%`;
                    savingsGoalProgressBar.style.background = isAchieved ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.7)';
                }
                if (savingsGoalProgressText) {
                    if (isAchieved) {
                        savingsGoalProgressText.textContent = `¡Meta alcanzada! 🎉`;
                        savingsGoalProgressText.style.color = 'rgba(255,255,255,1)';
            } else {
                        const remaining = savingsGoal - totalAccountsBalance;
                        savingsGoalProgressText.textContent = `${progress.toFixed(1)}% - Faltan ${formatCurrency(remaining)}`;
                        savingsGoalProgressText.style.color = 'rgba(255,255,255,0.9)';
                    }
                }
            }
        } else {
            savingsGoalEl.textContent = 'Sin meta';
            if (savingsGoalProgress) {
                savingsGoalProgress.style.display = 'none';
            }
        }
    }
    
    // Actualizar gráficas del dashboard
    updateDashboardCharts();
}

// Actualizar tabla de transacciones
// Variables globales para ordenamiento
let transactionsSortColumn = 'date';
let transactionsSortDirection = 'desc'; // 'asc' o 'desc'

// Variables para modo edición
let currentEditingTransactionId = null;
let currentEditingEnvelopeId = null;
let currentEditingInvestmentId = null;
let currentEditingLoanId = null;
let currentEditingPropertyId = null;
let currentEditingAccountId = null;
let currentEditingAssetId = null;
let currentEditingBudgetId = null;

let currentPage = 1;
let rowsPerPage = 25;

function updateTransactionsTable() {
    const tbody = document.getElementById('transactionsBody');
    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
    const filterCategory = document.getElementById('filterCategory')?.value || '';
    const filterMonth = document.getElementById('filterMonth')?.value || '';
    const filterStartDate = document.getElementById('filterStartDate')?.value || '';
    const filterEndDate = document.getElementById('filterEndDate')?.value || '';
    const rowsPerPageSelect = document.getElementById('rowsPerPage');
    if (rowsPerPageSelect) {
        rowsPerPage = parseInt(rowsPerPageSelect.value) || 25;
    }
    
    let filtered = transactions;
    
    if (searchTerm) {
        filtered = filtered.filter(t => 
            (t.description || '').toLowerCase().includes(searchTerm) ||
            (t.categorySpecific || '').toLowerCase().includes(searchTerm)
        );
    }
    
    if (filterCategory) {
        filtered = filtered.filter(t => t.categoryGeneral === filterCategory);
    }
    
    if (filterMonth) {
        filtered = filtered.filter(t => {
            const tDate = new Date(t.date);
            return `${tDate.getFullYear()}-${String(tDate.getMonth() + 1).padStart(2, '0')}` === filterMonth;
        });
    }
    
    // Filtro por rango de fechas
    if (filterStartDate) {
        const startDate = new Date(filterStartDate);
        filtered = filtered.filter(t => {
            const tDate = new Date(t.date);
            return tDate >= startDate;
        });
    }
    
    if (filterEndDate) {
        const endDate = new Date(filterEndDate);
        endDate.setHours(23, 59, 59, 999); // Incluir todo el día final
        filtered = filtered.filter(t => {
            const tDate = new Date(t.date);
            return tDate <= endDate;
        });
    }
    
    if (!tbody) return;
    
    // Ordenar transacciones
    filtered.sort((a, b) => {
        let aValue, bValue;
        
        switch(transactionsSortColumn) {
            case 'date':
                aValue = new Date(a.date).getTime();
                bValue = new Date(b.date).getTime();
                break;
            case 'type':
                aValue = a.type;
                bValue = b.type;
                break;
            case 'category':
                aValue = `${a.categoryGeneral} - ${a.categorySpecific}`.toLowerCase();
                bValue = `${b.categoryGeneral} - ${b.categorySpecific}`.toLowerCase();
                break;
            case 'description':
                aValue = (a.description || '').toLowerCase();
                bValue = (b.description || '').toLowerCase();
                break;
            case 'account':
                const accountA = accounts.find(acc => (acc._id || acc.id) === a.account_id);
                const accountB = accounts.find(acc => (acc._id || acc.id) === b.account_id);
                aValue = accountA ? accountA.name.toLowerCase() : '';
                bValue = accountB ? accountB.name.toLowerCase() : '';
                break;
            case 'property':
                const propertyA = properties.find(prop => (prop._id || prop.id) === a.property_id);
                const propertyB = properties.find(prop => (prop._id || prop.id) === b.property_id);
                aValue = propertyA ? propertyA.name.toLowerCase() : '';
                bValue = propertyB ? propertyB.name.toLowerCase() : '';
                break;
            case 'envelope':
                aValue = (a.envelope || '').toLowerCase();
                bValue = (b.envelope || '').toLowerCase();
                break;
            case 'amount':
                aValue = a.amount;
                bValue = b.amount;
                break;
            default:
                return 0;
        }
        
        if (aValue < bValue) return transactionsSortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return transactionsSortDirection === 'asc' ? 1 : -1;
        return 0;
    });
    
    tbody.innerHTML = '';
    
    if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" style="text-align: center; padding: 40px; color: #999;">No hay transacciones registradas</td></tr>';
        return;
    }
    
    // Aplicar paginación si rowsPerPage > 0
    let transactionsToShow = filtered;
    if (rowsPerPage > 0) {
        const startIndex = (currentPage - 1) * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        transactionsToShow = filtered.slice(startIndex, endIndex);
    }
    
    transactionsToShow.forEach(transaction => {
        const row = document.createElement('tr');
        const date = new Date(transaction.date);
        
        // Buscar nombre de categoría
        let categoryName = transaction.categoryGeneral;
        if (transaction.type === 'expense') {
            const expenseCat = categories.expense.find(c => c.id === transaction.categoryGeneral);
            if (expenseCat) {
                categoryName = expenseCat.name;
            } else {
                categoryName = transaction.categoryGeneral;
            }
        } else {
            const incomeCat = categories.income.find(c => c.id === transaction.categoryGeneral);
            if (incomeCat) {
                categoryName = incomeCat.name;
            } else {
                categoryName = transaction.categoryGeneral;
            }
        }
        
        // Buscar nombre de cuenta
        let accountName = '-';
        if (transaction.account_id) {
            const account = accounts.find(a => (a._id || a.id) === transaction.account_id);
            accountName = account ? account.name : '-';
        }
        
        // Buscar nombre de propiedad
        let propertyName = '-';
        if (transaction.property_id) {
            const property = properties.find(p => (p._id || p.id) === transaction.property_id);
            propertyName = property ? property.name : '-';
        }
        
        row.innerHTML = `
            <td>${formatDate(date)}</td>
            <td><span class="badge badge-${transaction.type}">${transaction.type === 'income' ? 'Ingreso' : 'Gasto'}</span></td>
            <td>${categoryName} - ${transaction.categorySpecific}</td>
            <td>${transaction.description || '-'}</td>
            <td>${accountName}</td>
            <td>${propertyName}</td>
            <td>${transaction.envelope || '-'}</td>
            <td style="font-weight: 600; color: ${transaction.amount >= 0 ? '#10b981' : '#ef4444'}">${formatCurrency(transaction.amount)}</td>
            <td style="display: flex; gap: 8px; flex-wrap: wrap;">
                <button class="btn-secondary" onclick="editTransaction('${transaction._id || transaction.id}')" style="flex: 1; min-width: 80px;">Editar</button>
                <button class="btn-danger" onclick="deleteTransaction('${transaction._id || transaction.id}')" style="flex: 1; min-width: 80px;">Eliminar</button>
            </td>
        `;
        tbody.appendChild(row);
    });
    
    // Mostrar información de paginación si hay más filas que las mostradas
    if (rowsPerPage > 0 && filtered.length > rowsPerPage) {
        const totalPages = Math.ceil(filtered.length / rowsPerPage);
        const infoRow = document.createElement('tr');
        infoRow.innerHTML = `
            <td colspan="9" style="text-align: center; padding: 16px; background: var(--bg-secondary); color: var(--text-secondary); font-size: 13px;">
                Mostrando ${(currentPage - 1) * rowsPerPage + 1} - ${Math.min(currentPage * rowsPerPage, filtered.length)} de ${filtered.length} transacciones
                ${totalPages > 1 ? ` | Página ${currentPage} de ${totalPages}` : ''}
            </td>
        `;
        tbody.appendChild(infoRow);
    }
}

// Actualizar sobres
function updateEnvelopes() {
    const grid = document.getElementById('envelopesGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    if (envelopes.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 40px; color: #999;">No hay sobres creados</p>';
        return;
    }
    
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    envelopes.forEach(envelope => {
        const monthTransactions = transactions.filter(t => {
            const tDate = new Date(t.date);
            return t.envelope === envelope.name &&
                   t.type === 'expense' &&
                   tDate.getMonth() === currentMonth &&
                   tDate.getFullYear() === currentYear;
        });
        
        const spent = Math.abs(monthTransactions.reduce((sum, t) => sum + t.amount, 0));
        const remaining = envelope.budget - spent;
        const percentage = (spent / envelope.budget) * 100;
        
        // Obtener nombre del patrimonio si está asociado
        const patrimonioItem = envelope.patrimonio_id ? patrimonio.find(p => (p._id || p.id) === envelope.patrimonio_id) : null;
        const patrimonioName = patrimonioItem ? patrimonioItem.name : null;
        
        const card = document.createElement('div');
        card.className = 'envelope-card';
        card.innerHTML = `
            <div style="margin-bottom: 8px;">
                <h3 style="margin: 0 0 4px 0;">${envelope.name}</h3>
                ${patrimonioName ? `<small style="font-size: 11px; color: var(--gray-500);">Asociado a: ${patrimonioName}</small>` : ''}
            </div>
            <div class="envelope-budget">${formatCurrency(envelope.budget)}</div>
            <div class="envelope-spent">Gastado: ${formatCurrency(spent)}</div>
            <div class="envelope-remaining ${remaining < 0 ? 'negative' : ''}">
                Restante: ${formatCurrency(remaining)}
            </div>
            <div class="envelope-progress">
                <div class="envelope-progress-bar" style="width: ${Math.min(percentage, 100)}%"></div>
            </div>
            <div class="envelope-actions" style="display: flex; gap: 8px; margin-top: 12px;">
                <button class="btn-secondary" onclick="editEnvelope('${envelope._id || envelope.id}')" style="flex: 1;">Editar</button>
                <button class="btn-danger" onclick="deleteEnvelope('${envelope._id || envelope.id}')" style="flex: 1;">Eliminar</button>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Actualizar selector de sobres
function updateEnvelopeSelect(selectId = 'envelope') {
    const select = document.getElementById(selectId);
    if (!select) return;
    
    select.innerHTML = '<option value="">Ninguno</option>';
    envelopes.forEach(envelope => {
        const option = document.createElement('option');
        option.value = envelope._id || envelope.id || envelope.name;
        option.textContent = envelope.name;
        select.appendChild(option);
    });
}

// Actualizar selector de cuentas bancarias
function updateAccountSelect(selectId = 'transactionAccount') {
    const select = document.getElementById(selectId);
    if (!select) return;
    
    select.innerHTML = '<option value="">Ninguna</option>';
    accounts.forEach(account => {
        const option = document.createElement('option');
        option.value = account._id || account.id;
        option.textContent = `${account.name}${account.bank ? ` (${account.bank})` : ''}`;
        select.appendChild(option);
    });
}

// Actualizar selector de inversiones
function updateInvestmentSelect(selectId = 'transactionInvestment') {
    const select = document.getElementById(selectId);
    if (!select) return;
    
    select.innerHTML = '<option value="">Ninguna</option>';
    investments.forEach(investment => {
        const option = document.createElement('option');
        option.value = investment._id || investment.id;
        option.textContent = investment.name;
        select.appendChild(option);
    });
}

// Actualizar selector de propiedades
// Actualizar selector de préstamos
function updateLoanSelect(selectId = 'transactionLoan') {
    const select = document.getElementById(selectId);
    if (!select) return;
    
    select.innerHTML = '<option value="">Ninguno</option>';
    loans.filter(loan => loan.type === 'debt').forEach(loan => {
        const option = document.createElement('option');
        option.value = loan._id || loan.id;
        option.textContent = `${loan.name} (${formatCurrency(loan.principal)})`;
        select.appendChild(option);
    });
}

// Actualizar selector de patrimonio (para préstamos)
function updatePatrimonioSelect(selectId = 'loanPatrimonio') {
    const select = document.getElementById(selectId);
    if (!select) return;
    
    const currentValue = select.value;
    select.innerHTML = '<option value="">Ninguna</option>';
    patrimonio.forEach(prop => {
        const option = document.createElement('option');
        option.value = prop._id || prop.id;
        const typeNames = {
            apartment: 'Apartamento',
            house: 'Casa',
            office: 'Oficina',
            commercial: 'Comercial',
            vehicle: 'Vehículo',
            jewelry: 'Joyas',
            art: 'Arte',
            electronics: 'Electrónica',
            other: 'Otro'
        };
        option.textContent = `${prop.name} (${typeNames[prop.type] || prop.type})`;
        select.appendChild(option);
    });
    
    // Restaurar valor seleccionado si existe
    if (currentValue) {
        select.value = currentValue;
    }
}

// Función para alternar entre categoría y patrimonio en presupuestos
function toggleBudgetTarget() {
    const targetType = document.getElementById('budgetTargetType').value;
    const categoryGroup = document.getElementById('budgetCategoryGroup');
    const patrimonioGroup = document.getElementById('budgetPatrimonioGroup');
    const categorySelect = document.getElementById('budgetCategory');
    const patrimonioSelect = document.getElementById('budgetPatrimonio');
    
    if (targetType === 'category') {
        categoryGroup.style.display = 'block';
        patrimonioGroup.style.display = 'none';
        categorySelect.required = true;
        patrimonioSelect.required = false;
        patrimonioSelect.value = '';
    } else {
        categoryGroup.style.display = 'none';
        patrimonioGroup.style.display = 'block';
        categorySelect.required = false;
        patrimonioSelect.required = true;
        categorySelect.value = '';
        // Actualizar selector de patrimonio
        updatePatrimonioSelect('budgetPatrimonio');
    }
}

// ==================== PRESUPUESTOS ====================

// Agregar presupuesto
async function addBudget() {
    const targetType = document.getElementById('budgetTargetType').value;
    const category_id = targetType === 'category' ? document.getElementById('budgetCategory').value : null;
    const patrimonio_id = targetType === 'patrimonio' ? document.getElementById('budgetPatrimonio').value : null;
    const amount = parseFloat(document.getElementById('budgetAmount').value);
    const period_type = document.getElementById('budgetPeriodType').value;
    const period_value = document.getElementById('budgetPeriodValue').value;
    const duration = period_type === 'monthly' ? parseInt(document.getElementById('budgetDuration')?.value || '1') : 1;
    
    if ((!category_id && !patrimonio_id) || !amount || !period_type || !period_value) {
        alert('Por favor completa todos los campos');
        return;
    }
    
    if (isNaN(amount) || amount <= 0) {
        alert('El monto debe ser un número positivo');
        return;
    }
    
    try {
        // Si es mensual, crear presupuestos según la duración
        if (period_type === 'monthly') {
            if (duration === 0) {
                // Duración indefinida: crear presupuesto solo para el mes inicial
                const budget = await apiRequest('/budgets', {
                    method: 'POST',
                    body: JSON.stringify({
                        category_id: category_id || null,
                        patrimonio_id: patrimonio_id || null,
                        amount,
                        period_type,
                        period_value
                    })
                });
                
                await loadUserData();
                updateDisplay();
                
                alert(`✅ Presupuesto mensual establecido indefinidamente desde ${period_value}`);
            } else {
                // Duración específica: crear múltiples presupuestos
                const startDate = new Date(period_value + '-01');
                const budgetsCreated = [];
                
                for (let i = 0; i < duration; i++) {
                    const currentDate = new Date(startDate);
                    currentDate.setMonth(startDate.getMonth() + i);
                    const monthValue = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
                    
                    try {
                        const budget = await apiRequest('/budgets', {
                            method: 'POST',
                            body: JSON.stringify({
                                category_id: category_id || null,
                                patrimonio_id: patrimonio_id || null,
                                amount,
                                period_type,
                                period_value: monthValue
                            })
                        });
                        budgetsCreated.push(monthValue);
                    } catch (error) {
                        console.error(`Error creando presupuesto para ${monthValue}:`, error);
                        alert(`Error al crear presupuesto para ${monthValue}: ${error.message}`);
                    }
                }
                
                await loadUserData();
                updateDisplay();
                
                alert(`✅ Presupuesto establecido para ${budgetsCreated.length} mes(es) exitosamente`);
            }
            
            // Resetear formulario y ocultarlo
            const budgetForm = document.getElementById('budgetForm');
            if (budgetForm) {
                budgetForm.reset();
                const budgetPeriodType = document.getElementById('budgetPeriodType');
                if (budgetPeriodType) budgetPeriodType.value = 'monthly';
                const budgetPeriodValue = document.getElementById('budgetPeriodValue');
                if (budgetPeriodValue) {
                    const now = new Date();
                    budgetPeriodValue.value = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
                }
                const budgetDuration = document.getElementById('budgetDuration');
                if (budgetDuration) budgetDuration.value = '1';
                // Ocultar formulario después de agregar exitosamente
                if (budgetForm.style.display !== 'none') {
                    toggleForm('budgetForm', 'toggleBudgetFormBtn');
                }
            }
        } else {
            // Para otros tipos de período o duración 0 (indefinido), crear uno solo
            const budget = await apiRequest('/budgets', {
                method: 'POST',
                body: JSON.stringify({
                    category_id,
                    amount,
                    period_type,
                    period_value
                })
            });
            
            await loadUserData();
            updateDisplay();
            
            // Resetear formulario y ocultarlo
            const budgetForm = document.getElementById('budgetForm');
            if (budgetForm) {
                budgetForm.reset();
                const budgetPeriodType = document.getElementById('budgetPeriodType');
                if (budgetPeriodType) budgetPeriodType.value = 'monthly';
                const budgetPeriodValue = document.getElementById('budgetPeriodValue');
                if (budgetPeriodValue) {
                    const now = new Date();
                    budgetPeriodValue.value = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
                }
                // Ocultar formulario después de agregar exitosamente
                if (budgetForm.style.display !== 'none') {
                    toggleForm('budgetForm', 'toggleBudgetFormBtn');
                }
            }
            
            alert('✅ Presupuesto establecido exitosamente');
        }
    } catch (error) {
        alert('Error al establecer presupuesto: ' + error.message);
    }
}

// Función auxiliar para obtener el lunes de la semana
function getWeekStartDate(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Ajustar al lunes
    const monday = new Date(d.setDate(diff));
    return monday.toISOString().split('T')[0];
}

// Actualizar presupuestos
function updateBudgets() {
    const grid = document.getElementById('budgetsGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const currentYear = now.getFullYear().toString();
    const currentWeek = getWeekStartDate(now);
    
    // Filtrar presupuestos activos (del período actual)
    const activeBudgets = budgets.filter(b => {
        if (b.period_type === 'monthly') {
            return b.period_value === currentMonth;
        } else if (b.period_type === 'yearly') {
            return b.period_value === currentYear;
        } else if (b.period_type === 'weekly') {
            return b.period_value === currentWeek;
        }
        return false;
    });
    
    if (activeBudgets.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--gray-500);">No hay presupuestos activos para el período actual</p>';
        return;
    }
    
    // Calcular transacciones por categoría según período (ingresos y gastos)
    const transactionsByCategory = {};
    transactions.forEach(t => {
        const tDate = new Date(t.date);
        
        // Verificar si la transacción está en algún período activo
        const isInActivePeriod = activeBudgets.some(b => {
            if (b.period_type === 'monthly') {
                return tDate.toISOString().startsWith(b.period_value);
            } else if (b.period_type === 'yearly') {
                return tDate.getFullYear().toString() === b.period_value;
            } else if (b.period_type === 'weekly') {
                const weekStart = new Date(b.period_value);
                const weekEnd = new Date(weekStart);
                weekEnd.setDate(weekEnd.getDate() + 6);
                return tDate >= weekStart && tDate <= weekEnd;
            }
            return false;
        });
        
        if (isInActivePeriod) {
            const catId = t.categoryGeneral;
            if (!transactionsByCategory[catId]) {
                transactionsByCategory[catId] = { income: 0, expense: 0 };
            }
            if (t.type === 'income') {
                transactionsByCategory[catId].income += t.amount;
            } else {
                transactionsByCategory[catId].expense += Math.abs(t.amount);
            }
        }
    });
    
    activeBudgets.forEach(budget => {
        // Determinar si es presupuesto de categoría o patrimonio
        let categoryName = '';
        let patrimonioName = '';
        let isIncome = false;
        
        if (budget.patrimonio_id) {
            // Presupuesto asociado a patrimonio
            const patrimonioItem = patrimonio.find(p => (p._id || p.id) === budget.patrimonio_id);
            patrimonioName = patrimonioItem ? patrimonioItem.name : 'Patrimonio desconocido';
        } else if (budget.category_id) {
            // Presupuesto asociado a categoría
            let category = categories.expense.find(c => c.id === budget.category_id);
            if (!category) {
                category = categories.income.find(c => c.id === budget.category_id);
                isIncome = true;
            }
            categoryName = category ? category.name : budget.category_id;
        }
        
        const displayName = patrimonioName || categoryName;
        // Calcular transacciones según tipo de presupuesto
        let actual = 0;
        if (budget.patrimonio_id) {
            // Calcular transacciones asociadas al patrimonio
            const patrimonioTransactions = transactions.filter(t => {
                const tDate = new Date(t.date);
                let isInActivePeriod = false;
                if (budget.period_type === 'monthly') {
                    const budgetMonth = new Date(budget.period_value + '-01');
                    isInActivePeriod = tDate.getMonth() === budgetMonth.getMonth() && 
                                      tDate.getFullYear() === budgetMonth.getFullYear();
                } else if (budget.period_type === 'yearly') {
                    isInActivePeriod = tDate.getFullYear() === parseInt(budget.period_value);
                } else if (budget.period_type === 'weekly') {
                    const weekStart = new Date(budget.period_value);
                    const weekEnd = new Date(weekStart);
                    weekEnd.setDate(weekEnd.getDate() + 6);
                    isInActivePeriod = tDate >= weekStart && tDate <= weekEnd;
                }
                return isInActivePeriod && (t.property_id === budget.patrimonio_id || t.patrimonio_id === budget.patrimonio_id);
            });
            actual = Math.abs(patrimonioTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0));
        } else {
            actual = isIncome ? 
                (transactionsByCategory[budget.category_id]?.income || 0) : 
                (transactionsByCategory[budget.category_id]?.expense || 0);
        }
        const difference = isIncome ? (actual - budget.amount) : (budget.amount - actual);
        const percentage = budget.amount > 0 ? (actual / budget.amount) * 100 : 0;
        const isOverBudget = isIncome ? (actual < budget.amount) : (actual > budget.amount);
        
        // Obtener etiqueta del período
        let periodLabel = '';
        if (budget.period_type === 'weekly') {
            periodLabel = 'Semanal';
        } else if (budget.period_type === 'monthly') {
            periodLabel = 'Mensual';
        } else if (budget.period_type === 'yearly') {
            periodLabel = 'Anual';
        }
        
        const card = document.createElement('div');
        card.className = 'envelope-card';
        card.style.borderLeft = `4px solid ${isOverBudget ? 'var(--danger)' : percentage > 80 ? 'var(--warning)' : 'var(--success)'}`;
        card.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 12px;">
                <div>
                    <h3 style="margin: 0;">${displayName}</h3>
                    ${patrimonioName ? `<small style="font-size: 11px; color: var(--gray-500);">Patrimonio</small>` : ''}
                </div>
                <span style="font-size: 11px; padding: 4px 8px; background: var(--gray-100); border-radius: var(--radius); color: var(--gray-700); font-weight: 600;">${periodLabel}</span>
            </div>
            <div style="margin: 12px 0;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span style="font-size: 13px; color: var(--gray-600);">Presupuesto:</span>
                    <span style="font-weight: 600; color: var(--gray-900);">${formatCurrency(budget.amount)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span style="font-size: 13px; color: var(--gray-600);">${isIncome ? 'Ingresado:' : 'Gastado:'}</span>
                    <span style="font-weight: 600; color: ${isOverBudget ? 'var(--danger)' : 'var(--gray-900)'};">${formatCurrency(actual)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                    <span style="font-size: 13px; color: var(--gray-600);">${isIncome ? 'Falta:' : 'Restante:'}</span>
                    <span style="font-weight: 700; font-size: 16px; color: ${difference >= 0 ? 'var(--success)' : 'var(--danger)'};">
                        ${formatCurrency(Math.abs(difference))}
                    </span>
                </div>
            </div>
            <div style="margin: 12px 0;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                    <span style="font-size: 12px; color: var(--gray-600);">Progreso:</span>
                    <span style="font-size: 12px; font-weight: 600; color: ${isOverBudget ? 'var(--danger)' : percentage > 80 ? 'var(--warning)' : 'var(--gray-700)'};">
                        ${percentage.toFixed(1)}%
                    </span>
                </div>
                <div class="envelope-progress">
                    <div class="envelope-progress-bar" style="width: ${Math.min(percentage, 100)}%; background: ${isOverBudget ? 'var(--danger)' : percentage > 80 ? 'var(--warning)' : 'var(--success)'};"></div>
                </div>
            </div>
            ${isOverBudget ? `
                <div style="margin-top: 12px; padding: 12px 16px; background: linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.15) 100%); border: 1.5px solid rgba(239, 68, 68, 0.3); border-left: 4px solid var(--danger); border-radius: 10px; display: flex; align-items: center; gap: 10px; box-shadow: 0 2px 8px rgba(239, 68, 68, 0.1);">
                    <span style="color: var(--danger); font-size: 13px; font-weight: 700; flex: 1;">${isIncome ? 'Por debajo del presupuesto' : 'Presupuesto excedido'}</span>
                </div>
            ` : ''}
            <div style="margin-top: 8px; padding: 6px; background: ${isIncome ? 'var(--success-light)' : 'var(--gray-50)'}; border-radius: var(--radius); font-size: 11px; color: var(--gray-700);">
                ${isIncome ? 'Ingreso' : 'Gasto'}
            </div>
            <div class="envelope-actions" style="display: flex; gap: 8px; margin-top: 12px;">
                <button class="btn-secondary" onclick="editBudget('${budget._id || budget.id}')" style="flex: 1;">Editar</button>
                <button class="btn-danger" onclick="deleteBudget('${budget._id || budget.id}')" style="flex: 1;">Eliminar</button>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Editar presupuesto - Abre modal con formulario pre-rellenado
async function editBudget(id) {
    const budget = budgets.find(b => (b._id || b.id) === id);
    if (!budget) return;
    
    currentEditingBudgetId = id;
    
    // Crear o obtener modal
    let modal = document.getElementById('editBudgetModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'editBudgetModal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 600px;">
                <div style="background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%); padding: 28px 32px; color: white; position: sticky; top: 0; z-index: 10; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <h2 style="margin: 0; font-size: 26px; font-weight: 700; color: white; letter-spacing: -0.5px;">Editar Presupuesto</h2>
                        <button onclick="closeEditBudgetModal()" style="background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.3); color: white; padding: 0; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; border-radius: 50%; transition: all 0.2s; cursor: pointer; font-size: 20px; font-weight: 300;" onmouseover="this.style.background='rgba(255,255,255,0.3)'" onmouseout="this.style.background='rgba(255,255,255,0.2)'">×</button>
                    </div>
                </div>
                <form id="editBudgetForm" style="padding: 32px; display: flex; flex-direction: column; gap: 20px;">
                    <div class="form-group">
                        <label for="editBudgetAmount">Monto del Presupuesto (€)</label>
                        <input type="number" id="editBudgetAmount" step="0.01" min="0" required>
                        <small>Monto del presupuesto para esta categoría</small>
                    </div>
                    <div style="display: flex; gap: 12px; margin-top: 8px;">
                        <button type="button" class="btn-secondary" onclick="closeEditBudgetModal()" style="flex: 1;">Cancelar</button>
                        <button type="submit" class="btn-primary" style="flex: 1;">Actualizar Presupuesto</button>
                    </div>
                </form>
            </div>
        `;
        document.body.appendChild(modal);
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeEditBudgetModal();
            }
        });
        
        const form = document.getElementById('editBudgetForm');
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                await updateBudgetFromModal();
            });
        }
    }
    
    // Pre-llenar formulario
    const amountEl = document.getElementById('editBudgetAmount');
    if (!amountEl) {
        showToast('Error: No se encontró el campo del formulario', 'error');
        return;
    }
    
    amountEl.value = budget.amount || 0;
    
    // Mostrar modal
    modal.style.display = 'flex';
}

// Cerrar modal de edición de presupuesto
function closeEditBudgetModal() {
    const modal = document.getElementById('editBudgetModal');
    if (modal) {
        modal.style.display = 'none';
        currentEditingBudgetId = null;
    }
}

// Actualizar presupuesto desde modal
async function updateBudgetFromModal() {
    if (!currentEditingBudgetId) return;
    
    try {
        const budget = budgets.find(b => (b._id || b.id) === currentEditingBudgetId);
        if (!budget) return;
        
        const amountEl = document.getElementById('editBudgetAmount');
        if (!amountEl) {
            showToast('Error: No se encontró el campo del formulario', 'error');
            return;
        }
        
        const amountValue = parseFloat(amountEl.value);
        if (isNaN(amountValue) || amountValue <= 0) {
            showToast('Por favor ingresa un monto válido', 'warning');
            return;
        }
        
        showLoader('Actualizando presupuesto...');
        await apiRequest(`/budgets/${currentEditingBudgetId}`, {
            method: 'PUT',
            body: JSON.stringify({
                amount: amountValue,
                category: budget.category,
                period_type: budget.period_type,
                period_value: budget.period_value
            })
        });
        
        await loadUserData();
        updateDisplay();
        hideLoader();
        closeEditBudgetModal();
        showToast('Presupuesto actualizado exitosamente', 'success');
    } catch (error) {
        hideLoader();
        showToast('Error al actualizar presupuesto: ' + error.message, 'error');
    }
}

window.closeEditBudgetModal = closeEditBudgetModal;

// Eliminar presupuesto
async function deleteBudget(id) {
    const confirmed = await showConfirm(
        'Eliminar Presupuesto',
        '¿Estás seguro de eliminar este presupuesto? Esta acción no se puede deshacer.',
        'Eliminar',
        'Cancelar'
    );
    if (!confirmed) return;
    
    try {
        showLoader('Eliminando presupuesto...');
        await apiRequest(`/budgets/${id}`, { method: 'DELETE' });
        await loadUserData();
        updateDisplay();
        hideLoader();
        showToast('Presupuesto eliminado exitosamente', 'success');
    } catch (error) {
        hideLoader();
        showToast('Error al eliminar presupuesto: ' + error.message, 'error');
    }
}

// Exponer funciones globales
window.deleteBudget = deleteBudget;
window.editBudget = editBudget;

// Actualizar filtro de meses
function updateMonthFilter() {
    const select = document.getElementById('filterMonth');
    if (!select) return;
    
    const months = new Set();
    
    transactions.forEach(t => {
        const date = new Date(t.date);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        months.add(monthKey);
    });
    
    const sortedMonths = Array.from(months).sort().reverse();
    select.innerHTML = '<option value="">Todos los meses</option>';
    
    sortedMonths.forEach(month => {
        const [year, monthNum] = month.split('-');
        const date = new Date(year, parseInt(monthNum) - 1);
        const option = document.createElement('option');
        option.value = month;
        option.textContent = date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long' });
        select.appendChild(option);
    });
}

// Eliminar transacción
async function deleteTransaction(id) {
    const confirmed = await showConfirm(
        'Eliminar Transacción',
        '¿Estás seguro de eliminar esta transacción? Esta acción no se puede deshacer.',
        'Eliminar',
        'Cancelar'
    );
    if (!confirmed) return;
    
    try {
        showLoader('Eliminando transacción...');
        await apiRequest(`/transactions/${id}`, { method: 'DELETE' });
        await loadUserData();
        updateDisplay();
        hideLoader();
        showToast('Transacción eliminada exitosamente', 'success');
    } catch (error) {
        hideLoader();
        showToast('Error al eliminar transacción: ' + error.message, 'error');
    }
}

// Editar transacción - Abre modal con formulario pre-rellenado
async function editTransaction(id) {
    const transaction = transactions.find(t => (t._id || t.id) === id);
    if (!transaction) return;
    
    currentEditingTransactionId = id;
    
    // Crear o obtener modal
    let modal = document.getElementById('editTransactionModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'editTransactionModal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 700px;">
                <div style="background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%); padding: 28px 32px; color: white; position: sticky; top: 0; z-index: 10; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <h2 style="margin: 0; font-size: 26px; font-weight: 700; color: white; letter-spacing: -0.5px;">Editar Transacción</h2>
                        <button onclick="closeEditTransactionModal()" style="background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.3); color: white; padding: 0; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; border-radius: 50%; transition: all 0.2s; cursor: pointer; font-size: 20px; font-weight: 300;" onmouseover="this.style.background='rgba(255,255,255,0.3)'" onmouseout="this.style.background='rgba(255,255,255,0.2)'">×</button>
                    </div>
                </div>
                <form id="editTransactionForm" style="padding: 32px; display: flex; flex-direction: column; gap: 20px; max-height: calc(90vh - 100px); overflow-y: auto;">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="editTransactionType">Tipo</label>
                            <select id="editTransactionType" required>
                                <option value="income">Ingreso</option>
                                <option value="expense">Gasto</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="editTransactionDate">Fecha</label>
                            <input type="date" id="editTransactionDate" required>
                        </div>
                        <div class="form-group">
                            <label for="editTransactionAmount">Monto (€)</label>
                            <input type="number" id="editTransactionAmount" step="0.01" min="0" required>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="editTransactionCategoryGeneral">Categoría General</label>
                            <select id="editTransactionCategoryGeneral" required></select>
                        </div>
                        <div class="form-group">
                            <label for="editTransactionCategorySpecific">Categoría Específica</label>
                            <select id="editTransactionCategorySpecific" required></select>
                        </div>
                        <div class="form-group">
                            <label for="editTransactionEnvelope">Sobre (Opcional)</label>
                            <select id="editTransactionEnvelope">
                                <option value="">Ninguno</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="editTransactionAccount">Cuenta Bancaria (Opcional)</label>
                            <select id="editTransactionAccount">
                                <option value="">Ninguna</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="editTransactionInvestment">Inversión (Opcional)</label>
                            <select id="editTransactionInvestment">
                                <option value="">Ninguna</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="editTransactionProperty">Propiedad (Opcional)</label>
                            <select id="editTransactionProperty">
                                <option value="">Ninguna</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="editTransactionLoan">Préstamo (Opcional)</label>
                            <select id="editTransactionLoan">
                                <option value="">Ninguno</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group" style="flex: 1;">
                            <label for="editTransactionDescription">Descripción</label>
                            <input type="text" id="editTransactionDescription" placeholder="Ej: Compra en supermercado">
                        </div>
                    </div>
                    <div style="display: flex; gap: 12px; margin-top: 8px;">
                        <button type="button" class="btn-secondary" onclick="closeEditTransactionModal()" style="flex: 1;">Cancelar</button>
                        <button type="submit" class="btn-primary" style="flex: 1;">Actualizar Transacción</button>
                    </div>
                </form>
            </div>
        `;
        document.body.appendChild(modal);
        
        // Event listener para cerrar al hacer clic fuera
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeEditTransactionModal();
            }
        });
        
        // Event listener para el formulario
        const form = document.getElementById('editTransactionForm');
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                await updateTransactionFromModal();
            });
        }
    }
    
    // Pre-llenar formulario
    const typeEl = document.getElementById('editTransactionType');
    const dateEl = document.getElementById('editTransactionDate');
    const amountEl = document.getElementById('editTransactionAmount');
    const categoryGeneralEl = document.getElementById('editTransactionCategoryGeneral');
    const categorySpecificEl = document.getElementById('editTransactionCategorySpecific');
    const envelopeEl = document.getElementById('editTransactionEnvelope');
    const accountIdEl = document.getElementById('editTransactionAccount');
    const investmentIdEl = document.getElementById('editTransactionInvestment');
    const propertyIdEl = document.getElementById('editTransactionProperty');
    const descriptionEl = document.getElementById('editTransactionDescription');
    
    if (!typeEl || !dateEl || !amountEl || !categoryGeneralEl || !categorySpecificEl) {
        showToast('Error: No se encontraron todos los campos del formulario', 'error');
        return;
    }
    
    // Pre-llenar campos básicos
    typeEl.value = transaction.type;
    dateEl.value = transaction.date;
    amountEl.value = Math.abs(transaction.amount);
    
    // Llenar categorías
    initializeCategories();
    setTimeout(() => {
        const type = transaction.type;
        const cats = type === 'income' ? categories.income : categories.expense;
        
        categoryGeneralEl.innerHTML = '<option value="">Seleccionar...</option>';
        cats.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.id;
            option.textContent = cat.name;
            if (cat.id === transaction.categoryGeneral) option.selected = true;
            categoryGeneralEl.appendChild(option);
        });
        
        // Actualizar categorías específicas
        const selectedCat = cats.find(c => c.id === transaction.categoryGeneral);
        if (selectedCat) {
            categorySpecificEl.innerHTML = '<option value="">Seleccionar...</option>';
            selectedCat.subcategories.forEach(sub => {
                const option = document.createElement('option');
                option.value = sub;
                option.textContent = sub;
                if (sub === transaction.categorySpecific) option.selected = true;
                categorySpecificEl.appendChild(option);
            });
        }
        
        // Llenar selectores opcionales
        updateEnvelopeSelect('editTransactionEnvelope');
        updateAccountSelect('editTransactionAccount');
        updateInvestmentSelect('editTransactionInvestment');
        updateLoanSelect('editTransactionLoan');
        
        setTimeout(() => {
            if (transaction.envelope_id && envelopeEl) {
                envelopeEl.value = transaction.envelope_id;
            }
            if (transaction.account_id && accountIdEl) {
                accountIdEl.value = transaction.account_id;
            }
            if (transaction.investment_id && investmentIdEl) {
                investmentIdEl.value = transaction.investment_id;
            }
            if (transaction.property_id && propertyIdEl) {
                propertyIdEl.value = transaction.property_id;
            }
            const loanIdEl = document.getElementById('editTransactionLoan');
            if (transaction.loan_id && loanIdEl) {
                loanIdEl.value = transaction.loan_id;
            }
            if (descriptionEl) {
                descriptionEl.value = transaction.description || '';
            }
        }, 200);
        
        // Listener para cambiar categorías específicas cuando cambia la general
        typeEl.addEventListener('change', () => {
            const newType = typeEl.value;
            const newCats = newType === 'income' ? categories.income : categories.expense;
            categoryGeneralEl.innerHTML = '<option value="">Seleccionar...</option>';
            newCats.forEach(cat => {
                const option = document.createElement('option');
                option.value = cat.id;
                option.textContent = cat.name;
                categoryGeneralEl.appendChild(option);
            });
        });
        
        categoryGeneralEl.addEventListener('change', () => {
            const selectedCatId = categoryGeneralEl.value;
            const type = typeEl.value;
            const cats = type === 'income' ? categories.income : categories.expense;
            const selectedCat = cats.find(c => c.id === selectedCatId);
            if (selectedCat) {
                categorySpecificEl.innerHTML = '<option value="">Seleccionar...</option>';
                selectedCat.subcategories.forEach(sub => {
                    const option = document.createElement('option');
                    option.value = sub;
                    option.textContent = sub;
                    categorySpecificEl.appendChild(option);
                });
            }
        });
    }, 100);
    
    // Mostrar modal
    modal.style.display = 'flex';
}

// Cerrar modal de edición de transacción
function closeEditTransactionModal() {
    const modal = document.getElementById('editTransactionModal');
    if (modal) {
        modal.style.display = 'none';
        currentEditingTransactionId = null;
    }
}

// Función auxiliar para normalizar números (reemplazar comas por puntos)
function normalizeNumber(value) {
    if (typeof value === 'string') {
        // Reemplazar comas por puntos y eliminar espacios
        return value.replace(',', '.').replace(/\s/g, '');
    }
    return value;
}

// Actualizar transacción desde modal
async function updateTransactionFromModal() {
    if (!currentEditingTransactionId) return;
    
    try {
        const typeEl = document.getElementById('editTransactionType');
        const dateEl = document.getElementById('editTransactionDate');
        const amountEl = document.getElementById('editTransactionAmount');
        const categoryGeneralEl = document.getElementById('editTransactionCategoryGeneral');
        const categorySpecificEl = document.getElementById('editTransactionCategorySpecific');
        const envelopeEl = document.getElementById('editTransactionEnvelope');
        const accountIdEl = document.getElementById('editTransactionAccount');
        const investmentIdEl = document.getElementById('editTransactionInvestment');
        const propertyIdEl = document.getElementById('editTransactionProperty');
        const descriptionEl = document.getElementById('editTransactionDescription');
        
        if (!typeEl || !dateEl || !amountEl || !categoryGeneralEl || !categorySpecificEl) {
            showToast('Error: No se encontraron todos los campos del formulario', 'error');
            return;
        }
        
        const type = typeEl.value;
        const date = dateEl.value;
        // Normalizar el monto: reemplazar comas por puntos para parseFloat
        const amountValue = normalizeNumber(amountEl.value);
        const amount = parseFloat(amountValue);
        const categoryGeneral = categoryGeneralEl.value;
        const categorySpecific = categorySpecificEl.value;
        const envelope = envelopeEl ? envelopeEl.value : '';
        const accountId = accountIdEl ? accountIdEl.value : '';
        const investmentId = investmentIdEl ? investmentIdEl.value : '';
        const propertyId = propertyIdEl ? propertyIdEl.value : '';
        const description = descriptionEl ? descriptionEl.value : '';
        
        if (!type || !date || isNaN(amount) || amount <= 0 || !categoryGeneral || !categorySpecific) {
            showToast('Por favor completa todos los campos requeridos correctamente', 'warning');
            return;
        }
        
        showLoader('Actualizando transacción...');
        
        await apiRequest(`/transactions/${currentEditingTransactionId}`, {
            method: 'PUT',
            body: JSON.stringify({
                type,
                date,
                amount: type === 'expense' ? -Math.abs(amount) : Math.abs(amount),
                categoryGeneral,
                categorySpecific,
                envelope: envelope || null,
                account_id: accountId || null,
                investment_id: investmentId || null,
                property_id: propertyId || null,
                description: description || null
            })
        });
        
        await loadUserData();
        updateDisplay();
        hideLoader();
        closeEditTransactionModal();
        showToast('Transacción actualizada exitosamente', 'success');
    } catch (error) {
        hideLoader();
        showToast('Error al actualizar transacción: ' + error.message, 'error');
    }
}

// Exponer funciones globalmente
window.closeEditTransactionModal = closeEditTransactionModal;

// Actualizar transacción
async function updateTransaction() {
    if (!currentEditingTransactionId) {
        // Modo crear
        await addTransaction();
        return;
    }
    
    try {
        const typeEl = document.getElementById('transactionType');
        const dateEl = document.getElementById('transactionDate');
        const amountEl = document.getElementById('transactionAmount');
        const categoryGeneralEl = document.getElementById('categoryGeneral');
        const categorySpecificEl = document.getElementById('categorySpecific');
        const envelopeEl = document.getElementById('envelope');
        const accountIdEl = document.getElementById('transactionAccount');
        const investmentIdEl = document.getElementById('transactionInvestment');
        const loanIdEl = document.getElementById('editTransactionLoan');
        const propertyIdEl = document.getElementById('transactionProperty');
        const descriptionEl = document.getElementById('transactionDescription');
        
        if (!typeEl || !dateEl || !amountEl || !categoryGeneralEl || !categorySpecificEl) {
            showToast('Error: No se encontraron todos los campos del formulario', 'error');
            return;
        }
        
        const type = typeEl.value;
        const date = dateEl.value;
        const amount = parseFloat(amountEl.value);
        const categoryGeneral = categoryGeneralEl.value;
        const categorySpecific = categorySpecificEl.value;
        const envelope = envelopeEl ? envelopeEl.value : '';
        const accountId = accountIdEl ? accountIdEl.value : '';
        const investmentId = investmentIdEl ? investmentIdEl.value : '';
        const loanId = loanIdEl ? loanIdEl.value : '';
        const propertyId = propertyIdEl ? propertyIdEl.value : '';
        const description = descriptionEl ? descriptionEl.value : '';
        
        if (!type || !date || isNaN(amount) || amount <= 0 || !categoryGeneral || !categorySpecific) {
            showToast('Por favor completa todos los campos requeridos', 'warning');
            return;
        }
        
        showLoader('Actualizando transacción...');
        
        await apiRequest(`/transactions/${currentEditingTransactionId}`, {
            method: 'PUT',
            body: JSON.stringify({
                type,
                date,
                amount: type === 'expense' ? -Math.abs(amount) : Math.abs(amount),
                categoryGeneral,
                categorySpecific,
                envelope: envelope || null,
                account_id: accountId || null,
                investment_id: investmentId || null,
                loan_id: loanId || null,
                property_id: propertyId || null,
                description: description || null
            })
        });
        
        await loadUserData();
        updateDisplay();
        hideLoader();
        showToast('Transacción actualizada exitosamente', 'success');
        
        // Restaurar formulario a modo crear
        resetTransactionForm();
    } catch (error) {
        hideLoader();
        showToast('Error al actualizar transacción: ' + error.message, 'error');
    }
}

// Restaurar formulario de transacciones a modo crear
function resetTransactionForm() {
    currentEditingTransactionId = null;
    const form = document.getElementById('transactionForm');
    if (form) {
        form.reset();
        initializeDate();
        initializeCategories();
        updateEnvelopeSelect();
        updateAccountSelect();
        
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.textContent = 'Agregar Transacción';
            submitBtn.classList.remove('btn-secondary');
            submitBtn.classList.add('btn-primary');
        }
    }
}

// Exponer funciones al scope global para onclick handlers
window.deleteTransaction = deleteTransaction;
window.editTransaction = editTransaction;

// Eliminar sobre
async function deleteEnvelope(id) {
    if (!confirm('¿Estás seguro de eliminar este sobre? Esto no eliminará las transacciones asociadas.')) return;
    
    try {
        await apiRequest(`/envelopes/${id}`, { method: 'DELETE' });
        // Recargar datos desde el servidor
        await loadUserData();
        updateDisplay();
    } catch (error) {
        console.error('Error eliminando sobre:', error);
        alert('Error al eliminar sobre: ' + (error.message || 'Error desconocido'));
    }
}

// Editar sobre - Abre modal con formulario pre-rellenado
async function editEnvelope(id) {
    const envelope = envelopes.find(e => (e._id || e.id) === id);
    if (!envelope) return;
    
    currentEditingEnvelopeId = id;
    
    // Crear o obtener modal
    let modal = document.getElementById('editEnvelopeModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'editEnvelopeModal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 600px;">
                <div style="background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%); padding: 28px 32px; color: white; position: sticky; top: 0; z-index: 10; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <h2 style="margin: 0; font-size: 26px; font-weight: 700; color: white; letter-spacing: -0.5px;">Editar Sobre</h2>
                        <button onclick="closeEditEnvelopeModal()" style="background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.3); color: white; padding: 0; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; border-radius: 50%; transition: all 0.2s; cursor: pointer; font-size: 20px; font-weight: 300;" onmouseover="this.style.background='rgba(255,255,255,0.3)'" onmouseout="this.style.background='rgba(255,255,255,0.2)'">×</button>
                    </div>
                </div>
                <form id="editEnvelopeForm" style="padding: 32px; display: flex; flex-direction: column; gap: 20px;">
                    <div class="form-group">
                        <label for="editEnvelopeName">Nombre del Sobre</label>
                        <input type="text" id="editEnvelopeName" placeholder="Ej: Vacaciones, Emergencias, Regalos..." required>
                        <small>Un nombre descriptivo para tu objetivo</small>
                    </div>
                    <div class="form-group">
                        <label for="editEnvelopeBudget">Presupuesto Mensual (€)</label>
                        <input type="number" id="editEnvelopeBudget" step="0.01" min="0" required placeholder="0.00">
                        <small>Cuánto planeas ahorrar cada mes en este sobre</small>
                    </div>
                    <div style="display: flex; gap: 12px; margin-top: 8px;">
                        <button type="button" class="btn-secondary" onclick="closeEditEnvelopeModal()" style="flex: 1;">Cancelar</button>
                        <button type="submit" class="btn-primary" style="flex: 1;">Actualizar Sobre</button>
                    </div>
                </form>
            </div>
        `;
        document.body.appendChild(modal);
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeEditEnvelopeModal();
            }
        });
        
        const form = document.getElementById('editEnvelopeForm');
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                await updateEnvelopeFromModal();
            });
        }
    }
    
    // Pre-llenar formulario
    const nameEl = document.getElementById('editEnvelopeName');
    const budgetEl = document.getElementById('editEnvelopeBudget');
    
    if (!nameEl || !budgetEl) {
        showToast('Error: No se encontraron todos los campos del formulario', 'error');
        return;
    }
    
    nameEl.value = envelope.name;
    budgetEl.value = envelope.budget || 0;
    
    // Mostrar modal
    modal.style.display = 'flex';
}

// Cerrar modal de edición de sobre
function closeEditEnvelopeModal() {
    const modal = document.getElementById('editEnvelopeModal');
    if (modal) {
        modal.style.display = 'none';
        currentEditingEnvelopeId = null;
    }
}

// Actualizar sobre desde modal
async function updateEnvelopeFromModal() {
    if (!currentEditingEnvelopeId) return;
    
    try {
        const nameEl = document.getElementById('editEnvelopeName');
        const budgetEl = document.getElementById('editEnvelopeBudget');
        
        if (!nameEl || !budgetEl) {
            showToast('Error: No se encontraron todos los campos del formulario', 'error');
            return;
        }
        
        const name = nameEl.value.trim();
        const budget = parseFloat(budgetEl.value);
        
        if (!name || isNaN(budget) || budget < 0) {
            showToast('Por favor completa todos los campos correctamente', 'warning');
            return;
        }
        
        showLoader('Actualizando sobre...');
        await apiRequest(`/envelopes/${currentEditingEnvelopeId}`, {
            method: 'PUT',
            body: JSON.stringify({ name, budget })
        });
        
        await loadUserData();
        updateDisplay();
        hideLoader();
        closeEditEnvelopeModal();
        showToast('Sobre actualizado exitosamente', 'success');
    } catch (error) {
        hideLoader();
        showToast('Error al actualizar sobre: ' + error.message, 'error');
    }
}

window.closeEditEnvelopeModal = closeEditEnvelopeModal;

// Actualizar sobre
async function updateEnvelope() {
    if (!currentEditingEnvelopeId) {
        await addEnvelope();
        return;
    }
    
    try {
        const nameEl = document.getElementById('envelopeName');
        const budgetEl = document.getElementById('envelopeBudget');
        
        if (!nameEl || !budgetEl) {
            showToast('Error: No se encontraron todos los campos del formulario', 'error');
            return;
        }
        
        const name = nameEl.value.trim();
        const budget = parseFloat(budgetEl.value);
        
        if (!name || isNaN(budget) || budget < 0) {
            showToast('Por favor completa todos los campos correctamente', 'warning');
            return;
        }
        
        showLoader('Actualizando sobre...');
        await apiRequest(`/envelopes/${currentEditingEnvelopeId}`, {
            method: 'PUT',
            body: JSON.stringify({ name, budget })
        });
        
        await loadUserData();
        updateDisplay();
        hideLoader();
        showToast('Sobre actualizado exitosamente', 'success');
        
        resetEnvelopeForm();
    } catch (error) {
        hideLoader();
        showToast('Error al actualizar sobre: ' + error.message, 'error');
    }
}

// Restaurar formulario de sobres
function resetEnvelopeForm() {
    currentEditingEnvelopeId = null;
    const form = document.getElementById('envelopeForm');
    if (form) {
        form.reset();
        const submitBtn = document.getElementById('envelopeSubmitBtn') || form.querySelector('button[type="submit"]');
        const cancelBtn = document.getElementById('envelopeCancelBtn');
        
        if (submitBtn) {
            submitBtn.textContent = 'Agregar Sobre';
            submitBtn.classList.remove('btn-secondary');
            submitBtn.classList.add('btn-primary');
        }
        
        if (cancelBtn) {
            cancelBtn.style.display = 'none';
        }
    }
}

window.resetEnvelopeForm = resetEnvelopeForm;

// Exponer funciones al scope global para onclick handlers
window.deleteEnvelope = deleteEnvelope;
window.editEnvelope = editEnvelope;

// Agregar préstamo
// Calcular cuota mensual usando fórmula de amortización francesa
function calculateMonthlyPayment(principal, annualRate, months) {
    if (annualRate === 0) return principal / months;
    if (months <= 0) return 0;
    const monthlyRate = annualRate / 100 / 12;
    const denominator = Math.pow(1 + monthlyRate, months) - 1;
    if (denominator === 0) return principal / months;
    return principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) / denominator;
}

// Exponer función globalmente
window.calculateMonthlyPayment = calculateMonthlyPayment;

// Calcular tabla de amortización
function calculateAmortizationTable(principal, annualRate, monthlyPayment, startDate, totalPaid = 0, earlyPayments = [], currentDateOverride = null) {
    const monthlyRate = annualRate / 100 / 12;
    let balance = principal;
    let totalInterest = 0;
    const table = [];
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const today = currentDateOverride ? new Date(currentDateOverride) : new Date();
    today.setHours(0, 0, 0, 0);
    
    // Si la fecha de inicio es futura, retornar balance completo
    if (start > today) {
        return { table, totalInterest: 0, finalBalance: principal };
    }
    
    // Ordenar pagos anticipados por fecha y crear mapa de aplicados
    const sortedEarlyPayments = [...earlyPayments].sort((a, b) => new Date(a.date) - new Date(b.date));
    const appliedPayments = new Set();
    
    // Calcular fecha de primer pago (un mes después del inicio)
    let paymentDate = new Date(start);
    paymentDate.setMonth(paymentDate.getMonth() + 1);
    paymentDate.setHours(0, 0, 0, 0);
    
    let monthNumber = 0;
    let currentBalance = principal;
    
    // Procesar pagos hasta la fecha actual
    while (paymentDate <= today && currentBalance > 0.01) {
        monthNumber++;
        const paymentKey = `${paymentDate.getTime()}`;
        
        // Aplicar pagos anticipados que ocurrieron antes de esta fecha de pago
        sortedEarlyPayments.forEach((ep, index) => {
            const epDate = new Date(ep.date);
            epDate.setHours(0, 0, 0, 0);
            const epKey = `${epDate.getTime()}-${index}`;
            if (epDate < paymentDate && epDate > start && !appliedPayments.has(epKey)) {
                currentBalance -= ep.amount;
                totalInterest += ep.commission || 0;
                appliedPayments.add(epKey);
            }
        });
        
        // Aplicar pago mensual
        const interest = currentBalance * monthlyRate;
        const principalPayment = Math.min(monthlyPayment - interest, currentBalance);
        currentBalance -= principalPayment;
        totalInterest += interest;
        
        table.push({
            month: monthNumber,
            date: new Date(paymentDate),
            payment: monthlyPayment,
            principal: principalPayment,
            interest,
            balance: Math.max(0, currentBalance)
        });
        
        // Avanzar al siguiente mes
        paymentDate.setMonth(paymentDate.getMonth() + 1);
    }
    
    // Aplicar pagos anticipados que ocurrieron después del último pago mensual pero antes de hoy
    const lastPaymentDate = monthNumber > 0 ? new Date(start) : new Date(start);
    if (monthNumber > 0) {
        lastPaymentDate.setMonth(lastPaymentDate.getMonth() + monthNumber);
    }
    sortedEarlyPayments.forEach((ep, index) => {
        const epDate = new Date(ep.date);
        epDate.setHours(0, 0, 0, 0);
        const epKey = `${epDate.getTime()}-${index}`;
        if (epDate > lastPaymentDate && epDate <= today && !appliedPayments.has(epKey)) {
            currentBalance -= ep.amount;
            totalInterest += ep.commission || 0;
            appliedPayments.add(epKey);
        }
    });
    
    // Calcular pagos futuros (solo para la tabla completa, no afecta el balance actual)
    let futureBalance = currentBalance;
    let futureMonth = monthNumber;
    let futureDate = new Date(paymentDate);
    while (futureBalance > 0.01 && futureMonth < 600) { // Máximo 50 años
        futureMonth++;
        
        const interest = futureBalance * monthlyRate;
        const principalPayment = Math.min(monthlyPayment - interest, futureBalance);
        futureBalance -= principalPayment;
        
        table.push({
            month: futureMonth,
            date: new Date(futureDate),
            payment: monthlyPayment,
            principal: principalPayment,
            interest,
            balance: Math.max(0, futureBalance)
        });
        
        futureDate.setMonth(futureDate.getMonth() + 1);
    }
    
    return { table, totalInterest, finalBalance: Math.max(0, currentBalance) };
}

async function addLoan() {
    const name = document.getElementById('loanName').value.trim();
    const principal = parseFloat(document.getElementById('loanPrincipal').value);
    const interestRate = parseFloat(document.getElementById('loanInterestRate').value);
    const taeInput = document.getElementById('loanTAE').value;
    const tae = taeInput !== '' ? parseFloat(taeInput) : null;
    const startDate = document.getElementById('loanStartDate').value;
    const endDate = document.getElementById('loanEndDate').value;
    const monthlyPayment = parseFloat(document.getElementById('loanMonthlyPayment').value);
    const type = document.getElementById('loanType').value;
    const accountId = document.getElementById('loanAccount') ? document.getElementById('loanAccount').value : '';
    const patrimonioId = document.getElementById('loanPatrimonio') ? document.getElementById('loanPatrimonio').value : '';
    const description = document.getElementById('loanDescription').value.trim();
    const openingCommission = parseFloat(document.getElementById('loanOpeningCommission').value) || 0;
    const earlyPaymentCommission = parseFloat(document.getElementById('loanEarlyPaymentCommission').value) || 0;
    const paymentDay = parseInt(document.getElementById('loanPaymentDay').value) || 1;
    
    if (!name || !principal || principal <= 0 || isNaN(interestRate) || interestRate < 0 || !startDate || !endDate || !monthlyPayment || monthlyPayment <= 0 || !type) {
        alert('Por favor completa todos los campos requeridos correctamente');
        return;
    }
    
    try {
        const loan = await apiRequest('/loans', {
            method: 'POST',
            body: JSON.stringify({
                name,
                principal,
                interest_rate: interestRate,
                tae: tae,
                start_date: startDate,
                end_date: endDate,
                monthly_payment: monthlyPayment,
                type,
                account_id: accountId || null,
                patrimonio_id: patrimonioId || null,
                description: description || null,
                opening_commission: openingCommission,
                early_payment_commission: earlyPaymentCommission,
                payment_day: paymentDay
            })
        });
        
        loans.push(loan);
        updateDisplay();
        updateLoanSelect(); // Actualizar selector de préstamos en transacciones
        const loanForm = document.getElementById('loanForm');
        if (loanForm) {
            loanForm.reset();
            const loanStartDate = document.getElementById('loanStartDate');
            if (loanStartDate) {
                const today = new Date().toISOString().split('T')[0];
                loanStartDate.value = today;
            }
            // Ocultar formulario después de agregar exitosamente
            if (loanForm.style.display !== 'none') {
                toggleForm('loanForm', 'toggleLoanFormBtn');
            }
        }
        alert('✅ Préstamo agregado exitosamente');
    } catch (error) {
        alert('Error al crear préstamo: ' + error.message);
    }
}

// Actualizar préstamos con cálculos avanzados
function updateLoans() {
    const grid = document.getElementById('loansGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    if (loans.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 40px; color: #999;">No hay préstamos registrados</p>';
        return;
    }
    
    loans.forEach(loan => {
        const startDate = new Date(loan.start_date);
        const endDate = new Date(loan.end_date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Calcular meses
        const totalMonths = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24 * 30.44));
        const monthsElapsed = Math.max(0, Math.floor((today - startDate) / (1000 * 60 * 60 * 24 * 30.44)));
        const monthsRemaining = Math.max(0, Math.ceil((endDate - today) / (1000 * 60 * 60 * 24 * 30.44)));
        
        // Calcular amortización basada en el mes actual (no en total_paid)
        const amortization = calculateAmortizationTable(
            loan.principal,
            loan.interest_rate,
            loan.monthly_payment,
            loan.start_date,
            0, // No usar total_paid, calcular desde el inicio hasta hoy
            loan.early_payments || []
        );
        
        // Calcular totales basados en los pagos hasta la fecha actual
        const remainingPrincipal = amortization.finalBalance;
        const capitalPaid = loan.principal - remainingPrincipal; // Capital realmente pagado
        const totalInterestPaid = amortization.totalInterest; // Intereses pagados hasta hoy
        const totalPaidIncludingInterest = amortization.table.reduce((sum, row) => sum + row.payment, 0) + 
                                          (loan.early_payments || []).reduce((sum, ep) => sum + ep.amount + (ep.commission || 0), 0);
        
        // Calcular costo real usando TAE si está disponible, sino TIN
        const effectiveRate = loan.tae || loan.interest_rate;
        const monthlyEffectiveRate = effectiveRate / 100 / 12;
        
        // Calcular interés total proyectado con TAE
        let totalInterestProjected = 0;
        let testBalance = loan.principal;
        for (let i = 0; i < totalMonths && testBalance > 0.01; i++) {
            const interest = testBalance * monthlyEffectiveRate;
            const principalPayment = Math.min(loan.monthly_payment - interest, testBalance);
            testBalance -= principalPayment;
            totalInterestProjected += interest;
        }
        
        const totalAmount = loan.principal + totalInterestProjected + (loan.opening_commission || 0);
        const totalCommissions = (loan.opening_commission || 0) + (loan.early_payments || []).reduce((sum, ep) => sum + (ep.commission || 0), 0);
        const realCost = totalInterestProjected + totalCommissions; // Costo real del préstamo
        const totalCost = totalAmount - loan.principal; // Costo total (intereses + comisiones)
        
        // Calcular progreso basado en capital pagado vs capital total
        const progressPercentage = (capitalPaid / loan.principal) * 100;
        
        // Calcular próximo pago
        const nextPaymentDate = new Date(startDate);
        nextPaymentDate.setMonth(nextPaymentDate.getMonth() + monthsElapsed + 1);
        nextPaymentDate.setDate(loan.payment_day || 1);
        
        const card = document.createElement('div');
        card.className = 'envelope-card';
        card.style.border = loan.type === 'debt' ? '2px solid var(--danger)' : '2px solid var(--success)';
        card.style.position = 'relative';
        card.innerHTML = `
            <h3 style="color: var(--text-primary);">${loan.name} <span style="font-size: 12px; color: ${loan.type === 'debt' ? 'var(--danger)' : 'var(--success)'}">(${loan.type === 'debt' ? 'Debo' : 'Me deben'})</span></h3>
            
            <div style="margin: 10px 0; padding: 12px; background: ${loan.type === 'debt' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)'}; border-radius: 6px;">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 13px; margin-bottom: 12px;">
                    <div style="color: var(--text-secondary);"><strong>Principal:</strong></div>
                    <div style="font-weight: 600; color: var(--text-primary);">${formatCurrency(loan.principal)}</div>
                    <div style="color: var(--text-secondary);"><strong>TIN (Interés Nominal):</strong></div>
                    <div style="color: var(--text-primary);">${loan.interest_rate}%</div>
                    ${loan.tae ? `
                        <div style="color: var(--text-secondary);"><strong>TAE (Costo Real):</strong></div>
                        <div style="color: ${loan.tae > loan.interest_rate ? 'var(--danger)' : 'var(--success)'}; font-weight: 700;">${loan.tae}%</div>
                        <div style="grid-column: 1/-1; font-size: 11px; color: var(--text-tertiary); margin-top: 4px; padding: 6px; background: var(--bg-tertiary); border-radius: 4px; border: 1px solid var(--border-color);">
                            Diferencia: ${(loan.tae - loan.interest_rate).toFixed(2)}% adicional por comisiones y gastos
                        </div>
                    ` : ''}
                    <div style="color: var(--text-secondary);"><strong>Cuota Mensual:</strong></div>
                    <div style="font-weight: 600; color: var(--text-primary);">${formatCurrency(loan.monthly_payment)}</div>
                    ${loan.opening_commission > 0 ? `<div style="color: var(--text-secondary);"><strong>Com. Apertura:</strong></div><div style="color: var(--text-primary);">${formatCurrency(loan.opening_commission)}</div>` : ''}
                </div>
            </div>
            
            <div style="margin: 10px 0; padding: 12px; background: var(--bg-secondary); border-radius: 6px;">
                <div style="font-size: 13px; line-height: 1.8;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                        <strong style="color: var(--text-primary);">Capital Restante:</strong>
                        <span style="color: ${remainingPrincipal > 0 ? 'var(--danger)' : 'var(--success)'}; font-size: 18px; font-weight: bold;">${formatCurrency(remainingPrincipal)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <strong style="color: var(--text-secondary);">Capital Pagado:</strong>
                        <span style="color: var(--text-primary);">${formatCurrency(capitalPaid)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <strong style="color: var(--text-secondary);">Total Pagado (con intereses):</strong>
                        <span style="color: var(--text-primary);">${formatCurrency(totalPaidIncludingInterest)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <strong style="color: var(--text-secondary);">Intereses Pagados:</strong>
                        <span style="color: var(--text-primary);">${formatCurrency(totalInterestPaid)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <strong style="color: var(--text-secondary);">Intereses Totales (proyectados):</strong>
                        <span style="color: var(--text-primary);">${formatCurrency(totalInterestProjected)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <strong style="color: var(--text-secondary);">Comisiones Totales:</strong>
                        <span style="color: var(--text-primary);">${formatCurrency(totalCommissions)}</span>
                    </div>
                    <div style="margin-top: 8px; padding: 8px; background: ${loan.type === 'debt' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)'}; border-radius: 4px; border-left: 3px solid ${loan.type === 'debt' ? 'var(--danger)' : 'var(--success)'}; border: 1px solid var(--border-color);">
                        <div style="display: flex; justify-content: space-between; font-weight: 700; margin-bottom: 4px;">
                            <span style="color: var(--text-primary);">Costo Real del Préstamo:</span>
                            <span style="color: ${loan.type === 'debt' ? 'var(--danger)' : 'var(--success)'}; font-size: 16px;">${formatCurrency(realCost)}</span>
                        </div>
                        <div style="font-size: 11px; color: var(--text-tertiary);">
                            Intereses (${formatCurrency(totalInterestProjected)}) + Comisiones (${formatCurrency(totalCommissions)})
                        </div>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-top: 8px;">
                        <strong style="color: var(--text-primary);">Total a Pagar:</strong>
                        <span style="font-weight: 700; color: var(--text-primary);">${formatCurrency(totalAmount)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <strong style="color: var(--text-primary);">Progreso:</strong>
                        <span style="color: var(--text-primary);">${progressPercentage.toFixed(1)}%</span>
                    </div>
                    <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid var(--border-color);">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                            <strong style="color: var(--text-primary);">Meses Transcurridos:</strong>
                            <span style="color: var(--text-primary);">${monthsElapsed} / ${totalMonths}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                            <strong style="color: var(--text-primary);">Meses Restantes:</strong>
                            <span style="color: var(--text-primary);">${monthsRemaining}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <strong style="color: var(--text-primary);">Próximo Pago:</strong>
                            <span style="color: var(--text-primary);">${formatDate(nextPaymentDate)}</span>
                        </div>
                    </div>
                </div>
            </div>
            
            ${loan.early_payments && loan.early_payments.length > 0 ? `
                <div style="margin: 10px 0; padding: 12px; background: var(--bg-tertiary); border-radius: 6px; font-size: 12px; border-left: 3px solid var(--warning); border: 1px solid var(--border-color);">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                        <strong style="color: var(--text-primary);">Amortizaciones Anticipadas:</strong> <span style="color: var(--text-primary);">${loan.early_payments.length}</span>
                    </div>
                    <div style="display: grid; gap: 6px; margin-top: 8px;">
                        ${loan.early_payments.map((ep, index) => `
                            <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px; background: var(--bg-primary); border-radius: 4px; border: 1px solid var(--border-color);">
                                <div style="flex: 1;">
                                    <div style="font-weight: 600; color: var(--text-primary);">${formatDate(new Date(ep.date))}</div>
                                    <div style="font-size: 11px; color: var(--text-secondary);">${formatCurrency(ep.amount)}${ep.commission > 0 ? ` + ${formatCurrency(ep.commission)} comisión` : ''}</div>
                                </div>
                                <div style="display: flex; gap: 6px;">
                                    <button onclick="editEarlyPayment('${loan._id || loan.id}', ${index})" style="background: var(--primary); color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 11px; font-weight: 600;">Editar</button>
                                    <button onclick="deleteEarlyPayment('${loan._id || loan.id}', ${index})" style="background: var(--danger); color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 11px; font-weight: 600;">Borrar</button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
            
            ${loan.description ? `<div style="margin: 10px 0; font-size: 12px; color: var(--text-tertiary); font-style: italic;">${loan.description}</div>` : ''}
            
            <!-- Cuadro de amortización - Próximas cuotas -->
            <div style="margin: 16px 0; padding: 12px; background: var(--bg-secondary); border-radius: 6px; border: 1px solid var(--border-color);">
                <h4 style="font-size: 14px; font-weight: 700; margin-bottom: 12px; color: var(--text-primary);">Próximas Cuotas</h4>
                <div style="max-height: 200px; overflow-y: auto;">
                    <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
                        <thead>
                            <tr style="background: var(--bg-tertiary); border-bottom: 1px solid var(--border-color);">
                                <th style="padding: 6px; text-align: left; font-weight: 600; color: var(--text-primary);">Mes</th>
                                <th style="padding: 6px; text-align: right; font-weight: 600; color: var(--text-primary);">Fecha</th>
                                <th style="padding: 6px; text-align: right; font-weight: 600; color: var(--text-primary);">Cuota</th>
                                <th style="padding: 6px; text-align: right; font-weight: 600; color: var(--text-primary);">Capital</th>
                                <th style="padding: 6px; text-align: right; font-weight: 600; color: var(--text-primary);">Interés</th>
                                <th style="padding: 6px; text-align: right; font-weight: 600; color: var(--text-primary);">Restante</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${amortization.table.slice(0, 12).map((row, idx) => `
                                <tr style="border-bottom: 1px solid var(--border-color); background: ${idx % 2 === 0 ? 'var(--bg-primary)' : 'var(--bg-tertiary)'};">
                                    <td style="padding: 6px; font-weight: 600; color: var(--text-primary);">${row.month}</td>
                                    <td style="padding: 6px; text-align: right; color: var(--text-secondary);">${formatDate(row.date)}</td>
                                    <td style="padding: 6px; text-align: right; font-weight: 600; color: var(--text-primary);">${formatCurrency(row.payment)}</td>
                                    <td style="padding: 6px; text-align: right; color: var(--success);">${formatCurrency(row.principal)}</td>
                                    <td style="padding: 6px; text-align: right; color: var(--danger);">${formatCurrency(row.interest)}</td>
                                    <td style="padding: 6px; text-align: right; font-weight: 600; color: ${row.balance > 0 ? 'var(--danger)' : 'var(--success)'};">${formatCurrency(row.balance)}</td>
                                </tr>
                            `).join('')}
                            ${amortization.table.length > 12 ? `
                                <tr>
                                    <td colspan="6" style="padding: 8px; text-align: center; color: var(--text-tertiary); font-size: 11px; font-style: italic;">
                                        ... y ${amortization.table.length - 12} cuota(s) más
                                    </td>
                                </tr>
                            ` : ''}
                        </tbody>
                    </table>
                </div>
                <div class="envelope-actions" style="display: flex; gap: 8px; margin-top: 12px; flex-wrap: wrap;">
                    <button onclick="showLoanDetails('${loan._id || loan.id}')" class="btn-secondary" style="flex: 1; min-width: 100px; font-size: 13px; padding: 8px;">
                        Ver Cuadro
                    </button>
                </div>
            </div>
            
            <div class="envelope-actions" style="display: flex; gap: 8px; margin-top: 10px; flex-wrap: wrap;">
                <button class="btn-secondary" onclick="editLoan('${loan._id || loan.id}')" style="flex: 1; min-width: 100px;">Editar</button>
                <button class="btn-secondary" onclick="showLoanDetails('${loan._id || loan.id}')" style="flex: 1; min-width: 100px;">Detalles</button>
                <button class="btn-secondary" onclick="showEarlyPaymentModal('${loan._id || loan.id}')" style="flex: 1; min-width: 100px;">Amortizar</button>
                <button class="btn-danger" onclick="deleteLoan('${loan._id || loan.id}')" style="flex: 1; min-width: 100px;">Eliminar</button>
            </div>
        `;
        grid.appendChild(card);
    });
    
    // Actualizar gráfico de evolución de deuda
    if (typeof updateLoansOutstandingChart === 'function') {
        updateLoansOutstandingChart();
    }
}

// Mostrar detalles del préstamo con tabla de amortización completa
function showLoanDetails(loanId) {
    const loan = loans.find(l => (l._id || l.id) === loanId);
    if (!loan) return;
    
    const amortization = calculateAmortizationTable(
        loan.principal,
        loan.interest_rate,
        loan.monthly_payment,
        loan.start_date,
        loan.total_paid || 0,
        loan.early_payments || []
    );
    
    const modal = document.getElementById('amortizationModal');
    const modalTitle = document.getElementById('amortizationModalTitle');
    const modalContent = document.getElementById('amortizationModalContent');
    
    if (!modal || !modalTitle || !modalContent) return;
    
    // Título del modal
    modalTitle.textContent = `Tabla de Amortización - ${loan.name}`;
    
    // Calcular resumen basado en el mes actual
    const amortizationForSummary = calculateAmortizationTable(
        loan.principal,
        loan.interest_rate,
        loan.monthly_payment,
        loan.start_date,
        0, // No usar total_paid
        loan.early_payments || []
    );
    const remainingPrincipal = amortization.finalBalance;
    const capitalPaid = loan.principal - remainingPrincipal;
    const totalPaidIncludingInterest = amortizationForSummary.table.reduce((sum, row) => sum + row.payment, 0) + 
                                       (loan.early_payments || []).reduce((sum, ep) => sum + ep.amount + (ep.commission || 0), 0);
    const totalInterest = amortization.totalInterest;
    const totalCommissions = (loan.opening_commission || 0) + (loan.early_payments || []).reduce((sum, ep) => sum + (ep.commission || 0), 0);
    const totalCost = totalInterest + totalCommissions;
    const progressPercentage = (capitalPaid / loan.principal) * 100;
    
    // Crear contenido del modal
    let contentHTML = `
        <div style="margin-bottom: 24px; padding: 16px; background: var(--gray-50); border-radius: var(--radius);">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
                <div>
                    <strong style="color: var(--gray-600); font-size: 12px;">Capital Inicial</strong>
                    <div style="font-size: 18px; font-weight: 700; color: var(--gray-900);">${formatCurrency(loan.principal)}</div>
                </div>
                <div>
                    <strong style="color: var(--gray-600); font-size: 12px;">Capital Restante</strong>
                    <div style="display: flex; flex-direction: column; gap: 8px;">
                        <input type="number" id="editRemainingPrincipal" value="${remainingPrincipal.toFixed(2)}" step="0.01" min="0" style="font-size: 18px; font-weight: 700; color: ${remainingPrincipal > 0 ? 'var(--danger)' : 'var(--success)'}; border: 2px solid var(--border-color); border-radius: 6px; padding: 8px 12px; width: 100%; background: var(--bg-primary); box-sizing: border-box;">
                        <button id="saveRemainingPrincipal" onclick="saveRemainingPrincipal('${loan._id || loan.id}')" style="background: linear-gradient(180deg, #1E3A8A 0%, #3B82F6 50%, #6366F1 100%); color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 600; transition: all 0.2s; width: 100%; box-sizing: border-box;" onmouseover="this.style.opacity='0.9'; this.style.transform='translateY(-1px)'" onmouseout="this.style.opacity='1'; this.style.transform='translateY(0)'">Guardar</button>
                    </div>
                </div>
                <div>
                    <strong style="color: var(--text-secondary); font-size: 12px;">Capital Pagado</strong>
                    <div style="font-size: 18px; font-weight: 700; color: var(--text-primary);">${formatCurrency(capitalPaid)}</div>
                </div>
                <div>
                    <strong style="color: var(--text-secondary); font-size: 12px;">Total Pagado (con intereses)</strong>
                    <div style="font-size: 18px; font-weight: 700; color: var(--text-primary);">${formatCurrency(totalPaidIncludingInterest)}</div>
                </div>
                <div>
                    <strong style="color: var(--text-secondary); font-size: 12px;">Intereses Totales</strong>
                    <div style="font-size: 18px; font-weight: 700; color: var(--danger);">${formatCurrency(totalInterest)}</div>
                </div>
                <div>
                    <strong style="color: var(--text-secondary); font-size: 12px;">Comisiones Totales</strong>
                    <div style="font-size: 18px; font-weight: 700; color: var(--warning);">${formatCurrency(totalCommissions)}</div>
                </div>
                <div>
                    <strong style="color: var(--gray-600); font-size: 12px;">Costo Total</strong>
                    <div style="font-size: 18px; font-weight: 700; color: var(--danger);">${formatCurrency(totalCost)}</div>
                </div>
            </div>
        </div>
        
        <div style="margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center;">
            <h3 style="margin: 0; font-size: 18px; font-weight: 700;">Cuadro de Amortización Completo</h3>
            <span style="color: var(--gray-600); font-size: 14px;">${amortization.table.length} cuotas</span>
        </div>
        
        <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; background: var(--bg-primary); border-radius: var(--radius); overflow: hidden; color: var(--text-primary);">
                <thead>
                    <tr style="background: var(--primary); color: white;">
                        <th style="padding: 12px; text-align: left; font-weight: 600; font-size: 13px;">Mes</th>
                        <th style="padding: 12px; text-align: right; font-weight: 600; font-size: 13px;">Fecha</th>
                        <th style="padding: 12px; text-align: right; font-weight: 600; font-size: 13px;">Cuota</th>
                        <th style="padding: 12px; text-align: right; font-weight: 600; font-size: 13px;">Capital</th>
                        <th style="padding: 12px; text-align: right; font-weight: 600; font-size: 13px;">Interés</th>
                        <th style="padding: 12px; text-align: right; font-weight: 600; font-size: 13px;">Capital Restante</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    amortization.table.forEach((row, index) => {
        const isEven = index % 2 === 0;
        contentHTML += `
            <tr style="border-bottom: 1px solid var(--border-color); background: ${isEven ? 'var(--bg-primary)' : 'var(--bg-tertiary)'};">
                <td style="padding: 10px; font-weight: 600; color: var(--text-primary);">${row.month}</td>
                <td style="padding: 10px; text-align: right; color: var(--text-secondary);">${formatDate(row.date)}</td>
                <td style="padding: 10px; text-align: right; font-weight: 600; color: var(--text-primary);">${formatCurrency(row.payment)}</td>
                <td style="padding: 10px; text-align: right; color: var(--success);">${formatCurrency(row.principal)}</td>
                <td style="padding: 10px; text-align: right; color: var(--danger);">${formatCurrency(row.interest)}</td>
                <td style="padding: 10px; text-align: right; font-weight: 600; color: ${row.balance > 0 ? 'var(--danger)' : 'var(--success)'};">${formatCurrency(row.balance)}</td>
            </tr>
        `;
    });
    
    contentHTML += `
                </tbody>
                <tfoot style="background: var(--bg-tertiary); font-weight: 700; border-top: 2px solid var(--border-color);">
                    <tr>
                        <td colspan="2" style="padding: 12px; text-align: left; color: var(--text-primary);">TOTALES</td>
                        <td style="padding: 12px; text-align: right; color: var(--text-primary);">${formatCurrency(amortization.table.reduce((sum, r) => sum + r.payment, 0))}</td>
                        <td style="padding: 12px; text-align: right; color: var(--success);">${formatCurrency(loan.principal - remainingPrincipal)}</td>
                        <td style="padding: 12px; text-align: right; color: var(--danger);">${formatCurrency(totalInterest)}</td>
                        <td style="padding: 12px; text-align: right; color: ${remainingPrincipal > 0 ? 'var(--danger)' : 'var(--success)'};">${formatCurrency(remainingPrincipal)}</td>
                    </tr>
                </tfoot>
            </table>
        </div>
    `;
    
    modalContent.innerHTML = contentHTML;
    modal.style.display = 'flex';
    
    // Prevenir que el contenido del modal cierre el modal al hacer clic
    const modalContentDiv = modal.querySelector('.modal-content');
    if (modalContentDiv) {
        // Asegurar que el modal tenga la estructura correcta
        modalContentDiv.style.display = 'flex';
        modalContentDiv.style.flexDirection = 'column';
        modalContentDiv.style.maxHeight = '90vh';
        modalContentDiv.style.padding = '0';
        modalContentDiv.style.overflow = 'hidden';
        
        modalContentDiv.onclick = (e) => {
            e.stopPropagation();
        };
    }
}

// Cerrar modal de amortización
function closeAmortizationModal() {
    const modal = document.getElementById('amortizationModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Exponer función globalmente
window.closeAmortizationModal = closeAmortizationModal;

// Guardar capital pendiente modificado
async function saveRemainingPrincipal(loanId) {
    const loan = loans.find(l => (l._id || l.id) === loanId);
    if (!loan) return;
    
    const input = document.getElementById('editRemainingPrincipal');
    if (!input) return;
    
    const newRemainingPrincipal = parseFloat(input.value);
    if (isNaN(newRemainingPrincipal) || newRemainingPrincipal < 0) {
        showToast('Por favor ingresa un valor válido', 'warning');
        return;
    }
    
    // Calcular la diferencia para ajustar total_paid
    const amortization = calculateAmortizationTable(
        loan.principal,
        loan.interest_rate,
        loan.monthly_payment,
        loan.start_date,
        0, // No usar total_paid, calcular desde el inicio hasta hoy
        loan.early_payments || []
    );
    
    const currentRemaining = amortization.finalBalance;
    const difference = currentRemaining - newRemainingPrincipal;
    
    // Ajustar total_paid según la diferencia
    const newTotalPaid = (loan.total_paid || 0) + difference;
    
    showLoader('Actualizando capital pendiente...');
    
    try {
        const response = await apiRequest(`/loans/${loanId}`, {
            method: 'PUT',
            body: JSON.stringify({
                ...loan,
                total_paid: Math.max(0, newTotalPaid)
            })
        });
        
        if (response.success) {
            loan.total_paid = Math.max(0, newTotalPaid);
            showToast('Capital pendiente actualizado correctamente', 'success');
            updateLoans();
            showLoanDetails(loanId);
        } else {
            showToast('Error al actualizar el capital pendiente', 'error');
        }
    } catch (error) {
        console.error('Error actualizando capital pendiente:', error);
        showToast('Error al actualizar el capital pendiente', 'error');
    } finally {
        hideLoader();
    }
}

// Exponer función globalmente
window.saveRemainingPrincipal = saveRemainingPrincipal;

// Cerrar modal de amortización anticipada
function closeEarlyPaymentModal() {
    const modal = document.getElementById('earlyPaymentModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Mostrar modal de amortización anticipada - NUEVA VERSIÓN
function showEarlyPaymentModal(loanId) {
    const loan = loans.find(l => (l._id || l.id) === loanId);
    if (!loan) {
        showToast('Préstamo no encontrado', 'error');
        return;
    }
    
    const modal = document.getElementById('earlyPaymentModal');
    if (!modal) {
        showToast('Modal no encontrado', 'error');
        return;
    }
    
    // Calcular capital restante actual basado en el mes actual
    const amortization = calculateAmortizationTable(
        loan.principal,
        loan.interest_rate,
        loan.monthly_payment,
        loan.start_date,
        0, // No usar total_paid, calcular desde el inicio hasta hoy
        loan.early_payments || []
    );
    const remainingCapital = amortization.finalBalance;
    
    // Actualizar información del préstamo
    const loanInfo = document.getElementById('earlyPaymentLoanInfo');
    if (loanInfo) {
        loanInfo.innerHTML = `
            <div style="margin-bottom: 8px;">
                <strong style="color: var(--gray-700);">Préstamo:</strong> 
                <span style="font-weight: 700; color: var(--gray-900);">${loan.name}</span>
            </div>
            <div>
                <strong style="color: var(--gray-700);">Capital Restante:</strong> 
                <span style="font-weight: 700; color: ${remainingCapital > 0 ? 'var(--danger)' : 'var(--success)'}; font-size: 18px;">${formatCurrency(remainingCapital)}</span>
            </div>
        `;
    }
    
    // Obtener elementos del formulario
    const form = document.getElementById('earlyPaymentForm');
    const amountInput = document.getElementById('earlyPaymentAmount');
    const commissionInfo = document.getElementById('earlyPaymentCommissionInfo');
    const commissionAmount = document.getElementById('earlyPaymentCommissionAmount');
    
    if (!form || !amountInput) {
        showToast('Formulario no encontrado', 'error');
        return;
    }
    
    // Resetear formulario
    form.reset();
    if (commissionInfo) commissionInfo.style.display = 'none';
    
    // Remover listeners anteriores clonando el formulario
    const newForm = form.cloneNode(true);
    form.parentNode.replaceChild(newForm, form);
    
    // Obtener referencias nuevas
    const updatedForm = document.getElementById('earlyPaymentForm');
    const updatedAmountInput = document.getElementById('earlyPaymentAmount');
    const updatedCommissionInfo = document.getElementById('earlyPaymentCommissionInfo');
    const updatedCommissionAmount = document.getElementById('earlyPaymentCommissionAmount');
    
    if (!updatedForm || !updatedAmountInput) return;
    
    // Calcular y mostrar comisión cuando cambia el monto
    updatedAmountInput.addEventListener('input', () => {
        const amount = parseFloat(updatedAmountInput.value) || 0;
        if (amount > 0 && loan.early_payment_commission > 0 && updatedCommissionInfo && updatedCommissionAmount) {
            const commission = amount * (loan.early_payment_commission / 100);
            updatedCommissionAmount.textContent = formatCurrency(commission);
            updatedCommissionInfo.style.display = 'block';
        } else if (updatedCommissionInfo) {
            updatedCommissionInfo.style.display = 'none';
        }
    });
    
    // Manejar envío del formulario
    updatedForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const amount = parseFloat(updatedAmountInput.value);
        
        if (!amount || amount <= 0) {
            showToast('Por favor ingresa un monto válido', 'warning');
            return;
        }
        
        if (amount > remainingCapital) {
            showToast(`El monto no puede ser mayor al capital restante (${formatCurrency(remainingCapital)})`, 'warning');
            return;
        }
        
        try {
            showLoader();
            
            // Registrar el pago en el servidor
            await apiRequest(`/loans/${loanId}/payment`, {
                method: 'POST',
                body: JSON.stringify({
                    amount,
                    date: new Date().toISOString().split('T')[0],
                    is_early_payment: true
                })
            });
            
            // Recargar datos
            await loadUserData();
            updateDisplay();
            
            showToast('✅ Amortización anticipada registrada exitosamente', 'success');
            closeEarlyPaymentModal();
        } catch (error) {
            console.error('Error al registrar amortización:', error);
            showToast('Error al registrar la amortización: ' + (error.message || 'Error desconocido'), 'error');
        } finally {
            hideLoader();
        }
    });
    
    // Prevenir que el contenido del modal cierre el modal al hacer clic
    const modalContentDiv = modal.querySelector('.modal-content');
    if (modalContentDiv) {
        modalContentDiv.onclick = (e) => {
            e.stopPropagation();
        };
    }
    
    // Mostrar modal
    modal.style.display = 'flex';
    setTimeout(() => {
        if (updatedAmountInput) updatedAmountInput.focus();
    }, 100);
}

// Exponer funciones globales
window.showLoanDetails = showLoanDetails;
window.showEarlyPaymentModal = showEarlyPaymentModal;
window.closeEarlyPaymentModal = closeEarlyPaymentModal;

// Editar amortización anticipada
async function editEarlyPayment(loanId, index) {
    const loan = loans.find(l => (l._id || l.id) === loanId);
    if (!loan || !loan.early_payments || index >= loan.early_payments.length) {
        showToast('Amortización no encontrada', 'error');
        return;
    }
    
    const ep = loan.early_payments[index];
    
    // Crear modal de edición
    let modal = document.getElementById('editEarlyPaymentModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'editEarlyPaymentModal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 500px;">
                <div style="background: linear-gradient(180deg, #1E3A8A 0%, #3B82F6 50%, #6366F1 100%); padding: 24px; color: white; border-radius: var(--radius) var(--radius) 0 0;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <h2 style="margin: 0; font-size: 22px; font-weight: 700;">Editar Amortización</h2>
                        <button onclick="closeEditEarlyPaymentModal()" style="background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.3); color: white; padding: 8px 12px; border-radius: 50%; transition: all 0.2s; cursor: pointer; font-size: 18px; font-weight: 300;" onmouseover="this.style.background='rgba(255,255,255,0.3)'" onmouseout="this.style.background='rgba(255,255,255,0.2)'">×</button>
                    </div>
                </div>
                <form id="editEarlyPaymentForm" style="padding: 24px; display: flex; flex-direction: column; gap: 16px;">
                    <div class="form-group">
                        <label for="editEarlyPaymentDate">Fecha</label>
                        <input type="date" id="editEarlyPaymentDate" required>
                    </div>
                    <div class="form-group">
                        <label for="editEarlyPaymentAmount">Monto (€)</label>
                        <input type="number" id="editEarlyPaymentAmount" step="0.01" min="0" required>
                    </div>
                    <div class="form-group">
                        <label for="editEarlyPaymentCommission">Comisión (€)</label>
                        <input type="number" id="editEarlyPaymentCommission" step="0.01" min="0" value="0">
                    </div>
                    <div style="display: flex; gap: 12px; margin-top: 8px;">
                        <button type="button" class="btn-secondary" onclick="closeEditEarlyPaymentModal()" style="flex: 1;">Cancelar</button>
                        <button type="submit" class="btn-primary" style="flex: 1;">Guardar</button>
                    </div>
                </form>
            </div>
        `;
        document.body.appendChild(modal);
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeEditEarlyPaymentModal();
            }
        });
    }
    
    // Pre-llenar formulario
    document.getElementById('editEarlyPaymentDate').value = ep.date;
    document.getElementById('editEarlyPaymentAmount').value = ep.amount;
    document.getElementById('editEarlyPaymentCommission').value = ep.commission || 0;
    
    // Guardar loanId e index
    modal.dataset.loanId = loanId;
    modal.dataset.index = index;
    
    // Manejar envío
    const form = document.getElementById('editEarlyPaymentForm');
    form.onsubmit = async (e) => {
        e.preventDefault();
        
        const date = document.getElementById('editEarlyPaymentDate').value;
        const amount = parseFloat(document.getElementById('editEarlyPaymentAmount').value);
        const commission = parseFloat(document.getElementById('editEarlyPaymentCommission').value) || 0;
        
        if (!date || !amount || amount <= 0) {
            showToast('Por favor completa todos los campos correctamente', 'warning');
            return;
        }
        
        try {
            showLoader('Actualizando amortización...');
            await apiRequest(`/loans/${loanId}/early-payment/${index}`, {
                method: 'PUT',
                body: JSON.stringify({ date, amount, commission })
            });
            
            await loadUserData();
            updateDisplay();
            closeEditEarlyPaymentModal();
            // Reabrir el modal de detalles para mostrar los cambios
            showLoanDetails(loanId);
            showToast('Amortización actualizada exitosamente', 'success');
        } catch (error) {
            showToast('Error al actualizar amortización: ' + error.message, 'error');
        } finally {
            hideLoader();
        }
    };
    
    modal.style.display = 'flex';
}

// Cerrar modal de edición de amortización
function closeEditEarlyPaymentModal() {
    const modal = document.getElementById('editEarlyPaymentModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Eliminar amortización anticipada
async function deleteEarlyPayment(loanId, index) {
    if (!confirm('¿Estás seguro de que quieres eliminar esta amortización anticipada?')) {
        return;
    }
    
    try {
        showLoader('Eliminando amortización...');
        await apiRequest(`/loans/${loanId}/early-payment/${index}`, {
            method: 'DELETE'
        });
        
        await loadUserData();
        updateDisplay();
        // Reabrir el modal de detalles para mostrar los cambios
        showLoanDetails(loanId);
        showToast('Amortización eliminada exitosamente', 'success');
    } catch (error) {
        showToast('Error al eliminar amortización: ' + error.message, 'error');
    } finally {
        hideLoader();
    }
}

window.editEarlyPayment = editEarlyPayment;
window.deleteEarlyPayment = deleteEarlyPayment;
window.closeEditEarlyPaymentModal = closeEditEarlyPaymentModal;

// ==================== INVERSIONES ====================

// Agregar inversión
async function addInvestment() {
    const name = document.getElementById('investmentName').value.trim();
    const type = document.getElementById('investmentType').value;
    const currentValue = parseFloat(document.getElementById('investmentCurrentValue').value);
    const description = document.getElementById('investmentDescription').value.trim();
    
    // Aportes periódicos
    const enablePeriodic = document.getElementById('enablePeriodicContribution')?.checked || false;
    const contributionFrequency = document.getElementById('contributionFrequency')?.value || 'monthly';
    const contributionAmount = parseFloat(document.getElementById('contributionAmount')?.value || 0);
    const contributionStartDate = document.getElementById('contributionStartDate')?.value || null;
    const contributionEndDate = document.getElementById('contributionEndDate')?.value || null;
    const contributionAccountId = document.getElementById('contributionAccount')?.value || '';
    
    if (!name || isNaN(currentValue) || !type) {
        alert('Por favor completa todos los campos requeridos');
        return;
    }
    
    if (enablePeriodic && (!contributionAmount || contributionAmount <= 0 || !contributionStartDate)) {
        alert('Si activas aportes periódicos, debes especificar el monto y la fecha de inicio');
        return;
    }
    
    try {
        const investmentData = {
            name,
            type,
            current_value: currentValue || 0,
            description: description || null,
            contributions: [], // Inicialmente vacío, se irá llenando con aportes
            periodic_contribution: {
                enabled: enablePeriodic,
                frequency: enablePeriodic ? contributionFrequency : 'monthly',
                amount: enablePeriodic ? contributionAmount : 0,
                start_date: enablePeriodic ? contributionStartDate : null,
                end_date: enablePeriodic ? (contributionEndDate || null) : null,
                account_id: enablePeriodic ? (contributionAccountId || null) : null, // Cuenta para aportes periódicos
                completed_contributions: []
            }
        };
        
        const investment = await apiRequest('/investments', {
            method: 'POST',
            body: JSON.stringify(investmentData)
        });
        
        investments.push(investment);
        updateDisplay();
        const investmentForm = document.getElementById('investmentForm');
        if (investmentForm) {
            investmentForm.reset();
            // Resetear campos de aportes periódicos
            const enablePeriodicCheckbox = document.getElementById('enablePeriodicContribution');
            const periodicFields = document.getElementById('periodicContributionFields');
            if (enablePeriodicCheckbox) enablePeriodicCheckbox.checked = false;
            if (periodicFields) periodicFields.style.display = 'none';
            // Ocultar formulario después de agregar exitosamente
            if (investmentForm.style.display !== 'none') {
                toggleForm('investmentForm', 'toggleInvestmentFormBtn');
            }
        }
        alert('✅ Inversión creada. Ahora puedes añadir dinero a tu hucha.');
    } catch (error) {
        alert('Error al crear inversión: ' + error.message);
    }
}

// Actualizar inversiones
function updateInvestments() {
    const grid = document.getElementById('investmentsGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    if (investments.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 40px; color: #999;">No hay inversiones registradas</p>';
        return;
    }
    
    const totalInvested = investments.reduce((sum, inv) => {
        return sum + ((inv.contributions || []).reduce((contribSum, c) => contribSum + c.amount, 0));
    }, 0);
    const totalCurrentValue = investments.reduce((sum, inv) => sum + inv.current_value, 0);
    const totalProfit = totalCurrentValue - totalInvested;
    const totalReturn = totalInvested > 0 ? ((totalProfit / totalInvested) * 100) : 0;
    
    investments.forEach(investment => {
        // Calcular total invertido (suma de todos los aportes)
        const totalInvested = (investment.contributions || []).reduce((sum, c) => sum + c.amount, 0);
        const profit = investment.current_value - totalInvested;
        const returnPercent = totalInvested > 0 ? ((profit / totalInvested) * 100) : 0;
        
        // Calcular días desde el primer aporte
        const firstContribution = investment.contributions && investment.contributions.length > 0 
            ? new Date(investment.contributions[0].date)
            : new Date(investment.created_at);
        const daysHeld = Math.floor((new Date() - firstContribution) / (1000 * 60 * 60 * 24));
        
        const typeNames = {
            stocks: 'Acciones',
            bonds: 'Bonos',
            crypto: 'Criptomonedas',
            funds: 'Fondos',
            real_estate: 'Inmuebles',
            other: 'Otros'
        };
        
        const card = document.createElement('div');
        card.className = 'envelope-card';
        card.style.borderLeft = `4px solid ${profit >= 0 ? 'var(--success)' : 'var(--danger)'}`;
        card.style.overflow = 'visible';
        card.style.wordWrap = 'break-word';
        card.style.overflowWrap = 'break-word';
        card.style.boxSizing = 'border-box';
        card.innerHTML = `
            <h3>${investment.name} <span style="font-size: 12px; color: var(--gray-500); font-weight: normal;">(${typeNames[investment.type] || investment.type})</span></h3>
            
            <div style="margin: 16px 0; padding: 16px; background: var(--gray-50); border-radius: var(--radius);">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 14px;">
                    <div><strong>Total Invertido:</strong></div>
                    <div style="text-align: right; font-weight: 600;">${formatCurrency(totalInvested)}</div>
                    <div><strong>Valor Actual:</strong></div>
                    <div style="text-align: right; font-weight: 600; font-size: 16px;">${formatCurrency(investment.current_value)}</div>
                    <div><strong>Ganancia/Pérdida:</strong></div>
                    <div style="text-align: right; color: ${profit >= 0 ? 'var(--success)' : 'var(--danger)'}; font-weight: 700; font-size: 18px;">
                        ${profit >= 0 ? '+' : ''}${formatCurrency(profit)}
                    </div>
                    <div><strong>Rentabilidad:</strong></div>
                    <div style="text-align: right; color: ${returnPercent >= 0 ? 'var(--success)' : 'var(--danger)'}; font-weight: 700; font-size: 16px;">
                        ${returnPercent >= 0 ? '+' : ''}${returnPercent.toFixed(2)}%
                    </div>
                    ${investment.contributions && investment.contributions.length > 0 ? `
                        <div><strong>🔢 Aportes:</strong></div>
                        <div style="text-align: right; color: var(--gray-600);">${investment.contributions.length}</div>
                    ` : ''}
                </div>
            </div>
            
            ${investment.description ? `<div style="margin: 12px 0; font-size: 13px; color: var(--gray-600); font-style: italic;">${investment.description}</div>` : ''}
            
            ${investment.contributions && investment.contributions.length > 0 ? `
                <div style="margin: 12px 0; padding: 12px; background: rgba(16, 185, 129, 0.05); border-radius: var(--radius); border-left: 3px solid var(--success);">
                    <div style="font-size: 12px; font-weight: 600; color: var(--success); margin-bottom: 8px;">Historial de Aportes</div>
                    <div style="max-height: 120px; overflow-y: auto; font-size: 12px;">
                        ${investment.contributions.slice().reverse().slice(0, 5).map(c => `
                            <div style="display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid rgba(16, 185, 129, 0.1);">
                                <span>${formatDate(new Date(c.date))}</span>
                                <span style="font-weight: 600; color: var(--success);">+${formatCurrency(c.amount)}</span>
                            </div>
                        `).join('')}
                        ${investment.contributions.length > 5 ? `
                            <div style="text-align: center; padding-top: 6px; color: var(--gray-500); font-size: 11px;">
                                +${investment.contributions.length - 5} aportes más
                            </div>
                        ` : ''}
                    </div>
                </div>
            ` : `
                <div style="margin: 12px 0; padding: 12px; background: rgba(147, 51, 234, 0.05); border-radius: var(--radius); border-left: 3px solid var(--primary);">
                    <div style="font-size: 12px; color: var(--gray-600); text-align: center;">
                        💡 Aún no has añadido dinero. Haz clic en "Añadir Dinero" para empezar.
                    </div>
                </div>
            `}
            
            ${investment.periodic_contribution && investment.periodic_contribution.enabled ? `
                <div class="periodic-contribution-container">
                    <div class="periodic-contribution-title">Aporte Periódico Activo</div>
                    <div class="periodic-contribution-grid">
                        <div class="periodic-contribution-label"><strong>Frecuencia:</strong></div>
                        <div class="periodic-contribution-value">${investment.periodic_contribution.frequency === 'weekly' ? 'Semanal' : investment.periodic_contribution.frequency === 'monthly' ? 'Mensual' : 'Anual'}</div>
                        <div class="periodic-contribution-label"><strong>Monto:</strong></div>
                        <div class="periodic-contribution-value periodic-contribution-amount">${formatCurrency(investment.periodic_contribution.amount)}</div>
                        <div class="periodic-contribution-label"><strong>Inicio:</strong></div>
                        <div class="periodic-contribution-value">${formatDate(new Date(investment.periodic_contribution.start_date))}</div>
                        ${investment.periodic_contribution.end_date ? `
                            <div class="periodic-contribution-label"><strong>Fin:</strong></div>
                            <div class="periodic-contribution-value">${formatDate(new Date(investment.periodic_contribution.end_date))}</div>
                        ` : `
                            <div class="periodic-contribution-label"><strong>Fin:</strong></div>
                            <div class="periodic-contribution-value periodic-contribution-indefinite">Indefinido</div>
                        `}
                    </div>
                    ${investment.periodic_contribution.completed_contributions && investment.periodic_contribution.completed_contributions.length > 0 ? `
                        <div class="periodic-contribution-completed">
                            <div class="periodic-contribution-completed-title">Aportes Realizados (${investment.periodic_contribution.completed_contributions.length})</div>
                            <div class="periodic-contribution-completed-list">
                                ${investment.periodic_contribution.completed_contributions.slice(-5).map(c => `
                                    <div class="periodic-contribution-completed-item">
                                        <span class="periodic-contribution-completed-date">${formatDate(new Date(c.date))}</span>
                                        <span class="periodic-contribution-completed-amount">${formatCurrency(c.amount)}</span>
                                    </div>
                                `).join('')}
                                ${investment.periodic_contribution.completed_contributions.length > 5 ? `
                                    <div class="periodic-contribution-completed-more">
                                        +${investment.periodic_contribution.completed_contributions.length - 5} más
                                    </div>
                                ` : ''}
                            </div>
                        </div>
                    ` : `
                        <div class="periodic-contribution-empty">
                            <div class="periodic-contribution-empty-text">
                                Asocia un gasto a esta inversión para registrar el aporte
                            </div>
                        </div>
                    `}
                </div>
            ` : ''}
            
            <div class="envelope-actions" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; margin-top: 12px;">
                <button class="btn-secondary" onclick="editInvestment('${investment._id || investment.id}')" style="width: 100%; padding: 10px 16px; font-size: 14px; min-height: 40px; border-radius: 8px;">Editar</button>
                <button class="btn-primary" onclick="addMoneyToInvestment('${investment._id || investment.id}')" style="width: 100%; padding: 10px 16px; font-size: 14px; min-height: 40px; border-radius: 8px;">Añadir Dinero</button>
                <button class="btn-secondary" onclick="updateInvestmentValue('${investment._id || investment.id}')" style="width: 100%; padding: 10px 16px; font-size: 14px; min-height: 40px; border-radius: 8px;">Actualizar Valor</button>
                <button class="btn-danger" onclick="deleteInvestment('${investment._id || investment.id}')" style="width: 100%; padding: 10px 16px; font-size: 14px; min-height: 40px; border-radius: 8px;">Eliminar</button>
            </div>
        `;
        grid.appendChild(card);
    });
    
    // Agregar resumen total
    const summaryCard = document.createElement('div');
    summaryCard.className = 'envelope-card';
    summaryCard.style.gridColumn = '1 / -1';
    summaryCard.style.background = 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)';
    summaryCard.style.color = 'white';
    summaryCard.style.border = 'none';
    summaryCard.innerHTML = `
        <h3 style="color: white; margin-bottom: 16px;">Resumen de Inversiones</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
            <div>
                <div style="font-size: 13px; opacity: 0.9; margin-bottom: 4px;">Total Invertido</div>
                <div style="font-size: 24px; font-weight: 700;">${formatCurrency(totalInvested)}</div>
            </div>
            <div>
                <div style="font-size: 13px; opacity: 0.9; margin-bottom: 4px;">Valor Actual</div>
                <div style="font-size: 24px; font-weight: 700;">${formatCurrency(totalCurrentValue)}</div>
            </div>
            <div>
                <div style="font-size: 13px; opacity: 0.9; margin-bottom: 4px;">Ganancia/Pérdida</div>
                <div style="font-size: 24px; font-weight: 700; color: ${totalProfit >= 0 ? 'var(--success)' : 'var(--danger)'};">
                    ${totalProfit >= 0 ? '+' : ''}${formatCurrency(totalProfit)}
                </div>
            </div>
            <div>
                <div style="font-size: 13px; opacity: 0.9; margin-bottom: 4px;">Rentabilidad Total</div>
                <div style="font-size: 24px; font-weight: 700; color: ${totalReturn >= 0 ? 'var(--success)' : 'var(--danger)'};">
                    ${totalReturn >= 0 ? '+' : ''}${totalReturn.toFixed(2)}%
                </div>
            </div>
        </div>
    `;
    grid.insertBefore(summaryCard, grid.firstChild);
}

// Variable global para almacenar el ID de la inversión actual
let currentInvestmentId = null;

// Mostrar modal para añadir dinero a inversión
function showAddMoneyInvestmentModal(id) {
    currentInvestmentId = id;
    const modal = document.getElementById('addMoneyInvestmentModal');
    const titleEl = document.getElementById('addMoneyInvestmentTitle');
    const infoEl = document.getElementById('addMoneyInvestmentInfo');
    
    if (!modal || !titleEl || !infoEl) return;
    
    // Buscar la inversión
    const investment = investments.find(inv => (inv._id || inv.id) === id);
    if (investment) {
        titleEl.textContent = `Añadir Dinero a ${investment.name}`;
        infoEl.innerHTML = `
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 14px;">
                <div><strong>Valor Actual:</strong></div>
                <div style="text-align: right; font-weight: 600;">${formatCurrency(investment.current_value || 0)}</div>
                <div><strong>Total Invertido:</strong></div>
                <div style="text-align: right; font-weight: 600;">${formatCurrency(investment.contributions?.reduce((sum, c) => sum + c.amount, 0) || 0)}</div>
            </div>
        `;
    }
    
    modal.style.display = 'flex';
    document.getElementById('addMoneyAmount').value = '';
}

// Cerrar modal de añadir dinero
function closeAddMoneyInvestmentModal() {
    const modal = document.getElementById('addMoneyInvestmentModal');
    if (modal) modal.style.display = 'none';
    currentInvestmentId = null;
}

// Mostrar modal para actualizar valor de inversión
function showUpdateInvestmentValueModal(id) {
    currentInvestmentId = id;
    const modal = document.getElementById('updateInvestmentValueModal');
    const titleEl = document.getElementById('updateInvestmentValueTitle');
    
    if (!modal || !titleEl) return;
    
    // Buscar la inversión
    const investment = investments.find(inv => (inv._id || inv.id) === id);
    if (investment) {
        titleEl.textContent = `Actualizar Valor de ${investment.name}`;
        const input = document.getElementById('updateInvestmentValueInput');
        if (input) {
            input.value = investment.current_value || 0;
        }
    }
    
    modal.style.display = 'flex';
}

// Cerrar modal de actualizar valor
function closeUpdateInvestmentValueModal() {
    const modal = document.getElementById('updateInvestmentValueModal');
    if (modal) modal.style.display = 'none';
    currentInvestmentId = null;
}

// Añadir dinero a una inversión (hucha)
async function addMoneyToInvestment(id) {
    showAddMoneyInvestmentModal(id);
}

// Actualizar valor actual de la inversión
async function updateInvestmentValue(id) {
    showUpdateInvestmentValueModal(id);
}

// Procesar añadir dinero a inversión desde el modal
async function processAddMoneyToInvestment() {
    if (!currentInvestmentId) return;
    
    const input = document.getElementById('addMoneyAmount');
    if (!input || !input.value || isNaN(input.value) || parseFloat(input.value) <= 0) {
        alert('Por favor ingresa una cantidad válida mayor a 0');
        return;
    }
    
    const amount = parseFloat(input.value);
    
    try {
        await apiRequest(`/investments/${currentInvestmentId}/contribution`, {
            method: 'POST',
            body: JSON.stringify({
                amount: amount,
                date: new Date().toISOString().split('T')[0]
            })
        });
        
        await loadUserData();
        updateDisplay();
        closeAddMoneyInvestmentModal();
        alert('✅ Dinero añadido exitosamente');
    } catch (error) {
        alert('Error al añadir dinero: ' + error.message);
    }
}

// Procesar actualización de valor de inversión desde el modal
async function processUpdateInvestmentValue() {
    if (!currentInvestmentId) return;
    
    const input = document.getElementById('updateInvestmentValueInput');
    if (!input || !input.value || isNaN(input.value)) {
        alert('Por favor ingresa un valor válido');
        return;
    }
    
    try {
        await apiRequest(`/investments/${currentInvestmentId}`, {
            method: 'PUT',
            body: JSON.stringify({
                current_value: parseFloat(input.value)
            })
        });
        
        await loadUserData();
        updateDisplay();
        closeUpdateInvestmentValueModal();
    } catch (error) {
        alert('Error al actualizar valor: ' + error.message);
    }
}

// Editar inversión - Abre modal con formulario pre-rellenado
async function editInvestment(id) {
    const investment = investments.find(inv => (inv._id || inv.id) === id);
    if (!investment) return;
    
    currentEditingInvestmentId = id;
    
    // Crear o obtener modal
    let modal = document.getElementById('editInvestmentModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'editInvestmentModal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 700px;">
                <div style="background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%); padding: 28px 32px; color: white; position: sticky; top: 0; z-index: 10; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <h2 style="margin: 0; font-size: 26px; font-weight: 700; color: white; letter-spacing: -0.5px;">Editar Inversión</h2>
                        <button onclick="closeEditInvestmentModal()" style="background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.3); color: white; padding: 0; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; border-radius: 50%; transition: all 0.2s; cursor: pointer; font-size: 20px; font-weight: 300;" onmouseover="this.style.background='rgba(255,255,255,0.3)'" onmouseout="this.style.background='rgba(255,255,255,0.2)'">×</button>
                    </div>
                </div>
                <form id="editInvestmentForm" style="padding: 32px; display: flex; flex-direction: column; gap: 20px; max-height: calc(90vh - 100px); overflow-y: auto;">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="editInvestmentName">Nombre de la Inversión</label>
                            <input type="text" id="editInvestmentName" placeholder="Ej: Acciones Apple, Plan de Pensiones" required>
                        </div>
                        <div class="form-group">
                            <label for="editInvestmentType">Tipo</label>
                            <select id="editInvestmentType" required>
                                <option value="stocks">Acciones</option>
                                <option value="bonds">Bonos</option>
                                <option value="crypto">Criptomonedas</option>
                                <option value="funds">Fondos</option>
                                <option value="real_estate">Inmuebles</option>
                                <option value="other">Otros</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group full-width">
                            <label for="editInvestmentDescription">Descripción (Opcional)</label>
                            <input type="text" id="editInvestmentDescription" placeholder="Ej: Inversión a largo plazo">
                        </div>
                    </div>
                    <div style="display: flex; gap: 12px; margin-top: 8px;">
                        <button type="button" class="btn-secondary" onclick="closeEditInvestmentModal()" style="flex: 1;">Cancelar</button>
                        <button type="submit" class="btn-primary" style="flex: 1;">Actualizar Inversión</button>
                    </div>
                </form>
            </div>
        `;
        document.body.appendChild(modal);
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeEditInvestmentModal();
            }
        });
        
        const form = document.getElementById('editInvestmentForm');
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                await updateInvestmentFromModal();
            });
        }
    }
    
    // Pre-llenar formulario
    const nameEl = document.getElementById('editInvestmentName');
    const typeEl = document.getElementById('editInvestmentType');
    const descriptionEl = document.getElementById('editInvestmentDescription');
    
    if (!nameEl || !typeEl) {
        showToast('Error: No se encontraron todos los campos del formulario', 'error');
        return;
    }
    
    nameEl.value = investment.name;
    typeEl.value = investment.type;
    if (descriptionEl) {
        descriptionEl.value = investment.description || '';
    }
    
    // Mostrar modal
    modal.style.display = 'flex';
}

// Cerrar modal de edición de inversión
function closeEditInvestmentModal() {
    const modal = document.getElementById('editInvestmentModal');
    if (modal) {
        modal.style.display = 'none';
        currentEditingInvestmentId = null;
    }
}

// Actualizar inversión desde modal
async function updateInvestmentFromModal() {
    if (!currentEditingInvestmentId) return;
    
    try {
        const nameEl = document.getElementById('editInvestmentName');
        const typeEl = document.getElementById('editInvestmentType');
        const descriptionEl = document.getElementById('editInvestmentDescription');
        
        if (!nameEl || !typeEl) {
            showToast('Error: No se encontraron todos los campos del formulario', 'error');
            return;
        }
        
        const name = nameEl.value.trim();
        const type = typeEl.value;
        const description = descriptionEl ? descriptionEl.value.trim() : '';
        
        if (!name || !type) {
            showToast('Por favor completa todos los campos requeridos', 'warning');
            return;
        }
        
        showLoader('Actualizando inversión...');
        await apiRequest(`/investments/${currentEditingInvestmentId}`, {
            method: 'PUT',
            body: JSON.stringify({
                name,
                type,
                description: description || null
            })
        });
        
        await loadUserData();
        updateDisplay();
        hideLoader();
        closeEditInvestmentModal();
        showToast('Inversión actualizada exitosamente', 'success');
    } catch (error) {
        hideLoader();
        showToast('Error al actualizar inversión: ' + error.message, 'error');
    }
}

window.closeEditInvestmentModal = closeEditInvestmentModal;

// Eliminar inversión
async function deleteInvestment(id) {
    const confirmed = await showConfirm(
        'Eliminar Inversión',
        '¿Estás seguro de eliminar esta inversión? Esta acción no se puede deshacer.',
        'Eliminar',
        'Cancelar'
    );
    if (!confirmed) return;
    
    try {
        showLoader('Eliminando inversión...');
        await apiRequest(`/investments/${id}`, { method: 'DELETE' });
        await loadUserData();
        updateDisplay();
        hideLoader();
        showToast('Inversión eliminada exitosamente', 'success');
    } catch (error) {
        hideLoader();
        showToast('Error al eliminar inversión: ' + error.message, 'error');
    }
}

// Exponer funciones globales
window.editInvestment = editInvestment;

// ==================== PROPIEDADES/PISOS ====================

// Agregar propiedad
async function addProperty() {
    const nameEl = document.getElementById('propertyName');
    const typeEl = document.getElementById('propertyType');
    const addressEl = document.getElementById('propertyAddress');
    const descriptionEl = document.getElementById('propertyDescription');
    
    if (!nameEl || !typeEl) {
        alert('Error: No se encontraron todos los campos del formulario');
        return;
    }
    
    const name = nameEl.value.trim();
    const type = typeEl.value;
    const address = addressEl ? addressEl.value.trim() : '';
    const description = descriptionEl ? descriptionEl.value.trim() : '';
    
    if (!name || !type) {
        alert('Por favor completa todos los campos requeridos');
        return;
    }
    
    try {
        const propertyData = {
            name,
            type,
            address: address || null,
            description: description || null
        };
        
        console.log('📤 Enviando propiedad:', propertyData);
        
        const property = await apiRequest('/properties', {
            method: 'POST',
            body: JSON.stringify(propertyData)
        });
        
        console.log('✅ Propiedad creada:', property);
        
        properties.push(property);
        updateDisplay();
        
        const propertyForm = document.getElementById('propertyForm');
        if (propertyForm) {
            propertyForm.reset();
            // Ocultar formulario después de agregar exitosamente
            if (propertyForm.style.display !== 'none') {
                toggleForm('propertyForm', 'togglePropertyFormBtn');
            }
        }
        alert('✅ Propiedad agregada exitosamente');
    } catch (error) {
        console.error('❌ Error al crear propiedad:', error);
        alert('Error al crear propiedad: ' + (error.message || 'Error desconocido'));
    }
}

// Actualizar propiedades
function updateProperties() {
    const grid = document.getElementById('propertiesGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    if (properties.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 40px; color: #999;">No hay propiedades registradas</p>';
        return;
    }
    
    properties.forEach(property => {
        const card = document.createElement('div');
        card.className = 'envelope-card';
        card.style.background = 'var(--bg-primary)';
        card.style.color = 'var(--text-primary)';
        card.style.border = '1px solid var(--border-color)';
        card.style.borderRadius = 'var(--radius-md)';
        card.style.padding = '20px';
        card.style.boxShadow = 'var(--shadow-sm)';
        
        const typeNames = {
            apartment: 'Piso/Apartamento',
            house: 'Casa',
            office: 'Oficina',
            commercial: 'Local Comercial',
            other: 'Otro'
        };
        
        // Calcular gastos asociados a esta propiedad
        const propertyExpenses = transactions
            .filter(t => t.property_id === (property._id || property.id) && t.type === 'expense')
            .reduce((sum, t) => sum + Math.abs(t.amount), 0);
        
        const propertyIncomes = transactions
            .filter(t => t.property_id === (property._id || property.id) && t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
        
        card.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 16px;">
                <div style="flex: 1;">
                    <h3 style="margin: 0 0 8px 0; font-size: 18px; font-weight: 700; color: var(--gray-900);">${property.name}</h3>
                    <div style="font-size: 13px; color: var(--gray-600); margin-bottom: 4px;">
                        <strong>Tipo:</strong> ${typeNames[property.type] || property.type}
                    </div>
                    ${property.address ? `
                        <div style="font-size: 13px; color: var(--gray-600); margin-bottom: 4px;">
                            <strong>Dirección:</strong> ${property.address}
                        </div>
                    ` : ''}
                    ${property.description ? `
                        <div style="font-size: 13px; color: var(--gray-600); margin-top: 8px;">
                            ${property.description}
                        </div>
                    ` : ''}
                </div>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 16px; padding-top: 16px; border-top: 1px solid var(--gray-200);">
                <div>
                    <div style="font-size: 12px; color: var(--gray-600); margin-bottom: 4px;">Gastos Totales</div>
                    <div style="font-size: 18px; font-weight: 700; color: var(--danger);">${formatCurrency(propertyExpenses)}</div>
                </div>
                <div>
                    <div style="font-size: 12px; color: var(--gray-600); margin-bottom: 4px;">Ingresos Totales</div>
                    <div style="font-size: 18px; font-weight: 700; color: var(--success);">${formatCurrency(propertyIncomes)}</div>
                </div>
            </div>
            <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid var(--gray-200);">
                <div style="font-size: 12px; color: var(--gray-600); margin-bottom: 4px;">Valor Actual</div>
                <div style="font-size: 18px; font-weight: 700; color: var(--primary);">${formatCurrency(property.current_value || 0)}</div>
            </div>
            <div class="envelope-actions" style="display: flex; gap: 8px; margin-top: 16px;">
                <button class="btn-secondary" onclick="editProperty('${property._id || property.id}')" style="flex: 1;">Editar</button>
                <button class="btn-secondary" onclick="showUpdatePropertyValueModal('${property._id || property.id}')" style="flex: 1;">Actualizar Valor</button>
                <button class="btn-danger" onclick="deleteProperty('${property._id || property.id}')" style="flex: 1;">Eliminar</button>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Editar propiedad - Abre modal con formulario pre-rellenado
async function editProperty(id) {
    const property = properties.find(p => (p._id || p.id) === id);
    if (!property) return;
    
    currentEditingPropertyId = id;
    
    // Crear o obtener modal
    let modal = document.getElementById('editPropertyModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'editPropertyModal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 700px;">
                <div style="background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%); padding: 28px 32px; color: white; position: sticky; top: 0; z-index: 10; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <h2 style="margin: 0; font-size: 26px; font-weight: 700; color: white; letter-spacing: -0.5px;">Editar Propiedad</h2>
                        <button onclick="closeEditPropertyModal()" style="background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.3); color: white; padding: 0; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; border-radius: 50%; transition: all 0.2s; cursor: pointer; font-size: 20px; font-weight: 300;" onmouseover="this.style.background='rgba(255,255,255,0.3)'" onmouseout="this.style.background='rgba(255,255,255,0.2)'">×</button>
                    </div>
                </div>
                <form id="editPropertyForm" style="padding: 32px; display: flex; flex-direction: column; gap: 20px; max-height: calc(90vh - 100px); overflow-y: auto;">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="editPropertyName">Nombre de la Propiedad</label>
                            <input type="text" id="editPropertyName" placeholder="Ej: Piso Calle Mayor 5" required>
                        </div>
                        <div class="form-group">
                            <label for="editPropertyType">Tipo</label>
                            <select id="editPropertyType" required>
                                <option value="apartment">Piso/Apartamento</option>
                                <option value="house">Casa</option>
                                <option value="office">Oficina</option>
                                <option value="commercial">Local Comercial</option>
                                <option value="other">Otro</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group" style="flex: 2;">
                            <label for="editPropertyAddress">Dirección (Opcional)</label>
                            <input type="text" id="editPropertyAddress" placeholder="Ej: Calle Mayor 5, 3ºB, Madrid">
                        </div>
                        <div class="form-group" style="flex: 1;">
                            <label for="editPropertyDescription">Descripción (Opcional)</label>
                            <input type="text" id="editPropertyDescription" placeholder="Ej: Piso principal, alquiler">
                        </div>
                    </div>
                    <div style="display: flex; gap: 12px; margin-top: 8px;">
                        <button type="button" class="btn-secondary" onclick="closeEditPropertyModal()" style="flex: 1;">Cancelar</button>
                        <button type="submit" class="btn-primary" style="flex: 1;">Actualizar Propiedad</button>
                    </div>
                </form>
            </div>
        `;
        document.body.appendChild(modal);
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeEditPropertyModal();
            }
        });
        
        const form = document.getElementById('editPropertyForm');
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                await updatePropertyFromModal();
            });
        }
    }
    
    // Pre-llenar formulario
    const nameEl = document.getElementById('editPropertyName');
    const typeEl = document.getElementById('editPropertyType');
    const addressEl = document.getElementById('editPropertyAddress');
    const descriptionEl = document.getElementById('editPropertyDescription');
    
    if (!nameEl || !typeEl) {
        showToast('Error: No se encontraron todos los campos del formulario', 'error');
        return;
    }
    
    nameEl.value = property.name;
    typeEl.value = property.type;
    if (addressEl) addressEl.value = property.address || '';
    if (descriptionEl) descriptionEl.value = property.description || '';
    
    // Mostrar modal
    modal.style.display = 'flex';
}

// Cerrar modal de edición de propiedad
function closeEditPropertyModal() {
    const modal = document.getElementById('editPropertyModal');
    if (modal) {
        modal.style.display = 'none';
        currentEditingPropertyId = null;
    }
}

// Actualizar propiedad desde modal
async function updatePropertyFromModal() {
    if (!currentEditingPropertyId) return;
    
    try {
        const nameEl = document.getElementById('editPropertyName');
        const typeEl = document.getElementById('editPropertyType');
        const addressEl = document.getElementById('editPropertyAddress');
        const descriptionEl = document.getElementById('editPropertyDescription');
        
        if (!nameEl || !typeEl) {
            showToast('Error: No se encontraron todos los campos del formulario', 'error');
            return;
        }
        
        const name = nameEl.value.trim();
        const type = typeEl.value;
        const address = addressEl ? addressEl.value.trim() : '';
        const description = descriptionEl ? descriptionEl.value.trim() : '';
        
        if (!name || !type) {
            showToast('Por favor completa todos los campos requeridos', 'warning');
            return;
        }
        
        showLoader('Actualizando propiedad...');
        await apiRequest(`/properties/${currentEditingPropertyId}`, {
            method: 'PUT',
            body: JSON.stringify({
                name,
                type,
                address: address || null,
                description: description || null
            })
        });
        
        await loadUserData();
        updateDisplay();
        hideLoader();
        closeEditPropertyModal();
        showToast('Propiedad actualizada exitosamente', 'success');
    } catch (error) {
        hideLoader();
        showToast('Error al actualizar propiedad: ' + error.message, 'error');
    }
}

window.closeEditPropertyModal = closeEditPropertyModal;

// Variable global para el ID de la propiedad que se está editando
let currentPropertyId = null;

// Mostrar modal de actualizar valor de propiedad
function showUpdatePropertyValueModal(propertyId) {
    const property = properties.find(p => (p._id || p.id) === propertyId);
    if (!property) {
        showToast('Propiedad no encontrada', 'error');
        return;
    }
    
    currentPropertyId = propertyId;
    
    const modal = document.getElementById('updatePropertyValueModal');
    const title = document.getElementById('updatePropertyValueTitle');
    const input = document.getElementById('updatePropertyValueInput');
    
    if (!modal || !title || !input) {
        showToast('Modal no encontrado', 'error');
        return;
    }
    
    title.textContent = `Actualizar Valor de ${property.name}`;
    input.value = property.current_value || 0;
    modal.style.display = 'flex';
}

// Cerrar modal de actualizar valor de propiedad
function closeUpdatePropertyValueModal() {
    const modal = document.getElementById('updatePropertyValueModal');
    if (modal) {
        modal.style.display = 'none';
        currentPropertyId = null;
    }
}

// Procesar actualización de valor de propiedad
async function processUpdatePropertyValue() {
    if (!currentPropertyId) return;
    
    const property = properties.find(p => (p._id || p.id) === currentPropertyId);
    if (!property) return;
    
    const input = document.getElementById('updatePropertyValueInput');
    if (!input || input.value === '' || isNaN(input.value)) {
        showToast('Por favor ingresa un número válido', 'warning');
        return;
    }
    
    const currentValue = parseFloat(input.value);
    
    try {
        showLoader('Actualizando valor...');
        const updatedProperty = await apiRequest(`/properties/${currentPropertyId}`, {
            method: 'PUT',
            body: JSON.stringify({
                current_value: currentValue
            })
        });
        
        // Actualizar la propiedad en el array local
        const propertyIndex = properties.findIndex(p => (p._id || p.id) === currentPropertyId);
        if (propertyIndex !== -1) {
            properties[propertyIndex] = updatedProperty;
        }
        
        await loadUserData();
        updateDisplay();
        closeUpdatePropertyValueModal();
        showToast('Valor actualizado exitosamente', 'success');
    } catch (error) {
        console.error('Error actualizando valor de propiedad:', error);
        showToast('Error al actualizar valor: ' + error.message, 'error');
    } finally {
        hideLoader();
    }
}

window.showUpdatePropertyValueModal = showUpdatePropertyValueModal;
window.closeUpdatePropertyValueModal = closeUpdatePropertyValueModal;

// Eliminar propiedad
async function deleteProperty(id) {
    if (!confirm('¿Estás seguro de eliminar esta propiedad? Esto no eliminará las transacciones asociadas.')) return;
    
    try {
        await apiRequest(`/properties/${id}`, { method: 'DELETE' });
        await loadUserData();
        updateDisplay();
        alert('✅ Propiedad eliminada exitosamente');
    } catch (error) {
        alert('Error al eliminar propiedad: ' + error.message);
    }
}

// Exponer funciones globalmente
window.editProperty = editProperty;
window.deleteProperty = deleteProperty;

// ==================== CUENTAS BANCARIAS ====================

// Agregar cuenta bancaria
async function addAccount() {
    const name = document.getElementById('accountName').value.trim();
    const type = document.getElementById('accountType').value;
    const bank = document.getElementById('accountBank').value.trim();
    const accountNumber = document.getElementById('accountNumber').value.trim();
    const balance = parseFloat(document.getElementById('accountBalance').value);
    const description = document.getElementById('accountDescription').value.trim();
    
    if (!name || !type) {
        alert('Por favor completa todos los campos requeridos');
        return;
    }
    
    if (isNaN(balance)) {
        alert('El saldo debe ser un número válido');
        return;
    }
    
    try {
        const account = await apiRequest('/accounts', {
            method: 'POST',
            body: JSON.stringify({
                name,
                type,
                bank: bank || null,
                account_number: accountNumber || null,
                balance,
                currency: 'EUR',
                description: description || null
            })
        });
        
        accounts.push(account);
        updateDisplay();
        const accountForm = document.getElementById('accountForm');
        if (accountForm) {
            accountForm.reset();
            // Ocultar formulario después de agregar exitosamente
            if (accountForm.style.display !== 'none') {
                toggleForm('accountForm', 'toggleAccountFormBtn');
            }
        }
        alert('✅ Cuenta agregada exitosamente');
    } catch (error) {
        alert('Error al crear cuenta: ' + error.message);
    }
}

// Actualizar cuentas
function updateAccounts() {
    const grid = document.getElementById('accountsGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    if (accounts.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--gray-500);">No hay cuentas registradas</p>';
        return;
    }
    
    const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
    
    accounts.forEach(account => {
        const typeNames = {
            checking: 'Cuenta Corriente',
            savings: 'Cuenta de Ahorros',
            credit: 'Tarjeta de Crédito',
            investment: 'Cuenta de Inversión',
            other: 'Otra'
        };
        
        const card = document.createElement('div');
        card.className = 'envelope-card';
        card.style.borderLeft = `4px solid ${account.balance >= 0 ? 'var(--success)' : 'var(--danger)'}`;
        card.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 12px;">
                <div>
                    <h3 style="margin: 0; font-size: 18px; font-weight: 700; color: var(--gray-900);">${account.name}</h3>
                    <p style="margin: 4px 0 0 0; font-size: 13px; color: var(--gray-600);">${typeNames[account.type] || account.type}</p>
                    ${account.bank ? `<p style="margin: 2px 0 0 0; font-size: 12px; color: var(--gray-500);">🏦 ${account.bank}</p>` : ''}
                    ${account.account_number ? `<p style="margin: 2px 0 0 0; font-size: 12px; color: var(--gray-500);">****${account.account_number}</p>` : ''}
                </div>
            </div>
            
            <div style="margin: 16px 0; padding: 16px; background: var(--gray-50); border-radius: var(--radius);">
                <div style="text-align: center;">
                    <div style="font-size: 12px; color: var(--gray-600); margin-bottom: 4px;">Saldo Actual</div>
                    <div style="font-size: 28px; font-weight: 700; color: ${account.balance >= 0 ? 'var(--success)' : 'var(--danger)'};">
                        ${formatCurrency(account.balance)}
                    </div>
                    <div style="font-size: 11px; color: var(--gray-500); margin-top: 4px;">${account.currency}</div>
                </div>
            </div>
            
            ${account.description ? `<div style="margin: 12px 0; font-size: 13px; color: var(--gray-600); font-style: italic;">${account.description}</div>` : ''}
            
            <div class="envelope-actions" style="display: flex; gap: 8px; margin-top: 12px;">
                <button class="btn-secondary" onclick="editAccount('${account._id || account.id}')" style="flex: 1;">Editar</button>
                <button class="btn-danger" onclick="deleteAccount('${account._id || account.id}')" style="flex: 1;">Eliminar</button>
            </div>
        `;
        grid.appendChild(card);
    });
    
    // Agregar resumen total
    const summaryCard = document.createElement('div');
    summaryCard.className = 'envelope-card';
    summaryCard.style.gridColumn = '1 / -1';
    summaryCard.style.background = 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)';
    summaryCard.style.color = 'white';
    summaryCard.style.border = 'none';
    summaryCard.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
                <h3 style="margin: 0; color: white; font-size: 18px;">Saldo Total</h3>
                <p style="margin: 8px 0 0 0; color: rgba(255,255,255,0.9); font-size: 14px;">${accounts.length} cuenta${accounts.length !== 1 ? 's' : ''}</p>
            </div>
            <div style="text-align: right;">
                <div style="font-size: 32px; font-weight: 700; color: white;">
                    ${formatCurrency(totalBalance)}
                </div>
                <div style="font-size: 12px; color: rgba(255,255,255,0.8);">EUR</div>
            </div>
        </div>
    `;
    grid.appendChild(summaryCard);
}

// Variable global para el ID de cuenta actual
let currentAccountId = null;

// Mostrar modal para actualizar saldo de cuenta
function showUpdateAccountBalanceModal(id) {
    currentAccountId = id;
    const modal = document.getElementById('updateAccountBalanceModal');
    const titleEl = document.getElementById('updateAccountBalanceTitle');
    
    if (!modal || !titleEl) return;
    
    // Buscar la cuenta
    const account = accounts.find(acc => (acc._id || acc.id) === id);
    if (account) {
        titleEl.textContent = `Actualizar Saldo - ${account.name}`;
        const input = document.getElementById('updateAccountBalanceInput');
        if (input) {
            input.value = account.balance || 0;
        }
    }
    
    modal.style.display = 'flex';
}

// Cerrar modal de actualizar saldo
function closeUpdateAccountBalanceModal() {
    const modal = document.getElementById('updateAccountBalanceModal');
    if (modal) modal.style.display = 'none';
    currentAccountId = null;
}

// Procesar actualización de saldo de cuenta
async function processUpdateAccountBalance() {
    if (!currentAccountId) return;
    
    const input = document.getElementById('updateAccountBalanceInput');
    if (!input) return;
    
    const newBalance = parseFloat(input.value);
    if (isNaN(newBalance)) {
        showToast('Por favor ingresa un saldo válido', 'error');
        return;
    }
    
    try {
        showLoader('Actualizando saldo...');
        await apiRequest(`/accounts/${currentAccountId}`, {
            method: 'PUT',
            body: JSON.stringify({ balance: newBalance })
        });
        
        await loadUserData();
        updateDisplay();
        hideLoader();
        closeUpdateAccountBalanceModal();
        showToast('Saldo actualizado exitosamente', 'success');
    } catch (error) {
        hideLoader();
        showToast('Error al actualizar saldo: ' + error.message, 'error');
    }
}

// Editar cuenta - Abre modal con formulario pre-rellenado
async function editAccount(id) {
    const account = accounts.find(a => (a._id || a.id) === id);
    if (!account) return;
    
    currentEditingAccountId = id;
    
    // Crear o obtener modal
    let modal = document.getElementById('editAccountModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'editAccountModal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 700px;">
                <div style="background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%); padding: 28px 32px; color: white; position: sticky; top: 0; z-index: 10; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <h2 style="margin: 0; font-size: 26px; font-weight: 700; color: white; letter-spacing: -0.5px;">Editar Cuenta</h2>
                        <button onclick="closeEditAccountModal()" style="background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.3); color: white; padding: 0; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; border-radius: 50%; transition: all 0.2s; cursor: pointer; font-size: 20px; font-weight: 300;" onmouseover="this.style.background='rgba(255,255,255,0.3)'" onmouseout="this.style.background='rgba(255,255,255,0.2)'">×</button>
                    </div>
                </div>
                <form id="editAccountForm" style="padding: 32px; display: flex; flex-direction: column; gap: 20px; max-height: calc(90vh - 100px); overflow-y: auto;">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="editAccountName">Nombre de la Cuenta</label>
                            <input type="text" id="editAccountName" placeholder="Ej: Cuenta Nómina BBVA" required>
                        </div>
                        <div class="form-group">
                            <label for="editAccountType">Tipo de Cuenta</label>
                            <select id="editAccountType" required>
                                <option value="checking">Cuenta Corriente</option>
                                <option value="savings">Cuenta de Ahorros</option>
                                <option value="credit">Tarjeta de Crédito</option>
                                <option value="investment">Cuenta de Inversión</option>
                                <option value="other">Otra</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="editAccountBank">Banco (Opcional)</label>
                            <input type="text" id="editAccountBank" placeholder="Ej: BBVA, Santander, etc.">
                        </div>
                        <div class="form-group">
                            <label for="editAccountNumber">Número de Cuenta (Opcional)</label>
                            <input type="text" id="editAccountNumber" placeholder="Últimos 4 dígitos o referencia">
                        </div>
                        <div class="form-group">
                            <label for="editAccountBalance">Saldo Actual (€)</label>
                            <input type="number" id="editAccountBalance" step="0.01" required placeholder="0.00">
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group full-width">
                            <label for="editAccountDescription">Descripción (Opcional)</label>
                            <input type="text" id="editAccountDescription" placeholder="Ej: Cuenta principal para gastos diarios">
                        </div>
                    </div>
                    <div style="display: flex; gap: 12px; margin-top: 8px;">
                        <button type="button" class="btn-secondary" onclick="closeEditAccountModal()" style="flex: 1;">Cancelar</button>
                        <button type="submit" class="btn-primary" style="flex: 1;">Actualizar Cuenta</button>
                    </div>
                </form>
            </div>
        `;
        document.body.appendChild(modal);
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeEditAccountModal();
            }
        });
        
        const form = document.getElementById('editAccountForm');
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                await updateAccountFromModal();
            });
        }
    }
    
    // Pre-llenar formulario
    const nameEl = document.getElementById('editAccountName');
    const typeEl = document.getElementById('editAccountType');
    const bankEl = document.getElementById('editAccountBank');
    const accountNumberEl = document.getElementById('editAccountNumber');
    const balanceEl = document.getElementById('editAccountBalance');
    const descriptionEl = document.getElementById('editAccountDescription');
    
    if (!nameEl || !typeEl || !balanceEl) {
        showToast('Error: No se encontraron todos los campos del formulario', 'error');
        return;
    }
    
    nameEl.value = account.name;
    typeEl.value = account.type;
    if (bankEl) bankEl.value = account.bank || '';
    if (accountNumberEl) accountNumberEl.value = account.account_number || '';
    balanceEl.value = account.balance || 0;
    if (descriptionEl) descriptionEl.value = account.description || '';
    
    // Mostrar modal
    modal.style.display = 'flex';
}

// Cerrar modal de edición de cuenta
function closeEditAccountModal() {
    const modal = document.getElementById('editAccountModal');
    if (modal) {
        modal.style.display = 'none';
        currentEditingAccountId = null;
    }
}

// Actualizar cuenta desde modal
async function updateAccountFromModal() {
    if (!currentEditingAccountId) return;
    
    try {
        const nameEl = document.getElementById('editAccountName');
        const typeEl = document.getElementById('editAccountType');
        const bankEl = document.getElementById('editAccountBank');
        const accountNumberEl = document.getElementById('editAccountNumber');
        const balanceEl = document.getElementById('editAccountBalance');
        const descriptionEl = document.getElementById('editAccountDescription');
        
        if (!nameEl || !typeEl || !balanceEl) {
            showToast('Error: No se encontraron todos los campos del formulario', 'error');
            return;
        }
        
        const name = nameEl.value.trim();
        const type = typeEl.value;
        const bank = bankEl ? bankEl.value.trim() : '';
        const accountNumber = accountNumberEl ? accountNumberEl.value.trim() : '';
        const balance = parseFloat(balanceEl.value);
        const description = descriptionEl ? descriptionEl.value.trim() : '';
        
        if (!name || !type || isNaN(balance)) {
            showToast('Por favor completa todos los campos requeridos correctamente', 'warning');
            return;
        }
        
        showLoader('Actualizando cuenta...');
        await apiRequest(`/accounts/${currentEditingAccountId}`, {
            method: 'PUT',
            body: JSON.stringify({
                name,
                type,
                balance,
                bank: bank || null,
                account_number: accountNumber || null,
                description: description || null
            })
        });
        
        await loadUserData();
        updateDisplay();
        hideLoader();
        closeEditAccountModal();
        showToast('Cuenta actualizada exitosamente', 'success');
    } catch (error) {
        hideLoader();
        showToast('Error al actualizar cuenta: ' + error.message, 'error');
    }
}

window.closeEditAccountModal = closeEditAccountModal;

// Eliminar cuenta
async function deleteAccount(id) {
    const confirmed = await showConfirm(
        'Eliminar Cuenta',
        '¿Estás seguro de eliminar esta cuenta? Esta acción no se puede deshacer.',
        'Eliminar',
        'Cancelar'
    );
    if (!confirmed) return;
    
    try {
        showLoader('Eliminando cuenta...');
        await apiRequest(`/accounts/${id}`, { method: 'DELETE' });
        await loadUserData();
        updateDisplay();
        hideLoader();
        showToast('Cuenta eliminada exitosamente', 'success');
    } catch (error) {
        hideLoader();
        showToast('Error al eliminar cuenta: ' + error.message, 'error');
    }
}

// Exponer funciones globales
window.addMoneyToInvestment = addMoneyToInvestment;
window.updateInvestmentValue = updateInvestmentValue;
window.editInvestment = editInvestment;
window.deleteInvestment = deleteInvestment;
window.editAccount = editAccount;
window.deleteAccount = deleteAccount;
window.showUpdateAccountBalanceModal = showUpdateAccountBalanceModal;
window.closeUpdateAccountBalanceModal = closeUpdateAccountBalanceModal;

// ==================== PATRIMONIO ====================

// Agregar propiedad al patrimonio
async function addPatrimonio() {
    const name = document.getElementById('patrimonioName').value.trim();
    const type = document.getElementById('patrimonioType').value;
    const address = document.getElementById('patrimonioAddress').value.trim();
    const location = document.getElementById('patrimonioLocation').value.trim();
    const purchaseDate = document.getElementById('patrimonioPurchaseDate').value;
    const purchasePrice = parseFloat(document.getElementById('patrimonioPurchasePrice').value) || 0;
    const currentValue = parseFloat(document.getElementById('patrimonioCurrentValue').value);
    const description = document.getElementById('patrimonioDescription').value.trim();
    
    if (!name || !type || isNaN(currentValue) || currentValue < 0) {
        alert('Por favor completa todos los campos requeridos correctamente (nombre, tipo y valor actual)');
        return;
    }
    
    try {
        const propiedad = await apiRequest('/patrimonio', {
            method: 'POST',
            body: JSON.stringify({
                name,
                type,
                address: address || null,
                location: location || null,
                purchase_date: purchaseDate || null,
                purchase_price: purchasePrice,
                current_value: currentValue,
                description: description || null
            })
        });
        
        patrimonio.push(propiedad);
        updateDisplay();
        updatePatrimonioSelect('loanPatrimonio');
        const patrimonioForm = document.getElementById('patrimonioForm');
        if (patrimonioForm) {
            patrimonioForm.reset();
            const patrimonioPurchaseDate = document.getElementById('patrimonioPurchaseDate');
            if (patrimonioPurchaseDate) {
                const today = new Date().toISOString().split('T')[0];
                patrimonioPurchaseDate.value = today;
            }
            // Ocultar formulario después de agregar exitosamente
            if (patrimonioForm.style.display !== 'none') {
                toggleForm('patrimonioForm', 'togglePatrimonioFormBtn');
            }
        }
        alert('✅ Propiedad agregada exitosamente');
    } catch (error) {
        alert('Error al crear propiedad: ' + error.message);
    }
}

// Actualizar patrimonio
function updatePatrimonio() {
    const grid = document.getElementById('patrimonioGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    if (patrimonio.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--gray-500);">No hay propiedades registradas</p>';
        return;
    }
    
    const totalPurchaseValue = patrimonio.reduce((sum, p) => sum + (p.purchase_price || 0), 0);
    const totalCurrentValue = patrimonio.reduce((sum, p) => sum + (p.current_value || 0), 0);
    const totalAppreciation = totalCurrentValue - totalPurchaseValue;
    const totalAppreciationPercent = totalPurchaseValue > 0 ? ((totalAppreciation / totalPurchaseValue) * 100) : 0;
    
    patrimonio.forEach(prop => {
        const appreciation = prop.current_value - (prop.purchase_price || 0);
        const appreciationPercent = (prop.purchase_price || 0) > 0 ? ((appreciation / prop.purchase_price) * 100) : 0;
        const purchaseDate = prop.purchase_date ? new Date(prop.purchase_date) : null;
        const daysOwned = purchaseDate ? Math.floor((new Date() - purchaseDate) / (1000 * 60 * 60 * 24)) : null;
        
        const typeNames = {
            apartment: 'Apartamento',
            house: 'Casa',
            office: 'Oficina',
            commercial: 'Comercial',
            vehicle: 'Vehículo',
            jewelry: 'Joyas',
            art: 'Arte',
            electronics: 'Electrónica',
            other: 'Otro'
        };
        
        const card = document.createElement('div');
        card.className = 'envelope-card';
        card.style.borderLeft = `4px solid ${appreciation >= 0 ? 'var(--success)' : 'var(--danger)'}`;
        
        // Obtener préstamos asociados
        const associatedLoans = prop.associated_loans || [];
        const loansInfo = associatedLoans.length > 0 
            ? `<div style="margin: 8px 0; padding: 8px; background: var(--primary-light); border-radius: var(--radius);">
                <strong style="font-size: 11px; color: var(--primary);">Préstamos asociados: ${associatedLoans.length}</strong>
                ${associatedLoans.map(loan => `<div style="font-size: 11px; color: var(--text-secondary); margin-top: 4px;">• ${loan.name || 'Sin nombre'}</div>`).join('')}
               </div>`
            : '';
        
        card.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 12px;">
                <div>
                    <h3 style="margin: 0; font-size: 18px; font-weight: 700; color: var(--gray-900);">${prop.name}</h3>
                    <p style="margin: 4px 0 0 0; font-size: 13px; color: var(--gray-600);">${typeNames[prop.type] || prop.type}</p>
                    ${prop.address ? `<p style="margin: 2px 0 0 0; font-size: 12px; color: var(--gray-500);">📍 ${prop.address}</p>` : ''}
                    ${prop.location && !prop.address ? `<p style="margin: 2px 0 0 0; font-size: 12px; color: var(--gray-500);">📍 ${prop.location}</p>` : ''}
                </div>
            </div>
            
            <div style="margin: 16px 0; padding: 16px; background: var(--gray-50); border-radius: var(--radius);">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 14px;">
                    <div><strong>Compra:</strong></div>
                    <div style="text-align: right;">${formatCurrency(prop.purchase_price || 0)}</div>
                    <div><strong>Valor Actual:</strong></div>
                    <div style="text-align: right; font-weight: 600;">${formatCurrency(prop.current_value)}</div>
                    <div><strong>Evolución:</strong></div>
                    <div style="text-align: right; color: ${appreciation >= 0 ? 'var(--success)' : 'var(--danger)'}; font-weight: 700; font-size: 16px;">
                        ${appreciation >= 0 ? '+' : ''}${formatCurrency(appreciation)}
                    </div>
                    <div><strong>Porcentaje:</strong></div>
                    <div style="text-align: right; color: ${appreciationPercent >= 0 ? 'var(--success)' : 'var(--danger)'}; font-weight: 700;">
                        ${appreciationPercent >= 0 ? '+' : ''}${appreciationPercent.toFixed(2)}%
                    </div>
                    ${daysOwned !== null ? `
                        <div><strong>Días:</strong></div>
                        <div style="text-align: right; color: var(--gray-600);">${daysOwned}</div>
                    ` : ''}
                </div>
            </div>
            
            ${prop.description ? `<div style="margin: 12px 0; font-size: 13px; color: var(--gray-600); font-style: italic;">${prop.description}</div>` : ''}
            
            ${loansInfo}
            
            ${prop.value_history && prop.value_history.length > 2 ? `
                <div style="margin: 12px 0; padding: 12px; background: var(--gray-100); border-radius: var(--radius);">
                    <strong style="font-size: 12px; color: var(--gray-700);">Historial de Valores:</strong>
                    <div style="margin-top: 8px; font-size: 11px; color: var(--gray-600); max-height: 100px; overflow-y: auto;">
                        ${prop.value_history.slice(-5).map(h => `
                            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                                <span>${h.date}</span>
                                <span style="font-weight: 600;">${formatCurrency(h.value)}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
            
            <div class="envelope-actions" style="display: flex; gap: 8px; margin-top: 12px;">
                <button class="btn-secondary" onclick="editPatrimonio('${prop._id || prop.id}')" style="flex: 1;">Editar</button>
                <button class="btn-danger" onclick="deletePatrimonio('${prop._id || prop.id}')" style="flex: 1;">Eliminar</button>
            </div>
        `;
        grid.appendChild(card);
    });
    
    // Agregar resumen total
    const summaryCard = document.createElement('div');
    summaryCard.className = 'envelope-card';
    summaryCard.style.gridColumn = '1 / -1';
    summaryCard.style.background = 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)';
    summaryCard.style.color = 'white';
    summaryCard.style.border = 'none';
    summaryCard.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
                <h3 style="margin: 0; color: white; font-size: 18px;">🏠 Valor Total del Patrimonio</h3>
                <p style="margin: 8px 0 0 0; color: rgba(255,255,255,0.9); font-size: 14px;">${patrimonio.length} propiedad${patrimonio.length !== 1 ? 'es' : ''}</p>
            </div>
            <div style="text-align: right;">
                <div style="font-size: 32px; font-weight: 700; color: white;">
                    ${formatCurrency(totalCurrentValue)}
                </div>
                <div style="font-size: 12px; color: rgba(255,255,255,0.8);">
                    ${totalAppreciation >= 0 ? '+' : ''}${formatCurrency(totalAppreciation)} (${totalAppreciationPercent >= 0 ? '+' : ''}${totalAppreciationPercent.toFixed(2)}%)
                </div>
            </div>
        </div>
    `;
    grid.appendChild(summaryCard);
    
    // Actualizar gráfico de evolución de patrimonio
    if (typeof updateAssetsEvolutionChart === 'function') {
        updateAssetsEvolutionChart();
    }
}

// Editar propiedad del patrimonio - Abre modal con formulario pre-rellenado
async function editPatrimonio(id) {
    const prop = patrimonio.find(p => (p._id || p.id) === id);
    if (!prop) {
        showToast('Propiedad no encontrada', 'error');
        return;
    }
    
    currentPatrimonioId = id;
    
    // Abrir modal de actualización de valor (que ya existe)
    const modal = document.getElementById('updateAssetValueModal');
    if (modal) {
        // Pre-llenar el valor actual
        const input = document.getElementById('updateAssetValueInput');
        if (input) {
            input.value = prop.current_value || prop.purchase_price || 0;
        }
        modal.style.display = 'flex';
    } else {
        showToast('Modal de edición no encontrado', 'error');
    }
}

// Procesar actualización de valor de propiedad desde el modal
async function processUpdatePatrimonioValue() {
    if (!currentPatrimonioId) return;
    
    const prop = patrimonio.find(p => (p._id || p.id) === currentPatrimonioId);
    if (!prop) return;
    
    const input = document.getElementById('updateAssetValueInput');
    if (!input || !input.value || isNaN(input.value)) {
        alert('Por favor ingresa un número válido');
        return;
    }
    
    const currentValue = parseFloat(input.value);
    
    try {
        await apiRequest(`/patrimonio/${currentPatrimonioId}`, {
            method: 'PUT',
            body: JSON.stringify({
                ...prop,
                current_value: currentValue,
                update_value_history: true
            })
        });
        
        await loadUserData();
        updateDisplay();
        closeUpdateAssetValueModal();
    } catch (error) {
        alert('Error al actualizar propiedad: ' + error.message);
    }
}

// Eliminar propiedad del patrimonio
async function deletePatrimonio(id) {
    const confirmed = await showConfirm(
        'Eliminar Propiedad',
        '¿Estás seguro de eliminar esta propiedad? Esta acción no se puede deshacer. Los préstamos asociados se desasociarán automáticamente.',
        'Eliminar',
        'Cancelar'
    );
    if (!confirmed) return;
    
    try {
        showLoader('Eliminando propiedad...');
        await apiRequest(`/patrimonio/${id}`, { method: 'DELETE' });
        await loadUserData();
        updateDisplay();
        hideLoader();
        showToast('Propiedad eliminada exitosamente', 'success');
    } catch (error) {
        hideLoader();
        showToast('Error al eliminar propiedad: ' + error.message, 'error');
    }
}

// Exponer funciones globales
window.editPatrimonio = editPatrimonio;
window.deletePatrimonio = deletePatrimonio;

// Editar préstamo - Abre modal con formulario pre-rellenado
async function editLoan(id) {
    const loan = loans.find(l => (l._id || l.id) === id);
    if (!loan) return;
    
    currentEditingLoanId = id;
    
    // Crear o obtener modal
    let modal = document.getElementById('editLoanModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'editLoanModal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 800px;">
                <div style="background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%); padding: 28px 32px; color: white; position: sticky; top: 0; z-index: 10; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <h2 style="margin: 0; font-size: 26px; font-weight: 700; color: white; letter-spacing: -0.5px;">Editar Préstamo</h2>
                        <button onclick="closeEditLoanModal()" style="background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.3); color: white; padding: 0; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; border-radius: 50%; transition: all 0.2s; cursor: pointer; font-size: 20px; font-weight: 300;" onmouseover="this.style.background='rgba(255,255,255,0.3)'" onmouseout="this.style.background='rgba(255,255,255,0.2)'">×</button>
                    </div>
                </div>
                <form id="editLoanForm" style="padding: 32px; display: flex; flex-direction: column; gap: 20px; max-height: calc(90vh - 100px); overflow-y: auto;">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="editLoanName">Nombre del Préstamo</label>
                            <input type="text" id="editLoanName" placeholder="Ej: Hipoteca vivienda" required>
                        </div>
                        <div class="form-group">
                            <label for="editLoanType">Tipo</label>
                            <select id="editLoanType" required>
                                <option value="debt">Deuda (Debo)</option>
                                <option value="credit">Crédito (Me deben)</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="editLoanPrincipal">Monto Principal (€)</label>
                            <input type="number" id="editLoanPrincipal" step="0.01" min="0" required>
                        </div>
                        <div class="form-group">
                            <label for="editLoanInterestRate">TIN - Tipo de Interés Nominal (%)</label>
                            <input type="number" id="editLoanInterestRate" step="0.01" min="0" max="100" required>
                            <small style="color: var(--text-tertiary);">Interés puro sin comisiones</small>
                        </div>
                        <div class="form-group">
                            <label for="editLoanTAE">TAE - Tasa Anual Equivalente (%)</label>
                            <input type="number" id="editLoanTAE" step="0.01" min="0" max="100" placeholder="Opcional">
                            <small style="color: var(--text-tertiary); font-weight: 600;">⚠️ IMPORTANTE: Incluye comisiones y gastos. Es el costo REAL del préstamo.</small>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="editLoanStartDate">Fecha de Inicio</label>
                            <input type="date" id="editLoanStartDate" required>
                        </div>
                        <div class="form-group">
                            <label for="editLoanEndDate">Fecha de Fin</label>
                            <input type="date" id="editLoanEndDate" required>
                        </div>
                        <div class="form-group">
                            <label for="editLoanMonthlyPayment">Pago Mensual (€)</label>
                            <input type="number" id="editLoanMonthlyPayment" step="0.01" min="0" required>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="editLoanOpeningCommission">Comisión de Apertura (€)</label>
                            <input type="number" id="editLoanOpeningCommission" step="0.01" min="0" value="0">
                        </div>
                        <div class="form-group">
                            <label for="editLoanEarlyPaymentCommission">Comisión por Amortización Anticipada (%)</label>
                            <input type="number" id="editLoanEarlyPaymentCommission" step="0.01" min="0" max="100" value="0">
                        </div>
                        <div class="form-group">
                            <label for="editLoanPaymentDay">Día de Pago (1-31)</label>
                            <input type="number" id="editLoanPaymentDay" min="1" max="31" value="1">
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="editLoanAccount">Cuenta para Pagos (Opcional)</label>
                            <select id="editLoanAccount">
                                <option value="">Ninguna</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="editLoanPatrimonio">Propiedad del Patrimonio Asociada (Opcional)</label>
                            <select id="editLoanPatrimonio">
                                <option value="">Ninguna</option>
                            </select>
                            <small style="color: var(--text-tertiary);">Propiedad del patrimonio relacionada con este préstamo (ej: hipoteca)</small>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group full-width">
                            <label for="editLoanDescription">Descripción (Opcional)</label>
                            <input type="text" id="editLoanDescription" placeholder="Ej: Hipoteca principal">
                        </div>
                    </div>
                    <div style="display: flex; gap: 12px; margin-top: 8px;">
                        <button type="button" class="btn-secondary" onclick="closeEditLoanModal()" style="flex: 1;">Cancelar</button>
                        <button type="submit" class="btn-primary" style="flex: 1;">Actualizar Préstamo</button>
                    </div>
                </form>
            </div>
        `;
        document.body.appendChild(modal);
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeEditLoanModal();
            }
        });
        
        const form = document.getElementById('editLoanForm');
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                await updateLoanFromModal();
            });
        }
    }
    
    // Pre-llenar formulario
    const nameEl = document.getElementById('editLoanName');
    const typeEl = document.getElementById('editLoanType');
    const principalEl = document.getElementById('editLoanPrincipal');
    const interestRateEl = document.getElementById('editLoanInterestRate');
    const taeEl = document.getElementById('editLoanTAE');
    const startDateEl = document.getElementById('editLoanStartDate');
    const endDateEl = document.getElementById('editLoanEndDate');
    const monthlyPaymentEl = document.getElementById('editLoanMonthlyPayment');
    const openingCommissionEl = document.getElementById('editLoanOpeningCommission');
    const earlyPaymentCommissionEl = document.getElementById('editLoanEarlyPaymentCommission');
    const paymentDayEl = document.getElementById('editLoanPaymentDay');
    const descriptionEl = document.getElementById('editLoanDescription');
    const accountEl = document.getElementById('editLoanAccount');
    const patrimonioEl = document.getElementById('editLoanPatrimonio');
    
    // Actualizar selectores
    updateAccountSelect('editLoanAccount');
    updatePatrimonioSelect('editLoanPatrimonio');
    
    if (!nameEl || !typeEl || !principalEl || !interestRateEl || !startDateEl || !endDateEl || !monthlyPaymentEl) {
        showToast('Error: No se encontraron todos los campos del formulario', 'error');
        return;
    }
    
    nameEl.value = loan.name;
    typeEl.value = loan.type;
    principalEl.value = loan.principal;
    interestRateEl.value = loan.interest_rate;
    if (taeEl) taeEl.value = loan.tae || '';
    startDateEl.value = loan.start_date;
    endDateEl.value = loan.end_date;
    monthlyPaymentEl.value = loan.monthly_payment;
    if (openingCommissionEl) openingCommissionEl.value = loan.opening_commission || 0;
    if (earlyPaymentCommissionEl) earlyPaymentCommissionEl.value = loan.early_payment_commission || 0;
    if (paymentDayEl) paymentDayEl.value = loan.payment_day || 1;
    if (descriptionEl) descriptionEl.value = loan.description || '';
    if (accountEl) accountEl.value = loan.account_id || '';
    if (patrimonioEl) patrimonioEl.value = loan.patrimonio_id || '';
    
    // Mostrar modal
    modal.style.display = 'flex';
}

// Cerrar modal de edición de préstamo
function closeEditLoanModal() {
    const modal = document.getElementById('editLoanModal');
    if (modal) {
        modal.style.display = 'none';
        currentEditingLoanId = null;
    }
}

// Actualizar préstamo desde modal
async function updateLoanFromModal() {
    if (!currentEditingLoanId) return;
    
    try {
        const loan = loans.find(l => (l._id || l.id) === currentEditingLoanId);
        if (!loan) return;
        
        const nameEl = document.getElementById('editLoanName');
        const typeEl = document.getElementById('editLoanType');
        const principalEl = document.getElementById('editLoanPrincipal');
        const interestRateEl = document.getElementById('editLoanInterestRate');
        const taeEl = document.getElementById('editLoanTAE');
        const startDateEl = document.getElementById('editLoanStartDate');
        const endDateEl = document.getElementById('editLoanEndDate');
        const monthlyPaymentEl = document.getElementById('editLoanMonthlyPayment');
        const openingCommissionEl = document.getElementById('editLoanOpeningCommission');
        const earlyPaymentCommissionEl = document.getElementById('editLoanEarlyPaymentCommission');
        const paymentDayEl = document.getElementById('editLoanPaymentDay');
        const descriptionEl = document.getElementById('editLoanDescription');
        
        if (!nameEl || !typeEl || !principalEl || !interestRateEl || !startDateEl || !endDateEl || !monthlyPaymentEl) {
            showToast('Error: No se encontraron todos los campos del formulario', 'error');
            return;
        }
        
        const name = nameEl.value.trim();
        const type = typeEl.value;
        const principal = parseFloat(principalEl.value);
        const interestRate = parseFloat(interestRateEl.value);
        const taeInput = taeEl ? taeEl.value : '';
        const tae = taeInput !== '' ? parseFloat(taeInput) : null;
        const startDate = startDateEl.value;
        const endDate = endDateEl.value;
        const monthlyPayment = parseFloat(monthlyPaymentEl.value);
        const openingCommission = openingCommissionEl ? parseFloat(openingCommissionEl.value) || 0 : 0;
        const earlyPaymentCommission = earlyPaymentCommissionEl ? parseFloat(earlyPaymentCommissionEl.value) || 0 : 0;
        const paymentDay = paymentDayEl ? parseInt(paymentDayEl.value) || 1 : 1;
        const description = descriptionEl ? descriptionEl.value.trim() : '';
        const accountId = document.getElementById('editLoanAccount') ? document.getElementById('editLoanAccount').value : '';
        const patrimonioId = document.getElementById('editLoanPatrimonio') ? document.getElementById('editLoanPatrimonio').value : '';
        
        if (!name || !type || !principal || principal <= 0 || isNaN(interestRate) || interestRate < 0 || !startDate || !endDate || !monthlyPayment || monthlyPayment <= 0) {
            showToast('Por favor completa todos los campos requeridos correctamente', 'warning');
            return;
        }
        
        showLoader('Actualizando préstamo...');
        await apiRequest(`/loans/${currentEditingLoanId}`, {
            method: 'PUT',
            body: JSON.stringify({
                name,
                type,
                principal,
                interest_rate: interestRate,
                account_id: accountId || null,
                patrimonio_id: patrimonioId || null,
                tae: tae,
                start_date: startDate,
                end_date: endDate,
                monthly_payment: monthlyPayment,
                opening_commission: openingCommission,
                early_payment_commission: earlyPaymentCommission,
                payment_day: paymentDay,
                description: description || null
            })
        });
        
        await loadUserData();
        updateDisplay();
        hideLoader();
        closeEditLoanModal();
        showToast('Préstamo actualizado exitosamente', 'success');
    } catch (error) {
        hideLoader();
        showToast('Error al actualizar préstamo: ' + error.message, 'error');
    }
}

window.closeEditLoanModal = closeEditLoanModal;

// Eliminar préstamo
async function deleteLoan(id) {
    const confirmed = await showConfirm(
        'Eliminar Préstamo',
        '¿Estás seguro de eliminar este préstamo? Esta acción no se puede deshacer.',
        'Eliminar',
        'Cancelar'
    );
    if (!confirmed) return;
    
    try {
        showLoader('Eliminando préstamo...');
        await apiRequest(`/loans/${id}`, { method: 'DELETE' });
        await loadUserData();
        updateDisplay();
        hideLoader();
        showToast('Préstamo eliminado exitosamente', 'success');
    } catch (error) {
        hideLoader();
        showToast('Error al eliminar préstamo: ' + error.message, 'error');
    }
}

// Exponer funciones al scope global para onclick handlers
window.deleteLoan = deleteLoan;
window.editLoan = editLoan;

// Inicializar gráficas
function initializeCharts() {
    // Verificar que estamos en la aplicación principal, no en la página de login
    const mainApp = document.getElementById('mainApp');
    if (!mainApp || mainApp.style.display === 'none') {
        return; // No inicializar gráficos si estamos en la página de login
    }
    
    // Verificar que los elementos existan antes de crear los gráficos
    const savingsChartEl = document.getElementById('savingsChart');
    if (savingsChartEl && !charts.savings) {
        charts.savings = new Chart(savingsChartEl, {
        type: 'line',
        data: { labels: [], datasets: [] },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { display: true }
            }
        }
    });
    }
    
    const expensesChartEl = document.getElementById('expensesChart');
    if (expensesChartEl && !charts.expenses) {
        charts.expenses = new Chart(expensesChartEl, {
        type: 'bar',
        data: { labels: [], datasets: [] },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { display: false }
            }
        }
    });
    }
    
    const incomeExpenseChartEl = document.getElementById('incomeExpenseChart');
    if (incomeExpenseChartEl && !charts.incomeExpense) {
        charts.incomeExpense = new Chart(incomeExpenseChartEl, {
        type: 'bar',
        data: { labels: [], datasets: [] },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { display: true }
            },
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
    }
    
    const distributionChartEl = document.getElementById('distributionChart');
    if (distributionChartEl && !charts.distribution) {
        charts.distribution = new Chart(distributionChartEl, {
        type: 'doughnut',
        data: { labels: [], datasets: [] },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { position: 'right' }
            }
        }
    });
    }
    
    // Nuevas gráficas
    const incomeEvolutionEl = document.getElementById('incomeEvolutionChart');
    if (incomeEvolutionEl && !charts.incomeEvolution) {
        charts.incomeEvolution = new Chart(incomeEvolutionEl, {
            type: 'line',
            data: { labels: [], datasets: [] },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: { legend: { display: true } },
                scales: { y: { beginAtZero: true } }
            }
        });
    }
    
    const expensesEvolutionEl = document.getElementById('expensesEvolutionChart');
    if (expensesEvolutionEl && !charts.expensesEvolution) {
        charts.expensesEvolution = new Chart(expensesEvolutionEl, {
            type: 'line',
            data: { labels: [], datasets: [] },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: { legend: { display: true } },
                scales: { y: { beginAtZero: true } }
            }
        });
    }
    
    const loansPendingEl = document.getElementById('loansPendingChart');
    if (loansPendingEl && !charts.loansPending) {
        charts.loansPending = new Chart(loansPendingEl, {
            type: 'line',
            data: { labels: [], datasets: [] },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: { legend: { display: true } },
                scales: { y: { beginAtZero: true } }
            }
        });
    }
    
    const assetsEvolutionEl = document.getElementById('assetsEvolutionChart');
    if (assetsEvolutionEl && !charts.assetsEvolution) {
        charts.assetsEvolution = new Chart(assetsEvolutionEl, {
            type: 'line',
            data: { labels: [], datasets: [] },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: { legend: { display: true } },
                scales: { y: { beginAtZero: true } }
            }
        });
    }
    
    const accountsBalanceEl = document.getElementById('accountsBalanceChart');
    if (accountsBalanceEl && !charts.accountsBalance) {
        charts.accountsBalance = new Chart(accountsBalanceEl, {
            type: 'line',
            data: { labels: [], datasets: [] },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: { legend: { display: true } },
                scales: { y: { beginAtZero: true } }
            }
        });
    }
    
    // Gráficas del Dashboard
    const dashboardSavingsChartEl = document.getElementById('dashboardSavingsChart');
    if (dashboardSavingsChartEl && !charts.dashboardSavings) {
        charts.dashboardSavings = new Chart(dashboardSavingsChartEl, {
            type: 'line',
            data: { labels: [], datasets: [] },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: { legend: { display: true } }
            }
        });
    }
    
    const dashboardIncomeExpenseChartEl = document.getElementById('dashboardIncomeExpenseChart');
    if (dashboardIncomeExpenseChartEl && !charts.dashboardIncomeExpense) {
        charts.dashboardIncomeExpense = new Chart(dashboardIncomeExpenseChartEl, {
            type: 'bar',
            data: { labels: [], datasets: [] },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: { legend: { display: true } },
                scales: { y: { beginAtZero: true } }
            }
        });
    }
    
    const dashboardExpensesChartEl = document.getElementById('dashboardExpensesChart');
    if (dashboardExpensesChartEl && !charts.dashboardExpenses) {
        charts.dashboardExpenses = new Chart(dashboardExpensesChartEl, {
            type: 'bar',
            data: { labels: [], datasets: [] },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: { legend: { display: false } }
            }
        });
    }
    
    const dashboardDistributionChartEl = document.getElementById('dashboardDistributionChart');
    if (dashboardDistributionChartEl && !charts.dashboardDistribution) {
        charts.dashboardDistribution = new Chart(dashboardDistributionChartEl, {
            type: 'doughnut',
            data: { labels: [], datasets: [] },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: { legend: { position: 'right' } }
            }
        });
    }
    
    const dashboardIncomeEvolutionChartEl = document.getElementById('dashboardIncomeEvolutionChart');
    if (dashboardIncomeEvolutionChartEl && !charts.dashboardIncomeEvolution) {
        charts.dashboardIncomeEvolution = new Chart(dashboardIncomeEvolutionChartEl, {
            type: 'line',
            data: { labels: [], datasets: [] },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: { legend: { display: true } },
                scales: { y: { beginAtZero: true } }
            }
        });
    }
    
    const dashboardExpensesEvolutionChartEl = document.getElementById('dashboardExpensesEvolutionChart');
    if (dashboardExpensesEvolutionChartEl && !charts.dashboardExpensesEvolution) {
        charts.dashboardExpensesEvolution = new Chart(dashboardExpensesEvolutionChartEl, {
            type: 'line',
            data: { labels: [], datasets: [] },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: { legend: { display: true } },
                scales: { y: { beginAtZero: true } }
            }
        });
    }
}

// Obtener período seleccionado (global o específico de gráfico)
function getSelectedPeriod(chartName = null) {
    if (chartName) {
        const chartSelect = document.querySelector(`.chart-period-select[data-chart="${chartName}"]`);
        if (chartSelect) {
            const value = chartSelect.value;
            if (value === 'custom') {
                return 'custom';
            }
            return value === 'all' ? 999 : parseInt(value) || 6;
        }
    }
    const periodSelect = document.getElementById('chartPeriod');
    if (!periodSelect) return 6;
    const value = periodSelect.value;
    return value === 'all' ? 999 : parseInt(value) || 6;
}

// Obtener transacciones filtradas por período
function getTransactionsByPeriod(chartName = null) {
    const period = getSelectedPeriod(chartName);
    const now = new Date();
    
    if (period === 999) { // "all"
        return transactions;
    }
    
    if (period === 'custom') {
        // Primero intentar obtener fechas del modal (si estamos en el modal)
        const modalStartDate = document.getElementById('modalStartDate');
        const modalEndDate = document.getElementById('modalEndDate');
        
        if (modalStartDate && modalEndDate && modalStartDate.value && modalEndDate.value) {
            const startDate = new Date(modalStartDate.value);
            const endDate = new Date(modalEndDate.value);
            endDate.setHours(23, 59, 59, 999);
            
            return transactions.filter(t => {
                const tDate = new Date(t.date);
                return tDate >= startDate && tDate <= endDate;
            });
        }
        
        // Si no está en el modal, obtener fechas del gráfico pequeño
        const startDateInput = document.getElementById(`${chartName}StartDate`) || 
                              document.querySelector(`#${chartName}StartDate`);
        const endDateInput = document.getElementById(`${chartName}EndDate`) || 
                            document.querySelector(`#${chartName}EndDate`);
        
        if (startDateInput && endDateInput && startDateInput.value && endDateInput.value) {
            const startDate = new Date(startDateInput.value);
            const endDate = new Date(endDateInput.value);
            endDate.setHours(23, 59, 59, 999); // Incluir todo el día final
            
            return transactions.filter(t => {
                const tDate = new Date(t.date);
                return tDate >= startDate && tDate <= endDate;
            });
        }
        // Si no hay fechas seleccionadas, usar período por defecto
        const startDate = new Date(now.getFullYear(), now.getMonth() - 6, 1);
        return transactions.filter(t => {
            const tDate = new Date(t.date);
            return tDate >= startDate;
        });
    }
    
    const startDate = new Date(now.getFullYear(), now.getMonth() - period, 1);
    return transactions.filter(t => {
        const tDate = new Date(t.date);
        return tDate >= startDate;
    });
}

// Actualizar un gráfico específico
function updateSingleChart(chartName) {
    switch(chartName) {
        case 'savings':
            updateSavingsChart();
            break;
        case 'expenses':
            updateExpensesChart();
            break;
        case 'incomeExpense':
            updateIncomeExpenseChart();
            break;
        case 'distribution':
            updateDistributionChart();
            break;
        case 'incomeEvolution':
            updateIncomeEvolutionChart();
            break;
        case 'expensesEvolution':
            updateExpensesEvolutionChart();
            break;
        case 'loansPending':
            updateLoansOutstandingChart();
            break;
        case 'assetsEvolution':
            updateAssetsEvolutionChart();
            break;
        case 'accountsBalance':
            updateAccountsBalanceChart();
            break;
    }
}

// Actualizar filtros de los gráficos
function updateChartFilters() {
    // Filtros de categorías de ingresos
    const incomeFilter = document.querySelector('.chart-category-filter[data-chart="incomeEvolution"]');
    if (incomeFilter) {
        const currentValue = incomeFilter.value;
        incomeFilter.innerHTML = '<option value="all">Todas las categorías</option>';
        const incomeCats = [...categories.income];
        incomeCats.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.id;
            option.textContent = cat.name;
            incomeFilter.appendChild(option);
        });
        if (currentValue) incomeFilter.value = currentValue;
    }
    
    // Filtros de categorías de gastos
    const expenseFilter = document.querySelector('.chart-category-filter[data-chart="expensesEvolution"]');
    if (expenseFilter) {
        const currentValue = expenseFilter.value;
        expenseFilter.innerHTML = '<option value="all">Todas las categorías</option>';
        const expenseCats = [...categories.expense];
        expenseCats.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.id;
            option.textContent = cat.name;
            expenseFilter.appendChild(option);
        });
        if (currentValue) expenseFilter.value = currentValue;
    }
    
    // Filtros de préstamos
    const loanFilter = document.querySelector('.chart-loan-filter[data-chart="loansPending"]');
    if (loanFilter) {
        const currentValue = loanFilter.value;
        loanFilter.innerHTML = '<option value="all">Todos los préstamos</option>';
        loans.forEach(loan => {
            const option = document.createElement('option');
            option.value = loan._id || loan.id;
            option.textContent = loan.name || `Préstamo ${loan._id || loan.id}`;
            loanFilter.appendChild(option);
        });
        if (currentValue) loanFilter.value = currentValue;
    }
    
    // Filtros de patrimonio
    const assetFilter = document.querySelector('.chart-asset-filter[data-chart="assetsEvolution"]');
    if (assetFilter) {
        const currentValue = assetFilter.value;
        assetFilter.innerHTML = '<option value="all">Todas las propiedades</option>';
        patrimonio.forEach(prop => {
            const option = document.createElement('option');
            option.value = prop._id || prop.id;
            option.textContent = prop.name || `Propiedad ${prop._id || prop.id}`;
            assetFilter.appendChild(option);
        });
        if (currentValue) assetFilter.value = currentValue;
    }
    
    // Filtros de cuentas
    const accountFilter = document.querySelector('.chart-account-filter[data-chart="accountsBalance"]');
    if (accountFilter) {
        const currentValue = accountFilter.value;
        accountFilter.innerHTML = '<option value="all">Todas las cuentas</option>';
        accounts.forEach(account => {
            const option = document.createElement('option');
            option.value = account._id || account.id;
            option.textContent = account.name || `Cuenta ${account._id || account.id}`;
            accountFilter.appendChild(option);
        });
        if (currentValue) accountFilter.value = currentValue;
    }
}

// Actualizar gráficas
function updateCharts() {
    updateSavingsChart();
    updateExpensesChart();
    updateIncomeExpenseChart();
    updateDistributionChart();
    // Actualizar gráficas de evolución (si existen) - con manejo de errores
    try {
        if (typeof updateIncomeEvolutionChart === 'function') updateIncomeEvolutionChart();
    } catch (e) { 
        // Función no disponible, ignorar silenciosamente
    }
    try {
        if (typeof updateExpensesEvolutionChart === 'function') updateExpensesEvolutionChart();
    } catch (e) { 
        // Función no disponible, ignorar silenciosamente
    }
    try {
        if (typeof updateLoansOutstandingChart === 'function') updateLoansOutstandingChart();
    } catch (e) { 
        // Función no disponible, ignorar silenciosamente
    }
    try {
        if (typeof updateAssetsEvolutionChart === 'function') updateAssetsEvolutionChart();
    } catch (e) { 
        // Función no disponible, ignorar silenciosamente
    }
    try {
        if (typeof updateAccountsBalanceChart === 'function') updateAccountsBalanceChart();
    } catch (e) { 
        // Función no disponible, ignorar silenciosamente
    }
    updateFinancialHealthMetrics();
    updateRecommendations();
    updateAnalysisTables();
}

// Obtener transacciones filtradas por summaryPeriod
function getTransactionsBySummaryPeriod() {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const summaryYearInput = document.getElementById('summaryYear');
    let selectedMonth = currentMonth;
    let selectedYear = currentYear;
    
    if (summaryPeriod === 'month-select') {
        const summaryMonthSelect = document.getElementById('summaryMonthSelect');
        const summaryMonthYear = document.getElementById('summaryMonthYear');
        if (summaryMonthSelect && summaryMonthYear) {
            const month = parseInt(summaryMonthSelect.value);
            const year = parseInt(summaryMonthYear.value);
            if (month && year) {
                selectedYear = year;
                selectedMonth = month - 1;
            }
        }
    }
    
    if (summaryYearInput && summaryPeriod === 'year-select') {
        selectedYear = parseInt(summaryYearInput.value) || currentYear;
    }
    
    if (summaryPeriod === 'month') {
        return transactions.filter(t => {
            const tDate = new Date(t.date);
            return tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear;
        });
    } else if (summaryPeriod === 'month-select') {
        return transactions.filter(t => {
            const tDate = new Date(t.date);
            return tDate.getMonth() === selectedMonth && tDate.getFullYear() === selectedYear;
        });
    } else if (summaryPeriod === 'year') {
        return transactions.filter(t => {
            const tDate = new Date(t.date);
            return tDate.getFullYear() === currentYear;
        });
    } else if (summaryPeriod === 'year-select') {
        return transactions.filter(t => {
            const tDate = new Date(t.date);
            return tDate.getFullYear() === selectedYear;
        });
    } else { // 'all'
        return transactions;
    }
}

// Actualizar gráficas del dashboard
function updateDashboardCharts() {
    updateDashboardSavingsChart();
    updateDashboardIncomeExpenseChart();
    updateDashboardExpensesChart();
    updateDashboardDistributionChart();
    updateDashboardIncomeEvolutionChart();
    updateDashboardExpensesEvolutionChart();
}

// Gráfica de ahorro del dashboard
function updateDashboardSavingsChart() {
    if (!charts.dashboardSavings) return;
    
    const now = new Date();
    const months = [];
    const savings = [];
    let runningTotal = 0;
    
    const periodTransactions = getTransactionsBySummaryPeriod();
    
    if (summaryPeriod === 'all') {
        if (periodTransactions.length === 0) {
            charts.dashboardSavings.data.labels = [];
            charts.dashboardSavings.data.datasets = [];
            charts.dashboardSavings.update();
            return;
        }
        
        const firstDate = new Date(Math.min(...periodTransactions.map(t => new Date(t.date))));
        const startMonth = firstDate.getMonth();
        const startYear = firstDate.getFullYear();
        const endMonth = now.getMonth();
        const endYear = now.getFullYear();
        
        let currentMonth = startMonth;
        let currentYear = startYear;
        
        while (currentYear < endYear || (currentYear === endYear && currentMonth <= endMonth)) {
            const date = new Date(currentYear, currentMonth, 1);
            const monthKey = date.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
            months.push(monthKey);
            
            const monthTransactions = periodTransactions.filter(t => {
                const tDate = new Date(t.date);
                return tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear;
            });
            
            const monthIncome = monthTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
            const monthExpenses = Math.abs(monthTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0));
            const monthSavings = monthIncome - monthExpenses;
            
            runningTotal += monthSavings;
            savings.push(runningTotal);
            
            currentMonth++;
            if (currentMonth > 11) {
                currentMonth = 0;
                currentYear++;
            }
        }
    } else {
        // Para períodos específicos, mostrar meses del período
        const summaryMonthInput = document.getElementById('summaryMonth');
        const summaryYearInput = document.getElementById('summaryYear');
        let startMonth, startYear, endMonth, endYear;
        
        if (summaryPeriod === 'month' || summaryPeriod === 'month-select') {
            if (summaryPeriod === 'month-select') {
                const summaryMonthSelect = document.getElementById('summaryMonthSelect');
                const summaryMonthYear = document.getElementById('summaryMonthYear');
                if (summaryMonthSelect && summaryMonthYear) {
                    const month = parseInt(summaryMonthSelect.value);
                    const year = parseInt(summaryMonthYear.value);
                    if (month && year) {
                        startMonth = month - 1;
                        startYear = year;
                    } else {
                        startMonth = now.getMonth();
                        startYear = now.getFullYear();
                    }
                } else {
                    startMonth = now.getMonth();
                    startYear = now.getFullYear();
                }
                endMonth = startMonth;
                endYear = startYear;
        } else if (summaryPeriod === 'year' || summaryPeriod === 'year-select') {
            if (summaryPeriod === 'year-select' && summaryYearInput && summaryYearInput.value) {
                startYear = parseInt(summaryYearInput.value);
            } else {
                startYear = now.getFullYear();
            }
            startMonth = 0;
            endMonth = 11;
            endYear = startYear;
        } else {
            startMonth = now.getMonth() - 5;
            startYear = now.getFullYear();
            if (startMonth < 0) {
                startMonth += 12;
                startYear--;
            }
            endMonth = now.getMonth();
            endYear = now.getFullYear();
        }
        
        let currentMonth = startMonth;
        let currentYear = startYear;
        
        while (currentYear < endYear || (currentYear === endYear && currentMonth <= endMonth)) {
            const date = new Date(currentYear, currentMonth, 1);
            const monthKey = date.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
            months.push(monthKey);
            
            const monthTransactions = periodTransactions.filter(t => {
                const tDate = new Date(t.date);
                return tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear;
            });
            
            const monthIncome = monthTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
            const monthExpenses = Math.abs(monthTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0));
            const monthSavings = monthIncome - monthExpenses;
            
            runningTotal += monthSavings;
            savings.push(runningTotal);
            
            currentMonth++;
            if (currentMonth > 11) {
                currentMonth = 0;
                currentYear++;
            }
        }
    }
    
    charts.dashboardSavings.data.labels = months;
    charts.dashboardSavings.data.datasets = [{
        label: 'Ahorro Acumulado',
        data: savings,
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.15)',
        tension: 0.4,
        fill: true
    }];
    charts.dashboardSavings.update();
}

// Gráfica de ingresos vs gastos del dashboard
function updateDashboardIncomeExpenseChart() {
    if (!charts.dashboardIncomeExpense) return;
    
    const periodTransactions = getTransactionsBySummaryPeriod();
    const now = new Date();
    const months = [];
    const incomeData = [];
    const expenseData = [];
    
    let startMonth, startYear, endMonth, endYear;
    const summaryYearInput = document.getElementById('summaryYear');
    
    if (summaryPeriod === 'month' || summaryPeriod === 'month-select') {
        if (summaryPeriod === 'month-select') {
            const summaryMonthSelect = document.getElementById('summaryMonthSelect');
            const summaryMonthYear = document.getElementById('summaryMonthYear');
            if (summaryMonthSelect && summaryMonthYear) {
                const month = parseInt(summaryMonthSelect.value);
                const year = parseInt(summaryMonthYear.value);
                if (month && year) {
                    startMonth = month - 1;
                    startYear = year;
                } else {
                    startMonth = now.getMonth();
                    startYear = now.getFullYear();
                }
            } else {
                startMonth = now.getMonth();
                startYear = now.getFullYear();
            }
        } else {
            startMonth = now.getMonth();
            startYear = now.getFullYear();
        }
        endMonth = startMonth;
        endYear = startYear;
    } else if (summaryPeriod === 'year' || summaryPeriod === 'year-select') {
        if (summaryPeriod === 'year-select' && summaryYearInput && summaryYearInput.value) {
            startYear = parseInt(summaryYearInput.value);
        } else {
            startYear = now.getFullYear();
        }
        startMonth = 0;
        endMonth = 11;
        endYear = startYear;
    } else if (summaryPeriod === 'all') {
        if (periodTransactions.length === 0) {
            charts.dashboardIncomeExpense.data.labels = [];
            charts.dashboardIncomeExpense.data.datasets = [];
            charts.dashboardIncomeExpense.update();
            return;
        }
        const firstDate = new Date(Math.min(...periodTransactions.map(t => new Date(t.date))));
        startMonth = firstDate.getMonth();
        startYear = firstDate.getFullYear();
        endMonth = now.getMonth();
        endYear = now.getFullYear();
    } else {
        startMonth = now.getMonth() - 5;
        startYear = now.getFullYear();
        if (startMonth < 0) {
            startMonth += 12;
            startYear--;
        }
        endMonth = now.getMonth();
        endYear = now.getFullYear();
    }
    
    let currentMonth = startMonth;
    let currentYear = startYear;
    
    while (currentYear < endYear || (currentYear === endYear && currentMonth <= endMonth)) {
        const date = new Date(currentYear, currentMonth, 1);
        const monthKey = date.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
        months.push(monthKey);
        
        const monthTransactions = periodTransactions.filter(t => {
            const tDate = new Date(t.date);
            return tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear;
        });
        
        const monthIncome = monthTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
        const monthExpenses = Math.abs(monthTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0));
        
        incomeData.push(monthIncome);
        expenseData.push(monthExpenses);
        
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
    }
    
    charts.dashboardIncomeExpense.data.labels = months;
    charts.dashboardIncomeExpense.data.datasets = [
        {
            label: 'Ingresos',
            data: incomeData,
            backgroundColor: '#3B82F6'
        },
        {
            label: 'Gastos',
            data: expenseData,
            backgroundColor: '#EF4444'
        }
    ];
    charts.dashboardIncomeExpense.update();
}

// Gráfica de gastos por categoría del dashboard
function updateDashboardExpensesChart() {
    if (!charts.dashboardExpenses) return;
    
    const periodTransactions = getTransactionsBySummaryPeriod();
    const expenses = periodTransactions.filter(t => t.type === 'expense');
    
    const categoryTotals = {};
    expenses.forEach(t => {
        let catName;
        const expenseCat = categories.expense.find(c => c.id === t.categoryGeneral);
        if (expenseCat) {
            catName = expenseCat.name;
        } else {
            catName = t.categoryGeneral;
        }
        categoryTotals[catName] = (categoryTotals[catName] || 0) + Math.abs(t.amount);
    });
    
    const sortedCategories = Object.entries(categoryTotals)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8);
    
    const labels = sortedCategories.map(([name]) => name);
    const data = sortedCategories.map(([, value]) => value);
    
    charts.dashboardExpenses.data.labels = labels;
    charts.dashboardExpenses.data.datasets = [{
        data: data,
        backgroundColor: '#8B5CF6'
    }];
    charts.dashboardExpenses.update();
}

// Gráfica de distribución del dashboard
function updateDashboardDistributionChart() {
    if (!charts.dashboardDistribution) return;
    
    const periodTransactions = getTransactionsBySummaryPeriod();
    const expenses = periodTransactions.filter(t => t.type === 'expense');
    
    const categoryTotals = {};
    expenses.forEach(t => {
        let catName;
        const expenseCat = categories.expense.find(c => c.id === t.categoryGeneral);
        if (expenseCat) {
            catName = expenseCat.name;
        } else {
            catName = t.categoryGeneral;
        }
        categoryTotals[catName] = (categoryTotals[catName] || 0) + Math.abs(t.amount);
    });
    
    const labels = Object.keys(categoryTotals);
    const data = Object.values(categoryTotals);
    
    charts.dashboardDistribution.data.labels = labels;
    charts.dashboardDistribution.data.datasets = [{
        data: data,
        backgroundColor: [
            '#3B82F6', '#10B981', '#F59E0B', '#EF4444',
            '#8B5CF6', '#06B6D4', '#84CC16', '#F97316',
            '#EC4899', '#6366F1', '#3B82F6', '#10B981'
        ]
    }];
    charts.dashboardDistribution.update();
}

// Gráfica de evolución de ingresos del dashboard
function updateDashboardIncomeEvolutionChart() {
    if (!charts.dashboardIncomeEvolution) return;
    
    const periodTransactions = getTransactionsBySummaryPeriod();
    const now = new Date();
    const months = [];
    const incomeData = [];
    
    let startMonth, startYear, endMonth, endYear;
    const summaryYearInput = document.getElementById('summaryYear');
    
    if (summaryPeriod === 'month' || summaryPeriod === 'month-select') {
        if (summaryPeriod === 'month-select') {
            const summaryMonthSelect = document.getElementById('summaryMonthSelect');
            const summaryMonthYear = document.getElementById('summaryMonthYear');
            if (summaryMonthSelect && summaryMonthYear) {
                const month = parseInt(summaryMonthSelect.value);
                const year = parseInt(summaryMonthYear.value);
                if (month && year) {
                    startMonth = month - 1;
                    startYear = year;
                } else {
                    startMonth = now.getMonth();
                    startYear = now.getFullYear();
                }
            } else {
                startMonth = now.getMonth();
                startYear = now.getFullYear();
            }
        } else {
            startMonth = now.getMonth();
            startYear = now.getFullYear();
        }
        endMonth = startMonth;
        endYear = startYear;
    } else if (summaryPeriod === 'year' || summaryPeriod === 'year-select') {
        if (summaryPeriod === 'year-select' && summaryYearInput && summaryYearInput.value) {
            startYear = parseInt(summaryYearInput.value);
        } else {
            startYear = now.getFullYear();
        }
        startMonth = 0;
        endMonth = 11;
        endYear = startYear;
    } else if (summaryPeriod === 'all') {
        if (periodTransactions.length === 0) {
            charts.dashboardIncomeEvolution.data.labels = [];
            charts.dashboardIncomeEvolution.data.datasets = [];
            charts.dashboardIncomeEvolution.update();
            return;
        }
        const firstDate = new Date(Math.min(...periodTransactions.map(t => new Date(t.date))));
        startMonth = firstDate.getMonth();
        startYear = firstDate.getFullYear();
        endMonth = now.getMonth();
        endYear = now.getFullYear();
    } else {
        startMonth = now.getMonth() - 5;
        startYear = now.getFullYear();
        if (startMonth < 0) {
            startMonth += 12;
            startYear--;
        }
        endMonth = now.getMonth();
        endYear = now.getFullYear();
    }
    
    let currentMonth = startMonth;
    let currentYear = startYear;
    
    while (currentYear < endYear || (currentYear === endYear && currentMonth <= endMonth)) {
        const date = new Date(currentYear, currentMonth, 1);
        const monthKey = date.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
        months.push(monthKey);
        
        const monthTransactions = periodTransactions.filter(t => {
            const tDate = new Date(t.date);
            return tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear && t.type === 'income';
        });
        
        const monthIncome = monthTransactions.reduce((sum, t) => sum + t.amount, 0);
        incomeData.push(monthIncome);
        
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
    }
    
    charts.dashboardIncomeEvolution.data.labels = months;
    charts.dashboardIncomeEvolution.data.datasets = [{
        label: 'Ingresos',
        data: incomeData,
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.15)',
        tension: 0.4,
        fill: true
    }];
    charts.dashboardIncomeEvolution.update();
}

// Gráfica de evolución de gastos del dashboard
function updateDashboardExpensesEvolutionChart() {
    if (!charts.dashboardExpensesEvolution) return;
    
    const periodTransactions = getTransactionsBySummaryPeriod();
    const now = new Date();
    const months = [];
    const expensesData = [];
    
    let startMonth, startYear, endMonth, endYear;
    const summaryYearInput = document.getElementById('summaryYear');
    
    if (summaryPeriod === 'month' || summaryPeriod === 'month-select') {
        if (summaryPeriod === 'month-select') {
            const summaryMonthSelect = document.getElementById('summaryMonthSelect');
            const summaryMonthYear = document.getElementById('summaryMonthYear');
            if (summaryMonthSelect && summaryMonthYear) {
                const month = parseInt(summaryMonthSelect.value);
                const year = parseInt(summaryMonthYear.value);
                if (month && year) {
                    startMonth = month - 1;
                    startYear = year;
                } else {
                    startMonth = now.getMonth();
                    startYear = now.getFullYear();
                }
            } else {
                startMonth = now.getMonth();
                startYear = now.getFullYear();
            }
        } else {
            startMonth = now.getMonth();
            startYear = now.getFullYear();
        }
        endMonth = startMonth;
        endYear = startYear;
    } else if (summaryPeriod === 'year' || summaryPeriod === 'year-select') {
        if (summaryPeriod === 'year-select' && summaryYearInput && summaryYearInput.value) {
            startYear = parseInt(summaryYearInput.value);
        } else {
            startYear = now.getFullYear();
        }
        startMonth = 0;
        endMonth = 11;
        endYear = startYear;
    } else if (summaryPeriod === 'all') {
        if (periodTransactions.length === 0) {
            charts.dashboardExpensesEvolution.data.labels = [];
            charts.dashboardExpensesEvolution.data.datasets = [];
            charts.dashboardExpensesEvolution.update();
            return;
        }
        const firstDate = new Date(Math.min(...periodTransactions.map(t => new Date(t.date))));
        startMonth = firstDate.getMonth();
        startYear = firstDate.getFullYear();
        endMonth = now.getMonth();
        endYear = now.getFullYear();
    } else {
        startMonth = now.getMonth() - 5;
        startYear = now.getFullYear();
        if (startMonth < 0) {
            startMonth += 12;
            startYear--;
        }
        endMonth = now.getMonth();
        endYear = now.getFullYear();
    }
    
    let currentMonth = startMonth;
    let currentYear = startYear;
    
    while (currentYear < endYear || (currentYear === endYear && currentMonth <= endMonth)) {
        const date = new Date(currentYear, currentMonth, 1);
        const monthKey = date.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
        months.push(monthKey);
        
        const monthTransactions = periodTransactions.filter(t => {
            const tDate = new Date(t.date);
            return tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear && t.type === 'expense';
        });
        
        // Agregar pagos de préstamos desde su fecha de inicio
        let loanPaymentsForMonth = 0;
        loans.filter(loan => loan.type === 'debt').forEach(loan => {
            const loanStartDate = new Date(loan.start_date);
            const loanEndDate = new Date(loan.end_date);
            const monthDate = new Date(currentYear, currentMonth, 1);
            
            // Si el préstamo está activo en este mes
            if (monthDate >= loanStartDate && monthDate <= loanEndDate) {
                // Calcular el número de mes del préstamo
                const monthsSinceStart = (currentYear - loanStartDate.getFullYear()) * 12 + (currentMonth - loanStartDate.getMonth());
                if (monthsSinceStart >= 0) {
                    const amortization = calculateAmortizationTable(
                        loan.principal,
                        loan.interest_rate,
                        loan.monthly_payment,
                        loan.start_date,
                        0,
                        loan.early_payments || [],
                        new Date(currentYear, currentMonth + 1, 0) // Fin del mes
                    );
                    
                    // Obtener el pago de este mes específico
                    if (amortization.table[monthsSinceStart]) {
                        loanPaymentsForMonth += amortization.table[monthsSinceStart].payment;
                    }
                }
            }
        });
        
        const monthExpenses = Math.abs(monthTransactions.reduce((sum, t) => sum + t.amount, 0)) + loanPaymentsForMonth;
        expensesData.push(monthExpenses);
        
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
    }
    
    // Obtener todas las categorías de gastos únicas
    const expenseCategories = {};
    periodTransactions.filter(t => t.type === 'expense').forEach(t => {
        let catName;
        const expenseCat = categories.expense.find(c => c.id === t.categoryGeneral);
        if (expenseCat) {
            catName = expenseCat.name;
        } else {
            catName = t.categoryGeneral;
        }
        if (!expenseCategories[catName]) {
            expenseCategories[catName] = [];
        }
    });
    
    // Calcular gastos por categoría para cada mes
    let currentMonthCalc = startMonth;
    let currentYearCalc = startYear;
    const categoryData = {};
    
    Object.keys(expenseCategories).forEach(catName => {
        categoryData[catName] = [];
    });
    
    let monthIndex = 0;
    while (currentYearCalc < endYear || (currentYearCalc === endYear && currentMonthCalc <= endMonth)) {
        const monthTransactions = periodTransactions.filter(t => {
            const tDate = new Date(t.date);
            return tDate.getMonth() === currentMonthCalc && tDate.getFullYear() === currentYearCalc && t.type === 'expense';
        });
        
        Object.keys(expenseCategories).forEach(catName => {
            const catExpenses = Math.abs(monthTransactions
                .filter(t => {
                    let tCatName;
                    const expenseCat = categories.expense.find(c => c.id === t.categoryGeneral);
                    if (expenseCat) {
                        tCatName = expenseCat.name;
                    } else {
                        tCatName = t.categoryGeneral;
                    }
                    return tCatName === catName;
                })
                .reduce((sum, t) => sum + t.amount, 0));
            categoryData[catName].push(catExpenses);
        });
        
        currentMonthCalc++;
        if (currentMonthCalc > 11) {
            currentMonthCalc = 0;
            currentYearCalc++;
        }
        monthIndex++;
    }
    
    // Colores variados para las categorías
    const colors = [
        '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
        '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1',
        '#14B8A6', '#FBBF24', '#FB7185', '#A78BFA', '#60A5FA'
    ];
    
    // Crear datasets para cada categoría
    const datasets = Object.keys(categoryData).map((catName, index) => {
        const data = categoryData[catName];
        const hasData = data.some(v => v > 0);
        if (!hasData) return null;
        
        return {
            label: catName,
            data: data,
            borderColor: colors[index % colors.length],
            backgroundColor: colors[index % colors.length] + '20',
            tension: 0.4,
            fill: false
        };
    }).filter(d => d !== null);
    
    charts.dashboardExpensesEvolution.data.labels = months;
    charts.dashboardExpensesEvolution.data.datasets = datasets.length > 0 ? datasets : [{
        label: 'Gastos',
        data: expensesData,
        borderColor: '#EF4444',
        backgroundColor: 'rgba(239, 68, 68, 0.15)',
        tension: 0.4,
        fill: true
    }];
    charts.dashboardExpensesEvolution.update();
}

// Gráfica de ahorro
function updateSavingsChart() {
    if (!charts.savings) return;
    
    const period = getSelectedPeriod('savings');
    const now = new Date();
    const months = [];
    const savings = [];
    let runningTotal = 0;
    
    const periodTransactions = getTransactionsByPeriod();
    
    // Si es "all", agrupar por mes desde la primera transacción
    if (period === 999) {
        if (periodTransactions.length === 0) {
            charts.savings.data.labels = [];
            charts.savings.data.datasets = [];
            charts.savings.update();
            return;
        }
        
        // Encontrar la primera transacción
        const firstDate = new Date(Math.min(...periodTransactions.map(t => new Date(t.date))));
        const startMonth = firstDate.getMonth();
        const startYear = firstDate.getFullYear();
        const endMonth = now.getMonth();
        const endYear = now.getFullYear();
        
        let currentMonth = startMonth;
        let currentYear = startYear;
        
        while (currentYear < endYear || (currentYear === endYear && currentMonth <= endMonth)) {
            const date = new Date(currentYear, currentMonth, 1);
            const monthKey = date.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
            months.push(monthKey);
            
            const monthTransactions = periodTransactions.filter(t => {
                const tDate = new Date(t.date);
                return tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear;
            });
            
            const monthIncome = monthTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
            const monthExpenses = Math.abs(monthTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0));
            const monthSavings = monthIncome - monthExpenses;
            
            runningTotal += monthSavings;
            savings.push(runningTotal);
            
            currentMonth++;
            if (currentMonth > 11) {
                currentMonth = 0;
                currentYear++;
            }
        }
    } else {
        // Período fijo de meses
        for (let i = period - 1; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthKey = date.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
            months.push(monthKey);
            
            const monthTransactions = periodTransactions.filter(t => {
                const tDate = new Date(t.date);
                return tDate.getMonth() === date.getMonth() && tDate.getFullYear() === date.getFullYear();
            });
            
            const monthIncome = monthTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
            const monthExpenses = Math.abs(monthTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0));
            const monthSavings = monthIncome - monthExpenses;
            
            runningTotal += monthSavings;
            savings.push(runningTotal);
        }
    }
    
    charts.savings.data.labels = months;
    charts.savings.data.datasets = [{
        label: 'Ahorro Acumulado',
        data: savings,
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.15)',
        tension: 0.4,
        fill: true
    }];
    charts.savings.update();
}

// Gráfica de gastos por categoría
function updateExpensesChart() {
    if (!charts.expenses) return;
    
    const periodTransactions = getTransactionsByPeriod('expenses');
    const expenses = periodTransactions.filter(t => t.type === 'expense');
    
    const categoryTotals = {};
    expenses.forEach(t => {
        let catName;
        // Buscar en categorías de gastos
        const expenseCat = categories.expense.find(c => c.id === t.categoryGeneral);
        if (expenseCat) {
            catName = expenseCat.name;
        } else {
            catName = t.categoryGeneral;
        }
        categoryTotals[catName] = (categoryTotals[catName] || 0) + Math.abs(t.amount);
    });
    
    const labels = Object.keys(categoryTotals);
    const data = Object.values(categoryTotals);
    
    charts.expenses.data.labels = labels;
    charts.expenses.data.datasets = [{
        label: 'Gastos',
        data: data,
        backgroundColor: [
            '#3B82F6', '#10B981', '#F59E0B', '#EF4444',
            '#8B5CF6', '#06B6D4', '#84CC16', '#F97316',
            '#EC4899', '#6366F1', '#3B82F6', '#10B981'
        ]
    }];
    charts.expenses.update();
}

// Gráfica de ingresos vs gastos
function updateIncomeExpenseChart() {
    if (!charts.incomeExpense) return;
    
    const period = getSelectedPeriod('incomeExpense');
    const now = new Date();
    const months = [];
    const incomes = [];
    const expenses = [];
    
    const periodTransactions = getTransactionsByPeriod('incomeExpense');
    
    if (period === 999) {
        // Todo el historial
        if (periodTransactions.length === 0) {
            charts.incomeExpense.data.labels = [];
            charts.incomeExpense.data.datasets = [];
            charts.incomeExpense.update();
            return;
        }
        
        const firstDate = new Date(Math.min(...periodTransactions.map(t => new Date(t.date))));
        const startMonth = firstDate.getMonth();
        const startYear = firstDate.getFullYear();
        const endMonth = now.getMonth();
        const endYear = now.getFullYear();
        
        let currentMonth = startMonth;
        let currentYear = startYear;
        
        while (currentYear < endYear || (currentYear === endYear && currentMonth <= endMonth)) {
            const date = new Date(currentYear, currentMonth, 1);
            const monthKey = date.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
            months.push(monthKey);
            
            const monthTransactions = periodTransactions.filter(t => {
                const tDate = new Date(t.date);
                return tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear;
            });
            
            const monthIncome = monthTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
            const monthExpenses = Math.abs(monthTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0));
            
            incomes.push(monthIncome);
            expenses.push(monthExpenses);
            
            currentMonth++;
            if (currentMonth > 11) {
                currentMonth = 0;
                currentYear++;
            }
        }
    } else {
        // Período fijo
        for (let i = period - 1; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthKey = date.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
            months.push(monthKey);
            
            const monthTransactions = periodTransactions.filter(t => {
                const tDate = new Date(t.date);
                return tDate.getMonth() === date.getMonth() && tDate.getFullYear() === date.getFullYear();
            });
            
            const monthIncome = monthTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
            const monthExpenses = Math.abs(monthTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0));
            
            incomes.push(monthIncome);
            expenses.push(monthExpenses);
        }
    }
    
    charts.incomeExpense.data.labels = months;
    charts.incomeExpense.data.datasets = [
        {
            label: 'Ingresos',
            data: incomes,
            backgroundColor: '#3B82F6'
        },
        {
            label: 'Gastos',
            data: expenses,
            backgroundColor: '#EF4444'
        }
    ];
    charts.incomeExpense.update();
}

// Gráfica de distribución
function updateDistributionChart() {
    if (!charts.distribution) return;
    
    const periodTransactions = getTransactionsByPeriod('distribution');
    const expenses = periodTransactions.filter(t => t.type === 'expense');
    
    const categoryTotals = {};
    expenses.forEach(t => {
        let catName;
        const expenseCat = categories.expense.find(c => c.id === t.categoryGeneral);
        if (expenseCat) {
            catName = expenseCat.name;
        } else {
            catName = t.categoryGeneral;
        }
        categoryTotals[catName] = (categoryTotals[catName] || 0) + Math.abs(t.amount);
    });
    
    const labels = Object.keys(categoryTotals);
    const data = Object.values(categoryTotals);
    
    charts.distribution.data.labels = labels;
    charts.distribution.data.datasets = [{
        data: data,
        backgroundColor: [
            '#3B82F6', '#10B981', '#F59E0B', '#EF4444',
            '#8B5CF6', '#06B6D4', '#84CC16', '#F97316',
            '#EC4899', '#6366F1', '#3B82F6', '#10B981'
        ]
    }];
    charts.distribution.update();
}

// Gráfica de evolución de ingresos por categoría
function updateIncomeEvolutionChart() {
    if (!charts.incomeEvolution) return;
    
    const period = getSelectedPeriod('incomeEvolution');
    const categoryFilter = document.querySelector('.chart-category-filter[data-chart="incomeEvolution"]');
    const selectedCategory = categoryFilter ? categoryFilter.value : 'all';
    
    let periodTransactions = getTransactionsByPeriod('incomeEvolution');
    
    // Filtrar por categoría si está seleccionada
    if (selectedCategory !== 'all') {
        periodTransactions = periodTransactions.filter(t => t.categoryGeneral === selectedCategory);
    }
    const now = new Date();
    const months = [];
    
    if (periodTransactions.length === 0) {
        charts.incomeEvolution.data.labels = [];
        charts.incomeEvolution.data.datasets = [];
        charts.incomeEvolution.update();
        return;
    }
    
    // Obtener todas las categorías de ingresos únicas
    const incomeCategories = {};
    periodTransactions.filter(t => t.type === 'income').forEach(t => {
        let catName;
        const incomeCat = categories.income.find(c => c.id === t.categoryGeneral);
        if (incomeCat) {
            catName = incomeCat.name;
        } else {
            catName = t.categoryGeneral;
        }
        if (!incomeCategories[catName]) {
            incomeCategories[catName] = [];
        }
    });
    
    // Generar meses
    if (period === 999) {
        const firstDate = new Date(Math.min(...periodTransactions.map(t => new Date(t.date))));
        let currentMonth = firstDate.getMonth();
        let currentYear = firstDate.getFullYear();
        const endMonth = now.getMonth();
        const endYear = now.getFullYear();
        
        while (currentYear < endYear || (currentYear === endYear && currentMonth <= endMonth)) {
            const date = new Date(currentYear, currentMonth, 1);
            const monthKey = date.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
            months.push(monthKey);
            
            // Calcular ingresos por categoría para este mes
            const monthTransactions = periodTransactions.filter(t => {
                const tDate = new Date(t.date);
                return tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear && t.type === 'income';
            });
            
            Object.keys(incomeCategories).forEach(catName => {
                if (!incomeCategories[catName]) incomeCategories[catName] = [];
                const catIncome = monthTransactions
                    .filter(t => {
                        let tCatName;
                        const incomeCat = categories.income.find(c => c.id === t.categoryGeneral);
                        if (incomeCat) {
                            tCatName = incomeCat.name;
                        } else {
                            tCatName = t.categoryGeneral;
                        }
                        return tCatName === catName;
                    })
                    .reduce((sum, t) => sum + t.amount, 0);
                incomeCategories[catName].push(catIncome);
            });
            
            currentMonth++;
            if (currentMonth > 11) {
                currentMonth = 0;
                currentYear++;
            }
        }
    } else {
        for (let i = period - 1; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthKey = date.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
            months.push(monthKey);
            
            const monthTransactions = periodTransactions.filter(t => {
                const tDate = new Date(t.date);
                return tDate.getMonth() === date.getMonth() && tDate.getFullYear() === date.getFullYear() && t.type === 'income';
            });
            
            Object.keys(incomeCategories).forEach(catName => {
                if (!incomeCategories[catName]) incomeCategories[catName] = [];
                const catIncome = monthTransactions
                    .filter(t => {
                        let tCatName;
                        const incomeCat = categories.income.find(c => c.id === t.categoryGeneral);
                        if (incomeCat) {
                            tCatName = incomeCat.name;
                        } else {
                            tCatName = t.categoryGeneral;
                        }
                        return tCatName === catName;
                    })
                    .reduce((sum, t) => sum + t.amount, 0);
                incomeCategories[catName].push(catIncome);
            });
        }
    }
    
    // Paleta de colores variada para las categorías
    const colors = [
        '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
        '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1'
    ];
    
    // Crear datasets para cada categoría
    const datasets = Object.keys(incomeCategories).map((catName, index) => {
        const data = incomeCategories[catName];
        // Solo mostrar categorías que tengan al menos un valor > 0
        const hasData = data.some(v => v > 0);
        if (!hasData) return null;
        
        return {
            label: catName,
            data: data,
            borderColor: colors[index % colors.length],
            backgroundColor: colors[index % colors.length] + '20',
            tension: 0.4,
            fill: false
        };
    }).filter(d => d !== null);
    
    charts.incomeEvolution.data.labels = months;
    charts.incomeEvolution.data.datasets = datasets.length > 0 ? datasets : [{
        label: 'Ingresos',
        data: new Array(months.length).fill(0),
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.15)',
        tension: 0.4,
        fill: true
    }];
    charts.incomeEvolution.update();
}

// Gráfica de evolución de gastos por categoría
function updateExpensesEvolutionChart() {
    if (!charts.expensesEvolution) return;
    
    const period = getSelectedPeriod('expensesEvolution');
    const categoryFilter = document.querySelector('.chart-category-filter[data-chart="expensesEvolution"]');
    const selectedCategory = categoryFilter ? categoryFilter.value : 'all';
    
    let periodTransactions = getTransactionsByPeriod('expensesEvolution');
    
    // Filtrar por categoría si está seleccionada
    if (selectedCategory !== 'all') {
        periodTransactions = periodTransactions.filter(t => t.categoryGeneral === selectedCategory);
    }
    const now = new Date();
    const months = [];
    
    if (periodTransactions.length === 0) {
        charts.expensesEvolution.data.labels = [];
        charts.expensesEvolution.data.datasets = [];
        charts.expensesEvolution.update();
        return;
    }
    
    // Obtener todas las categorías de gastos únicas
    const expenseCategories = {};
    periodTransactions.filter(t => t.type === 'expense').forEach(t => {
        let catName;
        const expenseCat = categories.expense.find(c => c.id === t.categoryGeneral);
        if (expenseCat) {
            catName = expenseCat.name;
        } else {
            catName = t.categoryGeneral;
        }
        if (!expenseCategories[catName]) {
            expenseCategories[catName] = [];
        }
    });
    
    // Generar meses
    if (period === 999) {
        const firstDate = new Date(Math.min(...periodTransactions.map(t => new Date(t.date))));
        let currentMonth = firstDate.getMonth();
        let currentYear = firstDate.getFullYear();
        const endMonth = now.getMonth();
        const endYear = now.getFullYear();
        
        while (currentYear < endYear || (currentYear === endYear && currentMonth <= endMonth)) {
            const date = new Date(currentYear, currentMonth, 1);
            const monthKey = date.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
            months.push(monthKey);
            
            // Calcular gastos por categoría para este mes
            const monthTransactions = periodTransactions.filter(t => {
                const tDate = new Date(t.date);
                return tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear && t.type === 'expense';
            });
            
            // Agregar pagos de préstamos desde su fecha de inicio
            let loanPaymentsForMonth = 0;
            loans.filter(loan => loan.type === 'debt').forEach(loan => {
                const loanStartDate = new Date(loan.start_date);
                const loanEndDate = new Date(loan.end_date);
                const monthDate = new Date(currentYear, currentMonth, 1);
                
                if (monthDate >= loanStartDate && monthDate <= loanEndDate) {
                    const monthsSinceStart = (currentYear - loanStartDate.getFullYear()) * 12 + (currentMonth - loanStartDate.getMonth());
                    if (monthsSinceStart >= 0) {
                        const amortization = calculateAmortizationTable(
                            loan.principal,
                            loan.interest_rate,
                            loan.monthly_payment,
                            loan.start_date,
                            0,
                            loan.early_payments || [],
                            new Date(currentYear, currentMonth + 1, 0)
                        );
                        
                        if (amortization.table[monthsSinceStart]) {
                            loanPaymentsForMonth += amortization.table[monthsSinceStart].payment;
                        }
                    }
                }
            });
            
            // Agregar préstamos a la categoría "Deudas y Préstamos" si existe
            const debtCategory = categories.expense.find(c => c.id === 'debt');
            if (debtCategory && loanPaymentsForMonth > 0) {
                if (!expenseCategories[debtCategory.name]) {
                    expenseCategories[debtCategory.name] = [];
                }
            }
            
            Object.keys(expenseCategories).forEach(catName => {
                if (!expenseCategories[catName]) expenseCategories[catName] = [];
                const catExpenses = Math.abs(monthTransactions
                    .filter(t => {
                        let tCatName;
                        const expenseCat = categories.expense.find(c => c.id === t.categoryGeneral);
                        if (expenseCat) {
                            tCatName = expenseCat.name;
                        } else {
                            tCatName = t.categoryGeneral;
                        }
                        return tCatName === catName;
                    })
                    .reduce((sum, t) => sum + t.amount, 0));
                
                // Si es la categoría de deudas, agregar los pagos de préstamos
                if (debtCategory && catName === debtCategory.name) {
                    expenseCategories[catName].push(catExpenses + loanPaymentsForMonth);
                } else {
                    expenseCategories[catName].push(catExpenses);
                }
            });
            
            currentMonth++;
            if (currentMonth > 11) {
                currentMonth = 0;
                currentYear++;
            }
        }
    } else {
        for (let i = period - 1; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthKey = date.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
            months.push(monthKey);
            
            const monthTransactions = periodTransactions.filter(t => {
                const tDate = new Date(t.date);
                return tDate.getMonth() === date.getMonth() && tDate.getFullYear() === date.getFullYear() && t.type === 'expense';
            });
            
            // Agregar pagos de préstamos desde su fecha de inicio
            let loanPaymentsForMonth = 0;
            loans.filter(loan => loan.type === 'debt').forEach(loan => {
                const loanStartDate = new Date(loan.start_date);
                const loanEndDate = new Date(loan.end_date);
                const monthDate = new Date(date.getFullYear(), date.getMonth(), 1);
                
                if (monthDate >= loanStartDate && monthDate <= loanEndDate) {
                    const monthsSinceStart = (date.getFullYear() - loanStartDate.getFullYear()) * 12 + (date.getMonth() - loanStartDate.getMonth());
                    if (monthsSinceStart >= 0) {
                        const amortization = calculateAmortizationTable(
                            loan.principal,
                            loan.interest_rate,
                            loan.monthly_payment,
                            loan.start_date,
                            0,
                            loan.early_payments || [],
                            new Date(date.getFullYear(), date.getMonth() + 1, 0)
                        );
                        
                        if (amortization.table[monthsSinceStart]) {
                            loanPaymentsForMonth += amortization.table[monthsSinceStart].payment;
                        }
                    }
                }
            });
            
            // Agregar préstamos a la categoría "Deudas y Préstamos" si existe
            const debtCategory = categories.expense.find(c => c.id === 'debt');
            if (debtCategory && loanPaymentsForMonth > 0) {
                if (!expenseCategories[debtCategory.name]) {
                    expenseCategories[debtCategory.name] = [];
                }
            }
            
            Object.keys(expenseCategories).forEach(catName => {
                if (!expenseCategories[catName]) expenseCategories[catName] = [];
                const catExpenses = Math.abs(monthTransactions
                    .filter(t => {
                        let tCatName;
                        const expenseCat = categories.expense.find(c => c.id === t.categoryGeneral);
                        if (expenseCat) {
                            tCatName = expenseCat.name;
                        } else {
                            tCatName = t.categoryGeneral;
                        }
                        return tCatName === catName;
                    })
                    .reduce((sum, t) => sum + t.amount, 0));
                
                // Si es la categoría de deudas, agregar los pagos de préstamos
                if (debtCategory && catName === debtCategory.name) {
                    expenseCategories[catName].push(catExpenses + loanPaymentsForMonth);
                } else {
                    expenseCategories[catName].push(catExpenses);
                }
            });
        }
    }
    
    // Colores variados para las categorías
    const colors = [
        '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
        '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1',
        '#14B8A6', '#FBBF24', '#FB7185', '#A78BFA', '#60A5FA'
    ];
    
    // Crear datasets para cada categoría
    const datasets = Object.keys(expenseCategories).map((catName, index) => {
        const data = expenseCategories[catName];
        // Solo mostrar categorías que tengan al menos un valor > 0
        const hasData = data.some(v => v > 0);
        if (!hasData) return null;
        
        return {
            label: catName,
            data: data,
            borderColor: colors[index % colors.length],
            backgroundColor: colors[index % colors.length] + '20',
            tension: 0.4,
            fill: false
        };
    }).filter(d => d !== null);
    
    charts.expensesEvolution.data.labels = months;
    charts.expensesEvolution.data.datasets = datasets.length > 0 ? datasets : [{
        label: 'Gastos',
        data: new Array(months.length).fill(0),
        borderColor: '#EF4444',
        backgroundColor: 'rgba(239, 68, 68, 0.15)',
        tension: 0.4,
        fill: true
    }];
    charts.expensesEvolution.update();
}

// Gráfica de préstamos pendientes
function updateLoansOutstandingChart() {
    if (!charts.loansPending) return;
    
    const period = getSelectedPeriod('loansPending');
    const loanFilter = document.querySelector('.chart-loan-filter[data-chart="loansPending"]');
    const selectedLoan = loanFilter ? loanFilter.value : 'all';
    
    let filteredLoans = loans.filter(loan => loan.type === 'debt'); // Solo deudas
    if (selectedLoan !== 'all') {
        filteredLoans = filteredLoans.filter(loan => (loan._id || loan.id) === selectedLoan);
    }
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const months = [];
    const outstandingData = [];
    
    if (filteredLoans.length === 0) {
        charts.loansPending.data.labels = [];
        charts.loansPending.data.datasets = [];
        charts.loansPending.update();
        return;
    }
    
    // Calcular préstamos pendientes por mes
    // Si period es 999 (all), usar 30 años (360 meses)
    let periodMonths = period === 999 ? 360 : period;
    // Limitar a máximo 30 años (360 meses) para evitar cálculos excesivos
    periodMonths = Math.min(periodMonths, 360);
    
    // Calcular desde el pasado hasta el futuro
    // Dividir el período: algunos meses pasados y el resto hacia el futuro
    const pastMonths = Math.min(12, Math.floor(periodMonths / 4)); // Últimos 12 meses como máximo, o 1/4 del período
    const futureMonths = periodMonths - pastMonths; // Resto hacia el futuro
    
    // Meses pasados (desde el pasado hasta hoy)
    for (let i = pastMonths - 1; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        date.setHours(23, 59, 59, 999);
        const monthKey = date.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
        months.push(monthKey);
        
        let totalOutstanding = 0;
        filteredLoans.forEach(loan => {
            const loanDate = new Date(loan.start_date);
            loanDate.setHours(0, 0, 0, 0);
            if (loanDate <= date) {
                const amortization = calculateAmortizationTable(
                    loan.principal,
                    loan.interest_rate,
                    loan.monthly_payment,
                    loan.start_date,
                    0,
                    loan.early_payments ? loan.early_payments.filter(ep => {
                        const epDate = new Date(ep.date);
                        epDate.setHours(0, 0, 0, 0);
                        return epDate <= date;
                    }) : [],
                    date
                );
                totalOutstanding += Math.max(0, amortization.finalBalance);
            } else {
                totalOutstanding += loan.principal;
            }
        });
        
        outstandingData.push(totalOutstanding);
    }
    
    // Meses futuros (desde hoy hacia el futuro)
    for (let i = 1; i <= futureMonths; i++) {
        const date = new Date(now.getFullYear(), now.getMonth() + i, 1);
        date.setHours(23, 59, 59, 999);
        const monthKey = date.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
        months.push(monthKey);
        
        let totalOutstanding = 0;
        filteredLoans.forEach(loan => {
            const loanDate = new Date(loan.start_date);
            loanDate.setHours(0, 0, 0, 0);
            const loanEndDate = new Date(loan.end_date);
            loanEndDate.setHours(23, 59, 59, 999);
            
            if (loanDate <= date && date <= loanEndDate) {
                // Calcular amortización proyectada hasta esa fecha futura
                const amortization = calculateAmortizationTable(
                    loan.principal,
                    loan.interest_rate,
                    loan.monthly_payment,
                    loan.start_date,
                    0,
                    loan.early_payments || [],
                    date
                );
                totalOutstanding += Math.max(0, amortization.finalBalance);
            } else if (date > loanEndDate) {
                // Si la fecha futura es después del fin del préstamo, no hay deuda pendiente
                totalOutstanding += 0;
            } else if (loanDate > date) {
                // Si el préstamo aún no ha comenzado, el pendiente es el principal completo
                totalOutstanding += loan.principal;
            }
        });
        
        outstandingData.push(totalOutstanding);
    }
    
    charts.loansPending.data.labels = months;
    charts.loansPending.data.datasets = [{
        label: 'Préstamos Pendientes',
        data: outstandingData,
        borderColor: '#F59E0B',
        backgroundColor: 'rgba(245, 158, 11, 0.15)',
        tension: 0.4,
        fill: true
    }];
    charts.loansPending.update();
}

// Gráfica de evolución del patrimonio
function updateAssetsEvolutionChart() {
    if (!charts.assetsEvolution) return;
    
    const period = getSelectedPeriod('assetsEvolution');
    const assetFilter = document.querySelector('.chart-asset-filter[data-chart="assetsEvolution"]');
    const selectedAsset = assetFilter ? assetFilter.value : 'all';
    
    let filteredPatrimonio = patrimonio;
    if (selectedAsset !== 'all') {
        filteredPatrimonio = patrimonio.filter(prop => (prop._id || prop.id) === selectedAsset);
    }
    const now = new Date();
    const months = [];
    const patrimonioData = [];
    
    if (filteredPatrimonio.length === 0) {
        charts.assetsEvolution.data.labels = [];
        charts.assetsEvolution.data.datasets = [];
        charts.assetsEvolution.update();
        return;
    }
    
    const periodMonths = period === 999 ? 12 : period;
    
    for (let i = periodMonths - 1; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        date.setHours(23, 59, 59, 999); // Fin del mes
        const monthKey = date.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
        months.push(monthKey);
        
        // Calcular patrimonio total en ese mes
        let totalPatrimonio = 0;
        filteredPatrimonio.forEach(prop => {
            const purchaseDate = prop.purchase_date ? new Date(prop.purchase_date) : null;
            if (!purchaseDate || purchaseDate <= date) {
                // Si la propiedad fue comprada antes o en ese mes, calcular su valor
                let propValue = prop.purchase_price || 0; // Valor inicial
                
                // Si hay historial de valores, buscar el más cercano a esa fecha
                if (prop.value_history && prop.value_history.length > 0) {
                    // Filtrar valores históricos hasta esa fecha
                    const historicalValues = prop.value_history
                        .filter(v => {
                            const vDate = new Date(v.date);
                            return vDate <= date;
                        })
                        .sort((a, b) => new Date(b.date) - new Date(a.date)); // Más reciente primero
                    
                    if (historicalValues.length > 0) {
                        // Usar el valor histórico más reciente hasta esa fecha
                        propValue = historicalValues[0].value || prop.purchase_price || 0;
                    } else {
                        // Si no hay valores históricos antes de esa fecha, usar el precio de compra
                        propValue = prop.purchase_price || 0;
                    }
                } else {
                    // Si no hay historial, usar el valor actual (asumiendo que es el valor en ese momento)
                    // O mejor, interpolar entre purchase_price y current_value basado en el tiempo
                    if (prop.current_value && prop.purchase_price && purchaseDate) {
                        const daysSincePurchase = (date - purchaseDate) / (1000 * 60 * 60 * 24);
                        const totalDays = (new Date() - purchaseDate) / (1000 * 60 * 60 * 24);
                        if (totalDays > 0) {
                            // Interpolación lineal simple
                            const progress = Math.min(1, daysSincePurchase / totalDays);
                            propValue = prop.purchase_price + (prop.current_value - prop.purchase_price) * progress;
                        } else {
                            propValue = prop.purchase_price;
                        }
                    } else {
                        propValue = prop.current_value || prop.purchase_price || 0;
                    }
                }
                
                totalPatrimonio += propValue;
            }
        });
        
        patrimonioData.push(totalPatrimonio);
    }
    
    charts.assetsEvolution.data.labels = months;
    charts.assetsEvolution.data.datasets = [{
        label: 'Patrimonio Total',
        data: patrimonioData,
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.15)',
        tension: 0.4,
        fill: true
    }];
    charts.assetsEvolution.update();
}

// Gráfica de evolución de saldo en cuentas
function updateAccountsBalanceChart() {
    if (!charts.accountsBalance) return;
    
    const period = getSelectedPeriod('accountsBalance');
    const accountFilter = document.querySelector('.chart-account-filter[data-chart="accountsBalance"]');
    const selectedAccount = accountFilter ? accountFilter.value : 'all';
    
    let filteredAccounts = accounts;
    if (selectedAccount !== 'all') {
        filteredAccounts = accounts.filter(account => (account._id || account.id) === selectedAccount);
    }
    
    const now = new Date();
    const months = [];
    const balanceData = [];
    
    if (filteredAccounts.length === 0) {
        charts.accountsBalance.data.labels = [];
        charts.accountsBalance.data.datasets = [];
        charts.accountsBalance.update();
        return;
    }
    
    const periodTransactions = getTransactionsByPeriod('accountsBalance');
    const periodMonths = period === 999 ? 12 : period;
    
    for (let i = periodMonths - 1; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthKey = date.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
        months.push(monthKey);
        
        // Calcular saldo total de cuentas en ese mes
        let totalBalance = 0;
        filteredAccounts.forEach(account => {
            // Saldo inicial de la cuenta
            let accountBalance = account.balance || 0;
            
            // Sumar transacciones hasta esa fecha
            const accountTransactions = periodTransactions.filter(t => {
                const tDate = new Date(t.date);
                return tDate <= date && t.account_id === account._id;
            });
            
            accountTransactions.forEach(t => {
                if (t.type === 'income') {
                    accountBalance += t.amount;
                } else if (t.type === 'expense') {
                    accountBalance -= Math.abs(t.amount);
                }
            });
            
            totalBalance += accountBalance;
        });
        
        balanceData.push(totalBalance);
    }
    
    charts.accountsBalance.data.labels = months;
    charts.accountsBalance.data.datasets = [{
        label: 'Saldo Total',
        data: balanceData,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true
    }];
    charts.accountsBalance.update();
}

// Modal de gráfico detallado - FUNCIÓN SIMPLE Y DIRECTA
let chartModalChart = null;

function openChartModal(chartType, title) {
    const modal = document.getElementById('chartModal');
    const modalTitle = document.getElementById('chartModalTitle');
    const modalContent = document.getElementById('chartModalControls');
    const modalCanvasContainer = document.querySelector('.chart-modal-canvas-container');
    
    if (!modal || !modalTitle) return;
    
    // Obtener el gráfico original
    const originalChart = charts[chartType];
    if (!originalChart || !originalChart.data) {
        console.error('Gráfico no encontrado:', chartType);
        return;
    }
    
    // Establecer título y abrir modal
    currentChartType = chartType;
    modalTitle.textContent = title;
    modal.style.display = 'flex';
    
    // Limpiar gráfico anterior
    if (chartModalChart) {
        chartModalChart.destroy();
        chartModalChart = null;
    }
    
    // Crear controles en el modal
    if (modalContent) {
        modalContent.innerHTML = '';
        
        // Obtener el período actual del gráfico original
        const originalPeriodSelect = document.querySelector(`.chart-period-select[data-chart="${chartType}"]`);
        const currentPeriod = originalPeriodSelect ? originalPeriodSelect.value : '6';
        
        // Crear selector de período
        const periodDiv = document.createElement('div');
        periodDiv.style.display = 'flex';
        periodDiv.style.flexDirection = 'column';
        periodDiv.style.gap = '8px';
        
        const periodLabel = document.createElement('label');
        periodLabel.textContent = 'Período:';
        periodLabel.style.fontWeight = '600';
        periodLabel.style.fontSize = '14px';
        periodLabel.style.color = 'var(--text-primary)';
        
        const periodSelect = document.createElement('select');
        periodSelect.id = 'modalChartPeriod';
        periodSelect.className = 'chart-period-select';
        periodSelect.style.padding = '8px 12px';
        periodSelect.style.border = '1.5px solid var(--border-color)';
        periodSelect.style.borderRadius = '8px';
        periodSelect.style.fontSize = '14px';
        periodSelect.style.background = 'var(--bg-primary)';
        periodSelect.style.color = 'var(--text-primary)';
        periodSelect.style.cursor = 'pointer';
        
        const periodOptions = [
            { value: '1', text: '1 mes' },
            { value: '3', text: '3 meses' },
            { value: '6', text: '6 meses' },
            { value: '12', text: '12 meses' },
            { value: 'all', text: 'Todo' }
        ];
        
        periodOptions.forEach(opt => {
            const option = document.createElement('option');
            option.value = opt.value;
            option.textContent = opt.text;
            if (opt.value === currentPeriod) option.selected = true;
            periodSelect.appendChild(option);
        });
        
        periodDiv.appendChild(periodLabel);
        periodDiv.appendChild(periodSelect);
        modalContent.appendChild(periodDiv);
        
        // Crear selector de categoría si el gráfico lo soporta
        const categoryCharts = ['incomeEvolution', 'expensesEvolution'];
        if (categoryCharts.includes(chartType)) {
            const categoryDiv = document.createElement('div');
            categoryDiv.style.display = 'flex';
            categoryDiv.style.flexDirection = 'column';
            categoryDiv.style.gap = '8px';
            
            const categoryLabel = document.createElement('label');
            categoryLabel.textContent = 'Categoría:';
            categoryLabel.style.fontWeight = '600';
            categoryLabel.style.fontSize = '14px';
            categoryLabel.style.color = 'var(--text-primary)';
            
            const categorySelect = document.createElement('select');
            categorySelect.id = 'modalChartCategoryFilter';
            categorySelect.className = 'chart-category-filter';
            categorySelect.style.padding = '8px 12px';
            categorySelect.style.border = '1.5px solid var(--border-color)';
            categorySelect.style.borderRadius = '8px';
            categorySelect.style.fontSize = '14px';
            categorySelect.style.background = 'var(--bg-primary)';
            categorySelect.style.color = 'var(--text-primary)';
            categorySelect.style.cursor = 'pointer';
            
            // Obtener categorías según el tipo de gráfico
            const isIncome = chartType === 'incomeEvolution';
            const chartCategories = isIncome ? categories.income : categories.expense;
            
            const allOption = document.createElement('option');
            allOption.value = 'all';
            allOption.textContent = 'Todas las categorías';
            categorySelect.appendChild(allOption);
            
            chartCategories.forEach(cat => {
                const option = document.createElement('option');
                option.value = cat.id;
                option.textContent = cat.name;
                categorySelect.appendChild(option);
            });
            
            // Obtener el valor actual del gráfico original
            const originalCategorySelect = document.querySelector(`.chart-category-filter[data-chart="${chartType}"]`);
            if (originalCategorySelect) {
                categorySelect.value = originalCategorySelect.value || 'all';
            }
            
            categoryDiv.appendChild(categoryLabel);
            categoryDiv.appendChild(categorySelect);
            modalContent.appendChild(categoryDiv);
            
            // Event listener para categoría
            categorySelect.addEventListener('change', () => {
                updateModalChart(chartType);
            });
        }
        
        // Event listener para período
        periodSelect.addEventListener('change', () => {
            updateModalChart(chartType);
        });
    }
    
    // Asegurar que el contenedor del canvas exista y tenga dimensiones
    if (modalCanvasContainer) {
        modalCanvasContainer.style.width = '100%';
    }
    
    const modalCanvas = document.getElementById('chartModalCanvas');
    if (!modalCanvas) {
        console.error('Canvas no encontrado');
        return;
    }
    
    // Crear gráfico inicial
    updateModalChart(chartType);
}

// Función para actualizar el gráfico del modal
function updateModalChart(chartType) {
    const modalCanvas = document.getElementById('chartModalCanvas');
    if (!modalCanvas) return;
    
    // Obtener valores de los controles del modal
    const modalPeriodSelect = document.getElementById('modalChartPeriod');
    const modalCategorySelect = document.getElementById('modalChartCategoryFilter');
    
    if (!modalPeriodSelect) return;
    
    // Obtener período seleccionado en el modal
    const modalPeriod = modalPeriodSelect.value === 'all' ? 999 : parseInt(modalPeriodSelect.value) || 6;
    const modalCategory = modalCategorySelect ? modalCategorySelect.value : 'all';
    
    // Obtener transacciones filtradas según el período del modal
    const now = new Date();
    let periodTransactions = [];
    
    if (modalPeriod === 999) {
        periodTransactions = [...transactions];
    } else {
        const startDate = new Date(now.getFullYear(), now.getMonth() - modalPeriod, 1);
        periodTransactions = transactions.filter(t => {
            const tDate = new Date(t.date);
            return tDate >= startDate;
        });
    }
    
    // Filtrar por categoría si está seleccionada
    if (modalCategory !== 'all' && (chartType === 'incomeEvolution' || chartType === 'expensesEvolution')) {
        periodTransactions = periodTransactions.filter(t => t.categoryGeneral === modalCategory);
    }
    
    // Obtener el gráfico original para copiar su estructura
    const originalChart = charts[chartType];
    if (!originalChart) return;
    
    // Destruir gráfico del modal anterior
    if (chartModalChart) {
        chartModalChart.destroy();
        chartModalChart = null;
    }
    
    // Generar datos según el tipo de gráfico
    let chartData = { labels: [], datasets: [] };
    let chartOptions = JSON.parse(JSON.stringify(originalChart.options || {}));
    
    // Llamar a función específica para generar datos según el tipo
    if (chartType === 'incomeEvolution' || chartType === 'expensesEvolution') {
        chartData = generateEvolutionChartData(chartType, periodTransactions, modalPeriod);
    } else {
        // Para otros tipos de gráficos, usar la lógica existente pero con datos filtrados
        // Por ahora, clonar los datos del original y actualizar con los filtros
        chartData = JSON.parse(JSON.stringify(originalChart.data));
    }
    
    // Crear nuevo gráfico en el modal
    setTimeout(() => {
        try {
            chartModalChart = new Chart(modalCanvas, {
                type: originalChart.config.type,
                data: chartData,
                options: {
                    ...chartOptions,
                    responsive: true,
                    maintainAspectRatio: true,
                    aspectRatio: 2,
                    plugins: {
                        ...chartOptions.plugins,
                        legend: {
                            display: true,
                            position: 'top',
                            labels: {
                                font: { size: 14 },
                                padding: 15
                            }
                        }
                    },
                    scales: chartOptions.scales ? {
                        ...chartOptions.scales,
                        x: chartOptions.scales.x ? {
                            ...chartOptions.scales.x,
                            ticks: {
                                ...chartOptions.scales.x.ticks,
                                maxRotation: 45,
                                minRotation: 0
                            }
                        } : undefined,
                        y: chartOptions.scales.y ? {
                            ...chartOptions.scales.y
                        } : undefined
                    } : undefined
                }
            });
        } catch (error) {
            console.error('Error al crear gráfico:', error);
        }
    }, 100);
}

// Función auxiliar para generar datos de gráficos de evolución
function generateEvolutionChartData(chartType, periodTransactions, period) {
    const isIncome = chartType === 'incomeEvolution';
    const now = new Date();
    const months = [];
    
    if (periodTransactions.length === 0) {
        return { labels: [], datasets: [] };
    }
    
    // Generar meses
    if (period === 999) {
        const firstDate = new Date(Math.min(...periodTransactions.map(t => new Date(t.date))));
        let currentMonth = firstDate.getMonth();
        let currentYear = firstDate.getFullYear();
        const endMonth = now.getMonth();
        const endYear = now.getFullYear();
        
        while (currentYear < endYear || (currentYear === endYear && currentMonth <= endMonth)) {
            const date = new Date(currentYear, currentMonth, 1);
            const monthKey = date.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
            months.push(monthKey);
            currentMonth++;
            if (currentMonth > 11) {
                currentMonth = 0;
                currentYear++;
            }
        }
    } else {
        for (let i = period - 1; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthKey = date.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
            months.push(monthKey);
        }
    }
    
    // Obtener todas las categorías únicas
    const chartCategories = {};
    periodTransactions.filter(t => t.type === (isIncome ? 'income' : 'expense')).forEach(t => {
        let catName;
        const catList = isIncome ? categories.income : categories.expense;
        const cat = catList.find(c => c.id === t.categoryGeneral);
        if (cat) {
            catName = cat.name;
        } else {
            catName = t.categoryGeneral;
        }
        if (!chartCategories[catName]) {
            chartCategories[catName] = [];
        }
    });
    
    // Agrupar transacciones por mes y categoría
    months.forEach(monthKey => {
        const [monthName, year] = monthKey.split(' ');
        const monthIndex = new Date(`${monthName} 1, ${year}`).getMonth();
        const yearNum = parseInt(year);
        
        Object.keys(chartCategories).forEach(catName => {
            const monthTotal = periodTransactions
                .filter(t => {
                    const tDate = new Date(t.date);
                    return tDate.getMonth() === monthIndex &&
                           tDate.getFullYear() === yearNum &&
                           t.type === (isIncome ? 'income' : 'expense') &&
                           (() => {
                               const catList = isIncome ? categories.income : categories.expense;
                               const cat = catList.find(c => c.id === t.categoryGeneral);
                               const name = cat ? cat.name : t.categoryGeneral;
                               return name === catName;
                           })();
                })
                .reduce((sum, t) => sum + Math.abs(t.amount), 0);
            
            chartCategories[catName].push(monthTotal);
        });
    });
    
    // Crear datasets
    const datasets = Object.keys(chartCategories).map((catName, index) => {
        const colors = [
            'rgba(59, 130, 246, 0.8)',     // Azul
            'rgba(16, 185, 129, 0.8)',     // Verde
            'rgba(245, 158, 11, 0.8)',     // Amarillo
            'rgba(239, 68, 68, 0.8)',      // Rojo
            'rgba(139, 92, 246, 0.8)',     // Púrpura
            'rgba(6, 182, 212, 0.8)',      // Cyan
            'rgba(132, 204, 22, 0.8)',     // Verde lima
            'rgba(249, 115, 22, 0.8)'      // Naranja
        ];
        
        return {
            label: catName,
            data: chartCategories[catName],
            borderColor: colors[index % colors.length],
            backgroundColor: colors[index % colors.length].replace('0.8', '0.2'),
            borderWidth: 2,
            fill: true
        };
    });
    
    return {
        labels: months,
        datasets: datasets
    };
}

function closeChartModal() {
    const modal = document.getElementById('chartModal');
    if (modal) {
        modal.style.display = 'none';
    }
    if (chartModalChart) {
        chartModalChart.destroy();
        chartModalChart = null;
    }
    currentChartType = null;
}

// Exponer funciones globalmente INMEDIATAMENTE después de definir openChartModal
// Esto es crítico para que el stub pueda encontrar la función real
// Usar IIFE para ejecutar inmediatamente
(function() {
    try {
        if (typeof openChartModal === 'function') {
            window._openChartModalReal = openChartModal;
            window.openChartModal = openChartModal;
            console.log('✅ openChartModal expuesta INMEDIATAMENTE después de su definición');
        } else {
            console.error('❌ openChartModal no está definida como función');
        }
        if (typeof closeChartModal === 'function') {
            window.closeChartModal = closeChartModal;
        }
    } catch (error) {
        console.error('❌ Error al exponer openChartModal:', error);
    }
})();


// Actualizar análisis del mes seleccionado
function updateMonthDashboard() {
    const dashboardMonthInput = document.getElementById('dashboardMonth');
    const monthDashboard = document.getElementById('monthDashboard');
    const monthAnalysisSelector = document.getElementById('monthAnalysisSelector');
    
    if (!dashboardMonthInput || !monthDashboard) return;
    
    const selectedMonth = dashboardMonthInput.value;
    if (!selectedMonth) {
        monthDashboard.style.display = 'none';
        if (monthAnalysisSelector) {
            monthAnalysisSelector.style.display = 'none';
        }
        return;
    }
    
    monthDashboard.style.display = 'block';
    if (monthAnalysisSelector) {
        monthAnalysisSelector.style.display = 'block';
    }
    
    const [year, month] = selectedMonth.split('-').map(Number);
    const monthIndex = month - 1;
    
    // Filtrar transacciones del mes seleccionado
    const monthTransactions = transactions.filter(t => {
        const tDate = new Date(t.date);
        return tDate.getMonth() === monthIndex && tDate.getFullYear() === year;
    });
    
    const monthExpenses = monthTransactions.filter(t => t.type === 'expense');
    const monthIncome = monthTransactions.filter(t => t.type === 'income');
    
    // Gastos por categoría
    const expensesByCategory = {};
    monthExpenses.forEach(t => {
        const catId = t.categoryGeneral;
        if (!expensesByCategory[catId]) {
            expensesByCategory[catId] = { amount: 0, transactions: [] };
        }
        expensesByCategory[catId].amount += Math.abs(t.amount);
        expensesByCategory[catId].transactions.push(t);
    });
    
    const expensesContainer = document.getElementById('monthExpensesByCategory');
    if (expensesContainer) {
        expensesContainer.innerHTML = '';
        
        if (Object.keys(expensesByCategory).length === 0) {
            expensesContainer.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--gray-500);">No hay gastos registrados para este mes</div>';
        } else {
            Object.entries(expensesByCategory).forEach(([catId, data]) => {
                const category = categories.expense.find(c => c.id === catId);
                const categoryName = category ? category.name : catId;
                
                // Buscar presupuesto para esta categoría en este mes
                const budget = budgets.find(b => b.period_type === 'monthly' && b.period_value === selectedMonth && b.category_id === catId);
                const budgetAmount = budget ? budget.amount : 0;
                const percentage = budgetAmount > 0 ? (data.amount / budgetAmount) * 100 : 0;
                
                let progressColor = '#10b981'; // Verde
                if (percentage > 80 && percentage <= 100) {
                    progressColor = '#fbbf24'; // Amarillo
                } else if (percentage > 100) {
                    progressColor = '#ef4444'; // Rojo
                }
                
                const card = document.createElement('div');
                card.style.cssText = 'background: var(--bg-primary); padding: 20px; border-radius: var(--radius); border: 1px solid var(--border-color); box-shadow: var(--shadow-light); cursor: pointer; transition: all 0.2s; color: var(--text-primary);';
                card.onmouseover = function() {
                    this.style.transform = 'translateY(-2px)';
                    this.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.12)';
                    this.style.borderColor = 'var(--primary)';
                };
                card.onmouseout = function() {
                    this.style.transform = 'translateY(0)';
                    this.style.boxShadow = 'var(--shadow-light)';
                    this.style.borderColor = 'var(--border-color)';
                };
                card.onclick = () => showCategoryDetails(categoryName, data.transactions, 'expense', selectedMonth, catId, budgetAmount);
                card.innerHTML = `
                    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 12px;">
                        <div>
                            <h5 style="font-size: 16px; font-weight: 700; margin: 0 0 4px 0; color: var(--text-primary);">${categoryName}</h5>
                            <p style="font-size: 14px; color: var(--text-secondary); margin: 0;">${data.transactions.length} ${data.transactions.length !== 1 ? 'transacciones' : 'transacción'}</p>
                        </div>
                        <div style="text-align: right;">
                            <p style="font-size: 20px; font-weight: 700; margin: 0; color: var(--danger-color);">${formatCurrency(data.amount)}</p>
                            ${budgetAmount > 0 ? `<small style="color: var(--text-tertiary);">de ${formatCurrency(budgetAmount)}</small>` : ''}
                        </div>
                    </div>
                    ${budgetAmount > 0 ? `
                        <div style="margin-top: 12px;">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                                <small style="font-size: 12px; color: var(--text-secondary);">Progreso del presupuesto</small>
                                <small style="font-size: 12px; font-weight: 600; color: ${progressColor};">${percentage.toFixed(1)}%</small>
                            </div>
                            <div style="display: flex; justify-content: space-between; margin-top: 4px;">
                                <small style="font-size: 11px; color: var(--text-tertiary);">Restante: ${formatCurrency(Math.max(0, budgetAmount - data.amount))}</small>
                                ${percentage > 100 ? `<small style="font-size: 11px; color: var(--danger-color); font-weight: 600;">Excedido</small>` : ''}
                            </div>
                        </div>
                    ` : '<small style="color: var(--text-tertiary);">Sin presupuesto establecido</small>'}
                `;
                expensesContainer.appendChild(card);
            });
        }
    }
    
    // Ingresos por categoría
    const incomeByCategory = {};
    monthIncome.forEach(t => {
        const catId = t.categoryGeneral;
        if (!incomeByCategory[catId]) {
            incomeByCategory[catId] = { amount: 0, transactions: [] };
        }
        incomeByCategory[catId].amount += t.amount;
        incomeByCategory[catId].transactions.push(t);
    });
    
    const incomeContainer = document.getElementById('monthIncomeByCategory');
    if (incomeContainer) {
        incomeContainer.innerHTML = '';
        
        if (Object.keys(incomeByCategory).length === 0) {
            incomeContainer.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--gray-500);">No hay ingresos registrados para este mes</div>';
        } else {
            Object.entries(incomeByCategory).forEach(([catId, data]) => {
                const category = categories.income.find(c => c.id === catId);
                const categoryName = category ? category.name : catId;
                
                // Buscar presupuesto para esta categoría en este mes
                const budget = budgets.find(b => b.period_type === 'monthly' && b.period_value === selectedMonth && b.category_id === catId);
                const budgetAmount = budget ? budget.amount : 0;
                const percentage = budgetAmount > 0 ? (data.amount / budgetAmount) * 100 : 0;
                
                let progressColor = '#10b981'; // Verde
                if (percentage < 80) {
                    progressColor = '#fbbf24'; // Amarillo
                } else if (percentage < 100) {
                    progressColor = '#10b981'; // Verde
                }
                
                const card = document.createElement('div');
                card.style.cssText = 'background: var(--bg-primary); padding: 20px; border-radius: var(--radius); border: 1px solid var(--border-color); box-shadow: var(--shadow-light); cursor: pointer; transition: all 0.2s; color: var(--text-primary);';
                card.onmouseover = function() {
                    this.style.transform = 'translateY(-2px)';
                    this.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.12)';
                    this.style.borderColor = 'var(--primary)';
                };
                card.onmouseout = function() {
                    this.style.transform = 'translateY(0)';
                    this.style.boxShadow = 'var(--shadow-light)';
                    this.style.borderColor = 'var(--border-color)';
                };
                card.onclick = () => showCategoryDetails(categoryName, data.transactions, 'income', selectedMonth, catId, budgetAmount);
                card.innerHTML = `
                    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 12px;">
                        <div>
                            <h5 style="font-size: 16px; font-weight: 700; margin: 0 0 4px 0; color: var(--text-primary);">${categoryName}</h5>
                            <p style="font-size: 14px; color: var(--text-secondary); margin: 0;">${data.transactions.length} ${data.transactions.length !== 1 ? 'transacciones' : 'transacción'}</p>
                        </div>
                        <div style="text-align: right;">
                            <p style="font-size: 20px; font-weight: 700; margin: 0; color: var(--success);">${formatCurrency(data.amount)}</p>
                            ${budgetAmount > 0 ? `<small style="color: var(--text-tertiary);">de ${formatCurrency(budgetAmount)}</small>` : ''}
                        </div>
                    </div>
                    ${budgetAmount > 0 ? `
                        <div style="margin-top: 12px;">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                                <small style="font-size: 12px; color: var(--text-secondary);">Progreso del presupuesto</small>
                                <small style="font-size: 12px; font-weight: 600; color: ${progressColor};">${percentage.toFixed(1)}%</small>
                            </div>
                            <div style="display: flex; justify-content: space-between; margin-top: 4px;">
                                <small style="font-size: 11px; color: var(--text-tertiary);">Diferencia: ${formatCurrency(data.amount - budgetAmount)}</small>
                                ${percentage < 100 ? `<small style="font-size: 11px; color: var(--warning); font-weight: 600; background: var(--bg-secondary); padding: 2px 6px; border-radius: 4px; border: 1px solid var(--warning);">Por debajo del presupuesto</small>` : ''}
                            </div>
                            </div>
                    ` : '<small style="color: var(--text-tertiary);">Sin presupuesto establecido</small>'}
                `;
                incomeContainer.appendChild(card);
            });
        }
    }
    
    // Estado de presupuestos del mes (ingresos y gastos)
    const monthBudgets = budgets.filter(b => b.period_type === 'monthly' && b.period_value === selectedMonth);
    const budgetsStatusContainer = document.getElementById('monthBudgetsStatus');
    if (budgetsStatusContainer) {
        budgetsStatusContainer.innerHTML = '';
        
        if (monthBudgets.length === 0) {
            budgetsStatusContainer.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--gray-500);">No hay presupuestos establecidos para este mes</div>';
        } else {
            // Separar presupuestos de ingresos y gastos
            const incomeBudgets = [];
            const expenseBudgets = [];
            
            monthBudgets.forEach(budget => {
                // Determinar si es ingreso o gasto
                let category = categories.expense.find(c => c.id === budget.category_id);
                if (category) {
                    expenseBudgets.push({ budget, category, isIncome: false });
                } else {
                    category = categories.income.find(c => c.id === budget.category_id);
                    if (category) {
                        incomeBudgets.push({ budget, category, isIncome: true });
                    }
                }
            });
            
            // Mostrar resumen general primero
            const totalIncomeBudget = incomeBudgets.reduce((sum, b) => sum + b.budget.amount, 0);
            const totalExpenseBudget = expenseBudgets.reduce((sum, b) => sum + b.budget.amount, 0);
            const totalIncomeActual = monthIncome.reduce((sum, t) => sum + t.amount, 0);
            const totalExpenseActual = monthExpenses.reduce((sum, t) => sum + Math.abs(t.amount), 0);
            
            if (totalIncomeBudget > 0 || totalExpenseBudget > 0) {
                const summaryCard = document.createElement('div');
                summaryCard.style.cssText = 'background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%); padding: 24px; border-radius: var(--radius); border: none; box-shadow: var(--shadow-light); color: white; grid-column: 1/-1; cursor: pointer; transition: all 0.2s;';
                summaryCard.onmouseover = function() {
                    this.style.transform = 'translateY(-2px)';
                    this.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.15)';
                };
                summaryCard.onmouseout = function() {
                    this.style.transform = 'translateY(0)';
                    this.style.boxShadow = 'var(--shadow-light)';
                };
                summaryCard.onclick = () => switchToTab('envelopes', true);
                summaryCard.innerHTML = `
                    <h5 style="font-size: 18px; font-weight: 700; margin: 0 0 20px 0; color: white;">Resumen del Mes</h5>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px;">
                        <div>
                            <div style="font-size: 12px; opacity: 0.9; margin-bottom: 6px;">Presupuesto Ingresos</div>
                            <div style="font-size: 24px; font-weight: 700;">${formatCurrency(totalIncomeBudget)}</div>
                            <div style="font-size: 14px; margin-top: 4px; opacity: 0.8;">Real: ${formatCurrency(totalIncomeActual)}</div>
                            <div style="font-size: 12px; margin-top: 4px; color: ${totalIncomeActual >= totalIncomeBudget ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.7)'};">
                                ${totalIncomeBudget > 0 ? ((totalIncomeActual / totalIncomeBudget) * 100).toFixed(1) + '%' : '-'}
                            </div>
                        </div>
                        <div>
                            <div style="font-size: 12px; opacity: 0.9; margin-bottom: 6px;">Presupuesto Gastos</div>
                            <div style="font-size: 24px; font-weight: 700;">${formatCurrency(totalExpenseBudget)}</div>
                            <div style="font-size: 14px; margin-top: 4px; opacity: 0.8;">Real: ${formatCurrency(totalExpenseActual)}</div>
                            <div style="font-size: 12px; margin-top: 4px; color: ${totalExpenseActual <= totalExpenseBudget ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.7)'};">
                                ${totalExpenseBudget > 0 ? ((totalExpenseActual / totalExpenseBudget) * 100).toFixed(1) + '%' : '-'}
                            </div>
                        </div>
                        <div>
                            <div style="font-size: 12px; opacity: 0.9; margin-bottom: 6px;">Ahorro Previsto</div>
                            <div style="font-size: 24px; font-weight: 700;">${formatCurrency(totalIncomeBudget - totalExpenseBudget)}</div>
                            <div style="font-size: 14px; margin-top: 4px; opacity: 0.8;">Real: ${formatCurrency(totalIncomeActual - totalExpenseActual)}</div>
                        </div>
                    </div>
                `;
                budgetsStatusContainer.appendChild(summaryCard);
            }
            
            // Mostrar presupuestos de ingresos
            incomeBudgets.forEach(({ budget, category, isIncome }) => {
                const categoryIncome = monthIncome.filter(t => t.categoryGeneral === budget.category_id);
                const actual = categoryIncome.reduce((sum, t) => sum + t.amount, 0);
                const difference = actual - budget.amount;
                const percentage = budget.amount > 0 ? (actual / budget.amount) * 100 : 0;
                const isUnderBudget = actual < budget.amount;
                
                let progressColor = '#10b981';
                if (percentage < 80) {
                    progressColor = '#fbbf24';
                } else if (percentage < 100) {
                    progressColor = '#10b981';
                }
                
                const card = document.createElement('div');
                card.style.cssText = 'background: var(--bg-primary); padding: 20px; border-radius: var(--radius); border: 1px solid var(--border-color); box-shadow: var(--shadow-light); border-left: 4px solid var(--success); color: var(--text-primary); cursor: pointer; transition: all 0.2s;';
                card.onmouseover = function() {
                    this.style.transform = 'translateY(-2px)';
                    this.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.12)';
                    this.style.borderColor = 'var(--primary)';
                };
                card.onmouseout = function() {
                    this.style.transform = 'translateY(0)';
                    this.style.boxShadow = 'var(--shadow-light)';
                    this.style.borderColor = 'var(--border-color)';
                };
                card.onclick = () => showCategoryDetails(category.name, categoryIncome, 'income', selectedMonth, budget.category_id, budget.amount);
                card.innerHTML = `
                    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 12px;">
                        <h5 style="font-size: 16px; font-weight: 700; margin: 0; color: var(--gray-900);">${category.name}</h5>
                        <span style="font-size: 11px; padding: 4px 8px; background: var(--success-light); border-radius: var(--radius); color: var(--success-dark); font-weight: 600;">Ingreso</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                        <span style="font-size: 14px; color: var(--gray-600);">Presupuesto:</span>
                        <span style="font-size: 14px; font-weight: 600; color: var(--gray-900);">${formatCurrency(budget.amount)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                        <span style="font-size: 14px; color: var(--gray-600);">Ingresado:</span>
                        <span style="font-size: 14px; font-weight: 600; color: var(--success);">${formatCurrency(actual)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                        <span style="font-size: 14px; color: var(--gray-600);">Diferencia:</span>
                        <span style="font-size: 14px; font-weight: 600; color: ${difference >= 0 ? 'var(--success)' : 'var(--warning)'};">${formatCurrency(Math.abs(difference))}</span>
                    </div>
                    <div style="background: var(--gray-200); border-radius: 4px; height: 8px; overflow: hidden; margin-bottom: 4px;">
                        <div style="background: ${progressColor}; height: 100%; width: ${Math.min(percentage, 100)}%; transition: width 0.3s;"></div>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <small style="font-size: 11px; color: var(--gray-500);">${categoryIncome.length} transacciones</small>
                        <small style="font-size: 11px; font-weight: 600; color: ${progressColor};">${percentage.toFixed(1)}%</small>
                    </div>
                    ${isUnderBudget ? '<div style="margin-top: 8px; padding: 6px; background: var(--bg-secondary); border: 1px solid var(--warning); border-radius: var(--radius); color: var(--warning); font-size: 11px; font-weight: 600;">Por debajo del presupuesto</div>' : ''}
                `;
                budgetsStatusContainer.appendChild(card);
            });
            
            // Mostrar presupuestos de gastos
            expenseBudgets.forEach(({ budget, category, isIncome }) => {
                const categoryExpenses = monthExpenses.filter(t => t.categoryGeneral === budget.category_id);
                const spent = categoryExpenses.reduce((sum, t) => sum + Math.abs(t.amount), 0);
                const remaining = budget.amount - spent;
                const percentage = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;
                const isOverBudget = spent > budget.amount;
                
                let progressColor = '#10b981';
                if (percentage > 80 && percentage <= 100) {
                    progressColor = '#fbbf24';
                } else if (percentage > 100) {
                    progressColor = '#ef4444';
                }
                
                const card = document.createElement('div');
                card.style.cssText = 'background: var(--bg-primary); padding: 20px; border-radius: var(--radius); border: 1px solid var(--border-color); box-shadow: var(--shadow-light); border-left: 4px solid ' + (isOverBudget ? 'var(--danger)' : progressColor) + '; color: var(--text-primary); cursor: pointer; transition: all 0.2s;';
                card.onmouseover = function() {
                    this.style.transform = 'translateY(-2px)';
                    this.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.12)';
                    this.style.borderColor = 'var(--primary)';
                };
                card.onmouseout = function() {
                    this.style.transform = 'translateY(0)';
                    this.style.boxShadow = 'var(--shadow-light)';
                    this.style.borderColor = 'var(--border-color)';
                };
                card.onclick = () => showCategoryDetails(category.name, categoryExpenses, 'expense', selectedMonth, budget.category_id, budget.amount);
                card.innerHTML = `
                    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 12px;">
                        <h5 style="font-size: 16px; font-weight: 700; margin: 0; color: var(--gray-900);">${category.name}</h5>
                        <span style="font-size: 11px; padding: 4px 8px; background: var(--gray-100); border-radius: var(--radius); color: var(--gray-700); font-weight: 600;">Gasto</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                        <span style="font-size: 14px; color: var(--gray-600);">Presupuesto:</span>
                        <span style="font-size: 14px; font-weight: 600; color: var(--gray-900);">${formatCurrency(budget.amount)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                        <span style="font-size: 14px; color: var(--gray-600);">Gastado:</span>
                        <span style="font-size: 14px; font-weight: 600; color: var(--danger);">${formatCurrency(spent)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                        <span style="font-size: 14px; color: var(--gray-600);">Restante:</span>
                        <span style="font-size: 14px; font-weight: 600; color: ${remaining >= 0 ? 'var(--success)' : 'var(--danger)'};">${formatCurrency(remaining)}</span>
                    </div>
                    <div style="background: var(--gray-200); border-radius: 4px; height: 8px; overflow: hidden; margin-bottom: 4px;">
                        <div style="background: ${progressColor}; height: 100%; width: ${Math.min(percentage, 100)}%; transition: width 0.3s;"></div>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <small style="font-size: 11px; color: var(--gray-500);">${categoryExpenses.length} transacciones</small>
                        <small style="font-size: 11px; font-weight: 600; color: ${progressColor};">${percentage.toFixed(1)}% usado</small>
                    </div>
                    ${isOverBudget ? `
                        <div style="margin-top: 10px; padding: 10px 12px; background: linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.15) 100%); border: 1.5px solid rgba(239, 68, 68, 0.3); border-left: 3px solid var(--danger); border-radius: 8px; display: flex; align-items: center; gap: 8px; box-shadow: 0 2px 6px rgba(239, 68, 68, 0.1);">
                            <span style="font-size: 16px; line-height: 1;">⚠️</span>
                            <span style="color: var(--danger); font-size: 12px; font-weight: 700;">Presupuesto excedido</span>
                        </div>
                    ` : ''}
                `;
                budgetsStatusContainer.appendChild(card);
            });
        }
    }
    
    // Estado de sobres del mes
    const envelopesStatusContainer = document.getElementById('monthEnvelopesStatus');
    if (envelopesStatusContainer) {
        envelopesStatusContainer.innerHTML = '';
        
        if (envelopes.length === 0) {
            envelopesStatusContainer.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--gray-500);">No hay sobres creados</div>';
        } else {
            envelopes.forEach(envelope => {
                const envelopeTransactions = monthTransactions.filter(t => t.envelope === envelope.name);
                const spent = envelopeTransactions.reduce((sum, t) => sum + Math.abs(t.amount), 0);
                const remaining = envelope.budget - spent;
                const percentage = (spent / envelope.budget) * 100;
                
                let progressColor = '#10b981';
                if (percentage > 80 && percentage <= 100) {
                    progressColor = '#fbbf24';
                } else if (percentage > 100) {
                    progressColor = '#ef4444';
                }
                
                const card = document.createElement('div');
                card.style.cssText = 'background: var(--bg-primary); padding: 20px; border-radius: var(--radius); border: 1px solid var(--border-color); box-shadow: var(--shadow-light); color: var(--text-primary); cursor: pointer; transition: all 0.2s;';
                card.onmouseover = function() {
                    this.style.transform = 'translateY(-2px)';
                    this.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.12)';
                    this.style.borderColor = 'var(--primary)';
                };
                card.onmouseout = function() {
                    this.style.transform = 'translateY(0)';
                    this.style.boxShadow = 'var(--shadow-light)';
                    this.style.borderColor = 'var(--border-color)';
                };
                // Abrir modal de detalles del sobre
                card.onclick = () => showEnvelopeDetails(envelope.name, envelopeTransactions, selectedMonth, envelope.budget);
                card.innerHTML = `
                    <h5 style="font-size: 16px; font-weight: 700; margin: 0 0 12px 0; color: var(--text-primary);">${envelope.name}</h5>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                        <span style="font-size: 14px; color: var(--text-secondary);">Presupuesto:</span>
                        <span style="font-size: 14px; font-weight: 600; color: var(--text-primary);">${formatCurrency(envelope.budget)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                        <span style="font-size: 14px; color: var(--text-secondary);">Gastado:</span>
                        <span style="font-size: 14px; font-weight: 600; color: var(--danger-color);">${formatCurrency(spent)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                        <span style="font-size: 14px; color: var(--text-secondary);">Restante:</span>
                        <span style="font-size: 14px; font-weight: 600; color: ${remaining >= 0 ? 'var(--success-color)' : 'var(--danger-color)'};">${formatCurrency(remaining)}</span>
                    </div>
                    <div style="background: var(--gray-200); border-radius: 4px; height: 8px; overflow: hidden; margin-bottom: 4px;">
                        <div style="background: ${progressColor}; height: 100%; width: ${Math.min(percentage, 100)}%; transition: width 0.3s;"></div>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <small style="font-size: 11px; color: var(--text-tertiary);">${envelopeTransactions.length} transacciones</small>
                        <small style="font-size: 11px; font-weight: 600; color: ${progressColor};">${percentage.toFixed(1)}% usado</small>
                    </div>
                `;
                envelopesStatusContainer.appendChild(card);
            });
        }
    }
}

// ==================== MODAL DE DETALLES DE SOBRE ====================
function showEnvelopeDetails(envelopeName, transactions, month, budgetAmount) {
    const modal = document.getElementById('categoryDetailsModal');
    const modalTitle = document.getElementById('categoryDetailsModalTitle');
    const modalContent = document.getElementById('categoryDetailsContent');
    
    if (!modal || !modalTitle || !modalContent) {
        console.error('Modal elements not found');
        return;
    }
    
    const [year, monthNum] = month.split('-');
    const monthName = new Date(year, parseInt(monthNum) - 1, 1).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
    
    modalTitle.textContent = `${envelopeName} - ${monthName}`;
    
    const total = transactions.reduce((sum, t) => sum + Math.abs(t.amount), 0);
    const remaining = budgetAmount - total;
    const percentage = budgetAmount > 0 ? (total / budgetAmount) * 100 : 0;
    
    let progressColor = '#10b981';
    if (percentage > 80 && percentage <= 100) {
        progressColor = '#fbbf24';
    } else if (percentage > 100) {
        progressColor = '#ef4444';
    }
    
    let content = `
        <div style="margin-bottom: 20px;">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; margin-bottom: 20px;">
                <div style="background: var(--danger); padding: 16px; border-radius: 10px; color: white;">
                    <div style="font-size: 12px; opacity: 0.9; margin-bottom: 6px;">Total Gastado</div>
                    <div style="font-size: 22px; font-weight: 700;">${formatCurrency(total)}</div>
                </div>
                <div style="background: var(--bg-tertiary); padding: 16px; border-radius: 10px; border: 1px solid var(--border-color);">
                    <div style="font-size: 12px; color: var(--text-secondary); margin-bottom: 6px;">Transacciones</div>
                    <div style="font-size: 22px; font-weight: 700; color: var(--text-primary);">${transactions.length}</div>
                </div>
                <div style="background: var(--primary-light); padding: 16px; border-radius: 10px; border: 1px solid var(--border-color);">
                    <div style="font-size: 12px; color: var(--primary); margin-bottom: 6px;">Presupuesto</div>
                    <div style="font-size: 22px; font-weight: 700; color: var(--primary-dark);">${formatCurrency(budgetAmount)}</div>
                </div>
                <div style="background: ${remaining >= 0 ? 'var(--success)' : 'var(--danger)'}; padding: 16px; border-radius: 10px; color: white;">
                    <div style="font-size: 12px; opacity: 0.9; margin-bottom: 6px;">Restante</div>
                    <div style="font-size: 22px; font-weight: 700;">${formatCurrency(remaining)}</div>
                </div>
            </div>
            ${budgetAmount > 0 ? `
                <div style="background: var(--gray-200); border-radius: 4px; height: 8px; overflow: hidden; margin-bottom: 8px;">
                    <div style="background: ${progressColor}; height: 100%; width: ${Math.min(percentage, 100)}%; transition: width 0.3s;"></div>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 13px; color: var(--text-secondary);">
                    <span>Progreso del presupuesto</span>
                    <span style="font-weight: 600; color: ${progressColor};">${percentage.toFixed(1)}%</span>
                </div>
            ` : ''}
        </div>
        
        <div>
            <h3 style="font-size: 16px; font-weight: 700; margin-bottom: 12px; color: var(--text-primary);">Transacciones</h3>
            <div class="table-container">
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="background: var(--bg-tertiary); border-bottom: 2px solid var(--border-color);">
                            <th style="padding: 10px 12px; text-align: left; font-weight: 600; font-size: 12px; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.5px;">Fecha</th>
                            <th style="padding: 10px 12px; text-align: left; font-weight: 600; font-size: 12px; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.5px;">Descripción</th>
                            <th style="padding: 10px 12px; text-align: left; font-weight: 600; font-size: 12px; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.5px;">Categoría</th>
                            <th style="padding: 10px 12px; text-align: right; font-weight: 600; font-size: 12px; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.5px;">Monto</th>
                        </tr>
                    </thead>
                    <tbody>
    `;
    
    const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    if (sortedTransactions.length === 0) {
        content += '<tr><td colspan="4" style="text-align: center; padding: 30px; color: var(--text-tertiary); font-size: 14px;">No hay transacciones</td></tr>';
    } else {
        sortedTransactions.forEach(t => {
            const date = new Date(t.date);
            const amount = Math.abs(t.amount);
            content += `
                <tr style="border-bottom: 1px solid var(--border-color); transition: background-color 0.2s;" onmouseover="this.style.background='var(--bg-tertiary)'" onmouseout="this.style.background='transparent'">
                    <td style="padding: 10px 12px; color: var(--text-secondary); font-size: 13px;">${formatDate(date)}</td>
                    <td style="padding: 10px 12px; color: var(--text-secondary); font-size: 13px;">${t.description || '-'}</td>
                    <td style="padding: 10px 12px; color: var(--text-secondary); font-size: 13px;">${t.categorySpecific || t.categoryGeneral || '-'}</td>
                    <td style="padding: 10px 12px; text-align: right; font-weight: 600; font-size: 13px; color: var(--danger);">${formatCurrency(amount)}</td>
                </tr>
            `;
        });
    }
    
    content += `
                    </tbody>
                </table>
            </div>
        </div>
    `;
    
    modalContent.innerHTML = content;
    modal.style.display = 'flex';
}

// ==================== MODAL DE DETALLES DE CATEGORÍA ====================
function showCategoryDetails(categoryName, transactions, type, month, categoryId, budgetAmount) {
    const modal = document.getElementById('categoryDetailsModal');
    const modalTitle = document.getElementById('categoryDetailsModalTitle');
    const modalContent = document.getElementById('categoryDetailsContent');
    
    if (!modal || !modalTitle || !modalContent) {
        console.error('Modal elements not found');
        return;
    }
    
    const [year, monthNum] = month.split('-');
    const monthName = new Date(year, parseInt(monthNum) - 1, 1).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
    
    modalTitle.textContent = `${categoryName} - ${monthName}`;
    
    const total = transactions.reduce((sum, t) => sum + (type === 'expense' ? Math.abs(t.amount) : t.amount), 0);
    
    let content = `
        <div style="margin-bottom: 20px;">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; margin-bottom: 20px;">
                <div style="background: ${type === 'expense' ? 'var(--danger)' : 'var(--success)'}; padding: 16px; border-radius: 10px; color: white;">
                    <div style="font-size: 12px; opacity: 0.9; margin-bottom: 6px;">Total ${type === 'expense' ? 'Gastado' : 'Ingresado'}</div>
                    <div style="font-size: 22px; font-weight: 700;">${formatCurrency(total)}</div>
                </div>
                <div style="background: var(--bg-tertiary); padding: 16px; border-radius: 10px; border: 1px solid var(--border-color);">
                    <div style="font-size: 12px; color: var(--text-secondary); margin-bottom: 6px;">Transacciones</div>
                    <div style="font-size: 22px; font-weight: 700; color: var(--text-primary);">${transactions.length}</div>
                </div>
                ${budgetAmount > 0 ? `
                    <div style="background: var(--primary-light); padding: 16px; border-radius: 10px; border: 1px solid var(--border-color);">
                        <div style="font-size: 12px; color: var(--primary); margin-bottom: 6px;">Presupuesto</div>
                        <div style="font-size: 22px; font-weight: 700; color: var(--primary-dark);">${formatCurrency(budgetAmount)}</div>
                    </div>
                ` : ''}
            </div>
        </div>
        
        <div>
            <h3 style="font-size: 16px; font-weight: 700; margin-bottom: 12px; color: var(--text-primary);">Transacciones</h3>
            <div class="table-container">
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="background: var(--bg-tertiary); border-bottom: 2px solid var(--border-color);">
                            <th style="padding: 12px; text-align: left; font-weight: 600; font-size: 13px; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.5px;">Fecha</th>
                            <th style="padding: 12px; text-align: left; font-weight: 600; font-size: 13px; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.5px;">Descripción</th>
                            <th style="padding: 12px; text-align: left; font-weight: 600; font-size: 13px; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.5px;">Subcategoría</th>
                            <th style="padding: 12px; text-align: right; font-weight: 600; font-size: 13px; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.5px;">Monto</th>
                        </tr>
                    </thead>
                    <tbody>
    `;
    
    const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    if (sortedTransactions.length === 0) {
        content += '<tr><td colspan="4" style="text-align: center; padding: 40px; color: var(--text-tertiary);">No hay transacciones</td></tr>';
    } else {
        sortedTransactions.forEach(t => {
            const date = new Date(t.date);
            const amount = type === 'expense' ? Math.abs(t.amount) : t.amount;
            content += `
                <tr style="border-bottom: 1px solid var(--border-color); transition: background-color 0.2s;" onmouseover="this.style.background='var(--bg-tertiary)'" onmouseout="this.style.background='transparent'">
                    <td style="padding: 12px; color: var(--text-secondary);">${formatDate(date)}</td>
                    <td style="padding: 12px; color: var(--text-secondary);">${t.description || '-'}</td>
                    <td style="padding: 12px; color: var(--text-secondary);">${t.categorySpecific || '-'}</td>
                    <td style="padding: 12px; text-align: right; font-weight: 600; color: ${type === 'expense' ? 'var(--danger)' : 'var(--success)'};">${formatCurrency(amount)}</td>
                </tr>
            `;
        });
    }
    
    content += `
                    </tbody>
                </table>
            </div>
        </div>
    `;
    
    modalContent.innerHTML = content;
    modal.style.display = 'flex';
}

function closeCategoryDetailsModal() {
    const modal = document.getElementById('categoryDetailsModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Exponer funciones globales
window.showCategoryDetails = showCategoryDetails;
window.showEnvelopeDetails = showEnvelopeDetails;
window.closeCategoryDetailsModal = closeCategoryDetailsModal;

// Exportar datos
function exportData() {
    if (!currentUser) return;
    
    const date = new Date().toISOString().split('T')[0];
    const timestamp = new Date().toISOString();
    
    // Crear CSV completo con múltiples secciones
    let csv = `VEEDOR - EXPORTACIÓN COMPLETA DE DATOS FINANCIEROS\n`;
    csv += `Usuario: ${currentUser}\n`;
    csv += `Fecha de exportación: ${new Date().toLocaleDateString('es-ES')}\n`;
    csv += `\n`;
    
    // ========== TRANSACCIONES ==========
    csv += `\n========== TRANSACCIONES ==========\n`;
    csv += `Fecha,Tipo,Categoría General,Categoría Específica,Descripción,Sobre,Monto (€)\n`;
    transactions.forEach(t => {
        const transDate = new Date(t.date).toLocaleDateString('es-ES');
        const type = t.type === 'income' ? 'Ingreso' : 'Gasto';
        const description = (t.description || '').replace(/"/g, '""');
        csv += `"${transDate}","${type}","${t.categoryGeneral}","${t.categorySpecific}","${description}","${t.envelope || ''}","${t.amount}"\n`;
    });
    
    // ========== PRESUPUESTOS ==========
    csv += `\n========== PRESUPUESTOS MENSUALES ==========\n`;
    csv += `Mes,Categoría,Presupuesto (€),Gastado (€),Restante (€),% Usado\n`;
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const monthBudgets = budgets.filter(b => b.month === currentMonth);
    const monthTransactions = transactions.filter(t => {
        const tDate = new Date(t.date);
        return tDate.getMonth() === now.getMonth() && 
               tDate.getFullYear() === now.getFullYear() &&
               t.type === 'expense';
    });
    const expensesByCategory = {};
    monthTransactions.forEach(t => {
        expensesByCategory[t.categoryGeneral] = (expensesByCategory[t.categoryGeneral] || 0) + Math.abs(t.amount);
    });
    
    monthBudgets.forEach(budget => {
        const spent = expensesByCategory[budget.category] || 0;
        const remaining = budget.amount - spent;
        const percentage = budget.amount > 0 ? ((spent / budget.amount) * 100) : 0;
        const category = categories.expense.find(c => c.id === budget.category);
        const categoryName = category ? category.name : budget.category;
        csv += `"${budget.month}","${categoryName}","${budget.amount}","${spent}","${remaining}","${percentage.toFixed(2)}"\n`;
    });
    
    // ========== SOBRES ==========
    csv += `\n========== SOBRES (PRESUPUESTOS FLEXIBLES) ==========\n`;
    csv += `Nombre,Presupuesto Mensual (€),Gastado Este Mes (€),Restante (€)\n`;
    envelopes.forEach(envelope => {
        const monthExpenses = monthTransactions.filter(t => t.envelope === envelope.name);
        const spent = monthExpenses.reduce((sum, t) => sum + Math.abs(t.amount), 0);
        const remaining = envelope.budget - spent;
        csv += `"${envelope.name}","${envelope.budget}","${spent}","${remaining}"\n`;
    });
    
    // ========== PRÉSTAMOS ==========
    csv += `\n========== PRÉSTAMOS E HIPOTECAS ==========\n`;
    csv += `Nombre,Tipo,Principal (€),Interés Anual (%),TAE (%),Pago Mensual (€),Capital Restante (€),Total Pagado (€),Meses Restantes\n`;
    loans.forEach(loan => {
        const amortization = calculateAmortizationTable(
            loan.principal,
            loan.interest_rate,
            loan.monthly_payment,
            loan.start_date,
            loan.total_paid || 0,
            loan.early_payments || []
        );
        const startDate = new Date(loan.start_date);
        const endDate = new Date(loan.end_date);
        const today = new Date();
        const monthsRemaining = Math.max(0, Math.ceil((endDate - today) / (1000 * 60 * 60 * 24 * 30.44)));
        const totalPaid = (loan.total_paid || 0) + (loan.early_payments || []).reduce((sum, ep) => sum + ep.amount + (ep.commission || 0), 0);
        
        csv += `"${loan.name}","${loan.type === 'debt' ? 'Deuda' : 'Crédito'}","${loan.principal}","${loan.interest_rate}","${loan.tae || ''}","${loan.monthly_payment}","${amortization.finalBalance.toFixed(2)}","${totalPaid.toFixed(2)}","${monthsRemaining}"\n`;
    });
    
    // ========== INVERSIONES ==========
    csv += `\n========== INVERSIONES ==========\n`;
    csv += `Nombre,Tipo,Monto Invertido (€),Valor Actual (€),Ganancia/Pérdida (€),Rentabilidad (%),Fecha Inversión\n`;
    investments.forEach(investment => {
        const profit = investment.current_value - investment.amount;
        const returnPercent = investment.amount > 0 ? ((profit / investment.amount) * 100) : 0;
        const typeNames = {
            stocks: 'Acciones',
            bonds: 'Bonos',
            crypto: 'Criptomonedas',
            funds: 'Fondos',
            real_estate: 'Inmuebles',
            other: 'Otros'
        };
        const invDate = new Date(investment.date).toLocaleDateString('es-ES');
        csv += `"${investment.name}","${typeNames[investment.type] || investment.type}","${investment.amount}","${investment.current_value}","${profit.toFixed(2)}","${returnPercent.toFixed(2)}","${invDate}"\n`;
    });
    
    // ========== RESUMEN ==========
    csv += `\n========== RESUMEN FINANCIERO ==========\n`;
    const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = Math.abs(transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0));
    const totalSavings = totalIncome - totalExpenses;
    const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);
    const totalInvestmentsValue = investments.reduce((sum, inv) => sum + inv.current_value, 0);
    const totalInvestmentsProfit = totalInvestmentsValue - totalInvested;
    
    csv += `Concepto,Valor (€)\n`;
    csv += `"Total Ingresos","${totalIncome.toFixed(2)}"\n`;
    csv += `"Total Gastos","${totalExpenses.toFixed(2)}"\n`;
    csv += `"Ahorro Total","${totalSavings.toFixed(2)}"\n`;
    csv += `"Total Invertido","${totalInvested.toFixed(2)}"\n`;
    csv += `"Valor Actual Inversiones","${totalInvestmentsValue.toFixed(2)}"\n`;
    csv += `"Ganancia/Pérdida Inversiones","${totalInvestmentsProfit.toFixed(2)}"\n`;
    
    // Calcular balance total
    const transactionsBalance = transactions.reduce((sum, t) => sum + t.amount, 0);
    const loansDebt = loans.filter(l => l.type === 'debt').reduce((sum, loan) => {
        const amortization = calculateAmortizationTable(
            loan.principal,
            loan.interest_rate,
            loan.monthly_payment,
            loan.start_date,
            0, // No usar total_paid, calcular desde el inicio hasta hoy
            loan.early_payments || []
        );
        return sum + amortization.finalBalance;
    }, 0);
    const loansCredit = loans.filter(l => l.type === 'credit').reduce((sum, loan) => {
        const amortization = calculateAmortizationTable(
            loan.principal,
            loan.interest_rate,
            loan.monthly_payment,
            loan.start_date,
            0, // No usar total_paid, calcular desde el inicio hasta hoy
            loan.early_payments || []
        );
        return sum + amortization.finalBalance;
    }, 0);
    const calculatedBalance = transactionsBalance + totalInvestmentsValue + loansCredit - loansDebt;
    
    csv += `"Balance Total","${calculatedBalance.toFixed(2)}"\n`;
    
    // Descargar CSV
    const csvBlob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const csvLink = document.createElement('a');
    const csvUrl = URL.createObjectURL(csvBlob);
    csvLink.setAttribute('href', csvUrl);
    csvLink.setAttribute('download', `veedor_${currentUser}_${date}.csv`);
    csvLink.style.visibility = 'hidden';
    document.body.appendChild(csvLink);
    csvLink.click();
    document.body.removeChild(csvLink);
    URL.revokeObjectURL(csvUrl);
    
    alert(`✅ Exportación completada\n\nEl archivo incluye:\n- ${transactions.length} transacciones\n- ${monthBudgets.length} presupuestos\n- ${envelopes.length} sobres\n- ${loans.length} préstamos\n- ${investments.length} inversiones\n- Resumen financiero completo`);
}


// Utilidades
function formatCurrency(amount) {
    return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'EUR'
    }).format(amount);
}

function formatDate(date) {
    return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Actualizar métricas de salud financiera
function updateFinancialHealthMetrics() {
    const container = document.getElementById('financialHealthMetrics');
    if (!container) {
        // El contenedor puede no existir si no estamos en el tab de análisis
        return;
    }
    
    console.log('📊 Actualizando métricas de salud financiera...');
    container.innerHTML = '';
    
    // Usar el mismo período que el análisis detallado
    const periodTransactions = getTransactionsByPeriod();
    const period = getSelectedPeriod();
    const now = new Date();
    
    // Calcular meses en el período para proyecciones
    let monthsInPeriod = 1;
    if (period === 999) { // "all"
        const dates = periodTransactions.map(t => new Date(t.date));
        if (dates.length > 0) {
            const minDate = new Date(Math.min(...dates));
            const maxDate = new Date(Math.max(...dates));
            const diffTime = Math.abs(maxDate - minDate);
            monthsInPeriod = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30.44)));
        }
    } else {
        monthsInPeriod = period;
    }
    
    // Calcular balance del período (no total acumulado)
    const periodBalance = periodTransactions.reduce((sum, t) => sum + t.amount, 0);
    
    // Activos totales (histórico acumulado para contexto)
    const totalTransactionsBalance = transactions.reduce((sum, t) => sum + t.amount, 0);
    const investmentsValue = investments.reduce((sum, inv) => sum + inv.current_value, 0);
    const loansCredit = loans.filter(l => l.type === 'credit').reduce((sum, loan) => {
        const amortization = calculateAmortizationTable(
            loan.principal,
            loan.interest_rate,
            loan.monthly_payment,
            loan.start_date,
            0, // No usar total_paid, calcular desde el inicio hasta hoy
            loan.early_payments || []
        );
        return sum + amortization.finalBalance;
    }, 0);
    
    // Calcular valor de activos (bienes/patrimonio)
    const patrimonioValue = patrimonio.reduce((sum, prop) => sum + (prop.current_value || 0), 0);
    
    const totalAssets = totalTransactionsBalance + investmentsValue + loansCredit + patrimonioValue;
    
    // Calcular deudas totales (histórico)
    // Verificar préstamos activos (que aún no han terminado)
    const activeDebtLoans = loans.filter(l => {
        if (l.type !== 'debt') return false;
        const endDate = new Date(l.end_date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return endDate >= today; // Préstamo aún activo
    });
    
    // Calcular deuda total, pero considerar el valor de propiedades asociadas
    let loansDebt = 0;
    let propertyValueOffset = 0; // Valor de propiedades que compensan la deuda
    
    activeDebtLoans.forEach(loan => {
        const amortization = calculateAmortizationTable(
            loan.principal,
            loan.interest_rate,
            loan.monthly_payment,
            loan.start_date,
            loan.total_paid || 0,
            loan.early_payments || []
        );
        const loanDebt = amortization.finalBalance;
        loansDebt += loanDebt;
        
        // Buscar si hay transacciones asociadas a este préstamo que también estén asociadas a una propiedad
        const loanTransactions = transactions.filter(t => t.loan_id === (loan._id || loan.id));
        const propertyTransactions = loanTransactions.filter(t => t.property_id);
        
        if (propertyTransactions.length > 0) {
            // Obtener la propiedad asociada (puede haber múltiples, tomar la primera única)
            const propertyIds = [...new Set(propertyTransactions.map(t => t.property_id))];
            propertyIds.forEach(propertyId => {
                const property = properties.find(p => (p._id || p.id) === propertyId);
                if (property && property.current_value) {
                    // Sumar el valor de la propiedad como compensación (solo una vez por propiedad)
                    propertyValueOffset += property.current_value;
                }
            });
        }
    });
    
    // Ajustar la deuda neta restando el valor de las propiedades asociadas
    // La deuda neta es la deuda menos el valor de las propiedades que la respaldan
    const netDebt = Math.max(0, loansDebt - propertyValueOffset);
    
    // También verificar si hay préstamos activos aunque el capital restante sea bajo
    const hasActiveDebts = activeDebtLoans.length > 0;
    
    // Calcular ingresos y gastos del período seleccionado
    const periodIncome = periodTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const periodExpenses = Math.abs(periodTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0));
    const periodSavings = periodIncome - periodExpenses;
    
    // Proyectar a anual para comparaciones
    const annualIncome = monthsInPeriod > 0 ? (periodIncome / monthsInPeriod) * 12 : 0;
    const annualExpenses = monthsInPeriod > 0 ? (periodExpenses / monthsInPeriod) * 12 : 0;
    const annualSavings = annualIncome - annualExpenses;
    
    // 1. Porcentaje de Deuda Pendiente (usando deuda neta después de considerar propiedades)
    const debtPercentage = totalAssets > 0 ? (netDebt / totalAssets) * 100 : (netDebt > 0 ? 100 : 0);
    const debtStatus = debtPercentage < 30 ? 'excellent' : debtPercentage < 50 ? 'good' : debtPercentage < 70 ? 'warning' : 'danger';
    
    // 2. Ratio de Endeudamiento (Cuotas mensuales de préstamos / Ingresos mensuales)
    const avgMonthlyIncome = monthsInPeriod > 0 ? periodIncome / monthsInPeriod : 0;
    const monthlyLoanPayments = loans.filter(l => l.type === 'debt').reduce((sum, loan) => sum + loan.monthly_payment, 0);
    const debtToIncomeRatio = avgMonthlyIncome > 0 ? (monthlyLoanPayments / avgMonthlyIncome) * 100 : (monthlyLoanPayments > 0 ? 999 : 0);
    const debtRatioStatus = avgMonthlyIncome === 0 && monthlyLoanPayments > 0 ? 'danger' : (debtToIncomeRatio >= 40 ? 'danger' : debtToIncomeRatio >= 30 ? 'warning' : debtToIncomeRatio >= 20 ? 'good' : 'excellent');
    
    // 3. Ratio de Salud Financiera (Activos / Deudas netas)
    const healthRatio = netDebt > 0 ? (totalAssets / netDebt) : (totalAssets > 0 ? 999 : (totalAssets < 0 ? -999 : 0));
    // Si no hay deudas activas y hay activos positivos = excelente, si activos negativos = peligro
    const healthStatus = !hasActiveDebts ? (totalAssets > 0 ? 'excellent' : (totalAssets < 0 ? 'danger' : 'warning')) : (healthRatio > 3 ? 'excellent' : healthRatio > 2 ? 'good' : healthRatio > 1 ? 'warning' : 'danger');
    
    // 4. Ratio de Cobertura de Deuda (Ingresos anuales / Deuda neta)
    const debtCoverageRatio = netDebt > 0 ? (annualIncome / netDebt) : (annualIncome > 0 ? 999 : 0);
    // Si no hay deudas = excelente, si hay deudas pero no ingresos = peligro
    const coverageStatus = loansDebt === 0 ? 'excellent' : (debtCoverageRatio > 2 ? 'excellent' : debtCoverageRatio > 1 ? 'good' : debtCoverageRatio > 0.5 ? 'warning' : 'danger');
    
    // 5. Ratio de Ahorro (Ahorro del período / Ingresos del período)
    const savingsRatio = periodIncome > 0 ? (periodSavings / periodIncome) * 100 : (periodIncome === 0 && periodExpenses > 0 ? -100 : 0);
    // Lógica corregida: negativo o 0% = bajo/peligro, positivo = bueno
    // Si no hay ingresos y hay gastos = peligro, si no hay ingresos ni gastos = moderado
    const savingsStatus = periodIncome === 0 && periodExpenses === 0 ? 'warning' : (savingsRatio >= 20 ? 'excellent' : savingsRatio >= 10 ? 'good' : savingsRatio > 0 ? 'warning' : 'danger');
    
    // 6. Ratio de Liquidez (Activos líquidos / Gastos mensuales promedio del período)
    const avgMonthlyExpenses = monthsInPeriod > 0 ? periodExpenses / monthsInPeriod : periodExpenses;
    const liquidityRatio = avgMonthlyExpenses > 0 ? (totalTransactionsBalance / avgMonthlyExpenses) : (totalTransactionsBalance > 0 ? 999 : (totalTransactionsBalance < 0 ? -999 : 0));
    // Si balance negativo = peligro, si no hay gastos y hay balance positivo = excelente
    const liquidityStatus = totalTransactionsBalance < 0 ? 'danger' : (avgMonthlyExpenses === 0 && totalTransactionsBalance > 0 ? 'excellent' : (liquidityRatio >= 6 ? 'excellent' : liquidityRatio >= 3 ? 'good' : liquidityRatio >= 1 ? 'warning' : 'danger'));
    
    // 7. Ratio de Inversión (Inversiones / Activos totales)
    const investmentRatio = totalAssets > 0 ? (investmentsValue / totalAssets) * 100 : (totalAssets < 0 ? 0 : 0);
    // Si activos negativos o 0% = bajo, si positivo según porcentaje
    const investmentStatus = totalAssets <= 0 ? 'danger' : (investmentRatio > 20 ? 'excellent' : investmentRatio > 10 ? 'good' : investmentRatio > 5 ? 'warning' : 'danger');
    
    // Nota: Servicio de Deuda eliminado porque es duplicado del Ratio de Endeudamiento
    // Ambos calculan lo mismo: Cuotas mensuales / Ingresos mensuales
    
    const metrics = [
        {
            title: 'Deuda Pendiente',
            value: debtPercentage.toFixed(1) + '%',
            description: `Deuda neta sobre activos totales${propertyValueOffset > 0 ? ' (considerando propiedades asociadas)' : ''}`,
            status: debtStatus,
            icon: '',
            detail: formatCurrency(netDebt) + ' de ' + formatCurrency(totalAssets) + (propertyValueOffset > 0 ? ` (Deuda bruta: ${formatCurrency(loansDebt)}, Valor propiedades: ${formatCurrency(propertyValueOffset)})` : '')
        },
        {
            title: 'Ratio de Endeudamiento',
            value: debtToIncomeRatio >= 999 ? '∞%' : debtToIncomeRatio.toFixed(1) + '%',
            description: `Cuotas mensuales de préstamos / Ingresos mensuales`,
            status: debtRatioStatus,
            icon: '',
            detail: avgMonthlyIncome === 0 && monthlyLoanPayments > 0 ? 'Sin ingresos pero hay cuotas' : (debtToIncomeRatio >= 40 ? 'Alto (≥40%)' : debtToIncomeRatio >= 30 ? 'Moderado (30-40%)' : debtToIncomeRatio >= 20 ? 'Bueno (20-30%)' : 'Excelente (<20%)') + ` | Cuotas: ${formatCurrency(monthlyLoanPayments)} / Ingresos: ${formatCurrency(avgMonthlyIncome)}`
        },
        {
            title: 'Salud Financiera',
            value: healthRatio > 999 ? '∞' : healthRatio < -999 ? '-∞' : healthRatio.toFixed(2),
            description: `Cuántas veces tus activos cubren tus deudas (mayor es mejor)`,
            status: healthStatus,
            icon: '',
            detail: !hasActiveDebts ? (totalAssets > 0 ? 'Sin deudas activas, activos positivos' : (totalAssets < 0 ? 'Sin deudas activas, pero activos negativos' : 'Sin deudas activas ni activos')) : `Activos: ${formatCurrency(totalAssets)} | Deudas: ${formatCurrency(netDebt)} | ${healthRatio > 3 ? 'Excelente (≥3x)' : healthRatio > 2 ? 'Buena (2-3x)' : healthRatio > 1 ? 'Moderada (1-2x)' : 'Baja (<1x)'}`
        },
        {
            title: 'Cobertura de Deuda',
            value: debtCoverageRatio > 999 ? '∞' : debtCoverageRatio.toFixed(2),
            description: `Ingresos anuales / Deuda`,
            status: coverageStatus,
            icon: '',
            detail: !hasActiveDebts ? 'Sin deudas activas' : (debtCoverageRatio > 2 ? 'Excelente' : debtCoverageRatio > 1 ? 'Buena' : debtCoverageRatio > 0.5 ? 'Moderada' : 'Baja')
        },
        {
            title: 'Ratio de Ahorro',
            value: savingsRatio.toFixed(1) + '%',
            description: `Ahorro del período / Ingresos del período`,
            status: savingsStatus,
            icon: '',
            detail: formatCurrency(periodSavings) + ' de ' + formatCurrency(periodIncome) + (periodIncome === 0 ? ' (sin ingresos)' : '')
        },
        {
            title: 'Liquidez',
            value: liquidityRatio > 999 ? '∞' : liquidityRatio < 0 ? '0.0 meses' : liquidityRatio.toFixed(1) + ' meses',
            description: `Cuántos meses puedes cubrir tus gastos con el dinero disponible en cuentas`,
            status: liquidityStatus,
            icon: '',
            detail: totalTransactionsBalance < 0 ? 'Balance negativo - No puedes cubrir gastos' : (avgMonthlyExpenses === 0 && totalTransactionsBalance > 0 ? 'Sin gastos, balance positivo' : `Balance: ${formatCurrency(totalTransactionsBalance)} | Gastos mensuales: ${formatCurrency(avgMonthlyExpenses)} | ${liquidityRatio >= 6 ? 'Excelente (≥6 meses)' : liquidityRatio >= 3 ? 'Buena (3-6 meses)' : liquidityRatio >= 1 ? 'Moderada (1-3 meses)' : 'Baja (<1 mes)'}`)
        },
        {
            title: 'Ratio de Inversión',
            value: investmentRatio.toFixed(1) + '%',
            description: `Inversiones / Activos totales`,
            status: investmentStatus,
            icon: '',
            detail: totalAssets <= 0 ? 'Sin activos o activos negativos' : (formatCurrency(investmentsValue) + ' de ' + formatCurrency(totalAssets))
        },
    ];
    
    metrics.forEach((metric, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.style.borderLeft = `4px solid ${
            metric.status === 'excellent' ? 'var(--success)' :
            metric.status === 'good' ? '#10b981' :
            metric.status === 'warning' ? 'var(--warning)' :
            'var(--danger)'
        }`;
        card.style.cursor = 'pointer';
        card.style.transition = 'transform 0.2s, box-shadow 0.2s';
        card.onmouseover = () => {
            card.style.transform = 'translateY(-2px)';
            card.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
        };
        card.onmouseout = () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = '';
        };
        card.onclick = () => showFinancialHealthDetail(metric, index);
        
        // Colores de status adaptados al modo oscuro
        const isDarkMode = document.body.classList.contains('dark-mode');
        const statusColors = {
            excellent: { 
                bg: isDarkMode ? 'rgba(16, 185, 129, 0.2)' : '#D1FAE5', 
                text: isDarkMode ? '#10b981' : '#065F46' 
            },
            good: { 
                bg: isDarkMode ? 'rgba(34, 197, 94, 0.2)' : '#DCFCE7', 
                text: isDarkMode ? '#22c55e' : '#166534' 
            },
            warning: { 
                bg: isDarkMode ? 'rgba(251, 191, 36, 0.2)' : '#FEF3C7', 
                text: isDarkMode ? '#fbbf24' : '#92400E' 
            },
            danger: { 
                bg: isDarkMode ? 'rgba(239, 68, 68, 0.2)' : '#FEE2E2', 
                text: isDarkMode ? '#ef4444' : '#991B1B' 
            }
        };
        
        const statusStyle = statusColors[metric.status] || statusColors.warning;
        
        card.innerHTML = `
            <div style="display: flex; align-items: start; justify-content: space-between; margin-bottom: 12px;">
                <div>
                    <div style="margin-bottom: 4px;">
                        <h3 style="margin: 0; font-size: 16px; font-weight: 700; color: var(--text-primary);">${metric.title}</h3>
                    </div>
                    <p style="margin: 0; font-size: 12px; color: var(--text-secondary);">${metric.description}</p>
                </div>
                <span style="padding: 4px 10px; background: ${statusStyle.bg}; color: ${statusStyle.text}; border-radius: var(--radius-full); font-size: 11px; font-weight: 600;">
                    ${metric.status === 'excellent' ? 'Excelente' : metric.status === 'good' ? 'Bueno' : metric.status === 'warning' ? 'Moderado' : 'Bajo'}
                </span>
            </div>
            <div style="margin-top: 16px;">
                <div style="font-size: 28px; font-weight: 700; color: var(--text-primary); margin-bottom: 8px;">
                    ${metric.value}
                </div>
                <div style="font-size: 13px; color: var(--text-secondary);">
                    ${metric.detail}
                </div>
            </div>
        `;
        
        container.appendChild(card);
    });
}

// ==================== SISTEMA DE RECOMENDACIONES ECONÓMICAS ====================

// Generar recomendaciones personalizadas basadas en los datos del usuario
function generateRecommendations() {
    const recommendations = [];
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    // Obtener transacciones del mes actual
    const monthTransactions = transactions.filter(t => {
        const tDate = new Date(t.date);
        return tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear;
    });
    
    const monthIncome = monthTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const monthExpenses = Math.abs(monthTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0));
    const monthSavings = monthIncome - monthExpenses;
    const savingsRate = monthIncome > 0 ? (monthSavings / monthIncome) * 100 : 0;
    
    // Calcular balances y ratios
    const transactionsBalance = transactions.reduce((sum, t) => sum + t.amount, 0);
    const investmentsValue = investments.reduce((sum, inv) => sum + inv.current_value, 0);
    const patrimonioValue = patrimonio.reduce((sum, prop) => sum + (prop.current_value || 0), 0);
    
    const activeDebtLoans = loans.filter(l => l.type === 'debt' && new Date(l.end_date) >= now);
    const monthlyLoanPayments = activeDebtLoans.reduce((sum, loan) => sum + loan.monthly_payment, 0);
    const avgMonthlyIncome = monthIncome;
    const debtToIncomeRatio = avgMonthlyIncome > 0 ? (monthlyLoanPayments / avgMonthlyIncome) * 100 : 0;
    
    const avgMonthlyExpenses = monthExpenses;
    const liquidityRatio = avgMonthlyExpenses > 0 ? (transactionsBalance / avgMonthlyExpenses) : (transactionsBalance > 0 ? 999 : 0);
    
    // 1. RECOMENDACIONES DE AMORTIZACIÓN DE PRÉSTAMOS
    activeDebtLoans.forEach(loan => {
        const interestRate = loan.interest_rate || 0;
        const principal = loan.principal || 0;
        const monthlyPayment = loan.monthly_payment || 0;
        const remainingMonths = Math.ceil((new Date(loan.end_date) - now) / (1000 * 60 * 60 * 24 * 30));
        
        // Calcular ahorro potencial por amortización
        if (interestRate > 5 && principal > 1000 && remainingMonths > 6) {
            // Calcular balance actual aproximado
            const amortization = calculateAmortizationTable(
                principal,
                interestRate,
                monthlyPayment,
                loan.start_date,
                loan.total_paid || 0,
                loan.early_payments || []
            );
            const currentBalance = amortization.finalBalance;
            
            // Recomendar amortizar 10% del balance actual o 5000€ máximo
            const recommendedAmount = Math.min(currentBalance * 0.1, 5000);
            
            // Calcular ahorro aproximado: intereses que no se pagarían
            const monthlyInterest = currentBalance * (interestRate / 100 / 12);
            const monthsSaved = Math.floor(recommendedAmount / monthlyPayment);
            const interestSaved = monthlyInterest * monthsSaved * 0.7; // 70% del interés estimado
            
            if (interestSaved > 50 && recommendedAmount > 500) {
                recommendations.push({
                    type: 'loan_amortization',
                    priority: interestRate > 8 ? 'high' : 'medium',
                    icon: '',
                    title: `Amortizar préstamo "${loan.name}"`,
                    description: `Si ahorras ${formatCurrency(recommendedAmount)} durante ${Math.ceil(recommendedAmount / (monthSavings || 500))} meses y lo amortizas anticipadamente, podrías ahorrar aproximadamente ${formatCurrency(interestSaved)} en intereses y reducir el plazo en ${monthsSaved} meses.`,
                    impact: `Ahorro estimado: ${formatCurrency(interestSaved)}`,
                    action: {
                        type: 'edit_loan',
                        loanId: loan._id || loan.id,
                        text: 'Ver préstamo'
                    },
                    category: 'Optimización de Deuda'
                });
            }
        }
        
        // Recomendación de refinanciación para préstamos con alta tasa
        if (interestRate > 7) {
            recommendations.push({
                type: 'loan_refinance',
                priority: 'medium',
                icon: '',
                title: `Considera refinanciar "${loan.name}"`,
                description: `Tu préstamo tiene una tasa del ${interestRate}%. Si encuentras una tasa menor al ${(interestRate * 0.7).toFixed(1)}%, podrías ahorrar significativamente en intereses.`,
                impact: `Tasa actual: ${interestRate}%`,
                action: {
                    type: 'edit_loan',
                    loanId: loan._id || loan.id,
                    text: 'Ver préstamo'
                },
                category: 'Optimización de Deuda'
            });
        }
    });
    
    // 2. ANÁLISIS DE GASTOS RECURRENTES/SUSCRIPCIONES
    const recurringExpenses = {};
    monthTransactions.filter(t => t.type === 'expense').forEach(t => {
        const key = t.description?.toLowerCase() || t.categorySpecific?.toLowerCase() || '';
        if (key.includes('netflix') || key.includes('spotify') || key.includes('amazon') || 
            key.includes('gym') || key.includes('suscripción') || key.includes('subscription') ||
            key.includes('premium') || key.includes('pro')) {
            const category = t.categorySpecific || 'Suscripciones';
            recurringExpenses[category] = (recurringExpenses[category] || 0) + Math.abs(t.amount);
        }
    });
    
    const totalSubscriptions = Object.values(recurringExpenses).reduce((sum, val) => sum + val, 0);
    const subscriptionCount = Object.keys(recurringExpenses).length;
    
    if (subscriptionCount >= 3 && totalSubscriptions > 30) {
        recommendations.push({
            type: 'subscriptions_review',
            priority: 'medium',
            icon: '',
            title: 'Revisa tus suscripciones',
            description: `Detectamos ${subscriptionCount} suscripciones que suman ${formatCurrency(totalSubscriptions)}/mes. Si cancelas 1-2 que no uses frecuentemente, ahorrarías ${formatCurrency(totalSubscriptions * 0.3)}/mes (${formatCurrency(totalSubscriptions * 0.3 * 12)}/año).`,
            impact: `Ahorro potencial: ${formatCurrency(totalSubscriptions * 0.3 * 12)}/año`,
            action: {
                type: 'view_transactions',
                filter: 'subscriptions',
                text: 'Ver suscripciones'
            },
            category: 'Optimización de Gastos'
        });
    }
    
    // 3. RECOMENDACIONES DE AHORRO
    if (savingsGoal && savingsGoal > 0) {
        const currentSavings = transactionsBalance;
        const remaining = savingsGoal - currentSavings;
        const monthsToGoal = savingsRate > 0 ? Math.ceil(remaining / (monthSavings || 1)) : 999;
        
        if (remaining > 0) {
            if (savingsRate < 10 && monthIncome > 0) {
                const targetRate = 20;
                const targetSavings = monthIncome * (targetRate / 100);
                const monthsWithTarget = Math.ceil(remaining / targetSavings);
                
                recommendations.push({
                    type: 'savings_increase',
                    priority: 'medium',
                    icon: '',
                    title: 'Aumenta tu tasa de ahorro',
                    description: `Con tu tasa actual (${savingsRate.toFixed(1)}%), alcanzarías tu meta en ${monthsToGoal} meses. Si aumentas al ${targetRate}%, lo lograrías en ${monthsWithTarget} meses.`,
                    impact: `Ahorro adicional: ${formatCurrency(targetSavings - monthSavings)}/mes`,
                    action: {
                        type: 'view_summary',
                        text: 'Ver resumen'
                    },
                    category: 'Ahorro'
                });
            }
        }
    }
    
    // Recomendación de fondo de emergencia
    if (liquidityRatio < 3 && transactionsBalance > 0) {
        const targetEmergencyFund = avgMonthlyExpenses * 6;
        const missing = targetEmergencyFund - transactionsBalance;
        
        if (missing > 0) {
            recommendations.push({
                type: 'emergency_fund',
                priority: liquidityRatio < 1 ? 'high' : 'medium',
                icon: '',
                title: 'Construye tu fondo de emergencia',
                description: `Tu liquidez es de ${liquidityRatio.toFixed(1)} meses. Lo ideal es 3-6 meses. Te faltan ${formatCurrency(missing)} para alcanzar 6 meses de gastos (${formatCurrency(targetEmergencyFund)}).`,
                impact: `Meta: ${formatCurrency(targetEmergencyFund)}`,
                action: {
                    type: 'view_summary',
                    text: 'Ver resumen'
                },
                category: 'Ahorro'
            });
        }
    }
    
    // 4. OPTIMIZACIÓN DE DEUDA
    if (debtToIncomeRatio > 30) {
        const targetRatio = 20;
        const neededReduction = (debtToIncomeRatio - targetRatio) / 100 * avgMonthlyIncome;
        
        recommendations.push({
            type: 'debt_optimization',
            priority: debtToIncomeRatio > 40 ? 'high' : 'medium',
            icon: '',
            title: 'Reduce tu ratio de endeudamiento',
            description: `Tu ratio es ${debtToIncomeRatio.toFixed(1)}% (ideal: <20%). Para alcanzarlo, necesitas reducir ${formatCurrency(neededReduction)}/mes en cuotas o aumentar tus ingresos.`,
            impact: `Reducción necesaria: ${formatCurrency(neededReduction)}/mes`,
            action: {
                type: 'view_loans',
                text: 'Ver préstamos'
            },
            category: 'Optimización de Deuda'
        });
    }
    
    // 5. ALERTAS DE PRESUPUESTO
    budgets.forEach(budget => {
        const budgetTransactions = monthTransactions.filter(t => 
            t.categoryGeneral === budget.category_id || t.categorySpecific === budget.category_id
        );
        const spent = Math.abs(budgetTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0));
        const percentage = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const daysPassed = now.getDate();
        const expectedSpending = (budget.amount / daysInMonth) * daysPassed;
        
        if (percentage > 90 && spent > expectedSpending * 1.1) {
            recommendations.push({
                type: 'budget_alert',
                priority: percentage > 100 ? 'high' : 'medium',
                icon: '',
                title: `Presupuesto "${budget.category_id}" casi agotado`,
                description: `Has gastado ${percentage.toFixed(1)}% del presupuesto (${formatCurrency(spent)} de ${formatCurrency(budget.amount)}) y aún quedan ${daysInMonth - daysPassed} días del mes.`,
                impact: `Exceso: ${formatCurrency(Math.max(0, spent - budget.amount))}`,
                action: {
                    type: 'view_budgets',
                    text: 'Ver presupuestos'
                },
                category: 'Presupuesto'
            });
        }
    });
    
    // 6. RECOMENDACIONES DE INVERSIÓN
    if (transactionsBalance > avgMonthlyExpenses * 6 && investmentsValue < transactionsBalance * 0.3) {
        const excessCash = transactionsBalance - (avgMonthlyExpenses * 6);
        const recommendedInvestment = excessCash * 0.5;
        
        recommendations.push({
            type: 'investment_opportunity',
            priority: 'low',
            icon: '',
            title: 'Considera invertir el exceso de efectivo',
            description: `Tienes ${formatCurrency(excessCash)} más de lo necesario para tu fondo de emergencia. Considera invertir ${formatCurrency(recommendedInvestment)} para hacer crecer tu patrimonio.`,
            impact: `Oportunidad: ${formatCurrency(recommendedInvestment)}`,
            action: {
                type: 'view_investments',
                text: 'Ver inversiones'
            },
            category: 'Inversión'
        });
    }
    
    // 7. ANÁLISIS DE CATEGORÍAS DE GASTOS
    const categoryExpenses = {};
    monthTransactions.filter(t => t.type === 'expense').forEach(t => {
        const cat = t.categorySpecific || t.categoryGeneral || 'Otros';
        categoryExpenses[cat] = (categoryExpenses[cat] || 0) + Math.abs(t.amount);
    });
    
    const totalExpenses = Object.values(categoryExpenses).reduce((sum, val) => sum + val, 0);
    Object.entries(categoryExpenses).forEach(([category, amount]) => {
        const percentage = totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0;
        
        if (percentage > 25 && amount > 200) {
            recommendations.push({
                type: 'category_review',
                priority: 'low',
                icon: '',
                title: `Revisa gastos en "${category}"`,
                description: `Esta categoría representa el ${percentage.toFixed(1)}% de tus gastos (${formatCurrency(amount)}/mes). Considera si todos estos gastos son necesarios.`,
                impact: `Gasto mensual: ${formatCurrency(amount)}`,
                action: {
                    type: 'view_transactions',
                    filter: category,
                    text: 'Ver transacciones'
                },
                category: 'Optimización de Gastos'
            });
        }
    });
    
    // 8. RECOMENDACIONES DE PATRIMONIO
    patrimonio.forEach(prop => {
        const purchaseDate = prop.purchase_date ? new Date(prop.purchase_date) : null;
        if (purchaseDate) {
            const monthsSincePurchase = (now - purchaseDate) / (1000 * 60 * 60 * 24 * 30);
            if (monthsSincePurchase > 12 && prop.value_history && prop.value_history.length < 3) {
                recommendations.push({
                    type: 'patrimonio_update',
                    priority: 'low',
                    icon: '',
                    title: `Actualiza el valor de "${prop.name}"`,
                    description: `Han pasado ${Math.floor(monthsSincePurchase)} meses desde la última actualización. Considera actualizar el valor actual para tener un seguimiento preciso.`,
                    impact: 'Mejor seguimiento',
                    action: {
                        type: 'edit_patrimonio',
                        patrimonioId: prop._id || prop.id,
                        text: 'Actualizar valor'
                    },
                    category: 'Patrimonio'
                });
            }
        }
    });
    
    // ==================== NUEVAS FUNCIONALIDADES ====================
    
    // 9. ANÁLISIS TEMPORAL Y TENDENCIAS
    const last3Months = [];
    for (let i = 1; i <= 3; i++) {
        const monthDate = new Date(currentYear, currentMonth - i, 1);
        const monthTrans = transactions.filter(t => {
            const tDate = new Date(t.date);
            return tDate.getMonth() === monthDate.getMonth() && tDate.getFullYear() === monthDate.getFullYear();
        });
        const monthInc = monthTrans.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
        const monthExp = Math.abs(monthTrans.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0));
        last3Months.push({ income: monthInc, expenses: monthExp, savings: monthInc - monthExp });
    }
    
    if (last3Months.length >= 2) {
        const avgExpenses3Months = last3Months.reduce((sum, m) => sum + m.expenses, 0) / last3Months.length;
        const expenseIncrease = ((monthExpenses - avgExpenses3Months) / avgExpenses3Months) * 100;
        
        if (expenseIncrease > 20 && monthExpenses > 500) {
            recommendations.push({
                type: 'expense_trend',
                priority: expenseIncrease > 40 ? 'high' : 'medium',
                icon: '',
                title: 'Aumento significativo en gastos',
                description: `Tus gastos han aumentado un ${expenseIncrease.toFixed(1)}% comparado con el promedio de los últimos 3 meses (${formatCurrency(monthExpenses)} vs ${formatCurrency(avgExpenses3Months)}). Revisa qué categorías han aumentado más.`,
                impact: `Aumento: ${formatCurrency(monthExpenses - avgExpenses3Months)}/mes`,
                action: {
                    type: 'view_transactions',
                    filter: 'expenses',
                    text: 'Ver gastos'
                },
                category: 'Análisis de Tendencias'
            });
        }
        
        const avgSavings3Months = last3Months.reduce((sum, m) => sum + m.savings, 0) / last3Months.length;
        if (monthSavings < avgSavings3Months * 0.5 && monthSavings > 0) {
            recommendations.push({
                type: 'savings_decline',
                priority: 'medium',
                icon: '',
                title: 'Tasa de ahorro en declive',
                description: `Tu ahorro este mes (${formatCurrency(monthSavings)}) es significativamente menor que el promedio de los últimos 3 meses (${formatCurrency(avgSavings3Months)}). Considera revisar tus gastos.`,
                impact: `Diferencia: ${formatCurrency(avgSavings3Months - monthSavings)}`,
                action: {
                    type: 'view_summary',
                    text: 'Ver resumen'
                },
                category: 'Análisis de Tendencias'
            });
        }
    }
    
    // 10. DETECCIÓN MEJORADA DE PATRONES - GASTOS RECURRENTES AUTOMÁTICOS
    const recurringPatterns = {};
    const last6Months = [];
    for (let i = 0; i < 6; i++) {
        const monthDate = new Date(currentYear, currentMonth - i, 1);
        const monthTrans = transactions.filter(t => {
            const tDate = new Date(t.date);
            return tDate.getMonth() === monthDate.getMonth() && tDate.getFullYear() === monthDate.getFullYear();
        });
        last6Months.push(monthTrans.filter(t => t.type === 'expense'));
    }
    
    // Detectar gastos recurrentes (mismo monto aproximado, misma fecha aproximada)
    const expenseMap = {};
    last6Months.flat().forEach(t => {
        const key = `${t.description?.toLowerCase() || ''}_${Math.round(Math.abs(t.amount) / 10) * 10}`;
        if (!expenseMap[key]) {
            expenseMap[key] = { count: 0, total: 0, dates: [], category: t.categorySpecific || t.categoryGeneral };
        }
        expenseMap[key].count++;
        expenseMap[key].total += Math.abs(t.amount);
        expenseMap[key].dates.push(new Date(t.date));
    });
    
    Object.entries(expenseMap).forEach(([key, data]) => {
        if (data.count >= 3 && data.total / data.count > 10) {
            const avgAmount = data.total / data.count;
            const isMonthly = data.count >= 4;
            const lastDate = new Date(Math.max(...data.dates));
            const daysSinceLast = (now - lastDate) / (1000 * 60 * 60 * 24);
            
            if (isMonthly && daysSinceLast > 45) {
                recommendations.push({
                    type: 'missing_recurring',
                    priority: 'low',
                    icon: '',
                    title: `Posible gasto recurrente faltante`,
                    description: `Detectamos un gasto recurrente de aproximadamente ${formatCurrency(avgAmount)} en "${data.category}" que normalmente aparece mensualmente, pero no se ha registrado en los últimos ${Math.floor(daysSinceLast)} días.`,
                    impact: `Monto esperado: ${formatCurrency(avgAmount)}`,
                    action: {
                        type: 'view_transactions',
                        filter: data.category,
                        text: 'Ver transacciones'
                    },
                    category: 'Detección de Patrones'
                });
            }
        }
    });
    
    // Detectar duplicados potenciales
    const recentTransactions = transactions.filter(t => {
        const tDate = new Date(t.date);
        const daysDiff = (now - tDate) / (1000 * 60 * 60 * 24);
        return daysDiff <= 7;
    });
    
    const duplicateCheck = {};
    recentTransactions.forEach(t => {
        const key = `${t.description?.toLowerCase() || ''}_${Math.abs(t.amount).toFixed(2)}`;
        if (!duplicateCheck[key]) {
            duplicateCheck[key] = [];
        }
        duplicateCheck[key].push(t);
    });
    
    Object.entries(duplicateCheck).forEach(([key, dups]) => {
        if (dups.length > 1 && Math.abs(dups[0].amount) > 20) {
            recommendations.push({
                type: 'possible_duplicate',
                priority: 'medium',
                icon: '',
                title: 'Posibles transacciones duplicadas',
                description: `Detectamos ${dups.length} transacciones similares de ${formatCurrency(Math.abs(dups[0].amount))} con la misma descripción en los últimos 7 días. Verifica si son duplicados.`,
                impact: `Monto total: ${formatCurrency(dups.reduce((sum, t) => sum + Math.abs(t.amount), 0))}`,
                action: {
                    type: 'view_transactions',
                    filter: 'recent',
                    text: 'Ver transacciones recientes'
                },
                category: 'Detección de Patrones'
            });
        }
    });
    
    // 11. COMPARACIÓN CON BENCHMARKS
    const benchmarkSavingsRate = 20; // 20% es un buen estándar
    if (savingsRate < benchmarkSavingsRate && monthIncome > 1000) {
        const benchmarkSavings = monthIncome * (benchmarkSavingsRate / 100);
        recommendations.push({
            type: 'benchmark_savings',
            priority: 'low',
            icon: '',
            title: 'Tasa de ahorro por debajo del estándar',
            description: `Tu tasa de ahorro es del ${savingsRate.toFixed(1)}%, mientras que el estándar recomendado es del ${benchmarkSavingsRate}%. Si ahorraras ${formatCurrency(benchmarkSavings)}/mes en lugar de ${formatCurrency(monthSavings)}, tendrías ${formatCurrency((benchmarkSavings - monthSavings) * 12)} más al año.`,
            impact: `Diferencia anual: ${formatCurrency((benchmarkSavings - monthSavings) * 12)}`,
            action: {
                type: 'view_summary',
                text: 'Ver resumen'
            },
            category: 'Comparación con Estándares'
        });
    }
    
    const benchmarkDebtRatio = 20; // 20% es el estándar
    if (debtToIncomeRatio > benchmarkDebtRatio && debtToIncomeRatio < 30) {
        recommendations.push({
            type: 'benchmark_debt',
            priority: 'medium',
            icon: '',
            title: 'Ratio de endeudamiento por encima del estándar',
            description: `Tu ratio de endeudamiento es del ${debtToIncomeRatio.toFixed(1)}%, mientras que el estándar recomendado es del ${benchmarkDebtRatio}% o menos. Estás ${(debtToIncomeRatio - benchmarkDebtRatio).toFixed(1)} puntos porcentuales por encima.`,
            impact: `Reducción necesaria: ${formatCurrency((debtToIncomeRatio - benchmarkDebtRatio) / 100 * avgMonthlyIncome)}/mes`,
            action: {
                type: 'view_loans',
                text: 'Ver préstamos'
            },
            category: 'Comparación con Estándares'
        });
    }
    
    // 12. RECOMENDACIONES DE INGRESOS
    if (monthIncome > 0 && monthSavings < monthIncome * 0.1) {
        const potentialIncomeIncrease = monthIncome * 0.1;
        recommendations.push({
            type: 'income_opportunity',
            priority: 'low',
            icon: '',
            title: 'Considera aumentar tus ingresos',
            description: `Con una tasa de ahorro del ${savingsRate.toFixed(1)}%, podrías beneficiarte de aumentar tus ingresos. Un aumento del 10% (${formatCurrency(potentialIncomeIncrease)}/mes) te daría más margen para ahorrar e invertir. Considera negociar un aumento, buscar ingresos pasivos o monetizar habilidades.`,
            impact: `Ingreso adicional potencial: ${formatCurrency(potentialIncomeIncrease)}/mes`,
            action: {
                type: 'view_summary',
                text: 'Ver resumen'
            },
            category: 'Optimización de Ingresos'
        });
    }
    
    // 13. OPTIMIZACIÓN FISCAL
    const currentMonthNum = currentMonth + 1;
    if (currentMonthNum === 11 || currentMonthNum === 12) {
        const totalYearIncome = transactions.filter(t => {
            const tDate = new Date(t.date);
            return tDate.getFullYear() === currentYear && t.type === 'income';
        }).reduce((sum, t) => sum + t.amount, 0);
        
        if (totalYearIncome > 12000) {
            recommendations.push({
                type: 'tax_optimization',
                priority: 'medium',
                icon: '',
                title: 'Optimización fiscal de fin de año',
                description: `Estamos cerca del fin del año fiscal. Considera maximizar deducciones fiscales: aportaciones a planes de pensiones, donaciones, gastos deducibles. Tu ingreso anual es de ${formatCurrency(totalYearIncome)}.`,
                impact: 'Ahorro fiscal potencial',
                action: {
                    type: 'view_summary',
                    text: 'Ver resumen'
                },
                category: 'Optimización Fiscal'
            });
        }
    }
    
    // 14. DIVERSIFICACIÓN DE INVERSIONES
    if (investments.length > 0) {
        const investmentTypes = {};
        investments.forEach(inv => {
            const type = inv.type || 'other';
            investmentTypes[type] = (investmentTypes[type] || 0) + inv.current_value;
        });
        
        const totalInvValue = Object.values(investmentTypes).reduce((sum, val) => sum + val, 0);
        const dominantType = Object.entries(investmentTypes).sort((a, b) => b[1] - a[1])[0];
        const dominantPercentage = (dominantType[1] / totalInvValue) * 100;
        
        if (dominantPercentage > 70 && investments.length > 1) {
            recommendations.push({
                type: 'investment_diversification',
                priority: 'low',
                icon: '',
                title: 'Considera diversificar tus inversiones',
                description: `El ${dominantPercentage.toFixed(1)}% de tu cartera está concentrado en ${dominantType[0]}. Para reducir el riesgo, considera diversificar en otros tipos de inversión (acciones, bonos, fondos, inmuebles).`,
                impact: `Concentración actual: ${dominantPercentage.toFixed(1)}%`,
                action: {
                    type: 'view_investments',
                    text: 'Ver inversiones'
                },
                category: 'Diversificación'
            });
        }
    }
    
    // 15. GASTOS INNECESARIOS AVANZADOS
    // Detectar servicios similares/duplicados
    const serviceCategories = ['Streaming', 'Gym', 'Suscripciones', 'Premium', 'Pro'];
    const serviceExpenses = {};
    monthTransactions.filter(t => t.type === 'expense').forEach(t => {
        const cat = t.categorySpecific || t.categoryGeneral || '';
        const desc = t.description?.toLowerCase() || '';
        serviceCategories.forEach(service => {
            if (cat.includes(service) || desc.includes(service.toLowerCase())) {
                if (!serviceExpenses[service]) {
                    serviceExpenses[service] = [];
                }
                serviceExpenses[service].push(t);
            }
        });
    });
    
    Object.entries(serviceExpenses).forEach(([service, exps]) => {
        if (exps.length > 2) {
            const total = exps.reduce((sum, t) => sum + Math.abs(t.amount), 0);
            recommendations.push({
                type: 'duplicate_services',
                priority: 'medium',
                icon: '',
                title: `Múltiples servicios de ${service}`,
                description: `Tienes ${exps.length} servicios diferentes de ${service} que suman ${formatCurrency(total)}/mes. Considera consolidar o cancelar los que uses menos.`,
                impact: `Gasto mensual: ${formatCurrency(total)}`,
                action: {
                    type: 'view_transactions',
                    filter: service,
                    text: 'Ver servicios'
                },
                category: 'Optimización de Gastos'
            });
        }
    });
    
    // 16. OBJETIVOS PERSONALIZADOS MÚLTIPLES
    // (Esto requeriría una estructura de datos adicional, por ahora usamos savingsGoal)
    if (savingsGoal && savingsGoal > 0) {
        const progress = (transactionsBalance / savingsGoal) * 100;
        if (progress > 50 && progress < 80) {
            recommendations.push({
                type: 'goal_progress',
                priority: 'low',
                icon: '',
                title: 'Buen progreso hacia tu meta',
                description: `Has alcanzado el ${progress.toFixed(1)}% de tu meta de ahorro (${formatCurrency(transactionsBalance)} de ${formatCurrency(savingsGoal)}). ¡Sigue así!`,
                impact: `Faltan: ${formatCurrency(savingsGoal - transactionsBalance)}`,
                action: {
                    type: 'view_summary',
                    text: 'Ver resumen'
                },
                category: 'Objetivos'
            });
        }
    }
    
    // 17. ALERTAS PROACTIVAS - VENCIMIENTOS
    activeDebtLoans.forEach(loan => {
        const endDate = new Date(loan.end_date);
        const daysUntilEnd = (endDate - now) / (1000 * 60 * 60 * 24);
        
        if (daysUntilEnd <= 90 && daysUntilEnd > 0) {
            recommendations.push({
                type: 'loan_ending',
                priority: daysUntilEnd <= 30 ? 'high' : 'medium',
                icon: '',
                title: `Préstamo "${loan.name}" finaliza pronto`,
                description: `Tu préstamo finaliza en ${Math.floor(daysUntilEnd)} días. Asegúrate de tener el capital restante disponible o considera refinanciar si es necesario.`,
                impact: `Días restantes: ${Math.floor(daysUntilEnd)}`,
                action: {
                    type: 'edit_loan',
                    loanId: loan._id || loan.id,
                    text: 'Ver préstamo'
                },
                category: 'Alertas Proactivas'
            });
        }
    });
    
    // 18. ANÁLISIS DE CUENTAS BANCARIAS
    if (accounts.length > 3) {
        recommendations.push({
            type: 'account_consolidation',
            priority: 'low',
            icon: '',
            title: 'Considera consolidar cuentas bancarias',
            description: `Tienes ${accounts.length} cuentas bancarias. Consolidar algunas podría simplificar tu gestión financiera y reducir comisiones. Considera mantener solo las cuentas que realmente uses.`,
            impact: `Número de cuentas: ${accounts.length}`,
            action: {
                type: 'view_summary',
                text: 'Ver cuentas'
            },
            category: 'Optimización de Cuentas'
        });
    }
    
    const totalAccountBalance = accounts.reduce((sum, acc) => sum + (acc.balance || 0), 0);
    if (totalAccountBalance > 50000 && investmentsValue < totalAccountBalance * 0.2) {
        recommendations.push({
            type: 'excess_cash',
            priority: 'low',
            icon: '',
            title: 'Exceso de efectivo en cuentas',
            description: `Tienes ${formatCurrency(totalAccountBalance)} en cuentas bancarias pero solo ${formatCurrency(investmentsValue)} invertido. Considera mover parte del exceso a cuentas de ahorro con mejor interés o inversiones.`,
            impact: `Efectivo disponible: ${formatCurrency(totalAccountBalance)}`,
            action: {
                type: 'view_investments',
                text: 'Ver inversiones'
            },
            category: 'Optimización de Cuentas'
        });
    }
    
    // 19. ANÁLISIS AVANZADO DE PRÉSTAMOS
    if (activeDebtLoans.length > 1) {
        // Estrategia: pagar primero el préstamo con mayor tasa
        const sortedLoans = [...activeDebtLoans].sort((a, b) => (b.interest_rate || 0) - (a.interest_rate || 0));
        const highestRateLoan = sortedLoans[0];
        const secondHighestRate = sortedLoans[1]?.interest_rate || 0;
        
        if (highestRateLoan.interest_rate > secondHighestRate + 2) {
            recommendations.push({
                type: 'loan_strategy',
                priority: 'medium',
                icon: '',
                title: `Prioriza pagar "${highestRateLoan.name}"`,
                description: `Este préstamo tiene la tasa más alta (${highestRateLoan.interest_rate}%) de tus ${activeDebtLoans.length} préstamos. Pagarlo primero te ahorrará más en intereses. Considera la estrategia de "avalancha de deuda".`,
                impact: `Tasa: ${highestRateLoan.interest_rate}%`,
                action: {
                    type: 'edit_loan',
                    loanId: highestRateLoan._id || highestRateLoan.id,
                    text: 'Ver préstamo'
                },
                category: 'Estrategia de Deuda'
            });
        }
    }
    
    // 20. ANÁLISIS AVANZADO DE PATRIMONIO
    patrimonio.forEach(prop => {
        const purchaseValue = prop.purchase_value || prop.initial_value || 0;
        const currentValue = prop.current_value || 0;
        if (purchaseValue > 0 && currentValue > 0) {
            const appreciation = ((currentValue - purchaseValue) / purchaseValue) * 100;
            const purchaseDate = prop.purchase_date ? new Date(prop.purchase_date) : null;
            
            if (purchaseDate) {
                const yearsOwned = (now - purchaseDate) / (1000 * 60 * 60 * 24 * 365);
                const annualAppreciation = appreciation / yearsOwned;
                
                if (annualAppreciation < -5 && yearsOwned > 1) {
                    recommendations.push({
                        type: 'patrimonio_depreciation',
                        priority: 'medium',
                        icon: '',
                        title: `Depreciación significativa en "${prop.name}"`,
                        description: `El valor de "${prop.name}" ha disminuido un ${Math.abs(appreciation).toFixed(1)}% desde la compra (${Math.abs(annualAppreciation).toFixed(1)}%/año). Considera revisar el valor o evaluar si es el momento de vender.`,
                        impact: `Depreciación: ${Math.abs(appreciation).toFixed(1)}%`,
                        action: {
                            type: 'edit_patrimonio',
                            patrimonioId: prop._id || prop.id,
                            text: 'Ver patrimonio'
                        },
                        category: 'Análisis de Patrimonio'
                    });
                } else if (annualAppreciation > 10 && yearsOwned > 2) {
                    recommendations.push({
                        type: 'patrimonio_appreciation',
                        priority: 'low',
                        icon: '',
                        title: `Buena apreciación en "${prop.name}"`,
                        description: `El valor de "${prop.name}" ha aumentado un ${appreciation.toFixed(1)}% desde la compra (${annualAppreciation.toFixed(1)}%/año). Considera si es momento de realizar ganancias o mantener para más crecimiento.`,
                        impact: `Apreciación: ${appreciation.toFixed(1)}%`,
                        action: {
                            type: 'edit_patrimonio',
                            patrimonioId: prop._id || prop.id,
                            text: 'Ver patrimonio'
                        },
                        category: 'Análisis de Patrimonio'
                    });
                }
            }
        }
    });
    
    // 21. EFICIENCIA ENERGÉTICA
    const utilityCategories = ['Luz', 'Agua', 'Gas', 'Calefacción', 'Internet', 'Teléfono'];
    const utilityExpenses = {};
    monthTransactions.filter(t => t.type === 'expense').forEach(t => {
        const cat = t.categorySpecific || t.categoryGeneral || '';
        utilityCategories.forEach(util => {
            if (cat.includes(util)) {
                if (!utilityExpenses[util]) {
                    utilityExpenses[util] = { amount: 0, count: 0 };
                }
                utilityExpenses[util].amount += Math.abs(t.amount);
                utilityExpenses[util].count++;
            }
        });
    });
    
    Object.entries(utilityExpenses).forEach(([util, data]) => {
        const avgMonthly = data.amount / Math.max(data.count, 1);
        // Benchmarks aproximados (ajustar según región)
        const benchmarks = {
            'Luz': 80,
            'Agua': 40,
            'Gas': 60,
            'Calefacción': 100,
            'Internet': 50,
            'Teléfono': 30
        };
        
        const benchmark = benchmarks[util];
        if (benchmark && avgMonthly > benchmark * 1.5) {
            recommendations.push({
                type: 'utility_optimization',
                priority: 'medium',
                icon: '',
                title: `Gasto alto en ${util}`,
                description: `Tu gasto promedio en ${util} es de ${formatCurrency(avgMonthly)}/mes, significativamente por encima del promedio (${formatCurrency(benchmark)}). Considera revisar tu consumo, cambiar de proveedor o mejorar la eficiencia energética.`,
                impact: `Ahorro potencial: ${formatCurrency(avgMonthly - benchmark)}/mes`,
                action: {
                    type: 'view_transactions',
                    filter: util,
                    text: 'Ver gastos'
                },
                category: 'Eficiencia Energética'
            });
        }
    });
    
    // 22. PLANIFICACIÓN DE RETIRO
    // Usar edad estimada basada en datos financieros o default 35
    const userAge = 35; // TODO: Obtener del perfil del usuario cuando esté disponible
    const retirementAge = 65;
    const yearsToRetirement = retirementAge - userAge;
    const estimatedMonthlyNeeds = avgMonthlyExpenses * 0.8; // 80% de gastos actuales
    const totalNeeded = estimatedMonthlyNeeds * 12 * 20; // 20 años de retiro
    const currentNetWorth = transactionsBalance + investmentsValue + patrimonioValue - 
        activeDebtLoans.reduce((sum, l) => {
            const amort = calculateAmortizationTable(l.principal, l.interest_rate, l.monthly_payment, l.start_date, l.total_paid || 0, l.early_payments || []);
            return sum + amort.finalBalance;
        }, 0);
    
    if (yearsToRetirement > 0 && yearsToRetirement <= 30) {
        const monthlySavingsNeeded = (totalNeeded - currentNetWorth) / (yearsToRetirement * 12);
        const currentMonthlySavings = monthSavings;
        
        if (monthlySavingsNeeded > currentMonthlySavings * 1.2) {
            recommendations.push({
                type: 'retirement_planning',
                priority: 'low',
                icon: '',
                title: 'Planificación para el retiro',
                description: `Para mantener tu nivel de vida en el retiro, necesitarías ahorrar aproximadamente ${formatCurrency(monthlySavingsNeeded)}/mes. Actualmente ahorras ${formatCurrency(currentMonthlySavings)}/mes. Considera aumentar tu ahorro o revisar tus expectativas de retiro.`,
                impact: `Diferencia: ${formatCurrency(monthlySavingsNeeded - currentMonthlySavings)}/mes`,
                action: {
                    type: 'view_summary',
                    text: 'Ver resumen'
                },
                category: 'Planificación de Retiro'
            });
        }
    }
    
    // 23. SISTEMA DE SEGUIMIENTO (esto se implementará en la UI)
    // Por ahora solo generamos las recomendaciones
    
    // Ordenar por prioridad (high > medium > low)
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    recommendations.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
    
    return recommendations.slice(0, 15); // Aumentar límite a 15 recomendaciones
}

// Mostrar recomendaciones en la interfaz
function updateRecommendations() {
    const container = document.getElementById('recommendationsContainer');
    if (!container) return;
    
    const recommendations = generateRecommendations();
    
    container.innerHTML = '';
    
    if (recommendations.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1/-1; padding: 40px; text-align: center; background: var(--bg-secondary); border-radius: 12px; border: 1px solid var(--border-color);">
                <h3 style="margin: 0 0 8px 0; color: var(--text-primary); font-size: 18px;">¡Todo está en orden!</h3>
                <p style="margin: 0; color: var(--text-secondary); font-size: 14px;">No hay recomendaciones específicas en este momento. Sigue así.</p>
            </div>
        `;
        return;
    }
    
    recommendations.forEach((rec, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.style.padding = 'clamp(16px, 4vw, 20px)';
        card.style.borderLeft = `4px solid ${
            rec.priority === 'high' ? 'var(--danger)' :
            rec.priority === 'medium' ? 'var(--warning)' :
            'var(--primary)'
        }`;
        card.style.position = 'relative';
        card.style.transition = 'transform 0.2s, box-shadow 0.2s';
        card.style.cursor = 'default';
        card.style.width = '100%';
        card.style.boxSizing = 'border-box';
        
        card.onmouseenter = () => {
            card.style.transform = 'translateY(-2px)';
            card.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
        };
        card.onmouseleave = () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = 'none';
        };
        
        const priorityBadge = {
            high: { text: 'Alta', color: 'var(--danger)', bg: 'rgba(239, 68, 68, 0.1)' },
            medium: { text: 'Media', color: 'var(--warning)', bg: 'rgba(251, 191, 36, 0.1)' },
            low: { text: 'Baja', color: 'var(--primary)', bg: 'rgba(59, 130, 246, 0.1)' }
        }[rec.priority];
        
        // Sistema de seguimiento de recomendaciones
        const recId = `${rec.type}_${rec.title.replace(/[^a-zA-Z0-9]/g, '_')}`;
        const recStatus = localStorage.getItem(`rec_status_${recId}`) || 'pending';
        const isApplied = recStatus === 'applied';
        const isDismissed = recStatus === 'dismissed';
        
        // Si está descartada, no mostrar
        if (isDismissed) return;
        
        let actionButton = '';
        if (rec.action && !isApplied) {
            let onclickHandler = '';
            const actionId = `rec_action_${index}`;
            
            switch(rec.action.type) {
                case 'edit_loan':
                    onclickHandler = `handleRecommendationAction('edit_loan', '${String(rec.action.loanId).replace(/'/g, "\\'")}')`;
                    break;
                case 'edit_patrimonio':
                    onclickHandler = `handleRecommendationAction('edit_patrimonio', '${String(rec.action.patrimonioId).replace(/'/g, "\\'")}')`;
                    break;
                case 'view_loans':
                    onclickHandler = `handleRecommendationAction('view_loans')`;
                    break;
                case 'view_investments':
                    onclickHandler = `handleRecommendationAction('view_investments')`;
                    break;
                case 'view_budgets':
                    onclickHandler = `handleRecommendationAction('view_budgets')`;
                    break;
                case 'view_transactions':
                    onclickHandler = `handleRecommendationAction('view_transactions')`;
                    break;
                case 'view_summary':
                    onclickHandler = `handleRecommendationAction('view_summary')`;
                    break;
            }
            
            if (onclickHandler) {
                const escapedHandler = onclickHandler.replace(/"/g, '&quot;');
                actionButton = `
                    <button onclick="${escapedHandler}" 
                        style="padding: clamp(6px, 1.5vw, 8px) clamp(12px, 3vw, 16px); background: var(--primary); color: white; border: none; border-radius: 6px; font-size: clamp(11px, 2.5vw, 13px); font-weight: 600; cursor: pointer; transition: all 0.2s; white-space: nowrap; width: 100%; max-width: 200px;"
                        onmouseover="this.style.background='var(--primary-dark)'"
                        onmouseout="this.style.background='var(--primary)'">
                        ${rec.action.text}
                    </button>
                `;
            }
        }
        
        // Botones de seguimiento
        let trackingButtons = '';
        if (!isApplied) {
            trackingButtons = `
                <div style="display: flex; gap: clamp(6px, 1.5vw, 8px); margin-top: 12px; flex-wrap: wrap;">
                    <button onclick="markRecommendationAsApplied('${recId}')" 
                        style="flex: 1; min-width: 120px; padding: clamp(6px, 1.5vw, 8px) clamp(10px, 2.5vw, 12px); background: var(--success); color: white; border: none; border-radius: 6px; font-size: clamp(11px, 2.5vw, 12px); font-weight: 600; cursor: pointer; transition: all 0.2s;"
                        onmouseover="this.style.background='var(--success-dark)'"
                        onmouseout="this.style.background='var(--success)'">
                        Aplicada
                    </button>
                    <button onclick="dismissRecommendation('${recId}')" 
                        style="flex: 1; min-width: 120px; padding: clamp(6px, 1.5vw, 8px) clamp(10px, 2.5vw, 12px); background: var(--bg-tertiary); color: var(--text-secondary); border: 1px solid var(--border-color); border-radius: 6px; font-size: clamp(11px, 2.5vw, 12px); font-weight: 600; cursor: pointer; transition: all 0.2s;"
                        onmouseover="this.style.background='var(--bg-secondary)'"
                        onmouseout="this.style.background='var(--bg-tertiary)'">
                        Descartar
                    </button>
                </div>
            `;
        } else {
            trackingButtons = `
                <div style="margin-top: 12px; padding: clamp(6px, 1.5vw, 8px); background: rgba(16, 185, 129, 0.1); border-radius: 6px; border: 1px solid var(--success);">
                    <span style="font-size: clamp(11px, 2.5vw, 12px); color: var(--success); font-weight: 600;">Recomendación aplicada</span>
                </div>
            `;
        }
        
        card.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 12px; flex-wrap: wrap; gap: 8px;">
                <div style="display: flex; align-items: center; gap: 10px; flex: 1; min-width: 0;">
                    ${rec.icon ? `<span style="font-size: clamp(20px, 5vw, 24px); flex-shrink: 0;">${rec.icon}</span>` : ''}
                    <h3 style="margin: 0; font-size: clamp(14px, 3.5vw, 16px); font-weight: 700; color: var(--text-primary); word-wrap: break-word; flex: 1; min-width: 0;">${rec.title}</h3>
                </div>
                <span style="padding: 4px 10px; background: ${priorityBadge.bg}; color: ${priorityBadge.color}; border-radius: 12px; font-size: clamp(10px, 2.5vw, 11px); font-weight: 600; white-space: nowrap; flex-shrink: 0;">
                    ${priorityBadge.text}
                </span>
            </div>
            <p style="margin: 0 0 12px 0; color: var(--text-secondary); font-size: clamp(13px, 3vw, 14px); line-height: 1.6; word-wrap: break-word;">
                ${rec.description}
            </p>
            <div style="padding: clamp(8px, 2vw, 10px); background: var(--bg-secondary); border-radius: 8px; margin-bottom: 12px;">
                <div style="font-size: clamp(11px, 2.5vw, 12px); color: var(--text-tertiary); margin-bottom: 4px;">Impacto</div>
                <div style="font-size: clamp(13px, 3.5vw, 15px); font-weight: 700; color: var(--primary); word-wrap: break-word;">${rec.impact}</div>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; flex-wrap: wrap; gap: 8px;">
                <span style="font-size: clamp(10px, 2.5vw, 11px); color: var(--text-tertiary); padding: 4px 8px; background: var(--bg-secondary); border-radius: 6px; white-space: nowrap;">
                    ${rec.category}
                </span>
                <div style="flex: 1; min-width: 0; display: flex; justify-content: flex-end;">
                    ${actionButton}
                </div>
            </div>
            ${trackingButtons}
        `;
        
        container.appendChild(card);
    });
}

// Manejar acciones de recomendaciones
function handleRecommendationAction(actionType, id = null) {
    if (typeof closeSummaryDetails === 'function') {
        closeSummaryDetails();
    }
    
    switch(actionType) {
        case 'edit_loan':
            if (id && typeof editLoan === 'function') {
                editLoan(id);
            }
            break;
        case 'edit_patrimonio':
            if (id && typeof editPatrimonio === 'function') {
                editPatrimonio(id);
            }
            break;
        case 'view_loans':
            if (typeof switchToTab === 'function') {
                switchToTab('loans', true);
            }
            break;
        case 'view_investments':
            if (typeof switchToTab === 'function') {
                switchToTab('investments', true);
            }
            break;
        case 'view_budgets':
            if (typeof switchToTab === 'function') {
                switchToTab('budgets', true);
            }
            break;
        case 'view_transactions':
            if (typeof switchToTab === 'function') {
                switchToTab('transactions', true);
            }
            break;
        case 'view_summary':
            if (typeof switchToTab === 'function') {
                switchToTab('summary', true);
            }
            break;
    }
}

// Funciones de seguimiento de recomendaciones
function markRecommendationAsApplied(recId) {
    localStorage.setItem(`rec_status_${recId}`, 'applied');
    localStorage.setItem(`rec_applied_date_${recId}`, new Date().toISOString());
    updateRecommendations();
    showToast('Recomendación marcada como aplicada', 'success');
}

function dismissRecommendation(recId) {
    localStorage.setItem(`rec_status_${recId}`, 'dismissed');
    updateRecommendations();
    showToast('Recomendación descartada', 'info');
}

// Exponer funciones globalmente
window.updateRecommendations = updateRecommendations;
window.handleRecommendationAction = handleRecommendationAction;
window.markRecommendationAsApplied = markRecommendationAsApplied;
window.dismissRecommendation = dismissRecommendation;

// Actualizar tablas de análisis
function updateAnalysisTables() {
    console.log('📊 Actualizando tablas de análisis...');
    const periodTransactions = getTransactionsByPeriod();
    const expenses = periodTransactions.filter(t => t.type === 'expense');
    const income = periodTransactions.filter(t => t.type === 'income');
    
    // Top Gastos
    const topExpenses = [...expenses]
        .sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount))
        .slice(0, 10);
    
    const topExpensesBody = document.getElementById('topExpensesBody');
    if (topExpensesBody) {
        topExpensesBody.innerHTML = '';
        if (topExpenses.length === 0) {
            topExpensesBody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 40px; color: var(--gray-500);">No hay gastos en este período</td></tr>';
        } else {
            topExpenses.forEach(t => {
                const row = document.createElement('tr');
                const category = categories.expense.find(c => c.id === t.categoryGeneral);
                const categoryName = category ? category.name : t.categoryGeneral;
                row.innerHTML = `
                    <td>${formatDate(new Date(t.date))}</td>
                    <td>${categoryName}</td>
                    <td>${t.description || '-'}</td>
                    <td style="color: var(--danger); font-weight: 600;">${formatCurrency(Math.abs(t.amount))}</td>
                `;
                topExpensesBody.appendChild(row);
            });
        }
    }
    
    // Gastos Recurrentes
    const categoryTotals = {};
    const categoryCounts = {};
    expenses.forEach(t => {
        const catId = t.categoryGeneral;
        if (!categoryTotals[catId]) {
            categoryTotals[catId] = 0;
            categoryCounts[catId] = 0;
        }
        categoryTotals[catId] += Math.abs(t.amount);
        categoryCounts[catId]++;
    });
    
    const recurringExpensesBody = document.getElementById('recurringExpensesBody');
    if (recurringExpensesBody) {
        recurringExpensesBody.innerHTML = '';
        const recurring = Object.entries(categoryTotals)
            .map(([catId, total]) => {
                const category = categories.expense.find(c => c.id === catId);
                const categoryName = category ? category.name : catId;
                const count = categoryCounts[catId];
                const months = getMonthsInPeriod();
                const avgMonthly = months > 0 ? total / months : total;
                return { categoryName, count, avgMonthly, total };
            })
            .sort((a, b) => b.total - a.total)
            .slice(0, 10);
        
        if (recurring.length === 0) {
            recurringExpensesBody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 40px; color: var(--gray-500);">No hay gastos recurrentes</td></tr>';
        } else {
            recurring.forEach(item => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${item.categoryName}</td>
                    <td>${item.count} transacciones</td>
                    <td>${formatCurrency(item.avgMonthly)}</td>
                    <td style="font-weight: 600;">${formatCurrency(item.total)}</td>
                `;
                recurringExpensesBody.appendChild(row);
            });
        }
    }
    
    // Comparativa Mensual
    const monthlyData = {};
    periodTransactions.forEach(t => {
        const date = new Date(t.date);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        if (!monthlyData[monthKey]) {
            monthlyData[monthKey] = { income: 0, expenses: 0 };
        }
        if (t.type === 'income') {
            monthlyData[monthKey].income += t.amount;
        } else {
            monthlyData[monthKey].expenses += Math.abs(t.amount);
        }
    });
    
    const monthlyComparisonBody = document.getElementById('monthlyComparisonBody');
    if (monthlyComparisonBody) {
        monthlyComparisonBody.innerHTML = '';
        const sortedMonths = Object.entries(monthlyData)
            .sort(([a], [b]) => a.localeCompare(b))
            .reverse();
        
        if (sortedMonths.length === 0) {
            monthlyComparisonBody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 40px; color: var(--gray-500);">No hay datos para este período</td></tr>';
        } else {
            sortedMonths.forEach(([monthKey, data]) => {
                const [year, month] = monthKey.split('-');
                const monthName = new Date(year, month - 1).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
                const savings = data.income - data.expenses;
                const savingsPercent = data.income > 0 ? (savings / data.income) * 100 : 0;
                
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td style="font-weight: 600;">${monthName}</td>
                    <td style="color: var(--success);">${formatCurrency(data.income)}</td>
                    <td style="color: var(--danger);">${formatCurrency(data.expenses)}</td>
                    <td style="color: ${savings >= 0 ? 'var(--success)' : 'var(--danger)'}; font-weight: 600;">${formatCurrency(savings)}</td>
                    <td style="color: ${savingsPercent >= 0 ? 'var(--success)' : 'var(--danger)'}; font-weight: 600;">${savingsPercent.toFixed(1)}%</td>
                `;
                monthlyComparisonBody.appendChild(row);
            });
        }
    }
    
    // Análisis por Categoría
    const categoryAnalysis = {};
    expenses.forEach(t => {
        const catId = t.categoryGeneral;
        if (!categoryAnalysis[catId]) {
            categoryAnalysis[catId] = { total: 0, count: 0 };
        }
        categoryAnalysis[catId].total += Math.abs(t.amount);
        categoryAnalysis[catId].count++;
    });
    
    const totalExpenses = expenses.reduce((sum, t) => sum + Math.abs(t.amount), 0);
    const months = getMonthsInPeriod();
    
    const categoryAnalysisBody = document.getElementById('categoryAnalysisBody');
    if (categoryAnalysisBody) {
        categoryAnalysisBody.innerHTML = '';
        const sorted = Object.entries(categoryAnalysis)
            .map(([catId, data]) => {
                const category = categories.expense.find(c => c.id === catId);
                const categoryName = category ? category.name : catId;
                const percent = totalExpenses > 0 ? (data.total / totalExpenses) * 100 : 0;
                const avgMonthly = months > 0 ? data.total / months : data.total;
                return { categoryName, total: data.total, percent, avgMonthly, count: data.count };
            })
            .sort((a, b) => b.total - a.total);
        
        if (sorted.length === 0) {
            categoryAnalysisBody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 40px; color: var(--gray-500);">No hay gastos por categoría</td></tr>';
        } else {
            sorted.forEach(item => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td style="font-weight: 600;">${item.categoryName}</td>
                    <td>${formatCurrency(item.total)}</td>
                    <td>${item.percent.toFixed(1)}%</td>
                    <td>${formatCurrency(item.avgMonthly)}</td>
                    <td>${item.count}</td>
                `;
                categoryAnalysisBody.appendChild(row);
            });
        }
    }
}

// Obtener número de meses en el período
function getMonthsInPeriod() {
    const chartPeriod = document.getElementById('chartPeriod')?.value || '6';
    if (chartPeriod === 'all') {
        const dates = transactions.map(t => new Date(t.date));
        if (dates.length === 0) return 1;
        const minDate = new Date(Math.min(...dates));
        const maxDate = new Date(Math.max(...dates));
        const diffTime = Math.abs(maxDate - minDate);
        const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30.44));
        return Math.max(1, diffMonths);
    }
    return parseInt(chartPeriod);
}

// Cargar contenido de políticas desde archivos
async function loadPolicyContent(file, contentId) {
    try {
        const response = await fetch(`/${file}`);
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const content = doc.querySelector('.policy-container');
        if (content) {
            // Remover el título y el back link
            const title = content.querySelector('h1');
            const backLink = content.querySelector('.back-link');
            if (title) title.remove();
            if (backLink) backLink.remove();
            document.getElementById(contentId).innerHTML = content.innerHTML;
        }
    } catch (error) {
        console.error(`Error cargando ${file}:`, error);
        document.getElementById(contentId).innerHTML = '<p>Error al cargar el contenido.</p>';
    }
}

// Mostrar modales de políticas
function showPrivacyModal() {
    const modal = document.getElementById('privacyModal');
    if (modal) {
        loadPolicyContent('privacy.html', 'privacyContent');
        modal.style.display = 'flex';
    }
}

function closePrivacyModal() {
    const modal = document.getElementById('privacyModal');
    if (modal) modal.style.display = 'none';
}

function showCookiesModal() {
    const modal = document.getElementById('cookiesModal');
    if (modal) {
        loadPolicyContent('cookies.html', 'cookiesContent');
        modal.style.display = 'flex';
    }
}

function closeCookiesModal() {
    const modal = document.getElementById('cookiesModal');
    if (modal) modal.style.display = 'none';
}

function showTermsModal() {
    const modal = document.getElementById('termsModal');
    if (modal) {
        loadPolicyContent('terms.html', 'termsContent');
        modal.style.display = 'flex';
    }
}

function closeTermsModal() {
    const modal = document.getElementById('termsModal');
    if (modal) modal.style.display = 'none';
}

// Cerrar modales al hacer clic fuera
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const modalsToClose = [
            'privacyModal',
            'cookiesModal', 
            'termsModal', 
            'summaryDetailsModal',
            'categoryDetailsModal',
            'savingsGoalModal',
            'addMoneyInvestmentModal',
            'updateInvestmentValueModal',
            'updateAccountBalanceModal',
            'updateAssetValueModal',
            'userProfileModal',
            'chartModal',
            'amortizationModal',
            'earlyPaymentModal'
        ];
        
        modalsToClose.forEach(modalId => {
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.addEventListener('click', (e) => {
                    if (e.target === modal) {
                        if (modalId === 'privacyModal') closePrivacyModal();
                        else if (modalId === 'cookiesModal') closeCookiesModal();
                        else if (modalId === 'termsModal') closeTermsModal();
                        else if (modalId === 'summaryDetailsModal') closeSummaryDetails();
                        else if (modalId === 'categoryDetailsModal') closeCategoryDetailsModal();
                        else if (modalId === 'savingsGoalModal') closeSavingsGoalModal();
                        else if (modalId === 'addMoneyInvestmentModal') closeAddMoneyInvestmentModal();
                        else if (modalId === 'updateInvestmentValueModal') closeUpdateInvestmentValueModal();
                        else if (modalId === 'updateAccountBalanceModal') closeUpdateAccountBalanceModal();
                        else if (modalId === 'updateAssetValueModal') {
                            const updateAssetModal = document.getElementById('updateAssetValueModal');
                            if (updateAssetModal) updateAssetModal.style.display = 'none';
                        }
                        else if (modalId === 'userProfileModal') closeUserProfile();
                        else if (modalId === 'chartModal') closeChartModal();
                        else if (modalId === 'amortizationModal') closeAmortizationModal();
                        else if (modalId === 'earlyPaymentModal') closeEarlyPaymentModal();
                        else modal.style.display = 'none';
                    }
                });
            }
        });
    });
}

// Asegurar que las funciones de políticas estén disponibles globalmente ANTES de exponerlas
// (ya están definidas arriba, solo las exponemos)

// Mostrar modal de perfil de usuario
function showUserProfile() {
    const modal = document.getElementById('userProfileModal');
    if (!modal) {
        console.error('Modal de perfil no encontrado');
        return;
    }
    
    // Cargar datos del perfil
    const emailInput = document.getElementById('profileEmail');
    const usernameInput = document.getElementById('profileUsername');
    const firstNameInput = document.getElementById('profileFirstName');
    const lastNameInput = document.getElementById('profileLastName');
    const ageInput = document.getElementById('profileAge');
    const phoneInput = document.getElementById('profilePhone');
    const addressInput = document.getElementById('profileAddress');
    const cityInput = document.getElementById('profileCity');
    const countryInput = document.getElementById('profileCountry');
    const birthDateInput = document.getElementById('profileBirthDate');
    const notesInput = document.getElementById('profileNotes');
    
    if (emailInput) emailInput.value = currentUserEmail || '';
    if (usernameInput) usernameInput.value = currentUser || '';
    if (firstNameInput) firstNameInput.value = userProfile.firstName || '';
    if (lastNameInput) lastNameInput.value = userProfile.lastName || '';
    if (ageInput) ageInput.value = userProfile.age || '';
    if (phoneInput) phoneInput.value = userProfile.phone || '';
    if (addressInput) addressInput.value = userProfile.address || '';
    if (cityInput) cityInput.value = userProfile.city || '';
    if (countryInput) countryInput.value = userProfile.country || '';
    if (birthDateInput) birthDateInput.value = userProfile.birthDate || '';
    if (notesInput) notesInput.value = userProfile.notes || '';
    
    modal.style.display = 'flex';
}

// Cerrar modal de perfil
function closeUserProfile() {
    const modal = document.getElementById('userProfileModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Guardar perfil de usuario
async function saveUserProfile() {
    const firstName = document.getElementById('profileFirstName')?.value.trim() || '';
    const lastName = document.getElementById('profileLastName')?.value.trim() || '';
    const age = document.getElementById('profileAge')?.value ? parseInt(document.getElementById('profileAge').value) : null;
    const phone = document.getElementById('profilePhone')?.value.trim() || '';
    const address = document.getElementById('profileAddress')?.value.trim() || '';
    const city = document.getElementById('profileCity')?.value.trim() || '';
    const country = document.getElementById('profileCountry')?.value.trim() || '';
    const birthDate = document.getElementById('profileBirthDate')?.value || null;
    const notes = document.getElementById('profileNotes')?.value.trim() || '';
    
    try {
        const data = await apiRequest('/user/profile', {
            method: 'PUT',
            body: JSON.stringify({
                firstName,
                lastName,
                age,
                phone,
                address,
                city,
                country,
                birthDate,
                notes
            })
        });
        
        // Actualizar datos locales
        userProfile = {
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            age: data.age || null,
            phone: data.phone || '',
            address: data.address || '',
            city: data.city || '',
            country: data.country || '',
            birthDate: data.birthDate || null,
            notes: data.notes || ''
        };
        
        updateUserInfo();
        closeUserProfile();
        alert('✅ Perfil actualizado exitosamente');
    } catch (error) {
        alert('Error al actualizar perfil: ' + error.message);
    }
}

// Eliminar cuenta de usuario
async function deleteUserAccount() {
    const confirmed = confirm('⚠️ ¿Estás seguro de que quieres eliminar tu cuenta?\n\nEsta acción eliminará:\n- Todas tus transacciones\n- Todas tus cuentas bancarias\n- Todos tus sobres y presupuestos\n- Todos tus préstamos\n- Todas tus inversiones\n- Todas tus propiedades\n- Todos tus bienes\n\nEsta acción NO se puede deshacer.\n\n¿Deseas continuar?');
    
    if (!confirmed) return;
    
    const doubleConfirm = confirm('⚠️ ÚLTIMA CONFIRMACIÓN\n\nEstás a punto de eliminar permanentemente tu cuenta y todos tus datos.\n\n¿Estás completamente seguro?');
    
    if (!doubleConfirm) return;
    
    try {
        await apiRequest('/user', {
            method: 'DELETE'
        });
        
        showToast('Tu cuenta ha sido eliminada exitosamente. Serás redirigido a la página de inicio.', 'success', 5000);
        
        // Limpiar datos locales
        localStorage.removeItem('veedor_token');
        localStorage.removeItem('veedor_user');
        
        // Redirigir a la página de inicio
        window.location.href = '/';
    } catch (error) {
        showToast('Error al eliminar cuenta: ' + error.message, 'error');
    }
}

// Mostrar detalles de resumen
function showSummaryDetails(type) {
    const modal = document.getElementById('summaryDetailsModal');
    const titleEl = document.getElementById('summaryDetailsTitle');
    const contentEl = document.getElementById('summaryDetailsContent');
    
    if (!modal || !titleEl || !contentEl) return;
    
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const summaryYearInput = document.getElementById('summaryYear');
    let selectedYear = currentYear;
    if (summaryYearInput && summaryPeriod === 'year-select') {
        selectedYear = parseInt(summaryYearInput.value) || currentYear;
    }
    
    let title = '';
    let content = '';
    
    if (type === 'balance') {
        title = 'Detalles del Balance Total';
        const transactionsBalance = transactions.reduce((sum, t) => sum + t.amount, 0);
        const investmentsValue = investments.reduce((sum, inv) => sum + inv.current_value, 0);
        const loansDebt = loans.filter(l => l.type === 'debt').reduce((sum, loan) => {
            const amortization = calculateAmortizationTable(
                loan.principal,
                loan.interest_rate,
                loan.monthly_payment,
                loan.start_date,
                loan.total_paid || 0,
                loan.early_payments || []
            );
            return sum + amortization.finalBalance;
        }, 0);
        const loansCredit = loans.filter(l => l.type === 'credit').reduce((sum, loan) => {
            const amortization = calculateAmortizationTable(
                loan.principal,
                loan.interest_rate,
                loan.monthly_payment,
                loan.start_date,
                loan.total_paid || 0,
                loan.early_payments || []
            );
            return sum + amortization.finalBalance;
        }, 0);
        const patrimonioValue = patrimonio.reduce((sum, prop) => sum + (prop.current_value || 0), 0);
        const totalBalance = transactionsBalance + investmentsValue + loansCredit - loansDebt + patrimonioValue;
        
        content = `
            <div style="display: grid; gap: 16px;">
                <div style="background: var(--bg-secondary); padding: 16px; border-radius: var(--radius); border-left: 4px solid var(--primary);">
                    <h3 style="margin: 0 0 12px 0; color: var(--text-primary);">Balance Total: ${formatCurrency(totalBalance)}</h3>
                    <div style="display: grid; gap: 8px; margin-top: 12px;">
                        <div style="display: flex; justify-content: space-between; padding: 8px; background: var(--bg-primary); border-radius: 4px; cursor: pointer;" onclick="closeSummaryDetails(); switchToTab('transactions', true);">
                            <span style="color: var(--text-secondary);">Transacciones:</span>
                            <strong style="color: var(--text-primary);">${formatCurrency(transactionsBalance)}</strong>
                        </div>
                        <div style="display: flex; justify-content: space-between; padding: 8px; background: var(--bg-primary); border-radius: 4px; cursor: pointer;" onclick="closeSummaryDetails(); switchToTab('investments', true);">
                            <span style="color: var(--text-secondary);">Inversiones:</span>
                            <strong style="color: var(--success);">${formatCurrency(investmentsValue)}</strong>
                        </div>
                        <div style="display: flex; justify-content: space-between; padding: 8px; background: var(--bg-primary); border-radius: 4px; cursor: pointer;" onclick="closeSummaryDetails(); switchToTab('loans', true);">
                            <span style="color: var(--text-secondary);">Préstamos (Créditos - Deudas):</span>
                            <strong style="color: ${loansCredit - loansDebt >= 0 ? 'var(--success)' : 'var(--danger)'};">${formatCurrency(loansCredit - loansDebt)}</strong>
                        </div>
                        <div style="display: flex; justify-content: space-between; padding: 8px; background: var(--bg-primary); border-radius: 4px; cursor: pointer;" onclick="closeSummaryDetails(); switchToTab('assets', true);">
                            <span style="color: var(--text-secondary);">Patrimonio:</span>
                            <strong style="color: var(--text-primary);">${formatCurrency(assetsValue)}</strong>
                        </div>
                    </div>
                </div>
                <div style="background: var(--bg-secondary); padding: 16px; border-radius: var(--radius); border-left: 4px solid var(--primary);">
                    <h3 style="margin: 0 0 12px 0; color: var(--gray-900);">Balance Total: ${formatCurrency(totalBalance)}</h3>
                </div>
                <div style="display: grid; gap: 12px;">
                    <div style="display: flex; justify-content: space-between; padding: 12px; background: var(--gray-50); border-radius: var(--radius);">
                        <span><strong>Saldo de Transacciones:</strong></span>
                        <span style="color: ${transactionsBalance >= 0 ? '#10b981' : '#ef4444'}">${formatCurrency(transactionsBalance)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 12px; background: var(--gray-50); border-radius: var(--radius);">
                        <span><strong>Valor de Inversiones:</strong></span>
                        <span style="color: #10b981">${formatCurrency(investmentsValue)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 12px; background: var(--gray-50); border-radius: var(--radius);">
                        <span><strong>Valor de Patrimonio:</strong></span>
                        <span style="color: #10b981">${formatCurrency(assetsValue)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 12px; background: var(--gray-50); border-radius: var(--radius);">
                        <span><strong>Préstamos a Favor:</strong></span>
                        <span style="color: #10b981">${formatCurrency(loansCredit)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 12px; background: var(--gray-50); border-radius: var(--radius);">
                        <span><strong>Deudas Pendientes:</strong></span>
                        <span style="color: #ef4444">-${formatCurrency(loansDebt)}</span>
                    </div>
                </div>
            </div>
        `;
    } else if (type === 'accounts') {
        title = 'Detalles de Cuentas Bancarias';
        const totalAccountsBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
        content = `
            <div style="display: grid; gap: 14px;">
                <div style="background: var(--bg-secondary); padding: 14px; border-radius: var(--radius); border-left: 4px solid var(--success);">
                    <h3 style="margin: 0 0 10px 0; color: var(--text-primary); font-size: 16px; font-weight: 700;">Saldo Total: ${formatCurrency(totalAccountsBalance)}</h3>
                </div>
                ${accounts.length === 0 ? '<p style="text-align: center; color: var(--text-tertiary); padding: 16px; font-size: 14px;">No hay cuentas registradas</p>' : ''}
                ${accounts.map(acc => `
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px; background: var(--bg-primary); border-radius: var(--radius); border: 1px solid var(--border-color); cursor: pointer; transition: all 0.2s; font-size: 13px;" onclick="closeSummaryDetails(); switchToTab('accounts', true);" onmouseover="this.style.background='var(--bg-secondary)'; this.style.borderColor='var(--primary)';" onmouseout="this.style.background='var(--bg-primary)'; this.style.borderColor='var(--border-color)';">
                        <div>
                            <strong style="color: var(--text-primary); font-size: 14px;">${acc.name}</strong>
                            <br><small style="color: var(--text-secondary); font-size: 12px;">${acc.type || 'Cuenta bancaria'}</small>
                        </div>
                        <div style="text-align: right;">
                            <strong style="color: ${acc.balance >= 0 ? 'var(--success)' : 'var(--danger)'}; font-size: 14px;">${formatCurrency(acc.balance)}</strong>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    } else if (type === 'income') {
        title = 'Detalles de Ingresos';
        let periodTransactions = [];
        if (summaryPeriod === 'month') {
            periodTransactions = transactions.filter(t => {
                const tDate = new Date(t.date);
                return tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear && t.type === 'income';
            });
        } else if (summaryPeriod === 'year' || summaryPeriod === 'year-select') {
            periodTransactions = transactions.filter(t => {
                const tDate = new Date(t.date);
                return tDate.getFullYear() === selectedYear && t.type === 'income';
            });
        } else {
            periodTransactions = transactions.filter(t => t.type === 'income');
        }
        const totalIncome = periodTransactions.reduce((sum, t) => sum + t.amount, 0);
        content = `
            <div style="display: grid; gap: 16px;">
                <div style="background: var(--bg-secondary); padding: 16px; border-radius: var(--radius); border-left: 4px solid var(--success);">
                    <h3 style="margin: 0 0 12px 0; color: var(--text-primary);">Total Ingresos: ${formatCurrency(totalIncome)}</h3>
                    <button class="btn-primary" onclick="closeSummaryDetails(); switchToTab('transactions', true);" style="margin-top: 8px; padding: 8px 16px; font-size: 13px;">Ver todas las transacciones</button>
                </div>
                ${periodTransactions.length === 0 ? '<p style="text-align: center; color: var(--text-tertiary); padding: 20px;">No hay ingresos registrados</p>' : ''}
                ${periodTransactions.slice(0, 20).map(t => `
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px; background: var(--bg-primary); border-radius: var(--radius); border: 1px solid var(--border-color); cursor: pointer; transition: all 0.2s;" onclick="closeSummaryDetails(); switchToTab('transactions', true);" onmouseover="this.style.background='var(--bg-secondary)'; this.style.borderColor='var(--primary)';" onmouseout="this.style.background='var(--bg-primary)'; this.style.borderColor='var(--border-color)';">
                        <div>
                            <strong style="color: var(--text-primary);">${t.category_specific || t.category_general}</strong>
                            <br><small style="color: var(--text-secondary);">${new Date(t.date).toLocaleDateString('es-ES')}</small>
                        </div>
                        <div style="text-align: right;">
                            <strong style="color: var(--success)">${formatCurrency(t.amount)}</strong>
                        </div>
                    </div>
                `).join('')}
                ${periodTransactions.length > 20 ? `<p style="text-align: center; color: var(--text-tertiary);">Y ${periodTransactions.length - 20} ingresos más...</p>` : ''}
            </div>
        `;
    } else if (type === 'expenses') {
        title = 'Detalles de Gastos';
        let periodTransactions = [];
        if (summaryPeriod === 'month') {
            periodTransactions = transactions.filter(t => {
                const tDate = new Date(t.date);
                return tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear && t.type === 'expense';
            });
        } else if (summaryPeriod === 'year' || summaryPeriod === 'year-select') {
            periodTransactions = transactions.filter(t => {
                const tDate = new Date(t.date);
                return tDate.getFullYear() === selectedYear && t.type === 'expense';
            });
        } else {
            periodTransactions = transactions.filter(t => t.type === 'expense');
        }
        const totalExpenses = Math.abs(periodTransactions.reduce((sum, t) => sum + t.amount, 0));
        content = `
            <div style="display: grid; gap: 16px;">
                <div style="background: var(--bg-secondary); padding: 16px; border-radius: var(--radius); border-left: 4px solid var(--danger);">
                    <h3 style="margin: 0 0 12px 0; color: var(--text-primary);">Total Gastos: ${formatCurrency(totalExpenses)}</h3>
                    <button class="btn-primary" onclick="closeSummaryDetails(); switchToTab('transactions', true);" style="margin-top: 8px; padding: 8px 16px; font-size: 13px;">Ver todas las transacciones</button>
                </div>
                ${periodTransactions.length === 0 ? '<p style="text-align: center; color: var(--text-tertiary); padding: 20px;">No hay gastos registrados</p>' : ''}
                ${periodTransactions.slice(0, 20).map(t => `
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px; background: var(--bg-primary); border-radius: var(--radius); border: 1px solid var(--border-color); cursor: pointer; transition: all 0.2s;" onclick="closeSummaryDetails(); switchToTab('transactions', true);" onmouseover="this.style.background='var(--bg-secondary)'; this.style.borderColor='var(--primary)';" onmouseout="this.style.background='var(--bg-primary)'; this.style.borderColor='var(--border-color)';">
                        <div>
                            <strong style="color: var(--text-primary);">${t.category_specific || t.category_general}</strong>
                            <br><small style="color: var(--text-secondary);">${new Date(t.date).toLocaleDateString('es-ES')}</small>
                        </div>
                        <div style="text-align: right;">
                            <strong style="color: var(--danger)">${formatCurrency(Math.abs(t.amount))}</strong>
                        </div>
                    </div>
                `).join('')}
                ${periodTransactions.length > 20 ? `<p style="text-align: center; color: var(--text-tertiary);">Y ${periodTransactions.length - 20} gastos más...</p>` : ''}
            </div>
        `;
    } else if (type === 'savings') {
        title = 'Detalles de Ahorro';
        let periodIncome = 0, periodExpenses = 0;
        if (summaryPeriod === 'month') {
            const monthTransactions = transactions.filter(t => {
                const tDate = new Date(t.date);
                return tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear;
            });
            periodIncome = monthTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
            periodExpenses = Math.abs(monthTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0));
        } else if (summaryPeriod === 'year' || summaryPeriod === 'year-select') {
            const yearTransactions = transactions.filter(t => {
                const tDate = new Date(t.date);
                return tDate.getFullYear() === selectedYear;
            });
            periodIncome = yearTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
            periodExpenses = Math.abs(yearTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0));
        } else {
            periodIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
            periodExpenses = Math.abs(transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0));
        }
        const periodSavings = periodIncome - periodExpenses;
        content = `
            <div style="display: grid; gap: 16px;">
                <div style="background: var(--gray-50); padding: 16px; border-radius: var(--radius); border-left: 4px solid ${periodSavings >= 0 ? '#10b981' : '#ef4444'};">
                    <h3 style="margin: 0 0 12px 0; color: var(--gray-900);">Ahorro Total: ${formatCurrency(periodSavings)}</h3>
                </div>
                <div style="display: grid; gap: 12px;">
                    <div style="display: flex; justify-content: space-between; padding: 12px; background: var(--gray-50); border-radius: var(--radius);">
                        <span><strong>Ingresos:</strong></span>
                        <span style="color: #10b981">${formatCurrency(periodIncome)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 12px; background: var(--gray-50); border-radius: var(--radius);">
                        <span><strong>Gastos:</strong></span>
                        <span style="color: #ef4444">${formatCurrency(periodExpenses)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 12px; background: var(--gray-50); border-radius: var(--radius);">
                        <span><strong>Ahorro:</strong></span>
                        <span style="color: ${periodSavings >= 0 ? '#10b981' : '#ef4444'}">${formatCurrency(periodSavings)}</span>
                    </div>
                </div>
            </div>
        `;
    }
    
    titleEl.textContent = title;
    contentEl.innerHTML = content;
    modal.style.display = 'flex';
}

// Cerrar modal de detalles de resumen
function closeSummaryDetails() {
    const modal = document.getElementById('summaryDetailsModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Funciones para modal de meta de ahorro
function showSavingsGoalModal() {
    const modal = document.getElementById('savingsGoalModal');
    const input = document.getElementById('savingsGoalInput');
    if (modal && input) {
        input.value = savingsGoal || '';
        modal.style.display = 'flex';
    }
}

function closeSavingsGoalModal() {
    const modal = document.getElementById('savingsGoalModal');
    if (modal) modal.style.display = 'none';
}

async function deleteSavingsGoal() {
    try {
        savingsGoal = null;
        await apiRequest('/user/profile', {
            method: 'PUT',
            body: JSON.stringify({ savingsGoal: null })
        });
        updateSummary();
        closeSavingsGoalModal();
    } catch (error) {
        alert('Error al eliminar el fondo de emergencia: ' + error.message);
    }
}

// Exponer funciones globales
window.showUserProfile = showUserProfile;
window.closeUserProfile = closeUserProfile;
window.deleteUserAccount = deleteUserAccount;
window.showSummaryDetails = showSummaryDetails;
window.closeSummaryDetails = closeSummaryDetails;
window.showPrivacyModal = showPrivacyModal;
window.closePrivacyModal = closePrivacyModal;
window.showCookiesModal = showCookiesModal;
window.closeCookiesModal = closeCookiesModal;
window.showTermsModal = showTermsModal;
window.closeTermsModal = closeTermsModal;
window.showSavingsGoalModal = showSavingsGoalModal;
window.closeSavingsGoalModal = closeSavingsGoalModal;
window.deleteSavingsGoal = deleteSavingsGoal;
window.showFinancialHealthDetail = showFinancialHealthDetail;
window.showAddMoneyInvestmentModal = showAddMoneyInvestmentModal;
window.closeAddMoneyInvestmentModal = closeAddMoneyInvestmentModal;
window.showUpdateInvestmentValueModal = showUpdateInvestmentValueModal;
window.closeUpdateInvestmentValueModal = closeUpdateInvestmentValueModal;
window.addMoneyToInvestment = addMoneyToInvestment;
window.updateInvestmentValue = updateInvestmentValue;

// Mostrar detalles de métrica de salud financiera
function showFinancialHealthDetail(metric, index) {
    const modal = document.getElementById('summaryDetailsModal');
    const titleEl = document.getElementById('summaryDetailsTitle');
    const contentEl = document.getElementById('summaryDetailsContent');
    
    if (!modal || !titleEl || !contentEl) return;
    
    titleEl.textContent = metric.title;
    
    // Obtener datos detallados según la métrica
    const periodTransactions = getTransactionsByPeriod();
    const period = getSelectedPeriod();
    const now = new Date();
    
    let monthsInPeriod = 1;
    if (period === 999) {
        const dates = periodTransactions.map(t => new Date(t.date));
        if (dates.length > 0) {
            const minDate = new Date(Math.min(...dates));
            const maxDate = new Date(Math.max(...dates));
            const diffTime = Math.abs(maxDate - minDate);
            monthsInPeriod = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30.44)));
        }
    } else {
        monthsInPeriod = period;
    }
    
    const totalTransactionsBalance = transactions.reduce((sum, t) => sum + t.amount, 0);
    const investmentsValue = investments.reduce((sum, inv) => sum + inv.current_value, 0);
    const loansCredit = loans.filter(l => l.type === 'credit').reduce((sum, loan) => {
        const amortization = calculateAmortizationTable(
            loan.principal,
            loan.interest_rate,
            loan.monthly_payment,
            loan.start_date,
            0, // No usar total_paid, calcular desde el inicio hasta hoy
            loan.early_payments || []
        );
        return sum + amortization.finalBalance;
    }, 0);
    // Calcular valor de activos (bienes/patrimonio)
    const patrimonioValue = patrimonio.reduce((sum, prop) => sum + (prop.current_value || 0), 0);
    
    const totalAssets = totalTransactionsBalance + investmentsValue + loansCredit + patrimonioValue;
    
    // Verificar préstamos activos (que aún no han terminado)
    const activeDebtLoans = loans.filter(l => {
        if (l.type !== 'debt') return false;
        const endDate = new Date(l.end_date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return endDate >= today; // Préstamo aún activo
    });
    
    const loansDebt = activeDebtLoans.reduce((sum, loan) => {
        const amortization = calculateAmortizationTable(
            loan.principal,
            loan.interest_rate,
            loan.monthly_payment,
            loan.start_date,
            0, // No usar total_paid, calcular desde el inicio hasta hoy
            loan.early_payments || []
        );
        return sum + amortization.finalBalance;
    }, 0);
    
    const hasActiveDebts = activeDebtLoans.length > 0;
    const periodIncome = periodTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const periodExpenses = Math.abs(periodTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0));
    const periodSavings = periodIncome - periodExpenses;
    const avgMonthlyIncome = monthsInPeriod > 0 ? periodIncome / monthsInPeriod : 0;
    const avgMonthlyExpenses = monthsInPeriod > 0 ? periodExpenses / monthsInPeriod : periodExpenses;
    const monthlyLoanPayments = loans.filter(l => l.type === 'debt').reduce((sum, loan) => sum + loan.monthly_payment, 0);
    
    // Generar gráfico según la métrica
    if (index === 0 || index === 1) { // Deuda vs Activos
        chartHTML = '<div style="margin: 16px 0; display: flex; justify-content: center;"><canvas id="metricChart" style="max-height: 200px; max-width: 250px;"></canvas></div>';
        chartData = {
            type: 'doughnut',
            data: {
                labels: ['Deuda', 'Activos'],
                datasets: [{
                    data: [loansDebt, Math.max(0, totalAssets - loansDebt)],
                    backgroundColor: ['#EF4444', '#3B82F6']
                }]
            }
        };
    } else if (index === 4) { // Ratio de Ahorro - Ingresos vs Gastos
        chartHTML = '<div style="margin: 16px 0; display: flex; justify-content: center;"><canvas id="metricChart" style="max-height: 200px; max-width: 300px;"></canvas></div>';
        chartData = {
            type: 'bar',
            data: {
                labels: ['Ingresos', 'Gastos', 'Ahorro'],
                datasets: [{
                    label: 'Euros',
                    data: [periodIncome, periodExpenses, Math.max(0, periodSavings)],
                    backgroundColor: ['#3B82F6', '#EF4444', '#10B981']
                }]
            },
            options: {
                scales: { y: { beginAtZero: true } }
            }
        };
    } else if (index === 5) { // Liquidez - Evolución temporal
        const months = [];
        const balances = [];
        let runningBalance = totalTransactionsBalance;
        for (let i = monthsInPeriod - 1; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            months.push(date.toLocaleDateString('es-ES', { month: 'short' }));
            const monthTransactions = periodTransactions.filter(t => {
                const tDate = new Date(t.date);
                return tDate.getMonth() === date.getMonth() && tDate.getFullYear() === date.getFullYear();
            });
            runningBalance += monthTransactions.reduce((sum, t) => sum + t.amount, 0);
            balances.push(runningBalance);
        }
        chartHTML = '<div style="margin: 16px 0; display: flex; justify-content: center;"><canvas id="metricChart" style="max-height: 200px; max-width: 400px;"></canvas></div>';
        chartData = {
            type: 'line',
            data: {
                labels: months,
                datasets: [{
                    label: 'Balance',
                    data: balances,
                    borderColor: '#d4af37',
                    backgroundColor: 'rgba(212, 175, 55, 0.15)',
                    tension: 0.4,
                    fill: true
                }]
            }
        };
    } else if (index === 6) { // Ratio de Inversión
        chartHTML = '<div style="margin: 16px 0; display: flex; justify-content: center;"><canvas id="metricChart" style="max-height: 200px; max-width: 250px;"></canvas></div>';
        chartData = {
            type: 'doughnut',
            data: {
                labels: ['Inversiones', 'Otros Activos'],
                datasets: [{
                    data: [investmentsValue, Math.max(0, totalAssets - investmentsValue)],
                    backgroundColor: ['#3B82F6', '#8B5CF6']
                }]
            }
        };
    }
    
    let detailContent = `
        <div style="display: flex; flex-direction: column; gap: 16px;">
            <div style="background: var(--bg-secondary); padding: 16px; border-radius: 10px; border: 1px solid var(--border-color);">
                <h3 style="margin: 0 0 10px 0; font-size: 15px; font-weight: 600; color: var(--text-primary);">Valor Actual</h3>
                <div style="font-size: 24px; font-weight: 700; color: var(--primary); margin-bottom: 6px;">
                    ${metric.value}
                </div>
                <p style="margin: 0; color: var(--text-secondary); font-size: 13px; line-height: 1.5;">${metric.description}</p>
            </div>
            
            ${chartHTML}
            
            <div>
                <h3 style="margin: 0 0 10px 0; font-size: 15px; font-weight: 600; color: var(--text-primary);">Detalles del Cálculo</h3>
                <div style="display: flex; flex-direction: column; gap: 10px;">
    `;
    
    // Agregar detalles específicos según la métrica
    if (index === 0) { // Deuda Pendiente
        detailContent += `
            <div style="padding: 12px; background: var(--bg-primary); border-radius: 8px; border-left: 3px solid ${hasActiveDebts ? 'var(--danger)' : 'var(--success)'}; color: var(--text-primary); border: 1px solid var(--border-color);">
                <strong>Préstamos Activos:</strong> ${activeDebtLoans.length} ${hasActiveDebts ? '(Hay deudas activas)' : '(Sin deudas activas)'}
            </div>
            <div style="padding: 12px; background: var(--bg-primary); border-radius: 8px; border-left: 3px solid var(--danger); border: 1px solid var(--border-color); color: var(--text-primary);">
                <strong>Capital Restante Total:</strong> ${formatCurrency(loansDebt)}
            </div>
            <div style="padding: 12px; background: var(--bg-primary); border-radius: 8px; border-left: 3px solid var(--success); border: 1px solid var(--border-color); color: var(--text-primary);">
                <strong>Activos Totales:</strong> ${formatCurrency(totalAssets)}
            </div>
        `;
    } else if (index === 1) { // Ratio de Endeudamiento
        detailContent += `
            <div style="padding: 12px; background: var(--bg-primary); border-radius: 8px; border-left: 3px solid ${hasActiveDebts ? 'var(--danger)' : 'var(--success)'}; color: var(--text-primary); border: 1px solid var(--border-color);">
                <strong>Préstamos Activos:</strong> ${activeDebtLoans.length} ${hasActiveDebts ? '(Hay deudas activas)' : '(Sin deudas activas)'}
            </div>
            <div style="padding: 12px; background: var(--bg-primary); border-radius: 8px; border-left: 3px solid var(--danger); border: 1px solid var(--border-color); color: var(--text-primary);">
                <strong>Capital Restante Total:</strong> ${formatCurrency(loansDebt)}
            </div>
            <div style="padding: 12px; background: var(--bg-primary); border-radius: 8px; border-left: 3px solid var(--success); border: 1px solid var(--border-color); color: var(--text-primary);">
                <strong>Activos Totales:</strong> ${formatCurrency(totalAssets)}
            </div>
            <div style="padding: 12px; background: var(--bg-primary); border-radius: 8px; border-left: 3px solid var(--primary); border: 1px solid var(--border-color); color: var(--text-primary);">
                <strong>Ratio:</strong> ${(loansDebt / (totalAssets || 1) * 100).toFixed(2)}%
            </div>
        `;
    } else if (index === 2) { // Salud Financiera
        detailContent += `
            <div style="padding: 12px; background: var(--bg-primary); border-radius: 8px; border-left: 3px solid ${hasActiveDebts ? 'var(--danger)' : 'var(--success)'}; color: var(--text-primary); border: 1px solid var(--border-color);">
                <strong>Préstamos Activos:</strong> ${activeDebtLoans.length} ${hasActiveDebts ? '(Hay deudas activas)' : '(Sin deudas activas)'}
            </div>
            <div style="padding: 12px; background: var(--bg-primary); border-radius: 8px; border-left: 3px solid var(--danger); border: 1px solid var(--border-color); color: var(--text-primary);">
                <strong>Capital Restante Total:</strong> ${formatCurrency(loansDebt)}
            </div>
            <div style="padding: 12px; background: var(--bg-primary); border-radius: 8px; border-left: 3px solid var(--success); border: 1px solid var(--border-color); color: var(--text-primary);">
                <strong>Activos Totales:</strong> ${formatCurrency(totalAssets)}
            </div>
        `;
    } else if (index === 4) { // Ratio de Ahorro
        detailContent += `
            <div style="padding: 12px; background: var(--bg-primary); border-radius: 8px; border-left: 3px solid var(--success); border: 1px solid var(--border-color); color: var(--text-primary);">
                <strong>Ingresos del Período:</strong> ${formatCurrency(periodIncome)}
            </div>
            <div style="padding: 12px; background: var(--bg-primary); border-radius: 8px; border-left: 3px solid var(--danger); border: 1px solid var(--border-color); color: var(--text-primary);">
                <strong>Gastos del Período:</strong> ${formatCurrency(periodExpenses)}
            </div>
            <div style="padding: 12px; background: var(--bg-primary); border-radius: 8px; border-left: 3px solid var(--primary); border: 1px solid var(--border-color); color: var(--text-primary);">
                <strong>Ahorro del Período:</strong> ${formatCurrency(periodSavings)}
            </div>
        `;
    
    detailContent += `
                </div>
            </div>
            
            <div style="padding: 14px; background: var(--primary-light); border-radius: 10px; border: 1px solid var(--primary);">
                <p style="margin: 0; color: var(--text-primary); font-size: 13px; line-height: 1.5;">
                    <strong>Interpretación:</strong> ${metric.detail}
                </p>
            </div>
        </div>
    `;
    
    contentEl.innerHTML = detailContent;
    modal.style.display = 'flex';
    
    // Crear gráfico si hay datos
    if (chartData) {
        setTimeout(() => {
            const canvas = document.getElementById('metricChart');
            if (canvas && typeof Chart !== 'undefined') {
                // Destruir gráfico anterior si existe
                if (window.metricChartInstance) {
                    window.metricChartInstance.destroy();
                }
                window.metricChartInstance = new Chart(canvas, {
                    type: chartData.type,
                    data: chartData.data,
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        aspectRatio: chartData.type === 'doughnut' ? 1 : 2,
                        plugins: {
                            legend: { 
                                display: true,
                                position: 'bottom',
                                labels: {
                                    font: { size: 12 },
                                    padding: 10
                                }
                            }
                        },
                        ...chartData.options
                    }
                });
            }
        }, 100);
    }
}

// ==================== SISTEMA DE TRADUCCIÓN ====================

// Función para actualizar todas las traducciones
function updateTranslations() {
    // Usar funciones globales directamente
    const tFunc = window.t || (typeof t !== 'undefined' ? t : null);
    const getLangFunc = window.getLanguage || (typeof getLanguage !== 'undefined' ? getLanguage : null);
    
    // Si no están disponibles, intentar obtener idioma desde localStorage
    let lang = 'es';
    if (getLangFunc && typeof getLangFunc === 'function') {
        try {
            lang = getLangFunc();
        } catch (e) {
            console.warn('Error obteniendo idioma:', e);
            lang = localStorage.getItem('veedor_language') || 'es';
        }
    } else {
        lang = localStorage.getItem('veedor_language') || 'es';
    }
    
    console.log('🔄 Actualizando traducciones para:', lang);
    console.log('📦 Funciones disponibles:', { t: !!tFunc, getLanguage: !!getLangFunc, translations: !!window.translations });
    
    if (!tFunc && window.translations && window.translations[lang]) {
        // Fallback: usar traducciones directamente
        console.log('⚠️ Usando traducciones directamente desde window.translations');
        const trans = window.translations[lang];
        
        // Función t simple
        const simpleT = (key) => {
            const keys = key.split('.');
            let value = trans;
            for (const k of keys) {
                value = value?.[k];
                if (!value) {
                    // Fallback a español
                    value = window.translations['es'];
                    for (const k2 of keys) {
                        value = value?.[k2];
                    }
                    break;
                }
            }
            return value || key;
        };
        
        // Actualizar elementos
        document.querySelectorAll('[data-translate]').forEach(el => {
            const key = el.getAttribute('data-translate');
            if (key) {
                try {
                    const translation = simpleT(key);
                    if (translation && translation !== key) {
                        el.textContent = translation;
                    }
                } catch (e) {
                    console.warn('Error traduciendo:', key, e);
                }
            }
        });
        
        // Actualizar placeholders
        document.querySelectorAll('[data-translate-placeholder]').forEach(el => {
            const key = el.getAttribute('data-translate-placeholder');
            if (key) {
                try {
                    const translation = simpleT(key);
                    if (translation && translation !== key) {
                        el.placeholder = translation;
                    }
                } catch (e) {
                    console.warn('Error traduciendo placeholder:', key, e);
                }
            }
        });
        
        // Actualizar banderas
        const flags = { es: 'ES', en: 'EN', de: 'DE', fr: 'FR' };
        const flagEl = document.getElementById('currentLanguageFlag');
        if (flagEl) flagEl.textContent = flags[lang] || flags['es'];
        const authFlagEl = document.getElementById('authCurrentLanguageFlag');
        if (authFlagEl) authFlagEl.textContent = flags[lang] || flags['es'];
        document.documentElement.lang = lang;
        return;
    }
    
    if (!tFunc) {
        console.warn('⚠️ Función t no disponible. Esperando a que translations.js se cargue...');
        return;
    }
    
    // Actualizar elementos con data-translate (incluyendo elementos dinámicos)
    const elementsToTranslate = document.querySelectorAll('[data-translate]');
    console.log(`📝 Encontrados ${elementsToTranslate.length} elementos para traducir`);
    elementsToTranslate.forEach(el => {
        const key = el.getAttribute('data-translate');
        if (key && tFunc) {
            try {
                const translation = tFunc(key, lang);
                if (translation && translation !== key) {
                    el.textContent = translation;
                    console.log(`✅ Traducido: ${key} -> ${translation}`);
                } else {
                    console.warn(`⚠️ No se encontró traducción para: ${key}`);
                }
            } catch (e) {
                console.warn('Error traduciendo:', key, e);
            }
        }
    });
    
    // Actualizar placeholders
    document.querySelectorAll('[data-translate-placeholder]').forEach(el => {
        const key = el.getAttribute('data-translate-placeholder');
        if (key && tFunc) {
            try {
                const translation = tFunc(key, lang);
                if (translation && translation !== key) {
                    el.placeholder = translation;
                }
            } catch (e) {
                console.warn('Error traduciendo placeholder:', key, e);
            }
        }
    });
    
    // Actualizar títulos
    document.querySelectorAll('[data-translate-title]').forEach(el => {
        const key = el.getAttribute('data-translate-title');
        if (key && tFunc) {
            try {
                const translation = tFunc(key, lang);
                if (translation && translation !== key) {
                    el.title = translation;
                }
            } catch (e) {
                console.warn('Error traduciendo title:', key, e);
            }
        }
    });
    
    // Actualizar bandera del idioma actual (header)
    const flags = { es: '🇪🇸', en: '🇬🇧', de: '🇩🇪', fr: '🇫🇷' };
    const flagEl = document.getElementById('currentLanguageFlag');
    if (flagEl) {
        flagEl.textContent = flags[lang] || flags['es'];
    }
    
    // Actualizar bandera del idioma actual (auth page)
    const authFlagEl = document.getElementById('authCurrentLanguageFlag');
    if (authFlagEl) {
        authFlagEl.textContent = flags[lang] || flags['es'];
    }
    
    // Actualizar selección en dropdown de idioma (header)
    document.querySelectorAll('#languageDropdown .nav-dropdown-item').forEach(item => {
        const itemLang = item.getAttribute('data-lang');
        if (itemLang === lang) {
            item.style.background = 'var(--primary-light)';
            item.style.color = 'var(--primary)';
            item.style.fontWeight = '600';
        } else {
            item.style.background = 'transparent';
            item.style.color = 'var(--gray-900)';
            item.style.fontWeight = '400';
        }
    });
    
    // Actualizar selección en dropdown de idioma (auth page)
    document.querySelectorAll('#authLanguageDropdown .nav-dropdown-item').forEach(item => {
        const itemLang = item.getAttribute('data-lang');
        if (itemLang === lang) {
            item.style.background = 'var(--primary-light)';
            item.style.color = 'var(--primary)';
            item.style.fontWeight = '600';
        } else {
            item.style.background = 'transparent';
            item.style.color = 'var(--gray-900)';
            item.style.fontWeight = '400';
        }
    });
    
    // Actualizar atributo lang del HTML
    document.documentElement.lang = lang;
    
    // Forzar actualización de elementos dinámicos que puedan tener texto hardcodeado
    // Esto se ejecutará después de que se actualicen los elementos estáticos
    setTimeout(() => {
        // Actualizar tabs activos usando tFunc
        const tFuncForDynamic = window.t || (typeof t !== 'undefined' ? t : null);
        if (tFuncForDynamic) {
            const activeTab = document.querySelector('.tab-btn.active');
            if (activeTab) {
                const tabKey = activeTab.getAttribute('data-translate');
                if (tabKey) {
                    try {
                        const translation = tFuncForDynamic(tabKey, lang);
                        if (translation && translation !== tabKey) {
                            const span = activeTab.querySelector('span[data-translate]');
                            if (span) span.textContent = translation;
                        }
                    } catch (e) {}
                }
            }
            
            // Actualizar navegación
            document.querySelectorAll('.nav-dropdown-item span[data-translate]').forEach(span => {
                const key = span.getAttribute('data-translate');
                if (key) {
                    try {
                        const translation = tFuncForDynamic(key, lang);
                        if (translation && translation !== key) {
                            span.textContent = translation;
                        }
                    } catch (e) {}
                }
            });
        }
    }, 100);
}

// Función para cambiar idioma
function changeLanguage(lang) {
    console.log('🌐 Cambiando idioma a:', lang);
    
    // Guardar idioma
    const setLangFunc = window.setLanguage || (typeof setLanguage !== 'undefined' ? setLanguage : null);
    if (setLangFunc && typeof setLangFunc === 'function') {
        try {
            setLangFunc(lang);
        } catch (e) {
            console.warn('Error en setLanguage:', e);
            localStorage.setItem('veedor_language', lang);
        }
    } else {
        // Fallback: guardar en localStorage directamente
        localStorage.setItem('veedor_language', lang);
        // Actualizar variable global si existe
        if (typeof window !== 'undefined') {
            window.currentLanguage = lang;
        }
    }
    
    console.log('💾 Idioma guardado:', localStorage.getItem('veedor_language'));
    
    // Forzar actualización inmediata
    const forceUpdate = () => {
        console.log('🔄 Forzando actualización de traducciones...');
        updateTranslations();
        
        // Actualizar elementos dinámicos manualmente
        const tFunc = window.t || (typeof t !== 'undefined' ? t : null);
        if (tFunc) {
            // Actualizar navegación
            document.querySelectorAll('#mainNavDropdown .nav-dropdown-item span[data-translate]').forEach(span => {
                const key = span.getAttribute('data-translate');
                if (key) {
                    try {
                        const translation = tFunc(key, lang);
                        if (translation && translation !== key) {
                            span.textContent = translation;
                        }
                    } catch (e) {}
                }
            });
            
            // Actualizar tabs
            document.querySelectorAll('.tab-btn').forEach(btn => {
                const span = btn.querySelector('span[data-translate]');
                if (span) {
                    const key = span.getAttribute('data-translate');
                    if (key) {
                        try {
                            const translation = tFunc(key, lang);
                            if (translation && translation !== key) {
                                span.textContent = translation;
                            }
                        } catch (e) {}
                    }
                }
            });
        }
    };
    
    // Actualizar traducciones múltiples veces para asegurar que funcione
    forceUpdate();
    setTimeout(forceUpdate, 50);
    setTimeout(forceUpdate, 200);
    setTimeout(forceUpdate, 500);
    setTimeout(forceUpdate, 1000);
    
    // Recargar datos para actualizar formatos (solo si estamos en la app principal)
    if (typeof updateDisplay === 'function' && document.getElementById('mainApp') && document.getElementById('mainApp').style.display !== 'none') {
        setTimeout(() => {
            updateDisplay();
        }, 300);
    }
    
    // Forzar actualización de todos los elementos dinámicos
    if (typeof updateCharts === 'function') {
        setTimeout(() => {
            updateCharts();
        }, 400);
    }
}

// Función para toggle del dropdown de idioma (header)
function toggleLanguageDropdown() {
    const dropdown = document.getElementById('languageDropdown');
    const mainNavDropdown = document.getElementById('mainNavDropdown');
    const settingsDropdown = document.getElementById('settingsDropdown');
    
    if (dropdown) {
        dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
    }
    
    // Cerrar otros dropdowns
    if (mainNavDropdown && mainNavDropdown.style.display === 'block') {
        mainNavDropdown.style.display = 'none';
    }
    if (settingsDropdown && settingsDropdown.style.display === 'block') {
        settingsDropdown.style.display = 'none';
    }
}

// Función para toggle del dropdown de idioma (auth page)
function toggleAuthLanguageDropdown() {
    const dropdown = document.getElementById('authLanguageDropdown');
    
    if (dropdown) {
        dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
    }
}

// Exponer funciones globalmente
window.updateTranslations = updateTranslations;
window.changeLanguage = changeLanguage;
window.toggleLanguageDropdown = toggleLanguageDropdown;

// Inicializar traducciones cuando se carga la app
function initializeTranslationsOnLoad() {
    // Establecer español como idioma por defecto si no hay idioma guardado
    if (!localStorage.getItem('veedor_language')) {
        localStorage.setItem('veedor_language', 'es');
        console.log('🌐 Idioma por defecto establecido: Español');
    }
    
    // Esperar a que translations.js se cargue completamente
    const checkAndInit = () => {
        const getLangFunc = window.getLanguage || (typeof getLanguage !== 'undefined' ? getLanguage : null);
        const savedLang = localStorage.getItem('veedor_language') || 'es';
        
        if (window.translations) {
            console.log('✅ translations.js cargado');
            
            // Establecer idioma si la función está disponible
            if (getLangFunc && typeof getLangFunc === 'function') {
                try {
                    const currentLang = getLangFunc();
                    if (currentLang !== savedLang && window.setLanguage) {
                        window.setLanguage(savedLang);
                    }
                } catch (e) {
                    console.warn('Error obteniendo idioma:', e);
                }
            } else if (window.setLanguage && typeof window.setLanguage === 'function') {
                try {
                    window.setLanguage(savedLang);
                } catch (e) {
                    console.warn('Error estableciendo idioma:', e);
                }
            }
            
            document.documentElement.lang = savedLang;
            
            // Actualizar traducciones después de un delay
            setTimeout(() => {
                if (typeof updateTranslations === 'function') {
                    console.log('🔄 Inicializando traducciones al cargar...');
                    updateTranslations();
                }
            }, 200);
        } else {
            console.log('⏳ Esperando a que translations.js se cargue...');
            setTimeout(checkAndInit, 100);
        }
    };
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', checkAndInit);
    } else {
        checkAndInit();
    }
}

// Inicializar traducciones
initializeTranslationsOnLoad();

// ==================== LAZY LOADING DE GRÁFICOS ====================
let chartsInitialized = false;

function initializeChartsLazy() {
    if (chartsInitialized) return;
    
    const chartsTab = document.getElementById('charts-tab');
    if (!chartsTab) return;
    
    // Observar cuando la pestaña de gráficos es visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !chartsInitialized) {
                chartsInitialized = true;
                initializeCharts();
                setTimeout(() => updateCharts(), 200);
            }
        });
    }, { threshold: 0.1 });
    
    observer.observe(chartsTab);
}

// Modificar switchToTab para inicializar gráficos lazy
const originalSwitchToTab = switchToTab;
switchToTab = function(tabName, doScroll) {
    if (originalSwitchToTab) {
        originalSwitchToTab(tabName, doScroll);
    }
    
    if (tabName === 'charts' && !chartsInitialized) {
        initializeChartsLazy();
    }
};

// Exponer función global
window.switchToTab = switchToTab;

// ==================== DEBOUNCE UTILITY ====================
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ==================== SKELETON LOADERS ====================
function showSkeletonLoader(containerId, count = 3) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = Array(count).fill(0).map(() => `
        <div class="skeleton-card" style="background: var(--bg-primary); border-radius: var(--radius); padding: 20px; border: 1px solid var(--border-color);">
            <div class="skeleton-line" style="height: 20px; background: var(--bg-tertiary); border-radius: 4px; margin-bottom: 12px; animation: skeleton-pulse 1.5s ease-in-out infinite;"></div>
            <div class="skeleton-line" style="height: 16px; background: var(--bg-tertiary); border-radius: 4px; width: 60%; margin-bottom: 8px; animation: skeleton-pulse 1.5s ease-in-out infinite;"></div>
            <div class="skeleton-line" style="height: 16px; background: var(--bg-tertiary); border-radius: 4px; width: 40%; animation: skeleton-pulse 1.5s ease-in-out infinite;"></div>
        </div>
    `).join('');
}

// Asegurar que openChartModal esté expuesta ANTES de cerrar el bloque
// Esto es crítico porque el stub puede ejecutarse antes de que el script termine
try {
    if (typeof openChartModal === 'function') {
        window._openChartModalReal = openChartModal;
        window.openChartModal = openChartModal;
        console.log('✅ openChartModal expuesta correctamente al final del script');
    } else {
        console.error('❌ openChartModal no está definida al final del script');
        console.log('Tipo de openChartModal:', typeof openChartModal);
        console.log('openChartModal disponible en window:', typeof window.openChartModal);
        console.log('_openChartModalReal disponible en window:', typeof window._openChartModalReal);
    }
} catch (error) {
    console.error('❌ Error al exponer openChartModal al final:', error);
}

// Cerrar el bloque de protección contra carga múltiple
} // Cierre del else de window.VEEDOR_LOADED (línea 5)
