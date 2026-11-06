# Historial de cambios

## Próxima publicación pública

- Licencia migrada de CC BY-NC-SA 4.0 a GPL-3.0-only, apropiada para software de código abierto.
- Documentación pública ampliada con descripción del producto, menús, manual de instalación y criterios de compatibilidad.
- Firefox se declara explícitamente no compatible; se retira su declaración específica del manifiesto Chromium.

## Próximo lanzamiento — Estructura de apoyo voluntario

- Enlace de apoyo preparado para Ko-fi, desactivado hasta que el autor configure su perfil oficial.
- La llamada a la acción aparece únicamente en Acerca de DashboardDP y en el pie, abre una pestaña externa y no afecta a funciones, permisos ni datos locales.
- Se documenta el procedimiento de configuración y publicación segura del enlace.

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
