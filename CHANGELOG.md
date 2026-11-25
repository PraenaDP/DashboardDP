# Changelog

## 1.11.5 — November 25, 2026

- Public catalog of 1,309 unique tools with English and Spanish metadata, including 129 PhET references with CC BY-NC 4.0 attribution. Maps use world views rather than personal locations.
- Browser side panel with pinned bookmarks, groups, workspaces, search, and three display modes. Opening it does not launch a dashboard tab.
- Up to nine independent sidebar layouts. Notes, player, calendar, and tools can remain open together.
- Widget library with multi-select, bulk type changes, original iframe preservation, on-demand previews, and catalog restoration.
- Static and dynamic repository imports, configurable Share → Embed steps, resumable drafts, duplicate review, and individual or bulk dismissal.
- Persistent bookmark audit results, clickable links, title and URL editing, individual rechecks, and manual selection.
- Year, month, week, and hourly day calendar views, calendar systems, and optional country holidays.
- Kanban projects, inline local task entry, notes, contextual bookmark menus, and folder moves.
- Reorganized settings, eight light/dark themes, local fonts, and 46 help articles per language with search, history, and related articles.
- Optional Ko-fi button and private GitHub vulnerability reporting. No remote Ko-fi script runs in the extension.
- Screenshots use fictional data. The distribution excludes private backups.
- Local Brave tests blocked external connections. These tests do not guarantee provider availability or certify security or Chrome Web Store approval.

### Documentation and license

- The code license changed from CC BY-NC-SA 4.0 to GPL-3.0-only. Bundled links to third-party content retain their separate terms.
- Expanded product overview, menus, installation instructions, and compatibility guidance.
- Removed the Firefox-specific declaration from the Chromium manifest. Firefox is not supported by this distribution.

## 1.10.48 — Local audit and security fixes

- Restoring backups disables native write-back and detaches identifiers from the source browser profile. Re-select the sync folder before enabling write-back.
- Limited imports to 25 MB and validated structures, cycles, identifiers, colors, and note CSS classes.
- Expanded private address exclusions and stopped following redirects automatically during audits.
- Restricted authenticated calendar requests to provider origins. Validated internal messages and the OAuth bridge.
- Persisted restored identifiers and restored folder trees sequentially.
- Tightened CSP and replaced the `tabs` permission with `activeTab`.
- Tested in an isolated Edge profile. This does not certify security or full compatibility with other browsers.

## 1.10.47 — Stability, recovery, and distribution

- Added a local 30-day Trash for bookmarks, folder trees, groups, workspaces, widgets, tasks, and notes, with individual restoration and Undo.
- Included recoverable items in full backups.
- Added an internal release verification script and separate privacy and security documents.
- Bookmark audits process up to six links at a time and display results in batches of 160.
- Deletion confirmations clarify that items move to Trash. Built-in help explains recovery and continuing a long audit report.
- Declared a content security policy for extension pages and strengthened rich-text note sanitization.
