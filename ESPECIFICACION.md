# Especificación funcional de DashboardDP

Este documento es la memoria de producto de DashboardDP. Sirve para orientar futuras mejoras y para comprobar que un cambio no rompe comportamientos ya acordados.

## Propósito y distribución

DashboardDP es una extensión local de nueva pestaña orientada a Chromium. La validación principal de uso corresponde a Brave; Edge tiene pruebas parciales automatizadas. Firefox necesita un paquete adaptado y validación específica. Se prepara como carpeta descargable desde GitHub y no usa un servidor propio de DashboardDP.

La fuente de verdad del proyecto es esta carpeta: contiene `manifest.json`, `dashboard/`, las guías y la licencia. No se deben subir datos personales, exportaciones de favoritos, fondos, calendarios ni credenciales.

## Principios de producto

- Datos locales por defecto. Favoritos, categorías, grupos, espacios, tareas, notas, preferencias y widgets se guardan en el navegador.
- Integraciones externas voluntarias. Google Calendar y Microsoft se autorizan directamente con el proveedor y con credenciales que crea cada usuario avanzado.
- No se solicitan contraseñas ni client_secret. Los tokens OAuth necesarios para calendarios se conservan en el perfil local y se excluyen de la copia completa.
- Las importaciones de marcadores integran sin eliminar lo existente. La restauración completa sustituye el estado tras confirmación; debe recomendar copia previa sin forzar otra descarga inmediatamente después de restaurar.
- Los reinicios totales advierten y permiten hacer copia de seguridad antes de borrar.
- Toda función visible debe estar disponible en los idiomas configurados o identificada como pendiente de traducción antes de publicar una versión.

## Favoritos y organización

### Contrato de seguridad desde 1.10.48

La restauración e importación de archivos no puede reutilizar identificadores nativos de otro perfil, tampoco desde la Papelera. Restaurar una copia desactiva la escritura y exige volver a elegir la carpeta. Una sincronización iniciada sobre un estado sustituido debe descartarse. La recuperación desde Papelera opera sobre los objetos insertados en el estado y crea árboles nativos secuencialmente.

Los archivos de importación tienen un máximo de 25 MB. Se rechazan estructuras inválidas, claves de prototipo, identificadores duplicados y ciclos de categorías antes del guardado. Los colores se validan como valores CSS y las notas solo admiten clases propias de Markdown. No se permiten declaraciones CSS adicionales mediante campos de color.

La auditoría excluye direcciones privadas/especiales reconocidas, omite URLs con credenciales y consulta sin cookies ni referente. No sigue redirecciones: se clasifican como restringidas para revisión manual. Esto no garantiza aislamiento ante resolución DNS privada. Las solicitudes autenticadas del calendario solo pueden dirigirse al origen permitido del proveedor, sin redirecciones. Los mensajes del proceso de fondo validan remitente y destino OAuth.

La verificación estática no acredita seguridad. Las pruebas dinámicas reproducibles y pendientes están en `AUDITORIA_SEGURIDAD_2026-09-07.md` y `tools/security-regression.cjs`. Deben repetirse cuando cambien estos límites o flujos, utilizando únicamente perfiles y datos de prueba.

Un favorito tiene URL, nombre, descripción, etiquetas, estado, categoría, orden, icono y color opcional. Al crearlo o editarlo se puede:

- Elegir una categoría dentro de un selector jerárquico y legible.
- Aplicar color heredado, color de paleta, hexadecimal o RGB.
- Añadirlo a un solo grupo de fijados; al hacerlo queda fijado.
- Añadirlo a uno o varios espacios de trabajo.

Cuando no existe un icono manual, DashboardDP solicita primero al almacén local de favicons del navegador una versión de alta resolución, con un objetivo de hasta 128 px. Si el navegador o la web no ofrecen esa imagen, prueba `/favicon.ico` y finalmente muestra las iniciales. Esta cadena se aplica en todos los menús y vistas, no envía las URLs a servicios externos y nunca sustituye un icono elegido manualmente.

Las categorías aceptan anidación, orden, colapsado, color propio o heredado y color de tema por defecto. Los colores deben verse en categorías y en la representación de sus enlaces, excepto en grupos fijados, que mantienen su estilo propio.

