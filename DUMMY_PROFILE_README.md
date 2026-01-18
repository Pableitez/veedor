# Perfil Demo - Veedor

Este script crea un perfil de demostración con datos financieros realistas de una persona solvente.

## 📋 Credenciales del Perfil Demo

- **Email:** `demo@veedor.com`
- **Usuario:** `demo_user`
- **Contraseña:** `demo123`

## ⚠️ Importante: Si ves "Sesión Expirada"

Si después de crear el perfil dummy ves el mensaje "Sesión expirada", simplemente:

1. **Cierra sesión** (si estás logueado con otro usuario)
2. **Inicia sesión** con las credenciales de arriba
3. El usuario dummy está completamente funcional y listo para usar

El mensaje de "sesión expirada" aparece porque puede haber un token antiguo en el navegador. Al hacer login de nuevo con las credenciales del usuario dummy, todo funcionará correctamente.comm

## 🚀 Cómo Ejecutar

1. Asegúrate de tener un archivo `.env` en la raíz del proyecto con tu `MONGODB_URI`:
   ```
   MONGODB_URI=tu_uri_de_mongodb_atlas
   ```

2. Ejecuta el script:
   ```bash
   node create-dummy-profile.js
   ```

## 💰 Datos Incluidos en el Perfil

### Cuentas Bancarias (3)
- **Cuenta Nómina BBVA**: 8,500.50€
- **Cuenta Ahorro Santander**: 12,500.00€
- **Cuenta Inversión ING**: 3,200.75€
- **Total**: ~24,200€

### Propiedad
- **Piso Centro Madrid**: 85m²
- **Valor de compra**: 280,000€
- **Valor actual**: 310,000€ (apreciación del 10.7%)

### Hipoteca
- **Principal inicial**: 250,000€
- **Capital restante**: ~223,000€
- **Cuota mensual**: 1,125.50€
- **TIN**: 2.5%
- **TAE**: 2.8%
- **Asociada a**: Piso Centro Madrid

### Inversiones (2)
- **Cartera Acciones Diversificada**: 18,500€
- **Fondo Indexado Global**: 12,000€
- **Total**: ~30,500€

### Transacciones
- **Últimos 12 meses** de ingresos y gastos
- **Ingresos mensuales**: 3,200€ (nómina)
- **Gastos mensuales**: ~2,200€ (incluyendo hipoteca)
- **Ahorro mensual**: ~800€
- **Inversiones periódicas**: 1,000-3,000€ cada 2-3 meses

### Presupuestos Mensuales
- Alimentación: 500€
- Transporte: 150€
- Facturas: 250€
- Entretenimiento: 100€
- Compras: 200€

### Fondo de Emergencia
- **Meta**: 15,000€
- **Actual**: 12,500€ (83.3%)

## 📊 Situación Financiera

Este perfil representa una persona **financieramente solvente** con:
- ✅ Ingresos estables
- ✅ Control de gastos
- ✅ Ahorro regular
- ✅ Inversiones diversificadas
- ✅ Propiedad con hipoteca manejable
- ✅ Fondo de emergencia en crecimiento

## 🔄 Re-ejecutar el Script

Si el usuario demo ya existe, el script lo eliminará y creará uno nuevo con datos frescos.

## ⚠️ Nota

Este perfil es solo para demostración. Los datos son ficticios pero representan una situación financiera realista y saludable.

