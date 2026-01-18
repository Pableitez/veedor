# 🛡️ Habilitar Backups en MongoDB Atlas (Paso a Paso)

## 📋 Pasos Detallados

### 1. Acceder a MongoDB Atlas

1. Ve a https://cloud.mongodb.com/
2. Inicia sesión
3. Selecciona tu proyecto

### 2. Ir a la Sección de Backups

1. En el menú lateral izquierdo, busca **"Backups"**
2. Si no lo ves, puede estar en **"More"** o **"..."**
3. Haz clic en **"Backups"**

### 3. Verificar Estado Actual

- Si ves **"Backups are disabled"** o **"Backups deshabilitados"**: Necesitas habilitarlos
- Si ves una lista de snapshots: Ya están habilitados ✅

### 4. Habilitar Backups (si están deshabilitados)

1. Haz clic en **"Enable Backups"** o **"Habilitar Backups"**
2. MongoDB Atlas te mostrará opciones:
   - **Cloud Backup** (recomendado) - Backups en la nube de MongoDB
   - **Continuous Backup** - Backups continuos (puede tener costo)
3. Para el plan gratuito, elige **"Cloud Backup"** si está disponible
4. Sigue las instrucciones en pantalla

### 5. Configurar Frecuencia

Una vez habilitado:

1. Ve a **"Backup Schedule"** o **"Programación de Backups"**
2. Configura:
   - **Frecuencia**: Diaria (recomendado)
   - **Hora**: Elige una hora donde no uses mucho la app
   - **Retención**: Al menos 7 días (más si es posible)

### 6. Verificar que Funciona

1. Espera 24 horas
2. Vuelve a la sección **"Backups"**
3. Deberías ver al menos un snapshot
4. Si ves snapshots, ¡los backups están funcionando! ✅

## ⚠️ Notas Importantes

- **Plan Gratuito**: Puede tener limitaciones en backups (número de snapshots, frecuencia, etc.)
- **Plan Pago**: Ofrece más opciones de backup y retención más larga
- **Primer Backup**: Puede tardar varias horas en completarse

## 🔔 Configurar Alertas

Para recibir notificaciones si algo falla:

1. Ve a **"Alerts"** en el menú lateral
2. Crea una alerta para:
   - **Backup Failed** - Si un backup falla
   - **Backup Storage Full** - Si se llena el espacio de backups

## ✅ Checklist

- [ ] Backups habilitados en MongoDB Atlas
- [ ] Frecuencia configurada (diaria recomendada)
- [ ] Retención configurada (mínimo 7 días)
- [ ] Alertas configuradas para backups
- [ ] Verificado que el primer backup se completó

## 💡 Consejo Extra

Además de los backups automáticos de MongoDB Atlas, también deberías:
- Exportar datos manualmente desde la app cada semana
- Guardar los archivos JSON en Google Drive o Dropbox
- Tener al menos 2 copias de seguridad en lugares diferentes
