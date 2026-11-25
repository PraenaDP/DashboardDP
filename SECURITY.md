# Security policy

The [1.11.5 validation report](docs/VALIDACION_1.11.5.md) describes the checks and their limits. Passing these checks does not guarantee security or imply approval by a browser extension store.

## Protections

- Manifest V3 extension pages execute only packaged scripts.
- Rich-text notes accept sanitized HTML. Links are limited to HTTP(S), and inline images to PNG, JPEG, or WebP.
- Custom widgets require HTTPS and run in sandboxed iframes.
- Bookmark audits request network permission when started, exclude recognized local, private, and special-purpose addresses, and do not follow redirects. They do not guarantee detection of hostnames that resolve to a private IP address.
- Never commit secrets, passwords, tokens, backups, or bookmark exports.

Maintainer checks in `tools/` include static review and behavior tests in isolated profiles with external connections blocked. Users do not need to run these scripts. Reports should distinguish tested behavior, simulated services, failures, and untested scenarios. Historical reviews do not automatically cover later features.

## Report a vulnerability privately

Use [GitHub private vulnerability reporting](https://github.com/PraenaDP/DashboardDP/security/advisories/new), or open **Security → Advisories → Report a vulnerability**. GitHub sign-in is required; no public contact email is needed.

Include the affected version, browser, minimum steps needed to reproduce the issue, and potential impact. Do not attach personal backups, credentials, or private data. Do not post exploitation details in a public issue. The maintainer should review the report and coordinate remediation and disclosure before publishing details.

Use [GitHub Issues](https://github.com/PraenaDP/DashboardDP/issues) for ordinary bugs, questions, and suggestions.
