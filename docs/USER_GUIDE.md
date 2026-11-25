# DashboardDP User Guide

This guide is also available inside DashboardDP under Settings → Help. Its chapters and procedures match the [Spanish guide](GUIA_DE_USO.md). Translations are stored with the extension; no translation service or API is used.

## 1. Find and open your bookmarks

<!-- source: encontrar-y-abrir-tus-favoritos-vision-general -->

1. Open a new tab to enter DashboardDP. If you are already on a website and only need your shortcuts, click the extension icon to open the side panel without leaving that page.
2. In the dashboard, find Navigation on the left. Its six buttons are Home, All bookmarks, Pinned, Idea inbox, Recent, and Most used. Hover over a button to read its name before clicking.
3. Click All bookmarks to see the entire collection, or expand a folder under Categories to browse its subfolders and links.
4. Enter part of a name, domain, address, tag, or path in Search bookmarks. Clear the text to remove that search. If results are still missing, also check the active category and audit filter.
5. Choose Cards, List, or Icons using the view controls. Changing the presentation does not move or delete your links.
6. Click a bookmark's name or icon to open its website. Action buttons, category labels, and audit statuses serve different purposes: they are not links to the website.
7. In the side panel, you can search and switch between Icons, List, and Cards. Click a group header to expand it, then click a bookmark to open it. In a workspace, Open entire workspace opens all its links, not just those matching a search.

Switch between cards, list, and icons using the view buttons. Table headings marked A–Z let you reverse the order. Category and audited-status labels open filters, not the bookmark's website.

### Choose between the full dashboard and the side panel

<!-- source: encontrar-y-abrir-tus-favoritos-elegir-entre-el-dashboard-completo-y-el-panel-lateral -->

The dashboard occupies a tab and is used for organizing. The side panel accompanies your current website and gives you access to your shortcuts.

1. To organize bookmarks, open a new tab: Navigation, Categories, and the main area appear.
2. To access a pinned bookmark without leaving a website, click the DashboardDP icon in the browser toolbar.
3. Expand a group using its arrow. Click an individual link to open only that page.
4. To return to the full organizer, use Open Dashboard at the bottom of the panel.

Example: while reading documentation, you can expand the Study group in the panel, open a reference, and keep the other links within reach.

Expected result: opening the panel does not itself create a dashboard tab. The browser controls which side the panel appears on and its minimum width. If the icon is missing, pin it from the browser's extensions menu.

### Find a bookmark that seems to have disappeared

<!-- source: encontrar-y-abrir-tus-favoritos-encontrar-un-favorito-que-parece-haber-desaparecido -->

Filters can hide a link without deleting it.

1. Open All bookmarks, not Recent or Pinned.
2. Clear Search bookmarks and remove the audit-status filter if it is active.
3. Search for a distinctive part of the domain, such as example.org, instead of the full title.
4. Check which browser profile you are using. Data from another profile or installation does not appear here automatically.
5. If the bookmark is still missing, check Trash before restoring a full backup.

Expected result: you can distinguish an item hidden by filters from one that was actually deleted. Restoring an old JSON as your first troubleshooting step can replace recent changes; export the current state first.

## 2. Create, edit, and move links and folders

<!-- source: crear-editar-y-mover-enlaces-y-carpetas-vision-general -->

1. Click + at the top of the dashboard. This opens New bookmark; it is not the + button that creates a sidebar.
2. Enter a recognizable name and paste the complete address, for example https://example.org. Make sure you have not pasted explanatory text along with the URL.
3. Open the category picker. Expand the folders in the tree until you find the destination and select it. Add a description, tags, color, or icon only if you need them.
4. For quick access, assign the link to a group or workspace from the same form. Review your selections before saving.
5. Save and search for the name you just created to check where it was placed. Canceling the form does not create the bookmark.
6. To correct it, open its three-dot menu → Edit, change the fields, and save. To change its location, use Move to…, select a folder, and confirm.
7. To organize folders, open their three-dot menus. Add subcategory creates a folder inside the selected one; Move to… changes its parent folder and moves all its contents along with it.

Each link and folder has a three-dot menu next to the item, with no blurred screen overlay. You can edit or delete from there; folders also let you add subcategories and choose Move to…. Dragging a folder onto another moves it together with its contents. A folder cannot be moved into itself or one of its descendants.

The Drop the link here prompt is reserved for links coming from outside DashboardDP. It must not interrupt moving internal items.

To reflect changes in your actual browser bookmarks, configure Settings → Search and synchronization, choose a destination folder, and enable bidirectional writing. Without it, changes are local. Each browser and profile has its own independent integration.

### Save and correct a web address

<!-- source: crear-editar-y-mover-enlaces-y-carpetas-guardar-y-corregir-una-direccion-web -->

Where: the top + button to create a bookmark; a bookmark's three-dot menu → Edit to correct one.

1. Copy the address from the browser's address bar, not text describing the page.
2. In New bookmark, enter a recognizable name and paste the full URL. Choose its folder under Category.
3. Save and find the new item using Search bookmarks. Open it to check that it leads to the expected page.
4. If you made a mistake, use Edit on that same bookmark, correct the name or address, and save again. You do not need to create another bookmark and leave two copies.

Example: save https://example.org as Test manual and assign it to Study. If searching for Test manual does not find it, clear other filters before creating it again.

Do not paste passwords, tokens, or addresses containing credentials into a shared bookmark. A page title does not prove that the URL is correct: verify the destination that opens.

### Move a folder with all its contents

