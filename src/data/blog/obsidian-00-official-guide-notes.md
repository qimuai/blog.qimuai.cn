---
author: "Aaron"
pubDatetime: 2025-08-15T10:07:43Z
title: "00-【笔记】Obsidian 官方使用指南"
draft: false
tags:
  - "笔记系统"
  - "obsidian"
legacyPaths:
  - "/posts/news-37"
description: "There’s no silver bullet solution that works perfectly for everyone. 每个人都应该去寻找自己的解决方案 和市面上绝大多数笔记软件不一样的是，Obsidian并不将你的笔记上..."
---

There’s no silver bullet solution that works perfectly for everyone.
每个人都应该去寻找自己的解决方案

和市面上绝大多数笔记软件不一样的是，Obsidian并不将你的笔记上传到云端系统，也不像印象笔记那样用导出后的特殊文件格式来捆绑你，使你基于沉没成本的原因，无法逃离。

![](https://qimuai.oss-cn-shenzhen.aliyuncs.com/20250815095601.png)

## 为什么要使用Obsidian？

#### 哪些人可以使用Obsidian：

First of all, tell me a little bit about what's your experience with note-taking apps like?
I have no prior experience
From standard note-taking|I’ve used note-taking apps like Evernote and OneNote
From plain-text note-taking|I have used plain-text based apps

#### Obsidian官方给了三个理由：

There are plenty of note-taking apps out there, so congratulations on finding Obsidian! You may have heard that Obsidian is really hard to use, but we assure you

There’s no silver bullet solution that works perfectly for everyone. Obsidian works best if you care about what we care about.

![](https://qimuai.oss-cn-shenzhen.aliyuncs.com/20250815095638.png)

Do you have any of the following concerns below?
→ [[Vault is just a local folder|I don’t want my notes to been seen by others]]
→ [[Vault is just a local folder|I don’t want my notes to be inaccessible someday]]
→ [[00-Plugins make Obsidian special for you|I have special needs that most note-taking apps might not meet]]

在Obsidian，数据库就是你的本地文件夹。他们和你在电脑上随意创建的文件夹并无二致，你可以随意拖拽、复制、删除或更改它们。

通过这种方式，你获得了自己数据和隐私的完全主导权。但是请记住，权力越大，责任越大。

我们不会把你的数据存储在我们的服务器里，这样你就不会在最需要这些笔记的时候，因为我们的服务器宕机或者遭到攻击而耽误事了。

如果你从Obsidian转移到其他地方，也不需要担心导出或转换的问题。保险库只是一个放在这里的文件夹--Obsidian不会因为你卸载了Obsidian而删除你的任何保险库文件夹。

最后，请理解，巨大的权力伴随着巨大的责任。现在你负责你的数据，你的工作也是对它进行备份并保证其安全。

> 注意！从技术上讲，你可以自由地移动你的保险库文件夹，就像你移动任何其他文件夹那样。但如果你这样做了，Obsidian会感到困惑，所以请确保在你移动它之后在新的位置用Obsidian再次打开它。

你或许听说过Obsidian设置起来很复杂。但是我们并不觉得是这样。当然，如果你想要完美的笔记系统，那将是很复杂的，不过，这对所有工具来说都是如此，因为它只是需要大量的试错来获得适合你的东西。与其说是复杂，不如说是一种爱的付出。

好了，总体来说，Obsidian可以很复杂，也可以很简单。比如说，三个简单的步骤就可以让你开始使用Obsidian：

## 1. Set up a nice place for yourself

在电脑等使用设备中，选择一个合适的文件夹来放置你的保险库。
保险库是你本地文件系统中的一个文件夹，Obsidian将你的笔记保存在这里。你可以把所有的笔记放在一个保险库里，也可以为你的不同项目创建几个保险库。

## 2. Jot down some notes

Obsidian的笔记以纯文本文件的形式存储，这使得它们的便携性非常好。通过用纯文本编写笔记，它们可以在任意应用程序中使用，即便不在Obsidian也可以。如果你打算长期保存你的笔记，这可是个好消息啊。

同时按住“Ctrl+N”，创建新笔记。

### 学习使用Markdown

#### A second brain, for you, forever.

> Obsidian is a **powerful** knowledge base on top of a local folder of plain text **Markdown files.**

学习Markdown语法→ [Markdown](https://en.wikipedia.org/wiki/Markdown) 以及 [[Format your notes]]

## 3. Let your ideas mingle

如何链接其他笔记 [[01-【官方】Link notes]]

虽然Obsidian很适合做笔记，但Obsidian的真正威力在于能够将你的笔记联系起来。通过了解一条信息与另一条信息的关系，你可以提高记忆能力，形成更深刻的见解。在本指南中，你将学习如何在Obsidian中创建和浏览链接。

In this step, you'll create two notes and link them together using the \[\[double bracket syntax\]\].

1.press the left square bracket (`[`) twice on your keyboard.
2.Type "three" to find the first note you created.
3.Press Enter to create a link to the highlighted note.

### 导航的三种方式

You can **create links to notes that don't exist yet**, for when you want to dive into a topic at a later time:
1.select the text;
2.Press the left square bracket (`[`) twice on your keyboard to create a link. The second link has a more muted color to indicate that the note doesn't exist yet;
3.Create the note by clicking on the link while pressing Ctrl (or Cmd on macOS).

A **backlink** lets you navigate in the opposite direction of an existing link.
1.Open the "Isaac Newton" note.
2.In the right side bar, click the **Backlinks** tab.
3.Under **Linked mentions**, click the mention in "Three laws of motion" to go to that note.

Using a visual representation of how your notes are connected.

1. In the top-right corner of the note, click **More options** (three dots).
   2.Select **Open local graph**.
   3.Click any of the nodes in the graph to navigate to that note.

随着你的保险库的增长，了解你的笔记是如何连接的会变得越来越困难。所以你应该了解如何使用图形视图从你的知识库中获得更深入的见解。
