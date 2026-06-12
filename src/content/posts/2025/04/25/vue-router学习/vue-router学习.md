---
title: "Vue Router 学习笔记"
pubDatetime: 2025-04-25T20:30:55+08:00
draft: false
featured: false
tags:
  - vue
  - vue-router
  - 前端
description: "Vue3 Router 学习笔记，包括路由配置、路径别名、参数传递、嵌套路由、重定向和全局前置守卫"
---

# Vue3 Router 学习

## 第一小节：路由基础配置

对于 `router/index.js` 中的代码：

```javascript
const routes = [
    {
        path: "/", // http://localhost:5173
        component: () => import("../views/index.vue")
    },
    {
        path: "/content", // http://localhost:5173/content
        component: () => import("../views/content.vue")
    },
]

const router = createRouter({
    //使用url的#符号之后的部分模拟url路径的变化,因为不会触发页面刷新,所以不需要服务端支持
    //history: createWebHashHistory(), 
    history: createWebHistory(),
    routes
})
```

和下面的写法效果相同：

```javascript
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
  ],
})

export default router
```

后面这个更加便捷！

对于 `main.js` 中的：

```javascript
createApp(App).use(router).mount('#app')
```

和

```javascript
const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')
```

效果也是差不多的。

第一小节主要讲的是，如何创建安装和设置路由。

## 第二节：配置路径别名和 VSCode 路径提示

把上面每一句的：

```javascript
component: () => import('@/views/AboutView.vue'),
```

`../` 全部修改变为 `@/`！

通过从 `vite.config.js` 中加入：

```javascript
resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
}
```

等于是更加便捷一点点，`@` 直接指向了 `src` 目录！

但是这个时候发现 `@` 后面不会自动跳转出来文件的路径，所以这个时候要解决需要新建一个 `jsconfig.json`，里面代码是：

```json
{
    "compilerOptions": {
      "baseUrl": ".",
      "paths": {
        "@/*": ["src/*"] // 配置 @ 符号指向 src 目录及其子目录
      }
    }
  }
```

并且安装别名路径跳转插件实现路径跳转，`Ctrl + 点击` 实现跳转。

## 第三节：查询字符串或者路径传递参数

通过 `http://localhost:5174/Login?id=200&title=编程` 访问页面，如何获取页面数据，就是在 `Login.vue` 中加入：

```vue
<script setup>

</script>

<template>

  LOGIn页面 <hr>
  id: {{$route.query.id}} <br>
  title: {{$route.query.title}}

</template>

<style scoped>

</style>
```

即可以，如下图：

![如图](https://cdn.jsdelivr.net/gh/WyiZhng/ImgHosting/Blog-PIC/6.PNG)

接下来路径传参：

在 `router/index.js` 中加入：

```javascript
{
       path: "/user/:id/name/:name", // 使用路径传递参数 http://localhost:5173/user/007/name/邓瑞
       component: () => import("@/views/user.vue")
   },
   {
       //可选参数 name? 表示该参数不是必需的
       path: "/userHistory/:id/name/:name?", // http://localhost:5173/userHistory/007/name
       component: () => import("@/views/user.vue")
   },
```

那么访问链接必须带 `id` 和 `name`，对于前者来说。

对于后者 `name` 参数就是变成了可选参数。

而如何访问路径参数呢？`user.vue` 如下：

```vue
<script setup>

</script>

<template>
    个人主页 - www.dengruicode.com <hr>

    id: {{ $route.params.id }} <br>
    name: {{ $route.params.name }}
</template>

<style scoped>

</style>
```

## 第四节：router-link、定义别名、定义路由名称、编程式导航

在 router 中加入 `alias` 属性：

```javascript
{
        path: "/",
        //alias:"/home", //定义别名 http://localhost:5173/home
        alias:["/home","/index"], // http://localhost:5173/home http://localhost:5173/index
        // component: () => import("../views/index.vue")
        component: () => import("@/views/index.vue")
    },
```

`http://localhost:5173/home` `http://localhost:5173/index` 都可以访问首页。

`router-link` 在页面中绑定其他页面的超链接：

```vue
<template>
    首页 - dengruicode.com <hr>

    <router-link to="/content?id=100&title=邓瑞编程">查询字符串传参</router-link> <br>
    <router-link to="/user/007/name/邓瑞">路径传参</router-link> <br>

    <!-- 动态属性绑定 -->
    <router-link :to="{ path: '/content', query: { id: 200, title: '邓瑞' } }">查询字符串传参 - 动态属性绑定</router-link> <br>
    <router-link :to="{ path: `/user/${userId}/name/${userName}` }">路径传参 - 动态属性绑定</router-link> <br>
</template>
```

编程式导航，通过按键跳转：

```vue
<script setup>
    import { useRouter } from 'vue-router';
    const router = useRouter()

    let userId = 100
    let userName = "邓瑞"

    const goTo = ()=> {
        //router.push("/user/007/name/邓瑞")
        //router.push({ path: '/content', query: { id: 200, title: '邓瑞' } })
        router.push({ name: 'history', params: { id: '300', name: '邓瑞编程' }})
    }
</script>

<template>
    首页 - dengruicode.com <hr>

    <!-- 定义路由名称 -->
    <router-link :to="{ name: 'history', params: { id: '300', name: '邓瑞编程' }}">路径传参 - 定义路由名称</router-link> <br>

    <!-- 编程式导航 -->
    <button @click="goTo()">编程式导航</button>
</template>

<style scoped>

</style>
```

## 第五节：嵌套路由共享组件

```javascript
{
      path: "/vip", 
      component: () => import("@/views/vip.vue"),
      children: [ // 子路由
          {
              path: '', // 默认页 http://localhost:5173/vip
              component: import("@/views/vip/default.vue")
          },
          {
              path: 'order', // 会员订单 http://localhost:5173/vip/order
              component: import("@/views/vip/order.vue")
          },
          {
              path: 'info', // 会员资料 http://localhost:5173/vip/info
              component: import("@/views/vip/info.vue")
          }
      ]
  },
```

这个比较容易理解，不做过多解释。

## 第六节：重定向

```javascript
{
            path: "/svip", // http://localhost:5173/svip
            //redirect: "/vip" // 重定向
            redirect: { name: 'history', params: { id: '100', name: 'David' } }
        },
```

不同于前面的别名，重定向访问的时候，其地址是不变的，别名的话就是变成一个新的地址！

## 第七节：全局前置守卫

举个例子，我们常见的淘宝买东西，我们需要先登录才能进入我们的购物车，那么这就涉及到了一个前置访问，我们需要先在 Login 界面登录以后我们才可以跑到主页。

在 `main.js` 的里面插入如下代码：

```javascript
import { createApp } from 'vue'
import App from './App.vue'

import router from './router'

//createApp(App).mount('#app')
const app = createApp(App)
app.use(router)

//全局前置守卫
router.beforeEach((to, from, next) => {
    console.log("to:",to) //即将进入的路由的信息
    console.log("from:",from) //当前即将离开的路由信息

    next()

    /*
        if(to.name == "history"){
            next(false) //拦截
        }else{
            next() //继续
        }
    */
})

app.mount('#app')
```

判断从什么页面来的。符合的话才可以进行访问新的页面！

学习原链接：[7.全局前置守卫_哔哩哔哩_bilibili](https://www.bilibili.com/video/BV1xt421h7LC)
