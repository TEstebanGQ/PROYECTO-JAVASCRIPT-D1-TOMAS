import { getData, createItem, updateItem, deleteItem } from '../store.js';
import { showToast } from '../utils/toast.js';

export function renderStudents(container) {
    let students = getData('lmsStudent');

    const html = `
        <div class="page-header">
            <h1 class="page-title">Gestión de Estudiantes</h1>
            <button id="btn-add-student" class="btn btn-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round" style="margin-right: 8px;">
                    <path d="M5 12h14"/><path d="M12 5v14"/>
                </svg>
                Nuevo Estudiante
            </button>
        </div>

        <div class="table-container">
            <table class="table">
                <thead>
                    <tr>
                        <th>Estudiante</th>
                        <th class="col-hide-mobile">Identificación</th>
                        <th class="col-hide-mobile">Género</th>
                        <th class="col-hide-mobile">Teléfono</th>
                        <th>Cursos</th>
                        <th style="text-align: right;">Acciones</th>
                    </tr>
                </thead>
                <tbody id="students-table-body"></tbody>
            </table>
        </div>
        <div id="student-modal" class="modal-overlay" role="dialog" aria-modal="true">
            <div class="modal-content" style="max-width:560px;">
                <div class="modal-header">
                    <h2 id="student-modal-title" class="modal-title">Nuevo Estudiante</h2>
                    <span class="modal-close" id="close-student-modal">&times;</span>
                </div>
                <div class="modal-body">
                    <form id="student-form" novalidate>
                        <input type="hidden" id="student-id">

                        <div class="form-group">
                            <label class="form-label">Identificación *</label>
                            <input type="text" id="student-identificacion" class="form-control"
                                placeholder="Ej: 1234567890" required maxlength="20" autocomplete="off">
                            <span class="form-error hidden" id="err-identificacion"></span>
                        </div>

                        <div class="grid grid-cols-2 gap-4">
                            <div class="form-group">
                                <label class="form-label">Nombres *</label>
                                <input type="text" id="student-nombres" class="form-control"
                                    required minlength="2" maxlength="80" autocomplete="off">
                                <span class="form-error hidden" id="err-nombres"></span>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Apellidos *</label>
                                <input type="text" id="student-apellidos" class="form-control"
                                    required minlength="2" maxlength="80" autocomplete="off">
                                <span class="form-error hidden" id="err-apellidos"></span>
                            </div>
                        </div>

                        <div class="grid grid-cols-2 gap-4">
                            <div class="form-group">
                                <label class="form-label">Género *</label>
                                <select id="student-genero" class="form-control" required>
                                    <option value="">Seleccioná...</option>
                                    <option value="Masculino">Masculino</option>
                                    <option value="Femenino">Femenino</option>
                                    <option value="Otro">Otro</option>
                                </select>
                                <span class="form-error hidden" id="err-genero"></span>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Fecha de Nacimiento *</label>
                                <input type="date" id="student-fechanac" class="form-control" required>
                                <span class="form-error hidden" id="err-fechanac"></span>
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="form-label">Dirección *</label>
                            <input type="text" id="student-direccion" class="form-control"
                                placeholder="Ej: Calle 10 # 5-20" required maxlength="120" autocomplete="off">
                            <span class="form-error hidden" id="err-direccion"></span>
                        </div>

                        <div class="form-group">
                            <label class="form-label">Teléfono *</label>
                            <input type="tel" id="student-telefono" class="form-control"
                                placeholder="Ej: 3001234567" required maxlength="15" autocomplete="off">
                            <span class="form-error hidden" id="err-telefono"></span>
                        </div>
                        <div class="form-group" style="margin-top:0.5rem;">
                            <label class="form-label">Cursos Asociados</label>
                            <div id="cursos-checkboxes"
                                style="max-height:180px;overflow-y:auto;border:1px solid var(--border-color);
                                       border-radius:var(--radius-md);padding:0.75rem;
                                       display:flex;flex-direction:column;gap:0.5rem;background:var(--bg-body);">
                            </div>
                            <small style="color:var(--text-muted);font-size:0.75rem;margin-top:0.25rem;display:block;">
                                Seleccioná uno o más cursos activos.
                            </small>
                        </div>

                    </form>
                </div>
                <div class="modal-footer">
                    <button id="btn-cancel-student" class="btn btn-outline">Cancelar</button>
                    <button id="btn-save-student" class="btn btn-primary">Guardar</button>
                </div>
            </div>
        </div>
        <div id="cursos-modal" class="modal-overlay" role="dialog" aria-modal="true">
            <div class="modal-content" style="max-width:600px;">
                <div class="modal-header">
                    <h2 id="cursos-modal-title" class="modal-title">Cursos del Estudiante</h2>
                    <span class="modal-close" id="close-cursos-modal">&times;</span>
                </div>
                <div id="cursos-modal-body" class="modal-body"></div>
                <div class="modal-footer">
                    <button id="btn-close-cursos" class="btn btn-outline">Cerrar</button>
                </div>
            </div>
        </div>
    `;

    if (container) {
        container.innerHTML = html;
        renderTable();
        setupEvents();
    }
    function renderTable() {
        students = getData('lmsStudent');
        const tbody = document.getElementById('students-table-body');

        if (students.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6">
                        <div class="table-empty-state">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="1.5"
                                stroke-linecap="round" stroke-linejoin="round" style="opacity:0.3;">
                                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                                <circle cx="9" cy="7" r="4"/>
                                <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                            </svg>
                            <span>No hay estudiantes registrados.</span>
                            <button id="btn-empty-add" class="btn btn-primary btn-sm">+ Agregar primero</button>
                        </div>
                    </td>
                </tr>`;
            document.getElementById('btn-empty-add')?.addEventListener('click', () => openStudentModal());
            return;
        }

        tbody.innerHTML = students.map(student => {
            const cursosCount = (student.cursos || []).length;

            let cursosBadge;
            if (cursosCount === 0) {
                cursosBadge = `<span class="badge" style="background:#f3f4f6;color:var(--text-muted);">Sin cursos</span>`;
            } else if (cursosCount <= 3) {
                cursosBadge = `<span class="badge badge-success">${cursosCount} curso${cursosCount !== 1 ? 's' : ''}</span>`;
            } else {
                cursosBadge = `<span class="badge badge-warning">${cursosCount} cursos</span>`;
            }

            const inicial = student.nombres.charAt(0).toUpperCase();

            return `
                <tr>
                    <td>
                        <div class="flex items-center gap-2">
                            <div class="avatar-initial">${inicial}</div>
                            <div>
                                <div style="font-weight:500;">${student.nombres} ${student.apellidos}</div>
                                <div style="font-size:0.75rem;color:var(--text-muted);">${student.identificacion}</div>
                            </div>
                        </div>
                    </td>
                    <td class="col-hide-mobile">${student.identificacion}</td>
                    <td class="col-hide-mobile">
                        <span class="badge badge-info">${student.genero || '—'}</span>
                    </td>
                    <td class="col-hide-mobile">${student.telefono || '—'}</td>
                    <td>
                        <button class="btn btn-outline btn-sm btn-ver-cursos" data-id="${student.id}">
                            Ver cursos ${cursosBadge}
                        </button>
                    </td>
                    <td style="text-align:right;white-space:nowrap;">
                        <button class="btn btn-outline btn-sm btn-edit-student"
                            data-id="${student.id}" style="margin-right:0.25rem;">Editar</button>
                        <button class="btn btn-danger btn-sm btn-delete-student"
                            data-id="${student.id}">Eliminar</button>
                    </td>
                </tr>`;
        }).join('');

        document.querySelectorAll('.btn-ver-cursos').forEach(btn =>
            btn.addEventListener('click', e => openCursosModal(e.currentTarget.dataset.id))
        );
        document.querySelectorAll('.btn-edit-student').forEach(btn =>
            btn.addEventListener('click', e => openStudentModal(e.currentTarget.dataset.id))
        );
        document.querySelectorAll('.btn-delete-student').forEach(btn =>
            btn.addEventListener('click', e => handleDelete(e.currentTarget.dataset.id))
        );
    }
    function setupEvents() {
        document.getElementById('btn-add-student').addEventListener('click', () => openStudentModal());

        document.getElementById('close-student-modal').addEventListener('click', closeStudentModal);
        document.getElementById('btn-cancel-student').addEventListener('click', closeStudentModal);
        document.getElementById('student-modal').addEventListener('click', e => {
            if (e.target === e.currentTarget) closeStudentModal();
        });
        document.getElementById('btn-save-student').addEventListener('click', handleSave);

        document.getElementById('close-cursos-modal').addEventListener('click', closeCursosModal);
        document.getElementById('btn-close-cursos').addEventListener('click', closeCursosModal);
        document.getElementById('cursos-modal').addEventListener('click', e => {
            if (e.target === e.currentTarget) closeCursosModal();
        });

        document.addEventListener('keydown', e => {
            if (e.key !== 'Escape') return;
            if (document.getElementById('student-modal').classList.contains('active')) closeStudentModal();
            if (document.getElementById('cursos-modal').classList.contains('active')) closeCursosModal();
        });
    }
    function openStudentModal(id = null) {
        const modal = document.getElementById('student-modal');
        clearErrors();
        document.getElementById('student-form').reset();
        document.getElementById('student-id').value = '';

        // Cargar checkboxes con cursos activos
        const courses = getData('lmsCourses').filter(c => c.estado === 'Activo');
        const checksContainer = document.getElementById('cursos-checkboxes');

        if (courses.length === 0) {
            checksContainer.innerHTML = `
                <p style="font-size:0.8rem;color:var(--text-muted);">
                    No hay cursos activos disponibles.
                </p>`;
        } else {
            checksContainer.innerHTML = courses.map(c => `
                <label style="display:flex;align-items:center;gap:0.5rem;cursor:pointer;
                               font-size:0.875rem;padding:0.25rem 0;">
                    <input type="checkbox" class="curso-check" value="${c.id}"
                        style="width:15px;height:15px;accent-color:var(--primary);cursor:pointer;">
                    <span>
                        <strong>${c.codigo}</strong> — ${c.nombre}
                        <span style="font-size:0.75rem;color:var(--text-muted);margin-left:0.25rem;">
                            (${c.tipo || 'N/D'} · ${c.duracion || 'N/D'})
                        </span>
                    </span>
                </label>
            `).join('');
        }

        if (id) {
            document.getElementById('student-modal-title').textContent = 'Editar Estudiante';
            const student = students.find(s => s.id === id);
            if (student) {
                document.getElementById('student-id').value             = student.id;
                document.getElementById('student-identificacion').value = student.identificacion;
                document.getElementById('student-nombres').value        = student.nombres;
                document.getElementById('student-apellidos').value      = student.apellidos;
                document.getElementById('student-genero').value         = student.genero || '';
                document.getElementById('student-fechanac').value       = student.fechaNacimiento || '';
                document.getElementById('student-direccion').value      = student.direccion || '';
                document.getElementById('student-telefono').value       = student.telefono || '';

                // Marcar los cursos ya asociados
                const cursosAsociados = student.cursos || [];
                document.querySelectorAll('.curso-check').forEach(chk => {
                    chk.checked = cursosAsociados.includes(chk.value);
                });
            }
        } else {
            document.getElementById('student-modal-title').textContent = 'Nuevo Estudiante';
        }

        modal.classList.add('active');
        requestAnimationFrame(() => document.getElementById('student-identificacion')?.focus());
    }

    function closeStudentModal() {
        document.getElementById('student-modal').classList.remove('active');
        clearErrors();
    }
    function openCursosModal(id) {
        const student = students.find(s => s.id === id);
        if (!student) return;

        const allCourses    = getData('lmsCourses');
        const teachers      = getData('lmsTeachers');
        const cursosIds     = student.cursos || [];
        const cursosStudent = allCourses.filter(c => cursosIds.includes(c.id));
        const fechaNacFormateada = student.fechaNacimiento
            ? new Date(student.fechaNacimiento + 'T00:00:00').toLocaleDateString('es-CO', {
                  day: '2-digit', month: 'long', year: 'numeric'
              })
            : '—';

        document.getElementById('cursos-modal-title').textContent =
            `Cursos de ${student.nombres} ${student.apellidos}`;

        document.getElementById('cursos-modal-body').innerHTML = `
            <!-- Info del estudiante -->
            <div class="flex items-center gap-4"
                style="margin-bottom:1.25rem;padding-bottom:1rem;border-bottom:1px solid #e5e7eb;">
                <div class="avatar-initial" style="width:48px;height:48px;font-size:1.25rem;flex-shrink:0;">
                    ${student.nombres.charAt(0).toUpperCase()}
                </div>
                <div>
                    <div style="font-weight:600;font-size:1rem;">
                        ${student.nombres} ${student.apellidos}
                    </div>
                    <div style="font-size:0.8rem;color:var(--text-muted);">
                        ID: ${student.identificacion}
                        &nbsp;·&nbsp; ${student.genero || '—'}
                    </div>
                    <div style="font-size:0.8rem;color:var(--text-muted);margin-top:0.1rem;">
                        ${fechaNacFormateada}
                    </div>
                    <div style="font-size:0.8rem;color:var(--text-muted);margin-top:0.1rem;">
                        ${student.direccion || '—'}
                        &nbsp;·&nbsp; ${student.telefono || '—'}
                    </div>
                </div>
            </div>

            <div style="margin-bottom:0.75rem;">
                <span class="badge ${cursosStudent.length > 0 ? 'badge-success' : ''}">
                    ${cursosStudent.length} curso${cursosStudent.length !== 1 ? 's' : ''} asociado${cursosStudent.length !== 1 ? 's' : ''}
                </span>
            </div>

            ${cursosStudent.length === 0
                ? `<p style="text-align:center;color:var(--text-muted);padding:1.5rem 0;">
                       Este estudiante no tiene cursos asociados aún.
                   </p>`
                : `<div style="display:flex;flex-direction:column;gap:0.75rem;">
                    ${cursosStudent.map(c => {
                        const teacher        = teachers.find(t => t.id === c.docenteId);
                        const estadoBadge    = c.estado === 'Activo'
                            ? '<span class="badge badge-success">Activo</span>'
                            : '<span class="badge badge-warning">Inactivo</span>';
                        const modulosCount   = c.modulos?.length ?? 0;
                        const leccionesCount = c.modulos?.reduce((s, m) => s + (m.lecciones?.length ?? 0), 0) ?? 0;
                        const fechaDisplay   = c.fecha
                            ? new Date(c.fecha + 'T00:00:00').toLocaleDateString('es-CO', {
                                  day: '2-digit', month: 'short', year: 'numeric'
                              })
                            : '—';
                        return `
                            <div style="border:1px solid #e5e7eb;border-radius:var(--radius-md);
                                        padding:0.875rem;background:#f9fafb;">
                                <div style="display:flex;justify-content:space-between;
                                            align-items:flex-start;gap:0.5rem;flex-wrap:wrap;">
                                    <div>
                                        <div style="font-weight:600;font-size:0.9rem;">${c.nombre}</div>
                                        <div style="font-size:0.75rem;color:var(--text-muted);margin-top:0.1rem;">
                                            ${c.codigo} &nbsp;·&nbsp; ${c.categorias || 'Sin categoría'}
                                            ${c.tipo ? `&nbsp;·&nbsp; ${c.tipo}` : ''}
                                        </div>
                                    </div>
                                    ${estadoBadge}
                                </div>
                                <div style="display:flex;gap:1rem;margin-top:0.5rem;
                                            font-size:0.78rem;color:var(--text-muted);flex-wrap:wrap;">
                                    <span>${teacher ? teacher.nombres + ' ' + teacher.apellidos : 'Sin docente'}</span>
                                    <span>${modulosCount} módulo${modulosCount !== 1 ? 's' : ''}</span>
                                    <span>${leccionesCount} lección${leccionesCount !== 1 ? 'es' : ''}</span>
                                    <span>${c.duracion || 'N/D'}</span>
                                    <span>${fechaDisplay}</span>
                                </div>
                            </div>`;
                    }).join('')}
                   </div>`
            }
        `;

        document.getElementById('cursos-modal').classList.add('active');
    }

    function closeCursosModal() {
        document.getElementById('cursos-modal').classList.remove('active');
    }
    function clearErrors() {
        ['identificacion', 'nombres', 'apellidos', 'genero', 'fechanac', 'direccion', 'telefono'].forEach(f => {
            const el    = document.getElementById(`err-${f}`);
            const input = document.getElementById(`student-${f}`);
            if (el)    { el.textContent = ''; el.classList.add('hidden'); }
            if (input) { input.classList.remove('is-invalid'); }
        });
    }

    function showError(field, msg) {
        const el    = document.getElementById(`err-${field}`);
        const input = document.getElementById(`student-${field}`);
        if (el)    { el.textContent = msg; el.classList.remove('hidden'); }
        if (input) { input.classList.add('is-invalid'); }
    }

    function isUnique(field, value, excludeId = null) {
        return !getData('lmsStudent').some(s =>
            s[field]?.toLowerCase() === value.toLowerCase() && s.id !== excludeId
        );
    }
    function handleSave() {
        clearErrors();

        const id              = document.getElementById('student-id').value;
        const identificacion  = document.getElementById('student-identificacion').value.trim();
        const nombres         = document.getElementById('student-nombres').value.trim();
        const apellidos       = document.getElementById('student-apellidos').value.trim();
        const genero          = document.getElementById('student-genero').value;
        const fechaNacimiento = document.getElementById('student-fechanac').value;
        const direccion       = document.getElementById('student-direccion').value.trim();
        const telefono        = document.getElementById('student-telefono').value.trim();
        const cursos          = [...document.querySelectorAll('.curso-check:checked')].map(c => c.value);

        let hasError = false;

        if (!identificacion || identificacion.length < 5) {
            showError('identificacion', 'La identificación es obligatoria (mínimo 5 caracteres).'); hasError = true;
        } else if (!isUnique('identificacion', identificacion, id || null)) {
            showError('identificacion', 'Esa identificación ya está registrada.'); hasError = true;
        }

        if (!nombres || nombres.length < 2) {
            showError('nombres', 'Los nombres son obligatorios (mínimo 2 caracteres).'); hasError = true;
        }

        if (!apellidos || apellidos.length < 2) {
            showError('apellidos', 'Los apellidos son obligatorios (mínimo 2 caracteres).'); hasError = true;
        }

        if (!genero) {
            showError('genero', 'El género es obligatorio.'); hasError = true;
        }

        if (!fechaNacimiento) {
            showError('fechanac', 'La fecha de nacimiento es obligatoria.'); hasError = true;
        } else if (new Date(fechaNacimiento) >= new Date()) {
            showError('fechanac', 'La fecha de nacimiento debe ser anterior a hoy.'); hasError = true;
        }

        if (!direccion) {
            showError('direccion', 'La dirección es obligatoria.'); hasError = true;
        }

        if (!telefono || telefono.length < 7) {
            showError('telefono', 'El teléfono es obligatorio (mínimo 7 dígitos).'); hasError = true;
        }

        if (hasError) {
            document.querySelector('#student-modal .is-invalid')
                ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

        const studentData = { identificacion, nombres, apellidos, genero, fechaNacimiento, direccion, telefono, cursos };

        if (id) {
            updateItem('lmsStudent', id, studentData);
            showToast('Estudiante actualizado correctamente');
        } else {
            createItem('lmsStudent', studentData);
            showToast('Estudiante creado correctamente');
        }

        students = getData('lmsStudent');
        renderTable();
        closeStudentModal();
    }
    function handleDelete(id) {
        const student = students.find(s => s.id === id);
        if (!student) return;

        if (confirm(`¿Eliminar a ${student.nombres} ${student.apellidos}? Esta acción no se puede deshacer.`)) {
            deleteItem('lmsStudent', id);
            students = getData('lmsStudent');
            showToast('Estudiante eliminado', 'danger');
            renderTable();
        }
    }

}