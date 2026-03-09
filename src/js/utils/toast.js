/**
 * Muestra una notificación flotante con ícono, barra de progreso y apilamiento.
 *
 * @param {string} message  — texto a mostrar
 * @param {'success'|'danger'|'warning'|'info'} type — tipo de notificación
 * @param {number} duration — duración en ms (default 3500)
 */

const ICONS = {
    success: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" stroke-width="2.5"
        stroke-linecap="round" stroke-linejoin="round">
        <path d="M20 6 9 17l-5-5"/>
    </svg>`,
    danger: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" stroke-width="2.5"
        stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>`,
    warning: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" stroke-width="2.5"
        stroke-linecap="round" stroke-linejoin="round">
        <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
        <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>`,
    info: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" stroke-width="2.5"
        stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>`,
};

export function showToast(message, type = 'success', duration = 3500) {
    // Contenedor compartido para apilar toasts
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.style.cssText = `
            position:fixed;bottom:1.5rem;right:1.5rem;z-index:9999;
            display:flex;flex-direction:column;gap:0.5rem;
            align-items:flex-end;pointer-events:none;
        `;
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.style.cssText = `
        display:flex;align-items:center;gap:0.625rem;
        padding:0.75rem 1rem 0.75rem 0.875rem;
        border-radius:0.5rem;
        font-size:0.875rem;font-weight:500;
        color:#fff;box-shadow:0 4px 12px rgba(0,0,0,0.15);
        min-width:220px;max-width:360px;
        pointer-events:auto;cursor:pointer;
        position:relative;overflow:hidden;
        animation:toastSlideIn 0.3s cubic-bezier(0.34,1.56,0.64,1) forwards;
    `;

    const colors = {
        success: '#10b981',
        danger:  '#ef4444',
        warning: '#f59e0b',
        info:    '#3b82f6',
    };
    toast.style.backgroundColor = colors[type] || colors.success;
    if (type === 'warning') toast.style.color = '#1f2937';

    toast.innerHTML = `
        <span style="flex-shrink:0;opacity:0.9;">${ICONS[type] || ICONS.info}</span>
        <span style="flex:1;line-height:1.4;">${message}</span>
        <button style="background:none;border:none;cursor:pointer;
                       color:inherit;opacity:0.7;padding:0 0 0 0.25rem;
                       font-size:1.125rem;line-height:1;flex-shrink:0;"
                aria-label="Cerrar">×</button>
        <div style="position:absolute;bottom:0;left:0;height:3px;
                    background:rgba(255,255,255,0.4);
                    animation:toastProgress ${duration}ms linear forwards;"></div>
    `;

    // Estilos de animación (solo una vez)
    if (!document.getElementById('toast-styles')) {
        const style = document.createElement('style');
        style.id = 'toast-styles';
        style.textContent = `
            @keyframes toastSlideIn {
                from { transform:translateX(110%); opacity:0; }
                to   { transform:translateX(0);    opacity:1; }
            }
            @keyframes toastSlideOut {
                from { transform:translateX(0);    opacity:1; max-height:60px; margin-bottom:0; }
                to   { transform:translateX(110%); opacity:0; max-height:0;    margin-bottom:-0.5rem; }
            }
            @keyframes toastProgress {
                from { width:100%; }
                to   { width:0%; }
            }
        `;
        document.head.appendChild(style);
    }

    const dismiss = () => {
        toast.style.animation = 'toastSlideOut 0.3s ease forwards';
        toast.addEventListener('animationend', () => toast.remove(), { once: true });
    };

    // Cerrar al hacer click
    toast.addEventListener('click', dismiss);

    container.appendChild(toast);

    const timer = setTimeout(dismiss, duration);

    // Pausar progreso al hover
    toast.addEventListener('mouseenter', () => {
        clearTimeout(timer);
        const bar = toast.querySelector('div[style*="toastProgress"]');
        if (bar) bar.style.animationPlayState = 'paused';
    });
    toast.addEventListener('mouseleave', () => {
        dismiss();
    });
}