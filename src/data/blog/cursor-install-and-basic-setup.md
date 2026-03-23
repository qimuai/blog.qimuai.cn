---
author: "齐木"
pubDatetime: 2024-11-28T20:56:00+08:00
title: "Cursor安装与基础配置手把手教你让AI自动写代码"
draft: false
tags: []
description: "你是否曾梦想过，只需轻轻一点，AI就能为你自动编写出高效、准确的代码？今天，我要带你走进 Cursor 的世界，感受这款编程神器的魅力！🎉 🎯 Cursor简介 Cursor，作为VS Code的一个分支，不仅继承了其强大的功能，还加入了A..."
---

你是否曾梦想过，只需轻轻一点，AI就能为你自动编写出高效、准确的代码？今天，我要带你走进 Cursor 的世界，感受这款编程神器的魅力！🎉

🎯 Cursor简介

Cursor，作为VS
Code的一个分支，不仅继承了其强大的功能，还加入了AI智能编码的独特优势。无论你是编程新手还是资深开发者，Cursor都能为你带来前所未有的编程体验。

Cursor官方指引文档：  
https://docs.cursor.com/get-started/migrate-from-vscode

## 下载与安装

打开下载：  
www.cursor.com

安装完成后，别忘了安装汉化插件，让你的Cursor更加亲切易用。  
安装汉化插件：