<!-- source: crear-editar-y-mover-enlaces-y-carpetas-mover-una-carpeta-con-todo-su-contenido -->

Where: the Categories tree on the left of the dashboard.

1. Expand the folder you want to move and check that it contains the expected links.
2. Open its three-dot menu and choose Move to…; select the new parent folder in the destination tree and confirm.
3. Alternatively, drag the folder onto its destination folder. Do not drop it onto a bookmark or into one of its own descendants.
4. Open the destination and check the moved folder, its subfolders, and its links.

Example: to place English under Training, choose Training as the destination; make sure you do not accidentally select another folder with the same name. Colors and indentation help identify the hierarchy.

If Drop the link here appears while moving internal items, do not confirm the creation of another bookmark: that prompt is for external links. Writing to actual browser bookmarks depends on bidirectional synchronization, explained in the next article.

### Distinguish local changes from browser synchronization

<!-- source: crear-editar-y-mover-enlaces-y-carpetas-distinguir-cambios-locales-y-sincronizacion-del-navegador -->

DashboardDP and the browser's bookmark manager are not the same thing. Some actions are local, while others can also be written to the browser.

1. Open Settings → Search and synchronization and review the native-bookmark mode and configured destination folder.
2. Before enabling bidirectional writing, download a full backup. Verify that the selected folder belongs to the profile you are using.
3. Start with a small change to a test link. Check the result both in DashboardDP and in the browser's bookmark manager.
4. Only then perform large moves or deletions. If you do not want to write to actual browser bookmarks, leave that writing disabled.

Expected result: you know whether a deletion affects only your local organization or also the browser. Each profile has its own identifiers and storage; a folder from another profile must not be assumed to be connected just because it has the same name.

## 3. Pinned bookmarks, groups, and workspaces

<!-- source: fijados-grupos-y-espacios-de-trabajo-vision-general -->

1. Find a bookmark you use frequently. Click its star to pin it; click again to unpin it. Pinning does not create a second copy of the link.
2. Open Home or Pinned to check the result. A standalone pinned bookmark appears separately; one assigned to a group appears inside that group.
3. In Pinned and Groups, use the create-group button. Enter a name, choose a color and icon, and confirm. Then assign links by editing individual bookmarks or using the available grouping operations.
4. Click a group's icon to expand its members. Opening a group does not open all its websites. Its × closes the block without deleting bookmarks.
5. Use the group's three-dot menu to edit its name, color, or icon. Read the confirmation before deleting: removing a grouping is not the same as deleting its original links.
6. To open several websites as a working context, create a Workspace, not another bookmark. Click its creation button, choose a name, color, and icon, expand the categories in the tree on the right, and select the links to include.
7. Save and open the workspace to launch its pages. If you have selected many links, review the confirmation before opening several tabs. Editing a workspace changes its selection; it does not modify the original websites.

When creating a workspace, choose its name, color, and icon on the left and its bookmarks in the tree on the right. Expand folders to select links; the search narrows the tree. Save when finished.

An expanded group has a × that closes the block without deleting it. Group and workspace sort controls are independent. In custom order, you can rearrange supported items by dragging them.

### Choose between pinning, grouping, and creating a workspace

<!-- source: fijados-grupos-y-espacios-de-trabajo-elegir-entre-fijar-agrupar-y-crear-un-espacio -->

Use a pinned bookmark to keep a link at hand, a group to gather pinned bookmarks without opening them all, and a workspace to launch a set of pages.

1. Use the star to pin frequently used links and check that they appear in Home or Pinned.
2. Group your banking services, for example. Expanding Banking should display its members without signing in or automatically opening their websites.
3. Create a workspace such as Daily study when you need to open an educational platform, a document, and a reference together.
4. Start with two links to learn the difference between expanding a group and opening a workspace.

The distinction remains the same in the side panel: clicking a header expands it; Open entire workspace opens every page in that workspace. A search showing only one member does not reduce the set opened by that button.

### Edit a workspace without changing its original bookmarks

<!-- source: fijados-grupos-y-espacios-de-trabajo-editar-un-espacio-sin-tocar-sus-favoritos-originales -->

Where: Workspaces section → the workspace's three-dot menu → Edit.

1. Check the workspace name before opening its form. Several workspaces can contain the same bookmark.
2. Change the name, color, or icon in the configuration column.
3. Expand folders in the bookmark tree, search for links, and adjust the selection. Search helps you find them; review the selections before saving.
4. Save and reopen the workspace to verify its contents.

Removing a link from this selection does not delete that bookmark from the main collection. To change the URL, edit the original bookmark. Closing a group with × does not delete it either: it only hides its expanded members.

## 4. Idea inbox and projects

<!-- source: bandeja-de-ideas-y-proyectos-vision-general -->

1. Click Idea inbox in Navigation. Find Create project and open the form.
2. Enter its name and any other fields you want to keep. Save. Then select that project under Choose an idea or project if it was not selected automatically.
3. The board shows To do, In progress, and Completed. Each column has + Add item: click it in the starting state and choose the resource or content offered by the form.
4. To change the status, drag a card into another column. You can also use its status button: it cycles through To do → In progress → Completed and back to To do.
5. If a card contains a link, its ↗ button opens that resource. Do not confuse opening the resource with changing the task's status.
6. In Completed, Archive hides a card from the active columns. Archiving is not deleting.
7. Delete item removes that card from the project after confirmation. To delete the entire project, check which one is selected before using its trash button. Its original bookmarks are kept.
8. An external application chosen in the picker opens with its launch button. Choosing it does not automatically synchronize its data with the local board or grant access to that account.

