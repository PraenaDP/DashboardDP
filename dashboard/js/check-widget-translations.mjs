import fs from 'node:fs/promises';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const app=await fs.readFile(new URL('../app.js',import.meta.url),'utf8');
const context=vm.createContext({state:{data:{settings:{language:'es'}}},widgetLibrary:()=>[]});
vm.runInContext(app.slice(app.indexOf('function normalizeWidgetTranslations('),app.indexOf('const WIDGET_LIBRARY_TYPES')),context);
const original={title:'Título propio',description:'Descripción propia',widgetType:'Tipo propio',url:'https://example.org/embed',embedCode:'<iframe src="https://example.org/embed" height="700"></iframe>',favorite:true,translationSource:{title:'Título propio',description:'Descripción propia',widgetType:'Tipo propio'},translations:{}};
for(const language of ['es','en'])original.translations[language]={title:language+' title',description:language+' description',widgetType:language+' type'};
const before=JSON.stringify(original);
for(const language of Object.keys(original.translations)){
 context.state.data.settings.language=language;const rendered=context.localizedWidgetEntry(original);
 assert.equal(rendered.title,language==='es'?original.title:language+' title');assert.equal(rendered.url,original.url);assert.equal(rendered.embedCode,original.embedCode);assert.equal(rendered.favorite,true);
}
assert.equal(JSON.stringify(original),before);
context.state.data.settings.language='en';
for(const field of ['title','description','widgetType']){const edited=structuredClone(original);edited[field]='Edición personal nueva';assert.equal(context.localizedWidgetEntry(edited)[field],edited[field]);}
assert.deepEqual(JSON.parse(JSON.stringify(context.normalizeWidgetTranslations(original.translations))),original.translations);
const restored=JSON.parse(JSON.stringify(original));assert.equal(context.localizedWidgetEntry(restored).title,'en title');
const fallback={...original,translations:{}};assert.equal(context.localizedWidgetEntry(fallback).title,original.title);
assert.deepEqual(Object.keys(context.normalizeWidgetTranslations({...original.translations,fr:{title:'Ancien'}})),['es','en']);
context.state.data.settings.language='fr';assert.equal(context.localizedWidgetEntry(original).title,original.title);
console.log('OK: español e inglés, cambios personales por campo, fuente original intacta, código iframe y favoritos preservados, serialización y reserva sin traducción.');
