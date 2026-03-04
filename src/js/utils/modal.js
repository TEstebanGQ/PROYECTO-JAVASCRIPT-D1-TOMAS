// utils/modal.js
// Funciones reutilizables para abrir/cerrar modales

/**
 * Abre un modal por su ID
 * @param {string} modalId
 */
export function openModal(modalId) {
    document.getElementById(modalId)?.classList.add('active');
}

/**
 * Cierra un modal por su ID
 * @param {string} modalId
 */
export function closeModal(modalId) {
    document.getElementById(modalId)?.classList.remove('active');
}

/**
 * Configura los eventos de cierre de un modal:
 * - Botón × (.modal-close)
 * - Botón Cancelar (.modal-cancel)
 * - Click en el overlay
 * - Tecla Escape
 * @param {string} modalId
 */
export function setupModalClose(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    const close = () => closeModal(modalId);

    // × y Cancelar
    modal.querySelectorAll('.modal-close, .modal-cancel').forEach(el =>
        el.addEventListener('click', close)
    );

    // Click fuera del contenido
    modal.addEventListener('click', e => {
        if (e.target === modal) close();
    });

    // Escape
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && modal.classList.contains('active')) close();
    });
}