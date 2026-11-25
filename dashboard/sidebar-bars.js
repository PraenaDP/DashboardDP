const MAX_SIDEBARS=9;
const preparedSidebarData=new WeakSet();
function ensureSidebarBars(data){
 if(preparedSidebarData.has(data))return false;
 if(!data.settings)data.settings={};if(!Array.isArray(data.panelCustomBlocks))data.panelCustomBlocks=[];
 let changed=false;
 if(!Array.isArray(data.sidebars)||!data.sidebars.length){
  if(!data.panelCustomBlocks.length&&Array.isArray(data.customWidgets)&&data.customWidgets.length){data.panelCustomBlocks=data.customWidgets.map(widget=>({...widget,type:'iframe'}));data.settings.panelMode='custom';}
  const legacy=data.panelCustomBlocks.some(block=>block.type!=='notes');
  data.sidebars=[{id:'bar-1',name:'General',kind:'default',layouts:{}},{id:'bar-2',name:'Notas',kind:'custom',layouts:{}}];
  if(legacy)data.sidebars.push({id:'bar-3',name:'Personal',kind:'custom',layouts:{sidebar:data.settings.panelCustomLayout||'stack',expanded:data.settings.panelCustomLayout||'stack',...(data.settings.panelCustomLayouts||{})}});
  data.panelCustomBlocks.forEach(block=>{block.barId=block.type==='notes'?'bar-2':legacy?'bar-3':'bar-2';});
  if(!data.panelCustomBlocks.some(block=>block.barId==='bar-2'&&block.type==='notes'))data.panelCustomBlocks.push({id:uid(),barId:'bar-2',type:'notes',title:'',height:320,order:0,createdAt:Date.now()});
  data.settings.activeSidebarId=data.settings.panelMode==='custom'&&legacy?'bar-3':'bar-1';changed=true;
 }
 const used=new Set();data.sidebars=data.sidebars.filter(bar=>bar&&typeof bar.id==='string'&&!used.has(bar.id)&&used.add(bar.id)).slice(0,MAX_SIDEBARS).map((bar,index)=>({...bar,name:String(bar.name||'Barra '+(index+1)).slice(0,60),kind:index===0?'default':'custom',layouts:{sidebar:'stack',expanded:'stack',...(bar.layouts&&typeof bar.layouts==='object'?bar.layouts:{})}}));
 const valid=new Set(data.sidebars.map(bar=>bar.id));
 data.panelCustomBlocks.forEach(block=>{if(!valid.has(block.barId)){block.barId=data.sidebars.at(-1).id;changed=true;}});
 if(!valid.has(data.settings.activeSidebarId)){data.settings.activeSidebarId=data.sidebars[0].id;changed=true;}
 const fixedBlocks=data.panelCustomBlocks.filter(block=>block.barId===data.sidebars[0].id);
 if(fixedBlocks.length){let destination=data.sidebars[2];if(!destination&&data.sidebars.length<9){destination={id:uid(),name:'Widgets conservados',kind:'custom',layouts:{sidebar:'stack',expanded:'stack'}};data.sidebars.push(destination);}destination=destination||data.sidebars[1];fixedBlocks.forEach(block=>block.barId=destination.id);changed=true;}
 preparedSidebarData.add(data);return changed;
}
function sidebarBars(){ensureSidebarBars(state.data);return state.data.sidebars;}
function activeSidebar(){return sidebarBars().find(bar=>bar.id===state.data.settings.activeSidebarId)||sidebarBars()[0];}
function selectSidebar(id){if(!sidebarBars().some(bar=>bar.id===id))return;state.data.settings.activeSidebarId=id;saveData();renderPanel();}
function createSidebar(){
 const bars=sidebarBars();if(bars.length>=MAX_SIDEBARS){toast('Puedes crear hasta 9 barras.','info');return;}
 const bar={id:uid(),name:'Barra '+(bars.length+1),kind:'custom',layouts:{}};bars.push(bar);selectSidebar(bar.id);
 document.querySelector('.sidebar-name-input')?.focus();document.querySelector('.sidebar-name-input')?.select();
}
function confirmDeleteSidebar(id){
 const bars=sidebarBars(),index=bars.findIndex(bar=>bar.id===id);if(index<2)return;
 const bar=bars[index],count=state.data.panelCustomBlocks.filter(block=>block.barId===id).length;
 const modal=el('div',{class:'modal',role:'alertdialog'});
 modal.append(el('div',{class:'modal-header'},[el('h2',{class:'modal-title',text:'Eliminar barra'}),el('button',{class:'modal-close',text:'×','aria-label':'Cerrar',onclick:closeModal})]),el('div',{class:'modal-body'},[el('p',{text:`¿Eliminar «${bar.name}» y sus ${count} bloques? Los widgets de la biblioteca y las notas originales no se eliminan. Las otras barras se mantienen.`})]),el('div',{class:'modal-footer'},[el('button',{class:'btn',text:'Cancelar',onclick:closeModal}),el('button',{class:'btn danger',text:'Eliminar barra',onclick:()=>{if(sidebarBars().findIndex(item=>item.id===id)<2)return;state.data.panelCustomBlocks=state.data.panelCustomBlocks.filter(block=>block.barId!==id);state.data.sidebars=sidebarBars().filter(item=>item.id!==id);state.data.settings.activeSidebarId=state.data.sidebars[Math.min(index-1,state.data.sidebars.length-1)].id;saveData();closeModal();renderPanel();}})]));openModal(modal);
}
function renderSidebarSwitcher(){
 const current=activeSidebar(),bars=sidebarBars();els.panelModeControl.classList.add('multi-sidebar-control');els.panelModeLabel.textContent='';
 const tabs=el('div',{class:'sidebar-bar-tabs',role:'tablist','aria-label':'Barras laterales'});
 bars.forEach((bar,index)=>tabs.append(el('button',{type:'button',role:'tab','aria-selected':String(bar.id===current.id),class:'sidebar-bar-tab'+(bar.id===current.id?' active':''),text:String(index+1),title:bar.name,'aria-label':'Barra '+(index+1)+': '+bar.name,onclick:()=>selectSidebar(bar.id)})));
 tabs.append(el('button',{type:'button',class:'sidebar-bar-create',text:'+',title:'Crear barra','aria-label':'Crear barra',disabled:bars.length>=MAX_SIDEBARS,onclick:createSidebar}));
 tabs.addEventListener('wheel',event=>{if(tabs.scrollWidth<=tabs.clientWidth)return;event.preventDefault();tabs.scrollLeft+=event.deltaY||event.deltaX;},{passive:false});
 tabs.addEventListener('keydown',event=>{const buttons=[...tabs.querySelectorAll('[role=tab]')],index=buttons.indexOf(document.activeElement);if(index<0||!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;event.preventDefault();const next=event.key==='Home'?0:event.key==='End'?buttons.length-1:(index+(event.key==='ArrowRight'?1:-1)+buttons.length)%buttons.length;buttons[next].click();const selected=document.querySelectorAll('.sidebar-bar-tab')[next];selected?.focus();selected?.scrollIntoView({block:'nearest',inline:'nearest'});});
 const name=el('input',{class:'sidebar-name-input',type:'text',maxlength:'60',value:current.name,'aria-label':'Nombre de la barra',title:'Escribe el nombre de esta barra'});
 name.readOnly=current.kind==='default';
 name.oninput=()=>{current.name=name.value.slice(0,60);saveData();const selected=tabs.querySelector('[aria-selected=true]');if(selected)selected.title=current.name;};
 name.onchange=()=>{if(!name.value.trim()){current.name='Barra '+(bars.indexOf(current)+1);name.value=current.name;saveData();}};
 const nameRow=el('div',{class:'sidebar-name-row'},[name]);
 if(current.kind!=='default')nameRow.append(el('button',{class:'icon-btn element-menu-trigger sidebar-options',type:'button',html:ICONS.more,title:'Opciones de la barra','aria-label':'Opciones de la barra','aria-haspopup':'menu',onclick:event=>{
   const actions=[{label:'Editar nombre',icon:ICONS.edit,fn:()=>{name.focus();name.select();}},{label:'Añadir widget',icon:ICONS.plus,fn:openPanelBlockPicker}];
   [['stack','Vista vertical'],['grid','Cuadrícula'],['masonry','Mosaico manual']].forEach(([value,label])=>actions.push({label:(getPanelCustomLayout()===value?'✓ ':'')+label,icon:ICONS.grid,fn:()=>{const key=els.panel.classList.contains('expanded')?'expanded':'sidebar';current.layouts[key]=value;saveData();renderPanel();}}));
   if(getPanelCustomLayout()==='masonry')actions.push({label:'Restablecer distribución',icon:ICONS.reset,fn:resetPanelManualLayout});
   if(current.id===bars[1].id)actions.push({label:t('stickyNotes'),icon:ICONS.edit,fn:openStickyNotes});
   if(bars.indexOf(current)>=2)actions.push({label:'Eliminar barra',icon:ICONS.trash,danger:true,fn:()=>confirmDeleteSidebar(current.id)});
   openElementActions(event.currentTarget,actions,current.name);
 }}));
 els.panelModeLabel.append(tabs,nameRow);els.panelModeBtn.classList.add('hidden');els.panelModeBtn.hidden=true;
 requestAnimationFrame(()=>tabs.querySelector('[aria-selected=true]')?.scrollIntoView({block:'nearest',inline:'nearest'}));
}
function sidebarWidgetLocations(entry){
 return sidebarBars().filter(bar=>state.data.panelCustomBlocks.some(block=>block.barId===bar.id&&block.type==='iframe'&&(block.libraryEntryId===entry.id||repositoryWidgetKey(block.url)===repositoryWidgetKey(entry.url))));
}
function chooseWidgetSidebar(onChoose,entry=null){
 const bars=sidebarBars(),select=el('select',{class:'form-select','aria-label':'Barra de destino'});
 bars.forEach((bar,index)=>{const blocks=state.data.panelCustomBlocks.filter(block=>block.barId===bar.id),present=entry&&(entry.nativeType?(blocks.some(block=>block.type===entry.nativeType)||bar.kind==='default'&&['recent','stats','tools'].includes(entry.nativeType)):sidebarWidgetLocations(entry).some(location=>location.id===bar.id));select.append(el('option',{value:bar.id,text:`${index+1} · ${bar.name}${bar.kind==='default'?' · Barra fija':present?' · Ya añadido':''}`,disabled:bar.kind==='default'||present||blocks.length>=MAX_CUSTOM_PANEL_BLOCKS}));});
 const available=[...select.options].filter(option=>!option.disabled);select.value=available.some(option=>option.value===activeSidebar().id)?activeSidebar().id:available[0]?.value||'';
 const modal=el('div',{class:'modal',role:'dialog'});modal.append(el('div',{class:'modal-header'},[el('h2',{class:'modal-title',text:'Elegir barra de destino'}),el('button',{class:'modal-close',text:'×','aria-label':'Cerrar',onclick:openWidgetLibrary})]),el('div',{class:'modal-body'},[el('p',{text:entry?.title||'Agregar bloque'}),select]),el('div',{class:'modal-footer'},[el('button',{class:'btn',text:'Cancelar',onclick:openWidgetLibrary}),el('button',{class:'btn primary',text:'Agregar',disabled:!available.length,onclick:()=>onChoose(select.value)})]));openModal(modal);
}
