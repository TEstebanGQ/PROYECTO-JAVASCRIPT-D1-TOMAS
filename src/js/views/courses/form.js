// courses/form.js
// Formulario de información general del curso (sin módulos/lecciones)

import { createItem, updateItem } from '../../store.js';
import { showToast } from '../../utils/toast.js';
import { renderModules } from './modules.js';

/**
 * @param {HTMLElement} container
 * @param {Object|null} course    — null = nuevo curso
 * @param {Array}       teachers
 * @param {{ onBack: Function, onSaved: Function }} callbacks
 */
export function renderCourseForm(container, course, teachers, { onBack, onSaved }) {
    container.innerHTML = buildHTML(course, teachers);

    // ── Botón volver ──────────────────────────────────────────────────────
    container.querySelector('#btn-back').addEventListener('click', onBack);

    // ── Guardar curso ─────────────────────────────────────────────────────
    container.querySelector('#btn-save-course').addEventListener('click', () => {
        const form = container.querySelector('#course-form');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }
        handleSave();
    });

    // ── Renderizar panel de módulos (solo si el curso ya existe) ──────────
    const modulesContainer = container.querySelector('#modules-panel');
    if (course) {
        renderModules(modulesContainer, course, () => {
            // Callback: se llama tras guardar/eliminar un módulo o lección
            // Recarga el form con datos frescos
            onSaved(course.id);
        });
    }

    // ── Guardar ───────────────────────────────────────────────────────────
    function handleSave() {
        const courseData = {
            codigo:      container.querySelector('#course-codigo').value.trim(),
            nombre:      container.querySelector('#course-nombre').value.trim(),
            descripcion: container.querySelector('#course-descripcion').value.trim(),
            docenteId:   container.querySelector('#course-docente').value,
            categorias:  container.querySelector('#course-categoria').value.trim(),
            duracion:    container.querySelector('#course-duracion').value.trim(),
            estado:      container.querySelector('#course-estado').value,
            visibilidad: container.querySelector('#course-visibilidad').value,
            etiquetas:   container.querySelector('#course-etiquetas').value.trim(),
            fecha:       course ? course.fecha : new Date().toISOString().split('T')[0],
            modulos:     course ? course.modulos : [],
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

// ── HTML del formulario ────────────────────────────────────────────────────
function buildHTML(course, teachers) {
    const v = (field) => course ? course[field] ?? '' : '';

    const teacherOptions = teachers.map(t =>
        `<option value="${t.id}" ${course?.docenteId === t.id ? 'selected' : ''}>
            ${t.nombres} ${t.apellidos}
        </option>`
    ).join('');

    const opt = (val, label, field) =>
        `<option value="${val}" ${v(field) === val ? 'selected' : ''}>${label}</option>`;

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
                                    required value="${v('codigo')}">
                            </div>
                            <div class="form-group">
                                <label class="form-label">Nombre del Curso *</label>
                                <input type="text" id="course-nombre" class="form-control"
                                    required value="${v('nombre')}">
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="form-label">Descripción *</label>
                            <textarea id="course-descripcion" class="form-control"
                                rows="4" required>${v('descripcion')}</textarea>
                        </div>

                        <div class="grid grid-cols-2 gap-4">
                            <div class="form-group">
                                <label class="form-label">Docente Asignado *</label>
                                <select id="course-docente" class="form-control" required>
                                    <option value="">Seleccione un docente...</option>
                                    ${teacherOptions}
                                </select>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Categoría *</label>
                                <input type="text" id="course-categoria" class="form-control"
                                    required value="${v('categorias')}">
                            </div>
                        </div>

                        <div class="grid grid-cols-3 gap-4">
                            <div class="form-group">
                                <label class="form-label">Duración *</label>
                                <input type="text" id="course-duracion" class="form-control"
                                    placeholder="Ej: 40 horas" required value="${v('duracion')}">
                            </div>
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

                        <div class="form-group">
                            <label class="form-label">Etiquetas (separadas por coma)</label>
                            <input type="text" id="course-etiquetas" class="form-control"
                                placeholder="js, web, basico" value="${v('etiquetas')}">
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
                            Guarda el curso primero para agregar módulos y lecciones.
                        </p>
                    ` : ''}
                </div>
            </div>

        </div>`;
}