// courses/modules.js
// Gestión de módulos dentro de un curso existente

import { updateItem, getData } from '../../store.js';
import { openModal, closeModal, setupModalClose } from '../../utils/modal.js';
import { showToast } from '../../utils/toast.js';
import { renderLessons } from './lessons.js';

/**
 * @param {HTMLElement} container  — el #modules-panel del form
 * @param {Object}      course     — curso actual (con .modulos)
 * @param {Function}    onUpdate   — callback tras guardar/eliminar
 */
export function renderModules(container, course, onUpdate) {
    // Siempre lee modulos frescos del store
    const fresh = getData('lmsCourses').find(c => c.id === course.id) || course;
    const modulos = fresh.modulos || [];

    container.innerHTML = buildPanelHTML(modulos);

    // ── Abrir modal para nuevo módulo ─────────────────────────────────────
    container.querySelector('#btn-add-module')?.addEventListener('click', () => {
        resetModuleForm(container);
        document.querySelector('#module-modal-title').textContent = 'Nuevo Módulo';
        openModal('module-modal');
    });

    // ── Editar módulo ─────────────────────────────────────────────────────
    container.querySelectorAll('.btn-edit-module').forEach(btn => {
        btn.addEventListener('click', e => {
            const idx = Number(e.currentTarget.dataset.index);
            const mod = modulos[idx];
            document.querySelector('#module-index').value        = idx;
            document.querySelector('#module-codigo').value       = mod.codigo;
            document.querySelector('#module-nombre').value       = mod.nombre;
            document.querySelector('#module-descripcion').value  = mod.descripcion || '';
            document.querySelector('#module-modal-title').textContent = 'Editar Módulo';
            openModal('module-modal');
        });
    });

    // ── Eliminar módulo ───────────────────────────────────────────────────
    container.querySelectorAll('.btn-delete-module').forEach(btn => {
        btn.addEventListener('click', e => {
            if (!confirm('¿Eliminar este módulo y todas sus lecciones?')) return;
            const idx = Number(e.currentTarget.dataset.index);
            const updated = getData('lmsCourses').find(c => c.id === course.id);
            updated.modulos.splice(idx, 1);
            updateItem('lmsCourses', course.id, updated);
            showToast('Módulo eliminado', 'danger');
            onUpdate();
        });
    });

    // ── Renderizar lecciones de cada módulo ───────────────────────────────
    container.querySelectorAll('.lessons-container').forEach(el => {
        const mIdx = Number(el.dataset.mindex);
        renderLessons(el, course, mIdx, onUpdate);
    });

    // ── Guardar módulo (nuevo o edición) ──────────────────────────────────
    setupModuleSave(course, onUpdate);
    setupModalClose('module-modal');
}

// ── Guardar módulo ─────────────────────────────────────────────────────────
function setupModuleSave(course, onUpdate) {
    const btnSave = document.querySelector('#btn-save-module');
    if (!btnSave) return;

    // Clonar para evitar listeners duplicados
    const fresh = btnSave.cloneNode(true);
    btnSave.replaceWith(fresh);

    fresh.addEventListener('click', () => {
        const form = document.querySelector('#module-form');
        if (!form.checkValidity()) { form.reportValidity(); return; }

        const idxVal   = document.querySelector('#module-index').value;
        const isEdit   = idxVal !== '';
        const idx      = Number(idxVal);
        const updated  = getData('lmsCourses').find(c => c.id === course.id);

        const modData = {
            id:          isEdit ? updated.modulos[idx].id : Date.now().toString(),
            codigo:      document.querySelector('#module-codigo').value.trim(),
            nombre:      document.querySelector('#module-nombre').value.trim(),
            descripcion: document.querySelector('#module-descripcion').value.trim(),
            lecciones:   isEdit ? updated.modulos[idx].lecciones : [],
        };

        if (isEdit) {
            updated.modulos[idx] = modData;
        } else {
            updated.modulos = updated.modulos || [];
            updated.modulos.push(modData);
        }

        updateItem('lmsCourses', course.id, updated);
        closeModal('module-modal');
        showToast(isEdit ? 'Módulo actualizado' : 'Módulo creado');
        onUpdate();
    });
}

function resetModuleForm(container) {
    document.querySelector('#module-form')?.reset();
    document.querySelector('#module-index').value = '';
}

// ── HTML del panel de módulos ──────────────────────────────────────────────
function buildPanelHTML(modulos) {
    return `
        <div class="flex justify-between items-center mb-4">
            <h2 style="font-size:1.125rem;font-weight:600;">Módulos</h2>
            <button id="btn-add-module" class="btn btn-primary btn-sm">+ Agregar</button>
        </div>

        <div id="modules-list" style="display:flex;flex-direction:column;gap:0.75rem;">
            ${modulos.length === 0
                ? '<p style="color:var(--text-muted);font-size:0.875rem;text-align:center;padding:1rem 0;">No hay módulos creados.</p>'
                : modulos.map((mod, mIndex) => buildModuleCard(mod, mIndex)).join('')
            }
        </div>

        <!-- Modal Módulo -->
        <div id="module-modal" class="modal-overlay">
            <div class="modal-content">
                <div class="modal-header">
                    <h2 id="module-modal-title" class="modal-title">Módulo</h2>
                    <span class="modal-close">&times;</span>
                </div>
                <div class="modal-body">
                    <form id="module-form" novalidate>
                        <input type="hidden" id="module-index">
                        <div class="form-group">
                            <label class="form-label">Código *</label>
                            <input type="text" id="module-codigo" class="form-control" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Nombre *</label>
                            <input type="text" id="module-nombre" class="form-control" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Descripción</label>
                            <textarea id="module-descripcion" class="form-control" rows="3"></textarea>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-outline modal-cancel">Cancelar</button>
                    <button id="btn-save-module" class="btn btn-primary">Guardar Módulo</button>
                </div>
            </div>
        </div>`;
}

function buildModuleCard(mod, mIndex) {
    return `
        <div class="module-card">
            <div class="flex justify-between items-start mb-2">
                <div style="font-weight:500;font-size:0.875rem;">
                    ${mod.codigo} — ${mod.nombre}
                </div>
                <div class="flex gap-2">
                    <button class="btn-edit-module" data-index="${mIndex}"
                        style="color:var(--info);" title="Editar módulo">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                            fill="none" stroke="currentColor" stroke-width="2"
                            stroke-linecap="round" stroke-linejoin="round">
                            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
                        </svg>
                    </button>
                    <button class="btn-delete-module" data-index="${mIndex}"
                        style="color:var(--danger);" title="Eliminar módulo">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                            fill="none" stroke="currentColor" stroke-width="2"
                            stroke-linecap="round" stroke-linejoin="round">
                            <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                        </svg>
                    </button>
                </div>
            </div>
            <!-- Lecciones del módulo -->
            <div class="lessons-container" data-mindex="${mIndex}"></div>
        </div>`;
}