Project tasks, local tasks, and calendar events are separate collections. Adding a local task to a project does not turn it into an event or send it to Google Calendar. Before deleting or clearing anything, check which collection you are working in.

### Create a project and start its Kanban board

<!-- source: bandeja-de-ideas-y-proyectos-crear-un-proyecto-y-empezar-su-tablero-kanban -->

Where: Navigation → Idea inbox → Create project.

1. Enter the name and other fields you need in the form, then save.
2. Select it under Choose an idea or project. If no project is selected, its board may not appear.
3. In To do, click + Add item and choose content supported by the picker.
4. Check that the card appears in the correct column. Drag it to In progress when you start and to Completed when finished.
5. A card's status button lets you cycle through states without dragging. The ↗ button on a card with a URL opens the resource; it does not change its status.

Example: create Test trip and add transport and accommodation resources. These are project resources, not bookings made by DashboardDP. The board organizes information but does not perform actions on the linked websites.

### Archive, remove items, or delete a project

<!-- source: bandeja-de-ideas-y-proyectos-archivar-quitar-elementos-o-eliminar-un-proyecto -->

These three actions have different scopes.

1. To remove a finished card from the active columns, use Archive in Completed. Do not confuse it with the trash button.
2. To remove a card from the project, use Delete item and review the confirmation.
3. To delete the whole project, check the active project in the picker before using its trash button.
4. Download a full backup before a major cleanup. Do not assume that closing a form or switching projects will undo a deletion.

Original bookmarks used as resources are kept when a project is deleted. However, the board and its local items are removed. An external application chosen in the picker is not automatically synchronized with this board just by opening its page.

## 5. Local tasks

<!-- source: tareas-locales-vision-general -->

1. Select sidebar 1 on the right and open Local tasks. If the sidebar is closed, expand the right panel first.
2. In To do, type a title directly into + New task. Press Enter or the ↵ button to save it. There is no need to open another form.
3. Check that the task appears in that column. The field remains available for the next task. An empty field does not create a useful task: enter its title first.
4. Use the task's status button or drag its card to move it to In progress or Completed.
5. To add it to an existing project, use Add to project and choose the destination. Return to the project's board to check it; this operation sends nothing to an external calendar.
6. To remove several tasks, select their checkboxes and use Delete selected. Clear local tasks affects the whole collection: review the confirmation and make a backup if you need to keep it.

Change the status with its control or move the card between To do, In progress, and Completed. Checkboxes are for selection; Delete selected and Clear local tasks request confirmation and send the content to Trash. They do not delete external Calendar events.

### Enter several tasks without opening forms

<!-- source: tareas-locales-introducir-varias-tareas-sin-abrir-formularios -->

Where: sidebar 1 → Local tasks → To do column.

1. Click + New task and enter a specific action, such as Review budget.
2. Press Enter or ↵ and check that the task appears in To do.
3. Enter the next one in the same field. You do not need to reopen the plugin after each task.
4. Change the status using its control or move the card to another column.

Example: add three small tasks rather than a single long description mixing all the work. You can then complete each one separately.

If no task is created, check that the field is not empty and that you are in Local tasks, not a project's board or an event form. These are different screens with different data.

### Add a local task to a project

<!-- source: tareas-locales-llevar-una-tarea-local-a-un-proyecto -->

Create the destination project before using this operation.

1. Open Local tasks and locate the correct task.
2. Click Add to project and choose a project from the list.
3. Open Idea inbox, select that project, and verify that the task is available on its board.
4. Review its status in the destination before clearing the local-task collection.

This operation is not the same as creating a Google Calendar event or scheduling a notification. Do not assume that all edits will remain permanently synchronized between the two collections: check each context where you use the task.

To delete a local batch, use checkboxes to select tasks; Delete selected limits the scope to those tasks. Clear local tasks affects the entire collection: always read the confirmation.

## 6. Calendar and holidays

<!-- source: calendario-y-festividades-vision-general -->

1. Select sidebar 1 and click Calendar. The compact calendar can stay open alongside other plugins; scroll the sidebar if everything does not fit.
2. Click Open calendar in its header. The main window starts in Year view: it shows months and days, not a list of the year's tasks.
3. Use the view picker to choose Year, Month, Week, or Day. Year highlights weekends and today; Month shows event indicators. Week and Day show personal events.
4. Click a day to open its hourly agenda. In Day, the monthly calendar on the right lets you jump to another date; scroll it to see other months.
5. To create a personal event, use the creation control available in the calendar. Check the date, time, duration, and destination calendar before saving: a local event is not sent to Google or Microsoft just because you have added a connected account.
6. If you change the calendar system, check the displayed day again before creating an event. Changing systems does not shift the absolute date of events.

The system picker changes the structure of the main and sidebar views: Gregorian, Chinese, Hebrew, Islamic civil, Persian, or Buddhist. Changing systems does not change the absolute date of events. Islamic civil uses tabular calculations and may differ from local religious observations. Dates and times in native form fields use the browser's Gregorian calendar; first select the equivalent day in your chosen view.

Mayan · curiosity opens a separate Long Count equivalence view; it does not change the agenda or provide a Mayan event calendar.

Under Holidays by country, click Query available countries, authorize the service domain, and choose a country and region. Regional codes depend on the provider. Save to apply. Holidays stay separate from your events; they do not include every municipal holiday or saints' day. When navigating to another year, you may need to load its data. If the query fails, keep your events and try again.

