# 🔧 Solucionar Auto-Deploy en Render

## Problema: No se hace deploy automático desde GitHub a Render

## Solución Paso a Paso:

### 1. Verificar Configuración en Render Dashboard

1. **Ve a tu dashboard de Render**: https://dashboard.render.com
2. **Selecciona tu servicio "veedor"**
3. **Ve a la pestaña "Settings"**

### 2. Verificar Conexión con GitHub

En la sección **"Source"** verifica:
- ✅ **Connected Repository**: Debe mostrar `Pableitez/veedor`
- ✅ **Branch**: Debe estar en `main` (no `master`)
- ✅ **Root Directory**: Debe estar vacío o ser `.` (raíz del proyecto)

### 3. Activar Auto-Deploy

En la sección **"Auto-Deploy"**:
- ✅ **Auto-Deploy**: Debe estar en **"Yes"**
- Si está en "No", cámbialo a "Yes" y guarda

### 4. Verificar Webhook de GitHub

1. **Ve a tu repositorio en GitHub**: https://github.com/Pableitez/veedor
2. **Settings** > **Webhooks**
3. **Verifica que existe un webhook de Render**:
   - URL debe ser algo como: `https://api.render.com/webhook/...`
   - Debe estar activo (Active: ✅)
   - Events: debe incluir "push"

### 5. Si el Webhook NO Existe o Está Roto

**Opción A: Reconectar el Repositorio en Render**
1. En Render Dashboard > Settings > Source
2. Haz clic en **"Disconnect"** (desconectar)
3. Luego **"Connect"** y selecciona tu repositorio nuevamente
4. Asegúrate de seleccionar la rama `main`
5. Activa **Auto-Deploy: Yes**

**Opción B: Crear Webhook Manualmente en GitHub**
1. Ve a GitHub > Settings > Webhooks > Add webhook
2. Payload URL: `https://api.render.com/webhook/v2/services/[TU_SERVICE_ID]`
   - Para obtener el Service ID, ve a Render Dashboard > Settings > Service Details
3. Content type: `application/json`
4. Events: Selecciona "Just the push event"
5. Active: ✅
6. Add webhook

### 6. Verificar que los Commits se Están Pusheando

Ejecuta estos comandos para verificar:

```bash
# Verificar que estás en la rama main
git branch

# Verificar que tienes commits sin pushear
git status

# Si hay commits sin pushear, hacer push
git push origin main
```

### 7. Forzar un Deploy Manual (Para Probar)

1. En Render Dashboard > tu servicio
2. Haz clic en **"Manual Deploy"** > **"Deploy latest commit"**
3. Esto debería funcionar. Si funciona, el problema es solo el auto-deploy.

### 8. Verificar Logs de Render

1. En Render Dashboard > tu servicio
2. Ve a la pestaña **"Logs"**
3. Busca mensajes de error relacionados con:
   - Webhook
   - Build
   - Deploy

### 9. Verificar que el Archivo render.yaml Está en el Repositorio

El archivo `render.yaml` debe estar en la raíz del repositorio y debe estar commiteado:

```bash
# Verificar que render.yaml existe y está en git
git ls-files | grep render.yaml

# Si no está, agregarlo
git add render.yaml
git commit -m "Add render.yaml configuration"
git push origin main
```

### 10. Solución Rápida: Recrear el Servicio

Si nada funciona, puedes recrear el servicio:

1. **NO BORRES** el servicio actual todavía
2. Crea un **nuevo servicio** en Render:
   - New + > Web Service
   - Conecta el mismo repositorio
   - Usa la misma configuración
   - **Auto-Deploy: Yes**
3. Una vez que funcione, puedes borrar el servicio viejo

## Checklist de Verificación

- [ ] Servicio conectado a GitHub en Render
- [ ] Branch configurado como `main`
- [ ] Auto-Deploy activado en "Yes"
- [ ] Webhook existe en GitHub y está activo
- [ ] Últimos commits pusheados a GitHub
- [ ] `render.yaml` existe en la raíz del repo
- [ ] No hay errores en los logs de Render

## Comandos Útiles

```bash
# Ver estado del repositorio
git status

# Ver commits recientes
git log --oneline -5

# Hacer push de cambios
git push origin main

# Verificar rama remota
git branch -a

# Verificar remotes
git remote -v
```

## Contacto con Render Support

Si nada funciona, contacta a Render Support:
- Email: support@render.com
- Incluye: Service ID, Repository URL, y descripción del problema

