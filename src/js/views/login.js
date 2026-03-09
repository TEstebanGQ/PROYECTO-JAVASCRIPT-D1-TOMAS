import { login } from '../store.js';
import { navigateTo } from '../router.js';

export function renderLoginView(container) {
    const html = `
        <div class="login-page">
            <div class="login-card">
                <div class="login-header">
                    <div style="display:flex;justify-content:center;margin-bottom:1rem;">
                        <div style="width:56px;height:56px;border-radius:50%;
                                    background:linear-gradient(135deg,var(--primary),#0ea5e9);
                                    display:flex;align-items:center;justify-content:center;
                                    box-shadow:0 4px 14px rgba(16,185,129,0.35);">
                            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24"
                                fill="none" stroke="white" stroke-width="2"
                                stroke-linecap="round" stroke-linejoin="round">
                                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
                            </svg>
                        </div>
                    </div>
                    <h1 class="login-title">Bienvenido de nuevo</h1>
                    <p class="login-subtitle">Ingresá tus credenciales para acceder al panel administrativo</p>
                </div>

                <form id="login-form" novalidate>
                    <div id="login-error" class="hidden login-error" role="alert" aria-live="assertive">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                            fill="none" stroke="currentColor" stroke-width="2"
                            stroke-linecap="round" stroke-linejoin="round"
                            style="flex-shrink:0;">
                            <circle cx="12" cy="12" r="10"/>
                            <line x1="12" x2="12" y1="8" y2="12"/>
                            <line x1="12" x2="12.01" y1="16" y2="16"/>
                        </svg>
                        <span>Credenciales incorrectas. Verificá tu correo y contraseña.</span>
                    </div>

                    <div class="form-group">
                        <label class="form-label" for="email">Correo Electrónico</label>
                        <div style="position:relative;">
                            <span style="position:absolute;left:0.75rem;top:50%;transform:translateY(-50%);
                                         color:var(--text-muted);pointer-events:none;">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" stroke-width="2"
                                    stroke-linecap="round" stroke-linejoin="round">
                                    <rect width="20" height="16" x="2" y="4" rx="2"/>
                                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                                </svg>
                            </span>
                            <input type="email" id="email" class="form-control"
                                style="padding-left:2.25rem;"
                                placeholder="admin@abc.edu" required autocomplete="email"
                                autofocus>
                        </div>
                        <span class="form-error hidden" id="err-email"></span>
                    </div>

                    <div class="form-group" style="position:relative;">
                        <label class="form-label" for="password">Contraseña</label>
                        <div style="position:relative;">
                            <span style="position:absolute;left:0.75rem;top:50%;transform:translateY(-50%);
                                         color:var(--text-muted);pointer-events:none;">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" stroke-width="2"
                                    stroke-linecap="round" stroke-linejoin="round">
                                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                                </svg>
                            </span>
                            <input type="password" id="password" class="form-control"
                                style="padding-left:2.25rem;padding-right:2.75rem;"
                                placeholder="••••••••" required autocomplete="current-password">
                            <button type="button" id="toggle-password"
                                style="position:absolute;right:0.75rem;top:50%;transform:translateY(-50%);
                                       background:none;border:none;cursor:pointer;
                                       color:var(--text-muted);padding:0.25rem;
                                       transition:color 0.15s;"
                                aria-label="Mostrar contraseña">
                                <svg id="eye-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18"
                                    viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                    stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                                    <circle cx="12" cy="12" r="3"/>
                                </svg>
                            </button>
                        </div>
                        <span class="form-error hidden" id="err-password"></span>
                    </div>

                    <!-- Recordarme -->
                    <div style="display:flex;align-items:center;justify-content:space-between;
                                margin-bottom:1.25rem;margin-top:-0.25rem;">
                        <label style="display:flex;align-items:center;gap:0.5rem;cursor:pointer;
                                      font-size:0.875rem;color:var(--text-muted);user-select:none;">
                            <input type="checkbox" id="remember-me"
                                style="width:16px;height:16px;accent-color:var(--primary);cursor:pointer;">
                            Recordarme en este dispositivo
                        </label>
                    </div>

                    <button type="submit" id="btn-login" class="btn btn-primary"
                        style="width:100%;padding:0.75rem;font-size:0.9375rem;
                               position:relative;overflow:hidden;">
                        <span id="btn-login-text">Iniciar Sesión</span>
                        <span id="btn-login-spinner" class="hidden"
                            style="display:inline-flex;align-items:center;gap:0.5rem;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2"
                                stroke-linecap="round" stroke-linejoin="round"
                                style="animation:spin 0.8s linear infinite;">
                                <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                            </svg>
                            Verificando...
                        </span>
                    </button>

                    <div class="text-center mt-4">
                        <a href="/" class="btn btn-outline" style="width:100%;" data-link>
                            ← Volver al inicio
                        </a>
                    </div>
                </form>
            </div>
        </div>

        <style>
            @keyframes spin { to { transform: rotate(360deg); } }
            .login-error {
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            #toggle-password:hover { color: var(--text-main); }
            #remember-me:focus-visible { outline: 2px solid var(--primary); outline-offset: 2px; }
        </style>
    `;

    if (!container) return;
    container.innerHTML = html;

    const emailInput    = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const rememberCheck = document.getElementById('remember-me');
    const btnLogin      = document.getElementById('btn-login');
    const btnText       = document.getElementById('btn-login-text');
    const btnSpinner    = document.getElementById('btn-login-spinner');
    const errorEl       = document.getElementById('login-error');

    // Restaurar "recordarme" del localStorage
    const savedRemember = localStorage.getItem('lmsRememberMe') === 'true';
    if (savedRemember) {
        rememberCheck.checked = true;
        const savedEmail = localStorage.getItem('lmsLastEmail');
        if (savedEmail) emailInput.value = savedEmail;
    }

    // Toggle contraseña
    document.getElementById('toggle-password').addEventListener('click', () => {
        const isText = passwordInput.type === 'text';
        passwordInput.type = isText ? 'password' : 'text';
        document.getElementById('eye-icon').innerHTML = isText
            ? '<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>'
            : '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>'
            + '<path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>'
            + '<line x1="1" y1="1" x2="23" y2="23"/>';
    });

    // Limpiar error al escribir
    [emailInput, passwordInput].forEach(el => {
        el.addEventListener('input', () => {
            errorEl.classList.add('hidden');
            el.classList.remove('is-invalid');
        });
    });

    function setLoading(loading) {
        btnLogin.disabled = loading;
        btnText.classList.toggle('hidden', loading);
        btnSpinner.classList.toggle('hidden', !loading);
    }

    function handleSubmit(e) {
        e?.preventDefault();
        errorEl.classList.add('hidden');

        const email    = emailInput.value.trim();
        const password = passwordInput.value;
        const remember = rememberCheck.checked;

        // Validación básica visual
        let hasError = false;
        if (!email) {
            emailInput.classList.add('is-invalid');
            hasError = true;
        }
        if (!password) {
            passwordInput.classList.add('is-invalid');
            hasError = true;
        }
        if (hasError) return;

        setLoading(true);

        // Pequeño delay para dar sensación de verificación
        setTimeout(() => {
            const ok = login(email, password, remember);
            setLoading(false);

            if (ok) {
                // Persistir preferencia de recordarme
                if (remember) {
                    localStorage.setItem('lmsRememberMe', 'true');
                    localStorage.setItem('lmsLastEmail', email);
                } else {
                    localStorage.removeItem('lmsRememberMe');
                    localStorage.removeItem('lmsLastEmail');
                }
                navigateTo('/dashboard');
            } else {
                errorEl.classList.remove('hidden');
                emailInput.classList.add('is-invalid');
                passwordInput.classList.add('is-invalid');
                passwordInput.value = '';
                passwordInput.focus();

                // Agitar la tarjeta para feedback visual
                const card = document.querySelector('.login-card');
                card.style.animation = 'shake 0.4s ease';
                card.addEventListener('animationend', () => card.style.animation = '', { once: true });
            }
        }, 400);
    }

    document.getElementById('login-form').addEventListener('submit', handleSubmit);
}