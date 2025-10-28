/* ========================================
   CORE DE LA APLICACIÓN
   ======================================== */

/**
 * Inicialización principal de la aplicación
 */
class VeedorApp {
    constructor() {
        this.isInitialized = false;
        this.currentTheme = localStorage.getItem('theme') || 'dark';
        this.currentUser = null;
        this.init();
    }

    /**
     * Inicializar la aplicación
     */
    init() {
        if (this.isInitialized) return;
        
        this.setupTheme();
        this.setupEventListeners();
        this.setupNavigation();
        this.setupAccessibility();
        this.setupKeyboardShortcuts();
        this.loadUserData();
        
        this.isInitialized = true;
        console.log('Veedor App initialized successfully');
    }

    /**
     * Configurar tema
     */
    setupTheme() {
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        this.updateThemeIcon();
    }

    /**
     * Configurar event listeners globales
     */
    setupEventListeners() {
        // Cerrar menú móvil al hacer clic fuera
        document.addEventListener('click', (event) => {
            const navMenu = document.getElementById('nav-menu');
            const hamburger = document.querySelector('.hamburger');
            const navbar = document.querySelector('.navbar');
            
            if (navMenu?.classList.contains('active') && 
                !navbar?.contains(event.target)) {
                this.closeMobileMenu();
            }
        });

        // Cerrar menú al cambiar tamaño de ventana
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                this.closeMobileMenu();
            }
        });

        // Cerrar modales con Escape
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                this.closeAllModals();
            }
        });
    }

    /**
     * Configurar navegación
     */
    setupNavigation() {
        // Toggle del menú móvil hamburguesa
        window.toggleMobileMenu = () => this.toggleMobileMenu();
        window.closeMobileMenu = () => this.closeMobileMenu();
        
        // Toggle del menú de usuario
        window.toggleUserMenu = () => this.toggleUserMenu();
        
        // Toggle del tema
        window.toggleTheme = () => this.toggleTheme();
        
        // Navegación a dashboard
        window.showDashboard = () => this.showDashboard();
        
        // Navegación a autenticación
        window.showAuth = () => this.showAuth();
        
        // Cerrar sesión
        window.logout = () => this.logout();
    }

    /**
     * Configurar accesibilidad
     */
    setupAccessibility() {
        // ARIA labels para elementos interactivos
        const hamburger = document.querySelector('.hamburger');
        if (hamburger) {
            hamburger.setAttribute('aria-label', 'Abrir menú de navegación');
            hamburger.setAttribute('aria-expanded', 'false');
        }

        // Anuncios para lectores de pantalla
        this.announceToScreenReader = (message) => {
            const announcement = document.createElement('div');
            announcement.setAttribute('aria-live', 'polite');
            announcement.setAttribute('aria-atomic', 'true');
            announcement.className = 'sr-only';
            announcement.textContent = message;
            document.body.appendChild(announcement);
            
            setTimeout(() => {
                document.body.removeChild(announcement);
            }, 1000);
        };
    }

    /**
     * Configurar atajos de teclado
     */
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (event) => {
            // Alt + 1-6 para navegación
            if (event.altKey && event.key >= '1' && event.key <= '6') {
                event.preventDefault();
                const tabIndex = parseInt(event.key) - 1;
                this.switchToTab(tabIndex);
            }
            
            // Alt + T para cambiar tema
            if (event.altKey && event.key.toLowerCase() === 't') {
                event.preventDefault();
                this.toggleTheme();
            }
        });
    }

    /**
     * Cargar datos del usuario
     */
    loadUserData() {
        const userData = localStorage.getItem('user');
        if (userData) {
            try {
                this.currentUser = JSON.parse(userData);
                this.updateUserInterface();
            } catch (error) {
                console.error('Error loading user data:', error);
                localStorage.removeItem('user');
            }
        }
    }

    /**
     * Actualizar interfaz de usuario
     */
    updateUserInterface() {
        const authButton = document.getElementById('auth-button');
        const logoutButton = document.getElementById('logout-button');
        const dashboardLink = document.getElementById('dashboard-link');
        const userMenuText = document.getElementById('user-menu-text');

        if (this.currentUser) {
            if (authButton) authButton.style.display = 'none';
            if (logoutButton) logoutButton.style.display = 'block';
            if (dashboardLink) dashboardLink.style.display = 'block';
            if (userMenuText) userMenuText.textContent = this.currentUser.name || 'Mi Cuenta';
        } else {
            if (authButton) authButton.style.display = 'block';
            if (logoutButton) logoutButton.style.display = 'none';
            if (dashboardLink) dashboardLink.style.display = 'none';
            if (userMenuText) userMenuText.textContent = 'Mi Cuenta';
        }
    }

    /**
     * Toggle del menú móvil
     */
    toggleMobileMenu() {
        const navMenu = document.getElementById('nav-menu');
        const hamburger = document.querySelector('.hamburger');
        
        if (navMenu && hamburger) {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
            
            const isOpen = navMenu.classList.contains('active');
            hamburger.setAttribute('aria-expanded', isOpen.toString());
            
            this.announceToScreenReader(
                isOpen ? 'Menú de navegación abierto' : 'Menú de navegación cerrado'
            );
        }
    }

    /**
     * Cerrar menú móvil
     */
    closeMobileMenu() {
        const navMenu = document.getElementById('nav-menu');
        const hamburger = document.querySelector('.hamburger');
        
        if (navMenu && hamburger) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
        }
    }

    /**
     * Toggle del menú de usuario
     */
    toggleUserMenu() {
        const dropdown = document.getElementById('nav-dropdown-content');
        if (dropdown) {
            dropdown.classList.toggle('show');
        }
    }

    /**
     * Toggle del tema
     */
    toggleTheme() {
        this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        localStorage.setItem('theme', this.currentTheme);
        this.updateThemeIcon();
        
        this.announceToScreenReader(
            `Tema cambiado a ${this.currentTheme === 'dark' ? 'oscuro' : 'claro'}`
        );
    }

    /**
     * Actualizar icono del tema
     */
    updateThemeIcon() {
        const themeIcon = document.querySelector('.theme-icon');
        if (themeIcon) {
            themeIcon.textContent = this.currentTheme === 'dark' ? '☀' : '☾';
        }
    }

    /**
     * Mostrar dashboard
     */
    showDashboard() {
        if (this.currentUser) {
            window.location.href = 'demo.html';
        } else {
            this.showAuth();
        }
    }

    /**
     * Mostrar autenticación
     */
    showAuth() {
        window.location.href = 'auth.html';
    }

    /**
     * Cerrar sesión
     */
    logout() {
        this.currentUser = null;
        localStorage.removeItem('user');
        this.updateUserInterface();
        this.announceToScreenReader('Sesión cerrada');
        
        // Redirigir a la página principal
        window.location.href = 'index.html';
    }

    /**
     * Cambiar a pestaña específica
     */
    switchToTab(tabIndex) {
        const tabs = document.querySelectorAll('.nav-tab');
        if (tabs[tabIndex]) {
            tabs[tabIndex].click();
        }
    }

    /**
     * Cerrar todos los modales
     */
    closeAllModals() {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.classList.remove('show');
        });
    }

    /**
     * Mostrar mensaje
     */
    showMessage(message, type = 'info', duration = 5000) {
        const messageContainer = document.getElementById('notifications-container') || 
                                this.createMessageContainer();
        
        const messageElement = document.createElement('div');
        messageElement.className = `notification-item ${type}`;
        messageElement.innerHTML = `
            <div class="notification-icon">${this.getMessageIcon(type)}</div>
            <div class="notification-content">
                <div class="notification-title">${this.getMessageTitle(type)}</div>
                <div class="notification-message">${message}</div>
            </div>
            <button class="notification-close" onclick="this.parentElement.remove()">×</button>
        `;
        
        messageContainer.appendChild(messageElement);
        
        // Auto-remove después del tiempo especificado
        if (duration > 0) {
            setTimeout(() => {
                if (messageElement.parentElement) {
                    messageElement.remove();
                }
            }, duration);
        }
    }

    /**
     * Crear contenedor de mensajes
     */
    createMessageContainer() {
        const container = document.createElement('div');
        container.id = 'notifications-container';
        container.className = 'notifications-container';
        document.body.appendChild(container);
        return container;
    }

    /**
     * Obtener icono del mensaje
     */
    getMessageIcon(type) {
        const icons = {
            success: '✓',
            error: '✗',
            warning: '⚠',
            info: 'ℹ'
        };
        return icons[type] || icons.info;
    }

    /**
     * Obtener título del mensaje
     */
    getMessageTitle(type) {
        const titles = {
            success: 'Éxito',
            error: 'Error',
            warning: 'Advertencia',
            info: 'Información'
        };
        return titles[type] || titles.info;
    }
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.veedorApp = new VeedorApp();
});

// Exportar para uso en otros módulos
export default VeedorApp;
