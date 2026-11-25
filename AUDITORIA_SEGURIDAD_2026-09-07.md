# Historical security audit and release readiness

September 7, 2026. Initial version: 1.10.47. Remediation: 1.10.48. This historical assessment recommended a controlled Chromium beta, not a security certification or store approval. See the [1.11.5 validation report](docs/VALIDACION_1.11.5.md) for later testing.

## Scope and method

The review covered the manifest, background process, popup, dashboard, notes, imports, Trash, bookmark audit, and calendar requests. It used white-box testing and Playwright against the installed extension in isolated headless Edge 152.0.4191.66 profiles. All bookmarks, credentials, and folders were fictional. HTTP(S) access was blocked and calendar responses were simulated. Visual checks covered Home, Settings, and Help at 1440, 1024, and 390 px; this was not a WCAG audit.

## Findings and remediation

| ID | Severity | Finding | Remediation in 1.10.48 |
|---|---|---|---|
| SEC-01 | High | A backup could carry native bookmark IDs, target folders, and write-back settings from another profile. | Strip foreign native IDs. Disable write-back on restore and require the user to choose the destination again. |
| SEC-02 | Medium | The audit accepted some local or special-purpose addresses and followed redirects. | Exclude recognized private and special-purpose targets and URL credentials. Do not follow redirects. DNS limitations remain. |
| SEC-03 | Medium | Note formatting and imported colors could interfere with the interface. JavaScript execution was not demonstrated. | Restrict Markdown classes and normalize colors before rendering or restoring. |
| SEC-04 | Medium | Malformed JSON collections and category cycles could break migration or rendering. | Validate structure, types, identifiers, depth, and cycles. Enforce size limits and reject prototype keys. |
| SEC-05 | Medium | Restored bookmark identifiers were not persisted reliably and folder creation could duplicate folders. | Sync the restored object itself and rebuild folder trees sequentially. |
| SEC-06 | Hardening | Authenticated calendar requests lacked centralized origin restrictions. | Validate provider origins before sending credentials; disallow cookies and redirects on authenticated requests. |
| SEC-07 | Hardening | Internal message origins and OAuth destinations were not uniformly checked. | Validate senders, OAuth destinations, reminder IDs, and tab-open limits. |
| SEC-08 | Least privilege | The broad tabs permission exceeded the needs of the extension. | Replace it with activeTab; confirm ordinary tab opening still works. |
| SEC-09 | Distribution | The initial title retained personal branding, and Firefox compatibility was unverified. | Use a neutral title and document browser limitations. |

CSP hardening blocks unpackaged scripts, objects, base URL changes, and extension-page forms, and limits frames to HTTPS. The browser test confirmed that an injected inline script did not execute.

## Results

The final historical run passed 40/40 cases, with no unhandled JavaScript exceptions in tested flows. Static manifest and script checks also passed. Maintainer regression tests are in `tools/security-regression.cjs`; the PowerShell verifier is only a static preflight. Tests create isolated profiles, block external connections, and produce JSON and screenshots. Do not publish test profiles.

## Residual risks at the time

- URL hostname filtering does not guarantee network isolation after DNS resolution. DNS rebinding was not tested; audit trusted bookmarks only.
- Live Google and Microsoft consent, renewal, revocation, time zones, read-only calendars, and bidirectional sync needed more testing. Browser-profile token storage had no separate encryption.
- Long-running concurrency, storage quota exhaustion, large imports, and interrupted saves needed stress tests.
- Chrome, Linux, and Firefox were not validated by this audit. Firefox required work on background execution and permissions.
- Full keyboard, focus, screen-reader, zoom, contrast, theme, and localization coverage remained unverified.
- Store acceptance, public privacy information, private security reporting, licensing, and clean screenshots were separate distribution requirements.

Priority recommendations were stronger persistence under conflicts and quota limits, local performance measurement, lazy widget loading, keyboard testing, and modular maintenance. See [SECURITY.md](SECURITY.md) for current reporting instructions.
