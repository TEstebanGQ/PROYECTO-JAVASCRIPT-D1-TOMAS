import { getData, createItem, updateItem, deleteItem } from '../store.js';

export function renderTeachers(container) {
    let teachers = getData('lmsTeachers');
    let courses = getData('lmsCourses');
    
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
                        <th>Código</th>
                        <th>Identificación</th>
                        <th>Área Académica</th>
                        <th>Cursos a Cargo</th>
                        <th style="text-align: right;">Acciones</th>
                    </tr>
                </thead>
                <tbody id="teachers-table-body">
                    <!-- Filas generadas por JS -->
                </tbody>
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
                    <form id="teacher-form">
                        <input type="hidden" id="teacher-id">
                        <div class="grid grid-cols-2 gap-4">
                            <div class="form-group">
                                <label class="form-label">Código</label>
                                <input type="text" id="teacher-codigo" class="form-control" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Identificación</label>
                                <input type="text" id="teacher-identificacion" class="form-control" required>
                            </div>
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div class="form-group">
                                <label class="form-label">Nombres</label>
                                <input type="text" id="teacher-nombres" class="form-control" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Apellidos</label>
                                <input type="text" id="teacher-apellidos" class="form-control" required>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Correo Electrónico</label>
                            <input type="email" id="teacher-email" class="form-control" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Área Académica</label>
                            <select id="teacher-area" class="form-control" required>
                                <option value="">Seleccione un área...</option>
                                <option value="Matemáticas">Matemáticas</option>
                                <option value="Ciencias">Ciencias</option>
                                <option value="Humanidades">Humanidades</option>
                                <option value="Informática">Informática</option>
                                <option value="Idiomas">Idiomas</option>
                                <option value="Artes">Artes</option>
                                <option value="Biología">Biología</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">URL de Foto</label>
                            <input type="url" id="teacher-foto" class="form-control" placeholder="https://ejemplo.com/foto.jpg" required>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button id="btn-cancel" class="btn btn-outline">Cancelar</button>
                    <button id="btn-save" class="btn btn-primary" form="teacher-form">Guardar</button>
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
        const tbody = document.getElementById('teachers-table-body');
        if (teachers.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center" style="color: var(--text-muted);">No hay docentes registrados</td></tr>';
            return;
        }
        
        tbody.innerHTML = teachers.map(teacher => {
            const assignedCourses = courses.filter(c => c.docenteId === teacher.id).length;
            return `
                <tr>
                    <td>
                        <div class="flex items-center gap-2">
                            <img src="${teacher.foto}" alt="Foto" style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover;">
                            <div>
                                <div style="font-weight: 500;">${teacher.nombres} ${teacher.apellidos}</div>
                                <div style="font-size: 0.75rem; color: var(--text-muted);">${teacher.email}</div>
                            </div>
                        </div>
                    </td>
                    <td>${teacher.codigo}</td>
                    <td>${teacher.identificacion}</td>
                    <td><span class="badge badge-info">${teacher.area}</span></td>
                    <td>${assignedCourses} cursos</td>
                    <td style="text-align: right;">
                        <button class="btn btn-outline btn-edit" data-id="${teacher.id}" style="padding: 0.25rem 0.5rem; margin-right: 0.5rem;">Editar</button>
                        <button class="btn btn-danger btn-delete" data-id="${teacher.id}" style="padding: 0.25rem 0.5rem;">Eliminar</button>
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
        const modal = document.getElementById('teacher-modal');
        
        document.getElementById('btn-add-teacher').addEventListener('click', () => openModal());
        
        document.getElementById('close-modal').addEventListener('click', closeModal);
        document.getElementById('btn-cancel').addEventListener('click', closeModal);
        
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
                document.getElementById('teacher-foto').value = teacher.foto;
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
            codigo: document.getElementById('teacher-codigo').value,
            identificacion: document.getElementById('teacher-identificacion').value,
            nombres: document.getElementById('teacher-nombres').value,
            apellidos: document.getElementById('teacher-apellidos').value,
            email: document.getElementById('teacher-email').value,
            area: document.getElementById('teacher-area').value,
            foto: document.getElementById('teacher-foto').value
        };
        
        if (id) {
            updateItem('lmsTeachers', id, teacherData);
        } else {
            createItem('lmsTeachers', teacherData);
        }
        
        teachers = getData('lmsTeachers');
        renderTable();
        closeModal();
    }
    
    function handleDelete(id) {
        // Restricción: No se puede eliminar si tiene cursos asignados
        const assignedCourses = courses.filter(c => c.docenteId === id);
        if (assignedCourses.length > 0) {
            alert('No se puede eliminar este docente porque tiene cursos asignados.');
            return;
        }
        
        if (confirm('¿Está seguro de eliminar este docente?')) {
            deleteItem('lmsTeachers', id);
            teachers = getData('lmsTeachers');
            renderTable();
        }
    }
}