La búsqueda de favoritos se sitúa únicamente encima del encabezado **Categorías** en la barra lateral izquierda. Al buscar, el resultado se representa en el área central, como cualquier otro listado de favoritos. La búsqueda web se mantiene visible en la barra superior en todas las vistas, incluido Fijados. Puede usar Google, DuckDuckGo, Bing, Brave o YouTube. Sus sugerencias son voluntarias y están desactivadas inicialmente: al activarlas, el navegador solicita permiso solo para el buscador elegido y la consulta se envía directamente a ese buscador, nunca a un servidor de DashboardDP. Las sugerencias de la barra web no se mezclan con los favoritos locales. Si falta el permiso, la propia lista de sugerencias muestra un aviso accionable para concederlo.

El asistente **Importar desde otro navegador** guía la integración de favoritos de Brave, Google Chrome, Microsoft Edge, Mozilla Firefox, Vivaldi, Opera, Safari u otro navegador. Cada navegador se exporta primero a un archivo HTML elegido expresamente por la persona. DashboardDP no accede directamente a perfiles ni datos de otros navegadores. Todas las importaciones se suman a la biblioteca actual, conservan los datos existentes y descargan una copia completa antes de confirmarse. De forma predeterminada cada origen se organiza bajo `Importado · Nombre del navegador`, una opción que la persona puede desactivar antes de seleccionar el archivo.

La sincronización de marcadores nativos es bidireccional dentro del navegador que ejecuta la extensión. Desde Ajustes, la persona elige una carpeta destino y activa expresamente la escritura. Los favoritos creados, editados, movidos o eliminados en DashboardDP se reflejan en esa biblioteca nativa; las altas, cambios, movimientos y eliminaciones nativas se detectan e integran en DashboardDP. Cada cambio nativo deja además una señal persistente en el almacenamiento de la extensión: si el proceso en segundo plano estaba suspendido, la pestaña estaba oculta o ya había otra sincronización en curso, el cambio se recupera al reactivarse la vista o se procesa en una segunda pasada. La opción de copiar los favoritos actuales al navegador es voluntaria y crea solo los que todavía no estén vinculados. No existe sincronización automática entre perfiles de navegadores distintos: la copia completa es el mecanismo local para trasladar la biblioteca entre ellos.

## Paneles y widgets

Las barras izquierda y derecha se redimensionan y conservan su anchura: izquierda 210–520 px; derecha 260–900 px con límite según la ventana. En pantallas estrechas se aplica el comportamiento móvil. La ampliación temporal no modifica la anchura habitual.

El panel derecho admite hasta nueve barras numeradas y nueve bloques por barra. La primera es fija, con Estadísticas y herramientas; no contiene Recientes ni notas. La segunda es editable pero no eliminable y contiene inicialmente las notas visibles. Las posteriores se eliminan solo con confirmación; se quitan sus bloques, no la biblioteca ni las notas originales. La migración de la barra personal anterior conserva sus bloques.

La cabecera se funde con el panel sin una superficie independiente. El nombre editable tiene un borde discreto y anchura máxima de 420 px. Los tres puntos se alinean al extremo derecho y reúnen edición del nombre, añadir widget, distribución y eliminación permitida. No hay fila adicional titulada Widgets ni papelera suspendida. Los números tienen scroll horizontal y navegación por teclado; el scroll respeta el tema.

Solo se montan los iframes de la barra activa. Cambiar de barra debe liberar los anteriores. Cada barra conserva contenidos, orden y distribuciones independientes para vista lateral y ampliada. Los modos son vertical, cuadrícula y mosaico manual; este último permite mover y redimensionar bloques. Restablecer distribución afecta solo al diseño actual, no elimina bloques. La cuadrícula amplia agrupa hasta tres columnas y tres filas con separaciones compactas.

Reproductor, Clima y Calendario pueden abrirse simultáneamente y fluyen hacia abajo con scroll. Sus botones muestran texto si hay espacio e iconos en una barra estrecha. Los controles permanecen visibles, no se desplazan en hover y mantienen foco accesible.

La biblioteca dispone de tipos, búsqueda, orden, tarjetas y tabla, favoritos independientes del tipo, edición, código y vista previa. Cada widget puede añadirse a barras diferentes, pero no duplicarse en una misma barra mediante el selector; las ubicaciones derivan de los bloques reales. Retirar un bloque no elimina la entrada guardada.

