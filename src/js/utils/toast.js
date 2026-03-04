/**
 * @param {string} message  — texto a mostrar
 * @param {'success'|'danger'|'warning'} type — tipo de notificación
 * @param {number} duration — duración en ms (default 3000)
 */
export function showToast(message, type = 'success', duration = 3000) {
    // Eliminar toast anterior si existe
    document.querySelector('.toast')?.remove();

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;

    document.body.appendChild(toast);

    // Auto eliminar
    setTimeout(() => {
        toast.style.animation = 'toastOut 0.3s ease forwards';
        toast.addEventListener('animationend', () => toast.remove());
    }, duration);
}