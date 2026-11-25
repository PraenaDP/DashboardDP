/* es, en. Solo interfaz; nunca contenido guardado. */
const EXTRA_UI_ROWS = [
  [
    "Seleccionar todas",
    "Select all"
  ],
  [
    "Deseleccionar todas",
    "Deselect all"
  ],
  [
    "Solo sin equivalencia",
    "Only without equivalents"
  ],
  [
    "Incluye las traducciones pendientes si no tienen equivalencia detectada",
    "Includes pending translations without a detected equivalent"
  ],
  [
    "Seleccionados: {count} de {total}",
    "Selected: {count} of {total}"
  ],
  [
    "¿Enviar {count} tareas locales a la Papelera? No se eliminarán eventos de Calendar.",
    "Move {count} local tasks to Trash? Calendar events will not be deleted."
  ],
  [
    "¿Eliminar el proyecto «{name}» y su contenido? Los favoritos originales se conservan.",
    "Delete project “{name}” and its contents? Original bookmarks are preserved."
  ],
  [
    "Biblioteca de widgets",
    "Widget library"
  ],
  [
    "Tipo de widget",
    "Widget type"
  ],
  [
    "Tipos de widget",
    "Widget types"
  ],
  [
    "Mostrar tipos de widget",
    "Show widget types"
  ],
  [
    "Todos los tipos",
    "All types"
  ],
  [
    "★ Favoritos",
    "★ Favorites"
  ],
  [
    "Marcar como favorito",
    "Mark as favorite"
  ],
  [
    "Quitar de favoritos",
    "Remove from favorites"
  ],
  [
    "Buscar widgets…",
    "Search widgets…"
  ],
  [
    "Buscar widgets",
    "Search widgets"
  ],
  [
    "Vista de widgets",
    "Widget view"
  ],
  [
    "Ordenar widgets",
    "Sort widgets"
  ],
  [
    "Nombre A–Z",
    "Name A–Z"
  ],
  [
    "Nombre Z–A",
    "Name Z–A"
  ],
  [
    "Últimos modificados",
    "Recently modified"
  ],
  [
    "Tarjetas",
    "Cards"
  ],
  [
    "Tabla",
    "Table"
  ],
  [
    "Web",
    "Website"
  ],
  [
    "Acciones",
    "Actions"
  ],
  [
    "Descripción",
    "Description"
  ],
  [
    "No hay widgets con estos filtros.",
    "No widgets match these filters."
  ],
  [
    "Agregar a mi barra",
    "Add to my panel"
  ],
  [
    "Abrir vista previa",
    "Open preview"
  ],
  [
    "Cerrar vista previa",
    "Close preview"
  ],
  [
    "Añadir widget",
    "Add widget"
  ],
  [
    "Nuevo Widget",
    "New Widget"
  ],
  [
    "Fuente de la interfaz",
    "Interface font"
  ],
  [
    "Se usan fuentes instaladas en tu equipo. Si una no está disponible, se aplica una alternativa; no se descargan fuentes externas.",
    "Uses fonts installed on your device. Unavailable fonts fall back to an alternative; no external fonts are downloaded."
  ],
  [
    "Editar widget",
    "Edit widget"
  ],
  [
    "Eliminar widget",
    "Delete widget"
  ],
  [
    "Guardar widget en mi biblioteca",
    "Save widget to my library"
  ],
  [
    "Editar widget guardado",
    "Edit saved widget"
  ],
  [
    "Guardar widget",
    "Save widget"
  ],
  [
    "Guardar cambios",
    "Save changes"
  ],
  [
    "Nombre del widget",
    "Widget name"
  ],
  [
    "Descripción del widget…",
    "Widget description…"
  ],
  [
    "Selecciona un tipo o escribe uno nuevo…",
    "Select a type or enter a new one…"
  ],
  [
    "Escribe un tipo nuevo para crearlo al guardar.",
    "Enter a new type to create it when saving."
  ],
  [
    "Volver a la biblioteca",
    "Back to library"
  ],
  [
    "Eliminar de la biblioteca",
    "Remove from library"
  ],
  [
    "Mover a la Papelera",
    "Move to Trash"
  ],
  [
    "Papelera",
    "Trash"
  ],
  [
    "Restaurar",
    "Restore"
  ],
  [
    "Eliminar definitivamente",
    "Delete permanently"
  ],
  [
    "Vaciar papelera",
    "Empty Trash"
  ],
  [
    "La papelera está vacía.",
    "Trash is empty."
  ],
  [
    "Nombre",
    "Name"
  ],
  [
    "Color",
    "Color"
  ],
  [
    "Categoría",
    "Category"
  ],
  [
    "Categoría padre",
    "Parent category"
  ],
  [
    "Tipo de icono",
    "Icon type"
  ],
  [
    "Añadir subcategoría",
    "Add subcategory"
  ],
  [
    "Subcategorías",
    "Subcategories"
  ],
  [
    "Nueva subcategoría",
    "New subcategory"
  ],
  [
    "Sin categorías",
    "No categories"
  ],
  [
    "Renombrar enlace",
    "Rename link"
  ],
  [
    "Eliminar enlace",
    "Delete link"
  ],
  [
    "Nombre del enlace",
    "Link name"
  ],
  [
    "Mover favorito",
    "Move bookmark"
  ],
  [
    "Mover",
    "Move"
  ],
  [
    "Disolver grupo",
    "Dissolve group"
  ],
  [
    "Disolver",
    "Dissolve"
  ],
  [
    "Renombrar grupo",
    "Rename group"
  ],
  [
    "Quitar del grupo",
    "Remove from group"
  ],
  [
    "Fijar/Desfijar",
    "Pin/Unpin"
  ],
  [
    "Más opciones",
    "More options"
  ],
  [
    "Eliminar espacio",
    "Delete workspace"
  ],
  [
    "Eliminar espacio de trabajo",
    "Delete workspace"
  ],
  [
    "Editar espacio",
    "Edit workspace"
  ],
  [
    "Abrir pestañas",
    "Open tabs"
  ],
  [
    "Favoritos que abrirá",
    "Bookmarks to open"
  ],
  [
    "Aún no hay accesos fijados",
    "No pinned shortcuts yet"
  ],
  [
    "Pulsa la estrella en cualquier favorito para fijarlo aquí",
    "Click a bookmark’s star to pin it here"
  ],
  [
    "Volver",
    "Back"
  ],
  [
    "Abrir",
    "Open"
  ],
  [
    "Quitar",
    "Remove"
  ],
  [
    "Widgets propios",
    "Custom widgets"
  ],
  [
    "Añadir widget propio",
    "Add custom widget"
  ],
  [
    "Subir bloque",
    "Move block up"
  ],
  [
    "Bajar bloque",
    "Move block down"
  ],
  [
    "Quitar bloque",
    "Remove block"
  ],
  [
    "Quitar bloque de mi barra",
    "Remove block from my panel"
  ],
  [
    "Arrastra para mover el bloque",
    "Drag to move the block"
  ],
  [
    "Arrastra para cambiar ancho y alto",
    "Drag to resize width and height"
  ],
  [
    "Formato",
    "Rich text"
  ],
  [
    "Vista previa",
    "Preview"
  ],
  [
    "Color de texto",
    "Text color"
  ],
  [
    "Escribe directamente aquí…",
    "Type directly here…"
  ],
  [
    "Editar Markdown en línea",
    "Edit Markdown inline"
  ],
  [
    "Markdown de la nota",
    "Note Markdown"
  ],
  [
    "Altura en Notas visibles (px)",
    "Height in visible notes (px)"
  ],
  [
    "Tareas locales",
    "Local tasks"
  ],
  [
    "Escribe una tarea",
    "Enter a task"
  ],
  [
    "Eliminar seleccionadas",
    "Delete selected"
  ],
  [
    "Limpiar tareas locales",
    "Clear local tasks"
  ],
  [
    "Eliminar tarea",
    "Delete task"
  ],
  [
    "Añadir a proyecto",
    "Add to project"
  ],
  [
    "Mis proyectos",
    "My projects"
  ],
  [
    "Bandeja de ideas y proyectos",
    "Ideas and projects"
  ],
  [
    "Elegir proyecto",
    "Choose project"
  ],
  [
    "Elige una idea o proyecto",
    "Choose an idea or project"
  ],
  [
    "Aplicación externa de tareas",
    "External task app"
  ],
  [
    "Ir a la aplicación externa",
    "Go to external app"
  ],
  [
    "Crear proyecto",
    "Create project"
  ],
  [
    "Eliminar proyecto activo",
    "Delete active project"
  ],
  [
    "+ Añadir elemento",
    "+ Add item"
  ],
  [
    "Cambiar estado",
    "Change status"
  ],
  [
    "Abrir enlace",
    "Open link"
  ],
  [
    "Eliminar elemento",
    "Delete item"
  ],
  [
    "Archivar",
    "Archive"
  ],
  [
    "Añadir tarea",
    "Add task"
  ],
  [
    "Tareas finalizadas",
    "Finished tasks"
  ],
  [
    "Tipo de elemento",
    "Item type"
  ],
  [
    "Buscar…",
    "Search…"
  ],
  [
    "Texto o enlace…",
    "Text or link…"
  ],
  [
    "Añadir elementos",
    "Add items"
  ],
  [
    "Añadir seleccionados",
    "Add selected"
  ],
  [
    "Selecciona un proyecto",
    "Select a project"
  ],
  [
    "Crear idea",
    "Create idea"
  ],
  [
    "Añadir recurso",
    "Add resource"
  ],
  [
    "Añadir URL",
    "Add URL"
  ],
  [
    "Notas y documentación",
    "Notes and documentation"
  ],
  [
    "Guardar notas",
    "Save notes"
  ],
  [
    "Buscar proyectos o recursos…",
    "Search projects or resources…"
  ],
  [
    "No hay elementos en esta sección.",
    "No items in this section."
  ],
  [
    "Gestor de proyectos",
    "Project manager"
  ],
  [
    "Ideas, proyectos y recursos locales.",
    "Local ideas, projects and resources."
  ],
  [
    "Nueva idea",
    "New idea"
  ],
  [
    "Nuevo proyecto",
    "New project"
  ],
  [
    "Calendario de eventos",
    "Event calendar"
  ],
  [
    "Vista del calendario",
    "Calendar view"
  ],
  [
    "Nuevo evento",
    "New event"
  ],
  [
    "Conexiones y sincronización",
    "Connections and sync"
  ],
  [
    "Conexiones de calendarios",
    "Calendar connections"
  ],
  [
    "Elegir y conectar calendarios",
    "Choose and connect calendars"
  ],
  [
    "Volver al calendario",
    "Back to calendar"
  ],
  [
    "Sincronizar",
    "Sync"
  ],
  [
    "Todo el día",
    "All day"
  ],
  [
    "Cerrar calendario",
    "Close calendar"
  ],
  [
    "Color del evento",
    "Event color"
  ],
  [
    "Nombre del evento",
    "Event name"
  ],
  [
    "Solo en este calendario local",
    "Only in this local calendar"
  ],
  [
    "Color personalizado (local)",
    "Custom color (local)"
  ],
  [
    "Sincronización opcional",
    "Optional sync"
  ],
  [
    "Guardar evento",
    "Save event"
  ],
  [
    "Por hacer",
    "To do"
  ],
  [
    "En curso",
    "In progress"
  ],
  [
    "Completado",
    "Completed"
  ],
  [
    "Pendiente",
    "Pending"
  ],
  [
    "Pausado",
    "Paused"
  ],
  [
    "Archivado",
    "Archived"
  ],
  [
    "Auditoría de favoritos",
    "Bookmark audit"
  ],
  [
    "Filtrar por estado de auditoría",
    "Filter by audit status"
  ],
  [
    "Filtrar resultados",
    "Filter results"
  ],
  [
    "Seleccionar candidatos",
    "Select candidates"
  ],
  [
    "Deseleccionar",
    "Deselect"
  ],
  [
    "Todos los no concluyentes",
    "All inconclusive"
  ],
  [
    "No hay resultados con este filtro.",
    "No results match this filter."
  ],
  [
    "Secciones de ajustes",
    "Settings sections"
  ],
  [
    "Tipografía del saludo",
    "Greeting font"
  ],
  [
    "Tamaño del saludo",
    "Greeting size"
  ],
  [
    "Tamaño del saludo (px)",
    "Greeting size (px)"
  ],
  [
    "Opacidad del fondo de pantalla",
    "Wallpaper opacity"
  ],
  [
    "Ayuda y guía de uso",
    "Help and user guide"
  ],
  [
    "Acerca de DashboardDP",
    "About DashboardDP"
  ],
  [
    "Documentación y privacidad",
    "Documentation and privacy"
  ],
  [
    "Cómo actualizar sin perder datos",
    "How to update without losing data"
  ],
  [
    "Actualizaciones desde GitHub",
    "Updates from GitHub"
  ],
  [
    "Copia completa de DashboardDP",
    "Full DashboardDP backup"
  ],
  [
    "Restaurar copia completa",
    "Restore full backup"
  ],
  [
    "Descargar copia completa (.json)",
    "Download full backup (.json)"
  ],
  [
    "Restaurar copia completa (.json)",
    "Restore full backup (.json)"
  ],
  [
    "Descargar estado actual",
    "Download current state"
  ],
  [
    "Restaurar esta copia",
    "Restore this backup"
  ],
  [
    "Importar Calculations.tools",
    "Import Calculations.tools"
  ],
  [
    "Buscar herramientas",
    "Find tools"
  ],
  [
    "Importar seleccionados",
    "Import selected"
  ],
  [
    "Importar widget",
    "Import widget"
  ],
  [
    "Importar",
    "Import"
  ],
  [
    "Tipo",
    "Type"
  ],
  [
    "Ya cubierto por",
    "Already covered by"
  ],
  [
    "Revisar traducción",
    "Review translation"
  ],
  [
    "No se ha detectado equivalente",
    "No equivalent detected"
  ],
  [
    "Páginas revisadas: ",
    "Pages checked: "
  ],
  [
    "Widgets encontrados: ",
    "Widgets found: "
  ],
  [
    "Equivalentes: ",
    "Equivalent tools: "
  ],
  [
    "Traducciones pendientes: ",
    "Translations pending: "
  ],
  [
    "Páginas pendientes: ",
    "Pages pending: "
  ],
  [
    "Widgets añadidos: ",
    "Widgets added: "
  ],
  [
    "Ver pendientes",
    "View pending items"
  ],
  [
    "No se pudo acceder al catálogo: ",
    "Could not access the catalog: "
  ],
  [
    "Acceso no concedido. Tu biblioteca no se ha modificado.",
    "Access not granted. Your library has not changed."
  ],
  [
    "No se pudo guardar. Se conserva la biblioteca anterior.",
    "Could not save. The previous library is preserved."
  ],
  [
    "Completa el título y la descripción antes de importar.",
    "Fill in the title and description before importing."
  ],
  [
    "Restaurado localmente. Revisa la sincronización de marcadores.",
    "Restored locally. Check bookmark synchronization."
  ],
  [
    "No se pudo restaurar porque ya existe un elemento con esos datos.",
    "Could not restore because an item with those details already exists."
  ],
  [
    "Papelera vaciada definitivamente.",
    "Trash permanently emptied."
  ],
  [
    "Copia completa descargada: favoritos, ajustes, fijados, espacios, widgets, notas y tareas.",
    "Full backup downloaded: bookmarks, settings, pinned items, workspaces, widgets, notes and tasks."
  ],
  [
    "Marcadores exportados en HTML",
    "Bookmarks exported as HTML"
  ],
  [
    "No se pudo leer el archivo de marcadores",
    "Could not read the bookmarks file"
  ],
  [
    "Copia restaurada. Vuelve a elegir la carpeta de sincronización y renueva los calendarios externos.",
    "Backup restored. Select the sync folder again and reauthorize external calendars."
  ],
  [
    "Dashboard restablecido y datos locales eliminados",
    "Dashboard reset and local data deleted"
  ],
  [
    "Esta nota contiene demasiado contenido. Usa el editor completo para reducirla.",
    "This note is too large. Use the full editor to reduce it."
  ],
  [
    "Se ha restaurado la cuadrícula compacta.",
    "The compact grid has been restored."
  ],
  [
    "Icono personalizado aplicado",
    "Custom icon applied"
  ],
  [
    "Tema «",
    "Theme “"
  ],
  [
    "No se encontraron marcadores en el archivo",
    "No bookmarks found in the file"
  ],
  [
    "No se encontraron eventos. Elige el archivo .ics extraído, no el ZIP descargado de Google.",
    "No events found. Choose the extracted .ics file, not the ZIP downloaded from Google."
  ],
  [
    "Esos calendarios ya estaban importados.",
    "Those calendars were already imported."
  ],
  [
    "No se pudo leer uno de los archivos de calendario.",
    "Could not read one of the calendar files."
  ],
  [
    "Añade al menos una fecha de vencimiento para exportar el calendario",
    "Add at least one due date to export the calendar"
  ],
  [
    "Calendario exportado en formato .ics",
    "Calendar exported as .ics"
  ],
  [
    "Para mantener el dashboard ligero, el límite es de 40 notas.",
    "To keep the dashboard lightweight, there is a limit of 40 notes."
  ],
  [
    "Esta nota contiene demasiadas imágenes o texto. Reduce su contenido.",
    "This note contains too many images or too much text. Reduce its content."
  ],
  [
    "No se pudo leer la imagen",
    "Could not read the image"
  ],
  [
    "No se encontraron archivos de audio en la carpeta",
    "No audio files found in the folder"
  ],
  [
    "No se pudo reproducir el audio",
    "Could not play the audio"
  ],
  [
    "No se pudo actualizar el marcador en el navegador",
    "Could not update the browser bookmark"
  ],
  [
    "No se pudo eliminar el marcador del navegador",
    "Could not delete the browser bookmark"
  ],
  [
    "No se pudo actualizar la carpeta del navegador",
    "Could not update the browser folder"
  ],
  [
    "No se pudo eliminar la carpeta del navegador",
    "Could not delete the browser folder"
  ],
  [
    "Elige primero una carpeta y activa la sincronización bidireccional",
    "First choose a folder and enable two-way sync"
  ],
  [
    "Todos los favoritos ya están vinculados con el navegador",
    "All bookmarks are already linked to the browser"
  ],
  [
    "El Dashboard empezará vacío. Los nuevos marcadores se añadirán automáticamente.",
    "The Dashboard will start empty. New bookmarks will be added automatically."
  ],
  [
    "No se pudo leer la lista de marcadores del navegador",
    "Could not read the browser bookmark list"
  ],
  [
    "No se pudieron copiar todos los favoritos al navegador",
    "Not all bookmarks could be copied to the browser"
  ],
  [
    "Este navegador no permite acceder a sus marcadores",
    "This browser does not allow access to its bookmarks"
  ],
  [
    "Activa primero la sincronización bidireccional",
    "Enable two-way sync first"
  ],
  [
    "Este enlace ya está en el dashboard",
    "This link is already in the dashboard"
  ],
  [
    "Conviene exportar una copia de seguridad de tus favoritos",
    "Consider exporting a backup of your bookmarks"
  ],
  [
    "¿Eliminar el proyecto «",
    "Delete project “"
  ],
  [
    "Descripción del widget",
    "Widget description"
  ],
  [
    "URL HTTPS para embeber",
    "HTTPS embed URL"
  ],
  [
    "URL HTTPS o código iframe",
    "HTTPS URL or iframe code"
  ],
  [
    "Altura (px)",
    "Height (px)"
  ],
  [
    "Ancho (px o %)",
    "Width (px or %)"
  ],
  [
    "Error al guardar los datos",
    "Error saving data"
  ],
  [
    "El archivo JSON no es válido",
    "The JSON file is invalid"
  ],
  [
    "El archivo no tiene el formato correcto",
    "The file format is incorrect"
  ],
  [
    "La copia completa no tiene el formato correcto",
    "The full backup format is incorrect"
  ],
  [
    "No se pudo leer el archivo",
    "Could not read the file"
  ],
  [
    "El archivo supera el límite de importación de 25 MB.",
    "The file exceeds the 25 MB import limit."
  ],
  [
    "La copia supera el límite de importación de 25 MB.",
    "The backup exceeds the 25 MB import limit."
  ],
  [
    "Ajustes guardados",
    "Settings saved"
  ],
  [
    "Categoría actualizada",
    "Category updated"
  ],
  [
    "La URL no es válida",
    "The URL is invalid"
  ],
  [
    "Favorito actualizado",
    "Bookmark updated"
  ],
  [
    "Favorito duplicado",
    "Bookmark duplicated"
  ],
  [
    "Grupo creado",
    "Group created"
  ],
  [
    "Grupo actualizado",
    "Group updated"
  ],
  [
    "Eliminado del grupo",
    "Removed from group"
  ],
  [
    "Este espacio no tiene favoritos todavía",
    "This workspace has no bookmarks yet"
  ],
  [
    "Escribe algo para buscar",
    "Enter something to search"
  ],
  [
    "Arrastra un enlace válido",
    "Drag a valid link"
  ],
  [
    "Ese elemento no es un enlace válido",
    "That item is not a valid link"
  ],
  [
    "Introduce una URL HTTPS válida.",
    "Enter a valid HTTPS URL."
  ],
  [
    "Pega una URL HTTPS válida o un iframe con src HTTPS.",
    "Paste a valid HTTPS URL or an iframe with an HTTPS src."
  ],
  [
    "Indica un ancho entre 120 y 1600 px, o un porcentaje hasta 100%.",
    "Enter a width from 120 to 1600 px, or up to 100%."
  ],
  [
    "Indica una altura entre 120 y 1600 px.",
    "Enter a height from 120 to 1600 px."
  ],
  [
    "Selecciona el código para copiarlo.",
    "Select the code to copy it."
  ],
  [
    "Código iframe copiado.",
    "Iframe code copied."
  ],
  [
    "No se pudo copiar automáticamente. Selecciona el código para copiarlo.",
    "Automatic copying failed. Select the code to copy it."
  ],
  [
    "Informe de auditoría descargado",
    "Audit report downloaded"
  ],
  [
    "Selecciona al menos un favorito 404 o inexistente",
    "Select at least one 404 or missing bookmark"
  ],
  [
    "Sin permiso para consultar las webs no se puede iniciar la auditoría",
    "The audit cannot start without permission to check websites"
  ],
  [
    "Fondo de pantalla eliminado",
    "Wallpaper removed"
  ],
  [
    "Fondo de pantalla actualizado",
    "Wallpaper updated"
  ],
  [
    "Escribe un título para la tarea",
    "Enter a title for the task"
  ],
  [
    "¿Quitar este elemento del proyecto?",
    "Remove this item from the project?"
  ],
  [
    "Escribe un nombre",
    "Enter a name"
  ],
  [
    "El recurso ya existe",
    "The resource already exists"
  ],
  [
    "Recurso añadido",
    "Resource added"
  ],
  [
    "Indica nombre, fecha y hora válidos",
    "Enter a valid name, date and time"
  ],
  [
    "Diaria",
    "Daily"
  ],
  [
    "Semanal",
    "Weekly"
  ],
  [
    "Mensual",
    "Monthly"
  ],
  [
    "Anual",
    "Yearly"
  ],
  [
    "Hoy",
    "Today"
  ],
  [
    "Calendario",
    "Calendar"
  ],
  [
    "Favorito",
    "Bookmark"
  ],
  [
    "Tarea",
    "Task"
  ],
  [
    "Nota",
    "Note"
  ],
  [
    "Texto",
    "Text"
  ],
  [
    "Enlace",
    "Link"
  ],
  [
    "Por defecto",
    "Default"
  ],
  [
    "Principal",
    "General"
  ],
  [
    "Aspecto",
    "Appearance"
  ],
  [
    "Búsqueda y sincronización",
    "Search and sync"
  ],
  [
    "Ayuda",
    "Help"
  ],
  [
    "Disponible",
    "Available"
  ],
  [
    "No concluyentes",
    "Inconclusive"
  ],
  [
    "Comprobados",
    "Checked"
  ],
  [
    "Disponibles",
    "Available"
  ],
  [
    "Todos los resultados",
    "All results"
  ],
  [
    "Solo 404 o inexistentes",
    "Only 404 or missing"
  ],
  [
    "Comprobar favoritos",
    "Check bookmarks"
  ],
  [
    "Proyectos activos",
    "Active projects"
  ],
  [
    "Proyectos completados",
    "Completed projects"
  ],
  [
    "Google Tasks es independiente y no sincroniza estos proyectos.",
    "Google Tasks is separate and does not synchronize these projects."
  ],
  [
    "Lee únicamente los códigos oficiales de Calculations.tools. Los equivalentes quedan desmarcados. Revisa y completa los títulos y descripciones en español antes de importar.",
    "Reads only official Calculations.tools embed codes. Equivalent tools are unchecked. Review and complete the Spanish titles and descriptions before importing."
  ],
  [
    "El código se conserva para que puedas editarlo después. El ancho acepta, por ejemplo, 100%, 360 o 640 px; se adapta al panel cuando falte espacio. En mosaico manual, ancho y altura actualizan el tamaño de la tarjeta. Se usa únicamente la dirección HTTPS del iframe.",
    "The code is kept for later editing. Width accepts values such as 100%, 360 or 640 px and fits the panel when space is limited. In manual mosaic, width and height resize the card. Only the iframe’s HTTPS address is used."
  ],
  [
    "Importante: cada resultado refleja únicamente el momento de la comprobación. Una web disponible hoy puede fallar mañana, y un error de hoy puede ser temporal. Los indicadores se guardan con su fecha y no caducan automáticamente; pasa el ratón sobre ellos para verla. Repite la auditoría cuando necesites información actualizada y vuelve a comprobar los enlaces antes de eliminarlos. Cambiar la URL invalida el resultado anterior. No se ejecutan auditorías periódicas automáticas.",
    "Important: results reflect only the time checked. An available site may fail tomorrow and an error may be temporary. Indicators retain their date and do not expire automatically; hover to see it. Run another audit for current information and recheck links before deleting. Changing the URL invalidates the previous result. There are no automatic scheduled audits."
  ],
  [
    "Solo los 404/410 y los vídeos de YouTube confirmados como inexistentes se pueden seleccionar para borrar. «No concluyentes» no significa que el enlace esté caído: la comprobación no pudo decidirlo por bloqueo del ISP/VPN, DNS, TLS, permisos, red, servidor, tiempo de espera o dirección local/especial. Esos enlaces se conservan.",
    "Only HTTP 404/410 links and YouTube videos confirmed as missing can be selected for deletion. “Inconclusive” does not mean a dead link: ISP/VPN blocking, DNS, TLS, permissions, network, server, timeout or local/special addresses prevented a decision. These links are preserved."
  ],
  [
    "No uses «Cargar sin empaquetar» sobre una carpeta distinta para actualizar: crearías otra instalación. Si no usas Git, descarga el ZIP de una Release, sustituye los archivos en la misma carpeta y después pulsa Recargar.",
    "Do not use “Load unpacked” on a different folder to update: this creates another installation. Without Git, download a Release ZIP, replace files in the same folder, then click Reload."
  ],
  [
    "DashboardDP guarda sus datos en el navegador. No opera un servidor propio ni recibe tus favoritos, tareas, notas ni calendarios. Las integraciones externas solo se conectan cuando la persona las configura y autoriza con el proveedor correspondiente.",
    "DashboardDP stores its data in your browser. It operates no server and receives no bookmarks, tasks, notes or calendars. External integrations connect only when configured and authorized with the provider."
  ],
  [
    "Los widgets iframe son enlaces elegidos por quien usa la extensión. Cada persona es responsable de revisar la procedencia y las condiciones del servicio que embeba.",
    "Iframe widgets are links chosen by the extension’s user. Each user is responsible for reviewing the source and terms of the embedded service."
  ],
  [
    "DashboardDP es gratuito y se mantiene de forma independiente. Si te resulta útil y quieres colaborar con su continuidad, puedes invitar al autor a un café mediante Ko-fi. La donación es completamente voluntaria y no desbloquea ni limita ninguna función.",
    "DashboardDP is free and independently maintained. If you find it useful, you can support its continuation by buying the author a coffee on Ko-fi. Donations are voluntary and neither unlock nor restrict features."
  ],
  [
    "Copyright © 2026 David (PraenaDP). DashboardDP se distribuye bajo GPL-3.0-only: puedes usarlo, estudiarlo, modificarlo y redistribuirlo, incluso comercialmente, siempre que las redistribuciones derivadas mantengan la misma licencia GPL y proporcionen su código fuente. Se entrega sin garantía.",
    "Copyright © 2026 David (PraenaDP). DashboardDP is distributed under GPL-3.0-only: you may use, study, modify and redistribute it, including commercially, provided derivative redistributions keep the same GPL license and provide their source code. Provided without warranty."
  ],
  [
    "# Título\n\nEscribe con **negrita**, listas o enlaces…",
    "# Heading\n\nWrite with **bold**, lists or links…"
  ],
  [
    "Vaciar Papelera",
    "Empty Trash"
  ],
  [
    "Renombrar ",
    "Rename "
  ],
  [
    "Eliminar ",
    "Delete "
  ],
  [
    "Cambiar estado de ",
    "Change status of "
  ],
  [
    "Ej: Trabajo",
    "E.g.: Work"
  ],
  [
    "Ej.: Trabajo diario",
    "E.g.: Daily work"
  ],
  [
    "Ej.: Mi calendario visual",
    "E.g.: My visual calendar"
  ],
  [
    "Ej.: Mapa del tiempo",
    "E.g.: Weather map"
  ],
  [
    "Ej.: Temporizador Pomodoro",
    "E.g.: Pomodoro timer"
  ],
  [
    "Ej: GitHub",
    "E.g.: GitHub"
  ],
  [
    "Ej.: trabajo, IA, pendiente",
    "E.g.: work, AI, pending"
  ],
  [
    "Ej: Sistemas",
    "E.g.: Systems"
  ],
  [
    "Ej.: Madrid",
    "E.g.: Madrid"
  ],
  [
    "Hemos detectado marcadores guardados en este navegador.",
    "We detected bookmarks saved in this browser."
  ],
  [
    "Elige una opción. Podrás seguir creando, editando e importando favoritos después.",
    "Choose an option. You can still create, edit and import bookmarks later."
  ],
  [
    "Si un enlace ya existe en el navegador, se vinculará sin crear un duplicado. Esta acción no sustituye los favoritos que ya tengas.",
    "Links already in the browser are linked without duplication. Existing bookmarks are not replaced."
  ],
  [
    "Decide en qué carpeta del navegador se guardarán los favoritos que crees o edites desde DashboardDP.",
    "Choose the browser folder for bookmarks created or edited in DashboardDP."
  ],
  [
    "Las categorías de DashboardDP se crearán dentro de esta carpeta cuando sea necesario.",
    "DashboardDP categories will be created inside this folder when needed."
  ],
  [
    "Los cambios realizados en DashboardDP se escribirán también en los marcadores de este navegador.",
    "Changes made in DashboardDP will also be written to this browser’s bookmarks."
  ],
  [
    "Esta elección se usa únicamente la primera vez y no elimina nada.",
    "This choice is used only the first time and deletes nothing."
  ],
  [
    "Los cambios que hagas directamente en el navegador se detectan y actualizan DashboardDP. Esta conexión solo trabaja con los marcadores de este navegador.",
    "Changes made directly in the browser are detected and update DashboardDP. This connection handles only this browser’s bookmarks."
  ],
  [
    "Comprueba el estado de tus favoritos directamente desde el navegador. Los resultados no salen de tu equipo.",
    "Check bookmark status directly from your browser. Results stay on your device."
  ],
  [
    "Activa Google Tasks API en el mismo proyecto OAuth y autoriza el alcance de tareas. Esta conexión no convertirá ni sincronizará proyectos locales.",
    "Enable Google Tasks API in the same OAuth project and authorize the tasks scope. This connection will not convert or synchronize local projects."
  ],
  [
    "Por privacidad, DashboardDP no lee directamente los perfiles de otros navegadores. Tú eliges el archivo HTML que exportes.",
    "For privacy, DashboardDP does not read other browser profiles directly. You choose an exported HTML file."
  ],
  [
    "Al seleccionarlo verás una vista previa. La integración suma los favoritos nuevos y conserva tus categorías, grupos, espacios y ajustes actuales.",
    "Selecting it opens a preview. Merging adds new bookmarks and preserves your current categories, groups, workspaces and settings."
  ],
  [
    "Elige el navegador desde el que quieres traer marcadores. Puedes repetir el proceso tantas veces como necesites.",
    "Choose the browser to import bookmarks from. You can repeat this as often as needed."
  ],
  [
    "Cada importación se integra con los favoritos que ya tienes: no sustituye ni borra tu biblioteca actual.",
    "Each import merges with existing bookmarks: it does not replace or delete your current library."
  ],
  [
    "Antes de integrar se descargará una copia de seguridad JSON.",
    "A JSON backup will be downloaded before merging."
  ],
  [
    "Restaurar reemplaza los datos actuales y no descarga otro JSON. Si quieres conservar el estado anterior, usa primero «Descargar estado actual». Las cuentas de Google y Microsoft requerirán renovar el acceso por seguridad.",
    "Restoring replaces current data without downloading another JSON. To keep the previous state, first use “Download current state”. Google and Microsoft accounts must be authorized again for security."
  ],
  [
    "La escritura de marcadores quedará desactivada. Los vínculos con el navegador de origen se descartarán: vuelve a elegir la carpeta de sincronización desde Ajustes después de restaurar.",
    "Bookmark writing will be disabled. Links to the source browser are discarded: choose the sync folder again in Settings after restoring."
  ],
  [
    "Restaurar reemplaza el estado actual tras confirmación. Exportar HTML, en Marcadores, solo guarda enlaces. Para actualizar, recarga la extensión: no la desinstales.",
    "Restore replaces the current state after confirmation. HTML export under Bookmarks saves links only. To update, reload the extension; do not uninstall it."
  ],
  [
    "Este archivo JSON guarda toda tu personalización: colores, ajustes, fondo guardado, favoritos, fijados y grupos, espacios, widgets y biblioteca, notas, tareas, eventos locales y proyectos con sus tableros.",
    "This JSON saves all customization: colors, settings, saved wallpaper, bookmarks, pinned items and groups, workspaces, widgets and library, notes, tasks, local events and projects with their boards."
  ],
  [
    "Guárdalo fuera de la carpeta de la extensión. Tras una reinstalación, usa Restaurar y selecciona este JSON. Exportar HTML solo guarda marcadores. Las sesiones y tokens de acceso no se incluyen: tendrás que reconectar las cuentas.",
    "Keep it outside the extension folder. After reinstalling, use Restore and select this JSON. HTML export saves bookmarks only. Sessions and access tokens are excluded; you must reconnect accounts."
  ],
  [
    "Vas a borrar por completo el Dashboard de este navegador. No se conservarán los ajustes ni el contenido.",
    "You are about to erase this browser’s entire Dashboard. Settings and content will not be preserved."
  ],
  [
    "Se borrarán favoritos, categorías, espacios, fondos, ajustes, tareas, eventos importados, notas y conexiones personales guardadas en esta extensión.",
    "Bookmarks, categories, workspaces, wallpapers, settings, tasks, imported events, notes and personal connections stored in this extension will be deleted."
  ],
  [
    "Antes de borrar, puedes descargar una copia completa con tus favoritos, espacios, fijados, ajustes, widgets, tareas, eventos, notas y tema.",
    "Before deleting, download a full backup of bookmarks, workspaces, pinned items, settings, widgets, tasks, events, notes and theme."
  ],
  [
    "Los elementos eliminados se conservan localmente durante 30 días. Puedes recuperarlos de forma individual.",
    "Deleted items remain locally for 30 days and can be restored individually."
  ],
  [
    "Vas a eliminar definitivamente todos los elementos de la Papelera. Esta acción no se puede deshacer.",
    "All items in Trash will be permanently deleted. This cannot be undone."
  ],
  [
    "Vaciar definitivamente",
    "Empty permanently"
  ],
  [
    "El primer botón usa automáticamente el color principal del tema actual.",
    "The first button automatically uses the current theme’s main color."
  ],
  [
    "El primer botón usa el color heredado de su categoría. También puedes introducir RGB o hexadecimal.",
    "The first button inherits the category color. You can also enter RGB or hexadecimal."
  ],
  [
    "Agrupa enlaces para abrir tus contextos de trabajo en un clic.",
    "Group links to open a working context with one click."
  ],
  [
    "Añade una URL HTTPS para mostrar un widget embebido en este panel.",
    "Add an HTTPS URL to display an embedded widget in this panel."
  ],
  [
    "Algunos sitios bloquean ser mostrados dentro de un iframe. El widget se abre aislado y DashboardDP no recibe sus datos.",
    "Some sites block iframe embedding. The widget runs separately; DashboardDP does not receive its data."
  ],
  [
    "Esta barra está vacía. Pulsa + para añadir Recientes, Estadísticas, Widgets, Notas visibles o un iframe propio.",
    "This panel is empty. Click + to add Recent, Statistics, Widgets, Visible notes or a custom iframe."
  ],
  [
    "Los widgets guardados permanecen aquí aunque quites su bloque de la Barra Personal. Puedes conservar distintas versiones del mismo servicio.",
    "Saved widgets stay here even after removing their panel block. You can keep different versions of the same service."
  ],
  [
    "Marca la estrella para reunir widgets en Favoritos sin cambiar su tipo. Puedes usar la vista previa sin agregarlos: DashboardDP no guarda su contenido y libera el iframe al cerrar. El servicio externo puede gestionar sus propios datos.",
    "Use the star to collect Favorites without changing their type. Use previews without adding widgets: DashboardDP does not save their content and releases the iframe on close. External services may manage their own data."
  ],
  [
    "Si no subes una imagen, se utiliza el favicon original de la web.",
    "If you do not upload an image, the website’s favicon is used."
  ],
  [
    "Un favorito puede pertenecer a un grupo de fijados. Al elegirlo, quedará fijado automáticamente.",
    "A bookmark can belong to a pinned group. Selecting one pins it automatically."
  ],
  [
    "Todavía no hay espacios de trabajo. Puedes crearlos desde la página de inicio.",
    "There are no workspaces yet. Create them from Home."
  ],
  [
    "Un favorito puede incluirse en varios espacios de trabajo.",
    "A bookmark can be included in multiple workspaces."
  ],
  [
    "Al cambiar el color del padre, esta subcategoría y sus enlaces se actualizarán automáticamente.",
    "Changing the parent color automatically updates this subcategory and its links."
  ],
  [
    "Entre 120 y 640 px. Se aplica cuando esta nota se muestra en la barra lateral.",
    "Between 120 and 640 px. Applies when this note appears in the side panel."
  ],
  [
    "Clic para seleccionar; Ctrl o Alt + clic para añadir o quitar varios.",
    "Click to select; Ctrl or Alt + click to add or remove multiple items."
  ],
  [
    "El favorito se conserva; solo se añade una referencia.",
    "The bookmark is preserved; only a reference is added."
  ],
  [
    "Elegir otro navegador",
    "Choose another browser"
  ],
  [
    "Importar desde otro navegador",
    "Import from another browser"
  ],
  [
    "Integrar favoritos",
    "Merge bookmarks"
  ],
  [
    "Integrar",
    "Merge"
  ],
  [
    "Usar el color del tema",
    "Use theme color"
  ],
  [
    "Selector de color",
    "Color picker"
  ],
  [
    "Color hexadecimal o RGB",
    "Hexadecimal or RGB color"
  ],
  [
    "Usar el color de la categoría",
    "Use category color"
  ],
  [
    "Nombre *",
    "Name *"
  ],
  [
    "El nombre es obligatorio",
    "Name is required"
  ],
  [
    "Buscar por nombre, dominio, etiqueta o ruta…",
    "Search by name, domain, tag or path…"
  ],
  [
    "Buscar favoritos para el espacio",
    "Search bookmarks for workspace"
  ],
  [
    "Favoritos organizados por categorías",
    "Bookmarks organized by category"
  ],
  [
    "No hay favoritos que coincidan con la búsqueda.",
    "No bookmarks match your search."
  ],
  [
    "Eliminar widget propio",
    "Delete custom widget"
  ],
  [
    "Arrastrar para cambiar la altura de la nota",
    "Drag to resize the note height"
  ],
  [
    "Arrastra para cambiar la altura",
    "Drag to change height"
  ],
  [
    "Agregar widget desde la biblioteca",
    "Add widget from library"
  ],
  [
    "Algunos servicios bloquean la incrustación.",
    "Some services block embedding."
  ],
  [
    "Se detecta del iframe si existe",
    "Detected from the iframe if available"
  ],
  [
    "Eliminar favorito",
    "Delete bookmark"
  ],
  [
    "Eliminar categoría",
    "Delete category"
  ],
  [
    "Confirmar eliminación",
    "Confirm deletion"
  ],
  [
    "Buscar por nombre, categoría o dirección…",
    "Search by name, category or address…"
  ],
  [
    "URL inválida",
    "Invalid URL"
  ],
  [
    "Icono del favorito",
    "Bookmark icon"
  ],
  [
    "Subir imagen",
    "Upload image"
  ],
  [
    "Usar icono de la web",
    "Use website icon"
  ],
  [
    "Descripción (opcional)",
    "Description (optional)"
  ],
  [
    "Breve descripción…",
    "Brief description…"
  ],
  [
    "Etiquetas (separadas por comas)",
    "Tags (comma-separated)"
  ],
  [
    "Estado",
    "Status"
  ],
  [
    "Favorito guardado",
    "Saved bookmark"
  ],
  [
    "Guardar para después",
    "Save for later"
  ],
  [
    "Color (opcional)",
    "Color (optional)"
  ],
  [
    "Grupo de fijados",
    "Pinned group"
  ],
  [
    "Sin grupo fijado",
    "No pinned group"
  ],
  [
    "Usar el color de la categoría superior",
    "Use parent category color"
  ],
  [
    "Actualizar DashboardDP sin perder datos",
    "Update DashboardDP without losing data"
  ],
  [
    "Cómo usar esta guía",
    "How to use this guide"
  ],
  [
    "Ajustes, pestañas y guardado",
    "Settings, tabs and saving"
  ],
  [
    "Crear, abrir y editar un favorito",
    "Create, open and edit a bookmark"
  ],
  [
    "Vistas, búsqueda y orden",
    "Views, search and sorting"
  ],
  [
    "Categorías, subcategorías y etiquetas",
    "Categories, subcategories and tags"
  ],
  [
    "Fijados y grupos",
    "Pinned items and groups"
  ],
  [
    "Copias, importación y restauración",
    "Backups, import and restore"
  ],
  [
    "Marcadores nativos y auditoría",
    "Browser bookmarks and auditing"
  ],
  [
    "Tareas y calendario",
    "Tasks and calendar"
  ],
  [
    "Notas adhesivas y Markdown",
    "Sticky notes and Markdown"
  ],
  [
    "Barras y vistas de panel",
    "Panels and layouts"
  ],
  [
    "Widgets, iframes y clima",
    "Widgets, iframes and weather"
  ],
  [
    "Tema, fondo y saludo",
    "Theme, wallpaper and greeting"
  ],
  [
    "Búsqueda web, permisos y datos",
    "Web search, permissions and data"
  ],
  [
    "Apoyo voluntario",
    "Voluntary support"
  ],
  [
    "Importaciones y auditorías seguras",
    "Safe imports and audits"
  ],
  [
    "Índice de ayuda",
    "Help index"
  ],
  [
    "Licencia y derechos",
    "License and rights"
  ],
  [
    "Privacidad y seguridad",
    "Privacy and security"
  ],
  [
    "Uso de widgets propios",
    "Using custom widgets"
  ],
  [
    "Apoyar DashboardDP",
    "Support DashboardDP"
  ],
  [
    "Abrir Ko-fi",
    "Open Ko-fi"
  ],
  [
    "Revisar biblioteca",
    "Review library"
  ],
  [
    "Actividad reciente",
    "Recent activity"
  ],
  [
    "Cerrar notificación",
    "Dismiss notification"
  ],
  [
    "Confirmación final",
    "Final confirmation"
  ],
  [
    "Sí, eliminar todo",
    "Yes, delete everything"
  ],
  [
    "Restablecer datos",
    "Reset data"
  ],
  [
    "Crear copia y continuar",
    "Back up and continue"
  ],
  [
    "Continuar sin copia",
    "Continue without backup"
  ],
  [
    "¿Cómo quieres empezar?",
    "How would you like to start?"
  ],
  [
    "Empezar de cero",
    "Start from scratch"
  ],
  [
    "Añadir mis favoritos actuales",
    "Add my current bookmarks"
  ],
  [
    "Copiar favoritos al navegador",
    "Copy bookmarks to browser"
  ],
  [
    "Copiar favoritos",
    "Copy bookmarks"
  ],
  [
    "Sincronización con marcadores del navegador",
    "Browser bookmark synchronization"
  ],
  [
    "Leyendo las carpetas de marcadores…",
    "Reading bookmark folders…"
  ],
  [
    "Carpeta de destino",
    "Destination folder"
  ],
  [
    "Activar sincronización bidireccional",
    "Enable two-way sync"
  ],
  [
    "Marcadores que ya existen en este navegador",
    "Bookmarks already in this browser"
  ],
  [
    "Añadirlos ahora a DashboardDP",
    "Add them to DashboardDP now"
  ],
  [
    "No importarlos; detectar solo los nuevos",
    "Do not import; detect new ones only"
  ],
  [
    "Copiar favoritos actuales al navegador",
    "Copy current bookmarks to browser"
  ],
  [
    "Guardar sincronización",
    "Save synchronization"
  ]
];
