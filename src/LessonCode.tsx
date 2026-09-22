import {useState} from 'react';
import data from './lesson-codes.json';
export const lessonCodes:Record<string,string>=data.codes;
export default function LessonCode({id,compact=false}:{id:string;compact?:boolean}){
 const [message,setMessage]=useState('');
 const code=lessonCodes[id];
 if(!code)return null;
 if(compact)return <code className="lesson-code-small" title={`教诲简码：${code}`}>{code}</code>;
 async function copy(){try{await navigator.clipboard.writeText(`x.${code}`);setMessage('已复制教诲代码');}catch{setMessage(`复制失败，请手动复制：x.${code}`);}}
 return <button className="lesson-copy" onClick={()=>void copy()} title={`复制教诲代码 x.${code}`}><span role="status">{message||'复制教诲代码'}</span></button>;
}
