import { getData } from '../../store.js';
import { renderCourseList } from './list.js';
import { renderCourseForm } from './form.js';

// Estado compartido entre módulos
export const state = {
    currentView: 'list',   
    currentCourseId: null,
};

export function renderCourses(container) {
    if (!container) return;
    renderMain(container);
}

export function renderMain(container) {
    const courses  = getData('lmsCourses');
    const teachers = getData('lmsTeachers');

    if (state.currentView === 'list') {
        renderCourseList(container, courses, teachers, {
            onNew: () => {
                state.currentCourseId = null;
                state.currentView = 'edit';
                renderMain(container);
            },
            onEdit: (id) => {
                state.currentCourseId = id;
                state.currentView = 'edit';
                renderMain(container);
            },
        });
    } else {
        const course = state.currentCourseId
            ? courses.find(c => c.id === state.currentCourseId)
            : null;

        renderCourseForm(container, course, teachers, {
            onBack: () => {
                state.currentView = 'list';
                renderMain(container);
            },
            onSaved: (savedId) => {
                state.currentCourseId = savedId;
                // Recargar para mostrar panel de módulos si era nuevo
                renderMain(container);
            },
        });
    }
}