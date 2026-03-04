import { hashPassword, verifyPassword } from './utils/hash.js';

const storageKeys = {
    admins: 'lmsAdmins',
    teachers: 'lmsTeachers',
    courses: 'lmsCourses',
    currentUser: 'lmsCurrentUser',
};

const defaultAdmin = {
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
const initialTeachers = [
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

const initialCourses = [
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

function migrateStorageKey(oldKey, newKey) {
    const oldValue = localStorage.getItem(oldKey);
    const newValue = localStorage.getItem(newKey);
    if (oldValue && !newValue) {
        localStorage.setItem(newKey, oldValue);
    }
}

function ensureArrayData(key, fallback) {
    const currentData = getData(key);
    if (currentData.length === 0) {
        localStorage.setItem(key, JSON.stringify(fallback));
    }
}

function ensureMainAdminExists() {
    const admins = getData(storageKeys.admins);
    const existsMainAdmin = admins.some(admin => admin.id === defaultAdmin.id);
    if (!existsMainAdmin) {
        admins.unshift(defaultAdmin);
        setData(storageKeys.admins, admins);
    }
}

export function initStore() {
    migrateStorageKey('lms_admins', storageKeys.admins);
    migrateStorageKey('lms_teachers', storageKeys.teachers);
    migrateStorageKey('lms_courses', storageKeys.courses);
    migrateStorageKey('lms_currentUser', storageKeys.currentUser);

    ensureArrayData(storageKeys.admins, [defaultAdmin]);
    ensureArrayData(storageKeys.teachers, initialTeachers);
    ensureArrayData(storageKeys.courses, initialCourses);
    ensureMainAdminExists();
}

// Funciones genéricas para CRUD
export function getData(key) {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        console.error(`Error al leer ${key} desde localStorage:`, error);
        return [];
    }
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
    const admins = getData(storageKeys.admins);
    const normalizedEmail = email.trim().toLowerCase();
    const admin = admins.find(a => a.email.toLowerCase() === normalizedEmail && a.password === password);
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
    const user = localStorage.getItem(storageKeys.currentUser);
    if (!user) return null;
    try {
        const parsed = JSON.parse(user);
        return parsed && typeof parsed === 'object' ? parsed : null;
    } catch (error) {
        console.error('Error al leer la sesión actual:', error);
        return null;
    }
}

export function isAuthenticated() {
    return getCurrentUser() !== null;
}
