// ========================================
// VALIDACIONES DE FORMULARIOS
// ========================================

class ValidationManager {
    constructor() {
        this.errors = {};
    }

    // Validar descripción
    validateDescripcion(descripcion) {
        if (!descripcion || descripcion.trim() === '') {
            return 'La descripción es requerida';
        }
        if (descripcion.length > CONFIG.VALIDATION.MAX_DESCRIPCION) {
            return `La descripción no puede exceder ${CONFIG.VALIDATION.MAX_DESCRIPCION} caracteres`;
        }
        return null;
    }

    // Validar monto
    validateMonto(monto) {
        const numMonto = parseFloat(monto);
        
        if (!monto || isNaN(numMonto)) {
            return 'El monto es requerido y debe ser un número válido';
        }
        
        if (numMonto < CONFIG.VALIDATION.MIN_MONTO) {
            return `El monto debe ser mayor a $${CONFIG.VALIDATION.MIN_MONTO}`;
        }
        
        if (numMonto > CONFIG.VALIDATION.MAX_MONTO) {
            return `El monto no puede exceder $${CONFIG.VALIDATION.MAX_MONTO}`;
        }
        
        return null;
    }

    // Validar categoría
    validateCategoria(categoria) {
        if (!categoria) {
            return 'La categoría es requerida';
        }
        
        const categoriasValidas = Object.values(CONFIG.CATEGORIAS);
        if (!categoriasValidas.includes(categoria)) {
            return 'Categoría no válida';
        }
        
        return null;
    }

    // Validar formulario completo
    validateForm(descripcion, monto, categoria) {
        this.errors = {};
        
        const descripcionError = this.validateDescripcion(descripcion);
        const montoError = this.validateMonto(monto);
        const categoriaError = this.validateCategoria(categoria);
        
        if (descripcionError) this.errors.descripcion = descripcionError;
        if (montoError) this.errors.monto = montoError;
        if (categoriaError) this.errors.categoria = categoriaError;
        
        return Object.keys(this.errors).length === 0;
    }

    // Obtener primer error
    getFirstError() {
        const errors = Object.values(this.errors);
        return errors.length > 0 ? errors[0] : null;
    }

    // Obtener todos los errores
    getAllErrors() {
        return this.errors;
    }
}

// Crear instancia global
window.validationManager = new ValidationManager();
