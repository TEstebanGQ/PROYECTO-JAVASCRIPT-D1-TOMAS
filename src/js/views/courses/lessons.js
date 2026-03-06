import { updateItem, getData } from '../../store.js';
import { openModal, closeModal, setupModalClose } from '../../utils/modal.js';
import { showToast } from '../../utils/toast.js';

/**
 * Formatea un número de horas con singular/plural
 * @param {number} n
 * @returns {string}
 */
function formatHoras(n) {
    return n === 1 ? '1 hora' : `${n} horas`;
}

/**
 * Extrae el número de un string tipo "2 horas" → 2
 * @param {string} val
 * @returns {number}
 */
function parseHoras(val) {
    if (!val) return 1;
    const n = parseInt(val);
    return isNaN(n) || n < 1 ? 1 : n;
}

/**
 * @param {HTMLElement} container  — .lessons-container del módulo
 * @param {Object}      course     — curso actual
 * @param {number}      mIdx       — índice del módulo
 * @param {Function}    onUpdate   — callback tras guardar/eliminar
 */
export function renderLessons(container, course, mIdx, onUpdate) {
    const fresh     = getData('lmsCourses').find(c => c.id === course.id) || course;
    const modulo    = fresh.modulos[mIdx];
    const lecciones = modulo?.lecciones || [];

    container.innerHTML = buildLessonsHTML(lecciones, mIdx);

    container.querySelector('.btn-add-lesson')?.addEventListener('click', () => {
        resetLessonForm();
        document.querySelector('#lesson-mindex').value = mIdx;
        document.querySelector('#lesson-lindex').value = '';
        document.querySelector('#lesson-modal-title').textContent = 'Nueva Lección';
        openModal('lesson-modal');
    });

    container.querySelectorAll('.btn-edit-lesson').forEach(btn => {
        btn.addEventListener('click', e => {
            const lIdx = Number(e.currentTarget.dataset.lindex);
            const lec  = lecciones[lIdx];

            document.querySelector('#lesson-mindex').value      = mIdx;
            document.querySelector('#lesson-lindex').value      = lIdx;
            document.querySelector('#lesson-titulo').value      = lec.titulo;
            document.querySelector('#lesson-intensidad').value  = parseHoras(lec.intensidad);
            document.querySelector('#lesson-contenido').value   = lec.contenido;
            document.querySelector('#lesson-multimedia').value  = lec.multimedia || '';

            document.querySelector('#lesson-modal-title').textContent = 'Editar Lección';
            openModal('lesson-modal');
        });
    });

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

    if (!document.querySelector('#lesson-modal')) {
        document.body.insertAdjacentHTML('beforeend', buildLessonModalHTML());
    }

    setupLessonSave(course, onUpdate);
    setupModalClose('lesson-modal');
}

function setupLessonSave(course, onUpdate) {
    const btn = document.querySelector('#btn-save-lesson');
    if (!btn) return;

    const fresh = btn.cloneNode(true);
    btn.replaceWith(fresh);

    fresh.addEventListener('click', () => {
        clearLessonErrors();

        const titulo      = document.querySelector('#lesson-titulo').value.trim();
        const intensidadV = document.querySelector('#lesson-intensidad').value;
        const contenido   = document.querySelector('#lesson-contenido').value.trim();
        const multimedia  = document.querySelector('#lesson-multimedia').value.trim();

        let ok = true;

        if (!titulo || titulo.length < 3) {
            showLessonError('titulo', 'El título es obligatorio (mínimo 3 caracteres).'); ok = false;
        }

        const intensidadNum = parseInt(intensidadV);
        if (!intensidadV) {
            showLessonError('intensidad', 'La intensidad horaria es obligatoria.'); ok = false;
        } else if (isNaN(intensidadNum) || intensidadNum <= 0) {
            showLessonError('intensidad', 'Ingresá un número entero positivo (ej: 2).'); ok = false;
        }

        if (!contenido || contenido.length < 5) {
            showLessonError('contenido', 'El contenido es obligatorio (mínimo 5 caracteres).'); ok = false;
        }

        if (multimedia && !/^https?:\/\/.+/.test(multimedia)) {
            showLessonError('multimedia', 'La URL debe comenzar con https://'); ok = false;
        }

        if (!ok) return;

        const mIdx   = Number(document.querySelector('#lesson-mindex').value);
        const lIdxV  = document.querySelector('#lesson-lindex').value;
        const isEdit = lIdxV !== '';
        const lIdx   = Number(lIdxV);

        const updated = getData('lmsCourses').find(c => c.id === course.id);
        updated.modulos[mIdx].lecciones = updated.modulos[mIdx].lecciones || [];

        const lecData = {
            id: isEdit
                ? updated.modulos[mIdx].lecciones[lIdx].id
                : (typeof crypto?.randomUUID === 'function' ? crypto.randomUUID() : Date.now().toString()),
            titulo,
            intensidad: formatHoras(intensidadNum),
            contenido,
            multimedia,
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

function clearLessonErrors() {
    ['titulo', 'intensidad', 'contenido', 'multimedia'].forEach(f => {
        const el    = document.querySelector(`#err-lesson-${f}`);
        const input = document.querySelector(`#lesson-${f}`);
        if (el)    { el.textContent = ''; el.classList.add('hidden'); }
        if (input) { input.classList.remove('is-invalid'); }
    });
}

function showLessonError(field, msg) {
    const el    = document.querySelector(`#err-lesson-${field}`);
    const input = document.querySelector(`#lesson-${field}`);
    if (el)    { el.textContent = msg; el.classList.remove('hidden'); }
    if (input) { input.classList.add('is-invalid'); }
}

function resetLessonForm() {
    document.querySelector('#lesson-form')?.reset();
    clearLessonErrors();
}

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
            <div class="flex gap-2" style="align-items:center;">
                <span style="font-size:0.7rem;color:var(--text-muted);">${lec.intensidad || ''}</span>
                <button class="btn-edit-lesson"
                    data-mindex="${mIdx}" data-lindex="${lIndex}"
                    style="color:var(--info);" title="Editar lección">✎</button>
                <button class="btn-delete-lesson"
                    data-mindex="${mIdx}" data-lindex="${lIndex}"
                    style="color:var(--danger);" title="Eliminar lección">×</button>
            </div>
        </li>`;
}

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
                            <input type="text" id="lesson-titulo" class="form-control"
                                required minlength="3" maxlength="150">
                            <span class="form-error hidden" id="err-lesson-titulo"></span>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Intensidad Horaria * (horas)</label>
                            <input type="number" id="lesson-intensidad" class="form-control"
                                min="1" step="1" placeholder="Ej: 2" required>
                            <span class="form-error hidden" id="err-lesson-intensidad"></span>
                            <small style="color:var(--text-muted);font-size:0.75rem;">
                                Ingresá solo el número. Se guardará como "1 hora" o "N horas".
                            </small>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Contenido *</label>
                            <textarea id="lesson-contenido" class="form-control"
                                rows="4" required minlength="5"></textarea>
                            <span class="form-error hidden" id="err-lesson-contenido"></span>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Multimedia (URL — video, PDF o imagen)</label>
                            <input type="url" id="lesson-multimedia" class="form-control"
                                placeholder="https://...">
                            <span class="form-error hidden" id="err-lesson-multimedia"></span>
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