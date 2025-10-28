/* ========================================
   UTILIDADES DE INTERFAZ DE USUARIO
   ======================================== */

import { CONFIG } from '../core/config.js';

/**
 * Clase para manejar utilidades de UI
 */
export class UIManager {
    constructor() {
        this.loadingStates = new Map();
        this.toastContainer = null;
        this.init();
    }

    /**
     * Inicializar el gestor de UI
     */
    init() {
        this.createToastContainer();
        this.setupGlobalStyles();
    }

    /**
     * Crear contenedor de toasts
     */
    createToastContainer() {
        if (this.toastContainer) return;
        
        this.toastContainer = document.createElement('div');
        this.toastContainer.id = 'toast-container';
        this.toastContainer.className = 'toast-container';
        this.toastContainer.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            display: flex;
            flex-direction: column;
            gap: 10px;
            max-width: 400px;
        `;
        
        document.body.appendChild(this.toastContainer);
    }

    /**
     * Configurar estilos globales
     */
    setupGlobalStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .toast {
                background: var(--bg-card);
                border: 1px solid var(--border-color);
                border-radius: var(--radius-md);
                padding: var(--space-md);
                box-shadow: var(--shadow-lg);
                display: flex;
                align-items: center;
                gap: var(--space-sm);
                animation: slideInRight 0.3s ease-out;
                max-width: 400px;
            }
            
            .toast.success {
                border-left: 4px solid var(--success);
            }
            
            .toast.error {
                border-left: 4px solid var(--error);
            }
            
            .toast.warning {
                border-left: 4px solid var(--warning);
            }
            
            .toast.info {
                border-left: 4px solid var(--info);
            }
            
            .toast-icon {
                font-size: 1.2rem;
                flex-shrink: 0;
            }
            
            .toast-content {
                flex: 1;
            }
            
            .toast-title {
                font-weight: 600;
                margin-bottom: var(--space-xs);
                color: var(--text-primary);
            }
            
            .toast-message {
                color: var(--text-secondary);
                font-size: 0.9rem;
            }
            
            .toast-close {
                background: none;
                border: none;
                font-size: 1.2rem;
                cursor: pointer;
                color: var(--text-secondary);
                padding: 0;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: var(--radius-sm);
                transition: var(--transition-fast);
            }
            
            .toast-close:hover {
                background: var(--bg-secondary);
                color: var(--text-primary);
            }
            
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
            
            .loading-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
                backdrop-filter: blur(2px);
            }
            
            .loading-spinner {
                width: 40px;
                height: 40px;
                border: 4px solid var(--bg-secondary);
                border-top: 4px solid var(--accent);
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        
        document.head.appendChild(style);
    }

    /**
     * Mostrar toast
     */
    showToast(message, type = 'info', duration = CONFIG.NOTIFICATIONS.DEFAULT_DURATION) {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icon = this.getToastIcon(type);
        const title = this.getToastTitle(type);
        
        toast.innerHTML = `
            <div class="toast-icon">${icon}</div>
            <div class="toast-content">
                <div class="toast-title">${title}</div>
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close" onclick="this.parentElement.remove()">×</button>
        `;
        
        this.toastContainer.appendChild(toast);
        
        // Auto-remove
        if (duration > 0) {
            setTimeout(() => {
                if (toast.parentElement) {
                    toast.style.animation = 'slideOutRight 0.3s ease-in';
                    setTimeout(() => {
                        if (toast.parentElement) {
                            toast.remove();
                        }
                    }, 300);
                }
            }, duration);
        }
        
        return toast;
    }

    /**
     * Obtener icono del toast
     */
    getToastIcon(type) {
        const icons = {
            success: '✓',
            error: '✗',
            warning: '⚠',
            info: 'ℹ'
        };
        return icons[type] || icons.info;
    }

    /**
     * Obtener título del toast
     */
    getToastTitle(type) {
        const titles = {
            success: 'Éxito',
            error: 'Error',
            warning: 'Advertencia',
            info: 'Información'
        };
        return titles[type] || titles.info;
    }

    /**
     * Mostrar loading
     */
    showLoading(element, message = 'Cargando...') {
        const loadingId = Math.random().toString(36).substr(2, 9);
        
        const loadingOverlay = document.createElement('div');
        loadingOverlay.className = 'loading-overlay';
        loadingOverlay.id = `loading-${loadingId}`;
        loadingOverlay.innerHTML = `
            <div style="text-align: center; color: var(--text-white);">
                <div class="loading-spinner"></div>
                <div style="margin-top: var(--space-md);">${message}</div>
            </div>
        `;
        
        if (element) {
            element.style.position = 'relative';
            element.appendChild(loadingOverlay);
        } else {
            document.body.appendChild(loadingOverlay);
        }
        
        this.loadingStates.set(loadingId, loadingOverlay);
        return loadingId;
    }

    /**
     * Ocultar loading
     */
    hideLoading(loadingId) {
        const loadingOverlay = this.loadingStates.get(loadingId);
        if (loadingOverlay && loadingOverlay.parentElement) {
            loadingOverlay.remove();
            this.loadingStates.delete(loadingId);
        }
    }

    /**
     * Mostrar modal
     */
    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
            
            // Focus en el primer input
            const firstInput = modal.querySelector('input, textarea, select');
            if (firstInput) {
                setTimeout(() => firstInput.focus(), 100);
            }
        }
    }

    /**
     * Ocultar modal
     */
    hideModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('show');
            document.body.style.overflow = '';
        }
    }

    /**
     * Ocultar todos los modales
     */
    hideAllModals() {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.classList.remove('show');
        });
        document.body.style.overflow = '';
    }

    /**
     * Mostrar confirmación
     */
    showConfirm(message, title = 'Confirmar', confirmText = 'Sí', cancelText = 'No') {
        return new Promise((resolve) => {
            const modal = document.createElement('div');
            modal.className = 'modal show';
            modal.innerHTML = `
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>${title}</h2>
                        <button class="close-btn" onclick="this.closest('.modal').remove()">×</button>
                    </div>
                    <div class="modal-body">
                        <p>${message}</p>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" onclick="this.closest('.modal').remove(); resolve(false)">${cancelText}</button>
                        <button class="btn btn-primary" onclick="this.closest('.modal').remove(); resolve(true)">${confirmText}</button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            document.body.style.overflow = 'hidden';
        });
    }

    /**
     * Mostrar alerta
     */
    showAlert(message, title = 'Alerta', type = 'info') {
        const modal = document.createElement('div');
        modal.className = 'modal show';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>${title}</h2>
                    <button class="close-btn" onclick="this.closest('.modal').remove()">×</button>
                </div>
                <div class="modal-body">
                    <div style="display: flex; align-items: center; gap: var(--space-md);">
                        <div style="font-size: 2rem;">${this.getToastIcon(type)}</div>
                        <p style="margin: 0;">${message}</p>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-primary" onclick="this.closest('.modal').remove()">Aceptar</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';
    }

    /**
     * Animar elemento
     */
    animateElement(element, animation, duration = 300) {
        return new Promise((resolve) => {
            element.style.animation = `${animation} ${duration}ms ease-out`;
            setTimeout(() => {
                element.style.animation = '';
                resolve();
            }, duration);
        });
    }

    /**
     * Scroll suave a elemento
     */
    scrollToElement(element, offset = 0) {
        if (element) {
            const elementPosition = element.offsetTop - offset;
            window.scrollTo({
                top: elementPosition,
                behavior: 'smooth'
            });
        }
    }

    /**
     * Copiar texto al portapapeles
     */
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            this.showToast('Texto copiado al portapapeles', 'success');
            return true;
        } catch (error) {
            console.error('Error copiando al portapapeles:', error);
            this.showToast('Error copiando al portapapeles', 'error');
            return false;
        }
    }

    /**
     * Formatear número como moneda
     */
    formatCurrency(amount, currency = CONFIG.CURRENCY.DEFAULT) {
        if (isNaN(amount)) return '0,00 €';
        
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: CONFIG.CURRENCY.DECIMAL_PLACES,
            maximumFractionDigits: CONFIG.CURRENCY.DECIMAL_PLACES
        }).format(amount);
    }

    /**
     * Formatear fecha
     */
    formatDate(date, format = CONFIG.DATE_FORMAT) {
        if (!date) return '';
        
        const d = new Date(date);
        if (isNaN(d.getTime())) return '';
        
        const day = d.getDate().toString().padStart(2, '0');
        const month = (d.getMonth() + 1).toString().padStart(2, '0');
        const year = d.getFullYear();
        
        return format
            .replace('DD', day)
            .replace('MM', month)
            .replace('YYYY', year);
    }

    /**
     * Debounce function
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Throttle function
     */
    throttle(func, limit) {
        let inThrottle;
        return function executedFunction(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    /**
     * Verificar si un elemento está visible
     */
    isElementVisible(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    /**
     * Obtener elemento más cercano
     */
    closest(element, selector) {
        return element.closest(selector);
    }

    /**
     * Crear elemento con atributos
     */
    createElement(tag, attributes = {}, textContent = '') {
        const element = document.createElement(tag);
        
        Object.entries(attributes).forEach(([key, value]) => {
            if (key === 'className') {
                element.className = value;
            } else if (key === 'innerHTML') {
                element.innerHTML = value;
            } else {
                element.setAttribute(key, value);
            }
        });
        
        if (textContent) {
            element.textContent = textContent;
        }
        
        return element;
    }
}

// Instancia global del gestor de UI
export const ui = new UIManager();

// Funciones de conveniencia
export const showToast = (message, type, duration) => ui.showToast(message, type, duration);
export const showLoading = (element, message) => ui.showLoading(element, message);
export const hideLoading = (loadingId) => ui.hideLoading(loadingId);
export const showModal = (modalId) => ui.showModal(modalId);
export const hideModal = (modalId) => ui.hideModal(modalId);
export const showConfirm = (message, title, confirmText, cancelText) => ui.showConfirm(message, title, confirmText, cancelText);
export const showAlert = (message, title, type) => ui.showAlert(message, title, type);
export const formatCurrency = (amount, currency) => ui.formatCurrency(amount, currency);
export const formatDate = (date, format) => ui.formatDate(date, format);
export const copyToClipboard = (text) => ui.copyToClipboard(text);

export default ui;
