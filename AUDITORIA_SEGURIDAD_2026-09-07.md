# Auditoría de seguridad y preparación para publicación

Fecha: 7 de septiembre de 2026. Versión examinada inicialmente: 1.10.47. Correcciones: 1.10.48.

## Dictamen

DashboardDP es candidato a una beta controlada de Chromium. Esta revisión no lo certifica como libre de vulnerabilidades ni acredita el cumplimiento integral de una tienda o de toda legislación aplicable. La publicación estable debe esperar a los pendientes descritos abajo.

La afirmación anterior de que solo faltaban pruebas en otros navegadores era demasiado amplia: el antiguo verificador comprobaba sintaxis y presencia de funciones, pero no comportamiento seguro. En esta auditoría se encontraron fallos reproducibles adicionales y se añadieron pruebas ejecutables.

## Alcance y método

- Revisión de manifiesto, proceso de fondo, popup, aplicación, notas, importaciones, Papelera, auditoría de enlaces y flujo de solicitudes del calendario.
- Pruebas de caja blanca con entradas adversarias y regresión funcional en la extensión real, cargada en Edge 152.0.4191.66 sin interfaz y con perfiles nuevos aislados.
- Datos, favoritos, carpetas y credenciales exclusivamente ficticios. No se leyó ni modificó el perfil personal del autor.
- Las conexiones HTTP/HTTPS del navegador de prueba se bloquearon. Las respuestas de calendario se simularon; no se atacaron servidores externos.
- Inspección de capturas de Inicio, Ajustes y Ayuda. Comprobación de anchuras 1440, 1024 y 390 píxeles. No equivale a una auditoría visual exhaustiva ni WCAG.
- La herramienta de navegador de la guía no estaba instalada; se utilizó Playwright disponible localmente para cargar la extensión en Edge.

## Hallazgos y tratamiento

| ID | Prioridad | Evidencia e impacto | Tratamiento en 1.10.48 |
| --- | --- | --- | --- |
| SEC-01 | Alta | Una copia completa conservaba `sourceNativeId`, carpeta destino y escritura activa de otro perfil. En un perfil aislado, restaurar una copia preparada y sincronizar cambió el título de un marcador existente a `OVERWRITTEN BY IMPORT`. | Las importaciones externas pierden los identificadores nativos. Restaurar una copia desactiva la escritura y obliga a elegir de nuevo el destino. La prueba anterior cambia de sobrescritura confirmada a bloqueada. |
| SEC-02 | Media | El filtro de auditoría aceptaba `::1`, `fd00::1`, direcciones de enlace local y nombres internos. Además seguía redirecciones automáticamente. | Se omiten direcciones privadas/especiales reconocidas, credenciales en URL y nombres sin dominio; no se siguen redirecciones. Limitación DNS indicada abajo. |
| SEC-03 | Media | El saneador permitía clases CSS de la aplicación, incluida `modal-overlay`. Los colores importados podían interpolar declaraciones CSS adicionales. Esto permitía alterar o tapar la interfaz; no se demostró ejecución de JavaScript por este vector. | Lista acotada de clases Markdown y normalización de colores antes de mostrarlos o restaurarlos desde Papelera. |
| SEC-04 | Media | La validación JSON aceptaba colecciones con elementos nulos, tipos incorrectos y ciclos entre categorías. Una importación podía romper la migración o el renderizado. | Validación de forma, tipos relevantes, identificadores, profundidad y ciclos; límites de tamaño y rechazo de claves de prototipo. |
| SEC-05 | Media, robustez de datos | La restauración individual enviaba al navegador una copia distinta del favorito visible; el identificador creado no se guardaba en ese objeto. Las carpetas se creaban en paralelo. | Se sincroniza el objeto restaurado y se reconstruyen árboles secuencialmente. Pruebas con API real de marcadores: un favorito, un padre, un hijo y dos enlaces, sin duplicar carpetas. |
| SEC-06 | Endurecimiento | Las solicitudes autenticadas del calendario no restringían centralmente el origen de destino. Microsoft usa enlaces de paginación devueltos por el proveedor. No se demostró una exfiltración en servicio real. | Lista de orígenes por proveedor, rechazo previo a obtener/enviar token, sin cookies y sin redirecciones en solicitudes autenticadas. |
| SEC-07 | Endurecimiento | Los mensajes internos tenían controles de origen desiguales y la URL OAuth del puente no estaba acotada a proveedores. No había mensajes externos declarados ni un exploit externo demostrado. | Validación del remitente, destinos OAuth, identificadores de recordatorios y límite de apertura por mensaje. |
| SEC-08 | Menor privilegio | El permiso `tabs` daba acceso general a propiedades sensibles, aunque el código solo necesita crear pestañas y capturar la elegida mediante acción del usuario. | Se sustituye por `activeTab`. Abrir una pestaña sigue funcionando en prueba real sin `tabs`. |
| SEC-09 | Distribución | El título HTML inicial conservaba el nombre David y los textos afirmaban compatibilidad con Firefox sin prueba completa. | Título neutro y documentación con compatibilidad pendiente explícita. |

