'use strict';

/* Compatible con Chromium, Brave, Edge y Firefox. La página de nueva pestaña
   recibe el aviso y vuelve a leer el árbol completo para conservar sus rutas. */
const api = globalThis.browser || globalThis.chrome;
// En Brave la página de nueva pestaña puede recibir una API parcial. Para el
// puente de OAuth usamos explícitamente la interfaz Chromium del worker.
const oauthApi = (globalThis.chrome && globalThis.chrome.runtime) ? globalThis.chrome : api;
let timer = null;
const NATIVE_BOOKMARK_CHANGE_KEY = 'dashboardNativeBookmarkChange';

function isTrustedDashboardSender(sender) {
  return !!sender && sender.id === api.runtime.id &&
    (!sender.url || sender.url.startsWith(api.runtime.getURL('')));
}

function validReminderId(id) {
  return typeof id === 'string' && id.length > 0 && id.length <= 160 &&
    !['__proto__', 'prototype', 'constructor'].includes(id);
}

function validCalendarAuthUrl(value) {
  try {
    const url = new URL(value);
    return !url.username && !url.password &&
      ((url.origin === 'https://accounts.google.com' && url.pathname === '/o/oauth2/v2/auth') ||
       (url.origin === 'https://login.microsoftonline.com' && url.pathname === '/common/oauth2/v2.0/authorize'));
  } catch { return false; }
}

function ignoreRejectedPromise(result) {
  if (result && typeof result.catch === 'function') result.catch(() => {});
}

function notifyDashboard(kind, bookmarkId) {
  const change = {
    at: Date.now(),
    kind,
    bookmarkId: bookmarkId === undefined || bookmarkId === null ? '' : String(bookmarkId)
  };

  // El registro persistente evita perder el cambio si Brave suspende el worker,
  // todavía no hay una pestaña del Dashboard abierta o el Dashboard ya estaba
  // procesando otra sincronización cuando llegó el evento.
  try {
    ignoreRejectedPromise(api.storage.local.set({ [NATIVE_BOOKMARK_CHANGE_KEY]: change }));
  } catch {}

  clearTimeout(timer);
  timer = setTimeout(() => {
    try {
      ignoreRejectedPromise(api.runtime.sendMessage({ type: 'dashboard-bookmarks-changed', change }));
    } catch {}
  }, 250);
}

api.bookmarks.onCreated?.addListener?.((id) => notifyDashboard('created', id));
api.bookmarks.onChanged?.addListener?.((id) => notifyDashboard('changed', id));
api.bookmarks.onMoved?.addListener?.((id) => notifyDashboard('moved', id));
api.bookmarks.onRemoved?.addListener?.((id) => notifyDashboard('removed', id));
api.bookmarks.onChildrenReordered?.addListener?.((id) => notifyDashboard('reordered', id));

async function savePendingCapture(capture) {
  const stored = await api.storage.local.get('pendingCaptures');
  const pending = Array.isArray(stored.pendingCaptures) ? stored.pendingCaptures : [];
  pending.push(capture);
  await api.storage.local.set({ pendingCaptures: pending.slice(-20) });
}

api.runtime.onInstalled.addListener(() => {
  try {
    api.contextMenus.create({
      id: 'dashboard-save-page',
      title: 'Guardar página en Dashboard',
      contexts: ['page', 'link']
    });
  } catch {}
});

api.contextMenus.onClicked.addListener(async (info, tab) => {
  const url = info.linkUrl || info.pageUrl || (tab && tab.url);
  if (!url || !/^https?:/i.test(url)) return;
  const capture = { url, title: (tab && tab.title) || info.selectionText || 'Nuevo favorito' };
  try {
    await api.runtime.sendMessage({ type: 'dashboard-capture', capture });
  } catch {
    await savePendingCapture(capture);
  }
});

if (api.action && api.action.onClicked) {
  api.action.onClicked.addListener(() => {
    api.tabs.create({ url: api.runtime.getURL('dashboard/index.html') }).catch(() => {});
  });
}

