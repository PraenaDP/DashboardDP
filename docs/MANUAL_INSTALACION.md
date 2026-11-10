# Manual de instalación

DashboardDP se instala localmente como extensión sin empaquetar. No requiere crear una cuenta, enviar favoritos a un servidor ni instalar un programa adicional.

## Navegadores compatibles

- Brave
- Google Chrome
- Microsoft Edge

Firefox no es compatible con esta versión. No intentes cargar la carpeta en Firefox.

## Antes de empezar

1. Descarga el ZIP de una versión desde la página **Releases** del repositorio.
2. Descomprímelo en una carpeta permanente de tu equipo. No uses una carpeta temporal o de Descargas que vayas a eliminar.
3. Comprueba que la carpeta elegida contiene `manifest.json`, `dashboard` y este repositorio.

## Brave

1. Abre `brave://extensions`.
2. Activa **Modo desarrollador**.
3. Pulsa **Cargar sin empaquetar**.
4. Elige la carpeta que contiene `manifest.json`.
5. Abre una pestaña nueva: DashboardDP aparecerá como tu nueva pestaña.

## Google Chrome

1. Abre `chrome://extensions`.
2. Activa **Modo de desarrollador**.
3. Pulsa **Cargar sin empaquetar**.
4. Elige la carpeta que contiene `manifest.json`.
5. Abre una pestaña nueva.

## Microsoft Edge

1. Abre `edge://extensions`.
2. Activa **Modo de desarrollador**.
3. Pulsa **Cargar sin empaquetar**.
4. Elige la carpeta que contiene `manifest.json`.
5. Abre una pestaña nueva.

## Primer inicio y privacidad

- Al primer inicio puedes elegir importar los marcadores actuales o comenzar con una biblioteca vacía.
- Tus favoritos, notas, tareas, widgets y ajustes se guardan en el perfil local del navegador.
- Antes de importar, restaurar o restablecer, descarga una **Copia completa** desde **Ajustes → Datos**.
- Las conexiones de Google Calendar y Microsoft 365 son opcionales y solo se activan si las configuras personalmente.

## Actualizar DashboardDP

1. Abre **Ajustes → Ayuda → Actualizaciones desde GitHub** y pulsa **Comprobar actualizaciones**. El navegador puede solicitar permiso únicamente para consultar `api.github.com`.
2. Si hay una Release nueva, pulsa **Abrir actualización**. DashboardDP no descarga ni reemplaza archivos por sí mismo.
3. Descarga una **Copia completa** desde **Ajustes → Datos**.
4. Descarga el ZIP de la Release y descomprímelo fuera de la carpeta actual.
5. Sustituye los archivos de la carpeta de la extensión por los de la nueva versión, conservando exactamente la carpeta elegida al instalarla.
6. Vuelve a `brave://extensions`, `chrome://extensions` o `edge://extensions` y pulsa el icono de recargar de DashboardDP.
7. Abre una nueva pestaña y revisa que tus datos sigan presentes.

Los favoritos, notas, tareas y ajustes se guardan en el perfil local del navegador, no entre los archivos de la extensión. Si usas **Cargar sin empaquetar** sobre una carpeta distinta, el navegador puede tratarla como otra instalación; en ese caso restaura la Copia completa en la instalación nueva. Mantener la misma carpeta y usar Recargar conserva la instalación y reduce ese riesgo.
