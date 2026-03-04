import { getData, createItem, updateItem, deleteItem } from '../store.js';
import { hashPassword } from '../utils/hash.js';
import { showToast } from '../utils/toast.js';

export function renderAdmins(container) {
    let admins = getData('lmsAdmins');
    
    const html = `
        <div class="page-header">
            <h1 class="page-title">Gestión de Administrativos</h1>
            <button id="btn-add-admin" class="btn btn-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 8px;"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
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
                            <input type="text" id="admin-identificacion" class="form-control" required>
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div class="form-group">
                                <label class="form-label">Nombres *</label>
                                <input type="text" id="admin-nombres" class="form-control" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Apellidos *</label>
                                <input type="text" id="admin-apellidos" class="form-control" required>
                            </div>
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div class="form-group">
                                <label class="form-label">Correo Electrónico *</label>
                                <input type="email" id="admin-email" class="form-control" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Teléfono *</label>
                                <input type="tel" id="admin-telefono" class="form-control" required>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Cargo *</label>
                            <input type="text" id="admin-cargo" class="form-control" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Contraseña (para acceso al sistema)</label>
                            <input type="password" id="admin-password" class="form-control" placeholder="Dejar vacío para no cambiar">
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
            tbody.innerHTML = '<tr><td colspan="6" class="text-center" style="color: var(--text-muted); padding: 2rem;">No hay administrativos registrados</td></tr>';
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
                    <button class="btn btn-outline btn-sm btn-edit" data-id="${admin.id}" style="margin-right: 0.5rem;">Editar</button>
                    <button class="btn btn-danger btn-sm btn-delete" data-id="${admin.id}" ${admin.id === 'admin-1' ? 'disabled title="No se puede eliminar el admin principal"' : ''}>Eliminar</button>
                </td>
            </tr>
        `).join('');
        
        document.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', (e) => openModal(e.currentTarget.dataset.id));
        });
        
        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', (e) => handleDelete(e.currentTarget.dataset.id));
        });
    }
    
    function setupEvents() {
        document.getElementById('btn-add-admin').addEventListener('click', () => openModal());
        document.getElementById('close-modal').addEventListener('click', closeModal);
        document.getElementById('btn-cancel').addEventListener('click', closeModal);

        // Cerrar al hacer clic en el overlay
        document.getElementById('admin-modal').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) closeModal();
        });

        document.getElementById('btn-save').addEventListener('click', () => {
            const form = document.getElementById('admin-form');
            if (form.checkValidity()) {
                handleSave();
            } else {
                form.reportValidity();
            }
        });
    }
    
    function openModal(id = null) {
        const modal = document.getElementById('admin-modal');
        const title = document.getElementById('modal-title');
        const form = document.getElementById('admin-form');
        
        form.reset();
        document.getElementById('admin-id').value = '';
        
        if (id) {
            title.textContent = 'Editar Administrativo';
            const admin = admins.find(a => a.id === id);
            if (admin) {
                document.getElementById('admin-id').value = admin.id;
                document.getElementById('admin-identificacion').value = admin.identificacion;
                document.getElementById('admin-nombres').value = admin.nombres;
                document.getElementById('admin-apellidos').value = admin.apellidos;
                document.getElementById('admin-email').value = admin.email;
                document.getElementById('admin-telefono').value = admin.telefono;
                document.getElementById('admin-cargo').value = admin.cargo;
                // No mostrar contraseña hasheada — campo vacío
                document.getElementById('admin-password').value = '';
            }
        } else {
            title.textContent = 'Nuevo Administrativo';
        }
        
        modal.classList.add('active');
    }
    
    function closeModal() {
        document.getElementById('admin-modal').classList.remove('active');
    }
    
    function handleSave() {
        const id = document.getElementById('admin-id').value;
        const passwordInput = document.getElementById('admin-password').value;

        const adminData = {
            identificacion: document.getElementById('admin-identificacion').value.trim(),
            nombres:        document.getElementById('admin-nombres').value.trim(),
            apellidos:      document.getElementById('admin-apellidos').value.trim(),
            email:          document.getElementById('admin-email').value.trim(),
            telefono:       document.getElementById('admin-telefono').value.trim(),
            cargo:          document.getElementById('admin-cargo').value.trim(),
        };

        // FIX #8: solo hashear si el usuario escribió una contraseña nueva
        if (passwordInput) {
            adminData.password = hashPassword(passwordInput);
        }
        // Si está vacío al editar, se conserva la contraseña anterior (spread en updateItem)
        
        if (id) {
            updateItem('lmsAdmins', id, adminData);
            showToast('Administrativo actualizado correctamente'); // FIX #10
        } else {
            // Al crear es obligatorio tener contraseña
            if (!passwordInput) {
                showToast('Debes ingresar una contraseña para el nuevo administrativo.', 'warning');
                return;
            }
            createItem('lmsAdmins', adminData);
            showToast('Administrativo creado correctamente'); // FIX #10
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
        
        if (confirm('¿Está seguro de eliminar este administrativo?')) {
            deleteItem('lmsAdmins', id);
            admins = getData('lmsAdmins');
            showToast('Administrativo eliminado', 'danger');
            renderTable();
        }
    }
}