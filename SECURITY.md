# Seguridad de DashboardDP

El [alcance de validación de 1.11.5](docs/VALIDACION_1.11.5.md) describe las comprobaciones, evidencias y límites de esta distribución. La revisión detecta y corrige fallos; no acredita seguridad total ni autorización para publicar en una tienda.

## Principios aplicados

- Las páginas de la extensión usan una política de seguridad de Manifest V3: solo ejecutan scripts incluidos en la propia extensión.
- Las notas de formato aceptan un subconjunto saneado de HTML. Los enlaces solo pueden ser HTTP/HTTPS y las imágenes inline se limitan a PNG, JPEG o WebP.
- Los widgets personales exigen HTTPS y se muestran dentro de un iframe aislado.
- La auditoría excluye direcciones locales, privadas y especiales reconocidas y no sigue redirecciones; solicita el permiso de red al iniciarla. No garantiza detectar dominios que resuelvan a una dirección privada.
- Ningún secreto, token, contraseña, copia de datos o exportación de marcadores debe entrar en el repositorio.

## Validación del proyecto

Las comprobaciones de mantenimiento se conservan en `tools/`, separadas de las instrucciones de instalación. Incluyen revisión estática y pruebas de comportamiento en perfiles aislados con conexiones externas bloqueadas. No requieren que quien utiliza DashboardDP ejecute scripts.

Una comprobación por nombres de funciones no demuestra seguridad. Los informes deben distinguir lo probado, los servicios simulados, los fallos y los escenarios pendientes. La revisión histórica no cubre automáticamente las funciones añadidas después ni implica aprobación de Chrome Web Store.

## Informar de un problema

Si detectas una vulnerabilidad, utiliza el [reporte privado de vulnerabilidades de GitHub](https://github.com/PraenaDP/DashboardDP/security/advisories/new), habilitado en este repositorio. También puedes entrar en **Security → Advisories → Report a vulnerability**. Necesitas iniciar sesión en GitHub; no hace falta publicar un correo de contacto.

Incluye la versión afectada, el navegador, los pasos mínimos para reproducir el problema y su posible impacto. No adjuntes tu copia completa, contraseñas, tokens ni datos personales. No publiques detalles de explotación en una incidencia pública. El mantenedor debe revisar el informe y coordinar la corrección y divulgación antes de publicar los detalles.

Para errores ordinarios, consultas y propuestas que no sean vulnerabilidades, utiliza [Issues](https://github.com/PraenaDP/DashboardDP/issues).
