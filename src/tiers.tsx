export const tierSource='https://boh.huijiwiki.com/wiki/游戏技巧#常见实用技能';
export const tiers:Record<string,'T0'|'T1'>={
 '武力之敕令':'T0','伟大符印与伟大伤疤':'T0','鼓点与舞步':'T0','弦乐与歌谣':'T0','景象与感知':'T0','曙光的静观':'T0',
 '伤疤的戒律':'T1','嬗变与解放':'T1','雕珀与琢石':'T1','锁簧与发条':'T1','昆虫与花蜜':'T1','收容之墨':'T1',
};
export function TierBadge({id}:{id:string}){return tiers[id]?<span className={`tier-badge tier-${tiers[id]}`} title="中文 Wiki 推荐评级，不代表上树档位">{tiers[id]}</span>:null;}
export function TierNote({id}:{id:string}){return tiers[id]?<p className="hint"><TierBadge id={id}/> 推荐评级 · <a href={tierSource} target="_blank" rel="noreferrer">中文 Wiki「游戏技巧」</a>（2026-09-22 核对）。玩家培养与制作评价，不代表上树顺序；未标注不等于低评级。</p>:null;}
