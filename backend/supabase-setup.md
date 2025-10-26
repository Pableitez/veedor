# Configuración de Supabase para Veedor

## 🚀 Pasos para Configurar Supabase

### 1. Crear Proyecto en Supabase
1. Ve a [supabase.com](https://supabase.com)
2. Crea una cuenta gratuita
3. Crea un nuevo proyecto
4. Anota tu URL y API Key

### 2. Configurar Base de Datos
1. Ve a la pestaña "SQL Editor"
2. Ejecuta el script `database-schema.sql`
3. Verifica que todas las tablas se crearon correctamente

### 3. Configurar Autenticación
1. Ve a "Authentication" > "Settings"
2. Habilita "Email" como provider
3. Configura las URLs de redirección:
   - Site URL: `http://localhost:3000` (desarrollo)
   - Redirect URLs: `http://localhost:3000/auth/callback`

### 4. Configurar Row Level Security (RLS)
```sql
-- Habilitar RLS en todas las tablas
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE recurring_expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_analytics ENABLE ROW LEVEL SECURITY;

-- Políticas para usuarios (solo pueden ver sus propios datos)
CREATE POLICY "Users can view own data" ON users
    FOR ALL USING (auth.uid() = id);

CREATE POLICY "Users can view own financial profiles" ON financial_profiles
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own categories" ON categories
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own transactions" ON transactions
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own recurring expenses" ON recurring_expenses
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own budgets" ON budgets
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own goals" ON financial_goals
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own analytics" ON financial_analytics
    FOR ALL USING (auth.uid() = user_id);
```

### 5. Variables de Entorno
Crear archivo `.env` en la raíz del proyecto:
```env
VITE_SUPABASE_URL=tu_supabase_url_aqui
VITE_SUPABASE_ANON_KEY=tu_supabase_anon_key_aqui
```

### 6. Instalar Dependencias
```bash
npm install @supabase/supabase-js
```

## 📊 Características del Sistema

### Perfiles de Usuario
- ✅ Registro e inicio de sesión
- ✅ Perfil personal con avatar
- ✅ Configuración de moneda y zona horaria
- ✅ Datos financieros básicos (salario, objetivos)

### Gestión de Transacciones
- ✅ Transacciones de ingresos y gastos
- ✅ Categorías personalizables
- ✅ Tags y notas
- ✅ Ubicación de transacciones
- ✅ Historial completo

### Gastos Recurrentes
- ✅ Configuración de gastos automáticos
- ✅ Diferentes frecuencias (diario, semanal, mensual, anual)
- ✅ Recordatorios automáticos
- ✅ Pausar/reanudar gastos

### Presupuestos y Objetivos
- ✅ Presupuestos por categoría y período
- ✅ Seguimiento de gastos vs presupuesto
- ✅ Objetivos financieros con fechas límite
- ✅ Progreso visual de objetivos

### Análisis y Reportes
- ✅ Análisis automático de patrones
- ✅ Tendencias de gastos
- ✅ Tasas de ahorro
- ✅ Reportes por período
- ✅ Exportación de datos

## 🔒 Seguridad
- ✅ Autenticación JWT
- ✅ Row Level Security (RLS)
- ✅ Encriptación de datos sensibles
- ✅ Validación de entrada
- ✅ Rate limiting
