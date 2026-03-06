// courses/form.js
// Formulario de información general del curso (sin módulos/lecciones)

import { createItem, updateItem, getData } from '../../store.js';
import { showToast } from '../../utils/toast.js';
import { renderModules } from './modules.js';

function formatHoras(n) {
    return n === 1 ? '1 hora' : `${n} horas`;
}

function parseHoras(val) {
    if (!val) return '';
    const n = parseInt(val);
    return isNaN(n) ? '' : String(n);
}

function todayStr() {
    return new Date().toISOString().split('T')[0];
}

/**
 * @param {HTMLElement} container
 * @param {Object|null} course    — null = nuevo curso
 * @param {Array}       teachers
 * @param {{ onBack: Function, onSaved: Function }} callbacks
 */
export function renderCourseForm(container, course, teachers, { onBack, onSaved }) {
    container.innerHTML = buildHTML(course, teachers);

    container.querySelector('#btn-back').addEventListener('click', onBack);

    container.querySelector('#btn-save-course').addEventListener('click', () => {
        if (validateForm(container, course)) {
            handleSave();
        }
    });

    const modulesContainer = container.querySelector('#modules-panel');
    if (course) {
        renderModules(modulesContainer, course, () => {
            onSaved(course.id);
        });
    }

    function handleSave() {
        const duracionRaw      = parseInt(container.querySelector('#course-duracion').value);
        const etiquetasRaw     = container.querySelector('#course-etiquetas').value.trim();
        const etiquetasLimpias = etiquetasRaw
            ? etiquetasRaw.split(',').map(t => t.trim()).filter(Boolean).join(', ')
            : '';

        const fechaInput = container.querySelector('#course-fecha').value;
        const fecha      = fechaInput || todayStr();

        const existing = course ? getData('lmsCourses').find(c => c.id === course.id) : null;

        const courseData = {
            codigo:      container.querySelector('#course-codigo').value.trim().toUpperCase(),
            nombre:      container.querySelector('#course-nombre').value.trim(),
            descripcion: container.querySelector('#course-descripcion').value.trim(),
            docenteId:   container.querySelector('#course-docente').value,
            categorias:  container.querySelector('#course-categoria').value.trim(),
            tipo:        container.querySelector('#course-tipo').value,
            duracion:    formatHoras(duracionRaw),
            estado:      container.querySelector('#course-estado').value,
            visibilidad: container.querySelector('#course-visibilidad').value,
            etiquetas:   etiquetasLimpias,
            fecha,
            modulos:     existing?.modulos ?? (course?.modulos ?? []),
        };

        let savedId;
        if (course) {
            updateItem('lmsCourses', course.id, courseData);
            savedId = course.id;
            showToast('Curso actualizado correctamente');
        } else {
            const newCourse = createItem('lmsCourses', courseData);
            savedId = newCourse.id;
            showToast('Curso creado correctamente');
        }

        onSaved(savedId);
    }
}

// ── Validación ─────────────────────────────────────────────────────────────
function validateForm(container, course) {
    clearErrors(container);
    let ok = true;

    const set = (id, msg) => {
        const errEl = container.querySelector(`#err-${id}`);
        const input = container.querySelector(`#course-${id}`);
        if (errEl)  { errEl.textContent = msg; errEl.classList.remove('hidden'); }
        if (input)  { input.classList.add('is-invalid'); }
        ok = false;
    };

    const codigo      = container.querySelector('#course-codigo').value.trim();
    const nombre      = container.querySelector('#course-nombre').value.trim();
    const descripcion = container.querySelector('#course-descripcion').value.trim();
    const docenteId   = container.querySelector('#course-docente').value;
    const categoria   = container.querySelector('#course-categoria').value.trim();
    const tipo        = container.querySelector('#course-tipo').value;
    const duracionVal = container.querySelector('#course-duracion').value;
    const duracion    = parseInt(duracionVal);
    const fechaInput  = container.querySelector('#course-fecha').value;

    if (!codigo) {
        set('codigo', 'El código del curso es obligatorio.');
    } else {
        const exists = getData('lmsCourses').some(c =>
            c.codigo.toUpperCase() === codigo.toUpperCase() && c.id !== (course?.id ?? null)
        );
        if (exists) set('codigo', 'Ya existe un curso con ese código.');
    }

    if (!nombre || nombre.length < 3) {
        set('nombre', 'El nombre del curso es obligatorio (mínimo 3 caracteres).');
    }

    if (!descripcion || descripcion.length < 10) {
        set('descripcion', 'La descripción es obligatoria (mínimo 10 caracteres).');
    }

    if (!docenteId) {
        set('docente', 'Debés asignar un docente al curso.');
    }

    if (!categoria) {
        set('categoria', 'La categoría es obligatoria.');
    }

    if (!tipo) {
        set('tipo', 'Seleccioná el tipo de curso.');
    }

    if (!duracionVal) {
        set('duracion', 'La duración es obligatoria.');
    } else if (isNaN(duracion) || duracion <= 0) {
        set('duracion', 'Ingresá un número entero mayor a 0 (ej: 40).');
    }

    // ✅ Validación de fecha: no puede ser anterior a hoy
    if (fechaInput && fechaInput < todayStr()) {
        set('fecha', 'La fecha de inicio no puede ser anterior a hoy.');
    }

    return ok;
}

function clearErrors(container) {
    container.querySelectorAll('.form-error').forEach(el => {
        el.textContent = '';
        el.classList.add('hidden');
    });
    container.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
}

