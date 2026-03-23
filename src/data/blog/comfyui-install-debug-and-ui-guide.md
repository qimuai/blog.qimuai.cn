---
author: "齐木"
pubDatetime: 2024-04-11T18:05:00+08:00
title: "一站式解决 ComfyUI 安装、调试和界面操作，附安装包 C001"
draft: false
tags: []
description: "本地安装 提醒！以下所有安装操作，都需要在全局科学上网的情况下操作。当然，如果你不能科学上网，也可以 在文章结尾找到我为你打包的安装包，直接在国内网盘里下载。 ComfyUI本体安装 下载页面 https://github.com/comf..."
---

### **本地安装**

提醒！以下所有安装操作，都需要在全局科学上网的情况下操作。当然，如果你不能科学上网，也可以 \*\*在文章结尾找到我为你打包的安装包，直接在国内网盘里下载。

### **ComfyUI本体安装**

下载页面
**https://github.com/comfyanonymous/ComfyUI**

#### **点击打开以上网页，页面往下拉，找到“** Direct link to download **”，点击即可下载官方安装包。**

\*\*![](https://mmbiz.qpic.cn/mmbiz_png/Zy0rD7suubjpfneiamPvly6hATdjR96D9BAIB09F3rp4yMobQkZsDlGjG9SeagpbJGy0lgyZyEvnB83PZia9iapQw/640?wx_fmt=png&from=appmsg)

下载完成后，将安装包移动到你想要安装的地方，解压（推荐使用7-Zip），然后点击“run_nvidia_gpu.bat”，等待加载，期间可能需要下载一些文件。

成功的话会自动弹出一个浏览器窗口。这就算安装好了，以后打开按此方法就行。

## **节点安装**

#### **方法1**

首先要安装的节点（插件），就是ComfyUI-
Manager。安装方法很简单，在你的ComfyUI安装文件夹里，找到一个叫“custome_nodes”的文件夹，打开之后在搜索栏输入“cmd”，回车打开一个黑乎乎的页面。

![](https://mmbiz.qpic.cn/mmbiz_png/Zy0rD7suubjpfneiamPvly6hATdjR96D9JzdhlkxKJkm5KkObeictMJ9Q5NVEiaA9VnqIA5ibmKLFMpE3WAj2deZwg/640?wx_fmt=png&from=appmsg)

在这个页面，复制下面的节点仓库代码回车就行：
git clone https://github.com/ltdrdata/ComfyUI-Manager.git

这就是ComfyUI节点的一种安装方法。

#### **方法2**

另外一种方法是，在我们刚刚安装的ComfyUI-Manager里面直接搜索安装。

如果安装成功了，在ComfyUI的界面，最右端的菜单栏最下面，会有一个“Manage”的按钮，点它！（记住这个万能按钮，以后会经常用到）。

![](https://mmbiz.qpic.cn/mmbiz_png/Zy0rD7suubjpfneiamPvly6hATdjR96D9ibF2rkdJ6u0w17SansSUaoaXUdDegPaEOLk63cBOoh1NWdEHDLVibkuQ/640?wx_fmt=png&from=appmsg)

点进去之后，再点击“Install Custom Nodes”，稍等片刻，弹出另一个窗口，在搜索栏输入要安装的节点名称，点击“Search"找到要安装的节点，点击”Install“，下面会显示一行绿色的字，表示正在安装：Installing 'Recognize Anything Model (RAM) for ComfyUI'。

![](https://mmbiz.qpic.cn/mmbiz_png/Zy0rD7suubjpfneiamPvly6hATdjR96D9qdsFWUqlTCK9aXMlSn4pZloiaWL1oektib1jVFj227zIIzUQMwJKib3ZQ/640?wx_fmt=png&from=appmsg)

![](https://mmbiz.qpic.cn/mmbiz_png/Zy0rD7suubjpfneiamPvly6hATdjR96D9rCVibYahTlfLTTUdIosibJMTzfyYkOmYpwCBgdd47z9GYSjlAexjkVtw/640?wx_fmt=png&from=appmsg)

网络不行话，会显示下面的红色字体：”install failed: Recognize Anything Model (RAM) for ComfyUI”

![](https://mmbiz.qpic.cn/mmbiz_png/Zy0rD7suubjpfneiamPvly6hATdjR96D9Uic7IA5rQSVhyKhC0rlgaBdLMgkWYdjBziaZ1jqIqAanuzCxU0KicIMicw/640?wx_fmt=png&from=appmsg)

![](https://mmbiz.qpic.cn/mmbiz_png/Zy0rD7suubjpfneiamPvly6hATdjR96D9sEWF7vbz27BDljv2a5c46xib7WqInvjezFlw1Wmq6Y2iaAeqM5JQ6ibaA/640?wx_fmt=png&from=appmsg)

这个没关系，我们等网络好了，再故技重施。于此同时我们可以到命令行工具里面去看进程，看到下面这种进度白条拉满的样子，就是安装好了。然后重启ComfyUI，这个节点就算安装完成！

![](https://mmbiz.qpic.cn/mmbiz_png/Zy0rD7suubjpfneiamPvly6hATdjR96D9EtDPHlP8jiaIwuW8uahCzmQ1g4dI8G7NUj7eCNMVZJmcX9ObIl03uNg/640?wx_fmt=png&from=appmsg)

![](https://mmbiz.qpic.cn/mmbiz_png/Zy0rD7suubjpfneiamPvly6hATdjR96D9ryiammSLNkHcG86B8fYx27AEYWkbQXDgn8forYksddLLdBn8ib2h1cxg/640?wx_fmt=png&from=appmsg)

#### **方法3**

到GitHub上去下载安装包（如下图），然后解压到“custome_nodes”文件夹，重启ComfyUI就可以了。

![](https://mmbiz.qpic.cn/mmbiz_png/Zy0rD7suubjpfneiamPvly6hATdjR96D9Z9nXMBNaibXywsSVvaOiaiaTXibsSjT6ytmkperGg7TxZDmMDgOfIfpvicQ/640?wx_fmt=png&from=appmsg)

### **节点推荐**

好，了解了节点的安装方式后，我再推荐几个必装节点

好，到目前我们已经学会了安装ComfyUI和安装ComfyUI运行所需的节点。接下来，我们来设置一下操作界面。

1.ComfyUI-Crystools

**git clone https://github.com/crystian/ComfyUI-Crystools.git**

**or 在CM搜索“Crystools”**

使用这个款节点，可以直接在页面看到资源监控器、进度条和所用时间、元数据以及两张图片之间的比较、两个 JSON
之间的比较、向控制台/显示器显示任何值、管道等！这为加载/保存图像、预览等提供了更好的节点，并可在不加载新工作流程的情况下查看 "隐藏 "数据。

![](https://mmbiz.qpic.cn/mmbiz_png/Zy0rD7suubjpfneiamPvly6hATdjR96D9ru84uPkRnfytBDKFcoNrDZdYk8BCgJchh3xQOW4DeuibpcKlgDClRYg/640?wx_fmt=png&from=appmsg)

2.comfyui-workspace-manager

git clone https://github.com/11cafe/comfyui-workspace-manager.git

or **在CM搜索“workspace”**

安装成功后，ComfyUI 工作界面左上角就是 Workspace 的工作流管理工具栏，右上角蓝色的 「Models」按钮用于管理模型。

![](https://mmbiz.qpic.cn/mmbiz_png/Zy0rD7suubjpfneiamPvly6hATdjR96D9eCXKz82n4h5RVu8zPuQDKYXbln3CDgicR21LNTJTFwolq1R0aXFRhvg/640?wx_fmt=png&from=appmsg)

3.ComfyUI-Custom-Scripts

git clone https://github.com/pythongosssss/ComfyUI-Custom-Scripts.git

or 在CM搜索“Custom-Scripts”

这个节点又名“蟒蛇八卦工具箱”，在它的工具后面都会有一个绿色的小蟒蛇，很好识别。

这个节点安装好后，在菜单栏中的小齿轮，点击进去就可以节点设置。

![](https://mmbiz.qpic.cn/mmbiz_png/Zy0rD7suubjpfneiamPvly6hATdjR96D99ARX6PrNEv4J0c2CzM6PzPCAcGOJgPPOg2YYITcIdQOREguq2opz2w/640?wx_fmt=png&from=appmsg)

在“Link Render Mode”里面，点击选择“Straight”，就可以把ComfyUI里面的连线变直。

![](https://mmbiz.qpic.cn/mmbiz_png/Zy0rD7suubjpfneiamPvly6hATdjR96D9RwblibHuuWibowXTRX9Via6LpNQFBcj7C2cYVqndVicv1fG9OqvnPyKwFQ/640?wx_fmt=png&from=appmsg)

比如点击选择“Image Feed Loaction”中的选项，就可以选择把生成的图片放在相应的位置。

![](https://mmbiz.qpic.cn/mmbiz_png/Zy0rD7suubjpfneiamPvly6hATdjR96D9dia0VXmZK65cYcWf58X5Hwczv58kUx1P5zZqXGpHQX0fn0wpibrWJJ5w/640?wx_fmt=png&from=appmsg)

## **设置**

安装了Manage插件后，如果需要给每个工作节点打上编号，可以按以下步骤设置。

![](https://mmbiz.qpic.cn/mmbiz_png/Zy0rD7suubjpfneiamPvly6hATdjR96D9go1NkREaIib0sXNBvqw8HF5859R1rKjvFQ0TicreNsdW0lu8qWDiauibng/640?wx_fmt=png&from=appmsg)

以上工作都做好后，我们进行最后一步就可以生成图片了。

去这个网站下载SD 1.5基础模型，点击下图中的红框就可以下载。当然，在我们的网盘文件夹里也有这个文件。

https://huggingface.co/runwayml/stable-diffusion-v1-5

![](https://mmbiz.qpic.cn/mmbiz_png/Zy0rD7suubjpfneiamPvly6hATdjR96D9Qxib2SpZknsWvleLwFKB7yfdQRRglibiajwqDlsxtzk3W6IdS9GXXMsRg/640?wx_fmt=png&from=appmsg)

将下载好的“v1-5-pruned-emaonly.ckpt”模型，放入ComfyUI下的“models\checkpoints”文件夹。

启动ComfyUI，点击“Queue
Prompt”，直接就能生成图片。如果想自定义生成图片，直接在第二个红框处输入想生成图片的英文关键词，再点击“Queue Prompt”即可。

![](https://mmbiz.qpic.cn/mmbiz_png/Zy0rD7suubjpfneiamPvly6hATdjR96D96EwNwib5Er7TricNFe00sicar1YCsepgNqWMGZb5elJj0Lib4Fc2GpDSAQ/640?wx_fmt=png&from=appmsg)

至此，我们从0到1，学会了安装ComfyUI以及必要的节点，然后也进行了第一次图片生成，算是已经入门ComfyUI了。

接下来我们教程的所有进阶操作都根据于此。如果想更快更好地操作ComfyUI，可对照如下“快捷键（UI操作）”部分，多加练习，效率提升必定很高。我们下次见。
