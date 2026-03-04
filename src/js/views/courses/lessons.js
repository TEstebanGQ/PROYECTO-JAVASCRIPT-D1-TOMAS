// courses/lessons.js
// Gestión de lecciones dentro de un módulo

import { updateItem, getData } from '../../store.js';
import { openModal, closeModal, setupModalClose } from '../../utils/modal.js';
import { showToast } from '../../utils/toast.js';

/**
 * @param {HTMLElement} container  — .lessons-container del módulo
 * @param {Object}      course     — curso actual
 * @param {number}      mIdx       — índice del módulo
 * @param {Function}    onUpdate   — callback tras guardar/eliminar
 */
export function renderLessons(container, course, mIdx, onUpdate) {
    const fresh   = getData('lmsCourses').find(c => c.id === course.id) || course;
    const modulo  = fresh.modulos[mIdx];
    const lecciones = modulo?.lecciones || [];

    container.innerHTML = buildLessonsHTML(lecciones, mIdx);

    // ── Añadir lección ────────────────────────────────────────────────────
    container.querySelector('.btn-add-lesson')?.addEventListener('click', () => {
        resetLessonForm();
        document.querySelector('#lesson-mindex').value = mIdx;
        document.querySelector('#lesson-lindex').value = '';
        document.querySelector('#lesson-modal-title').textContent = 'Nueva Lección';
        openModal('lesson-modal');
    });

    // ── Editar lección ────────────────────────────────────────────────────
    container.querySelectorAll('.btn-edit-lesson').forEach(btn => {
        btn.addEventListener('click', e => {
            const lIdx = Number(e.currentTarget.dataset.lindex);
            const lec  = lecciones[lIdx];

            document.querySelector('#lesson-mindex').value    = mIdx;
            document.querySelector('#lesson-lindex').value    = lIdx;
            document.querySelector('#lesson-titulo').value    = lec.titulo;
            document.querySelector('#lesson-intensidad').value = lec.intensidad;
            document.querySelector('#lesson-contenido').value = lec.contenido;
            document.querySelector('#lesson-multimedia').value = lec.multimedia || '';

            document.querySelector('#lesson-modal-title').textContent = 'Editar Lección';
            openModal('lesson-modal');
        });
    });

    // ── Eliminar lección ──────────────────────────────────────────────────
    container.querySelectorAll('.btn-delete-lesson').forEach(btn => {
        btn.addEventListener('click', e => {
            if (!confirm('¿Eliminar esta lección?')) return;
            const lIdx   = Number(e.currentTarget.dataset.lindex);
            const updated = getData('lmsCourses').find(c => c.id === course.id);
            updated.modulos[mIdx].lecciones.splice(lIdx, 1);
            updateItem('lmsCourses', course.id, updated);
            showToast('Lección eliminada', 'danger');
            onUpdate();
        });
    });

    // ── Modal de lección (solo lo monta la primera vez que no existe) ─────
    if (!document.querySelector('#lesson-modal')) {
        document.body.insertAdjacentHTML('beforeend', buildLessonModalHTML());
    }

    setupLessonSave(course, onUpdate);
    setupModalClose('lesson-modal');
}

