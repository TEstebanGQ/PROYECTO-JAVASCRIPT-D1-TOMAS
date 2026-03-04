import { getData, createItem, updateItem, deleteItem } from '../store.js';

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
                        <th>Identificación</th>
                        <th>Correo Electrónico</th>
                        <th>Teléfono</th>
                        <th>Cargo</th>
                        <th style="text-align: right;">Acciones</th>
                    </tr>
                </thead>
                <tbody id="admins-table-body">
                    <!-- Filas generadas por JS -->
                </tbody>
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
                    <form id="admin-form">
                        <input type="hidden" id="admin-id">
                        <div class="form-group">
                            <label class="form-label">Identificación</label>
                            <input type="text" id="admin-identificacion" class="form-control" required>
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div class="form-group">
                                <label class="form-label">Nombres</label>
                                <input type="text" id="admin-nombres" class="form-control" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Apellidos</label>
                                <input type="text" id="admin-apellidos" class="form-control" required>
                            </div>
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div class="form-group">
                                <label class="form-label">Correo Electrónico</label>
                                <input type="email" id="admin-email" class="form-control" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Teléfono</label>
                                <input type="tel" id="admin-telefono" class="form-control" required>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Cargo</label>
                            <input type="text" id="admin-cargo" class="form-control" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Contraseña (Para acceso al sistema)</label>
                            <input type="password" id="admin-password" class="form-control" required>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button id="btn-cancel" class="btn btn-outline">Cancelar</button>
                    <button id="btn-save" class="btn btn-primary" form="admin-form">Guardar</button>
                </div>
            </div>
        </div>
    `;
    
    if(container) {
        container.innerHTML = html;
        renderTable();
        setupEvents();
    }
    
    function renderTable() {
        const tbody = document.getElementById('admins-table-body');
        if (admins.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center" style="color: var(--text-muted);">No hay administrativos registrados</td></tr>';
            return;
        }
        
        tbody.innerHTML = admins.map(admin => {
            return `
                <tr>
                    <td>
                        <div style="font-weight: 500;">${admin.nombres} ${admin.apellidos}</div>
                    </td>
                    <td>${admin.identificacion}</td>
                    <td>${admin.email}</td>
                    <td>${admin.telefono}</td>
                    <td><span class="badge badge-info">${admin.cargo}</span></td>
                    <td style="text-align: right;">
                        <button class="btn btn-outline btn-edit" data-id="${admin.id}" style="padding: 0.25rem 0.5rem; margin-right: 0.5rem;">Editar</button>
                        <button class="btn btn-danger btn-delete" data-id="${admin.id}" style="padding: 0.25rem 0.5rem;" ${admin.email === 'admin@abc.edu' ? 'disabled title="No se puede eliminar el admin principal"' : ''}>Eliminar</button>
                    </td>
                </tr>
            `;
        }).join('');
        
        // Asignar eventos a botones de la tabla
        document.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', (e) => openModal(e.currentTarget.dataset.id));
        });
        
        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', (e) => handleDelete(e.currentTarget.dataset.id));
        });
    }
    
    function setupEvents() {
        const modal = document.getElementById('admin-modal');
        
        document.getElementById('btn-add-admin').addEventListener('click', () => openModal());
        
        document.getElementById('close-modal').addEventListener('click', closeModal);
        document.getElementById('btn-cancel').addEventListener('click', closeModal);
        
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
        document.getElementById('admin-password').required = true;
        
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
                document.getElementById('admin-password').value = admin.password;
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
        const adminData = {
            identificacion: document.getElementById('admin-identificacion').value,
            nombres: document.getElementById('admin-nombres').value,
            apellidos: document.getElementById('admin-apellidos').value,
            email: document.getElementById('admin-email').value,
            telefono: document.getElementById('admin-telefono').value,
            cargo: document.getElementById('admin-cargo').value,
            password: document.getElementById('admin-password').value
        };
        
        if (id) {
            updateItem('lmsAdmins', id, adminData);
        } else {
            createItem('lmsAdmins', adminData);
        }
        
        admins = getData('lmsAdmins');
        renderTable();
        closeModal();
    }
    
    function handleDelete(id) {
        const admin = admins.find(a => a.id === id);
        if (admin && admin.email === 'admin@abc.edu') {
            alert('No se puede eliminar el administrador principal.');
            return;
        }
        
        if (confirm('¿Está seguro de eliminar este administrativo?')) {
            deleteItem('lmsAdmins', id);
            admins = getData('lmsAdmins');
            renderTable();
        }
    }
}
