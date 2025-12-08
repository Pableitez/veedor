@echo off
echo ========================================
echo Despliegue de Veedor en la Nube
echo ========================================
echo.
echo OPCION 1: Railway (Recomendado - Mas facil)
echo.
echo 1. Ve a: https://railway.app
echo 2. Inicia sesion con GitHub
echo 3. Clic en "New Project"
echo 4. Selecciona "Deploy from GitHub repo"
echo 5. Selecciona tu repositorio: Pableitez/veedor
echo 6. Railway detectara automaticamente Node.js
echo 7. Espera a que se despliegue (2-3 minutos)
echo 8. Clic en el proyecto > Settings > Generate Domain
echo 9. Copia la URL (ejemplo: veedor-production.up.railway.app)
echo 10. Actualiza public/app.js con esa URL en API_URL
echo.
echo ========================================
echo OPCION 2: Render (Alternativa)
echo ========================================
echo.
echo 1. Ve a: https://render.com
echo 2. Inicia sesion con GitHub
echo 3. Clic en "New +" > "Web Service"
echo 4. Conecta tu repositorio: Pableitez/veedor
echo 5. Configuracion:
echo    - Name: veedor
echo    - Environment: Node
echo    - Build Command: npm install
echo    - Start Command: node server.js
echo 6. Clic en "Create Web Service"
echo 7. Espera el despliegue
echo 8. Copia la URL generada
echo.
pause

