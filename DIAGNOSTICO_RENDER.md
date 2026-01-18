# 🔍 Diagnóstico de Error 502 en Render

## ❌ Problema

El servidor está devolviendo error **502 (Bad Gateway)**, lo que significa que Render no puede comunicarse con el proceso de Node.js.

## 🔍 Pasos para Diagnosticar

### 1. Revisar los Logs en Render

1. Ve a https://dashboard.render.com/
2. Selecciona tu servicio **veedor**
3. Haz clic en **"Logs"** en el menú lateral
4. Busca errores que contengan:
   - `❌ Error`
   - `Error conectando a MongoDB`
   - `EADDRINUSE`
   - `Cannot find module`
   - Cualquier stack trace

### 2. Verificar Variables de Entorno

Asegúrate de que estas variables estén configuradas correctamente:

```
MONGODB_URI=mongodb+srv://veedor_admin:EBS2iHSo5EGwMBeI@cluster0.sqt1psn.mongodb.net/redSocialDB?retryWrites=true&w=majority
MONGO_URI=mongodb+srv://veedor_admin:EBS2iHSo5EGwMBeI@cluster0.sqt1psn.mongodb.net/redSocialDB?retryWrites=true&w=majority
PORT=10000
NODE_ENV=production
JWT_SECRET=veedor_secreto_super_seguro_2025_520845
```

### 3. Verificar que el Servidor Esté Iniciando

En los logs, deberías ver:
```
🚀 Servidor corriendo en Render.com en puerto 10000
📊 Base de datos: MongoDB - ✅ Conectado
```

Si no ves estos mensajes, el servidor no está iniciando correctamente.

### 4. Problemas Comunes y Soluciones

#### Problema: "Cannot find module"
**Solución:**
- Verifica que `package.json` tenga todas las dependencias
- Render debería ejecutar `npm install` automáticamente
- Si no, verifica el build command en Render

#### Problema: "EADDRINUSE" (Puerto en uso)
**Solución:**
- Asegúrate de que `PORT=10000` esté configurado
- Render usa el puerto de la variable de entorno automáticamente

#### Problema: "Error conectando a MongoDB"
**Solución:**
- Verifica que `MONGODB_URI` esté correctamente configurado
- Verifica que la contraseña sea correcta (sin espacios)
- Verifica que la IP de Render esté en la whitelist de MongoDB Atlas

#### Problema: El servidor se cae inmediatamente después de iniciar
**Solución:**
- Revisa los logs completos para ver el error exacto
- Verifica que no haya errores de sintaxis en `server.js`
- Asegúrate de que todas las dependencias estén instaladas

### 5. Forzar un Nuevo Deploy

Si nada funciona:

1. Ve a **"Manual Deploy"** en Render
2. Selecciona **"Clear build cache & deploy"**
3. Espera a que termine el deploy
4. Revisa los logs nuevamente

### 6. Verificar Health Check

Render tiene un health check endpoint. Verifica que funcione:

1. Ve a: `https://veedor.onrender.com/api/health`
2. Deberías ver un JSON con el estado del servidor
3. Si no responde, el servidor no está funcionando

## 📝 Información para Compartir

Si necesitas ayuda, comparte:

1. **Logs completos** de Render (últimas 100 líneas)
2. **Variables de entorno** configuradas (sin mostrar contraseñas)
3. **Mensaje de error exacto** que ves en el navegador
4. **Estado del servicio** en Render (Running, Failed, etc.)

## ✅ Checklist Rápido

- [ ] Variables de entorno configuradas correctamente
- [ ] MongoDB Atlas tiene la IP de Render en whitelist (0.0.0.0/0)
- [ ] El servicio está en estado "Running" en Render
- [ ] Los logs muestran que el servidor inició correctamente
- [ ] El endpoint `/api/health` responde
- [ ] No hay errores de módulos faltantes en los logs
