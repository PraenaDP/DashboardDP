# Calendario: guía personal y local

DashboardDP se instala desde GitHub y funciona localmente en el navegador. No hay una cuenta central de DashboardDP ni un servidor propio que reciba tus eventos. La conexión con Google Calendar o Microsoft es personal, opcional y está controlada por cada usuario.

## Recorrido completo

1. Descarga DashboardDP desde GitHub y descomprime el ZIP.
2. Guarda la carpeta donde quieras conservarla.
3. En el navegador, activa **Modo desarrollador**, pulsa **Cargar sin empaquetar** y elige esa carpeta.
4. Usa el dashboard normalmente sin crear ninguna cuenta.
5. Si quieres Google Calendar, crea tu propia credencial OAuth de tipo **Aplicación web**, pega en Google la URI que muestra DashboardDP y después pega el Client ID en el Dashboard.

No necesitas modificar, descargar ni reemplazar `manifest.json` para conectar el calendario.

## Opción sencilla: archivos `.ics`

No requiere ninguna cuenta ni permisos:

1. Abre **Gestor de tareas → Calendario**.
2. Pulsa **Importar `.ics`** para añadir uno o varios calendarios.
3. Pulsa **Exportar `.ics`** para llevar tus tareas a Google Calendar, Outlook u otra aplicación.

Los eventos importados se añaden sin borrar los existentes. Google suele exportar varios calendarios dentro de un ZIP; extrae primero los archivos `.ics`.

## Conexión personal con Google Calendar

### 1. Abre el asistente de DashboardDP

1. Abre DashboardDP desde su icono junto a la barra del navegador.
2. Entra en **Gestor de tareas → Calendario**.
3. En Google Calendar, pulsa **Configurar mi conexión**.
4. Deja abierta esa ventana: muestra una **URI de redirección** que necesitarás copiar exactamente.

La URI tendrá un formato parecido a este:

```text
https://identificador-de-tu-extension.chromiumapp.org/
```

### 2. Crea el proyecto personal en Google

1. Entra en [Google Cloud Console](https://console.cloud.google.com/).
2. Crea un proyecto personal o selecciona uno que controles.
3. En **APIs y servicios**, activa **Google Calendar API**.
4. Abre **Google Auth platform** y configura la pantalla de consentimiento.
5. Para pruebas personales, añade tu propia cuenta de Google como usuario de prueba si Google lo solicita.

### 3. Crea la credencial correcta

1. Abre **Credenciales → Crear credenciales → ID de cliente OAuth**.
2. En **Tipo de aplicación**, elige **Aplicación web**.
3. Ponle un nombre, por ejemplo `DashboardDP personal`.
4. En **URI de redirección autorizados**, añade exactamente la URI mostrada por DashboardDP, incluida la barra `/` final.
5. Guarda la credencial y copia el **Client ID**, que termina en `.apps.googleusercontent.com`.

No elijas **Extensión de Chrome** para Brave. Brave tiene una incompatibilidad conocida con el método de identidad de Google usado por ese tipo de cliente. Tampoco copies ni introduzcas el `client secret`: DashboardDP no lo necesita ni lo guarda.

### 4. Conecta la cuenta

1. Vuelve al asistente de DashboardDP.
2. Pega el Client ID en el campo correspondiente.
3. Pulsa **Guardar y conectar**.
4. Acepta el permiso del navegador.
5. Selecciona tu cuenta y acepta únicamente los permisos de calendario mostrados por Google.

Google puede mostrar el aviso de aplicación no verificada en un proyecto personal en pruebas. Comprueba que la aplicación y el proyecto sean los tuyos antes de continuar.

### Funcionamiento y renovación

El navegador se comunica directamente con Google. El Client ID, los calendarios elegidos y el estado de la conexión se conservan localmente al cerrar o reiniciar Brave. El token de acceso de Google es temporal, pero DashboardDP intenta renovarlo silenciosamente al volver a abrirse.

Si Google ha cerrado tu sesión o necesita una confirmación, la configuración no se pierde: el botón circular de la barra superior se vuelve ámbar y pasa a **Renovar acceso y sincronizar**. Púlsalo, confirma tu cuenta si Google lo solicita y DashboardDP recuperará la conexión usando el mismo Client ID. No tienes que repetir la configuración de Google Cloud.

No existe un servidor de DashboardDP ni un `client_secret` oculto.

### Sincronización inteligente

DashboardDP comprueba los cambios de forma ligera:

- al abrir el Dashboard, si han pasado al menos cinco minutos desde la última sincronización;
- al abrir el Gestor de tareas o entrar en su vista Calendario;
- al volver a la pestaña después de usar otra aplicación;
- mediante un intervalo configurable de 15, 30 o 60 minutos mientras el Dashboard esté abierto y visible.

El intervalo predeterminado es de 30 minutos y puede desactivarse en **Ajustes → Sincronización inteligente del calendario**. El botón **Sincronizar ahora** permanece disponible y omite la espera mínima.

Google Calendar utiliza sincronización incremental: después de la primera lectura, DashboardDP conserva un `syncToken` por calendario y solicita únicamente los eventos creados, modificados o eliminados desde la consulta anterior. Si Google invalida ese token, DashboardDP realiza automáticamente una sincronización completa nueva.

Los eventos de **día completo** se mantienen como eventos de día completo en ambas direcciones. DashboardDP también valida y normaliza las fechas antes de enviarlas, evitando que una fecha antigua o incompleta detenga toda la sincronización. Si una vinculación creada por una versión anterior no conserva la marca de día completo, DashboardDP consulta el evento original y reintenta la actualización con el formato correcto. Los calendarios con permiso de solo lectura —por ejemplo, algunos calendarios de festivos o cumpleaños— se pueden consultar e importar, pero no aparecen como destinos para crear tareas y DashboardDP no intenta modificarlos.

La sincronización automática nunca abre una ventana visible de inicio de sesión. Primero intenta recuperar el permiso en segundo plano. Si Google exige intervención, DashboardDP conserva la conexión y espera a que pulses **Renovar acceso y sincronizar**.

Para desconectar, usa **Desconectar** dentro del gestor de calendarios. También puedes revocar el acceso desde [Seguridad de tu cuenta de Google](https://myaccount.google.com/permissions).

## Microsoft Outlook / Microsoft 365 personal

1. Registra una aplicación en [Microsoft Entra](https://entra.microsoft.com/#view/Microsoft_AAD_RegisteredApps/ApplicationsListBlade).
2. Selecciona los tipos de cuenta que necesites.
3. Copia la URI mostrada por DashboardDP y añádela en **Autenticación** como plataforma **Aplicación de una sola página (SPA)**.
4. Añade el permiso delegado `Calendars.ReadWrite` de Microsoft Graph.
5. Copia únicamente el **Application (client) ID** en DashboardDP. No crees ni copies un secreto.

## Privacidad y copias de seguridad

- Las tareas, notas, preferencias y conexiones se guardan localmente en el navegador.
- Las credenciales personales no se incluyen al exportar los datos del Dashboard.
- Si borras los datos del navegador, cambias de perfil o reinstalas la extensión, tendrás que volver a conectar.
- Conserva una copia de seguridad del Dashboard y una exportación `.ics` antes de cambios importantes.

Recursos: [OAuth para aplicaciones web de cliente](https://developers.google.com/identity/protocols/oauth2/javascript-implicit-flow), [Google Calendar API](https://developers.google.com/calendar/api/guides/overview) e [incidencia conocida de Brave](https://github.com/brave/brave-browser/issues/38066).
