import fs from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
const [rootArg,catalogArg,reviewArg,destinationArg]=process.argv.slice(2);
if(!destinationArg)throw Error('Indica proyecto, catálogo aprobado, acta de revisión y carpeta nueva de salida.');
const root=await fs.realpath(rootArg),destination=path.resolve(destinationArg),catalogBytes=await fs.readFile(catalogArg),catalog=JSON.parse(catalogBytes),review=JSON.parse(await fs.readFile(reviewArg,'utf8'));
const languages=['es','en'],hash=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
if(catalog.approvedForPublication!==true||review.approvedForPublication!==true)throw Error('Catálogo o revisión pendientes: no se puede preparar una release.');
if(review.catalogSha256!==hash(catalogBytes))throw Error('El catálogo no coincide con la revisión aprobada.');
if(!languages.every(language=>review.uiLanguagesReviewed?.includes(language)&&review.helpLanguagesReviewed?.includes(language)))throw Error('Faltan idiomas de interfaz o Ayuda por revisar.');
const helpContext=vm.createContext({});vm.runInContext(await fs.readFile(path.join(root,'dashboard/help-content.js'),'utf8'),helpContext);
if(!helpContext.dashboardHelpTopics?.coverage?.es||helpContext.dashboardHelpTopics.coverage.en!==helpContext.dashboardHelpTopics.coverage.es)throw Error('El contenido de Ayuda no está completo en español e inglés.');
if(!review.privateSecurityContact||review.securityPassed!==true||review.storageQuotaVerified!==true||review.restoreVerified!==true)throw Error('Faltan contacto de seguridad o validaciones de publicación.');
if(!Array.isArray(catalog.entries)||!catalog.entries.length)throw Error('El catálogo público no puede estar vacío.');
const ids=new Set(),urls=new Set(),allowedFields=new Set(['catalogId','title','description','widgetType','url','width','height','embedCode','translations','translationSource']);
const keyContext=vm.createContext({URL});vm.runInContext(await fs.readFile(path.join(root,'dashboard/repository-import.js'),'utf8'),keyContext);
for(const entry of catalog.entries){
 if(Object.keys(entry).some(field=>!allowedFields.has(field)))throw Error('Campo ajeno al catálogo público.');
 const url=new URL(entry.url),key=keyContext.repositoryWidgetKey(entry.url);
 if(url.protocol!=='https:'||url.username||url.password||!key||ids.has(entry.catalogId)||urls.has(key))throw Error('URL o identificador inseguro o duplicado.');
 if(!review.providers?.some(provider=>provider.host===url.hostname&&provider.status==='approved'&&/^https:\/\//.test(provider.termsUrl)))throw Error('Proveedor sin revisión de condiciones: '+url.hostname);
 if(!languages.every(language=>['title','description','widgetType'].every(field=>entry.translations?.[language]?.[field]?.trim()&&entry.translationSource?.[field]===entry[field])))throw Error('Traducciones pendientes o caducadas: '+entry.catalogId);
 ids.add(entry.catalogId);urls.add(key);
}
const manifest=JSON.parse(await fs.readFile(path.join(root,'manifest.json'),'utf8'));
if(manifest.key||manifest.oauth2?.client_id)throw Error('El manifiesto contiene configuración personal.');
const version=value=>String(value).split('.').map(Number),baseline=version(review.remoteVersion),next=version(manifest.version);
if(!review.remoteVersion||!next.some((value,index)=>value!==(baseline[index]||0)&&next.slice(0,index).every((part,i)=>part===(baseline[i]||0))&&value>(baseline[index]||0)))throw Error('La versión no es posterior a la última publicación revisada.');
const seedContext=vm.createContext({});vm.runInContext(await fs.readFile(path.join(root,'dashboard/js/bookmarks_data.js'),'utf8')+'\nglobalThis.seed=BOOKMARKS_DATA;',seedContext);
if(seedContext.seed.bookmarks.length||seedContext.seed.categories.length)throw Error('Los marcadores iniciales no están vacíos.');
if(destination===root||destination.startsWith(root+path.sep))throw Error('La salida debe estar fuera del proyecto.');
try{await fs.access(destination);throw Error('La salida ya existe: no se sobrescribe.');}catch(error){if(error.code!=='ENOENT')throw error;}
const files=['manifest.json','background.js','popup.html','popup.js','README.md','LICENSE.md','NOTICE.md','THIRD-PARTY-NOTICES.md','CHANGELOG.md','PRIVACIDAD.md','SECURITY.md','SUPPORT.md','INTEGRACIONES_CALENDARIO.md','ESPECIFICACION.md','CONTRIBUTING.md','docs/MANUAL_INSTALACION.md','docs/GUIA_DE_USO.md','docs/USER_GUIDE.md','dashboard/js/bookmarks_data.js',...Object.values(manifest.icons)];
files.push('popup.css');
for(const name of await fs.readdir(path.join(root,'docs/images')))if(/^(?:kofi-coffee\.svg|(?:inicio-claro-oscuro|inicio-claro|inicio-oscuro|temas|biblioteca-widgets|calendario-anual|calendario-diario|proyectos|tareas-kanban|ayuda|acerca-de|auditoria|favoritos-tarjetas|favoritos-lista|favoritos-iconos|grupos-espacios|notas|ajustes-aspecto|importador|configurar-lectura|papelera|panel-lateral)\.png)$/.test(name))files.push('docs/images/'+name);
files.push('docs/VALIDACION_1.11.5.md');
files.push('docs/GUIA_USO_ACTUAL.md','docs/TEMAS_Y_APARIENCIA.md');
for(const name of await fs.readdir(path.join(root,'dashboard')))if(/\.(js|css|html)$/.test(name))files.push('dashboard/'+name);
// Lista positiva: no copia el proyecto completo ni confía únicamente en .gitignore.
const prepared=[];
for(const relative of [...new Set(files)]){
 if(relative.includes('..')||path.isAbsolute(relative)||/\.(json|html)$/i.test(relative)&&relative!=='manifest.json'&&!['popup.html','dashboard/index.html'].includes(relative))throw Error('Archivo inesperado: '+relative);
 const source=path.join(root,relative);if((await fs.lstat(source)).isSymbolicLink())throw Error('No se admiten enlaces simbólicos.');
 let bytes=await fs.readFile(source);
 if(relative==='dashboard/widget-catalog.js'){const code=bytes.toString();if(!code.includes('Object.freeze([])'))throw Error('Revisar el catálogo ya integrado antes de empaquetar.');bytes=Buffer.from(code.replace('Object.freeze([])','Object.freeze('+JSON.stringify(catalog.entries)+')'));}
 if(/(?:gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{40,}|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|AIza[0-9A-Za-z_-]{30,})/.test(bytes.toString()))throw Error('Posible credencial en '+relative);
 prepared.push({relative,bytes});
}
await fs.mkdir(destination);
const report={version:manifest.version,catalogWidgets:catalog.entries.length,catalogSha256:hash(catalogBytes),files:[],privateDataIncluded:false,publicationPerformed:false};
for(const {relative,bytes}of prepared){const target=path.join(destination,relative);await fs.mkdir(path.dirname(target),{recursive:true});await fs.writeFile(target,bytes,{flag:'wx'});report.files.push({path:relative,bytes:bytes.length,sha256:hash(bytes)});}
await fs.writeFile(path.join(destination,'RELEASE-MANIFEST.json'),JSON.stringify(report,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({version:report.version,widgets:report.catalogWidgets,files:report.files.length,bytes:report.files.reduce((total,file)=>total+file.bytes,0),published:false},null,2));
