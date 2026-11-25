/* Capturas reales en un perfil aislado. Solo catálogo público y datos ficticios. */
const fs=require('node:fs'),path=require('node:path'),os=require('node:os');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..'),out=path.join(root,'docs/images');
const catalog=JSON.parse(fs.readFileSync(process.argv[2],'utf8')).entries;
if(!Array.isArray(catalog)||!catalog.length)throw Error('Falta el catálogo público.');
(async()=>{
 const context=await chromium.launchPersistentContext(fs.mkdtempSync(path.join(os.tmpdir(),'dashboarddp-public-')),{executablePath:process.env.DASHBOARD_TEST_BROWSER,headless:true,viewport:{width:1440,height:1000},deviceScaleFactor:1,args:[`--disable-extensions-except=${root}`,`--load-extension=${root}`,'--no-first-run']});
 const failures=[];try{
 await context.route(/^https?:/,route=>route.abort());
 const worker=context.serviceWorkers()[0]||await context.waitForEvent('serviceworker');
 const page=await context.newPage();page.on('pageerror',e=>failures.push(e.message));
 await page.goto(`chrome-extension://${new URL(worker.url()).host}/dashboard/index.html`);await page.waitForFunction(()=>typeof state!=='undefined'&&state.data);
 await page.getByRole('button',{name:'Empezar de cero',exact:true}).click();
 await page.waitForFunction(()=>state.data.settings.nativeBookmarkMode);
 const shot=async name=>{await page.evaluate(async()=>{document.querySelectorAll('.toast-close').forEach(button=>button.click());await document.fonts.ready;document.getAnimations().forEach(a=>a.finish());});await page.screenshot({path:path.join(out,name+'.png')});};
 await page.evaluate(()=>{state.data.settings.language='es';applyInterfaceLanguage();applySkin('default');applyTheme('dark');renderAll();});
 await shot('inicio-oscuro');await page.evaluate(()=>applyTheme('light'));await shot('inicio-claro');
 const composite=await context.newPage();
 const data=name=>'data:image/png;base64,'+fs.readFileSync(path.join(out,name+'.png')).toString('base64');
 await composite.setViewportSize({width:1440,height:530});await composite.setContent('<style>body{margin:0;background:#eee;font:16px Arial}.row{display:flex}.tile{width:50%}h3{margin:0;padding:12px}img{width:100%;display:block}</style><div class="row">'+['inicio-claro','inicio-oscuro'].map((name,i)=>'<div class="tile"><h3>'+['Default · Claro','Default · Oscuro'][i]+'</h3><img src="'+data(name)+'"></div>').join('')+'</div>');await composite.screenshot({path:path.join(out,'inicio-claro-oscuro.png')});
 const themes=await page.evaluate(()=>Object.keys(APP.themes)),themeImages=[];
 for(const theme of themes){await page.evaluate(theme=>{applySkin(theme);applyTheme('dark');},theme);const bytes=await page.screenshot();themeImages.push({theme,src:'data:image/png;base64,'+bytes.toString('base64')});}
 await composite.setViewportSize({width:1440,height:600});await composite.setContent('<style>body{margin:0;background:#171721;color:#fff;font:15px Arial}.grid{display:grid;grid-template-columns:repeat(4,1fr)}h3{margin:0;padding:10px}img{width:100%;display:block}</style><div class="grid">'+themeImages.map(item=>'<div><h3>'+item.theme+'</h3><img src="'+item.src+'"></div>').join('')+'</div>');await composite.screenshot({path:path.join(out,'temas.png')});await composite.close();
 const measurements=await page.evaluate(entries=>{
  applySkin('catppuccin');applyTheme('dark');state.data.widgetLibrary=entries.map((entry,i)=>({...entry,id:'public-demo-'+i,createdAt:1,updatedAt:1}));
  const start=performance.now();openWidgetLibrary();const libraryOpenMs=performance.now()-start;
  const serialized=JSON.stringify(state.data),saveStart=performance.now();localStorage.setItem(APP.storageKey,serialized);const saveMs=performance.now()-saveStart;
  return {widgets:entries.length,libraryOpenMs,saveMs,serializedCharacters:serialized.length,serializedBytes:new Blob([serialized]).size,iframeCount:document.querySelectorAll('iframe').length};
 },catalog);
 await shot('biblioteca-widgets');
 await page.evaluate(()=>{closeModal();openSettingsForm();document.querySelector('[data-settings-target="settings-info"]').click();});await shot('ayuda');
 await page.evaluate(()=>{closeModal();openSettingsForm();document.querySelector('[data-settings-target="settings-about"]').click();});await shot('acerca-de');
 await page.evaluate(()=>{closeModal();const now=Date.now();state.data.tasks=[{id:'demo-1',title:'Preparar la sesión de estudio',status:'todo',createdAt:now,updatedAt:now},{id:'demo-2',title:'Revisar documentación',status:'doing',createdAt:now,updatedAt:now},{id:'demo-3',title:'Organizar recursos',status:'done',createdAt:now,updatedAt:now}];openTaskManager('board');});await shot('tareas-kanban');
 await page.evaluate(()=>{closeModal();const p=newProject({name:'Proyecto de demostración',description:'Ejemplo ficticio de organización personal',status:'pending'});p.tasks=[{id:'p1',title:'Recopilar ideas',status:'todo'},{id:'p2',title:'Revisar el prototipo',status:'doing'},{id:'p3',title:'Definir el objetivo',status:'done'}];state.data.projects=[p];selectedProjectId=p.id;renderProjectsBody();});await shot('proyectos');
 await page.evaluate(()=>{openCalendarManager('year',new Date(2026,10,25));});await shot('calendario-anual');
 await page.evaluate(()=>{closeModal();const dueAt=new Date(2026,10,25,10).getTime();state.data.tasks.push({id:'event-demo',title:'Sesión de estudio · ejemplo',kind:'calendar-event',status:'todo',dueAt,endAt:dueAt+3600000,color:'#72a4f2'});openCalendarManager('day',new Date(2026,10,25));});await shot('calendario-diario');
 await page.evaluate(()=>{closeModal();const results=['Manual de ejemplo','Documentación de prueba','Recurso por revisar'].map((name,i)=>({bookmarkId:'demo-audit-'+i,name,url:'https://example.org/demo-'+i,category:'Demostración',status:['available','missing','inconclusive'][i],detail:['HTTP 200 · ejemplo simulado','HTTP 404 · ejemplo simulado','Tiempo de espera · ejemplo simulado'][i],httpStatus:[200,404,0][i]}));state.data.bookmarks=results.map(r=>({id:r.bookmarkId,name:r.name,url:r.url,categoryId:null}));openBookmarkAudit(results);});await shot('auditoria');
 await page.evaluate(()=>{closeModal();state.data.categories=[{id:'demo-cat',name:'Recursos de ejemplo',parentId:null,color:'#72a4f2'}];state.data.bookmarks=['Documentación','Material de estudio','Referencia'].map((name,i)=>({id:'demo-bm-'+i,name,url:'https://example.org/recurso-'+i,description:'Enlace ficticio de demostración',categoryId:'demo-cat',pinned:true,createdAt:1,order:i}));state.data.quickGroups=[{id:'demo-group',name:'Estudio',color:'#72a4f2',icon:'book',bookmarkIds:state.data.bookmarks.map(b=>b.id)}];state.data.workspaces=[{id:'demo-workspace',name:'Trabajo de ejemplo',color:'#63d297',icon:'briefcase',bookmarkIds:state.data.bookmarks.map(b=>b.id)}];saveData();selectNavView('all');});
 for(const [mode,name]of [['grid','favoritos-tarjetas'],['list','favoritos-lista'],['icon','favoritos-iconos']]){await page.evaluate(mode=>{state.viewMode=mode;state.data.settings.viewMode=mode;renderAll();},mode);await shot(name);}
 await page.evaluate(()=>selectNavView('home'));await shot('grupos-espacios');
 await page.evaluate(()=>{state.data.stickyNotes=[{id:'demo-note',title:'Notas de estudio · ejemplo',mode:'markdown',markdown:'# Plan de estudio\n- [x] Organizar recursos\n- [ ] Leer la documentación\n- [ ] Anotar conclusiones',html:'',showInPanel:true,color:'#24213c',fontFamily:'system-ui',fontSize:'16px',height:240}];saveData();openStickyNotes();});await shot('notas');
 await page.evaluate(()=>{closeModal();openSettingsForm();document.querySelector('[data-settings-target="settings-appearance"]').click();});await shot('ajustes-aspecto');
 await page.evaluate(entries=>{closeModal();openRepositoryImport({source:'https://www.techcompare.app/',items:entries.slice(-3),selected:new Set(),notice:'Resultados públicos de demostración · sin iniciar un escaneo'});},catalog);await shot('importador');
 await page.evaluate(()=>{closeModal();openRepositoryReadingSetup('https://www.techcompare.app/',()=>openWidgetLibrary());});await shot('configurar-lectura');
 await page.evaluate(()=>{closeModal();addToTrash('bookmark','Enlace de demostración',{bookmark:{id:'demo-trash',name:'Enlace de demostración',url:'https://example.org/eliminado',categoryId:null}});openTrash();});await shot('papelera');
 const popup=await context.newPage();await popup.setViewportSize({width:420,height:900});await popup.goto(`chrome-extension://${new URL(worker.url()).host}/popup.html`);await popup.evaluate(async()=>{await document.fonts.ready;document.getAnimations().forEach(a=>a.finish());});await popup.screenshot({path:path.join(out,'panel-lateral.png')});await popup.close();
 measurements.screenshots='Pantallas reales; favoritos, notas, proyectos, tareas, papelera y auditoría con ejemplos ficticios. Servicios externos bloqueados.';measurements.errors=failures;measurements.date=new Date().toISOString();
 fs.mkdirSync(path.join(root,'test-results/public-captures'),{recursive:true});fs.writeFileSync(path.join(root,'test-results/public-captures/results.json'),JSON.stringify(measurements,null,2));
 if(failures.length)throw Error(failures.join('\n'));console.log(JSON.stringify(measurements));
 }finally{await context.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
