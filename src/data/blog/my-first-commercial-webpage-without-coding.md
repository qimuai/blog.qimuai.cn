---
author: "齐木"
pubDatetime: 2024-12-20T19:08:00+08:00
title: "全流程公开没有写一行代码我开发了人生中第一个商用网页"
draft: false
tags: []
description: "12月16日，我开发出了人生中第一个商用网页，在Windsurf的帮助下，没有写任何一行代码。 算下来，整个开发周期就两天时间，还是在兼职的情况下，林林总总可能加起来就6个小时左右，这其中，调研同类网站、写产品文案这些“额外”的事情，花了3..."
---

12月16日，我开发出了人生中第一个商用网页，在Windsurf的帮助下，没有写任何一行代码。

算下来，整个开发周期就两天时间，还是在兼职的情况下，林林总总可能加起来就6个小时左右，这其中，调研同类网站、写产品文案这些“额外”的事情，花了3个小时。

也就是说，作为一个一行代码都不会写的新手，我用3小时开发出了一个可以直接上线使用的网页。

其实是两个，还有一个暗色的版本。

大家可以看看效果，随后我来说说整个流程是怎样的，以及踩了哪些坑：
https://qimu.ai/chat/
https://qimu.ai/night-chat/

我买了个10美刀的会员，就开始构建网站了。整个工程，用掉了Windsurf会员44个高级用户对话额度、89个高级流程操作额度。

