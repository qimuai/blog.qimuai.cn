---
author: "Aaron"
pubDatetime: 2025-08-22T14:04:44Z
title: "02 【手把手】Obsidian图片管理神器，9元解决所有烦恼！"
draft: false
tags:
  - "笔记神器"
legacyPaths:
  - "/posts/news-213"
description: "Markdown最大的弊端在于，它对于图片的处理能力有限。 图片存储与管理 Markdown文件本质上是纯文本文件，图片需要单独存储在本地或远程服务器上。用户需要手动管理图片的存储路径和文件名，容易导致路径混乱或图片丢失。 图片路径问题 即..."
---

![cover_image](https://mmbiz.qpic.cn/mmbiz_jpg/7gUcXEXgcvcbzh4iclo9VL5niaia1lQ2VyicDeNBibHG0rcMUWmj90Q4C6sUrWlZCz7XHgGjGCkibnJfhWzicITvibTnxQ/0?wx_fmt=jpeg)

Markdown最大的弊端在于，它对于图片的处理能力有限。

**图片存储与管理**

Markdown文件本质上是纯文本文件，图片需要单独存储在本地或远程服务器上。用户需要手动管理图片的存储路径和文件名，容易导致路径混乱或图片丢失。

**图片路径问题**

即便你全部都在本地使用，但是Markdown插入图片时需要指定图片的路径（相对路径或绝对路径）。如果文件夹结构发生变化，路径可能会失效，导致图片无法显示。

**缺乏图片编辑功能**  
Markdown本身不支持对图片进行编辑（如调整大小、裁剪、添加滤镜等）。如果需要调整图片，用户必须借助外部工具，增加了操作复杂性。

**跨平台兼容性**  
不同的Markdown渲染器对图片的支持可能有所不同。例如，有些渲染器支持本地图片，有些则需要图片托管在网络上。跨平台使用时，图片可能无法正常显示。

......

这诸多的问题，多多少少都在困扰着Markdown以及Obsidian的用户。

今天我们就来以极低的成本，尝试解决其中的一块问题：图片存储

## 我为什么选用图床？

我以前用Obsidian或者说Markdown，图片处理全部是本地或者通过同步工具进行同步。

不过，自从在Obsidian上写了篇文章，复制到微信公众号进行排版，折腾图片搞了我好久后，我就开始苦寻他法，想要把这个痛苦的卡点流程给解决掉。

很自然地，我在2024年最后一天找到了图床方案。接下来，就给大家介绍一下，如果用极低的成本（9元/年）的成本，来解决在使用Obsidian时图片存储和分发的问题。

## 先装两个东西

首先，我们需要安装两个东西。

一个是Obsidian里面的插件：Image auto upload。

这个简单，在OB的插件商场里面，搜一下就可以找到。

![](https://qimuai.oss-cn-shenzhen.aliyuncs.com/20250822140022.png)

找到后，安装、启用，然后先放在一边。

我们安装另一个：PicGo

这个也很简单，去下面的地址下载对应电脑的安装包就行： https://github.com/Molunerfinn/PicGo/releases <sup><span>[1]</span></sup>

不过，M系列芯片的Mac可能会安装不了，打开报错：文件已损坏。
![](https://qimuai.oss-cn-shenzhen.aliyuncs.com/20250822140043.png)

这个时候，别慌，只需要，

1. 打开终端输入以下内容，“为安装路径，默认是以下路径”

```
sudo xattr -d com.apple.quarantine "/Applications/PicGo.app"
```

1. 按照提示输入电脑锁屏密码回车,然后重新安装即可。

这两个东西都安装好后，我们就可以去找图床的服务商了。

## 选哪个图床？

Claude给我推荐了四个方案：

- GitHub + PicGo （最推荐）
- 阿里云OSS + PicGo
- 腾讯云COS + PicGo
- 七牛云 + PicGo

这里面，处理腾讯云的，其他三个我都试过。

## 方案1

首先折腾的是方案1，GitHub+PicGo，毕竟Claude极力推荐：免费、靠谱（GitHub），流程也简单：

- 登录GitHub（没有的话搞一个）
- 新建一个仓库（一定要选公开）
- 如下图，搞到token
  ![](https://qimuai.oss-cn-shenzhen.aliyuncs.com/20250822140106.png)

然后，就到PicGo里面配置了。

```
1. 下载PicGo: https://github.com/Molunerfinn/PicGo/releases
2. 安装PicGo
3. 在PicGo中配置GitHub图床：
   - 仓库名: 你的用户名/仓库名（如 username/blog-images）
   - 分支名: main
   - Token: 刚才生成的token
   - 存储路径: img/（可选）
   - 自定义域名: 可选填jsDelivr CDN加速链接
     格式：https://cdn.jsdelivr.net/gh/用户名/仓库名
```

这个部分成功的标志就是，你在【上传区】上传的图片，能够在相册里面看到，其他的几个方案也是这样测试。

![](https://qimuai.oss-cn-shenzhen.aliyuncs.com/20250822140130.png)

最后呢，我们就可以配置Obsidian里面的插件了。

这个部分，很简单，把在PicGo里面设置的域名，复制到插件的【PicGo server 上传接口】就OK了，其他默认。

![](https://qimuai.oss-cn-shenzhen.aliyuncs.com/20250822140152.png)

然后，当你将一张图片粘贴到obsidian文档时，就会出现如下【Uploading file】标志，这说明配对成功，已经可以使用了。

![](https://qimuai.oss-cn-shenzhen.aliyuncs.com/20250822140207.png)

这个方案好是好，但你我皆知，GitHub在国内的访问处于薛定谔状态，我复制到公众号和知乎去，就有图片硬是都加载不出来。最后只能另寻他法。

## 方案2

七牛云，据说你注册了就给10GB终身存储空间，然后每个月还有10GB，对于我来说完全够用。所以，又是一个白嫖方案。

当时七牛云，很麻烦，各种要求验证邮箱📮、实名验证，很繁琐。

最后，我好不容易弄下来，试了下发现：

![](https://qimuai.oss-cn-shenzhen.aliyuncs.com/20250822140232.png)

即便已经被官方警告临时地址只给用30天，但是没想到，竟然还是要给设置自定义访问域名，而且是必须备案的域名，才能给在Obsidian用。

![](https://qimuai.oss-cn-shenzhen.aliyuncs.com/20250822140243.png)

所以，搞了很久，还是放弃了。

这时候，阿里云成了救命稻草。虽然要花钱，但是架不住很便宜。

## 方案三

阿里云的图床设置我是参考了这篇文章： https://zhuanlan.zhihu.com/p/104152479 <sup><span>[2]</span></sup>

但是，可能是博主写得早，有些地方阿里云改了。

![](https://qimuai.oss-cn-shenzhen.aliyuncs.com/20250822140302.png)

再比如，直接在这个创建Bucket的界面，其实是选不了将【读写权限】改为“公共读”的，需要创建好后，去这个Bucket主页修改。

![](https://qimuai.oss-cn-shenzhen.aliyuncs.com/20250822140323.png)

不过瑕不掩瑜，在这个教程的帮助下，顺利搞定阿里云存储，花了27元（9元/年）买了3年的40GB存储，我想够我传文章用了。

![](https://qimuai.oss-cn-shenzhen.aliyuncs.com/20250822140345.png)

http://127.0.0.1:36677/upload <sup><span>[3]</span></sup>

## 小结

图片的处理一直是Obsidian最让我头痛的问题，在这2024年的最后一天，我终于搞定了它，后面就是努力码字，把我的27块大洋赚回来了（bushi）。

Ps，图片查看、图片编辑这些其实都有对应的插件，后面有需要的话，可以再介绍。

我是qimu，一个喜欢折腾的创业极客，欢迎加我微信交流：qimugood。

### 引用链接

\[1\] *https://github.com/Molunerfinn/PicGo/releases*
\[2\] *https://zhuanlan.zhihu.com/p/104152479*
\[3\] *http://127.0.0.1:36677/upload*
