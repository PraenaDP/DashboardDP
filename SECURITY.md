# Seguridad de DashboardDP

La versión 1.10.48 tiene una auditoría local documentada en [AUDITORIA_SEGURIDAD_2026-09-07.md](AUDITORIA_SEGURIDAD_2026-09-07.md). La revisión detectó y corrigió fallos; no acredita seguridad total ni autorización para publicar en una tienda.

## Principios aplicados

- Las páginas de la extensión usan una política de seguridad de Manifest V3: solo ejecutan scripts incluidos en la propia extensión.
- Las notas de formato aceptan un subconjunto saneado de HTML. Los enlaces solo pueden ser HTTP/HTTPS y las imágenes inline se limitan a PNG, JPEG o WebP.
- Los widgets personales exigen HTTPS y se muestran dentro de un iframe aislado.
- La auditoría excluye direcciones locales, privadas y especiales reconocidas y no sigue redirecciones; solicita el permiso de red al iniciarla. No garantiza detectar dominios que resuelvan a una dirección privada.
- Ningún secreto, token, contraseña, copia de datos o exportación de marcadores debe entrar en el repositorio.

## Comprobación antes de publicar

Ejecuta desde la raíz de la extensión:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\tools\verify-extension.ps1
```

El proceso comprueba sintaxis y declaraciones estáticas, sin modificar datos. No demuestra que una función sea segura por encontrar su nombre en el código. Para pruebas de comportamiento se incluye `tools/security-regression.cjs`, que requiere Playwright y crea un perfil aislado con conexiones HTTP/HTTPS bloqueadas. El informe de auditoría describe su uso y límites.

## Informar de un problema

Si detectas una vulnerabilidad, no publiques pasos de explotación ni información personal. Comunícala de forma privada al mantenedor del proyecto, incluyendo la versión afectada, el navegador y una descripción mínima para reproducirla. El mantenedor debe confirmar la recepción, corregirla antes de publicarla y anotar la corrección en el historial de cambios.

Pendiente antes de publicar: definir un contacto privado real de seguridad y soporte. El texto anterior no sustituye ese canal.
