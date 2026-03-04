import { initStore } from './store.js';
import { initRouter, navigateTo } from './router.js';

document.addEventListener('DOMContentLoaded', () => {
    // Inicializar el almacenamiento local con datos por defecto si está vacío
    initStore();
    
    // Inicializar el enrutador
    initRouter();
});
