import data from './encyclopedia-data.json';
export type Entry={id:string;category:string;name:string;fields:{label:string;value:string}[];aspects:Record<string,number|null>;branches:string[];sources:string[];sections:{title:string;columns:string[];rows:string[][]}[];spoiler:boolean;skillId?:string;wiki?:string};
export const entries=data.entries as unknown as Entry[];
export const categories=Object.keys(data.counts);
export const aspects=[...'刃铸杯心启灯月蛾蜜引鳞穹冬'];
const normalize=(s:string)=>s.toLowerCase().replace(/[\s·、（）()]/g,'');
export const entryText=(e:Entry)=>[e.name,...e.branches,...Object.keys(e.aspects),...e.fields.map(f=>f.value),...e.sections.flatMap(s=>s.rows.flat()),e.skillId??''].join(' ');
export function searchEntries(query:string,category='全部',aspect='',branch='',spoilers=false){
 const terms=query.trim().split(/\s+/).map(normalize).filter(Boolean);
 return entries.filter(e=>(spoilers||!e.spoiler)&&(category==='全部'||e.category===category)&&(!aspect||aspect in e.aspects)&&(!branch||e.branches.includes(branch))&&terms.every(t=>normalize(entryText(e)).includes(t))).sort((a,b)=>Number(normalize(b.name)===normalize(query))-Number(normalize(a.name)===normalize(query)));
}
// References are textual matches, not asserted ingredient compatibility.
export function references(entry:Entry,spoilers=false){
 return entries.filter(e=>e.id!==entry.id&&(spoilers||!e.spoiler)&&(e.name===entry.name||e.skillId&&e.skillId===entry.skillId||e.fields.some(f=>f.value.includes(entry.name))||e.sections.some(s=>s.rows.some(r=>r.some(v=>v.includes(entry.name))))));
}
