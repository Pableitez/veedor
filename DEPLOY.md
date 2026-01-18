# 🚀 Desplegar Veedor en la Nube (GRATIS)

## Opción 1: Render.com (Recomendado - Gratis)

### Paso 1: Crear cuenta en MongoDB Atlas (Gratis)

1. Ve a https://www.mongodb.com/cloud/atlas/register
2. Crea una cuenta gratuita
3. Crea un nuevo cluster (gratis - M0)
4. Crea un usuario de base de datos
5. Obtén la cadena de conexión (Connection String)
   - Ejemplo: `mongodb+srv://usuario:password@cluster0.xxxxx.mongodb.net/veedor?retryWrites=true&w=majority`

### Paso 2: Desplegar en Render.com

1. Ve a https://render.com y crea una cuenta
2. Clic en "New +" > "Web Service"
3. Conecta tu repositorio de GitHub
4. Configuración:
   - **Name**: veedor
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

5. Agrega Variables de Entorno:
   - `MONGODB_URI`: Tu cadena de conexión de MongoDB Atlas
   - `JWT_SECRET`: Un secreto aleatorio (puedes generar uno)
   - `NODE_ENV`: `production`
   - `PORT`: `10000` (Render usa este puerto)

6. Clic en "Create Web Service"
7. Espera a que se despliegue (5-10 minutos)

### Paso 3: Actualizar el Frontend

Una vez desplegado, Render te dará una URL como: `https://veedor.onrender.com`

Actualiza `public/app.js` si es necesario (ya está configurado para usar `/api`)

## Opción 2: Fly.io (Alternativa Gratis)

1. Instala Fly CLI: `npm install -g @fly/cli`
2. Login: `fly auth login`
3. Inicializa: `fly launch`
4. Configura variables de entorno en el dashboard de Fly.io
5. Despliega: `fly deploy`

## Variables de Entorno Necesarias

```
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/veedor
JWT_SECRET=tu_secreto_super_seguro_aqui
NODE_ENV=production
PORT=10000
```

## ✅ Después del Deploy

- Tus datos se guardarán en MongoDB Atlas (nube)
- Accesible desde cualquier dispositivo con Internet
- No se pierden datos al borrar caché del navegador
- El token JWT se guarda en localStorage pero los datos están en la nube

