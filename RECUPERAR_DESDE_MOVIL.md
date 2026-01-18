# 📱 Recuperar Datos desde el Móvil

## ✅ ¡Buenas Noticias!

Si tienes la aplicación instalada en tu móvil, es muy probable que los datos estén ahí. Las aplicaciones PWA (Progressive Web Apps) guardan datos localmente en el dispositivo.

## 📋 Pasos para Recuperar Datos desde el Móvil

### Opción 1: Usar la Función de Exportar de la App (Más Fácil)

1. **Abre la aplicación en tu móvil**
2. **Inicia sesión** (si es necesario)
3. **Busca el botón de configuración** (⚙️ o icono de engranaje) en la parte superior derecha
4. **En el menú de configuración, busca "Exportar Datos" o "Exportar"**
   - También puede estar en:
     - Perfil de usuario
     - Configuración de la app
     - O en alguna sección de "Datos" o "Backup"
5. **Haz clic en "Exportar Datos"**
   - La app generará un archivo CSV o JSON
   - Se descargará automáticamente en tu móvil
6. **Encuentra el archivo descargado**
   - En Android: Busca en "Descargas" o "Downloads"
   - En iPhone: Busca en "Archivos" > "Descargas" o en la app "Archivos"
   - El archivo se llamará algo como: `veedor_[tu_usuario]_[fecha].csv`
7. **Transfiere el archivo a tu computadora**
   - Por email (envíatelo a ti mismo)
   - Por Google Drive / Dropbox
   - Por USB
   - O cualquier método que prefieras

**💡 Si no encuentras el botón de exportar:**
- Puede que esté en el menú de tres puntos (⋮)
- O en el perfil de usuario (icono de persona)
- O puedes intentar escribir en la consola del navegador (ver Opción 2)

### Opción 2: Acceder a Local Storage desde el Móvil (Avanzado)

Si la opción de exportar no está disponible, puedes acceder a los datos directamente:

#### Para Android (Chrome):

1. **Abre Chrome en tu móvil**
2. **Abre la aplicación** (veedor.onrender.com)
3. **Conecta tu móvil a la computadora por USB**
4. **En tu computadora, abre Chrome**
5. **Ve a**: `chrome://inspect/#devices`
6. **Habilita "USB Debugging"** en tu móvil (si no está habilitado)
7. **Encuentra tu dispositivo** en la lista
8. **Haz clic en "inspect"** junto a la URL de veedor
9. **Se abrirán las DevTools** (como en desktop)
10. **Ve a la pestaña "Application"**
11. **Expande "Local Storage"** o **"IndexedDB"**
12. **Copia los datos** que encuentres

#### Para iPhone/iPad (Safari):

1. **En tu iPhone, ve a**: Configuración > Safari > Avanzado > Web Inspector (activar)
2. **Conecta tu iPhone a tu Mac por USB**
3. **En tu Mac, abre Safari**
4. **Ve a**: Desarrollo > [Tu iPhone] > veedor.onrender.com
5. **Se abrirán las DevTools**
6. **Ve a la pestaña "Storage"**
7. **Expande "Local Storage"** o **"IndexedDB"**
8. **Copia los datos** que encuentres

### Opción 3: Usar Chrome Remote Debugging (Android)

1. **En tu móvil Android**:
   - Abre Chrome
   - Ve a: `chrome://inspect`
   - O conecta por USB y habilita USB Debugging

2. **En tu computadora**:
   - Abre Chrome
   - Ve a: `chrome://inspect/#devices`
   - Deberías ver tu móvil
   - Haz clic en "inspect" junto a veedor.onrender.com

3. **En las DevTools que se abren**:
   - Ve a "Application" > "Local Storage" o "IndexedDB"
   - Copia los datos

## 🔍 Qué Buscar en Local Storage / IndexedDB

Busca claves como:
- `transactions` o `veedor_transactions`
- `user` o `veedor_user`
- Cualquier dato relacionado con transacciones, cuentas, presupuestos, etc.

## 📤 Una Vez que Tengas los Datos

### Si Exportaste un Archivo JSON:

1. **Guarda el archivo** en tu computadora
2. **Dime qué formato tiene** el archivo
3. **Te ayudo a importarlo** a la aplicación

### Si Copiaste Datos de Local Storage:

1. **Pega los datos aquí** o en un archivo
2. **Te ayudo a convertirlos** al formato correcto
3. **Los importamos** a la aplicación

## 💡 Consejos

- **Haz una copia de seguridad** del archivo exportado antes de importarlo
- **Verifica que los datos** se vean correctos antes de importar
- **Si hay muchos datos**, el proceso puede tardar unos minutos

## ❓ ¿Necesitas Ayuda?

Si tienes problemas para:
- Encontrar la opción de exportar
- Acceder a las DevTools en el móvil
- Exportar o copiar los datos
- Cualquier otra cosa

¡Dime qué paso específico te está dando problemas y te ayudo!
