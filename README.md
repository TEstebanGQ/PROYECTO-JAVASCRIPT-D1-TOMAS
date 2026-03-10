# LMS ABC — Learning Management System

Sistema de gestión de aprendizaje (LMS) para la Institución Educativa ABC. Permite administrar docentes, cursos, módulos y lecciones, con una vista pública para que cualquier visitante pueda explorar los cursos disponibles.

---
## Demo en línea

[![Ver demo](https://img.shields.io/badge/Ver%20demo-Netlify-00C7B7?style=for-the-badge&logo=netlify)](https://proyecto-d1-js.netlify.app/)

## Tecnologías utilizadas

- **HTML5** — estructura de las vistas
- **CSS3** — estilos y diseño responsive
- **JavaScript (ES Modules)** — lógica del sistema
- **localStorage** — persistencia de datos en el navegador

No se utilizan frameworks, librerías externas ni bases de datos.

---

## Cómo ejecutar el proyecto

### Opción recomendada — Live Server (VS Code)

1. Abrí la carpeta del proyecto en **Visual Studio Code**.
2. Instalá la extensión **Live Server** (si no la tenés).
3. Hacé clic derecho sobre `index.html` → **Open with Live Server**.

### Opción alternativa

Abrí el archivo `index.html` directamente en tu navegador.

---

## Credenciales de acceso por defecto

| Campo    | Valor             |
|----------|-------------------|
| Email    | `admin@abc.edu`   |
| Contraseña | `admin`         |

> Si modificás las credenciales desde el módulo de Administrativos, debés iniciar sesión con los nuevos datos.

---

## Estructura del proyecto

[![descripcion](https://ibb.co/LhnVY9yb)](https://ibb.co/LhnVY9yb)

```
index.html
src/
  css/
    styles.css          → estilos globales, variables, componentes
    responsive.css      → media queries para mobile/tablet/desktop
  js/
    main.js             → punto de entrada
    router.js           → enrutador por hash (#/ruta)
    store.js            → CRUD genérico sobre localStorage y autenticación
    utils/
      hash.js           → función de hash para contraseñas (djb2)
      modal.js          → helpers para abrir/cerrar modales
      toast.js          → notificaciones flotantes
    views/
      public.js         → vista pública de cursos
      login.js          → formulario de inicio de sesión
      layout.js         → estructura principal (sidebar + topbar)
      dashboard.js      → panel con estadísticas y accesos rápidos
      teachers.js       → CRUD de docentes + panel de carga académica
      admins.js         → CRUD de administrativos
      courses/
        index.js        → controlador de la vista de cursos
        list.js         → tabla con filtros
        form.js         → formulario de creación/edición de curso
        modules.js      → gestión de módulos dentro de un curso
        lessons.js      → gestión de lecciones dentro de un módulo
img/
  icons/
  fondo/
```

---

## Módulos del sistema

### Login
- Autenticación por email y contraseña.
- Redirección automática al dashboard si la sesión ya está activa.
- Protección de rutas privadas.

### Dashboard
- Muestra el total de cursos activos, docentes registrados y administrativos.
- Accesos rápidos a los módulos principales.

### Gestión de Docentes
- Crear, editar y eliminar docentes.
- Campos: código, identificación, nombres, apellidos, email, foto y área académica.
- **Restricción:** no se puede eliminar un docente que tenga cursos asignados.
- **Panel de carga académica:** botón "📋 Carga" que muestra todos los cursos asignados al docente, con módulos, lecciones, duración y fecha.

### Gestión de Cursos
- Crear, editar y eliminar cursos.
- Campos: código, nombre, descripción, docente, categoría, tipo, duración, estado, visibilidad, etiquetas y fecha de inicio.
- Gestión de **módulos** dentro de cada curso.
- Gestión de **lecciones** dentro de cada módulo (título, intensidad horaria, contenido y multimedia).
- Filtros en tabla por: texto, estado, visibilidad, tipo de curso y rango de fechas.

### Gestión de Administrativos
- Crear, editar y eliminar administrativos.
- Campos: identificación, nombres, apellidos, email, teléfono, cargo y contraseña.
- El administrador principal (`admin-1`) no puede ser eliminado.

### Vista Pública
- Accesible sin iniciar sesión desde la ruta raíz `/`.
- Lista todos los cursos con visibilidad **Público**.
- Cada tarjeta muestra: nombre, categoría, tipo, docente, duración y fecha de inicio.
- Al hacer clic en una tarjeta se abre un modal con el detalle completo del curso, incluyendo módulos y lecciones.

---

## Persistencia de datos

Los datos se guardan en `localStorage` del navegador con estas claves:

| Clave            | Contenido                  |
|------------------|----------------------------|
| `lmsAdmins`      | Lista de administrativos   |
| `lmsTeachers`    | Lista de docentes          |
| `lmsCourses`     | Lista de cursos            |
| `lmsCurrentUser` | Sesión activa              |

Al iniciar la aplicación por primera vez se cargan datos de ejemplo (un admin, dos docentes y un curso) para facilitar la demostración.

---

## Flujo de uso recomendado (demo)

1. Entrar al sistema con las credenciales por defecto.
2. Revisar el dashboard con las estadísticas iniciales.
3. Crear un nuevo docente en **Gestión de Docentes**.
4. Crear un nuevo curso en **Gestión de Cursos** y asignarle el docente.
5. Agregar módulos y lecciones al curso.
6. Ir a **Ver Sitio Público** y verificar que el curso aparece con su fecha de inicio.
7. Volver al panel y probar los filtros en la tabla de cursos.
8. Hacer clic en "📋 Carga" sobre un docente para ver su panel académico.

---

## Aspectos de seguridad 

Al ser un MVP de frontend puro:

- Las contraseñas se almacenan con un hash simple (djb2) en `localStorage`. 
- No existe backend ni validación del lado del servidor.
- Para un entorno real se recomienda implementar autenticación con JWT, HTTPS y una base de datos.

---
