# Install, update, and recover DashboardDP

## Install

1. Download the named DashboardDP ZIP from [GitHub Releases](https://github.com/PraenaDP/DashboardDP/releases) and extract it to a permanent folder.
2. Open `brave://extensions`, `chrome://extensions`, or `edge://extensions` and enable **Developer mode**.
3. Select **Load unpacked** and choose the folder containing `manifest.json`.
4. Open a new tab. Choose whether to import existing browser bookmarks or start with an empty bookmark collection.

This is a manual desktop installation, not a Chrome Web Store installation. Keep the folder in place after installation.

## Update without losing data

1. Open **Settings → Data → Full backup** and download a complete JSON backup. Keep it outside the extension folder.
2. Close DashboardDP tabs and extract the new release files into the **same installation folder**.
3. Select **Reload** on the browser's extensions page. Do not uninstall DashboardDP or load a second copy from a new folder.
4. Open a new tab and check **Settings → About**, your bookmarks, and the widget library.

Existing personal widgets are not automatically overwritten. To add missing entries from the bundled library, use **Settings → Data → Saved widgets → Restore catalog**.

## Move to another browser, profile, or computer

Export a full backup from the old installation. Install DashboardDP in the destination, then use **Settings → Data → Restore full backup (.json)**. Restoring replaces the destination's DashboardDP data: export that installation first if you need to keep it.

Check folders, groups, workspaces, notes, tasks, projects, and widgets after restoring. Reconnect any calendar accounts and select the browser bookmark folder again before enabling write-back. Backups do not include account tokens, and imported browser bookmark identifiers are detached for safety.

## Keep a private backup

The ZIP contains the application, not your personal data. Keep a recent full JSON backup and an earlier version in a private location outside the installation folder. Bookmark HTML exports are not a substitute for a full backup. The JSON is unencrypted; do not attach it to a GitHub issue.

If an update does not appear, verify that you replaced files in the folder used by the installed extension and reloaded it. If something is missing after a restore, check that the backup belongs to the intended browser profile before restoring again.

See the [user guide](USER_GUIDE.md) for day-to-day use.
