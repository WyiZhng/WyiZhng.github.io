---
title: "Git 基础以及 VSCode 版本控制"
pubDatetime: 2025-06-12T17:11:20+08:00
draft: false
featured: false
tags:
  - git
  - vscode
  - 版本控制
  - github
description: "Git 基础操作和分支管理，以及使用 VSCode 进行 Git 操作的教程"
---

# 基础操作和分支

## PART1：GIT 前期准备

下载 GIT，之后注册 GITHUB，记住邮箱！

#### 设置全局 Git 用户名和邮箱

若是第一次使用 git 的话，请先配置全局的用户名和邮箱（将以下命令用户名邮箱替换）。

```bash
git config --global user.name "Your Name"
git config --global user.email "youremail@yourdomain.com"
```

GITHUB 对应远程仓库，GIT 就是本地存档！

## PART2：VSCode 进行 Git 操作

在你在配好第一步以后，用 VSCode 打开文件夹会，在源代码控制下会出现两个选项：

1. 初始化仓库（创建一个本地存档）
2. 上传到 github（就是 push 到 github 云储存）

![VSCode 源代码控制](https://cdn.jsdelivr.net/gh/WyiZhng/ImgHosting/Blog-PIC/17.PNG)

选择 1 以后会出现 commit 按钮，以及下面还有一个对话框（first save），可以记录保存的纪要改了什么内容。随后点击消息框 always，这样子画面不会有消息框再出来打扰：

![commit 按钮](https://cdn.jsdelivr.net/gh/WyiZhng/ImgHosting/Blog-PIC/18.PNG)

一个 commit 就是一个版本

但是要记住以上操作都是基于本地保存！

## PART3：VSCode 链接 GitHub

commit 以后，会变成 publish 按钮，在 publish 前可以选择公开或者私密仓库，有时候是 sync changes：

![publish 按钮](https://cdn.jsdelivr.net/gh/WyiZhng/ImgHosting/Blog-PIC/19.PNG)

上面图中蓝色的是本地存档，紫色是云端存档

当然也可以新建 github 仓库，然后再上传项目

默认点下面 publish branch 就是会自动生成同名的 github 远程仓库，而这时候我们已经建立好了远程仓库，所以我们要点三个点，如下选择：

![添加远程仓库](https://cdn.jsdelivr.net/gh/WyiZhng/ImgHosting/Blog-PIC/20.PNG)

然后添加好自己的建好的仓库，完成云端同步。

## PART4：分支和协作

首先在文件发布之前要写好这个 `.gitignore` 的文件，这个文件是核对什么内容不进行上传。

![.gitignore 文件](https://cdn.jsdelivr.net/gh/WyiZhng/ImgHosting/Blog-PIC/21.PNG)

接下来就是添加协作者，比如你的项目要和别人协作：

![添加协作者](https://cdn.jsdelivr.net/gh/WyiZhng/ImgHosting/Blog-PIC/22.PNG)

输入对应邮箱，会发出邀请。别人同意邀请后，协作者也就是别人可以在自己的 repositories 找到对应协作项目：

![协作者查看项目](https://cdn.jsdelivr.net/gh/WyiZhng/ImgHosting/Blog-PIC/23.PNG)

协作者复制 .git 链接到克隆仓库下面：

![克隆仓库](https://cdn.jsdelivr.net/gh/WyiZhng/ImgHosting/Blog-PIC/24.PNG)

协作者此时同样可以对我们的源代码进行修改，并且也可以推送，那么对于我们来说：

![Git Graph](https://cdn.jsdelivr.net/gh/WyiZhng/ImgHosting/Blog-PIC/25.PNG)

其中第一个 Fetch From All Remote 就是获取当前所有情况，就是 github 上仓库的一个更新情况，更新我们的 Git Graph，第二个按钮是 pull，是将本地的版本，和协作者同步，把电脑的版本同步协作者。

上面说的这些就是有代码被人恶意修改的风险！因为协作者可以直接修改我们的 github 仓库代码，我们要避免这种情况：

![分支规则设置](https://cdn.jsdelivr.net/gh/WyiZhng/ImgHosting/Blog-PIC/26.PNG)

我们要新建一个分支规则， Enforcement 改为 active，Add target 要添加我们的分支，第一个是表示是默认分支，也就是常见的 main 或者 master，第二个就是全部分支，第三个就是设置特定分支：

![分支规则详情](https://cdn.jsdelivr.net/gh/WyiZhng/ImgHosting/Blog-PIC/27.PNG)

下面勾上这个按钮，协作者必须创建新分支，后续必须通过合并分支才能对我们的主代码进行更新。其中那个 1 就是指，需要几个人同意你才能提交主干分支修改，但是这个情况下，项目主如果要修改也需要有人批准，这个点需要注意，如果设置了 RULE 的话。

![合并规则](https://cdn.jsdelivr.net/gh/WyiZhng/ImgHosting/Blog-PIC/28.PNG)

我们所述的需要协作的话，必须得 public 自己的仓库，不然无法生效。或者就是要 4 美元每月，生成团队组织。等在我们设置完成以后，协作者只能通过或者这边可以戏称为呆瓜实习生就只能通过新建分支来上传代码。

![新建分支](https://cdn.jsdelivr.net/gh/WyiZhng/ImgHosting/Blog-PIC/29.PNG)

我们打开项目会发现以下按钮，就是对比和合并，这时候，实习生是没办法合并的必须通过项目主人同意才可以进行合并。如下图：

![合并请求](https://cdn.jsdelivr.net/gh/WyiZhng/ImgHosting/Blog-PIC/30.PNG)

当然后续我们也可以删除分支，点击 github 上的 branch 里面就可以对分支进行删除，但是协作者操作分支记录还是会存在 VSCode 上的记录还是看得到。

以上内容参考：[和傻子一起写代码\_哔哩哔哩\_bilibili](https://www.bilibili.com/video/BV1Hkr7YYEh8)

# 深入学习

点击三个点会出现很多功能，我们会逐一介绍：

![VSCode Git 功能](https://cdn.jsdelivr.net/gh/WyiZhng/ImgHosting/Blog-PIC/31.PNG)
