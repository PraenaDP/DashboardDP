/* npm dependency for maintainers: playwright. No third-party sites are contacted.
   node tools/security-regression.cjs <extension-root> <output-directory>
   Set DASHBOARD_TEST_BROWSER to a Chromium/Edge executable if necessary. */
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');
const root = path.resolve(process.argv[2] || path.join(__dirname, '..'));
const output = path.resolve(process.argv[3] || path.join(require('node:os').tmpdir(), 'dashboarddp-security-results'));
fs.mkdirSync(output, {recursive:true});
const checks=[];
function check(name, result, details) {
 checks.push({name, passed:!!result, ...(details === undefined ? {} : {details})});
 console.log(`${result ? 'PASS' : 'FAIL'} ${name}`);
}
(async()=>{
 const profile=fs.mkdtempSync(path.join(output,'isolated-profile-'));
 const executablePath=process.env.DASHBOARD_TEST_BROWSER || (process.platform==='win32' ? 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe' : undefined);
 const context=await chromium.launchPersistentContext(profile,{executablePath,headless:true,viewport:{width:1440,height:1000},args:[`--disable-extensions-except=${root}`,`--load-extension=${root}`,'--no-first-run']});
 const errors=[];
 try {
  await context.route(/^https?:/,r=>r.abort());
  const worker=context.serviceWorkers()[0] || await context.waitForEvent('serviceworker',{timeout:15000});
  const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
  await page.goto(`chrome-extension://${new URL(worker.url()).host}/dashboard/index.html`);
  await page.waitForFunction(()=>typeof state!=='undefined' && state.data);
  const settleModal=()=>page.waitForFunction(()=>{
   const modal=document.querySelector('.modal-overlay.visible .modal');
   return modal && getComputedStyle(modal).opacity==='1' && getComputedStyle(modal.parentElement).opacity==='1';
  });
  await page.getByRole('button',{name:'Empezar de cero',exact:true}).click();
  await page.waitForFunction(()=>state.data.settings.nativeBookmarkMode);
  check('Extension boots in an isolated Chromium profile',true,await context.browser().version());
  check('Tabs can open without broad tabs permission',await page.evaluate(async()=>{
   const tab=await chrome.tabs.create({url:'about:blank',active:false});await chrome.tabs.remove(tab.id);
   return !chrome.runtime.getManifest().permissions.includes('tabs');
  }));
  const cases=await page.evaluate(async()=>{
   const cases=[];const test=(name,value)=>cases.push({name,value});
   const badHosts=['localhost','localhost.','router','[::1]','[fd00::1]','[fe80::1]','[::ffff:c0a8:1]','169.254.169.254','100.64.0.1','10.0.0.1','172.16.0.1','192.168.1.1','0.0.0.0','224.0.0.1'];
   test('Audit excludes private/special hosts',badHosts.every(isPrivateAuditHost));
   test('Audit retains public hosts',!isPrivateAuditHost('example.com')&&!isPrivateAuditHost('8.8.8.8'));
   const clean=sanitizeStickyHtml('<p class="modal-overlay" onclick="alert(1)">x<img src="https://example.invalid/track"><a href="javascript:alert(1)">bad</a><svg onload="alert(1)"></svg></p>');
   test('Notes reject executable HTML and application CSS classes',!/(onclick|onload|javascript:|modal-overlay|https:\/\/example)/.test(clean));
   test('Rich text preserves font and color',/font-family/.test(sanitizeStickyHtml('<span style="color: red; font-family: Arial; font-size: 20px">text</span>')));
   const markdown=renderStickyMarkdown('# Test\n- [ ] Pending\n- [x] Done');
   const node=document.createElement('div');node.innerHTML=markdown;
   test('Markdown checkboxes survive sanitization',node.querySelectorAll('input[type=checkbox]').length===2 && node.querySelectorAll('input:checked').length===1);
   test('Markdown checkbox updates its source',updateMarkdownTask('- [ ] Task',0,true)==='- [x] Task');
   test('Unsafe iframe schemes rejected',!parseCustomIframe('<iframe src="javascript:alert(1)" onload="alert(1)"></iframe>'));
   const frame=parseCustomIframe('<iframe src="https://example.invalid/embed" srcdoc="<script>alert(1)</script>" onload="alert(1)"></iframe>');
   test('Iframe import only extracts permitted fields',frame && !('srcdoc' in frame) && !('onload' in frame));
   test('Malformed collection import rejected',!validateData({categories:[null],bookmarks:[{url:123}],settings:[]}));
   test('Category cycles rejected',!validateData({categories:[{id:'a',parentId:'b'},{id:'b',parentId:'a'}],bookmarks:[],settings:{}}));
   test('Duplicate identifiers rejected',!validateData({categories:[],bookmarks:[{id:'a'},{id:'a'}],settings:{}}));
   test('Prototype keys rejected',!validateData(JSON.parse('{"categories":[],"bookmarks":[],"settings":{"__proto__":{"x":1}}}')));
   test('Oversized JSON rejected before parsing',importData(' '.repeat(25*1024*1024+1))===false);
   test('Malformed trash payload rejected',normalizeTrashEntry({type:'bookmark',payload:{bookmark:{id:'bad',url:'javascript:alert(1)'}}})===null);
   const colored=defaultData();colored.stickyNotes=[{id:'css-test',color:'red;position:fixed;inset:0;z-index:999999;background:url(https://example.invalid/track)'}];
   test('Imported colors cannot inject CSS declarations',migrateData(colored,false).stickyNotes[0].color==='#8e58d7');
   const originalFetch=window.fetch;let sent=0;let requestOptions;
   window.fetch=async(url,options)=>{sent++;requestOptions=options;return {status:200,ok:true,json:async()=>({items:[]})};};
   const connection={token:{accessToken:'SYNTHETIC_TOKEN',expiresAt:Date.now()+60000}};
   try {
    let rejected=false;try {await calendarFetch('google',connection,'https://example.invalid/token');}catch {rejected=true;}
    test('Calendar refuses untrusted destination before sending token',rejected&&sent===0);
    await calendarFetch('google',connection,'https://www.googleapis.com/calendar/v3/users/me/calendarList');
    test('Calendar allows provider and refuses redirects/cookies',sent===1&&requestOptions.redirect==='error'&&requestOptions.credentials==='omit');
    await fetchAuditResponse('https://example.invalid',new AbortController().signal);
    test('Audit request cannot follow redirect to private target',requestOptions.redirect==='manual'&&requestOptions.credentials==='omit');
   } finally {window.fetch=originalFetch;}
   personalCalendarConnections={google:{clientId:'TEST',token:{accessToken:'SYNTHETIC_TOKEN',refreshToken:'SYNTHETIC_REFRESH'}}};
   test('Full backup excludes OAuth tokens',!JSON.stringify(fullBackupEnvelope()).includes('SYNTHETIC_'));
   personalCalendarConnections={};
   return cases;
  });
  cases.forEach(c=>check(c.name,c.value));
  const csp=await page.evaluate(async()=>{
   let blocked=false;
   const listener=e=>{if(e.violatedDirective.startsWith('script-src')) blocked=true;};
   document.addEventListener('securitypolicyviolation',listener);
   const script=document.createElement('script');script.textContent='window.__auditInlineExecuted=true';document.body.append(script);
   await new Promise(resolve=>setTimeout(resolve,50));script.remove();document.removeEventListener('securitypolicyviolation',listener);
   return blocked&&!window.__auditInlineExecuted;
  });
  check('Actual extension CSP blocks injected inline script',csp);
  const native=await page.evaluate(async()=>{
   const root=(await chrome.bookmarks.getTree())[0].children.find(n=>!n.url);
   const folder=await chrome.bookmarks.create({parentId:root.id,title:'Security test only'});
   state.data=defaultData();state.data.settings.nativeWriteEnabled=true;state.data.settings.nativeWriteFolderId=folder.id;state.data.settings.nativeBookmarkMode='future';
   const bookmark={id:'audit-bookmark',name:'Synthetic favorite',url:'https://example.invalid',categoryId:null};
   const entry=addToTrash('bookmark',bookmark.name,{bookmark});
   restoreTrashEntry(entry.id);
   return {folderId:folder.id};
  });
  await page.waitForFunction(()=>!!getBookmark('audit-bookmark')?.sourceNativeId);
  check('Trash restoration persists the native ID on restored object',await page.evaluate(()=>!!getBookmark('audit-bookmark').sourceNativeId));
  await page.reload();await page.waitForFunction(()=>!!state.data?.bookmarks.length);
  check('Restored favorite survives reload',await page.evaluate(()=>!!getBookmark('audit-bookmark')?.sourceNativeId));
  check('Native restoration creates a single favorite',await page.evaluate(async id=>(await chrome.bookmarks.getChildren(id)).length===1,native.folderId));
  await page.evaluate(()=>{
   const categories=[{id:'tree-root',name:'Tree root',parentId:null},{id:'tree-child',name:'Tree child',parentId:'tree-root'}];
   const bookmarks=[1,2].map(i=>({id:`tree-bookmark-${i}`,name:`Tree ${i}`,url:`https://example.invalid/${i}`,categoryId:'tree-child'}));
   const entry=addToTrash('category-tree','Tree',{categories,bookmarks});restoreTrashEntry(entry.id);
  });
  await page.waitForFunction(()=>getBookmark('tree-bookmark-1')?.sourceNativeId&&getBookmark('tree-bookmark-2')?.sourceNativeId);
  check('Nested trash restoration creates one parent and one child folder',await page.evaluate(async()=>{
   const parent=getCategory('tree-root'),child=getCategory('tree-child');
   const siblings=await chrome.bookmarks.getChildren(state.data.settings.nativeWriteFolderId);
   const children=await chrome.bookmarks.getChildren(parent.sourceNativeId);
   return siblings.filter(n=>n.title==='Tree root').length===1&&children.filter(n=>n.title==='Tree child').length===1&&(await chrome.bookmarks.getChildren(child.sourceNativeId)).length===2;
  }));
  const restore=await page.evaluate(async()=>{
   const backup=fullBackupEnvelope();const oldId=state.data.bookmarks[0].sourceNativeId;
   await restoreFullBackup(backup);
   return {disabled:!nativeWritesEnabled(),detached:!state.data.bookmarks[0].sourceNativeId,nativeRetained:(await chrome.bookmarks.get(oldId)).length===1};
  });
  check('Backup restoration detaches foreign IDs and disables native writes',restore.disabled&&restore.detached&&restore.nativeRetained);
  await page.evaluate(()=>{
   state.data.stickyNotes=[{id:'note-test',title:'Markdown test',mode:'markdown',markdown:'# Test\n- [ ] Pending\n- [x] Done',html:'',showInPanel:true,color:'#24213c',fontFamily:'system-ui',fontSize:'16px',height:240}];
   state.data.bookmarks[0].pinned=true;selectSidebar(sidebarBars()[1].id);saveData();renderAll();closeModal();
  });
  const checkbox=page.locator('.panel-note-preview input[data-markdown-task="0"]').first();
  await checkbox.check();
  check('Visible note task checkbox is interactive',await page.evaluate(()=>state.data.stickyNotes[0].markdown.includes('- [x] Pending')));
  await page.reload();await page.waitForFunction(()=>state.data?.stickyNotes.length===1);
  check('Reload does not repeat first-run setup after restoration',await page.getByRole('button',{name:'Empezar de cero',exact:true}).count()===0);
  check('Visible Markdown checkbox state survives reload',await page.locator('.panel-note-preview input[data-markdown-task="0"]').first().isChecked());
  await page.screenshot({path:path.join(output,'desktop.png'),fullPage:true});
  for(const width of [1440,1024,390]){
   await page.setViewportSize({width,height:900});
   const layout=await page.evaluate(()=>({viewport:innerWidth,document:document.documentElement.scrollWidth}));
   check(`Main page horizontal bounds at ${width}px`,layout.document<=layout.viewport,layout);
  }
  await page.setViewportSize({width:1440,height:1000});
  await page.locator('#settingsBtn').click();
  await settleModal();
  check('Settings dialog visible',await page.getByRole('heading',{name:'Ajustes',exact:true}).isVisible());
  const beforeSupport=await page.evaluate(()=>JSON.stringify(state.data));
  await page.locator('[data-settings-target="settings-about"]').click();
  check('Ko-fi remains unloaded until explicit activation',await page.locator('.about-support-panel iframe').count()===0);
  await page.getByRole('button',{name:'☕ Invítame a un café',exact:true}).click();
  check('Coffee button opens the donation widget instead of a profile link',await page.locator('.about-support-panel iframe').getAttribute('src')==='https://ko-fi.com/K8E42B9WDB/?hidefeed=true&widget=true&embed=true&preview=true'&&await page.locator('.about-support-panel iframe').getAttribute('referrerpolicy')==='no-referrer'&&await page.getByRole('button',{name:'☕ Invítame a un café',exact:true}).getAttribute('aria-expanded')==='true'&&await page.locator('.about-support-section a').count()===0);
  await page.getByRole('button',{name:'☕ Invítame a un café',exact:true}).click();
  check('Closing the coffee panel releases the iframe',await page.locator('.about-support-panel iframe').count()===0);
  await page.getByRole('button',{name:'☕ Invítame a un café',exact:true}).click();
  await page.locator('[data-settings-target="settings-principal"]').click();
  check('Leaving About releases Ko-fi without changing personal data',await page.locator('.about-support-panel iframe').count()===0&&beforeSupport===await page.evaluate(()=>JSON.stringify(state.data)));
  await page.screenshot({path:path.join(output,'settings.png'),fullPage:true});
  await page.evaluate(()=>openTrash());
  check('Trash dialog accessible',await page.getByRole('heading',{name:'Papelera',exact:true}).isVisible());
  await page.evaluate(()=>{closeModal();openHelpModal();});
  await settleModal();
  const helpScroll=await page.evaluate(()=>{
   const tree=document.querySelector('.help-tree'),reader=document.querySelector('.help-reader');
   return [tree,reader].every(n=>['auto','scroll'].includes(getComputedStyle(n).overflowY)&&n.clientHeight>0);
  });
  check('Help index and reader have independent scroll containers',helpScroll);
  check('Integrated knowledge base has thirteen chapters and detailed articles',await page.locator('.help-tree [data-help-article]').count()===await page.evaluate(()=>dashboardHelpTopics().length)&&await page.locator('.help-tree-group').count()===13&&await page.evaluate(()=>dashboardHelpTopics().length>=40));
  await page.getByRole('searchbox',{name:'Buscar en la ayuda',exact:true}).fill('VPN');
  check('Help search finds body text, not just article titles',await page.locator('.help-tree [data-help-article]:not([hidden])').count()===1);
  await page.locator('.help-tree [data-help-article]:not([hidden])').click();
  await page.getByRole('searchbox',{name:'Buscar en la ayuda',exact:true}).fill('');
  await page.locator('.help-related button').filter({hasText:'Reparar un enlace desde la auditoría'}).click();
  check('Related help articles navigate inside the reader',await page.locator('.help-reader > h2').textContent()==='Reparar un enlace desde la auditoría');
  await page.getByRole('button',{name:'Volver al artículo anterior',exact:true}).click();
  check('Help back button restores the previous article',await page.locator('.help-reader > h2').textContent()==='Interpretar disponible, no disponible y no concluyente');
  await page.evaluate(()=>{closeModal();openHelpModal();});
  check('Help remembers the last article after reopening',await page.locator('.help-reader > h2').textContent()==='Interpretar disponible, no disponible y no concluyente');
  const phetCredits=await page.evaluate(()=>{
   const url='https://phet.colorado.edu/sims/html/area-builder/latest/area-builder_all.html';
   const credit=phetWidgetAttribution(url),block=renderCustomPanelBlock({id:'phet-credit-test',type:'iframe',title:'Prueba PhET',url,height:600,width:'100%'},0,1);
   return credit.textContent.includes('University of Colorado Boulder')&&credit.querySelector('a').href==='https://creativecommons.org/licenses/by-nc/4.0/'&&block.querySelector('.widget-attribution')&&block.querySelector('iframe').src===url&&phetWidgetAttribution('https://phet.colorado.edu.example.org/')===null;
  });
  check('PhET attribution is beside the original iframe and rejects lookalike domains',phetCredits);
  check('Provider credits are visible and METER keeps its responsive wrapper',await page.evaluate(()=>{const url='https://www.metercustom.net/plugin/?hl=es',frame=el('iframe',{src:url}),wrapper=widgetEmbedContent(frame,url);return wrapper.querySelector('iframe').src===url&&wrapper.textContent.includes('provided by METER.net')&&wrapper.querySelector('div').style.minHeight==='360px'&&widgetProviderAttribution('https://vclock.eu/embed/clock/').textContent.includes('vclock.eu')&&widgetProviderAttribution('https://unrelated.example.org/')===null;}));
  await page.evaluate(()=>{closeModal();openWidgetLibraryPreview({title:'Prueba PhET',url:'https://phet.colorado.edu/sims/html/area-builder/latest/area-builder_all.html',height:600,width:'100%'},()=>openHelpModal());});
  check('PhET preview exposes license and provider terms without changing the source',await page.locator('.widget-library-preview-modal .widget-attribution a').count()===2&&await page.locator('.widget-library-preview-modal iframe').getAttribute('src')==='https://phet.colorado.edu/sims/html/area-builder/latest/area-builder_all.html');
  await page.evaluate(()=>{closeModal();openHelpModal();});
  const helpTranslation=await page.evaluate(()=>{const es=dashboardHelpTopics('es'),en=dashboardHelpTopics('en');return dashboardHelpTopics.coverage.es===es.length&&dashboardHelpTopics.coverage.en===es.length&&en.every((topic,i)=>topic.id===es[i].id&&topic.title!==es[i].title&&topic.blocks.length===es[i].blocks.length&&topic.blocks.every((block,j)=>block[2].length===es[i].blocks[j][2].length));});
  check('All help articles have matching English structure and stable identifiers',helpTranslation);
  await page.evaluate(()=>{closeModal();state.data.settings.language='en';applyInterfaceLanguage();openSettingsForm();document.querySelector('[data-settings-target="settings-info"]').click();});
  check('Integrated help changes its article body and title to English',await page.locator('.help-reader > h2').textContent()==='Interpret available, unavailable, and inconclusive results'&&(await page.locator('.help-reader').textContent()).includes('The audit records what it could check'));
  check('Integrated help has no redundant outer scrolling',await page.evaluate(()=>{const outer=document.querySelector('.settings-content'),body=document.querySelector('.settings-help-panel .help-body');return getComputedStyle(outer).overflowY==='hidden'&&outer.scrollHeight<=outer.clientHeight+1&&getComputedStyle(body).overflowY==='hidden'&&body.scrollHeight<=body.clientHeight+1;}));
  await page.getByRole('searchbox',{name:'Search help',exact:true}).fill('VPN');
  check('English help search finds translated body text',await page.locator('.help-tree [data-help-article]:not([hidden])').count()===1);
  await page.getByRole('searchbox',{name:'Search help',exact:true}).fill('');
  await settleModal();
  await page.screenshot({path:path.join(output,'help-en-public.png'),fullPage:true});
  await page.evaluate(()=>{closeModal();state.data.settings.language='es';applyInterfaceLanguage();openHelpModal();});
  await page.screenshot({path:path.join(output,'help.png'),fullPage:true});
  await page.evaluate(()=>{const results=Array.from({length:170},(_,i)=>({bookmarkId:`test-${i}`,name:`Test ${i}`,url:'https://example.invalid/'+i,category:'Test',status:i%2?'missing':'available',detail:'Synthetic response',httpStatus:i%2?404:200}));state.data.settings.auditPanel={};state.data.bookmarks.push(...results.map(item=>({id:item.bookmarkId,name:item.name,url:item.url,categoryId:null})));openBookmarkAudit(results);});
  await settleModal();
  check('Audit renders initial 160 results',await page.locator('.bookmark-audit-row').count()===160);
  await page.locator('.bookmark-audit-more').click();
  check('Audit loads next results on request',await page.locator('.bookmark-audit-row').count()===170);
  check('Available audit results allow explicit manual selection',await page.locator('.bookmark-audit-row:not(.candidate) input:not(:disabled)').count()===85);
  await page.getByRole('button',{name:'Seleccionar candidatos',exact:true}).click();
  check('Automatic candidates exclude available results',await page.locator('.bookmark-audit-row:not(.candidate) input:checked').count()===0);
  const interfaceChecks=await page.evaluate(()=>{
   closeModal();const original=JSON.stringify(state.data.widgetLibrary);let languages=0,themes=0;
   for(const language of LANGUAGES){state.data.settings.language=language.id;applyInterfaceLanguage();openSettingsForm();if(document.querySelectorAll('.settings-nav button').length!==6)throw Error('Secciones incompletas: '+language.id);if(document.querySelectorAll('.settings-help-panel [data-help-article]').length!==dashboardHelpTopics().length)throw Error('Ayuda incompleta: '+language.id);closeModal();languages++;}
   state.data.settings.language='es';applyInterfaceLanguage();for(const skin of Object.keys(APP.themes))for(const mode of ['dark','light']){applySkin(skin);applyTheme(mode);openSettingsForm();const bounds=document.querySelector('.settings-modal').getBoundingClientRect();if(bounds.left<0||bounds.right>innerWidth+1)throw Error('Ajustes desbordados: '+skin+'/'+mode);closeModal();themes++;}
   applySkin('catppuccin');applyTheme('dark');openSettingsForm();document.querySelector('[data-settings-target="settings-appearance"]').click();
   return {languages,themes,widgetOriginalsUnchanged:original===JSON.stringify(state.data.widgetLibrary)};
  });
  check('Settings and help structure work in Spanish and English only',interfaceChecks.languages===2&&interfaceChecks.widgetOriginalsUnchanged,interfaceChecks);
  check('Removed interface languages migrate safely to Spanish',await page.evaluate(()=>{const sample=JSON.parse(JSON.stringify(state.data));sample.settings.language='fr';const original=JSON.stringify(sample.widgetLibrary);const result=migrateData(sample,false);return result.settings.language==='es'&&LANGUAGES.map(item=>item.id).join(',')==='es,en'&&JSON.stringify(result.widgetLibrary)===original;}));
  check('Settings remain in bounds across all themes and light/dark modes',interfaceChecks.themes===16,interfaceChecks);
  await settleModal();await page.screenshot({path:path.join(output,'appearance-public.png'),fullPage:true});
  await page.evaluate(()=>{document.querySelector('[data-settings-target="settings-info"]').click();});await page.screenshot({path:path.join(output,'help-public.png'),fullPage:true});
  const importFixture=await page.evaluate(()=>{closeModal();state.data.widgetLibrary=[];saveWidgetToLibrary({title:'Guardado',description:'Descripción',widgetType:'Pruebas',url:'https://example.org/embed/a'});window.importTestSession={source:'https://example.org/',items:[{title:'Guardado',description:'Descripción',widgetType:'Pruebas',url:'https://example.org/embed/a'},{title:'Posible',description:'Descripción',widgetType:'Pruebas',url:'https://example.org/es/embed/a?hl=es'},{title:'Nuevo',description:'Descripción',widgetType:'Pruebas',url:'https://example.org/embed/new'}],selected:new Set(),notice:''};const kinds=importTestSession.items.map(item=>repositoryMatch(item,widgetLibrary()).kind);openRepositoryImport(importTestSession);return kinds;});
  check('Importer fixture distinguishes imported, possible and available',JSON.stringify(importFixture)===JSON.stringify(['imported','possible','available']));
  await page.getByRole('button',{name:'Seleccionar todas',exact:true}).click();
  check('Bulk selection includes imported results for discard only',await page.locator('.repository-import-table input[type=checkbox]:checked').count()===3&&await page.evaluate(()=>importTestSession.selected.size===1));
  await page.getByRole('button',{name:'Importar seleccionados',exact:true}).click();
  check('Bulk import does not reimport existing or possible equivalents',await page.evaluate(()=>widgetLibrary().length===2&&!widgetLibrary().some(item=>item.title==='Posible')));
  await page.getByRole('button',{name:'Descartar seleccionados',exact:true}).click();
  check('Bulk discard removes results without deleting library widgets',await page.evaluate(()=>importTestSession.items.length===0&&widgetLibrary().length===2));
  await page.getByRole('button',{name:'Configurar lectura',exact:true}).click();
  await settleModal();
  check('Reading setup opens from importer without losing the draft',await page.getByRole('heading',{name:'Configurar lectura',exact:true}).isVisible()&&await page.evaluate(()=>importTestSession.items.length===0));
  await page.getByRole('button',{name:'Añadir paso',exact:true}).click();
  check('Reading setup has ordered editable steps and requires a test before save',await page.locator('.repository-reading-step').count()===2&&await page.getByRole('button',{name:'Guardar configuración',exact:true}).isDisabled());
  for(const width of [1440,390]){
   await page.setViewportSize({width,height:900});
   check(`Reading setup stays within bounds at ${width}px`,await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth&&document.querySelector('.repository-reading-modal').scrollWidth<=document.querySelector('.repository-reading-modal').clientWidth+1));
   if(width===1440)await page.screenshot({path:path.join(output,'reading-setup-desktop.png'),fullPage:true});
  }
  check('Reading settings survive full backup serialization and migration',await page.evaluate(()=>{const origin='https://example.org',rule={version:1,sampleUrl:origin+'/tool',steps:[{mode:'text',value:'Compartir'},{mode:'text',value:'Embed'}],codeSelector:'#code'};repositoryStoreReadingRules({[origin]:rule});const restored=migrateData(JSON.parse(JSON.stringify(state.data)),false);return JSON.stringify(restored.settings.repositoryReadingRules[origin])===JSON.stringify(rule)&&repositoryReadingRule(origin+'/another').steps.length===2&&!repositoryReadingRule('https://other.invalid/');}));
  await page.screenshot({path:path.join(output,'reading-setup-mobile.png'),fullPage:true});
  await page.setViewportSize({width:1440,height:1000});
  await page.getByRole('textbox',{name:'URL de prueba',exact:true}).fill('https://example.org/tool');
  await page.locator('.repository-reading-step input').nth(0).fill('Compartir');await page.locator('.repository-reading-step input').nth(1).fill('Embed');
  await page.evaluate(()=>{window.originalReading=repositoryReadRenderedPage;window.originalRequest=chrome.permissions.request;chrome.permissions.request=async()=>true;repositoryReadRenderedPage=async()=>({url:'https://example.org/tool',html:'<h1>Prueba pública</h1><pre>&lt;iframe src="https://example.org/embed/fixture" width="100%" height="730" style="border:0"&gt;&lt;/iframe&gt;</pre>'});});
  await page.getByRole('button',{name:'Probar lectura',exact:true}).click();
  check('Reading test shows original iframe without importing a widget',await page.getByRole('textbox',{name:'Código encontrado',exact:true}).inputValue().then(code=>code.includes('height="730"')&&code.includes('style="border:0"'))&&await page.evaluate(()=>widgetLibrary().length===2));
  await page.getByRole('button',{name:'Guardar configuración',exact:true}).click();
  check('Tested recipe saves and returns to dynamic importer',await page.evaluate(()=>repositoryReadingRule('https://example.org/tool').steps[1].value==='Embed')&&await page.getByRole('combobox',{name:'Modo de lectura',exact:true}).inputValue()==='rendered');
  await page.getByRole('button',{name:'Configurar lectura',exact:true}).click();
  check('Saved recipe can be reopened and edited',await page.locator('.repository-reading-step input').nth(0).inputValue()==='Compartir');
  page.once('dialog',dialog=>dialog.accept());await page.getByRole('button',{name:'Restablecer lectura automática',exact:true}).click();
  check('Reset recipe leaves library and search untouched',await page.evaluate(()=>!repositoryReadingRule('https://example.org/tool')&&widgetLibrary().length===2&&importTestSession.items.length===0));
  await page.evaluate(()=>{repositoryReadRenderedPage=window.originalReading;chrome.permissions.request=window.originalRequest;});
  await page.evaluate(()=>{closeModal();state.data.widgetLibrary=[];state.data.settings.widgetLibraryTypeFilter='';state.data.settings.widgetLibrarySort='name-asc';state.data.settings.widgetLibraryViews={all:'list'};for(let i=0;i<8;i++)saveWidgetToLibrary({title:'WS-'+i,description:'Descripción '+i,widgetType:i===7?'Destino':'Original',url:'https://example.org/widget-'+i,embedCode:'<iframe src="https://example.org/widget-'+i+'" height="730" style="border-radius:12px"></iframe>',height:730,width:'100%',favorite:i===0});saveData();openWidgetLibrary();});
  let selectable=page.locator('[data-widget-selection-id]');
  await selectable.nth(0).click();await selectable.nth(2).click({modifiers:['Control']});await selectable.nth(4).click({modifiers:['Alt']});
  check('Table direct selection supports Ctrl and Alt without checkboxes',await page.locator('.widget-multiselected').count()===3&&await page.locator('.widget-library-list input[type=checkbox]').count()===0);
  await selectable.nth(6).click({modifiers:['Shift']});
  check('Shift selects a contiguous visible range',await page.locator('.widget-multiselected').count()===3);
  await selectable.nth(1).click({modifiers:['Control','Shift']});
  check('Ctrl+Shift extends the range without discarding previous selection',await page.locator('.widget-multiselected').count()===6);
  const nameSort=page.locator('.widget-library-table th').first().locator('button');await nameSort.click();await nameSort.click();
  await page.getByRole('button',{name:'Deseleccionar',exact:true}).click();await selectable.nth(0).click();await selectable.nth(2).click({modifiers:['Shift']});
  check('Range selection follows table header sort order',await page.evaluate(()=>{const nodes=[...document.querySelectorAll('[data-widget-selection-id]')];return nodes.slice(0,3).every(node=>node.classList.contains('widget-multiselected'))&&nodes.slice(3).every(node=>!node.classList.contains('widget-multiselected'));}));
  await page.getByRole('combobox',{name:'Vista de widgets',exact:true}).selectOption('cards');
  check('Selection survives switching from table to cards',await page.locator('.widget-library-card.widget-multiselected').count()===3);
  await page.locator('[data-widget-selection-id]').first().focus();await page.keyboard.press('Control+a');
  check('Keyboard selects personal widgets only',await page.locator('.widget-multiselected').count()===8&&await page.locator('[data-widget-selection-id]').count()===8);
  await page.getByRole('searchbox',{name:'Buscar widgets',exact:true}).fill('WS-0');
  check('Filtering removes hidden widgets from the selection',await page.locator('.widget-multiselected').count()===1);
  await page.getByRole('searchbox',{name:'Buscar widgets',exact:true}).fill('');await page.getByRole('button',{name:'Deseleccionar',exact:true}).click();
  selectable=page.locator('[data-widget-selection-id]');await selectable.nth(0).click();await selectable.nth(1).click({modifiers:['Control']});
  await page.evaluate(()=>{window.bulkBefore=JSON.stringify(widgetLibrary());window.bulkIds=[...document.querySelectorAll('.widget-multiselected')].map(node=>node.dataset.widgetSelectionId);});
  await page.screenshot({path:path.join(output,'widget-multiselection.png'),fullPage:true});
  await page.getByRole('button',{name:'Cambiar tipo',exact:true}).click();await settleModal();
  check('Bulk category dialog is horizontal on desktop',await page.evaluate(()=>{const rect=document.querySelector('.widget-library-bulk-type-modal').getBoundingClientRect();return rect.width>rect.height&&getComputedStyle(document.querySelector('.widget-library-bulk-columns')).gridTemplateColumns.split(' ').length===2;}));
  await page.locator('.widget-library-bulk-type-modal .widget-type-toggle').click();await page.getByRole('option',{name:'Destino',exact:true}).click();
  check('Bulk type picker can choose an existing library category',await page.getByRole('textbox',{name:'Tipo de destino',exact:true}).inputValue()==='Destino');
  await page.getByRole('textbox',{name:'Tipo de destino',exact:true}).fill('Nuevo tipo');await page.screenshot({path:path.join(output,'widget-bulk-type.png'),fullPage:true});
  await page.getByRole('button',{name:'Aplicar a seleccionados',exact:true}).click();
  check('Bulk type update changes only the selected types and update timestamps',await page.evaluate(()=>{const before=JSON.parse(window.bulkBefore),after=widgetLibrary();return after.length===8&&after.every(entry=>{const old=before.find(item=>item.id===entry.id),target=window.bulkIds.includes(entry.id);if(entry.widgetType!==(target?'Nuevo tipo':old.widgetType))return false;const clean=value=>{const copy={...value};delete copy.widgetType;delete copy.updatedAt;return JSON.stringify(copy);};return clean(old)===clean(entry);});}));
  await page.reload();await page.waitForFunction(()=>state.data);
  check('New bulk category survives reload and is available to all type selectors',await page.evaluate(()=>widgetLibrary().filter(entry=>entry.widgetType==='Nuevo tipo').length===2&&widgetLibraryTypes().includes('Nuevo tipo')));
  check('No uncaught page errors during tested flows',errors.length===0,errors);
  const bg=await worker.evaluate(()=>({sender:!isTrustedDashboardSender({id:'other'})&&!isTrustedDashboardSender({id:api.runtime.id,url:'https://example.invalid'})&&isTrustedDashboardSender({id:api.runtime.id,url:api.runtime.getURL('dashboard/index.html')}),oauth:!validCalendarAuthUrl('https://example.invalid')&&validCalendarAuthUrl('https://accounts.google.com/o/oauth2/v2/auth'),id:!validReminderId('__proto__')}));
  check('Background validates message sender, OAuth destination and reminder IDs',bg.sender&&bg.oauth&&bg.id);
 } catch(e){check('Test runner completed',false,e.stack);} finally {
  await context.close();
  fs.writeFileSync(path.join(output,'results.json'),JSON.stringify({date:new Date().toISOString(),checks},null,2));
  process.exitCode=checks.some(c=>!c.passed)?1:0;
 }
})().catch(e=>{console.error(e);process.exitCode=1});
