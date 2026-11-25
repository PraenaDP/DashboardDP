// Ejecutar con Node: node dashboard/js/check-interface-i18n.mjs
import fs from 'node:fs/promises';
import vm from 'node:vm';

const base=new URL('../',import.meta.url);
const app=await fs.readFile(new URL('app.js',base),'utf8');
const extra=await fs.readFile(new URL('i18n-extra.js',base),'utf8')+'\n'+await fs.readFile(new URL('i18n-release.js',base),'utf8');
const index=await fs.readFile(new URL('index.html',base),'utf8');
for(const file of ['app.js','i18n-extra.js','projects.js','calendar-view.js','calculations-import.js']){
  new vm.Script(await fs.readFile(new URL(file,base),'utf8'),{filename:file});
}
if(index.indexOf('src="i18n-extra.js"')<0||index.indexOf('src="i18n-extra.js"')>index.indexOf('src="app.js"'))throw Error('Cargar las traducciones antes de app.js');
const context={state:{data:{settings:{language:'es'}}},APP:{defaults:{settings:{language:'es'}}}};
vm.createContext(context);
vm.runInContext(extra+'\n'+app.slice(app.indexOf('const LANGUAGES'),app.indexOf('let refreshClock'))+'\nglobalThis.rows=EXTRA_UI_ROWS;globalThis.languages=LANGUAGES;globalThis.common=UI_COMMON;globalThis.widgetRows=WIDGET_TEXT;globalThis.uiLanguages=Object.keys(UI_TEXT);',context);
if(context.languages.map(language=>language.id).join(',')!=='es,en')throw Error('Solo deben estar disponibles español e inglés');
if(context.uiLanguages.join(',')!=='es,en')throw Error('Hay diccionarios de idiomas retirados');
for(const row of [...context.rows,...Object.values(context.common),...Object.values(context.widgetRows)]){
  if(row.length!==context.languages.length||row.some(value=>typeof value!=='string'||!value))throw Error('Traducción incompleta: '+row[0]);
}
for(const language of context.languages){
  context.state.data.settings.language=language.id;
  if(!context.formatUiText('¿Enviar {count} tareas locales a la Papelera? No se eliminarán eventos de Calendar.',{count:3}).includes('3'))throw Error('Contador perdido: '+language.id);
}
context.state.data.settings.language='en';
if(context.localizeUiString('Biblioteca de widgets')!=='Widget library')throw Error('Traducción inglesa');
context.state.data.settings.language='es';
if(context.localizeUiString('Biblioteca de widgets')!=='Biblioteca de widgets')throw Error('Cambio de idioma');
context.state.data.settings.language='fr';
if(context.getLanguage()!=='es')throw Error('Un idioma retirado debe usar español');
console.log(`${context.rows.length} entradas adicionales completas en ${context.languages.length} idiomas; sintaxis y variables correctas. No sustituye las pruebas visuales ni acredita la traducción completa de la ayuda.`);