Connections and synchronization lets you configure Google Calendar or Microsoft 365. This is optional; see the [connections guide](../INTEGRACIONES_CALENDARIO.md). Events with an unknown duration are initially shown as one hour. Do not mistake that visual value for a duration verified with the provider.

### Go from the year to a day's agenda

<!-- source: calendario-y-festividades-pasar-del-ano-a-la-agenda-de-un-dia -->

Where: sidebar 1 → Calendar → Open calendar.

1. The initial Year view displays the year's months and days. Weekends and today are visually distinguished.
2. Click the day you want to view. The daily view arranges personal events by hour.
3. Use the monthly calendar on the right to jump to another day; scroll it if you need another month.
4. Switch to Month or Week with the top picker depending on the level of detail you need.

Expected result: Year helps you navigate, Month shows indicators, and Week/Day provide the personal agenda. Do not expect a list of all your tasks in the yearly grid.

An event with no known duration may initially be displayed as one hour. That visual duration does not confirm the external event's actual duration; check it when editing or with the relevant provider.

### Add holidays by country and region

<!-- source: calendario-y-festividades-anadir-festividades-por-pais-y-region -->

Holidays are an informational layer separate from your personal events.

1. Open Holidays by country and click Query available countries.
2. If the browser requests access to the holiday service, check the domain and authorize it only if you want to use this feature.
3. Choose the country and, where applicable, an available region or subdivision. Codes and coverage depend on the provider.
4. Save and view the selected year's monthly calendar. Changing years may require another query.

Example: national holidays do not guarantee that every holiday in your municipality is included. The service is not a complete calendar of saints' days either.

If no results appear, check access to the service, country, region, and year before modifying your events. Do not try to fix a failed query by deleting your personal calendar.

### Change the calendar system without shifting events

<!-- source: calendario-y-festividades-cambiar-el-sistema-de-calendario-sin-desplazar-eventos -->

Where: the system picker next to the holiday controls.

1. Choose Gregorian, Chinese, Hebrew, Islamic civil, Persian, or Buddhist.
2. Check the new month layout and today's marker both in the main window and in the sidebar calendar.
3. Before creating an event, select the equivalent day and check the absolute date in the form.
4. Return to the previous system if you want to compare the same day. Changing its representation must not move your events to another date.

The browser's native date/time fields use their Gregorian representation. Islamic civil uses tabular calculations and may differ from local religious observations. Mayan · curiosity opens a separate Long Count information window, not a Mayan event calendar.

### Understand local calendars and connected accounts

<!-- source: calendario-y-festividades-entender-calendario-local-y-cuentas-conectadas -->

A local calendar works without signing in. Google Calendar and Microsoft 365 connections are optional.

1. First create or view a local test event to learn how the view works.
2. For an external account, open Connections and synchronization and follow the provider-specific guide linked in the connections manual.
3. Check the account, destination calendar, and permissions before saving external changes.
4. After reinstalling or changing profiles, authorize the accounts again. Access tokens are not included in the JSON backup.

Connecting an account does not automatically turn all local tasks into events. Do not paste a password or Client Secret into a field intended for a URL or application identifier. If an account is missing, check its connection before restoring the whole database.

## 7. Notes

<!-- source: notas-vision-general -->

1. Select sidebar 2 on the right: it initially contains the visible-notes block. If it is empty, open its menu and add or restore the note viewer.
2. Open the notes menu to enter the editor. Create a note or choose an existing one; identify it by its title before changing it.
3. Enter the content and use formatting and color controls where appropriate. If you use a Markdown note, its lists and checkboxes follow that format; do not paste executable code expecting it to work as a website.
4. Return to the sidebar and click Choose notes to decide which ones to display. A saved note that is not selected here does not necessarily appear in the panel.
5. Change the layout with the viewer controls. Adjust the height using the handle where available; expanding the sidebar does not delete or duplicate notes.
6. Removing the viewer from a sidebar only removes that presentation. To delete a note, use its delete operation and read the confirmation: these are not the same action.

### Choose which notes to display in the second sidebar

<!-- source: notas-elegir-que-notas-mostrar-en-la-segunda-barra -->

Where: sidebar picker → 2 → visible-notes block.

1. Create or edit the note from the notes menu and return to the viewer.
2. Click Choose notes and select those you want to keep at hand.
3. Check their titles and contents. A saved note not chosen for that block can exist without appearing here.
4. Change the layout with the available controls and adjust the height where there is a handle.

Example: keep a shopping list and a study note visible without displaying all your notes at once.

Removing the viewer from a sidebar does not delete a note. To delete it, use its delete operation and review the confirmation. Before editing many notes, export a full backup so you can recover earlier versions.

### Write rich text or Markdown

<!-- source: notas-escribir-texto-enriquecido-o-markdown -->

The note editor and viewer are not a page for running arbitrary code.

1. Open the specific note from the menu and check its title to avoid editing another one.
2. Enter the content and use its formatting, color, and font controls where available.
3. If the note is Markdown, check in the viewer how lists, links, and checkboxes are interpreted.
4. Switch notes and reopen it to check that the content was saved as expected.

Pasting HTML, JavaScript, or website styles does not make the editor execute them. Content is restricted for safety. If a Markdown checkbox does not behave as expected, first check the note format and syntax; do not disable protections or insert scripts to simulate it.

## 8. Sidebars and widget library

<!-- source: barras-y-biblioteca-de-widgets-vision-general -->

