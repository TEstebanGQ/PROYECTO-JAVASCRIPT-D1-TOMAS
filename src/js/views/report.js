// src/js/views/report.js
// Vista: Reporte Resumen de Cursos

import { getData } from '../store.js';

/**
 * Convierte un string como "3 horas" o "1 hora" a número entero.
 * Retorna 0 si no puede parsear.
 */
function parseHoras(val) {
    if (!val) return 0;
    const n = parseInt(val);
    return isNaN(n) ? 0 : n;
}

/**
 * Calcula la intensidad horaria total de un curso
 * sumando la intensidad de cada lección de todos sus módulos.
 */
function calcularIntensidadTotal(course) {
    if (!course.modulos || course.modulos.length === 0) return 0;
    return course.modulos.reduce((total, mod) => {
        const horasModulo = (mod.lecciones || []).reduce((sum, lec) => {
            return sum + parseHoras(lec.intensidad);
        }, 0);
        return total + horasModulo;
    }, 0);
}

/**
 * Renderiza la vista del reporte resumen de cursos.
 * @param {HTMLElement} container
 */
export function renderReport(container) {
    const courses  = getData('lmsCourses');
    const teachers = getData('lmsTeachers');

    // Calcular resumen por curso
    const resumen = courses.map(c => {
        const teacher       = teachers.find(t => t.id === c.docenteId);
        const totalModulos  = c.modulos?.length ?? 0;
        const totalLecciones = c.modulos?.reduce((sum, m) => sum + (m.lecciones?.length ?? 0), 0) ?? 0;
        const intensidadTotal = calcularIntensidadTotal(c);

        return {
            id:              c.id,
            codigo:          c.codigo,
            nombre:          c.nombre,
            estado:          c.estado,
            tipo:            c.tipo,
            docente:         teacher ? `${teacher.nombres} ${teacher.apellidos}` : 'Sin asignar',
            totalModulos,
            totalLecciones,
            intensidadTotal,
        };
    });

    // Totales generales
    const totalCursos    = resumen.length;
    const totalModulos   = resumen.reduce((s, r) => s + r.totalModulos,   0);
    const totalLecciones = resumen.reduce((s, r) => s + r.totalLecciones, 0);
    const totalHoras     = resumen.reduce((s, r) => s + r.intensidadTotal, 0);

    const html = `
        <div class="page-header">
            <h1 class="page-title">Reporte Resumen de Cursos</h1>
            <button id="btn-export-report" class="btn btn-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round" style="margin-right:8px;">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" x2="12" y1="15" y2="3"/>
                </svg>
                Exportar .docx
            </button>
        </div>

        <!-- Tarjetas resumen global -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div class="card flex items-center gap-4">
                <div style="width:40px;height:40px;border-radius:50%;background:var(--primary-light);
                            color:var(--primary);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                        fill="none" stroke="currentColor" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round">
                        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
                    </svg>
                </div>
                <div>
                    <div style="font-size:0.8rem;color:var(--text-muted);font-weight:500;">Total Cursos</div>
                    <div style="font-size:1.5rem;font-weight:700;">${totalCursos}</div>
                </div>
            </div>
            <div class="card flex items-center gap-4">
                <div style="width:40px;height:40px;border-radius:50%;background:#dbeafe;
                            color:#3b82f6;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                        fill="none" stroke="currentColor" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round">
                        <rect x="3" y="3" width="7" height="7" rx="1"/>
                        <rect x="14" y="3" width="7" height="7" rx="1"/>
                        <rect x="3" y="14" width="7" height="7" rx="1"/>
                        <rect x="14" y="14" width="7" height="7" rx="1"/>
                    </svg>
                </div>
                <div>
                    <div style="font-size:0.8rem;color:var(--text-muted);font-weight:500;">Total Módulos</div>
                    <div style="font-size:1.5rem;font-weight:700;">${totalModulos}</div>
                </div>
            </div>
            <div class="card flex items-center gap-4">
                <div style="width:40px;height:40px;border-radius:50%;background:#f3e8ff;
                            color:#9333ea;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                        fill="none" stroke="currentColor" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14 2 14 8 20 8"/>
                        <line x1="16" y1="13" x2="8" y2="13"/>
                        <line x1="16" y1="17" x2="8" y2="17"/>
                        <polyline points="10 9 9 9 8 9"/>
                    </svg>
                </div>
                <div>
                    <div style="font-size:0.8rem;color:var(--text-muted);font-weight:500;">Total Lecciones</div>
                    <div style="font-size:1.5rem;font-weight:700;">${totalLecciones}</div>
                </div>
            </div>
            <div class="card flex items-center gap-4">
                <div style="width:40px;height:40px;border-radius:50%;background:#fef3c7;
                            color:#d97706;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                        fill="none" stroke="currentColor" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12 6 12 12 16 14"/>
                    </svg>
                </div>
                <div>
                    <div style="font-size:0.8rem;color:var(--text-muted);font-weight:500;">Total Horas</div>
                    <div style="font-size:1.5rem;font-weight:700;">${totalHoras}h</div>
                </div>
            </div>
        </div>

        <!-- Tabla detalle -->
        <div class="table-container">
            <table class="table">
                <thead>
                    <tr>
                        <th>Código</th>
                        <th>Curso</th>
                        <th class="col-hide-mobile">Docente</th>
                        <th class="col-hide-mobile">Estado</th>
                        <th style="text-align:center;">Módulos</th>
                        <th style="text-align:center;">Lecciones</th>
                        <th style="text-align:right;">Intensidad Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${resumen.length === 0
                        ? `<tr>
                               <td colspan="7" class="text-center" style="padding:2.5rem;color:var(--text-muted);">
                                   No hay cursos registrados.
                               </td>
                           </tr>`
                        : resumen.map(r => `
                            <tr>
                                <td style="font-family:monospace;font-size:0.8rem;">${r.codigo}</td>
                                <td>
                                    <div style="font-weight:500;">${r.nombre}</div>
                                    <div style="font-size:0.75rem;color:var(--text-muted);">${r.tipo || ''}</div>
                                </td>
                                <td class="col-hide-mobile" style="font-size:0.875rem;">${r.docente}</td>
                                <td class="col-hide-mobile">
                                    <span class="badge ${r.estado === 'Activo' ? 'badge-success' : 'badge-warning'}">
                                        ${r.estado}
                                    </span>
                                </td>
                                <td style="text-align:center;">
                                    <span class="badge badge-info">${r.totalModulos}</span>
                                </td>
                                <td style="text-align:center;">
                                    <span class="badge" style="background:#f3e8ff;color:#6b21a8;">
                                        ${r.totalLecciones}
                                    </span>
                                </td>
                                <td style="text-align:right;font-weight:600;">
                                    ${r.intensidadTotal > 0
                                        ? `${r.intensidadTotal} ${r.intensidadTotal === 1 ? 'hora' : 'horas'}`
                                        : '<span style="color:var(--text-muted);">—</span>'}
                                </td>
                            </tr>`
                        ).join('')}
                </tbody>
                ${resumen.length > 0 ? `
                <tfoot>
                    <tr style="background:#f9fafb;border-top:2px solid var(--border-color);">
                        <td colspan="4" style="padding:0.75rem 1rem;font-weight:700;font-size:0.875rem;">
                            TOTALES
                        </td>
                        <td style="text-align:center;font-weight:700;">${totalModulos}</td>
                        <td style="text-align:center;font-weight:700;">${totalLecciones}</td>
                        <td style="text-align:right;font-weight:700;">${totalHoras} horas</td>
                    </tr>
                </tfoot>` : ''}
            </table>
        </div>
    `;

    if (!container) return;
    container.innerHTML = html;

    // Botón exportar
    document.getElementById('btn-export-report')?.addEventListener('click', () => {
        exportToDocx(resumen, { totalCursos, totalModulos, totalLecciones, totalHoras });
    });
}

