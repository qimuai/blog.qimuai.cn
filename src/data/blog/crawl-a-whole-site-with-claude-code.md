---
author: "Aaron"
pubDatetime: 2025-08-31T19:22:34Z
title: "用Claude Code，十分钟爬取整个网站"
draft: false
tags:
  - "AI智能体"
  - "claude"
legacyPaths:
  - "/posts/news-406"
description: "事情是这样的，最近几天我在研究n8n，于是就想先把官方的文档全部爬下来，然后写一个程序来，自动进行翻译后，一个个实操。 这就是我的学习方式，虽然慢，但学得扎实。 这个事情如果让cursor等传统AI编程工具来做，就得先写一个python脚本..."
---

事情是这样的，最近几天我在研究n8n，于是就想先把官方的文档全部爬下来，然后写一个程序来，自动进行翻译后，一个个实操。

这就是我的学习方式，虽然慢，但学得扎实。

这个事情如果让cursor等传统AI编程工具来做，就得先写一个python脚本，然后自己去终端运行这个脚本，如果出现问题还需要调整后，再运行，再调整，再运行。

但是Claude code就不一样了。

新建一个用来放文档的文件夹，然后在终端打开。
![](https://qimuai.oss-cn-shenzhen.aliyuncs.com/20250831185127.png)

然后输入Claude（如果想让它全自主执行，就用这个命令：claude --dangerously-skip-permissions），Claude code就启动了。

![](https://qimuai.oss-cn-shenzhen.aliyuncs.com/20250831185231.png)

![](https://qimuai.oss-cn-shenzhen.aliyuncs.com/20250831190025.png)

然后输入这样的一个提示词：

```
我如何才能将这个页面和其子页面的内容都爬去下来，每个页面都保存成一个单独
的markdown文件：https://docs.n8n.io/
```

Claude code就开始自主规划（plan）、执行（execute）了。

![](https://qimuai.oss-cn-shenzhen.aliyuncs.com/20250831185304.png)

从上面的截图看，Claude code的思路非常清晰，先规划大的任务步骤，然后再分布规划大任务中的其中一个，逐个执行。成功一个，就自己打一个勾。压根不用怎么管。

![](https://qimuai.oss-cn-shenzhen.aliyuncs.com/20250831185701.png)

去喝杯水、聊聊天、摸会儿鱼，一会儿，就执行成功了。

![](https://qimuai.oss-cn-shenzhen.aliyuncs.com/20250831190219.png)

然后就是验收成果，我打开看里面的文件里面的内容是代码，应该是这家伙连代码结构一起爬取下来了。所以，就继续命令他，让他修复。

![](https://qimuai.oss-cn-shenzhen.aliyuncs.com/20250831190344.png)

面对未知的错误，Claude code自己分析问题、寻找错误原因、修复，然后再次进行任务规划、执行。

![](https://qimuai.oss-cn-shenzhen.aliyuncs.com/20250831190611.png)

整个过程，你会发现他并不是传统的rpa那种既定好的工作流，也不是扣子、n8n这样的批着智能体外衣的工作流，他就是真正意义上的，

初代智能体。

在我看来，真正的智能体应该是以LLM（大模型）为主的，tools、mcp这些东西只是辅助，而大模型才是最终的操作者，他不是执行既定流程的机器人，而是能自主规划、判断、执行的智能体。

或许，这就是这个阶段，AGI最成熟的状态。

本人关注AI智能体、工作流等在自媒体领域的应用，如有需求，请加微信详聊：qimugood。

![](https://qimuai.oss-cn-shenzhen.aliyuncs.com/20250831191152.png)
