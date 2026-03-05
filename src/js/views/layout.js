import { logout, getCurrentUser } from '../store.js';
import { navigateTo } from '../router.js';

export function renderLayout(renderContent) {
    const app = document.getElementById('app');
    const user = getCurrentUser();

    if (!user || typeof user.nombres !== 'string' || user.nombres.trim() === '') {
        logout();
        navigateTo('/login');
        return;
    }

    const userName    = user.nombres.trim();
    const userCargo   = typeof user.cargo === 'string' && user.cargo.trim() !== '' ? user.cargo : 'Administrador';
    const userInitial = userName.charAt(0).toUpperCase();

    const currentHash = window.location.hash;
    const isActive = (route) => currentHash === `#${route}` ? 'active' : '';

    const layoutHTML = `
        <div class="sidebar-overlay" id="sidebar-overlay"></div>

        <div class="app-layout">
            <aside class="sidebar" id="sidebar">
                <div class="sidebar-header">
                    <img src="/img/icons/icon1.png" alt="Logo" style="width: 32px; height: 32px;">
                    <div class="sidebar-title">LMS Admin</div>
                </div>

                <nav class="sidebar-nav">
                    <a href="/dashboard" class="nav-item ${isActive('/dashboard')}" data-link>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
                        Dashboard
                    </a>
                    <a href="/courses" class="nav-item ${isActive('/courses')}" data-link>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
                        Cursos
                    </a>
                    <a href="/teachers" class="nav-item ${isActive('/teachers')}" data-link>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                        Docentes
                    </a>
                    <a href="/admins" class="nav-item ${isActive('/admins')}" data-link>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>
                        Administrativos
                    </a>
                </nav>

                <!-- Footer: avatar + nombre + logout -->
                <div class="sidebar-footer">
                    <div class="flex items-center gap-2" style="margin-bottom: 0.75rem;">
                        <div style="width:32px;height:32px;border-radius:50%;background:var(--primary);
                                    color:white;display:flex;align-items:center;justify-content:center;
                                    font-weight:bold;flex-shrink:0;">
                            ${userInitial}
                        </div>
                        <div style="min-width:0;">
                            <div style="font-size:0.875rem;font-weight:500;color:white;
                                        white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
                                ${userName}
                            </div>
                            <div style="font-size:0.75rem;color:var(--sidebar-text);">${userCargo}</div>
                        </div>
                    </div>

                    <button id="logout-btn" class="nav-item"
                        style="width:100%;border-radius:var(--radius-md);color:#f87171;padding:0.6rem 0.75rem;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                            fill="none" stroke="currentColor" stroke-width="2"
                            stroke-linecap="round" stroke-linejoin="round">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                            <polyline points="16 17 21 12 16 7"/>
                            <line x1="21" x2="9" y1="12" y2="12"/>
                        </svg>
                        Cerrar Sesión
                    </button>
                </div>
            </aside>

            <main class="main-content">
                <header class="topbar">
                    <div class="topbar-left">
                        <button class="btn-hamburger" id="btn-hamburger" aria-label="Abrir menú">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2"
                                stroke-linecap="round" stroke-linejoin="round">
                                <line x1="4" x2="20" y1="6"  y2="6"/>
                                <line x1="4" x2="20" y1="12" y2="12"/>
                                <line x1="4" x2="20" y1="18" y2="18"/>
                            </svg>
                        </button>
                        <div class="topbar-title">Panel de Administración</div>
                    </div>
                    <div class="flex items-center gap-2">
                        <a href="/" class="btn btn-outline" data-link>
                            <span>Ver Sitio Público</span>
                        </a>
                    </div>
                </header>

                <div class="page-content" id="page-content"></div>
            </main>
        </div>
    `;

    app.innerHTML = layoutHTML;

    document.getElementById('logout-btn').addEventListener('click', () => {
        logout();
        navigateTo('/login');
    });

    const sidebar        = document.getElementById('sidebar');
    const btnHamburger   = document.getElementById('btn-hamburger');
    const sidebarOverlay = document.getElementById('sidebar-overlay');

    const openSidebar  = () => { sidebar.classList.add('open'); sidebarOverlay.classList.add('active'); document.body.style.overflow = 'hidden'; };
    const closeSidebar = () => { sidebar.classList.remove('open'); sidebarOverlay.classList.remove('active'); document.body.style.overflow = ''; };

    btnHamburger.addEventListener('click', () => sidebar.classList.contains('open') ? closeSidebar() : openSidebar());
    sidebarOverlay.addEventListener('click', closeSidebar);

    sidebar.querySelectorAll('.nav-item').forEach(item =>
        item.addEventListener('click', () => { if (sidebarOverlay.classList.contains('active')) closeSidebar(); })
    );

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && sidebar.classList.contains('open')) closeSidebar();
    });

    renderContent(document.getElementById('page-content'));
}