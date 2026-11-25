/* Lee únicamente el DOM público de PhET con autorización opcional del usuario. */
const PHET_IMPORT_GROUPS = [
  ['physics', 'Educación - Física'],
  ['math', 'Educación - Matemáticas y Estadística'],
  ['chemistry', 'Educación - Química'],
  ['earth-and-space', 'Educación - Tierra y Espacio'],
  ['biology', 'Educación - Biología']
];

function phetPreferredCategory(categories) {
  // Una sola tipología por widget: priorizar las materias específicas.
  const priority = ['Biología', 'Química', 'Tierra y Espacio', 'Matemáticas y Estadística', 'Física'];
  return [...categories].sort((a, b) => priority.findIndex(v => a.endsWith(v)) - priority.findIndex(v => b.endsWith(v)))[0];
}

function phetImportKey(value) {
  try {
    const url = new URL(value);
    return url.origin === 'https://phet.colorado.edu' ? url.pathname.match(/^\/sims\/html\/([a-z0-9-]+)\//)?.[1] || null : null;
  } catch { return null; }
}

function phetWithoutDownload(value) {
  try {
    const url = new URL(value);
    if (url.origin !== 'https://phet.colorado.edu' || !/^\/sims\/html\/([a-z0-9-]+)\/[^/]+\/\1_(es|all)\.html$/.test(url.pathname) || !url.searchParams.has('download')) return value;
    url.searchParams.delete('download');
    return url.href;
  } catch { return value; }
}

function phetRequestAccess(api = globalThis.chrome) {
  // Llamada única y síncrona desde el clic; compatible con la API de callbacks.
  return new Promise((resolve, reject) => {
    if (!api?.permissions?.request || !api?.runtime?.getManifest) {
      reject(new Error('La API de permisos no está disponible. Abre DashboardDP como extensión, no como archivo HTML.')); return;
    }
    const manifest = api.runtime.getManifest();
    if (![...(manifest.permissions || []), ...(manifest.optional_permissions || [])].includes('scripting')) {
      reject(new Error('La extensión cargada no incluye el permiso scripting. Comprueba que Brave usa la carpeta DashboardDP actual y pulsa Recargar en esa extensión. No la desinstales.')); return;
    }
    try {
      api.permissions.request({ permissions: ['scripting'], origins: ['https://phet.colorado.edu/*'] }, granted => {
        const error = api.runtime.lastError;
        if (error) reject(new Error(error.message)); else resolve(!!granted);
      });
    } catch (error) { reject(error); }
  });
}

// Esta función se ejecuta aislada en las pestañas temporales, nunca en DashboardDP.
function phetReadPage(mode) {
  if (location.origin !== 'https://phet.colorado.edu') throw new Error('Origen no permitido');
  const main = document.querySelector('main, [role="main"]') || document.body;
  if (mode === 'list') {
    const links = [...main.querySelectorAll('a[href]')].map(a => {
      try { const u = new URL(a.href); return u.origin === location.origin && /^\/es\/simulations\/(?!filter$)[a-z0-9-]+\/?$/.test(u.pathname) ? u.origin + u.pathname.replace(/\/$/, '') : null; } catch { return null; }
    }).filter(Boolean);
    window.scrollTo(0, document.documentElement.scrollHeight);
    const more = [...main.querySelectorAll('button')].find(b => /^(mostrar más|cargar más|ver más|load more|show more)$/i.test(b.textContent.trim()) && !b.disabled);
    if (more) more.click();
    return { links: [...new Set(links)], more: !!more };
  }
  const title = (main.querySelector('h1')?.textContent || document.querySelector('meta[property="og:title"]')?.content || '').split('|')[0].trim();
  const description = (document.querySelector('meta[name="description"]')?.content || '').trim();
  // No usar los enlaces <a>: incluyen la descarga, no el código de incrustación.
  const sources = [...document.querySelectorAll('iframe[src]')].map(n => n.getAttribute('src'));
  for (const node of document.querySelectorAll('textarea,pre,code,input')) {
    const text = node.value || node.textContent || '';
    if (/<iframe\b/i.test(text)) {
      const snippet = new DOMParser().parseFromString(text, 'text/html');
      for (const frame of snippet.querySelectorAll('iframe[src]')) sources.push(frame.getAttribute('src'));
    }
  }
  let embed = null;
  for (const source of sources) {
    try {
      const url = new URL(source, location.href);
      if (url.origin !== location.origin || !/^\/sims\/html\/([a-z0-9-]+)\/[^/]+\/\1_(es|all)\.html$/.test(url.pathname)) continue;
      const pageSlug = location.pathname.match(/\/simulations\/([a-z0-9-]+)\/?$/)?.[1];
      if (pageSlug && url.pathname.split('/')[3] !== pageSlug) continue;
      url.searchParams.delete('download');
      if (url.pathname.endsWith('_all.html')) url.searchParams.set('locale', 'es');
      embed = url.href;
      if (url.pathname.endsWith('_es.html')) break;
    } catch { /* ignorar enlaces ajenos */ }
  }
  if (!embed && !document.documentElement.dataset.dashboardPhetEmbedOpened) {
    const button = [...main.querySelectorAll('button')].find(b => /incrustar|embed/i.test((b.textContent || '') + ' ' + (b.getAttribute('aria-label') || '')));
    if (button) { document.documentElement.dataset.dashboardPhetEmbedOpened = '1'; button.click(); }
  }
  return { title, description, embed };
}

async function repositoryScanPhet(signal,report,resume={}){
 const read=async(url,mode)=>{
  if(signal.aborted)throw Error('Cancelado');
  const tab=await chrome.tabs.create({url,active:false});let previous='',stable=0;const links=new Set();
  try{
   for(let attempt=0;attempt<(mode==='list'?35:20);attempt++){
    await new Promise(resolve=>setTimeout(resolve,800));if(signal.aborted)throw Error('Cancelado');
    const current=await chrome.tabs.get(tab.id);if(current.status!=='complete')continue;
    if(new URL(current.url).origin!=='https://phet.colorado.edu')throw Error('Redirección fuera de PhET');
    const execution=await chrome.scripting.executeScript({target:{tabId:tab.id},func:phetReadPage,args:[mode]});const result=execution[0]?.result;
    if(mode==='detail'&&result?.embed&&result.title)return result;
    if(mode==='list'&&result){result.links.forEach(link=>links.add(link));const signature=[...links].sort().join('|');stable=signature===previous&&!result.more?stable+1:0;previous=signature;if(links.size&&stable>=3)return {links:[...links]};}
   }
   throw Error('La página no terminó de cargar');
  }finally{
   // Never close a tab the user has navigated away from the authorized site.
   try{const current=await chrome.tabs.get(tab.id);if(new URL(current.pendingUrl||current.url).origin==='https://phet.colorado.edu')await chrome.tabs.remove(tab.id);}catch{}
  }
 };
 const pages=new Map((resume.pages||[]).map(([url,categories])=>[url,new Set(categories)])),widgets=resume.widgets||(resume.widgets=[]),subjects=new Set(resume.subjects||[]),done=new Set(resume.done||[]);let failures=resume.failures||0;
 for(const [subject,category]of PHET_IMPORT_GROUPS){
  if(subjects.has(subject))continue;
  if(signal.aborted)break;report('Leyendo '+category+'… · Simulaciones localizadas: '+pages.size,widgets);
  try{const url=new URL('https://phet.colorado.edu/es/simulations/filter');url.searchParams.set('subjects',subject);url.searchParams.set('type','html');
   const result=await read(url.href,'list');for(const link of result.links){if(!pages.has(link))pages.set(link,new Set());pages.get(link).add(category);}
  }catch{if(signal.aborted)throw Error('Cancelado');failures++;}
  subjects.add(subject);resume.subjects=[...subjects];resume.pages=[...pages].map(([url,categories])=>[url,[...categories]]);resume.failures=failures;report('Categorías revisadas: '+subjects.size,widgets);
 }
 let count=0;
 for(const [url,categories]of pages){
  if(done.has(url)){count++;continue;}
  if(signal.aborted)break;report(`Escaneando simulación ${++count} de ${pages.size} · Errores: ${failures}`,widgets);
  try{const detail=await read(url,'detail');widgets.push({url:detail.embed,title:detail.title,description:detail.description,widgetType:phetPreferredCategory(categories),width:'100%',height:600});}catch{if(signal.aborted)throw Error('Cancelado');failures++;}
  done.add(url);resume.done=[...done];resume.failures=failures;
  report(`Simulaciones procesadas: ${count} de ${pages.size} · Errores: ${failures}`,widgets);
 }
 return {widgets,failures};
}


