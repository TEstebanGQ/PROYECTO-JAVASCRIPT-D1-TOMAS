import { getData, createItem, updateItem, deleteItem } from '../store.js';
import { hashPassword } from '../utils/hash.js';
import { showToast } from '../utils/toast.js';

export function renderAdmins(container) {
    let admins = getData('lmsAdmins');

    const html = `
        <div class="page-header">
            <h1 class="page-title">Gestión de Administrativos</h1>
            <button id="btn-add-admin" class="btn btn-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round" style="margin-right: 8px;">
                    <path d="M5 12h14"/><path d="M12 5v14"/>
                </svg>
                Nuevo Administrativo
            </button>
        </div>

        <div class="table-container">
            <table class="table">
                <thead>
                    <tr>
                        <th>Nombre Completo</th>
                        <th class="col-hide-mobile">Identificación</th>
                        <th>Correo Electrónico</th>
                        <th class="col-hide-mobile">Teléfono</th>
                        <th>Cargo</th>
                        <th style="text-align: right;">Acciones</th>
                    </tr>
                </thead>
                <tbody id="admins-table-body"></tbody>
            </table>
        </div>

        <!-- Modal Formulario -->
        <div id="admin-modal" class="modal-overlay">
            <div class="modal-content">
                <div class="modal-header">
                    <h2 id="modal-title" class="modal-title">Nuevo Administrativo</h2>
                    <span class="modal-close" id="close-modal">&times;</span>
                </div>
                <div class="modal-body">
                    <form id="admin-form" novalidate>
                        <input type="hidden" id="admin-id">
                        <div class="form-group">
                            <label class="form-label">Identificación *</label>
                            <input type="text" id="admin-identificacion" class="form-control"
                                required maxlength="20" placeholder="Ej: 1234567890">
                            <span class="form-error hidden" id="err-identificacion"></span>
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div class="form-group">
                                <label class="form-label">Nombres *</label>
                                <input type="text" id="admin-nombres" class="form-control"
                                    required minlength="2" maxlength="80">
                                <span class="form-error hidden" id="err-nombres"></span>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Apellidos *</label>
                                <input type="text" id="admin-apellidos" class="form-control"
                                    required minlength="2" maxlength="80">
                                <span class="form-error hidden" id="err-apellidos"></span>
                            </div>
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div class="form-group">
                                <label class="form-label">Correo Electrónico *</label>
                                <input type="email" id="admin-email" class="form-control" required>
                                <span class="form-error hidden" id="err-email"></span>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Teléfono *</label>
                                <input type="tel" id="admin-telefono" class="form-control"
                                    required maxlength="15" placeholder="Ej: 3001234567">
                                <span class="form-error hidden" id="err-telefono"></span>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Cargo *</label>
                            <input type="text" id="admin-cargo" class="form-control"
                                required maxlength="60">
                            <span class="form-error hidden" id="err-cargo"></span>
                        </div>
                        <div class="form-group" style="position: relative;">
                            <label class="form-label" id="password-label">
                                Contraseña (para acceso al sistema) *
                            </label>
                            <input type="password" id="admin-password" class="form-control"
                                placeholder="Mínimo 6 caracteres" autocomplete="new-password">
                            <button type="button" id="toggle-admin-password"
                                style="position:absolute;right:0.75rem;top:2rem;background:none;border:none;
                                       cursor:pointer;color:var(--text-muted);padding:0.25rem;"
                                aria-label="Mostrar contraseña">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
                                    viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                    stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                                    <circle cx="12" cy="12" r="3"/>
                                </svg>
                            </button>
                            <span class="form-error hidden" id="err-password"></span>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button id="btn-cancel" class="btn btn-outline">Cancelar</button>
                    <button id="btn-save" class="btn btn-primary">Guardar</button>
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
        const tbody = document.getElementById('admins-table-body');
        if (admins.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center" style="color: var(--text-muted); padding: 2rem;">
                        No hay administrativos registrados.
                    </td>
                </tr>`;
            return;
        }

        tbody.innerHTML = admins.map(admin => `
            <tr>
                <td>
                    <div style="font-weight: 500;">${admin.nombres} ${admin.apellidos}</div>
                </td>
                <td class="col-hide-mobile">${admin.identificacion}</td>
                <td>${admin.email}</td>
                <td class="col-hide-mobile">${admin.telefono}</td>
                <td><span class="badge badge-info">${admin.cargo}</span></td>
                <td style="text-align: right; white-space: nowrap;">
                    <button class="btn btn-outline btn-sm btn-edit"
                        data-id="${admin.id}" style="margin-right: 0.5rem;">Editar</button>
                    <button class="btn btn-danger btn-sm btn-delete"
                        data-id="${admin.id}"
                        ${admin.id === 'admin-1' ? 'disabled title="No se puede eliminar el admin principal"' : ''}>
                        Eliminar
                    </button>
                </td>
            </tr>
        `).join('');

        document.querySelectorAll('.btn-edit').forEach(btn =>
            btn.addEventListener('click', (e) => openModal(e.currentTarget.dataset.id))
        );
        document.querySelectorAll('.btn-delete').forEach(btn =>
            btn.addEventListener('click', (e) => handleDelete(e.currentTarget.dataset.id))
        );
    }

    function setupEvents() {
        document.getElementById('btn-add-admin').addEventListener('click', () => openModal());
        document.getElementById('close-modal').addEventListener('click', closeModal);
        document.getElementById('btn-cancel').addEventListener('click', closeModal);

        document.getElementById('admin-modal').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) closeModal();
        });

        document.getElementById('btn-save').addEventListener('click', handleSave);

        // Toggle contraseña
        document.getElementById('toggle-admin-password').addEventListener('click', () => {
            const input = document.getElementById('admin-password');
            input.type = input.type === 'text' ? 'password' : 'text';
        });
    }

    function openModal(id = null) {
        const modal = document.getElementById('admin-modal');
        clearErrors();
        document.getElementById('admin-form').reset();
        document.getElementById('admin-id').value = '';

        const passwordLabel = document.getElementById('password-label');

        if (id) {
            document.getElementById('modal-title').textContent = 'Editar Administrativo';
            passwordLabel.textContent = 'Contraseña (dejar vacío para no cambiar)';
            const admin = admins.find(a => a.id === id);
            if (admin) {
                document.getElementById('admin-id').value            = admin.id;
                document.getElementById('admin-identificacion').value = admin.identificacion;
                document.getElementById('admin-nombres').value       = admin.nombres;
                document.getElementById('admin-apellidos').value     = admin.apellidos;
                document.getElementById('admin-email').value         = admin.email;
                document.getElementById('admin-telefono').value      = admin.telefono;
                document.getElementById('admin-cargo').value         = admin.cargo;
                document.getElementById('admin-password').value      = '';
            }
        } else {
            document.getElementById('modal-title').textContent = 'Nuevo Administrativo';
            passwordLabel.textContent = 'Contraseña (para acceso al sistema) *';
        }

        modal.classList.add('active');
    }

    function closeModal() {
        document.getElementById('admin-modal').classList.remove('active');
        clearErrors();
    }

    function clearErrors() {
        ['identificacion', 'nombres', 'apellidos', 'email', 'telefono', 'cargo', 'password'].forEach(f => {
            const el    = document.getElementById(`err-${f}`);
            const input = document.getElementById(`admin-${f}`);
            if (el)    { el.textContent = ''; el.classList.add('hidden'); }
            if (input) { input.classList.remove('is-invalid'); }
        });
    }

    function showError(field, msg) {
        const el    = document.getElementById(`err-${field}`);
        const input = document.getElementById(`admin-${field}`);
        if (el)    { el.textContent = msg; el.classList.remove('hidden'); }
        if (input) { input.classList.add('is-invalid'); }
    }

    function isUniqueField(field, value, excludeId = null) {
        return !getData('lmsAdmins').some(a =>
            a[field]?.toLowerCase() === value.toLowerCase() && a.id !== excludeId
        );
    }

    function handleSave() {
        clearErrors();

        const id             = document.getElementById('admin-id').value;
        const identificacion = document.getElementById('admin-identificacion').value.trim();
        const nombres        = document.getElementById('admin-nombres').value.trim();
        const apellidos      = document.getElementById('admin-apellidos').value.trim();
        const email          = document.getElementById('admin-email').value.trim().toLowerCase();
        const telefono       = document.getElementById('admin-telefono').value.trim();
        const cargo          = document.getElementById('admin-cargo').value.trim();
        const passwordInput  = document.getElementById('admin-password').value;

        let hasError = false;

        if (!identificacion || identificacion.length < 5) {
            showError('identificacion', 'La identificación es obligatoria (mínimo 5 caracteres).'); hasError = true;
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
            showError('email', 'Ese correo ya está en uso por otro administrativo.'); hasError = true;
        }

        if (!telefono || telefono.length < 7) {
            showError('telefono', 'El teléfono es obligatorio (mínimo 7 caracteres).'); hasError = true;
        }

        if (!cargo) {
            showError('cargo', 'El cargo es obligatorio.'); hasError = true;
        }

        // Contraseña: obligatoria al crear, opcional al editar pero mínimo 6 si se ingresa
        if (!id && !passwordInput) {
            showError('password', 'La contraseña es obligatoria para crear un administrativo.'); hasError = true;
        } else if (passwordInput && passwordInput.length < 6) {
            showError('password', 'La contraseña debe tener al menos 6 caracteres.'); hasError = true;
        }

        if (hasError) return;

        const adminData = { identificacion, nombres, apellidos, email, telefono, cargo };

        if (passwordInput) {
            adminData.password = hashPassword(passwordInput);
        }

        if (id) {
            updateItem('lmsAdmins', id, adminData);
            showToast('Administrativo actualizado correctamente');
        } else {
            createItem('lmsAdmins', adminData);
            showToast('Administrativo creado correctamente');
        }

        admins = getData('lmsAdmins');
        renderTable();
        closeModal();
    }

    function handleDelete(id) {
        if (id === 'admin-1') {
            showToast('No se puede eliminar el administrador principal.', 'warning');
            return;
        }
        if (confirm('¿Estás seguro de eliminar este administrativo? Esta acción no se puede deshacer.')) {
            deleteItem('lmsAdmins', id);
            admins = getData('lmsAdmins');
            showToast('Administrativo eliminado', 'danger');
            renderTable();
        }
    }
}