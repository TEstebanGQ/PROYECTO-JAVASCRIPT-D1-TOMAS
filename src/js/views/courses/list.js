// courses/list.js
import { deleteItem, getData, updateItem } from '../../store.js';
import { showToast } from '../../utils/toast.js';

export function renderCourseList(container, courses, teachers, { onNew, onEdit }) {
    container.innerHTML = buildHTML();

    const tbody           = container.querySelector('#courses-table-body');
    const inputText       = container.querySelector('#filter-text');
    const selectStatus    = container.querySelector('#filter-status');
    const selectVisib     = container.querySelector('#filter-visibility');
    const selectTipo      = container.querySelector('#filter-tipo');
    const inputFechaDesde = container.querySelector('#filter-fecha-desde');
    const inputFechaHasta = container.querySelector('#filter-fecha-hasta');

    container.querySelector('#btn-add-course').addEventListener('click', onNew);
    inputText.addEventListener('input', renderRows);
    selectStatus.addEventListener('change', renderRows);
    selectVisib.addEventListener('change', renderRows);
    selectTipo.addEventListener('change', renderRows);
    inputFechaDesde.addEventListener('change', renderRows);
    inputFechaHasta.addEventListener('change', renderRows);

    container.querySelector('#btn-clear-filters').addEventListener('click', () => {
        inputText.value       = '';
        selectStatus.value    = '';
        selectVisib.value     = '';
        selectTipo.value      = '';
        inputFechaDesde.value = '';
        inputFechaHasta.value = '';
        renderRows();
    });

    // ── Modal bloqueo de eliminación ──────────────────────────────────────
    // Se inserta una sola vez en el DOM
    if (!document.getElementById('course-block-modal')) {
        document.body.insertAdjacentHTML('beforeend', buildBlockModalHTML());
    }

    document.getElementById('close-course-block-modal')
        ?.addEventListener('click', closeBlockModal);
    document.getElementById('btn-close-course-block')
        ?.addEventListener('click', closeBlockModal);
    document.getElementById('course-block-modal')
        ?.addEventListener('click', e => {
            if (e.target === e.currentTarget) closeBlockModal();
        });

    // ── Modal confirmación eliminación ─────────────────────────────────────
    if (!document.getElementById('course-confirm-modal')) {
        document.body.insertAdjacentHTML('beforeend', buildConfirmModalHTML());
    }

    document.getElementById('close-course-confirm-modal')
        ?.addEventListener('click', closeConfirmModal);
    document.getElementById('btn-cancel-course-delete')
        ?.addEventListener('click', closeConfirmModal);
    document.getElementById('course-confirm-modal')
        ?.addEventListener('click', e => {
            if (e.target === e.currentTarget) closeConfirmModal();
        });

    document.addEventListener('keydown', e => {
        if (e.key !== 'Escape') return;
        if (document.getElementById('course-block-modal')?.classList.contains('active')) closeBlockModal();
        if (document.getElementById('course-confirm-modal')?.classList.contains('active')) closeConfirmModal();
    });

    renderRows();

    // ── Renderizado de filas ───────────────────────────────────────────────
    function renderRows() {
        const text       = inputText.value.toLowerCase().trim();
        const status     = selectStatus.value;
        const visib      = selectVisib.value;
        const tipo       = selectTipo.value;
        const fechaDesde = inputFechaDesde.value;
        const fechaHasta = inputFechaHasta.value;

        const all = getData('lmsCourses');

        const filtered = all.filter(c => {
            const matchText   = c.nombre.toLowerCase().includes(text) || c.codigo.toLowerCase().includes(text);
            const matchStatus = !status    || c.estado      === status;
            const matchVisib  = !visib     || c.visibilidad === visib;
            const matchTipo   = !tipo      || c.tipo        === tipo;
            const matchDesde  = !fechaDesde || (c.fecha && c.fecha >= fechaDesde);
            const matchHasta  = !fechaHasta || (c.fecha && c.fecha <= fechaHasta);
            return matchText && matchStatus && matchVisib && matchTipo && matchDesde && matchHasta;
        });

        if (filtered.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="8" class="text-center text-muted" style="padding:2rem;">
                        No se encontraron cursos con los filtros aplicados.
                    </td>
                </tr>`;
            return;
        }

        tbody.innerHTML = filtered.map(course => {
            const teacher     = teachers.find(t => t.id === course.docenteId);
            const teacherName = teacher
                ? `${teacher.nombres} ${teacher.apellidos}`
                : '<span style="color:var(--text-muted);font-style:italic;">Sin asignar</span>';

            const statusBadge = course.estado === 'Activo'
                ? '<span class="badge badge-success">Activo</span>'
                : '<span class="badge badge-warning">Inactivo</span>';

            const fechaDisplay = course.fecha
                ? new Date(course.fecha + 'T00:00:00').toLocaleDateString('es-CO', {
                      day: '2-digit', month: '2-digit', year: 'numeric'
                  })
                : '—';

            // Botón eliminar: bloqueado si tiene docente asignado
            const isBlocked = !!course.docenteId;
            const deleteBtn = isBlocked
                ? `<button
                        class="btn btn-sm btn-delete-course"
                        data-id="${course.id}"
                        data-blocked="true"
                        style="opacity:0.45;cursor:not-allowed;background:#9ca3af;
                               border-color:#9ca3af;color:#fff;border:1px solid #9ca3af;
                               border-radius:var(--radius-md);padding:0.25rem 0.5rem;
                               font-size:0.75rem;font-weight:500;                        <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11"
                            viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                            <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                        </svg>
                        Eliminar
                    </button>`
                : `<button
                        class="btn btn-danger btn-sm btn-delete-course"
                        data-id="${course.id}"
                        data-blocked="false">
                        Eliminar
                    </button>`;

            return `
                <tr>
                    <td>${course.codigo}</td>
                    <td>
                        <div style="font-weight:500;">${course.nombre}</div>
                        <div style="font-size:0.75rem;color:var(--text-muted);">
                            ${course.categorias || ''}
                        </div>
                    </td>
                    <td class="col-hide-mobile">${teacherName}</td>
                    <td>${statusBadge}</td>
                    <td class="col-hide-mobile">
                        <span class="badge badge-info">${course.visibilidad}</span>
                    </td>
                    <td class="col-hide-mobile">
                        ${course.tipo
                            ? `<span class="badge" style="background:#f3e8ff;color:#6b21a8;">
                                   ${course.tipo}
                               </span>`
                            : '—'}
                    </td>
                    <td class="col-hide-mobile"
                        style="font-size:0.8rem;color:var(--text-muted);">
                        ${fechaDisplay}
                    </td>
                    <td style="text-align:right;white-space:nowrap;">
                        <button
                            class="btn btn-outline btn-sm btn-edit-course"
                            data-id="${course.id}"
                            style="margin-right:0.5rem;">
                            Editar / Módulos
                        </button>
                        ${deleteBtn}
                    </td>
                </tr>`;
        }).join('');

        tbody.querySelectorAll('.btn-edit-course').forEach(btn =>
            btn.addEventListener('click', e => onEdit(e.currentTarget.dataset.id))
        );
        tbody.querySelectorAll('.btn-delete-course').forEach(btn =>
            btn.addEventListener('click', e => {
                const id        = e.currentTarget.dataset.id;
                const isBlocked = e.currentTarget.dataset.blocked === 'true';
                handleDelete(id, isBlocked);
            })
        );
    }

    // ── Lógica de eliminación ─────────────────────────────────────────────
    function handleDelete(id, isBlocked) {
        const all     = getData('lmsCourses');
        const course  = all.find(c => c.id === id);
        if (!course) return;

        if (isBlocked) {
            const teacher = teachers.find(t => t.id === course.docenteId);
            showBlockModal(course, teacher);
            return;
        }

        showConfirmModal(course);
    }

    function showBlockModal(course, teacher) {
        const teacherName = teacher
            ? `${teacher.nombres} ${teacher.apellidos}`
            : 'un docente';

        document.getElementById('course-block-body').innerHTML = `
            <!-- Info del curso -->
            <div style="display:flex;align-items:flex-start;gap:0.875rem;
                        padding:0.875rem;background:#f9fafb;
                        border-radius:0.5rem;margin-bottom:1.25rem;
                        border:1px solid #e5e7eb;">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                    viewBox="0 0 24 24" fill="none" stroke="#6b7280"
                    stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                    style="flex-shrink:0;margin-top:2px;">
                    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
                </svg>
                <div>
                    <div style="font-weight:600;">${course.nombre}</div>
                    <div style="font-size:0.8rem;color:var(--text-muted);margin-top:0.1rem;">
                        ${course.codigo} &nbsp;·&nbsp; ${course.categorias || 'Sin categoría'}
                        ${course.tipo ? ` &nbsp;·&nbsp; ${course.tipo}` : ''}
                    </div>
                </div>
            </div>

            <!-- Explicación -->
            <p style="font-size:0.9rem;color:#374151;margin-bottom:1rem;">
                Este curso no puede eliminarse porque tiene asignado al docente
                <strong>${teacherName}</strong>.
            </p>

            <!-- Docente bloqueante -->
            ${teacher ? `
            <div style="display:flex;align-items:center;gap:0.75rem;
                        padding:0.75rem;border:1px solid #fde68a;
                        border-radius:0.5rem;background:#fffbeb;margin-bottom:1rem;">
                <img src="${teacher.foto || `https://picsum.photos/seed/${teacher.id}/200`}"
                    alt="Foto"
                    style="width:40px;height:40px;border-radius:50%;object-fit:cover;flex-shrink:0;"
                    onerror="this.src='https://picsum.photos/seed/default/200'">
                <div>
                    <div style="font-weight:600;font-size:0.875rem;">${teacherName}</div>
                    <div style="font-size:0.75rem;color:var(--text-muted);">
                        ${teacher.area} &nbsp;·&nbsp; ${teacher.email}
                    </div>
                </div>
            </div>` : ''}
        `;

        document.getElementById('course-block-modal').classList.add('active');
    }

    function closeBlockModal() {
        document.getElementById('course-block-modal').classList.remove('active');
    }

    function showConfirmModal(course) {
        const modCount = course.modulos?.length ?? 0;
        const lecCount = course.modulos?.reduce((s, m) => s + (m.lecciones?.length ?? 0), 0) ?? 0;

        document.getElementById('course-confirm-body').innerHTML = `
            <div style="display:flex;align-items:flex-start;gap:0.875rem;
                        padding:0.875rem;background:#f9fafb;border-radius:0.5rem;
                        margin-bottom:1rem;border:1px solid #e5e7eb;">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                    viewBox="0 0 24 24" fill="none" stroke="#6b7280"
                    stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                    style="flex-shrink:0;margin-top:2px;">
                    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
                </svg>
                <div>
                    <div style="font-weight:600;">${course.nombre}</div>
                    <div style="font-size:0.8rem;color:var(--text-muted);margin-top:0.1rem;">
                        ${course.codigo}
                        ${modCount > 0 ? ` &nbsp;·&nbsp; ${modCount} módulo${modCount !== 1 ? 's' : ''}` : ''}
                        ${lecCount > 0 ? ` &nbsp;·&nbsp; ${lecCount} lección${lecCount !== 1 ? 'es' : ''}` : ''}
                    </div>
                </div>
            </div>
            <p style="font-size:0.9rem;color:#374151;">
                ¿Estás seguro? Se eliminarán también
                <strong>todos sus módulos y lecciones</strong>.
                Esta acción <strong>no se puede deshacer</strong>.
            </p>
        `;

        // Clonar botón para evitar listeners duplicados
        const btnConfirm = document.getElementById('btn-confirm-course-delete');
        const fresh = btnConfirm.cloneNode(true);
        btnConfirm.replaceWith(fresh);
        fresh.addEventListener('click', () => {
            deleteItem('lmsCourses', course.id);
            showToast('Curso eliminado', 'danger');
            closeConfirmModal();
            renderRows();
        });

        document.getElementById('course-confirm-modal').classList.add('active');
        requestAnimationFrame(() => {
            document.getElementById('btn-cancel-course-delete')?.focus();
        });
    }

    function closeConfirmModal() {
        document.getElementById('course-confirm-modal').classList.remove('active');
    }
}

// ── HTMLs de modales (se inyectan una sola vez en el body) ─────────────────

function buildBlockModalHTML() {
    return `
        <div id="course-block-modal" class="modal-overlay" role="dialog" aria-modal="true">
            <div class="modal-content" style="max-width:480px;">
                <div id="course-block-body" class="modal-body"></div>
                <div class="modal-footer">
                    <button id="btn-close-course-block" class="btn btn-outline">
                        Entendido
                    </button>
                    <butto id="btn-go-edit-course" class="btn btn-primary">
                        Editar curso
                    </button>
                </div>
            </div>
        </div>`;
}

function buildConfirmModalHTML() {
    return `
        <div id="course-confirm-modal" class="modal-overlay" role="dialog" aria-modal="true">
            <div class="modal-content" style="max-width:420px;">
                <div class="modal-header"
                    style="background:linear-gradient(180deg,#fff1f2 0%,#fff 100%);">
                    <h2 class="modal-title" style="color:#991b1b;">
                        🗑️ Confirmar eliminación
                    </h2>
                    <span class="modal-close" id="close-course-confirm-modal">&times;</span>
                </div>
                <div id="course-confirm-body" class="modal-body"></div>
                <div class="modal-footer">
                    <button id="btn-cancel-course-delete" class="btn btn-outline">
                        Cancelar
                    </button>
                    <button id="btn-confirm-course-delete" class="btn btn-danger">
                        Sí, eliminar
                    </button>
                </div>
            </div>
        </div>`;
}

function buildHTML() {
    return `
        <div class="page-header">
            <h1 class="page-title">Gestión de Cursos</h1>
            <button id="btn-add-course" class="btn btn-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round" style="margin-right:8px;">
                    <path d="M5 12h14"/><path d="M12 5v14"/>
                </svg>
                Nuevo Curso
            </button>
        </div>

        <!-- Filtros -->
        <div class="card mb-6" style="padding:1rem;">
            <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div class="form-group" style="margin-bottom:0;">
                    <input type="text" id="filter-text" class="form-control"
                        placeholder="Buscar por nombre o código...">
                </div>
                <div class="form-group" style="margin-bottom:0;">
                    <select id="filter-status" class="form-control">
                        <option value="">Todos los estados</option>
                        <option value="Activo">Activo</option>
                        <option value="Inactivo">Inactivo</option>
                    </select>
                </div>
                <div class="form-group" style="margin-bottom:0;">
                    <select id="filter-visibility" class="form-control">
                        <option value="">Toda visibilidad</option>
                        <option value="Publico">Público</option>
                        <option value="Privado">Privado</option>
                    </select>
                </div>
                <div class="form-group" style="margin-bottom:0;">
                    <select id="filter-tipo" class="form-control">
                        <option value="">Todos los tipos</option>
                        <option value="Presencial">Presencial</option>
                        <option value="Virtual">Virtual</option>
                        <option value="Semipresencial">Semipresencial</option>
                    </select>
                </div>
                <div class="form-group" style="margin-bottom:0;">
                    <input type="date" id="filter-fecha-desde" class="form-control"
                        title="Fecha desde">
                </div>
                <div class="form-group" style="margin-bottom:0;">
                    <input type="date" id="filter-fecha-hasta" class="form-control"
                        title="Fecha hasta">
                </div>
            </div>
            <div style="margin-top:0.75rem;text-align:right;">
                <button id="btn-clear-filters" class="btn btn-outline btn-sm">
                    Limpiar filtros
                </button>
            </div>
        </div>

        <!-- Tabla -->
        <div class="table-container">
            <table class="table">
                <thead>
                    <tr>
                        <th>Código</th>
                        <th>Curso</th>
                        <th class="col-hide-mobile">Docente</th>
                        <th>Estado</th>
                        <th class="col-hide-mobile">Visibilidad</th>
                        <th class="col-hide-mobile">Tipo</th>
                        <th class="col-hide-mobile">Fecha</th>
                        <th style="text-align:right;">Acciones</th>
                    </tr>
                </thead>
                <tbody id="courses-table-body"></tbody>
            </table>
        </div>`;
}