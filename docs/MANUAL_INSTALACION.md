# Instalar, actualizar y recuperar DashboardDP

## Instalar en Brave, Chrome o Edge

Descarga el ZIP de [Releases](https://github.com/PraenaDP/DashboardDP/releases) y descomprímelo en una carpeta permanente. No necesitas Git ni ejecutar comandos. Firefox no es compatible con esta distribución.

1. Abre `brave://extensions`, `chrome://extensions` o `edge://extensions`.
2. Activa **Modo desarrollador**.
3. Pulsa **Cargar sin empaquetar** y elige la carpeta que contiene `manifest.json`.
4. Abre una pestaña nueva. Elige incorporar los marcadores actuales o comenzar con una biblioteca vacía.

Conserva la carpeta y no la muevas después de instalar. Esta distribución manual no procede de Chrome Web Store.

## Actualizar

1. En **Ajustes → Acerca de**, comprueba si hay una nueva versión. La consulta a GitHub es opcional.
2. Descarga una **Copia completa** desde **Ajustes → Datos** y guárdala fuera de la carpeta de la extensión.
3. Descarga la nueva release y cierra las pestañas del dashboard.
4. Sustituye los archivos dentro de **la misma carpeta ya cargada**.
5. Pulsa **Recargar** en la página de extensiones y abre una pestaña nueva.
6. Revisa favoritos, biblioteca, notas, tareas y personalización.

No desinstales la extensión ni cargues la descarga temporal como otra instalación. Los datos viven en el perfil del navegador; una segunda instalación puede tener otro almacenamiento.

## Cambiar de equipo, navegador o perfil

1. Guarda una copia completa y una segunda copia privada en otra ubicación.
2. Instala DashboardDP en el destino.
3. En **Ajustes → Datos → Copias y restauración**, selecciona **Restaurar copia completa** y revisa la confirmación.
4. Comprueba biblioteca, grupos, espacios, tareas, proyectos y notas.
5. Elige nuevamente la carpeta de marcadores y activa escritura bidireccional solo si lo deseas. Los identificadores del perfil anterior se descartan para evitar escribir en otra carpeta.
6. Autoriza otra vez las conexiones de calendario: sus tokens no viajan en el JSON.

La restauración completa reemplaza el estado de DashboardDP; no es una combinación selectiva. Exporta antes el estado del destino si contiene cambios que quieras conservar.

## Respaldo externo recomendado

Exporta después de cambios importantes y antes de actualizar o restablecer. Mantén una copia reciente y otra anterior en una ubicación privada: almacenamiento externo o una carpeta con historial de versiones. El JSON no está cifrado. No uses GitHub como almacén de copias personales.

Comprueba periódicamente la restauración en un perfil de navegador separado, sin activar escritura de marcadores ni conectar cuentas. Mantén intacto tu perfil habitual. Una copia que no se ha abierto y revisado no debe darse por validada.

## Si algo no aparece

- Verifica navegador, perfil y carpeta cargada.
- Recarga la extensión; no la desinstales.
- Antes de restaurar una copia antigua, exporta el estado actual.
- Consulta la [guía de uso](GUIA_DE_USO.md) y [Privacidad](../PRIVACIDAD.md).