Además, la política CSP bloquea scripts no empaquetados, objetos, cambios de URL base y formularios de la página principal; los marcos se restringen a HTTPS. Se comprobó que un script inline inyectado no se ejecuta en la extensión real.

## Pruebas reproducibles

Resultado de la ejecución final: **40/40 comprobaciones superadas**, sin errores JavaScript no controlados en los recorridos probados. Comprobación estática de todos los scripts y manifiesto superada. El resultado incluye la versión 1.10.48 con permiso `activeTab` y CSP reforzada.

`tools/security-regression.cjs` contiene las pruebas dinámicas. Requiere Node.js y Playwright instalado en el entorno de desarrollo; no añade dependencias a la extensión distribuida.

```powershell
node tools/security-regression.cjs . C:\Temp\DashboardDP-audit
```

Puede configurarse `DASHBOARD_TEST_BROWSER` con la ruta del ejecutable Chromium/Edge. El script crea su propio perfil aislado, bloquea conexiones externas, cierra el navegador al terminar y deja resultados JSON y capturas en el directorio elegido. Conservar el directorio permite revisar evidencia; sus perfiles son de prueba, no deben publicarse con la extensión.

Las comprobaciones incluyen inyección de HTML/CSS, CSP real, Markdown interactivo y persistencia, esquemas de iframe, JSON malformado, ciclos e identificadores, exclusión de credenciales en copias, límites de destinos autenticados, direcciones privadas, recuperación de marcadores y árboles, paginación de 160 resultados, selección segura y diálogos. La aprobación de estas pruebas cubre únicamente sus casos.

El script PowerShell `tools/verify-extension.ps1` sigue siendo una comprobación estática previa; no sustituye el anterior.

## Riesgos residuales y pendientes antes de publicación estable

1. **Red y DNS:** el filtro trabaja sobre el nombre de la URL. Un dominio público puede resolver a una IP privada o cambiar su resolución. No se probó DNS rebinding y no se garantiza aislamiento de la red local. La auditoría debe usarse sobre favoritos de confianza. Los enlaces HTTP y las comprobaciones GET pueden tener efectos definidos por el servidor; un estado de auditoría no garantiza que una web sea segura.
2. **Calendarios reales:** falta recorrer Google y Microsoft con cuentas de prueba: consentimiento, renovación, revocación, errores, calendarios de solo lectura, zonas horarias y sincronización bidireccional. Los tokens se guardan en el perfil del navegador; no se ha añadido cifrado independiente ni se protege frente a una cuenta de sistema comprometida.
3. **Concurrencia y almacenamiento:** falta estrés prolongado con varias pestañas, cuotas agotadas, miles de notas/imágenes, cierres durante guardado e importaciones grandes. Es aconsejable evolucionar a persistencia centralizada con revisión de conflictos antes de ampliar mucho más el producto.
4. **Compatibilidad:** Edge tiene el recorrido parcial automatizado descrito; Brave conserva la experiencia previa del autor. Chrome, Linux y Firefox no quedan verificados por estas pruebas. El manifiesto actual usa un service worker; Firefox requiere adaptar y comprobar el mecanismo de fondo y los permisos antes de ofrecer su paquete.
5. **Accesibilidad y visual:** faltan zoom 200 %, teclado completo y foco de todos los diálogos, lectores de pantalla, contraste medido, todos los skins, traducciones y contenido extremo. Las capturas revisadas se ven coherentes, pero no prueban perfección visual.
6. **Distribución:** concretar licencia, contacto privado de seguridad y soporte, página pública de privacidad, capturas limpias y declaración exacta de uso de datos/permisos. La aceptación final corresponde a cada tienda. No se ha publicado ni firmado un paquete.

## Mejoras priorizadas

Primero cerrar los pendientes anteriores. Después priorizar persistencia resistente a conflictos y cuotas, métricas locales de rendimiento, carga diferida de widgets, pruebas de navegación por teclado y mantenimiento modular de la aplicación. No hace falta rediseñar toda la interfaz para publicar una beta; la fiabilidad de los datos tiene prioridad.

## Referencias oficiales consultadas

- [Chrome Web Store: políticas, privacidad, permisos y revisión](https://developer.chrome.com/docs/webstore/program-policies/policies): exige declaraciones exactas, permisos necesarios y pruebas antes de enviar.
- [Chrome: Tabs API](https://developer.chrome.com/docs/extensions/reference/api/tabs) y [activeTab](https://developer.chrome.com/docs/extensions/develop/concepts/activeTab): crear pestañas no requiere el permiso general `tabs`; `activeTab` limita el acceso a una acción del usuario.
- [Mozilla: background](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/background): diferencias del mecanismo de fondo entre navegadores.
- [Mozilla: políticas de complementos](https://extensionworkshop.com/documentation/publish/add-on-policies/) y [consentimiento de transmisión de datos](https://extensionworkshop.com/documentation/develop/firefox-builtin-data-consent/): revisar declaración y consentimiento antes de distribuir para Firefox.
