import { getData } from '../store.js';

function formatFecha(fechaStr) {
    if (!fechaStr) return 'Por definir';
    return new Date(fechaStr + 'T00:00:00').toLocaleDateString('es-CO', {
        day:   '2-digit',
        month: 'long',
        year:  'numeric',
    });
}
function formatFechaCorta(fechaStr) {
    if (!fechaStr) return null;
    return new Date(fechaStr + 'T00:00:00').toLocaleDateString('es-CO', {
        day:   '2-digit',
        month: 'short',
        year:  'numeric',
    });
}

export function renderPublicView(container) {
    const courses  = getData('lmsCourses').filter(c => c.visibilidad === 'Publico');
    const teachers = getData('lmsTeachers');

    const html = `
        <header class="public-header">
            <div class="container public-nav">
                <div class="flex items-center gap-2">
                    <img src="/img/icons/icon1.png" alt="Logo"
                        style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;">
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
                <p>Descubrí nuestros cursos diseñados para llevar tus habilidades al siguiente nivel. Aprendé a tu propio ritmo.</p>
                <a href="#cursos" class="btn btn-primary" style="padding: 0.75rem 1.5rem; font-size: 1rem;">
                    Explorar Cursos
                </a>
            </div>
        </section>

        <section id="cursos" class="container" style="padding: 4rem 1.5rem;">
            <div class="text-center mb-6">
                <h2 style="font-size: 2rem; font-weight: 600; margin-bottom: 1rem;">Cursos Disponibles</h2>
                <p style="color: var(--text-muted); max-width: 600px; margin: 0 auto;">
                    Explorá nuestra oferta académica y comenzá a aprender hoy mismo.
                </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                ${courses.length === 0
                    ? '<p class="text-center" style="grid-column: 1 / -1; color: var(--text-muted);">No hay cursos públicos disponibles en este momento.</p>'
                    : courses.map(course => {
                        const teacher      = teachers.find(t => t.id === course.docenteId);
                        const teacherFoto  = teacher?.foto || `https://picsum.photos/seed/${teacher?.id || 'def'}/200`;
                        const fechaCorta   = formatFechaCorta(course.fecha);

                        return `
                            <div class="card public-course-card" role="button" tabindex="0"
                                data-course-id="${course.id}">
                                <div style="margin-bottom: 1rem;">
                                    <span class="badge badge-info mb-2">${course.categorias || 'General'}</span>
                                    ${course.tipo ? `<span class="badge badge-warning" style="margin-left:0.25rem;">${course.tipo}</span>` : ''}
                                    <h3 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 0.5rem; margin-top: 0.5rem;">
                                        ${course.nombre}
                                    </h3>
                                    <p style="color: var(--text-muted); font-size: 0.875rem;
                                              display: -webkit-box; -webkit-line-clamp: 3;
                                              -webkit-box-orient: vertical; overflow: hidden;">
                                        ${course.descripcion}
                                    </p>
                                </div>
                                <div style="margin-top: auto; padding-top: 1rem; border-top: 1px solid var(--border-color);">
                                    <div class="flex items-center justify-between">
                                        <div class="flex items-center gap-2">
                                            <img
                                                src="${teacherFoto}"
                                                alt="Docente"
                                                style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover;"
                                                onerror="this.src='https://picsum.photos/seed/default/200'"
                                            >
                                            <span style="font-size: 0.875rem; font-weight: 500;">
                                                ${teacher ? teacher.nombres + ' ' + teacher.apellidos : 'Sin asignar'}
                                            </span>
                                        </div>
                                        <span style="font-size: 0.875rem; color: var(--text-muted);">
                                            ${course.duracion || ''}
                                        </span>
                                    </div>
                                    ${fechaCorta ? `
                                    <div style="margin-top:0.6rem;display:flex;align-items:center;gap:0.4rem;">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13"
                                            viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                            stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                            style="color:var(--primary);flex-shrink:0;">
                                            <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
                                            <line x1="16" x2="16" y1="2" y2="6"/>
                                            <line x1="8"  x2="8"  y1="2" y2="6"/>
                                            <line x1="3"  x2="21" y1="10" y2="10"/>
                                        </svg>
                                        <span style="font-size:0.8rem;color:var(--text-muted);">
                                            Inicia: <strong style="color:var(--text-main);">${fechaCorta}</strong>
                                        </span>
                                    </div>` : ''}

                                    <p style="margin-top: 0.75rem; color: var(--primary); font-size: 0.875rem; font-weight: 600;">
                                        Ver información completa →
                                    </p>
                                </div>
                            </div>
                        `;
                    }).join('')
                }
            </div>
        </section>

        <!-- Modal detalle curso -->
        <div id="public-course-modal" class="modal-overlay" tabindex="-1">
            <div class="modal-content public-course-modal-content">
                <div class="modal-header">
                    <h2 id="public-course-modal-title" class="modal-title">Detalle del curso</h2>
                    <span id="public-course-modal-close" class="modal-close">&times;</span>
                </div>
                <div id="public-course-modal-body" class="modal-body"></div>
            </div>
        </div>

        <footer style="background-color: var(--sidebar-bg); color: var(--sidebar-text);
                       padding: 2rem 0; text-align: center; margin-top: 2rem;">
            <div class="container">
                <p>&copy; ${new Date().getFullYear()} Institución Educativa ABC. Todos los derechos reservados.</p>
            </div>
        </footer>
    `;

    if (!container) return;
    container.innerHTML = html;

    const modal      = document.getElementById('public-course-modal');
    const modalTitle = document.getElementById('public-course-modal-title');
    const modalBody  = document.getElementById('public-course-modal-body');
    const closeBtn   = document.getElementById('public-course-modal-close');

    const closeModal = () => {
        modal.classList.remove('active');
        modalBody.innerHTML = '';
    };

    const renderModulesHTML = (modules) => {
        if (!modules || modules.length === 0) {
            return '<p style="color: var(--text-muted);">Este curso no tiene módulos publicados aún.</p>';
        }
        return modules.map((mod, mIdx) => `
            <div class="public-module-card">
                <h4>${mIdx + 1}. ${mod.nombre}</h4>
                <p style="font-size:0.8rem;color:var(--text-muted);margin-bottom:0.25rem;">Código: ${mod.codigo || 'N/D'}</p>
                <p style="font-size:0.875rem;">${mod.descripcion || 'Sin descripción.'}</p>
                <div style="margin-top: 0.75rem;">
                    <strong style="font-size:0.8rem;">Lecciones:</strong>
                    ${(mod.lecciones && mod.lecciones.length > 0)
                        ? `<ul class="public-lessons-list">
                            ${mod.lecciones.map((lec, lIdx) => `
                                <li>
                                    <strong>${lIdx + 1}. ${lec.titulo}</strong>
                                    <span style="font-size:0.8rem;color:var(--text-muted);"> · ${lec.intensidad || ''}</span>
                                    <p style="font-size:0.875rem;margin-top:0.25rem;">${lec.contenido || ''}</p>
                                    ${lec.multimedia
                                        ? `<a href="${lec.multimedia}" target="_blank" rel="noopener noreferrer">
                                               Ver recurso multimedia
                                           </a>`
                                        : ''}
                                </li>
                            `).join('')}
                          </ul>`
                        : '<p style="margin-top:0.5rem;font-size:0.875rem;">Sin lecciones registradas.</p>'
                    }
                </div>
            </div>
        `).join('');
    };

    const openCourseDetails = (courseId) => {
        const course  = courses.find(c => c.id === courseId);
        if (!course) return;
        const teacher = teachers.find(t => t.id === course.docenteId);

        modalTitle.textContent = course.nombre;
        modalBody.innerHTML = `
            <div class="public-course-detail-grid">
                <div>
                    <p><strong>Código:</strong> ${course.codigo || 'N/D'}</p>
                    <p><strong>Categoría:</strong> ${course.categorias || 'N/D'}</p>
                    <p><strong>Tipo:</strong> ${course.tipo || 'N/D'}</p>
                    <p><strong>Duración:</strong> ${course.duracion || 'N/D'}</p>
                    <p><strong>Estado:</strong> ${course.estado || 'N/D'}</p>
                    <p><strong>Etiquetas:</strong> ${course.etiquetas || 'Sin etiquetas'}</p>
                    <p style="margin-top:0.5rem;">
                        <strong>Fecha de inicio:</strong>
                        <span style="color:var(--primary);font-weight:600;">
                            ${formatFecha(course.fecha)}
                        </span>
                    </p>
                </div>
                <div>
                    <p><strong>Docente:</strong> ${teacher ? `${teacher.nombres} ${teacher.apellidos}` : 'Sin asignar'}</p>
                    <p><strong>Correo:</strong> ${teacher ? teacher.email : 'N/D'}</p>
                    <p><strong>Área:</strong> ${teacher ? teacher.area : 'N/D'}</p>
                </div>
            </div>
            <div style="margin-top: 1rem;">
                <h3 style="font-size: 1rem; font-weight:600; margin-bottom: 0.5rem;">Descripción</h3>
                <p>${course.descripcion || 'Sin descripción disponible.'}</p>
            </div>
            <div style="margin-top: 1.25rem;">
                <h3 style="font-size: 1rem; font-weight:600; margin-bottom: 0.75rem;">Módulos y Lecciones</h3>
                ${renderModulesHTML(course.modulos)}
            </div>
        `;
        modal.classList.add('active');
        modal.focus();
    };

    document.querySelectorAll('.public-course-card').forEach(card => {
        card.addEventListener('click',   ()  => openCourseDetails(card.dataset.courseId));
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openCourseDetails(card.dataset.courseId);
            }
        });
    });

    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
    });
}