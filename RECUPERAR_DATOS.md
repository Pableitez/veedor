# 🔄 Recuperar Datos Perdidos

## ❌ Situación Actual

Los datos (transacciones, usuarios, etc.) han sido borrados de la base de datos.

## 🔍 Verificar Backups en MongoDB Atlas

### Paso 1: Acceder a MongoDB Atlas

1. Ve a https://cloud.mongodb.com/
2. Inicia sesión con tu cuenta
3. Selecciona tu proyecto/cluster

### Paso 2: Verificar Backups Automáticos

1. En el menú lateral, busca **"Backups"** o **"Backup"**
2. Si tienes backups habilitados, verás una lista de snapshots
3. Cada snapshot tiene una fecha y hora
4. Busca un snapshot **ANTES** de cuando borraste los datos

### Paso 3: Restaurar desde Backup (si existe)

Si encuentras un backup:

1. Haz clic en el snapshot que quieres restaurar
2. Selecciona **"Restore"** o **"Restaurar"**
3. Elige restaurar a:
   - **Nueva base de datos** (recomendado para no sobrescribir datos actuales)
   - O la base de datos actual si estás seguro

### Paso 4: Verificar Datos Restaurados

Después de restaurar, ejecuta:
```bash
node verificar-datos.js
```

## ⚠️ Si NO Hay Backups

Si MongoDB Atlas no tiene backups automáticos habilitados, los datos no se pueden recuperar desde el servidor.

### Opciones Alternativas:

1. **Verificar Exportaciones Locales**
   - ¿Tienes algún archivo JSON exportado desde la aplicación?
   - Si tienes, puedo ayudarte a importarlo

2. **Verificar Caché del Navegador**
   - A veces los datos pueden estar en localStorage del navegador
   - Abre las DevTools (F12) > Application > Local Storage
   - Busca datos relacionados con transacciones

3. **Empezar de Nuevo**
   - Si no hay forma de recuperar, tendrás que empezar de nuevo
   - Pero podemos configurar backups para evitar que vuelva a pasar

## 🛡️ Prevenir Pérdida de Datos en el Futuro

### 1. Habilitar Backups Automáticos en MongoDB Atlas

1. Ve a MongoDB Atlas > **Backups**
2. Si no está habilitado, haz clic en **"Enable Backups"**
3. Elige el plan (hay opciones gratuitas con backups limitados)
4. Configura la frecuencia de backups

### 2. Exportar Datos Periódicamente

La aplicación tiene función de exportar datos. Úsala regularmente:

1. Inicia sesión en la aplicación
2. Ve a la sección de configuración o exportación
3. Exporta tus datos a JSON
4. Guarda el archivo en un lugar seguro (Google Drive, Dropbox, etc.)

### 3. Configurar Alertas

En MongoDB Atlas, configura alertas para:
- Backups fallidos
- Espacio de almacenamiento bajo
- Conexiones fallidas

## 📝 Configuración Recomendada

### MongoDB Atlas - Configuración de Seguridad

1. **Backups Automáticos**: HABILITADO
2. **Frecuencia**: Diaria (mínimo)
3. **Retención**: Al menos 7 días
4. **Alertas**: Configuradas para backups

### Variables de Entorno - Usar Base de Datos Consistente

Asegúrate de usar siempre la misma base de datos:
- **Desarrollo local**: `redSocialDB` o `veedor` (elige uno y manténlo)
- **Producción (Render)**: La misma base de datos

## 🔧 Scripts de Utilidad

He creado estos scripts para ayudarte:

- `verificar-datos.js` - Verifica qué datos hay en cada base de datos
- `migrar-datos.js` - Migra datos entre bases de datos
- `listar-bases-datos.js` - Lista todas las bases de datos en el cluster

## 💡 Recomendaciones

1. **Habilita backups automáticos HOY** - No esperes
2. **Exporta tus datos semanalmente** - Crea el hábito
3. **Usa la misma base de datos** - No cambies entre `veedor` y `redSocialDB`
4. **Documenta cambios importantes** - Si cambias configuración, anótalo

## ❓ ¿Necesitas Ayuda?

Si necesitas ayuda para:
- Habilitar backups en MongoDB Atlas
- Configurar exportaciones automáticas
- Restaurar desde un backup
- Cualquier otra cosa relacionada

¡Solo pregunta!
