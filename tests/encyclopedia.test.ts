import {test} from 'node:test';
import assert from 'node:assert/strict';
import {entries,searchEntries,references,craftsOfSkill,skillsForProduct,encyclopediaTarget,recipeRequirement} from '../src/encyclopedia-model';
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
test('曙光灵液 lists every crafting skill, and skill pages link back to encyclopedia entries',()=>{
 const dawn=skillsForProduct('曙光灵液').map(e=>`${e.skillId}|${recipeRequirement(e)}`).sort();
 assert.deepEqual(dawn,[
  '力量之墨|引10 光源',
  '守夜人的悖论|穹10 光源',
  '曙光的静观|引10 光源',
  '沙的故事|引10 光源',
  '景象与感知|穹10 光源',
 ].sort());
 assert.equal(entries.some(e=>e.name==='原表未填写产物'),false);
 assert.equal(recipeRequirement(entries.find(e=>e.id==='技艺:E26:F26:孔雀石圣餐')!),'蜜15 铜梨');
 const wind=craftsOfSkill('天空的故事').find(e=>e.name==='静待之风')!;
 assert.equal(encyclopediaTarget(wind).category,'回忆');
 assert.equal(encyclopediaTarget(wind).name,'静待之风');
 for(const skill of skills){
  for(const recipe of craftsOfSkill(skill.id)){
   assert.equal(recipe.skillId,skill.id);
   assert.ok(skillsForProduct(recipe.name).some(e=>e.id===recipe.id));
   const target=encyclopediaTarget(recipe);
   assert.equal(target.name,recipe.name);
   assert.ok(entries.some(e=>e.id===target.id));
  }
 }
});