1. In the right panel's header, click 1, 2, or another number to switch sidebars. Each sidebar keeps its own blocks.
2. Click + next to the numbers to create another, up to nine. If there are more numbers than fit, scroll the picker horizontally.
3. Enter an identifiable name, such as Study or Calculators. Sidebar 1 is fixed; sidebar 2 can be edited but not deleted; subsequent sidebars can be deleted with confirmation.
4. Open the sidebar's three-dot menu to add a block or change its layout. The expand/restore button changes the available space; it does not create another sidebar.
5. Open Widget library from its shortcut. Search by name or description and check the type filter, sorting, and Table/Cards view before assuming a tool is missing.
6. Click the eye to try it without adding it. Close the preview when finished. Only that tool loads, not the entire library.
7. Click Add, choose a compatible sidebar, and check the result there. Sidebar 1 does not accept personal blocks. If you later remove the block, the widget remains saved in the library.
8. To save your own tool, click New Widget, enter its name, description, and type, and paste its HTTPS URL or original iframe code. Save and test its preview.
9. To change dimensions, explicitly edit width or height. Do not replace an iframe with a different address to try to fix a provider block: first check the code published by that service.

Each sidebar's menu combines Add widget, vertical view, grid, manual mosaic, and, where applicable, reset layout or delete sidebar. Expand/restore changes that sidebar's working area; it does not delete its items.

The library offers table or cards, search, type filters, sorting, and a fixed favorites category. The star marks a favorite widget without changing its type. New Widget saves iframe code or an HTTPS URL and its metadata. The type picker lets you use an existing type or enter another one.

To change several widgets' types, select them directly in the table or cards, without checkboxes: a click selects one, Ctrl/Alt + click adds or removes items, and Shift + click selects a range in visible order. Change type lets you choose an existing type or enter a new one for the whole selection. Switching views keeps the selection; searching or filtering removes hidden widgets from it. Individual buttons and links still work without selecting their row. Built-in widgets are fixed and cannot be reclassified. With focus on a row or card, Space selects, Ctrl+A selects visible personal widgets, and Escape clears the selection.

The eye opens a preview without adding the widget to a sidebar. The iframe loads when opened and that instance is released when closed; the provider may keep its own data. Add lets you choose a compatible sidebar. Removing a block from a sidebar does not delete the widget from the library. Copy code, edit, and delete are different operations.

Saved original code and dimensions are preserved unless explicitly changed. Execution remains subject to the host's security restrictions: preserving text does not grant unsafe permissions.

### Create a sidebar for a set of tools

<!-- source: barras-y-biblioteca-de-widgets-crear-una-barra-para-un-conjunto-de-herramientas -->

Where: the right panel's header, next to the sidebar numbers.

1. Click + to create another sidebar, up to nine.
2. Enter a clear name, such as Calculators. The number identifies its position; the name describes its use.
3. Open Widget library, find a tool, and click Add.
4. Choose the destination sidebar and verify that the widget appears there.
5. Open the sidebar's three-dot menu to change its layout or add other blocks.

Sidebar 1 is fixed and does not accept personal widgets. Sidebar 2 is editable but cannot be deleted. Subsequent sidebars can be deleted after confirmation. Removing a widget from a sidebar removes that placement, not its library entry. The expand/restore button changes the sidebar's view; it does not create another one.

### Try a widget without adding it or loading the whole library

<!-- source: barras-y-biblioteca-de-widgets-probar-un-widget-sin-anadirlo-ni-cargar-toda-la-biblioteca -->

Where: Widget library → the widget's eye button.

1. Search for its name or filter by tool type.
2. Click the eye and wait for the external provider to load.
3. Test its controls with sample data, without unnecessary private information.
4. Close the preview when finished. Then use Add only if you want to keep it in a sidebar.

Expected result: opening an entry or searching the library does not execute all its iframes. The preview loads the selected tool and releases that instance when closed.

The external service may keep its own data. If it refuses embedding or requires sign-in, the eye does not guarantee it will work. Try the official address in a normal tab to distinguish a tool failure from an embedding restriction.

### Change the type of several widgets at once

<!-- source: barras-y-biblioteca-de-widgets-cambiar-el-tipo-de-varios-widgets-a-la-vez -->

Where: Widget library, in Table or Cards.

1. Click a row or card outside its buttons. That widget becomes selected.
2. Hold Ctrl or Alt and click others to add or remove them from the selection. Use Shift to select a range in visible order.
3. Check the counter and click Change type.
4. Choose an existing type or enter another one. Review the names in the summary and click Apply to selected.
5. Check the destination filter. If you were viewing the previous type, the moved widgets may disappear from that view without being deleted.

Switching Table/Cards keeps the selection. Searching or filtering excludes widgets that become hidden, so you do not modify items you can no longer see. Each entry's buttons retain their independent actions. Built-in widgets are fixed and cannot be reclassified with this system.

### Edit an iframe without losing its attributes

<!-- source: barras-y-biblioteca-de-widgets-editar-el-iframe-sin-perder-sus-atributos -->

Where: Widget library → Edit widget → HTTPS URL or iframe code.

1. Copy the full official code from the provider's website, including the iframe's opening and closing tags.
2. Replace the field's contents with that code. Check the URL and the entry's title.
3. Leave width and height unchanged if you want to keep the detected dimensions. Edit those fields only when you explicitly want to override them.
4. Save, reopen editing, and check that the code and its attributes are still present. Also test the eye button.

Preserving iframe text does not automatically grant every permission requested by the service. Camera, microphone, geolocation, and other access may remain restricted by the browser and host. A provider's attribute must not be treated as authorization to bypass those restrictions.

## 9. Import tools from a repository

<!-- source: importar-herramientas-de-un-repositorio-vision-general -->

