/* Vista exclusiva de eventos: nunca muestra el tablero de tareas. */
let eventViewDate = new Date();
let eventViewMode = 'month';
const CALENDAR_SYSTEMS=[['gregory','Gregoriano'],['chinese','Chino'],['hebrew','Hebreo'],['islamic-civil','Islámico civil'],['persian','Persa'],['buddhist','Budista']];
const calendarYearCache=new Map();
let sidebarCalendarDate=null;
function calendarSystem(){return CALENDAR_SYSTEMS.some(([id])=>id===state.data.settings.calendarSystem)?state.data.settings.calendarSystem:'gregory';}
function calendarFormat(date,options={year:'numeric',month:'long',day:'numeric'}){return new Intl.DateTimeFormat(getLocale(),{...options,calendar:calendarSystem()}).format(date);}
function calendarDayAfter(date,amount){const result=new Date(date);result.setDate(result.getDate()+amount);result.setHours(12,0,0,0);return result;}
function calendarYearModel(date){
  const system=calendarSystem(),formatter=new Intl.DateTimeFormat('en-US-u-nu-latn',{calendar:system,year:'numeric',month:'long',day:'numeric',era:'short'});
  const read=value=>{const p=Object.fromEntries(formatter.formatToParts(value).map(part=>[part.type,part.value]));return {year:(p.era||'')+':'+(p.relatedYear||p.year),month:p.month,day:Number(p.day)};};
  const selected=read(date),key=system+':'+selected.year+':'+getLocale();if(calendarYearCache.has(key))return calendarYearCache.get(key);
  let start=calendarDayAfter(date,0);for(let i=0;i<400;i++){const previous=calendarDayAfter(start,-1);if(read(previous).year!==selected.year)break;start=previous;}
  const months=[];let current=calendarDayAfter(start,0);
  for(let i=0;i<400;i++){const parts=read(current);if(parts.year!==selected.year)break;let month=months[months.length-1];if(!month||month.key!==parts.month){month={key:parts.month,start:new Date(current),label:calendarFormat(current,{month:'long',year:'numeric'}),days:[]};months.push(month);}month.days.push({date:new Date(current),day:parts.day});current=calendarDayAfter(current,1);}
  const result={months,start,end:calendarDayAfter(current,-1)};calendarYearCache.set(key,result);if(calendarYearCache.size>16)calendarYearCache.delete(calendarYearCache.keys().next().value);return result;
}
function calendarMonthFor(date){return calendarYearModel(date).months.find(month=>month.days.some(day=>day.date.toDateString()===date.toDateString()));}
function shiftCalendarDate(date,amount,unit){const model=calendarYearModel(date),month=calendarMonthFor(date);return unit==='year'?calendarDayAfter(amount>0?model.end:model.start,amount>0?1:-1):calendarDayAfter(amount>0?month.days[month.days.length-1].date:month.start,amount>0?1:-1);}
function renderSystemSidebar(){
  if(!sidebarCalendarDate)sidebarCalendarDate=new Date();
  const month=calendarMonthFor(sidebarCalendarDate);els.calTitle.textContent=month.label;els.calGrid.replaceChildren();
  for(let i=0;i<7;i++)els.calGrid.append(el('div',{class:'cal-dow',text:new Date(2024,0,1+i).toLocaleDateString(getLocale(),{weekday:'short'}).slice(0,2)}));
  for(let i=0;i<(month.start.getDay()+6)%7;i++)els.calGrid.append(el('span'));
  const counts=new Map();calendarEventsOnly().forEach(event=>{const key=taskDateKey(event.dueAt);counts.set(key,(counts.get(key)||0)+1);});
  month.days.forEach(({date,day})=>{const count=counts.get(taskDateKey(date.getTime()))||0,button=el('button',{class:'cal-day'+(date.toDateString()===new Date().toDateString()?' today':'')+(count?' has-tasks':''),text:String(day),'aria-label':calendarFormat(date),onclick:()=>openCalendarManager('day',date)});if(count)button.append(el('span',{class:'cal-task-dot',text:String(count)}));els.calGrid.append(button);});
  const open=document.getElementById('calOpenFull');if(open)open.onclick=()=>openCalendarManager('year',sidebarCalendarDate);
}
function mayaLongCount(date){let days=1872000+Math.round((Date.UTC(date.getFullYear(),date.getMonth(),date.getDate())-Date.UTC(2012,11,21))/86400000);return [144000,7200,360,20,1].map(unit=>{const value=Math.floor(days/unit);days-=value*unit;return value;}).join('.');}
function openMayaCalendar(year=new Date().getFullYear()){
  const modal=el('div',{class:'modal calendar-fullscreen'}),body=el('div',{class:'modal-body'}),grid=el('div',{class:'event-grid year'});
  body.append(el('p',{text:'Vista de curiosidad: año gregoriano con equivalencias en la Cuenta Larga maya (correlación GMT). No cambia tu calendario ni tus eventos.'}),el('a',{href:'https://maya.nmai.si.edu/calendar/calendar-system',target:'_blank',rel:'noopener noreferrer',text:'Referencia: Smithsonian — El sistema de calendario maya'}),el('div',{class:'task-manager-toolbar'},[el('button',{class:'btn',text:'‹',onclick:()=>openMayaCalendar(year-1)}),el('strong',{text:String(year)}),el('button',{class:'btn',text:'›',onclick:()=>openMayaCalendar(year+1)})]));
  for(let m=0;m<12;m++){const section=el('section',{class:'event-year-month'}),days=el('div',{class:'event-month-days compact'});section.append(el('h3',{text:new Date(year,m,1).toLocaleDateString(getLocale(),{month:'long'})}));for(let i=0;i<(new Date(year,m,1).getDay()+6)%7;i++)days.append(el('span'));for(let d=1;d<=new Date(year,m+1,0).getDate();d++){const date=new Date(year,m,d);days.append(el('button',{class:'event-date-button'+(date.toDateString()===new Date().toDateString()?' today':''),text:String(d),title:mayaLongCount(date),onclick:()=>toast(date.toLocaleDateString(getLocale())+' · '+mayaLongCount(date))}));}section.append(days);grid.append(section);}
  body.append(grid);modal.append(el('div',{class:'modal-header'},[el('h2',{class:'modal-title',text:'Cuenta Larga maya · '+year}),el('button',{class:'modal-close',text:'×','aria-label':'Cerrar',onclick:()=>openCalendarManager()})]),body);openModal(modal);
}
async function calendarHolidayPermission() {
  const api=globalThis.browser||globalThis.chrome;
  if(api?.permissions){const origins=['https://nagerholidays.com/*'];if(await api.permissions.contains({origins}))return;if(!await api.permissions.request({origins}))throw Error('No se autorizó la consulta de festividades.');}
}
async function fetchHolidayData(path) {
  const response=await fetch('https://nagerholidays.com/api/v4/'+path,{credentials:'omit',referrerPolicy:'no-referrer',signal:AbortSignal.timeout(15000)});
  if(!response.ok)throw Error('El servicio de festividades no está disponible.');
  const data=await response.json();if(!Array.isArray(data))throw Error('Respuesta de festividades no válida.');return data;
}
async function loadCalendarHolidays(country,year) {
  await calendarHolidayPermission();
  if(!/^[A-Z]{2}$/.test(country)||!Number.isInteger(year))throw Error('País o año inválido.');
  const raw=await fetchHolidayData(`Holidays/${country}/${year}`);
  const data=raw.map(h=>({...h,global:h.nationalHoliday,counties:h.subdivisionCodes,localName:h.localName||h.name}));
  const cache=state.data.settings.holidayCache||{};cache[country+'-'+year]=data.filter(h=>/^\d{4}-\d{2}-\d{2}$/.test(h.date));
  while(Object.keys(cache).length>6)delete cache[Object.keys(cache)[0]];
  state.data.settings.holidayCache=cache;saveData();return data;
}
function openHolidaySettings(year) {
  const country=el('select',{class:'form-select','aria-label':'País'}),region=el('select',{class:'form-select','aria-label':'Región'}),status=el('p',{class:'form-hint',text:'Consulta opcional a Nager.Date: solo se envían el país y el año, además de los datos de conexión habituales. No se envían tus eventos. No incluye santoral ni todos los festivos municipales.'});
  country.append(el('option',{value:'',text:'Sin festividades'}));region.append(el('option',{value:'',text:'Solo festividades nacionales'}));
  if(state.data.settings.holidayCountry){country.append(el('option',{value:state.data.settings.holidayCountry,text:state.data.settings.holidayCountry}));country.value=state.data.settings.holidayCountry;}
  if(state.data.settings.holidayRegion){region.append(el('option',{value:state.data.settings.holidayRegion,text:state.data.settings.holidayRegion}));region.value=state.data.settings.holidayRegion;}
  let data=[];
  country.onchange=async()=>{region.replaceChildren(el('option',{value:'',text:'Solo festividades nacionales'}));if(!country.value)return;try{data=await loadCalendarHolidays(country.value,year);[...new Set(data.flatMap(h=>h.counties||[]))].sort().forEach(code=>region.append(el('option',{value:code,text:code})));region.value=state.data.settings.holidayRegion||'';status.textContent='Festividades cargadas. Las regiones se identifican por su código oficial.';}catch(error){status.textContent=error.message;}};
  const load=el('button',{class:'btn secondary',text:'Consultar países disponibles',onclick:async()=>{load.disabled=true;status.textContent='Consultando países…';try{await calendarHolidayPermission();const raw=await fetchHolidayData('Countries/Available');const countries=raw.map(item=>({countryCode:item.countryCode||item.code})).filter(item=>/^[A-Z]{2}$/.test(item.countryCode));if(!countries.length)throw Error('El servicio no devolvió países válidos.');const names=new Intl.DisplayNames([getLocale()],{type:'region'});country.replaceChildren(el('option',{value:'',text:'Sin festividades'}));countries.sort((a,b)=>names.of(a.countryCode).localeCompare(names.of(b.countryCode),getLocale())).forEach(item=>country.append(el('option',{value:item.countryCode,text:names.of(item.countryCode)})));country.value=state.data.settings.holidayCountry||'';status.textContent=`${countries.length} países disponibles. Selecciona uno para cargar sus festividades.`;if(country.value)await country.onchange();}catch(error){status.textContent='No se pudo consultar: '+error.message;load.disabled=false;}}});
  const modal=el('div',{class:'modal'});modal.append(el('div',{class:'modal-header'},[el('h2',{class:'modal-title',text:'Festividades por país'}),el('button',{class:'modal-close',text:'×','aria-label':'Cerrar',onclick:()=>openCalendarManager()})]),el('div',{class:'modal-body'},[status,load,el('label',{text:'País'}),country,el('label',{text:'Región'}),region]),el('div',{class:'modal-footer'},[el('button',{class:'btn',text:'Cancelar',onclick:()=>openCalendarManager()}),el('button',{class:'btn primary',text:'Guardar',onclick:()=>{state.data.settings.holidayCountry=country.value;state.data.settings.holidayRegion=region.value;saveData();openCalendarManager();}})]));openModal(modal);
}
function calendarEventsOnly() { return tasks().filter(x=>x.kind==='calendar-event'||x.calendarTarget?.provider); }
function openCalendarManager(initialMode, initialDate) {
  if(['year','month','week','day'].includes(initialMode))eventViewMode=initialMode;
  if(initialDate instanceof Date)eventViewDate=new Date(initialDate);
  const modal=el('div',{class:'modal calendar-fullscreen',role:'dialog','aria-label':'Calendario de eventos'});
  const body=el('div',{class:'modal-body'}), area=el('div',{class:'event-calendar-area'}), toolbar=el('div',{class:'task-manager-toolbar'});
  const change=d=>{if(eventViewMode==='year'||eventViewMode==='month')eventViewDate=shiftCalendarDate(eventViewDate,d,eventViewMode);else eventViewDate.setDate(eventViewDate.getDate()+d*(eventViewMode==='week'?7:1));render();};
  toolbar.append(el('button',{class:'btn',text:'‹',onclick:()=>change(-1)}),el('button',{class:'btn',text:'Hoy',onclick:()=>{eventViewDate=new Date();render();}}),el('button',{class:'btn',text:'›',onclick:()=>change(1)}));
  const select=el('select',{class:'form-select event-view-select','aria-label':'Vista del calendario'});
  [['day','Diaria por horas'],['week','Semanal por horas'],['month','Mensual'],['year','Anual']].forEach(([value,text])=>select.append(el('option',{value,text})));select.value=eventViewMode;select.onchange=()=>{eventViewMode=select.value;render();};
  toolbar.append(select,el('button',{class:'btn primary',text:'Nuevo evento',onclick:()=>openCalendarEventForm(null)}),el('button',{class:'btn secondary',text:'Conexiones y sincronización',onclick:()=>{const m=el('div',{class:'modal calendar-connections-modal',role:'dialog','aria-label':'Conexiones de calendarios'});m.append(el('div',{class:'modal-header'},[el('h2',{class:'modal-title',text:'Elegir y conectar calendarios'}),el('button',{class:'modal-close',text:'×','aria-label':'Cerrar',onclick:()=>openCalendarManager()})]),el('div',{class:'modal-body'},[buildCalendarIntegrations()]),el('div',{class:'modal-footer'},[el('button',{class:'btn',text:'Volver al calendario',onclick:()=>openCalendarManager()})]));openModal(m);}}),el('button',{class:'btn',text:'Sincronizar',onclick:async()=>{try{await syncPersonalCalendars();render();}catch(e){toast(e.message,'error');}}}));
  const render=()=>{
    area.textContent='';area.append(el('h2',{text:calendarFormat(eventViewDate)}));
    const yearModel=calendarYearModel(eventViewDate),selectedMonth=calendarMonthFor(eventViewDate);
    const events=calendarEventsOnly();
    const holidayKey=state.data.settings.holidayCountry+'-'+eventViewDate.getFullYear();
    const holidays=state.data.settings.holidayCache?.[holidayKey]||[];
    const drawDay=(date,hours)=>{const day=el('section',{class:'event-day'});day.append(el('h3',{text:calendarFormat(date,{weekday:'short',day:'numeric',month:'short'})}));
      const entries=events.filter(e=>taskDateKey(e.dueAt)===taskDateKey(date.getTime()));
      const appendEvent=(target,e)=>{const color=/^#[0-9a-f]{6}$/i.test(e.displayColor||'')?e.displayColor:'var(--primary)';const button=el('button',{class:'btn secondary event-entry',text:`${e.calendarTarget?.allDay?'Todo el día':new Date(e.dueAt).toLocaleTimeString(getLocale(),{hour:'2-digit',minute:'2-digit'})} · ${e.title}`,onclick:()=>openCalendarEventForm(e)});button.style.borderLeft='4px solid '+color;button.style.background=`color-mix(in srgb, ${color} 18%, var(--surface-1))`;target.append(button);};
      if(hours){
        const all=el('div',{class:'event-all-day'},[el('small',{text:'Todo el día'})]);entries.filter(e=>e.calendarTarget?.allDay).forEach(e=>appendEvent(all,e));day.append(all);
        const timeline=el('div',{class:'event-timeline'});for(let h=0;h<24;h++)timeline.append(el('div',{class:'event-time-line',style:`top:${h*60}px`,text:`${String(h).padStart(2,'0')}:00`}));
        const timed=entries.filter(e=>!e.calendarTarget?.allDay).sort((a,b)=>a.dueAt-b.dueAt),placed=[];
        timed.forEach(e=>{const start=new Date(e.dueAt),minute=start.getHours()*60+start.getMinutes(),duration=Math.max(15,Math.min(1440-minute,Number(e.durationMinutes)||60));let column=0;while(placed.some(p=>p.column===column&&p.start<minute+duration&&p.end>minute))column++;placed.push({start:minute,end:minute+duration,column});const holder=el('div',{class:'event-time-block',style:`top:${minute}px;height:${duration}px;left:${58+column*18}px;right:4px;z-index:${column+1}`});appendEvent(holder,e);timeline.append(holder);});
        const today=new Date();if(date.toDateString()===today.toDateString())timeline.append(el('div',{class:'event-now-line',style:`top:${today.getHours()*60+today.getMinutes()}px`}));
        day.append(timeline);
      }
      else entries.forEach(e=>appendEvent(day,e));return day;};
    const grid=el('div',{class:'event-grid '+eventViewMode});
    if(eventViewMode==='day')grid.append(drawDay(new Date(eventViewDate),true));
    if(eventViewMode==='week'){const start=startTaskWeek(eventViewDate);for(let i=0;i<7;i++)grid.append(drawDay(addTaskDays(start,i),true));}
    const monthGrid=(month,compact)=>{
      const days=el('div',{class:'event-month-days'+(compact?' compact':'')});
      for(let i=0;i<7;i++)days.append(el('span',{class:'cal-dow',text:new Date(2024,0,1+i).toLocaleDateString(getLocale(),{weekday:'short'})}));
      const offset=(month.start.getDay()+6)%7;for(let i=0;i<offset;i++)days.append(el('span',{'aria-hidden':'true'}));
      for(const item of month.days){
        const date=item.date,button=el('button',{class:'event-date-button',type:'button','aria-label':calendarFormat(date),text:String(item.day),onclick:()=>{eventViewDate=date;eventViewMode='day';select.value='day';render();}});
        if(date.getDay()===0||date.getDay()===6)button.classList.add('weekend');
        const today=new Date();
        if(date.toDateString()===today.toDateString()){button.classList.add('today');button.setAttribute('aria-current','date');}
        if(!compact){const total=events.filter(e=>taskDateKey(e.dueAt)===taskDateKey(date.getTime())).length;if(total)button.append(el('small',{text:formatUiText('{count} eventos',{count:total})}));}
        const iso=`${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
        const dayHolidays=state.data.settings.holidayCache?.[state.data.settings.holidayCountry+'-'+date.getFullYear()]||[];
        const names=dayHolidays.filter(h=>h.date===iso&&(h.global||state.data.settings.holidayRegion&&h.counties?.includes(state.data.settings.holidayRegion))).map(h=>h.localName||h.name);
        if(names.length){button.classList.add('holiday');button.title=names.join(' · ');if(!compact)button.append(el('small',{class:'event-holiday-name',text:names.join(' · ')}));}
        days.append(button);
      }return days;
    };
    if(eventViewMode==='month')grid.append(monthGrid(selectedMonth,false));
    if(eventViewMode==='year')for(const model of yearModel.months){const month=el('section',{class:'event-year-month'});month.append(el('h3',{text:model.label}),monthGrid(model,true));grid.append(month);}
    if(eventViewMode==='day'){
      const side=el('aside',{class:'event-month-sidebar','aria-label':'Calendario mensual'});
      for(const model of yearModel.months)side.append(el('section',{class:'event-year-month'+(model===selectedMonth?' selected-month':'')},[el('h3',{text:model.label}),monthGrid(model,true)]));
      area.append(el('div',{class:'event-day-layout'},[grid,side]));
      requestAnimationFrame(()=>{side.scrollTop=side.querySelector('.selected-month')?.offsetTop-side.firstElementChild.offsetTop||0;const scroll=grid.querySelector('.event-day');if(scroll)scroll.scrollTop=Math.max(0,(eventViewDate.toDateString()===new Date().toDateString()?new Date().getHours()-1:8)*60);});
    }else area.append(grid);
    if(state.data.settings.holidayCountry&&!state.data.settings.holidayCache?.[holidayKey])area.prepend(el('button',{class:'btn secondary',text:'Cargar festividades de este año',onclick:async()=>{try{await loadCalendarHolidays(state.data.settings.holidayCountry,eventViewDate.getFullYear());render();}catch(error){toast(error.message,'error');}}}));
  };
  toolbar.append(el('button',{class:'btn secondary',text:'Festividades por país',onclick:()=>openHolidaySettings(eventViewDate.getFullYear())}));
  const systemSelect=el('select',{class:'form-select event-view-select','aria-label':'Tipo de calendario'});
  CALENDAR_SYSTEMS.forEach(([id,label])=>systemSelect.append(el('option',{value:id,text:label})));systemSelect.value=calendarSystem();systemSelect.onchange=()=>{state.data.settings.calendarSystem=systemSelect.value;saveData();renderCalendar();render();};
  toolbar.append(systemSelect,el('button',{class:'btn secondary',text:'Maya · curiosidad',onclick:()=>openMayaCalendar(eventViewDate.getFullYear())}));
  modal.append(el('div',{class:'modal-header'},[el('h2',{class:'modal-title',text:'Calendario'}),el('button',{class:'modal-close','aria-label':'Cerrar calendario',text:'×',onclick:closeModal})]),body);body.append(toolbar,area);render();openModal(modal);
}
function openCalendarEventForm(existing){
  const eventColor=el('input',{type:'color',value:/^#[0-9a-f]{6}$/i.test(existing?.displayColor||'')?existing.displayColor:'#6699ff','aria-label':'Color del evento'});
  const name=el('input',{class:'form-input',value:existing?.title||'',placeholder:'Nombre del evento'}),date=el('input',{class:'form-input',type:'datetime-local',value:toDateTimeLocal(existing?.dueAt||eventViewDate.getTime())}),notes=el('textarea',{class:'form-input'}),target=el('select',{class:'form-select'});notes.value=existing?.notes||'';target.append(el('option',{value:'',text:'Solo en este calendario local'}));connectedCalendarOptions().forEach(o=>target.append(el('option',{value:`${o.provider}|${o.calendarId}`,text:o.label})));if(existing?.calendarTarget?.provider)target.value=`${existing.calendarTarget.provider}|${existing.calendarTarget.calendarId}`;
  const modal=el('div',{class:'modal'});modal.append(el('div',{class:'modal-header'},[el('h2',{class:'modal-title',text:existing?'Editar evento':'Nuevo evento'}),el('button',{class:'modal-close',text:'×',onclick:()=>openCalendarManager()})]),el('div',{class:'modal-body'},[el('label',{text:'Nombre'}),name,el('label',{text:'Fecha y hora'}),date,el('label',{text:'Notas'}),notes,el('label',{text:'Color personalizado (local)'}),eventColor,el('label',{text:'Sincronización opcional'}),target]),el('div',{class:'modal-footer'},[el('button',{class:'btn',text:'Cancelar',onclick:()=>openCalendarManager()}),el('button',{class:'btn primary',text:'Guardar evento',onclick:()=>{if(!name.value.trim()||!fromDateTimeLocal(date.value))return toast('Indica nombre, fecha y hora válidos','error');const e=existing||{id:uid(),status:'todo',priority:'normal',createdAt:Date.now()};e.displayColor=eventColor.value;e.kind='calendar-event';e.title=name.value.trim();e.notes=notes.value;e.dueAt=fromDateTimeLocal(date.value);e.updatedAt=Date.now();applyTaskCalendarTarget(e,target.value);if(!existing)state.data.tasks.push(e);saveData();openCalendarManager();}})]));openModal(modal);
}
