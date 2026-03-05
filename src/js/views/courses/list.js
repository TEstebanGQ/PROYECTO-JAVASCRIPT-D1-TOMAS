// courses/list.js
// Tabla de cursos + filtros (texto, estado, visibilidad, tipo, fecha desde/hasta)

import { deleteItem, getData } from '../../store.js';
import { showToast } from '../../utils/toast.js';

/**
 * @param {HTMLElement} container
 * @param {Array}  courses
 * @param {Array}  teachers
 * @param {{ onNew: Function, onEdit: Function }} callbacks
 */
export function renderCourseList(container, courses, teachers, { onNew, onEdit }) {
    container.innerHTML = buildHTML();

    const tbody          = container.querySelector('#courses-table-body');
    const inputText      = container.querySelector('#filter-text');
    const selectStatus   = container.querySelector('#filter-status');
    const selectVisib    = container.querySelector('#filter-visibility');
    const selectTipo     = container.querySelector('#filter-tipo');
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
        inputText.value        = '';
        selectStatus.value     = '';
        selectVisib.value      = '';
        selectTipo.value       = '';
        inputFechaDesde.value  = '';
        inputFechaHasta.value  = '';
        renderRows();
    });

    renderRows();

    function renderRows() {
        const text      = inputText.value.toLowerCase().trim();
        const status    = selectStatus.value;
        const visib     = selectVisib.value;
        const tipo      = selectTipo.value;
        const fechaDesde = inputFechaDesde.value;  // 'YYYY-MM-DD' o ''
        const fechaHasta = inputFechaHasta.value;

        const all = getData('lmsCourses');

        const filtered = all.filter(c => {
            const matchText   = c.nombre.toLowerCase().includes(text)
                             || c.codigo.toLowerCase().includes(text);
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
                    <td colspan="7" class="text-center text-muted" style="padding: 2rem;">
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

            return `
                <tr>
                    <td>${course.codigo}</td>
                    <td>
                        <div style="font-weight:500;">${course.nombre}</div>
                        <div style="font-size:0.75rem;color:var(--text-muted);">${course.categorias || ''}</div>
                    </td>
                    <td class="col-hide-mobile">${teacherName}</td>
                    <td>${statusBadge}</td>
                    <td class="col-hide-mobile">
                        <span class="badge badge-info">${course.visibilidad}</span>
                    </td>
                    <td class="col-hide-mobile">
                        ${course.tipo ? `<span class="badge" style="background:#f3e8ff;color:#6b21a8;">${course.tipo}</span>` : '—'}
                    </td>
                    <td class="col-hide-mobile" style="font-size:0.8rem;color:var(--text-muted);">
                        ${fechaDisplay}
                    </td>
                    <td style="text-align:right;white-space:nowrap;">
                        <button
                            class="btn btn-outline btn-sm btn-edit-course"
                            data-id="${course.id}"
                            style="margin-right:0.5rem;">
                            Editar / Módulos
                        </button>
                        <button
                            class="btn btn-danger btn-sm btn-delete-course"
                            data-id="${course.id}">
                            Eliminar
                        </button>
                    </td>
                </tr>`;
        }).join('');

        tbody.querySelectorAll('.btn-edit-course').forEach(btn =>
            btn.addEventListener('click', e => onEdit(e.currentTarget.dataset.id))
        );
        tbody.querySelectorAll('.btn-delete-course').forEach(btn =>
            btn.addEventListener('click', e => handleDelete(e.currentTarget.dataset.id))
        );
    }

    function handleDelete(id) {
        if (!confirm('¿Estás seguro de eliminar este curso? Se eliminarán también todos sus módulos y lecciones.')) return;
        deleteItem('lmsCourses', id);
        showToast('Curso eliminado', 'danger');
        renderRows();
    }
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
                    <input type="text" id="filter-text"
                        class="form-control" placeholder="Buscar por nombre o código...">
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