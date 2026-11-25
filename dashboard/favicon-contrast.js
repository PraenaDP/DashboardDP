/* Shared local-only favicon analysis. Never changes URLs or saved bookmarks. */
(()=>{
 const selector='img.favicon-image,.popup-bookmark img',cache=new Map();
 function classify(image){
  const canvas=document.createElement('canvas');canvas.width=canvas.height=32;
  const context=canvas.getContext('2d',{willReadFrequently:true});if(!context)return '';
  context.drawImage(image,0,0,32,32);const pixels=context.getImageData(0,0,32,32).data;
  // Opaque tiles already have their own contrast surface. Do not invert them.
  if([0,31,992,1023].every(index=>pixels[index*4+3]>220))return '';
  let count=0,neutral=0,luminance=0;
  for(let index=0;index<pixels.length;index+=4){
   if(pixels[index+3]<60)continue;
   const r=pixels[index],g=pixels[index+1],b=pixels[index+2];count++;
   if(Math.max(r,g,b)-Math.min(r,g,b)<28)neutral++;
   luminance+=(r+g+b)/3;
  }
  if(count<8||neutral/count<.97)return '';
  const average=luminance/count;
  return average>215?'light':average<45?'dark':'';
 }
 function inspect(image){
  if(!image.matches(selector))return;
  if(!image.complete||!image.naturalWidth){delete image.dataset.faviconTone;return;}
  const source=image.currentSrc||image.src;
  try{
   if(!cache.has(source)){if(cache.size>=512)cache.delete(cache.keys().next().value);cache.set(source,classify(image));}
   const tone=cache.get(source);if(tone)image.dataset.faviconTone=tone;else delete image.dataset.faviconTone;
  }catch{delete image.dataset.faviconTone;} // Cross-origin pixels: leave original intact.
 }
 document.addEventListener('load',event=>{if(event.target instanceof HTMLImageElement)inspect(event.target);},true);
 new MutationObserver(records=>{
  for(const record of records){
   if(record.type==='attributes'){inspect(record.target);continue;}
   for(const item of record.addedNodes)if(item instanceof Element){if(item.matches(selector))inspect(item);item.querySelectorAll(selector).forEach(inspect);}
  }
 }).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['src','srcset']});
 document.querySelectorAll(selector).forEach(inspect);
})();
