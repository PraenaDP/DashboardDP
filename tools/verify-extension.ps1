param(
  [string]$Root = (Split-Path -Parent $PSScriptRoot)
)

$ErrorActionPreference = 'Stop'

function Assert-Check {
  param([bool]$Condition, [string]$Message)
  if (-not $Condition) { throw "Comprobación fallida: $Message" }
  Write-Host "OK  $Message"
}

$manifestPath = Join-Path $Root 'manifest.json'
$appPath = Join-Path $Root 'dashboard\app.js'
$stylesPath = Join-Path $Root 'dashboard\styles.css'
$specPath = Join-Path $Root 'ESPECIFICACION.md'
$readmePath = Join-Path $Root 'README.md'
$privacyPath = Join-Path $Root 'PRIVACIDAD.md'
$securityPath = Join-Path $Root 'SECURITY.md'
$changelogPath = Join-Path $Root 'CHANGELOG.md'

Assert-Check (Test-Path -LiteralPath $manifestPath) 'Existe manifest.json'
Assert-Check (Test-Path -LiteralPath $appPath) 'Existe dashboard/app.js'
Assert-Check (Test-Path -LiteralPath $stylesPath) 'Existe dashboard/styles.css'
Assert-Check (Test-Path -LiteralPath $specPath) 'Existe ESPECIFICACION.md'
Assert-Check (Test-Path -LiteralPath $readmePath) 'Existe README.md'
Assert-Check (Test-Path -LiteralPath $privacyPath) 'Existe PRIVACIDAD.md'
Assert-Check (Test-Path -LiteralPath $securityPath) 'Existe SECURITY.md'
Assert-Check (Test-Path -LiteralPath $changelogPath) 'Existe CHANGELOG.md'

$manifest = Get-Content -LiteralPath $manifestPath -Raw | ConvertFrom-Json
Assert-Check ($manifest.manifest_version -eq 3) 'Usa Manifest V3'
Assert-Check ([bool]$manifest.content_security_policy.extension_pages) 'Declara una política de seguridad para las páginas de la extensión'
Assert-Check ($manifest.permissions -contains 'storage') 'Declara almacenamiento local'

& node --check $appPath
Assert-Check ($LASTEXITCODE -eq 0) 'La sintaxis de app.js es válida'
foreach ($script in @('background.js', 'popup.js', 'tools/security-regression.cjs')) {
  & node --check (Join-Path $Root $script)
  Assert-Check ($LASTEXITCODE -eq 0) "Sintaxis correcta: $script"
}
Assert-Check ($manifest.content_security_policy.extension_pages -match "object-src 'none'") 'Bloquea objetos embebidos'
Assert-Check (-not ($manifest.permissions -contains 'tabs')) 'No pide acceso general a las pestañas'

$app = Get-Content -LiteralPath $appPath -Raw
$spec = Get-Content -LiteralPath $specPath -Raw
$readme = Get-Content -LiteralPath $readmePath -Raw
$privacy = Get-Content -LiteralPath $privacyPath -Raw
$security = Get-Content -LiteralPath $securityPath -Raw
$changelog = Get-Content -LiteralPath $changelogPath -Raw
Assert-Check ($app -match 'function sanitizeStickyHtml') 'Sanea el HTML de notas'
Assert-Check ($app -match 'function openTrash') 'Incluye Papelera recuperable'
Assert-Check ($app -match 'TRASH_RETENTION_MS') 'Aplica retención limitada de Papelera'
Assert-Check ($spec -match 'Contrato obligatorio de ayuda') 'Mantiene el contrato de documentación'
Assert-Check ($readme -match 'PRIVACIDAD.md' -and $readme -match 'SECURITY.md') 'Enlaza la documentación pública'
Assert-Check ($privacy -match 'No requiere cuenta propia') 'Declara el modelo de privacidad local'
Assert-Check ($security -match 'Manifest V3') 'Documenta las medidas de seguridad'
Assert-Check ($changelog -match [regex]::Escape([string]$manifest.version)) 'Registra la versión actual en el historial'

Write-Host "`nComprobación estática completada. No sustituye las pruebas de seguridad en navegador." -ForegroundColor Green
