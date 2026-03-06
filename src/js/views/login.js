import { login } from '../store.js';
import { navigateTo } from '../router.js';

export function renderLoginView(container) {
    const html = `
        <div class="login-page">
            <div class="login-card">
                <div class="login-header">
                    <h1 class="login-title">Bienvenido de nuevo</h1>
                    <p class="login-subtitle">Ingresá tus credenciales para acceder al panel administrativo</p>
                </div>

                <form id="login-form" novalidate>
                    <div id="login-error" class="hidden login-error">
                        Credenciales incorrectas. Verificá tu correo y contraseña.
                    </div>

                    <div class="form-group">
                        <label class="form-label" for="email">Correo Electrónico</label>
                        <input type="email" id="email" class="form-control"
                            placeholder="admin@abc.edu" required autocomplete="email">
                    </div>

                    <div class="form-group" style="position: relative;">
                        <label class="form-label" for="password">Contraseña</label>
                        <input type="password" id="password" class="form-control"
                            placeholder="••••••••" required autocomplete="current-password">
                        <button type="button" id="toggle-password"
                            style="position:absolute;right:0.75rem;top:2rem;background:none;border:none;
                                   cursor:pointer;color:var(--text-muted);padding:0.25rem;"
                            aria-label="Mostrar contraseña">
                            <svg id="eye-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18"
                                viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                stroke-linecap="round" stroke-linejoin="round">
                                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                                <circle cx="12" cy="12" r="3"/>
                            </svg>
                        </button>
                    </div>

                    <button type="submit" class="btn btn-primary"
                        style="width: 100%; margin-top: 1rem; padding: 0.75rem;">
                        Iniciar Sesión
                    </button>

                    <div class="text-center mt-4">
                        <a href="/" class="btn btn-outline" style="width: 100%;" data-link>
                            Volver al inicio
                        </a>
                    </div>
                </form>
            </div>
        </div>
    `;

    if (!container) return;
    container.innerHTML = html;

    document.getElementById('toggle-password').addEventListener('click', () => {
        const input   = document.getElementById('password');
        const eyeIcon = document.getElementById('eye-icon');
        const isText  = input.type === 'text';
        input.type = isText ? 'password' : 'text';
        eyeIcon.innerHTML = isText
            ? '<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>'
            : '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>'
            + '<path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>'
            + '<line x1="1" y1="1" x2="23" y2="23"/>';
    });

    document.getElementById('login-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const email    = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const errorEl  = document.getElementById('login-error');

        errorEl.classList.add('hidden');

        if (login(email, password)) {
            navigateTo('/dashboard');
        } else {
            errorEl.classList.remove('hidden');
        }
    });
}