import { logout, getCurrentUser } from '../src/js/store.js';
import { navigateTo } from '../src/js/router.js';

export function renderLayout(renderContent) {
    const app = document.getElementById('app');
    const user = getCurrentUser();
    
    const layoutHTML = `
        <div class="app-layout">
            <aside class="sidebar">
                <div class="sidebar-header">
                    <div class="sidebar-logo">ABC</div>
                    <div class="sidebar-title">LMS Admin</div>
                </div>
                <nav class="sidebar-nav">
                    <a href="/dashboard" class="nav-item ${window.location.pathname === '/dashboard' ? 'active' : ''}" data-link>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
                        Dashboard
                    </a>
                    <a href="/courses" class="nav-item ${window.location.pathname === '/courses' ? 'active' : ''}" data-link>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
                        Cursos
                    </a>
                    <a href="/teachers" class="nav-item ${window.location.pathname === '/teachers' ? 'active' : ''}" data-link>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                        Docentes
                    </a>
                    <a href="/admins" class="nav-item ${window.location.pathname === '/admins' ? 'active' : ''}" data-link>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>
                        Administrativos
                    </a>
                </nav>
                <div class="sidebar-footer">
                    <div class="flex items-center gap-2 mb-4">
                        <div style="width: 32px; height: 32px; border-radius: 50%; background: var(--primary); color: white; display: flex; align-items: center; justify-content: center; font-weight: bold;">
                            ${user.nombres.charAt(0)}
                        </div>
                        <div>
                            <div style="font-size: 0.875rem; font-weight: 500; color: white;">${user.nombres}</div>
                            <div style="font-size: 0.75rem;">${user.cargo}</div>
                        </div>
                    </div>
                    <button id="logout-btn" class="btn btn-outline" style="width: 100%; color: white; border-color: rgba(255,255,255,0.2);">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 8px;"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
                        Cerrar Sesión
                    </button>
                </div>
            </aside>
            <main class="main-content">
                <header class="topbar">
                    <div style="font-weight: 500; color: var(--text-muted);">
                        Panel de Administración
                    </div>
                    <div class="flex items-center gap-4">
                        <a href="/" class="btn btn-outline" data-link>Ver Sitio Público</a>
                    </div>
                </header>
                <div class="page-content" id="page-content">
                    <!-- Content will be injected here -->
                </div>
            </main>
        </div>
    `;
    
    app.innerHTML = layoutHTML;
    
    // Configurar eventos
    document.getElementById('logout-btn').addEventListener('click', () => {
        logout();
        navigateTo('/login');
    });
    
    // Renderizar el contenido específico de la vista
    renderContent(document.getElementById('page-content'));
}
