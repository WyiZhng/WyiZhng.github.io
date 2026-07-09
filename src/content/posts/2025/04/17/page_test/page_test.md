---
title: "page_test（重复草稿）"
pubDatetime: 2025-04-17T20:36:23+08:00
draft: true
featured: false
tags:
  - blog
description: "此文章与「创建博客技术分析」内容重复，已标记为草稿"
---

## 一、引言

突然突发奇想，想做一个个人博客来记录自己的学习记录，这样子也可以提高自己的总结能力。之前都是做存在硬盘或者U盘里的总结。这次就记在博客上。

## 二、技术对比

在收集个人博客实现技术的过程中看了大致两类：

### （一）Hexo + GitHub Pages

就是我现在使用的方案，其特点如下

**优点**：

- 成本低：完全免费。
- 部署简单：易于设置和部署。
- 性能好：GitHub Pages提供快速的静态文件托管。

**缺点：**

- 静态站点：不适合需要动态功能的网站。
- 技术要求：需要了解Git和Markdown。

**适合人群：**

- 个人博客作者
- 对成本敏感的用户
- 喜欢简单、快速部署的用户

**参考链接**：[教程]Hexo & Github搭建自己的专属博客\_哔哩哔哩\_bilibili](https://www.bilibili.com/video/BV1Eg41157tL/)

### （二）WordPress + 自购域名和服务器

其特点如下：

**优点：**

- 高度可定制：丰富的主题和插件。
- 完全控制：拥有自己的域名和服务器。
- 功能强大：适合各种类型的网站。

**缺点：**

- 成本较高：需要支付域名、服务器和可能的额外费用。
- 技术要求：需要一定的技术知识来维护。
- 安全和备份：需要自行管理安全性和数据备份。

**适合人群：**

- 企业网站
- 电子商务平台
- 需要高度定制化和控制权的用户

**参考链接**：[超详细！个人博客搭建教程，低成本，零代码，手把手，WordPress\_哔哩哔哩\_bilibili](https://www.bilibili.com/video/BV1ac411B7Li/)

## 三、具体实现细则

### （一）安装Git和NodeJs

刚好我都之前安装过，所以这也是为什么我选择方案一的原因。

在Windows上使用Git，可以从Git官网直接 [https://git-scm.com/downloads](https://git-scm.com/downloads)，然后按默认选项安装即可。安装完成后，在开始菜单里找到"Git"->"Git Bash"，蹦出一个类似命令行窗口的东西，就说明Git安装成功！

在Git中绑定Github账号，打开"Git Bash"，在命令框中依次输入两行命令：

```bash
git config --global user.name "Your Name"
git config --global user.email email@example.com
# 其中Your Name和email@example.com替换成上面注册时的账户名和邮箱
```

由于 Hexo 是基于 Node.js 驱动的一款博客框架，安装并配置环境变量。

安装之后可以输入以下命令查看是否安装成功：

```bash
git version
node -v
npm -v
```

### （二）安装Hexo

在命令行输入执行如下命令：

```bash
npm install -g hexo-cli
```

安装 Hexo 完成后，在指定文件夹下打开"Git Bash"，再执行下列命令，Hexo 将会在指定文件夹中新建所须要的文件：

```bash
hexo init myBlog
cd myBlog
npm install
```

若是上面的命令都没报错的话，就恭喜了，运行 `hexo s` 命令，其中 s 是 server 的缩写，在浏览器中输入 http://localhost:4000 回车就能够预览效果了。

<!-- 图片：Hexo 本地预览效果（原始路径为本地 Typora 路径，已丢失） -->

### （三）主题选择

基本大家用的最多的是NEXT主题：https://github.com/next-theme/hexo-theme-next

下载以后将主题文件夹放在 myblog/themes 中，在 `_config.yml` 文件中修改 theme 为 hexo theme-Chic(注意和主题文件名一致)

<!-- 图片：主题配置示例（原始路径为本地 Typora 路径，已丢失） -->

修改后，在git bash中运行 `hexo g` 命令后，执行 `hexo s`，在浏览器中输入 http://localhost:4000 回车就能够预览效果了。

### （四）修改主题配置

修改在主题文件夹下的 `_config.yml` 文件，完成自己个人的配置。

```yaml
# Header   主页面标题
navname: Bentham's Blog
# navigatior items  四个文件归类
nav:
  Posts: /archives
  Categories: /category
  Tags: /tag
  About: /about
# favicon    图标
favicon: /favicon.ico
# Profile    中间显示名字
nickname: Jeremy Bentham
### this variable is MarkDown form.
# 个人描述，可以修改成自己要显示的句子
description: 记录前端学习、项目实践和阶段性复盘。
<br>把零散经验整理成可以长期维护的技术笔记。
# 个人头像图片
avatar: /image/avatar.jpeg
# main menu navigation
## links key words should not be changed.
## Complete url after key words.
## Unused key can be commented out.
# 下方超链接
links:
  Blog: /archives
  # Category:
  # Tags:
  # Link:
  # Resume:
  # Publish:
  # Trophy:
  # Gallery:
  # RSS:
  # AliPay:
  ZhiHu: https://www.zhihu.com/people/sirice
  # LinkedIn:
  # FaceBook:
  # Twitter:
  # Skype:
  # CodeSandBox:
  # CodePen:
  # Sketch:
  # Gitlab:
  # Dribbble:
  Instagram:
  Reddit:
  # YouTube:
  # QQ:
  # Weibo:
  # WeChat:
  Github: https://github.com/Siricee
# how links show: you have 2 choice--text or icon. 图标 or 文字
links_text_enable: false
links_icon_enable: true
# Post page
## Post_meta
post_meta_enable: true
post_author_enable: true
post_date_enable: true
post_category_enable: true
## Post copyright
post_copyright_enable: true
post_copyright_author_enable: true
post_copyright_permalink_enable: true
post_copyright_license_enable: true
post_copyright_license_text: Copyright (c) 2019 <a href="http://creativecommons.org/licenses/by-nc/4.0/">CC-BY-NC-4.0</a>
LICENSE
post_copyright_slogan_enable: true
post_copyright_slogan_text: Do you believe in <strong>DESTINY</strong>?
## toc
post_toc_enable: true
# Page
page_title_enable: true
# Date / Time format
## Hexo uses Moment.js to parse and display date
## You can customize the date format as defined in
## http://momentjs.com/docs/#/displaying/format/
date_format: MMMM D, YYYY
time_format: H:mm:ss
# stylesheets loaded in the <head>
stylesheets:
- /css/style.css
# scripts loaded in the end of the body
scripts:
- /js/script.js
- /js/tocbot.min.js
# tscanlin/tocbot: Build a table of contents from headings in an HTML document.
# https://github.com/tscanlin/tocbot
# plugin functions
## Mathjax: Math Formula Support
## https://www.mathjax.org
# 数学公式
mathjax:
  enable: true
  import: demand # global or demand
  ## global: all pages will load mathjax,this will degrade performance and some grammers may be parsed wrong.
  ## demand: Recommend option,if your post need fomula, you can declare 'mathjax: true' in Front-matter
```

### （五）将博客部署在GIThub上

点击 Start project 或者下面的 new repository 建立一个新的仓库，注意Github 仅能使用一个同名仓库的代码托管一个静态站点，这里注意仓库名一定要是：`用户名.github.io`

配置 SSH key ，要使用 git 工具首先要配置一下SSH key，为部署本地博客到 Github 作准备

```bash
git config --global user.name "用户名"
git config --global user.email "邮箱地址"
ssh-keygen -t rsa -C '上面的邮箱'
```

按照提示完成三次回车，便可生成 ssh key，采用以下指令也可以查看自己的ssh

```bash
cat ~/.ssh/id_rsa.pub
```

首次使用还须要确认并添加主机到本机SSH可信列表。若返回 `Hi xxx! You've successfully authenticated, but GitHub does not provide shell access.` 内容，则证实添加成功。

```bash
ssh -T git@github.com
```

登陆 Github 上添加刚刚生成的SSH key，按如下步骤添加，右上角点击头像-> settings -> SSH and GPG keys，建立一个新的 SSH key, 标题随便，key 就填刚才生成那个，确认建立，这样在你的 SSH keys 列表里就会看到你刚刚添加的密钥

<!-- 图片：SSH key 设置示例（原始路径为本地 Typora 路径，已丢失） -->

此时，本地和Github的工作做得差不了，是时候把它们两个链接起来了。你也能够查看官网的部署教程。先不着急，部署以前还须要修改配置和安装部署插件。第一：打开项目根目录下的 `_config.yml` 配置文件配置参数。拉到文件末尾，填上以下配置

<!-- 图图片：部署配置示例（原始路径为本地 Typora 路径，已丢失） -->

这一步！！！！！我是必须得按下面得 `git@github` 这一行就是被注释掉的这一行填写才可以 `hexo d` 部署成功！

因为我使用了SSH！

第二要安装一个部署插件 hexo-deployer-git，打开"Git Bach"，输如以下指令

```bash
npm install hexo-deployer-git --save
```

最后执行如下两条命令就能够部署上传啦，如下 g 是 generate 缩写，d 是 deploy 缩写

```bash
hexo g
hexo d
# 部署到Github上
```

这时用浏览器输入 `用户名.github.io` 就可以访问刚才的网站啦！大功告成
