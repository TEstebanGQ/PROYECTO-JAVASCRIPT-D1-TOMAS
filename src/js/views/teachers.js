import { getData, createItem, updateItem, deleteItem } from '../store.js';
import { showToast } from '../utils/toast.js';

export function renderTeachers(container) {
    let teachers = getData('lmsTeachers');

    const html = `
        <div class="page-header">
            <h1 class="page-title">Gestión de Docentes</h1>
            <button id="btn-add-teacher" class="btn btn-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round" style="margin-right: 8px;">
                    <path d="M5 12h14"/><path d="M12 5v14"/>
                </svg>
                Nuevo Docente
            </button>
        </div>

        <div class="table-container">
            <table class="table">
                <thead>
                    <tr>
                        <th>Docente</th>
                        <th class="col-hide-mobile">Código</th>
                        <th class="col-hide-mobile">Identificación</th>
                        <th>Área Académica</th>
                        <th class="col-hide-mobile">Cursos a Cargo</th>
                        <th style="text-align: right;">Acciones</th>
                    </tr>
                </thead>
                <tbody id="teachers-table-body"></tbody>
            </table>
        </div>

        <!-- Modal: Formulario docente -->
        <div id="teacher-modal" class="modal-overlay">
            <div class="modal-content">
                <div class="modal-header">
                    <h2 id="modal-title" class="modal-title">Nuevo Docente</h2>
                    <span class="modal-close" id="close-modal">&times;</span>
                </div>
                <div class="modal-body">
                    <form id="teacher-form" novalidate>
                        <input type="hidden" id="teacher-id">
                        <div class="grid grid-cols-2 gap-4">
                            <div class="form-group">
                                <label class="form-label">Código *</label>
                                <input type="text" id="teacher-codigo" class="form-control"
                                    placeholder="Ej: DOC-003" required maxlength="20">
                                <span class="form-error hidden" id="err-codigo"></span>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Identificación *</label>
                                <input type="text" id="teacher-identificacion" class="form-control"
                                    placeholder="Ej: 1234567890" required maxlength="20">
                                <span class="form-error hidden" id="err-identificacion"></span>
                            </div>
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div class="form-group">
                                <label class="form-label">Nombres *</label>
                                <input type="text" id="teacher-nombres" class="form-control"
                                    required minlength="2" maxlength="80">
                                <span class="form-error hidden" id="err-nombres"></span>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Apellidos *</label>
                                <input type="text" id="teacher-apellidos" class="form-control"
                                    required minlength="2" maxlength="80">
                                <span class="form-error hidden" id="err-apellidos"></span>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Correo Electrónico *</label>
                            <input type="email" id="teacher-email" class="form-control" required>
                            <span class="form-error hidden" id="err-email"></span>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Área Académica *</label>
                            <input
                                type="text"
                                id="teacher-area"
                                class="form-control"
                                list="areas-list"
                                placeholder="Ej: Informática, Biología..."
                                required
                                autocomplete="off"
                                maxlength="60"
                            >
                            <datalist id="areas-list">
                                <option value="Matemáticas">
                                <option value="Ciencias">
                                <option value="Humanidades">
                                <option value="Informática">
                                <option value="Idiomas">
                                <option value="Artes">
                                <option value="Biología">
                                <option value="Física">
                                <option value="Química">
                                <option value="Educación Física">
                                <option value="Historia">
                                <option value="Filosofía">
                            </datalist>
                            <span class="form-error hidden" id="err-area"></span>
                        </div>
                        <div class="form-group">
                            <label class="form-label">URL de Foto</label>
                            <input type="url" id="teacher-foto" class="form-control"
                                placeholder="https://ejemplo.com/foto.jpg">
                            <span class="form-error hidden" id="err-foto"></span>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button id="btn-cancel" class="btn btn-outline">Cancelar</button>
                    <button id="btn-save" class="btn btn-primary">Guardar</button>
                </div>
            </div>
        </div>

        <!-- Modal: Carga académica del docente -->
        <div id="carga-modal" class="modal-overlay">
            <div class="modal-content" style="max-width:600px;">
                <div class="modal-header">
                    <h2 id="carga-modal-title" class="modal-title">Carga Académica</h2>
                    <span class="modal-close" id="close-carga-modal">&times;</span>
                </div>
                <div id="carga-modal-body" class="modal-body"></div>
                <div class="modal-footer">
                    <button id="btn-close-carga" class="btn btn-outline">Cerrar</button>
                </div>
            </div>
        </div>
    `;

    if (container) {
        container.innerHTML = html;
        renderTable();
        setupEvents();
    }

    // Tabla
    function renderTable() {
        const courses = getData('lmsCourses');
        const tbody   = document.getElementById('teachers-table-body');

        if (teachers.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center" style="color: var(--text-muted); padding: 2rem;">
                        No hay docentes registrados.
                        <br><br>
                        <button id="btn-empty-add" class="btn btn-primary btn-sm">+ Agregar primer docente</button>
                    </td>
                </tr>`;
            document.getElementById('btn-empty-add')?.addEventListener('click', () => openModal());
            return;
        }

        tbody.innerHTML = teachers.map(teacher => {
            const assignedCourses = courses.filter(c => c.docenteId === teacher.id).length;
            const foto = teacher.foto || `https://picsum.photos/seed/${teacher.id}/200`;

            let cargaBadge;
            if (assignedCourses === 0) {
                cargaBadge = `<span class="badge" style="background:#f3f4f6;color:var(--text-muted);">${assignedCourses} cursos</span>`;
            } else if (assignedCourses <= 3) {
                cargaBadge = `<span class="badge badge-success">${assignedCourses} curso${assignedCourses !== 1 ? 's' : ''}</span>`;
            } else if (assignedCourses <= 6) {
                cargaBadge = `<span class="badge badge-warning">${assignedCourses} cursos</span>`;
            } else {
                cargaBadge = `<span class="badge badge-danger">${assignedCourses} cursos</span>`;
            }

            return `
                <tr>
                    <td>
                        <div class="flex items-center gap-2">
                            <img
                                src="${foto}"
                                alt="Foto"
                                style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover;"
                                onerror="this.src='https://picsum.photos/seed/default/200'"
                            >
                            <div>
                                <div style="font-weight: 500;">${teacher.nombres} ${teacher.apellidos}</div>
                                <div style="font-size: 0.75rem; color: var(--text-muted);">${teacher.email}</div>
                            </div>
                        </div>
                    </td>
                    <td class="col-hide-mobile">${teacher.codigo}</td>
                    <td class="col-hide-mobile">${teacher.identificacion}</td>
                    <td><span class="badge badge-info">${teacher.area}</span></td>
                    <td class="col-hide-mobile">${cargaBadge}</td>
                    <td style="text-align: right; white-space: nowrap;">
                        <button class="btn btn-outline btn-sm btn-ver-carga"
                            data-id="${teacher.id}" style="margin-right:0.25rem;"
                            title="Ver cursos a cargo">
                            Carga
                        </button>
                        <button class="btn btn-outline btn-sm btn-edit"
                            data-id="${teacher.id}" style="margin-right: 0.25rem;">Editar</button>
                        <button class="btn btn-danger btn-sm btn-delete"
                            data-id="${teacher.id}">Eliminar</button>
                    </td>
                </tr>
            `;
        }).join('');

        document.querySelectorAll('.btn-ver-carga').forEach(btn =>
            btn.addEventListener('click', (e) => openCargaModal(e.currentTarget.dataset.id))
        );
        document.querySelectorAll('.btn-edit').forEach(btn =>
            btn.addEventListener('click', (e) => openModal(e.currentTarget.dataset.id))
        );
        document.querySelectorAll('.btn-delete').forEach(btn =>
            btn.addEventListener('click', (e) => handleDelete(e.currentTarget.dataset.id))
        );
    }

    // Eventos globales
    function setupEvents() {
        document.getElementById('btn-add-teacher').addEventListener('click', () => openModal());
        document.getElementById('close-modal').addEventListener('click', closeModal);
        document.getElementById('btn-cancel').addEventListener('click', closeModal);
        document.getElementById('teacher-modal').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) closeModal();
        });
        document.getElementById('btn-save').addEventListener('click', handleSave);

        document.getElementById('close-carga-modal').addEventListener('click', closeCargaModal);
        document.getElementById('btn-close-carga').addEventListener('click', closeCargaModal);
        document.getElementById('carga-modal').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) closeCargaModal();
        });
    }
    function openCargaModal(teacherId) {
        const teacher = teachers.find(t => t.id === teacherId);
        if (!teacher) return;

        const courses        = getData('lmsCourses');
        const cursosDocente  = courses.filter(c => c.docenteId === teacherId);
        const foto           = teacher.foto || `https://picsum.photos/seed/${teacher.id}/200`;

        document.getElementById('carga-modal-title').textContent =
            `Carga Académica — ${teacher.nombres} ${teacher.apellidos}`;

        const cargaBody = document.getElementById('carga-modal-body');
        cargaBody.innerHTML = `
            <div class="flex items-center gap-4" style="margin-bottom:1.25rem;padding-bottom:1rem;
                border-bottom:1px solid #e5e7eb;">
                <img src="${foto}" alt="Foto"
                    style="width:56px;height:56px;border-radius:50%;object-fit:cover;"
                    onerror="this.src='https://picsum.photos/seed/default/200'">
                <div>
                    <div style="font-weight:600;font-size:1rem;">
                        ${teacher.nombres} ${teacher.apellidos}
                    </div>
                    <div style="font-size:0.8rem;color:var(--text-muted);">
                        ${teacher.email} &nbsp;·&nbsp; ${teacher.area}
                    </div>
                    <div style="margin-top:0.25rem;">
                        <span class="badge ${cursosDocente.length === 0 ? '' : 'badge-success'}">
                            ${cursosDocente.length} curso${cursosDocente.length !== 1 ? 's' : ''} asignado${cursosDocente.length !== 1 ? 's' : ''}
                        </span>
                    </div>
                </div>
            </div>

            ${cursosDocente.length === 0
                ? `<p style="text-align:center;color:var(--text-muted);padding:1.5rem 0;">
                       Este docente no tiene cursos asignados actualmente.
                   </p>`
                : `<div style="display:flex;flex-direction:column;gap:0.75rem;">
                    ${cursosDocente.map(c => {
                        const estadoBadge = c.estado === 'Activo'
                            ? '<span class="badge badge-success">Activo</span>'
                            : '<span class="badge badge-warning">Inactivo</span>';

                        const modulosCount  = c.modulos?.length ?? 0;
                        const leccionesCount = c.modulos?.reduce((sum, m) => sum + (m.lecciones?.length ?? 0), 0) ?? 0;

                        const fechaDisplay = c.fecha
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
                                <div style="display:flex;gap:1rem;margin-top:0.6rem;font-size:0.78rem;
                                            color:var(--text-muted);flex-wrap:wrap;">
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

        document.getElementById('carga-modal').classList.add('active');
    }

    function closeCargaModal() {
        document.getElementById('carga-modal').classList.remove('active');
    }

    function openModal(id = null) {
        const modal = document.getElementById('teacher-modal');
        clearErrors();
        document.getElementById('teacher-form').reset();
        document.getElementById('teacher-id').value = '';

        if (id) {
            document.getElementById('modal-title').textContent = 'Editar Docente';
            const teacher = teachers.find(t => t.id === id);
            if (teacher) {
                document.getElementById('teacher-id').value             = teacher.id;
                document.getElementById('teacher-codigo').value         = teacher.codigo;
                document.getElementById('teacher-identificacion').value = teacher.identificacion;
                document.getElementById('teacher-nombres').value        = teacher.nombres;
                document.getElementById('teacher-apellidos').value      = teacher.apellidos;
                document.getElementById('teacher-email').value          = teacher.email;
                document.getElementById('teacher-area').value           = teacher.area;
                document.getElementById('teacher-foto').value           = teacher.foto || '';
            }
        } else {
            document.getElementById('modal-title').textContent = 'Nuevo Docente';
        }

        modal.classList.add('active');
    }

    function closeModal() {
        document.getElementById('teacher-modal').classList.remove('active');
        clearErrors();
    }

    //Validación
    function clearErrors() {
        ['codigo', 'identificacion', 'nombres', 'apellidos', 'email', 'area', 'foto'].forEach(f => {
            const el    = document.getElementById(`err-${f}`);
            const input = document.getElementById(`teacher-${f}`);
            if (el)    { el.textContent = ''; el.classList.add('hidden'); }
            if (input) { input.classList.remove('is-invalid'); }
        });
    }

    function showError(field, msg) {
        const el    = document.getElementById(`err-${field}`);
        const input = document.getElementById(`teacher-${field}`);
        if (el)    { el.textContent = msg; el.classList.remove('hidden'); }
        if (input) { input.classList.add('is-invalid'); }
    }

    function isUniqueField(field, value, excludeId = null) {
        return !getData('lmsTeachers').some(t =>
            t[field]?.toLowerCase() === value.toLowerCase() && t.id !== excludeId
        );
    }

    // ── Guardar docente ────────────────────────────────────────────────────
    function handleSave() {
        clearErrors();

        const id             = document.getElementById('teacher-id').value;
        const codigo         = document.getElementById('teacher-codigo').value.trim();
        const identificacion = document.getElementById('teacher-identificacion').value.trim();
        const nombres        = document.getElementById('teacher-nombres').value.trim();
        const apellidos      = document.getElementById('teacher-apellidos').value.trim();
        const email          = document.getElementById('teacher-email').value.trim().toLowerCase();
        const area           = document.getElementById('teacher-area').value.trim();
        const foto           = document.getElementById('teacher-foto').value.trim();

        let hasError = false;

        if (!codigo) {
            showError('codigo', 'El código es obligatorio.'); hasError = true;
        } else if (!isUniqueField('codigo', codigo, id || null)) {
            showError('codigo', 'Ya existe un docente con ese código.'); hasError = true;
        }

        if (!identificacion) {
            showError('identificacion', 'La identificación es obligatoria.'); hasError = true;
        } else if (!isUniqueField('identificacion', identificacion, id || null)) {
            showError('identificacion', 'Esa identificación ya está registrada.'); hasError = true;
        }

        if (!nombres || nombres.length < 2) {
            showError('nombres', 'Los nombres son obligatorios (mínimo 2 caracteres).'); hasError = true;
        }

        if (!apellidos || apellidos.length < 2) {
            showError('apellidos', 'Los apellidos son obligatorios (mínimo 2 caracteres).'); hasError = true;
        }

        if (!email) {
            showError('email', 'El correo electrónico es obligatorio.'); hasError = true;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showError('email', 'Ingresá un correo válido (ej: nombre@dominio.com).'); hasError = true;
        } else if (!isUniqueField('email', email, id || null)) {
            showError('email', 'Ese correo ya está registrado en otro docente.'); hasError = true;
        }

        if (!area) {
            showError('area', 'El área académica es obligatoria.'); hasError = true;
        }

        if (foto && !/^https?:\/\/.+/.test(foto)) {
            showError('foto', 'La URL de la foto debe comenzar con http:// o https://.'); hasError = true;
        }

        if (hasError) return;

        const teacherData = { codigo, identificacion, nombres, apellidos, email, area, foto };

        if (id) {
            updateItem('lmsTeachers', id, teacherData);
            showToast('Docente actualizado correctamente');
        } else {
            createItem('lmsTeachers', teacherData);
            showToast('Docente creado correctamente');
        }

        teachers = getData('lmsTeachers');
        renderTable();
        closeModal();
    }

    //Eliminar docente 
    function handleDelete(id) {
        const courses         = getData('lmsCourses');
        const assignedCourses = courses.filter(c => c.docenteId === id);

        if (assignedCourses.length > 0) {
            const teacher     = teachers.find(t => t.id === id);
            const nombre      = teacher ? `${teacher.nombres} ${teacher.apellidos}` : 'Este docente';
            const primerCurso = assignedCourses[0].nombre;
            const extra       = assignedCourses.length > 1 ? ` y ${assignedCourses.length - 1} más` : '';
            showToast(
                `No podés eliminar a ${nombre} porque está asignado al curso "${primerCurso}"${extra}. Reasigná o eliminá el curso primero.`,
                'warning',
                5000
            );
            return;
        }

        if (confirm('¿Estás seguro de eliminar este docente? Esta acción no se puede deshacer.')) {
            deleteItem('lmsTeachers', id);
            teachers = getData('lmsTeachers');
            showToast('Docente eliminado', 'danger');
            renderTable();
        }
    }
}