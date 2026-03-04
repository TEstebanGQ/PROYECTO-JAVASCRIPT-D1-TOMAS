
/**
 * Genera un hash numérico a partir de un string
 * @param {string} str — texto a hashear (ej: contraseña)
 * @returns {string}   — hash en hexadecimal
 *
 * @example
 * hashPassword('admin')  // → "fffffd7f" (siempre el mismo resultado)
 */
export function hashPassword(str) {
    if (!str || typeof str !== 'string') return '';

    let hash = 0;

    for (let i = 0; i < str.length; i++) {
        // Operación bitwise: mezcla el código del caracter con el hash anterior
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash |= 0; // Convierte a entero de 32 bits
    }

    // Convertir a hexadecimal (unsigned)
    return (hash >>> 0).toString(16);
}

/**
 * Compara una contraseña en texto plano con un hash guardado
 * @param {string} plain  — contraseña que escribe el usuario
 * @param {string} hashed — hash guardado en localStorage
 * @returns {boolean}
 *
 * @example
 * verifyPassword('admin', 'fffffd7f') // → true
 * verifyPassword('otro',  'fffffd7f') // → false
 */
export function verifyPassword(plain, hashed) {
    return hashPassword(plain) === hashed;
}