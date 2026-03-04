// store.js - Manejo de LocalStorage

const DEFAULT_ADMIN = {
    id: 'admin-1',
    identificacion: '123456789',
    nombres: 'Admin',
    apellidos: 'Principal',
    email: 'admin@abc.edu',
    telefono: '3001234567',
    cargo: 'Administrador General',
    password: 'admin' // En un entorno real esto iría encriptado
};

// Datos iniciales de prueba
const INITIAL_TEACHERS = [
    {
        id: 't-1',
        codigo: 'DOC-001',
        identificacion: '987654321',
        nombres: 'Carlos',
        apellidos: 'Mendoza',
        email: 'cmendoza@abc.edu',
        foto: 'https://picsum.photos/seed/teacher1/200',
        area: 'Informática'
    },
    {
        id: 't-2',
        codigo: 'DOC-002',
        identificacion: '987654322',
        nombres: 'Laura',
        apellidos: 'Gómez',
        email: 'lgomez@abc.edu',
        foto: 'https://picsum.photos/seed/teacher2/200',
        area: 'Biología'
    }
];

const INITIAL_COURSES = [
    {
        id: 'c-1',
        codigo: 'CUR-001',
        nombre: 'Introducción a la Programación',
        descripcion: 'Aprende los fundamentos de la programación con JavaScript.',
        docenteId: 't-1',
        categorias: 'Tecnología',
        duracion: '40 horas',
        etiquetas: 'js, web, basico',
        visibilidad: 'Publico',
        estado: 'Activo',
        fecha: new Date().toISOString().split('T')[0],
        modulos: [
            {
                id: 'm-1',
                codigo: 'MOD-001',
                nombre: 'Fundamentos',
                descripcion: 'Conceptos básicos de programación',
                lecciones: [
                    {
                        id: 'l-1',
                        titulo: 'Variables y Tipos de Datos',
                        intensidad: '2 horas',
                        contenido: 'En esta lección aprenderemos sobre variables...',
                        multimedia: 'https://youtube.com/...'
                    }
                ]
            }
        ]
    }
];

export function initStore() {
    if (!localStorage.getItem('lms_admins')) {
        localStorage.setItem('lms_admins', JSON.stringify([DEFAULT_ADMIN]));
    }
    if (!localStorage.getItem('lms_teachers')) {
        localStorage.setItem('lms_teachers', JSON.stringify(INITIAL_TEACHERS));
    }
    if (!localStorage.getItem('lms_courses')) {
        localStorage.setItem('lms_courses', JSON.stringify(INITIAL_COURSES));
    }
}

// Funciones genéricas para CRUD
export function getData(key) {
    return JSON.parse(localStorage.getItem(key)) || [];
}

export function setData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

export function getById(key, id) {
    const data = getData(key);
    return data.find(item => item.id === id);
}

export function createItem(key, item) {
    const data = getData(key);
    item.id = Date.now().toString(); // ID simple
    data.push(item);
    setData(key, data);
    return item;
}

export function updateItem(key, id, updatedItem) {
    const data = getData(key);
    const index = data.findIndex(item => item.id === id);
    if (index !== -1) {
        data[index] = { ...data[index], ...updatedItem };
        setData(key, data);
        return data[index];
    }
    return null;
}

export function deleteItem(key, id) {
    const data = getData(key);
    const filtered = data.filter(item => item.id !== id);
    setData(key, filtered);
}

// Auth
export function login(email, password) {
    const admins = getData('lms_admins');
    const admin = admins.find(a => a.email === email && a.password === password);
    if (admin) {
        localStorage.setItem('lms_currentUser', JSON.stringify(admin));
        return true;
    }
    return false;
}

export function logout() {
    localStorage.removeItem('lms_currentUser');
}

export function getCurrentUser() {
    const user = localStorage.getItem('lms_currentUser');
    return user ? JSON.parse(user) : null;
}

export function isAuthenticated() {
    return getCurrentUser() !== null;
}