Se conserva íntegro el código iframe como texto y no se sustituyen dimensiones sin una edición explícita. La ejecución no inserta ese texto como HTML privilegiado: extrae una URL HTTPS válida y aplica aislamiento y capacidades del anfitrión. Los estilos visuales permitidos no autorizan scripts, srcdoc ni acceso al contexto de la extensión. Una vista previa se monta al abrirse y se libera al cerrar por botón, Escape o fondo; no añade el widget.

El catálogo público y la biblioteca personal son entidades distintas. Una instalación limpia puede inicializar un catálogo aprobado; una biblioteca existente no se sobrescribe automáticamente. La restauración normal añade únicamente ausentes y respeta equivalencias de URL; restaurar originales modificados requiere confirmación y guarda su versión previa en la papelera. No publicar una exportación completa como catálogo.

Espacios, Fijados y Grupos y vistas centrales mantienen contenedores legibles en todos los temas y con wallpaper. Los grupos desplegados heredan su color con un matiz y una × que solo cierra. Los tres puntos sustituyen los contadores y el lápiz; el hover aumenta brillo sin desplazar iconos.

## Espacios, grupos y apertura de enlaces

Los espacios de trabajo seleccionan muchos enlaces en una lista jerárquica, con categorías y subcategorías colapsables. Al abrir un espacio, los enlaces deben abrirse en pestañas independientes; el navegador puede requerir permiso explícito para abrir varias pestañas.

Los grupos de fijados se comportan como accesos a aplicaciones y son independientes del color de categoría. En la vista de iconos se presentan como bloques compactos de color, con forma de carpeta si se elige ese tipo y con icono configurable (carpeta, trabajo, nube, vídeo, música o cuadrícula); mantienen el nombre visible. Los favoritos fijados sin grupo usan exactamente el mismo icono fijo que la vista Fijados: sin tarjeta exterior, sin indicador de categoría y sin cambiar de tamaño cuando cambia el ancho de la ventana. Todo icono de favorito, con independencia del menú que lo contenga, muestra una leyenda flotante con el nombre y la URL completa al pasar el ratón; la misma información aparece al enfocarlo mediante teclado. En Inicio se puede arrastrar un favorito fijado directamente sobre un grupo para incorporarlo; el cambio se refleja también en la edición del grupo.

En Inicio, **Fijados y Grupos** y **Espacios de trabajo** tienen criterios de orden independientes y persistentes: Personalizado, Nombre A–Z, Nombre Z–A, Fecha reciente a antigua y Fecha antigua a reciente. Personalizado permite arrastrar y soltar todos los elementos de la sección y conserva el resultado tras recargar. En Fijados y Grupos el orden mezcla iconos sueltos y carpetas en una única secuencia y se mantiene en las vistas de iconos, lista y tarjetas. Para no perder la organización por grupos, al arrastrar un favorito sobre la zona central de una carpeta se incorpora a ella; soltarlo hacia uno de sus bordes cambia el orden.

Los espacios de trabajo se muestran como accesos compactos horizontales que solo pasan a otra línea cuando falta espacio. Cada espacio permite elegir color e icono desde su edición. La barra personal ampliada usa todo el ancho útil de la ventana, sin un límite artificial de contenido.

El saludo de Inicio es opcional: se puede ocultar, elegir su tipografía (incluida Neon Love) y fijar su tamaño entre 14 y 34 px desde Ajustes > Principal.

Las notas adhesivas tienen dos tipos explícitos: Formato (editor visual con color, familia tipográfica, tamaño e imágenes) y Markdown (texto fuente, vista previa y tareas `- [ ]`). La fuente y el tamaño elegidos en Formato deben respetarse tanto en el editor como en las tarjetas y en la edición en línea de Notas visibles. El tipo elegido y el texto fuente se conservan sin conversiones silenciosas. Las tareas Markdown pueden marcarse desde las tarjetas o Notas visibles y el cambio queda guardado. En las Notas visibles, cada tarea se representa mediante una casilla nativa real del navegador, asociada a su texto, para que resulte visible, clicable y accesible en todos los temas. La ayuda se presenta en una ventana amplia con índice de árbol colapsable y panel de lectura; el índice y el lector tienen desplazamiento independiente para que ningún tema quede recortado. Debe mantenerse actualizada cuando se añadan o cambien funciones. En **Ajustes → Ayuda** debe existir un bloque de **Actualizaciones desde GitHub**: al pulsar Comprobar actualizaciones solicita de forma opcional y bajo demanda acceso solo a `https://api.github.com/*`, consulta exclusivamente la última Release pública de `PraenaDP/DashboardDP`, compara su versión con `chrome.runtime.getManifest().version` y comunica el resultado. Nunca descarga, instala, sobrescribe archivos ni abre un enlace sin una pulsación posterior de la persona. La guía integrada debe indicar que se descarga una Copia completa, se sustituyen los archivos dentro de la misma carpeta ya cargada y se pulsa Recargar en la página de extensiones; cargar otra carpeta crea una instalación separada y requiere restaurar la copia.

