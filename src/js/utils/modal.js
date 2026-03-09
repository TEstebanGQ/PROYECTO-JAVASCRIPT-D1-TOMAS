/**
 * Abre un modal por su ID y hace foco en el primer campo interactivo.
 * @param {string} modalId
 */
export function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.add('active');

    // Foco automático en el primer input/select/textarea visible
    requestAnimationFrame(() => {
        const first = modal.querySelector(
            'input:not([type="hidden"]):not([disabled]), select:not([disabled]), textarea:not([disabled])'
        );
        first?.focus();
    });
}

/**
 * Cierra un modal por su ID.
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
 * - Enter en inputs dispara el botón de guardado (si no es textarea)
 * @param {string} modalId
 * @param {string} [saveButtonId] — ID del botón de guardado (para Enter)
 */
export function setupModalClose(modalId, saveButtonId) {
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
    const escHandler = (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) close();
    };
    document.addEventListener('keydown', escHandler);

    // Enter en inputs dispara guardado (excepto en textarea)
    if (saveButtonId) {
        modal.addEventListener('keydown', e => {
            if (
                e.key === 'Enter'
                && !e.shiftKey
                && e.target.tagName !== 'TEXTAREA'
                && e.target.tagName !== 'BUTTON'
                && modal.classList.contains('active')
            ) {
                e.preventDefault();
                document.getElementById(saveButtonId)?.click();
            }
        });
    }
}