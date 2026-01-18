# 🔄 Actualizar Configuración de MongoDB

## ❌ Problema Detectado

La conexión a MongoDB está fallando con error de autenticación. Esto significa que:
- Las credenciales han cambiado
- El usuario fue eliminado o la contraseña fue modificada
- La URI de conexión necesita ser actualizada

## ✅ Solución: Obtener Nueva URI de MongoDB Atlas

### Paso 1: Acceder a MongoDB Atlas

1. Ve a https://cloud.mongodb.com/
2. Inicia sesión con tu cuenta
3. Selecciona tu proyecto/cluster

### Paso 2: Obtener la Nueva Connection String

1. En el dashboard, haz clic en **"Connect"** en tu cluster
2. Selecciona **"Connect your application"**
3. Copia la **Connection String** que aparece
   - Formato: `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`
4. **Reemplaza** `<password>` con tu contraseña real del usuario de base de datos
5. **Agrega** `/veedor` antes del `?` para especificar la base de datos:
   - Ejemplo: `mongodb+srv://usuario:password@cluster0.xxxxx.mongodb.net/veedor?retryWrites=true&w=majority`

### Paso 3: Verificar Usuario y Contraseña

Si no recuerdas las credenciales:

1. Ve a **Database Access** en MongoDB Atlas
2. Verifica que el usuario exista
3. Si no existe, crea uno nuevo:
   - Click en **"Add New Database User"**
   - Elige **"Password"** como método de autenticación
   - Crea un usuario y contraseña (guárdalos en un lugar seguro)
   - Asigna permisos: **"Read and write to any database"**

### Paso 4: Verificar Network Access

1. Ve a **Network Access** en MongoDB Atlas
2. Asegúrate de que tu IP esté permitida o agrega `0.0.0.0/0` para permitir todas las IPs (solo para desarrollo)

### Paso 5: Actualizar la Configuración

#### Opción A: Para Desarrollo Local (crear archivo .env)

Crea un archivo `.env` en la raíz del proyecto `veedor-main/`:

```env
MONGODB_URI=mongodb+srv://tu_usuario:tu_password@cluster0.xxxxx.mongodb.net/veedor?retryWrites=true&w=majority
JWT_SECRET=tu_secreto_super_seguro_aqui
PORT=3000
NODE_ENV=development
```

**⚠️ IMPORTANTE:** No subas el archivo `.env` a Git. Agrega `.env` a `.gitignore`.

#### Opción B: Para Producción (Render.com)

1. Ve a tu dashboard de Render.com
2. Selecciona tu servicio
3. Ve a **Environment** en el menú lateral
4. Actualiza la variable `MONGODB_URI` con la nueva connection string
5. Guarda los cambios (Render redeployará automáticamente)

### Paso 6: Probar la Conexión

Ejecuta el script de prueba:

```bash
cd veedor-main
node test-mongodb-connection.js
```

Si la conexión es exitosa, verás:
```
✅ ¡Conexión exitosa a MongoDB!
✅ La base de datos está disponible y funcionando correctamente.
```

## 📝 Actualizar RENDER_DEPLOY.txt (Opcional)

Si quieres actualizar el archivo de referencia:

1. Abre `RENDER_DEPLOY.txt`
2. Actualiza la línea `MONGODB_URI=` con tu nueva connection string
3. **⚠️ NO subas este archivo a Git si contiene credenciales reales**

## 🔒 Seguridad

- **NUNCA** subas archivos con credenciales reales a Git
- Usa variables de entorno para credenciales
- Mantén tus contraseñas seguras
- Considera rotar contraseñas periódicamente

## ❓ ¿Necesitas Ayuda?

Si sigues teniendo problemas:

1. Verifica que el cluster de MongoDB Atlas esté activo
2. Verifica que el usuario tenga los permisos correctos
3. Verifica que tu IP esté en la whitelist
4. Revisa los logs del servidor para más detalles del error