Todas las ventanas modales se cierran al pulsar y soltar deliberadamente sobre su fondo exterior, además de sus controles de cierre explícitos. Un gesto iniciado dentro de la ventana —incluida la selección de texto en campos, áreas de texto o editores— nunca debe cerrarla aunque el puntero termine fuera del formulario al soltarlo.

La fuente de Markdown debe cargarse siempre como contenido real de los campos multilínea, tanto en el editor central como en la edición en línea. Nunca se debe usar el atributo HTML `value` para restaurar un textarea, porque puede vaciarse visualmente y provocar pérdida de la fuente al guardar.

## Tareas, notas y calendario

Tareas locales es un tablero independiente de eventos. La creación se realiza con + Nueva tarea dentro de Por hacer, mediante Enter o ↵, sin otro modal; tras añadir queda listo para la siguiente. Mover entre columnas y cambiar estado conserva el resto de propiedades. Las eliminaciones seleccionadas o totales piden confirmación y usan la papelera; no borran eventos de Google o Microsoft.

Las notas conservan sus tipos Formato y Markdown, color, fuente, tamaño, imágenes optimizadas y fuente Markdown. Las casillas se pueden marcar en las vistas y guardan su estado. Redimensionar un visualizador no debe convertir ni vaciar la fuente.

Calendario se mantiene separado de tareas. Año muestra meses y días sin tarjetas de tareas; mes muestra contadores y festividades; semana y día muestran eventos personales. La agenda diaria sitúa bloques por hora con fondo de color suave, borde identificativo y calendario mensual desplazable a la derecha. Si no consta duración, se representa una hora: no se certifica esa duración en el proveedor.

El selector compartido ofrece gregoriano, chino, hebreo, islámico civil, persa y budista; cambia meses, años y navegación en la vista principal y compacta. Se respetan meses intercalares y el día actual. No altera instantes de eventos ni sus vínculos de proveedor. La semana sigue siendo lunes–domingo; el islámico civil no certifica observaciones religiosas. Los campos nativos de fecha y hora usan el calendario gregoriano del navegador.

Maya es una ventana independiente de curiosidad: año gregoriano con equivalencias en Cuenta Larga, correlación GMT y referencia del Smithsonian. No representa un calendario maya de gestión de eventos ni afecta a la selección de la agenda.

Las festividades se consultan voluntariamente a Nager.Holidays por país, región y año, sin enviar eventos personales. Se guardan resultados de hasta seis consultas anuales; los errores son visibles. Son una capa de consulta, no eventos personales. No garantizar santoral, cobertura municipal o fechas religiosas locales. Un año alternativo puede abarcar dos años gregorianos y requiere datos de ambos para cobertura íntegra.

Google Calendar y Microsoft 365 son conexiones personales opcionales. Se respetan calendarios de solo lectura, eventos de día completo y destinos editables. Google recibe start.date/end.date para día completo; para horas se validan RFC 3339 y fechas antiguas expresadas en segundos. Los tokens son locales y no viajan en copias. La importación ICS integra eventos sin borrar los existentes, compara identificadores y debe probarse desde el control realmente visible de Conexiones y sincronización. La guía especializada es INTEGRACIONES_CALENDARIO.md.

## Ajustes, ayuda y acerca de

Ajustes tiene tamaño consistente, navegación izquierda y contenido derecho desplazable: Principal, Aspecto, Búsqueda y sincronización, Datos, Ayuda y Acerca de. Solo se muestra la sección elegida.

Principal agrupa identidad, saludo, idioma y comportamiento de paneles con leyendas a la izquierda y controles a la derecha. Aspecto sitúa temas en columna y fondo completo a la derecha, con tipografía separada por una línea. Los temas Default, Vercelin, Youtubin, Grafanin, Cloudflerin, Spotin, Xakatin y Catppuccin mantienen variantes claras y oscuras y atribuciones aplicables.

