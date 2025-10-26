// ========================================
// GESTIÓN DE GASTOS
// ========================================

class GastosManager {
    constructor() {
        this.gastos = [];
        this.loadGastos();
    }

    // Cargar gastos desde el almacenamiento
    loadGastos() {
        this.gastos = storageManager.loadGastos();
        uiManager.updateGastosList(this.gastos);
    }

    // Agregar nuevo gasto
    agregarGasto(descripcion, monto, categoria) {
        // Validar formulario
        if (!validationManager.validateForm(descripcion, monto, categoria)) {
            const error = validationManager.getFirstError();
            uiManager.showNotification(error, 'error');
            return false;
        }

        // Crear objeto gasto
        const nuevoGasto = {
            id: Date.now(),
            descripcion: descripcion.trim(),
            monto: parseFloat(monto),
            categoria: categoria,
            fecha: new Date().toLocaleDateString('es-ES'),
            hora: new Date().toLocaleTimeString('es-ES', {hour: '2-digit', minute: '2-digit'})
        };

        // Agregar a la lista
        this.gastos.push(nuevoGasto);

        // Actualizar interfaz
        uiManager.updateGastosList(this.gastos);
        uiManager.clearForm();
        uiManager.clearFieldErrors();

        // Guardar en almacenamiento
        storageManager.saveGastos(this.gastos);

        // Mostrar notificación de éxito
        uiManager.showNotification('Transacción registrada correctamente', 'success');

        return true;
    }

    // Eliminar gasto
    eliminarGasto(id) {
        if (confirm('¿Estás seguro de que quieres eliminar esta transacción?')) {
            this.gastos = this.gastos.filter(gasto => gasto.id !== id);
            uiManager.updateGastosList(this.gastos);
            storageManager.saveGastos(this.gastos);
            uiManager.showNotification('Transacción eliminada', 'info');
        }
    }

    // Limpiar todos los gastos
    limpiarTodosLosGastos() {
        if (this.gastos.length === 0) {
            uiManager.showNotification('No hay transacciones para limpiar', 'warning');
            return;
        }

        if (confirm('¿Estás seguro de que quieres eliminar TODAS las transacciones? Esta acción no se puede deshacer.')) {
            this.gastos = [];
            uiManager.updateGastosList(this.gastos);
            storageManager.clearGastos();
            uiManager.showNotification('Todas las transacciones han sido eliminadas', 'info');
        }
    }

    // Exportar gastos
    exportarGastos() {
        if (this.gastos.length === 0) {
            uiManager.showNotification('No hay transacciones para exportar', 'warning');
            return;
        }

        if (storageManager.exportGastos(this.gastos)) {
            uiManager.showNotification('Datos financieros exportados correctamente', 'success');
        } else {
            uiManager.showNotification('Error al exportar datos', 'error');
        }
    }

    // Obtener estadísticas
    getEstadisticas() {
        if (this.gastos.length === 0) {
            return null;
        }

        const categorias = {};
        this.gastos.forEach(gasto => {
            categorias[gasto.categoria] = (categorias[gasto.categoria] || 0) + gasto.monto;
        });

        const total = this.gastos.reduce((sum, gasto) => sum + gasto.monto, 0);

        return {
            totalGastos: this.gastos.length,
            montoTotal: total,
            porCategoria: categorias
        };
    }

    // Mostrar estadísticas
    mostrarEstadisticas() {
        const stats = this.getEstadisticas();
        
        if (!stats) {
            uiManager.showNotification('No hay datos para mostrar análisis', 'warning');
            return;
        }

        let mensaje = 'ANÁLISIS FINANCIERO\n\n';
        mensaje += `Total de transacciones: ${stats.totalGastos}\n`;
        mensaje += `Monto total: $${stats.montoTotal.toFixed(2)}\n\n`;
        mensaje += 'Distribución por categoría:\n';

        Object.entries(stats.porCategoria)
            .sort(([,a], [,b]) => b - a)
            .forEach(([categoria, monto]) => {
                const porcentaje = ((monto / stats.montoTotal) * 100).toFixed(1);
                mensaje += `• ${categoria}: $${monto.toFixed(2)} (${porcentaje}%)\n`;
            });

        alert(mensaje);
    }
}

// Crear instancia global
window.gastosManager = new GastosManager();