/**
 * Exporta el reporte a un archivo .docx usando la API de Anthropic
 * para generar el contenido y la librería docx para el archivo.
 */
async function exportToDocx(resumen, totales) {
    const btn = document.getElementById('btn-export-report');
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round"
                style="margin-right:8px;animation:spin 0.8s linear infinite;">
                <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
            </svg>
            Generando...
        `;
    }

    try {
        // Importar docx desde CDN (para uso en browser)
        // Como esto es un módulo JS del proyecto, generamos el blob usando fetch al backend
        // En este caso, construimos el documento directamente en el navegador con los datos

        const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
                AlignmentType, WidthType, BorderStyle, ShadingType, HeadingLevel,
                VerticalAlign } = await import('https://cdn.jsdelivr.net/npm/docx@9.5.3/build/index.min.js');

        const fechaGeneracion = new Date().toLocaleDateString('es-CO', {
            day: '2-digit', month: 'long', year: 'numeric'
        });

        const border = { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' };
        const borders = { top: border, bottom: border, left: border, right: border };

        const headerBorder = { style: BorderStyle.SINGLE, size: 1, color: '10b981' };
        const headerBorders = { top: headerBorder, bottom: headerBorder, left: headerBorder, right: headerBorder };

        // Anchos de columnas (total 9360 DXA = US Letter con márgenes de 1 pulgada)
        const colWidths = [900, 2200, 1700, 1000, 900, 900, 760];

        const cellStyle = (text, bold = false, align = AlignmentType.LEFT, bg = null) => {
            const shading = bg ? { fill: bg, type: ShadingType.CLEAR } : undefined;
            return new TableCell({
                borders,
                width: { size: colWidths[0], type: WidthType.DXA },
                margins: { top: 80, bottom: 80, left: 120, right: 120 },
                ...(shading ? { shading } : {}),
                verticalAlign: VerticalAlign.CENTER,
                children: [new Paragraph({
                    alignment: align,
                    children: [new TextRun({ text: String(text), bold, font: 'Arial', size: 20 })]
                })]
            });
        };

        // Función para crear celdas con ancho específico
        const cell = (text, width, bold = false, align = AlignmentType.LEFT, bg = null) => {
            const shading = bg ? { fill: bg, type: ShadingType.CLEAR } : undefined;
            return new TableCell({
                borders: bg ? headerBorders : borders,
                width: { size: width, type: WidthType.DXA },
                margins: { top: 100, bottom: 100, left: 120, right: 120 },
                ...(shading ? { shading } : {}),
                verticalAlign: VerticalAlign.CENTER,
                children: [new Paragraph({
                    alignment: align,
                    children: [new TextRun({
                        text: String(text),
                        bold,
                        font: 'Arial',
                        size: bold ? 18 : 18,
                        color: bg === '10b981' ? 'FFFFFF' : bg === 'E8F5E9' ? '1b5e20' : bg === 'F5F5F5' ? '1f2937' : '1f2937',
                    })]
                })]
            });
        };

        // Filas de datos
        const dataRows = resumen.map((r, idx) =>
            new TableRow({
                children: [
                    cell(r.codigo,          colWidths[0], false, AlignmentType.LEFT,   idx % 2 === 0 ? 'FFFFFF' : 'FAFAFA'),
                    cell(r.nombre,          colWidths[1], true,  AlignmentType.LEFT,   idx % 2 === 0 ? 'FFFFFF' : 'FAFAFA'),
                    cell(r.docente,         colWidths[2], false, AlignmentType.LEFT,   idx % 2 === 0 ? 'FFFFFF' : 'FAFAFA'),
                    cell(r.estado,          colWidths[3], false, AlignmentType.CENTER, idx % 2 === 0 ? 'FFFFFF' : 'FAFAFA'),
                    cell(r.totalModulos,    colWidths[4], false, AlignmentType.CENTER, idx % 2 === 0 ? 'FFFFFF' : 'FAFAFA'),
                    cell(r.totalLecciones,  colWidths[5], false, AlignmentType.CENTER, idx % 2 === 0 ? 'FFFFFF' : 'FAFAFA'),
                    cell(
                        r.intensidadTotal > 0 ? `${r.intensidadTotal}h` : '—',
                        colWidths[6], true, AlignmentType.RIGHT,
                        idx % 2 === 0 ? 'FFFFFF' : 'FAFAFA'
                    ),
                ]
            })
        );

        const doc = new Document({
            styles: {
                default: {
                    document: { run: { font: 'Arial', size: 22 } }
                },
                paragraphStyles: [
                    {
                        id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true,
                        run: { size: 36, bold: true, font: 'Arial', color: '10b981' },
                        paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 0 }
                    },
                    {
                        id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true,
                        run: { size: 26, bold: true, font: 'Arial', color: '374151' },
                        paragraph: { spacing: { before: 200, after: 100 }, outlineLevel: 1 }
                    },
                ]
            },
            sections: [{
                properties: {
                    page: {
                        size: { width: 15840, height: 12240, orientation: 'landscape' },
                        margin: { top: 1080, right: 1080, bottom: 1080, left: 1080 }
                    }
                },
                children: [
                    // ── Encabezado ──────────────────────────────────────────
                    new Paragraph({
                        heading: HeadingLevel.HEADING_1,
                        children: [new TextRun({ text: 'Reporte Resumen de Cursos', font: 'Arial', size: 40, bold: true, color: '10b981' })]
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: 'Institucion Educativa ABC', font: 'Arial', size: 22, color: '6b7280' }),
                            new TextRun({ text: '   |   ', font: 'Arial', size: 22, color: 'CCCCCC' }),
                            new TextRun({ text: `Generado el: ${fechaGeneracion}`, font: 'Arial', size: 22, color: '6b7280' }),
                        ],
                        spacing: { after: 320 }
                    }),

                    // ── Resumen global ──────────────────────────────────────
                    new Paragraph({
                        heading: HeadingLevel.HEADING_2,
                        children: [new TextRun({ text: 'Resumen General', font: 'Arial', size: 26, bold: true, color: '374151' })]
                    }),

                    new Table({
                        width: { size: 6000, type: WidthType.DXA },
                        columnWidths: [2000, 1500, 1500, 1000],
                        rows: [
                            new TableRow({
                                children: [
                                    cell('Indicador',     2000, true,  AlignmentType.LEFT,   '10b981'),
                                    cell('Cantidad',      1500, true,  AlignmentType.CENTER, '10b981'),
                                    cell('',              1500, false, AlignmentType.CENTER, '10b981'),
                                    cell('',              1000, false, AlignmentType.CENTER, '10b981'),
                                ]
                            }),
                            new TableRow({ children: [
                                cell('Total de Cursos',     2000, false, AlignmentType.LEFT),
                                cell(totales.totalCursos,   1500, true,  AlignmentType.CENTER),
                                cell('',                    1500, false, AlignmentType.CENTER),
                                cell('',                    1000, false, AlignmentType.CENTER),
                            ]}),
                            new TableRow({ children: [
                                cell('Total de Modulos',    2000, false, AlignmentType.LEFT,   'F5F5F5'),
                                cell(totales.totalModulos,  1500, true,  AlignmentType.CENTER, 'F5F5F5'),
                                cell('',                    1500, false, AlignmentType.CENTER, 'F5F5F5'),
                                cell('',                    1000, false, AlignmentType.CENTER, 'F5F5F5'),
                            ]}),
                            new TableRow({ children: [
                                cell('Total de Lecciones',    2000, false, AlignmentType.LEFT),
                                cell(totales.totalLecciones,  1500, true,  AlignmentType.CENTER),
                                cell('',                      1500, false, AlignmentType.CENTER),
                                cell('',                      1000, false, AlignmentType.CENTER),
                            ]}),
                            new TableRow({ children: [
                                cell('Total Horas',            2000, false, AlignmentType.LEFT,   'F5F5F5'),
                                cell(`${totales.totalHoras}h`, 1500, true,  AlignmentType.CENTER, 'F5F5F5'),
                                cell('',                       1500, false, AlignmentType.CENTER, 'F5F5F5'),
                                cell('',                       1000, false, AlignmentType.CENTER, 'F5F5F5'),
                            ]}),
                        ]
                    }),

                    new Paragraph({ children: [], spacing: { after: 300 } }),

                    // ── Tabla principal ─────────────────────────────────────
                    new Paragraph({
                        heading: HeadingLevel.HEADING_2,
                        children: [new TextRun({ text: 'Detalle por Curso', font: 'Arial', size: 26, bold: true, color: '374151' })]
                    }),

                    new Table({
                        width: { size: 13680, type: WidthType.DXA },
                        columnWidths: colWidths,
                        rows: [
                            // Encabezado
                            new TableRow({
                                tableHeader: true,
                                children: [
                                    cell('Codigo',    colWidths[0], true, AlignmentType.LEFT,   '10b981'),
                                    cell('Curso',     colWidths[1], true, AlignmentType.LEFT,   '10b981'),
                                    cell('Docente',   colWidths[2], true, AlignmentType.LEFT,   '10b981'),
                                    cell('Estado',    colWidths[3], true, AlignmentType.CENTER, '10b981'),
                                    cell('Modulos',   colWidths[4], true, AlignmentType.CENTER, '10b981'),
                                    cell('Lecciones', colWidths[5], true, AlignmentType.CENTER, '10b981'),
                                    cell('Horas',     colWidths[6], true, AlignmentType.RIGHT,  '10b981'),
                                ]
                            }),
                            ...dataRows,
                            // Fila totales
                            new TableRow({
                                children: [
                                    cell('TOTALES', colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3], true, AlignmentType.LEFT, 'E8F5E9'),
                                    cell(totales.totalModulos,   colWidths[4], true, AlignmentType.CENTER, 'E8F5E9'),
                                    cell(totales.totalLecciones, colWidths[5], true, AlignmentType.CENTER, 'E8F5E9'),
                                    cell(`${totales.totalHoras}h`, colWidths[6], true, AlignmentType.RIGHT, 'E8F5E9'),
                                ]
                            }),
                        ]
                    }),

                    // ── Pie de página ───────────────────────────────────────
                    new Paragraph({ children: [], spacing: { before: 400 } }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: 'LMS - Sistema de Gestion de Aprendizaje | Institucion Educativa ABC',
                                font: 'Arial', size: 16, color: '9ca3af', italics: true
                            })
                        ],
                        alignment: AlignmentType.CENTER,
                        border: { top: { style: BorderStyle.SINGLE, size: 1, color: 'e5e7eb' } },
                        spacing: { before: 120 }
                    }),
                ]
            }]
        });

        const buffer = await Packer.toBlob(doc);
        const url    = URL.createObjectURL(buffer);
        const a      = document.createElement('a');
        a.href       = url;
        a.download   = `reporte-cursos-${new Date().toISOString().split('T')[0]}.docx`;
        a.click();
        URL.revokeObjectURL(url);

        // Mostrar toast de éxito
        import('../utils/toast.js').then(({ showToast }) => {
            showToast('Reporte exportado correctamente', 'success');
        });

    } catch (err) {
        console.error('Error al generar el reporte:', err);
        import('../utils/toast.js').then(({ showToast }) => {
            showToast('Error al generar el reporte. Intentá de nuevo.', 'danger');
        });
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round" style="margin-right:8px;">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" x2="12" y1="15" y2="3"/>
                </svg>
                Exportar .docx
            `;
        }
    }
}
