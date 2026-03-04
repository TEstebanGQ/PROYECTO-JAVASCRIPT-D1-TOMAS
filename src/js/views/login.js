import { login } from '../store.js';
import { navigateTo } from '../router.js';

export function renderLoginView(container) {
    const html = `
        <div class="login-page">
            <div class="login-card">
                <div class="login-header">
                    <h1 class="login-title">Bienvenido de nuevo</h1>
                    <p class="login-subtitle">Ingresa tus credenciales para acceder al panel administrativo</p>
                </div>
                
                <form id="login-form">
                    <div id="login-error" class="hidden" style="background-color: #fee2e2; color: #b91c1c; padding: 0.75rem; border-radius: var(--radius-md); margin-bottom: 1rem; font-size: 0.875rem; text-align: center;">
                        Credenciales incorrectas. Intenta de nuevo.
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label" for="email">Correo Electrónico</label>
                        <input type="email" id="email" class="form-control" placeholder="admin@abc.edu" required value="admin@abc.edu">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label" for="password">Contraseña</label>
                        <input type="password" id="password" class="form-control" placeholder="••••••••" required value="admin">
                    </div>
                    
                    <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 1rem; padding: 0.75rem;">
                        Iniciar Sesión
                    </button>
                    
                    <div class="text-center mt-4">
                        <a href="/" class="btn btn-outline" style="width: 100%;" data-link>Volver al inicio</a>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    if(container) {
        container.innerHTML = html;
        
        document.getElementById('login-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            if (login(email, password)) {
                navigateTo('/dashboard');
            } else {
                document.getElementById('login-error').classList.remove('hidden');
            }
        });
    }
}
