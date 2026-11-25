/* A local draft, separate from the widget library. Never imports automatically. */
let repositoryDraftOwner=0;
function repositoryDraftKey(){return APP.storageKey+':repository-draft-v1';}
function repositoryDraftNotice(notice){return String(notice||'').replace(/^(?:\s*Búsqueda recuperada\.\s*)+/u,'').trim();}
function repositoryLoadDraft(){
 try{const draft=JSON.parse(localStorage.getItem(repositoryDraftKey())||'null');
  if(draft?.version!==1||!Array.isArray(draft.items)||!repositoryUrl(draft.source))return null;
  if(draft.items.some(item=>!item||!repositoryUrl(item.url)))return null;
  if(draft.crawl&&(!Array.isArray(draft.crawl.queue)||!Array.isArray(draft.crawl.seen)))return null;
  if(draft.crawl?.inFlight&&!draft.crawl.queue.includes(draft.crawl.inFlight))draft.crawl.queue.unshift(draft.crawl.inFlight);
  if(draft.adapter)draft.adapter.widgets=draft.items;
  const notice=repositoryDraftNotice(draft.notice);
  return {...draft,selected:new Set(Array.isArray(draft.selected)?draft.selected:[]),notice:'Búsqueda recuperada.'+(notice?' '+notice:'')};
 }catch{return null;}
}
function repositorySaveDraft(session){
 localStorage.setItem(repositoryDraftKey(),JSON.stringify({...session,notice:repositoryDraftNotice(session.notice),adapter:session.adapter?{...session.adapter,widgets:undefined}:undefined,version:1,selected:[...session.selected],savedAt:Date.now()}));
}
function repositoryNormalizeReadingRule(value,origin){
 const site=repositoryUrl(origin);if(!site||!value||typeof value!=='object')return null;
 const steps=Array.isArray(value.steps)?value.steps:[];
 if(steps.length>5)return null;
 const clean=[];
 for(const step of steps){if(!step||!['text','selector'].includes(step.mode)||typeof step.value!=='string'||!step.value.trim()||step.value.length>300)return null;clean.push({mode:step.mode,value:step.value.trim()});}
 const codeSelector=typeof value.codeSelector==='string'?value.codeSelector.trim():'';
 if(codeSelector.length>300)return null;
 const sample=repositoryUrl(value.sampleUrl||site.href);if(!sample||sample.href.length>4096||sample.origin!==site.origin)return null;
 return {version:1,steps:clean,codeSelector,sampleUrl:sample.href};
}
function repositoryReadingRule(url){
 const site=repositoryUrl(url);if(!site)return null;
 return repositoryNormalizeReadingRule(state.data.settings.repositoryReadingRules?.[site.origin],site.origin);
}
function repositoryStoreReadingRules(rules){
 const previous=state.data.settings.repositoryReadingRules;
 state.data.settings.repositoryReadingRules=rules;saveData();
 try{if(JSON.stringify(JSON.parse(localStorage.getItem(APP.storageKey)||'null')?.settings?.repositoryReadingRules)!==JSON.stringify(rules))throw Error('No se ha confirmado el guardado.');}
 catch(error){state.data.settings.repositoryReadingRules=previous;throw error;}
}
async function repositoryReadRenderedPage(url,signal,options={}){
 const origin=new URL(url).origin;
 const rule=options.rule===undefined?repositoryReadingRule(url):repositoryNormalizeReadingRule(options.rule,origin);
 if(signal.aborted)throw Error('Cancelado');
 const publicResponse=await fetch(url,{credentials:'omit',referrerPolicy:'no-referrer',signal:AbortSignal.any([signal,AbortSignal.timeout(12000)])});
 if(!publicResponse.ok||new URL(publicResponse.url).origin!==origin||/\/(login|signin|sign-in|auth|account)(\/|$)/i.test(new URL(publicResponse.url).pathname))throw Error('La página no está disponible públicamente');
 const publicHtml=await publicResponse.text();
 if(new DOMParser().parseFromString(publicHtml,'text/html').querySelector('input[type="password"]'))throw Error('Se omite una página de acceso privado');
 const tab=await chrome.tabs.create({url,active:false});
 const abortTab=()=>{chrome.tabs.get(tab.id).then(current=>{if(new URL(current.pendingUrl||current.url).origin===origin)return chrome.tabs.remove(tab.id);}).catch(()=>{});};
 signal.addEventListener('abort',abortTab,{once:true});if(signal.aborted)abortTab();
 try{
  let last='',stable=0,embedAttempted=false,ruleAttempted=false,warning='';
  for(let attempt=0;attempt<25;attempt++){
   await new Promise(resolve=>setTimeout(resolve,500));if(signal.aborted)throw Error('Cancelado');
   let current=await chrome.tabs.get(tab.id);if(current.status!=='complete')continue;
   if(new URL(current.url).origin!==origin||/\/(login|signin|sign-in|auth|account)(\/|$)/i.test(new URL(current.url).pathname))throw Error('Página privada o redirección fuera del repositorio');
   if(rule&&!ruleAttempted){
    const execution=await chrome.scripting.executeScript({target:{tabId:tab.id},func:repositoryRunReadingRule,args:[rule]});
    ruleAttempted=true;warning=execution[0]?.result?.error||'';
    current=await chrome.tabs.get(tab.id);
    if(new URL(current.url).origin!==origin||/\/(login|signin|sign-in|auth|account)(\/|$)/i.test(new URL(current.url).pathname))throw Error('Página privada o redirección fuera del repositorio');
   }
   const result=await chrome.scripting.executeScript({target:{tabId:tab.id},func:repositoryReadPublicEmbedDialog,args:[!embedAttempted&&!rule,rule?.codeSelector||'']});
   const snapshot=result[0]?.result;embedAttempted=embedAttempted||snapshot?.attempted;
   const html=snapshot?.html;if(typeof html!=='string')continue;
   if(new DOMParser().parseFromString(html,'text/html').querySelector('input[type="password"]'))throw Error('Se omite una página de acceso privado');
   if(html.length>3000000)throw Error('Página demasiado grande');
   // Animations need not stop when the published embed dialog is already readable.
   if(snapshot.hasEmbed)return {html,url:current.url,warning};
   stable=html===last?stable+1:0;last=html;if(stable>=2)return {html,url:current.url,warning};
  }
  // Do not silently certify a moving/incomplete document as fully read.
  throw Error('La página dinámica no terminó de estabilizarse');
 }finally{
  signal.removeEventListener('abort',abortTab);
  try{const current=await chrome.tabs.get(tab.id);if(new URL(current.pendingUrl||current.url).origin===origin)await chrome.tabs.remove(tab.id);}catch{}
 }
}
// Runs in the public temporary tab. Never submits forms, copies to the clipboard,
// accepts permissions, or clicks ambiguous "share", account, or payment controls.
async function repositoryReadPublicEmbedDialog(mayOpen,codeSelector=''){
 const snippets=()=>[...document.querySelectorAll('textarea,pre,code,input[value],[data-clipboard-text],[data-embed-code]')].some(node=>/<iframe\b/i.test(node.getAttribute('data-clipboard-text')||node.getAttribute('data-embed-code')||node.value||node.textContent||''));
 let attempted=false;
 if(mayOpen&&!snippets()&&!document.querySelector('input[type="password"]')){
  const button=[...document.querySelectorAll('button')].find(node=>!node.disabled&&!node.closest('form')&&node.getBoundingClientRect().width>0&&/^(embed|incrustar|insertar iframe|embed code|código iframe)$/i.test((node.getAttribute('aria-label')||node.textContent||'').trim()));
  if(button){attempted=true;button.click();for(let n=0;n<10&&!snippets();n++)await new Promise(resolve=>setTimeout(resolve,150));}
 }
 // A dialog may assign textarea.value without changing its HTML text node.
 const copy=document.documentElement.cloneNode(true);
 const values=[...document.querySelectorAll('textarea,input')],targets=[...copy.querySelectorAll('textarea,input')];
 values.forEach((node,index)=>{if(!targets[index]||!/<iframe\b/i.test(node.value||''))return;if(node.tagName==='TEXTAREA')targets[index].textContent=node.value;else targets[index].setAttribute('value',node.value);});
 // Published snippets can also be plain text in the body or a custom container.
 const textRoot=codeSelector?document.querySelector(codeSelector):document.body;
 const textCopy=textRoot?.cloneNode(true);textCopy?.querySelectorAll('script,style,noscript').forEach(node=>node.remove());
 const text=textRoot?.matches('iframe[src]')?textRoot.outerHTML:textRoot?.value||textCopy?.textContent||'';
 const codes=[...text.slice(0,3000000).matchAll(/<iframe\b[^>]*>[\s\S]*?<\/iframe\s*>/gi)].slice(0,30).map(match=>match[0]);
 for(const code of codes){const pre=document.createElement('pre');if(codeSelector)pre.setAttribute('data-dashboarddp-embed-selection','');pre.textContent=code;copy.querySelector('body')?.append(pre);}
 return {html:copy.outerHTML,attempted,hasEmbed:codeSelector?codes.length>0:snippets()||codes.length>0};
}
// Self-contained for chrome.scripting; configuration is data, never executable JS.
async function repositoryRunReadingRule(rule){
 const origin=location.origin;
 const safePage=()=>location.origin===origin&&!/\/(login|signin|sign-in|auth|account)(\/|$)/i.test(location.pathname)&&!document.querySelector('input[type="password"]');
 const labels=node=>[node.getAttribute('aria-label'),node.getAttribute('title'),node.textContent].filter(Boolean).map(value=>value.trim().replace(/\s+/g,' '));
 const label=node=>labels(node).join(' ');
 const visible=node=>node.getBoundingClientRect().width>0&&node.getBoundingClientRect().height>0&&getComputedStyle(node).visibility!=='hidden'&&getComputedStyle(node).display!=='none';
 const unsafe=/(log\s*in|sign\s*in|sign\s*up|iniciar sesi[oó]n|registr|password|contrase[ñn]a|pagar|pay\b|payer|pagare|bezahlen|kaufen|purchase|comprar|checkout|donat|suscri|subscri|delete|eliminar|borrar|supprimer|löschen|accept|acept|permit|allow|authoriz|autoriz|consent|cookie|clipboard|copiar|copy\b|confirm|enviar|send\b)/i;
 const embedAction=/(compart|share|embed|incrust|insert|integr|partag|condiv|teilen|einbett|partek|txert|máis|más|more|menu|menú|opci|option|opzion|weitere|mehr|code|c[oó]dig|html)/i;
 let completed=0;
 try{
  if(!safePage())throw Error('Página privada o de acceso: no se ejecutan pasos.');
  for(const [index,step]of rule.steps.entries()){
   let matches=[];
   for(let attempt=0;attempt<12;attempt++){
    if(!safePage())throw Error('La página dejó de ser pública o cambió de origen.');
    const nodes=step.mode==='selector'?[...document.querySelectorAll(step.value)]:[...document.querySelectorAll('button,[role="button"],[role="menuitem"],[role="tab"],a[href]')].filter(node=>labels(node).some(value=>value.toLocaleLowerCase()===step.value.replace(/\s+/g,' ').toLocaleLowerCase()));
    matches=nodes.filter(visible);if(matches.length)break;
    await new Promise(resolve=>setTimeout(resolve,150));
   }
   if(matches.length!==1)throw Error(matches.length?'El paso '+(index+1)+' coincide con varios botones. Usa un selector más preciso.':'No se encontró el botón del paso '+(index+1)+': '+step.value);
   const node=matches[0];
   if(!node.matches('button,[role="button"],[role="menuitem"],[role="tab"],a[href]')||node.closest('form')||node.disabled||node.getAttribute('aria-disabled')==='true'||unsafe.test(label(node)+' '+step.value))throw Error('Paso '+(index+1)+' bloqueado: acción sensible o elemento no permitido.');
   if(!embedAction.test(label(node)+' '+step.value))throw Error('Paso '+(index+1)+' bloqueado: usa solo controles de menú, compartir o incrustar.');
   if(node.matches('a[href]')){const target=new URL(node.getAttribute('href'),location.href);if(target.origin!==location.origin||target.pathname!==location.pathname||target.search!==location.search||!target.hash||node.target==='_blank'||node.hasAttribute('download'))throw Error('No se siguen enlaces de navegación ni ventanas externas.');}
   node.click();completed++;await new Promise(resolve=>setTimeout(resolve,250));
  }
  if(rule.codeSelector&&!document.querySelector(rule.codeSelector))throw Error('No se encontró el contenedor del código.');
  return {completed,error:''};
 }catch(error){return {completed,error:error.message||String(error)};}
}
function openRepositoryReadingSetup(sourceUrl,onReturn){
 const site=repositoryUrl(sourceUrl);if(!site){toast('Introduce una URL HTTPS válida.','error');return;}
 const existing=repositoryReadingRule(site.href);
 const draft=existing||{version:1,steps:[],codeSelector:'',sampleUrl:site.href};
 const controller=new AbortController();let running=false,verified='';
 const modal=el('div',{class:'modal widget-library-modal repository-reading-modal',role:'dialog','aria-label':'Configurar lectura'});
 const body=el('div',{class:'modal-body'}),columns=el('div',{class:'repository-reading-columns'}),left=el('div'),right=el('div');
 const status=el('p',{class:'form-hint',role:'status'}),steps=el('div',{class:'repository-reading-steps'});
 const sample=el('input',{class:'form-input',value:draft.sampleUrl,'aria-label':'URL de prueba'});
 const selector=el('input',{class:'form-input',value:draft.codeSelector,placeholder:'Opcional: selector CSS del código','aria-label':'Contenedor del código'});
 const result=el('textarea',{class:'form-textarea',rows:'8',readonly:true,'aria-label':'Código encontrado'});
 const save=el('button',{class:'btn primary',text:'Guardar configuración',disabled:true});
 const controls=[];let addStepButton;
 const invalidate=()=>{verified='';save.disabled=true;result.value='';status.textContent='Configuración modificada: vuelve a probarla antes de guardar.';};
 const collect=()=>repositoryNormalizeReadingRule({steps:controls.map(row=>({mode:row.mode.value,value:row.value.value})),codeSelector:selector.value,sampleUrl:sample.value},site.origin);
 const addStep=(step={mode:'text',value:''})=>{
  if(controls.length>=5)return;
  const mode=el('select',{class:'form-select','aria-label':'Cómo localizar el botón'},[el('option',{value:'text',text:'Texto del botón'}),el('option',{value:'selector',text:'Selector CSS · avanzado'})]);mode.value=step.mode;
  const value=el('input',{class:'form-input',value:step.value,placeholder:'Ej.: Compartir o Embed','aria-label':'Botón del paso'});
  const remove=el('button',{class:'repository-discard',type:'button',text:'×',title:'Quitar paso','aria-label':'Quitar paso'});
  const node=el('div',{class:'repository-reading-step'}),number=el('span');const row={node,mode,value,remove,number};
  node.append(number,mode,value,remove);controls.push(row);steps.append(node);
  const renumber=()=>controls.forEach((row,index)=>row.number.textContent=String(index+1));renumber();
  remove.onclick=()=>{if(running)return;controls.splice(controls.indexOf(row),1);node.remove();renumber();addStepButton.disabled=controls.length>=5;invalidate();};
  mode.onchange=value.oninput=invalidate;
 };
 draft.steps.forEach(addStep);if(!existing)addStep();
 sample.oninput=selector.oninput=invalidate;
 addStepButton=el('button',{class:'btn secondary',type:'button',text:'Añadir paso',disabled:controls.length>=5,onclick:()=>{if(!running){addStep();addStepButton.disabled=controls.length>=5;invalidate();}}});
 const test=el('button',{class:'btn secondary',type:'button',text:'Probar lectura'});
 const back=()=>{controller.abort();onReturn();};
 const setRunning=value=>{running=value;test.disabled=sample.disabled=selector.disabled=value;addStepButton.disabled=value||controls.length>=5;controls.forEach(row=>row.mode.disabled=row.value.disabled=row.remove.disabled=value);save.disabled=value||!verified;};
 test.onclick=async()=>{
  const rule=collect();if(!rule){status.textContent='Revisa los pasos y usa una URL de prueba del mismo sitio.';return;}
  // Validate CSS locally, without evaluating code or navigating the user's page.
  try{for(const step of rule.steps)if(step.mode==='selector')document.createDocumentFragment().querySelector(step.value);if(rule.codeSelector)document.createDocumentFragment().querySelector(rule.codeSelector);}catch{status.textContent='Hay un selector CSS no válido.';return;}
  verified='';save.disabled=true;result.value='';status.textContent='Solicitando autorización para la prueba…';
  try{
   if(!await chrome.permissions.request({permissions:['scripting'],origins:[site.origin+'/*']})){status.textContent='Acceso no concedido. No se ha iniciado la prueba.';return;}
   setRunning(true);status.textContent='Probando los pasos en una pestaña temporal…';
   const snapshot=await repositoryReadRenderedPage(rule.sampleUrl,controller.signal,{rule});
   if(controller.signal.aborted)return;
   if(snapshot.warning){status.textContent=snapshot.warning;return;}
   const found=repositoryExtract(snapshot.html,snapshot.url).widgets;
   if(!found.length){status.textContent='No se encontró código iframe. Revisa los pasos o el contenedor del código.';return;}
   result.value=found.map(item=>item.embedCode).join('\n\n');verified=JSON.stringify(rule);
   status.textContent='Prueba correcta. Revisa el código encontrado antes de guardar. Esto no importa widgets.';
  }catch(error){if(!controller.signal.aborted)status.textContent='No se pudo completar la prueba: '+error.message;}
  finally{setRunning(false);}
 };
 save.onclick=()=>{
  const rule=collect();if(!rule||verified!==JSON.stringify(rule)||running)return;
  const previous=state.data.settings.repositoryReadingRules;
  try{
   const stored=previous&&typeof previous==='object'&&!Array.isArray(previous)?previous:{};
   if(!Object.hasOwn(stored,site.origin)&&Object.keys(stored).length>=50)throw Error('Límite de 50 configuraciones alcanzado.');
   repositoryStoreReadingRules({...stored,[site.origin]:rule});back();
  }catch(error){state.data.settings.repositoryReadingRules=previous;status.textContent='No se pudo guardar: '+error.message;}
 };
 const reset=el('button',{class:'btn danger',text:'Restablecer lectura automática',disabled:!existing,onclick:()=>{
  if(running||!confirm('¿Eliminar la configuración de lectura de este sitio? La biblioteca no se modifica.'))return;
  const previous=state.data.settings.repositoryReadingRules;
  try{const stored={...previous};delete stored[site.origin];repositoryStoreReadingRules(stored);back();}catch(error){state.data.settings.repositoryReadingRules=previous;status.textContent='No se pudo guardar: '+error.message;}
 }});
 left.append(el('h3',{text:'Pasos para mostrar el código'}),el('p',{class:'form-hint',text:'Añade los botones en orden: Compartir → Embed. Usa el texto exacto o la etiqueta del botón. Sin pasos, se busca el código ya visible en la página.'}),steps,addStepButton);
 right.append(el('label',{class:'form-label',text:'URL de prueba'}),sample,el('p',{class:'form-hint',text:'Usa la página de una herramienta concreta del mismo sitio, no la portada.'}),el('label',{class:'form-label',text:'Contenedor del código'}),selector,el('p',{class:'form-hint',text:'Vacío: buscar en toda la página. Avanzado: indica un selector CSS si hay varios códigos.'}),el('label',{class:'form-label',text:'Código encontrado'}),result);
 columns.append(left,right);body.append(el('p',{class:'form-hint',text:site.origin}),el('p',{class:'form-hint',text:'Solo páginas públicas. La prueba puede usar las cookies del sitio. No configures accesos, pagos, permisos ni formularios. No se ejecuta código JavaScript personalizado.'}),columns,status);
 modal.append(el('div',{class:'modal-header'},[el('h2',{class:'modal-title',text:'Configurar lectura'}),el('button',{class:'modal-close',text:'×','aria-label':'Cerrar',onclick:back})]),body,el('div',{class:'modal-footer'},[reset,el('button',{class:'btn',text:'Volver',onclick:back}),test,save]));
 openModal(modal);
 const observer=new MutationObserver(()=>{if(!modal.isConnected){controller.abort();observer.disconnect();}});observer.observe(document.body,{childList:true,subtree:true});
}
