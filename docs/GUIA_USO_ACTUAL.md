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

## Árbol lateral de favoritos — 1.11.2

Despliega una categoría con su flecha para ver subcarpetas y enlaces. Arrastra un enlace a una carpeta de Fijados en Inicio: se fija y asocia al grupo sin cambiar su categoría original. Las carpetas de Fijados vacías también se muestran aunque aún no haya favoritos fijados.

Al pasar sobre un enlace del árbol aparecen los iconos de Renombrar y Eliminar (también accesibles con teclado). Renombrar abre un campo de nombre; pulsa Guardar o Enter. Eliminar solicita confirmación y usa la Papelera. Ambas acciones reutilizan la sincronización nativa existente: para actualizar también el navegador debes activar escritura bidireccional en Ajustes > Búsqueda y sincronización. Si está desactivada, el renombrado lo advierte y solo cambia DashboardDP. Los fallos de escritura nativa se notifican; no se garantiza sincronización si faltan permisos o vinculación del marcador.

Validación: sintaxis JavaScript y pruebas enfocadas con datos simulados de creación/visibilidad de grupos y encaminamiento de renombrado/borrado a la sincronización. No se modificaron marcadores reales durante las pruebas.

## Biblioteca unificada — 1.11.3

El botón de añadir bloques abre directamente la Biblioteca de widgets. Filtra por tipo (Por defecto agrupa Recientes, Estadísticas, Widgets integrados y Notas visibles) y busca por título, web o descripción. El formulario permite descripción y tipo personalizado. Selecciona Nombre A–Z, Nombre Z–A o Últimos modificados para ordenar; la elección se guarda en los ajustes. La vista Lista o Tarjetas se recuerda por tipo.

Agregar añade el bloque a tu barra respetando el límite de bloques y evitando repetir bloques nativos. Los iconos permiten copiar código, editar y eliminar con leyendas; el ojo abre una previsualización grande con cierre × sin ampliar la tarjeta. El código iframe no se muestra en la selección; una descripción vacía no ocupa lugar. Los bloques nativos no tienen código iframe para copiar ni pueden eliminarse del catálogo integrado.

Las vistas previas externas se cargan solo al abrirlas, no son capturas guardadas. Se mantiene sandbox uniforme, sin excepciones de origen. Un proveedor puede bloquear chrome-extension:// mediante frame-ancestors aunque su iframe funcione en una web normal: no se eliminan sus cabeceras ni se emplean proxies. La excepción temporal de ToolkitsApp fue retirada.

Las entradas personales permanecen en el navegador y en las copias completas del usuario. No se publica el catálogo personal ni se incorporan nuevos widgets externos al proyecto en esta versión: se integrarán posteriormente por petición expresa. La descripción conserva texto y saltos de línea, no admite HTML enriquecido.

Validación: sintaxis JavaScript y orden alfabético natural con acentos/números. Persistencia de descripción/tipo comprobada previamente con datos simulados. No se declara validación visual completa ni compatibilidad de todos los proveedores externos.

## Corrección de biblioteca — 1.11.4

En el selector de vista elige **Tabla** (antes Lista). Las columnas Widget, Web, Descripción y Acciones permanecen alineadas; una web o descripción vacía conserva su celda. Los botones están a la derecha. En pantallas estrechas puedes desplazarte horizontalmente.

Para editar, pulsa el lápiz del widget, cambia los campos y pulsa Guardar cambios. La edición conserva el identificador de la entrada seleccionada aunque coincida con otro widget; no actualiza otra entrada por error. Probado con datos simulados, incluida normalización JSON de descripción y tipo. No equivale a una restauración real de sesión ni a una prueba visual completa.