![](https://mmbiz.qpic.cn/mmbiz_png/Zy0rD7suubiaTaIkIhmjyuCtrbG0Ffvo8PEVWObpcckC9WsV4pEdPPt0E3OCNAwiayGaQU9lGp7ib1cRpibSicjfwXg/640?wx_fmt=png&from=appmsg)

开始引导

![](https://mmbiz.qpic.cn/mmbiz_png/Zy0rD7suubiaTaIkIhmjyuCtrbG0Ffvo8Huw007xbMB72NnDNWiaia44sN3rrfj5SXW4J0EC3fPWcraMnT2xhtI8A/640?wx_fmt=png&from=appmsg)

## 基础配置

安装完成后，接下来就是激动人心的基础配置环节啦！打开Cursor，进入 general 设置页面。

在general里设置（最适合新手的）Rule for AI：

```
你是个具有优秀编程习惯的AI，但你也知道自己作为A的所有缺陷，所以你总是遵守以下规则:
   ## 架构选择1.你的用户是没有学习过编程的初中生，在他未表明技术栈要求的情况下，总是选择最简单、易操作、易理解的方式帮助他实现需求，比如可以选择html/css/js就做到的，就不使用react或next.js的方式;2.总是遵守最新的最佳实践，比如撰写Nextjs 项目时，你将总是遵守Nextjs14版本的规范(比如使用approuter而不是pages router)，而不是老的逻辑；3.你善于为用户着想，总是期望帮他完成最省力操作，尽量让他不需要安装新的环境或组件。
   ## 开发习惯1.开始一个项目前先读取根目录下的readme文档，理解项目的进展和目标，如果没有，则自己创建一个;2.在写代码时总是有良好的注释习惯、写清楚每个代码块的规则;3.你倾向于保持代码文件清晰的结构和简洁的文件，尽量每个功能，每个代码组都独立用不同的文件呈现;
   ## 设计要求1.你具有出色的审美，是apple inc.工作20年的设计师，具有出色的设计审美，会为用户做出符合苹果审美的视觉设计;2.你是出色的svg设计师，当设计的网站工具需要图像、icon时，你可以自己用svg设计一个。
   ## 对话风格1.总是为用户想得更多，你可以理解他的命令并询问他想要实现的效果;2.当用户的需求未表达明确，容易造成误解时，你将作为资深产品经理的角色一步步询问以了解需求;3.在完成用户要求的前提下，总是在后面提出你的进一步优化与迭代方向建议。
```

from：AI进化论-花生

建议打开：  
![](https://mmbiz.qpic.cn/mmbiz_png/Zy0rD7suubiaTaIkIhmjyuCtrbG0Ffvo8wW6uZw1jBdsnfSP0zQdI48x8jQETBn0aqXuM9g4O5mz45YVfaZic89Q/640?wx_fmt=png&from=appmsg)

模型选择：建议把效果不好的模型去掉  
初期可以先白嫖Cursor的免费额度，后面再填写API Key。

![](https://mmbiz.qpic.cn/mmbiz_png/Zy0rD7suubiaTaIkIhmjyuCtrbG0Ffvo8ibbpk00GeCiaibT3swwNsnViaZUc10MTBdRbc3D5PZJCicMWUcMYDVK0RxA/640?wx_fmt=png&from=appmsg)

Docs设置

![](https://mmbiz.qpic.cn/mmbiz_png/Zy0rD7suubiaTaIkIhmjyuCtrbG0Ffvo8ctWegUBB5eCmggfF14JFYicqMTXTWVxrAwt3WOAQAptL5h0rTe9jO0Q/640?wx_fmt=png&from=appmsg)

Chat部分关掉搜索功能，因为 AI回乱搜索，效果不好。

![](https://mmbiz.qpic.cn/mmbiz_png/Zy0rD7suubiaTaIkIhmjyuCtrbG0Ffvo8MNXib23SLILwWQqQK1P3EeicnA4U0C4hNUN55a49BdrcCMPQWcdrNuxg/640?wx_fmt=png&from=appmsg)

打开终端

![](https://mmbiz.qpic.cn/mmbiz_png/Zy0rD7suubiaTaIkIhmjyuCtrbG0Ffvo8cBKnjZ0sYsSt2WzZBLUVXJI5icT0cN6e7qEaTcu6FzMPM4Hva9MQfNw/640?wx_fmt=png&from=appmsg)

200K的长文本记得打开：

![](https://mmbiz.qpic.cn/mmbiz_png/Zy0rD7suubiaTaIkIhmjyuCtrbG0Ffvo8DwL80QBy05Cbd9J3VVgXC5nIl3MrDZNJaX3dyspuZnibibpiaZT7dkpqg/640?wx_fmt=png&from=appmsg)

## 开始使用

![](https://mmbiz.qpic.cn/mmbiz_png/Zy0rD7suubiaTaIkIhmjyuCtrbG0Ffvo8wPjKibiaTfRZNUh8fGF9ZSLicaKUhXhIiayNJTlND9YQiaHMYuBX1TQQIyA/640?wx_fmt=png&from=appmsg)

新建文件夹名，不要用中文，最好用拼音或英文  
![](https://mmbiz.qpic.cn/mmbiz_png/Zy0rD7suubiaTaIkIhmjyuCtrbG0Ffvo8t8D8cyY6KoViaAavzW1DHKDZzPeOnib1Ix3ekdv4icn4oQIc0ZP5wbd6g/640?wx_fmt=png&from=appmsg)

command/ctrl+i调出对话框  
![](https://mmbiz.qpic.cn/mmbiz_png/Zy0rD7suubiaTaIkIhmjyuCtrbG0Ffvo8sbumGyolMvica2qa1ibrBJKPII9Dv6NIbOBDXDFLJic5yeGhSxMtKxeew/640?wx_fmt=png&from=appmsg)

输入需求后，按enter键，AI就开始自动写代码了

比如，你可以输入下面这个需求，看看会得到什么样的东西：

> 我想做一个图像压缩网站，能让我上传图片进行压缩，我希望有预览和下载压缩后的图片的功能

![](https://mmbiz.qpic.cn/mmbiz_png/Zy0rD7suubiaTaIkIhmjyuCtrbG0Ffvo8TXziauLnnZZVjpZNSvQty8AHTKGJibs9siatJuvs95UKkYFAjoQsCPXlw/640?wx_fmt=png&from=appmsg)

![](https://mmbiz.qpic.cn/mmbiz_png/Zy0rD7suubiaTaIkIhmjyuCtrbG0Ffvo8B5BUBA5NukGh8A847MfMg4PfMbCuDqPFnLyJPezibTrGPJz2jPbUtOQ/640?wx_fmt=png&from=appmsg)

![](https://mmbiz.qpic.cn/mmbiz_png/Zy0rD7suubiaTaIkIhmjyuCtrbG0Ffvo8Hc56q72ffia2HO99vxEtriaaCMa0ib7oMCPnZy2ibRNkBskN8ZDF7iaVicug/640?wx_fmt=png&from=appmsg)

比如我们这个案例，在文件夹中打开index.html

![](https://mmbiz.qpic.cn/mmbiz_png/Zy0rD7suubiaTaIkIhmjyuCtrbG0Ffvo8ehb44oBbdgKU0geiaYhzO4iaAWNXoPRBvQw8rZWicC01A5RT5IgkOc8GA/640?wx_fmt=png&from=appmsg)  
就会自动跳转到浏览器，看起来还不错

![](https://mmbiz.qpic.cn/mmbiz_png/Zy0rD7suubiaTaIkIhmjyuCtrbG0Ffvo8Omyuk5UPm61JSyDJk6BdAKHKiaUdwibJKqB7EYnBHte37v1XgNLpQRfg/640?wx_fmt=png&from=appmsg)

上传图片之后，测试了还不错，压缩后的图片可以下载

![](https://mmbiz.qpic.cn/mmbiz_png/Zy0rD7suubiaTaIkIhmjyuCtrbG0Ffvo83TPpNSW50ZBpV6uunu5AITVyHKLATcJibU3IlPDY4aic6pLBPJs3I4NQ/640?wx_fmt=png&from=appmsg)

## 小技巧

当你不清楚哪里出了问题时：描述现状后，@codebase

## 上架第一个小应用

下面是我第一次用Cursor时写的第一个小应用，已经开源，欢迎使用。

上传到GitHub的链接：  
https://github.com/qimuai/image-compressor

vercel连接GitHub后，一键部署发布网页端，就可以发给自己的亲朋好友用了：  
https://image-compressor-qimuais-projects.vercel.app/
