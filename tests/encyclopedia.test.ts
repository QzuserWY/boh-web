import {test} from 'node:test';
import assert from 'node:assert/strict';
import {entries,searchEntries,references} from '../src/encyclopedia-model';
import {skills,byId} from '../src/model';
test('entries have unique identities, sources and valid planner links',()=>{
 assert.equal(new Set(entries.map(e=>e.id)).size,entries.length);
 assert.equal(entries.filter(e=>e.category==='技能').length,skills.length);
 for(const e of entries){assert.ok(e.name&&e.sources.length);if(e.skillId)assert.ok(byId[e.skillId]);}
});
test('spoilers are hidden in search and references unless enabled',()=>{
 assert.equal(entries.filter(e=>e.spoiler).length,13);
 assert.ok(searchEntries('永陷囹圄').every(e=>!e.spoiler));
 assert.ok(searchEntries('永陷囹圄','全部','','',true).some(e=>e.spoiler));
 for(const e of entries)assert.ok(references(e).every(x=>!x.spoiler));
});
test('same-name weather and memory retain distinct strength',()=>{
 const storms=searchEntries('风暴').filter(e=>e.name==='风暴');
 assert.equal(storms.find(e=>e.category==='天气')?.aspects.心,4);
 assert.equal(storms.find(e=>e.category==='回忆')?.aspects.心,2);
});
test('search combines fields, aspects and branches; recipe links reach planner',()=>{
 assert.ok(searchEntries('蜂巢挽歌','回忆','蜜','丛林学').length);
 assert.equal(searchEntries('蜂巢挽歌','回忆','刃').length,0);
 const sky=entries.find(e=>e.category==='技能'&&e.name==='天空的故事')!;
 assert.ok(references(sky).some(e=>e.category==='制作配方'&&e.name==='静待之风'));
 assert.ok(searchEntries('天空 静待').some(e=>e.name==='静待之风'));
});
