# Historial de cambios

## 1.11.5 — 25 de noviembre de 2026

- Catálogo público de 1.309 herramientas únicas con metadatos ES/EN; 129 referencias PhET con atribución CC BY-NC 4.0. Mapas con vistas mundiales, sin ubicaciones personales.
- Panel lateral del navegador con fijados, grupos, espacios, búsqueda y tres vistas; no abre automáticamente otra pestaña del dashboard.
- Hasta nueve barras independientes, notas, reproductor, calendario y herramientas abiertas simultáneamente.
- Biblioteca con selección múltiple, cambio de tipo por lotes, conservación de iframe, vistas previas bajo demanda y recuperación del catálogo.
- Importación HTML/dinámica, pasos Compartir → Embed configurables, borrador reanudable, coincidencias y descarte individual o por selección.
- Auditoría persistente, enlaces clicables, edición de título/URL, comprobación individual y selección manual.
- Calendario anual, mensual, semanal y diario por horas, sistemas de calendario y festividades por país.
- Proyectos Kanban, tareas locales de entrada directa, notas y organización de favoritos mediante menús contextuales y movimientos de carpetas.
- Ajustes reorganizados, ocho temas claros/oscuros, fuentes locales y 46 artículos de ayuda ES/EN con buscador, historial y temas relacionados.
- Botón voluntario «Invítame a un café» y reporte privado de vulnerabilidades en GitHub; sin scripts remotos de Ko-fi en la extensión.
- Galería con datos ficticios, manuales bilingües y exclusión de copias privadas en la distribución.
- Pruebas locales en Brave con conexiones externas bloqueadas: no implican certificación de seguridad, aprobación de Chrome Web Store ni garantía de cada proveedor.

### Documentación y licencia

- Licencia migrada de CC BY-NC-SA 4.0 a GPL-3.0-only, apropiada para software de código abierto.
- Documentación pública ampliada con descripción del producto, menús, manual de instalación y criterios de compatibilidad.
- Firefox se declara explícitamente no compatible; se retira su declaración específica del manifiesto Chromium.

## 1.10.48 — Auditoría local y correcciones de seguridad

- Restaurar copias desactiva la escritura nativa y elimina los identificadores de otro perfil; es necesario elegir de nuevo la carpeta de sincronización.
- Importaciones limitadas a 25 MB, validación de estructuras, ciclos e identificadores; saneamiento de colores y clases CSS de notas.
- Auditoría: exclusión ampliada de direcciones privadas y redirecciones sujetas a revisión manual.
- Solicitudes autenticadas de calendario limitadas al origen del proveedor; validación de mensajes internos y del puente OAuth.
- Papelera: identificadores persistidos sobre los objetos restaurados y recuperación secuencial de árboles.
- CSP más estricta y sustitución de `tabs` por `activeTab`.
- Pruebas dinámicas en Edge aislado y un informe con alcance, evidencias y pendientes. No implica certificación ni compatibilidad plena con otros navegadores.

## 1.10.47 — Estabilidad, recuperación y publicación

### Añadido

- Papelera local de 30 días para favoritos, árboles de categorías, grupos, espacios, widgets, tareas y notas; incluye restauración individual y acción Deshacer.
- El contenido recuperable viaja dentro de la Copia completa.
- Script `tools/verify-extension.ps1` para la comprobación previa a una versión.
- Documentos independientes de privacidad y seguridad.

### Mejorado

- La auditoría procesa hasta seis enlaces en paralelo y pagina la vista en bloques de 160 resultados.
- Las confirmaciones de eliminación aclaran que el contenido se mueve a la Papelera.
- La ayuda integrada explica cómo recuperar elementos y cómo continuar un informe de auditoría extenso.

### Seguridad

- Política de seguridad declarada para las páginas de la extensión.
- Saneamiento más estricto de contenido enriquecido en las notas.
