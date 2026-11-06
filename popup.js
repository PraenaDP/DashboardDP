'use strict';

const popupApi = globalThis.browser || globalThis.chrome;

function openDashboard() {
  const url = popupApi.runtime.getURL('dashboard/index.html');
  try {
    const created = popupApi.tabs.create({ url });
    if (created && typeof created.then === 'function') created.then(() => window.close()).catch(() => {});
    else window.setTimeout(() => window.close(), 150);
  } catch {}
}

document.getElementById('openDashboard').addEventListener('click', openDashboard);
openDashboard();
