# Guía de uso actualizada — 1.11.1

## Proteger y recuperar tu personalización
Abre Ajustes y pulsa **Copia completa y restauración**. Usa **Descargar copia completa (.json)** y guarda el archivo fuera de la carpeta de la extensión. Incluye el estado del Dashboard: favoritos, categorías, colores y ajustes, fijados y grupos, espacios, widgets y biblioteca, notas, tareas y proyectos.
Para recuperar una instalación, abre la misma sección y pulsa **Restaurar copia completa (.json)**, selecciona el archivo y revisa la confirmación. Restaurar una copia completa reemplaza el estado actual; protege primero los datos que quieras conservar. Exportar HTML solo guarda marcadores. Las cuentas externas requieren reconexión; no se exportan sus tokens.

## Auditoría de favoritos
En Ajustes > Datos, abre Auditar disponibilidad de favoritos y ejecuta la comprobación.
Los contadores son botones que filtran sin cerrar la ventana:
- Comprobados: todos los resultados.
- Disponibles: respuestas válidas.
- 404/no disponibles: candidatos confirmados como inexistentes.
- No concluyentes: protegidos, fallos de red/servidor, esperas o direcciones especiales; no significa que hayan desaparecido.
El desplegable permite concretar el estado y la búsqueda reduce por nombre, categoría o URL. Solo los candidatos admitidos por la auditoría se pueden seleccionar para borrar.
En la lista de favoritos, debajo del selector de orden, elige el estado de auditoría. Incluye Sin auditar y los estados individuales. Elige Todos los estados para retirar el filtro.
La comprobación es una observación puntual, no garantiza disponibilidad futura ni acceso desde otros países o redes.

## Calendario
El calendario ampliado muestra eventos en vistas diaria por horas, semanal, mensual y anual. Usa el selector de vista, las flechas o Hoy; pulsa un evento para editarlo y Nuevo evento para crearlo. Cierra con ×.
En Conexiones y sincronización las opciones permanecen desplegadas en una ventana ampliada con scroll. Vuelve con Volver al calendario.
Para Google OAuth, habilita **Google Calendar API en el mismo proyecto del Client ID**: Google Cloud > APIs y servicios > Biblioteca. Espera unos minutos y reintenta. En pruebas, añade tu cuenta como usuario de prueba si corresponde.
Los colores personalizados son locales. No se garantiza conservar automáticamente el color original de Google. La edición y sincronización remota completa sigue pendiente de validación extremo a extremo.

## Tareas locales
Nueva tarea local crea una tarea simple. El check avanza Por hacer → En curso → Completado; sus colores son blanco, naranja y verde. También puedes arrastrar entre columnas.
Pulsa el cuerpo de una fila para seleccionarla; Ctrl/Alt + clic permite seleccionar varias. Las acciones de borrado están arriba a la derecha. La papelera individual y la flecha Añadir a proyecto tienen leyendas al pasar el ratón.
Las tareas vinculadas a un proveedor de calendario y los nuevos eventos locales no se muestran en este tablero; no se borran al ocultarlos.

## Bandeja de ideas y proyectos
Se abre dentro del cuerpo principal. Crea o elige un proyecto en su selector. Sin proyecto seleccionado no aparece la papelera.
El selector de aplicaciones externas y su botón Ir están arriba a la derecha: abren Google Tasks, Microsoft To Do, Todoist, Trello o Asana en una pestaña externa, sin conexión API ni iframe.
Cada columna tiene Añadir elemento. Elige Favoritos, Tareas locales, Notas o Texto. Favoritos conserva el árbol de categorías, colores, contadores y sangría; despliega los grupos para elegir sus enlaces.
Selecciona filas con clic y Ctrl/Alt + clic, después pulsa Añadir seleccionados. El favorito o la nota original no se elimina.
Mueve las filas entre Por hacer, En curso y Completado mediante el check o arrastrándolas. La papelera quita la referencia del proyecto. Archivar un elemento completado lo retira del tablero y se consulta en Tareas finalizadas.

## Actualizar sin perder datos
1. Descarga una copia completa JSON.
2. Actualiza los archivos en la misma carpeta usada por el navegador (por ejemplo, `git pull --ff-only origin main` si la instalación es un clon).
3. Pulsa Recargar en brave://extensions, chrome://extensions o edge://extensions.
4. Abre una nueva pestaña del Dashboard.
**No desinstales la extensión ni borres sus datos para actualizarla.** Desinstalar puede eliminar su almacenamiento.
Si Git detecta cambios locales, detente y consérvalos; no fuerces el reemplazo.

## Estado de validación
JavaScript comprobado con node --check. Hay pruebas enfocadas de clasificación y del sobre JSON de copia. No equivale a una auditoría de seguridad completa ni a pruebas visuales en todos los temas y navegadores. Restauración real en perfil aislado y sincronización remota de eventos siguen pendientes.
