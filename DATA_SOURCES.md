# 百科数据说明

原始资料：上级目录的 `司辰之书.xlsx`，只读提取，不修改文件。百科每条记录保留工作表和单元格来源。由 `scripts/import_encyclopedia.py` 生成本地数据，使用 Python + openpyxl；运行前需先有技能数据 `src/data.json`。

收录：上树技能、技艺配方、回忆与天气、工作台、工具、饮食与食谱、助手、访客沙龙、探索参考。不同类别同名条目不合并；饮食以饮食页为主，食谱页原文作为对照；混排花园保留原表。闰识默认隐藏。配方缺失与可疑自引用保留提示。关联链接为名称引用，不是可用性判定。

规则摘要人工整理于 2026-09-22，参考：
- https://boh.huijiwiki.com/wiki/新手指南
- https://boh.huijiwiki.com/wiki/魂质
- https://boh.huijiwiki.com/wiki/FAQ
- 技能可选分支与魂质：https://boh.huijiwiki.com/wiki/列表/魂质获得

Wiki 直接访问存在 403 限制，参考可检索页面内容与原表；这不是完整、实时 Wiki 镜像。未查证或原表未提供的信息不补猜。

原表首页声明 CC BY-SA 4.0，并致谢司辰之书中文 Wiki、碎门之钥、Fandom Wiki。原表发布地址：https://tieba.baidu.com/p/9279024090 。本目录的衍生百科资料沿用 CC BY-SA 4.0：https://creativecommons.org/licenses/by-sa/4.0/deed.zh-hans 。游戏内容版权属于 Weather Factory。结构化、分类、关联和短规则摘要为本次改编。
