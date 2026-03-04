import { getData } from '../store.js';

export function renderPublicView(container) {
    const courses = getData('lmsCourses').filter(c => c.visibilidad === 'Publico');
    const teachers = getData('lmsTeachers');

    const html = `
        <header class="public-header">
            <div class="container public-nav">
                <div class="flex items-center gap-2">
                    <img src="/img/icons/icon1.png" alt="Logo" style="width: 32px; height: 32px;">
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
                        <div class="card public-course-card" style="display: flex; flex-direction: column;" role="button" tabindex="0" data-course-id="${course.id}">
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
                                <p style="margin-top: 0.75rem; color: var(--primary); font-size: 0.875rem; font-weight: 600;">Ver información completa</p>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        </section>

        <div id="public-course-modal" class="modal-overlay" tabindex="-1">
            <div class="modal-content public-course-modal-content">
                <div class="modal-header">
                    <h2 id="public-course-modal-title" class="modal-title">Detalle del curso</h2>
                    <span id="public-course-modal-close" class="modal-close">&times;</span>
                </div>
                <div id="public-course-modal-body" class="modal-body"></div>
            </div>
        </div>
        
        <footer style="background-color: var(--sidebar-bg); color: var(--sidebar-text); padding: 2rem 0; text-align: center;">
            <div class="container">
                <p>&copy; ${new Date().getFullYear()} Institución Educativa ABC. Todos los derechos reservados.</p>
            </div>
        </footer>
    `;

    if (!container) return;

    container.innerHTML = html;

    const modal = document.getElementById('public-course-modal');
    const modalTitle = document.getElementById('public-course-modal-title');
    const modalBody = document.getElementById('public-course-modal-body');
    const closeModalButton = document.getElementById('public-course-modal-close');

    const closeModal = () => {
        modal.classList.remove('active');
        modalBody.innerHTML = '';
    };

    const renderModules = (modules) => {
        if (!modules || modules.length === 0) {
            return '<p style="color: var(--text-muted);">Este curso no tiene módulos publicados aún.</p>';
        }

        return modules.map((module, moduleIndex) => `
            <div class="public-module-card">
                <h4>${moduleIndex + 1}. ${module.nombre}</h4>
                <p><strong>Código:</strong> ${module.codigo || 'No definido'}</p>
                <p>${module.descripcion || 'Sin descripción del módulo.'}</p>
                <div style="margin-top: 0.75rem;">
                    <strong>Lecciones:</strong>
                    ${(module.lecciones && module.lecciones.length > 0) ? `
                        <ul class="public-lessons-list">
                            ${module.lecciones.map((lesson, lessonIndex) => `
                                <li>
                                    <strong>${lessonIndex + 1}. ${lesson.titulo}</strong>
                                    <p><strong>Intensidad:</strong> ${lesson.intensidad || 'No definida'}</p>
                                    <p>${lesson.contenido || 'Sin contenido disponible.'}</p>
                                    ${lesson.multimedia ? `<p><a href="${lesson.multimedia}" target="_blank" rel="noopener noreferrer">Recurso multimedia</a></p>` : ''}
                                </li>
                            `).join('')}
                        </ul>
                    ` : '<p style="margin-top: 0.5rem;">Sin lecciones registradas.</p>'}
                </div>
            </div>
        `).join('');
    };

    const openCourseDetails = (courseId) => {
        const course = courses.find(c => c.id === courseId);
        if (!course) return;

        const teacher = teachers.find(t => t.id === course.docenteId);
        modalTitle.textContent = course.nombre;
        modalBody.innerHTML = `
            <div class="public-course-detail-grid">
                <div>
                    <p><strong>Código:</strong> ${course.codigo || 'No definido'}</p>
                    <p><strong>Categoría:</strong> ${course.categorias || 'No definida'}</p>
                    <p><strong>Duración:</strong> ${course.duracion || 'No definida'}</p>
                    <p><strong>Estado:</strong> ${course.estado || 'No definido'}</p>
                    <p><strong>Visibilidad:</strong> ${course.visibilidad || 'No definida'}</p>
                    <p><strong>Fecha:</strong> ${course.fecha || 'No definida'}</p>
                    <p><strong>Etiquetas:</strong> ${course.etiquetas || 'Sin etiquetas'}</p>
                </div>
                <div>
                    <p><strong>Docente:</strong> ${teacher ? `${teacher.nombres} ${teacher.apellidos}` : 'Sin asignar'}</p>
                    <p><strong>Correo:</strong> ${teacher ? teacher.email : 'No disponible'}</p>
                    <p><strong>Área:</strong> ${teacher ? teacher.area : 'No disponible'}</p>
                </div>
            </div>

            <div style="margin-top: 1rem;">
                <h3 style="font-size: 1.1rem; margin-bottom: 0.5rem;">Descripción</h3>
                <p>${course.descripcion || 'Sin descripción disponible.'}</p>
            </div>

            <div style="margin-top: 1.25rem;">
                <h3 style="font-size: 1.1rem; margin-bottom: 0.75rem;">Módulos y Lecciones</h3>
                ${renderModules(course.modulos)}
            </div>
        `;
        modal.classList.add('active');
        modal.focus();
    };

    document.querySelectorAll('.public-course-card').forEach(card => {
        card.addEventListener('click', () => openCourseDetails(card.dataset.courseId));
        card.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openCourseDetails(card.dataset.courseId);
            }
        });
    });

    closeModalButton.addEventListener('click', closeModal);
    modal.addEventListener('click', (event) => {
        if (event.target === modal) closeModal();
    });
    modal.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}
