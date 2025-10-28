# Veedor — Inteligencia financiera. Sin fisuras.

Supervisa, analiza y domina cada movimiento de tu dinero desde un solo lugar.

## 📁 Estructura del Proyecto

```
Veedor/
├── index.html              # Página de inicio
├── veedor-app.html         # Aplicación principal (interfaz de usuario)
├── auth.html              # Página de autenticación
├── profile.html           # Página de perfil
├── css/
│   ├── veedor-app.css     # Estilos principales de la aplicación
│   └── layout/            # Estilos de layout organizados
├── js/
│   ├── core/              # Funcionalidad central
│   ├── modules/           # Módulos organizados por función
│   ├── utils/             # Utilidades y validaciones
│   └── veedor-app.js      # Punto de entrada de la aplicación
├── assets/                # Recursos estáticos (imágenes, iconos, etc.)
└── README.md             # Documentación del proyecto
```

## 🎨 Paleta de Colores

La aplicación utiliza una paleta de colores moderna y profesional, definida en `css/styles.css`:

### Colores Principales
- **Primary**: `#007AFF` - Azul principal
- **Secondary**: `#5856D6` - Púrpura elegante
- **Accent**: `#FF3B30` - Rojo vibrante para elementos importantes

### Colores de Fondo
- **Primary**: `#FFFFFF` - Blanco puro
- **Secondary**: `#F2F2F7` - Gris muy claro
- **Tertiary**: `#E5E5EA` - Gris claro para bordes

### Colores de Texto
- **Primary**: `#1D1D1F` - Negro suave
- **Secondary**: `#86868B` - Gris medio
- **Tertiary**: `#C7C7CC` - Gris claro
- **Link**: `#007AFF` - Azul para enlaces

### Colores de Estado
- **Success**: `#34C759` - Verde
- **Error**: `#FF3B30` - Rojo
- **Warning**: `#FF9500` - Naranja
- **Info**: `#007AFF` - Azul

### Colores de Categorías
- **Alimentación**: `#FF3B30` - Rojo
- **Transporte**: `#007AFF` - Azul
- **Entretenimiento**: `#5856D6` - Púrpura
- **Salud**: `#34C759` - Verde
- **Otros**: `#FF9500` - Naranja

## 🏗️ Arquitectura JavaScript

### Separación por Responsabilidades

#### 1. **config.js** - Configuración Global
- Constantes de la aplicación
- Configuración de categorías
- Límites de validación
- Configuración de notificaciones

#### 2. **storage.js** - Gestión de Datos
- Clase `StorageManager`
- Operaciones de localStorage
- Exportación de datos a CSV
- Persistencia de gastos

#### 3. **validations.js** - Validaciones
- Clase `ValidationManager`
- Validación de formularios
- Validación de campos individuales
- Manejo de errores

#### 4. **ui.js** - Interfaz de Usuario
- Clase `UIManager`
- Notificaciones
- Actualización de listas
- Navegación suave
- Validaciones en tiempo real

#### 5. **gastos.js** - Lógica de Negocio
- Clase `GastosManager`
- CRUD de gastos
- Estadísticas
- Exportación de datos

#### 6. **app.js** - Aplicación Principal
- Clase `App`
- Inicialización
- Configuración de eventos
- Punto de entrada

## 🚀 Cómo Usar

1. **Abrir la aplicación**: Abre `index.html` en tu navegador
2. **Registrar transacciones**: Completa el formulario en el "Centro de Control Financiero"
3. **Monitorear actividad**: La actividad financiera se analiza automáticamente
4. **Exportar datos**: Usa las funciones de exportación para análisis avanzado

## 🔧 Funcionalidades

### ✅ Implementadas
- ✅ Supervisión inteligente de transacciones
- ✅ Análisis profundo de patrones financieros
- ✅ Control total de la economía personal
- ✅ Validación de formularios avanzada
- ✅ Almacenamiento local persistente
- ✅ Notificaciones visuales inteligentes
- ✅ Interfaz responsive y moderna
- ✅ Navegación suave y fluida
- ✅ Exportación a CSV para análisis externo

### 🔄 Para Futuras Versiones
- 🔄 Dashboard de inteligencia financiera
- 🔄 Predicciones y tendencias automáticas
- 🔄 Alertas inteligentes de gastos
- 🔄 Integración con bancos
- 🔄 Análisis de inversiones
- 🔄 Múltiples monedas y mercados
- 🔄 Sincronización en la nube

## 📱 Responsive Design

La aplicación está optimizada para:
- **Desktop**: Experiencia completa con todas las funcionalidades
- **Tablet**: Layout adaptado con navegación optimizada
- **Mobile**: Interfaz simplificada y táctil

## 🎯 Principios de Escalabilidad

### 1. **Separación de Responsabilidades**
Cada archivo JavaScript tiene una responsabilidad específica y bien definida.

### 2. **Configuración Centralizada**
Todas las constantes y configuraciones están en `config.js`.

### 3. **Paleta de Colores Consistente**
Uso de variables CSS para mantener consistencia visual.

### 4. **Componentes Reutilizables**
Clases CSS reutilizables para botones, inputs, cards, etc.

### 5. **Estructura Modular**
Fácil agregar nuevas funcionalidades sin afectar el código existente.

## 🔨 Para Desarrolladores

### Agregar Nueva Funcionalidad

1. **Crear nuevo archivo JS** en la carpeta `js/`
2. **Definir clase** con responsabilidad específica
3. **Crear instancia global** si es necesario
4. **Importar en index.html** antes de `app.js`
5. **Configurar en app.js** si necesita inicialización

### Agregar Nuevo Color

1. **Definir variable** en `:root` de `styles.css`
2. **Usar en componentes** existentes o nuevos
3. **Documentar** en este README

### Agregar Nueva Categoría

1. **Actualizar** `CONFIG.CATEGORIAS` en `config.js`
2. **Agregar opción** en el select del HTML
3. **Definir color** en la paleta si es necesario

## 📄 Licencia

© 2024 Veedor. Todos los derechos reservados.
