const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..'),out=path.join(root,'test-results','popup');fs.mkdirSync(out,{recursive:true});
(async()=>{
 const context=await chromium.launchPersistentContext(fs.mkdtempSync(path.join(require('node:os').tmpdir(),'dashboard-popup-')),{executablePath:process.env.DASHBOARD_TEST_BROWSER,headless:true,args:[`--disable-extensions-except=${root}`,`--load-extension=${root}`]});
 try{
  await context.route(/^https?:/,route=>route.abort());
  const worker=context.serviceWorkers()[0]||await context.waitForEvent('serviceworker');
  assert.equal(await worker.evaluate(async()=> (await chrome.sidePanel.getPanelBehavior()).openPanelOnActionClick),true);
  const page=await context.newPage(),errors=[];await page.setViewportSize({width:420,height:900});page.on('pageerror',error=>errors.push(error.message));
  const url=`chrome-extension://${new URL(worker.url()).host}/popup.html`;
  await page.goto(url);const tabs=context.pages().length,browserTabs=await worker.evaluate(async()=>(await chrome.tabs.query({})).length);
  const data={settings:{language:'es',skin:'catppuccin',theme:'dark'},bookmarks:[{id:'a',name:'Favorito suelto',url:'https://example.org/a',pinned:true},{id:'b',name:'Estudio de prueba',url:'https://example.org/b',pinned:true},{id:'c',name:'Referencia de trabajo',url:'https://example.org/c',pinned:false},{id:'x',name:'Inseguro',url:'javascript:alert(1)',pinned:true}],quickGroups:[{id:'g',name:'Estudio',color:'#ad82dc',bookmarkIds:['b']}],workspaces:[{id:'w',name:'Trabajo diario',color:'#4ac8b0',bookmarkIds:['b','c']}]};
  await page.evaluate(data=>localStorage.setItem('dashboard_favorites_v2',JSON.stringify(data)),data);await page.reload();
  assert.equal(context.pages().length,tabs);assert.equal(await page.getByRole('heading',{name:'Fijados',exact:true}).count(),1);
  const darkIconFilter=await page.locator('.popup-bookmark img').first().evaluate(element=>getComputedStyle(element).filter);
  assert.ok(await page.locator('.popup-bookmark img').evaluateAll(images=>images.length>0&&images.every(image=>Number(new URL(image.src).searchParams.get('size'))>=64)));
  assert.equal(await page.locator('details').count(),2);assert.equal(await page.getByRole('link',{name:'Inseguro'}).count(),0);
  await page.locator('summary').filter({hasText:'Estudio'}).click();assert.ok(await page.getByRole('link',{name:'Estudio de prueba',exact:true}).first().isVisible());
  await page.locator('#search').fill('Referencia');assert.equal(await page.locator('details').count(),1);assert.ok(await page.getByRole('link',{name:'Referencia de trabajo'}).isVisible());
  assert.equal(await page.evaluate(()=>localStorage.getItem('dashboard_favorites_v2')),JSON.stringify(data));
  await page.locator('#search').fill('');await page.locator('details').filter({hasText:'Trabajo diario'}).evaluate(element=>element.open=true);
  for(const [name,mode]of [['Iconos','icon'],['Lista','list'],['Tarjetas','cards']]){
   await page.getByRole('button',{name,exact:true}).click();assert.equal(await page.locator('#collections').getAttribute('data-view'),mode);
   assert.equal(await page.getByRole('button',{name,exact:true}).getAttribute('aria-pressed'),'true');
   if(mode==='icon'){
    const link=page.getByRole('link',{name:'Favorito suelto',exact:true});await link.hover();
    assert.ok(await link.evaluate(element=>getComputedStyle(element).backgroundColor==='rgba(0, 0, 0, 0)'&&getComputedStyle(element.querySelector('img')).filter!=='none'));
   }
   assert.ok(await page.getByRole('link',{name:'Referencia de trabajo',exact:true}).isVisible());
   await page.screenshot({path:path.join(out,'view-'+mode+'.png')});
  }
  await page.reload();assert.equal(await page.locator('#collections').getAttribute('data-view'),'cards');
  assert.equal(await page.evaluate(()=>localStorage.getItem('dashboard_favorites_v2')),JSON.stringify(data));
  for(const width of [300,420,800]){await page.setViewportSize({width,height:900});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));}
  await page.setViewportSize({width:420,height:900});await page.locator('details').filter({hasText:'Trabajo diario'}).evaluate(element=>element.open=true);
  await page.screenshot({path:path.join(out,'popup.png')});
  await page.getByRole('button',{name:'Abrir espacio completo'}).click();await page.waitForFunction(()=>document.getElementById('status').textContent==='Espacio abierto.');
  assert.equal(await worker.evaluate(async()=>(await chrome.tabs.query({})).length),browserTabs+2);
  await page.evaluate(()=>{const d=JSON.parse(localStorage.getItem('dashboard_favorites_v2'));d.settings.language='en';d.settings.theme='light';localStorage.setItem('dashboard_favorites_v2',JSON.stringify(d));});await page.reload();
  assert.equal(await page.getByRole('heading',{name:'Workspaces'}).count(),1);assert.ok(await page.locator('body').evaluate(node=>node.classList.contains('light')));
  const lightIconFilter=await page.locator('.popup-bookmark img').first().evaluate(element=>getComputedStyle(element).filter);
  assert.notEqual(darkIconFilter,lightIconFilter);assert.ok(lightIconFilter.includes('0, 0, 0'));assert.ok(darkIconFilter.includes('255, 255, 255'));
  await page.evaluate(()=>{
   for(const [id,color,opaque]of [['white-logo','#fff',false],['black-logo','#000',false],['color-logo','#09f',false],['tile-logo','#000',true]]){
    const canvas=document.createElement('canvas');canvas.width=canvas.height=32;const ctx=canvas.getContext('2d');if(opaque){ctx.fillStyle='#fff';ctx.fillRect(0,0,32,32);}ctx.fillStyle=color;ctx.fillRect(8,4,16,24);
    const image=document.createElement('img');image.id=id;image.className='favicon-image';image.src=canvas.toDataURL();document.querySelector('main').append(image);
   }
  });
  await page.waitForFunction(()=>document.getElementById('white-logo').dataset.faviconTone==='light'&&document.getElementById('black-logo').dataset.faviconTone==='dark');
  assert.ok(await page.locator('#white-logo').evaluate(image=>getComputedStyle(image).filter.includes('brightness(0.18)')));
  assert.equal(await page.locator('#color-logo').getAttribute('data-favicon-tone'),null);assert.equal(await page.locator('#tile-logo').getAttribute('data-favicon-tone'),null);
  await page.evaluate(()=>document.body.classList.remove('light'));
  assert.ok(await page.locator('#black-logo').evaluate(image=>getComputedStyle(image).filter.includes('invert(1)')));
  assert.ok(await page.locator('#white-logo').evaluate(image=>!getComputedStyle(image).filter.includes('brightness(0.18)')));
  await page.evaluate(()=>{document.body.classList.add('light');for(const id of ['white-logo','black-logo','color-logo','tile-logo'])document.getElementById(id).remove();});
  await page.evaluate(()=>{const button=document.createElement('button');button.id='dashboard-icon-test';button.className='icon-item';const wrap=document.createElement('span');wrap.className='icon-item-favicon';const icon=document.createElement('span');icon.className='favicon-fallback';icon.textContent='A';wrap.append(icon);button.append(wrap);document.querySelector('main').prepend(button);});
  const mainIcon=page.locator('#dashboard-icon-test');await mainIcon.hover();
  assert.ok(await mainIcon.evaluate(element=>{const wrap=element.querySelector('.icon-item-favicon');return getComputedStyle(element).transform==='none'&&getComputedStyle(element).backgroundColor==='rgba(0, 0, 0, 0)'&&getComputedStyle(wrap).backgroundColor==='rgba(0, 0, 0, 0)'&&getComputedStyle(wrap.firstChild).filter!=='none';}));
  assert.deepEqual(errors,[]);console.log('OK: panel sin pestaña automática; iconos/lista/tarjetas, persistencia, anchuras 300/420/800, datos intactos, búsqueda, grupos y es/en.');
 }finally{await context.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
