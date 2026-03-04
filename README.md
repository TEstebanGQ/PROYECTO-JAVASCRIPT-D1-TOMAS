# LMS ABC - Proyecto MVP

Aplicación web tipo **LMS (Learning Management System)** hecha con **HTML, CSS y JavaScript vanilla**, usando **localStorage** para persistencia.

Este proyecto permite administrar:
- Docentes
- Cursos
- Módulos
- Lecciones
- Administrativos

También incluye una vista pública para que cualquier persona pueda ver cursos.

---

## 1) Objetivo del proyecto

Construir un MVP para la Institución Educativa ABC que permita gestionar información académica y administrativa de forma simple.

---

## 2) Tecnologías usadas

- **HTML5**
- **CSS3**
- **JavaScript (ES Modules)**
- **localStorage** (como persistencia de datos)

No se usan librerías externas de frontend ni backend.

---

## 3) Cómo ejecutar el proyecto

### Opción recomendada (Live Server)
1. Abre la carpeta del proyecto en VS Code.
2. Instala la extensión **Live Server**.
3. Abre `index.html` y pulsa **"Open with Live Server"**.

### Opción alternativa
Abrir `index.html` directamente en el navegador.

---

## 4) Credenciales de acceso (por defecto)

- **Email:** `admin@abc.edu`
- **Password:** `admin`

> Si cambias estas credenciales en el módulo de administrativos, debes iniciar sesión con las nuevas.

---

## 5) Estructura del proyecto

```text
index.html
src/
  css/
    styles.css
  js/
    main.js
    router.js
    store.js
    views/
      public.js
      login.js
      layout.js
      dashboard.js
      teachers.js
      courses.js
      admins.js
img/
```

---

## 6) Módulos implementados

### 6.1 Login
- Autenticación por email y contraseña.
- Redirección al dashboard si las credenciales son válidas.
- Protección de rutas privadas.

### 6.2 Dashboard
- Estadísticas rápidas:
  - Cursos activos
  - Docentes registrados
  - Administrativos
- Accesos directos a módulos principales.

### 6.3 Gestión de docentes (CRUD)
- Crear, listar, editar y eliminar docentes.
- Datos: código, identificación, nombres, apellidos, email, foto y área.
- Restricción aplicada: **no se elimina un docente si tiene cursos asignados**.

### 6.4 Gestión de cursos + módulos + lecciones (CRUD)
- Crear y editar curso con:
  - código, nombre, descripción, docente
  - categoría, duración, estado, visibilidad, etiquetas
- Gestión de módulos dentro del curso.
- Gestión de lecciones dentro de cada módulo.
- Filtros en tabla por texto, estado y visibilidad.

### 6.5 Gestión de administrativos (CRUD)
- Crear, listar, editar y eliminar administrativos.
- Datos: identificación, nombres, apellidos, email, teléfono, cargo, contraseña.

### 6.6 Vista pública
- Lista de cursos públicos.
- Detalle de curso al hacer clic (docente, descripción, módulos y lecciones).

---

## 7) Persistencia de datos (localStorage)

Se usan estas claves:
- `lmsAdmins`
- `lmsTeachers`
- `lmsCourses`
- `lmsCurrentUser`

También existe migración automática desde claves antiguas (`snake_case`) a las nuevas (`camelCase`).

---

## 8) Revisión rápida contra los requerimientos

### Cumplido
- Login con email y contraseña.
- Dashboard principal con resumen.
- CRUD de docentes.
- CRUD de cursos, módulos y lecciones.
- CRUD de administrativos.
- Restricción de eliminación de docentes con cursos asignados.
- Vista pública de cursos.
- Persistencia con localStorage.

### Parcial o por mejorar
- Filtros de cursos: falta filtro específico por **fecha** y **tipo de curso** como indica el enunciado.
- "Panel individual" del docente: actualmente se muestra resumen por fila, pero no una vista dedicada por docente.
- Seguridad: al ser MVP en frontend, credenciales y datos viven en localStorage.

---

## 9) Flujo de uso recomendado (demo)

1. Entrar al login con las credenciales por defecto.
2. Ir al dashboard para ver métricas.
3. Crear un docente.
4. Crear un curso y asignar el docente.
5. Agregar módulos y lecciones.
6. Ir a "Ver sitio público" y abrir el detalle de un curso.
7. Volver al panel y probar edición/eliminación.

---

## 10) Notas para la entrega en GitHub

Asegúrate de incluir:
1. Este `README.md`.
2. Capturas de pantalla del login, dashboard y módulos.
3. URL del despliegue (si publicas en Netlify/GitHub Pages).

---

## 11) Próximos pasos sugeridos (fáciles para seguir aprendiendo)

1. Agregar filtro por fecha en cursos.
2. Crear una vista "detalle docente" con cursos asignados.
3. Mejorar validaciones de formularios.
4. Separar componentes UI reutilizables.
5. Agregar pruebas básicas de flujos críticos.

