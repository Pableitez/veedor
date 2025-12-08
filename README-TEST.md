# Guía de Pruebas - Usuario de Prueba

## Crear Usuario de Prueba

Para crear un usuario de prueba con datos de ejemplo, ejecuta:

```bash
node test-user.js
```

**Requisitos:**
- Debes tener configurado `MONGODB_URI` en tu archivo `.env`
- El script se conectará a tu base de datos MongoDB Atlas

## Credenciales del Usuario de Prueba

Una vez ejecutado el script, podrás iniciar sesión con:

- **Email:** `test@veedor.com`
- **Username:** `testuser`
- **Password:** `test1234`

Puedes usar **cualquiera de los dos** (email o username) para iniciar sesión.

## Datos de Prueba Incluidos

El script crea:

- ✅ **5 transacciones** (ingresos y gastos de ejemplo)
- ✅ **1 sobre** (presupuesto para vacaciones)
- ✅ **1 préstamo** (hipoteca de ejemplo)
- ✅ **1 inversión** (fondo indexado con historial de aportes)
- ✅ **1 cuenta bancaria** (cuenta principal con saldo)
- ✅ **1 activo** (vehículo con historial de valor)
- ✅ **1 presupuesto** (presupuesto mensual de comida)

## Probar Funcionalidades

Con este usuario puedes probar:

1. **Transacciones:**
   - Ver historial de transacciones
   - Crear nuevas transacciones
   - Filtrar por categoría, mes, etc.
   - Asociar transacciones a cuentas e inversiones

2. **Presupuestos:**
   - Ver presupuestos existentes
   - Crear nuevos presupuestos (semanal, mensual, anual)
   - Ver cumplimiento de presupuestos

3. **Préstamos:**
   - Ver detalles del préstamo
   - Ver tabla de amortización
   - Simular amortización anticipada

4. **Inversiones:**
   - Ver inversión existente con historial
   - Añadir dinero a la inversión
   - Actualizar valor actual
   - Ver rentabilidad calculada

5. **Cuentas:**
   - Ver cuenta bancaria
   - Crear nuevas cuentas
   - Editar saldos

6. **Patrimonio:**
   - Ver activo existente
   - Crear nuevos activos
   - Ver evolución de valor

7. **Análisis:**
   - Ver gráficas de ingresos/gastos
   - Ver métricas de salud financiera
   - Ver tablas de análisis
   - Exportar datos a CSV

8. **Dashboard:**
   - Ver resumen por mes/año/total
   - Ver panel de mandos mensual
   - Ver cards de resumen

## Nota

El script eliminará cualquier usuario de prueba existente antes de crear uno nuevo, para evitar duplicados.

