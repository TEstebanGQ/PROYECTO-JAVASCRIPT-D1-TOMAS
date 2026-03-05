/**
 * Hash simple para contraseñas (djb2)
 * No usar en producción — suficiente para un MVP con localStorage
 */
export function hashPassword(password) {
    let hash = 5381;
    for (let i = 0; i < password.length; i++) {
        hash = ((hash << 5) + hash) + password.charCodeAt(i);
        hash = hash & 0xFFFFFFFF; // Convertir a 32 bits
    }
    return (hash >>> 0).toString(16).padStart(8, '0');
}
