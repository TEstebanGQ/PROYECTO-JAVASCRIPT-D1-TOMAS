import { getData, createItem, updateItem, deleteItem } from '../store.js';

export function renderCourses(container) {
    let courses = getData('lmsCourses');
    let teachers = getData('lmsTeachers');
    
    // Estado para navegación interna (lista vs detalle/edición)
    let currentView = 'list'; // 'list', 'edit'
    let currentCourseId = null;
    
    if(container) {
        renderMain();
    }
    
    function renderMain() {
        if (currentView === 'list') {
            renderListView();
        } else if (currentView === 'edit') {
            renderEditView();
        }
    }
    
    function renderListView() {
        const html = `
            <div class="page-header">
                <h1 class="page-title">Gestión de Cursos</h1>
                <button id="btn-add-course" class="btn btn-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 8px;"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                    Nuevo Curso
                </button>
            </div>
            
            <div class="card mb-6" style="padding: 1rem;">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div class="form-group" style="margin-bottom: 0;">
                        <input type="text" id="filter-text" class="form-control" placeholder="Buscar curso...">
                    </div>
                    <div class="form-group" style="margin-bottom: 0;">
                        <select id="filter-status" class="form-control">
                            <option value="">Todos los estados</option>
                            <option value="Activo">Activo</option>
                            <option value="Inactivo">Inactivo</option>
                        </select>
                    </div>
                    <div class="form-group" style="margin-bottom: 0;">
                        <select id="filter-visibility" class="form-control">
                            <option value="">Toda visibilidad</option>
                            <option value="Publico">Público</option>
                            <option value="Privado">Privado</option>
                        </select>
                    </div>
                </div>
            </div>
            
            <div class="table-container">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Código</th>
                            <th>Curso</th>
                            <th>Docente</th>
                            <th>Estado</th>
                            <th>Visibilidad</th>
                            <th style="text-align: right;">Acciones</th>
                        </tr>
                    </thead>
                    <tbody id="courses-table-body">
                        <!-- Filas generadas por JS -->
                    </tbody>
                </table>
            </div>
        `;
        
        container.innerHTML = html;
        renderTable();
        
        document.getElementById('btn-add-course').addEventListener('click', () => {
            currentCourseId = null;
            currentView = 'edit';
            renderMain();
        });
        
        // Filtros
        const applyFilters = () => renderTable();
        document.getElementById('filter-text').addEventListener('input', applyFilters);
        document.getElementById('filter-status').addEventListener('change', applyFilters);
        document.getElementById('filter-visibility').addEventListener('change', applyFilters);
    }
    
    function renderTable() {
        const tbody = document.getElementById('courses-table-body');
        
        const filterText = document.getElementById('filter-text').value.toLowerCase();
        const filterStatus = document.getElementById('filter-status').value;
        const filterVisibility = document.getElementById('filter-visibility').value;
        
        const filteredCourses = courses.filter(c => {
            const matchText = c.nombre.toLowerCase().includes(filterText) || c.codigo.toLowerCase().includes(filterText);
            const matchStatus = filterStatus === '' || c.estado === filterStatus;
            const matchVisibility = filterVisibility === '' || c.visibilidad === filterVisibility;
            return matchText && matchStatus && matchVisibility;
        });
        
        if (filteredCourses.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center" style="color: var(--text-muted);">No se encontraron cursos</td></tr>';
            return;
        }
        
        tbody.innerHTML = filteredCourses.map(course => {
            const teacher = teachers.find(t => t.id === course.docenteId);
            const teacherName = teacher ? `${teacher.nombres} ${teacher.apellidos}` : 'Sin asignar';
            
            return `
                <tr>
                    <td>${course.codigo}</td>
                    <td>
                        <div style="font-weight: 500;">${course.nombre}</div>
                        <div style="font-size: 0.75rem; color: var(--text-muted);">${course.categorias}</div>
                    </td>
                    <td>${teacherName}</td>
                    <td><span class="badge ${course.estado === 'Activo' ? 'badge-success' : 'badge-warning'}">${course.estado}</span></td>
                    <td><span class="badge badge-info">${course.visibilidad}</span></td>
                    <td style="text-align: right;">
                        <button class="btn btn-outline btn-edit-course" data-id="${course.id}" style="padding: 0.25rem 0.5rem; margin-right: 0.5rem;">Editar / Módulos</button>
                        <button class="btn btn-danger btn-delete-course" data-id="${course.id}" style="padding: 0.25rem 0.5rem;">Eliminar</button>
                    </td>
                </tr>
            `;
        }).join('');
        
        document.querySelectorAll('.btn-edit-course').forEach(btn => {
            btn.addEventListener('click', (e) => {
                currentCourseId = e.currentTarget.dataset.id;
                currentView = 'edit';
                renderMain();
            });
        });
        
        document.querySelectorAll('.btn-delete-course').forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (confirm('¿Está seguro de eliminar este curso?')) {
                    deleteItem('lmsCourses', e.currentTarget.dataset.id);
                    courses = getData('lmsCourses');
                    renderTable();
                }
            });
        });
    }
    
    function renderEditView() {
        const course = currentCourseId ? courses.find(c => c.id === currentCourseId) : null;
        const modulos = course ? (course.modulos || []) : [];
        
        const html = `
            <div class="page-header">
                <div class="flex items-center gap-4">
                    <button id="btn-back" class="btn btn-outline" style="padding: 0.5rem;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                    </button>
                    <h1 class="page-title">${course ? 'Editar Curso' : 'Nuevo Curso'}</h1>
                </div>
                <button id="btn-save-course" class="btn btn-primary" form="course-form">Guardar Curso</button>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="md:col-span-2">
                    <div class="card mb-6">
                        <h2 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 1.5rem;">Información General</h2>
                        <form id="course-form">
                            <div class="grid grid-cols-2 gap-4">
                                <div class="form-group">
                                    <label class="form-label">Código del Curso</label>
                                    <input type="text" id="course-codigo" class="form-control" required value="${course ? course.codigo : ''}">
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Nombre del Curso</label>
                                    <input type="text" id="course-nombre" class="form-control" required value="${course ? course.nombre : ''}">
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Descripción</label>
                                <textarea id="course-descripcion" class="form-control" rows="4" required>${course ? course.descripcion : ''}</textarea>
                            </div>
                            <div class="grid grid-cols-2 gap-4">
                                <div class="form-group">
                                    <label class="form-label">Docente Asignado</label>
                                    <select id="course-docente" class="form-control" required>
                                        <option value="">Seleccione un docente...</option>
                                        ${teachers.map(t => `<option value="${t.id}" ${course && course.docenteId === t.id ? 'selected' : ''}>${t.nombres} ${t.apellidos}</option>`).join('')}
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Categoría</label>
                                    <input type="text" id="course-categoria" class="form-control" required value="${course ? course.categorias : ''}">
                                </div>
                            </div>
                            <div class="grid grid-cols-3 gap-4">
                                <div class="form-group">
                                    <label class="form-label">Duración</label>
                                    <input type="text" id="course-duracion" class="form-control" placeholder="Ej: 40 horas" required value="${course ? course.duracion : ''}">
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Estado</label>
                                    <select id="course-estado" class="form-control" required>
                                        <option value="Activo" ${course && course.estado === 'Activo' ? 'selected' : ''}>Activo</option>
                                        <option value="Inactivo" ${course && course.estado === 'Inactivo' ? 'selected' : ''}>Inactivo</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Visibilidad</label>
                                    <select id="course-visibilidad" class="form-control" required>
                                        <option value="Privado" ${course && course.visibilidad === 'Privado' ? 'selected' : ''}>Privado</option>
                                        <option value="Publico" ${course && course.visibilidad === 'Publico' ? 'selected' : ''}>Público</option>
                                    </select>
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Etiquetas (separadas por coma)</label>
                                <input type="text" id="course-etiquetas" class="form-control" placeholder="js, web, basico" value="${course ? course.etiquetas : ''}">
                            </div>
                        </form>
                    </div>
                </div>
                
                <div>
                    <div class="card">
                        <div class="flex justify-between items-center mb-4">
                            <h2 style="font-size: 1.125rem; font-weight: 600;">Módulos</h2>
                            ${course ? `<button id="btn-add-module" class="btn btn-primary" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;">+ Agregar</button>` : ''}
                        </div>
                        
                        ${!course ? `
                            <div style="text-align: center; padding: 2rem 0; color: var(--text-muted); font-size: 0.875rem;">
                                Guarda el curso primero para agregar módulos y lecciones.
                            </div>
                        ` : `
                            <div id="modules-list" style="display: flex; flex-direction: column; gap: 1rem;">
                                ${modulos.length === 0 ? '<p style="color: var(--text-muted); font-size: 0.875rem; text-align: center;">No hay módulos creados.</p>' : ''}
                                ${modulos.map((mod, mIndex) => `
                                    <div style="border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 1rem;">
                                        <div class="flex justify-between items-start mb-2">
                                            <div style="font-weight: 500; font-size: 0.875rem;">${mod.codigo} - ${mod.nombre}</div>
                                            <div class="flex gap-1">
                                                <button class="btn-edit-module" data-index="${mIndex}" style="color: var(--info);"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg></button>
                                                <button class="btn-delete-module" data-index="${mIndex}" style="color: var(--danger);"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg></button>
                                            </div>
                                        </div>
                                        
                                        <!-- Lecciones -->
                                        <div style="margin-top: 0.5rem; padding-top: 0.5rem; border-top: 1px dashed var(--border-color);">
                                            <div class="flex justify-between items-center mb-2">
                                                <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 500;">LECCIONES</span>
                                                <button class="btn-add-lesson" data-mindex="${mIndex}" style="font-size: 0.75rem; color: var(--primary); font-weight: 500;">+ Añadir</button>
                                            </div>
                                            <ul style="display: flex; flex-direction: column; gap: 0.25rem;">
                                                ${(mod.lecciones || []).map((lec, lIndex) => `
                                                    <li style="font-size: 0.75rem; display: flex; justify-content: space-between; background: var(--bg-body); padding: 0.25rem 0.5rem; border-radius: 0.25rem;">
                                                        <span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 150px;">${lec.titulo}</span>
                                                        <div class="flex gap-2">
                                                            <button class="btn-edit-lesson" data-mindex="${mIndex}" data-lindex="${lIndex}" style="color: var(--info);">✎</button>
                                                            <button class="btn-delete-lesson" data-mindex="${mIndex}" data-lindex="${lIndex}" style="color: var(--danger);">×</button>
                                                        </div>
                                                    </li>
                                                `).join('')}
                                            </ul>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        `}
                    </div>
                </div>
            </div>
            
            <!-- Modals para Módulos y Lecciones -->
            <div id="module-modal" class="modal-overlay">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2 id="module-modal-title" class="modal-title">Módulo</h2>
                        <span class="modal-close" onclick="document.getElementById('module-modal').classList.remove('active')">&times;</span>
                    </div>
                    <div class="modal-body">
                        <form id="module-form">
                            <input type="hidden" id="module-index">
                            <div class="form-group">
                                <label class="form-label">Código</label>
                                <input type="text" id="module-codigo" class="form-control" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Nombre</label>
                                <input type="text" id="module-nombre" class="form-control" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Descripción</label>
                                <textarea id="module-descripcion" class="form-control" rows="3"></textarea>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-primary" id="btn-save-module">Guardar Módulo</button>
                    </div>
                </div>
            </div>
            
            <div id="lesson-modal" class="modal-overlay">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2 id="lesson-modal-title" class="modal-title">Lección</h2>
                        <span class="modal-close" onclick="document.getElementById('lesson-modal').classList.remove('active')">&times;</span>
                    </div>
                    <div class="modal-body">
                        <form id="lesson-form">
                            <input type="hidden" id="lesson-mindex">
                            <input type="hidden" id="lesson-lindex">
                            <div class="form-group">
                                <label class="form-label">Título</label>
                                <input type="text" id="lesson-titulo" class="form-control" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Intensidad Horaria</label>
                                <input type="text" id="lesson-intensidad" class="form-control" placeholder="Ej: 2 horas" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Contenido (Texto)</label>
                                <textarea id="lesson-contenido" class="form-control" rows="4" required></textarea>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Multimedia (URL Video/PDF)</label>
                                <input type="url" id="lesson-multimedia" class="form-control" placeholder="https://...">
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-primary" id="btn-save-lesson">Guardar Lección</button>
                    </div>
                </div>
            </div>
        `;
        
        container.innerHTML = html;
        
        // Eventos básicos
        document.getElementById('btn-back').addEventListener('click', () => {
            currentView = 'list';
            renderMain();
        });
        
        document.getElementById('btn-save-course').addEventListener('click', () => {
            const form = document.getElementById('course-form');
            if (form.checkValidity()) {
                const courseData = {
                    codigo: document.getElementById('course-codigo').value,
                    nombre: document.getElementById('course-nombre').value,
                    descripcion: document.getElementById('course-descripcion').value,
                    docenteId: document.getElementById('course-docente').value,
                    categorias: document.getElementById('course-categoria').value,
                    duracion: document.getElementById('course-duracion').value,
                    estado: document.getElementById('course-estado').value,
                    visibilidad: document.getElementById('course-visibilidad').value,
                    etiquetas: document.getElementById('course-etiquetas').value,
                    fecha: course ? course.fecha : new Date().toISOString().split('T')[0],
                    modulos: course ? course.modulos : []
                };
                
                if (currentCourseId) {
                    updateItem('lmsCourses', currentCourseId, courseData);
                } else {
                    const newCourse = createItem('lmsCourses', courseData);
                    currentCourseId = newCourse.id;
                }
                
                courses = getData('lmsCourses');
                alert('Curso guardado exitosamente');
                renderMain(); // Recargar para mostrar panel de módulos si era nuevo
            } else {
                form.reportValidity();
            }
        });
        
        // Eventos Módulos
        if (course) {
            document.getElementById('btn-add-module')?.addEventListener('click', () => {
                document.getElementById('module-form').reset();
                document.getElementById('module-index').value = '';
                document.getElementById('module-modal-title').textContent = 'Nuevo Módulo';
                document.getElementById('module-modal').classList.add('active');
            });
            
            document.querySelectorAll('.btn-edit-module').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const idx = e.currentTarget.dataset.index;
                    const mod = course.modulos[idx];
                    document.getElementById('module-index').value = idx;
                    document.getElementById('module-codigo').value = mod.codigo;
                    document.getElementById('module-nombre').value = mod.nombre;
                    document.getElementById('module-descripcion').value = mod.descripcion;
                    document.getElementById('module-modal-title').textContent = 'Editar Módulo';
                    document.getElementById('module-modal').classList.add('active');
                });
            });
            
            document.querySelectorAll('.btn-delete-module').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    if(confirm('¿Eliminar este módulo y sus lecciones?')) {
                        const idx = e.currentTarget.dataset.index;
                        course.modulos.splice(idx, 1);
                        updateItem('lmsCourses', course.id, course);
                        courses = getData('lmsCourses');
                        renderMain();
                    }
                });
            });
            
            document.getElementById('btn-save-module').addEventListener('click', () => {
                const form = document.getElementById('module-form');
                if (form.checkValidity()) {
                    const idx = document.getElementById('module-index').value;
                    const modData = {
                        id: idx ? course.modulos[idx].id : Date.now().toString(),
                        codigo: document.getElementById('module-codigo').value,
                        nombre: document.getElementById('module-nombre').value,
                        descripcion: document.getElementById('module-descripcion').value,
                        lecciones: idx ? course.modulos[idx].lecciones : []
                    };
                    
                    if (idx !== '') {
                        course.modulos[idx] = modData;
                    } else {
                        course.modulos = course.modulos || [];
                        course.modulos.push(modData);
                    }
                    
                    updateItem('lmsCourses', course.id, course);
                    courses = getData('lmsCourses');
                    document.getElementById('module-modal').classList.remove('active');
                    renderMain();
                } else {
                    form.reportValidity();
                }
            });
            
            // Eventos Lecciones
            document.querySelectorAll('.btn-add-lesson').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    document.getElementById('lesson-form').reset();
                    document.getElementById('lesson-mindex').value = e.currentTarget.dataset.mindex;
                    document.getElementById('lesson-lindex').value = '';
                    document.getElementById('lesson-modal-title').textContent = 'Nueva Lección';
                    document.getElementById('lesson-modal').classList.add('active');
                });
            });
            
            document.querySelectorAll('.btn-edit-lesson').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const mIdx = e.currentTarget.dataset.mindex;
                    const lIdx = e.currentTarget.dataset.lindex;
                    const lec = course.modulos[mIdx].lecciones[lIdx];
                    
                    document.getElementById('lesson-mindex').value = mIdx;
                    document.getElementById('lesson-lindex').value = lIdx;
                    document.getElementById('lesson-titulo').value = lec.titulo;
                    document.getElementById('lesson-intensidad').value = lec.intensidad;
                    document.getElementById('lesson-contenido').value = lec.contenido;
                    document.getElementById('lesson-multimedia').value = lec.multimedia || '';
                    
                    document.getElementById('lesson-modal-title').textContent = 'Editar Lección';
                    document.getElementById('lesson-modal').classList.add('active');
                });
            });
            
            document.querySelectorAll('.btn-delete-lesson').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    if(confirm('¿Eliminar esta lección?')) {
                        const mIdx = e.currentTarget.dataset.mindex;
                        const lIdx = e.currentTarget.dataset.lindex;
                        course.modulos[mIdx].lecciones.splice(lIdx, 1);
                        updateItem('lmsCourses', course.id, course);
                        courses = getData('lmsCourses');
                        renderMain();
                    }
                });
            });
            
            document.getElementById('btn-save-lesson').addEventListener('click', () => {
                const form = document.getElementById('lesson-form');
                if (form.checkValidity()) {
                    const mIdx = document.getElementById('lesson-mindex').value;
                    const lIdx = document.getElementById('lesson-lindex').value;
                    
                    const lecData = {
                        id: lIdx ? course.modulos[mIdx].lecciones[lIdx].id : Date.now().toString(),
                        titulo: document.getElementById('lesson-titulo').value,
                        intensidad: document.getElementById('lesson-intensidad').value,
                        contenido: document.getElementById('lesson-contenido').value,
                        multimedia: document.getElementById('lesson-multimedia').value
                    };
                    
                    course.modulos[mIdx].lecciones = course.modulos[mIdx].lecciones || [];
                    
                    if (lIdx !== '') {
                        course.modulos[mIdx].lecciones[lIdx] = lecData;
                    } else {
                        course.modulos[mIdx].lecciones.push(lecData);
                    }
                    
                    updateItem('lmsCourses', course.id, course);
                    courses = getData('lmsCourses');
                    document.getElementById('lesson-modal').classList.remove('active');
                    renderMain();
                } else {
                    form.reportValidity();
                }
            });
        }
    }
}
