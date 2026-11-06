# Privacidad de DashboardDP

DashboardDP funciona en el navegador de quien lo instala. No requiere cuenta propia ni envía los favoritos, tareas, notas, espacios o widgets a un servidor de DashboardDP.

## Datos locales

La configuración, la biblioteca de favoritos, las notas, los resultados de auditoría, la Papelera y las preferencias se almacenan en el perfil local del navegador. La aplicación usa localStorage para el estado del Dashboard y almacenamiento de la extensión para datos de integración. Las conexiones de calendario conservan tokens de acceso/renovación en el perfil: no se incluyen en la Copia completa y no cuentan con cifrado independiente de la protección del navegador y del sistema operativo. Las copias descargadas son JSON sin cifrar y contienen información personal.

## Conexiones que decide la persona usuaria

- **Auditoría de favoritos:** pide permiso opcional para consultar HTTP/HTTPS únicamente al iniciar una auditoría. Cada dirección se consulta desde el navegador para clasificar su disponibilidad. No se envía la lista a un servicio de DashboardDP.
- **Sugerencias de búsqueda:** al activarlas se envía al buscador elegido únicamente el texto que se está escribiendo.
- **Calendarios:** Google Calendar y Microsoft 365 se conectan solo tras configurar y autorizar la cuenta. Las sesiones no se incluyen en las copias completas.
- **Widgets:** el iframe indicado por la persona se carga desde su propio proveedor. DashboardDP solo admite URLs HTTPS y los muestra aislados.
- **Meteorología:** el widget consulta Open-Meteo para la ciudad elegida.
- **Favicons:** se intenta usar el almacén local; si no tiene el icono, puede consultarse `/favicon.ico` en la web guardada. El proveedor recibe esa petición y la dirección IP como en cualquier conexión web.

Los proveedores externos pueden registrar IP y datos técnicos. “Sin servidor propio” no significa “sin conexiones externas”. Una web guardada puede incluir información sensible en su dirección: al auditarla se consulta esa URL directamente. La auditoría omite direcciones privadas reconocidas y no sigue redirecciones, pero no garantiza detectar un dominio que resuelva a una IP privada.

## Permisos

El permiso de marcadores permite consultar el árbol para configurar la integración; la escritura se activa al elegir sincronización bidireccional. Alarmas y notificaciones se usan para recordatorios. El permiso de favicon permite recuperar iconos del navegador. `activeTab` permite obtener los datos de la página elegida mediante una acción del usuario, sin solicitar el permiso general `tabs`. Los permisos HTTP/HTTPS de auditoría se piden opcionalmente al usarla; si se conceden permanecen concedidos hasta revocarlos en la configuración del navegador.

## Copias y eliminación

La Papelera guarda hasta 250 entradas durante un máximo de 30 días. La caducidad, la eliminación individual definitiva y Vaciar Papelera eliminan ese contenido. Para trasladar o conservar información, descarga una Copia completa antes de restablecer o desinstalar la extensión. Al restaurar una copia, vuelve a configurar la carpeta de sincronización: los identificadores del perfil de origen se descartan.

## Publicación

No publiques archivos JSON de copia, exportaciones de marcadores, capturas con datos privados ni credenciales OAuth en un repositorio.
