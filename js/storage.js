// ========================================
// GESTIÓN DE ALMACENAMIENTO LOCAL
// ========================================

class StorageManager {
    constructor() {
        this.storageKey = CONFIG.STORAGE_KEYS.GASTOS;
    }

    // Guardar gastos en localStorage
    saveGastos(gastos) {
        try {
            const data = JSON.stringify(gastos);
            localStorage.setItem(this.storageKey, data);
            return true;
        } catch (error) {
            console.error('Error al guardar gastos:', error);
            return false;
        }
    }

    // Cargar gastos desde localStorage
    loadGastos() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error al cargar gastos:', error);
            return [];
        }
    }

    // Limpiar todos los gastos
    clearGastos() {
        try {
            localStorage.removeItem(this.storageKey);
            return true;
        } catch (error) {
            console.error('Error al limpiar gastos:', error);
            return false;
        }
    }

    // Exportar gastos como CSV
    exportGastos(gastos) {
        if (!gastos || gastos.length === 0) {
            return false;
        }

        const csvContent = "data:text/csv;charset=utf-8," 
            + "Descripción,Categoría,Monto,Fecha,Hora\n"
            + gastos.map(gasto => 
                `"${gasto.descripcion}","${gasto.categoria}","${gasto.monto}","${gasto.fecha}","${gasto.hora}"`
            ).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `gastos_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        return true;
    }
}

// Crear instancia global
window.storageManager = new StorageManager();