api.runtime.onMessage.addListener((message, sender) => {
  if (!message || !isTrustedDashboardSender(sender)) return;
  if (message.type === 'dashboard-open-tabs' && Array.isArray(message.urls)) {
    message.urls.slice(0, 100).filter((url) => typeof url === 'string' && /^https?:\/\//i.test(url)).forEach((url) => {
      Promise.resolve(api.tabs.create({ url, active: false })).catch(() => {});
    });
    return;
  }
  if (message.type === 'dashboard-schedule-task-reminder') {
    return scheduleTaskReminder(message.task).then(() => ({ ok: true })).catch(() => ({ ok: false }));
  }
  if (message.type === 'dashboard-clear-task-reminder') {
    return clearTaskReminder(message.taskId).then(() => ({ ok: true })).catch(() => ({ ok: false }));
  }
});

// La ventana de OAuth se abre desde el contexto interno de la extensión, no
// desde la página visual de nueva pestaña. Así funciona también en Brave.
oauthApi.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (!message) return;
  if (!isTrustedDashboardSender(sender)) {
    sendResponse({ ok: false, error: 'Unauthorized extension message.' });
    return;
  }
  if (message.type !== 'dashboard-launch-calendar-auth') return;
  if (!validCalendarAuthUrl(message.url)) {
    sendResponse({ ok: false, error: 'Unauthorized OAuth destination.' });
    return;
  }
  if (!oauthApi.identity || !oauthApi.identity.launchWebAuthFlow || !message.url) {
    sendResponse({ ok: false, error: 'OAuth identity API is unavailable in this browser.' });
    return;
  }
  try {
    // Brave puede exponer esta API en modo callback incluso en Manifest V3.
    // El callback mantiene vivo el worker hasta que Google redirige de vuelta.
    const interactive = message.interactive !== false;
    const details = { url: message.url, interactive };
    if (!interactive) {
      details.abortOnLoadForNonInteractive = false;
      details.timeoutMsForNonInteractive = 10000;
    }
    oauthApi.identity.launchWebAuthFlow(details, (redirectedUrl) => {
      const runtimeError = oauthApi.runtime.lastError;
      if (runtimeError) {
        sendResponse({ ok: false, error: runtimeError.message || String(runtimeError) });
        return;
      }
      sendResponse({ ok: true, redirectedUrl });
    });
  } catch (error) {
    sendResponse({ ok: false, error: error && error.message ? error.message : String(error) });
  }
  return true;
});

const TASK_ALARM_PREFIX = 'dashboard-task-reminder:';

async function scheduleTaskReminder(task) {
  if (!task || !validReminderId(task.id)) return;
  await clearTaskReminder(task.id);
  const when = Number(task.reminderAt);
  if (!Number.isFinite(when) || when <= Date.now() || task.status === 'done') return;
  const stored = await api.storage.local.get('dashboardTaskReminders');
  const reminders = stored.dashboardTaskReminders || {};
  reminders[task.id] = { title: String(task.title || 'Tarea'), dueAt: Number(task.dueAt) || 0 };
  await api.storage.local.set({ dashboardTaskReminders: reminders });
  await api.alarms.create(TASK_ALARM_PREFIX + task.id, { when });
}

async function clearTaskReminder(taskId) {
  if (!validReminderId(taskId)) return;
  await api.alarms.clear(TASK_ALARM_PREFIX + taskId);
  const stored = await api.storage.local.get('dashboardTaskReminders');
  const reminders = stored.dashboardTaskReminders || {};
  if (!(taskId in reminders)) return;
  delete reminders[taskId];
  await api.storage.local.set({ dashboardTaskReminders: reminders });
}

api.alarms.onAlarm.addListener(async (alarm) => {
  if (!alarm.name.startsWith(TASK_ALARM_PREFIX)) return;
  const taskId = alarm.name.slice(TASK_ALARM_PREFIX.length);
  const stored = await api.storage.local.get('dashboardTaskReminders');
  const reminders = stored.dashboardTaskReminders || {};
  const task = reminders[taskId];
  if (!task) return;
  const message = task.dueAt
    ? `Vence: ${new Date(task.dueAt).toLocaleString()}`
    : 'Tienes un recordatorio pendiente.';
  await api.notifications.create('dashboard-task:' + taskId, {
    type: 'basic',
    iconUrl: 'icons/icon-128.png',
    title: 'Dashboard · ' + task.title,
    message
  });
  delete reminders[taskId];
  await api.storage.local.set({ dashboardTaskReminders: reminders });
});

api.notifications.onClicked.addListener(() => {
  api.tabs.create({ url: api.runtime.getURL('dashboard/index.html') }).catch(() => {});
});
