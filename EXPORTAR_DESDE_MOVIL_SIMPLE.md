# 📱 Exportar Datos desde el Móvil - Método Simple

## 🎯 Método Más Fácil: Usar la Consola del Navegador

Como no hay un botón visible de exportar, puedes ejecutar la función directamente desde la consola del navegador.

### Pasos para Android:

1. **Abre la aplicación en Chrome en tu móvil**
2. **Conecta tu móvil a tu computadora por USB**
3. **En tu computadora, abre Chrome**
4. **Ve a**: `chrome://inspect/#devices`
5. **Habilita "USB Debugging"** en tu móvil si te lo pide:
   - Ve a: Configuración > Opciones de desarrollador > Depuración USB (activar)
6. **Encuentra tu dispositivo** en la lista de `chrome://inspect`
7. **Haz clic en "inspect"** junto a `veedor.onrender.com`
8. **Se abrirán las DevTools** en tu computadora
9. **Ve a la pestaña "Console"**
10. **Escribe esto y presiona Enter**:
   ```javascript
   exportData()
   ```
11. **El archivo se descargará automáticamente** en tu móvil

### Pasos para iPhone/iPad:

1. **En tu iPhone, ve a**: Configuración > Safari > Avanzado > Web Inspector (activar)
2. **Conecta tu iPhone a tu Mac por USB**
3. **En tu Mac, abre Safari**
4. **Ve a**: Desarrollo > [Tu iPhone] > veedor.onrender.com
5. **Se abrirán las DevTools**
6. **Ve a la pestaña "Console"**
7. **Escribe esto y presiona Enter**:
   ```javascript
   exportData()
   ```
8. **El archivo se descargará automáticamente** en tu iPhone

## 📁 Dónde Encontrar el Archivo Descargado

### Android:
- Abre la app "Archivos" o "Files"
- Ve a "Descargas" o "Downloads"
- Busca un archivo llamado: `veedor_[tu_usuario]_[fecha].csv`

### iPhone:
- Abre la app "Archivos"
- Ve a "En mi iPhone" > "Safari" > "Descargas"
- O busca en "Descargas" directamente
- Busca un archivo llamado: `veedor_[tu_usuario]_[fecha].csv`

## 📤 Transferir el Archivo a tu Computadora

1. **Por Email**:
   - Abre el archivo en tu móvil
   - Compártelo por email
   - Envíatelo a ti mismo

2. **Por Google Drive / Dropbox**:
   - Sube el archivo a Google Drive o Dropbox
   - Accede desde tu computadora

3. **Por USB**:
   - Conecta tu móvil a la computadora
   - Copia el archivo manualmente

## ✅ Una Vez que Tengas el Archivo

1. **Guarda el archivo** en tu computadora
2. **Dime cuando lo tengas** y te ayudo a importarlo a la aplicación web
3. **O si prefieres**, puedo ayudarte a convertirlo al formato correcto

## 💡 Alternativa: Si No Puedes Conectar por USB

Si no puedes conectar tu móvil por USB, puedes:

1. **Abrir la aplicación en el navegador del móvil** (no como PWA)
2. **Abrir las DevTools directamente en el móvil** (esto es más complicado)
3. **O usar un método de acceso remoto** como Chrome Remote Desktop

## ❓ ¿Necesitas Ayuda?

Si tienes problemas:
- **No puedes encontrar tu dispositivo** en `chrome://inspect`
- **No se descarga el archivo** después de ejecutar `exportData()`
- **Cualquier otro problema**

¡Dime qué paso específico te está dando problemas!
