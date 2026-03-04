import { getData } from '../src/js/store.js';

export function renderPublicView(container) {
    const courses = getData('lms_courses').filter(c => c.visibilidad === 'Publico');
    const teachers = getData('lms_teachers');
    
    const html = `
        <header class="public-header">
            <div class="container public-nav">
                <div class="flex items-center gap-2">
                    <div style="width: 32px; height: 32px; background-color: var(--primary); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">ABC</div>
                    <span style="font-size: 1.25rem; font-weight: 600;">LMS Institución ABC</span>
                </div>
                <nav>
                    <a href="/login" class="btn btn-primary" data-link>Acceso Administrativo</a>
                </nav>
            </div>
        </header>
        
        <section class="public-hero">
            <div class="container">
                <h1>Potencia tu aprendizaje</h1>
                <p>Descubre nuestros cursos diseñados para llevar tus habilidades al siguiente nivel. Aprende a tu propio ritmo.</p>
                <a href="#cursos" class="btn btn-primary" style="padding: 0.75rem 1.5rem; font-size: 1rem;">Explorar Cursos</a>
            </div>
        </section>
        
        <section id="cursos" class="container" style="padding: 4rem 1.5rem;">
            <div class="text-center mb-6">
                <h2 style="font-size: 2rem; font-weight: 600; margin-bottom: 1rem;">Cursos Disponibles</h2>
                <p style="color: var(--text-muted); max-width: 600px; margin: 0 auto;">Explora nuestra oferta académica y comienza a aprender hoy mismo.</p>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 md:grid-cols-3 gap-6">
                ${courses.length === 0 ? '<p class="text-center" style="grid-column: 1 / -1; color: var(--text-muted);">No hay cursos públicos disponibles en este momento.</p>' : ''}
                ${courses.map(course => {
                    const teacher = teachers.find(t => t.id === course.docenteId);
                    return `
                        <div class="card" style="display: flex; flex-direction: column;">
                            <div style="margin-bottom: 1rem;">
                                <span class="badge badge-info mb-2">${course.categorias}</span>
                                <h3 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 0.5rem;">${course.nombre}</h3>
                                <p style="color: var(--text-muted); font-size: 0.875rem; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">${course.descripcion}</p>
                            </div>
                            <div style="margin-top: auto; padding-top: 1rem; border-top: 1px solid var(--border-color);">
                                <div class="flex items-center justify-between">
                                    <div class="flex items-center gap-2">
                                        <img src="${teacher ? teacher.foto : 'https://picsum.photos/seed/default/200'}" alt="Docente" style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover;">
                                        <span style="font-size: 0.875rem; font-weight: 500;">${teacher ? teacher.nombres + ' ' + teacher.apellidos : 'Sin asignar'}</span>
                                    </div>
                                    <span style="font-size: 0.875rem; color: var(--text-muted);">${course.duracion}</span>
                                </div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        </section>
        
        <footer style="background-color: var(--sidebar-bg); color: var(--sidebar-text); padding: 2rem 0; text-align: center;">
            <div class="container">
                <p>&copy; ${new Date().getFullYear()} Institución Educativa ABC. Todos los derechos reservados.</p>
            </div>
        </footer>
    `;
    
    if(container) container.innerHTML = html;
}
