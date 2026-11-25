/* Read only the official ToolkitsApp generator in an authorized temporary tab. */
function toolkitsRequestAccess(){
 return chrome.permissions.request({permissions:['scripting'],origins:['https://www.toolkitsapp.com/*']});
}
async function toolkitsReadGenerator(value){
 if(location.origin!=='https://www.toolkitsapp.com')throw Error('Origen no permitido');
 const selects=[...document.querySelectorAll('select')];
 const tool=selects.find(s=>[...s.options].some(o=>/base64-encode-decode/.test(o.value)));
 if(!tool)return {pending:true};
 if(value===null)return {tools:[...tool.options].filter(o=>o.value&&!o.disabled).map(o=>({value:o.value,title:o.textContent.trim(),category:o.closest('optgroup')?.label||''}))};
 if(![...tool.options].some(o=>o.value===value))throw Error('Herramienta no disponible');
 const language=selects.find(s=>[...s.options].some(o=>o.value==='es')&&[...s.options].some(o=>o.value==='en'));
 if(language){language.value='es';language.dispatchEvent(new Event('change',{bubbles:true}));}
 tool.value=value;tool.dispatchEvent(new Event('change',{bubbles:true}));
 const plain=[...document.querySelectorAll('button')].find(b=>/iframe simple|plain iframe/i.test(b.textContent));if(plain)plain.click();
 const slug=value.split('/').filter(Boolean).pop();
 for(let attempt=0;attempt<15;attempt++){
  await new Promise(resolve=>setTimeout(resolve,200));
  const sources=[];
  for(const node of document.querySelectorAll('textarea,pre,code,input[data-clipboard-text],[data-clipboard-text]')){
   const text=node.getAttribute('data-clipboard-text')||node.value||node.textContent||'';
   if(/<iframe\b/i.test(text))sources.push(...new DOMParser().parseFromString(text,'text/html').querySelectorAll('iframe[src]'));
  }
  for(const frame of sources){
   const url=new URL(frame.getAttribute('src'),location.href);
   if(url.origin!==location.origin||!url.pathname.startsWith('/es/embed/')||url.pathname.split('/').pop()!==slug)continue;
   return {url:url.href,title:frame.title||tool.selectedOptions[0]?.textContent?.trim()||'',height:Number(frame.getAttribute('height'))||480};
  }
 }
 return {error:'El generador no publicó un iframe en español para '+value};
}
async function repositoryScanToolkits(signal,report,resume={}){
 if(signal.aborted)throw Error('Cancelado');
 const tab=await chrome.tabs.create({url:'https://www.toolkitsapp.com/es/embed',active:false});
 const widgets=resume.widgets||(resume.widgets=[]),errors=resume.errors||(resume.errors=[]),done=new Set(resume.done||[]);
 const read=async value=>{
  if(signal.aborted)throw Error('Cancelado');
  const current=await chrome.tabs.get(tab.id);if(new URL(current.url||current.pendingUrl).origin!=='https://www.toolkitsapp.com')throw Error('Redirección fuera de ToolkitsApp');
  const result=await chrome.scripting.executeScript({target:{tabId:tab.id},func:toolkitsReadGenerator,args:[value]});return result[0]?.result;
 };
 try{
  let listing;
  for(let attempt=0;attempt<30;attempt++){
   report('Cargando el generador oficial de ToolkitsApp…',widgets);await new Promise(resolve=>setTimeout(resolve,500));
   listing=await read(null);if(listing?.tools?.length)break;
  }
  if(!listing?.tools?.length)throw Error('No se encontró el selector de herramientas en el generador oficial.');
  let count=0;
  for(const entry of listing.tools){
   if(done.has(entry.value)){count++;continue;}
   if(signal.aborted)throw Error('Cancelado');report(`Escaneando herramienta ${++count} de ${listing.tools.length} · ${entry.title}`,widgets);
   try{const result=await read(entry.value);if(!result?.url)throw Error(result?.error||'Iframe no disponible');
    if(!widgets.some(w=>repositoryWidgetKey(w.url)===repositoryWidgetKey(result.url)))widgets.push({url:result.url,title:result.title||entry.title,description:'',widgetType:repositoryCategory(entry.category)||entry.category||'Otros',width:'100%',height:normalizeIframeHeight(result.height)||480});
   }catch(error){if(signal.aborted)throw error;errors.push(entry.title+': '+error.message);}
   done.add(entry.value);resume.done=[...done];report(`Herramientas procesadas: ${count} de ${listing.tools.length}`,widgets);
  }
  return {widgets,failures:errors.length,errors};
 }finally{
  try{const current=await chrome.tabs.get(tab.id);if(new URL(current.pendingUrl||current.url).origin==='https://www.toolkitsapp.com')await chrome.tabs.remove(tab.id);}catch{}
 }
}
