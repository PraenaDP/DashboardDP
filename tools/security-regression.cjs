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
   state.data.bookmarks[0].pinned=true;saveData();renderAll();closeModal();
  });
  const checkbox=page.locator('.panel-note-preview input[data-markdown-task="0"]').first();
  await checkbox.check();
  check('Visible note task checkbox is interactive',await page.evaluate(()=>state.data.stickyNotes[0].markdown.includes('- [x] Pending')));
  await page.reload();await page.waitForFunction(()=>state.data?.stickyNotes.length===1);
  await page.getByRole('button',{name:'Empezar de cero',exact:true}).click();
  await page.waitForFunction(()=>state.data.settings.nativeBookmarkMode);
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
  await page.screenshot({path:path.join(output,'help.png'),fullPage:true});
  await page.evaluate(()=>openBookmarkAudit(Array.from({length:170},(_,i)=>({bookmarkId:`test-${i}`,name:`Test ${i}`,url:'https://example.invalid',category:'Test',status:i%2?'missing':'available',detail:'Synthetic response',httpStatus:i%2?404:200}))));
  await settleModal();
  check('Audit renders initial 160 results',await page.locator('.bookmark-audit-row').count()===160);
  await page.locator('.bookmark-audit-more').click();
  check('Audit loads next results on request',await page.locator('.bookmark-audit-row').count()===170);
  check('Available audit results are not deletable',await page.locator('.bookmark-audit-row:not(.candidate) input:not(:disabled)').count()===0);
  check('No uncaught page errors during tested flows',errors.length===0,errors);
  const bg=await worker.evaluate(()=>({sender:!isTrustedDashboardSender({id:'other'})&&!isTrustedDashboardSender({id:api.runtime.id,url:'https://example.invalid'})&&isTrustedDashboardSender({id:api.runtime.id,url:api.runtime.getURL('dashboard/index.html')}),oauth:!validCalendarAuthUrl('https://example.invalid')&&validCalendarAuthUrl('https://accounts.google.com/o/oauth2/v2/auth'),id:!validReminderId('__proto__')}));
  check('Background validates message sender, OAuth destination and reminder IDs',bg.sender&&bg.oauth&&bg.id);
 } catch(e){check('Test runner completed',false,e.stack);} finally {
  await context.close();
  fs.writeFileSync(path.join(output,'results.json'),JSON.stringify({date:new Date().toISOString(),checks},null,2));
  process.exitCode=checks.some(c=>!c.passed)?1:0;
 }
})().catch(e=>{console.error(e);process.exitCode=1});
