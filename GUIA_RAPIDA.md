# 🚀 Guía Rápida - Acceso desde Otros Dispositivos

## ✅ Estado Actual

- **Servidor**: ✅ Corriendo en puerto 3000
- **Tu IP Local**: `192.168.1.134`
- **URL de Acceso**: `http://192.168.1.134:3000`

## 📱 Cómo Acceder desde Otros Dispositivos

### Paso 1: Configurar el Firewall (IMPORTANTE)

**Opción A - Script Automático:**
1. Haz doble clic en `configurar_firewall.bat`
2. Presiona Enter cuando se te pida
3. ¡Listo!

**Opción B - Manual:**
1. Abre "Firewall de Windows Defender"
2. Ve a "Configuración avanzada"
3. Clic en "Reglas de entrada" > "Nueva regla"
4. Selecciona "Puerto" > Siguiente
5. TCP > Puerto específico: `3000` > Siguiente
6. "Permitir la conexión" > Siguiente
7. Marca todas las casillas > Siguiente
8. Nombre: "Veedor - Puerto 3000" > Finalizar

### Paso 2: Acceder desde tu Teléfono/Tablet

1. **Asegúrate de estar en la misma WiFi** que tu computadora
2. Abre el navegador en tu dispositivo móvil
3. Ingresa esta dirección:
   ```
   http://192.168.1.134:3000
   ```
4. ¡Deberías ver la pantalla de login de Veedor!

### Paso 3: Verificar que Todo Funciona

Ejecuta `verificar_servidor.bat` para verificar el estado completo.

## 🔧 Solución de Problemas

### ❌ No puedo acceder desde mi teléfono

1. **Verifica la WiFi:**
   - Tu computadora y teléfono deben estar en la misma red WiFi
   - No uses datos móviles en el teléfono

2. **Verifica el firewall:**
   - Ejecuta `configurar_firewall.bat`
   - O verifica manualmente en Firewall de Windows

3. **Verifica que el servidor esté corriendo:**
   - Deberías ver "Servidor corriendo" en la consola
   - Si no, ejecuta `npm start`

4. **Prueba desde la misma computadora primero:**
   - Abre `http://localhost:3000` en tu navegador
   - Si funciona, el problema es de red/firewall

### ⚠️ La IP cambió

Si te desconectas y reconectas a otra WiFi, tu IP puede cambiar. Para ver tu nueva IP:
```bash
ipconfig | findstr "IPv4"
```

O ejecuta `verificar_servidor.bat`

## 📝 Notas Importantes

- La IP `192.168.1.134` es solo para tu red actual
- Si cambias de WiFi, la IP puede cambiar
- El servidor debe estar corriendo para acceder desde otros dispositivos
- Solo funciona en tu red local (no desde Internet)

## 🎯 Próximos Pasos

1. ✅ Configura el firewall (ejecuta `configurar_firewall.bat`)
2. ✅ Abre `http://192.168.1.134:3000` desde tu teléfono
3. ✅ Crea una cuenta o inicia sesión
4. ✅ ¡Empieza a usar Veedor desde cualquier dispositivo!