Default en tipografía conserva la fuente del tema. Arial, Verdana, Roboto, Inter y otras opciones usan fuentes instaladas y alternativas; no hay descargas tipográficas. El saludo tiene ajuste independiente y tamaño entre 14 y 34 px.

Datos agrupa marcadores, copias/restauración, mantenimiento, biblioteca, papelera y zona de peligro. La copia completa incluye datos personales, biblioteca y papelera pero excluye tokens. Se valida estructura, límite de 25 MB, duplicados, claves inseguras y ciclos antes de restaurar. Restaurar reemplaza el estado, elimina vínculos nativos de otro perfil y desactiva escritura; no debe descargar otra copia automáticamente ni repetir el primer inicio tras F5.

Ayuda integra 46 artículos organizados en trece capítulos, con índice y lector desplazables sin scroll exterior redundante. Las fuentes son docs/GUIA_DE_USO.md y docs/USER_GUIDE.md; help-content.js se genera desde ambas. Incluye búsqueda en el cuerpo, temas relacionados, historial de navegación y último artículo recordado. No declarar cobertura total de interfaz por traducir únicamente los artículos o sus títulos.

Acerca de es independiente, con versión real del manifiesto, autoría, perfil de PraenaDP, repositorio, GPL-3.0-only y atribuciones de terceros. Ko-fi permanece sin enlace activo hasta configurarlo. Las actualizaciones se consultan bajo demanda a api.github.com y no descargan ni instalan archivos automáticamente. La distribución manual requiere copia previa, misma carpeta y Recargar, nunca desinstalar para actualizar.

Los dos idiomas mantenidos son es y en. Una configuración antigua con otro idioma migra a español. Las cadenas UI recientes se mantienen en i18n-extra.js e i18n-release.js; los contadores usan variables nombradas. Los campos personales no se reescriben por un cambio de idioma. Una traducción de widget se usa por campo solo si translationSource coincide con el original vigente; de lo contrario aparece el original. Exportar, restaurar y editar deben conservar este contrato. No llamar a servicios externos de traducción ni cargar todos los iframes por disponer de más idiomas.

Las ventanas se cierran solo al pulsar y soltar deliberadamente sobre el fondo, o con sus controles. Una selección de texto iniciada dentro nunca debe cerrar por terminar fuera. Los menús de tres puntos son flotantes junto al botón, sin fondo desenfocado, y se cierran al pulsar fuera o Escape.

## Privacidad, seguridad y licencia

DashboardDP no opera servicios propios ni recibe favoritos, tareas, notas o calendarios. Los permisos del navegador se solicitan para las funciones declaradas y las integraciones solo piden los permisos del proveedor que la persona acepte.

La licencia es GPL-3.0-only. El autor conserva el copyright; las versiones derivadas distribuidas deben mantenerse bajo GPLv3 y ofrecer su código fuente. Ver `LICENSE.md` y `NOTICE.md`.

## Contrato obligatorio de ayuda y documentación

Una función no se considera terminada ni lista para publicar mientras su uso no esté explicado y revisado. Este contrato se aplica tanto a una función grande como a un botón, icono, selector, atajo, ajuste o cambio de comportamiento visible.

Antes de cerrar cualquier cambio funcional se debe cumplir lo siguiente:

1. **Ayuda integrada:** crear o actualizar el tema correspondiente de `Ajustes → Ayuda y guía de uso`. Debe indicar la ubicación exacta del control, el texto o icono que se pulsa, los pasos en orden, el resultado esperado y cómo deshacer o abandonar la acción cuando sea posible.
2. **Consecuencias y límites:** documentar permisos del navegador, conexiones externas, confirmaciones, persistencia, datos que se modifican, operaciones no reversibles y límites conocidos. Nunca ocultar una acción de borrado o sincronización detrás de una descripción genérica.
3. **Especificación:** actualizar este documento con el comportamiento acordado, criterios de compatibilidad y reglas de seguridad que afecten a la función.
4. **Documentación pública:** actualizar `README.md` cuando cambie una capacidad visible, la privacidad, los permisos, la instalación o el flujo principal. Si existe una guía especializada afectada, actualizarla también.
5. **Comprobación de la guía:** recorrer el flujo usando únicamente la ayuda integrada y confirmar que el nombre, icono, ubicación y resultado descritos coinciden con la interfaz real en los idiomas publicados.
6. **Registro de proyecto:** reflejar el hito y su versión en la nota de proyecto antes de declarar una entrega como estabilizada.

