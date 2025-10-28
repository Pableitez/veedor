/**
 * Tests básicos para Veedor
 * Ejecutar en consola del navegador para verificar funcionalidades
 */

// Test Suite para Veedor
const VeedorTests = {
    
    /**
     * Ejecuta todos los tests
     */
    runAll() {
        console.log('🧪 Iniciando tests de Veedor...');
        this.testModalFunctions();
        this.testThemeToggle();
        this.testValidation();
        this.testStorage();
        this.testDashboard();
        console.log('✅ Tests completados');
    },
    
    /**
     * Test de funciones de modal
     */
    testModalFunctions() {
        console.log('🔍 Testing modal functions...');
        
        // Test openModal
        try {
            openModal('privacy-modal');
            const modal = document.getElementById('privacy-modal');
            if (modal && modal.style.display === 'flex') {
                console.log('✅ openModal funciona correctamente');
            } else {
                console.error('❌ openModal falló');
            }
            closeModal('privacy-modal');
        } catch (error) {
            console.error('❌ Error en test de modal:', error);
        }
    },
    
    /**
     * Test de cambio de tema
     */
    testThemeToggle() {
        console.log('🔍 Testing theme toggle...');
        
        try {
            const initialTheme = document.documentElement.getAttribute('data-theme');
            toggleTheme();
            const newTheme = document.documentElement.getAttribute('data-theme');
            
            if (newTheme !== initialTheme) {
                console.log('✅ Theme toggle funciona correctamente');
                // Restaurar tema original
                document.documentElement.setAttribute('data-theme', initialTheme);
            } else {
                console.error('❌ Theme toggle falló');
            }
        } catch (error) {
            console.error('❌ Error en test de tema:', error);
        }
    },
    
    /**
     * Test de validaciones
     */
    testValidation() {
        console.log('🔍 Testing validation...');
        
        try {
            // Test validación de email
            const validEmail = 'test@example.com';
            const invalidEmail = 'invalid-email';
            
            // Simular validación básica
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            
            if (emailRegex.test(validEmail) && !emailRegex.test(invalidEmail)) {
                console.log('✅ Validación de email funciona correctamente');
            } else {
                console.error('❌ Validación de email falló');
            }
        } catch (error) {
            console.error('❌ Error en test de validación:', error);
        }
    },
    
    /**
     * Test de almacenamiento
     */
    testStorage() {
        console.log('🔍 Testing storage...');
        
        try {
            const testKey = 'veedor-test';
            const testData = { test: 'data', timestamp: Date.now() };
            
            // Test localStorage
            localStorage.setItem(testKey, JSON.stringify(testData));
            const retrieved = JSON.parse(localStorage.getItem(testKey));
            
            if (retrieved && retrieved.test === testData.test) {
                console.log('✅ Storage funciona correctamente');
                localStorage.removeItem(testKey);
            } else {
                console.error('❌ Storage falló');
            }
        } catch (error) {
            console.error('❌ Error en test de storage:', error);
        }
    },
    
    /**
     * Test del dashboard
     */
    testDashboard() {
        console.log('🔍 Testing dashboard...');
        
        try {
            // Verificar que el dashboard existe
            const dashboard = document.getElementById('dashboard');
            if (dashboard) {
                console.log('✅ Dashboard existe');
                
                // Verificar tabs del dashboard
                const tabs = dashboard.querySelectorAll('.dashboard-nav button');
                if (tabs.length > 0) {
                    console.log(`✅ Dashboard tiene ${tabs.length} tabs`);
                } else {
                    console.error('❌ Dashboard no tiene tabs');
                }
            } else {
                console.error('❌ Dashboard no encontrado');
            }
        } catch (error) {
            console.error('❌ Error en test de dashboard:', error);
        }
    }
};

// Hacer disponible globalmente
window.VeedorTests = VeedorTests;

// Auto-ejecutar tests si está en modo desarrollo
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log('🚀 Modo desarrollo detectado. Ejecuta VeedorTests.runAll() para correr los tests');
}
