# Apoyar DashboardDP

DashboardDP puede incluir un único enlace oficial y voluntario de apoyo mediante Ko-fi. No es una compra, no desbloquea funciones y no procesa pagos dentro de la extensión.

## Configuración del autor

1. Crea tu perfil en [Ko-fi](https://ko-fi.com) y conecta PayPal, Stripe o ambos desde sus ajustes de pago.
2. Comprueba tu dirección pública. Debe tener este formato: `https://ko-fi.com/tu_usuario`.
3. En `dashboard/app.js`, sustituye el valor vacío de `APP.supportUrl` por esa dirección HTTPS. No uses una URL de PayPal directa, enlaces acortados ni una URL que no pertenezca a `ko-fi.com`.
4. Recarga la extensión y abre **Ajustes → Ayuda → Acerca de DashboardDP**. Comprueba que aparece el bloque «Apoyar DashboardDP» y que el botón abre exclusivamente tu perfil de Ko-fi en una pestaña nueva.
5. Ejecuta la comprobación previa a versión y actualiza las capturas y la ficha pública antes de distribuir.

## Principios de producto

- El enlace es opcional y no se muestra mientras `APP.supportUrl` permanezca vacío.
- No hay ventanas emergentes, avisos periódicos, publicidad, seguimiento ni bloqueo de funciones.
- DashboardDP no envía datos a Ko-fi. Al pulsar el enlace, el navegador abre Ko-fi fuera de la extensión.
- No guardes el enlace en los datos de usuarios, copias de seguridad ni preferencias: el destino corresponde a la edición publicada por el autor.

## GitHub

Cuando el repositorio sea público, añade el mismo enlace a la parte superior del README, a las notas de cada Release y, si deseas habilitar el botón nativo de GitHub, crea `.github/FUNDING.yml` con tu usuario de Ko-fi:

```yaml
ko_fi: tu_usuario
```

No publiques el archivo `FUNDING.yml` con texto de ejemplo: GitHub espera un usuario real. Mantén el mismo destino de Ko-fi en GitHub y en la extensión para evitar confusión.
