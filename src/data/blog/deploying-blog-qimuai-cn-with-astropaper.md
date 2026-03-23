---
author: Aaron
pubDatetime: 2026-03-23T10:10:00Z
title: 用 AstroPaper 重建 blog.qimuai.cn
featured: false
draft: false
tags:
  - Astro
  - 部署
  - GitHub Actions
description: 记录 blog.qimuai.cn 从选择模板、替换默认内容，到准备自动部署链路的过程。
---

这次重建 `blog.qimuai.cn`，目标很明确：

- 界面要足够简洁
- 代码仓库要放在 GitHub
- 更新流程要能自动化
- 部署结果要稳定落在现有腾讯云服务器上

## 为什么最后选了 AstroPaper

我先看了几套极简博客模板，最后还是选了 AstroPaper，原因主要有三点：

1. 它足够轻，默认结构清楚。
2. 搜索、RSS、OG、分页这些基础能力已经准备好了。
3. 它简洁，但不至于像“纯白文档页”那样过于单薄，稍微改一下就能做出自己的气质。

## 这次改了哪些地方

第一轮主要做的是“去模板味”：

- 把站点配置改成 `blog.qimuai.cn`
- 把整套界面文案切成中文
- 去掉默认示例文章，换成自己的首批内容
- 调整配色、页脚、首页 Hero 和 favicon

## 接下来会继续补什么

站点本身只是起点，真正重要的是后面的持续更新链路。

接下来会把这些事情补齐：

- GitHub 仓库自动构建
- 自动发布到腾讯云服务器
- `blog.qimuai.cn` 独立站点与证书
- 持续写入真实的技术内容

等自动部署链路全部接通后，这个博客就可以真正进入“写完就发”的状态了。