1. Open Widget library → Import repository. This importer finds tools; it does not restore a full DashboardDP backup.
2. Choose a saved repository or enter its HTTPS URL. Detect repositories rebuilds the picker from your library: it does not scan for tools or import anything.
3. For a page that already publishes the iframe, choose Quick HTML. If it needs to run its interface or open Embed, choose Dynamic page. Authorize only the site you want to query.
4. Click Find tools. Watch the progress, processed pages, and errors. While it runs, do not start another search for the same draft.
5. When results appear, filter Available, Already imported, or Possible equivalents. The filter changes what you see; it does not delete saved tools.
6. Review each result's name, type, description, and code. You can edit these fields. Try the eye before adding an unfamiliar tool.
7. Use + to add one tool. For a batch, select results and click Import selected. Then check the library and destination type.
8. × or Discard selected removes results from this search, not widgets from your library. A confirmed duplicate must never be reimported just because it was selected for discarding.
9. Leaving pauses and keeps the latest draft. On return, Continue search resumes its queue. Starting another URL or changing the configuration may require confirmation to replace the draft; unlimited search history is not kept.

Use Quick HTML for static pages. Dynamic page may request permission and open a temporary reading tab; it does not import private services requiring sign-in. The search saves a draft separately from the library so you can return or resume it.

If code is behind buttons, open Configure reading. Enter a tool URL on the same site and add up to five steps with the exact button text, such as Share → Embed. You do not need to write code. Test reading shows the iframe without importing it; review the result and click Save configuration. Dynamic searches on that site repeat those steps. You can edit the configuration or reset automatic reading. Configurations are included in the full backup.

The code container is optional: leaving it empty also searches for code written in the page body. CSS selectors are an advanced option for icon buttons or ambiguous code. Steps inside other iframes or closed components do not work, nor do all special generators. You are warned if several buttons match or a step is missing. Do not configure sign-ins, payments, permissions, or forms. The temporary tab may use the site's cookies.

Review each row's name, type, description, and code. Use the eye to test. + adds individually; × discards that result. Missing fields can be completed before importing.

Filter available, already imported, or possible equivalents. Select all and Deselect all act on the visible filter. Already imported results can only be selected for Discard selected: they are neither reimported nor deleted from your library. Possible equivalents require manual review. The counter distinguishes selected results from importable ones.

A different URL does not guarantee a new function; two providers can offer equivalent tools. Also review the content before adding many entries.

### Teach the importer where Share and Embed are

<!-- source: importar-herramientas-de-un-repositorio-ensenar-al-importador-donde-esta-compartir-y-embed -->

Where: Library → Import repository → Configure reading.

1. Enter the URL of a specific tool on the site, not just its home page.
2. Add the steps in the page's actual order: for example Share followed by Embed. Copy the button text or accessible label.
3. If code is already visible on the page, remove unnecessary steps. Do not force the reader to click a button that page does not have.
4. Click Test reading. Review the iframe found, its domain, and dimensions. This test does not import the widget.
5. Save the configuration and return to the importer in dynamic mode.

If two buttons share the same text, the configuration may need a more precise CSS selector, which is an advanced option. User-written JavaScript, private sign-ins, and payment or permission sequences are not supported. It does not automate buttons inside other iframes or closed components.

### Review duplicates and possible equivalents before importing

<!-- source: importar-herramientas-de-un-repositorio-revisar-duplicados-y-posibles-equivalentes-antes-de-importar -->

Available, already imported, and possible equivalent do not mean the same thing.

1. Filter Available to see results with no detected match.
2. Review Already imported to recognize blocked results. You can select them to discard results, but not to duplicate them in the library.
3. Under Possible equivalents, compare the name, URL, and function with the existing widget. Selecting them in bulk for discarding does not authorize automatic importing.
4. Use the eye to check an uncertain case, and the + button if you decide to add it individually.

URL normalization may ignore language or presentation differences for known providers. It does not prove functional equivalence between two different websites. Two similarly named calculators may use different formulas, countries, or taxes; do not delete one solely because its name looks similar.

### Resume a saved search without starting over

<!-- source: importar-herramientas-de-un-repositorio-continuar-una-busqueda-guardada-sin-empezar-desde-cero -->

The importer keeps a single draft, separate from the library.

1. Leave the importer when you need to check something else. The scan pauses and saves the queue, results, and edited fields when storage allows it.
2. Return to Import repository and check the recovered repository and reading mode.
3. Click Continue search if pages remain pending.
4. If you want another URL or change the reading configuration, review the confirmation before replacing the previous draft.

A storage-full warning means you must not assume your work was saved. Do not close relying on a resume that the browser rejected. Clearing browser data deletes the draft; it does not replace a full backup or preserve unlimited search history.

## 10. Bookmark audit

<!-- source: auditoria-de-favoritos-vision-general -->

1. Open Bookmark audit from the first sidebar or Settings → Data. If a previous check exists, it appears without querying every website again.
2. Click Refresh audit when you want a new check. Wait for completion and review its date: an old result does not guarantee a page's current status.
3. Use search, the result picker, or counters to narrow the list. Distinguish confirmed unavailability from a timeout, block, or network error.
4. To check a case, right-click its link and open it in another tab. The eye offers a preview, but some pages refuse embedding and must be checked in a normal tab.
5. If the address changed, click edit, correct the title and URL, and save. Check the status again with its individual button; changing only the title does not fix a wrong address.
6. Manually select the links you want to handle. Select candidates proposes cases confirmed by the audit, not every temporary error.
7. Before Delete selected, review the selection and native-synchronization scope. A row's × acts on that individual bookmark. Do not delete hundreds of links just because a query failed.
8. Export the report if you need to keep those check results. The report does not replace a full backup of your data.

