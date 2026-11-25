# Privacy policy

DashboardDP runs in your browser profile and has no account service or server of its own. Bookmarks, workspaces, notes, settings, tasks, projects, and the personal widget library are stored in that profile.

## External connections

- Browser bookmarks are read or modified through browser permissions. Write-back is optional and scoped to the selected folder.
- Web searches and optional suggestions go directly to the chosen search engine. Bookmark search is local.
- Bookmark audits contact the selected sites and may reveal your IP address. Recognized private addresses are excluded, but hostname filtering cannot guarantee private-network isolation.
- Opening an external widget or preview sends a request to its provider. Browsing the catalog does not load every iframe. Repository imports contact the public sources selected by the user.
- Optional weather, holidays, and calendar features contact their respective providers. Calendar sync reads or writes calendar data according to the account permissions you grant. Disconnect in the extension or revoke access at the provider.
- An update check contacts GitHub. Clicking the optional coffee button opens Ko-fi's donation panel; DashboardDP does not receive payment details.

External services apply their own privacy policies. DashboardDP does not use a remote translation service for interface text or catalog metadata.

## Backups and deletion

Full JSON backups are unencrypted and may contain personal information. Keep them private and do not share them in public reports. Calendar tokens are not included. Restoring a full backup can replace destination data; save a backup first. Restore detaches foreign browser bookmark IDs and disables write-back before reconnecting. Recoverable deletions go to local Trash; browser profile removal can erase local extension data.

See [Security](SECURITY.md) and the [installation and recovery manual](docs/MANUAL_INSTALACION.md).