![](https://mmbiz.qpic.cn/mmbiz_png/Zy0rD7suubjEeFQUu1GZSlXDXMKzkzIgXW0vRwxNeqauA51RkaRUs235kXSDibarUyxBooUFPjvpR62y751qCeg/640?wx_fmt=png&from=appmsg)

按1:7人民币汇率算，搞这个网页工具成本不到7元人民币。仅仅用7块钱，就做出了一个可以直接使用的网站，这在以前是无法想象的。  
![](https://mmbiz.qpic.cn/mmbiz_png/Zy0rD7suubjEeFQUu1GZSlXDXMKzkzIgsUibMq4PuStoRAhNLd17rdFicpojxuG2GLz79181XGYRDBKfBBiaVmXQA/640?wx_fmt=png&from=appmsg)

好，前置内容都说完了，接下来我们进入干货时间。  
想清楚自己想要一个什么样的网站？

你想过没有，AI时代，人的价值在哪里？或者说，在这个AI越来越强的时代，我们如何才能在AI的光环下生存立足？  
我觉得一个很关键的点是，我们得学会成为领导。这个领导并不是我们传统意义上的那种领导，和AI交互你不用屁股决定脑袋，你需要做的仅仅是能够指挥AI把事情办好。

而这个的前提是，你得清楚自己想要什么。  
你可以有一个对标参考，然后发给AI。这个过程也就是我们惯常说的“fine-
tuning“，比如说开发一个网站，直接把对标网站截图丢给AI，让他分析这个网页的色调、排版布局，标题等，然后让AI按照这种感觉来帮你生成相应的网站。  
![](https://mmbiz.qpic.cn/mmbiz_png/Zy0rD7suubjEeFQUu1GZSlXDXMKzkzIgGlTyNOvWbsjtQmPLbvlfBQ3pdcj36dMRRQjAw2kbEia2cFvszhZd85Q/640?wx_fmt=png&from=appmsg)

不过，这一切的前提是，你得把自己网站的素材准备好。  
网站素材清单：

- 网站主体文案
- 配图  
  我在前面说了，做和AI协作写代码只花了整个项目一半的时间，另一半的时间，是去找写文案（网站结构+文字内容）和找参考（配色、实现样式）。  
  所以你需要写一份网站文档（也就是你希望你的网站有什么内容、能实现哪些功能），如下图所示：  
  ![](https://mmbiz.qpic.cn/mmbiz_png/Zy0rD7suubjEeFQUu1GZSlXDXMKzkzIgodOUiaSgvDVpnjVrzFVxsoYbVg5m4bCcBE4xCCd3yMicg4t58lxYttug/640?wx_fmt=png&from=appmsg)

还有就是风格实现样式（也就是你希望你的网站长什么样）：  
![](https://mmbiz.qpic.cn/mmbiz_png/Zy0rD7suubjEeFQUu1GZSlXDXMKzkzIg4bvxnGW7anCkgTJVOria4aRTfrS7Ee47QAlrG5mGb1iapuE72nfVPickQ/640?wx_fmt=png&from=appmsg)

![](https://mmbiz.qpic.cn/mmbiz_png/Zy0rD7suubjEeFQUu1GZSlXDXMKzkzIg0bHpJ3vo6NhXFjrlb7h0BBhv3pW9sGLcRS00sphqFWmaiaA59vt1apg/640?wx_fmt=png&from=appmsg)

这里设计风格可以参考这些：  
苹果设计风格（Minimalist Design）  
扁平化设计风格（Flat Design）  
极简设计风格（Minimalism）  
现代感设计风格（Modern Design）  
复古风格（Retro/Vintage Design）  
大胆色彩风格（Bold and Vibrant Design）  
网格布局风格（Grid-Based Design）  
暗黑模式风格（Dark Mode Design）  
插画风格（Illustration Design）  
动态交互风格（Interactive Design）

具体这些风格特征和适用群体，我做了一个文档，可以参考：  
【腾讯文档】【收集】网站设计风格精选 https://docs.qq.com/doc/DVGNhQ0pXQUpRRk9M  
![](https://mmbiz.qpic.cn/mmbiz_png/Zy0rD7suubjEeFQUu1GZSlXDXMKzkzIgwcIDX24IZI0waNWsDqSEl7wBYSsyib5S1mZCp5DoJhsJE2vU5BTeymg/640?wx_fmt=png&from=appmsg)

准备好以后，就可以开始开发了，我弄这个网站，第一个是用了下面这样的提示词，算是一个好的开端：  
![](https://mmbiz.qpic.cn/mmbiz_png/Zy0rD7suubjEeFQUu1GZSlXDXMKzkzIgB9fmfmnBDYEmfaJaibJwH35jfT4VlJBn4fxrruA3TlcX4ibpOoGpWiaBQ/640?wx_fmt=png&from=appmsg)

## 开发网站的环境布置准备

就现在我认为，对于小白来说，最难的部分往往并不是和AI协作准备编程的过程。而是搭建各种软件服务器环境和想清楚自己想要什么。  
所以，这里一开始我来聊聊我们开发一个像我那个简单的宣传网页的话（静态页面），需要一个什么样的环境。  
我把清单列在下面：

- 服务器
- 域名  
  就这两个东西，然后没了。

怎么购买服务器和域名，以及如何使用，都不难，搜索一下就知道了，实在不行也可以问问各种AI。  
我来说说我的步骤。买好域名（国内需要实名）和服务器后，可以先不忙部署，先在本地部署。其实所谓本地部署，就是你创建好一个项目文件夹后，让Windsurf在这个文件夹中操作生成文件，然后（如下图）双击生成的文件“index.html“就可以看到网页效果了。  
![](https://mmbiz.qpic.cn/mmbiz_png/Zy0rD7suubjEeFQUu1GZSlXDXMKzkzIgwLM817xS515ibDaSYnJjgMekajn6zMbDrMZb8NxKKDSdmzOnKrkdjgA/640?wx_fmt=png&from=appmsg)

我问过AI，这种方式和线上服务器部署效果基本没差别。  
![](https://mmbiz.qpic.cn/mmbiz_png/Zy0rD7suubjEeFQUu1GZSlXDXMKzkzIgCf4JKLvpaOoucfmgBUz0zk9zu6CV8P58wX1RldqGHzRNzQ71UL1ib0Q/640?wx_fmt=png&from=appmsg)

当你觉得做出的网页效果符合你预期之后，就可以上传到服务器部署了。方法还是问AI，下面是我的一系列提示词如下，可以参考：  
![](https://mmbiz.qpic.cn/mmbiz_png/Zy0rD7suubjEeFQUu1GZSlXDXMKzkzIgFVQZudlYfKic5pevYcR2Cf9b0Oa7Tc4lwgu6YCGiatiamK3w2MEs9GdAA/640?wx_fmt=png&from=appmsg)

![](https://mmbiz.qpic.cn/mmbiz_png/Zy0rD7suubjEeFQUu1GZSlXDXMKzkzIgYrjKRxbera5loHWUgJBUNH3T1PmibglaC0mGTziaK5BsuPtG3GadqGBQ/640?wx_fmt=png&from=appmsg)

![](https://mmbiz.qpic.cn/mmbiz_png/Zy0rD7suubjEeFQUu1GZSlXDXMKzkzIgUYrfH449TrMals1NqlEZmnT2unZm2HvliaQPicEibB5gHGNzbfmr3VXPQ/640?wx_fmt=png&from=appmsg)

我是想把网页部署在我主域名的一个子目录上，就可以直接这样问：  
![](https://mmbiz.qpic.cn/mmbiz_png/Zy0rD7suubjEeFQUu1GZSlXDXMKzkzIg2CKB7AMeWb1pqhFhhyoZQtkJ9HeaHqChLQ7HZicjibHQjT7gCl6LS1kA/640?wx_fmt=png&from=appmsg)

好，到这里，写代码之外的工作都聊完了。接下来我们来聊聊重头戏：如何和AI协作写代码。

## 如何和AI协作写代码？

一些问题大家可能会遇到的问题

### 1.图片是怎么弄上去的？

这里的关键是：

> 需要确保所有引用的图片文件都已放置在正确的目录中（ `images/ ` ），文件名与HTML中的引用相匹配。

为了正确显示我们提供的图片，HTML 提供了 标签来在网页中显示图片。以下是基础语法：  
![](https://mmbiz.qpic.cn/mmbiz_png/Zy0rD7suubjEeFQUu1GZSlXDXMKzkzIg7iaxfbn44NTAL0WLz1KCnpzqFy6IoozrBAwCXt67CLT5CdRQibicYWXHg/640?wx_fmt=png&from=appmsg)

这个基础语法不用我们自己写，但是我们需要做几件事：  
将网站用到的所有文件，放在一个文件夹中（名称通常为：images），这个文件夹需要和index.html这个文件处于同级文件夹下，就像这样：  
![](https://mmbiz.qpic.cn/mmbiz_png/Zy0rD7suubjEeFQUu1GZSlXDXMKzkzIgZvM3HSNSySGMvotUhIlJIMSPIQT4cibSiaWAaT1cwnMQPIAPJe4jWf9A/640?wx_fmt=png&from=appmsg)

图片命名和上面的文件夹位置，一起决定了 语法中的“图片路径”，所以另一个关键点是图片的名称。这个你可以先要求AI在相应的位置增加图片（如下）。  
![](https://mmbiz.qpic.cn/mmbiz_png/Zy0rD7suubjEeFQUu1GZSlXDXMKzkzIga3mpZfv1Oiauiceia3eu8twvr2oK2RmrtfwcTWxjNTetrOpibeKnNGRrLg/640?wx_fmt=png&from=appmsg)

然后再去index.html中，去找相应的图片名称，然后拿到这个名称后，给相应images里面的图片命名。  
比如这个部分，AI在我的要求下，增加了图片标签，并自定义名称为“图片生成”，那么这时候我们就有两个办法让图片能够正确显示：  
1.修改index.html文件中的img名称，让它和images文件夹对应的图片名称一样  
2.或者反过来，修改images中的图片名称，让它和index.html中的图片名一样。  
![](https://mmbiz.qpic.cn/mmbiz_png/Zy0rD7suubjEeFQUu1GZSlXDXMKzkzIgTg1r3Ybaxy8KakNSXaNWoGqFQGPibm4Cux8MNpd8BJmaY2Mz6fkAZgQ/640?wx_fmt=png&from=appmsg)

### 2.如何增加跳转链接？

比如这次我要加上宣传的产品网址以及社交媒体链接，那么我们就可以这样和AI说：  
先让AI生成相应部分的网页链接样式  
![](https://mmbiz.qpic.cn/mmbiz_png/Zy0rD7suubjEeFQUu1GZSlXDXMKzkzIgFAwJ41xR8jh56VZSgXbHPsdJXlH029GiaZuWGmp35E6NbZyWzibAvM0w/640?wx_fmt=png&from=appmsg)

再把具体的链接给AI。或者，干脆一起告诉AI也可以的。  
![](https://mmbiz.qpic.cn/mmbiz_png/Zy0rD7suubjEeFQUu1GZSlXDXMKzkzIgMSBuSonZCrBXJ2km7JYqic8lLT4xLDJbQHkFib2pPzQVfgTicglIpdmuA/640?wx_fmt=png&from=appmsg)

### 3.那个点击弹出二维码的交互是怎么做的？

其实很简单，就一句话的事：

> 【企业合作咨询】那个部分，我想要别人点击之后就会弹出我的二维码（图片在images文件夹中，名为“AaronW”）

![](https://mmbiz.qpic.cn/mmbiz_png/Zy0rD7suubjEeFQUu1GZSlXDXMKzkzIg7El5ibE2c73bMpBK5soliarhOPaU9vCb5JeWu2IJ65o5ae3edbTvya8g/640?wx_fmt=png&from=appmsg)

## 一些坑

### 总结一下几个坑：

1.最重要的一点是，进行版本控制。  
当你做出一个还可以的版本，但是有些小细节要完善的时候，一定要及时把生成的代码文件都复制保存好，不然AI会极容易将原来的内容改得面目全非，把原来还不错的效果给改没了。  
![](https://mmbiz.qpic.cn/mmbiz_png/Zy0rD7suubjEeFQUu1GZSlXDXMKzkzIgzYdGJxpNCf3he4s4r4ia0gdSiarQ8Q2T5MTdICzYC6iaz4fuEGuEQrPSw/640?wx_fmt=png&from=appmsg)

### 2.其次，学会提问（描述）。

如果一个问题翻来覆去，就是修改不好，那就需要换另外一种方式提问（描述）了。比如说，直接找到相应的代码，让AI看看是怎么回事。  
![](https://mmbiz.qpic.cn/mmbiz_png/Zy0rD7suubjEeFQUu1GZSlXDXMKzkzIgO4mqq0aAESrMVXEzYVGE5bHMbocAria8oRPcQpagib8vvHZ2M6Picxv7w/640?wx_fmt=png&from=appmsg)

![](https://mmbiz.qpic.cn/mmbiz_png/Zy0rD7suubjEeFQUu1GZSlXDXMKzkzIgdZ55nttYOAO6SQZjOxLXZmdP1uVHLhSExlySv9M45hxjuib1ibAgeeOw/640?wx_fmt=png&from=appmsg)

![](https://mmbiz.qpic.cn/mmbiz_png/Zy0rD7suubjEeFQUu1GZSlXDXMKzkzIgfNHxgS35dqthntna3MWb4MniaXMGkLV5bvvMEOpRGQzpVbuVJzKBfXg/640?wx_fmt=png&from=appmsg)

![](https://mmbiz.qpic.cn/mmbiz_png/Zy0rD7suubjEeFQUu1GZSlXDXMKzkzIgtv5jKicmbEyibGah2RGcwoUOTAn568rDN5rXW61kRRcI2OBuNGGzXliaA/640?wx_fmt=png&from=appmsg)

### 3.学会向AI学习专业表达

有时候你不得不说，AI的表达确实更加专业和地道。原因无他，知识量太大了。所以，这个时候，我们就需要向AI学习一些专业的表达。  
比如说下面这个，我的描述是：单个排列，然后左右图文（下一个反过来）。  
这个描述怎么说呢？有时候可能人一晃眼，也不一定能懂。这其实就是表达得不够专业。  
但是Claude-Sonnet-3.5秒懂，他称之为“左右交替排布图文”，简单的8个字，就代替了我的16个字，并且还易理解、无歧义。  
所以，在下一轮描述中，我们就可以直接使用从AI那里偷师来的好表达了。  
![](https://mmbiz.qpic.cn/mmbiz_png/Zy0rD7suubjEeFQUu1GZSlXDXMKzkzIg6wfhzyOiaAwFDjgJcfo0mZHgn2ubL2qo2Aibd8vClW4odCddA8rgRJYA/640?wx_fmt=png&from=appmsg)

### 4.最后，先完成、再完美

一定不要害怕说自己做出来的东西不行，先完成、再完美。  
这次我搞的这个网页，在Mac电脑上看还可以，但在Windows和iPhone上看，一塌糊涂：边页留白太多，图片显示太小、展示不够紧凑、没有设计感……  
但，那有如何？  
分享下面这段话，与君共勉：  
![](https://mmbiz.qpic.cn/mmbiz_png/Zy0rD7suubjEeFQUu1GZSlXDXMKzkzIgFYhjpWN4YAicrJPJowJJvrV4hI7JyicViao3yHBNCianXS65ttKvdotN6A/640?wx_fmt=png&from=appmsg)

先做个垃圾出来，慢慢变废为宝。加油！
