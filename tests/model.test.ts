import {test} from 'node:test';
import assert from 'node:assert/strict';
import {skills,initialState,previewMove,moveSkill,commitSkill,validateState,slotKey,soulFor} from '../src/model';
test('all 73 source skills have two legal branch options and unique initial slots',()=>{
 const s=initialState();assert.equal(skills.length,73);assert.equal(new Set(Object.values(s.plan).map(slotKey)).size,73);
 for(const x of skills){assert.equal(x.options.length,2);assert.ok(soulFor(x.id,x.original.branch));}assert.doesNotThrow(()=>validateState(s));
});
test('same-branch swap moves both skills but does not change actual progress',()=>{
 const s=initialState();s.progress['天空的故事'].level=3;
 const target={branch:'鸟鸣学',rank:1};const result=previewMove(s,'天空的故事',target);assert.equal(result.ok,true);assert.equal(result.displaced,'拉姆桑德语');
 const n=moveSkill(s,'天空的故事',target);assert.equal(n.plan['天空的故事'].rank,1);assert.equal(n.plan['拉姆桑德语'].rank,7);assert.equal(n.progress['天空的故事'].actual,null);assert.equal(s.plan['天空的故事'].rank,7);assert.doesNotThrow(()=>validateState(n));
});
test('skill can only be planned on its single excel branch',()=>{
 const s=initialState();const off=previewMove(s,'天空的故事',{branch:'司辰学',rank:1});assert.equal(off.ok,false);assert.match(off.reason,/Excel 安排的「鸟鸣学」/);
 const other=previewMove(s,'天空的故事',{branch:'司辰学',rank:2});assert.equal(other.ok,false);assert.match(other.reason,/鸟鸣学/);
 s.plan['天空的故事']={branch:'司辰学',rank:1};s.progress['天空的故事'].level=1;s.unlocked.push('司辰学:1');assert.throws(()=>commitSkill(s,'天空的故事'),/鸟鸣学/);
});
test('displaced skill cannot leave its excel branch',()=>{
 const s=initialState();s.plan['萨巴佐因语']={branch:'鸟鸣学',rank:4};const r=previewMove(s,'天空的故事',{branch:'鸟鸣学',rank:4});assert.equal(r.ok,false);assert.match(r.reason,/萨巴佐因语/);
});
test('moving into an empty slot on the excel branch vacates the previous rank',()=>{
 const s=initialState();const preview=previewMove(s,'天空的故事',{branch:'鸟鸣学',rank:4});assert.equal(preview.ok,true);assert.equal(preview.displaced,null);
 const n=moveSkill(s,'天空的故事',{branch:'鸟鸣学',rank:4});assert.equal(n.plan['天空的故事'].branch,'鸟鸣学');assert.equal(n.plan['天空的故事'].rank,4);assert.equal(Object.values(n.plan).filter(x=>slotKey(x)==='鸟鸣学:7').length,0);assert.equal(soulFor('天空的故事',n.plan['天空的故事'].branch),'悲恸');assert.doesNotThrow(()=>validateState(n));
});
test('commit requires acquisition, level and explicit unlock; occupied slots are locked',()=>{
 let s=initialState();assert.throws(()=>commitSkill(s,'天空的故事'));s.progress['天空的故事'].level=3;s.unlocked.push('鸟鸣学:7');assert.throws(()=>commitSkill(s,'天空的故事'),/需要 7 级/);
 s.progress['天空的故事'].level=7;s=commitSkill(s,'天空的故事');assert.ok(s.progress['天空的故事'].actual);assert.equal(previewMove(s,'天空的故事',{branch:'鸟鸣学',rank:1}).ok,false);assert.equal(previewMove(s,'拉姆桑德语',{branch:'鸟鸣学',rank:7}).ok,false);
});
test('unknown unlock prevents commitment despite adequate level',()=>{const s=initialState();s.progress['天空的故事'].level=9;assert.throws(()=>commitSkill(s,'天空的故事'),/解锁/);});
test('backup rejects duplicate slots, invalid branches, invalid levels and attunement without commitment',()=>{
 const s=initialState();let n=structuredClone(s);n.plan['拉姆桑德语']=n.plan['天空的故事'];assert.throws(()=>validateState(n),/重复/);
 n=structuredClone(s);n.progress['天空的故事'].attuned=true;assert.throws(()=>validateState(n),/先上树/);
 n=structuredClone(s);n.progress['天空的故事'].level=10;assert.throws(()=>validateState(n));
 n=structuredClone(s);n.plan['天空的故事'].branch='保存术';assert.throws(()=>validateState(n));
});
