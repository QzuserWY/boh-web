# 百科数据说明

原始资料：上级目录的 `司辰之书.xlsx`，只读提取，不修改文件。百科每条记录保留工作表和单元格来源。由 `scripts/import_encyclopedia.py` 生成本地数据，使用 Python + openpyxl；运行前需先有技能数据 `src/data.json`。

收录：上树技能、技艺配方、回忆与天气、工作台、工具、饮食与食谱、助手、访客沙龙、探索参考。不同类别同名条目不合并；饮食以饮食页为主，食谱页原文作为对照；混排花园保留原表。闰识默认隐藏。配方缺失与可疑自引用保留提示。关联链接为名称引用，不是可用性判定。

规则摘要人工整理于 2026-09-22，参考：
- https://boh.huijiwiki.com/wiki/新手指南
- https://boh.huijiwiki.com/wiki/魂质
- https://boh.huijiwiki.com/wiki/FAQ
- 技能可选分支与魂质：https://boh.huijiwiki.com/wiki/列表/魂质获得

Wiki 直接访问存在 403 限制，参考可检索页面内容与原表；这不是完整、实时 Wiki 镜像。未查证或原表未提供的信息不补猜。

制作配方补全（2026-09-30）：原表「技艺」只记下每个产物的部分技能。对已收录产物，按各技能页的 Crafting / Item Creation 表补上缺失技艺，并修正两处原表疑点（未命名的铸 15 产物为赤化精华；鼓点与舞步制作孔雀石圣餐的材料为铜梨）。曙光灵液补入力量之墨（引 10、光源）、沙的故事（引 10、光源）、景象与感知（穹 10、光源），与原有的曙光的静观、守夜人的悖论并列。香料与滋味以 Honeyscar Jasmine 制作阿佐特的一行，中文材料名未能在现有资料中核对，故不写入。

核对方式：中文技能名沿用本项目与 [模块:SignifierIdMap](https://boh.huijiwiki.com/wiki/模块:SignifierIdMap)。灰机页面 [列表/技艺](https://boh.huijiwiki.com/wiki/列表/技艺)、[曙光灵液](https://boh.huijiwiki.com/wiki/曙光灵液) 及各技能页为对照入口；2026-09-30 直接请求灰机时被 Cloudflare 拦截，配方正文取自同日抓取的英文 Fandom 对应技能页（例如 [Inks of Power](https://book-of-hours.fandom.com/wiki/Inks_of_Power)、[Sights & Sensations](https://book-of-hours.fandom.com/wiki/Sights_%26_Sensations)、[Sand Stories](https://book-of-hours.fandom.com/wiki/Sand_Stories)、[Auroral Contemplations](https://book-of-hours.fandom.com/wiki/Auroral_Contemplations)、[Watchman's Paradoxes](https://book-of-hours.fandom.com/wiki/Watchman%27s_Paradoxes)）。技能页未列出的技艺不添加。补充条目与修正记在 `src/wiki-craft-additions.json`，重新运行 `scripts/import_encyclopedia.py` 时会合并，不覆盖这部分。

原表首页声明 CC BY-SA 4.0，并致谢司辰之书中文 Wiki、碎门之钥、Fandom Wiki。原表发布地址：https://tieba.baidu.com/p/9279024090 。本目录的衍生百科资料沿用 CC BY-SA 4.0：https://creativecommons.org/licenses/by-sa/4.0/deed.zh-hans 。游戏内容版权属于 Weather Factory。结构化、分类、关联和短规则摘要为本次改编。
