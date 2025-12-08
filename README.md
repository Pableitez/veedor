# 💰 Veedor - Control de Finanzas Personales

Una aplicación web completa para gestionar tus finanzas personales con servidor backend, base de datos y autenticación segura.

## ✨ Características

- **👤 Sistema de Usuarios**: Registro e inicio de sesión con autenticación JWT
- **💾 Base de Datos**: Almacenamiento persistente en SQLite
- **📝 Registro de Transacciones**: Agrega ingresos y gastos de forma sencilla
- **📂 Categorías Organizadas**: 
  - Categorías generales (Alimentación, Transporte, Vivienda, Salud, etc.)
  - Subcategorías específicas para cada categoría general
- **📅 Selector de Fechas**: Registra transacciones con fechas específicas
- **✉️ Sistema de Sobres**: Crea sobres presupuestarios para diferentes categorías
- **📊 Gráficas Interactivas**:
  - Evolución de ahorro acumulado
  - Gastos por categoría del mes actual
  - Comparación de ingresos vs gastos (últimos 6 meses)
  - Distribución de gastos (gráfica circular)
- **📥 Exportar/Importar**: Respaldar y restaurar tus datos fácilmente
- **🔍 Búsqueda y Filtros**: Encuentra transacciones rápidamente
- **🌐 API REST**: Acceso desde múltiples dispositivos

## 🚀 Instalación

### Requisitos Previos

- Node.js (v14 o superior)
- npm (viene con Node.js)

### Pasos de Instalación

1. **Instalar dependencias**:
   ```bash
   npm install
   ```

2. **Configurar variables de entorno** (opcional):
   ```bash
   cp .env.example .env
   ```
   Edita `.env` y cambia `JWT_SECRET` por un secreto seguro.

3. **Iniciar el servidor**:
   ```bash
   npm start
   ```
   
   O para desarrollo con auto-reload:
   ```bash
   npm run dev
   ```

4. **Abrir en el navegador**:
   - Abre `http://localhost:3000` en tu navegador

## 📖 Uso

1. **Crear una cuenta**: 
   - Ve a la pestaña "Registrarse"
   - Crea un nombre de usuario y contraseña (mínimo 4 caracteres)

2. **Iniciar sesión**: 
   - Usa tus credenciales para acceder
   - Tu sesión se mantendrá activa por 30 días

3. **Agregar transacciones**: 
   - Completa el formulario en la pestaña "Transacciones"
   - Selecciona el tipo (Ingreso o Gasto)
   - Elige la fecha, monto, categorías y descripción
   - Opcionalmente asigna un sobre

4. **Crear sobres**: 
   - Ve a la pestaña "Sobres"
   - Define un nombre y presupuesto mensual
   - Asigna transacciones a sobres para controlar gastos por categoría

5. **Ver gráficas**: 
   - Navega a la pestaña "Gráficas" para ver visualizaciones de tus finanzas

6. **Exportar/Importar datos**: 
   - Usa el botón "Exportar" para crear una copia de seguridad
   - Usa "Importar" para restaurar datos guardados

## 🏗️ Estructura del Proyecto

```
Veedor/
├── server.js          # Servidor Express y API
├── package.json       # Dependencias del proyecto
├── veedor.db          # Base de datos SQLite (se crea automáticamente)
├── public/            # Archivos del frontend
│   ├── index.html
│   ├── styles.css
│   └── app.js
└── README.md
```

## 🔌 API Endpoints

### Autenticación
- `POST /api/register` - Registrar nuevo usuario
- `POST /api/login` - Iniciar sesión
- `GET /api/verify` - Verificar token (requiere autenticación)

### Transacciones
- `GET /api/transactions` - Obtener todas las transacciones del usuario
- `POST /api/transactions` - Crear nueva transacción
- `DELETE /api/transactions/:id` - Eliminar transacción

### Sobres
- `GET /api/envelopes` - Obtener todos los sobres del usuario
- `POST /api/envelopes` - Crear nuevo sobre
- `DELETE /api/envelopes/:id` - Eliminar sobre

**Nota**: Todas las rutas excepto `/api/register` y `/api/login` requieren autenticación mediante token JWT en el header `Authorization: Bearer <token>`

## 🔒 Seguridad

- Las contraseñas se almacenan con hash bcrypt
- Autenticación mediante JWT (JSON Web Tokens)
- Tokens expiran después de 30 días
- Cada usuario solo puede acceder a sus propios datos
- Validación de datos en el servidor

## 📋 Categorías Incluidas

- **Alimentación**: Supermercado, Restaurantes, Delivery, Café
- **Transporte**: Gasolina, Transporte público, Taxi/Uber, Mantenimiento
- **Vivienda**: Alquiler/Hipoteca, Servicios, Mantenimiento, Decoración
- **Salud**: Médico, Farmacia, Gimnasio, Seguro médico
- **Entretenimiento**: Cine, Streaming, Eventos, Hobbies
- **Compras**: Ropa, Electrónica, Hogar, Otros
- **Educación**: Cursos, Libros, Materiales, Matrícula
- **Facturas**: Internet, Teléfono, Luz, Agua, Otros servicios
- **Personal**: Cuidado personal, Ropa, Regalos, Otros
- **Otros**: Varios, Imprevistos

## 🛠️ Tecnologías

### Backend
- Node.js
- Express.js
- SQLite3
- bcryptjs (hash de contraseñas)
- jsonwebtoken (autenticación)

### Frontend
- HTML5
- CSS3
- JavaScript (vanilla)
- Chart.js (gráficas)

## 📱 Responsive

La aplicación está diseñada para funcionar en dispositivos de escritorio, tablets y móviles.

## 🔧 Desarrollo

Para desarrollo con auto-reload:
```bash
npm run dev
```

Esto requiere tener `nodemon` instalado globalmente o como dependencia de desarrollo.

## 📝 Notas

- La base de datos SQLite se crea automáticamente al iniciar el servidor
- Los datos se almacenan localmente en el archivo `veedor.db`
- Para producción, considera usar PostgreSQL o MySQL
- Cambia el `JWT_SECRET` en producción por un valor seguro y aleatorio

## 🐛 Solución de Problemas

**Error: "Cannot find module"**
- Ejecuta `npm install` para instalar las dependencias

**Error de conexión a la base de datos**
- Asegúrate de tener permisos de escritura en el directorio
- Verifica que SQLite3 esté instalado correctamente

**Error de autenticación**
- Verifica que el token no haya expirado
- Intenta cerrar sesión y volver a iniciar sesión

---

¡Disfruta gestionando tus finanzas de manera fácil y efectiva! 💰
