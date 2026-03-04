import { getData, createItem, updateItem, deleteItem } from '../store.js';
import { showToast } from '../utils/toast.js';

export function renderTeachers(container) {
    let teachers = getData('lmsTeachers');

    const html = `
        <div class="page-header">
            <h1 class="page-title">Gestión de Docentes</h1>
            <button id="btn-add-teacher" class="btn btn-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 8px;"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                Nuevo Docente
            </button>
        </div>
        
        <div class="table-container">
            <table class="table">
                <thead>
                    <tr>
                        <th>Docente</th>
                        <th class="col-hide-mobile">Código</th>
                        <th class="col-hide-mobile">Identificación</th>
                        <th>Área Académica</th>
                        <th class="col-hide-mobile">Cursos a Cargo</th>
                        <th style="text-align: right;">Acciones</th>
                    </tr>
                </thead>
                <tbody id="teachers-table-body"></tbody>
            </table>
        </div>

        <!-- Modal Formulario -->
        <div id="teacher-modal" class="modal-overlay">
            <div class="modal-content">
                <div class="modal-header">
                    <h2 id="modal-title" class="modal-title">Nuevo Docente</h2>
                    <span class="modal-close" id="close-modal">&times;</span>
                </div>
                <div class="modal-body">
                    <form id="teacher-form" novalidate>
                        <input type="hidden" id="teacher-id">
                        <div class="grid grid-cols-2 gap-4">
                            <div class="form-group">
                                <label class="form-label">Código *</label>
                                <input type="text" id="teacher-codigo" class="form-control" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Identificación *</label>
                                <input type="text" id="teacher-identificacion" class="form-control" required>
                            </div>
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div class="form-group">
                                <label class="form-label">Nombres *</label>
                                <input type="text" id="teacher-nombres" class="form-control" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Apellidos *</label>
                                <input type="text" id="teacher-apellidos" class="form-control" required>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Correo Electrónico *</label>
                            <input type="email" id="teacher-email" class="form-control" required>
                        </div>
                        <div class="form-group">
                            <!-- FIX #11: área académica como texto libre con lista de sugerencias -->
                            <label class="form-label">Área Académica *</label>
                            <input
                                type="text"
                                id="teacher-area"
                                class="form-control"
                                list="areas-list"
                                placeholder="Ej: Informática, Biología..."
                                required
                                autocomplete="off"
                            >
                            <datalist id="areas-list">
                                <option value="Matemáticas">
                                <option value="Ciencias">
                                <option value="Humanidades">
                                <option value="Informática">
                                <option value="Idiomas">
                                <option value="Artes">
                                <option value="Biología">
                                <option value="Física">
                                <option value="Química">
                                <option value="Educación Física">
                                <option value="Historia">
                                <option value="Filosofía">
                            </datalist>
                        </div>
                        <div class="form-group">
                            <label class="form-label">URL de Foto</label>
                            <input type="url" id="teacher-foto" class="form-control" placeholder="https://ejemplo.com/foto.jpg">
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
        // FIX #9: siempre leer cursos frescos del store
        const courses = getData('lmsCourses');
        const tbody = document.getElementById('teachers-table-body');

        if (teachers.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center" style="color: var(--text-muted); padding: 2rem;">No hay docentes registrados</td></tr>';
            return;
        }
        
        tbody.innerHTML = teachers.map(teacher => {
            const assignedCourses = courses.filter(c => c.docenteId === teacher.id).length;
            // Foto con fallback si la URL está vacía
            const foto = teacher.foto || `https://picsum.photos/seed/${teacher.id}/200`;
            return `
                <tr>
                    <td>
                        <div class="flex items-center gap-2">
                            <img
                                src="${foto}"
                                alt="Foto"
                                style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover;"
                                onerror="this.src='https://picsum.photos/seed/default/200'"
                            >
                            <div>
                                <div style="font-weight: 500;">${teacher.nombres} ${teacher.apellidos}</div>
                                <div style="font-size: 0.75rem; color: var(--text-muted);">${teacher.email}</div>
                            </div>
                        </div>
                    </td>
                    <td class="col-hide-mobile">${teacher.codigo}</td>
                    <td class="col-hide-mobile">${teacher.identificacion}</td>
                    <td><span class="badge badge-info">${teacher.area}</span></td>
                    <td class="col-hide-mobile">${assignedCourses} curso${assignedCourses !== 1 ? 's' : ''}</td>
                    <td style="text-align: right; white-space: nowrap;">
                        <button class="btn btn-outline btn-sm btn-edit" data-id="${teacher.id}" style="margin-right: 0.5rem;">Editar</button>
                        <button class="btn btn-danger btn-sm btn-delete" data-id="${teacher.id}">Eliminar</button>
                    </td>
                </tr>
            `;
        }).join('');
        
        document.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', (e) => openModal(e.currentTarget.dataset.id));
        });
        
        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', (e) => handleDelete(e.currentTarget.dataset.id));
        });
    }
    
    function setupEvents() {
        document.getElementById('btn-add-teacher').addEventListener('click', () => openModal());
        document.getElementById('close-modal').addEventListener('click', closeModal);
        document.getElementById('btn-cancel').addEventListener('click', closeModal);

        // Cerrar al hacer clic en el overlay
        document.getElementById('teacher-modal').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) closeModal();
        });

        document.getElementById('btn-save').addEventListener('click', () => {
            const form = document.getElementById('teacher-form');
            if (form.checkValidity()) {
                handleSave();
            } else {
                form.reportValidity();
            }
        });
    }
    
    function openModal(id = null) {
        const modal = document.getElementById('teacher-modal');
        const title = document.getElementById('modal-title');
        const form = document.getElementById('teacher-form');
        
        form.reset();
        document.getElementById('teacher-id').value = '';
        
        if (id) {
            title.textContent = 'Editar Docente';
            const teacher = teachers.find(t => t.id === id);
            if (teacher) {
                document.getElementById('teacher-id').value = teacher.id;
                document.getElementById('teacher-codigo').value = teacher.codigo;
                document.getElementById('teacher-identificacion').value = teacher.identificacion;
                document.getElementById('teacher-nombres').value = teacher.nombres;
                document.getElementById('teacher-apellidos').value = teacher.apellidos;
                document.getElementById('teacher-email').value = teacher.email;
                document.getElementById('teacher-area').value = teacher.area;
                document.getElementById('teacher-foto').value = teacher.foto || '';
            }
        } else {
            title.textContent = 'Nuevo Docente';
        }
        
        modal.classList.add('active');
    }
    
    function closeModal() {
        document.getElementById('teacher-modal').classList.remove('active');
    }
    
    function handleSave() {
        const id = document.getElementById('teacher-id').value;
        const teacherData = {
            codigo:         document.getElementById('teacher-codigo').value.trim(),
            identificacion: document.getElementById('teacher-identificacion').value.trim(),
            nombres:        document.getElementById('teacher-nombres').value.trim(),
            apellidos:      document.getElementById('teacher-apellidos').value.trim(),
            email:          document.getElementById('teacher-email').value.trim(),
            area:           document.getElementById('teacher-area').value.trim(),
            foto:           document.getElementById('teacher-foto').value.trim(),
        };
        
        if (id) {
            updateItem('lmsTeachers', id, teacherData);
            showToast('Docente actualizado correctamente'); 
        } else {
            createItem('lmsTeachers', teacherData);
            showToast('Docente creado correctamente'); 
        }
        
        teachers = getData('lmsTeachers');
        renderTable();
        closeModal();
    }
    
    function handleDelete(id) {
        // FIX #9: siempre leer cursos frescos
        const courses = getData('lmsCourses');
        const assignedCourses = courses.filter(c => c.docenteId === id);

        if (assignedCourses.length > 0) {
            // FIX #12: reemplazar alert() nativo por toast
            showToast('No se puede eliminar: el docente tiene cursos asignados.', 'warning', 4000);
            return;
        }
        
        if (confirm('¿Está seguro de eliminar este docente?')) {
            deleteItem('lmsTeachers', id);
            teachers = getData('lmsTeachers');
            showToast('Docente eliminado', 'danger');
            renderTable();
        }
    }
}