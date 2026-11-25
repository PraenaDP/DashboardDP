# DashboardDP functional specification

This document records product and safety requirements. The [user guide](docs/USER_GUIDE.md) describes the interface; the [calendar guide](INTEGRACIONES_CALENDARIO.md) covers provider setup.

## Distribution and data

DashboardDP is a local Manifest V3 new-tab extension for desktop Chromium browsers. It needs no DashboardDP account or server. Browser profiles are independent. The full JSON backup is the portable data format; bookmark HTML is not equivalent. Never distribute personal exports, native bookmark IDs, backgrounds, credentials, or profile data. The application uses GPL-3.0-only; third-party services retain separate terms.

## Bookmarks, groups, and workspaces

- Bookmarks store URL, title, description, tags, status, category, order, icon and optional color. Categories support nesting, inherited colors, sorting, and collapse.
- Bookmark search is in the left sidebar and renders results centrally. Web search stays in the top bar. Optional engine suggestions require permission and go directly to the chosen engine.
- HTML bookmark imports append to the library, offering separation by source browser and backup protection. Do not read other browser profiles directly.
- Native write-back is opt-in and scoped to the selected browser folder. Detect native changes, including changes during suspension or another sync. Do not carry native IDs or write-back permissions across profiles.
- Groups organize pinned bookmarks independently of category colors. A bookmark belongs to one pinned group and can appear in multiple workspaces. Workspaces open their links in separate tabs only on explicit action.
- Home group and workspace ordering is persistent and independent: custom, alphabetical in either direction, or most/least recent first. Position within the group drop target distinguishes inclusion from reordering.
- Use the browser favicon cache first, then the site's favicon, then initials. Preserve manually chosen icons. Display name and URL on hover and keyboard focus. Do not send bookmarks to an external favicon service.

## Panels and widgets

- Preserve user sidebar widths; normal ranges are 210–520 px on the left and 260–900 px on the right, subject to window size. Expanded mode must not overwrite the normal width.
- The right sidebar supports nine named bars and up to nine blocks per bar. Bar 1 is fixed; bar 2 is editable but not removable and initially provides visible notes. Removing another bar requires confirmation and must not delete saved widgets or notes.
- Each bar preserves its own vertical, grid, or manual mosaic layout; reset must not remove blocks. The numeric bar selector supports keyboard navigation and horizontal scrolling. Persistent controls must remain visible without shifting on hover.
- Mount only active widget iframes; close previews and release inactive frames. The player, weather widget, and calendar can remain open together. Do not load all catalog iframes when listing entries.
- The library supports table and card views, search, sorting, types, favorites, bulk type changes, editing and on-demand preview. A saved widget can be used in several bars but not duplicated within the same bar via the selector.
- Preserve original iframe text and dimensions unless explicitly edited. Render only a validated HTTPS URL in a restricted iframe; never inject arbitrary embed markup into the extension.
- Static and dynamic repository import are user-initiated; keep resumable drafts, distinguish new entries from duplicates and possible matches, and allow dismissal without mutating the library. Configurable reading steps are limited to supported interactions; no arbitrary JavaScript.
- The bundled catalog is separate from personal widgets. Seed a clean profile without overwriting personal libraries. Restoration adds missing entries; replacing customized originals requires confirmation and keeps the previous version in Trash.

## Tasks, notes, and calendar

- Local Kanban tasks are independent of calendar events. Inline task entry must not require a separate dialog. Moving a task preserves other fields. Confirm destructive actions and route recoverable data to Trash.
- Keep rich-text and Markdown notes distinct. Preserve colors, fonts, size, images and Markdown source; checkboxes must remain accessible and persist edits. Resizing a note must not rewrite its source.
- Calendar views include year, month, week and hourly day. The calendar system changes display and navigation, not event instants. Native date inputs use Gregorian dates. The Mayan view is informational and does not manage events.
- Holidays are optional, separate from personal events, and queried by country, region and year. Do not promise local or religious coverage.
- Google and Microsoft connections are optional. Preserve all-day events and read-only restrictions. Validate event dates and restrict authenticated requests to provider origins. Never export access tokens. ICS import must not delete existing events.

## Settings and interaction

- Support eight themes with light and dark modes, local fonts and background images. The Home greeting is optional and supports 14–34 px sizing.
- Support English and Spanish in the extension. A removed language setting falls back to Spanish. Changing language must not overwrite custom text. Use stored widget translations only when they match the current original field.
- Help contains 46 articles per language in 13 chapters, with search, related topics, history, independent index and reader scrolling, and remembered position. Keep the public English user guide aligned with shipped behavior.
- About displays the manifest version and optional Ko-fi support. Loading support must be user-initiated; no remote script runs in the extension context.
- An update check is optional and reads the public GitHub release. It must never install or overwrite files automatically. Instruct users to back up, replace files in the same folder, and reload rather than uninstall.
- Modal dismissal via backdrop requires both press and release outside; selection begun inside must not close it. Restore textarea text as a real value, not a stale HTML attribute.

## Security and release checks

- Reject invalid import structures, oversized inputs (25 MB limit), duplicate identifiers, prototype keys, and category cycles. Validate imported colors and sanitize notes.
- Restore without reusing foreign native IDs. Disable write-back until the destination is selected again. Restore native trees sequentially.
- Bookmark audit excludes recognized private targets, URL credentials and redirects. It is not a DNS isolation guarantee.
- Test import/export, Trash, catalog restoration, provider boundaries, language, keyboard access, and package content in isolated profiles with fictional data. Record untested cases and never treat static verification as security certification.
- Publish only reviewed runtime assets, public catalog data, and documentation. See [validation](docs/VALIDACION_1.11.5.md), [privacy](PRIVACIDAD.md) and [security](SECURITY.md).
