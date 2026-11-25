# Calendar integrations

DashboardDP works locally without an account. Google Calendar and Microsoft 365 connections are optional and managed by each user. You do not need to change the manifest.

## Import or export an ICS file

Open **Calendar → Connections and sync** and use the ICS import or export controls. Import adds events without deleting existing ones. If your provider exports a ZIP, extract the individual .ics files first. No account connection is required.

## Google Calendar

1. Open **Calendar → Connections and sync** and start the Google Calendar setup wizard. Copy its exact redirect URI, including its trailing slash.
2. In [Google Cloud Console](https://console.cloud.google.com/), create or select a project you control. Enable Google Calendar API. Configure the OAuth consent screen in Google Auth Platform and add your account as a test user if required.
3. Create an OAuth client of type **Web application**. Paste the extension's redirect URI under **Authorized redirect URIs**. Do not choose the Chrome extension client type for Brave.
4. Copy the **Client ID** ending in .apps.googleusercontent.com. Do not copy or enter a client secret.
5. Return to DashboardDP, paste the client ID, and choose **Save and connect**. Verify that the account, application, and project are yours before authorizing calendar access.

If Google requires interaction again, use **Renew access and sync**. You do not need to recreate the Cloud project. Automatic sync does not open a visible sign-in flow.

### Synchronization

DashboardDP checks on startup when at least five minutes have elapsed since the last sync, when opening the calendar or task manager, when returning to the tab, and on the configured visible-tab interval. Intervals are 15, 30, or 60 minutes, defaulting to 30. Disable periodic checks in settings or use **Sync now** to check immediately.

Google uses one incremental sync token per calendar and falls back to a full read when Google invalidates it. All-day events stay all-day; invalid dates are normalized or rejected before sending. Read-only calendars can be read or imported but not changed or selected as creation targets.

To disconnect, use **Disconnect** in DashboardDP or revoke authorization in [Google Account permissions](https://myaccount.google.com/permissions).

## Microsoft Outlook and Microsoft 365

1. Register an application in [Microsoft Entra](https://entra.microsoft.com/#view/Microsoft_AAD_RegisteredApps/ApplicationsListBlade).
2. Select your intended account types.
3. Under **Authentication**, add the DashboardDP redirect URI as a **Single-page application (SPA)** redirect.
4. Add the Microsoft Graph delegated permission `Calendars.ReadWrite`.
5. Copy only the **Application (client) ID** into DashboardDP and connect. Do not create or enter a secret.

## Privacy and backups

The browser communicates directly with the calendar providers. Connection settings and temporary tokens stay in the browser profile; access tokens are not included in backups. You must reconnect after clearing browser data or moving profiles. Keep a full backup and an ICS export before major changes.

See [Google Calendar API](https://developers.google.com/calendar/api/guides/overview) and the [known Brave identity issue](https://github.com/brave/brave-browser/issues/38066).
