# Estructura del Proyecto Veedor

## 📁 Organización de Archivos

### JavaScript (js/)
```
js/
├── core/                    # Módulos principales
│   ├── veedor-core.js      # Clase principal de la aplicación
│   └── veedor-storage.js   # Gestión de datos y almacenamiento
├── modules/                 # Módulos de funcionalidad específica
│   ├── veedor-dashboard.js # Panel principal y resúmenes
│   ├── veedor-transactions.js # Gestión de transacciones
│   ├── veedor-budgets.js   # Gestión de presupuestos
│   ├── veedor-goals.js     # Gestión de metas (pendiente)
│   ├── veedor-envelopes.js # Sistema de sobres (pendiente)
│   ├── veedor-assets.js    # Gestión de activos (pendiente)
│   └── veedor-liabilities.js # Gestión de pasivos (pendiente)
├── components/              # Componentes de UI
│   └── veedor-ui.js        # Interfaz de usuario y eventos
├── calculators/             # Cálculos financieros
│   └── veedor-calculators.js # Cálculos y fórmulas
├── utils/                   # Utilidades generales
│   └── veedor-utils.js     # Funciones de utilidad
├── config/                  # Configuración
│   └── veedor-config.js    # Configuración global
└── veedor-main.js          # Archivo principal (importa todos los módulos)
```

### CSS (css/)
```
css/
├── layout/                  # Estructura y layout
│   └── veedor-layout.css   # Variables, reset, layout principal
├── components/              # Componentes UI
│   ├── veedor-components.css # Botones, modales, formularios
│   └── veedor-dashboard.css # Componentes específicos del dashboard
├── themes/                  # Temas (pendiente)
│   ├── light.css
│   └── dark.css
├── utilities/               # Utilidades CSS (pendiente)
│   └── veedor-utilities.css
└── veedor-main.css         # Archivo principal (importa todos los módulos)
```

## 🏗️ Arquitectura Modular

### Principios de Organización

1. **Separación de Responsabilidades**: Cada módulo tiene una responsabilidad específica
2. **Reutilización**: Los módulos pueden ser reutilizados en diferentes contextos
3. **Mantenibilidad**: Fácil de mantener y actualizar
4. **Escalabilidad**: Fácil de extender con nuevas funcionalidades

### Flujo de Datos

```
VeedorCore (Principal)
    ↓
VeedorStorage (Datos)
    ↓
VeedorCalculators (Cálculos)
    ↓
VeedorUI (Interfaz)
    ↓
Módulos Específicos (Funcionalidades)
```

## 📦 Módulos Principales

### Core Modules
- **veedor-core.js**: Clase principal que coordina todos los módulos
- **veedor-storage.js**: Gestión de datos (localStorage, import/export)

### Feature Modules
- **veedor-dashboard.js**: Panel principal y resúmenes financieros
- **veedor-transactions.js**: CRUD de transacciones
- **veedor-budgets.js**: CRUD de presupuestos
- **veedor-goals.js**: CRUD de metas (pendiente)
- **veedor-envelopes.js**: Sistema de sobres (pendiente)
- **veedor-assets.js**: CRUD de activos (pendiente)
- **veedor-liabilities.js**: CRUD de pasivos (pendiente)

### Utility Modules
- **veedor-calculators.js**: Cálculos financieros y fórmulas
- **veedor-ui.js**: Interfaz de usuario y eventos
- **veedor-utils.js**: Utilidades generales
- **veedor-config.js**: Configuración global

## 🔧 Uso de los Módulos

### Importación
```javascript
// El archivo principal importa todos los módulos
import './core/veedor-core.js';
import './core/veedor-storage.js';
// ... otros módulos
```

### Uso en la Aplicación
```javascript
// Crear instancia de la aplicación
const app = new VeedorFinanceCenter();

// Usar módulos específicos
VeedorTransactions.addTransaction(data, app);
VeedorCalculators.calculateBalance(transactions);
VeedorUI.showMessage('Mensaje', 'success');
```

## 🎨 Estilos CSS

### Variables CSS
Todas las variables están definidas en `veedor-layout.css`:
- Colores (primarios, estado, fondo, texto)
- Espaciado
- Radios
- Sombras
- Transiciones
- Z-index

### Componentes
- **veedor-components.css**: Componentes reutilizables (botones, modales, etc.)
- **veedor-dashboard.css**: Componentes específicos del dashboard

## 📋 Convenciones

### Naming Conventions
- **Archivos**: `veedor-[modulo].js`
- **Clases**: `Veedor[Modulo]` (PascalCase)
- **Métodos**: `camelCase`
- **Variables**: `camelCase`
- **Constantes**: `UPPER_SNAKE_CASE`

### Estructura de Clases
```javascript
class VeedorModulo {
    constructor() {
        // Inicialización
    }
    
    // Métodos públicos
    publicMethod() {
        // Implementación
    }
    
    // Métodos privados (prefijo _)
    _privateMethod() {
        // Implementación
    }
}
```

## 🚀 Extensión

### Agregar Nuevo Módulo
1. Crear archivo en la carpeta correspondiente
2. Implementar la clase siguiendo las convenciones
3. Exportar con `window.VeedorModulo = VeedorModulo`
4. Importar en `veedor-main.js`

### Agregar Nuevo Componente CSS
1. Crear archivo en `css/components/`
2. Definir estilos siguiendo las variables CSS
3. Importar en `veedor-main.css`

## 🔍 Debugging

### Herramientas de Desarrollo
- Console logs en cada módulo
- Configuración de debug en `veedor-config.js`
- Performance monitoring (opcional)

### Testing
- Cada módulo puede ser probado independientemente
- Tests unitarios (pendiente)
- Tests de integración (pendiente)

## 📚 Documentación

### Comentarios en Código
- JSDoc para métodos públicos
- Comentarios explicativos para lógica compleja
- README en cada módulo (pendiente)

### API Documentation
- Documentación de métodos públicos
- Ejemplos de uso
- Guías de integración

## 🔄 Migración

### Desde Estructura Anterior
1. Los archivos antiguos se mantienen como backup
2. La nueva estructura es completamente compatible
3. Migración gradual módulo por módulo
4. Testing exhaustivo antes de eliminar archivos antiguos

### Compatibilidad
- Mantiene toda la funcionalidad existente
- Mejora la organización y mantenibilidad
- Facilita futuras extensiones
