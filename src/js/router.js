import { isAuthenticated } from './store.js';
import { renderPublicView } from './views/public.js';
import { renderLoginView } from './views/login.js';
import { renderLayout } from './views/layout.js';
import { renderDashboard } from './views/dashboard.js';
import { renderCourses } from '../../courses.js';
import { renderTeachers } from './views/teachers.js';
import { renderAdmins } from './views/admins.js';

const routes = {
    '/': renderPublicView,
    '/login': renderLoginView,
    '/dashboard': () => renderLayout(renderDashboard),
    '/courses': () => renderLayout(renderCourses),
    '/teachers': () => renderLayout(renderTeachers),
    '/admins': () => renderLayout(renderAdmins),
};

export function initRouter() {
    // Interceptar clicks en enlaces
    document.body.addEventListener('click', e => {
        if (e.target.matches('[data-link]')) {
            e.preventDefault();
            navigateTo(e.target.getAttribute('href'));
        } else if (e.target.closest('[data-link]')) {
            e.preventDefault();
            navigateTo(e.target.closest('[data-link]').getAttribute('href'));
        }
    });

    // Manejar botones de navegación del navegador
    window.addEventListener('popstate', router);

    // Carga inicial
    router();
}

export function navigateTo(url) {
    history.pushState(null, null, url);
    router();
}

function router() {
    let path = window.location.pathname;
    
    // Rutas protegidas
    const protectedRoutes = ['/dashboard', '/courses', '/teachers', '/admins'];
    
    if (protectedRoutes.includes(path) && !isAuthenticated()) {
        navigateTo('/login');
        return;
    }

    if (path === '/login' && isAuthenticated()) {
        navigateTo('/dashboard');
        return;
    }

    const view = routes[path] || routes['/'];
    
    const appElement = document.getElementById('app');
    appElement.innerHTML = ''; // Limpiar
    
    view(appElement);
}
