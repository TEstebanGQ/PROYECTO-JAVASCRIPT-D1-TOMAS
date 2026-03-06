import { initStore } from './store.js';
import { initRouter } from './router.js';

document.addEventListener('DOMContentLoaded', () => {
    initStore();
    
    // Inicializar el enrutador
    initRouter();
});