// ── HTML del formulario ────────────────────────────────────────────────────
function buildHTML(course, teachers) {
    const v = (field) => course ? (course[field] ?? '') : '';

    const teacherOptions = teachers.map(t =>
        `<option value="${t.id}" ${course?.docenteId === t.id ? 'selected' : ''}>
            ${t.nombres} ${t.apellidos}
        </option>`
    ).join('');

    const opt = (val, label, field) =>
        `<option value="${val}" ${v(field) === val ? 'selected' : ''}>${label}</option>`;

    const duracionNum = parseHoras(v('duracion'));

    // Fecha: si existe la cargamos; si no, hoy por defecto
    const fechaValor = v('fecha') || todayStr();
    const hoy        = todayStr();

    return `
        <div class="page-header">
            <div class="flex items-center gap-4">
                <button id="btn-back" class="btn btn-outline" style="padding:0.5rem;" aria-label="Volver">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                        fill="none" stroke="currentColor" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round">
                        <path d="m15 18-6-6 6-6"/>
                    </svg>
                </button>
                <h1 class="page-title">${course ? 'Editar Curso' : 'Nuevo Curso'}</h1>
            </div>
            <button id="btn-save-course" class="btn btn-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round" style="margin-right:6px;">
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                    <polyline points="17 21 17 13 7 13 7 21"/>
                    <polyline points="7 3 7 8 15 8"/>
                </svg>
                Guardar Curso
            </button>
        </div>

        <div class="grid md:grid-cols-3 gap-6">

            <!-- Información General -->
            <div class="md:col-span-2">
                <div class="card mb-6">
                    <h2 style="font-size:1.125rem;font-weight:600;margin-bottom:1.5rem;">
                        Información General
                    </h2>
                    <form id="course-form" novalidate>

                        <div class="grid grid-cols-2 gap-4">
                            <div class="form-group">
                                <label class="form-label">Código del Curso *</label>
                                <input type="text" id="course-codigo" class="form-control"
                                    required maxlength="20" placeholder="Ej: CUR-002"
                                    value="${v('codigo')}">
                                <span class="form-error hidden" id="err-codigo"></span>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Nombre del Curso *</label>
                                <input type="text" id="course-nombre" class="form-control"
                                    required minlength="3" maxlength="120"
                                    value="${v('nombre')}">
                                <span class="form-error hidden" id="err-nombre"></span>
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="form-label">Descripción *</label>
                            <textarea id="course-descripcion" class="form-control"
                                rows="4" required minlength="10" maxlength="1000">${v('descripcion')}</textarea>
                            <span class="form-error hidden" id="err-descripcion"></span>
                        </div>

                        <div class="grid grid-cols-2 gap-4">
                            <div class="form-group">
                                <label class="form-label">Docente Asignado *</label>
                                <select id="course-docente" class="form-control" required>
                                    <option value="">Seleccioná un docente...</option>
                                    ${teacherOptions}
                                </select>
                                <span class="form-error hidden" id="err-docente"></span>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Categoría *</label>
                                <input type="text" id="course-categoria" class="form-control"
                                    required maxlength="60" value="${v('categorias')}">
                                <span class="form-error hidden" id="err-categoria"></span>
                            </div>
                        </div>

                        <div class="grid grid-cols-2 gap-4">
                            <div class="form-group">
                                <label class="form-label">Tipo de Curso *</label>
                                <select id="course-tipo" class="form-control" required>
                                    <option value="">Seleccioná un tipo...</option>
                                    ${opt('Presencial',    'Presencial',    'tipo')}
                                    ${opt('Virtual',       'Virtual',       'tipo')}
                                    ${opt('Semipresencial','Semipresencial','tipo')}
                                </select>
                                <span class="form-error hidden" id="err-tipo"></span>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Duración (horas) *</label>
                                <input type="number" id="course-duracion" class="form-control"
                                    min="1" step="1" placeholder="Ej: 40"
                                    required value="${duracionNum}">
                                <span class="form-error hidden" id="err-duracion"></span>
                            </div>
                        </div>

                        <div class="grid grid-cols-2 gap-4">
                            <div class="form-group">
                                <label class="form-label">Estado</label>
                                <select id="course-estado" class="form-control">
                                    ${opt('Activo',   'Activo',   'estado')}
                                    ${opt('Inactivo', 'Inactivo', 'estado')}
                                </select>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Visibilidad</label>
                                <select id="course-visibilidad" class="form-control">
                                    ${opt('Privado', 'Privado', 'visibilidad')}
                                    ${opt('Publico', 'Público', 'visibilidad')}
                                </select>
                            </div>
                        </div>

                        <!-- Fecha de inicio y Etiquetas -->
                        <div class="grid grid-cols-2 gap-4">
                            <div class="form-group">
                                <label class="form-label">Fecha de Inicio</label>
                                <input type="date" id="course-fecha" class="form-control"
                                    value="${fechaValor}"
                                    min="${hoy}">
                                <span class="form-error hidden" id="err-fecha"></span>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Etiquetas (separadas por coma)</label>
                                <input type="text" id="course-etiquetas" class="form-control"
                                    placeholder="js, web, basico" value="${v('etiquetas')}">
                            </div>
                        </div>

                    </form>
                </div>
            </div>

            <!-- Panel Módulos -->
            <div>
                <div class="card" id="modules-panel">
                    ${!course ? `
                        <h2 style="font-size:1.125rem;font-weight:600;margin-bottom:1rem;">Módulos</h2>
                        <p style="text-align:center;padding:2rem 0;color:var(--text-muted);font-size:0.875rem;">
                            Guardá el curso primero para agregar módulos y lecciones.
                        </p>
                    ` : ''}
                </div>
            </div>

        </div>`;
}