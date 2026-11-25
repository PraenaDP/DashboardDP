import fs from 'node:fs/promises';
const plain=value=>value.replace(/\[([^\]]+)\]\(([^)]+)\)/g,'$1').replace(/\*\*|`/g,'').trim();
const slug=value=>value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
function parse(text,language){return text.split(/^## /m).slice(1).flatMap((section,index)=>{
 const [chapterHeading,...rest]=section.split('\n'),chapter=chapterHeading.replace(/^\d+\. /,''),articles=rest.join('\n').split(/^### /m);
 return articles.map((article,articleIndex)=>{
 const [heading,...lines]=articleIndex?article.split('\n'):['Visión general',article];
 const body=lines.join('\n'),source=body.match(/<!-- source: ([a-z0-9-]+) -->/);
 if(language==='en'&&!source)throw Error('English article without a Spanish source: '+heading);
 const chunks=body.replace(/<!-- source: [a-z0-9-]+ -->/g,'').trim().split(/\n\s*\n/),blocks=[];
 const first=chunks[0]||'';
 const intro=first.split('\n').every(line=>/^(- |\d+\. )/.test(line))?'':plain(chunks.shift()||'');
 for(const chunk of chunks){const lines=chunk.split('\n');if(lines.every(line=>/^(- |\d+\. )/.test(line)))blocks.push([language==='en'?'Steps':'Pasos','',lines.map(line=>plain(line.replace(/^(- |\d+\. )/,'')))]);else blocks.push(['',plain(chunk.replace(/\n/g,' ')),[]]);}
 return {id:source?.[1]||slug(chapter+'-'+heading),group:chapter,chapter:index+1,title:heading==='Visión general'?chapter:heading,intro,blocks};
 });
});}
const topics=parse(await fs.readFile(new URL('../docs/GUIA_DE_USO.md',import.meta.url),'utf8'),'es');
const english=parse(await fs.readFile(new URL('../docs/USER_GUIDE.md',import.meta.url),'utf8'),'en');
if(new Set(topics.map(topic=>topic.group)).size!==13||new Set(topics.map(topic=>topic.id)).size!==topics.length)throw Error('Capítulos incompletos o identificadores duplicados.');
if(new Set(english.map(topic=>topic.id)).size!==english.length)throw Error('Identificadores ingleses duplicados.');
for(const translation of english){
 const source=topics.find(topic=>topic.id===translation.id);
 if(!source||source.chapter!==translation.chapter||source.blocks.length!==translation.blocks.length||source.blocks.some((block,index)=>block[2].length!==translation.blocks[index][2].length))throw Error('Traducción sin fuente válida o con pasos incompletos: '+translation.id);
}
if(process.argv.includes('--require-complete')&&english.length!==topics.length)throw Error('Ayuda EN incompleta: '+english.length+'/'+topics.length);
const output='/* Generado desde docs/GUIA_DE_USO.md y docs/USER_GUIDE.md; no contiene datos personales. */\nfunction dashboardHelpTopics(language="es"){const spanish='+JSON.stringify(topics,null,2)+';if(language!=="en")return spanish;const english='+JSON.stringify(Object.fromEntries(english.map(topic=>[topic.id,topic])),null,2)+';return spanish.map(topic=>english[topic.id]||topic);}\ndashboardHelpTopics.coverage=Object.freeze('+JSON.stringify({es:topics.length,en:english.length})+');';
if(process.argv.includes('--write')){await fs.writeFile(new URL('../dashboard/help-content.js',import.meta.url),output+'\n');console.log('Ayuda regenerada: '+topics.length+' artículos ES; '+english.length+' artículos EN.');}
else if(process.argv.includes('--check')){if(await fs.readFile(new URL('../dashboard/help-content.js',import.meta.url),'utf8')!==output+'\n')throw Error('Ayuda generada desactualizada.');console.log('Ayuda vigente: '+topics.length+' artículos ES; '+english.length+' artículos EN.');}
else console.log(output);
