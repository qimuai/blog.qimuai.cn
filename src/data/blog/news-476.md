---
author: "Aaron"
pubDatetime: 2025-09-03T15:56:53Z
title: "如何利用脚本尽量将epub2md自动化？"
draft: false
tags: []
description: "有些书过于经典，因此我想将epub格式的书籍转换成markdown格式，放在Obsidian或者其他支持markdown格式的软件里进行渐进式总结阅读、编辑消化以及后期搜索，因此就有了这个项目。 如果书籍不是epub格式，首先我们需要将其格..."
---

有些书过于经典，因此我想将epub格式的书籍转换成markdown格式，放在Obsidian或者其他支持markdown格式的软件里进行[[渐进式总结]]阅读、编辑消化以及后期搜索，因此就有了这个项目。

## 1⃣️ 解压epub

如果书籍不是epub格式，首先我们需要将其格式转换成epub，建议使用calibre。

然后使用zip解压软件，解压epub文件。不要像我一样觉得惊奇😮，按照ChatGPT的说法：

> epub本质上是一个ZIP文件，包含了一系列的HTML、图像和样式表等文件。

所以，我们可以用7-Zip等ZIP解压工具来解压epub文件。

## 2⃣️ 用脚本进行转换

解压之后，经过我的实验，每个文件夹里的内容都略有不同，而且文件格式有些是html、有些是xhtml。

如果解压后，在解压文件保存的一级文件夹或者二级的“text”文件夹找到，那么文件格式为html；

如果解压后，在“OEBPS-Text”这个文件层级里找到，那么文件格式就是xhtml。

两者有何区别呢？ChatGPT的说法：

> HTML是用来描述网页的标准标记语言；
> HTML（Hypertext Markup Language）和 XHTML（Extensible Hypertext Markup Language）是用于构建网页的标记语言。它们之间的主要区别在于语法和严格性。

语法方面，比如HTML对于标签的大小写不敏感，而XHTML对大小写敏感。XHTML要求所有标签都必须被正确地嵌套和关闭，并且所有属性必须用引号括起来。

兼容性方面，由于XHTML的严格性要求，通常更具有跨浏览器和跨平台的兼容性。HTML则在一些情况下可能会有一些差异，特别是在旧版本的浏览器中。

了解了两者的区别后，我们就来转换吧。

首先，如果你的Windows电脑还没安装Pandoc，那么先去安装：[Pandoc - Installing pandoc](https://pandoc.org/installing.html)

其次，编写批处理脚本:

- 创建一个新的文本文件，命名为“html2md.txt"
- 在这个txt文本中加入以下脚本内容：

```
@echo off
for %%i in (*.html) do (
	echo "Converting %%i..."
    pandoc "%%i" -o "%%~ni.md"
)
pause
```

如果文件格式是xhtml，就把`“*.”`后的”html“换成“xhtml”。

- 保存关闭文件后，将文件重命名为 "html2md.bat"。

最后，将脚本和html同一文件夹下，双击打开，在弹出的命令行窗口看到转换过程，完成后按任意键继续，退出就算转换成功了。

## 3⃣️ 将同一个章节的md文件合并为一个并优化显示

将html文件转换成markdown文档后，会发现得到的md文件名称是由一些英文单词、数字或下划线组成，而不是书籍每个章节的标题。

这时候怎么弄呢？这就需要我们判断md文件名的规律，以及每个文件里面，表示一二三级标题的方式。

这方面xhtml做得很好，会有符合markdown文档的标题符号，但是html就没有，它们往往是这样的：

> [[第一模块]{.bold}]{.calibre1}

和这样的：

> [[第一章]{.bold}]{.calibre6}

不过不管形式怎样，我们处理的方法都是一致的：1.首先观察markdown文件中，标题显示的规律。

- 如果标题有明确的`#`，那么就利用deletemore.py 删除多余的{}里面的内容；
- 如果没有明确的`#`，那么则利用format_html-md_titles.py两个程序选择合适的一个，将诸如`[bold]{calibre3}`这样的内容，转换为markdown标准的标题格式。

  2.处理好标题后，接下来我们就来将属于同一章节的markdown文件按顺序合并为一个，这时候利用 html2md_merger.py (`##`) or xhtml2md_merger.py(`#`)，来进行同一章节内容的合并。

  3.最后，利用titleasfilename.py 提取标题改变文件名。

  4.如果你用Obsidian，这还可以在该本书的文件夹下，新建一个和当epub被解压后得到的图片文件夹一样的文件名（通常是`images`)，然后将图片复制进去，这样有些格式就可以匹配原文中的图片。当然这得看运气🍀）

PS，在运行Python脚本时，一定注意⚠️将路径换成自己markdown文件所在的文件夹路径。

最后的最后，学会观察代码规律的话，可以举一反三，应对多种标题格式。

---

[[2023-08-13]]更新

几乎是在我研究好了这套流程的同时，Obsidian官方开发了同款资料导入插件，不仅可以导入html，而且印象笔记、notion、Google Keep等格式的笔记也可以导入。

不过，在使用了之后，感觉还是不能识别有些html，导入的文件名也需要用我们前面提到的方法处理，所以这套流程和方法还是有用的。
