import { hashPassword } from './utils/hash.js';

const storageKeys = {
    admins:      'lmsAdmins',
    teachers:    'lmsTeachers',
    courses:     'lmsCourses',
    currentUser: 'lmsCurrentUser',
};

const defaultAdmin = {
    id:             'admin-1',
    identificacion: '123456789',
    nombres:        'Admin',
    apellidos:      'Principal',
    email:          'admin@abc.edu',
    telefono:       '3001234567',
    cargo:          'Administrador General',
    password:       hashPassword('admin'),
};

const initialTeachers = [
    {
        id:             't-1',
        codigo:         'DOC-001',
        identificacion: '987654321',
        nombres:        'Carlos',
        apellidos:      'Mendoza',
        email:          'cmendoza@abc.edu',
        foto:           'https://picsum.photos/seed/teacher1/200',
        area:           'Informática',
    },
    {
        id:             't-2',
        codigo:         'DOC-002',
        identificacion: '987654322',
        nombres:        'Laura',
        apellidos:      'Gómez',
        email:          'lgomez@abc.edu',
        foto:           'https://picsum.photos/seed/teacher2/200',
        area:           'Biología',
    },
];

const initialCourses = [
    {
        id:          'c-1',
        codigo:      'CUR-001',
        nombre:      'Introducción a la Programación',
        descripcion: 'Aprende los fundamentos de la programación con JavaScript.',
        docenteId:   't-1',
        categorias:  'Tecnología',
        tipo:        'Virtual',
        duracion:    '40 horas',
        etiquetas:   'js, web, basico',
        visibilidad: 'Publico',
        estado:      'Activo',
        fecha:       new Date().toISOString().split('T')[0],
        modulos: [
            {
                id:          'm-1',
                codigo:      'MOD-001',
                nombre:      'Fundamentos',
                descripcion: 'Conceptos básicos de programación',
                lecciones: [
                    {
                        id:         'l-1',
                        titulo:     'Variables y Tipos de Datos',
                        intensidad: '2 horas',
                        contenido:  'En esta lección aprenderemos sobre variables...',
                        multimedia: 'https://youtube.com/',
                    },
                ],
            },
        ],
    },
];

function generateId() {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        return crypto.randomUUID();
    }
    return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
export function getData(key) {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

export function setData(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
        if (e.name === 'QuotaExceededError') {
            alert('El almacenamiento local está lleno. Eliminá datos innecesarios e intentá de nuevo.');
        } else {
            console.error(`Error al guardar ${key}:`, e);
        }
    }
}
export function initStore() {

    if (getData(storageKeys.admins).length === 0) {
        setData(storageKeys.admins, [defaultAdmin]);
    }
    if (getData(storageKeys.teachers).length === 0) {
        setData(storageKeys.teachers, initialTeachers);
    }
    if (getData(storageKeys.courses).length === 0) {
        setData(storageKeys.courses, initialCourses);
    }

    // Garantizar que el admin principal siempre exista
    const admins = getData(storageKeys.admins);
    if (!admins.some(a => a.id === 'admin-1')) {
        setData(storageKeys.admins, [defaultAdmin, ...admins]);
    }
}

// CRUD genérico
export function getById(key, id) {
    return getData(key).find(item => item.id === id) || null;
}

export function createItem(key, item) {
    const data = getData(key);
    item.id = generateId();
    data.push(item);
    setData(key, data);
    return item;
}

export function updateItem(key, id, updatedItem) {
    const data  = getData(key);
    const index = data.findIndex(item => item.id === id);
    if (index !== -1) {
        data[index] = { ...data[index], ...updatedItem };
        setData(key, data);
        return data[index];
    }
    return null;
}

export function deleteItem(key, id) {
    const filtered = getData(key).filter(item => item.id !== id);
    setData(key, filtered);
}
export function login(email, password) {
    const admins       = getData(storageKeys.admins);
    const normalizedEmail = email.trim().toLowerCase();
    const hashedInput  = hashPassword(password);

    const admin = admins.find(
        a => a.email.toLowerCase() === normalizedEmail && a.password === hashedInput
    );

    if (admin) {
        localStorage.setItem(storageKeys.currentUser, JSON.stringify(admin));
        return true;
    }
    return false;
}

export function logout() {
    localStorage.removeItem(storageKeys.currentUser);
}

export function getCurrentUser() {
    const raw = localStorage.getItem(storageKeys.currentUser);
    if (!raw) return null;
    try {
        const parsed = JSON.parse(raw);
        return parsed && typeof parsed === 'object' ? parsed : null;
    } catch {
        return null;
    }
}

export function isAuthenticated() {
    return getCurrentUser() !== null;
}