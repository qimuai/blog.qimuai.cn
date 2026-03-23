---
author: "Aaron"
pubDatetime: 2025-09-03T22:44:58Z
title: "1. 如何自部署、更新n8n（附免费使用方式）"
draft: false
tags: []
description: "很多人都知道n8n很火，但是不知道怎么使用。一个很简单的办法是，使用官方云托管提供的服务，这个简单，只要注册账号、登录、付款（也有免费额度）就可以直接使用了。 https://app.n8n.cloud/login 如果要自己部署， 对于小..."
---

很多人都知道n8n很火，但是不知道怎么使用。一个很简单的办法是，使用官方云托管提供的服务，这个简单，只要注册账号、登录、付款（也有免费额度）就可以直接使用了。

https://app.n8n.cloud/login

![](https://qimuai.oss-cn-shenzhen.aliyuncs.com/20250903213703.png)

## 自部署

如果要自己部署，
对于小白和普遍的选择来说，docker部署是最方便的。官方也推荐使用docker，因为它提供了一个干净、隔离的环境，避免了操作系统和工具的不兼容性，并使数据库和环境管理更加简单。

不过，要docker部署之前，得先安装docker。在互联网上行走，基本上装好了docker就能装绝大部分开源软件了。

OK，那怎么安装docker呢？

很简单，如果你是本地部署，去网站https://docs.docker.com/get-started/get-docker/

选择一个自己操作系统的版本下载，然后像正常软件安装就完事了。
![](https://qimuai.oss-cn-shenzhen.aliyuncs.com/20250903212759.png)

如果你是用的服务器部署，那就分不同情况了。我这里用的是宝塔面板来管理服务器。宝塔面板的菜单直接就有docker栏，点击安装即可。

![](https://qimuai.oss-cn-shenzhen.aliyuncs.com/20250903213127.png)

OK，安装好docker后，启动docker，然后在终端/命令行中执行以下命令。

```Plain
docker volume create n8n_data
docker run -d --name n8n --restart unless-stopped -p 5678:5678 -v n8n_data:/home/node/.n8n docker.n8n.io/n8nio/n8n
```

```Plain
docker stop n8n
docker start n8n
```

部署在服务器里，记得打开服务器的防火墙端口！
部署在服务器里，记得打开服务器的防火墙端口！
部署在服务器里，记得打开服务器的防火墙端口！

运行后，本地部署的，可以通过打开以下地址访问 n8n：[http://localhost:5678](http://localhost:5678/)

如果是服务器部署，用这个网址：http://服务器IP:5678，确定能打开后，最好弄一下反向代理和https。

接下来，我们能打开部署的n8n网站了。然后我们进行注册，注意，这个第一个注册的账号，就是管理员账号，权限最高。

![](https://qimuai.oss-cn-shenzhen.aliyuncs.com/20250903223455.png)

点击“Send me a free lincense key“后，注册邮箱会收到密钥。
![](https://qimuai.oss-cn-shenzhen.aliyuncs.com/20250903223515.png)

去设置里，将从邮箱里复制的密钥复制粘贴到如下位置，即可激活其他权限。然后注册就搞定了。接下来就可以正常用了。

![](https://qimuai.oss-cn-shenzhen.aliyuncs.com/20250903223648.png)

### 永久免费的「n8n云部署」方式

有同学可能会问了，如果不花钱买官方的云托管或者自部署的服务器，有没有不用花一分钱就能使用完整版的n8n？

还真有！

去下面这个网站注册：
https://console.run.claw.cloud/signin?link=RSZE4AZAMK7P，

**注册的时候一定要选择\*\***GitHub\*\*，只要GitHub注册超过180天，就能每个月获得5美元赠送额度（这就是永久免费的关键）。

接着选择地区，最好选择亚洲城市，工作空间自定义命名。

进入之后点击右上角**头像->plan，右上角会显示价格，0.1美元一天，一个月就是3美元，刚好每个月会送5美元，白嫖了n8n还能剩2美元~**

![](https://qimuai.oss-cn-shenzhen.aliyuncs.com/20250903224253.png)

然后去商店，找到n8n

![](https://qimuplus.feishu.cn/space/api/box/stream/download/asynccode/?code=ZTJmZTljMDA0MTIxOThhZGRmZjNjZjUzMGIxMjcyMTBfM25XbFZQOWZBdXY5OTY4OTM1TnhraGdXOU1wOTBpOUxfVG9rZW46RDA4TmI2WVhLb05wUHV4RHpLdmNmNWtxbkJmXzE3NTY5MTAzNjQ6MTc1NjkxMzk2NF9WNA)

点击“Deploy App”，

![](https://qimuplus.feishu.cn/space/api/box/stream/download/asynccode/?code=NDc2YjJkODMzMTIxMTQ1OTJkMzk1ZTdlMTkwMjcyZWJfanVkUzVyQjZrVFdWd1ZuR1o3SW80M1F2Y3lmTFNkVkJfVG9rZW46UjRwNmJhOVJPb3JIN2R4aTBiMWN2Uk4wbjlkXzE3NTY5MTAzNjQ6MTc1NjkxMzk2NF9WNA)

然后回到主界面，点击n8n的图标

![](https://qimuplus.feishu.cn/space/api/box/stream/download/asynccode/?code=NjZhMGIzYzlkNjdiNzRmNzcyYjFhMTVlMzg2Mzg1NmZfZ2hSRktkcExTSFhaREJYU0VyeHRqa2FhRUhuR1RrcDFfVG9rZW46R3JDOGJNVWtCb1RjTG54T2I2aGNMN1NZbjJjXzE3NTY5MTAzNjQ6MTc1NjkxMzk2NF9WNA)

接下来的操作就和上面一样了，注册账号、粘贴激活码。

## 更新

更新很简单，在你的本地n8n文件夹，创建一个名为“update-n8n.sh”的文件，然后填入如下内容：

```
#!/bin/bash

# update-n8n.sh (v2 - with cache fix)

# 如果任何命令失败，则立即退出脚本
set -e

echo "====== 1. 拉取最新的n8n官方镜像 ======"
# 这一步其实可以省略，因为build的--pull会做同样的事，但保留也无妨
docker pull n8nio/n8n:latest

echo "====== 2. 重建你的专属n8n镜像（强制拉取最新基础镜像）======"
# 【关键修正】使用 --pull 参数确保使用最新的基础镜像，而不是本地缓存
docker build --pull -t my-n8n:latest /root/my-n8n

echo "====== 3. 停止并移除旧的n8n容器 ======"
# 增加 '|| true' 是为了在容器不存在时不报错，让脚本能继续执行
docker stop n8n || true
docker rm n8n || true

echo "====== 4. 启动全新的n8n容器 ======"
docker run -d --restart always \
  --name n8n \
  -p 5678:5678 \
  -v n8n_data:/home/node/.n8n \
  -e WEBHOOK_URL=https://n8n.qimuai.top/ \
  -e GENERIC_TIMEZONE="Asia/Shanghai" \
  -e NODE_FUNCTION_ALLOW_EXTERNAL=juice,cheerio,axios,dayjs,lodash,crypto-js,uuid \
  my-n8n:latest

echo "====== n8n更新完成！======"
```

给它执行权限 (`chmod +x update-n8n.sh`)(在my-n8n文件夹下执行这个终端命令），以后每次n8n发布新版本，你只需要运行 `./update-n8n.sh` 这一个命令，就能优雅地完成全部更新工作。

现在，你的n8n不仅是定制化的，连升级流程都可以是自动化的！这才是真正的“n8n自动化你的生活”！
