'use strict';

const popupApi=globalThis.browser||globalThis.chrome;
const popupKey='dashboard_favorites_v2';
const area=document.getElementById('collections'),search=document.getElementById('search'),status=document.getElementById('status');
let data={},english=false;
let viewMode='icon';
const viewKey=popupKey+':side-panel-view';
const paths={icon:'M4 4h4v4H4z M16 4h4v4h-4z M4 16h4v4H4z M16 16h4v4h-4z',list:'M8 6h13 M8 12h13 M8 18h13 M3 6h1 M3 12h1 M3 18h1',cards:'M3 4h7v16H3z M14 4h7v16h-7z',folder:'M3 7V5h6l2 2h10v13H3z',briefcase:'M3 7h18v13H3z M8 7V3h8v4 M3 12h18 M10 12v3h4v-3'};
function glyph(name){const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 24 24');svg.setAttribute('fill','none');svg.setAttribute('stroke','currentColor');svg.setAttribute('stroke-width','1.7');svg.setAttribute('aria-hidden','true');const path=document.createElementNS(svg.namespaceURI,'path');path.setAttribute('d',paths[name]||paths.folder);svg.append(path);return svg;}
const text=(es,en)=>english?en:es;
const node=(tag,value,className)=>{const element=document.createElement(tag);if(value!==undefined)element.textContent=value;if(className)element.className=className;return element;};
function safeUrl(value){try{const url=new URL(value);return ['http:','https:'].includes(url.protocol)&&!url.username&&!url.password?url.href:null;}catch{return null;}}
function bookmarkLink(bookmark){
 const url=safeUrl(bookmark.url);if(!url)return null;
 const link=node('a',undefined,'popup-bookmark');link.href=url;link.target='_blank';link.rel='noopener noreferrer';link.title=url;
 // Request enough pixels for the largest view and high-density screens. Keep
 // the browser's favicon service: no new third-party icon requests or tracking.
 const iconSize=Math.min(256,Math.max(64,2**Math.ceil(Math.log2(32*Math.max(1,window.devicePixelRatio||1)))));
 const icon=node('img');icon.width=icon.height=16;icon.alt='';icon.loading='lazy';icon.src=popupApi.runtime.getURL('_favicon/')+'?pageUrl='+encodeURIComponent(url)+'&size='+iconSize;icon.onerror=()=>{icon.hidden=true;};
 const name=bookmark.name||new URL(url).hostname;link.setAttribute('aria-label',name);link.title=name+'\n'+url;
 const fallback=node('span',name.slice(0,1).toLocaleUpperCase(),'popup-fallback');fallback.hidden=true;icon.onerror=()=>{icon.hidden=true;fallback.hidden=false;};
 link.append(icon,fallback,node('span',name,'popup-name'),node('small',new URL(url).hostname,'popup-domain'));return link;
}
function matches(bookmark,query){return ((bookmark.name||'')+' '+(bookmark.url||'')).toLocaleLowerCase().includes(query);}
function render(){
 const expanded=new Set([...area.querySelectorAll('details[open]')].map(item=>item.dataset.key));area.replaceChildren();
 area.dataset.view=viewMode;
 const viewBar=document.getElementById('views');viewBar.replaceChildren();viewBar.setAttribute('aria-label',text('Vista de accesos','Shortcut view'));
 for(const [mode,label]of [['icon',text('Iconos','Icons')],['list',text('Lista','List')],['cards',text('Tarjetas','Cards')]]){
  const button=node('button');button.type='button';button.title=label;button.setAttribute('aria-label',label);button.setAttribute('aria-pressed',String(mode===viewMode));button.append(glyph(mode));button.onclick=()=>{viewMode=mode;try{localStorage.setItem(viewKey,mode);status.textContent='';}catch{status.textContent=text('No se pudo guardar la vista.','Could not save the view.');}render();};viewBar.append(button);
 }
 const bookmarks=Array.isArray(data.bookmarks)?data.bookmarks:[],groups=Array.isArray(data.quickGroups)?data.quickGroups:[],workspaces=Array.isArray(data.workspaces)?data.workspaces:[];
 const byId=new Map(bookmarks.filter(bookmark=>bookmark&&safeUrl(bookmark.url)).map(bookmark=>[bookmark.id,bookmark]));
 const query=search.value.trim().toLocaleLowerCase();let shown=0;
 const section=title=>{const wrap=node('section');wrap.append(node('h2',title));area.append(wrap);return wrap;};
 const addLink=(parent,bookmark)=>{const link=bookmarkLink(bookmark);if(link){parent.append(link);shown++;}};
 const order=(items,mode)=>items.slice().sort((a,b)=>mode==='name-desc'?String(b.name||'').localeCompare(a.name||''):mode==='name-asc'?String(a.name||'').localeCompare(b.name||''):(a.order||0)-(b.order||0));
 const pinned=[...byId.values()].filter(bookmark=>bookmark.pinned),groupIds=new Set(groups.flatMap(group=>Array.isArray(group.bookmarkIds)?group.bookmarkIds:[]));
 const loose=pinned.filter(bookmark=>!groupIds.has(bookmark.id)&&matches(bookmark,query));
 if(loose.length){const wrap=section(text('Fijados','Pinned')),links=node('div',undefined,'popup-links');wrap.append(links);order(loose,data.settings?.quickSortMode).forEach(bookmark=>addLink(links,bookmark));}
 function collections(items,title,isWorkspace){
  let wrap=null;
  for(const item of order(items,isWorkspace?data.settings?.workspaceSortMode:data.settings?.quickSortMode)){
   const members=[...new Set(Array.isArray(item.bookmarkIds)?item.bookmarkIds:[])].map(id=>byId.get(id)).filter(bookmark=>bookmark&&(isWorkspace||bookmark.pinned));
   const nameMatches=String(item.name||'').toLocaleLowerCase().includes(query),visible=members.filter(bookmark=>nameMatches||matches(bookmark,query));
   if(query&&!nameMatches&&!visible.length)continue;
   if(!wrap){const sectionRoot=section(title);wrap=node('div',undefined,'popup-collections');sectionRoot.append(wrap);}
   const details=node('details'),summary=node('summary'),label=node('span',item.name||title),count=node('small',String(members.length));
   details.dataset.key=(isWorkspace?'workspace:':'group:')+item.id;details.open=!!query||expanded.has(details.dataset.key);
   if(/^#[0-9a-f]{3,8}$/i.test(item.color||''))details.style.setProperty('--collection-color',item.color);
   summary.append(glyph(isWorkspace?'briefcase':'folder'),label,count);details.append(summary);shown++;
   if(isWorkspace&&members.length){
    const launch=node('button',text('Abrir espacio completo','Open full workspace'),'btn secondary popup-launch');launch.type='button';launch.onclick=async()=>{
     if(members.length>5&&!confirm(text('¿Abrir '+members.length+' pestañas de este espacio?','Open '+members.length+' tabs for this workspace?')))return;
     launch.disabled=true;try{for(const bookmark of members)await popupApi.tabs.create({url:safeUrl(bookmark.url),active:false});status.textContent=text('Espacio abierto.','Workspace opened.');}catch{status.textContent=text('No se pudieron abrir todos los enlaces.','Some links could not be opened.');}finally{launch.disabled=false;}
    };details.append(launch);
   }
   if(visible.length){const links=node('div',undefined,'popup-links');details.append(links);visible.forEach(bookmark=>addLink(links,bookmark));}else details.append(node('p',text('Sin enlaces fijados.','No pinned links.'),'popup-empty'));
   wrap.append(details);
  }
 }
 collections(groups,text('Grupos','Groups'),false);collections(workspaces,text('Espacios de trabajo','Workspaces'),true);
 if(!shown)area.append(node('p',query?text('Sin coincidencias.','No matches.'):text('Todavía no hay fijados, grupos ni espacios de trabajo. Puedes organizarlos desde DashboardDP.','No pinned items, groups or workspaces yet. Organize them in DashboardDP.'),'popup-empty'));
}
function load(){
 try{data=JSON.parse(localStorage.getItem(popupKey)||'{}')||{};}catch{data={};status.textContent='No se pudieron leer los datos de DashboardDP.';}
 english=data.settings?.language==='en';document.documentElement.lang=english?'en':'es';
 try{const saved=localStorage.getItem(viewKey);viewMode=['icon','list','cards'].includes(saved)?saved:['icon','list','cards'].includes(data.settings?.quickViewMode)?data.settings.quickViewMode:'icon';}catch{viewMode='icon';}
 document.body.dataset.theme=['default','vercelin','youtubin','grafanin','cloudflerin','spotin','xakatin','catppuccin'].includes(data.settings?.skin)?data.settings.skin:'default';document.body.classList.toggle('light',data.settings?.theme==='light');
 search.placeholder=text('Buscar accesos…','Search shortcuts…');search.setAttribute('aria-label',text('Buscar accesos','Search shortcuts'));document.getElementById('openDashboard').textContent=text('Abrir Dashboard','Open Dashboard');render();
}
document.getElementById('openDashboard').onclick=()=>popupApi.tabs.create({url:popupApi.runtime.getURL('dashboard/index.html')});
search.oninput=render;window.addEventListener('storage',event=>{if(event.key===popupKey||event.key===viewKey||event.key===null)load();});
load();search.focus();
