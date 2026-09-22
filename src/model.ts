import data from './data.json';
export const branches = data.branches;
export const soulColors: Record<string,string> = data.souls;
export type Slot = {branch:string;rank:number};
export type Skill = typeof data.skills[number];
export const skills: Skill[] = data.skills;
export const byId = Object.fromEntries(skills.map(s=>[s.id,s]));
export type Progress = {level:number|null;actual:Slot|null;attuned:boolean;note:string};
export type State = {version:1;plan:Record<string,Slot>;progress:Record<string,Progress>;unlocked:string[];updatedAt:string};
export const slotKey=(s:Slot)=>`${s.branch}:${s.rank}`;
export const sameSlot=(a:Slot|null|undefined,b:Slot|null|undefined)=>!!a&&!!b&&slotKey(a)===slotKey(b);
export const slotLabel=(s:Slot)=>`${s.branch} · ${s.rank} 档`;
export const soulFor=(id:string,branch:string)=>byId[id]?.options.find(o=>o.branch===branch)?.soul;
export const initialState=():State=>({version:1,plan:Object.fromEntries(skills.map(s=>[s.id,{...s.original}])),progress:Object.fromEntries(skills.map(s=>[s.id,{level:s.initialAttuned?s.original.rank:null,actual:s.initialAttuned?{...s.original}:null,attuned:s.initialAttuned,note:''}])),unlocked:[],updatedAt:new Date().toISOString()});
export function validSlot(s:unknown):s is Slot {
 const v=s as Slot; return !!v&&branches.includes(v.branch)&&Number.isInteger(v.rank)&&v.rank>=1&&v.rank<=9;
}
export function status(p:Progress){return p.attuned?'已调谐':p.actual?'待调谐':p.level===null?'未记录':p.level===0?'未获得':'待上树';}
export type MoveResult={ok:boolean;reason:string;displaced:string|null;warnings:string[]};
export function previewMove(state:State,id:string,target:Slot):MoveResult {
 const fail=(reason:string):MoveResult=>({ok:false,reason,displaced:null,warnings:[]});
 if(!byId[id]||!validSlot(target))return fail('无效的技能或位置');
 if(state.progress[id].actual)return fail('该技能已实际上树，不能调换位置');
 if(!soulFor(id,target.branch))return fail('该技能不支持这个分支');
 if(sameSlot(state.plan[id],target))return fail('这就是当前计划位置');
 const actual=skills.find(s=>sameSlot(state.progress[s.id].actual,target));
 if(actual)return fail(`此位置已由「${actual.name}」实际上树占用`);
 const displaced=skills.find(s=>sameSlot(state.plan[s.id],target));
 if(displaced&&state.progress[displaced.id].actual)return fail('被替换技能已经上树');
 if(displaced&&!soulFor(displaced.id,state.plan[id].branch))return fail(`「${displaced.name}」不能放入${state.plan[id].branch}，无法直接互换`);
 const warnings:string[]=[];
 for(const [who,dest] of [[id,target],...(displaced?[[displaced.id,state.plan[id]]]:[])] as [string,Slot][]){
  const p=state.progress[who];
  if(p.level===null||p.level===0)warnings.push(`「${byId[who].name}」尚未记录获得，未来上树需要 ${dest.rank} 级`);
  else if(p.level<dest.rank)warnings.push(`「${byId[who].name}」当前 ${p.level} 级，需要升到 ${dest.rank} 级`);
 }
 if(!state.unlocked.includes(slotKey(target)))warnings.push('目标槽位尚未标记解锁；可先调整计划');
 return {ok:true,reason:displaced?'可以交换计划':'可以移入空位',displaced:displaced?.id??null,warnings};
}
export function moveSkill(state:State,id:string,target:Slot):State {
 const r=previewMove(state,id,target);if(!r.ok)throw Error(r.reason);
 const next=structuredClone(state);const source=next.plan[id];next.plan[id]={...target};
 if(r.displaced)next.plan[r.displaced]=source;
 return next;
}
export function commitProblems(state:State,id:string):string[]{
 const p=state.progress[id],slot=state.plan[id];const reasons:string[]=[];
 if(p.actual)reasons.push('已经记录上树');
 if(!soulFor(id,slot.branch))reasons.push('分支不兼容');
 if(p.level===null||p.level===0)reasons.push('先记录已获得和当前等级');
 else if(p.level<slot.rank)reasons.push(`需要 ${slot.rank} 级，当前 ${p.level} 级`);
 if(!state.unlocked.includes(slotKey(slot)))reasons.push('请按游戏画面确认该槽位已解锁');
 if(skills.some(s=>s.id!==id&&sameSlot(state.progress[s.id].actual,slot)))reasons.push('此槽位已被占用');
 return reasons;
}
export function commitSkill(state:State,id:string):State {
 const issues=commitProblems(state,id);if(issues.length)throw Error(issues.join('；'));
 const next=structuredClone(state);next.progress[id].actual={...next.plan[id]};return next;
}
export function validateState(input:unknown):State {
 const x=input as State;
 if(!x||x.version!==1||!x.plan||!x.progress||!Array.isArray(x.unlocked))throw Error('不是有效的司辰手记备份');
 const expected=skills.map(s=>s.id);
 if(Object.keys(x.plan).length!==expected.length||Object.keys(x.progress).length!==expected.length)throw Error('备份中的技能数量不匹配');
 const occupied=new Set<string>();
 for(const id of expected){
  const slot=x.plan[id],p=x.progress[id];
  if(!validSlot(slot)||!soulFor(id,slot.branch))throw Error(`「${byId[id].name}」的计划分支或档位无效`);
  if(occupied.has(slotKey(slot)))throw Error('备份中存在重复计划位置');occupied.add(slotKey(slot));
  if(!p||!(p.level===null||Number.isInteger(p.level)&&p.level>=0&&p.level<=9)||typeof p.attuned!=='boolean'||typeof p.note!=='string'||p.note.length>2000)throw Error('技能进度格式无效');
  if(p.actual!==null&&(!validSlot(p.actual)||!sameSlot(p.actual,slot)||p.level===null||p.level<p.actual.rank))throw Error('实际上树位置与计划或等级不一致');
  if(p.attuned&&!p.actual)throw Error('已调谐技能必须先上树');
 }
 if(x.unlocked.some(k=>typeof k!=='string'||!branches.some(b=>Array.from({length:9},(_,i)=>`${b}:${i+1}`).includes(k))))throw Error('解锁记录无效');
 return {...structuredClone(x),updatedAt:typeof x.updatedAt==='string'?x.updatedAt:new Date().toISOString()};
}