Search, filter by status, or click the counters. You can manually select results, open a link in another tab, edit its title and URL, refresh its individual status, or delete it with confirmation. Automatic candidate selection is limited to confirmed nonexistence; network errors, timeouts, restrictions, and temporary failures do not prove that a link has disappeared.

With bidirectional writing enabled, changes and deletions are reflected in the browser. Read the confirmation before deleting. The audit queries your URLs directly and does not guarantee private-network isolation.

### Interpret available, unavailable, and inconclusive results

<!-- source: auditoria-de-favoritos-interpretar-disponible-no-disponible-y-no-concluyente -->

The audit records what it could check at a particular time, not a permanent truth about the website.

1. Review the check date. Use Refresh audit if you need a recent status.
2. Distinguish a confirmed nonexistent-page result from a timeout, restriction, or network error.
3. Manually open an inconclusive case in a normal tab before deciding what to do.
4. If several sites fail at once, check your connection, VPN, or browser restrictions before deleting bookmarks.

A block, redirect, or page requiring authentication can prevent an automatic check even when the link remains useful. Select candidates limits the automatic proposal; it does not turn every temporary error into a useless link. Keep a backup before any bulk deletion.

### Repair a link from the audit

<!-- source: auditoria-de-favoritos-reparar-un-enlace-desde-la-auditoria -->

Where: the link's row → edit button.

1. Right-click the link to check whether the page has moved.
2. If you find the new official address, return to the audit and edit the same bookmark's title and URL.
3. Save and click the individual refresh-status button to query that URL again.
4. Check the bookmark in its original folder, not only the report row.

Changing the name does not fix a broken destination. The preview may fail because of an iframe block even when the page opens normally in a tab. If bidirectional synchronization is active, also check the browser's bookmark manager. The × deletes that row's bookmark; it is not simply closing a search result.

## 11. Appearance, fonts, and languages

<!-- source: aspecto-fuentes-e-idiomas-vision-general -->

1. Click the Settings gear and open Appearance. Choose a theme from the list on the left and Light or Dark mode.
2. On the right, Upload image lets you choose a local background. Check the full preview and adjust its opacity before saving. Remove background removes that image from the setting, not the original file on your computer.
3. Under Interface font, choose Default to follow the theme's font or select another family. Only installed fonts and their fallbacks are used; external fonts are not downloaded.
4. The greeting's font and size have separate controls under General. Changing the general font is not the same as changing that greeting.
5. Under General, select Español or English and save. Visit a screen and return to Settings to check the change. The extension does not automatically translate private content you have just written.
6. When switching modes, detected monochrome favicons adapt to the background. Colored ones are preserved; the original icon's quality and resolution remain a limitation of the site.

Under General, choose Spanish or English, the two available languages. An older configuration with another language switches to Spanish. Saved translations are displayed without rewriting the originals. If you edit a title, description, or type, an earlier translation must not replace that text. Fields without a reviewed translation and external iframe content may remain in their original language.

### Adjust appearance without changing your data

<!-- source: aspecto-fuentes-e-idiomas-ajustar-el-aspecto-sin-cambiar-tus-datos -->

Where: Settings → Appearance.

1. Choose a theme from the list, then Light or Dark. These controls are related, but they are not the same setting.
2. For a background, use Upload image and check the preview. Adjust opacity so text remains readable.
3. Select the interface font. Default follows the theme's choice; other options depend on installed fonts.
4. Save and check a table, a card, and the side panel to assess readability.

Remove background removes the image from DashboardDP's setting, not the file on your computer. The greeting's font has its own configuration. Detected monochrome favicons adjust their tone to the background; colored logos are preserved. A small original image or one with an opaque background may still have visual limitations.

### What changes when choosing Spanish or English

<!-- source: aspecto-fuentes-e-idiomas-que-cambia-al-elegir-espanol-o-ingles -->

The interface language is not an automatic translation service for your personal data.

1. Open Settings → General and choose Español or English.
2. Save and check buttons, forms, and messages. Reviewed catalog translations can be displayed in the chosen language.
3. If you edit a widget's original text, do not assume its previous translation is valid: it must match the new wording.
4. For your own content, maintain translated versions yourself where appropriate. Changing the picker does not send your notes, bookmarks, or text to an external translator.

An embedded tool's content belongs to its provider and may remain in another language. An old configuration using a removed language defaults to Spanish. If product text remains untranslated, report the screen and exact phrase; you do not need to attach your private backup.

## 12. Backups, Trash, and restoration

<!-- source: copias-papelera-y-restauracion-vision-general -->

1. Before updating, importing a backup, or performing a major cleanup, open Settings → Data and the Full backup option.
2. Click Download full backup (.json). In the save dialog, choose a private folder outside the extension. Wait for the download to finish and check that the file exists and is not empty.
3. Keep at least one earlier version. The JSON contains unencrypted personal data; do not upload it to the repository or attach it to a public issue.
4. To recover a recently deleted item, open Trash, find it, and use restore. This is not restoring the whole JSON.
5. To recover a full backup, export the current state first, then use Restore full backup (.json). Select the correct file and read the confirmation: it replaces the destination's state rather than adding only missing items.
6. Then review bookmarks, groups, workspaces, library, notes, tasks, and projects. If you changed computers, profiles, or browsers, follow the installation manual to reconfigure synchronization and connections.
7. Do not clear DashboardDP's data to try to prevent duplicates before restoring. Keep the backup and current installation until you have checked recovery in a separate profile if you need a trial run.