La revisión de este contrato es obligatoria en cada versión. Si una función aún no tiene documentación completa, debe marcarse como pendiente y no presentarse como terminada.

## Criterios de comprobación antes de publicar

1. Recargar una instalación local sin errores en la página de extensiones.
2. Crear, editar, importar y exportar favoritos sin eliminar los existentes.
3. Confirmar categorías jerárquicas, grupos, espacios y apertura de varias pestañas.
4. Comprobar ambos redimensionadores y su persistencia tras reiniciar el navegador.
5. Alternar entre hasta nueve barras, proteger primera y segunda frente al borrado, conservar hasta nueve bloques por barra y distribuciones independientes tras reiniciar.
6. Pegar una URL HTTPS y un código iframe completo; verificar que se detectan `src`, título, ancho y altura, que el código sigue disponible al editar y el aviso cuando un sitio no permite iframe.
7. Confirmar que la copia completa exporta y restaura favoritos, categorías, fijados, espacios, preferencias, tema, fondo, widgets, tareas, eventos y notas; verificar que las conexiones de calendario se restauran sin tokens y piden renovar el acceso.
8. Confirmar que el restablecimiento total incluye tareas, eventos, notas, widgets y preferencias.
9. Probar ayuda, acerca de, licencia, pie y enlace de apoyo configurado/no configurado.
10. Revisar todos los textos nuevos en español, inglés, catalán, euskera, alemán, francés, italiano, portugués y gallego.
11. Comprobar la guía de OAuth contra Google/Microsoft antes de cambiar la publicación o el flujo de conexión.
12. Comprobar que la búsqueda de favoritos permanece en la barra izquierda, que sus resultados aparecen en el centro y que la búsqueda web se ve en Inicio, Fijados y cualquier listado. Activar sugerencias, aprobar o rechazar el permiso y verificar ambos casos.
13. Importar archivos HTML de al menos dos navegadores distintos y confirmar que los favoritos se integran sin borrar los existentes, con una copia completa previa.
14. Configurar una carpeta de marcadores nativos y comprobar altas, edición, movimiento y borrado en ambos sentidos; crear también un favorito con el Dashboard oculto y otro mientras se procesa una sincronización, volver a la pestaña y confirmar que ambos aparecen sin duplicarse. Confirmar que la copia inicial solo se realiza tras la acción explícita de la persona.
15. Marcar una nota como visible en su barra, ajustar su altura, editarla y comprobar scroll; abrir simultáneamente Reproductor, Clima y Calendario en la primera barra.
16. Ante cualquier función o botón nuevo, revisar su CSS en modo claro y oscuro de cada skin disponible. Los botones deben mantener contraste suficiente, un borde o superficie perceptible y estados distinguibles de reposo, foco, hover, activo y deshabilitado. Todo SVG insertado dentro de `.btn` hereda un tamaño base acotado de `1em` por `1em` (máximo `1.25em`); ninguna ventana, sección o botón nuevo puede depender del tamaño SVG por defecto del navegador. Las excepciones visuales deben declarar explícitamente sus dimensiones en su componente y conservar la proporción.
17. Probar el mosaico manual: entrar desde la cuadrícula compacta y comprobar que todos los bloques aparecen desde el primer renderizado, sin necesidad de arrastrar ninguno. Mover y redimensionar varios bloques, editar el ancho y alto de un iframe, recargar el navegador y confirmar que la composición se conserva. Ajustar independientemente barra lateral y vista amplia, cambiar entre ambas y verificar que ninguna sobrescribe la otra. Usar **Restablecer mosaico** y comprobar que vuelve la cuadrícula compacta de la vista actual sin eliminar bloques.
18. Comprobar que Inicio identifica la zona como **Fijados y Grupos**, que la carpeta de grupo usa el color elegido, que los iconos sueltos coinciden con Fijados y que el arrastre a una carpeta actualiza la pertenencia. En Inicio, Fijados, grupos desplegados, categorías, Recientes, Más usados y resultados, verificar que cada favorito en vista de iconos muestra nombre y URL al pasar el ratón y al recibir foco de teclado.
19. Comprobar el orden alfabético de Categorías, que no hay bloque Recientes en la primera barra y que escribir en una nota visible no ejecuta atajos globales.
20. Comprobar que Ajustes tiene una ventana amplia con pestañas que ocultan el resto de las secciones y que los controles de las barras usan iconos, leyendas accesibles y estados diferenciados. En iconos, verificar tamaño fijo, ausencia de tarjeta de categoría, coincidencia total entre Inicio y Fijados, y carpetas de grupo sin SVG superpuesto.
21. En Inicio, probar de forma independiente los cinco criterios de orden de Fijados y Grupos y de Espacios de trabajo. En Personalizado, intercalar iconos y carpetas, reordenar espacios, recargar y confirmar la persistencia; comprobar también que el centro de una carpeta sigue aceptando favoritos y que sus bordes sirven para cambiar de posición.
22. En Chromium, comprobar con favoritos que publiquen iconos de varios tamaños que DashboardDP solicita hasta 128 px y evita ampliar el archivo básico de 16 px cuando el almacén del navegador dispone de una versión mejor. Verificar también las alternativas `/favicon.ico` e iniciales, y que un icono manual conserva la prioridad.
23. Ejecutar la auditoría con una URL disponible, una 404 real, una que requiera VPN, una que agote el tiempo, una local y vídeos de YouTube público, privado e inexistente. Verificar clasificación, filtros, selección exclusiva de candidatos, exportación Markdown y cancelación sin borrado. En una copia de prueba, confirmar que el borrado masivo exige confirmación y que, con sincronización bidireccional, elimina el marcador nativo; simular un fallo nativo y comprobar que el favorito se conserva.
24. Tras completar la auditoría, cerrar y recargar DashboardDP y verificar que las insignias de estado permanecen en tarjetas y listas, que no aparecen en la vista exclusiva de iconos y que el texto emergente identifica estado, detalle y fecha. Editar la URL de un favorito y confirmar que su insignia desaparece. Comprobar también todos los sentidos del selector general: nombre A–Z/Z–A, uso mayor/menor y acceso reciente/antiguo.
25. En Inicio, Todos los favoritos, Fijados, categorías y grupos desplegados, pulsar una insignia auditada desde tarjeta y lista y comprobar que el resultado contiene solo ese estado. Limpiar el filtro, pulsar una etiqueta de categoría y confirmar que muestra exactamente sus favoritos. Repetir con teclado y verificar que la web de la tarjeta no se abre al activar ninguna etiqueta.
26. Para toda función, control o comportamiento nuevo de la versión, comprobar el Contrato obligatorio de ayuda y documentación: localizar su explicación en Ayuda, seguir los pasos sin conocimiento previo, validar resultado, permisos y efectos descritos, y confirmar la actualización correspondiente en esta especificación, README y nota del proyecto.
27. Abrir Ayuda con un tema de contenido extenso, desplazar el índice y el lector de manera independiente, y comprobar que se puede alcanzar el último paso sin que la ventana exterior oculte contenido.
28. Crear varios iframes y confirmar que aparecen en Biblioteca de widgets desde el selector Añadir bloque y desde Ajustes → Datos. Quitar uno de la barra, recuperarlo desde la biblioteca, crear una segunda versión del mismo servicio, copiar su código y confirmar que ambos códigos persisten. Eliminar una entrada de la biblioteca y verificar que sus bloques activos no se eliminan. Confirmar también que la copia completa conserva la biblioteca y que una instalación limpia no contiene URLs personales.
29. Abrir Ajustes → Datos y confirmar que cada acción aparece únicamente en su tarjeta: Marcadores del navegador, Copias y restauración, Revisión y mantenimiento, Widgets guardados o Zona de peligro. Verificar que cada tarjeta explica el alcance de sus acciones y que Restablecer datos se mantiene visualmente separado.
30. Eliminar un favorito, grupo, espacio, widget, tarea y nota de una copia de prueba. Confirmar que aparece «Deshacer» y que cada elemento llega a Ajustes → Datos → Revisión y mantenimiento → Papelera. Restaurar individualmente, recargar y comprobar su persistencia; en un favorito, verificar también la recuperación de pertenencias a grupo y espacio. Comprobar que una entrada con más de 30 días no aparece y que Vaciar papelera pide una decisión consciente antes de eliminar definitivamente.
31. Ejecutar `tools/verify-extension.ps1` antes de preparar una versión y comprobar que valida Manifest V3, CSP, sintaxis, saneamiento de notas, Papelera y contrato de documentación. Con más de 160 resultados auditados, comprobar que el informe muestra el primer bloque y permite cargar los siguientes sin bloquear la ventana.
