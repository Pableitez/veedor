/* ========================================
   SISTEMA DE ALMACENAMIENTO
   ======================================== */

import { CONFIG, getStorageKey } from './config.js';

/**
 * Clase para manejar el almacenamiento de datos
 */
export class StorageManager {
    constructor() {
        this.isAvailable = this.checkAvailability();
    }

    /**
     * Verificar disponibilidad del localStorage
     */
    checkAvailability() {
        try {
            const test = '__veedor_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            console.warn('localStorage no disponible:', e);
            return false;
        }
    }

    /**
     * Guardar datos
     */
    set(key, data) {
        if (!this.isAvailable) {
            console.warn('localStorage no disponible');
            return false;
        }

        try {
            const storageKey = getStorageKey(key);
            const serializedData = JSON.stringify(data);
            localStorage.setItem(storageKey, serializedData);
            return true;
        } catch (error) {
            console.error('Error guardando datos:', error);
            return false;
        }
    }

    /**
     * Obtener datos
     */
    get(key, defaultValue = null) {
        if (!this.isAvailable) {
            return defaultValue;
        }

        try {
            const storageKey = getStorageKey(key);
            const item = localStorage.getItem(storageKey);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error('Error obteniendo datos:', error);
            return defaultValue;
        }
    }

    /**
     * Eliminar datos
     */
    remove(key) {
        if (!this.isAvailable) {
            return false;
        }

        try {
            const storageKey = getStorageKey(key);
            localStorage.removeItem(storageKey);
            return true;
        } catch (error) {
            console.error('Error eliminando datos:', error);
            return false;
        }
    }

    /**
     * Limpiar todos los datos
     */
    clear() {
        if (!this.isAvailable) {
            return false;
        }

        try {
            // Solo eliminar las claves de Veedor
            Object.values(CONFIG.STORAGE_KEYS).forEach(key => {
                localStorage.removeItem(key);
            });
            return true;
        } catch (error) {
            console.error('Error limpiando datos:', error);
            return false;
        }
    }

    /**
     * Obtener todas las claves
     */
    keys() {
        if (!this.isAvailable) {
            return [];
        }

        try {
            return Object.keys(localStorage).filter(key => 
                Object.values(CONFIG.STORAGE_KEYS).includes(key)
            );
        } catch (error) {
            console.error('Error obteniendo claves:', error);
            return [];
        }
    }

    /**
     * Obtener tamaño de almacenamiento usado
     */
    getSize() {
        if (!this.isAvailable) {
            return 0;
        }

        try {
            let totalSize = 0;
            Object.values(CONFIG.STORAGE_KEYS).forEach(key => {
                const item = localStorage.getItem(key);
                if (item) {
                    totalSize += item.length;
                }
            });
            return totalSize;
        } catch (error) {
            console.error('Error calculando tamaño:', error);
            return 0;
        }
    }

    /**
     * Verificar si existe una clave
     */
    has(key) {
        if (!this.isAvailable) {
            return false;
        }

        const storageKey = getStorageKey(key);
        return localStorage.getItem(storageKey) !== null;
    }

    /**
     * Obtener datos con validación
     */
    getValidated(key, validator, defaultValue = null) {
        const data = this.get(key, defaultValue);
        
        if (validator && typeof validator === 'function') {
            return validator(data) ? data : defaultValue;
        }
        
        return data;
    }

    /**
     * Guardar datos con timestamp
     */
    setWithTimestamp(key, data) {
        const dataWithTimestamp = {
            ...data,
            _timestamp: Date.now(),
            _version: CONFIG.APP_VERSION
        };
        return this.set(key, dataWithTimestamp);
    }

    /**
     * Obtener datos verificando timestamp
     */
    getWithTimestamp(key, maxAge = null, defaultValue = null) {
        const data = this.get(key, defaultValue);
        
        if (data && data._timestamp) {
            if (maxAge && (Date.now() - data._timestamp) > maxAge) {
                this.remove(key);
                return defaultValue;
            }
            return data;
        }
        
        return data;
    }

    /**
     * Migrar datos de versión anterior
     */
    migrateData() {
        try {
            const currentVersion = CONFIG.APP_VERSION;
            const storedVersion = this.get('_version', '1.0.0');
            
            if (storedVersion !== currentVersion) {
                console.log(`Migrando datos de ${storedVersion} a ${currentVersion}`);
                this.performMigration(storedVersion, currentVersion);
                this.set('_version', currentVersion);
            }
        } catch (error) {
            console.error('Error en migración de datos:', error);
        }
    }

    /**
     * Realizar migración de datos
     */
    performMigration(fromVersion, toVersion) {
        // Implementar migraciones específicas según las versiones
        console.log(`Migración de ${fromVersion} a ${toVersion} completada`);
    }

    /**
     * Hacer backup de datos
     */
    backup() {
        try {
            const backupData = {};
            Object.entries(CONFIG.STORAGE_KEYS).forEach(([key, storageKey]) => {
                const data = localStorage.getItem(storageKey);
                if (data) {
                    backupData[key] = JSON.parse(data);
                }
            });
            
            const backup = {
                data: backupData,
                timestamp: Date.now(),
                version: CONFIG.APP_VERSION
            };
            
            return JSON.stringify(backup, null, 2);
        } catch (error) {
            console.error('Error creando backup:', error);
            return null;
        }
    }

    /**
     * Restaurar desde backup
     */
    restore(backupData) {
        try {
            const backup = JSON.parse(backupData);
            
            if (!backup.data || !backup.timestamp) {
                throw new Error('Formato de backup inválido');
            }
            
            Object.entries(backup.data).forEach(([key, data]) => {
                this.set(key, data);
            });
            
            return true;
        } catch (error) {
            console.error('Error restaurando backup:', error);
            return false;
        }
    }
}

// Instancia global del gestor de almacenamiento
export const storage = new StorageManager();

// Funciones de conveniencia
export const setStorage = (key, data) => storage.set(key, data);
export const getStorage = (key, defaultValue) => storage.get(key, defaultValue);
export const removeStorage = (key) => storage.remove(key);
export const clearStorage = () => storage.clear();
export const hasStorage = (key) => storage.has(key);

// Funciones específicas para tipos de datos
export const setUser = (user) => storage.set('USER', user);
export const getUser = () => storage.get('USER');
export const removeUser = () => storage.remove('USER');

export const setTheme = (theme) => storage.set('THEME', theme);
export const getTheme = () => storage.get('THEME', 'dark');

export const setTransactions = (transactions) => storage.set('TRANSACTIONS', transactions);
export const getTransactions = () => storage.get('TRANSACTIONS', []);

export const setBudgets = (budgets) => storage.set('BUDGETS', budgets);
export const getBudgets = () => storage.get('BUDGETS', []);

export const setGoals = (goals) => storage.set('GOALS', goals);
export const getGoals = () => storage.get('GOALS', []);

export const setAssets = (assets) => storage.set('ASSETS', assets);
export const getAssets = () => storage.get('ASSETS', []);

export const setLiabilities = (liabilities) => storage.set('LIABILITIES', liabilities);
export const getLiabilities = () => storage.get('LIABILITIES', []);

export const setEnvelopes = (envelopes) => storage.set('ENVELOPES', envelopes);
export const getEnvelopes = () => storage.get('ENVELOPES', []);

export const setSettings = (settings) => storage.set('SETTINGS', settings);
export const getSettings = () => storage.get('SETTINGS', {});

export default storage;