Trash is temporary: up to 250 entries and 30 days; reaching the limit may remove entries sooner. Restoring from Trash and restoring a full backup are different operations. A full backup replaces the destination's state. Export the current state first and review the confirmation.

Account tokens are not exported. After reinstalling or changing profiles, review your data, authorize calendars, and configure the native folder again before enabling writing. Follow the [recovery manual](MANUAL_INSTALACION.md).

### Prepare a backup before updating

<!-- source: copias-papelera-y-restauracion-preparar-una-copia-antes-de-actualizar -->

Where: Settings → Data → Full backup.

1. Click Download full backup (.json) and wait for the download to finish.
2. Save the file in a private location outside the extension folder. Also keep an earlier version.
3. Check its name, date, and size. An empty file or incomplete download is not a usable backup.
4. Only then replace the extension's files following the installation manual, keeping the same folder and without uninstalling it.

Exporting HTML is different: it is for bookmarks and does not preserve the whole library, notes, projects, and settings. The full JSON contains unencrypted personal data and must not be published on GitHub. The backup does not include calendar sessions or tokens; those accounts require authorization again when applicable.

### Recover a deleted item or restore a full backup

<!-- source: copias-papelera-y-restauracion-recuperar-un-elemento-borrado-y-restaurar-una-copia-completa -->

These are different procedures. First choose the smallest-scope operation that solves the problem.

1. If you recently deleted an item, open Trash, locate it, and click restore.
2. Check that it has returned to the appropriate collection. Trash has time and quantity limits; it is not a permanent archive.
3. If you need to return to the complete state of a backup, export the current state first.
4. Use Restore full backup, choose the correct JSON, and confirm only after reading what will be replaced.
5. Review bookmarks, notes, tasks, projects, widgets, and pending connections in the result.

Do not clear browser data first to prevent assumed duplicates. Restoring a full backup replaces the state; it does not add only what is missing. Test in a separate profile if you want to check a backup without risking your usual installation.

### Change computers or browsers without losing your library

<!-- source: copias-papelera-y-restauracion-cambiar-de-equipo-o-navegador-sin-perder-la-biblioteca -->

DashboardDP storage belongs to the browser profile, not the folder containing the extension files.

1. At the source, export a recent full backup and keep a second private copy.
2. Install the extension at the destination and restore the JSON from Settings → Data.
3. Check several widgets, notes, groups, and projects before retiring the previous computer.
4. Review the new profile's native-bookmark folder before enabling bidirectional writing.
5. Authorize Google or Microsoft again if you use connected calendars.

Copying only the extension folder is not the same as copying your data. The public catalog provides a shared base of tools, but it does not replace a backup of personal widgets, favorite widgets, settings, or sidebar layouts.

## 13. Permissions and external services

<!-- source: permisos-y-servicios-externos-vision-general -->

1. When a feature requests permission, check which site or capability it needs. You can cancel and continue using local features that do not require it.
2. Calendar connections, holiday queries, and repository reading are optional. Do not enter passwords or secret keys into fields intended for a widget URL.
3. Close previews and external blocks you are not using. Closing an iframe releases that instance but does not revoke permissions you granted to the browser.
4. To remove permissions, open DashboardDP's details on the browser's extensions page. Disconnecting an account and revoking site permissions are not necessarily the same operation.
5. If a website works in its own tab but rejects the iframe, check its terms and official embedding button. DashboardDP does not bypass provider blocks or guarantee the service will remain free.
6. To report a failure, include your browser, DashboardDP version, screen, steps, and expected result. Use fictional examples and hide private URLs, notes, tokens, and account details before sending a screenshot.

See [Privacy](../PRIVACIDAD.md), [Security](../SECURITY.md), and [Licenses](../THIRD-PARTY-NOTICES.md). When requesting help, describe the problem without attaching personal backups, tokens, or private screenshots.

### Troubleshoot a widget without removing protections

<!-- source: permisos-y-servicios-externos-resolver-un-widget-que-no-carga-sin-quitar-protecciones -->

First identify whether the problem is the URL, embedding code, or a provider restriction.

1. Open the official address in a normal tab and check that it still exists.
2. Find its official embed option and compare the src with the one saved in your entry.
3. Test the preview with fictional data. If it fails only inside the iframe, the provider may not allow that integration.
4. Review granted permissions in the extension's details. Do not enable unnecessary accounts, payments, or permissions to try to force a public tool to work.

An HTTPS URL does not guarantee quality, security, or permanent availability. Closing the block releases that instance but does not delete data the service may have stored independently. Do not add scripts or instructions found on a website to bypass browser blocks.

### Report a problem with useful information and no private data

<!-- source: permisos-y-servicios-externos-comunicar-un-problema-con-informacion-util-y-sin-datos-privados -->

Prepare a small reproduction before asking for help.

1. Copy the version shown in Settings → About and note which browser you use.
2. Write down the exact screen and steps, for example Library → Text filter → Change type.
3. Describe what you expected and what actually happens separately. Mention whether it always occurs or only with one widget.
4. If attaching a screenshot, hide names, private URLs, notes, and account details. For an iframe, use a public example if possible.
5. Do not publish full backups, tokens, passwords, or credentials in an issue.

A screenshot of an empty window does not reveal whether the cause is a filter, pending load, or failure. Including the previous step and control name is usually more helpful than sending your entire personal library.
