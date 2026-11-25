/* Public HTML discovery only. No remote scripts, proxies, or frame-policy overrides. */
const WIDGET_REPOSITORY_DEFAULTS=['https://calculations.tools/embed-tools','https://hifreetools.com/es','https://phet.colorado.edu/es/','https://haowordtool.com/embed/','https://www.toolkitsapp.com/es'];
function repositoryUrl(value,base){
 try{const url=new URL(value,base);if(url.protocol!=='https:'||url.username||url.password)return null;return url;}catch{return null;}
}
function repositoryWidgetKey(value){
 const url=repositoryUrl(value);if(!url)return '';
 url.hash='';url.hostname=url.hostname.replace(/^www\./,'');url.pathname=url.pathname.replace(/\/+$/,'')||'/';
 // Metercustom's speed test uses hl only for its interface language.
 if(url.hostname==='metercustom.net'&&url.pathname==='/plugin'){
  for(const key of [...url.searchParams.keys()])if(key.toLowerCase()==='hl')url.searchParams.delete(key);
 }
 const providers=['toolkitsapp.com','hifreetools.com','haowordtool.com','calculations.tools','phet.colorado.edu'];
 if(providers.includes(url.hostname)){
  // Presentation/language changes do not create a different tool. Keep all
  // other parameters (formula, units, location, etc.) and full regional paths.
  for(const key of [...url.searchParams.keys()])if(['lang','locale','hl','theme','header','width','height'].includes(key.toLowerCase())||key.toLowerCase().startsWith('utm_'))url.searchParams.delete(key);
  if(url.hostname==='toolkitsapp.com')url.pathname=url.pathname.replace(/^\/(?:es|en|ca|eu|de|fr|it|pt|gl|zh|ja|ko|ru|ar)\/embed\//,'/embed/');
  if(url.hostname==='phet.colorado.edu'){
   const match=url.pathname.match(/^\/sims\/html\/([a-z0-9-]+)\/[^/]+\/\1_(?:[a-z]{2}(?:[_-][A-Za-z]+)?|all)\.html$/);
   if(match)url.pathname='/sims/html/'+match[1];
  }
 }
 url.searchParams.delete('download');url.searchParams.sort();return url.href;
}
function repositoryVariantKey(value){
 const url=repositoryUrl(value);if(!url)return '';
 url.hash='';url.hostname=url.hostname.replace(/^www\./,'');
 const locale=/^(?:es|en|ca|eu|de|fr|it|pt|gl|zh|ja|ko|ru|ar|nl|pl|tr|uk|cs|da|fi|sv|no|el|he|hi|id|th|vi)(?:[-_][a-z]{2})?$/i;
 const segments=url.pathname.split('/').filter(Boolean);
 if(locale.test(segments[0]||''))segments.shift();
 url.pathname='/'+segments.join('/');
 for(const key of [...url.searchParams.keys()]){
  const name=key.toLowerCase(),values=url.searchParams.getAll(key);
  if((['lang','locale','hl','language','ui_lang'].includes(name)&&values.every(v=>locale.test(v)))||name.startsWith('utm_')||
   (name==='theme'&&values.every(v=>/^(dark|light|auto|system)$/i.test(v)))||
   (['header','showheader'].includes(name)&&values.every(v=>/^(0|1|true|false)$/i.test(v))))url.searchParams.delete(key);
 }
 url.searchParams.sort();return url.href;
}
function repositoryMatch(widget,library){
 const key=repositoryWidgetKey(widget.url);
 const confirmed=library.find(previous=>repositoryWidgetKey(previous.url)===key);
 if(confirmed)return {kind:'imported',entry:confirmed};
 const variantKey=repositoryVariantKey(widget.url);
 const variant=library.find(previous=>repositoryVariantKey(previous.url)===variantKey);
 if(variant)return {kind:'possible',entry:variant,reason:'Variante de idioma o presentación'};
 const possible=typeof calcEquivalent==='function'?calcEquivalent(widget,library):null;
 return possible?{kind:'possible',entry:possible}:{kind:'available',entry:null};
}
function repositorySources(saved,widgets){
 const sources=new Map();
 for(const value of [...WIDGET_REPOSITORY_DEFAULTS,...(Array.isArray(saved)?saved:[]),...widgets.map(w=>w.url)]){
  const url=repositoryUrl(value);if(!url)continue;
  const host=url.hostname.replace(/^www\./,'');
  if(sources.has(host))continue;
  const known=WIDGET_REPOSITORY_DEFAULTS.find(value=>new URL(value).hostname.replace(/^www\./,'')===host);
  sources.set(host,known||(Array.isArray(saved)&&saved.includes(value)?url.href:url.origin));
 }
 return [...sources.values()];
}
function repositoryScanCounts(items,library){
 const existing=new Map(library.map(w=>[repositoryWidgetKey(w.url),w]));
 let imported=0,different=0,possible=0;
 for(const item of items){const previous=existing.get(repositoryWidgetKey(item.url));if(previous){imported++;if(['title','description','widgetType'].some(key=>String(previous[key]||'').trim()!==String(item[key]||'').trim()))different++;}else if(repositoryMatch(item,library).kind==='possible')possible++;}
 return {found:items.length,new:items.length-imported-possible,imported,possible,different,missing:items.filter(w=>!String(w.description||'').trim()).length};
}
function repositoryScanSummary(items,library){
 const count=repositoryScanCounts(items,library);
 return `Encontradas: ${count.found} · Nuevas: ${count.new} · Ya importadas: ${count.imported} · Posibles equivalentes: ${count.possible} · Con textos distintos: ${count.different} · Sin descripción: ${count.missing}`;
}
function repositoryCategory(value){
 const text=String(value||'').trim().replace(/\s+/g,' ');
 const key=text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[-_]+/g,' ');
 const names={calculator:'Calculadoras',calculators:'Calculadoras',calculadora:'Calculadoras',calculadoras:'Calculadoras',converter:'Conversores',converters:'Conversores',conversion:'Conversores',conversores:'Conversores',finance:'Finanzas',financial:'Finanzas',finanzas:'Finanzas',health:'Salud',salud:'Salud',text:'Texto',texto:'Texto',image:'Imagen',images:'Imagen',imagen:'Imagen',pdf:'PDF',science:'Ciencia',ciencia:'Ciencia',development:'Desarrollo',developer:'Desarrollo',desarrollo:'Desarrollo',construction:'Construcción',construccion:'Construcción',math:'Matemáticas',mathematics:'Matemáticas',matematicas:'Matemáticas',tax:'Impuestos',date:'Fecha y hora',time:'Fecha y hora','date and time':'Fecha y hora'};
 return names[key]||'';
}
function repositoryPathCategory(value){
 const url=repositoryUrl(value);if(!url)return '';
 for(const segment of url.pathname.split('/').filter(Boolean)){const category=repositoryCategory(decodeURIComponent(segment));if(category)return category;}
 return '';
}
function repositoryCardCategory(text){
 const label=String(text||'').trim().match(/(Calculators?|Calculadoras?|Converters?|Conversores|Convert|Finance|Health|Writing|Security|Network|Generate|Image|Math|Date|Time|Developer|Development|Text|PDF)\s*$/i)?.[1]||'';
 return ({writing:'Texto',security:'Seguridad',network:'Redes',generate:'Generadores',convert:'Conversores'})[label.toLowerCase()]||repositoryCategory(label);
}
function repositoryToolPageKey(value){
 const url=repositoryUrl(value);if(!url)return '';
 // HaoWordTool publishes matching /tools/name.html and /embed/name.html.
 if(url.hostname.replace(/^www\./,'')==='haowordtool.com')url.pathname=url.pathname.replace(/^\/embed\/(.+\.html)$/,'/tools/$1');
 return repositoryWidgetKey(url.href);
}
function repositoryEnrichWidgets(items,metadata){
 for(const item of items){const detail=metadata.get(repositoryToolPageKey(item.url));if(!detail)continue;
  if(detail.widgetType)item.widgetType=detail.widgetType;
  if(detail.description)item.description=detail.description;
 }
}
function repositoryExtract(html,pageUrl,inheritedCategory=''){
 const doc=new DOMParser().parseFromString(html,'text/html');
 if(/\/(login|signin|sign-in|auth|account)(\/|$)/i.test(new URL(pageUrl).pathname)||doc.querySelector('input[type="password"]'))throw Error('Se omite una página de acceso privado');
 const intro=doc.querySelector('meta[name="description"]')?.content||doc.querySelector('meta[property="og:description"]')?.content||doc.querySelector('main p')?.textContent||'';
 const heading=doc.querySelector('h1')?.textContent?.trim()||'';
 const crumbs=[...doc.querySelectorAll('[itemprop="breadcrumb"] a,nav[aria-label*="breadcrumb" i] a,.breadcrumb a,.breadcrumbs a,[itemprop="itemListElement"] a')];
 const breadcrumb=crumbs.map(a=>a.textContent.trim()).filter(text=>text&&text!==heading&&!/^(home|inicio|tools|herramientas|embed|widgets)$/i.test(text)).pop();
 const hao=new URL(pageUrl).hostname.replace(/^www\./,'')==='haowordtool.com';
 const pageBadge=hao?[...doc.querySelectorAll('main .badge,main .tag,main [data-category],.tool-category')].map(n=>repositoryCardCategory(n.getAttribute('data-category')||n.textContent)).find(Boolean):'';
 const category=doc.querySelector('meta[property="article:section"]')?.content?.trim()||repositoryCategory(breadcrumb)||breadcrumb||pageBadge||repositoryPathCategory(pageUrl)||inheritedCategory||'';
 const selectedBlocks=[...doc.querySelectorAll('pre[data-dashboarddp-embed-selection]')];
 const frames=selectedBlocks.length?[]:[...doc.querySelectorAll('iframe[src],iframe[data-src]')];
 for(const frame of frames)if(!frame.getAttribute('src'))frame.setAttribute('src',frame.getAttribute('data-src'));
 for(const block of selectedBlocks.length?selectedBlocks:doc.querySelectorAll('textarea,pre,code,input[value],[data-clipboard-text],[data-embed-code]')){
  const text=block.getAttribute('data-clipboard-text')||block.getAttribute('data-embed-code')||block.value||block.textContent||'';
  if(/<iframe\b/i.test(text)){const embedded=[...new DOMParser().parseFromString(text,'text/html').querySelectorAll('iframe[src]')];embedded.forEach(frame=>frame.repositoryContext=block);frames.push(...embedded);}
 }
 const widgets=frames.map(frame=>{
  const url=repositoryUrl(frame.getAttribute('src'),pageUrl);if(!url||/youtube|doubleclick|googlesyndication/.test(url.hostname))return null;
  url.searchParams.delete('download');
  const card=(frame.repositoryContext||frame).closest('article,.tool-card,.widget-card');
  const cardTitle=card?.querySelector('h2,h3,[data-title]')?.textContent?.trim();
  const cardDescription=card?.querySelector('p,.description,.desc')?.textContent?.trim();
  const cardType=card?.querySelector('[data-category],.category,.badge,.tag');
  const localType=cardType?.getAttribute('data-category')||cardType?.textContent?.trim();
  return {url:url.href,title:(frame.title||cardTitle||heading||url.pathname.split('/').filter(Boolean).pop()||url.hostname).trim().slice(0,80),description:(cardDescription||intro).trim().slice(0,4000),widgetType:repositoryCategory(localType)||localType||category||'Otros',width:normalizeIframeWidth(frame.getAttribute('width')||frame.style.width)||'100%',height:normalizeIframeHeight(frame.getAttribute('height')||frame.style.height)||480,embedCode:frame.outerHTML};
 }).filter(Boolean);
 const linkCategories=new Map(),toolMetadata=new Map();
 if(hao&&/^\/(tools|embed)\/[^/]+\.html$/.test(new URL(pageUrl).pathname))toolMetadata.set(repositoryToolPageKey(pageUrl),{widgetType:category,description:intro.trim().slice(0,4000)});
 const links=[...doc.querySelectorAll('a[href]')].map(a=>{
  const url=repositoryUrl(a.getAttribute('href'),pageUrl);if(!url)return null;url.hash='';
  const sectionHeading=a.closest('section')?.querySelector('h2,h3')?.textContent;
  const cardCategory=hao?repositoryCardCategory(a.textContent):'';
  const linkCategory=cardCategory||repositoryPathCategory(url.href)||repositoryCategory(a.textContent)||repositoryCategory(sectionHeading)||(!a.closest('nav,header,footer')?category:'');
  if(hao&&url.origin===new URL(pageUrl).origin&&/^\/tools\/[^/]+\.html$/.test(url.pathname)&&cardCategory){
   const description=a.querySelector('p,.description,.desc')?.textContent?.trim()||'';
   toolMetadata.set(repositoryToolPageKey(url.href),{widgetType:cardCategory,description:description.slice(0,4000)});
  }
  if(linkCategory)linkCategories.set(url.href,linkCategory);return url;
 }).filter(Boolean);
 // PhET exposes simulation documents as links as well as embed snippets.
 if(new URL(pageUrl).hostname==='phet.colorado.edu')for(const url of links){
  if(/^\/sims\/html\/[^/]+\/latest\/[^/]+_es\.html$/.test(url.pathname)){
   url.searchParams.delete('download');widgets.push({url:url.href,title:heading||url.pathname.split('/')[3],description:intro.trim().slice(0,4000),widgetType:'Educación',width:'100%',height:600});
  }
 }
 return {widgets,links,linkCategories,toolMetadata};
}
function repositoryDiscardResult(session,item){
 const key=repositoryWidgetKey(item.url);
 session.selected.delete(key);
 session.discarded=[...new Set([...(session.discarded||[]),key])];
 for(let index=session.items.length-1;index>=0;index--)if(repositoryWidgetKey(session.items[index].url)===key)session.items.splice(index,1);
}
function openRepositoryImport(session){
 // DOM click handlers receive a MouseEvent, not an importer session.
 const s=Array.isArray(session?.items)&&session.selected instanceof Set?session:repositoryLoadDraft()||{items:[],selected:new Set(),notice:'Busca iframes publicados. HTML rápido o lectura dinámica con autorización. No todas las páginas publican códigos accesibles.'};
 const owner=++repositoryDraftOwner;
 const controller=new AbortController();let running=false;
 let saveTimer;
 const checkpoint=(immediate=true)=>{
  if(owner!==repositoryDraftOwner)return;clearTimeout(saveTimer);
  const write=()=>{if(owner!==repositoryDraftOwner)return;try{repositorySaveDraft(s);}catch{status.textContent='No se pudo guardar la búsqueda pendiente: almacenamiento lleno o no disponible. No cierres esta ventana si quieres conservarla.';}};
  if(immediate)write();else saveTimer=setTimeout(write,400);
 };
 const repositories=repositorySources(state.data.settings.widgetRepositories,widgetLibrary());
 const modal=el('div',{class:'modal widget-library-modal',role:'dialog','aria-label':'Importar repositorio'}),body=el('div',{class:'modal-body widget-library-body'}),list=el('div',{class:'widget-library-list',style:'overflow:auto;min-height:0;flex:1'}),status=el('p',{class:'form-hint',role:'status',text:s.notice});
 modal.classList.add('repository-import-modal');
 const showProgress=(phase,items=s.items)=>{
  s.items=items;s.notice=phase;
  status.textContent=phase+'\n'+repositoryScanSummary(items,widgetLibrary());
  checkpoint();
 };
 status.style.whiteSpace='pre-line';
 const choices=el('select',{class:'form-input','aria-label':'Repositorios disponibles'});
 const source=el('input',{class:'form-input',placeholder:'URL HTTPS del repositorio o de uno nuevo',value:s.source||repositories[0],'aria-label':'Repositorio'});
 const readMode=el('select',{class:'form-select','aria-label':'Modo de lectura'},[el('option',{value:'html',text:'HTML rápido'}),el('option',{value:'rendered',text:'Página dinámica · requiere autorización'})]);readMode.value=s.readMode||'html';readMode.onchange=()=>{s.readMode=readMode.value;checkpoint();};
 const refreshSources=()=>{
  const urls=repositorySources(state.data.settings.widgetRepositories,widgetLibrary());
  choices.replaceChildren(el('option',{value:'',text:'Selecciona un repositorio'}),...urls.map(url=>el('option',{value:url,text:url})));
  choices.value=urls.includes(source.value)?source.value:'';return urls;
 };
 choices.onchange=()=>{if(choices.value)source.value=choices.value;};
 source.oninput=()=>{choices.value=[...choices.options].some(option=>option.value===source.value)?source.value:'';};
 const detect=el('button',{class:'btn secondary',type:'button',text:'Detectar repositorios',title:'Detectar los sitios de los widgets guardados, sin buscar herramientas',onclick:()=>{
  if(running)return;const urls=refreshSources();status.textContent=`Repositorios disponibles: ${urls.length}. Detectados desde tu biblioteca, sin acceder a sus webs ni importar widgets.`;
 }});
 refreshSources();
 const configureReading=el('button',{class:'btn secondary',type:'button',text:'Configurar lectura',onclick:()=>{
  if(running)return;const url=repositoryUrl(source.value);if(!url){status.textContent='Introduce una URL HTTPS válida.';return;}
  s.source=url.href;checkpoint();openRepositoryReadingSetup(url.href,()=>{s.readMode='rendered';openRepositoryImport(s);});
 }});
 const scan=el('button',{class:'btn secondary',text:'Buscar herramientas'}),add=el('button',{class:'btn primary',text:'Importar seleccionados'});
 if(s.crawl&&!s.crawl.complete)scan.textContent='Continuar búsqueda';
 const keys=()=>new Set(widgetLibrary().map(w=>repositoryWidgetKey(w.url)));
 const availability=el('select',{class:'form-select','aria-label':'Estado de importación'},[
  el('option',{value:'all',text:'Todos'}),el('option',{value:'available',text:'Disponibles · sin coincidencias'}),el('option',{value:'imported',text:'Ya importados · bloqueados'}),el('option',{value:'possible',text:'Posibles equivalentes · revisar'})
 ]);availability.value=s.availability||'all';
 const visibleItem=item=>availability.value==='all'||repositoryMatch(item,widgetLibrary()).kind===availability.value;
 availability.onchange=()=>{s.availability=availability.value;render();};
 const typeOptions=()=>[...new Set([...widgetLibraryTypes(),...s.items.map(w=>(w.widgetType||'').trim()).filter(Boolean)])].sort((a,b)=>a.localeCompare(b)).map(value=>({value,text:value}));
 const resultSelection=new Set(Array.isArray(s.resultSelection)?s.resultSelection:[...s.selected]);
 const manualPossibleSelection=new Set(Array.isArray(s.manualPossibleSelection)?s.manualPossibleSelection:[]);
 const selectionInfo=el('span',{class:'form-hint'});
 const update=()=>{const currentKeys=new Set(s.items.map(item=>repositoryWidgetKey(item.url)));for(const key of resultSelection)if(!currentKeys.has(key))resultSelection.delete(key);for(const key of manualPossibleSelection)if(!currentKeys.has(key)||!resultSelection.has(key))manualPossibleSelection.delete(key);s.resultSelection=[...resultSelection];s.manualPossibleSelection=[...manualPossibleSelection];s.selected=new Set(s.items.filter(item=>{if(!resultSelection.has(repositoryWidgetKey(item.url)))return false;const kind=repositoryMatch(item,widgetLibrary()).kind;return kind==='available'||kind==='possible'&&manualPossibleSelection.has(repositoryWidgetKey(item.url));}).map(item=>repositoryWidgetKey(item.url)));add.disabled=running||!s.selected.size;selectionInfo.textContent=formatUiText('Seleccionados: {selected} · Importables: {importable}',{selected:resultSelection.size,importable:s.selected.size});checkpoint(false);};
 const render=()=>{
  const existing=keys();list.replaceChildren();const table=el('table',{class:'widget-library-table repository-import-table'}),thead=el('thead'),head=el('tr'),tbody=el('tbody');
  ['','Nombre','Tipo','Descripción','Código iframe','Vista previa'].forEach((text,index)=>head.append(el('th',{text,'data-sortable':index>0&&index<5?'true':'false'})));head.firstChild.setAttribute('aria-label','Seleccionar');thead.append(head);table.append(thead,tbody);
  for(const item of s.items){
   const key=repositoryWidgetKey(item.url),match=repositoryMatch(item,widgetLibrary()),duplicate=match.kind==='imported';if(duplicate)s.selected.delete(key);
   if(!visibleItem(item,existing))continue;
   const row=el('tr'),check=el('input',{type:'checkbox','aria-label':'Seleccionar resultado',disabled:running});check.checked=resultSelection.has(key);check.onchange=()=>{check.checked?resultSelection.add(key):resultSelection.delete(key);if(match.kind==='possible'){check.checked?manualPossibleSelection.add(key):manualPossibleSelection.delete(key);}update();};
   const cells=[el('td'),el('td'),el('td'),el('td'),el('td'),el('td')];cells[0].append(check);
   [['title','Nombre'],['widgetType','Tipo'],['description','Descripción']].forEach(([field,label],index)=>{
    const input=el(field==='widgetType'?'input':'textarea',{class:field==='widgetType'?'form-input':'form-textarea',rows:'2','aria-label':label,disabled:running});input.value=item[field]||'';input.oninput=()=>{item[field]=input.value;checkpoint(false);};
    input.onchange=()=>{item[field]=input.value;checkpoint();};
    cells[index+1].append(field==='widgetType'?widgetTypeDropdown(input,typeOptions):input);
   });
   const code=el('textarea',{class:'form-textarea',rows:'2','aria-label':'Código iframe',disabled:running});code.value=item.embedCode||buildCustomIframeCode(item);
   code.onchange=()=>{
    const frame=new DOMParser().parseFromString(code.value,'text/html').querySelector('iframe[src]');
    const url=repositoryUrl(frame?.getAttribute('src'));
    if(!url){status.textContent='El código debe contener un iframe con URL HTTPS válida.';code.value=buildCustomIframeCode(item);return;}
    const oldKey=repositoryWidgetKey(item.url),wasSelected=resultSelection.delete(oldKey);s.selected.delete(oldKey);item.url=url.href;item.height=normalizeIframeHeight(frame.getAttribute('height'))||item.height;item.width=normalizeIframeWidth(frame.getAttribute('width'))||item.width;item.embedCode=code.value;
    if(wasSelected)resultSelection.add(repositoryWidgetKey(item.url));render();
   };
   cells[4].append(code);
   const preview=el('button',{class:'btn secondary repository-preview',type:'button',title:'Abrir vista previa sin importar','aria-label':'Vista previa',disabled:running,onclick:()=>{s.source=source.value;openWidgetLibraryPreview(item,()=>openRepositoryImport(s));}});
   preview.prepend(el('span',{'aria-hidden':'true',html:'<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg>'}));
   const discard=el('button',{class:'repository-discard',type:'button',text:'×',title:'Descartar de esta búsqueda; no borra el widget de tu biblioteca','aria-label':'Descartar resultado',disabled:running,onclick:()=>{repositoryDiscardResult(s,item);checkpoint();render();}});
   const addOne=el('button',{class:'repository-add-one',type:'button',text:'+',title:'Agregar','aria-label':'Agregar widget',disabled:running||duplicate,onclick:()=>importItems([item])});
   cells[5].append(el('div',{class:'repository-row-actions'},[preview,addOne,discard]),el('span',{class:'form-hint',text:duplicate?'Ya importado · '+match.entry.title:match.kind==='possible'?(match.reason||'Posible equivalente')+' · '+match.entry.title+' · Selección manual':item.description?'Disponible':'Descripción pendiente'}));
   row.append(...cells);tbody.append(row);
  }list.append(table);update();
 };
 const bulk=el('div',{class:'modal-footer'},[
  availability,
  selectionInfo,
  el('button',{class:'btn secondary',text:'Seleccionar todas',title:'Seleccionar los resultados del filtro actual; los ya importados solo se podrán descartar',onclick:()=>{if(running)return;s.items.filter(visibleItem).forEach(w=>resultSelection.add(repositoryWidgetKey(w.url)));render();}}),
  el('button',{class:'btn secondary',text:'Deseleccionar todas',onclick:()=>{if(running)return;s.items.filter(visibleItem).forEach(w=>{const key=repositoryWidgetKey(w.url);resultSelection.delete(key);manualPossibleSelection.delete(key);});render();}}),
  el('button',{class:'btn danger',text:'Descartar seleccionados',title:'Quitar resultados de esta búsqueda, sin borrar widgets de la biblioteca',onclick:()=>{if(running)return;const items=s.items.filter(item=>resultSelection.has(repositoryWidgetKey(item.url)));items.forEach(item=>repositoryDiscardResult(s,item));resultSelection.clear();render();checkpoint();}})
 ]);
 scan.onclick=async()=>{
  if(running)return;
  const start=repositoryUrl(source.value);if(!start){status.textContent='Introduce una URL HTTPS válida.';return;}
  const customRule=readMode.value==='rendered'&&repositoryReadingRule(start.href);
  const isPhet=start.origin==='https://phet.colorado.edu'&&!customRule;
  const isToolkits=start.hostname.replace(/^www\./,'')==='toolkitsapp.com'&&!customRule;
  status.textContent='Solicitando autorización para leer el repositorio…';
  try{if(!await (isPhet?phetRequestAccess():isToolkits?toolkitsRequestAccess():chrome.permissions.request({...readMode.value==='rendered'?{permissions:['scripting']}:{},origins:[start.origin+'/*']}))){status.textContent='Acceso no concedido. No se ha iniciado el escaneo.';return;}}catch(error){status.textContent=error.message;return;}
  const readingRule=JSON.stringify(repositoryReadingRule(start.href));
  const resume=s.crawl?.source===start.href&&s.crawl.readMode===readMode.value&&!s.crawl.complete&&(s.crawl.readingRule||'null')===readingRule;
  if(!resume&&(s.items.length||s.crawl)&&!confirm('Esto iniciará una búsqueda nueva y sustituirá el borrador anterior, sin modificar tu biblioteca. ¿Continuar?'))return;
  if(!resume){s.items=[];s.discarded=[];s.selected.clear();s.adapter={};s.crawl={source:start.href,readMode:readMode.value,readingRule,queue:[start.href],seen:[],pageCategories:[],toolMetadata:[],failures:0,complete:false};}
  s.source=start.href;s.readMode=readMode.value;
  s.adapter=s.adapter||{};
  running=true;scan.disabled=true;source.disabled=true;choices.disabled=true;detect.disabled=true;readMode.disabled=true;configureReading.disabled=true;render();
  const queue=s.crawl.queue,seen=new Set(s.crawl.seen),found=new Set(s.items.map(w=>repositoryWidgetKey(w.url))),pageCategories=new Map(s.crawl.pageCategories),toolMetadata=new Map(s.crawl.toolMetadata);let failures=s.crawl.failures;
  const saveCrawl=()=>{s.crawl={...s.crawl,inFlight:undefined,source:start.href,readMode:readMode.value,readingRule,queue,seen:[...seen],pageCategories:[...pageCategories],toolMetadata:[...toolMetadata],failures,complete:!queue.length};checkpoint();};
  showProgress(resume?'Continuando búsqueda guardada…':'Iniciando escaneo…');
  if(!resume&&start.hostname.replace(/^www\./,'')==='haowordtool.com'&&start.pathname!=='/')queue.push(start.origin+'/');
  try{
   if(isToolkits){
    const result=await repositoryScanToolkits(controller.signal,(text,items)=>showProgress(text,items),s.adapter);s.items=result.widgets;s.crawl.complete=true;s.notice=`Escaneo del generador finalizado. Herramientas con error: ${result.failures}.\n${repositoryScanSummary(s.items,widgetLibrary())}\nLos duplicados están bloqueados. Los campos no publicados por el generador quedan pendientes de completar.`;
    if(result.errors.length)s.notice+='\n'+result.errors.slice(0,5).join('\n');return;
   }
   if(isPhet){
    const result=await repositoryScanPhet(controller.signal,(text,items)=>showProgress(text,items||[]),s.adapter);s.items=result.widgets;s.crawl.complete=!controller.signal.aborted;s.notice=`Escaneo finalizado. Páginas o categorías con error: ${result.failures}.\n${repositoryScanSummary(s.items,widgetLibrary())}\nLos existentes no se actualizan ni se sobrescriben; sus duplicados están bloqueados.`;return;
   }
   const batchStart=seen.size;
   while(queue.length&&seen.size-batchStart<900&&!controller.signal.aborted){
    const url=queue.shift();if(seen.has(url))continue;seen.add(url);showProgress(`Escaneando página ${seen.size} · En cola: ${queue.length} · Errores: ${failures}\n${url}`);
    s.crawl.inFlight=url;checkpoint();
    try{
     let html,responseUrl;
     if(readMode.value==='rendered'){const rendered=await repositoryReadRenderedPage(url,controller.signal);html=rendered.html;responseUrl=rendered.url;if(rendered.warning){s.crawl.ruleWarnings=(s.crawl.ruleWarnings||0)+1;s.crawl.lastRuleWarning=rendered.warning;}}
     else{const response=await fetch(url,{credentials:'omit',referrerPolicy:'no-referrer',signal:AbortSignal.any([controller.signal,AbortSignal.timeout(12000)])});
     if(!response.ok||new URL(response.url).origin!==start.origin)throw Error('Respuesta no disponible');
     if(!/text\/html/i.test(response.headers.get('content-type')||''))continue;
     html=await response.text();responseUrl=response.url;}if(html.length>3000000)throw Error('Página demasiado grande');
     const page=repositoryExtract(html,responseUrl,pageCategories.get(url)||'');
     for(const [key,detail]of page.toolMetadata){const old=toolMetadata.get(key)||{};toolMetadata.set(key,{widgetType:detail.widgetType||old.widgetType||'',description:detail.description||old.description||''});}
     if(start.hostname==='calculations.tools')page.widgets.unshift(...calcExtract(html,responseUrl).widgets);
     for(const widget of page.widgets){const key=repositoryWidgetKey(widget.url);if((s.discarded||[]).includes(key))continue;if(found.has(key)){const previous=s.items.find(w=>repositoryWidgetKey(w.url)===key);if(previous?.widgetType==='Otros'&&widget.widgetType!=='Otros')previous.widgetType=widget.widgetType;continue;}found.add(key);s.items.push(widget);}
     repositoryEnrichWidgets(s.items,toolMetadata);
     for(const link of page.links){link.hash='';if(link.origin!==start.origin||link.search||/\.(pdf|zip|png|jpg|svg|js|css|mp4|exe)$/i.test(link.pathname)||/\/(login|logout|sign-in|account|privacy|terms)(\/|$)/i.test(link.pathname))continue;const category=page.linkCategories.get(link.href);if(category&&!pageCategories.has(link.href))pageCategories.set(link.href,category);if(!seen.has(link.href)&&!queue.includes(link.href)&&queue.length<3000)queue.push(link.href);}
    }catch{if(!controller.signal.aborted)failures++;else{seen.delete(url);queue.unshift(url);}}
    finally{saveCrawl();if(!controller.signal.aborted)showProgress(`Páginas procesadas: ${seen.size} · En cola: ${queue.length} · Errores: ${failures}`);}
   }
   s.source=start.href;s.notice=`${controller.signal.aborted?'Búsqueda pausada; vuelve a buscar para continuar':queue.length?'Límite de páginas alcanzado; puedes continuar en otra sesión':'Escaneo finalizado'}. Páginas procesadas: ${seen.size} · Errores: ${failures} · En cola sin revisar: ${queue.length}.\n${repositoryScanSummary(s.items,widgetLibrary())}\nLos existentes no se actualizan ni se sobrescriben; sus duplicados están bloqueados. Puedes completar las descripciones después.`;
  }catch(error){s.notice=controller.signal.aborted?'Búsqueda pausada. Puedes continuarla al volver.':'No se pudo completar el escaneo: '+(error.message||String(error));}
  finally{if(s.crawl.ruleWarnings)s.notice+='\nAvisos de configuración: '+s.crawl.ruleWarnings+'. '+s.crawl.lastRuleWarning;running=false;checkpoint();scan.disabled=false;source.disabled=false;choices.disabled=false;detect.disabled=false;readMode.disabled=false;configureReading.disabled=false;if(modal.isConnected){status.textContent=s.notice;render();}}
 };
 const importItems=items=>{
  const before=structuredClone(widgetLibrary()),previousRepositories=state.data.settings.widgetRepositories;
  try{
   let count=0;const existing=keys();
   for(const item of items){const key=repositoryWidgetKey(item.url);if(existing.has(key))continue;
    if(!String(item.title||'').trim())throw Error('Completa el nombre de los widgets seleccionados.');
    if(!saveWidgetToLibrary(item))throw Error('Código iframe no válido.');existing.add(key);count++;
   }
   if(count){const url=repositoryUrl(s.source||source.value);if(url)state.data.settings.widgetRepositories=[...new Set([...(previousRepositories||[]),url.href])];saveData();
    const stored=JSON.parse(localStorage.getItem(APP.storageKey)||'null');if(!Array.isArray(stored?.widgetLibrary)||widgetLibrary().some(w=>!stored.widgetLibrary.some(v=>v.id===w.id)))throw Error('No se ha podido verificar el guardado.');
   }
   for(const item of items)s.selected.delete(repositoryWidgetKey(item.url));s.notice=`Widgets añadidos: ${count}. Los anteriores se conservan.`;status.textContent=s.notice;render();checkpoint();
  }catch(error){state.data.widgetLibrary=before;state.data.settings.widgetRepositories=previousRepositories;status.textContent=error.message;}
 };
 add.onclick=()=>importItems(s.items.filter(item=>s.selected.has(repositoryWidgetKey(item.url))));
 const pause=()=>{s.source=source.value;if(running)s.notice='Búsqueda pausada. Pulsa Buscar herramientas para continuar.';checkpoint();controller.abort();};
 const sourceToolbar=el('div',{class:'repository-source-toolbar'},[choices,source,readMode,detect,configureReading]);
 body.append(sourceToolbar,status,bulk,list);modal.append(el('div',{class:'modal-header'},[el('h2',{class:'modal-title',text:'Importar repositorio'}),el('button',{class:'modal-close',text:'×','aria-label':'Cerrar',onclick:()=>{pause();openWidgetLibrary();}})]),body,el('div',{class:'modal-footer'},[el('button',{class:'btn',text:'Volver',onclick:()=>{pause();openWidgetLibrary();}}),scan,add]));openModal(modal);render();
 const unloading=()=>{pause();};window.addEventListener('pagehide',unloading,{once:true});
 const observer=new MutationObserver(()=>{if(!modal.isConnected){pause();window.removeEventListener('pagehide',unloading);observer.disconnect();}});observer.observe(document.body,{childList:true,subtree:true});
}
