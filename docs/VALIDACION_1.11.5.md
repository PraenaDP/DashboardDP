# Alcance de la validación de 1.11.5

Comprobaciones locales del 25 de noviembre de 2026, con Brave y perfiles aislados. No se han utilizado perfiles ni datos personales para las pruebas o capturas.

- Regresión de importación, edición, recuperación, seguridad de contenido, navegación, idiomas, selección múltiple y borradores. Los servicios de red se bloquean o simulan en estas comprobaciones.
- Catálogo: 1.309 herramientas únicas y 129 referencias PhET conservadas. Campos públicos limitados a identificación de catálogo, título, descripción, tipo, URL, dimensiones, iframe y traducciones ES/EN. Sin favoritos personales, notas, tareas, proyectos, cuentas o coordenadas privadas.
- Copia completa y restauración de la biblioteca real en un perfil de extensión aislado, conservación de los iframes y traducciones, favorito de prueba y permanencia después de recargar.
- Cuota efectiva de localStorage: la biblioteca completa se guarda y restaura. En la medición hubo 3.276.800 caracteres adicionales de margen antes de alcanzar la cuota; no es un límite garantizado para todos los equipos ni para bibliotecas personales ampliadas.
- La biblioteca no abre iframes al listar herramientas. Una medición de apertura estuvo entre 0,3 y 0,8 segundos; depende del equipo. No se ha certificado un escenario físico de 8 GB de RAM.
- Ayuda: 46 artículos en cada idioma, mismos identificadores y pasos. Buscador, lectura, navegación relacionada y recuerdo del último artículo comprobados. La comprobación de diccionarios no demuestra por sí sola que nunca pueda quedar una cadena dinámica sin traducir.
- Capturas reales de la interfaz con ejemplos ficticios. Los estados de auditoría de las imágenes son simulados. No se incluyen imágenes del contenido de simulaciones PhET como promoción.

## Servicios y atribuciones

El catálogo distribuye referencias a servicios externos, no sus archivos ejecutables. Se muestran créditos junto a los widgets, sin ocultar los del proveedor. Las condiciones externas no quedan sustituidas por GPL. La disponibilidad, resultados y condiciones pueden cambiar; consulta siempre al proveedor para usos distintos del personal no comercial descrito por el autor.

Referencias revisadas:

- [PhET: licencia y atribución CC BY-NC 4.0](https://phet.colorado.edu/en/licensing/).
- [Windy: condiciones, apartado de widgets incrustables](https://account.windy.com/agreements/windy-general-terms-of-use).
- [Google Maps: compartir e incrustar mapas](https://support.google.com/maps/answer/144361).
- [NASA’s Eyes: integración mediante iframes](https://science.nasa.gov/eyes/museums/).
- [ToolkitsApp: integración y crédito visible](https://www.toolkitsapp.com/fr/embed).
- [HIFreeTools: widgets](https://www.hifreetools.com/widgets).
- [METER.net: código responsive y condiciones](https://www.metercustom.net/).
- [HaoWordTool: códigos iframe](https://haowordtool.com/embed/).
- [Calculations.tools: herramientas incrustables](https://calculations.tools/embed-tools).
- [VClock: widgets y línea de crédito](https://vclock.eu/widgets/).
- [Widget.us.com: herramientas para integrar](https://widget.us.com/).
- [GOAT Lab: integración](https://tools.goat-lab.net/en/embed/).
- [TechCompare: integración y Powered by](https://www.techcompare.app/embed/).

No se ha validado en vivo cada URL ni un pago de Ko-fi. Las pruebas no son una certificación de seguridad, de exactitud de calculadoras o de aceptación en Chrome Web Store. No se publica en la tienda con esta entrega.
