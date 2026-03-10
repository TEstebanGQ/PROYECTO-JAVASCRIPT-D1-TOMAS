import { isAuthenticated } from './store.js';
import { renderPublicView } from './views/public.js';
import { renderLoginView } from './views/login.js';
import { renderLayout } from './views/layout.js';
import { renderDashboard } from './views/dashboard.js';
import { renderCourses } from './views/courses/index.js';
import { renderTeachers } from './views/teachers.js';
import { renderAdmins } from './views/admins.js';
import { renderStudents } from './views/student.js';


const routes = {
    '/': renderPublicView,
    '/login': renderLoginView,
    '/dashboard': () => renderLayout(renderDashboard),
    '/courses': () => renderLayout(renderCourses),
    '/teachers': () => renderLayout(renderTeachers),
    '/admins': () => renderLayout(renderAdmins),
    '/students': () => renderLayout(renderStudents),
};

export function initRouter() {
    document.body.addEventListener('click', e => {
        const link = e.target.matches('[data-link]')
            ? e.target
            : e.target.closest('[data-link]');
        if (link) {
            e.preventDefault();
            navigateTo(link.getAttribute('href'));
        }
    });

    window.addEventListener('hashchange', router);
    router();
}

export function navigateTo(path) {
    if (path && !path.startsWith('#')) {
        path = '#' + path;
    }
    window.location.hash = path;
}

function getPath() {
    const hash = window.location.hash;
    if (!hash || hash === '#' || hash === '#/') return '/';
    return hash.replace('#', '') || '/';
}

function router() {
    const path = getPath();
    const protectedRoutes = ['/dashboard', '/courses', '/teachers', '/admins', '/students'];

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
    appElement.innerHTML = '';
    view(appElement);
}