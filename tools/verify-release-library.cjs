/* Verificación del catálogo público completo: perfil desechable, sin red. */
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),assert=require('node:assert/strict');
const {chromium}=require('playwright');
const root=path.resolve(process.argv[3]||path.join(__dirname,'..')),catalog=JSON.parse(fs.readFileSync(process.argv[2],'utf8')).entries;
(async()=>{
 const context=await chromium.launchPersistentContext(fs.mkdtempSync(path.join(os.tmpdir(),'dashboarddp-library-check-')),{executablePath:process.env.DASHBOARD_TEST_BROWSER,headless:true,args:[`--disable-extensions-except=${root}`,`--load-extension=${root}`]});
 try{
 await context.route(/^https?:/,route=>route.abort());const worker=context.serviceWorkers()[0]||await context.waitForEvent('serviceworker');const page=await context.newPage();
 await page.goto(`chrome-extension://${new URL(worker.url()).host}/dashboard/index.html`);await page.waitForFunction(()=>typeof state!=='undefined'&&state.data);await page.getByRole('button',{name:'Empezar de cero',exact:true}).click();
 if(process.argv[3])assert.equal(await page.evaluate(()=>widgetLibrary().length),catalog.length,'El paquete debe instalar el catálogo público completo en un perfil nuevo.');
 const result=await page.evaluate(async entries=>{
  state.data.widgetLibrary=entries.map((entry,index)=>({...entry,id:'release-test-'+index,createdAt:1,updatedAt:1,favorite:index===0}));saveData();
  const fields=['catalogId','title','description','widgetType','url','width','height','embedCode','translations','translationSource'];
  const project=library=>library.map(entry=>Object.fromEntries(fields.map(field=>[field,entry[field]])));
  const before=JSON.stringify(project(widgetLibrary())),backup=fullBackupEnvelope(),serialized=JSON.stringify(backup);
  await restoreFullBackup(JSON.parse(serialized));
  const restored=before===JSON.stringify(project(widgetLibrary()));
  let quotaHeadroomCharacters=0,quotaReached=false;try{for(let size=131072;size<=10485760;size+=131072){localStorage.setItem('release-quota-probe','x'.repeat(size));quotaHeadroomCharacters=size;}}catch(error){if(error.name!=='QuotaExceededError')throw error;quotaReached=true;}finally{localStorage.removeItem('release-quota-probe');}
  const start=performance.now();openWidgetLibrary();const openMs=performance.now()-start;
  return {widgets:widgetLibrary().length,restored,backupBytes:new Blob([serialized]).size,quotaHeadroomCharacters,quotaReached,openMs,loadedIframes:document.querySelectorAll('iframe').length,favoritePreserved:widgetLibrary()[0].favorite===true};
 },catalog);
 assert.equal(result.widgets,catalog.length);assert.equal(result.restored,true);assert.equal(result.favoritePreserved,true);assert.equal(result.loadedIframes,0);assert.equal(result.quotaReached,true);assert.ok(result.quotaHeadroomCharacters>131072);
 await page.reload();await page.waitForFunction(()=>state.data);assert.equal(await page.evaluate(()=>widgetLibrary().length),catalog.length);
 result.reloadPassed=true;result.scope='Brave aislado; catálogo real, copia/restauración JSON, cuota localStorage efectiva. No mide un equipo de 8 GB ni servicios externos.';
 fs.mkdirSync(path.join(root,'test-results/release-library'),{recursive:true});fs.writeFileSync(path.join(root,'test-results/release-library/results.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(result));
 }finally{await context.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
