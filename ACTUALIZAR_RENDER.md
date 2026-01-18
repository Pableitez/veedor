# 🔧 Actualizar Variables de Entorno en Render

## ❌ Problema

El servidor en Render está devolviendo error 503: "Base de datos no disponible". Esto significa que las variables de entorno en Render no están configuradas con la nueva URI de MongoDB.

## ✅ Solución: Actualizar Variables de Entorno en Render

### Paso 1: Acceder a Render Dashboard

1. Ve a https://dashboard.render.com/
2. Inicia sesión con tu cuenta
3. Selecciona tu servicio **veedor**

### Paso 2: Actualizar Variables de Entorno

1. En el menú lateral, haz clic en **"Environment"**
2. Busca las siguientes variables y actualízalas:

#### Variable: `MONGODB_URI`
**Valor:**
```
mongodb+srv://veedor_admin:EBS2iHSo5EGwMBeI@cluster0.sqt1psn.mongodb.net/redSocialDB?retryWrites=true&w=majority
```

#### Variable: `MONGO_URI` (opcional, para compatibilidad)
**Valor:**
```
mongodb+srv://veedor_admin:EBS2iHSo5EGwMBeI@cluster0.sqt1psn.mongodb.net/redSocialDB?retryWrites=true&w=majority
```

#### Variable: `JWT_SECRET`
**Valor:**
```
veedor_secreto_super_seguro_2025_520845
```

#### Variable: `PORT`
**Valor:**
```
10000
```

#### Variable: `NODE_ENV`
**Valor:**
```
production
```

### Paso 3: Guardar y Redesplegar

1. Haz clic en **"Save Changes"** al final de la página
2. Render automáticamente redesplegará el servicio con las nuevas variables
3. Espera 2-5 minutos mientras se redespliega

### Paso 4: Verificar la Conexión

Una vez redesplegado, verifica que todo funcione:

1. Ve a tu aplicación: https://veedor.onrender.com/
2. Intenta iniciar sesión o registrarte
3. Si aún hay errores, revisa los logs en Render:
   - Ve a **"Logs"** en el menú lateral
   - Busca mensajes sobre MongoDB
   - Deberías ver: `✅ Conectado a MongoDB exitosamente`

## 📝 Notas Importantes

- **Base de datos**: Se está usando `redSocialDB` (no `veedor`)
- **Credenciales**: Las credenciales están en el archivo `RENDER_DEPLOY.txt` (no subir a Git)
- **Seguridad**: Nunca subas archivos con credenciales reales a Git

## 🔍 Verificar Logs en Render

Si hay problemas, revisa los logs:

1. Ve a **"Logs"** en Render
2. Busca mensajes que contengan:
   - `MONGODB_URI configurado`
   - `Intentando conectar a MongoDB`
   - `✅ Conectado a MongoDB exitosamente` o `❌ Error conectando a MongoDB`

## ❓ Problemas Comunes

**Error: "bad auth : authentication failed"**
- Verifica que la contraseña en la URI sea correcta
- Verifica que el usuario `veedor_admin` exista en MongoDB Atlas

**Error: "ENOTFOUND" o "ETIMEDOUT"**
- Verifica que el cluster de MongoDB Atlas esté activo
- Verifica que la IP de Render esté en la whitelist de MongoDB Atlas (agrega `0.0.0.0/0`)

**Error: "Base de datos no disponible"**
- Verifica que las variables de entorno estén guardadas correctamente
- Espera unos minutos después de guardar para que Render redespliegue
- Revisa los logs para ver el error específico