// ── Guardar lección ────────────────────────────────────────────────────────
function setupLessonSave(course, onUpdate) {
    const btn = document.querySelector('#btn-save-lesson');
    if (!btn) return;

    const fresh = btn.cloneNode(true);
    btn.replaceWith(fresh);

    fresh.addEventListener('click', () => {
        const form = document.querySelector('#lesson-form');
        if (!form.checkValidity()) { form.reportValidity(); return; }

        const mIdx   = Number(document.querySelector('#lesson-mindex').value);
        const lIdxV  = document.querySelector('#lesson-lindex').value;
        const isEdit = lIdxV !== '';
        const lIdx   = Number(lIdxV);

        const updated = getData('lmsCourses').find(c => c.id === course.id);
        updated.modulos[mIdx].lecciones = updated.modulos[mIdx].lecciones || [];

        const lecData = {
            id: isEdit
                ? updated.modulos[mIdx].lecciones[lIdx].id
                : Date.now().toString(),
            titulo:     document.querySelector('#lesson-titulo').value.trim(),
            intensidad: document.querySelector('#lesson-intensidad').value.trim(),
            contenido:  document.querySelector('#lesson-contenido').value.trim(),
            multimedia: document.querySelector('#lesson-multimedia').value.trim(),
        };

        if (isEdit) {
            updated.modulos[mIdx].lecciones[lIdx] = lecData;
        } else {
            updated.modulos[mIdx].lecciones.push(lecData);
        }

        updateItem('lmsCourses', course.id, updated);
        closeModal('lesson-modal');
        showToast(isEdit ? 'Lección actualizada' : 'Lección creada');
        onUpdate();
    });
}

function resetLessonForm() {
    document.querySelector('#lesson-form')?.reset();
}

// ── HTML lista de lecciones ────────────────────────────────────────────────
function buildLessonsHTML(lecciones, mIdx) {
    return `
        <div style="padding-top:0.5rem;border-top:1px dashed var(--border-color);">
            <div class="flex justify-between items-center mb-2">
                <span style="font-size:0.7rem;color:var(--text-muted);font-weight:600;
                             text-transform:uppercase;letter-spacing:0.05em;">
                    Lecciones
                </span>
                <button class="btn-add-lesson"
                    style="font-size:0.75rem;color:var(--primary);font-weight:600;cursor:pointer;">
                    + Añadir
                </button>
            </div>

            ${lecciones.length === 0
                ? '<p style="font-size:0.75rem;color:var(--text-muted);">Sin lecciones aún.</p>'
                : `<ul style="display:flex;flex-direction:column;gap:0.25rem;">
                    ${lecciones.map((lec, lIndex) => buildLessonItem(lec, mIdx, lIndex)).join('')}
                  </ul>`
            }
        </div>`;
}

function buildLessonItem(lec, mIdx, lIndex) {
    return `
        <li class="lesson-item">
            <span style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:150px;"
                  title="${lec.titulo}">
                ${lec.titulo}
            </span>
            <div class="flex gap-2">
                <button class="btn-edit-lesson"
                    data-mindex="${mIdx}" data-lindex="${lIndex}"
                    style="color:var(--info);" title="Editar lección">✎</button>
                <button class="btn-delete-lesson"
                    data-mindex="${mIdx}" data-lindex="${lIndex}"
                    style="color:var(--danger);" title="Eliminar lección">×</button>
            </div>
        </li>`;
}

// ── HTML modal de lección ──────────────────────────────────────────────────
function buildLessonModalHTML() {
    return `
        <div id="lesson-modal" class="modal-overlay">
            <div class="modal-content">
                <div class="modal-header">
                    <h2 id="lesson-modal-title" class="modal-title">Lección</h2>
                    <span class="modal-close">&times;</span>
                </div>
                <div class="modal-body">
                    <form id="lesson-form" novalidate>
                        <input type="hidden" id="lesson-mindex">
                        <input type="hidden" id="lesson-lindex">
                        <div class="form-group">
                            <label class="form-label">Título *</label>
                            <input type="text" id="lesson-titulo" class="form-control" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Intensidad Horaria *</label>
                            <input type="text" id="lesson-intensidad" class="form-control"
                                placeholder="Ej: 2 horas" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Contenido *</label>
                            <textarea id="lesson-contenido" class="form-control"
                                rows="4" required></textarea>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Multimedia (URL)</label>
                            <input type="url" id="lesson-multimedia" class="form-control"
                                placeholder="https://...">
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-outline modal-cancel">Cancelar</button>
                    <button id="btn-save-lesson" class="btn btn-primary">Guardar Lección</button>
                </div>
            </div>
        </div>`;
}