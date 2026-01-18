# 🔍 Verificar Backups en MongoDB Atlas - Guía Paso a Paso

## 📋 Pasos Detallados

### Paso 1: Acceder a MongoDB Atlas

1. Abre tu navegador
2. Ve a: **https://cloud.mongodb.com/**
3. Inicia sesión con tu cuenta
4. Selecciona tu **proyecto** (si tienes varios)

### Paso 2: Encontrar la Sección de Backups

Hay dos formas de acceder a los backups:

#### Opción A: Menú Lateral Directo
1. En el menú lateral izquierdo, busca **"Backups"**
2. Si lo ves, haz clic directamente

#### Opción B: Menú "More" o "..."
1. Si no ves "Backups" directamente, busca **"More"** o **"..."** en el menú
2. Haz clic y busca **"Backups"** o **"Backup"** en el submenú

### Paso 3: Verificar Estado de Backups

Una vez en la sección de Backups, verás uno de estos escenarios:

#### Escenario 1: Backups Habilitados ✅
- Verás una **lista de snapshots** con fechas y horas
- Cada snapshot muestra:
  - **Fecha y hora** de creación
  - **Tamaño** del backup
  - **Estado** (Completed, In Progress, Failed)
- **Busca un snapshot ANTES de cuando borraste los datos**
- Si encuentras uno, puedes restaurarlo

#### Escenario 2: Backups Deshabilitados ❌
- Verás un mensaje como: **"Backups are disabled"** o **"Backups deshabilitados"**
- O verás un botón: **"Enable Backups"** o **"Habilitar Backups"**
- En este caso, **NO hay backups disponibles** para recuperar
- Pero puedes habilitarlos para el futuro (ver `habilitar-backups.md`)

#### Escenario 3: No Encuentras la Sección
- Puede que tu plan no incluya backups automáticos
- O puede estar en otra ubicación del menú
- Intenta buscar en: **"Database"** > **"Backups"**
- O en: **"Clusters"** > [Tu cluster] > **"Backups"**

### Paso 4: Si Encuentras un Backup

Si ves snapshots disponibles:

1. **Identifica el snapshot correcto**:
   - Busca uno con fecha **ANTES** de cuando borraste los datos
   - Verifica que el estado sea **"Completed"** (no "Failed" o "In Progress")

2. **Restaurar el backup**:
   - Haz clic en el snapshot que quieres restaurar
   - Busca el botón **"Restore"** o **"Restaurar"**
   - Elige restaurar a:
     - **Nueva base de datos** (recomendado - no sobrescribe datos actuales)
     - O la base de datos actual si estás seguro

3. **Esperar a que termine**:
   - La restauración puede tardar varios minutos
   - MongoDB te notificará cuando termine

4. **Verificar datos restaurados**:
   - Ejecuta: `node verificar-datos.js`
   - O inicia sesión en la aplicación y verifica tus transacciones

### Paso 5: Si NO Encuentras Backups

Si no hay backups disponibles:

1. **Los datos no se pueden recuperar desde el servidor** ❌
2. **Opciones alternativas**:
   - ¿Tienes algún archivo JSON exportado desde la app?
   - ¿Tienes datos en localStorage del navegador?
   - Si no, tendrás que empezar de nuevo

3. **Habilitar backups para el futuro**:
   - Sigue la guía en `habilitar-backups.md`
   - Configura backups automáticos diarios
   - Esto evitará que vuelva a pasar

## 📸 Ubicaciones Comunes en el Dashboard

La sección de Backups puede estar en:

- **Menú lateral izquierdo**: "Backups"
- **Menú "More"**: "Backups"
- **Cluster específico**: Clusters > [Tu cluster] > "Backups"
- **Database**: Database > "Backups"

## ⚠️ Notas Importantes

- **Plan Gratuito**: Puede tener backups limitados o no incluirlos
- **Plan Pago**: Generalmente incluye backups automáticos
- **Primer Backup**: Si acabas de habilitar backups, el primero puede tardar horas

## ✅ Checklist

- [ ] Accedí a MongoDB Atlas
- [ ] Encontré la sección "Backups"
- [ ] Verifiqué si hay snapshots disponibles
- [ ] Si hay backups, identifiqué uno anterior a cuando borré los datos
- [ ] Si no hay backups, entiendo que los datos no se pueden recuperar
- [ ] Habilitaré backups para el futuro

## 💡 Después de Verificar

**Si encontraste backups y los restauraste:**
- Ejecuta `node verificar-datos.js` para confirmar
- Inicia sesión en la app y verifica tus datos

**Si NO encontraste backups:**
- Los datos no se pueden recuperar desde el servidor
- Habilitar backups ahora para prevenir futuras pérdidas
- Considerar exportar datos manualmente periódicamente

## ❓ ¿Necesitas Ayuda?

Si tienes problemas para encontrar la sección de Backups:
1. Toma una captura de pantalla del dashboard
2. O describe qué ves en el menú lateral
3. Te puedo guiar más específicamente
