// ========================================
// GESTIÓN DE INTERFAZ DE USUARIO
// ========================================

class UIManager {
    constructor() {
        this.notifications = [];
    }

    // Mostrar notificación
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Auto-remover después del tiempo configurado
        setTimeout(() => {
            this.removeNotification(notification);
        }, CONFIG.NOTIFICATION.DURATION);
        
        this.notifications.push(notification);
    }

    // Remover notificación
    removeNotification(notification) {
        if (notification && notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }
    }

    // Actualizar lista de gastos
    updateGastosList(gastos) {
        const listaGastos = document.getElementById('lista-gastos');
        const totalElement = document.getElementById('total-gastos');
        
        // Calcular total
        const total = gastos.reduce((sum, gasto) => sum + gasto.monto, 0);
        totalElement.textContent = total.toFixed(2);
        
        // Limpiar lista
        listaGastos.innerHTML = '';
        
        if (gastos.length === 0) {
            listaGastos.innerHTML = '<p style="text-align: center; opacity: 0.7;">No hay transacciones registradas</p>';
            return;
        }
        
        // Mostrar gastos (más recientes primero)
        const gastosOrdenados = [...gastos].reverse();
        
        gastosOrdenados.forEach(gasto => {
            const gastoElement = this.createGastoElement(gasto);
            listaGastos.appendChild(gastoElement);
        });
    }

    // Crear elemento de gasto
    createGastoElement(gasto) {
        const div = document.createElement('div');
        div.className = 'gasto-item';
        div.innerHTML = `
            <div class="gasto-info">
                <div style="font-weight: bold;">${gasto.descripcion}</div>
                <div class="gasto-categoria">
                    ${gasto.categoria} • ${gasto.fecha} ${gasto.hora}
                </div>
            </div>
            <div class="gasto-monto">$${gasto.monto.toFixed(2)}</div>
            <button onclick="gastosManager.eliminarGasto(${gasto.id})" 
                    style="background: var(--error); color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; margin-left: 10px; font-size: 0.8rem;">
                ×
            </button>
        `;
        
        return div;
    }

    // Limpiar formulario
    clearForm() {
        document.getElementById('gasto').value = '';
        document.getElementById('monto').value = '';
        document.getElementById('categoria').value = '';
    }

    // Mostrar error en campo
    showFieldError(fieldId, message) {
        const field = document.getElementById(fieldId);
        field.classList.add('input-error');
        
        // Remover error después de 3 segundos
        setTimeout(() => {
            field.classList.remove('input-error');
        }, 3000);
    }

    // Limpiar errores de campos
    clearFieldErrors() {
        const inputs = document.querySelectorAll('.input');
        inputs.forEach(input => {
            input.classList.remove('input-error');
        });
    }

    // Configurar navegación suave
    setupSmoothNavigation() {
        const navLinks = document.querySelectorAll('.nav-menu a');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // Configurar validaciones en tiempo real
    setupRealTimeValidation() {
        const montoInput = document.getElementById('monto');
        
        // Solo permitir números en el campo de monto
        montoInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/[^0-9.]/g, '');
        });
        
        // Validar monto al perder el foco
        montoInput.addEventListener('blur', (e) => {
            const error = validationManager.validateMonto(e.target.value);
            if (error) {
                this.showFieldError('monto', error);
            }
        });
    }
}

// Crear instancia global
window.uiManager = new UIManager();
