import { getData } from '../store.js';

export function renderDashboard(container) {
    const courses = getData('lms_courses');
    const teachers = getData('lms_teachers');
    const admins = getData('lms_admins');
    
    const activeCourses = courses.filter(c => c.estado === 'Activo').length;
    
    const html = `
        <div class="page-header">
            <h1 class="page-title">Dashboard Principal</h1>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div class="card flex items-center gap-4">
                <div style="width: 48px; height: 48px; border-radius: 50%; background-color: var(--primary-light); color: var(--primary); display: flex; align-items: center; justify-content: center;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
                </div>
                <div>
                    <div style="color: var(--text-muted); font-size: 0.875rem; font-weight: 500;">Cursos Activos</div>
                    <div style="font-size: 1.5rem; font-weight: 700; color: var(--text-main);">${activeCourses}</div>
                </div>
            </div>
            
            <div class="card flex items-center gap-4">
                <div style="width: 48px; height: 48px; border-radius: 50%; background-color: #dbeafe; color: #3b82f6; display: flex; align-items: center; justify-content: center;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                </div>
                <div>
                    <div style="color: var(--text-muted); font-size: 0.875rem; font-weight: 500;">Docentes Registrados</div>
                    <div style="font-size: 1.5rem; font-weight: 700; color: var(--text-main);">${teachers.length}</div>
                </div>
            </div>
            
            <div class="card flex items-center gap-4">
                <div style="width: 48px; height: 48px; border-radius: 50%; background-color: #f3e8ff; color: #9333ea; display: flex; align-items: center; justify-content: center;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>
                </div>
                <div>
                    <div style="color: var(--text-muted); font-size: 0.875rem; font-weight: 500;">Administrativos</div>
                    <div style="font-size: 1.5rem; font-weight: 700; color: var(--text-main);">${admins.length}</div>
                </div>
            </div>
        </div>
        
        <h2 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 1rem;">Accesos Rápidos</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <a href="/courses" class="card" style="display: flex; flex-direction: column; align-items: center; text-align: center; gap: 1rem; cursor: pointer;" data-link>
                <div style="width: 48px; height: 48px; border-radius: 50%; background-color: var(--bg-body); display: flex; align-items: center; justify-content: center;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                </div>
                <div style="font-weight: 500;">Crear / Gestionar Cursos</div>
            </a>
            
            <a href="/teachers" class="card" style="display: flex; flex-direction: column; align-items: center; text-align: center; gap: 1rem; cursor: pointer;" data-link>
                <div style="width: 48px; height: 48px; border-radius: 50%; background-color: var(--bg-body); display: flex; align-items: center; justify-content: center;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                </div>
                <div style="font-weight: 500;">Gestionar Docentes</div>
            </a>
            
            <a href="/admins" class="card" style="display: flex; flex-direction: column; align-items: center; text-align: center; gap: 1rem; cursor: pointer;" data-link>
                <div style="width: 48px; height: 48px; border-radius: 50%; background-color: var(--bg-body); display: flex; align-items: center; justify-content: center;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>
                </div>
                <div style="font-weight: 500;">Gestionar Administrativos</div>
            </a>
        </div>
    `;
    
    if(container) container.innerHTML = html;
}
