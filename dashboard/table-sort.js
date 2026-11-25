/* Shared UI-table sorting. Moves existing rows, preserving inputs and handlers. */
function dashboardTableCellText(cell){
 if(!cell)return '';
 const fields=[...cell.querySelectorAll('input:not([type="checkbox"]):not([type="hidden"]),textarea,select')];
 return (fields.length?fields.map(field=>field.value).join(' '):cell.textContent).trim();
}
function dashboardSortTable(table,index,direction){
 const locale=typeof getLocale==='function'?getLocale():document.documentElement.lang||'es';
 const collator=new Intl.Collator(locale,{sensitivity:'base',numeric:true});
 for(const body of table.tBodies){
  const rows=[...body.rows];if(rows.some(row=>row.cells.length<=index||[...row.cells].some(cell=>cell.colSpan>1||cell.rowSpan>1)))continue;
  const sorted=rows.map((row,order)=>({row,order,text:dashboardTableCellText(row.cells[index])})).sort((a,b)=>(direction==='descending'?-1:1)*collator.compare(a.text,b.text)||a.order-b.order);
  body.append(...sorted.map(item=>item.row));
 }
}
function dashboardEnableTableSorting(root=document){
 for(const table of root.querySelectorAll('table')){
  if(table.dataset.sortable==='false')continue;
  const headers=[...(table.tHead?.rows[0]?.cells||[])];
  headers.forEach((header,index)=>{
   if(header.dataset.sortReady||header.dataset.sortable==='false'||!header.textContent.trim()||header.querySelector('input,select')||header.colSpan>1)return;
   header.dataset.sortReady='true';header.setAttribute('aria-sort','none');
   const button=document.createElement('button');button.type='button';button.className='table-sort-button';button.textContent='A–Z';button.title='Ordenar A–Z';button.setAttribute('aria-label',header.textContent.trim()+': ordenar A–Z');
   button.onclick=()=>{
    const direction=header.getAttribute('aria-sort')==='ascending'?'descending':'ascending';
    headers.forEach(cell=>{cell.setAttribute('aria-sort','none');const other=cell.querySelector('.table-sort-button');if(other)other.textContent='A–Z';});
    header.setAttribute('aria-sort',direction);button.textContent=direction==='ascending'?'A–Z ↓':'Z–A ↓';button.title=direction==='ascending'?'Ordenar Z–A':'Ordenar A–Z';button.setAttribute('aria-label',header.textContent.replace(button.textContent,'').trim()+': '+button.title);
    dashboardSortTable(table,index,direction);
   };
   header.append(button);
  });
 }
}
dashboardEnableTableSorting();
new MutationObserver(()=>dashboardEnableTableSorting()).observe(document.body,{childList:true,subtree:true});
