---
title: "异步 Promise 和 async/await"
pubDatetime: 2025-06-13T14:54:28+08:00
draft: false
featured: false
tags:
  - javascript
  - 异步编程
  - promise
  - async-await
description: "用生活中的例子通俗解释 Promise 和 async/await 的核心概念和使用场景"
---

### Promise 是什么？用生活中的例子通俗解释

#### 一、Promise 的核心概念（技术角度）

Promise 是异步编程的一种解决方案，本质上是一个状态机，用于处理未来才会完成的操作。它有三种状态：

- **pending（进行中）**：初始状态，操作未完成
- **fulfilled（已完成）**：操作成功完成
- **rejected（已拒绝）**：操作失败

这三种状态一旦改变就不会再变，状态的改变会触发对应的回调函数执行。

#### 二、生活中的 Promise 类比：点外卖的过程

##### 1. 下单即创建 Promise

```javascript
// 场景：你在手机上下单一份外卖
const orderPromise = new Promise((resolve, reject) => {
  console.log("你已下单：红烧牛肉面");
  // 商家接单后开始处理
  if (商家确认接单) {
    // 30分钟后餐品制作完成
    setTimeout(() => {
      resolve("你的外卖已打包完成，骑手正在配送");
    }, 30 * 60000);
  } else {
    reject("商家拒绝接单，请重新下单");
  }
});
```

**类比**：你下单后拿到一个 "订单凭证"，这就是一个 Promise 对象，此时状态是 `pending`（商家正在处理）。

##### 2. 处理 Promise 的两种结果

```javascript
// 场景：你等待外卖送达
orderPromise
  .then(result => {
    // 订单成功时的处理
    console.log(result); // 输出：你的外卖已打包完成，骑手正在配送
    // 继续处理后续动作
    return "你出门到楼下等待";
  })
  .then(action => {
    console.log(action); // 输出：你出门到楼下等待
    return "骑手将外卖交给你";
  })
  .catch(error => {
    // 订单失败时的处理
    console.error(error); // 输出：商家拒绝接单，请重新下单
  });
```

**类比**：

- `then()` 相当于你提前计划 "如果外卖顺利配送，我就去楼下等"
- `catch()` 相当于你计划 "如果商家不接单，我就重新下单"

##### 3. Promise 的链式调用：处理多个异步步骤

```javascript
// 场景：外卖送达后的完整流程
orderPromise
  .then(() => "骑手已取餐，预计15分钟送达")
  .then(status => {
    console.log(status);
    return "你收到骑手电话：已到楼下";
  })
  .then(call => {
    console.log(call);
    return "你下楼取餐，支付尾款";
  })
  .then(action => {
    console.log(action);
    return "你打开餐盒开始用餐";
  })
  .catch(error => console.error("异常：" + error));
```

**类比**：从下单到用餐的整个流程，每个步骤都是前一个步骤的结果触发的，就像 Promise 链式调用中每个 `then` 依赖上一个操作的结果。

#### 三、Promise 解决了什么问题？对比 "回调地狱"

##### 1. 回调地狱（Callback Hell）：层层嵌套的回调函数

```javascript
// 场景：你要完成一系列依赖操作（类似同步编程）
doFirstStep(function (result1) {
  doSecondStep(result1, function (result2) {
    doThirdStep(result2, function (result3) {
      // 多层嵌套导致代码像金字塔一样向右缩进
      doFinalStep(result3, function (finalResult) {
        console.log(finalResult);
      });
    });
  });
});
```

**类比**：你要等朋友 A 到地铁站，再一起等朋友 B，再一起等朋友 C，最后才能出发，所有事情必须按顺序同步等待。

##### 2. Promise 的链式调用：更清晰的异步流程

```javascript
doFirstStep()
  .then(result1 => doSecondStep(result1))
  .then(result2 => doThirdStep(result2))
  .then(result3 => doFinalStep(result3))
  .then(finalResult => console.log(finalResult))
  .catch(error => console.error(error));
```

**类比**：你给朋友 A、B、C 分别发消息 "到了就告诉我"，然后你可以先做其他事（比如刷手机），每个人到了都会主动通知你，不需要一直等着。

#### 四、Promise 在实际开发中的应用场景

- **网络请求**：发送 API 请求后等待服务器响应
- **文件操作**：读取本地文件时处理异步读取
- **定时任务**：设定定时器后处理到期事件
- **异步计算**：处理需要长时间计算的任务

#### 五、总结：Promise 的核心价值

Promise 就像生活中的 "预约服务"：你不需要一直盯着事情是否完成，只需要提前约定好 "完成时怎么做" 和 "失败时怎么做"，然后可以去做其他事情。这种模式让异步编程更有序、更易维护，避免了 "死等" 或 "层层嵌套" 的问题。

---

## `async/await` 是什么？用生活例子通俗解释

#### 一、`async/await` 的核心概念（技术角度）

`async/await` 是基于 Promise 的异步编程语法糖，让异步代码看起来像同步代码一样直观。它的核心特点：

- `async` 标记异步函数，返回一个 Promise
- `await` 暂停异步函数的执行，等待 Promise 解决后继续
- 避免了 Promise 链式调用的冗余语法，使代码更简洁清晰

#### 二、生活中的 `async/await` 类比：早晨做早餐的过程

##### 1. 同步做早餐（传统编程）

