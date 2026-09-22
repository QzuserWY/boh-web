import {initialState,validateState,type State} from './model';
const dbPromise=()=>new Promise<IDBDatabase>((resolve,reject)=>{
 const request=indexedDB.open('sczs-planner',1);
 request.onupgradeneeded=()=>request.result.createObjectStore('saves');
 request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error);
});
export async function loadState():Promise<State>{
 const db=await dbPromise();
 try{return await new Promise((resolve,reject)=>{
  const r=db.transaction('saves').objectStore('saves').get('current');
  r.onsuccess=()=>{try{resolve(r.result?validateState(r.result):initialState());}catch(e){reject(e);}};r.onerror=()=>reject(r.error);
 });}finally{db.close();}
}
export async function saveState(state:State):Promise<void>{
 const db=await dbPromise();
 try{await new Promise<void>((resolve,reject)=>{
  const tx=db.transaction('saves','readwrite');tx.objectStore('saves').put(state,'current');
  tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error??Error('保存中断'));
 });}finally{db.close();}
}