```javascript
// 场景：你按顺序做早餐，必须等前一件事完成才能做下一件
console.log("开始做早餐");

// 煮鸡蛋（10分钟）
煮鸡蛋(); // 必须等鸡蛋煮好才能做下一步
console.log("鸡蛋煮好了");

// 烤面包（5分钟）
烤面包(); // 必须等面包烤好才能做下一步
console.log("面包烤好了");

// 冲咖啡（3分钟）
冲咖啡();
console.log("咖啡冲好了");

console.log("早餐完成，可以开吃了");
```

**类比**：你必须站在厨房，先等鸡蛋煮 10 分钟，再等面包烤 5 分钟，最后等咖啡冲 3 分钟，整个过程需要 18 分钟，期间不能做其他事。

##### 2. 异步做早餐（使用 `async/await`）

```python
async def 做早餐():
    print("开始做早餐")

    # 异步煮鸡蛋（10分钟）
    煮鸡蛋任务 = asyncio.create_task(煮鸡蛋())

    # 异步烤面包（5分钟）
    烤面包任务 = asyncio.create_task(烤面包())

    # 先去冲咖啡（3分钟），不需要等前两个任务
    await 冲咖啡()
    print("咖啡冲好了")

    # 等待鸡蛋煮好（此时鸡蛋可能已煮好或还在煮）
    await 煮鸡蛋任务
    print("鸡蛋煮好了")

    # 等待面包烤好
    await 烤面包任务
    print("面包烤好了")

    print("早餐完成，可以开吃了")

# 运行异步函数
asyncio.run(做早餐())
```

**类比**：

- 你同时启动 "煮鸡蛋" 和 "烤面包" 两个任务（相当于异步任务）
- 然后去 "冲咖啡"（`await 冲咖啡()`），3 分钟完成
- 此时 "烤面包" 可能已完成（5 分钟），"煮鸡蛋" 还在进行（剩余 7 分钟）
- 等你冲完咖啡，"烤面包" 任务已完成，直接获取结果，再等待 "煮鸡蛋" 完成
- 总耗时约 10 分钟（最长任务的时间），比同步方式节省 8 分钟

#### 三、`async/await` 与 Promise 的关系：咖啡师的工作流程

##### 1. Promise 版本（链式调用）

```javascript
// 场景：咖啡师处理订单
function 处理订单(客户) {
  return 接收订单(客户)
    .then(订单 => 准备咖啡豆(订单))
    .then(咖啡豆 => 研磨咖啡豆(咖啡豆))
    .then(研磨好的咖啡豆 => 冲泡咖啡(研磨好的咖啡豆))
    .then(咖啡 => 添加配料(咖啡))
    .then(完成的咖啡 => 递给客户(完成的咖啡))
    .catch(错误 => 处理投诉(错误));
}
```

**类比**：咖啡师每完成一个步骤（如 "准备咖啡豆"），就告诉下一个步骤 "好了可以开始了"，形成一条长长的任务链。

##### 2. `async/await` 版本（更直观的异步）

```python
async def 处理订单(客户):
    try:
        订单 = await 接收订单(客户)
        咖啡豆 = await 准备咖啡豆(订单)
        研磨好的咖啡豆 = await 研磨咖啡豆(咖啡豆)
        咖啡 = await 冲泡咖啡(研磨好的咖啡豆)
        完成的咖啡 = await 添加配料(咖啡)
        return await 递给客户(完成的咖啡)
    except 异常 as e:
        await 处理投诉(e)
```

**类比**：咖啡师说 "等一下，我先接收订单"（`await 接收订单`），然后去做其他事，等订单来了再继续 "等一下，我去准备咖啡豆"，整个过程像同步说话一样自然，但实际是异步执行。

#### 四、`async/await` 的关键优势：图书馆借书流程

##### 1. 传统异步（Promise 链式调用）

```javascript
function 借书(书名) {
  return 查找书籍(书名)
    .then(书籍 => {
      if (书籍.可借阅) {
        return 办理借阅(书籍);
      } else {
        return 预约书籍(书籍)
          .then(预约号 => 等待通知(预约号))
          .then(() => 办理借阅(书籍));
      }
    })
    .then(借阅成功 => 发送借阅确认(借阅成功));
}
```

**类比**：你去图书馆借书，先查书是否在架，若在就借；若不在，就预约，等通知到了再借，最后确认。代码逻辑像 "如果… 就… 否则… 就…" 的嵌套。

##### 2. `async/await` 版本（更清晰的逻辑）

```python
async def 借书(书名):
    书籍 = await 查找书籍(书名)
    if 书籍.可借阅:
        借阅记录 = await 办理借阅(书籍)
    else:
        预约号 = await 预约书籍(书籍)
        await 等待通知(预约号)
        借阅记录 = await 办理借阅(书籍)
    await 发送借阅确认(借阅记录)
```

**类比**：你用自然语言描述流程："先查书，若可借就直接办；若不可借，就预约，等通知到了再办，最后确认"。代码和逻辑顺序完全一致，没有冗余的链式调用。

#### 五、`async/await` 的使用场景

- **多任务并行处理**：如同时下载多个文件，等待所有下载完成
- **复杂异步流程**：如电商下单时，同时验证库存、扣减余额、发送通知
- **错误处理优化**：用 `try/catch` 统一处理异步任务的异常，比 Promise 的 `catch` 更直观

#### 六、总结：`async/await` 的核心价值

`async/await` 就像一个 "时间管理大师"：它让你用同步的语法写出异步的逻辑，就像你一边煮鸡蛋、一边烤面包、一边冲咖啡，合理利用时间碎片，同时保持思路的清晰。这种模式避免了 "死等" 某个任务的浪费，也避免了异步回调的逻辑混乱，让异步编程变得像写日记一样自然流畅。
